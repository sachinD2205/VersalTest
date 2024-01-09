export const sortByAsc = (arr, propertyName) => {
  arr.sort((a, b) => {
    if (a[propertyName] < b[propertyName]) {
      return -1;
    }
    if (a[propertyName] > b[propertyName]) {
      return 1;
    }
    return 0;
  });
};

export const sortByDesc = (arr, propertyName) => {
  arr.sort((a, b) => {
    if (a[propertyName] > b[propertyName]) {
      return -1;
    }
    if (a[propertyName] < b[propertyName]) {
      return 1;
    }
    return 0;
  });
};
