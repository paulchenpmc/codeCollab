const { generateId, writeToFile, readDataFiles } = require('../utils');

// Loaded from disk
let sessions = {};

const loadSessions = async () => {
    console.log('\nInitializing tracker sessions from disk...');
    sessions = await readDataFiles();
    console.log('Tracker documents loaded.\n')
}

const addSession = (document_name, peer) => {
    const sessionID = generateId();
    console.log('\nCreating a new session for ' + document_name + ' with session id ' + sessionID);

    sessions[sessionID] = {
        id: sessionID,
        document_name: document_name,
        peers: [peer],
        data: []
    }
    return sessions[sessionID];
}

const saveSession = (sessionID, data) => {
    // If the session doesn't exist
    if (!sessions[sessionID]) {
        console.error('Save failed for session ' + sessionID + '.',
            'Session ' + sessionID + ' does not exist. Create it with the "new_session" event before trying to save it.');
        return;
    }
    sessions[sessionID].data = data;
    writeToFile(sessionID, sessions[sessionID]);
}

const addPeer = (sessionID, newPeer) => {
    // If the session doesn't exist
    if (!sessions[sessionID]) {
        console.error('Add peer failed for session ' + sessionID + '.',
            'Session ' + sessionID + ' does not exist. Create it with the "new_session" event before trying to modify it.');
        return;
    }
    sessions[sessionID].peers.push(newPeer);

    // persisting the change to the disk
    writeToFile(sessionID, sessions[sessionID]);
    return sessions[sessionID].peers;
}

const removePeer = (peerId) => {
    // Iterate over the sessions and find out which session the peer is in and remove the peer from that
    for(sessionId in sessions){
        if(sessions[sessionId].peers.includes(peerId)){
            sessions[sessionId].peers = sessions[sessionId].peers.filter(peer => peerId !== peer);
            
            // persisting the change to the disk
            writeToFile(sessionId, sessions[sessionId]);
            break;
        }
    }
}

const getSessionList = () => {
    console.log('\nGet session list');
    let sessionList = [];
    for (const id in sessions) {
        // Use spread syntax omit the session cell content from the list
        const {
            data,
            ...sessionData
        } = sessions[id];
        sessionList.push(sessionData);
    }
    return sessionList;
}

const getDocument = (sessionID) => {
    if (!sessions[sessionID]) {
        console.error('Get document data failed for session ' + sessionID + '.',
            'Session ' + sessionID + ' does not exist. Create it with the "new_session" event before trying to find it.');
        return [];
    }
    console.log('Sending document data for: ' + sessions[sessionID].document_name);
    return sessions[sessionID].data;
}

const updateSessionData = (sessionID, index, value) => {
    sessions[sessionID].data[index] = value;
    writeToFile(sessionID, sessions[sessionID]);
}

module.exports = {
    loadSessions,
    saveSession,
    addSession,
    addPeer,
    removePeer,
    getSessionList,
    getDocument,
    updateSessionData
}
