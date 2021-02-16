const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Workspot = require('./models/workspot');

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

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/workspots', async (req, res) => {
    const allWorkspots = await Workspot.find({});
    res.render('workspots/index', { allWorkspots })
});

app.get('/workspots/new', (req, res) => {
    res.render('workspots/new');
});

app.post('/workspots', async (req, res) => {
    const workspot = new Workspot(req.body.workspot);
    await workspot.save();
    res.redirect(`/workspots/${workspot._id}`)
})

app.get('/workspots/:id', async (req, res) => {
    const workspot = await Workspot.findById(req.params.id)
    res.render('workspots/show', { workspot });
});

app.get('/workspots/:id/edit', async (req, res) => {
    const workspot = await Workspot.findById(req.params.id)
    res.render('workspots/edit', { workspot });
});

app.put('/workspots/:id', async (req, res) => {
    const { id } = req.params;
    const workspot = await Workspot.findByIdAndUpdate(id, { ...req.body.workspot });
    res.redirect(`/workspots/${workspot._id}`);
});

app.delete('/workspots/:id', async (req, res) => {
     const { id } = req.params;
     await Workspot.findByIdAndDelete(id);
     res.redirect('/workspots');
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
})