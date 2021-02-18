const mongoose = require('mongoose');
const Review = require('./review');
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

WorkspotSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Workspot', WorkspotSchema);