const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', 
    required: true,
  },
  bookname: {
    type: mongoose.Schema.Types.ObjectId,
    type: String,
    ref: 'Book', 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  userName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  rentalDate: {
    type: Date,
    default: Date.now,
  },
  returnStatus: {
    type: Boolean,
    default:false,
  },
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental;
