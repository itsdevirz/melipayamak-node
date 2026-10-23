const Rest = require('./sms/rest');
const RestAsync = require('./sms/restAsync');
const Branch = require('./branch');
const BranchAsync = require('./branchAsync');
const Contacts = require('./contacts');
const ContactsAsync = require('./contactsAsync');
const Ticket = require('./ticket');
const TicketAsync = require('./ticketAsync');
const Users = require('./users');
const UsersAsync = require('./usersAsync');

class MelipayamakApi {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  sms(method = 'rest', type = 'async') {
    if (method === 'soap') {
      console.warn('SOAP mode is deprecated. This package prefers the Axios-based REST client.');
    }

    if (method !== 'rest' && method !== 'soap') {
      throw new Error(`Unsupported SMS method: ${method}. Use 'rest' or 'soap'.`);
    }

    if (type === 'sync') {
      return new Rest(this.username, this.password);
    }

    return new RestAsync(this.username, this.password);
  }

  branch() {
    return new Branch(this.username, this.password);
  }

  branchAsync() {
    return new BranchAsync(this.username, this.password);
  }

  contacts() {
    return new Contacts(this.username, this.password);
  }

  contactsAsync() {
    return new ContactsAsync(this.username, this.password);
  }

  ticket() {
    return new Ticket(this.username, this.password);
  }

  ticketAsync() {
    return new TicketAsync(this.username, this.password);
  }

  users() {
    return new Users(this.username, this.password);
  }

  usersAsync() {
    return new UsersAsync(this.username, this.password);
  }
}

module.exports = MelipayamakApi;
