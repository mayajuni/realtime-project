/**
 * Created by mayaj on 2016-04-22.
 */
import * as winston from 'winston';
import * as moment from 'moment';
import * as fs from 'fs';

export namespace LoggerModule {
    export const error = (msg: any) => {
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        const errorLog = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({
                    colorize: true,
                    level: 'error'
                })
            ]
        });

        errorLog.error(msg);
    };

    export const log = (msg: any) => {
        if (process.env.NODE_ENV === 'test') {
            return;
        }
        const infoLog = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({
                    colorize: true,
                    level: 'info'
                })
            ]
        });

        infoLog.info(msg);
    };

    /**
     * 파일 체크
     */
    const checkDir = (dir: string): void => {
        if (!fs.existsSync('logs')) {
            fs.mkdirSync('logs');
        }
        if (!fs.existsSync(`logs/${dir}`)) {
            fs.mkdirSync(`logs/${dir}`);
        }
    };

    /**
     * 파일 저장(정상)
     *
     * @param req
     * @param res
     * @param next
     */
    export const saveLogFile = (msg: any) => {
        checkDir('server');

        const infoFileLog = new (winston.Logger)({
            transports: [
                new (winston.transports.File)({
                    name: 'info-file',
                    filename: 'logs/server/' + moment().format('YYYY-MM-DD') + '.log',
                    level: 'info'
                })
            ]
        });
        infoFileLog.log('info', '', msg);
    };

    /**
     * 파일 저장(에러일때)
     *
     * @param err
     * @param req
     * @param res
     * @param next
     */
    export const saveErrorLogFile = (msg: any) => {
        checkDir('error');

        const errorFileLog = new (winston.Logger)({
            transports: [
                new (winston.transports.File)({
                    name: 'info-file',
                    filename: 'logs/error/' + moment().format('YYYY-MM-DD') + '.log',
                    level: 'error'
                })
            ]
        });

        errorFileLog.log('info', '', msg);
    };
}