import * as medicalDocumentsService from "../services/medical-documents.service.js";

function mapUploadedFiles(files = []) {
  return files.map((file) => ({
    original_name: file.originalname,
    file_name: file.filename,
    path: file.path,
    mime_type: file.mimetype,
    size: file.size,
  }));
}

export async function getMedicalDocuments(req, res, next) {
  try {
    const documents = await medicalDocumentsService.getMedicalDocuments(req.user);
    res.json({ data: documents });
  } catch (error) {
    next(error);
  }
}

export async function getMedicalDocumentById(req, res, next) {
  try {
    const document = await medicalDocumentsService.getMedicalDocumentById(
      req.params.id,
      req.user
    );

    if (!document) {
      return res.status(404).json({ message: "Medical document not found" });
    }

    res.json({ data: document });
  } catch (error) {
    next(error);
  }
}

export async function createMedicalDocument(req, res, next) {
  try {
    const document = await medicalDocumentsService.createMedicalDocument(
      {
        patient_id: req.body.patient_id,
        description: req.body.description,
        files: mapUploadedFiles(req.files),
      },
      req.user
    );

    res.status(201).json({ data: document });
  } catch (error) {
    next(error);
  }
}

export async function deleteMedicalDocument(req, res, next) {
  try {
    console.log("Deleting medical document with ID:", req.params.id);
    
    const document = await medicalDocumentsService.deleteMedicalDocument(
      req.params.id,
      req.user
    );

    if (!document) {
      return res.status(404).json({ message: "Medical document not found" });
    }

    res.json({ data: document });
  } catch (error) {
    next(error);
  }
}

