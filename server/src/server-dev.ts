/**
 * Created by mayajuni on 2016. 11. 21..
 */
import * as dotenv from 'dotenv';
import AppServer from './app.server';

dotenv.config({
    path: '../.env'
});

let _resolve: any;

const readyPromise = new Promise(resolve => {
    _resolve = resolve;
});

const appServer = new AppServer();
appServer.listen().then(() => {
    _resolve();
});

/* 테스트를 위해서 아래와 같이 처리 한다. */
export const ready = readyPromise;
export const close = () => appServer.wss.close();
