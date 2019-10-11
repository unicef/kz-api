import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";

class Setting extends Model {
    public id!: number;
    public key!: string;
    public value!: string;
}

Setting.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        key: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        value: {
            type: new DataTypes.TEXT(),
            allowNull: true,
            defaultValue: null
        }
    },
    {
        tableName: 'settings',
        modelName: 'setting',
        timestamps: false,
        sequelize: sequelize
    }
)

export default Setting;