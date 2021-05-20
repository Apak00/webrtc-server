import { Room } from '../database/models/Room';
import { v4 as uuidv4 } from 'uuid';
import { Socket } from 'socket.io';
import { ClientEvents } from '../socket/events';
import { ServerEvents } from '../socket/events';

const createRoom =
  () =>
  ({ detail, maxParticipants }: Omit<Room, 'id'>, callback: (data: any) => void): void => {
    Room.create({ id: uuidv4(), detail, maxParticipants }, { fields: ['id', 'detail', 'maxParticipants'] })
      .then((result: Room) => {
        // acknowledge the creation
        callback(result.id);
      })
      .catch(console.log);
  };

const joinRoom =
  (socket: Socket<ClientEvents, ServerEvents>) =>
  ({ roomId }: Parameters<ClientEvents['join:room']>[0]): void => {
    socket.join(roomId);
  };

const iceCandidate =
  (socket: Socket<ClientEvents, ServerEvents>) =>
  ({ roomId, candidate }: Parameters<ClientEvents['ice:candidate']>[0]): void => {
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
