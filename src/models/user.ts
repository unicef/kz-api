import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";

class User extends Model {
    public id!: number;
    public email!: string;
    public readonly password!: string;
    public readonly passwordSalt!: string;
    public isBlocked!: boolean;

    // timestamps!
    public emailVerifiedAt!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        password: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        passwordSalt: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        isBlocked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        emailVerifiedAt: {
            type: new DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        }
    },
    {
        tableName: 'users',
        modelName: 'user',
        timestamps: true,
        sequelize: sequelize
    }
)

export default User;