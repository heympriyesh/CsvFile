const mongoose = require('mongoose');

const multerschema = new mongoose.Schema({
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    path: String,
    filename: String,
    size: Number
});

const Multers = mongoose.model("multer", multerschema);
module.exports = Multers