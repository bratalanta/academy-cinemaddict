import dayjs from 'dayjs';

const HOUR_IN_MIN = 60;
const MAX_DESCRIPTION_LENGTH = 140;
const ELLIPSIS_SIGN = '…';

const humanizeFilmDate = (date, format) => dayjs(date).format(format);

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

export {humanizeFilmDate, normalizeFilmRuntime, truncFilmDescription};
