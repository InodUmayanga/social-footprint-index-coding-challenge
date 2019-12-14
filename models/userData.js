// creating a data model to save the json boject returned from the url
const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    content: { type: JSON, default: 'No Content' }
});

module.exports = mongoose.model('dataFile', dataSchema);
