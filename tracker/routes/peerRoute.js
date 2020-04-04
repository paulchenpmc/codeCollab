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
    return sessions[sessionID].peers;
}

const removePeer = (sessionID, peer) => {
    // If the session doesn't exist
    if (!sessions[sessionID]) {
        console.error('Remove peer failed for session ' + sessionID + '.',
            'Session ' + sessionID + ' does not exist. Create it with the "new_session" event before trying to modify it.');
        return;
    }
    sessions[sessionID].peers = sessions[sessionID].peers.filter(peer => newPeer !== peer);
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

module.exports = {
    loadSessions,
    saveSession,
    addSession,
    addPeer,
    removePeer,
    getSessionList,
    getDocument
}
