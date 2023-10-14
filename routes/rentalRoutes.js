
const express = require('express');
const router = express.Router();
const Rental = require('../models/rentalModel');
const Book = require('../models/bookModel');
const jwt = require('jsonwebtoken');
const secretKey = 'BookStore';


router.get('/checkRental', async (req, res) => {
  try {
    const { bookId, userId } = req.query;

    // Check if the book with the specified ID is rented by the user
    const rental = await Rental.findOne({ book: bookId, userId });

    if (rental) {
      res.status(200).json({ hasRented: true });
    } else {
      res.status(200).json({ hasRented: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





const authenticateToken = (req, res, next) => {
  const token = req.body.token; 
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    req.user = {
      id: decoded.id, 
    
    };
    next();
  });
};



router.post('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; 

    // Find rentals for the specified user
    const rentedBooks = await Rental.find({ userId }).populate('book');

    res.status(200).json(rentedBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// Fetch all rentals
router.get('/allrentals', async (req, res) => {
  try {
    const rentals = await Rental.find().populate('book', 'bookname').populate('userId', 'userName');
    res.json(rentals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a rental by ID
router.delete('/allrentals/:id', async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    const book = await Book.findById(rental.book);
    if (book) {
      book.numberOfCopies += 1;
      await book.save();
    }

    await rental.remove();
    res.json({ message: 'Rental deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});









  







module.exports = router;
