const cors = require("cors");
const express = require("express");
const app = express();
const initRoutes = require("./routes/index");

const session = require('express-session')
var passport = require('passport')
var crypto = require('crypto')
const mongoose = require('mongoose')
const connection = require('./config/dbauth')

const MongoStore = require('connect-mongo')
// Migration guide
// https://stackoverflow.com/questions/66654037/mongo-connect-error-with-mongo-connectsession
var corsOptions = { // see this
  origin: "http://localhost:8080"
};

//  GENERAL SETUP
require('dotenv').config();
app.set("view engine", "ejs");
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// SESSION SETUP

// const sessionStore = new MongoStore({
//   mongooseConnection: connection,
//   collection: "sessions"
// })

// Migration
const sessionStore = MongoStore.create({
  mongoUrl: process.env.DB_STRING
})

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true, 
  store: sessionStore, // store this item at session store or retrieve from here
  cookie: { // we are storing session id as cookie in browser with expires property with  1 day
      maxAge: 1000* 60* 60* 24
  }
}));


// PASSPORT AUTHENTICATION

require('./config/passport');

app.use(passport.initialize())
app.use(passport.session())

initRoutes(app);


let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
