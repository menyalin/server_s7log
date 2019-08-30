const pubsub = require('../pubsub')

module.exports.getMessages = async (parent, args, { ChatMessage }, info) => {
    const messages = await ChatMessage.find().populate({ path: 'author', model: 'User' })
    return messages
}
module.exports.sendChatMessage = async (_, { text }, { ChatMessage, currentUser }) => {
    const newMessage = await new ChatMessage({
        text,
        author: currentUser._id
    });
    await newMessage.save()
    pubsub.publish('chat_message_added', { chatMessageAdded: newMessage })
    return newMessage

}