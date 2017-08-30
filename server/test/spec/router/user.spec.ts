import * as WebSocket from 'uws';
import * as chai from 'chai';
import { sign } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { join } from 'path';
import InitDB from '../../../src/db/index';

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

    describe('authorizeToken Test', () => {
        it('authorizeToken', done => {
            const param = {test: 123};
            const token = sign(param, process.env.JWT_KEY);
            ws.send(JSON.stringify({route: 'User', action: 'authorizeToken', payload: {token: token}}));
            ws.onmessage = (event: any) => {
                const params = JSON.parse(event.data);

                params.route.should.equal('user');
                params.action.should.equal('setUserInfo');
                params.payload.user.test.should.equal(param.test);
                params.payload.token.should.equal(token);
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
                params.payload.error.name.should.equal('validation');
                params.payload.error.code.should.equal(422);
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
                params.payload.error.name.should.equal('authorize');
                params.payload.error.code.should.equal(401);
                done();
            };
        });
    });

    describe('register Test', () => {
        it('register validation check', done => {
            const payload = {
                password: 'test',
                kakaoId: '3242',
                facebookId: '3242',
                googleId: '3242',
            };
            let index = 0;

            ws.send(JSON.stringify({route: 'User', action: 'register', payload}));
            ws.onmessage = (event: any) => {
                const params = JSON.parse(event.data);

                params.route.should.equal('error');
                params.payload.error.name.should.equal('validation');
                params.payload.error.code.should.equal(422);
                if (index < 1) {
                    ws.send(JSON.stringify({
                        route: 'User',
                        action: 'register',
                        payload: {email: 'test@test.com', name: 'test'}
                    }));
                    index++;
                } else {
                    done();
                }
            };
        });

        it('register', (done) => {
            const payload = {
                email: 'test@test.com',
                name: 'test',
                password: 'test',
                kakaoId: '3242',
                facebookId: '3242',
                googleId: '3242',
            };

            ws.send(JSON.stringify({route: 'User', action: 'register', payload}));
            ws.onmessage = (event: any) => {
                const params = JSON.parse(event.data);

                params.route.should.equal('user');
                params.action.should.equal('setUserInfo');
                params.payload.user.email.should.equal(payload.email);
                params.payload.user.name.should.equal(payload.name);
                params.payload.should.haveOwnProperty('token');
                done();
            };
        });

        it('register 중복 체크', (done) => {
            const payload = {
                email: 'test@test.com',
                name: 'test',
                password: 'test',
            };

            ws.send(JSON.stringify({route: 'User', action: 'register', payload}));
            ws.onmessage = (event: any) => {
                const params = JSON.parse(event.data);

                params.route.should.equal('error');
                params.payload.error.name.should.equal('register');
                params.payload.error.code.should.equal(422);
                done();
            };
        });

        after(async () => {
            const db = new InitDB();
            await db.connect();
            db.r.table('users').delete().run();
        });
    });
});