// Dependency
const mongoose = require('./config/mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

// Config
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Static files path
app.use(express.static(__dirname + '/public'))

// Router 
app.use('/api/users', require('./routes/user'))
app.use('/api/books', require('./routes/book.route'))

// Listen server
const port = 3000
app.listen(port, () => {
  console.log(`Server is running in ${port}`)
})

module.exports = app