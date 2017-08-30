import { Server } from 'uws';
import { LoggerModule } from './modules/logger.module';
import InitDB from './db';
import { WebSocket } from './models/definition/websocket';
import { checkRoute, eventEmitter } from './modules/events.module';
import { SocketError } from './modules/error.module';
import { routes } from './router/index';
import { send } from './models/types/socket.types';

export default class AppServer {
    wss: Server;
    r: any;

    constructor() {
    }

    /**
     * 1. RethinkDb connection
     * 2. websocket Server listen
     */
    async listen() {
        const db = new InitDB();
        await db.connect();
        this.r = db.r;

        const port = Number(process.env.PORT || 3000);
        this.wss = new Server({
            port: port
        });

        this.wss.on('error', (error: any) => LoggerModule.error('[syncro] wss error: ' + error));
        LoggerModule.log(`WebSocket listening on port ${port}`);

        this.addRouter();

        this.connection();

        this.onError();
    }

    private connection() {
        const wss = this.wss;
        wss.on('connection', (ws: WebSocket) => {
            ws.ip = (ws.upgradeReq.headers['x-forwarded-for'] || ws._socket.remoteAddress).toString();

            LoggerModule.log(`[syncro] new socket connection(${ws.ip})`);

            this.onMessage(ws);

            this.onClose(ws);
        });
    }

    private onMessage(ws: WebSocket) {
        ws.onmessage = event => {
            try {
                if (event.data === null || event.data.byteLength === 0) {
                    throw new SocketError(`socket onmessage don't have data.`, 'nullError', 422);
                }

                const params = JSON.parse(event.data);
                const route = params.route;
                const action = params.action;
                const payload = params.payload;

                // 라우터가 있는지 체크 한다. 없으면 not found route 라는 에러가 난다.
                checkRoute(route);

                // ws.send 같은경우 data를 보낼 때 String, Blob, ArrayBuffer만 보낼 수 있기 때문에 JSON.stringify으로 묶어 준다.
                const send: send = (route: string, action: string, payload: any): void => {
                    ws.send(JSON.stringify({route, action, payload}));
                };

                const r = this.r;

                eventEmitter.emit(route, {action, payload, ws, send, r});

                LoggerModule.log(`socket call event(${action})`);
            } catch (error) {
                eventEmitter.emit('error', error, ws);
            }
        };
    }

    private onClose(ws: WebSocket) {
        ws.onclose = event => {
            LoggerModule.log(`socket disconnected(${ws.ip})`);
        };
    }

    private onError() {
        eventEmitter.on('error', (error, ws) => {
            LoggerModule.error(error);
            ws.send(JSON.stringify({route: 'error', payload: {error: {name: error.name, message: error.message, code: error.code}}}));
        });
    }

    private addRouter() {
        for (const route of routes) {
            new route();
        }
    }
}