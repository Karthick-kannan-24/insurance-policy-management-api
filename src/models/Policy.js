import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    policyNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lob",
      required: true,
      index: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carrier",
      required: true,
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

policySchema.index({
  userId: 1,
  startDate: -1,
});

export const Policy = mongoose.model("Policy", policySchema);