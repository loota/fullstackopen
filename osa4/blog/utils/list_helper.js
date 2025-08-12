const _ = require('lodash')

// Task assignment requires us to have this dummy function
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length < 1) {
    return 0
  }

  return blogs.reduce((accu, val) => {
    return accu + val.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((accu, val) => {
    if (Object.keys(accu).length === 0) {
      accu = val
    }
    return accu.likes > val.likes ? accu : val
  }, {})
}

const mostBlogs = (blogs) => {
  const authors = blogs.map((val) => {
    return val.author
  })
  let found = false
  const authorData = []
  for (let i of authors) {
    found = false
    for (let j of authorData) {
      if (j.author === i) {
        j.blogs++
        found = true
      }
    }
    if (!found) {
      authorData.push({ author: i, blogs: 1 })
    }
  }

  const authorDataOfMostProlific = authorData.reduce((accu, val) => {
    return accu.blogs > val.blogs ? accu : val
  }, authorData[0])
  return authorDataOfMostProlific
}

const mostLikes = (blogs) => {
  const grouped = blogs.reduce((accu, val) => {
    const found = _.find(accu, (i) => i.author === val.author)
    if (found) {
      found.likes += val.likes
      return accu
    } else {
      const authorAndLikes = { author: val.author, likes: val.likes }
      return accu.concat(authorAndLikes)
    }
  }, [])

  const sorted = _.sortBy(grouped, 'likes')

  return sorted.reverse()[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}