const express = require('express');
const router = express.Router();
const workspots = require('../controllers/workspots');
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, isAuthor, validateWorkspot } = require('../middleware');
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Workspot = require('../models/workspot');

router.route('/')
    .get(catchAsync(workspots.index))
    .post(isLoggedIn, upload.array('image'), validateWorkspot, catchAsync(workspots.createWorkspot));
  
router.get('/new', isLoggedIn, workspots.renderNewForm);

router.route('/:id')
    .get(catchAsync(workspots.showWorkspot))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateWorkspot, catchAsync(workspots.updateWorkspot))
    .delete(isLoggedIn, isAuthor, catchAsync(workspots.deleteWorkspot));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(workspots.renderEditForm));

module.exports = router;
