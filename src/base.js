class Base {
  constructor(username, password) {
    if (!username || !password) {
      throw new Error('username and password are required');
    }

    this.username = username;
    this.password = password;
    this.data = { username, password };
  }

  buildPayload(params = {}) {
    return {
      ...this.data,
      ...params,
    };
  }
}

module.exports = Base;
