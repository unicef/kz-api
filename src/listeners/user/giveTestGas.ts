import Listener from "../listener";
import WalletHelper from "../../helpers/walletHelper";
import UserWalletCreated from "../../events/userWalletCreated";
import Config from "../../services/config";
import UserRepository from "../../repositories/userRepository";

class GiveTestGas extends Listener {
    public handle = async (event: UserWalletCreated) => {
        const user = event.user;
        const bcNetwork = Config.get('BC_NETWORK', 'ropsten');
        const isUnicefUser = await user.isUnicefUser();

        if (bcNetwork == 'ropsten' && isUnicefUser) {
            // get wallet address
            const wallet = await UserRepository.findWalletById(user.id);
            if (wallet) {
                await WalletHelper.chargeTestGas(wallet.address);
            }
        }
        return ;
    }
}

export default new GiveTestGas();