const { getUser } = require('./contextUtils')
const { pubsub } = require('./pubsub')

module.exports = {
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
}