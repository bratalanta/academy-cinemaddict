import dayjs from 'dayjs';

const sortByDate = ({filmInfo: filmInfoA}, {filmInfo: filmInfoB}) => {
  const {release: releaseA} = filmInfoA;
  const {release: releaseB} = filmInfoB;

  return dayjs(releaseB.date).diff(dayjs(releaseA.date));
};

const sortByRating = ({filmInfo: filmInfoA}, {filmInfo: filmInfoB}) => {
  const {totalRating: totalRatingA} = filmInfoA;
  const {totalRating: totalRatingB} = filmInfoB;

  return totalRatingB - totalRatingA;
};

export {sortByDate, sortByRating};
