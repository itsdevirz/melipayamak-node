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

  async send(payloadOrTo, from, text, isFlash = false) {
    const payload = this._normalizeSendPayload(payloadOrTo, from, text, isFlash);
    return this.request('SendSMS', payload);
  }

  async sendByBaseNumber(payloadOrText, to, bodyId) {
    const payload = this._normalizeBaseNumberPayload(payloadOrText, to, bodyId);
    return this.request('BaseServiceNumber', payload);
  }

  async isDelivered(recId) {
    return this.request('GetDeliveries2', { recId });
  }

  async getMessages(location, index, count, from = '') {
    return this.request('GetMessages', { location, index, count, from });
  }

  async getCredit() {
    return this.request('GetCredit', {});
  }

  async getBasePrice() {
    return this.request('GetBasePrice', {});
  }

  async getNumbers() {
    return this.request('GetUserNumbers', {});
  }

  _normalizeSendPayload(payloadOrTo, from, text, isFlash) {
    if (typeof payloadOrTo === 'object' && payloadOrTo !== null) {
      return {
        to: payloadOrTo.to,
        from: payloadOrTo.from,
        text: payloadOrTo.text,
        isFlash: payloadOrTo.isFlash ?? isFlash,
      };
    }

    return {
      to: payloadOrTo,
      from,
      text,
      isFlash,
    };
  }

  _normalizeBaseNumberPayload(payloadOrText, to, bodyId) {
    if (typeof payloadOrText === 'object' && payloadOrText !== null) {
      return {
        text: payloadOrText.text,
        to: payloadOrText.to,
        bodyId: payloadOrText.bodyId,
      };
    }

    return {
      text: payloadOrText,
      to,
      bodyId,
    };
  }
}

module.exports = Rest;
