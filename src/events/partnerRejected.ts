import Event from "./event";
import User from "../models/user";
import SendActivationLink from "../listeners/user/sendActivationLink";
import createUserPersonalDataRow from "../listeners/user/createUserPersonalDataRow";
import Partner from "../models/partner";
import SendSuccessApproveMail from "../listeners/partner/sendSuccessApproveMail";
import sendPartnerRejectMail from "../listeners/partner/sendPartnerRejectMail";

class PartnerRejected extends Event {
    public partner: Partner;
    public reason: string;

    constructor(partner: Partner, reason: string) {
        super();
        this.partner = partner;
        this.reason = reason;
    }

    public listeners = [
        sendPartnerRejectMail
    ];
}

export default PartnerRejected;
