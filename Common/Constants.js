// Required fields for Reporter Registration

exports.REGISTRATION_REQUIRED_FIELDS = [
  "name",
  "email",
];

// User Login Required Fields

exports.USER_LOGIN_REQUIRED_FIELDS = ["email", "role"]


// Login Required Fields

exports.LOGIN_REQUIRED_FIELDS = ["email", "password", "role"];

// Language Required Fields

exports.LANGUAGE_REQUIRED_FIELDS = ["languageName"];

// Post Category Required Fields

exports.POST_CATEGORY_REQUIRED_FIELDS = ["postCategoryName"];

// Post Required Fields

exports.POST_REQUIRED_FIELDS = [
  "postCategory",
  "postReportedDetails",
  "postLanguage",
  "postTitle",
  "postDescription",
  "postedOn",
  "postLocationDetails",
];

// Daily Quote Required Fields

exports.DAILY_QUOTE_REQUIRED_FIELDS = ["dailyQuoteReportedDetails","dailyQuoteLanguage"];

// Short Category Required Fields

exports.SHORT_CATEGORY_REQUIRED_FIELDS = ["shortCategoryName"];

// Short Required Fields

exports.SHORT_REQUIRED_FIELDS = [
  "shortCategory",
  "shortReportedDetails",
  "shortPostedOn",
  "shortLanguage"
];

// Novel Category Required Fields

exports.NOVEL_CATEGORY_REQUIRED_FIELDS = ["novelCategoryName"];

// Novel  Required Fields

exports.NOVEL_REQUIRED_FIELDS = ["startDateTime", "novelCategory", "title","novelLanguage"];

// Job Required Fields

exports.JOB_REQUIRED_FIELDS = [
  "jobTitle",
  "description",
  "hyperlink",
  "expiryDate",
  "role",
  "industryType",
  "department",
  "education",
];

// Ads Required Fields

exports.Ads_REQUIRED_FIELDS = ["adsTitle", "startDateTime", "expiryDateTime"];

// Magazine Required Fields

exports.MAGAZINE_REQUIRED_FIELDS = ["name", "startDate", "expiryDate","magazineLanguage"];

// Dos and Dont's Required Fields

exports.DOS_AND_DONOTS_REQUIRED_FIELDS = ["title", "points"];

// Reporter Tickets Required Fields

exports.TICKETS_REQUIRED_FIELDS = ["roleID", "description"];

// User Activity Required Fields

exports.USER_ACTIVITY_REQUIRED_FIELDS = [
  "contentID",
  "userId",
  "contentType",
  "action",
];

// Bookmark Required Fields

exports.BOOKMARK_REQUIRED_FIELDS = ["contentID", "userId", "contentType"];

// Content Comments Required Fields

exports.CONTENT_COMMENT_REQUIRED_FIELDS = [
  "userID",
  "contentID",
  "contentType",
  "comment",
];

// translate Required Fields

exports.TRANSLATE_REQUIRED_FIELDS = [
  "name", "data"
];
// Content Replies Required Fields

exports.CONTENT_COMMENT_REPLIES_REQUIRED_FIELDS = ["userID", "comment"];



// category Required Fields

exports.CATEGORY_REQUIRED_FIELDS = ["categoryName"]


// Change Password Required Fields

exports.CHANGE_PASSWORD_REQUIRED_FIELDS = [
  "otp",
  "newPassword",
  "confirmNewPassword",
];

// Location Required Fields
exports.DEPARTMENT_REQUIRED_FIELDS = [
  "locationName",
]
// Error messages

