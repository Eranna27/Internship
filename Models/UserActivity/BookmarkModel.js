const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      enum: ["Post", "Quote"],
      required: true,
    },
    contentID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userId: { type: String, required: true },
  },
  {
    collection: "Bookmarks",
    timestamps: true,
    versionKey: false,
  }
);

// Single-field indexes
bookmarkSchema.index({ contentType: 1 });
bookmarkSchema.index({ userId: 1 });

// Compound index
bookmarkSchema.index({ contentID: 1, userId: 1 });
bookmarkSchema.index({ contentID: 1, userId: 1, contentType: 1 });

module.exports = mongoose.model("Bookmarks", bookmarkSchema);
