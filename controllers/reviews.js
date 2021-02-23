const Workspot = require('../models/workspot');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const workspot = await Workspot.findById(req.params.id);const review = new Review(req.body.review);
    review.author = req.user._id;
    workspot.reviews.push(review);
    await review.save();
    await workspot.save();
    req.flash('success', 'Successfully added new review!');
    res.redirect(`/workspots/${workspot._id}`);
 }

 module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Workspot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/workspots/${id}`);
}