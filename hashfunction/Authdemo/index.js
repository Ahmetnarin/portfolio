const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');


mongoose.connect('mongodb://localhost:27017/authDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN");
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR");
        console.log(err);
    })


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'notagoodsecret',
    resave: false,
    saveUninitialized: true
}));

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
}

app.get('/', (req, res) => {
    res.send("THIS IS THE HOMEPAGE!!")
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.get('/after_reg', (req, res) => {
    res.render("after_reg")
})

app.post("/register", async (req, res) => {
    const { password, username } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash
    })
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login')
})


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // User.findByUsernameAndValidate(username, password);
    const user = await User.findOne({ username });
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        req.session.user_id = user._id;
        res.redirect('/secret');
    }
    else {
        res.redirect('/login')
    }
})


app.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/login');

})



app.get('/secret', requireLogin, (req, res, next) => {
    res.render('secret')
})

app.get('/topsecret', requireLogin, (req , res) => {
    res.send('Top secret');
} )

app.listen(3000, () => {
    console.log("SERVING YOUR APP!");
})