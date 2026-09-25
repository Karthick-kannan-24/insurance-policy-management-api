import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    accountName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

accountSchema.index(
  { accountName: 1, userId: 1 },
  { unique: true }
);

export const Account = mongoose.model("Account", accountSchema);