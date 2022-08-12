
const uploadFiles = (req, res)=>{

    res.render("index")
}

const signUp = (req, res)=>{
    res.render("signup")
}

const signIn = (req, res)=>{
    res.render("signin")
}

module.exports ={
    uploadFiles:uploadFiles, 
    signIn: signIn,
    signUp: signUp,
}