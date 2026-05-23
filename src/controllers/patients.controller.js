import * as patientsService from "../services/patients.service.js";

export async function getPatients(req, res, next) {
  try {
    const patients = await patientsService.getPatients(req.user);
    res.json({ data: patients });
  } catch (error) {
    next(error);
  }
}

export async function getPatientById(req, res, next) {
  try {
    const patient = await patientsService.getPatientById(req.params.id, req.user);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ data: patient });
  } catch (error) {
    next(error);
  }
}

export async function createPatient(req, res, next) {
  try {
    const patient = await patientsService.createPatient(req.body);
    res.status(201).json({ data: patient });
  } catch (error) {
    next(error);
  }
}

export async function updatePatient(req, res, next) {
  try {
    const patient = await patientsService.updatePatient(req.params.id, req.body);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ data: patient });
  } catch (error) {
    next(error);
  }
}

export async function deletePatient(req, res, next) {
  try {
    const patient = await patientsService.deletePatient(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ data: patient });
  } catch (error) {
    next(error);
  }
}

