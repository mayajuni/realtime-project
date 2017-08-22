/**
 * Created by mayaj on 2016-04-23.
 */
import {LoggerModule} from './logger.module';

export namespace ErrorModule {
    /**
     * express에서 넘어온 error를 모두 처리한다.
     * 마지막은 에러 코드 및 에러 메세지를 res.send 처리 한다.
     *
     * @param err - error
     * @param req - request
     * @param res - response
     * @param next - next
     */
    export const handler = (err: any, req: any, res: any, next: any): void => {
        /* 에러처리 */
        err.status  = err.status || 500;

        LoggerModule.error(`error on requst ${req.method} | ${req.url} | ${err.status}`);
        LoggerModule.error(err.stack || `${err.code}  ${err.message}`);

        err.message = err.status  == 500 ? 'Something bad happened.' : err.message;
        res.status(err.status).send(err.message);
    };

    /**
     * error Throw를 해준다.
     *
     * @param status
     * @param message
     */
    export const errThrow = (status: number, message: string): void => {
        const err: any = new Error(message);

        err.status = status;
        throw err;
    };

}