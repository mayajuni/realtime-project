import { SocketError } from '../modules/error.module';

export function Login() {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        const originalMethod = descriptor.value;

        descriptor.value = function () {
            const params = arguments[0];
            if(!params.ws.user) {
                throw new SocketError(`[${params.route}-${params.action}] protected from guests`, 'authorize', 401);
            }
            const result = originalMethod.apply(this, [...arguments]);
            return result;
        };

        return descriptor;
    };
}