const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDB = require("./db/db");
const adminRoutes = require("./routes/admin");
const editorRoutes = require("./routes/editor");


dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/admin", adminRoutes);
app.use("/editors", editorRoutes);

connectToDB();
