const postCategoryModel = require("../Models/Posts/PostCategoryModel");
const shortCategoryModel = require("../Models/Shorts/ShortCategoryModel");
const novelCategoryModel = require("../Models/Novels/NovelCategoryModel");
const languageModel = require("../Models/LanguageModel");
const roleModel = require("../Models/AuthModel");
const userActivityModel = require("../Models/UserActivity/UserActivityModel");
const notificationModel = require("../Models/Notifications/NotificationsModel");
const locationModel = require("../Models/Locations/LocationModel");
const pdfParse = require("pdf-parse");
const {
  sendPushNotifications,
} = require("../Controllers/Notifications/PushNotificationController");

// Reusable function to fetch Post categories
const getPostCategories = async (categoryIds) => {
  if (!categoryIds.length) return {};
  const postCategoriesData = await postCategoryModel
    .find({ postCategoryID: { $in: categoryIds } })
    .select("-_id -postCategoryStatus -createdAt -updatedAt")
    .lean();

  return postCategoriesData.reduce((acc, postCategory) => {
    acc[postCategory.postCategoryID] = postCategory;
    return acc;
  }, {});
};

// Reusable function to fetch languages
const getPostLanguages = async (languageIds) => {
  if (!languageIds.length) return {};
  const postLanguagesData = await languageModel
    .find({ languageID: { $in: languageIds } })
    .select("-_id -languageStatus -nativeName -createdAt -updatedAt")
    .lean();

  return postLanguagesData.reduce((acc, postLanguage) => {
    acc[postLanguage.languageID] = postLanguage;
    return acc;
  }, {});
};

// Reusable function to fetch Reporters
const getReporters = async (reporterIDs) => {
  if (!reporterIDs.length) return {};
  const reportersData = await roleModel
    .find({ roleID: { $in: reporterIDs } })
    .select("firstName lastName email mobileNumber roleID role profilePic -_id")
    .lean();

  return reportersData.reduce((acc, reporter) => {
    acc[reporter.roleID] = reporter;
    return acc;
  }, {});
};

// Reusable function to fetch Short categories
const getShortCategories = async (categoryIds) => {
  if (!categoryIds.length) return {};
  const shortCategoriesData = await shortCategoryModel
    .find({ shortCategoryID: { $in: categoryIds } })
    .select("-_id -shortStatus -createdAt -updatedAt")
    .lean();

  return shortCategoriesData.reduce((acc, shortCategory) => {
    acc[shortCategory.shortCategoryID] = shortCategory;
    return acc;
  }, {});
};

// Reusable function to fetch Novel categories
const getNovelCategories = async (categoryIds) => {
  if (!categoryIds.length) return {};
  const novelCategoriesData = await novelCategoryModel
    .find({ novelCategoryID: { $in: categoryIds } })
    .select("-_id -novelCategoryStatus -createdAt -updatedAt")
    .lean();

  return novelCategoriesData.reduce((acc, novelCategory) => {
    acc[novelCategory.novelCategoryID] = novelCategory;
    return acc;
  }, {});
};

// Reusable function to fetch  User Comments
const getCommentUsersMap = async (comments) => {
  const commentUserIDs = new Set();

  comments.forEach((comment) => {
    if (comment.userID) commentUserIDs.add(comment.userID);
    comment.replies?.forEach((reply) => {
      if (reply.userID) commentUserIDs.add(reply.userID);
    });
  });

  const userDocs = await roleModel
    .find({ roleID: { $in: [...commentUserIDs] } })
    .select("roleID firstName email")
    .lean();

  const userMap = {};
  userDocs.forEach((user) => {
    userMap[user.roleID] = user;
  });

  return userMap;
};

// Reusable function to fetch User like dislike or read or write download
const getUserActivityData = async (contentID) => {
  if (!contentID) return null;

  const activity = await userActivityModel
    .findOne({ contentID })
    .sort({ createdAt: -1 })
    .lean();
  if (!activity) {
    return {
      users: [],
      likes: 0,
      dislikes: 0,
      shares: 0,
      downloads: 0,
    };
  }

  return {
    users: activity.users || [],
    likes: activity.likes || 0,
    dislikes: activity.dislikes || 0,
    shares: activity.shares || 0,
    downloads: activity.downloads || 0,
  };
};

