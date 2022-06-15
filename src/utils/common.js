const FALSE_VALUE = 0;
const TRUE_VALUE = 1;
const UNIQUE_IDS = [];

const IdsRange = {
  MIN_ID: 0,
  MAX_ID: 9
};

const getRandomInteger = (min, max) => min + Math.round(Math.random() * (max - min));

const getRandomUniqueId = () => {
  if (UNIQUE_IDS.includes(IdsRange.MIN_ID)) {
    IdsRange.MIN_ID++;
  }

  if (!UNIQUE_IDS.includes(IdsRange.MIN_ID) && IdsRange.MIN_ID <= IdsRange.MAX_ID) {
    UNIQUE_IDS.push(IdsRange.MIN_ID);

    return IdsRange.MIN_ID;
  }
};

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

export {getRandomInteger, getRandomIntegerArray, getRandomBoolean, getRandomUniqueId};
