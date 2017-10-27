import { eventEmitter } from '../modules/events.module';
import { socketParams } from '../models/types/socket.types';
import { SocketError } from '../modules/error.module';

export function Router(name?: string) {
    return (target: any) => {
        const targetInstance = new target();
        const route = name || target.name;
        eventEmitter.on(route, ({action, payload, ws, send, r}: socketParams) => {
            // 에러 처리를 위해서 promise로 감싼다.
            try {
                if (!targetInstance[action]) {
                    throw new SocketError('not found action', 'router', 404);
                }
                const result = targetInstance[action]({route, action, payload, ws, send, r});
                if (result instanceof Promise) {
                    result.catch((error) => {
                        eventEmitter.emit('error', error, ws);
                    });
                }
            } catch (error) {
                eventEmitter.emit('error', error, ws);
            }
        });
    };
}