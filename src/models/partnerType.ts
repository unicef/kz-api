import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";

class PartnerType extends Model {
    public id!: number;
    public title!: string;
}

PartnerType.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
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