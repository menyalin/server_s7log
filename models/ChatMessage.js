const mongoose = require('mongoose')

const chatMessageSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        trim: true,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('chatMessage', chatMessageSchema)