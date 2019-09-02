import { QueryTypes } from "sequelize";
import sequelize from "../services/sequelize";

class SetPasswordHashRepository {

    static deleteHashesByUserId = async (userId: number) => {
        let query = 'DELETE FROM users_set_password_hashes WHERE "userId"=' + userId;

        const delAct = await sequelize.query(query,{type: QueryTypes.DELETE});
        return delAct;
    }

}
export default SetPasswordHashRepository;