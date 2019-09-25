import { Request, Response, NextFunction } from "express";
import ApiController from "./apiController";
import HttpException from "../exceptions/httpException";
import i18n from "i18next";
import fs from "fs";
import mime from "mime-types";
import ProjectHelper from "../helpers/projectHelper";
import ProjectRepository from "../repositories/projectRepository";
import ProjectTranche from "../models/projectTranche";
import FaceReportHelper from "../helpers/faceReportHelper";
import FaceRequest from "../models/faceRequest";
import FaceRequestRepository from "../repositories/faceRequestRepository";
import { GetReportActivitiesRequest } from "../requests/faceReport/getReportActivitiesRequest";
import ActivityRepository from "../repositories/activityRepository";
import FaceReport from "../models/faceReport";
import { PostCreateReport } from "../requests/faceReport/postCreateReport";
import ProjectActivity from "../models/projectActivity";
import FaceReportActivity from "../models/faceReportActivity";
import event from "../services/event";
import FaceReportCreated from "../events/faceReportCreated";
import { GetReport } from "../requests/faceReport/getReport";
import { PutUpdateReport } from "../requests/faceReport/putUpdateReport";
import FaceReportDocument from "../models/faceReportDocument";
import FaceReportUpdated from "../events/faceReportUpdated";
import { DeleteDocument } from "../requests/faceReport/deleteDocument";
import { GetDocument } from "../requests/faceReport/getDocument";
import UserRepository from "../repositories/userRepository";
import { PostReportApprove } from "../requests/faceReport/postReportApprove";
import FaceReportChain from "../models/faceReportChain";
import BadRole from "../exceptions/user/badRole";
import ReportBadStatus from "../exceptions/project/reportBadStatus";
import BadValidationException from "../exceptions/badValidationException";
import User from "../models/user";

class FaceReportController {
    static getProperties = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const lang: string = i18n.language;
            let faceRequestTypes = [...FaceReportHelper.requestTypes];
            let reportTypes: Array<{ id: number; title: string }> | [] = [];
            faceRequestTypes.forEach((type: { id: number, ru: string, en: string }) => {
                reportTypes.push({ id: type.id, title: type[lang] });
            })

            // get previous request
            const projectId = req.query.projectId;
            
            const activeTranche = await ProjectTranche.findOne({
                where: {
                    status: ProjectTranche.IN_PROGRESS_STATUS_KEY,
                    projectId: projectId
                }
            });
            let responseData = {
                type: reportTypes
            };
            if (activeTranche) {
                const faceRequest = await FaceRequestRepository.findByTrancheId(activeTranche.id);
                if (faceRequest && faceRequest.statusId === FaceRequest.SUCCESS_STATUS_KEY) {
                    responseData.dateFrom = faceRequest.dateFrom;
                    responseData.dateTo = faceRequest.dateTo;
                    responseData.typeId = faceRequest.type;
                }
            }

