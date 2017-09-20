/**
 * Created by mayajuni on 2016. 11. 21..
 */
import * as dotenv from 'dotenv';
import AppServer from './app.server';
import { join } from 'path';

dotenv.config({
    path: join(__dirname, '..', '.env')
});

let _resolve: any;
const readyPromise = new Promise(resolve => {
    _resolve = resolve;
});

const appServer = new AppServer();
appServer.listen().then(() => {
    _resolve();
});

export const ready = readyPromise;
export const close = () => appServer.wss.close();