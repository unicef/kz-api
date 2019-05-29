import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";

class Country extends Model {
    public id!: number;
    public code!: string;
    public title!: string;
}

Country.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        code: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },
        title: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        }
    },
    {
        tableName: 'countries',
        modelName: 'country',
        timestamps: false,
        sequelize: sequelize
    }
)

export default Country;