            return ApiController.success(responseData, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static getActivities = async (req: GetReportActivitiesRequest, res: Response, next: NextFunction) => {
        try {
            const project = req.project;
            const report = req.faceReport;
            const tranche = req.tranche;
            let activities;
            let totalActivities;

            if (report==null) {
                // request
                const request = await FaceRequestRepository.findByTrancheId(tranche.id);
                // get project activities 
                activities = await ActivityRepository.getReportActivitiesByRequestId(request.id);
                let totalA = 0;
                if (activities.length > 0) {
                    // count TotalA
                    activities.forEach((activity) => {
                        totalA = totalA + parseInt(activity.amountA);
                    })
                }
                totalActivities = {
                    totalA: totalA,
                    totalB: '0',
                    totalC: '0',
                    totalD: '0'
                };
            } else {
                // get request activities
                activities = await ActivityRepository.getByReportId(report.id);
                totalActivities = await ActivityRepository.getTotalReportAmounts(report.id);
            }
            const responseData = {
                activities: activities,
                total: totalActivities
            }

            return ApiController.success(responseData, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static create = async (req: PostCreateReport, res: Response, next: NextFunction) => {
        try {
            const project = req.project;
            const tranche = req.tranche;

            // prepare report data
            const reportData = FaceReportHelper.getReportData(req.body);
            const activities = req.body.activities;

            reportData.trancheId = tranche.id;
            reportData.statusId = FaceRequest.CONFIRM_STATUS_KEY;
            // working with docs
            const financialDoc = await FaceReportHelper.uploadDoc(req.body.financialDocId, 'financial');
            const analyticalDoc = await FaceReportHelper.uploadDoc(req.body.analyticalDocId, 'analytical');
            reportData.financialDocId = financialDoc.id;
            reportData.analyticalDocId = analyticalDoc.id;
            console.log("Justification input: ", req.body.justificationDocId);
            
            if (req.body.justificationDocId) {
                const justificationDoc = await FaceReportHelper.uploadDoc(req.body.justificationDocId, 'justification');
                console.log("Justification DOC object: ", justificationDoc);
                reportData.justificationDocId = justificationDoc.id;
            }

            console.log("REPORT DATA", reportData)

            const report = await FaceReport.create(reportData);
            // working with activities
            for (var i=0; i<activities.length; i++) {
                const activity = activities[i];
                let projectActivity = null;
                // get exists activity
                projectActivity = await ProjectActivity.findOne({
                    where: {
                        id: activity.id
                    }
                })
                // set report activity
                await FaceReportActivity.create({
                    reportId: report.id,
                    activityId: projectActivity.id,
                    amountA: activity.amountA,
                    amountB: activity.amountB,
                });
            }
            event(new FaceReportCreated(req.user, report, project));

            const responseData = {
                message: i18n.t('faceReportCreatedSuccesfully')
            }
            return ApiController.success(responseData, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static update = async (req: PutUpdateReport, res: Response, next: NextFunction) => {
        try{
            const project = req.project;
            const tranche = req.tranche;
            const faceReport = req.faceReport;

            const faceReportData = FaceReportHelper.getReportData(req.body);
            // working with documents
            if (faceReport.financialDocId !== req.body.financialDocId) {
                // delete old doc
                const oldFinDoc = await FaceReportDocument.findOne({
                    where: {
                        id: faceReport.financialDocId
                    }
                });
                if (oldFinDoc) {
                    await oldFinDoc.deleteFile();
                }
                const financialDoc = await FaceReportHelper.uploadDoc(req.body.financialDocId, 'financial');
                faceReportData.financialDocId = financialDoc.id;
            }
            if (faceReport.analyticalDocId !== req.body.analyticalDocId) {
                // delete old doc
                const oldFinDoc = await FaceReportDocument.findOne({
                    where: {
                        id: faceReport.analyticalDocId
                    }
                });
                if (oldFinDoc) {
                    await oldFinDoc.deleteFile();
                }
                const analyticalDoc = await FaceReportHelper.uploadDoc(req.body.analyticalDocId, 'analytical');
                faceReportData.analyticalDocId = analyticalDoc.id;
            }

            console.log("Justification OLD: ",faceReport.justificationDocId);
            console.log("Justification input: ", req.body.justificationDocId);
            if (faceReport.justificationDocId != req.body.justificationDocId) {
                // delete old doc
                const oldFinDoc = await FaceReportDocument.findOne({
                    where: {
                        id: faceReport.justificationDocId
                    }
                });
                if (oldFinDoc) {
                    await oldFinDoc.deleteFile();
                }
                if (req.body.justificationDocId) {
                    const justificationDoc = await FaceReportHelper.uploadDoc(req.body.justificationDocId, 'justification');
                    console.log("Justification DOC object: ", justificationDoc);
                    faceReportData.justificationDocId = justificationDoc.id;
                }
            }

            console.log("UPDATE REPORT DATA", faceReportData)

            const updateFaceReport = await faceReport.update(faceReportData);

            // working with activities
            const activities = req.body.activities;
            for (var i=0; i<activities.length; i++) {
                const activity = activities[i];
                const reportActivity = await FaceReportActivity.findOne({
                    where: {
                        id: activity.id
                    }
                });
                // get project activity object
                const projectActivity = await ProjectActivity.findOne({
                    where: {
                        id: reportActivity.activityId
                    }
                });
                // updating process
                await reportActivity.update({
                    amountA: activity.amountA,
                    amountB: activity.amountB,
                    amountC: 0,
                    amountD: 0,                        
                    isRejected: false,
                    rejectReason: null
                });
            }   

            faceReport.statusId = FaceReport.CONFIRM_STATUS_KEY;
            await faceReport.save();
            event(new FaceReportUpdated(req.user, faceReport, project));

            const responseData = {
                message: i18n.t('faceReportSuccessfullyEdited')
            };
            return ApiController.success(responseData, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static deleteDoc = async (req: DeleteDocument, res: Response, next: NextFunction) => {
        try{
            const faceReport = req.faceReport;
            const reportDoc = req.faceReportDocument;

            console.log("FACE REPORT", faceReport);
            console.log("FACE REPORT DOCUMENT", reportDoc);

            // set to null doc id in report object
            switch (reportDoc.id) {
                case faceReport.financialDocId: {
                    await FaceReport.update({financialDocId: 0}, {
                        where: {
                            id: faceReport.id
                        }
                    })
                }
                break;
                case faceReport.analyticalDocId: {
                    await FaceReport.update({analyticalDocId: 0}, {
                        where: {
                            id: faceReport.id
                        }
                    })
                }
                break;
                case faceReport.justificationDocId: {
                    await FaceReport.update({justificationDocId: null}, {
                        where: {
                            id: faceReport.id
                        }
                    })
                }
                break;
            }

            await reportDoc.deleteFile();

            return ApiController.success({message: i18n.t('reportDocSuccessfullyDeleted')}, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static getReport = async (req: GetReport, res: Response, next: NextFunction) => {
        try { 
            const faceReport = req.faceReport;
            // get is my stage flag
            const isMyStage = await FaceReportHelper.isMyStage(faceReport, req.user);
            return ApiController.success({report: faceReport, isMyStage: isMyStage}, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static getDocument = async (req: GetDocument, res: Response, next: NextFunction) => {
        try { 
            const reportDoc = req.faceReportDocument;
            
            const filePath = reportDoc.getFilePath();
            const fileBuffer = fs.readFileSync(filePath);

            const base64 = Buffer.from(fileBuffer).toString('base64');
            const contentType = mime.contentType(reportDoc.getPublicFilename());
            if (contentType) {
                const responseData = {
                        filename : reportDoc.getPublicFilename(),
                        contentType: contentType,
                        doc: base64
                    };
                ApiController.success(responseData, res);
                return ;
            } else {
                ApiController.failed(500, 'document wasn\'t found', res);
                return ;
            }
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static getNextStepUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await UserRepository.getForFaceList(req.user.id);

            const responseData = {
                users: users
            }
            return ApiController.success(responseData, res);

        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }

    static approve = async (req: PostReportApprove, res: Response, next: NextFunction) => {
        try {
            const project = req.project;
            const tranche = req.tranche;
            const faceReport = req.faceReport;
            const activities = req.activities;

            // get approve chain
            const reportChain = await FaceReportChain.findOne({
                where: {
                    reportId: faceReport.id
                }
            });
            if (reportChain) {
                switch (null) {
                    case reportChain.confirmAt: {
                        // check userID
                        if (reportChain.confirmBy !== req.user.id) {
                            throw new BadRole();
                        }
                        if (faceReport.statusId !== FaceReport.CONFIRM_STATUS_KEY) {
                            throw new ReportBadStatus();
                        }
                        // checking rejected activities
                        const rejectedActivities = await FaceReportHelper.checkRejectedActivities(activities);
                        if (rejectedActivities.length > 0) {
                            await FaceReportHelper.rejectReportProcess(req.user, faceReport, project, rejectedActivities, reportChain); 
                        } else {
                            await FaceReportHelper.confirmReportProcess(req.user, activities, faceReport, tranche, project, reportChain);
                        }
                    }
                    break;
                    case reportChain.validateAt: {
                        // approve by project coordinator
                        // check userID
                        if (reportChain.validateBy !== req.user.id) {
                            throw new BadRole();
                        }
                        if (faceReport.statusId !== FaceReport.VALIDATE_STATUS_KEY) {
                            throw new ReportBadStatus();
                        }
                        // checking rejected activities
                        const rejectedActivities = await FaceReportHelper.checkRejectedActivities(activities);
                        if (rejectedActivities.length > 0) {
                            await FaceReportHelper.rejectReportProcess(req.user, faceReport, project, rejectedActivities, reportChain); 
                        } else {
                            if (req.body.nextUser === null || req.body.nextUser === '' || typeof req.body.nextUser == 'undefined') {
                                throw new BadValidationException(400, 129, i18n.t('chooseNextApproveUserError'), 'Next user was not selected');
                            }
                            const nextUser = await User.findOne({
                                where: {
                                    id: req.body.nextUser
                                }
                            });
                            if (nextUser === null || !nextUser.isUnicefUser()) {
                                throw new BadValidationException(400, 129, i18n.t('badNextApproveUserError'), 'Next user not correct');
                            }
                            // check next user if previosly attached to chain
                            const isUserOnChain = await FaceReportHelper.isNextUserAttachedtoChain(faceReport.id, nextUser.id);
                            if (isUserOnChain) {
                                throw new BadValidationException(400, 129, i18n.t('badNextApproveUserError'), 'Next user not correct');
                            }
                            await FaceReportHelper.validateReportProcess(req.user, activities, faceReport, tranche, project, reportChain, nextUser);
                        }
                    }
                    break;
                    case reportChain.certifyAt: {
                        // approve by project coordinator
                        // check userID
                        if (reportChain.certifyBy !== req.user.id) {
                            throw new BadRole();
                        }
                        if (faceReport.statusId !== FaceReport.CERTIFY_STATUS_KEY) {
                            throw new ReportBadStatus();
                        }
                        // checking rejected activities
                        const rejectedActivities = await FaceReportHelper.checkRejectedActivities(activities);
                        if (rejectedActivities.length > 0) {
                            await FaceReportHelper.rejectReportProcess(req.user, faceReport, project, rejectedActivities, reportChain); 
                        } else {
                            if (req.body.nextUser === null || req.body.nextUser === '' || typeof req.body.nextUser == 'undefined') {
                                throw new BadValidationException(400, 129, i18n.t('chooseNextApproveUserError'), 'Next user was not selected');
                            }
                            const nextUser = await User.findOne({
                                where: {
                                    id: req.body.nextUser
                                }
                            });
                            if (nextUser === null || !nextUser.isUnicefUser()) {
                                throw new BadValidationException(400, 129, i18n.t('badNextApproveUserError'), 'Next user not correct');
                            }
                            // check next user if previosly attached to chain
                            const isUserOnChain = await FaceReportHelper.isNextUserAttachedtoChain(faceReport.id, nextUser.id);
                            if (isUserOnChain) {
                                throw new BadValidationException(400, 129, i18n.t('badNextApproveUserError'), 'Next user not correct');
                            }
                            await FaceReportHelper.certifyReportProcess(req.user, activities, faceReport, tranche, project, reportChain, nextUser);
                        }
                    }
                    break;
                    case reportChain.approveAt: {
                        // approve by project coordinator
                        // check userID
                        if (reportChain.approveBy !== req.user.id) {
                            throw new BadRole();
                        }
                        if (faceReport.statusId !== FaceReport.APPROVE_STATUS_KEY) {
                            throw new ReportBadStatus();
                        }
                        // checking rejected activities
                        const rejectedActivities = await FaceReportHelper.checkRejectedActivities(activities);
                        if (rejectedActivities.length > 0) {
                            await FaceReportHelper.rejectReportProcess(req.user, faceReport, project, rejectedActivities, reportChain); 
                        } else {
                            if (req.body.nextUser === null || req.body.nextUser === '' || typeof req.body.nextUser == 'undefined') {
                                throw new BadValidationException(400, 129, i18n.t('chooseNextApproveUserError'), 'Next user was not selected');
                            }
                            const nextUser = await User.findOne({
                                where: {
                                    id: req.body.nextUser
                                }
                            });
                            if (nextUser === null || !nextUser.isUnicefUser()) {
                                throw new BadValidationException(400, 129, i18n.t('badNextApproveUserError'), 'Next user not correct');
                            }
                            // check next user if previosly attached to chain
                            const isUserOnChain = await FaceReportHelper.isNextUserAttachedtoChain(faceReport.id, nextUser.id);
                            if (isUserOnChain) {
                                throw new BadValidationException(400, 129, i18n.t('badNextApproveUserError'), 'Next user not correct');
                            }
                            await FaceReportHelper.approveReportProcess(req.user, activities, faceReport, tranche, project, reportChain, nextUser);
                        }
                    }
                    break;
                    case reportChain.verifyAt: {
                        // check userID
                        if (reportChain.verifyBy !== req.user.id) {
                            throw new BadRole();
                        }
                        if (faceReport.statusId !== FaceReport.VERIFY_STATUS_KEY) {
                            throw new ReportBadStatus();
                        }
                        // checking rejected activities
                        const rejectedActivities = await FaceReportHelper.checkRejectedActivities(activities);
                        if (rejectedActivities.length > 0) {
                            await FaceReportHelper.rejectReportProcess(req.user, faceReport, project, rejectedActivities, reportChain); 
                        } else {
                            await FaceReportHelper.verifyReportProcess(req.user, activities, faceReport, tranche, project, reportChain);
                        }

                    }
                }
            }

            return ApiController.success({
                message: i18n.t('successApprovingMessage')
            }, res);
        } catch (error) {
            if (error instanceof HttpException) {
                error.response(res);
            } else {
                ApiController.failed(500, error.message, res);
            }
            return;
        }
    }
}

export default FaceReportController;