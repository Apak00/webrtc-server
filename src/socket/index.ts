import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { ClientEvents, ServerEvents } from './events';
import roomController from '../controllers/room.socket';
import { createAdapter } from 'socket.io-redis';

let io: Server<ClientEvents, ServerEvents>;

export const initSocket = (server: HTTPServer): Server<ClientEvents, ServerEvents> => {
  // Socket
  io = new Server(server, {
    cors: {
      origin: [
        'https://webrtc-client1.herokuapp.com',
        'https://localhost:8080',
        'http://localhost:8080',
        'http://localhost:5000',
        'http://0.0.0.0:8080',
        'http://192.168.1.47:8080',
        'https://192.168.1.47:8080',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const REDISCLOUD_URL = process.env.REDISCLOUD_URL;
  const REDIS_KEY = process.env.REDIS_KEY || 'chat-socket';

  if (REDISCLOUD_URL) {
    // Runs on Heroku env
    const redisAdapter = createAdapter(REDISCLOUD_URL, { key: REDIS_KEY });
    io = io.adapter(redisAdapter);
  }

  io.on('connection', (socket: Socket<ClientEvents, ServerEvents>) => {
    socket.on('room:create', roomController.createRoom());
    socket.on('join:room', roomController.joinRoom(socket));
    socket.on('ice:candidate', roomController.iceCandidate(socket));
    socket.on('negotiation:offer', roomController.negotiationOffer(socket));
    socket.on('negotiation:answer', roomController.negotiationAnswer(socket));
  });

  return io;
};
