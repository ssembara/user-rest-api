const Book = require('../models/book.model')
const request = require('supertest')
const expect = require('chai').expect
const app = require('../app')

describe('api/books', () => {
    beforeEach(async () => {
        await Book.deleteMany({})
    })

    describe('GET /', () => {

        it('should return all books', async () => {
            const books = [
                { name: "Laskar Pelangi", year: 2005, author: "Andrea Hirata", summary: "Lorem Ipsum", publisher: "Bentang Pustaka", pageCount: 529 },
                { name: "Edensor", year: 2007, author: "Andrea Hirata", summary: "Lorem Ipsum", publisher: "Bentang Pustaka", pageCount: 290 }
            ]

            await Book.insertMany(books);
            // console.log(books);
            const res = await request(app).get('/api/books')
            expect(res.status).to.equal(200)
            expect(res.body.length).to.equal(2)
        })

    })

    describe('GET /:id', () => {

        it('should return a book if valid id is passed', async () => {
            const book = new Book({
                name: "Maryamah Karpov",
                year: 2008,
                author: "Andrea Hirata",
                summary: "Lorem Ipsum",
                publisher: "Bentang Pustaka",
                pageCount: 504
            })

            await book.save()
            const res = await request(app).get(`/api/books/${book._id}`)
            expect(res.status).to.equal(200)
            expect(res.body).to.have.property('name', book.name)
        })

        it('should return 400 error when invalid object id is passed', async () => {
            const res = await request(app).get('/api/books/1')
            expect(res.status).to.equal(400);
        })

        it('should return 404 error when valid object id is passed but does not exist', async () => {
            const res = await request(app).get('/api/books/111111111111')
            expect(res.status).to.equal(404);
        })
    })

    describe('POST /', () => {
        it('should return book when the all request body is valid', async () => {
            const book = {
                name: "Maryamah Karpov",
                year: 2008,
                author: "Andrea Hirata",
                summary: "Lorem Ipsum",
                publisher: "Bentang Pustaka",
                pageCount: 504
            }

            const res = await request(app)
                .post('/api/books')
                .send(book)
            expect(res.status).to.equal(200)
            expect(res.body).to.have.property('_id')
            expect(res.body).to.have.property('name', 'test')
        })
    })
})
