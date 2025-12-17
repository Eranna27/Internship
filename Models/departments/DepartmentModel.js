const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    departmentID: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      unique: true,
    },
    departmentName: {
      type: String,
      required: true,
      trim: true,
    },
    departmentStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    collection: "departments",
    timestamps: true,
    versionKey: false,
  }
);

departmentSchema.index({ departmentID: 1, departmentStatus: 1 });

const departmentModel = mongoose.model("departments", departmentSchema);

module.exports = departmentModel;
