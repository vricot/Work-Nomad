const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { workspotSchema } = require('./joiSchemas')
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const Workspot = require('./models/workspot');
const { stat } = require('fs');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/work-nomad', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateWorkspot = (req, res, next) => {
    const { error } = workspotSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/workspots', catchAsync(async (req, res) => {
    const allWorkspots = await Workspot.find({});
    res.render('workspots/index', { allWorkspots })
}));

app.get('/workspots/new', (req, res) => {
    res.render('workspots/new');
});

app.post('/workspots', validateWorkspot, catchAsync(async (req, res, next) => {
    //if(!req.body.workspot) throw new ExpressError('Invalid Workspot Data', 400)
    const workspot = new Workspot(req.body.workspot);
    await workspot.save();
    res.redirect(`/workspots/${workspot._id}`)
}))

app.get('/workspots/:id', catchAsync(async (req, res) => {
    const workspot = await Workspot.findById(req.params.id)
    res.render('workspots/show', { workspot });
}));

app.get('/workspots/:id/edit', catchAsync(async (req, res) => {
    const workspot = await Workspot.findById(req.params.id)
    res.render('workspots/edit', { workspot });
}));

app.put('/workspots/:id', validateWorkspot, catchAsync(async (req, res) => {
    const { id } = req.params;
    const workspot = await Workspot.findByIdAndUpdate(id, { ...req.body.workspot });
    res.redirect(`/workspots/${workspot._id}`);
}));

app.delete('/workspots/:id', catchAsync(async (req, res) => {
     const { id } = req.params;
     await Workspot.findByIdAndDelete(id);
     res.redirect('/workspots');
}));

app.post('/workspots/:id/reviews', catchAsync(async (req, res) => {
   const workspot = await Workspot.findById(req.params.id);const review = new Review(req.body.review);
   workspot.reviews.push(review);
   await review.save();
   await workspot.save();
   res.redirect(`/workspots/${workspot._id}`);
})) 

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No! Something Went Wrong!'
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
});