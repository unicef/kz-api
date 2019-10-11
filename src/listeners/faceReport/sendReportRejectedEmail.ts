import Listener from "../listener";
import ProjectCreatedMail from "../../mails/projectCreatedMail";
import ProjectOfficerAssignedMail from "../../mails/projectOfficerAssignedMail";
import User from "../../models/user";
import ProjectPartnerAssignedUnicef from "../../mails/projectPartnerAssignedUnicef";
import ProjectPartnerAssignedAssist from "../../mails/projectPartnerAssignedAssist";
import FaceRequestRejected from "../../events/faceRequestRejected";
import PartnerHelper from "../../helpers/partnerHelper";
import RequestRejectedMail from "../../mails/requestRejectedMail";
import FaceReportRejected from "../../events/faceReportRejected";
import ReportRejectedMail from "../../mails/reportRejectedMail";


class SendReportRejectedEmail extends Listener {
    public handle = async (event: FaceReportRejected) => {
        const user = event.user;
        const project = event.project;
        const faceReport = event.faceReport;
        const activities = event.rejectedActivities;

        // get assistant email to send notification
        const assistant = await PartnerHelper.getPartnerAssistant(project.partnerId);
        const faceReportNum = await faceReport.getNum();
        if (assistant) {
            // send email
            let assistantEmail = new ReportRejectedMail(assistant.email, user, project, faceReportNum, activities);
            assistantEmail.send();
        }
        
        return ;
    }
}

export default new SendReportRejectedEmail();