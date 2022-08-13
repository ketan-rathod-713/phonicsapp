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
const authControllers = require('../controllers/auth')

let routes = app => {
  router.get("/",async (req, res, next)=>{
    
    await isAuth
    res.redirect("/uploadImages")
  });
  // router.post("/signin",homeController.signInPost)
  
  router.get("/login", homeController.signIn)

  router.post('/login',passport.authenticate('local',{failureRedirect: '/login-failure',successRedirect: "/uploadImages"})); // here we don't need callback function to do anything as if false or true we are redirecting to the new route great

  router.get('/signup', authControllers.getSignup);

  router.post('/register', authControllers.postSignup);

  router.get("/uploadImages",isAuth, uploadController.getUploadImages)

  router.get("/login-failure", authControllers.loginFailure)

  // for all this things add isAuth to verify
  router.post("/upload",isAuth, uploadController.uploadFiles);
  router.get("/images", isAuth, uploadController.getListFiles);
  router.get("/images/:name", isAuth, uploadController.download);

// Visiting this route logs the user out
app.post('/logout', function(req, res){ // keep it post req. to not accidently log out
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

  return app.use("/", router); // great but complicate or may be not, rather then writting it in app.js write it here great but in future i will avoid
};

module.exports = routes;