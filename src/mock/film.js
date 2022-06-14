import { getRandomBoolean, getRandomInteger } from '../utils/common.js';
import {nanoid} from 'nanoid';

const MIN_RATE = 0;
const MAX_RATE = 10;
const MIN_YEAR = 2000;
const MAX_YEAR = 2022;

const uniqueIds = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9'
];

export const generateFilm = () => ({
  id: nanoid(),
  comments: uniqueIds,
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
      date: `${getRandomInteger(MIN_YEAR, MAX_YEAR)}-05-11T00:00:00.000Z`,
      releaseCountry: 'Finland'
    },
    runtime: 77,
    genre: [
      'Comedy', 'Thriller'
    ],
    description: 'Oscar-winning film, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.'
  },
  userDetails: {
    watchlist: getRandomBoolean(),
    alreadyWatched: getRandomBoolean(),
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: getRandomBoolean()
  }
});
