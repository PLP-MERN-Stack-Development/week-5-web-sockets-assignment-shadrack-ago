import { io } from 'socket.io-client';

// Change the URL if your server runs elsewhere
const SERVER_URL = 'http://localhost:5000';

const socket = io(SERVER_URL, {
  autoConnect: false, // We'll connect after login
});

export default socket; 