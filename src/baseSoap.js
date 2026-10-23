const soap = require('soap');
const Base = require('./base');

class BaseSoap extends Base {
  async executeAsync(url, funcName, params = {}) {
    try {
      const client = await soap.createClientAsync(url);
      const result = await client[`${funcName}Async`](params);
      const payload = Array.isArray(result) ? result[0] : result;

      if (payload && payload[`${funcName}Result`] !== undefined) {
        return payload[`${funcName}Result`];
      }

      return payload;
    } catch (error) {
      throw this._normalizeError(error);
    }
  }

  async execute(url, funcName, params = {}) {
    return this.executeAsync(url, funcName, params);
  }

  getPath(method) {
    return `http://api.payamak-panel.com/post/${method}.asmx?wsdl`;
  }

  _normalizeError(error) {
    if (error && error.message) {
      return error;
    }

    return new Error('SOAP request failed');
  }
}

module.exports = BaseSoap;
