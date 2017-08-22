import { Server } from 'uws';
import { LoggerModule } from './modules/logger.module';
import InitDB from './db';
import { WebSocket } from './types/websocket';
import { eventEmitter } from './modules/events.module';

export default class AppServer {
    private wss: Server;

    constructor() {
        this.listen().catch((err: any) => LoggerModule.error(err));
    }

    /**
     * 1. RethinkDb connection
     * 2. websocket Server listen
     */
    private async listen() {
        const db = new InitDB();
        await db.connect();

        const port = Number(process.env.PORT || 3000);
        this.wss = new Server({
            port: port
        });

        this.wss.on('error', (error: any) => LoggerModule.error('[syncro] wss error: ' + error));
        LoggerModule.log(`WebSocket listening on port ${port}`);

        this.connection();
    }

    private connection() {
        const wss = this.wss;
        wss.on('connection', (ws: WebSocket) => {
            ws.ip = ws.upgradeReq.headers['x-forwarded-for'].toString() || ws._socket.remoteAddress;

            LoggerModule.log(`[syncro] new socket connection(${ws.ip})`);

            this.onMessage(ws);

            this.onClose(ws);
        });
    }

    private onMessage(ws: WebSocket) {
        ws.onmessage = event => {
            if (event.data === null || event.data.size === 0) {
                return;
            }
            const params = JSON.parse(event.data);
            const route = params.route;
            const type = params.type;
            const payload = params.payload;

            eventEmitter.emit(route, {type, payload, ws});

            LoggerModule.log(`[syncro] socket call event(${type})`);
        };
    }

    private onClose(ws: WebSocket) {
        ws.onclose = event => {
            LoggerModule.log(`[syncro] socket disconnected(${ws.ip})`);
        };
    }
}