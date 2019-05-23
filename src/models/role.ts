import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";

class Role extends Model {
    public id!: string;
    public title!: string;
}

Role.init(
    {
        id: {
            type: new DataTypes.STRING(255),
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
        tableName: 'roles',
        modelName: 'role',
        timestamps: false,
        sequelize: sequelize
    }
)

export default Role;