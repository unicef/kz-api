import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";
import Config from "../services/config";

class ActivationHash extends Model {
    public id!: number;
    public userId!: number;
    public hash!: string;
    public expiredAt!: Date;

    static getExpiredDate = () => {
        var today = new Date();
        var expiredDate = new Date();
        expiredDate.setDate(today.getDate()+Config.get("ACTIVATION_LIFE_DAYS", 1));
        
        return expiredDate;
    }
}

ActivationHash.init(
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
        tableName: 'users_activation_hashes',
        modelName: 'activationHash',
        timestamps: false,
        sequelize: sequelize
    }
)

export default ActivationHash;