// make a gridfs engine to upload files from req and return success
// This will upload files if there

const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dbConfig = require("../config/db");


var storage = new GridFsStorage({
    url : dbConfig.url + dbConfig.database, // i want database so add this too
    options : {useNewUrlParser: true, useUnifiedTopology: true},
    file: (req, file)=>{ // got file and req from client so upload it 
        const match  =["image/png", "image/jpeg"]
        
        if (match.indexOf(file.mimetype) === -1) { // match from last
            const filename = `${Date.now()}-myFile-${file.originalname}`;
            return filename;
          }
          
          console.log(req.user.username) // i can get this information
          const username = req.user.username;
          return { // let store this file as this info.
            bucketName: dbConfig.imgBucket,
            filename: `${Date.now()}-by-${username}-${file.originalname}`
          };

    }
})

var uploadFiles = multer({storage: storage}).array("file",10) // This was giving me error as i wrote "files" here :)))|||

var uploadFilesMiddleware = util.promisify(uploadFiles)

module.exports = uploadFilesMiddleware