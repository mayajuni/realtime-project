import { AuthorizeError } from '../modules/error.module';

export function Login() {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        const originalMethod = descriptor.value;

        descriptor.value = function () {
            const params = arguments[0];
            if(!params.ws.user) {
                throw new AuthorizeError(`[${params.route}-${params.action}] protected from guests`);
            }
            const result = originalMethod.apply(this, [...arguments]);
            return result;
        };

        return descriptor;
    };
}