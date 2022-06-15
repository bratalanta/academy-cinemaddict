const FilterType = {
  ALL: 'All',
  WATCHLIST: 'Watchlist',
  ALREADYWATCHED: 'History',
  FAVORITE: 'Favorites'
};

const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter(({userDetails}) => userDetails.watchlist),
  [FilterType.ALREADYWATCHED]: (films) => films.filter(({userDetails}) => userDetails.alreadyWatched),
  [FilterType.FAVORITE]: (films) => films.filter(({userDetails}) => userDetails.favorite),
};

export {filter, FilterType};
