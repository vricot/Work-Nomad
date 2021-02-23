const express = require('express');
const router = express.Router();
const workspots = require('../controllers/workspots');
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, isAuthor, validateWorkspot } = require('../middleware');

const Workspot = require('../models/workspot');

router.get('/', catchAsync(workspots.index));

router.get('/new', isLoggedIn, workspots.renderNewForm);

router.post('/', isLoggedIn, validateWorkspot, catchAsync(workspots.createWorkspot));

router.get('/:id', catchAsync(workspots.showWorkspot));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(workspots.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateWorkspot, catchAsync(workspots.updateWorkspot));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(workspots.deleteWorkspot));

module.exports = router;
