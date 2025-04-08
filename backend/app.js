const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDB = require("./db/db");
const adminRoutes = require("./routes/admin");
const editorRoutes = require("./routes/editor");
const spaceRoutes = require("./routes/space");
const videoRoutes = require("./routes/videos");

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/admin", adminRoutes);
app.use("/admin-space", spaceRoutes);
app.use("/editor", editorRoutes);
app.use("/video", videoRoutes);

connectToDB();

module.exports = app;
