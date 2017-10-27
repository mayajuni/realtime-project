import * as WebSocket from 'uws';
import * as chai from 'chai';
import * as dotenv from 'dotenv';
import {join} from 'path';
import {expect} from 'chai';


chai.should();

dotenv.config({
    path: join(__dirname, '..', '..', '..', '.env')
});

const url = 'ws://localhost:3000';

const login = (ws: any, done: any) => {
    const payload = {
        email: 'test123@test.com',
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
};

let ws: any;
describe('Board Test', () => {
    before(done => {
        ws = new WebSocket(url, 'echo-protocol');

        ws.onopen = () => {
            login(ws, done);
        };
        ws.onerror = (error: any) => {
            done(error);
        };
    });

    it('change', done => {
        const payload: any = {
            lists: [{title: 'test1', cards: []}, {title: 'test2', cards: [{id: Date.now(), title: 'card1'}]}]
        };
        ws.send(JSON.stringify({route: 'Board', action: 'subscribe'}));
        let index = 0;
        ws.onmessage = (event: any) => {
            ws.send(JSON.stringify({route: 'Board', action: 'unsubscribe'}));
            const params = JSON.parse(event.data);
            params.route.should.equal('board');
            params.action.should.equal('subscribe');
            if (index === 0) {
                done();
                index++
            }
        };
        setTimeout(() => ws.send(JSON.stringify({route: 'Board', action: 'changeLists', payload: payload})));
    });
});