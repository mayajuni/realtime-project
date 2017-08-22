import { eventEmitter } from '../modules/events.module';

export function Router(name?: string) {
    return (target: any) => {
        const targetInstance = new target();
        const eventName = name || target.name;
        try {
            eventEmitter.on(eventName, ({type, payload, ws}) => {
                try {
                    targetInstance[type]({payload, ws});
                } catch (error) {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(2);
            console.error(error);
        }
    };
}