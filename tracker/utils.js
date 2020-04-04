const shortId = require('shortid');
const fs = require('fs');
const fsPromises = fs.promises;

const DATA_DIRECTORY = './data';

// Generate unique short id 
function generateId() {
    return shortId.generate();
}

// Save a json object to a file
function writeToFile(title, data) {
    try {
        console.log('\nSaving file: ' + DATA_DIRECTORY + '/' + title + '.json\n');
        // Overwrites existing files
        fs.writeFileSync(DATA_DIRECTORY + '/' + title + '.json', JSON.stringify(data));
    } catch (error) {
        console.error(error)
    }
}

// Read json object from file
function readFile(location) {
    try {
        return fsPromises.readFile(location);
    }
    catch (err) {
        console.error('Error occured while reading file ' + location, err);
    }
}

// List all files in the data directory
function listDataFiles() {
    try {
        return fsPromises.readdir(DATA_DIRECTORY);
    } catch (err) {
        console.error('Error occured while reading directory!', err);
    }
}

// Read all the data files
async function readDataFiles() {
    let sessionData = {};
    try {
        let files = await listDataFiles();
        await Promise.all(
            files.map(
                async file => {
                    let data = await readFile(DATA_DIRECTORY + '/' + file);
                    data = JSON.parse(data);
                    sessionData[data.id] = data;
                })
        );
    }
    catch (err) {
        console.error('Failed to load tracker files!', err);
    }
    return sessionData;
}

module.exports = {
    generateId,
    writeToFile,
    readDataFiles
}