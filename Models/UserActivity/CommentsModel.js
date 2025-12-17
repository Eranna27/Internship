const taskCommentSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tasks",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles",
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },
  },
  {
    collection: "TaskComments",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("TaskComments", taskCommentSchema);
