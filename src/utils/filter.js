const FilterTypes = {
  ALL: 'All',
  WATCHLIST: 'Watchlist',
  ALREADYWATCHED: 'History',
  FAVORITE: 'Favorites'
};

const filter = {
  [FilterTypes.ALL]: (films) => films,
  [FilterTypes.WATCHLIST]: (films) => films.filter(({userDetails}) => userDetails.watchlist),
  [FilterTypes.ALREADYWATCHED]: (films) => films.filter(({userDetails}) => userDetails.alreadyWatched),
  [FilterTypes.FAVORITE]: (films) => films.filter(({userDetails}) => userDetails.favorite),
};

export {filter, FilterTypes};
