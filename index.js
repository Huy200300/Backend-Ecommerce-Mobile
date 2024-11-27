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
    origin: true,
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("API is running!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
