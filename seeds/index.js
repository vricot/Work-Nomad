const mongoose = require('mongoose');
const Worksite = require('../models/worksite');

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
//Check why this function won't run:
const seedDB = async () => {
    await Worksites.deleteMany({});
    const w = new Worksite({ title: 'warm coffee' });
    await w.save();
}

seedDB();