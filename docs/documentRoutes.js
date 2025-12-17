const express = require("express");
const path = require("path");
const fs = require("fs");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();

const router = express.Router();

// Serve markdown files as HTML
const serveMarkdownAsHTML = (filePath, title) => {
  return (req, res) => {
    try {
      const markdownPath = path.join(__dirname, "../", filePath);
      const markdownContent = fs.readFileSync(markdownPath, "utf8");
      const htmlContent = md.render(markdownContent);

      const fullHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
              line-height: 1.6;
              color: #333;
            }
            pre {
              background: #f5f5f5;
              padding: 15px;
              border-radius: 5px;
              overflow-x: auto;
              border-left: 4px solid #007acc;
            }
            code {
              background: #f0f0f0;
              padding: 2px 4px;
              border-radius: 3px;
              font-family: 'Monaco', 'Consolas', monospace;
            }
            h1, h2, h3 { color: #2c3e50; }
            h1 { border-bottom: 2px solid #3498db; padding-bottom: 10px; }
            h2 { border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            .nav-links {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 20px;
            }
            .nav-links a {
              margin-right: 15px;
              color: #007acc;
              text-decoration: none;
              font-weight: 500;
            }
            .nav-links a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="nav-links">
            <strong>📚 Documentation:</strong>
            <a href="/mobile-guide">Mobile API Guide</a>
          </div>
          ${htmlContent}
        </body>
        </html>
      `;

      res.send(fullHTML);
    } catch (error) {
      console.error("Error serving markdown:", error);
      res.status(500).send(`
        <h1>Documentation Error</h1>
        <p>Error loading documentation: ${error.message}</p>
        <p><a href="/docs">← Back to Documentation Hub</a></p>
      `);
    }
  };
};

// Routes for documentation
router.get(
  "/Admin-guide",
  serveMarkdownAsHTML("API_GUIDE.md", "Admin API Integration Guide")
);

router.get(
  "/Reporter-guide",
  serveMarkdownAsHTML("Reporter_GUIDE.md", "Reporter API Integration Guide")
);
router.get(
  "/User-guide",
  serveMarkdownAsHTML("User_GUIDE.md", "User API Integration Guide")
);

// Landing page for docs
router.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Role Based - API Documentation</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          text-align: center;
        }
        .card {
          background: white;
          border-radius: 10px;
          padding: 30px;
          margin: 20px 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          border-left: 4px solid #007acc;
        }
        .card h3 { margin-top: 0; color: #2c3e50; }
        .card a {
          display: inline-block;
          background: #007acc;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 10px;
        }
        .card a:hover { background: #005a9e; }
      </style>
    </head>
    <body>
      <h1>Role Based API Documentation</h1>
      <p>Choose the documentation that best fits your needs:</p>
  <div class="card">
    <h3>🛠 Admin API Integration Guide</h3>
    <p>Admin-level API documentation including CMS actions, user management, approvals, and dashboard features.</p>
    <a href="/Admin-guide">View Admin Guide</a>
  </div>
  <div class="card">
    <h3>📰 Reporter API Integration Guide</h3>
    <p>Reporter-level endpoints for uploading news, managing posts, and content moderation workflows.</p>
    <a href="/Reporter-guide">View Reporter Guide</a>
  </div>
  <div class="card">
    <h3>👤 User API Integration Guide</h3>
    <p>Endpoints for user login, subscriptions, bookmarks, and personalized feed management.</p>
    <a href="/User-guide">View User Guide</a>
  </div>
    <div class="card">
        <h3>🔧 Interactive API Documentation</h3>
        <p>Swagger UI for testing APIs directly in your browser with live examples.</p>
        <a href="/api-docs">Open Swagger UI</a>
      </div>
  <div class="card">
    <h3>Server Health Check</h3>
    <p>Check if the backend server is running properly.</p>
    <a href="/health">Check</a>
  </div>
        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">
        <strong>Base URLs:</strong><br>
        Local: http://localhost:3000<br>
        Development: <br>
        Version: 1.1.0
      </p>
    </body>
    </html>
  `);
});

module.exports = router;
