const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const routes = require("./routes");
const methodOverride = require("method-override");
const authenticateToken = require("./middlewares/auth");
const cors = require("cors");

require("dotenv").config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(authenticateToken);

app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
