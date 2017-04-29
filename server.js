var express = require('express');
var yelp = require('yelp-fusion');
var config = require('./config.json');
var app = express();

var CLIENT_ID = config.client_id;
var CLIENT_SECRET = config.client_secret;

app.use(express.static('public'));

app.get('/search', function (req, res) {
  var searchRequest = req.query;

  yelp.accessToken(CLIENT_ID, CLIENT_SECRET).then(function (response) {
    var client = yelp.client(response.jsonBody.access_token);

    client.search(searchRequest).then(function (response) {
      var businesses = response.jsonBody.businesses;
      res.json(businesses);
    });
  }).catch(function (err) {
    console.error(err);
  });
});

app.listen(3000, function () {
  console.log('Listening on port 3000...');
});
