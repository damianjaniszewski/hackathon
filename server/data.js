import amqp from 'amqp';
import dotenv from 'dotenv';

const _sessions = {};
const _notifiers = {
  event: []
};

export const events = [];

dotenv.config({silent: true});
// console.log('RABBITMQ_URL: '+process.env.RABBITMQ_URL);

var _printError = function (err) {
  console.log(err.message);
};

var _gotEvent = function (event) {
  // Print messages to stdout
  console.log('event> ' + event.eventTime + ' ' + event.message);

  events.unshift(event);
  _notifiers.event.forEach(notifier => notifier(event));
};

const _connection = amqp.createConnection({ url: process.env.RABBITMQ_URL })
  .on('error', e => _printError(e))
  .on('ready', () => {
    // Use the default 'amq.topic' exchange
    _connection.queue('messages', {durable: true, autoDelete: false, exclusive: false}, q => {
      // Catch all messages
      q.bind('#');
      // Receive messages
      q.subscribe(message => _gotEvent({eventTime: Date.now(), message: message.data.toString('utf8')}))
    })
  });

export function addSession(token, data) {
  _sessions[token] = data;
}

export function getSession(token) {
  return _sessions[token];
}

export function addNotifier(type, cb) {
  _notifiers[type].push(cb);
}

export function getEvents() {
  return Promise.resolve({ events });
}

export default { addNotifier, addSession, getSession, getEvents };
