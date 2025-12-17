const express = require("express");
const router = new express.Router();

// Role Routers

const roleRouters = require("./RoleRouters");
router.use(roleRouters);

// Language Routers

// const languageRouters = require("./LanguageRouters");
// router.use("/language", languageRouters);

// // Post Routers

// const postCategoryRouters = require("./Posts/PostCategoryRouters");
// const postRouters = require("./Posts/PostRouters");
// router.use("/post/category", postCategoryRouters);
// router.use("/posts", postRouters);

// // Daily Quotes Routers

// const dailyQuotesRouters = require("./Quotes/DailyQuotesRouters");
// router.use("/dailyQuotes", dailyQuotesRouters);

// // Short Routers

// const shortCategoryRouters = require("./Shorts/ShortCategoryRouters");
// const shortRouters = require("./Shorts/ShortRouters");
// router.use("/shorts/category", shortCategoryRouters);
// router.use("/shorts", shortRouters);

// // Novel Routers

// const novelCategoryRouters = require("./Novels/NovelCategoryRouters");
// const novelRouters = require("./Novels/NovelRouters");
// router.use("/novel/category", novelCategoryRouters);
// router.use("/novels", novelRouters);

// // User Activities

// const userPostActivityRouters = require("./UserActivities/UserActivityRouters");
// const bookmarkRouters = require("./UserActivities/BookmarkRouters");
// router.use("/activity", userPostActivityRouters);
// router.use("/bookmark", bookmarkRouters);

// // Jobs

// const jobRouters = require("./Jobs/JobRouters");
// router.use("/jobs", jobRouters);

// // ADS

// const adRouters = require("./Ads/AdRouters");
// router.use("/ads", adRouters);

// // Magazines

// const magazineRouters = require("./Magazines/MagazineRouters");
// router.use("/magazines", magazineRouters);

// // Dos And Don'ts

// const dosAndDontsRouters = require("./DosAndDonts/DosAndDontRouters");
// router.use("/dosAndDonts", dosAndDontsRouters);

// // Comment to content

// const contentCommentRouters = require("./UserActivities/ContentCommentRouters");
// router.use("/content/comment", contentCommentRouters);

// // Translate words

// const translateRouters = require("./TranslateRouters");
// router.use("/translate", translateRouters);




// // Notifications

// const notificationRouters = require("./NotificationRouters");
// router.use("/notifications", notificationRouters);


// // animationVideos
// const animationVideoRouters = require("./AnimationVideo/AnimationVideoRouters");
// router.use("/animationVideo", animationVideoRouters);

// // dashboard

// const dashboardRouters = require("./Dashboard/DashboardRouters");
// router.use("/dashboard", dashboardRouters);



// dashboard

const DepartmentsRouters = require("./departments/departmentsRouters");
router.use("/department", DepartmentsRouters);


module.exports = router;
