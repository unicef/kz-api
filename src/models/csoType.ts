import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";

class CSOType extends Model {
    public id!: number;
    public title!: string;
}

CSOType.init(
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
        tableName: 'cso_types',
        modelName: 'csoType',
        timestamps: false,
        sequelize: sequelize
    }
)

export default CSOType;