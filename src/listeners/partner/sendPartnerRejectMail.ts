import Listener from "../listener";
import PartnerRejected from "../../events/partnerRejected";
import PartnerRejectedMail from "../../mails/partnerRejectedMail";
import PartnerHelper from "../../helpers/partnerHelper";


class SendPartnerRejectMail extends Listener {
    public handle = async (event: PartnerRejected) => {
        const rejectReason = event.reason;
        let assist = await PartnerHelper.getPartnerAssistant(event.partner);
        if (assist) {
            let mail = new PartnerRejectedMail(assist, event.partner, rejectReason);
            mail.send();
        }

        let authorised = await PartnerHelper.getPartnerAuthorised(event.partner);
        if (authorised) {
            let mail = new PartnerRejectedMail(authorised, event.partner, rejectReason);
            mail.send();
        }
        
        return ;
    }
}

export default new SendPartnerRejectMail();