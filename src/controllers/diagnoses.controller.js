import * as diagnosesService from "../services/diagnoses.service.js";

export async function getDiagnoses(req, res, next) {
  try {
    const diagnoses = await diagnosesService.getDiagnoses(req.user);
    res.json({ data: diagnoses });
  } catch (error) {
    next(error);
  }
}

export async function getDiagnosisById(req, res, next) {
  try {
    const diagnosis = await diagnosesService.getDiagnosisById(
      req.params.id,
      req.user
    );

    if (!diagnosis) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }

    res.json({ data: diagnosis });
  } catch (error) {
    next(error);
  }
}

export async function createDiagnosis(req, res, next) {
  try {
    const diagnosis = await diagnosesService.createDiagnosis(req.body, req.user);
    res.status(201).json({ data: diagnosis });
  } catch (error) {
    next(error);
  }
}

export async function updateDiagnosis(req, res, next) {
  try {
    const diagnosis = await diagnosesService.updateDiagnosis(
      req.params.id,
      req.body,
      req.user
    );

    if (!diagnosis) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }

    res.json({ data: diagnosis });
  } catch (error) {
    next(error);
  }
}

export async function deleteDiagnosis(req, res, next) {
  try {
    const diagnosis = await diagnosesService.deleteDiagnosis(
      req.params.id,
      req.user
    );

    if (!diagnosis) {
      return res.status(404).json({ message: "Diagnosis not found" });
    }

    res.json({ data: diagnosis });
  } catch (error) {
    next(error);
  }
}

