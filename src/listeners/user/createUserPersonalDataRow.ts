import Listener from "../listener";
import UserRegistered from "../../events/userRegistered";
import ActivationLinkMail from "../../mails/activationLinkMail";
import UserPersonalData from "../../models/userPersonalData";


class CreateUserPersonalDataRow extends Listener {
    public handle = async (event: UserRegistered) => {
        const user = event.user;

        UserPersonalData.create({
            userId: user.id,
            firstNameEn: '',
            firstNameRu: '',
            lastNameEn: '',
            lastNameRu: '',
            occupationEn: '',
            occupationRu: '',
            tel: '',
            mobile: ''
        });

        return ;
    }
}

export default new CreateUserPersonalDataRow();