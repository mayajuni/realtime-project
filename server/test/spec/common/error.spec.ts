import * as WebSocket from 'uws';
import * as chai from 'chai';
chai.should();

const url = 'ws://localhost:3000';

let ws: any;

describe('Common Error Test', () => {
    before(done => {
        ws = new WebSocket(url, 'echo-protocol');

        ws.onopen = () => {
            done();
        };
        ws.onerror = (error: any) => {
            done(error);
        };
    });

    it('event is null 테스트', done => {
        ws.onmessage = (event: any) => {
            const params = JSON.parse(event.data);
            const errorName = params.payload.error.name;
            const route = params.route;
            route.should.equal('error');
            errorName.should.equal('NullPointError');
            done();
        };
        ws.send();
    });

    it('not found router 테스트', done => {
        ws.onmessage = (event: any) => {
            const params = JSON.parse(event.data);
            const errorName = params.payload.error.name;
            const route = params.route;
            route.should.equal('error');
            errorName.should.equal('NotFoundError');
            done();
        };
        ws.send(JSON.stringify({route: 'test'}));
    });
});