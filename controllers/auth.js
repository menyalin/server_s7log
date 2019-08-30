const jwt = require('jsonwebtoken')
const { AuthenticationError } = require('apollo-server')


module.exports.createToken = async (user) => {
    const token = await jwt.sign({
        "_id": user._id,
        "email": user.email
    }, process.env.JWT_SECRET, { expiresIn: '1d' })
    return token
}


module.exports.signupUser = async (parent, { name, email, password, roles }, { User }, info) => {
    const user = await User.findOne({ email })
    if (user) {
        throw new Error('email already exists!')
    }
    const newUser = await new User({ name, email, password, roles }).save()
    return newUser
}

module.exports.signinUser = async (_, { email, password }, { User }) => {
    const user = await User.findOne({ email })
    if (user && await user.isCorrectPassword(password)) {
        return ({
            token: await this.createToken(user)
        })
    } else {
        throw new Error('User not found')
    }
}

module.exports.getCurrentUser = async (_, args, context) => {
    const { User, currentUser } = context
    if (!currentUser) {
        throw new AuthenticationError('foul_token')
    } else {
        const user = await User.findById(currentUser._id)
            .populate({ path: 'favorites', model: 'Post' })
        return user
    }
}
module.exports.getActiveUsers = async (_, args, { ActiveUsers }) => {
    const users = await ActiveUsers.find({ status: 'Active' }).populate({ path: 'user', model: 'User' })
    return users
}