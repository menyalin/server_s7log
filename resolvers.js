const { signupUser, signinUser, getCurrentUser, getActiveUsers } = require('./controllers/auth')
const pubsub = require('./pubsub')

module.exports = {
    Query: {
        getCurrentUser,
        getActiveUsers
    },
    Mutation: {
        signinUser,
        signupUser
    },
    Subscription: {
        changeActiveUsers: {
            subscribe: () => pubsub.asyncIterator('changeActiveUsers')
        }
    }
}