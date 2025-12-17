const Session = require("../models/session.model");

const sessionMiddleware = async (req, res, next) => {
  const token = req.cookies.authToken || req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No session token provided",
    });
  }

  try {
    const session = await Session.findOne({ token }).populate("userId");

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid session",
      });
    }
    req.session = session.userId;
    next();
  } catch (err) {
    console.error("Session validation failed", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while validating session",
    });
  }
};

module.exports = sessionMiddleware;