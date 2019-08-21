import Listener from "../listener";
import fs from "fs";
import crypto from "crypto";
import ProjectDocumentsUploaded from "../../events/projectDocumentsUploaded";
import ProjectDocument from "../../models/projectDocument";

class GenerateDocsHash extends Listener {
    public handle = async (event: ProjectDocumentsUploaded) => {
        const documents = event.documents;

        if (documents.length > 0) {
            documents.forEach((doc) => {
                let fd = fs.createReadStream(doc.getFilePath());
                let hash = crypto.createHash('sha1');
                hash.setEncoding('hex');

                let hashString = null;

                fd.on('end', function() {
                    hash.end();
                    hashString = hash.read().toString();
                    doc.hash = hashString;
                    doc.save();
                });

                // read all file and pipe it (write it) to the hash object
                const end = fd.pipe(hash);
            })
        }
    }
}

export default new GenerateDocsHash();