import { Room } from '../database/models/Room';

interface Error {
  error: string;
}

interface Success<T> {
  data: T;
}

export type Response<T> = Error | Success<T>;

export interface ServerEvents {
  'bc:offer': (payload: { roomId: string; offer: any; offererSocketId: string }) => void;
  'answer:forward': (payload: { answer: any }) => void;
  'bc:icecandidate': (payload: { candidate: RTCIceCandidate }) => void;
  'bc:negotiation:offer': (payload: { sdp: any; negotiatioterSocketId: string }) => void;
  'negotiation:answer:forward': (payload: { sdp: any }) => void;
}

export interface ClientEvents {
  'room:create': (payload: Omit<Room, 'id'>, callback: (res: string) => void) => void;
  'join:room': (payload: { roomId: string }) => void;
  'ice:candidate': (payload: { candidate: any; roomId: string }) => void;
  'negotiation:offer': (payload: { roomId: string; sdp: any }) => void;
  'negotiation:answer': (payload: { negotiatioterSocketId: string; sdp: any }) => void;
}
