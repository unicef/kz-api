import User from "../models/user";
import fs from "fs";
import i18n from "i18next";
import UserRepository from "../repositories/userRepository";
import PartnerRepository from "../repositories/partnerRepository";
import ProjectHelper from "./projectHelper";

class ProjectHistoryHelper {
    static historyFolder = __dirname + '/../../assets/projects/history/';

    static EVENTS: Array<string> = [
        'create',
        'edit',
        'upload_docs',
        'set_ip',
        'set_tranches',
        'add_link',
        'create_face_request',
        'reject_face_request',
        'update_face_request',
        'approve_face_request',
        'done_face_request',
        'create_face_report',
        'reject_face_report',
        'approve_face_report',
        'done_face_report'
    ];

    static CREATE_EVENT_KEY: string = 'create';
    static EDIT_EVENT_KEY: string = 'edit';
    static UPLOAD_DOCS_EVENT_KEY: string = 'upload_docs';
    static DELETE_DOC_EVENT_KEY: string = 'delete_doc';
    static SET_IP_EVENT_KEY: string = 'set_ip';
    static SET_TRANCHES_EVENT_KEY: string = 'set_tranches';
    static ADD_LINK_EVENT_KEY: string = 'add_link';
    static SET_TERMINATED_STATUS: string = 'terminated';
    static CREATE_REQUEST_KEY: string = 'create_face_request';
    static REJECT_REQUEST_KEY: string = 'reject_face_request';
    static UPDATE_REQUEST_KEY: string = 'update_face_request';
    static APPROVE_REQUEST_KEY: string = 'approve_face_request';
    static DONE_REQUEST_KEY: string = 'done_face_request';
    static CREATE_REPORT_KEY: string = 'create_face_report';
    static UPDATE_REPORT_KEY: string = 'update_face_report';
    static REJECT_REPORT_KEY: string = 'reject_face_report';
    static APPROVE_REPORT_KEY: string = 'approve_face_report';
    static DONE_REPORT_KEY: string = 'done_face_report';

    static renderHistory = async (historyRows) => {
        const LANG = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);
        let usersName = {};
        let responseHistory = [];
        
        for (var i=0; i<=historyRows.length-1; i++) {
            const historyRow = historyRows[i];
            const eventData = historyRow.event.data;
            const date = new Date(historyRow.createdAt).toLocaleString('ru-Ru', { timeZone: 'UTC' });
            let user = null;
            if (usersName[historyRow.userId]) {
                user = usersName[historyRow.userId]
            } else {
                user = await UserRepository.getNameById(historyRow.userId);
                usersName[historyRow.userId] = user;
            }
            let history = {
                date: date,
                user: user.name,
                action: ''
            };
            switch (historyRow.event.action) {
                case ProjectHistoryHelper.CREATE_EVENT_KEY: {
                    const officer = await UserRepository.getNameById(eventData.officerId);
                    const title = eventData["title"+LANG];
                    history.action = i18n.t('historyCreatedEvent', {title: title, officer: officer.name});
                }
                break;
                case ProjectHistoryHelper.EDIT_EVENT_KEY: {
                    history.action = i18n.t('historyEditField');
                    eventData.fields.forEach((field) => {
                        history.action = history.action + i18n.t('historyEditDetails', {field: field.field, from: field.oldVal, to: field.newVal});
                    });
                }
                break;
                case ProjectHistoryHelper.UPLOAD_DOCS_EVENT_KEY: {
                    history.action = i18n.t('historyUploadDoc', {doc: eventData.doc.title});
                }
                break;
                case ProjectHistoryHelper.DELETE_DOC_EVENT_KEY: {
                    history.action = i18n.t('historyDeleteDoc', {doc: eventData.doc.title});
                }
                break;
                case ProjectHistoryHelper.SET_IP_EVENT_KEY: {
                    const partner = await PartnerRepository.getNameById(eventData.patnerId);
                    history.action = i18n.t('historySetIP', {partner: partner.name});
                }
                break;
                case ProjectHistoryHelper.SET_TRANCHES_EVENT_KEY: {
                    history.action = i18n.t('historySetTranches');
                    eventData.tranches.forEach((tranche) => {
                        history.action = history.action + i18n.t('historySetTrancheDetails', {num: tranche.num, from: tranche.from, to: tranche.to, amount: tranche.amount});
                    });
                }
                break;
                case ProjectHistoryHelper.ADD_LINK_EVENT_KEY: {
                    history.action = i18n.t('historyAddLink', {link:eventData.link.title});
                }
                break;
                case ProjectHistoryHelper.SET_TERMINATED_STATUS: {
                    const terminationReason = ProjectHelper.getTerminationReasonTitle(historyRow.event.reason);
                    history.action = i18n.t('historyTemination', {reason: terminationReason});
                }
                break;
                case ProjectHistoryHelper.CREATE_REQUEST_KEY: {
                    history.action = i18n.t('historyCreateRequest');
                }
                break;
                case ProjectHistoryHelper.REJECT_REQUEST_KEY: {
                    history.action = i18n.t('historyRejectRequest');
                }
                break;
                case ProjectHistoryHelper.UPDATE_REQUEST_KEY: {
                    history.action = i18n.t('historyUpdateRequest');
                }
                break;
                case ProjectHistoryHelper.APPROVE_REQUEST_KEY: {
                    history.action = i18n.t('historyApproveRequest');
                }
                break;
                case ProjectHistoryHelper.DONE_REQUEST_KEY: {
                    history.action = i18n.t('historyDoneRequest');
                }
                break;
                case ProjectHistoryHelper.CREATE_REPORT_KEY: {
                    history.action = i18n.t('historyCreateReport');
                }
                break;
                case ProjectHistoryHelper.UPDATE_REPORT_KEY: {
                    history.action = i18n.t('historyUpdateReport');
                }
                break;
                case ProjectHistoryHelper.REJECT_REPORT_KEY: {
                    history.action = i18n.t('historyRejectReport');
                }
                break;
                case ProjectHistoryHelper.APPROVE_REPORT_KEY: {
                    history.action = i18n.t('historyApproveReport');
                }
                break;
                case ProjectHistoryHelper.DONE_REPORT_KEY: {
                    history.action = i18n.t('historyDoneReport');
                }
                break;
            }

            responseHistory.push(history);
        }
        return responseHistory;
    }
}

export default ProjectHistoryHelper;