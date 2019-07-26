import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";
import config from "../config/config";

class SetPasswordHash extends Model {
    public id!: number;
    public userId!: number;
    public hash!: string;
    public expiredAt!: Date;

    static getExpiredDate = () => {
        var today = new Date();
        var expiredDate = new Date();
        expiredDate.setDate(today.getDate()+config.client.setManualPasswordExpiredDays);
        
        return expiredDate;
    }

    public isHashExpired = (): boolean => {
        const today: Date = new Date();
        if (today > this.expiredAt) {
            return true;
        } else {
            return false;
        }
    }
}

SetPasswordHash.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        hash: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        expiredAt: {
            type: new DataTypes.DATE,
            allowNull: false
        }
    },
    {
        tableName: 'users_set_password_hashes',
        modelName: 'setPasswordHash',
        timestamps: false,
        sequelize: sequelize
    }
)

export default SetPasswordHash;