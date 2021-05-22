import { Room } from '../database/models/Room';
import { v4 as uuidv4 } from 'uuid';
import { Socket } from 'socket.io';
import { ClientEvents } from '../socket/events';
import { ServerEvents } from '../socket/events';
import { io } from '../';

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
    io.in(roomId)
      .allSockets()
      .then((sids: Set<string>) => {
        socket.emit('join:room:response', { alreadyConnectedSids: Array.from(sids) });
        socket.join(roomId);
      });
  };

const iceCandidate =
  (socket: Socket<ClientEvents, ServerEvents>) =>
  ({ target, candidate }: Parameters<ClientEvents['ice:candidate']>[0]): void => {
    socket.to(target).emit('ice:candidate:forward', { candidate });
  };

const offer =
  (socket: Socket<ClientEvents, ServerEvents>) =>
  ({ sdp, offerieSid }: Parameters<ClientEvents['offer']>[0]): void => {
    socket.to(offerieSid).emit('offer:forward', { sdp, offererSid: socket.id });
  };

const answer =
  (socket: Socket<ClientEvents, ServerEvents>) =>
  ({ offererSid, sdp }: Parameters<ClientEvents['answer']>[0]): void => {
    socket.to(offererSid).emit('answer:forward', { sdp, answererSid: socket.id });
  };

export default {
  createRoom,
  joinRoom,
  iceCandidate,
  offer,
  answer,
};
