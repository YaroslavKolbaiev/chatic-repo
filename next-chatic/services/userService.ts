const key = 'chat-user';

function get() {
  return localStorage.getItem(key);
}

function save(user: any) {
  return localStorage.setItem(key, JSON.stringify(user));
}

function remove() {
  return localStorage.removeItem(key);
}

export const userService = { get, save, remove };
