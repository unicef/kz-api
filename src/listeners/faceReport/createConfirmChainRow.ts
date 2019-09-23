import Listener from "../listener";
import PartnerHelper from "../../helpers/partnerHelper";
import Partner from "../../models/partner";
import FaceReportCreated from "../../events/faceReportCreated";
import FaceReportChain from "../../models/faceReportChain";


class CreateConfirmChainRow extends Listener {
    public handle = async (event: FaceReportCreated) => {
        const user = event.user;
        const project = event.project;
        const report = event.faceReport;

        // get partner
        const partner = await Partner.findOne({
            where: {
                id: project.partnerId
            }
        });
        if (partner) {
            const authPerson = await PartnerHelper.getPartnerAuthorised(partner);
            if (authPerson) {
                const chainData = {
                    reportId: report.id,
                    createdBy: user.id,
                    createdAt: new Date(),
                    confirmBy: authPerson.id,
                    validateBy: project.officerId
                }

                await FaceReportChain.create(chainData);
            }            
        }
        
        return ;
    }
}

export default new CreateConfirmChainRow();