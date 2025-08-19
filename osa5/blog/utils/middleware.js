const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '')
    if (!token) {
      return response.status(401).json({ error: 'token required' }).end()
    }
    try {
      request.decodedToken = jwt.verify(token, process.env.SECRET)
      if (!request.decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' }).end()
      }
    } catch (error) {
      if (error.name ===  'JsonWebTokenError') {
        response.status(401).json({ error: 'token malformed' }).end()
      }
    }
    next()
  } else {
    request.decodedToken = null
    next()
  }
}

const userExtractor = async (request, response, next) => {
  request.user = null
  if (request.decodedToken && request.decodedToken.id) {
    const user = await User.findById(request.decodedToken.id)
    request.user = user
  }
  next()
}

module.exports = { tokenExtractor, userExtractor }