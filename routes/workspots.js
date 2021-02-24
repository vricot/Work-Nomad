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
    // .post(isLoggedIn, validateWorkspot, catchAsync(workspots.createWorkspot));
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files);
        res.send("IT WORKEDDDD!!!")
    })

router.get('/new', isLoggedIn, workspots.renderNewForm);

router.route('/:id')
    .get(catchAsync(workspots.showWorkspot))
    .put(isLoggedIn, isAuthor, validateWorkspot, catchAsync(workspots.updateWorkspot))
    .delete(isLoggedIn, isAuthor, catchAsync(workspots.deleteWorkspot));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(workspots.renderEditForm));

module.exports = router;
