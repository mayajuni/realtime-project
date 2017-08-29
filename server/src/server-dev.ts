/**
 * Created by mayajuni on 2016. 11. 21..
 */
import * as dotenv from 'dotenv';
import AppServer from './app.server';
import { join } from 'path';

dotenv.config({
    path: join(__dirname, '..', '.env')
});

/* 서버 구동 */
new AppServer();
