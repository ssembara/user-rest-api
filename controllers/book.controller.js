const mongoose = require('mongoose')
const Book = require('../models/book.model')

exports.getAllBooks = async (req, res) => {
  const books = await Book.find({})
  res.send(books)
}

exports.getBook = async (req, res) => {
  let bookId = req.params.id
  if (!mongoose.Types.ObjectId.isValid(bookId))
    return res.status(400).send('Invalid object id')

  let books = await Book.findById(bookId)
  if (!books) return res.status(404).send('Book not found')

  return res.send(books)
}

exports.insertBook = async (req, res) => {
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

exports.updateBook = async (req, res) => {
  let bookId = req.params.id
  try {
    const book = await Book.findOneAndUpdate(bookId, req.body, {new : true})
    return res.send(book) 
  } catch (error) {
    return res.status(500).send(error)
  }
}

exports.destroyBook = async (req, res) => {
  let bookId = req.params.id;
  await Book.findByIdAndDelete(bookId);
  return res.send("Book deleted");
};
