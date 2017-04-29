var cheerio = require('cheerio');
var request = require('request-promise');
var asyncP = require('async-promises');

module.exports = {
  getApartmentRentPrices: getApartmentRentPrices,
};

function getApartmentRentPrices(apartments) {
  return asyncP.each(apartments, function (apartment) {
    return getApartmentRentPrice(apartment);
  });
}

function getApartmentRentPrice(apartment) {
  return getApartmentFinderDotComUrl(apartment.name)
    .then(function (apartmentFinderDotComUrl) {
      return request(apartmentFinderDotComUrl);
    })
    .catch(function () {
      console.error('Wrong apartmentfinder.com url.');
      return null;
    })
    .then(function (apartmentFinderDotComHTML) {
      if (!apartmentFinderDotComHTML) {
        return apartment;
      }

      var $ = cheerio.load(apartmentFinderDotComHTML);
      var rent = $('.rent').first().text().trim();
      rent = rent.split(' - ')[0]; // if it's a range, take lower end of range
      rent = rent.slice(1); // remove $ from eg. '$800'
      rent = rent.replace(',', ''); // remove ','
      rent = Number(rent);
      apartment.rent = rent;
      return apartment;
    })
  ;
}

function getApartmentFinderDotComUrl(apartmentName) {
  return request
    .post('http://www.apartmentfinder.com/api/geography/search/', {
      json: {
        t: apartmentName,
        l: [-115.23835, 36.25502],
      }
    })
    .then(function (body) {
      return body[0].Address.BuildingName;
    })
    .catch(function () {
      console.error('Error with apartmentfinder.com autocomplete.');
      return apartmentName
               .split(' ')
               .map(function (str) {
                 return str.charAt(0).toUpperCase() + str.slice(1);
               })
               .join('-')
             ;
    })
    .then(function (name) {
      return 'http://www.apartmentfinder.com/Nevada/Las-Vegas-Apartments/' + name + '-Apartments';
    })
  ;
}
