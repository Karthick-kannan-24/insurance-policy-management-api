import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    agentName: {
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

export const Agent = mongoose.model("Agent", agentSchema);