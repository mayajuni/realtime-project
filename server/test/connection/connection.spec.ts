import * as WebSocket from 'uws';

const url = 'ws://localhost:3000';

describe('Connection Test', () => {
    it('connect 테스트', done => {
        const ws = new WebSocket(url, 'echo-protocol');

        ws.onopen = event => {
            done();
            ws.close();
        };
        ws.onerror = err => {
            done(err);
        };
    });

    it('disconnect 테스트', done => {
        const ws = new WebSocket(url, 'echo-protocol');

        ws.onopen = event => {
            ws.close()
        };
        ws.onerror = err => {
            done(err)
        };
        ws.onclose = () => {
            done()
        };
    });
});