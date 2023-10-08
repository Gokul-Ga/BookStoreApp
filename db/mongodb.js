const mongoose=require('mongoose')
mongoose.connect("mongodb+srv://Gokul:Gokul1234@cluster0.iqnujpm.mongodb.net/Book_Store?retryWrites=true&w=majority")
.then(()=>{
console.log('Connected to MongoDB Atlas');       
})
.catch(()=>{
    console.log('Error connecting to MongoDB Atlas');
})