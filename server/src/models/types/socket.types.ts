import { WebSocket } from '../definition/websocket';

export type send = (route: string, action: string, payload: any) => void;

export type socketParams = { ws?: WebSocket, payload?: any, send?: send };