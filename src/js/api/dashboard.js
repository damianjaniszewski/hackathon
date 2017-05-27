import RequestWatcher from './request-watcher';

let protocol = 'ws:';
if (window.location.protocol === 'https:') {
  protocol = 'wss:';
}
const host = ((process.env.NODE_ENV === 'development') ?
  'localhost:8102' : `${window.location.host}`);
const webSocketUrl = `${protocol}//${host}`;

const socketWatcher = new RequestWatcher({ webSocketUrl });

let dashboardWatcher;

export function watchDashboard() {
  dashboardWatcher = socketWatcher.watch('/api/events');
  return dashboardWatcher;
}

export function unwatchDashboard() {
  if (dashboardWatcher) {
    dashboardWatcher.stop();
  }
}
