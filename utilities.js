var cheerio = require('cheerio');
var rp = require('request-promise');
var async = require('async');

module.exports = {
  getApartmentPrices: getApartmentPrices,
};

function getApartmentPrices(apartments, res) {
  async.each(apartments, function (apartment, callback) {
    getApartmentPrice(apartment)
      .then(function () {
        console.log(apartment.name + ' price: ', apartment.price);
        callback(null, apartment);
      })
      .catch(function (err) {
        console.error('error with ' + apartment.name);
        callback('error');
      })
    ;
  }, function (error, apartments) {
    console.log('apartments: ', apartments);
    res.json(apartments);
  });
}

function getApartmentPrice(apartment) {
  return getApartmentFinderDotComUrl(apartment.name)
    .then(function (apartmentFinderDotComUrl) {
      return rp(apartmentFinderDotComUrl);
    })
    .then(function (body) {
      var $ = cheerio.load(body);
      var price = $('.rent').first().text().trim();
      price = price.split(' - ')[0]; // if it's a range, take lower end of range
      price = price.slice(1); // remove $ from eg. '$800'
      price = price.replace(',', ''); // remove ','
      price = Number(price);
      apartment.price = price;
    })
  ;
}

function getApartmentFinderDotComUrl(apartmentName) {
  return rp
    .post('http://www.apartmentfinder.com/api/geography/search/', {
      json: {
        t: apartmentName + ' las vegas',
        l: [-115.23835, 36.25502],
      }
    })
    .then(function (err, response, body) {
      var name;

      if (body && body[0]) {
        name = body[0].Address.BuildingName;
      } else {
        name = apartmentName
                .split(' ')
                .map(function (str) {
                  return str.charAt(0).toUpperCase() + str.slice(1);
                })
                .join('-')
              ;
      }

      return 'http://www.apartmentfinder.com/Nevada/Las-Vegas-Apartments/' + name + '-Apartments';
    })
  ;
}
