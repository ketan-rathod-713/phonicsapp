
const upload = require("../middlewares/upload");
const dbConfig = require("../config/db");
const { GridFSBucket } = require("mongodb");
const MongoClient= require("mongodb").MongoClient
const GridFsBucket = require("mongodb").GridFSBucket

// what is difference between {MongoClient} and when we write simply MongoClient
// Be carefull when not using async or callbacks, as do things step by step
// add try catch and render good error pages

const url = dbConfig.url;

const mongoClient = new MongoClient(url);

const baseUrl = "https://fileuploades.herokuapp.com/files/" // for images link so that we can later see files/:fileName



const uploadFiles =async (req, res)=>{
  try{
    await upload(req, res);
    console.log(req.files) // upload middleware returns each files new name and all that info

    if (req.files.length <= 0) {
        return res
          .status(400)
          .send({ message: "You must select at least 1 file." });
      }
  
      return res.status(200).send({
        message: "Files have been uploaded.",
      });
    } catch(err){
        res.render("error",{error:err})
    }
} // add try catch for errors and all 


const getListFiles =async (req, res)=>{
    // get list of files from collection 

    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const images = database.collection(dbConfig.imgBucket + ".files");

    const cursor = images.find({});

    if(await cursor.count === 0){
      res.status(500).send({message:"No data found"})
    }

    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    // return res.status(200).send(fileInfos);
    return res.status(200).render("files",{files:fileInfos})
    
}

const download = async (req, res)=>{
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
}

module.exports = {uploadFiles: uploadFiles, getListFiles:getListFiles, download:download}