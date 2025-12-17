const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const roleSchema = new mongoose.Schema(
  {
    roleID: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      unique: true,
    },
    name: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    departmentID: { type: String, default: "" },
    password: { type: String, default: "" },
    role: {
      type: String,
      enum: ["SuperAdmin", "Manager", "Employee"],
      default: "Employee",
    },
    token: { type: String, default: "" },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    profilePicPublicID: { type: String },
    passwordResetExpires: { type: Date, default: "" },
    emailResetStatus: { type: Boolean, default: false },
    otp: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    collection: "Roles",
    timestamps: true,
    versionKey: false,
  }
);

roleSchema.index({
  email: 1,
  role: 1,
});

// Token Generation Method

roleSchema.methods.generateAuthToken = async function () {
  const secretKey = process.env.SECRET_KEY;
  try {
    const token = jwt.sign(
      {
        _id: this._id,
        role: this.role,
      },
      secretKey
    );

    if (!token) {
      throw new Error("Token not Generated");
    }

    return `Bearer ${token}`;
  } catch (error) {
    console.error("Token Generation Error:", error);
    throw new Error("Token generation error");
  }
};

const roleModel = mongoose.model("Roles", roleSchema);

module.exports = roleModel;
