const bookController = require('../controllers/book.controller')
const express = require('express')
const app = express.Router()


app.get('/', bookController.getAllBooks)
app.get('/:id', bookController.getBooks)
app.post('/', bookController.insertBooks)


module.exports = app
