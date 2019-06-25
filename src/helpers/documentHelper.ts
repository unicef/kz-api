import Partner from "../models/partner";
import TmpFile from "../models/tmpFile";
import PartnerDocument from "../models/partnerDocument";
import TmpFileNotFound from "../exceptions/tmpFileNotFound";

class DocumentHelper {
    static documentsFolder = __dirname + '/../../assets/partners/documents/';


    static transferDocumentFromTemp = async (tmpId: number, documentTitle: string, partner: Partner): Promise<PartnerDocument|null> => {
        const tmpFile = await TmpFile.findByPk(tmpId);
        if (tmpFile) {
            try {
                const partnerDocument = await PartnerDocument.create({
                    partnerId: partner.id,
                    userId: tmpFile.userId,
                    title: documentTitle,
                    filename: tmpFile.getFullFilename(),
                    size: tmpFile.size
                });
                const fileFoler = tmpFile.id.substring(0, 2);
                const fullPathToSave = DocumentHelper.documentsFolder+fileFoler;
                tmpFile.copyTo(fullPathToSave, tmpFile.getFullFilename());
                tmpFile.deleteFile();
                return partnerDocument;
            } catch (error) {
                
            }
        } else {
            throw new TmpFileNotFound();
        }
        return null;
    }
    
}

export default DocumentHelper;