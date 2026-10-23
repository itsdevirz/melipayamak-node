# Melipayamak API

A cleaned-up Node.js client for Melipayamak with a modern Axios-based REST implementation.

## Installation

```bash
npm install melipayamak-api
```

## Example

```js
const MelipayamakApi = require('melipayamak-api');

const api = new MelipayamakApi('username', 'password');
const sms = api.sms();

sms.send('09123456789', '5000', 'سلام، این پیام از طریق Axios ارسال شد.')
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
```

## Notes

- This version keeps the public API simple and consistent.
- The REST client is built on Axios and removes the duplicate request boilerplate from the older implementation.
- Legacy SOAP helpers are still present for compatibility, but the recommended path is the REST client.
