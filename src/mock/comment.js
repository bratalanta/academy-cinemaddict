import { getRandomInteger } from '../utils/common.js';

const MIN_ID = 0;
const MAX_ID = 10;
const MIN_DATE = 2000;
const MAX_DATE = 2022;

export const generateComment = () => (
  {
    id: `${getRandomInteger(MIN_ID, MAX_ID)}`,
    author: 'Ilya O\'Reilly',
    comment: 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
    date: `${getRandomInteger(MIN_DATE, MAX_DATE)}-05-11T16:12:32.554Z`,
    emotion: 'smile'
  }
);

export {MIN_ID, MAX_ID, MIN_DATE, MAX_DATE};
