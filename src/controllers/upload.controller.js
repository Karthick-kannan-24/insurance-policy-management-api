import { Worker } from "worker_threads";
import path from "path";
import fs from "fs/promises";

const removeUploadedFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`Uploaded file removed: ${filePath}`);
  } catch (error) {
    console.error(
      `Failed to remove uploaded file: ${filePath}`,
      error.message
    );
  }
};

export const uploadPolicyFile = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "File is required",
    });
  }

  const filePath = req.file.path;

  try {
    const workerPath = path.resolve(
      "src/workers/import.worker.js"
    );

    const worker = new Worker(workerPath, {
      workerData: {
        filePath,
      },
    });

    worker.once("message", async (result) => {
      await removeUploadedFile(filePath);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    });

    worker.once("error", async (error) => {
      await removeUploadedFile(filePath);
      next(error);
    });

    worker.once("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker exited with code: ${code}`);
      }
    });
  } catch (error) {
    await removeUploadedFile(filePath);
    next(error);
  }
};