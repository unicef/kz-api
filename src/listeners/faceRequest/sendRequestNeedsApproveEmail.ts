import Listener from "../listener";
import PartnerHelper from "../../helpers/partnerHelper";
import RequestRejectedMail from "../../mails/requestRejectedMail";
import FaceRequestUpdated from "../../events/faceRequestUpdated";
import FaceRequestChain from "../../models/faceRequestChain";
import FaceRequestCreated from "../../events/faceRequestCreated";
import FaceRequest from "../../models/faceRequest";
import User from "../../models/user";
import RequestNeedsApproveMail from "../../mails/requestNeedsApproveMail";


class SendRequestNeedsApproveEmail extends Listener {
    public handle = async (event: FaceRequestUpdated| FaceRequestCreated) => {
        const user = event.user;
        const project = event.project;
        const faceRequest = event.faceRequest;

        // get request approve chain
        const faceRequestChain = await FaceRequestChain.findOne({
            where: {
                requestId: faceRequest.id
            }
        });

        if (faceRequestChain) {
            let nextUserId = null;
            // get next user Email to send notification
            switch (faceRequest.statusId) {
                case FaceRequest.CONFIRM_STATUS_KEY: 
                    nextUserId = faceRequestChain.confirmBy;
                    break;
                case FaceRequest.VALIDATE_STATUS_KEY: 
                    nextUserId = faceRequestChain.validateBy;
                    break;
                case FaceRequest.CERTIFY_STATUS_KEY: 
                    nextUserId = faceRequestChain.certifyBy;
                    break;
                case FaceRequest.APPROVE_STATUS_KEY: 
                    nextUserId = faceRequestChain.approveBy;
                    break;
                case FaceRequest.VERIFY_STATUS_KEY: 
                    nextUserId = faceRequestChain.verifyBy;
                    break;
            }
            if (nextUserId) {
                const reciever = await User.findOne({
                    where: {
                        id: nextUserId
                    }
                });
                const faceRequestNum = await faceRequest.getNum();
                if (reciever) {
                    // send email
                    let assistantEmail = new RequestNeedsApproveMail(reciever.email, user, project, faceRequestNum);
                    assistantEmail.send();
                }
            }
        }
        return ;
    }
}

export default new SendRequestNeedsApproveEmail();