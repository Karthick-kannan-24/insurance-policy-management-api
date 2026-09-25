import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination: "./uploads",

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `${uuid()}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [".csv", ".xlsx"];

  const extension = path.extname(file.originalname).toLowerCase();

  if (allowed.includes(extension)) {
    return cb(null, true);
  }

  cb(new Error("Only CSV or XLSX files are allowed"));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});