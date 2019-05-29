import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";

class CompanyOwnership extends Model {
    public id!: number;
    public title!: string;
}

CompanyOwnership.init(
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
        tableName: 'companys_ownerships',
        modelName: 'companyOwnership',
        timestamps: false,
        sequelize: sequelize
    }
)

export default CompanyOwnership;