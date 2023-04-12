const StorageType = {
  SESSION: 'SESSION',
  LOCAL: 'LOCAL'
}

export const getStorage = (type) => {
  if (type === StorageType.SESSION) {
    return window.sessionStorage;
  }
  return window.localStorage;
};

const setItem = (type ) => (key, value) => {
  getStorage(type).setItem(key, JSON.stringify(value));
};

const getItem = (type) => (key, defaultVal) => {
  const val = getStorage(type).getItem(key);
  if (!val || val === 'undefined') return defaultVal;
  try {
    return JSON.parse(val);
  } catch (e) {
    return val;
  }
};

const removeItem = (type) => (key) => {
  getStorage(type).removeItem(key);
};

export const LocalStore = {
  session: {
    get: getItem(StorageType.SESSION),
    set: setItem(StorageType.SESSION),
    remove: removeItem(StorageType.SESSION),
  },
  local: {
    get: getItem(StorageType.LOCAL),
    set: setItem(StorageType.LOCAL),
    remove: removeItem(StorageType.LOCAL),
  },
};
