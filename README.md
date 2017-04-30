# Overview

Search for apartments near a given location. You enter the latitude and longitude of the location, and what radius you're looking within.

Apartment Finder returns a list of apartments with the average Yelp rating, the number of Yelp reviews, and how far the apartment is from the location you provided.

Apartment Finder will also calculate a score for each apartment. The score is between -5 and 5 (think 1-10, but centered around 0 instead of 5). The score is based on the Yelp rating (and weighed by the number of reviews), and on how far it is from the location you provided. See `getScore` in [utilities.js](https://github.com/adamzerner/apartment-finder/blob/master/public/utilities.js).

# To Do

I would like to incorporate price, but a) there's no API for it, b) scraping sites like apartmentfinder.com is tough. Well, the hard part really is finding the right URL using the apartment name from Yelp.

I may incorporate Google reviews as well as Yelp reviews.
