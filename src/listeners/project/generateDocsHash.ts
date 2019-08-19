import Listener from "../listener";
import fs from "fs";
import crypto from "crypto";
import ProjectDocumentsUploaded from "../../events/projectDocumentsUploaded";
import ProjectDocument from "../../models/projectDocument";

class GenerateDocsHash extends Listener {
    public handle = async (event: ProjectDocumentsUploaded) => {
        const user = event.user;
        const project = event.project;
        const documents = event.documents;

        if (documents.length > 0) {
            documents.forEach((doc) => {
                const hash = this.generateDocHash(doc);
                doc.hash = hash;
                doc.save();
            })
        }
    }

    private generateDocHash = (doc: ProjectDocument) => {
        // the file to get the hash    
        var fd = fs.createReadStream(doc.getFilePath());
        var hash = crypto.createHash('sha1');
        hash.setEncoding('hex');

        let hashString = null;

        fd.on('end', function() {
            hash.end();
            console.log("HASH", hash.read()); // the desired sha1sum
            hashString = hash.read();
        });

        // read all file and pipe it (write it) to the hash object
        const end = fd.pipe(hash);
        console.log("END", end);

        return hashString;
    }
}

export default new GenerateDocsHash();