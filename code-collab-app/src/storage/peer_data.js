import Peer from 'peerjs';
import { observable, action } from 'mobx';
import io from 'socket.io-client';

// Tracker server config for peerjs
const config = {
        host: 'localhost',
        port: 8000,
        path: '/peerjs/tracker'
};

const peer_data = observable({
    //  hard coded data for now
    session_list: [],
    session_peers: [],
    session_peers_conn: [],
    peer: null,

    peer_id: '',
    current_session: '',
    current_session_id: '',
    tracker: null,
    doc_data: ['Hello World.', 'This is a test.'],

    initialize() {
        // will change later, hard coded for now
        this.tracker = io('http://localhost:8001/');
        this.tracker.on('session_list', list => {
            this.session_list = list;
        });
    },

    create_new_session(session_name) {
        this.peer = new Peer(config);

        this.peer.on('open', id => {
            this.peer_id = id;

            let peer_info = {
                "session_name": session_name,
                "peer_id": this.peer_id
            };

            //  inform tracker new session info
            this.tracker.emit('new_session', peer_info);

            this.tracker.on('session_created', session_info => {
                this.current_session = session_info.session_name;
                this.current_session_id = session_info.session_id;
            });
        })
    },

    //  Join an active session or open preexisted doc
    join_session(session_name, session_id) {
        this.current_session = session_name;
        this.current_session_id = session_id;

        this.peer = new Peer(config);

        this.peer.on('open', id => {
            this.peer_id = id;

            let peer_info = {
                "session_name": this.current_session,
                "session_id": this.current_session_id,
                "peer_id": this.peer_id
            };

            //  Request list of peers in <session_name> session
            this.tracker.emit('join_session', peer_info);

            //  wait for a list of peers currently in the session
            this.tracker.on('peer_list', list => {
                this.session_peers = list;
                this.request_doc_data();
            });
        });
    },

    //  request for current session's doc data 
    //  from a fellow peer
    request_doc_data() {
        //  check the number of peers in current session
        //  if == 0, then no need to connect to other peers
        if (this.session_peers.length !== 0) {
            //  connect with all peers
            this.session_peers.forEach( (p, i) => {
                this.session_peers_conn[i] = this.peer.connect(p);
            });

            //  request doc data from one of them
            this.session_peers_conn[0].on('open', () => {
                this.session_peers_conn[0].send('get doc');
            });

            this.session_peers_conn[0].on('error', err => {
                console.log(err);
            });

            this.session_peers_conn[0].on('data', data => {
                console.log(data);
            });
        }
    },

    //  listen for other peer's initial connection
    //  and their request for the doc data
    listen_for_req() {
        this.peer.on('connection', dataConnection => {
            dataConnection.on('error', err => {
                console.log("listen for req err: " + err);
            });

            dataConnection.on('data', data => {
                dataConnection.send(this.doc_data);
            });
        });
    },

    upload_document(d) {
        this.doc_data = d;
    },

    // Get document data from the tracker if no peer active for the document
    get_document_data(session_id) {
        this.tracker.emit('get_doc_data', session_id);
    }
},
{
    initialize: action,
    create_new_session: action,
    join_session: action,
    upload_document: action,
    get_document_data: action,
});

export default peer_data;