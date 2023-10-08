const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
  bookName: {
    type: String,
  },
  genre: String,
  author: String,
  language: String,
  description: String,
  isbn: Number,
  publicationYear: Number,
  bookImage: {
    data: Buffer,
    contentType: String,
  },
  numberOfCopies: {
    type: Number,
    default: 1, 
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;












