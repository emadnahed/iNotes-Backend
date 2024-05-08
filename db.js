const mongoose = require('mongoose');

const MongoURI = "mongodb+srv://emaadnahed:cMbqnKD35tS6xbP3@cluster0.okokymv.mongodb.net/"

function testo() {
    console.log("Connected  to MongoDB successfully")
}

const connectToMongo = ()  => {
    mongoose.connect(MongoURI, testo())
}

module.exports = connectToMongo;