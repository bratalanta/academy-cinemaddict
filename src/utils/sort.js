import dayjs from 'dayjs';

const sortFilmsByDate = ({filmInfo: filmInfoA}, {filmInfo: filmInfoB}) => {
  const {release: releaseA} = filmInfoA;
  const {release: releaseB} = filmInfoB;

  return dayjs(releaseB.date).diff(dayjs(releaseA.date));
};

const sortFilmsByRating = ({filmInfo: filmInfoA}, {filmInfo: filmInfoB}) => {
  const {totalRating: totalRatingA} = filmInfoA;
  const {totalRating: totalRatingB} = filmInfoB;

  return totalRatingB - totalRatingA;
};

const sortCommentsByDate = (commentA, commentB) => dayjs(commentA.date).diff(dayjs(commentB.date));

export {sortFilmsByDate, sortFilmsByRating, sortCommentsByDate};
