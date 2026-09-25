import mongoose from "mongoose";

const carrierSchema = new mongoose.Schema(
  {
    companyName: {
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

export const Carrier = mongoose.model("Carrier", carrierSchema);