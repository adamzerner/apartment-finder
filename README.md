# Overview

Search for apartments near a given location. You enter the latitude and longitude of the location, and what radius you're looking within.

Apartment Finder returns a list of apartments with:

1. The least expensive monthly rent (eg. for a studio, or one bedroom)
2. Average Yelp rating
3. Number of Yelp reviews
4. How far the apartment is from the location you provided.

Apartment Finder will also calculate a score for each apartment. The score is between -5 and 5 (think 1-10, but centered around 0 instead of 5). The score is based on the Yelp rating (and weighed by the number of reviews), and on how far it is from the location you provided. See `getScore` in [utilities.js](https://github.com/adamzerner/apartment-finder/blob/master/public/utilities.js).

The monthly rent prices are being scraped from apartmentfinder.com. I wasn't able to get prices for all apartments. I have to figure out what the correct apartmentfinder.com URL is, given the name of the apartment from Yelp. But the mapping isn't always easy.

# Usage

1. `git clone https://github.com/adamzerner/apartment-finder.git`
2. `npm install`
3. `node server.js`

# To Do

* See if there's a way to get the correct apartmentfinder.com URL more often.

* Maybe incorporate Google reviews as well as Yelp reviews.
