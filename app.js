const express = require('express');
require('dotenv').config();
const routes = require('./api');
const app = express();
const errorHandler = require('./middleware/errorHandler');
const error404 = require('./middleware/error404');
const connectDb = require('./db/connect');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
// application port
const port = process.env.PORT || 4000;

// passport config
// require('./middleware/passportConfig')(passport);
// use middleWares
app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', routes);
app.set('view engine', 'ejs');
app.use(error404);
app.use(errorHandler);

const startApp = async () => {
  try {
    // connect to database
    await connectDb(process.env.MONGO_URL);
    console.log(`mongodb is connected`);
    app.listen(port, () => {
      console.log(`app is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};
// starts application
startApp();
