const express = require('express');
require('dotenv').config();
const routes = require('./api');
const app = express();
const errorHandler = require('./middleware/errorHandler');
const error404 = require('./middleware/error404');
const connectDb = require('./db/connect');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

const asyncWrapper = require('./middleware/controllerWrapper');

// application port
const port = process.env.PORT || 4000;

// use middleWares
app.use('/public', express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
// Express session

app.use(
  session({
    secret: process.env.SESSION_SECRETE,
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collection: 'sessions',
    }),
    cookie: {
      maxAge: 1000 * 180 * 60 * 24,
      // secure:true   modify in production
    },
  })
);
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
// Passport middleware
app.use(passport.initialize());

app.use(passport.session());

app.use(routes);
app.use(error404);

// ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');
// app.use(errorHandler);

const startApp = asyncWrapper(async () => {
  // connect to database
  const establishConn = await connectDb(process.env.MONGO_URL);
  console.log(`mongodb is connected`);
  app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
  });
});

// starts application
startApp();
