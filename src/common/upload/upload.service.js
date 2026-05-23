import multer from "multer";
import path from "path";

const uploadFolder = "uploads";

const storage = multer.diskStorage({
  destination: uploadFolder,
  filename(req, file, callback) {
    const extension = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const fileName = `${Date.now()}-${baseName || "file"}${extension}`;

    callback(null, fileName);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

