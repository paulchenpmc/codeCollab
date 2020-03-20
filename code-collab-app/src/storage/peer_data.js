import Peer from 'peerjs';
import {observable, action, computed} from 'mobx';
import io from 'socket.io-client';

const peer_data = observable({
    session_list: [],

    initialize(){
        console.log('in initialize function');
        // will change later, hard coded for now
        let socket = io('http://localhost:8000/');
        socket.on('session_list', function (list) {
            this.session_list = JSON.parse(list);
        });
    },

    get get_session_list(){
        return this.session_list;
    }
},
{
    get_session_list: computed,
    initialize: action,
});

export default peer_data;