import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";

class CompanyOwnership extends Model {
    public id!: number;
    public titleEn!: string;
    public titleRu!: string;
}

CompanyOwnership.init(
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
        tableName: 'companys_ownerships',
        modelName: 'companyOwnership',
        timestamps: false,
        sequelize: sequelize
    }
)

export default CompanyOwnership;