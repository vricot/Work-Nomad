const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorksiteSchema = new Schema({
    title: String,
    hours: String,
    priceRange: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Worksite', WorksiteSchema);