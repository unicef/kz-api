import { QueryTypes } from "sequelize";
import i18n from "i18next";
import sequelize from "../services/sequelize";

class SectionRepository {
    static findAll = async () => {
        const lang = i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);
        let query = 'SELECT sections."id", sections."title'+lang+'" as "title" FROM sections ORDER BY "id" ASC';

        const sections = await sequelize.query(query,{type: QueryTypes.SELECT});
        return sections;
    }
}

export default SectionRepository;