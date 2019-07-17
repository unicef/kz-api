import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";

class CSOType extends Model {
    public id!: number;
    public titleEn!: string;
    public titleRu!: string;
}

CSOType.init(
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
        tableName: 'cso_types',
        modelName: 'csoType',
        timestamps: false,
        sequelize: sequelize
    }
)

export default CSOType;