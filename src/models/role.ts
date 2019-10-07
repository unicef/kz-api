import { Model, DataTypes } from "sequelize";
import CryptoJS from "crypto-js";
import sequelize from "../services/sequelize";
import Sequelize from "sequelize";

class Role extends Model {
    static adminRoleId = 'a';
    static partnerAssistId = 'ra';
    static partnerAuthorisedId = 'ap';
    static unicefResponsibleId = 'ro';
    static unicefBudgetId = 'bo';
    static unicefDeputyId = 'dr';
    static unicefOperationId = 'om';
    static donorId = 'd';

    public id!: string;
    public titleEn!: string;
    public titleRu!: string;

    static getPartnerRoles = async () => {
        const Op = Sequelize.Op;

        let roles: Role[]|null = await Role.findAll({
            where: {
                [Op.or]: [{id: 'ra'}, {id: 'ap'}]
            }
        });

        return roles;
    }

    static getUnicefRoles = async () => {
        const Op = Sequelize.Op;

        let roles: Role[]|null = await Role.findAll({
            where: {
                [Op.or]: [{id: 'ro'}, {id: 'bo'}, {id: 'dr'}, {id: 'om'}]
            }
        });
        
        return roles;
    }

    public getEncriptedRole = (key: string) => {
        const roleHash: string = CryptoJS.AES.encrypt(this.id, key).toString();
        return roleHash;
    }
}

Role.init(
    {
        id: {
            type: new DataTypes.STRING(255),
            autoIncrement: true,
            primaryKey: true
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