import Partner from "../models/partner";
import TmpFile from "../models/tmpFile";
import PartnerDocument from "../models/partnerDocument";
import TmpFileNotFound from "../exceptions/tmpFileNotFound";
import { Transaction, CreateOptions } from "sequelize/types";

class DocumentHelper {
    static documentsFolder = __dirname + '/../../assets/partners/documents/';


    static transferDocumentFromTemp = async (tmpId: number, documentTitle: string, partner: Partner, transaction?: Transaction): Promise<PartnerDocument | null> => {
        const tmpFile = await TmpFile.findByPk(tmpId);
        if (tmpFile) {
            let options: CreateOptions = {};
            if (transaction) {
                options.transaction = transaction;
            }
            const partnerDocument = await PartnerDocument.create({
                partnerId: partner.id,
                userId: tmpFile.userId,
                title: documentTitle,
                filename: tmpFile.getFullFilename(),
                size: tmpFile.size
            }, options);
            const fileFoler = tmpFile.id.substring(0, 2);
            const fullPathToSave = DocumentHelper.documentsFolder + fileFoler;
            tmpFile.copyTo(fullPathToSave, tmpFile.getFullFilename());
            tmpFile.deleteFile();
            return partnerDocument;
        } else {
            throw new TmpFileNotFound();
        }
    }
    
}

export default DocumentHelper;