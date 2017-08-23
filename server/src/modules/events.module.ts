import { EventEmitter } from 'events';
import { NotFoundError } from './error.module';

export const eventEmitter = new EventEmitter();

export const checkRoute = (route: string) => {
    const eventNames = eventEmitter.eventNames();
    if (eventNames.some((eventName) => eventName !== route)) {
        throw new NotFoundError('not found route');
    }
};

// 중복된 event를 등록 하는 경우를 막기 위해 설정
eventEmitter.setMaxListeners(1);