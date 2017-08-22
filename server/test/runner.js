const server = require('../dist/server');
const spawn = require('cross-spawn');

server.ready.then(() => {
    const runner = spawn('./node_modules/.bin/mocha', ['-r', 'ts-node/register', './**/**.spec.ts'], { stdio: 'inherit' });

    runner.on('exit', function (code) {
        server.close();
        process.exit(code);
    });

    runner.on('error', function (err) {
        server.close();
        throw err;
    });
});