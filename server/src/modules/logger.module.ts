/**
 * Created by mayaj on 2016-04-22.
 */
import * as winston from 'winston';
import * as moment from 'moment';
import * as fs from 'fs';

export namespace LoggerModule {
    export const error = (msg: any) => {
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

    const infoFileLog = new (winston.Logger)({
        transports: [
            new (winston.transports.File)({
                name: 'info-file',
                filename: 'logs/server/' + moment().format('YYYY-MM-DD') + '.log',
                level: 'info'
            })
        ]
    });

    const errorFileLog = new (winston.Logger)({
        transports: [
            new (winston.transports.File)({
                name: 'info-file',
                filename: 'logs/error/' + moment().format('YYYY-MM-DD') + '.log',
                level: 'error'
            })
        ]
    });

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
     * meta 초기값 설정
     *
     * @param req
     * @param res
     * @returns {any}
     */
    const settingMeta = (req: any, res: any): any => {
        const meta: any = {
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            req: {},
            res: {}
        };

        meta.req.url = req.originalUrl || req.url;
        meta.req.method = req.method;
        meta.req.httpVersion = req.httpVersion;
        meta.req.query = req.query || '';
        meta.req.params = req.params || '';
        meta.req.body = req.body || '';
        meta.req['accept-language'] = req.headers['accept-language'];
        meta.req['accept-language'] = req.headers['user-agent'];
        meta.responseTime = res.responseTime;
        meta.res.statusCode = res.statusCode;

        return meta;
    };

    /**
     * 파일 저장(정상)
     *
     * @param req
     * @param res
     * @param next
     */
    export const saveLogFile = (req: any, res: any, next: any) => {
        checkDir('server');

        const meta: any = settingMeta(req, res);

        const end = res.end;
        res.end = (chunk: any, encoding: any) => {
            res.end = end;
            res.end(chunk, encoding);

            if (chunk) {
                const isJson = (res._headers && res._headers['content-type']
                    && res._headers['content-type'].indexOf('json') >= 0);
                meta.res.body = isJson ? JSON.parse(chunk) : chunk.toString();
            }

            infoFileLog.log('info', '', meta);
        };

        next();
    };

    /**
     * 파일 저장(에러일때)
     *
     * @param err
     * @param req
     * @param res
     * @param next
     */
    export const saveErrorLogFile = (err: any, req: any, res: any, next: any) => {
        checkDir('error');

        if (err.status >= 400) {
            const meta: any = settingMeta(req, res);
            meta.error = err;
            errorFileLog.log('error', '', meta);
        }

        next(err);
    };
}