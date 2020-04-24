const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const authUser = async (req, res, next) => {
  try {
    // getTokenFromHeader
    const token = req.header('Authorization').replace('Bearer ', '')
    // verifyToken
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findOne({ _id: decoded._id })
    if (!user) {
      throw new Error('user not found')
    }

    req.token = token
    req.user = user
    next()
  } catch (error) {
    res.status(401).send({
      status: res.statusCode,
      messages: 'Authorization Failed!, Token is Not Valid',
    })
  }
}

module.exports = authUser
