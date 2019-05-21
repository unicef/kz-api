import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";

class Translation extends Model {

    static readonly defaultLang: string = 'en';

    static readonly langCodes: Array<string> = [
        'ru',
        'en'
    ];

    public key!: string;
    public en!: string;
    public ru!: string;
}

Translation.init(
    {
        key: {
            type: new DataTypes.STRING(1000),
            allowNull: false,
            primaryKey: true
        },
        en: {
            type: new DataTypes.STRING(1000),
            allowNull: false,
            defaultValue: ''
        },
        ru: {
            type: new DataTypes.STRING(1000),
            allowNull: false,
            defaultValue: ''
        }
    },
    {
        tableName: 'translations',
        modelName: 'translation',
        timestamps: false,
        sequelize: sequelize
    }
)

export default Translation;