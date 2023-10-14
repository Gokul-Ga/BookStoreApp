
const express = require('express');
const router = express.Router();
const Review = require('../models/reviewModel');



// Route to fetch reviews by book ID
router.get('/getReviews', async (req, res) => {
    try {
      const { bookId } = req.query;
  
      // Fetch reviews for the specified book ID
      const reviews = await Review.find({ bookId });
  
      // Send the reviews as a response
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });






// Add a new review
router.post('/addReview', async (req, res) => {
  const { bookId, userId,userName, content } = req.body;

  try {
    const review = await Review.create({ bookId, userId,userName, content });
    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
