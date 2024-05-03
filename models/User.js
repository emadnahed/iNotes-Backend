const { type } = require("@testing-library/user-event/dist/type");
const mongoose = require("mongoose");
const { Schema } = mongoose

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
        
    },
    password:{
        type: String,
        required: true
    },
    date: {
        type: Date,        
    }
})

const User = mongoose.model('user', userSchema);
User.createIndexes()
module.exports = User;