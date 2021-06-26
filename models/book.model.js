const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
  },
  publisher: {
    type: String,
    require: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
})

module.exports = mongoose.model('Book', bookSchema)
