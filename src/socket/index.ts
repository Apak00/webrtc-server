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
        'https://localhost:8080',
        'http://localhost:8080',
        'http://0.0.0.0:8080',
        'http://192.168.1.47:8080',
        'https://192.168.1.47:8080',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const REDIS_URL = process.env.REDIS_URL;
  const REDIS_KEY = process.env.REDIS_KEY || 'chat-socket';

  if (REDIS_URL) {
    // Runs on Heroku env
    const redisAdapter = createAdapter(REDIS_URL, { key: REDIS_KEY });
    io = io.adapter(redisAdapter);
  }

  io.on('connection', (socket: Socket<ClientEvents, ServerEvents>) => {
    console.log('SOMEONE IS CONNECTED ', socket.id);
    socket.on('room:create', roomController.createRoom());
    socket.on('join:room', roomController.joinRoom(socket));
    socket.on('ice:candidate', roomController.iceCandidate(socket));
    socket.on('negotiation:offer', roomController.negotiationOffer(socket));
    socket.on('negotiation:answer', roomController.negotiationAnswer(socket));
  });

  io.of('/').adapter.on('create-room', (room) => {
    console.log(`room ${room} was created`);
  });

  io.of('/').adapter.on('delete-room', (room) => {
    console.log(`room ${room} was deleted`);
  });

  io.of('/').adapter.on('join-room', (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
  });

  io.of('/').adapter.on('leave-room', (room, id) => {
    console.log(`socket ${id} has left room ${room}`);
  });
  return io;
};
