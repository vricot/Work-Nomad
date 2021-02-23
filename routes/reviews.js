const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview } = require('../middleware')
const Workspot = require('../models/workspot');
const Review = require('../models/review');

const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

router.post('/', validateReview, catchAsync(async (req, res) => {
    const workspot = await Workspot.findById(req.params.id);const review = new Review(req.body.review);
    workspot.reviews.push(review);
    await review.save();
    await workspot.save();
    req.flash('success', 'Successfully added new review!');
    res.redirect(`/workspots/${workspot._id}`);
 }));
 
 router.delete('/:reviewId', catchAsync(async (req, res) => {
     const { id, reviewId } = req.params;
     await Workspot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
     await Review.findByIdAndDelete(reviewId);
     req.flash('success', 'Successfully deleted review!');
     res.redirect(`/workspots/${id}`);
 }));

 module.exports = router;