const mongoose = require('mongoose')
const Book = require('../models/book.model')

exports.getAllBooks = async (req, res) => {
  const books = await Book.find({})
  res.send(books)
}

exports.getBooks = async (req, res) => {
  let bookId = req.params.id
  if (!mongoose.Types.ObjectId.isValid(bookId))
    return res.status(400).send('Invalid object id')

  let books = await Book.findById(bookId)
  if (!books) return res.status(404).send('Book not found')

  return res.send(books)
}

exports.insertBooks = async (req, res) => {
  const { name, year, author, summary, publisher, pageCount } = req.body
  const book = new Book({
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
  })
  await book.save()
  return res.send(book)
}
