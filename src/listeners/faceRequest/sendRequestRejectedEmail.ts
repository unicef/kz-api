import Listener from "../listener";
import ProjectCreatedMail from "../../mails/projectCreatedMail";
import ProjectOfficerAssignedMail from "../../mails/projectOfficerAssignedMail";
import User from "../../models/user";
import ProjectPartnerAssignedUnicef from "../../mails/projectPartnerAssignedUnicef";
import ProjectPartnerAssignedAssist from "../../mails/projectPartnerAssignedAssist";
import FaceRequestRejected from "../../events/faceRequestRejected";
import PartnerHelper from "../../helpers/partnerHelper";
import RequestRejectedMail from "../../mails/requestRejectedMail";


class SendRequestRejectedEmail extends Listener {
    public handle = async (event: FaceRequestRejected) => {
        const user = event.user;
        const project = event.project;
        const faceRequest = event.faceRequest;
        const activities = event.rejectedActivities;

        // get assistant email to send notification
        const assistant = await PartnerHelper.getPartnerAssistant(project.partnerId);
        const faceRequestNum = await faceRequest.getNum();
        if (assistant) {
            // send email
            let assistantEmail = new RequestRejectedMail(assistant.email, user, project, faceRequestNum, activities);
            assistantEmail.send();
        }
        
        return ;
    }
}

export default new SendRequestRejectedEmail();