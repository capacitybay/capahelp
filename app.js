const express = require("express");
require("dotenv").config();
const routes = require("./api");
const app = express();
const connection = require("./db/connection");

// use routes
app.use("/api/v1", routes);

// application port
const port = process.env.PORT || 4000;

// connect to database
connection();
app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
