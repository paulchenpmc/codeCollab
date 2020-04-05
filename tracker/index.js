const express = require("express");
var cors = require('cors')
const { ExpressPeerServer } = require('peer');
const app = express();
const http = require("http");
const socketIO = require("socket.io");
const httpRoute = require('./routes/httpRoute');
const peerRoute = require('./routes/peerRoute');

// HTTP Server
app.use(cors());
app.use(express.json({ limit: '2MB' }));
app.use('/', httpRoute);

// PeerJS Server. Tracks peer location info for p2p connections.
const pjs_server = app.listen(8000);
const peerServer = ExpressPeerServer(pjs_server, { path: '/tracker' });
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

  // Send list of documents/sessions
  peer.emit("session_list", peerRoute.getSessionList());

  // Create new session
  peer.on('new_session', data => {
    const session = peerRoute.addSession(data.session_name, data.peer_id);
    peer.emit("session_created", {
      session_id: session.id,
      session_name: session.document_name
    });

    peerRoute.saveSession(session.id, session.data);
  });

  // Join existing session
  peer.on('join_session', data => {
    const peers = peerRoute.addPeer(data.session_id, data.peer_id);
    peer.emit('peer_list', peers || []);
  });

  // Get document data request
  peer.on('get_doc_req', session_id => {
    const document = peerRoute.getDocument(session_id)
    socket.emit('get_doc_res', { doc: document });
  });

  peer.on("disconnect", () => console.log("lost socket.io connection " + peer.id));
});

sio_server.listen(8001, function () {
  console.log("HTTP listening on: *:8000");
  console.log("PeerJS listening on *:8000/peerjs/tracker");
  console.log("Socket.IO listening on *:8001");
});

// Initialize the tracker state from saved files
peerRoute.loadSessions();
