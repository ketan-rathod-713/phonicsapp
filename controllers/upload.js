
const upload = require("../middlewares/upload");
const dbConfig = require("../config/db");
const { GridFSBucket } = require("mongodb");
const { default: mongoose } = require("mongoose");
const MongoClient= require("mongodb").MongoClient
const GridFsBucket = require("mongodb").GridFSBucket

// what is difference between {MongoClient} and when we write simply MongoClient
// Be carefull when not using async or callbacks, as do things step by step
// add try catch and render good error pages

const url = dbConfig.url;

const mongoClient = new MongoClient(url);

mongoClient.connect()

// const baseUrl = "https://fileuploades.herokuapp.com/images/" // for images link so that we can later see files/:fileName
// const baseUrl = "http://localhost:8080/images/"


const uploadFiles =async (req, res)=>{
  try{
    await upload(req, res);
    if (req.files.length <= 0) {
        return res
          .status(400)
          .send({ message: "You must select at least 1 file." });
      }
  
      // return res.status(200).send({
      //   message: "Files have been uploaded.",
      // });
      res.redirect("/images")
    } catch(err){
        res.render("error",{error:err})
    }
} // add try catch for errors and all 


const getListFiles =async (req, res)=>{
    // get list of files from collection 
try{
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const images = database.collection(dbConfig.imgBucket + ".files");

    const cursor = images.find({});

    if(await cursor.count === 0){
      res.status(500).send({message:"No data found"})
    }

    let fileInfos = [];

    var baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl + "/";

    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    // return res.status(200).send(fileInfos);
    return res.status(200).render("files",{files:fileInfos})
  } 
  catch(err){
    return res.status(501).render("error",{error: err})
  }
    
}

const download = async (req, res)=>{
  try{
    const fileName = req.params.name
    
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database)
    const bucket = new GridFsBucket(database, { // required for important methods like openDownloadStream
      bucketName:dbConfig.imgBucket
    })

    const downloadStream = bucket.openDownloadStreamByName(fileName);
  
    downloadStream.on("data", function(data){ // readable streams have this much methods/events fire 
        res.write(data);
    })
    
    downloadStream.on("end", function(){
        res.end()
    })

    downloadStream.on("error", function(){
      res.status(500).send({message:"An error occured"})
    })
  } catch(err){
    res.status(501).render("error",{error: err})
  }
}

const getUploadImages = (req, res, next)=>{
  res.render("index")
}

module.exports = {
  uploadFiles: uploadFiles, 
  getListFiles: getListFiles, 
  download: download,
  getUploadImages: getUploadImages,
}