// Reusable function to fetch User based by ID like dislike or read or write download
const getUserBasedActivityData = async (contentID, userId) => {
  if (!contentID || !userId) return null;
  const uid = userId.toString();

  const pipeline = [
    {
      $match: {
        contentID,
      },
    },
    // Bookmark lookup
    {
      $lookup: {
        from: "Bookmarks",
        let: { cid: contentID },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$contentID", "$$cid"] },
            },
          },
          { $count: "count" },
        ],
        as: "bookmarkData",
      },
    },

    {
      $project: {
        likes: 1,
        dislikes: 1,
        shares: 1,
        reads: 1,
        downloads: 1,
        user: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$users",
                as: "u",
                cond: {
                  $eq: ["$$u.userId", uid],
                },
              },
            },
            0,
          ],
        },
        bookmarks: {
          $ifNull: [{ $arrayElemAt: ["$bookmarkData.count", 0] }, 0],
        },
      },
    },
  ];

  const result = await userActivityModel.aggregate(pipeline);
  const row = result?.[0];
  const defaultUser = {
    userId: uid,
    actions: {
      like: false,
      dislike: false,
      share: false,
      download: false,
      read: false,
      isBookmarked: false,
    },
  };

  if (!row) {
    return {
      user: defaultUser,
      likes: 0,
      dislikes: 0,
      shares: 0,
      reads: 0,
      downloads: 0,
      bookmarks: 0,
    };
  }
  return {
    user: row.user || defaultUser,
    likes: row.likes || 0,
    dislikes: row.dislikes || 0,
    shares: row.shares || 0,
    reads: row.reads || 0,
    downloads: row.downloads || 0,
    bookmarks: row.bookmarks || 0,
  };
};

// Reusable push notification generator for Post, Short, and Quote content
const updateBasedOnInAppNotification = async ({
  items,
  status,
  contentType,
}) => {
  try {
    const notifications = await Promise.all(
      items.map(async (item) => {
        const reporterID =
          item.postReportedDetails ||
          item.shortReportedDetails ||
          item.dailyQuoteReportedDetails;

        const ReporterDetails = await roleModel.findOne({
          roleID: reporterID,
        });

        const fullName = [
          ReporterDetails.firstName,
          ReporterDetails.middleName,
          ReporterDetails.lastName,
        ]
          .filter(Boolean)
          .join(" ");

        let categoryName = "";
        if (contentType === "Post") {
          const postCat = await postCategoryModel.findOne({
            postCategoryID: item.postCategory,
          });
          categoryName = postCat?.postCategoryName || "";
        } else if (contentType === "Short") {
          const shortCat = await shortCategoryModel.findOne({
            shortCategoryID: item.shortCategory,
          });
          categoryName = shortCat?.shortCategoryName || "";
        }

        let message = "";
        if (contentType === "Quote") {
          message =
            status === "Published"
              ? `${fullName}, the quote you have posted is Published`
              : `${fullName}, the quote you have posted has been Rejected`;
        } else {
          message =
            status === "Published"
              ? `${fullName}, the ${categoryName} ${contentType.toLowerCase()} you have posted is Published`
              : `${fullName}, the ${categoryName} ${contentType.toLowerCase()} you have posted has been Rejected`;
        }

        return {
          roleID: reporterID,
          contentID: item.postID || item.shortID || item.dailyQuoteID,
          contentType,
          message,
          status: "Active",
        };
      })
    );

    //  Save notifications to DB
    await notificationModel.insertMany(notifications);

    //  Fetch tokens for push notification
    const userTokens = await roleModel.find({
      roleID: { $in: notifications.map((n) => n.roleID) },
    });

    const tokens = userTokens.map((u) => u.fcmToken).filter(Boolean);

    if (tokens.length > 0) {
      await sendPushNotifications({
        notification: {
          title: "Status Update",
          body: notifications[0].message,
        },
        tokens,
      });
    }
  } catch (error) {
    console.error("push Notification Error:", error);
  }
};

// like and dislike and read and share
function toggleLike(target, userID) {
  const usersList = target.users || target.likedUsers || [];
  if (!target.users && target.likedUsers) {
    target.likedUsers = usersList;
  } else {
    target.users = usersList;
  }

  const userEntry = usersList.find((user) => user.userID === userID);

  if (!userEntry) {
    usersList.push({
      userID,
      actions: { like: true },
    });
    target.likes += 1;
  } else {
    userEntry.actions.like = !userEntry.actions.like;
    target.likes += userEntry.actions.like ? 1 : -1;
  }

  return target.likes;
}

// get count of published and rejected based on Reporter Id
function getCounts(items, reporterField, statusField) {
  const counts = {};

  for (const item of items) {
    const reporterId = item[reporterField]?.toString();
    if (!reporterId) continue;

    if (!counts[reporterId]) {
      counts[reporterId] = { published: 0, trashed: 0 };
    }

    if (item[statusField] === "Published") {
      counts[reporterId].published += 1;
    } else if (item[statusField] === "Rejected") {
      counts[reporterId].trashed += 1;
    }
  }

  return counts;
}

