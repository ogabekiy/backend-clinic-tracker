import { getConfig } from "../config/config.service.js";
import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  database: getConfig("DATABASE_NAME"),
  user: getConfig("DATABASE_USER"),
  password: getConfig("DATABASE_PASSWORD"),
  host: getConfig("DATABASE_HOST"),
  port: Number(getConfig("DATABASE_PORT")),
});

export async function connectToDb() {
  try {
    await pool.query("SELECT 1");
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
    throw error;
  }
}

export async function setUpModels() {
  try {
    // =========================
    // ENUM TYPES
    // =========================

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'staff');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE doctor_availability AS ENUM ('available', 'busy', 'offline');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE diagnosis_severity AS ENUM ('low', 'medium', 'high', 'critical');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // =========================
    // USERS
    // =========================

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        role user_role NOT NULL,
        password_hash TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true
      );
    `);

    // =========================
    // DEPARTMENTS
    // =========================

    await pool.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT
      );
    `);

    // =========================
    // DOCTORS
    // =========================

    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT UNIQUE NOT NULL,
        specialization VARCHAR(255) NOT NULL,
        department_id BIGINT,
        room_number VARCHAR(50),
        availability doctor_availability DEFAULT 'available',

        CONSTRAINT fk_doctor_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_doctor_department
          FOREIGN KEY (department_id)
          REFERENCES departments(id)
          ON DELETE SET NULL
      );
    `);

    // =========================
    // PATIENTS
    // =========================

    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id BIGSERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        date_of_birth DATE NOT NULL,
        gender gender_type NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(255),
        address TEXT,
        blood_type VARCHAR(10),
        assigned_doctor_id BIGINT,

        CONSTRAINT fk_assigned_doctor
          FOREIGN KEY (assigned_doctor_id)
          REFERENCES doctors(id)
          ON DELETE SET NULL
      );
    `);

    // =========================
    // MEDICAL DOCUMENTS
    // =========================

    await pool.query(`
      CREATE TABLE IF NOT EXISTS medical_documents (
        id BIGSERIAL PRIMARY KEY,
        patient_id BIGINT NOT NULL,
        upload_by BIGINT NOT NULL,
        files JSONB,
        description TEXT,

        CONSTRAINT fk_document_patient
          FOREIGN KEY (patient_id)
          REFERENCES patients(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_document_user
          FOREIGN KEY (upload_by)
          REFERENCES users(id)
          ON DELETE CASCADE
      );
    `);

    // =========================
    // DIAGNOSES
    // =========================

    await pool.query(`
      CREATE TABLE IF NOT EXISTS diagnoses (
        id BIGSERIAL PRIMARY KEY,
        patient_id BIGINT NOT NULL,
        icd_code VARCHAR(100),
        description TEXT,
        severity diagnosis_severity DEFAULT 'low',
        notes TEXT,
        doctor_id BIGINT NOT NULL,

        CONSTRAINT fk_diagnosis_patient
          FOREIGN KEY (patient_id)
          REFERENCES patients(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_diagnosis_doctor
          FOREIGN KEY (doctor_id)
          REFERENCES doctors(id)
          ON DELETE CASCADE
      );
    `);

    await pool.query(`
      ALTER TABLE diagnoses
      DROP CONSTRAINT IF EXISTS fk_diagnosis_document;
    `);

    await pool.query(`
      ALTER TABLE diagnoses
      DROP COLUMN IF EXISTS document_files;
    `);

    // =========================
    // AUDIT LOGS
    // =========================

    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT,
        action VARCHAR(255) NOT NULL,
        entity_type VARCHAR(255),
        entity_id BIGINT,
        old_values JSONB,
        new_values JSONB,

        CONSTRAINT fk_audit_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE SET NULL
      );
    `);

    // =========================
    // TIMESTAMPS
    // =========================

    const tables = [
      "users",
      "departments",
      "doctors",
      "patients",
      "medical_documents",
      "diagnoses",
      "audit_logs",
    ];

    for (const table of tables) {
      // created_at
      await pool.query(`
        ALTER TABLE ${table}
        ADD COLUMN IF NOT EXISTS created_at
        TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      `);

      // updated_at
      await pool.query(`
        ALTER TABLE ${table}
        ADD COLUMN IF NOT EXISTS updated_at
        TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      `);
    }

    // =========================
    // UPDATED_AT FUNCTION
    // =========================

    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // =========================
    // TRIGGERS
    // =========================

    for (const table of tables) {
      await pool.query(`
        DROP TRIGGER IF EXISTS update_${table}_updated_at
        ON ${table};
      `);

      await pool.query(`
        CREATE TRIGGER update_${table}_updated_at
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `);
    }

    console.log("All models initialized successfully");
  } catch (error) {
    console.error("Error setting up models", error);
  }
}

export async function initDatabase() {
  await connectToDb();
  await setUpModels();
}