const express = require('express');
const app = express();
const { ExpressPeerServer } = require('peer');

app.get('/', (req, res, next) => { 
    console.log('GET /')
    res.send('Tracker Online!'); 
});

const server = app.listen(9000);

const options = {
    debug: true,
    path: '/peerjs'
}

const peerserver = ExpressPeerServer(server, options);

app.use(options.path, peerserver);

peerserver.on('connection', (client) => {
    console.log('Socket Client Connected!');
    console.log(client);
});

peerserver.on('disconnect', (client) => { 
    console.log('Socket Client Disconnected!');
    console.log(client);
});