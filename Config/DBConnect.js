const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 360000,
    connectTimeoutMS: 30000,
    readPreference: "primary",
  })
  .then(() => console.log("Database Connected"))
  .catch((error) => console.error("Database Connection Error:", error));
