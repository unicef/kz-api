import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";

class AreaOfWork extends Model {
    public id!: number;
    public title!: string;
}

AreaOfWork.init(
    {
        id: {
            type: DataTypes.INTEGER,
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
        tableName: 'areas_of_work',
        modelName: 'areaOfWork',
        timestamps: false,
        sequelize: sequelize
    }
)

export default AreaOfWork;