const key = 'accessToken';

function get() {
  return localStorage.getItem(key);
}

function save(token: string) {
  return localStorage.setItem(key, token);
}

function remove() {
  return localStorage.removeItem(key);
}

function isLoggedIn() {
  return Boolean(localStorage.getItem(key));
}

export const accessTokenService = {
  get, save, remove, isLoggedIn,
};
