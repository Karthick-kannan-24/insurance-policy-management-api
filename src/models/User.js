import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    dob: {
      type: Date,
    },

    address: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    zipCode: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    gender: {
      type: String,
      trim: true,
    },

    userType: {
      type: String,
      trim: true,
    },

    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = mongoose.model("User", userSchema);