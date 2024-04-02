const isDataEmpty = (obj) => {
  const listUndefined = [];
  for (const key in obj) {
    if (
      obj.hasOwnProperty(key) &&
      (typeof obj[key] === 'undefined' || obj[key] === '')
    ) {
      listUndefined.push(key);
    }
  }
  return listUndefined;
};

module.exports = isDataEmpty;
