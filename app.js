const express = require("express");
require("dotenv").config();
const routes = require("./api");
const app = express();
const connection = require("./db/connection");

// application port
const port = process.env.PORT || 4000;
// use middleWares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/v1", routes);
connection();

// connect to database
app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
