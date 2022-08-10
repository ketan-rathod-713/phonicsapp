const cors = require("cors");
const express = require("express");
const app = express();
const initRoutes = require("./routes/index");

var corsOptions = { // see this
  origin: "http://localhost:8080"
};

app.set("view engine", "ejs");
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

initRoutes(app);

let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
