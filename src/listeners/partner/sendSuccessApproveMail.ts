import Listener from "../listener";
import ActivationLinkMail from "../../mails/activationLinkMail";
import PartnerApproved from "../../events/partnerApproved";
import SuccessApprovingMail from "../../mails/successApprovingMail";
import User from "../../models/user";


class SendSuccessApproveMail extends Listener {
    public handle = async (event: PartnerApproved) => {
        let assistId = await event.partner.assistId;
        let authorisedId = event.partner.authorisedId;
        if (assistId !== null) {
            const assist = await User.findByPk(assistId);
            let mail = new SuccessApprovingMail(assist, event.partner);
            mail.send();
        }

        if (authorisedId !== null) {
            const authorised = await User.findByPk(authorisedId);
            let mail = new SuccessApprovingMail(authorised, event.partner);
            mail.send();
        }
        
        return ;
    }
}

export default new SendSuccessApproveMail();