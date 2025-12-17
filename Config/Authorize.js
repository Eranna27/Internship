const roleUsers = require("../Models/AuthModel");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

// Token Verification

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized: Token Not Found" });
    }

    const decoded = jwt.verify(token, secretKey);

    const user = await roleUsers.findById(decoded._id);

    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized: User not found" });
    }
    if (!user.token || user.token.trim() === "") {
      return res
        .status(403)
        .json({ success: false, message: "Token is expired. Please login again" });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Invalid token",
        error,
      });
    } else {
      console.error("Error authenticating user:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
};

// Role Based Permissions

const authorizeRoles = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Insufficient role permissions",
    });
  }
  next();
};


const sessionAuth = (req, res, next) => {
  if (!req.session.user) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized: No Active Session" });
  }
  next();
};

module.exports = { authenticate, authorizeRoles, sessionAuth };
