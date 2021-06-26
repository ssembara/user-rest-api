const bookController = require('../controllers/book.controller')
const express = require('express')
const app = express.Router()

app.get('/', bookController.getAllBooks)
app.get('/:id', bookController.getBook)
app.post('/', bookController.insertBook)
app.put('/:id', bookController.updateBook)
app.delete('/:id', bookController.destroyBook)

module.exports = app
