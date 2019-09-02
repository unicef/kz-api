import Listener from "../listener";
import fs from "fs";
import crypto from "crypto";
import ProjectDocumentsUploaded from "../../events/projectDocumentsUploaded";

class GenerateDocsHash extends Listener {
    public handle = async (event: ProjectDocumentsUploaded) => {
        const document = event.document;
        let fd = fs.createReadStream(document.getFilePath());
        let hash = crypto.createHash('sha1');
        hash.setEncoding('hex');
        let hashString = null;
        fd.on('end', function () {
            hash.end();
            hashString = hash.read().toString();
            document.hash = hashString;
            document.save();
        });

        // read all file and pipe it (write it) to the hash object
        const end = fd.pipe(hash);
    }
}

export default new GenerateDocsHash();