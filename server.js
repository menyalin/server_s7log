const { ApolloServer, AuthenticationError, UserInputError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'typeDefs.graphql')
const typeDefs = fs.readFileSync(filePath, 'utf-8')
const resolvers = require('./resolvers')
const pubsub = require('./pubsub')

const User = require('./models/User')
const Post = require('./models/Post')
const ChatMessage = require('./models/ChatMessage')
const ActiveUsers = require('./models/ActiveUsers')

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log('db connected'))
    .catch(err => console.log('errpr connction db', err.message))

const getUser = async (token) => {
    if (token) {
        try {
            let user = await jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)
            return user
        } catch (err) {
            return null
        }
    } else null
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
        onConnect: async (connectionParams, webSocket, context) => {
            const user = await getUser(connectionParams.authorization)
            await ActiveUsers.create({
                socketId: context.request.headers['sec-websocket-key'],
                user
            })
            const users = await ActiveUsers.find({ status: 'Active' })
            
            pubsub.publish('changeActiveUsers', { changeActiveUsers: users })
            // console.log('[on connect context]', context.request.headers['sec-websocket-key'])
            // console.log('[on connect context]', connectionParams)
        },
        onDisconnect: async (webSocket, context) => {
            await ActiveUsers.findOneAndUpdate({ socketId: context.request.headers['sec-websocket-key'] }, { status: 'closed' })
            // console.log('[on disconnect context]', context.request.headers['sec-websocket-key'])
            const users = await ActiveUsers.find({ status: 'Active' })
            pubsub.publish('changeActiveUsers', { changeActiveUsers: users })
        }
    },
    context: async ({ req, connection }) => {
        const models = {
            User,
            Post,
            ChatMessage,
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
})

server.listen(4000)