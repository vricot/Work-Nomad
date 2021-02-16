const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const { dollarsigns } = require('./dollarRange');
const Workspot = require('../models/workspot');


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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Workspot.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const workspot = new Workspot({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/81925701',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque laboriosam totam delectus nesciunt repellendus ut quod similique nostrum accusamus veniam dicta at optio itaque tempora amet quo eaque, nulla obcaecati!',
            priceRange: `${sample(dollarsigns)}`
        })
        await workspot.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})