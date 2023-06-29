type Key =
  | "routeDetails"
  | "deliveryList"
  | "listId"
  | "franchise"
  | "maxDistanceFromFranchise"
  | "username";

const setLocalStorageItem = (key: Key, data: any) => {
  window.localStorage.setItem(key, JSON.stringify(data));
};

const getLocalStorageItem = (key: Key) => {
  const localStorageItem = window.localStorage.getItem(key);

  if (localStorageItem) {
    return JSON.parse(localStorageItem);
  }

  return undefined;
};

const removeLocalStorageItem = (key: Key) => {
  window.localStorage.removeItem(key);
};

const removeAllLocalStorageItems = (keys: Key[]) => {
  keys.forEach((key) => window.localStorage.removeItem(key));
};

export {
  setLocalStorageItem,
  getLocalStorageItem,
  removeLocalStorageItem,
  removeAllLocalStorageItems,
};
