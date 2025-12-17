const roleModel = require("../../Models/AuthModel");
const Session = require("../../Models/sessionModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  LOGIN_REQUIRED_FIELDS,
  ERROR_MESSAGES,
  RESPONSE_MESSAGES,
} = require("../../Common/Constants");
const { getMissingFields, isValidReporterLoginRoleStatus } = require("../../Common/Validators");
const {
  sendErrorResponse,
  sendSuccessResponse,
  sendLoginSuccessResponse,
  sendLogoutSuccessResponse,
  sendCreateSuccessResponse,
} = require("../../Common/Responses");
const STATUS = require("../../Common/StatusCodes");

// Login

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  const missingFields = getMissingFields(req.body, LOGIN_REQUIRED_FIELDS);

  if (missingFields.length > 0) {
    return sendErrorResponse(
      res,
      STATUS.UNPROCESSABLE_ENTITY,
      `The following fields are required: ${missingFields.join(", ")}`
    );
  }

  if (!isValidReporterLoginRoleStatus(role)) {
    return sendErrorResponse(
      res,
      STATUS.UNPROCESSABLE_ENTITY,
      ERROR_MESSAGES.INVALID_REPORTER_ROLE_STATUS
    );
  }

  try {
    const validateUser = await roleModel.findOne({ email, role });

    if (validateUser) {
      const isMatch = await bcrypt.compare(password, validateUser.password);

      if (!isMatch) {
        return sendErrorResponse(
          res,
          STATUS.OK,
          ERROR_MESSAGES.INVALID_PASSWORD
        );
      }

      if (validateUser.status !== "Active") {
        return sendErrorResponse(
          res,
          STATUS.UNPROCESSABLE_ENTITY,
          ERROR_MESSAGES.ACTIVE_LOGIN_CHECK
        );
      }

      // Generate Tokens
      const token = await validateUser.generateAuthToken();
      const refreshToken = jwt.sign(
        { _id: validateUser._id, role: validateUser.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      // Store the session in the database

      await Session.create({
        userId: validateUser._id,
        token: token,
        refreshToken: refreshToken,
      });

      const details = {
        roleID: validateUser.roleID,
        name: validateUser.name,
        email: validateUser.email,
        role: validateUser.role,
      };

      return sendLoginSuccessResponse(
        res,
        STATUS.OK,
        RESPONSE_MESSAGES.LOGIN_SUCCESS,
        details,
        { token, refreshToken }
      );
    } else {
      return sendErrorResponse(
        res,
        STATUS.OK,
        ERROR_MESSAGES.INVALID_EMAIL_NUMBER
      );
    }
  } catch (error) {
    console.error(error);
    return sendErrorResponse(
      res,
      STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.LOGIN_FAILED
    );
  }
};

// refreshToken

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Refresh token not provided",
    });
  }

  try {
    const session = await Session.findOne({ refreshToken }).populate("userId");

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid refresh token",
      });
    }

    // Validate refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Invalid refresh token",
      });
    }

    // Generate new access token
    const newToken = jwt.sign(
      { _id: session.userId._id, role: session.userId.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Update session with new access token
    session.token = newToken;
    await session.save();

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      token: newToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Logout

exports.logout = async (req, res) => {
  const { roleID } = req.params;

  if (roleID.length !== 24) {
    return sendErrorResponse(
      res,
      STATUS.UNPROCESSABLE_ENTITY,
      ERROR_MESSAGES.ID_NOT_FOUND("Role")
    );
  }

  try {
    const user = await roleModel.findOne({ roleID });

    if (!user) {
      return sendSuccessResponse(
        res,
        STATUS.OK,
        RESPONSE_MESSAGES.FETCH_NOT_FOUND("User")
      );
    }

    await Session.deleteOne({ userId: user._id });

    return sendLogoutSuccessResponse(
      res,
      STATUS.OK,
      RESPONSE_MESSAGES.LOGOUT_SUCCESS
    );
  } catch (error) {
    console.error(error);
    return sendErrorResponse(
      res,
      STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.LOGOUT_FAILED
    );
  }
};


