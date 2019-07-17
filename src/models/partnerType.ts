import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";

class PartnerType extends Model {
    public id!: number;
    public titleEn!: string;
    public titleRu!: string;
}

PartnerType.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        titleEn: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        titleRu: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        }
    },
    {
        tableName: 'partner_types',
        modelName: 'partnerType',
        timestamps: false,
        sequelize: sequelize
    }
)

export default PartnerType;