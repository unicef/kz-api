import Listener from "../listener";
import PartnerApproved from "../../events/partnerApproved";
import SuccessApprovingMail from "../../mails/successApprovingMail";
import User from "../../models/user";
import PartnerHelper from "../../helpers/partnerHelper";


class SendSuccessApproveMail extends Listener {
    public handle = async (event: PartnerApproved) => {
        let assist = await PartnerHelper.getPartnerAssistant(event.partner);
        if (assist) {
            let mail = new SuccessApprovingMail(assist, event.partner);
            mail.send();
        }

        let authorised = await PartnerHelper.getPartnerAuthorised(event.partner);
        if (authorised) {
            let mail = new SuccessApprovingMail(authorised, event.partner);
            mail.send();
        }
        
        return ;
    }
}

export default new SendSuccessApproveMail();