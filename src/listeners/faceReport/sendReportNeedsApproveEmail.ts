import Listener from "../listener";
import User from "../../models/user";
import FaceReportCreated from "../../events/faceReportCreated";
import FaceReportChain from "../../models/faceReportChain";
import FaceReport from "../../models/faceReport";
import ReportNeedsApproveMail from "../../mails/reportNeedsApproveMail";


class SendReportNeedsApproveEmail extends Listener {
    public handle = async (event: FaceReportCreated) => {
        const user = event.user;
        const project = event.project;
        const faceReport = event.faceReport;

        // get report approve chain
        const faceReportChain = await FaceReportChain.findOne({
            where: {
                reportId: faceReport.id
            }
        });

        if (faceReportChain) {
            let nextUserId = null;
            // get next user Email to send notification
            switch (faceReport.statusId) {
                case FaceReport.CONFIRM_STATUS_KEY: 
                    nextUserId = faceReportChain.confirmBy;
                    break;
                case FaceReport.VALIDATE_STATUS_KEY: 
                    nextUserId = faceReportChain.validateBy;
                    break;
                case FaceReport.CERTIFY_STATUS_KEY: 
                    nextUserId = faceReportChain.certifyBy;
                    break;
                case FaceReport.APPROVE_STATUS_KEY: 
                    nextUserId = faceReportChain.approveBy;
                    break;
                case FaceReport.VERIFY_STATUS_KEY: 
                    nextUserId = faceReportChain.verifyBy;
                    break;
            }
            if (nextUserId) {
                const reciever = await User.findOne({
                    where: {
                        id: nextUserId
                    }
                });
                const faceReportNum = await faceReport.getNum();
                if (reciever) {
                    // send email
                    let assistantEmail = new ReportNeedsApproveMail(reciever.email, user, project, faceReportNum);
                    assistantEmail.send();
                }
            }
        }
        return ;
    }
}

export default new SendReportNeedsApproveEmail();