import mongoose from "mongoose";

const lobSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Lob = mongoose.model("Lob", lobSchema);