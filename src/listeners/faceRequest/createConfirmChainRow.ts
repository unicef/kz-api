import Listener from "../listener";
import FaceRequestCreated from "../../events/faceRequestCreated";
import PartnerHelper from "../../helpers/partnerHelper";
import Partner from "../../models/partner";
import FaceRequestChain from "../../models/faceRequestChain";


class CreateConfirmChainRow extends Listener {
    public handle = async (event: FaceRequestCreated) => {
        const user = event.user;
        const project = event.project;
        const request = event.faceRequest;

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
                    requestId: request.id,
                    createdBy: user.id,
                    createdAt: new Date(),
                    confirmBy: authPerson.id,
                    validateBy: project.officerId
                }

                await FaceRequestChain.create(chainData);
            }            
        }
        
        return ;
    }
}

export default new CreateConfirmChainRow();