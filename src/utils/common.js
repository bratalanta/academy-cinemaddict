const FALSE_VALUE = 0;
const TRUE_VALUE = 1;

const getRandomInteger = (min, max) => min + Math.round(Math.random() * (max - min));

const getRandomIntegerArray = (maxLength, maxNum) => {
  const resArray = [];

  for (let i = 0; i < maxLength; i++) {
    resArray.push(`${getRandomInteger(0, maxNum)}`);
  }

  return resArray;
};

const getRandomBoolean = () => {
  if (getRandomInteger(FALSE_VALUE, TRUE_VALUE) === FALSE_VALUE) {
    return false;
  }

  return true;
};

export {getRandomInteger, getRandomIntegerArray, getRandomBoolean};
