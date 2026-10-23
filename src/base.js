class Base {
  constructor(username, password) {
    if (typeof username !== 'string' || !username.trim()) {
      throw new TypeError('username must be a non-empty string');
    }

    if (typeof password !== 'string' || !password) {
      throw new TypeError('password must be a non-empty string');
    }

    this.username = username;
    this.password = password;
    this.data = { username, password };
  }

  buildPayload(params = {}) {
    if (!params || typeof params !== 'object' || Array.isArray(params)) {
      throw new TypeError('params must be an object');
    }

    return { ...params, username: this.username, password: this.password };
  }
}

module.exports = Base;
