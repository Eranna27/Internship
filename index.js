require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

require("./Config/DBConnect");

const router = require("./Routers/Routers");
const docsRoutes = require("./docs/documentRoutes");
const { setupSwagger } = require("./docs/swagger");
const app = express();
const PORT = process.env.PORT || 3000;

// SECURITY + PERFORMANCE
app.use(cors());
app.use(helmet());

// PARSERS
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//RATE LIMITER
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});
app.use(apiLimiter);

// Enable request compression
app.use(compression());

// HTTP request logger 
app.use(morgan("dev"));

//HOME PAGE ROUTE (before other routes)
app.get("/health", (req, res) => {
  res.sendFile(path.join(__dirname, "Views", "homeScreen.html"));
});

setupSwagger(app);

//DOCUMENTATION ROUTES
app.use("/", docsRoutes);

//MAIN API ROUTERS
app.use("/", router);

//GLOBAL FILE UPLOAD ERROR HANDLER
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(200).json({ success: false, error: err.message });
  }
  if (err) {
    return res.status(200).json({ success: false, error: err.message });
  }
  next();
});

//404 PAGE (AFTER ALL ROUTES)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "Views", "notFound.html"));
});

//START SERVER
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});
