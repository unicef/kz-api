import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize"

class PartnerDocument extends Model {
    public id!: number;
    public partnerId!: number;
    public userId!: number;
    public title!: string;
    public filename!: string;
    public size!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

}

PartnerDocument.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        partnerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: new DataTypes.STRING(1000),
            allowNull: false
        },
        filename: {
            type: new DataTypes.STRING(255),
            allowNull: false
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'partner_documents',
        modelName: 'partnerDocument',
        timestamps: true,
        sequelize: sequelize
    }
)

export default PartnerDocument;