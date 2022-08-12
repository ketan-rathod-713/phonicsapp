const genPassword = require('../config/passwordUtils').genPassword
const connection = require('../config/dbauth')
const User = connection.models.User

const getSignup =  (req, res, next)=>{
      res.render("signup")
}

const postSignup = (req, res, next) => {
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
 }


const loginFailure = (req, res, next)=>{
    res.render("loginFailure")
  }


module.exports = {
    getSignup: getSignup,
    postSignup: postSignup,
    loginFailure: loginFailure,
    
    }