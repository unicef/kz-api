import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";

class Page extends Model {
    public id!: number;
    public key!: string;
    public titleEn!: string;
    public titleRu!: string;
    public textEn!: string;
    public textRu!: string;
    public isPublic!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Page.init(
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
        titleEn: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        titleRu: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        textEn: {
            type: new DataTypes.TEXT(),
            allowNull: false,
            defaultValue: ''
        },
        textRu: {
            type: new DataTypes.TEXT(),
            allowNull: false,
            defaultValue: ''
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        tableName: 'pages',
        modelName: 'page',
        timestamps: true,
        sequelize: sequelize
    }
)

export default Page;