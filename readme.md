# Melipayamak Node.js Client

A simple Node.js client for Melipayamak SMS API built with Axios.

Package name on npm:

```bash
npm install melipayamak-2
```

## Features

- Send SMS with REST API
- Check delivery status
- Get messages list
- Get credit and base price
- Get available numbers
- Send using base number
- Works with Node.js 18+

## Installation

```bash
npm install melipayamak-2
```

## Quick Start

```javascript
const Melipayamak = require('melipayamak-2');

const username = 'YOUR_USERNAME';
const password = 'YOUR_PASSWORD';

const client = new Melipayamak(username, password);

(async () => {
  try {
    const result = await client.send({
      to: '09120000000',
      from: '5000',
      text: 'سلام، این پیام تستی است.'
    });

    console.log('Send result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
})();
```

## Methods

### constructor(username, password)

Create a new Melipayamak client.

```javascript
const client = new Melipayamak('username', 'password');
```

### send(payloadOrTo, from, text, isFlash = false)

Send an SMS.

#### 1) Object style

```javascript
await client.send({
  to: '09120000000',
  from: '5000',
  text: 'Hello from Melipayamak',
  isFlash: false
});
```

#### 2) Parameter style

```javascript
await client.send('09120000000', '5000', 'Hello from Melipayamak');
```

#### 3) Flash SMS

```javascript
await client.send({
  to: '09120000000',
  from: '5000',
  text: 'This is a flash message',
  isFlash: true
});
```

### sendByBaseNumber(payloadOrText, to, bodyId)

Send a message using a base number.

```javascript
await client.sendByBaseNumber({
  text: 'Message using base number',
  to: '09120000000',
  bodyId: 12345
});
```

or

```javascript
await client.sendByBaseNumber('Message using base number', '09120000000', 12345);
```

### isDelivered(recId)

Check whether an SMS was delivered.

```javascript
const status = await client.isDelivered(123456789);
console.log(status);
```

### getMessages(location, index, count, from = '')

Get received messages.

```javascript
const messages = await client.getMessages(1, 0, 10, '');
console.log(messages);
```

### getCredit()

Get available credit.

```javascript
const credit = await client.getCredit();
console.log(credit);
```

### getBasePrice()

Get base SMS price.

```javascript
const price = await client.getBasePrice();
console.log(price);
```

### getNumbers()

Get numbers assigned to the account.

```javascript
const numbers = await client.getNumbers();
console.log(numbers);
```

## Complete Example

```javascript
const Melipayamak = require('melipayamak-2');

const username = 'YOUR_USERNAME';
const password = 'YOUR_PASSWORD';
const client = new Melipayamak(username, password);

(async () => {
  try {
    const credit = await client.getCredit();
    console.log('Credit:', credit);

    const sendResult = await client.send({
      to: '09120000000',
      from: '5000',
      text: 'Hello from melipayamak-2'
    });

    console.log('Send response:', sendResult);

    const numbers = await client.getNumbers();
    console.log('Numbers:', numbers);
  } catch (error) {
    console.error('Melipayamak error:', error);
  }
})();
```

## Notes

- `username` and `password` are required.
- The package uses the Melipayamak REST API.
- `from` is usually your registered sender number or approved sender ID.
- If you receive an error, check your Melipayamak account credentials and sender number restrictions.

## Error Handling

The client throws or returns normalized error objects depending on the request failure. You should always wrap calls in `try/catch`.

```javascript
try {
  await client.send({
    to: '09120000000',
    from: '5000',
    text: 'Test message'
  });
} catch (error) {
  console.error(error);
}
```

## License

MIT

## Repository

https://github.com/itsdevirz/melipayamak-node
