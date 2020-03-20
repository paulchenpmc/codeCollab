import Peer from 'peerjs';
import {observable, action, computed} from 'mobx';
import io from 'socket.io-client';

const peer_data = observable({
    //  hard coded data for now
    session_list: ['test1', 'test2', 'test3'],
    session_peers: [],
    session_peers_conn: [],
    peer: null,

    peer_id: -1,
    current_session: 'test1',
    current_session_id: '1',                        //  in case 2 files have the same name
    socket: null,
    doc_data: 'Hello World.',

    initialize(){
        console.log('in initialize function');
        // will change later, hard coded for now
        this.socket = io('http://localhost:8000/');
        this.socket.on('session_list', function (list) {
            this.session_list = JSON.parse(list);
        });
    },

    create_new_session(session_name){
        this.peer = new Peer();

        this.peer.on('open', function(id){
            this.peer_id = id;
            console.log("id: " + this.id);

            let peer_info = {   "session_name": session_name, 
                                "peer_id": this.peer_id};

            //  inform tracker new session info
            this.socket.emit('new session', JSON.stringify(peer_info));

            this.socket.on('session created', function(session_info){
                let temp = JSON.parse(session_info);
                this.current_session = temp.session_name;
                this.current_session_id = temp.session_id;
            });

            this.listen_for_req();
        })
    },

    //  Join an active session or open preexisted doc
    join_session(session_name){
        this.current_session = session_name;

        this.peer = new Peer();

        this.peer.on('open', function(id){
            this.peer_id = id;
            console.log("id: " + this.id);

            let peer_info = {   "session_name": session_name, 
                                "peer_id": this.peer_id};

            //  Request list of peers in <session_name> session
            this.socket.emit('join session', JSON.stringify(peer_info));

            //  wait for a list of peers currently in the session
            this.socket.on('peer_list', function(list){
                this.session_peers = JSON.parse(list);
                this.request_doc_data();
            });

            this.listen_for_req();
        });
    },

    //  request for current session's doc data 
    //  from a fellow peer
    request_doc_data(){
        //  check the number of peers in current session
        //  if == 0, then no need to connect to other peers
        if(this.session_peers.length !== 0){
            //  connect with all peers
            this.session_peers.forEach(function(p, i){
                this.session_peers_conn[i] = this.peer.connect(p);
            });

            //  request doc data from one of them
            this.session_peers_conn[0].on('open', function(){
                this.session_peers_conn[0].send('get doc');
            });

            this.session_peers_conn[0].on('error', function(err){
                console.log(err);
            });

            this.session_peers_conn[0].on('data', function(data){
                console.log(data);
            });
        }
    },

    //  listen for other peer's initial connection
    //  and their request for the doc data
    listen_for_req(){
        this.peer.on('connection', function(dataConnection) { 
            dataConnection.on('error', function(err){
                console.log("listen for req err: " + err);
            });

            dataConnection.on('data', function(data){
                dataConnection.send(this.doc_data);
            });
        });
    },

    upload_document(d){
        this.doc_data = d;
    },  

    get get_doc_data(){
        return this.doc_data;
    },

    get get_session_list(){
        return this.session_list;
    },

    get get_peer_id(){
        return this.peer_id;
    }
},
{
    initialize: action,
    create_new_session: action,
    join_session: action,
    upload_document: action,
    get_session_list: computed,
    get_doc_data: computed,
    get_peer_id: computed,
});

export default peer_data;