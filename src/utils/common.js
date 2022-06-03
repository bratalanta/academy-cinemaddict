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

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

export {getRandomInteger, getRandomIntegerArray, updateItem, getRandomBoolean};
