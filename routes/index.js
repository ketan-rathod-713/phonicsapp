const express = require("express");
const home = require("../controllers/home");
const router = express.Router();
const homeController = require("../controllers/home");
const uploadController = require("../controllers/upload");

const passport = require('passport')
const isAuth = require('../middlewares/authMiddleware').isAuth
const genPassword = require('../config/passwordUtils').genPassword;
const connection = require('../config/dbauth');
const User = connection.models.User;


let routes = app => {
  router.get("/", homeController.signIn);
  // router.post("/signin",homeController.signInPost)
  router.post('/login',passport.authenticate('local',{failureRedirect: '/login-failure',successRedirect: "/uploadImages"})); // here we don't need callback function to do anything as if false or true we are redirecting to the new route great

  router.get('/signup',(req, res, next)=>{
    res.render("signup")
  })

  router.post('/register', (req, res, next) => {
    const saltHash = genPassword(req.body.password) // see how to use the custom names for this

    const salt = saltHash.salt
    const hash = saltHash.hash

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt,
        admin: false // Right now manually check 
    })

    // check if user exists or not , there may be chances that false user so OTP or like that stuff later
    newUser.save()
    .then((user)=>{
        console.log(user)
    })

    res.redirect("/") // go to signIn page 
 });

  router.get("/uploadImages",isAuth, (req, res, next)=>{
    res.render("index")
  })

  router.get("/login-failure", (req, res, next)=>{
    res.render("loginFailure")
  })

  // for all this things add isAuth to verify
  router.post("/upload",isAuth, uploadController.uploadFiles);
  router.get("/images", isAuth, uploadController.getListFiles);
  router.get("/images/:name", isAuth, uploadController.download);

  return app.use("/", router); // great but complicate or may be not, rather then writting it in app.js write it here great but in future i will avoid
};

module.exports = routes;