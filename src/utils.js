import dayjs from 'dayjs';

const HOUR_IN_MIN = 60;
const MAX_DESCRIPTION_LENGTH = 140;
const ELLIPSIS_SIGN = '…';

const humanizeDate = (date, format) => dayjs(date).format(format);

const normalizeFilmRuntime = (runtime) => {
  const hours = Math.floor(runtime / HOUR_IN_MIN);
  const minutes = runtime % HOUR_IN_MIN;

  return `${hours}h ${minutes}m`;
};

const truncFilmDescription = (description) => {
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return `${description.slice(0, MAX_DESCRIPTION_LENGTH - ELLIPSIS_SIGN.length)}${ELLIPSIS_SIGN}`;
  }
};

const getRandomInteger = (min, max) => min + Math.floor(Math.random() * (max - min));

export {humanizeDate, normalizeFilmRuntime, truncFilmDescription, getRandomInteger};
