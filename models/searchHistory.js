// Template for searchHistory document datastructure
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var searchHistorySchema = new Schema({
  term: String,
  when: String
});

var model = mongoose.model('searchHistory', searchHistorySchema);

module.exports = model;