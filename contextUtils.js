const jwt = require('jsonwebtoken')

module.exports.getUser = async (token) => {
    if (token) {
        try {
            let user = await jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)
            return user
        } catch (err) {
            return null
        }
    } else null
}