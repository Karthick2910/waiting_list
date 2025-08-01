const axios = require('axios');

class Utils {
  static async PerformGetRequest(url, params = {}, headers = {}) {
    return axios.get(url, { params, headers });
  }

  static async PerformPostRequest(url, data, headers = {}) {
    return axios.post(url, data, { headers });
  }

  static IsNull(value) {
    return value === null || value === undefined;
  }

  static IsNullOrEmpty(value) {
    return this.IsNull(value) || (typeof value === 'string' && value.trim() === '');
  }
}

module.exports = { Utils };
