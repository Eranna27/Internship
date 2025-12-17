const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    taskID: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Departments",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles", // Employee
      required: true,
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles", // Manager/Admin
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "InProgress", "Completed", "Blocked"],
      default: "Pending",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    dueDate: {
      type: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "Tasks",
    timestamps: true,
    versionKey: false,
  }
);

taskSchema.index({ assignedTo: 1, department: 1, status: 1 });

const taskModel = mongoose.model("Tasks", taskSchema);
module.exports = taskModel;
