import Setting from "../models/setting";

class SettingHelper {

    static getUSDRate = async () => {

        const usdRate = await Setting.findOne({
            where: {
                key: "KZTRate"
            }
        });
        if (usdRate) {
            return +usdRate.value;
        } else {
            return null;
        }
    }

}

export default SettingHelper;