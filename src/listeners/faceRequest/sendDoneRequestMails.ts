import Listener from "../listener";
import ProjectHistoryHelper from "../../helpers/projectHistoryHelper";
import HistoryRepository from "../../repositories/historyRepository";
import ActivityRepository from "../../repositories/activityRepository";
import FaceRequestDone from "../../events/faceRequestDone";
import PartnerHelper from "../../helpers/partnerHelper";
import RequestApprovedMail from "../../mails/requestApprovedMail";
import TrancheSendedMail from "../../mails/trancheSendedMail";

class SendDoneRequestMails extends Listener {
    public handle = async (event: FaceRequestDone) => {
        const user = event.user;
        const project = event.project;
        const faceRequest = event.faceRequest;
        const totalAmounts = await ActivityRepository.getTotalRequestAmounts(faceRequest.id);
        const sendedAmount = totalAmounts.totalF;

        // mail to assistant (your request successfully approved)
        const assistant = await PartnerHelper.getPartnerAssistant(project.partnerId);
        const faceRequestNum = await faceRequest.getNum();
        if (assistant) {
            // send email
            let assistantEmail = new RequestApprovedMail(assistant.email, user, project, faceRequestNum);
            assistantEmail.send();
        }

        // mail to authorised person
        const authorised = await PartnerHelper.getPartnerAuthorised(project.partnerId);
        if (authorised) {
            // send email
            let authorisedEmail = new TrancheSendedMail(authorised.email, user, project, faceRequestNum, sendedAmount);
            authorisedEmail.send();
        }
    }
}

export default new SendDoneRequestMails();