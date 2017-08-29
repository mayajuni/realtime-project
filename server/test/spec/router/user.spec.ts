import * as WebSocket from 'uws';
import * as chai from 'chai';
import { sign } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { join } from 'path';

chai.should();

dotenv.config({
    path: join(__dirname, '..', '..', '..', '.env')
});

const url = 'ws://localhost:3000';

let ws: any;

describe('User Test', () => {
    before(done => {
        ws = new WebSocket(url, 'echo-protocol');

        ws.onopen = () => {
            done();
        };
        ws.onerror = (error: any) => {
            done(error);
        };
    });

    it('authorizeToken', done => {
        const param = {test: 123};
        const token = sign(param, process.env.JWT_KEY);
        ws.send(JSON.stringify({route: 'User', action: 'authorizeToken', payload: {token: token}}));
        ws.onmessage = (event: any) => {
            const params = JSON.parse(event.data);

            params.route.should.equal('user');
            params.action.should.equal('setUserInfo');
            params.payload.test.should.equal(param.test);
            done();
        };
    });

    it('authorizeToken validation check', done => {
        const param = {test: 123};
        const token = sign(param, process.env.JWT_KEY);
        ws.send(JSON.stringify({route: 'User', action: 'authorizeToken', payload: {token2: token}}));
        ws.onmessage = (event: any) => {
            const params = JSON.parse(event.data);

            params.route.should.equal('error');
            params.payload.error.name.should.equal('ValidationError');
            done();
        };
    });

    it('authorizeToken jwt key check', done => {
        const param = {test: 123};
        const token = sign(param, 'test');
        ws.send(JSON.stringify({route: 'User', action: 'authorizeToken', payload: {token: token}}));
        ws.onmessage = (event: any) => {
            const params = JSON.parse(event.data);

            params.route.should.equal('error');
            params.payload.error.name.should.equal('JsonWebTokenError');
            done();
        };
    });
});