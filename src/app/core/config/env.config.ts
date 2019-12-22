const _isDev = window.location.port.indexOf('4400') > -1;
const getHost = () => {
  const protocol = window.location.protocol;
  const host = window.location.host;
  return `${protocol}//${host}`;
};

const apiURI = _isDev ? 'http://localhost:9000' : 'http://tlims-kech.com';
const storageURI = _isDev ? 'http://localhost:9000/storage/' : '';

// console.log('inside const');

// console.log(getHost());

export const ENV = {
  BASE_URI: getHost(),
  BASE_API: apiURI,
  STORAGE_API: storageURI,
  IS_LOCAL: _isDev
};
