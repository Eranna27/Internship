const mongoose = require("mongoose");

const postCategorySchema = new mongoose.Schema(
  {
    postCategoryID: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      unique: true,
    },
    postCategoryName: { type: String, required: true },
    postCategoryImageURL: { type: String, default: "" },
    postCategoryStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    collection: "PostCategories",
    timestamps: true,
    versionKey: false,
  }
);

postCategorySchema.index({ postCategoryID: 1, postCategoryStatus: 1 });

const postCategoryModel = mongoose.model("PostCategories", postCategorySchema);

module.exports = postCategoryModel;
