// Requirements and initialization/setup of app
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var googleImages = require('google-images');
var searchHistory = require('./models/searchHistory');
var searchResult = require('./models/searchResult');
var app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

var client = new googleImages('012401960768821215521:uwohsp8poko', 'AIzaSyCDPgTYiKFEbF1kVNBVKCNA1Ff6oE1PSkE');

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


// Search for given string and return array of results
app.get("/api/search/:query", function (req, res) {
  var query = req.params.query;
  var queryData = query.split("&offset=");
  var timestamp = Date.now();
  // Perform search
  client.search(query, {page: queryData[1]}).then(function(results) {
    var showResults = [];
    results.forEach(function(result) {
        showResults.push(new searchResult({
          url: result.url,
          snippet: result.description,
          thumbnail: result.thumbnail.url, 
          context: result.parentPage
        }));
    });
    res.send(showResults);
  });
  // Save search
  var search = new searchHistory({
    term: queryData[0], 
    when: new Date(timestamp).toISOString()
  });
  search.save();
});


// Return list of last 10 searches
app.get("/api/latest", function (req, res) {
  searchHistory.find().select({ _id: 0, term: 1, when: 1 })
    .sort({when: -1}).limit(10).then(function(history) {
    res.json(history);
  });
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
