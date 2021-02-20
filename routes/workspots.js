const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { workspotSchema } = require('../joiSchemas');

const ExpressError = require('../utilities/ExpressError');
const Workspot = require('../models/workspot');


const validateWorkspot = (req, res, next) => {
    const { error } = workspotSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const allWorkspots = await Workspot.find({});
    res.render('workspots/index', { allWorkspots })
}));

router.get('/new', (req, res) => {
    res.render('workspots/new');
});

router.post('/', validateWorkspot, catchAsync(async (req, res, next) => {
    //if(!req.body.workspot) throw new ExpressError('Invalid Workspot Data', 400)
    const workspot = new Workspot(req.body.workspot);
    await workspot.save();
    req.flash('success', 'Successfully added new workspot!')
    res.redirect(`/workspots/${workspot._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const workspot = await Workspot.findById(req.params.id).populate('reviews');
    if(!workspot) {
        req.flash('error', 'Cannot find that workspot!')
        return res.redirect('/workspots');
    }
    res.render('workspots/show', { workspot });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const workspot = await Workspot.findById(req.params.id)
    if(!workspot) {
        req.flash('error', 'Cannot find that workspot!')
        return res.redirect('/workspots');
    }
    res.render('workspots/edit', { workspot });
}));

router.put('/:id', validateWorkspot, catchAsync(async (req, res) => {
    const { id } = req.params;
    const workspot = await Workspot.findByIdAndUpdate(id, { ...req.body.workspot });
    res.redirect(`/workspots/${workspot._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
     const { id } = req.params;
     await Workspot.findByIdAndDelete(id);
     req.flash('success', 'Successfully deleted workspot');
     res.redirect('/workspots');
}));

module.exports = router;
