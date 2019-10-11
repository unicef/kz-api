import Event from "./event";
import Partner from "../models/partner";
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
