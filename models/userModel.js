const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name: {
        type: String,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    mobile: {
        type: Number,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        default: 'user', 
      },
})
const userModel=mongoose.model('User', userSchema)
module.exports = userModel