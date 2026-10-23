const axios = require('axios');
const qs = require('node:querystring');
const Base = require('../base');

class Rest extends Base {
  constructor(username, password) {
    super(username, password);

    this.client = axios.create({
      baseURL: 'https://rest.payamak-panel.com/api/SendSMS',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      transformRequest: [(data) => qs.stringify(data)],
    });
  }

  async request(method, params = {}) {
    try {
      const payload = this.buildPayload(params);
      const { data } = await this.client.post(`/${method}`, payload);
      return data;
    } catch (error) {
      throw this._normalizeError(error);
    }
  }

  _normalizeError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        data: error.response.data,
        message: error.message,
      };
    }

    if (error.request) {
      return {
        message: 'No response was received from Melipayamak API.',
        request: error.request,
      };
    }

    return {
      message: error.message,
    };
  }

  send(to, from, text, isFlash = false) {
    return this.request('SendSMS', { to, from, text, isFlash });
  }

  sendByBaseNumber(text, to, bodyId) {
    return this.request('BaseServiceNumber', { text, to, bodyId });
  }

  isDelivered(recId) {
    return this.request('GetDeliveries2', { recId });
  }

  getMessages(location, index, count, from = '') {
    return this.request('GetMessages', { location, index, count, from });
  }

  getCredit() {
    return this.request('GetCredit', {});
  }

  getBasePrice() {
    return this.request('GetBasePrice', {});
  }

  getNumbers() {
    return this.request('GetUserNumbers', {});
  }
}

module.exports = Rest;
