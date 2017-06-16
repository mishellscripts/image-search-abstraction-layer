// Template for searchResult document datastructure
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var searchResultSchema = new Schema({
  url: String,
  snippet: String,
  thumbnail: String,
  context: String
});

var model = mongoose.model('searchResult', searchResultSchema);

module.exports = model;