import * as WebSocket from 'uws';
import * as chai from 'chai';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { expect } from 'chai';


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
let id: string;
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

    it('insert', done => {
        const payload: any = {
            name: 'test',
            order: 0,
            items: []
        };
        ws.send(JSON.stringify({route: 'Board', action: 'subscribe'}));
        ws.onmessage = (event: any) => {
            ws.send(JSON.stringify({route: 'Board', action: 'unsubscribe'}));

            const params = JSON.parse(event.data);
            params.route.should.equal('board');
            params.action.should.equal('subscribe');
            params.payload.should.haveOwnProperty('new_val');
            expect(params.payload.old_val).to.be.null;
            id = params.payload.new_val.id;
            done();
        };
        setTimeout(() => ws.send(JSON.stringify({route: 'Board', action: 'addList', payload: payload})));
    });

    it('update', done => {
        const payload: any = {
            id: id,
            name: 'test222',
            order: 1,
            items: [{name: 'sub'}]
        };
        ws.send(JSON.stringify({route: 'Board', action: 'subscribe'}));
        ws.onmessage = (event: any) => {
            ws.send(JSON.stringify({route: 'Board', action: 'unsubscribe'}));

            const params = JSON.parse(event.data);
            params.route.should.equal('board');
            params.action.should.equal('subscribe');
            params.payload.should.haveOwnProperty('new_val');
            params.payload.should.haveOwnProperty('old_val');
            params.payload.new_val.name.should.equal(payload.name);
            params.payload.new_val.items[0].name.should.equal(payload.items[0].name);
            done();
        };
        setTimeout(() => ws.send(JSON.stringify({route: 'Board', action: 'updateList', payload: payload})));
    });

    it('delete', done => {
        ws.send(JSON.stringify({route: 'Board', action: 'subscribe'}));
        ws.onmessage = (event: any) => {
            ws.send(JSON.stringify({route: 'Board', action: 'unsubscribe'}));

            const params = JSON.parse(event.data);
            params.route.should.equal('board');
            params.action.should.equal('subscribe');
            expect(params.payload.new_val).to.be.null;
            params.payload.should.haveOwnProperty('old_val');
            done();
        };
        setTimeout(() => ws.send(JSON.stringify({route: 'Board', action: 'removeList', payload: {id: id}})));
    });
});