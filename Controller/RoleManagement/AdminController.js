const roleModel = require("../../Models/AuthModel");
const {
  ERROR_MESSAGES,
  RESPONSE_MESSAGES,
  REGISTRATION_REQUIRED_FIELDS,
  CHANGE_PASSWORD_REQUIRED_FIELDS,
} = require("../../Common/Constants");
const {
  getMissingFields,
  isValidApprovalStatus,
  isValidReporterStatus,
  isValidReporterTicketStatus,
} = require("../../Common/Validators");
const {
  sendErrorResponse,
  sendSuccessResponse,
  sendCreateSuccessResponse,
} = require("../../Common/Responses");
const STATUS = require("../../Common/StatusCodes");
const { generatePassword, generateOtp } = require("../../Utils/PasswordGenerator");
const {
  sendReporterEmailTemplate, sendMail
} = require("../../Services/EmailIntegration");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");


exports.addRole = async (req, res) => {
  const { name, email, role } = req.body;
  const missingFields = getMissingFields(req.body, REGISTRATION_REQUIRED_FIELDS);
  if (missingFields.length > 0) {
    return sendErrorResponse(
      res,
      STATUS.UNPROCESSABLE_ENTITY,
      `The following fields are required: ${missingFields.join(", ")}`
    );
  }

  try {
    const existingEmail = await roleModel.findOne({
      email,
      role: { $in: ["Manager", "Employee"] },
    });

    if (existingEmail) {
      return sendErrorResponse(
        res,
        STATUS.BAD_REQUEST,
        ERROR_MESSAGES.EMAIL_EXISTS
      );
    }


    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 12);
    const newRole = new roleModel({
      name,
      email,
      role,
      password: hashedPassword,
    });



    let emailResponse = null;
    const rolesWithEmail = ["SuperAdmin", "Manager", "Employee"];

    if (rolesWithEmail.includes(role)) {
      emailResponse = await sendReporterEmailTemplate(newRole, password);
      if (!emailResponse.success) {
        console.error(`[addRole] Email sending failed:`, emailResponse.message);
        return sendErrorResponse(
          res,
          STATUS.INTERNAL_SERVER_ERROR,
          "Failed to send registration email"
        );
      }
    }

    await newRole.save();

    const responseData = {
      roleID: newRole.roleID,
    };
    return sendCreateSuccessResponse(
      res,
      STATUS.CREATED,
      RESPONSE_MESSAGES.REGISTRATION_SUCCESS(name),
      responseData
    );
  } catch (error) {
    // Log error to the console for debugging
    console.error("Error Registering Role:", error);

    // Return an error response to the client
    return sendErrorResponse(
      res,
      STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.REGISTRATION_FAILED(name)
    );
  }
};

// Admins

exports.adminsGet = async (req, res) => {
  try {
    const adminsData = await roleModel
      .find({ role: "Admin" })
      .select("-password -isApproved -fcmToken")
      .sort({ createdAt: -1 })
      .lean();

    if (adminsData.length === 0) {
      return sendSuccessResponse(
        res,
        STATUS.OK,
        RESPONSE_MESSAGES.FETCH_NOT_FOUND("Admins"),
        adminsData,
        "admins"
      );
    }

    return sendSuccessResponse(
      res,
      STATUS.OK,
      RESPONSE_MESSAGES.FETCH_SUCCESS("Admins"),
      adminsData,
      "admins"
    );
  } catch (error) {
    console.error("Failed to fetch admins: ", error);
    return sendErrorResponse(
      res,
      STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.FETCH_FAILED("admins")
    );
  }
};

// Single Admin By Role ID

exports.singleAdminID = async (req, res) => {
  const { roleID } = req.params;

  if (roleID.length !== 24) {
    return sendErrorResponse(
      res,
      STATUS.UNPROCESSABLE_ENTITY,
      ERROR_MESSAGES.ID_NOT_FOUND("User")
    );
  }

  try {
    const adminData = await roleModel
      .findOne({ roleID })
      .select("-password -isApproved -fcmToken");

    if (adminData.role !== "Admin") {
      return sendErrorResponse(
        res,
        STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.ROLE_NOT_FOUND("Admin")
      );
    }

    adminData.profilePic = await getImageData(adminData.profilePic);

    return sendSuccessResponse(
      res,
      STATUS.OK,
      RESPONSE_MESSAGES.FETCH_SUCCESS("Admin"),
      adminData,
      "admin"
    );
  } catch (error) {
    console.error("Failed to fetch admin details: ", error);
    return sendErrorResponse(
      res,
      STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.FETCH_FAILED("Admin")
    );
  }
};


