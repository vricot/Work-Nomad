const Workspot = require('../models/workspot');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    let perPage = 8;
    let pageQuery = parseInt(req.query.page);
    let pageNumber = pageQuery ? pageQuery : 1;
    const allWorkspots = await Workspot.find({});
    Workspot.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allWorkspots) {
        Workspot.countDocuments().exec(function (err, count) {
            if (err) {
                console.log(err);
            } else {
                res.render('workspots/index', { allWorkspots,
                current: pageNumber,
                pages: Math.ceil(count / perPage) 
            });
            }
        })
    })
    
}

module.exports.renderNewForm = (req, res) => {
    res.render('workspots/new');
}

module.exports.createWorkspot = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.workspot.location,
        limit: 1
    }).send();
    const workspot = new Workspot(req.body.workspot);
    workspot.geometry = geoData.body.features[0].geometry;
    workspot.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    workspot.author = req.user._id;
    await workspot.save();
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
    console.log(workspot);
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
    console.log(req.body);
    const workspot = await Workspot.findByIdAndUpdate(id, { ...req.body.workspot });
    const imgs =  req.files.map(f => ({ url: f.path, filename: f.filename }));
    workspot.images.push(...imgs);
    await workspot.save();
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await workspot.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
        console.log(workspot);
    }
    req.flash('success', 'Successfully updated workspot');
    res.redirect(`/workspots/${workspot._id}`);
}

module.exports.deleteWorkspot = async (req, res) => {
    const { id } = req.params;
    await Workspot.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted workspot');
    res.redirect('/workspots');
}