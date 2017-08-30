import { eventEmitter } from '../modules/events.module';
import { socketParams } from '../models/types/socket.types';

export function Router(name?: string) {
    return (target: any) => {
        const targetInstance = new target();
        const route = name || target.name;
        eventEmitter.on(route, ({action, payload, ws, send}: socketParams) => {
            // 에러 처리를 위해서 promise로 감싼다.
            new Promise(() => {
                targetInstance[action]({route, action, payload, ws, send});
            }).catch(error => {
                eventEmitter.emit('error', error, ws);
            });
        });
    };
}