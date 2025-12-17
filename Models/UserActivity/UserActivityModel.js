const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      enum: ["Post", "Short", "Quote", "Novel", "Job"],
      required: true,
    },
    contentID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    likes: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    reads: { type: Number, default: 0 },
    users: [
      {
        userId: { type: String, required: true },
        actions: {
          like: { type: Boolean, default: false },
          dislike: { type: Boolean, default: false },
          share: { type: Boolean, default: false },
          download: { type: Boolean, default: false },
          read: { type: Boolean, default: false },
          isBookmarked: { type: Boolean, default: false },
        },
      },
    ],
  },
  {
    collection: "UserActivity",
    timestamps: true,
    versionKey: false,
  }
);

// Single-field indexes
userActivitySchema.index({ contentType: 1 });
userActivitySchema.index({ users: 1 });

// Compound index
userActivitySchema.index({ contentID: 1, "users.userId": 1 });
userActivitySchema.index({ contentID: 1, contentType: 1 });
userActivitySchema.index({
  contentID: 1,
  contentType: 1,
  users: 1,
});

module.exports = mongoose.model("UserActivity", userActivitySchema);
