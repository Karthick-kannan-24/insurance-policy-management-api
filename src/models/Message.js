import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "sent", "failed"],
      default: "scheduled",
      index: true,
    },

    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Message = mongoose.model(
  "Message",
  messageSchema
);