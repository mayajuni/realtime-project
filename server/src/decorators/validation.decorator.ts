import * as AJV from 'ajv';
import { SocketError } from '../modules/error.module';

const ajv = AJV(({removeAdditional: true}));

export function Validation(jsonSchema: object) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        const originalMethod = descriptor.value;

        descriptor.value = function () {
            const payload = arguments[0].payload;
            // validation 체크를 한다 통과하지 못하면 ajv.errors 보면 된다.
            if (!ajv.validate(jsonSchema, payload)) {
                throw new SocketError(ajv.errorsText(), 'validation', 422);
            }

            const result = originalMethod.apply(this, [...arguments]);
            return result;
        };

        return descriptor;
    };
}