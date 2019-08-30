const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const md5 = require('md5')

const ActiveUsersSchema = new mongoose.Schema({
    socketId: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'Active'
    }
})

module.exports = mongoose.model('ActiveUsers', ActiveUsersSchema)