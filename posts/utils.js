const { Posts } = require('./models')

const formatPostObj = (posts, amount) => {
    if (posts.length < amount + 1) {
      const apiRpr = posts.map(post => {
          return post.apiRpr()
      })

   const returnObj = Object.assign({}, {posts: apiRpr}, {
      final: true
   })

   return returnObj
  }

    const returnPosts = posts.slice(0, amount)

    const apiRpr = returnPosts.map(post => {
        return post.apiRpr()
    })

    const returnObj = Object.assign({}, {posts: apiRpr}, {
        final: false
    })

    return returnObj
}

module.exports = {formatPostObj}
