const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Worksite = require('./models/worksite');

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


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/worksites', async (req, res) => {
    const allWorksites = await Worksite.find({});
    res.render('worksites/index', { allWorksites })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})