import * as doctorsService from "../services/doctors.service.js";

export async function getDoctors(req, res, next) {
  try {
    const doctors = await doctorsService.getDoctors(req.user);
    res.json({ data: doctors });
  } catch (error) {
    next(error);
  }
}

export async function getDoctorById(req, res, next) {
  try {
    const doctor = await doctorsService.getDoctorById(req.params.id, req.user);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ data: doctor });
  } catch (error) {
    next(error);
  }
}

export async function updateDoctor(req, res, next) {
  try {
    const doctor = await doctorsService.updateDoctor(
      req.params.id,
      req.body,
      req.user
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ data: doctor });
  } catch (error) {
    next(error);
  }
}

export async function deleteDoctor(req, res, next) {
  try {
    const doctor = await doctorsService.deleteDoctor(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ data: doctor });
  } catch (error) {
    next(error);
  }
}

