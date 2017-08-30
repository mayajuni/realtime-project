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

    describe('Login test', () => {
        it('login validation check', done => {
            const payload = {
                kakaoId: '3242',
                facebookId: '3242',
                googleId: '3242',
            };
            let index = 0;

            ws.send(JSON.stringify({route: 'User', action: 'login', payload}));
            ws.onmessage = (event: any) => {
                const params = JSON.parse(event.data);

                params.route.should.equal('error');
                params.payload.error.name.should.equal('validation');
                params.payload.error.code.should.equal(422);
                if (index < 1) {
                    ws.send(JSON.stringify({
                        route: 'User',
                        action: 'login',
                        payload: {email: 'test@test.com'}
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
                kakaoId: '3242',
                facebookId: '3242',
                googleId: '3242',
                type: 'kakao',
            };

            ws.send(JSON.stringify({route: 'User', action: 'login', payload}));
            ws.onmessage = (event: any) => {
                const params = JSON.parse(event.data);
                params.route.should.equal('user');
                params.action.should.equal('setUserInfo');
                params.payload.user.email.should.equal(payload.email);
                params.payload.should.haveOwnProperty('token');
                done();
            };
        });

        it('login check', (done) => {
            const email = 'test@test.com';
            ws.send(JSON.stringify({
                route: 'User',
                action: 'login',
                payload: {email: email, kakaoId: '3242', type: 'kakao'}
            }));
            ws.send(JSON.stringify({
                route: 'User',
                action: 'login',
                payload: {email: email, facebookId: '3242', type: 'facebook'}
            }));
            ws.send(JSON.stringify({
                route: 'User',
                action: 'login',
                payload: {email: email, googleId: '3242', type: 'google'}
            }));

            let index = 0;
            ws.onmessage = (event: any) => {
                const params = JSON.parse(event.data);

                params.route.should.equal('user');
                params.action.should.equal('setUserInfo');
                params.payload.user.email.should.equal(email);
                params.payload.should.haveOwnProperty('token');
                if (index < 2) {
                    index++;
                } else {
                    done();
                }
            };
        });

        it('가입은 되어 있지만 sns 고유 id가 다를 경우', (done) => {
            ws.send(JSON.stringify({
                route: 'User',
                action: 'login',
                payload: {email: 'test@test.com', kakaoId: '324222', type: 'kakao'}
            }));

            ws.onmessage = (event: any) => {
                const params = JSON.parse(event.data);

                params.route.should.equal('error');
                params.payload.error.name.should.equal('login');
                params.payload.error.code.should.equal(401);
                done();
            };
        });

        it('tpye과 sns id가 다를경우', (done) => {
            ws.send(JSON.stringify({
                route: 'User',
                action: 'login',
                payload: {email: 'test@test.com', kakaoId: '324222', type: 'facebook'}
            }));

            ws.onmessage = (event: any) => {
                const params = JSON.parse(event.data);

                params.route.should.equal('error');
                params.payload.error.name.should.equal('login');
                params.payload.error.code.should.equal(401);
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