const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    postID: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      unique: true,
    },
    postName: { type: String, required: true },
    postStatus: {
      type: String,
      enum: ["Pending", "Rejected", "Published"],
      default: "Pending",
    },
  },
  {
    collection: "Posts",
    timestamps: true,
    versionKey: false,
  }
);

// Single-field indexes
postSchema.index({ postStatus: 1 });
postSchema.index({ postCategory: 1 });
postSchema.index({ postReportedDetails: 1 });

// Compound index
postSchema.index({
  postID: 1,
  postStatus: 1,
  postCategory: 1,
  postReportedDetails: 1,
});
postSchema.index({
  postLocationDetails: 1,
  postStatus: 1,
  postedOn: -1,
  _id: -1,
});
postSchema.index({ postStatus: 1, postedOn: 1 });
postSchema.index({ postStatus: 1, postedOn: -1, _id: -1 });
postSchema.index({
  postCategory: 1,
  postStatus: 1,
  postedOn: 1,
  postLanguage: 1,
  postLocationDetails: 1,
  postImageURL: 1,
});
postSchema.index({
  postCategory: 1,
  postStatus: 1,
  postedOn: 1,
  postLanguage: 1,
  postLocationDetails: 1,
  postImageURL: 1,
  postTitle: 1,
});

const postModel = mongoose.model("Posts", postSchema);

module.exports = postModel;
