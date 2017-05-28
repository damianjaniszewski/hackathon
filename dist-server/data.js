'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.events = undefined;
exports.addSession = addSession;
exports.getSession = getSession;
exports.addNotifier = addNotifier;
exports.getEvents = getEvents;

var _amqp = require('amqp');

var _amqp2 = _interopRequireDefault(_amqp);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _sessions = {};
var _notifiers = {
  event: []
};

var events = exports.events = [];

_dotenv2.default.config({ silent: true });
// console.log('RABBITMQ_URL: '+process.env.RABBITMQ_URL);

var _printError = function _printError(err) {
  console.log(err.message);
};

var _gotEvent = function _gotEvent(event) {
  // Print messages to stdout
  console.log('event> ' + event.eventTime + ' ' + event.message);

  events.unshift(event);
  _notifiers.event.forEach(function (notifier) {
    return notifier(event);
  });
};

var _connection = _amqp2.default.createConnection({ url: process.env.RABBITMQ_URL }).on('error', function (e) {
  return _printError(e);
}).on('ready', function () {
  // Use the default 'amq.topic' exchange
  _connection.queue('messages', { durable: true, autoDelete: false, exclusive: false }, function (q) {
    // Catch all messages
    q.bind('#');
    // Receive messages
    q.subscribe(function (message) {
      return _gotEvent({ eventTime: Date.now(), message: message.data.toString('utf8') });
    });
  });
});

function addSession(token, data) {
  _sessions[token] = data;
}

function getSession(token) {
  return _sessions[token];
}

function addNotifier(type, cb) {
  _notifiers[type].push(cb);
}

function getEvents() {
  return Promise.resolve({ events: events });
}

exports.default = { addNotifier: addNotifier, addSession: addSession, getSession: getSession, getEvents: getEvents };
//# sourceMappingURL=data.js.map