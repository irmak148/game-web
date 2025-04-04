const isDev = process.env.NODE_ENV === 'development';

export const API_URL = isDev 
  ? 'http://localhost:3000/api'
  : '/.netlify/functions/api';

export const WS_URL = isDev
  ? 'ws://localhost:3000'
  : '/.netlify/functions/websocket';
