angular
  .module('apartmentFinder', [])
  .controller("MainController", MainController)
;

function MainController($http, Utilities) {
  var vm = this;

  vm.searchCriteria = {
    latitude: '',
    longitude: '',
    radius: 15,
    categories: 'apartments',
    limit: 50,
  };

  vm.results = [];

  vm.search = function (searchCriteria) {
    var adjustedSearchCriteria = angular.copy(searchCriteria);
    adjustedSearchCriteria.radius = Math.floor(Utilities.getMeters(searchCriteria.radius)).toString();

    $http
      .get('/search', {
        params: adjustedSearchCriteria,
      })
      .then(function (response) {
        vm.results = response.data;
        vm.results.forEach(function (apartment) {
          apartment.distance = Utilities.getMiles(apartment.distance);
        });
        Utilities.getScores(vm.results);
        Utilities.sortByScores(vm.results);
      })
    ;
  };
}

// opt in to bootstrap popover
$(function () {
  $('[data-toggle="popover"]').popover({ html: true });
});
