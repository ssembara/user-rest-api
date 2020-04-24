// Dependency
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const timeZone = require('mongoose-timezone')
const uniqueValidator = require('mongoose-unique-validator')

// Get the Schema constructor
const Schema = mongoose.Schema

// Using Schema constructor, create a userSchema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('email is invalid')
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
      default: 'Available',
    },
    avatar: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

// schemaPlugin
userSchema.plugin(timeZone, { paths: ['timestamps'] }, uniqueValidator)

userSchema.methods.toJSON = function() {
  var obj = this.toObject()
  delete obj.password
  return obj
}

// authToken JWT
userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
  return token
}

// findCredentials
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Login failed!')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Login failed!')
  }

  return user
}

// bcryptPassword
userSchema.pre('save', async function(next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 6)
  }

  next()
})

const User = mongoose.model('User', userSchema) // Create model from the schema
module.exports = User // Export model
