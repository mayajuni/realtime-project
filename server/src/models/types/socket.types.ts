import { WebSocket } from '../definitions/websocket';

export type send = (route: string, action: string, payload: any) => void;

export type socketParams = { route?: string, action?: string, ws?: WebSocket, payload?: any, send?: send, r?: any };