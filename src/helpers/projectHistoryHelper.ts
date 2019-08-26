import User from "../models/user";
import i18n from "i18next";
import UserRepository from "../repositories/userRepository";
import PartnerRepository from "../repositories/partnerRepository";
import ProjectHelper from "./projectHelper";

class ProjectHistoryHelper {
    static EVENTS: Array<string> = [
        'create',
        'edit',
        'upload_docs',
        'set_ip',
        'set_tranches',
        'add_link'
    ];

    static CREATE_EVENT_KEY: string = 'create';
    static EDIT_EVENT_KEY: string = 'edit';
    static UPLOAD_DOCS_EVENT_KEY: string = 'upload_docs';
    static DELETE_DOC_EVENT_KEY: string = 'delete_doc';
    static SET_IP_EVENT_KEY: string = 'set_ip';
    static SET_TRANCHES_EVENT_KEY: string = 'set_tranches';
    static ADD_LINK_EVENT_KEY: string = 'add_link';
    static SET_TERMINATED_STATUS: string = 'terminated';

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
                    history.action = `Created project with title: "${title}" and set ${officer.name} as project officer`;
                }
                break;
                case ProjectHistoryHelper.EDIT_EVENT_KEY: {
                    history.action = `Edited project and set : `;
                    eventData.fields.forEach((field) => {
                        history.action = history.action + field.field + "| FROM: " + field.oldVal + "  |  TO:  " + field.newVal + " \r\n ";
                    });
                }
                break;
                case ProjectHistoryHelper.UPLOAD_DOCS_EVENT_KEY: {
                    history.action = `Uploaded document : ` + eventData.doc.title;
                }
                break;
                case ProjectHistoryHelper.DELETE_DOC_EVENT_KEY: {
                    history.action = `Deleted document : ` + eventData.doc.title;
                }
                break;
                case ProjectHistoryHelper.SET_IP_EVENT_KEY: {
                    const partner = await PartnerRepository.getNameById(eventData.patnerId);
                    history.action = `Set partner "${partner.name}" as IP`;
                }
                break;
                case ProjectHistoryHelper.SET_TRANCHES_EVENT_KEY: {
                    history.action = `Set tranches : `;
                    eventData.tranches.forEach((tranche) => {
                        history.action = history.action + tranche.num + ".| FROM: " + tranche.from + "  |  TO:  " + tranche.to + "  |  AMOUNT:  " + tranche.amount + " \r\n ";
                    });
                }
                break;
                case ProjectHistoryHelper.ADD_LINK_EVENT_KEY: {
                    history.action = `Added link : ${eventData.link}`;
                }
                break;
                case ProjectHistoryHelper.SET_TERMINATED_STATUS: {
                    const terminationReason = ProjectHelper.getTerminationReasonTitle(historyRow.event.reason);
                    history.action = `Terminated a project with reason : ${terminationReason}`;
                }
                break;
            }

            responseHistory.push(history);
        }
        return responseHistory;
    }

    
}

export default ProjectHistoryHelper;