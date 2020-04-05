import Peer from 'peerjs';
import { observable, action } from 'mobx';
import io from 'socket.io-client';

const GET_DOC_REQ = 'get_doc_req';
const GET_DOC_RES = 'get_doc_res';
const CELL_UPDATE = 'cell_update';

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
    doc_data: [],
    current_cell: null,
    cell_count: 0,
    cell_locked: [],

    initialize() {
        // will change later, hard coded for now
        if(this.tracker === null){
            this.tracker = io('http://localhost:8001/');
            this.attach_tracker_callbacks();
        }
    },
    
    attach_tracker_callbacks(){
        this.tracker.on('session_list', list => {
            this.session_list = list;
        });
        this.tracker.on('session_created', session_info => {
            console.log('new session created.');
            this.current_session = session_info.session_name;
            this.current_session_id = session_info.session_id;
        });
        //  wait for a list of peers currently in the session
        this.tracker.on('peer_list', list => {
            console.log('existing session joined.');
            this.session_peers = list.filter(peerId => peerId !== this.peer_id);
            this.request_doc_data();
        });
        this.tracker.on(GET_DOC_RES, data => {
            this.doc_data.push(...data);
        });
    },

    reset(){
        console.log('reseting all the values');
        this.session_peers = [];
        this.session_peers_conn = [];
        if(this.peer !== null){
            this.peer.destroy();
        }
        this.peer_id = '';
        this.current_session = '';
        this.current_session_id = '';
        this.doc_data = [];
        this.current_cell = null;
        this.cell_count = 0;
        this.cell_locked = [];
    },

    create_new_session(session_name) {
        this.reset();
        this.peer = new Peer(config);

        this.peer.on('open', id => {
            this.peer_id = id;

            let peer_info = {
                "session_name": session_name,
                "peer_id": this.peer_id
            };

            //  inform tracker new session info
            console.log('creating new session...');
            this.tracker.emit('new_session', peer_info);
        })
    },

    //  Join an active session or open preexisted doc
    join_session(session_name, session_id) {
        this.reset();
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
            console.log('joining existing session...');
            this.tracker.emit('join_session', peer_info);
        });
    },

    //  request doc data from a peer
    request_doc_data() {
        // if peers exist, ask data from them otherwise ask the tracker
        if (this.session_peers.length !== 0) {
            //  connect with all peers
            this.session_peers.forEach((peerId, index) => {
                this.session_peers_conn[index] = this.peer.connect(peerId);

                this.session_peers_conn[index].on('open', () => {
                    
                    // ask the first peer for document data
                    if(index === 0){
                        this.session_peers_conn[index].send({
                            message_type: GET_DOC_REQ 
                        });
                    }

                    // setting up data callback
                    this.session_peers_conn[index].on('data', data => {
                        this.handle_data_from_peers(data, this.session_peers_conn[index])
                    });

                    // listening to errors on any data connections
                    this.session_peers_conn[index].on('error', error => {
                        this.handle_error_from_peers(error);
                    });

                    // listening to errors on any data connections
                    this.session_peers_conn[index].on('close', () => {
                        this.handle_peer_disconnect(this.session_peers_conn[index]);
                    });                    
                });

            });
        }
        else{
            // Making a call to the tracker to get doc data
            this.tracker.emit(GET_DOC_REQ, this.current_session_id);
        }
    },

    //  listen for other peer's initial connection
    //  and their request for the doc data
    listen_for_req() {
        this.peer.on('connection', dataConnection => {
            // adding the newly connected peer to the list
            dataConnection.on('open', () => {
                this.session_peers.push(dataConnection.peer);
                this.session_peers_conn.push(dataConnection);

                dataConnection.on('error', error => {
                    this.handle_error_from_peers(error);
                });
    
                dataConnection.on('data', data => {
                    this.handle_data_from_peers(data, dataConnection);
                });
    
                // listening to errors on any data connections
                dataConnection.on('close', () => {
                    this.handle_peer_disconnect(dataConnection);
                });                       
            });
        });
    },

    handle_data_from_peers(data, dataConnection){
        // Received a get doc request
        if(data.message_type && data.message_type === GET_DOC_REQ){
            console.log('received a get doc data request from another peer, sending data...');
            dataConnection.send({
                message_type: GET_DOC_RES,
                content: this.doc_data
            });
        }
        // Received a get doc response
        else if(data.message_type && data.message_type === GET_DOC_RES && data.content){
            console.log('received doc data from another peer');
            this.doc_data.push(...data.content);
        }
        // Received a cell update
        else if(data.message_type && data.message_type === CELL_UPDATE && data.content){
                if(data.content.index >= 0){
                    this.doc_data[data.content.index] = data.content.value;
                }
        }
        else{
            // TODO -- do something more with this data
            console.log(data);
        }
    },

    handle_error_from_peers(error){
        console.log(error);
    },

    handle_peer_disconnect(data_connection){
        console.log('a peer has been disconnected');
        // remove the disconnected peer
        this.session_peers = this.session_peers.filter(peerId => peerId !== data_connection.peer);
        this.session_peers_conn = this.session_peers_conn.filter(conn => conn.peer !== data_connection.peer);
    },

    upload_document(new_data) {
        this.doc_data.push(...new_data);
    },

    add_new_cell(cell_contents){
        this.doc_data.push(cell_contents);
        this.cell_locked.push(false);
        this.increment_cell_count();
        this.send_cell_update(this.doc_data.length - 1);
    },

    update_existing_cell(index, value){
        this.doc_data[index] = value;
    },

    set_current_cell(index){
        this.current_cell = index;
    },

    increment_cell_count(){
        this.cell_count += 1;
    },

    set_cell_locked(index, value){
        this.cell_locked[index] = value;
    },

    send_cell_update(key){
        // broadcast to cell
        console.log('sending the cell update to all the peers');
        if(this.session_peers_conn !== null){
            this.session_peers_conn.forEach(peer_conn => {
                peer_conn.send({
                    message_type: CELL_UPDATE,
                    content: {
                        index: key,
                        value: this.doc_data[key]
                    }
                });
            });
        }
    },

    get_current_cell(){
        return this.current_cell;
    }
},
{
    initialize: action,
    create_new_session: action,
    join_session: action,
    upload_document: action,
    add_new_cell: action,
    update_existing_cell: action,
    set_current_cell: action,
    set_cell_locked: action,
    send_cell_update: action,
    get_current_cell: action,
});

export default peer_data;