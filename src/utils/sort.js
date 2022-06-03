import dayjs from 'dayjs';

const sortByDate = ({releaseA}, {releaseB}) => {
  console.log(releaseA)
  return dayjs(releaseA.date).diff(dayjs(releaseB.date))
};

export {sortByDate};
