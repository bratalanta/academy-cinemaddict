const getRandomInteger = (min, max) => min + Math.floor(Math.random() * (max - min));

const getRandomIntegerArray = (maxLength, maxNum) => {
  const resArray = [];

  for (let i = 0; i < maxLength; i++) {
    resArray.push(`${getRandomInteger(0, maxNum)}`);
  }

  return resArray;
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

export {getRandomInteger, getRandomIntegerArray, updateItem};
