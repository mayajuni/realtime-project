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
            const error = params.payload.error;
            const route = params.route;
            route.should.equal('error');
            error.name.should.equal('nullError');
            error.code.should.equal(422);
            done();
        };
        ws.send();
    });

    it('not found router 테스트', done => {
        ws.onmessage = (event: any) => {
            const params = JSON.parse(event.data);
            const error = params.payload.error;
            const route = params.route;
            route.should.equal('error');
            error.name.should.equal('notFound');
            error.code.should.equal(404);
            done();
        };
        ws.send(JSON.stringify({route: 'test'}));
    });
});