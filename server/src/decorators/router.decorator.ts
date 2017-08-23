import { eventEmitter } from '../modules/events.module';

export function Router(name?: string) {
    return (target: any) => {
        const targetInstance = new target();
        const eventName = name || target.name;
        eventEmitter.on(eventName, ({action, payload, ws}) => {
            targetInstance[action]({payload, ws});
        });
    };
}