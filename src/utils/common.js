const getRandomInteger = (min, max) => min + Math.floor(Math.random() * (max - min));

const getRandomIntegerArray = (maxLength, maxNum) => {
  const resArray = [];

  for (let i = 0; i < maxLength; i++) {
    resArray.push(`${getRandomInteger(0, maxNum)}`);
  }

  return resArray;
};

export {getRandomInteger, getRandomIntegerArray};
