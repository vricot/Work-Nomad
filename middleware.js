const { workspotSchema, reviewSchema } = require('./joiSchemas');
const ExpressError = require('./utilities/ExpressError');
const Workspot = require('./models/workspot');


 module.exports.isLoggedIn = (req, res, next) => {
     console.log("REQ.USER...", req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateWorkspot = (req, res, next) => {
    const { error } = workspotSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const workspot = await Workspot.findById(id);
    if (!workspot.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/workspots/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}





