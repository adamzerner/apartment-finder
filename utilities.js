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
      console.error(apartment.name + ': Wrong apartmentfinder.com url.');
      return null;
    })
    .then(function (apartmentFinderDotComHTML) {
      if (!apartmentFinderDotComHTML) {
        return apartment;
      }

      var $ = cheerio.load(apartmentFinderDotComHTML);
      var rent;

      if ($('#floorplanTabContainer .rent').length) {
        rent = $('#floorplanTabContainer .rent').first().text().trim();
        rent = rent.split(' - ')[0]; // if it's a range, take lower end of range
        rent = rent.slice(1); // remove $ from eg. '$800'
        rent = rent.replace(',', ''); // remove ','
        rent = Number(rent);
        apartment.rent = rent;
      } else {
        console.error(apartment.name + ': couldn\'t find rent price on page.');
      }

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
      console.error(apartment.name + ': Error with apartmentfinder.com autocomplete.');
      return apartmentName;
    })
    .then(function (name) {
      name = name
               .split(' ').join('-') // add dashes
               .replace('-Apartments', '') // remove redundant "-Apartments"
               .replace(/\./g, '') // remove dots
             ;
      return 'http://www.apartmentfinder.com/Nevada/Las-Vegas-Apartments/' + name + '-Apartments';
    })
  ;
}
