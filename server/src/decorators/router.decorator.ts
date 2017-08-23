import { eventEmitter } from '../modules/events.module';

export function Router(name?: string) {
    return (target: any) => {
        const targetInstance = new target();
        const eventName = name || target.name;
        eventEmitter.on(eventName, ({action, payload, ws, send}) => {
            // 에러 처리를 위해서 promise로 감싼다.
            new Promise(() => {
                targetInstance[action]({payload, ws, send});
            }).catch(error => {
                eventEmitter.emit('error', error, ws);
            });
        });
    };
}