const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./configDB/db");
const router = require("./router");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();
connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("API is running!");
});