// forgot Password  

exports.forgotPassword = async (req, res) => {
  const { email, role } = req.body;
  try {
    const existingUser = await roleModel.findOne({ email, role });

    if (!existingUser) {
      return sendErrorResponse(
        res,
        STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND(email)
      );
    }

    if (existingUser.status !== "Active") {
      return sendErrorResponse(
        res,
        STATUS.UNPROCESSABLE_ENTITY,
        ERROR_MESSAGES.INVALID_USER_STATUS
      );
    }

    if (existingUser.emailResetStatus && existingUser.passwordResetExpires) {
      const currentTime = new Date();
      if (currentTime < existingUser.passwordResetExpires) {
        const remainingSeconds = Math.ceil(
          (existingUser.passwordResetExpires - currentTime) / 1000
        );
        return sendErrorResponse(
          res,
          STATUS.BAD_REQUEST,
          `OTP already sent. Please wait ${remainingSeconds} seconds before requesting again.`
        );
      }
    }

    const otp = generateOtp();
    const expirationTime = new Date(Date.now() + 10 * 1000);
    existingUser.passwordResetExpires = expirationTime;
    existingUser.emailResetStatus = true;
    existingUser.otp = otp;
    await existingUser.save();

    const receiverTemplatePath = path.join(
      __dirname,
      "../../Templates/EmailOtp.html"
    );
    let receiverTemplate = fs.readFileSync(receiverTemplatePath, "utf-8");
    receiverTemplate = receiverTemplate
      .replace('{{otp}}', otp)
    const mailResponse = await sendMail({
      to: email,
      subject: "Password Reset",
      html: receiverTemplate,
    });

    if (!mailResponse.success) {
      return sendErrorResponse(
        res,
        STATUS.INTERNAL_SERVER_ERROR,
        "Failed to send OTP email"
      );
    }

    return sendSuccessResponse(res, STATUS.OK, {
      roleID: existingUser.roleID,
      message: RESPONSE_MESSAGES.REST_PASSWORD_SUCCESS,
      otpSent: true,
      otpExpiresIn: "5 minutes",
    });

  } catch (error) {
    console.error(error);
    return sendErrorResponse(
      res,
      STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.REST_PASSWORD_FAILED
    );
  }
};

// Change Password by roleId

exports.changePassword = async (req, res) => {
  const { roleID } = req.params;
  const { otp, newPassword, confirmNewPassword } = req.body;

  if (roleID.length !== 24) {
    return sendErrorResponse(
      res,
      STATUS.UNPROCESSABLE_ENTITY,
      ERROR_MESSAGES.ID_NOT_FOUND
    );
  }

  const missingFields = getMissingFields(
    req.body,
    CHANGE_PASSWORD_REQUIRED_FIELDS
  );

  if (missingFields.length > 0) {
    return sendErrorResponse(
      res,
      STATUS.UNPROCESSABLE_ENTITY,
      `The following fields are required: ${missingFields.join(", ")}`
    );
  }

  if (newPassword !== confirmNewPassword) {
    return sendErrorResponse(
      res,
      STATUS.UNPROCESSABLE_ENTITY,
      ERROR_MESSAGES.CHANGE_PASSWORD_MATCH
    );
  }

  try {
    const existingUser = await roleModel.findOne({ roleID });

    const fullName = existingUser.name

    if (!existingUser) {
      return sendErrorResponse(
        res,
        STATUS.NOT_FOUND,
        ERROR_MESSAGES.NOT_FOUND("user")
      );
    }

    if (String(existingUser.otp) !== String(otp)) {
      return sendErrorResponse(
        res,
        STATUS.UNPROCESSABLE_ENTITY,
        ERROR_MESSAGES.OTP_PASSWORD_FAILED
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    existingUser.password = hashedPassword;
    existingUser.otp = "";

    await existingUser.save();

    return sendSuccessResponse(
      res,
      STATUS.OK,
      RESPONSE_MESSAGES.CHANGE_PASSWORD_SUCCESS(fullName)
    );
  } catch (error) {
    console.error("Failed to change password: ", error);
    return sendErrorResponse(
      res,
      STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.CHANGE_PASSWORD_FAILED
    );
  }
};
