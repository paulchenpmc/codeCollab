const express = require("express");
var cors = require('cors')
const { ExpressPeerServer } = require('peer');
const app = express();
const http = require("http");
const socketIO = require("socket.io");
const httpRoute = require('./routes/httpRoute');

let session_list = ['test1', 'test2', 'test3'];

// let session = {
//     id: '',             // Unique session id
//     document_name: '',  // title of the document
//     peers: []           // List of peers in the session
// }

// let peer = {
//     id: '',     // PeerJS Peer ID
//     name: '',   // Display name?
//     color: ''   // Display color?
// }

// HTTP Server
app.use(cors());
app.use(express.json({ limit: '2MB' }));
app.use('/', httpRoute);

// PeerJS Server. Tracks peer location info for p2p connections.
const pjs_server = app.listen(8000);
const peerServer = ExpressPeerServer(pjs_server, {path: '/tracker'});
app.use('/peerjs', peerServer);

peerServer.on('connection', peer => {
  console.log('\nnew peerjs connection: ' + peer.id);
});

peerServer.on('disconnect', peer => {
  console.log('\nlost peerjs connection: ' + peer.id);
});

// Socket.io Server. The channel for sending messages to a specific peer from the server. 
const sio_server = http.createServer(app);
const io = socketIO(sio_server);

io.on("connection", peer => {
  console.log('\nnew socket.io connection: ' + peer.id);

  peer.emit("session_list", session_list);

  peer.on("disconnect", () => console.log("lost socket.io connection " + peer.id));
});

sio_server.listen(8001, function () {
  console.log("HTTP listening on: *:8000");
  console.log("PeerJS listening on *:8000/peerjs/tracker");
  console.log("Socket.IO listening on *:8001");
});
