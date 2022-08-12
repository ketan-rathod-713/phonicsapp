
module.exports = {
        // url: "mongodb://localhost:27017/", // for local development
        url: `mongodb+srv://admin-${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.odeen.mongodb.net/`, // for production
        database: "MyFilesDb",
        imgBucket: "MyImagesBucket",
}