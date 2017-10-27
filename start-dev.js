const exec =  require('child_process').exec;

// server build
const serverBuild = exec('cd server && npm start', (error) => {
  if (error) {
    throw new Error(error);
  }
});

// start server
require('./server/dist/server').ready.then(() => {
    // start vue
    const vue = exec('cd vue && npm run dev', (error) => {
        if (error) {
            console.error(error);
        }
        server.close();
    });

    vue.stdout.pipe(process.stdout);
});

serverBuild.stdout.pipe(process.stdout);
