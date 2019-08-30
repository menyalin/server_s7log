const { signupUser, signinUser, getCurrentUser, getActiveUsers } = require('./controllers/auth')
const { getMessages, sendChatMessage } = require('./controllers/Chat')
const { getPosts } = require('./controllers/post')
const POST_ADDED = 'POST_ADDED'
const pubsub = require('./pubsub')

module.exports = {
    Query: {
        getPosts,
        getCurrentUser,
        getMessages,
        getActiveUsers
    },
    Mutation: {
        signinUser,
        signupUser,
        sendChatMessage,
        async addPost(parent, { title, imageUrl, categories, description, creatorId }, { Post }, info) {
            const newPost = await new Post({
                title,
                imageUrl,
                categories,
                description,
                createdBy: creatorId
            }).save()
            pubsub.publish(POST_ADDED, { postAdded: newPost })
            return newPost
        }
    },
    Subscription: {
        postAdded: {
            subscribe: () => pubsub.asyncIterator([POST_ADDED])
        },
        chatMessageAdded: {
            subscribe: () => pubsub.asyncIterator('chat_message_added')
        },
        changeActiveUsers: {
            subscribe: () => pubsub.asyncIterator('changeActiveUsers')
        }
    }
}