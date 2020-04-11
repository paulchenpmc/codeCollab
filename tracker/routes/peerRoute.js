const { generateId, writeToFile, readDataFiles } = require('../utils');

// Loaded from disk
let sessions = {};
let sessionsModified = {};
const BACKUP_INTERVAL = 10000; // every 10 seconds

const loadSessions = async () => {
    console.log('\nInitializing tracker sessions from disk...');
    sessions = await readDataFiles();
    console.log('Tracker documents loaded.\n');

    // Periodically backup the sessions that have been changed to disk
    setInterval(() => {
        for(const id of Object.keys(sessionsModified)){
            console.log('Backup: ' + id);
            writeToFile(id, sessions[id]);
            delete sessionsModified[id];
        }
    }, BACKUP_INTERVAL);
}

const addSession = (document_name, peer, doc_data) => {
    const sessionID = generateId();
    console.log('\nCreating a new session for ' + document_name + ' with session id ' + sessionID);

    sessions[sessionID] = {
        id: sessionID,
        document_name: document_name,
        peers: [peer],
        data: doc_data
    }
    sessionsModified[sessionID] = true;
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
    sessionsModified[sessionID] = true;
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
    sessionsModified[sessionID] = true;
    return sessions[sessionID].peers;
}

const removePeer = (peerId) => {
    // Iterate over the sessions and find out which session the peer is in and remove the peer from that
    for(sessionID in sessions){
        if(sessions[sessionID].peers.includes(peerId)){
            sessions[sessionID].peers = sessions[sessionID].peers.filter(peer => peerId !== peer);
            
            // persisting the change to the disk
            sessionsModified[sessionID] = true;
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
    sessionsModified[sessionID] = true;
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
