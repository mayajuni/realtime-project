const exec = require('child_process').exec;

// server build
const serverBuild = exec('cd server && npm start', (error) => {
    if (error) {
        throw new Error(error);
    }
});
serverBuild.stdout.pipe(process.stdout);

// start server

// start vue
setTimeout(() => {
    const vue = exec('cd vue && npm run dev', (error) => {
        if (error) {
            console.error(error);
        }
        server.close();
    });
    vue.stdout.pipe(process.stdout);
});
