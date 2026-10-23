const soap = require('soap');
const Base = require('./base');

const clients = new Map();

class BaseSoap extends Base {
  async executeAsync(url, funcName, params = {}) {
    if (typeof url !== 'string' || !url) throw new TypeError('url must be a non-empty string');
    if (typeof funcName !== 'string' || !funcName) throw new TypeError('funcName must be a non-empty string');

    try {
      let clientPromise = clients.get(url);

      if (!clientPromise) {
        clientPromise = soap.createClientAsync(url);
        clients.set(url, clientPromise);
        clientPromise.catch(() => {
          if (clients.get(url) === clientPromise) clients.delete(url);
        });
      }

      const client = await clientPromise;
      const method = client[funcName + 'Async'];
      if (typeof method !== 'function') throw new Error(`SOAP method "${funcName}" is not available`);

      const result = await method.call(client, this.buildPayload(params));
      const payload = Array.isArray(result) ? result[0] : result;
      const key = funcName + 'Result';

      return payload && Object.prototype.hasOwnProperty.call(payload, key) ? payload[key] : payload;
    } catch (cause) {
      const error = new Error(cause?.message || 'SOAP request failed', { cause });
      error.code = cause?.code;
      error.status = cause?.response?.statusCode;
      throw error;
    }
  }

  execute(url, funcName, params = {}) {
    return this.executeAsync(url, funcName, params);
  }

  getPath(method) {
    return `http://api.payamak-panel.com/post/${method}.asmx?wsdl`;
  }
}

module.exports = BaseSoap;
