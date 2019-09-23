import FaceReport from "../models/faceReport";
import Role from "../models/role";
import FaceReportChain from "../models/faceReportChain";
import TmpFile from "../models/tmpFile";
import FaceReportDocument from "../models/faceReportDocument";
import TmpFileNotFound from "../exceptions/tmpFileNotFound";

class FaceReportHelper {
    static readonly requestTypes = [
        {
            id: 1,
            en: `Direct Cash Transfer`,
            ru: `Прямой перевод денег`
        },
        {
            id: 2,
            en: `Reimbursement`,
            ru: `Возмещение`
        },
        {
            id: 3,
            en: `Direct Payment`,
            ru: `Прямая оплата`
        }
    ];


    static isMyStage = async (faceReport, user) => {
        let isMyStage = false;
        switch (faceReport.statusId) {
            case FaceReport.WAITING_STATUS_KEY: {
                if (user.hasRole(Role.partnerAssistId) && faceReport.partnerId === user.partnerId) {
                    isMyStage = true;
                }
            }
                break;

            case FaceReport.REJECT_STATUS_KEY: {
                if (user.hasRole(Role.partnerAssistId) && faceReport.partnerId === user.partnerId) {
                    isMyStage = true;
                }
            }
                break;
            case FaceReport.CONFIRM_STATUS_KEY: {
                if (user.hasRole(Role.partnerAuthorisedId) && faceReport.partnerId === user.partnerId) {
                    isMyStage = true;
                }
            }
                break;
            case FaceReport.VALIDATE_STATUS_KEY: {
                // get faceReport chain
                const reportChain = await FaceReportChain.findOne({
                    where: {
                        reportId: faceReport.id
                    }
                });
                if (reportChain && reportChain.validateBy == user.id) {
                    isMyStage = true;
                }
            }
                break;
            case FaceReport.CERTIFY_STATUS_KEY: {
                // get faceReport chain
                const reportChain = await FaceReportChain.findOne({
                    where: {
                        reportId: faceReport.id
                    }
                });
                if (reportChain && reportChain.certifyBy == user.id) {
                    isMyStage = true;
                }
            }
                break;
            case FaceReport.APPROVE_STATUS_KEY: {
                // get faceReport chain
                const reportChain = await FaceReportChain.findOne({
                    where: {
                        reportId: faceReport.id
                    }
                });
                if (reportChain && reportChain.approveBy == user.id) {
                    isMyStage = true;
                }
            }
                break;
            case FaceReport.VERIFY_STATUS_KEY: {
                // get faceReport chain
                const reportChain = await FaceReportChain.findOne({
                    where: {
                        reportId: faceReport.id
                    }
                });
                if (reportChain && reportChain.verifyBy == user.id) {
                    isMyStage = true;
                }
            }
                break;
        }
        return isMyStage;
    }

    static getReportData = (data: any) => {
        let reportData: any = {};
        reportData.from = new Date(data.dateFrom);
        reportData.to = new Date(data.dateTo);
        reportData.typeId = data.type;
        reportData.isCertify = data.isCertify;
    
        return reportData;
    }

    static uploadDoc = async (tmpId: string, docKey: string) => {
        const tmpFile = await TmpFile.findByPk(tmpId);
        if (tmpFile) {
            const fileFoler = tmpFile.id.substring(0, 2);
            const fullPathToSave = FaceReportDocument.documentsFolder + fileFoler;
            tmpFile.copyTo(fullPathToSave, tmpFile.getFullFilename());
            let documentTitle;
            switch (docKey) {
                case 'analytical': {
                    documentTitle = 'Analytical report';
                }
                break;
                case 'financial': {
                    documentTitle = 'Financial report';
                }
                break;
                case 'justification': {
                    documentTitle = 'Justification document';
                }
            }
            const reportDocument = await FaceReportDocument.create({
                userId: tmpFile.userId,
                title: documentTitle,
                filename: tmpFile.getFullFilename(),
                size: tmpFile.size,
                hash: null
            });

            tmpFile.deleteFile();
            return reportDocument;
        } else {
            throw new TmpFileNotFound();
        }
    }

}

export default FaceReportHelper