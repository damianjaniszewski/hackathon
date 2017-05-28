// import RequestWatcher from './request-watcher';
//
// let protocol = 'ws:';
// if (window.location.protocol === 'https:') {
//   protocol = 'wss:';
// }
// const host = ((process.env.NODE_ENV === 'development') ?
//   'localhost:8102' : `${window.location.host}`);
// const webSocketUrl = `${protocol}//${host}`;
//
// const socketWatcher = new RequestWatcher({ webSocketUrl });

import { requestWatcher } from './utils';

let eventsWatcher;

export function watchEvents() {
  eventsWatcher = requestWatcher.watch('/api/events');
  return eventsWatcher;
}

export function unwatchEvents() {
  if (eventsWatcher) {
    eventsWatcher.stop();
  }
}
