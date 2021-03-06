const User = require('./models/User')
const ActiveUsers = require('./models/ActiveUsers')
const { getUser } = require('./contextUtils')

module.exports = async ({ req, connection }) => {
    const models = {
        User,
        ActiveUsers
    }
    if (connection && connection.context) {
        return connection.context
    }
    let token = null
    if (req) token = req.get('authorization')
    if (connection) {
        console.log('[connection authorization] : ', connection.authorization)
        token = connection.authorization
    }
    if (token) {
        const user = await getUser(token)
        if (user) {
            Object.assign(models, { currentUser: user })
        }
    }
    return models
}