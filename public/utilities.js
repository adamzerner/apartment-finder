angular
  .module('apartmentFinder')
  .factory('Utilities', Utilities)
;

function Utilities() {
  return {
    getMiles: getMiles,
    getMeters: getMeters,
    getScores: getScores,
    sortByScores: sortByScores,
  };
}

function getMiles(i) {
  return i * 0.000621371192;
}

function getMeters(i) {
  return i * 1609.344;
}

function getScores(apartments) {
  apartments.forEach(function (apartment) {
    getScore(apartment);
  });
}

function getScore(apartment) {
  var score = 0;
  apartment.rating = Number(apartment.rating);

  // start off giving score based on rating
  if (apartment.rating === 5) {
    score = 4.5;
  } else if (apartment.rating === 4.5) {
    score = 4;
  } else if (apartment.rating === 4) {
    score = 3.5;
  } else if (apartment.rating === 3.5) {
    score = 2.5;
  } else if (apartment.rating === 3) {
    score = 0;
  } else if (apartment.rating < 3) {
    score = -4;
  }

  // weight the rating based on the number of reviews.
  if (apartment.review_count <= 3) {
    score *= 0.4;
  } else if (apartment.review_count >= 4 && apartment.review_count <= 5) {
    score *= 0.75;
  } else if (apartment.review_count >= 6 && apartment.review_count <= 9) {
    score *= 0.9;
  } else if (apartment.review_count >= 10 && apartment.review_count <= 15) {
    score *= 0.95;
  }

  // add/subtract points based on distance
  if (apartment.distance <= 2) {
    score += 1;
  } else if (apartment.distance > 2 && apartment.distance <= 4) {
    score += 0.5;
  } else if (apartment.distance > 6 && apartment.distance <= 10) {
    score -= 1;
  } else if (apartment.disance > 10 && apartment.distance <= 20) {
    score -= 2.5;
  } else if (apartment.disance > 20) {
    score -= 5;
  }

  apartment.score = score;
}

function sortByScores(apartments) {
  apartments.sort(function (a, b) {
    return b.score - a.score;
  });
}
