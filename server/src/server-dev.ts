/**
 * Created by mayajuni on 2016. 11. 21..
 */
import * as dotenv from 'dotenv';
import AppServer from './app.server';

dotenv.config({
    path: '../.env'
});

new AppServer();
