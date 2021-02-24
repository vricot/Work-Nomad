const Workspot = require('../models/workspot');

module.exports.index = async (req, res) => {
    const allWorkspots = await Workspot.find({});
    res.render('workspots/index', { allWorkspots })
}

module.exports.renderNewForm = (req, res) => {
    res.render('workspots/new');
}

module.exports.createWorkspot = async (req, res, next) => {
    const workspot = new Workspot(req.body.workspot);
    workspot.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    workspot.author = req.user._id;
    await workspot.save();
    console.log(workspot);
    req.flash('success', 'Successfully added new workspot!')
    res.redirect(`/workspots/${workspot._id}`)
}

module.exports.showWorkspot = async (req, res) => {
    const workspot = await Workspot.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!workspot) {
        req.flash('error', 'Cannot find that workspot!')
        return res.redirect('/workspots');
    }
    res.render('workspots/show', { workspot });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const workspot = await Workspot.findById(req.params.id)
    if(!workspot) {
        req.flash('error', 'Cannot find that workspot!')
        return res.redirect('/workspots');
    }
    res.render('workspots/edit', { workspot });
}

module.exports.updateWorkspot = async (req, res) => {
    const { id } = req.params;
    const workspot = await Workspot.findByIdAndUpdate(id, { ...req.body.workspot });
    const imgs =  req.files.map(f => ({ url: f.path, filename: f.filename }));
    workspot.images.push(...imgs);
    await workspot.save();
    req.flash('success', 'Successfully updated workspot');
    res.redirect(`/workspots/${workspot._id}`);
}

module.exports.deleteWorkspot = async (req, res) => {
    const { id } = req.params;
    await Workspot.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted workspot');
    res.redirect('/workspots');
}