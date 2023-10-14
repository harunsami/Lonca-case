const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vendorSchema = new Schema({
    id: String,
    name: String
})

const Vendor = mongoose.model('Vendor', vendorSchema)

module.exports = Vendor