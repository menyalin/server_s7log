const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, 'typeDefs.graphql')
const typeDefs = fs.readFileSync(filePath, 'utf-8')
const resolvers = require('./resolvers')
const subscriptions = require('./subscriptions')
const context = require('./context')

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('db connected'))
    .catch(err => console.log('error connction db', err.message))

const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions,
    context
})

server.listen(4000)