var readDir      = ""; // user defined
var files        = ""; // user defined
var entranceFile = ""; // user defined

function getDirectoryItems() {
    return files
}

function getEntrance() {
    return entranceFile
}

async function readAndWrite(relDir, relFilePath) {
    try {
        const absRead = readDir + relFilePath
        const absWrite = relDir + relFilePath


        console.log("R: " + absRead)
        console.log("W: " + absWrite)

        const response = await fetch(absRead);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.bytes()
        console.log("R OK " + absRead)

        FS.writeFile(absWrite, data);
        console.log("W OK "+ absWrite)
    } catch (error) {
        console.error(error.message);
    }
}