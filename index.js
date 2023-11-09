const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dir_name = process.cwd();

const app = express();

app.set('view engine', 'ejs')
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 7000;
const SITE = "localhost";

const userRoute = require("./routers/user");

app.use("/user", userRoute);

app.use("/", (req, res) => {
  return res.json({ message: "Welcome to Task management." });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://${SITE}:${PORT}`);
});
