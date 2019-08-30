const { pubsub } = require('../server')


module.exports.getPosts = async (parent, args, { Post, currentUser }, info) => {
    //  console.log('[getPosts]: ', currentUser)
    const posts = await Post
        .find({})
        .sort({ createdDate: 'desc' })
        .populate({ path: 'createdBy', model: 'User' })
    return posts
} 