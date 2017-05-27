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
console.log('RABBITMQ_URL: ' + process.env.RABBITMQ_URL);

var _printError = function _printError(err) {
  console.log(err.message);
};

var _gotEvent = function _gotEvent(event) {
  console.log('event> ' + event.body.sensorId + '.' + event.body.sensorType + ' (' + event.body.sensorLat + ', ' + event.body.sensorLng + '): ' + event.body.sensorState);
  // console.log(JSON.stringify(message.body));
  // console.log('');

  events.unshift(event.body);
  _notifiers.event.forEach(function (notifier) {
    return notifier(event);
  });
};

var _connection = _amqp2.default.createConnection({ url: process.env.RABBITMQ_URL });
// const _connection = amqp.createConnection({ url: "amqp://uicR37SEDpTnQ:pH0HTOPmHf917@195.69.209.29:25001/vb7ac1138d0ae48db9530655b19db61f0"});

// const _client = Client.fromConnectionString(_connectionString);
//
// _client.open()
//     .then(_client.getPartitionIds.bind(_client))
//     .then(function (partitionIds) {
//         return partitionIds.map(function (partitionId) {
//             return _client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()-2*24*60*60*1000}).then(function(receiver) {
//                 console.log('Created partition receiver: ' + partitionId)
//                 receiver.on('errorReceived', _printError);
//                 receiver.on('message', _gotEvent);
//             });
//         });
//     })
//     .catch(_printError);

function addSession(token, data) {
  _sessions[token] = data;
}

function getSession(token) {
  return _sessions[token];
}

function addNotifier(type, cb) {
  _notifiers[type].push(cb);
}

function getEvents(filters) {
  if (filters) {
    return Promise.resolve({
      events: events.filter(function (event) {
        return Object.keys(filters).some(function (filter) {
          return event[filter] === filters[filter];
        });
      })
    });
  }
  return Promise.resolve({ events: events });
}

exports.default = { addNotifier: addNotifier, addSession: addSession, getSession: getSession, getEvents: getEvents };
//# sourceMappingURL=data.js.map