async function getReadingTimeFromBuffer(buffer) {
  try {
    const pdfData = await pdfParse(buffer);
    const pageCount = pdfData.numpages;

    let totalMinutes = pageCount * 2; // 2 mins per page
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes} mins`;
    } else {
      return `${minutes} mins`;
    }
  } catch (err) {
    console.error("❌ Error parsing PDF:", err);
    return "N/A";
  }
}

const toIST = (date) => {
  const istOffset = 5.5 * 60;
  return new Date(date.getTime() + istOffset * 60 * 1000);
};

// Get date range filter
const getDateRange = (timeRange) => {
  const now = toIST(new Date());
  let startDate;

  if (!timeRange) {
    startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0); // start of today in IST
    return { $gte: startDate };
  }

  startDate = new Date(now);

  switch (timeRange) {
    case "1m":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "3m":
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case "6m":
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case "1y":
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      return {};
  }

  return { $gte: startDate };
};

// Initialize keys for grouping
const initializeTimeRangeKeys = (timeRange) => {
  const now = toIST(new Date());
  const data = {};

  switch (timeRange) {
    case "1m":
      for (let i = 3; i >= 0; i--) {
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() - i * 7);
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6);
        const key = `${startDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${endDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}`;
        data[key] = 0;
      }
      break;
    case "3m": {
      for (let i = 2; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        data[key] = 0;
      }
      break;
    }
    case "6m":
    case "1y":
      const months = timeRange === "6m" ? 5 : 11;
      for (let i = months; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const key = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        data[key] = 0;
      }
      break;
  }

  return data;
};

// Group data by range
const groupDataByRange = (items, dateField, timeRange) => {
  const grouped = initializeTimeRangeKeys(timeRange || "1m");
  const now = toIST(new Date());
  items.forEach((item) => {
    const itemDate = toIST(new Date(item[dateField]));
    switch (timeRange) {
      case "1m": {
        for (let i = 3; i >= 0; i--) {
          const endDate = toIST(new Date(now));
          endDate.setDate(endDate.getDate() - i * 7);
          endDate.setHours(23, 59, 59, 999);

          const startDate = new Date(endDate);
          startDate.setDate(startDate.getDate() - 6);
          startDate.setHours(0, 0, 0, 0);

          const normItem = toIST(new Date(item[dateField]));

          if (normItem >= startDate && normItem <= endDate) {
            const key = `${startDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })} - ${endDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}`;
            grouped[key] = (grouped[key] || 0) + 1;
            break;
          }
        }
        break;
      }

      case "3m": {
        for (let i = 0; i < 3; i++) {
          const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth() - i,
            1
          );
          const endOfMonth = new Date(
            now.getFullYear(),
            now.getMonth() - i + 1,
            0
          );
          startOfMonth.setHours(0, 0, 0, 0);
          endOfMonth.setHours(23, 59, 59, 999);
          if (itemDate >= startOfMonth && itemDate <= endOfMonth) {
            const key = startOfMonth.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
            if (grouped[key] !== undefined) {
              grouped[key] += 1;
            } else {
              grouped[key] = 1;
            }
            break;
          }
        }
        break;
      }
      case "6m":
      case "1y": {
        const key = itemDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        if (grouped[key] !== undefined) grouped[key] += 1;
        break;
      }
    }
  });

  return grouped;
};

function calculatePercentageChange(current, last) {
  return last ? ((current - last) / last) * 100 : current > 0 ? 100 : 0;
}

const getPostLocations = async (postLocationDetails) => {
  if (!postLocationDetails.length) return {};
  const postLocationsData = await locationModel
    .find({ locationID: { $in: postLocationDetails } })
    .select("-_id -locationStatus -createdAt -updatedAt")
    .lean();

  return postLocationsData.reduce((acc, postLocation) => {
    acc[postLocation.locationID] = postLocation;
    return acc;
  }, {});
};

function fixBrowserEncodedFilename(file) {
  if (!file?.originalname) return;
  file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
}

module.exports = {
  getPostCategories,
  getPostLanguages,
  getReporters,
  getShortCategories,
  getNovelCategories,
  getCommentUsersMap,
  getUserActivityData,
  getUserBasedActivityData,
  updateBasedOnInAppNotification,
  toggleLike,
  getCounts,
  getReadingTimeFromBuffer,
  groupDataByRange,
  getDateRange,
  calculatePercentageChange,
  getPostLocations,
  fixBrowserEncodedFilename,
};
