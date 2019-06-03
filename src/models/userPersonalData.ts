import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";
import User from "./user";

class UserPersonalData extends Model {
    public userId!: number;
    public firstNameEn!: string;
    public firstNameRu!: string;
    public lastNameEn!: string;
    public lastNameRu!: string;
    public occupationEn!: string;
    public occupationRu!: string;
    public tel!: string;
    public mobile!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public isFilledData(): boolean {
        let isFilledData = true;
        const modelData = JSON.parse(JSON.stringify(this));
        for (var key in modelData) {
            if (modelData[key]==null) {
                isFilledData = false;
            }
        }
        return isFilledData;
    }
}

UserPersonalData.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        firstNameEn: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        firstNameRu: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        lastNameEn: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        lastNameRu: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        occupationEn: {
            type: new DataTypes.STRING(512),
            allowNull: true,
            defaultValue: null
        },
        occupationRu: {
            type: new DataTypes.STRING(512),
            allowNull: true,
            defaultValue: null
        },
        tel: {
            type: new DataTypes.STRING(20),
            allowNull: true,
            defaultValue: null
        },
        mobile: {
            type: new DataTypes.STRING(20),
            allowNull: true,
            defaultValue: null
        }
    },
    {
        tableName: 'users_personal_data',
        modelName: 'userPersonalData',
        timestamps: true,
        sequelize: sequelize
    }
)

// UserPersonalData.belongsTo(User, {
//     foreignKey: 'id',
//     as: 'user'
// });

export default UserPersonalData;