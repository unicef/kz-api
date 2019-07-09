import Listener from "../listener";
import SuccessApprovingMail from "../../mails/successApprovingMail";
import User from "../../models/user";
import PartnerRejected from "../../events/partnerRejected";
import PartnerRejectedMail from "../../mails/partnerRejectedMail";


class SendPartnerRejectMail extends Listener {
    public handle = async (event: PartnerRejected) => {
        let assistId = await event.partner.assistId;
        let authorisedId = event.partner.authorisedId;
        const rejectReason = event.reason;
        if (assistId !== null) {
            const assist = await User.findByPk(assistId);
            let mail = new PartnerRejectedMail(assist, event.partner, rejectReason);
            mail.send();
        }

        if (authorisedId !== null) {
            const authorised = await User.findByPk(authorisedId);
            let mail = new PartnerRejectedMail(authorised, event.partner, rejectReason);
            mail.send();
        }
        
        return ;
    }
}

export default new SendPartnerRejectMail();