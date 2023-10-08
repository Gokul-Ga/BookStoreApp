const express = require('express');
const router = express.Router();
const multer = require('multer');
const Book = require('../models/bookModel');
const Rental = require('../models/rentalModel');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const jwt = require('jsonwebtoken');


const secretKey = 'BookStore';


// Create a new book
router.post('/addbook', upload.single('bookImage'), async (req, res) => {
    try {
      const {
        bookName,
        genre,
        author,
        language,
        description,
        isbn,
        publicationYear,
        numberOfCopies,
      } = req.body;
  
      const bookExists = await Book.findOne({ bookName });
  
      if (bookExists) {
        return res.status(400).json({ message: 'Book with the same name already exists' });
      }
  
      if (!bookName) {
        return res.status(400).json({ message: 'Book name is required' });
      }
  
      const newBook = new Book({
        bookName,
        genre,
        author,
        language,
        description,
        isbn,
        publicationYear,
        numberOfCopies,
        bookImage: {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        },
      });

    jwt.verify(req.body.token, "BookStore", (error, decoded) => {
      if (decoded && decoded.role === "admin") {
        newBook.save();

        res.status(201).json({ message: 'Book added successfully' });
      } else {
        res.json({ message: "Unauthorized User" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch all books
router.get('/getbooks', async (req, res) => {
  try {
    const books = await Book.find();

    const booksWithImageData = books.map((book) => ({
      ...book.toObject(),
      bookImage: {
        data: book.bookImage.data.toString('base64'),
        contentType: book.bookImage.contentType,
      },
    }));

    res.status(200).json(booksWithImageData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a specific book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const bookWithImageData = {
      ...book.toObject(),
      bookImage: {
        data: book.bookImage.data.toString('base64'),
        contentType: book.bookImage.contentType,
      },
    };

    res.status(200).json(bookWithImageData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update the number of copies of a book by ID
router.put('/updateCopies/:id', async (req, res) => {
  try {
    const { numberOfCopies } = req.body;

    const updatedBook = {
      numberOfCopies,
    };

    const result = await Book.findByIdAndUpdate(req.params.id, updatedBook, {
      new: true, // Return the updated book
    });

    if (!result) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Number of copies updated successfully', book: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a book by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await Book.findByIdAndRemove(req.params.id);

    if (!result) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a rental for a book
router.post('/rentBook', async (req, res) => {
  try {
    const { bookId,bookname, userName, contactNumber } = req.body;

  
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const existingRental = await Rental.findOne({ book: bookId, userId: req.body.userId });
    if (existingRental) {
      return res.status(409).json({ message: 'You have already rented this book' });
    }

   
    const newRental = new Rental({
      book: bookId,
      bookname,
      userId: req.body.userId,
      userName,
      contactNumber,
    });

   
    await newRental.save();

   
    if (book.numberOfCopies > 0) {
      book.numberOfCopies -= 1;
      await book.save();
    } else {
      return res.status(404).json({ message: 'No available copies of the book' });
    }

    res.status(201).json({ message: 'Book Rented successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






// ADMIN - Fetch all books

router.get('/getbooks', async (req, res) => {
  try {
    const books = await Book.find();

    const booksWithImageData = books.map((book) => ({
      ...book.toObject(),
      bookImage: {
        data: book.bookImage.data.toString('base64'),
        contentType: book.bookImage.contentType,
      },
    }));

    res.status(200).json(booksWithImageData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



//Delete Book

router.delete('/getbooks/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      
      return res.status(404).json({ message: 'Book not found' });
    }

    
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});








module.exports = router;























module.exports = router;








