const express = require('express');
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true, 
    useCreateIndex : true,
    useUnifiedTopology : true
});

const db = mongoose.connection;
db.on("error" , console.error.bind(console), "connection error:")
db.once("open", () => {
    console.log("Database connected");
})



const app = express();

// setters
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true}));

app.get('/' , (req,res) => {
    res.render('home');
})

app.get('/campground' , async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index' , { campgrounds });
})

app.get("/campground/new", (req, res) => {
    res.render('campground/new');
})

app.post("/campground", async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campground/${campground._id}`);
})

app.get('/campground/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campground/show' , { campground });
})

//////////////////////////////////////////////////////////////
app.get('/campground/:id/edit' , async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campground/edit' , { campground });
})


app.post('/campground/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campground/edit', { campground });


    // const campground = new Campground(req.body.campground);
    // await campground.save();
    // res.redirect(`/campground`);
})
//////////////////////////////////////////////////////////////



app.get('/makecampground' , async (req,res) => {
    const camp = new Campground({ title: 'My Backyard', description:  'Cheap camping'});
    await camp.save();
    res.send(camp);
})



app.listen(3000, () => {
    console.log("Serving on port 3000");
})