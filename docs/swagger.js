const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
/**
 * Swagger configuration for Role Based API
 */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Role Based Services App API",
      version: "1.0.0",
      description: `
      🇮🇳 **Health Management System API**
      A comprehensive API for managing health services.

      ## ✨ Key Features
     - 🇮🇳 **Indian Phone Validation** — 10-digit numbers starting with 6-9  
     - 🔒 **Security First** — Rate limiting, input validation, and secure JWT tokens
     - ⚡ **High Performance** — Optimized API responses with minimal latency  
     - 🧾 **Detailed Logging** — Centralized request and error logging for better monitoring  
     - 📊 **Analytics Ready** — Built-in endpoints to track verification and usage statistics  
     - 🧩 **Modular Design** — Easy to extend and integrate with existing Node.js backends  
     - 🌐 **CORS & Helmet Integration** — Secure cross-origin requests and HTTP headers  
     - 🧠 **Error Handling Middleware** — Clean, centralized error responses with status codes  
     
     ## 📱 Phone Number Format
     All phone numbers should be **10-digit Indian mobile numbers** starting with **6**, **7**, **8**, or **9**.  
     Example: \`9505036142\`
      `,
      contact: {
        name: "Role Based",
        email: "meranna60@gmail.com",
        url: "https://eyefulnews.com/",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
      {
        url: "",
        description: "Developement Server (Render)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token obtained from login successfully",
        },
      },
    },
    tags: [
      {
        name: "Role",
        description: "🔐 **Login Management** — Roles & Authentication APIs",
      },
      {
        name: "PostCategories",
        description:
          "🗂️ **Post Categories Management** — Create, Update, List & Delete Categories",
      },
      {
        name: "ShortCategory",
        description:
          "🎬 Manage Short Categories — Create, Update, Fetch, Change Status",
      },
      {
        name: "NovelCategory",
        description:
          "📚 Novel Categories — Create, Update, Fetch & Change Status",
      },
      {
        name: "Posts",
        description:
          "📝 **Post Management** — Create, update, delete and fetch posts",
      },
      {
        name: "Novels",
        description:
          "📚 Novel Management — Create, Upload, Fetch, Update & Status Change",
      },
      {
        name: "Shorts",
        description:
          "🎞️ **Shorts Management** — Create, Upload, Filter, Update & Status Change",
      },
      {
        name: "DailyQuotes",
        description:
          "💬 Daily Quotes Management — Create, Upload, Update, Filter & More",
      },
      {
        name: "Magazines",
        description:
          "📖 Magazine Management — Create, Upload PDF, Fetch, Update & Change Status",
      },
      {
        name: "Jobs",
        description:
          "💼 Jobs Management — Create, Upload, Filter, Fetch, Update & Delete",
      },
      {
        name: "Locations",
        description:
          "📍 Locations Management — Create, Update, Fetch, Filter & Change Status",
      },
      {
        name: "DosAndDonts",
        description: "📋 Dos and Don'ts Management — Create, Fetch & Update",
      },
      {
        name: "Ads",
        description:
          "📢 Ads Management — Create, Upload, Fetch, Update, Change Status",
      },
      {
        name: "Dashboard",
        description:
          "📊 Dashboard Analytics — Reporter, Content, and Count Stats",
      },
      {
        name: "UserActivity",
        description:
          "👤 Track user actions (like, dislike, share, download, read) on content",
      },
      {
        name: "Bookmark",
        description:
          "🔖 Manage bookmarks for content (add/remove, list by user)",
      },
      {
        name: "ContentComment",
        description: "💬 Manage comments and replies on content",
      },
      {
        name: "Language",
        description: "🌐 Manage languages in the system",
      },
      {
        name: "Notifications",
        description: "🔔 Manage notifications for roles",
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    __dirname + "/../Routes/RoleRouters.js",
    __dirname + "/../Routes/Posts/PostCategoryRouters.js",
    __dirname + "/../Routes/Shorts/ShortCategoryRouters.js",
    __dirname + "/../Routes/Novels/NovelCategoryRouters.js",
    __dirname + "/../Routes/Posts/PostRouters.js",
    __dirname + "/../Routes/Novels/NovelRouters.js",
    __dirname + "/../Routes/Shorts/ShortRouters.js",
    __dirname + "/../Routes/Quotes/DailyQuotesRouters.js",
    __dirname + "/../Routes/Magazines/MagazineRouters.js",
    __dirname + "/../Routes/Jobs/JobRouters.js",
    __dirname + "/../Routes/Locations/LocationRouters.js",
    __dirname + "/../Routes/DosAndDonts/DosAndDontRouters.js",
    __dirname + "/../Routes/Ads/AdRouters.js",
    __dirname + "/../Routes/Dashboard/DashboardRouters.js",
    __dirname + "/../Routes/UserActivities/UserActivityRouters.js",
    __dirname + "/../Routes/UserActivities/BookmarkRouters.js",
    __dirname + "/../Routes/UserActivities/ContentCommentRouters.js",
    __dirname + "/../Routes/LanguageRouters.js",
    __dirname + "/../Routes/NotificationRouters.js",
  ],
};

// Generate swagger specification
const specs = swaggerJsdoc(options);

/**
 * Swagger UI options
 */
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    docExpansion: "none", // Don't expand operations by default
    filter: true, // Enable search
    showRequestDuration: true,
    tryItOutEnabled: true,
    requestInterceptor: (req) => {
      // Add custom headers or modify requests
      req.headers["X-API-Version"] = "1.0.0";
      return req;
    },
  },
  customCss: `
    .swagger-ui .topbar { display: none; }

    body {
      background-color: #f4f7fb;
    }

    .swagger-ui .info .title {
      color: #1565c0;
      font-weight: 700;
      font-size: 28px;
    }

    .swagger-ui .info .description {
      background: #e3f2fd;
      border-left: 5px solid #1976d2;
      padding: 15px;
      border-radius: 6px;
      font-size: 14px;
      line-height: 1.6;
    }

    .swagger-ui .opblock.opblock-post {
      border-color: #43a047;
      background: #e8f5e9;
    }

    .swagger-ui .opblock.opblock-get {
      border-color: #1e88e5;
      background: #e3f2fd;
    }

    .swagger-ui .opblock.opblock-put {
      border-color: #fb8c00;
      background: #fff3e0;
    }

    .swagger-ui .opblock.opblock-delete {
      border-color: #e53935;
      background: #ffebee;
    }

    .swagger-ui .btn.execute {
      background-color: #1976d2 !important;
      border-radius: 6px !important;
      transition: all 0.3s ease;
    }

    .swagger-ui .btn.execute:hover {
      background-color: #0d47a1 !important;
    }

    .swagger-ui .scheme-container {
      background: #ffffff;
      border: 1px solid #e0e0e0;
      box-shadow: 0px 2px 6px rgba(0,0,0,0.05);
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
    }

    .swagger-ui .opblock-summary {
      border-radius: 6px;
    }

    .swagger-ui .parameter__name {
      color: #1976d2;
    }

    .swagger-ui .model-box {
      background: #f9f9f9;
      border-radius: 6px;
    }
  `,

  customSiteTitle: "Role Based API Documentation",
  customfavIcon: "/favicon.ico",
};

/**
 * Setup Swagger middleware
 * @param {Express} app - Express application instance
 */
const setupSwagger = (app) => {
  // Serve swagger documentation
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, swaggerUiOptions)
  );

  // Serve swagger JSON
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });
};

module.exports = {
  setupSwagger,
  specs,
  swaggerUiOptions,
};
