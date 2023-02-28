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
const server = require("./utils/socketServer")(app);
// application port
const port = process.env.PORT || 4000;


// passport config
// require('./middleware/passportConfig')(passport);
// use middleWares
app.use('/public', express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const sessionStore = new MongoStore({
//   mongooseConnection: process.env.MONGO_URL,
//   coll
// })
// console.log(session);

// if (app.get('env') === 'production') {
//   app.set('trust proxy', 1) // trust first proxy
//   sess.cookie.secure = true // serve secure cookies
// }
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

app.get(error404);
// ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(errorHandler);

const startApp = async () => {
  try {
    // connect to database
    await connectDb(process.env.MONGO_URL);
    console.log(`mongodb is connected`);
    server.listen(port, () => {
      console.log(`app is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};
// starts application
startApp();
