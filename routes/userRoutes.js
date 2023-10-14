const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const secretKey = 'BookStore';




//SIGNUP

router.post('/signup', async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const newUser = await User.create({
      name,
      email,
      mobile,
      password,
    });



    res.status(200).json({
      message: 'Registration Successful',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  try {
    if (user && user.password === password) {

      jwt.sign({ email: email, id: user._id, role: user.role }, "BookStore", { expiresIn: '1d' }, (error, token) => {
        if (error) {
          console.error("JWT Token Generation Error:", error);
          return res.json({ message: "Token not generated" });
        } else {
          return res.json({ message: "Login successful", token: token, data: user });
        }
      });
    } else {
      return res.status(401).json({ message: "Login failed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});











//AUTHENTICATED USER PROFILE VIEW


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







// Fetch user profile
router.post('/user-profile', authenticateToken, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});





// Update user profile
router.post('/update-profile', authenticateToken, async (req, res) => {
  try {

    if (req.user.id !== req.body.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }


    await User.findByIdAndUpdate(req.user.id, req.body.updatedUserData);

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});




// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.decoded = decoded;
    next();
  });
};




//  Get the list of users
router.get('/get-users', verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, '_id name email mobile');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





//  Delete a user
router.delete('/delete-user', verifyToken, async (req, res) => {
  const { userId } = req.body;

  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






module.exports = router;





























