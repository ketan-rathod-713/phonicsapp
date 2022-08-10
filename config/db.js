
module.exports = {
        // url: "mongodb://localhost:27017/",
        url: `mongodb+srv://admin-${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.odeen.mongodb.net/`,
        database: "MyFilesDb",
        imgBucket: "MyImagesBucket",
}