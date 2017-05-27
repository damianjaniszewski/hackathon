import amqp from 'amqp';
import dotenv from 'dotenv';

const _sessions = {};
const _notifiers = {
  event: []
};

export const events = [];

dotenv.config({silent: true});
console.log('RABBITMQ_URL: '+process.env.RABBITMQ_URL);

var _printError = function (err) {
  console.log(err.message);
};

var _gotEvent = function (event) {
  console.log('event> '+event.body.sensorId+'.'+event.body.sensorType+' ('+event.body.sensorLat+', '+event.body.sensorLng+'): '+event.body.sensorState);
 // console.log(JSON.stringify(message.body));
 // console.log('');

  events.unshift(event.body);
  _notifiers.event.forEach(notifier => notifier(event));
};


const _connection = amqp.createConnection({ url: process.env.RABBITMQ_URL })
  .on('error', (e) => _printError(e))
  .on('ready',  () => {
    // Use the default 'amq.topic' exchange
    _connection.queue('messages', (q) => {
      // Catch all messages
      q.bind('#');
      // Receive messages
      q.subscribe((message) => {
        // Print messages to stdout
        console.log(message);
      })
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

export function getEvents(filters) {
  if (filters) {
    return Promise.resolve({
      events: events.filter(event =>
        Object.keys(filters).some(filter => event[filter] === filters[filter])
      )
    });
  }
  return Promise.resolve({ events });
}

export default { addNotifier, addSession, getSession, getEvents };
