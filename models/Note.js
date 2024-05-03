const { type } = require("@testing-library/user-event/dist/type");
const mongoose = require("mongoose");
const { Schema } = mongoose

const NotesSchema = new mongoose.Schema({
    // user has been added to identify the notes of the referred user.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,        
    },
    tag:{
        type: String,
        default: 'General'
    }    
})

module.exports = mongoose.model('notes', NotesSchema);