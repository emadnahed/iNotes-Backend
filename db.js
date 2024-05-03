const mongoose = require('mongoose');
const MongoURI = process.env.REACT_APP_MONGO_URI


const connectToMongo = ()  => {
    mongoose.connect(MongoURI, testo())
}

function testo() {
    console.log("Connected  to MongoDB successfully")
}
module.exports = connectToMongo