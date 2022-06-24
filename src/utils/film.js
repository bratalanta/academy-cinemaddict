import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const HOUR_IN_MIN = 60;
const MAX_DESCRIPTION_LENGTH = 140;
const ELLIPSIS_SIGN = '…';

const humanizeDate = (date, format) => dayjs(date).format(format);
const humanizeCommentPostDate = (date) => dayjs(date).fromNow();

const normalizeFilmRuntime = (runtime) => {
  const hours = Math.floor(runtime / HOUR_IN_MIN);
  const minutes = runtime % HOUR_IN_MIN;

  return `${hours}h ${minutes}m`;
};

const truncFilmDescription = (description) => {
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    description = `${description.slice(0, MAX_DESCRIPTION_LENGTH - ELLIPSIS_SIGN.length)}${ELLIPSIS_SIGN}`;
  }

  return description;
};

const isFilmRatedZero = ({filmInfo}) => {
  if (filmInfo.totalRating === 0) {
    return true;
  }

  return false;
};

const isFilmCommentedZeroTimes = ({comments}) => {
  if (comments.length === 0) {
    return true;
  }

  return false;
};

const areFilmRatingsEqual = (films) => {
  const equalRatingsCount = films.reduce((acc, {filmInfo}) => {
    const {totalRating} = filmInfo;
    acc[totalRating] =  acc[totalRating] ? acc[totalRating] + 1 : 1;

    return acc;
  }, {});

  return +Object.values(equalRatingsCount) === films.length;
};

const areFilmCommentsCountEqual = (films) => {
  const equalCommentsCount = films.reduce((acc, {comments}) => {
    acc[comments.length] =  acc[comments.length] ? acc[comments.length] + 1 : 1;

    return acc;
  }, {});

  return +Object.values(equalCommentsCount) === films.length;
};

export {areFilmCommentsCountEqual, humanizeDate, normalizeFilmRuntime, truncFilmDescription, isFilmRatedZero, isFilmCommentedZeroTimes, humanizeCommentPostDate, areFilmRatingsEqual};
