var express = require('express');
var yelp = require('yelp-fusion');
var config = require('./config.json');
var utilities = require('./utilities.js');
var app = express();

var YELP_CLIENT_ID = config.yelp.client_id;
var YELP_CLIENT_SECRET = config.yelp.client_secret;

app.use(express.static('public'));

app.get('/search', function (req, res) {
  var searchRequest = req.query;

  yelp
    .accessToken(YELP_CLIENT_ID, YELP_CLIENT_SECRET) // The access token is valid for 180 days, but I don't know how to cache it, and speed isn't too too important, so I'll just make the round trip to get it each time.
    .then(function (accessTokenResponse) {
      var yelpClient = yelp.client(accessTokenResponse.jsonBody.access_token);
      return yelpClient.search(searchRequest);
    })
    .then(function (yelpSearchResponse) {
      var apartments = yelpSearchResponse.jsonBody.businesses;
      return utilities.getApartmentRentPrices(apartments);
    })
    .then(function (apartments) {
      res.json(apartments);
    })
  ;
});

app.listen(3000, function () {
  console.log('Listening on port 3000...');
});
