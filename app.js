const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const app = express();
const morgan = require('morgan');
app.use(morgan('dev'));
require('dotenv').config();



app.use(cors());
const path = require('path'); 
app.use(express.static(path.join(__dirname,'/build')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type ");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
})
const db = require('./db/mongodb');
const bookRoutes = require('./routes/bookRoutes')
app.use('/api', require('./routes/userRoutes'));
app.use('/api/books', bookRoutes);
app.use('/api/rentals', require('./routes/rentalRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname,'/build/index.html'));
  });

const PORT = 5000;



app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
