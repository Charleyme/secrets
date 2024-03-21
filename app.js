require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));


mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema({
   email : String,
   password : String  
});

userSchema.plugin(encrypt, { 
    secret: process.env.SECRET_KEY, 
    encryptedFields: ["password"] 
});

const User = new mongoose.model('User', userSchema);


app.get('/', (req, res) =>{
    res.render('home');
});


app.get('/login', (req, res) =>{
    res.render('login');
});

app.post('/login', async (req, res) =>{
    const userEmail = req.body.useremail;
    const userPassword = req.body.userpassword;
    const user = await User.findOne({email: userEmail});
    if (user){
        if(user.password === userPassword){
            res.render('secrets');
        }else{
            console.log("user not found");
        }
    }else{
        console.log("user not found")
    }

});

app.get('/register', (req, res) =>{
    res.render('register');
});

app.post('/register', async(req, res) =>{
    const userEmail = req.body.useremail;
    const userPassword = req.body.userpassword;
    
    const newUser = new User({
        email: userEmail,
        password: userPassword

    });
    await newUser.save();
    res.render('secrets');
  
});














app.listen(3000, function(){
    console.log("Server started at port 3000");
});