exports.ERROR_MESSAGES = {
  MOBILE_NUMBER_EXISTS: "Mobile Number already exists.",
  EMAIL_EXISTS: "Email already exists.",
  LOGIN_CREDENTIALS_CHECK: "Mobile Number, and Password are required.",
  INVALID_PASSWORD: "Incorrect Password, please check.",
  INVALID_EMAIL_NUMBER: "Email doesn't exists",
  INVALID_EMAIL: "Email doesn't exists",
  LOGIN_FAILED: "Failed to login with these credentials",
  LOGOUT_FAILED: "Failed to logout",
  ACTIVE_LOGIN_CHECK:
    "Only Activated Login are able to login. check your access details",
  ID_NOT_FOUND: "ID is required in params and must be a 24 characters HEX Code",
  APPROVED_LOGIN_CHECK: (role) =>
    `Only Approved ${role} are able to login. check your access details`,
  REGISTRATION_FAILED: (role) => `${role} registration failed`,
  CREATION_FAILED: (role) => `${role} creation failed`,
  ROLE_NOT_FOUND: (role) =>
    `Only ${role} has access, check you role permissions`,
  FETCH_FAILED: (role) => `Failed to fetch ${role}`,
  ID_NOT_FOUND: (role) =>
    `${role} ID is required in params and must be a 24 characters HEX Code`,
  CHANGE_PASSWORD_MATCH:
    "New Password and Confirm New Password does not match, please check.",
  CHANGE_PASSWORD_FAILED: "Failed to change password, please check.",
  OTP_PASSWORD_FAILED: "Incorrect otp, please check.",
  INVALID_APPROVAL_STATUS:
    "Invalid Status value. Only 'true' or 'false' are allowed",
  INVALID_STATUS:
    "Invalid Status value. Only 'Active' or 'Inactive' are allowed",
  INVALID_REPORTER_STATUS:
    "Invalid Status value. Only 'Active' or 'Inactive' or 'Trash' are allowed",
  INVALID_POST_STATUS:
    "Invalid Status value. Only 'Pending' or 'Rejected' or 'Published' are allowed",
  INVALID_SHORT_STATUS:
    "Invalid Status value. Only 'Pending' or 'Rejected' or 'Published' are allowed",
  INVALID_TICKET_STATUS:
    "Invalid Status value. Only 'inProgress' or 'resolved' or 'underReview' are allowed",
  INVALID_MEDIA_TYPE:
    "Invalid Media Type value. Only 'image' or 'video' are allowed",
  CREATE_FAILED: "Failed to Create",
  UPDATE_FAILED: (role) => `Failed to update ${role} details.`,
  STATUS_UPDATE_FAILED: (name) => `Failed to update status for ${name}`,
  FILE_UPLOAD_FAILED: (name) => `Failed to upload ${name} file`,
  NOTIFICATION_FAILED: (name) => `Failed to send ${name} notification`,
  NOT_FOUND: (name) => `${name} details not found.`,
  ALREADY_EXISTS: (name) => `${name} already exists.`,
  FILE_DELETE_FAILED: (name) => `Failed to delete old ${name} file`,
  DELETE_FAILED: "Failed to delete expenditure.",
  INVALID_ACTION_STATUS:
    "Invalid Status value. Only 'like' or 'download' or 'share' or 'dislike' or 'comments or 'read' are allowed",
  INVALID_CONTENT_TYPE:
    "Invalid Content Type. Only 'Post' or 'Short' or 'Quote' or 'Novel' or 'Job' are allowed",
  INVALID_BOOKMARK_CONTENT_TYPE:
    "Invalid Content Type. Only 'Post' or 'Quote' are allowed",
  FILE_NOT_FOUND: "No file uploaded. Please upload an XLSX file",
  INVALID_USER_ROLE_STATUS: "Invalid role value. Only 'User', 'GuestReporter  are allowed",
  INVALID_REPORTER_ROLE_STATUS: "Invalid role value. Only 'SuperAdmin', 'Manager','Employee'  are allowed",
  REST_PASSWORD_FAILED: "Failed to create rest password",
  RESET_PASSWORD_FAILED: "Failed to reset password, please check.",
  OTP_ALREADY_USED: "OTP has already been used",
  PASSWORD_EXPIRED: "The OTP has expired. Please request a new one.",
  INVALID_USER_STATUS: "User not Active. Please Contact Admin",
}


// Response messages

exports.RESPONSE_MESSAGES = {
  REGISTRATION_SUCCESS: (name) => `${name} created successfully.`,
  LOGIN_SUCCESS: "Login Successful",
  LOGOUT_SUCCESS: "Logout Successful",
  CREATION_SUCCESS: (name) => `${name} created successfully`,
  REMOVED_SUCCESS: (name) => `${name} removed successfully`,
  FETCH_SUCCESS: (name) => `${name} details fetched successfully`,
  FETCH_NOT_FOUND: (name) => `${name} details not found`,
  UPDATE_SUCCESS: (name) => `${name} details updated successfully.`,
  STATUS_UPDATED_SUCCESS: (name) => `${name} status updated successfully`,
  CHANGE_PASSWORD_SUCCESS: (name) => `${name} password changed successfully`,
  FILE_UPLOAD_SUCCESS: (name) => `${name} file uploaded successfully`,
  NOTIFICATION_SUCCESS: (name) => `${name} notification sent`,
  DELETE_SUCCESS: (name) => `${name} successfully.`,
  NO_CHANGES_FOUND: "No changes were made. The data is already up to date",
  REST_PASSWORD_SUCCESS: "Password reset link sent to your email",
  RESET_PASSWORD_SUCCESS: "Successfully password Created",
};
