const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDB = require("./db/db");
const adminRoutes = require("./routes/admin");
const editorRoutes = require("./routes/editor");

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/admin", adminRoutes); 
app.use("/editor", editorRoutes); 

// Connect to the database
connectToDB();

module.exports = app;