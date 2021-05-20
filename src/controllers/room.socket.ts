import { Room } from '../database/models/Room';
import { v4 as uuidv4 } from 'uuid';
import { Socket } from 'socket.io';
import { ClientEvents } from '../socket/events';
import { ServerEvents } from '../socket/events';
import { io } from '../';

const createRoom =
  () =>
  ({ detail, maxParticipants }: Omit<Room, 'id'>, callback: (data: any) => void): void => {
    console.log('Start room creation');
    Room.create({ id: uuidv4(), detail, maxParticipants }, { fields: ['id', 'detail', 'maxParticipants'] })
      .then((result: Room) => {
        // acknowledge the creation
        console.log('NEW ROOM:', result.id);
        callback(result.id);
      })
      .catch(console.log);
  };

const joinRoom =
  (socket: Socket<ClientEvents, ServerEvents>) =>
  ({ roomId }: Parameters<ClientEvents['join:room']>[0]): void => {
    console.log('JOINED ROOM:', roomId);
    socket.join(roomId);
  };

const iceCandidate =
  (socket: Socket<ClientEvents, ServerEvents>) =>
  ({ roomId, candidate }: Parameters<ClientEvents['ice:candidate']>[0]): void => {
    console.log('socketid', socket.id, 'roomid', roomId);
    const rooms = io.of('/').adapter.rooms;
    const sids = io.of('/').adapter.sids;
    console.log('ALLRROMS', rooms, sids);
    socket.to(roomId).emit('bc:icecandidate', { candidate });
  };

const negotiationOffer =
  (socket: Socket<ClientEvents, ServerEvents>) =>
  ({ roomId, sdp }: Parameters<ClientEvents['negotiation:offer']>[0]): void => {
    socket.to(roomId).emit('bc:negotiation:offer', { sdp, negotiatioterSocketId: socket.id });
  };

const negotiationAnswer =
  (socket: Socket<ClientEvents, ServerEvents>) =>
  ({ negotiatioterSocketId, sdp }: Parameters<ClientEvents['negotiation:answer']>[0]): void => {
    socket.to(negotiatioterSocketId).emit('negotiation:answer:forward', { sdp });
  };

export default {
  createRoom,
  joinRoom,
  iceCandidate,
  negotiationOffer,
  negotiationAnswer,
};
