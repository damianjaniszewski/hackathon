import compression from 'compression';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import api from './api';
import { addNotifier, getEvents } from './data';
import Notifier from './notifier';

const PORT = process.env.PORT || 8102;

const notifier = new Notifier();

notifier.use('/api/events', () => getEvents());

const app = express()
  .use(compression())
  .use(cookieParser())
  .use(morgan('tiny'))
  .use(bodyParser.json());

// REST API
app.use('/api', api);

// UI
app.use('/', express.static(path.join(__dirname, '/../dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(path.join(__dirname, '/../dist/index.html')));
});

const server = http.createServer(app);
server.listen(PORT);
notifier.listen(server);

console.log(`Server started at port ${PORT}`);
