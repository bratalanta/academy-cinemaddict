import dayjs from 'dayjs';

const sortByDate = ({filmInfo: filmInfoA}, {filmInfo: filmInfoB}) => {
  const {release: releaseA} = filmInfoA;
  const {release: releaseB} = filmInfoB;

  return dayjs(releaseA.date).diff(dayjs(releaseB.date));
};

const sortByRating = ({filmInfo: filmInfoA}, {filmInfo: filmInfoB}) => {
  const {totalRating: totalRatingA} = filmInfoA;
  const {totalRating: totalRatingB} = filmInfoB;

  return totalRatingB - totalRatingA;
};

export {sortByDate, sortByRating};
