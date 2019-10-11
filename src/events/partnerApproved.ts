import Event from "./event";
import Partner from "../models/partner";
import SendSuccessApproveMail from "../listeners/partner/sendSuccessApproveMail";

class PartnerApproved extends Event {
    public partner: Partner;

    constructor(partner: Partner) {
        super();
        this.partner = partner;
    }

    public listeners = [
        SendSuccessApproveMail
    ];
}

export default PartnerApproved;
