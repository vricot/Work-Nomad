const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Workspot = require('../models/workspot');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');

const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));
 
 router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

 module.exports = router;