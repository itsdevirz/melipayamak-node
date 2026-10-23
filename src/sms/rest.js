const axios = require('axios');
const qs = require('node:querystring');
const Base = require('../base');

const API_URL = 'https://rest.payamak-panel.com/api/SendSMS';
const DEFAULT_TIMEOUT = 30_000;

class Rest extends Base {
  constructor(username, password, options = {}) {
    super(username, password);

    this.client = (options.axios || axios).create({
      baseURL: options.baseURL || API_URL,
      timeout: options.timeout ?? DEFAULT_TIMEOUT,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      transformRequest: [(data) => qs.stringify(data)],
    });
  }

  async request(method, params = {}) {
    if (typeof method !== 'string' || !method.trim()) throw new TypeError('method must be a non-empty string');

    try {
      const { data } = await this.client.post(`/${method}`, this.buildPayload(params));
      return data;
    } catch (cause) {
      const error = new Error(
        cause?.response
          ? `Melipayamak API returned HTTP ${cause.response.status}`
          : cause?.request
            ? 'No response was received from Melipayamak API'
            : cause?.message || 'Melipayamak request failed',
        { cause }
      );
      error.status = cause?.response?.status;
      error.data = cause?.response?.data;
      error.code = cause?.code;
      throw error;
    }
  }

  send(payloadOrTo, from, text, isFlash = false) {
    const payload = payloadOrTo && typeof payloadOrTo === 'object' && !Array.isArray(payloadOrTo)
      ? { to: payloadOrTo.to, from: payloadOrTo.from, text: payloadOrTo.text, isFlash: payloadOrTo.isFlash ?? isFlash }
      : { to: payloadOrTo, from, text, isFlash };
    return this.request('SendSMS', payload);
  }

  sendByBaseNumber(payloadOrText, to, bodyId) {
    const payload = payloadOrText && typeof payloadOrText === 'object' && !Array.isArray(payloadOrText)
      ? { text: payloadOrText.text, to: payloadOrText.to, bodyId: payloadOrText.bodyId }
      : { text: payloadOrText, to, bodyId };
    return this.request('BaseServiceNumber', payload);
  }

  isDelivered(recId) {
    return this.request('GetDeliveries2', { recId });
  }

  getMessages(location, index, count, from = '') {
    return this.request('GetMessages', { location, index, count, from });
  }

  getCredit() {
    return this.request('GetCredit');
  }

  getBasePrice() {
    return this.request('GetBasePrice');
  }

  getNumbers() {
    return this.request('GetUserNumbers');
  }
}

module.exports = Rest;
