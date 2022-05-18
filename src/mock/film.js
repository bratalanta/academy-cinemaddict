import { getRandomInteger, getRandomIntegerArray } from '../utils/common.js';

const MIN_RATE = 0;
const MAX_RATE = 10;
const MAX_COMMENTS_LENGTH = 5;
const MAX_COMMENT_ID = 10;

export const generateFilm = (k) => ({
  id: `${k}`,
  comments: getRandomIntegerArray(MAX_COMMENTS_LENGTH, MAX_COMMENT_ID),
  filmInfo: {
    title: 'A Little Pony Without The Carpet',
    alternativeTitle: 'Laziness Who Sold Themselves',
    totalRating: getRandomInteger(MIN_RATE, MAX_RATE),
    poster: 'images/posters/the-man-with-the-golden-arm.jpg',
    ageRating: 0,
    director: 'Tom Ford',
    writers: [
      'Takeshi Kitano'
    ],
    actors: [
      'Morgan Freeman'
    ],
    release: {
      date: '2019-05-11T00:00:00.000Z',
      releaseCountry: 'Finland'
    },
    runtime: 77,
    genre: [
      'Comedy', 'Thriller'
    ],
    description: 'Oscar-winning film, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.'
  },
  userDetails: {
    watchlist: true,
    alreadyWatched: false,
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: true
  }
});
