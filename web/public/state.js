// Central app state (localStorage-backed)
export const store = {
  get users() {
    return JSON.parse(localStorage.getItem('br_users') || '[]');
  },
  set users(v) {
    localStorage.setItem('br_users', JSON.stringify(v));
  },
  get session() {
    return JSON.parse(localStorage.getItem('br_session') || 'null');
  },
  set session(v) {
    if (v === null) localStorage.removeItem('br_session');
    else localStorage.setItem('br_session', JSON.stringify(v));
  },
  get wishlist() {
    return JSON.parse(localStorage.getItem('br_wishlist') || '[]');
  },
  set wishlist(v) {
    localStorage.setItem('br_wishlist', JSON.stringify(v));
  },
  get trips() {
    return JSON.parse(localStorage.getItem('br_trips') || '[]');
  },
  set trips(v) {
    localStorage.setItem('br_trips', JSON.stringify(v));
  },
};

