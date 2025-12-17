// Validated If Status is Either 'Active' or 'Inactive'

exports.isValidApprovalStatus = (status) => [true, false].includes(status);

// Validated If Status is Either 'Active' or 'Inactive'

exports.isValidStatus = (status) => ["Active", "Inactive"].includes(status);

// Validated If Status is Either 'Active' or 'Inactive' or 'Trash'

exports.isValidReporterStatus = (status) =>
  ["Active", "Inactive", "Trash"].includes(status);

// Validated If Status is Either 'Read' or 'NotRead'

exports.isValidNotificationStatus = (status) =>
  ["Read", "NotRead"].includes(status);

// ValidPost If Status is Either 'Pending' or 'Rejected'  or 'Published'

exports.isValidPostStatus = (status) =>
  ["Pending", "Rejected", "Published"].includes(status);

// ValidShort If Status is Either 'Pending' or 'Rejected'  or 'Published'

exports.isValidShortStatus = (status) =>
  ["Pending", "Rejected", "Published"].includes(status);

// ValidDailyQuotes If Status is Either 'image' or 'video'

exports.isValidDailyQuoteType = (status) => ["image", "video"].includes(status);

// validActions If Status is Either 'likes' or 'downloads' or 'shares' or 'dislikes' or 'comments'

exports.isValidActionStatus = (status) =>
  ["like", "download", "share", "dislike", "comments", "read"].includes(status);

// validActions If content is Either 'likes' or 'downloads' or 'shares' or 'dislikes' or 'comments'



// validActions If content is Either 'likes' or 'downloads' or 'shares' or 'dislikes' or 'comments'


// Validated Reporter Ticket If Status is Either 'inProgress' or 'resolved'  or underReview

exports.isValidReporterTicketStatus = (status) =>
  ["inProgress", "resolved", "underReview"].includes(status);



// Validated Reporter Login Roles  If Status is Either 'GuestReporter' or 'Reporter'

exports.isValidReporterLoginRoleStatus = (role) =>
  ["SuperAdmin", "Manager","Employee"].includes(role);

// Checks if required fields are present in the request body

exports.getMissingFields = (body, requiredFields) => {
  return requiredFields.filter((field) => !body[field]);
};

// Checks if required fields are present in the request body of an Array

exports.getMissingArrayFields = (array, requiredFields) => {
  const missingFields = [];

  array.forEach((item, index) => {
    const missingForObject = requiredFields.filter((field) => !(field in item));
    if (missingForObject.length > 0) {
      missingFields.push(
        `Object at index ${index}: ${missingForObject.join(", ")}`
      );
    }
  });

  return missingFields;
};
