const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const md5 = require('md5')

const userSchema = new mongoose.Schema({
    email: {
        index: true,
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String
    },
    avatar: {
        type: String
    },
    joinDate: {
        type: Date,
        default: Date.now

    },
    favorites: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Post'
    },
    roles: {
        type: [String]
    }

})

userSchema.methods.isCorrectPassword = async function (pass) {
    const res = await bcrypt.compare(pass, this.password)
    return res
}
userSchema.pre('save', function (next) {
    this.avatar = `http://gravatar.com/avatar/${md5(this.email)}?d=identicon`
    next();
})
userSchema.pre('save', function (next) {
    let tmpUser = this
    if (this.isModified('password')) {
        bcrypt.hash(tmpUser.password, 10, (err, hash) => {
            tmpUser.password = hash
            next()
        })
    } else {
        next()
    }
})

module.exports = mongoose.model('User', userSchema)