import FaceReport from "../models/faceReport";
import Role from "../models/role";
import FaceReportChain from "../models/faceReportChain";
import TmpFile from "../models/tmpFile";
import FaceReportDocument from "../models/faceReportDocument";
import TmpFileNotFound from "../exceptions/tmpFileNotFound";
import iInputActivity from "../interfaces/faceRequest/iInputActivity";
import iInputReportActivity from "../interfaces/faceReport/iInputReportActivity";
import Project from "../models/project";
import User from "../models/user";
import FaceReportActivity from "../models/faceReportActivity";
import event from "../services/event";
import FaceReportRejected from "../events/faceReportRejected";
import ProjectTranche from "../models/projectTranche";
import FaceReportApproved from "../events/faceReportApproved";
import sequelize = require("sequelize");
import FaceReportDone from "../events/faceReportDone";

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

    static checkRejectedActivities = async (activities: Array<iInputReportActivity>) => {
        let rejectedActivities: Array<iInputReportActivity> | [] = [];
        activities.forEach((activity) => {
            if (activity.isRejected) {
                rejectedActivities.push(activity);
            }
        })
        return rejectedActivities;
    }


    static rejectReportProcess = async (user: User, faceReport: FaceReport, project: Project, rejectedActivities: Array<iInputReportActivity>, reportChain: FaceReportChain) => {
        // update activities in DB
        rejectedActivities.forEach((activity: iInputReportActivity) => {
            FaceReportActivity.update({ isRejected: true, rejectReason: activity.rejectReason }, {
                where: {
                    id: activity.id
                }
            })
        });
        const rejectReport = await faceReport.reject();
        const rejectChain = await reportChain.rejectReport();
        event(new FaceReportRejected(user, faceReport, project, rejectedActivities))
    }


    static confirmReportProcess = async (user: User, activities: Array<iInputReportActivity>, faceReport: FaceReport, tranche: ProjectTranche, project: Project, reportChain: FaceReportChain) => {
        // approve process
        // count amountC & amountD
        for (var i = 0; i < activities.length; i++) {
            const activity = activities[i];
            const amountC = activity.amountB;
            const amountD = activity.amountA - amountC;
            const activityUpdateData = {
                amountC: amountC,
                amountD: amountD
            }
            // update report Activity
            const update = await FaceReportActivity.update(activityUpdateData, {
                where: {
                    id: activity.id
                }
            });
        }
        // set report statusId
        const confirmedAt = new Date();
        faceReport.statusId = FaceReport.VALIDATE_STATUS_KEY;
        faceReport.approvedAt = confirmedAt;
        faceReport.isValid = true;
        await faceReport.save();
        reportChain.confirmAt = confirmedAt;
        await reportChain.save();
        event(new FaceReportApproved(user, faceReport, project));
        return true;
    }

    static isNextUserAttachedtoChain = async (reportId: number, nextUserId: number) => {
        const Op = sequelize.Op;
        const reportChain = await FaceReportChain.findOne({
            where: {
                reportId: reportId,
                [Op.or]: [
                    { validateBy: nextUserId },
                    { certifyBy: nextUserId },
                    { approveBy: nextUserId },
                    { verifyBy: nextUserId }
                ]
            }
        });

        if (reportChain) {
            return true;
        } else {
            return false;
        }
    }

    static validateReportProcess = async (user: User, activities: Array<iInputReportActivity>, faceReport: FaceReport, tranche: ProjectTranche, project: Project, reportChain: FaceReportChain, nextUser: User) => {
        // update status
        faceReport.statusId = FaceReport.CERTIFY_STATUS_KEY;
        faceReport.save();
        // set next user to chain
        reportChain.certifyBy = nextUser.id;
        reportChain.validateAt = new Date();
        reportChain.save();

        event(new FaceReportApproved(user, faceReport, project));

        return true;
    }

    static certifyReportProcess = async (user: User, activities: Array<iInputReportActivity>, faceReport: FaceReport, tranche: ProjectTranche, project: Project, reportChain: FaceReportChain, nextUser: User) => {
        faceReport.statusId = FaceReport.APPROVE_STATUS_KEY;
        faceReport.save();
        // set next user to chain
        reportChain.approveBy = nextUser.id;
        reportChain.certifyAt = new Date();
        reportChain.save();

        event(new FaceReportApproved(user, faceReport, project));

        return true;
    }

    static approveReportProcess = async (user: User, activities: Array<iInputReportActivity>, faceReport: FaceReport, tranche: ProjectTranche, project: Project, reportChain: FaceReportChain, nextUser: User) => {
        faceReport.statusId = FaceReport.VERIFY_STATUS_KEY;
        faceReport.save();
        // set next user to chain
        reportChain.verifyBy = nextUser.id;
        reportChain.approveAt = new Date();
        reportChain.save();

        event(new FaceReportApproved(user, faceReport, project));

        return true;
    }

    static verifyReportProcess = async (user: User, activities: Array<iInputReportActivity>, faceReport: FaceReport, tranche: ProjectTranche, project: Project, reportChain: FaceReportChain) => {
        faceReport.statusId = FaceReport.SUCCESS_STATUS_KEY;
        faceReport.successedAt = new Date();
        faceReport.isAuthorised = true;
        faceReport.save();
        // set verifyAt property
        reportChain.verifyAt = new Date();
        reportChain.save();

        event(new FaceReportDone(user, faceReport, project));

        // project tranche DONE
        tranche.status = ProjectTranche.DONE_STATUS_KEY;
        tranche.save();

        // next tranche IN PROGRESS
        const nextTranche = await ProjectTranche.findOne({
            where: {
                projectId: project.id,
                num: tranche.num + 1
            }
        });
        if (nextTranche) {
            nextTranche.status = ProjectTranche.IN_PROGRESS_STATUS_KEY;
            nextTranche.save();
        } else {
            // project Done
            project.statusId = Project.COMPLETED_STATUS_ID;
            project.save();
        }

        return true;
    }

}

export default FaceReportHelper