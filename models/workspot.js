const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkspotSchema = new Schema({
    title: String,
    image: String,
    hours: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model('Workspot', WorkspotSchema);