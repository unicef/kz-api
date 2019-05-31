import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";
import Role from "./role";
import SHA1 from "crypto-js/sha256";
import cryptoRandomString from "crypto-random-string";
import ActivationHash from "./activationHash";
import config from "../config/config";
import UserPersonalData from "./userPersonalData";
import SetPasswordHash from "./setPasswordHash";

class User extends Model {
    public id!: number;
    public email!: string;
    public readonly password!: string;
    public readonly passwordSalt!: string;
    public isBlocked!: boolean;
    public showSeed!: boolean;

    // timestamps!
    public emailVerifiedAt!: Date;
    public lastLogin!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static generatePassword = (passwordSalt: string, passwordInput: string): string => {
        const passwordString = passwordSalt + passwordInput + passwordSalt;

        const hashedPassword = SHA1(passwordString).toString();

        return hashedPassword;
    }

    public getActivationLink = () => {
        // delete all previous hashes
        ActivationHash.destroy({
            where: {
              userId: this.id
            }
        }).then().catch((error) => {
            console.log('ERROR destroing activation link');
            console.log(error.message);
        });

        // generate new hash
        const activationHashString = cryptoRandomString(64);
        ActivationHash.create({
            userId: this.id,
            hash: activationHashString,
            expiredAt: ActivationHash.getExpiredDate()
        }).then().catch((error) => {
            console.log('ERROR creating activation link');
            console.log(error.message);
        });

        // generate activation link
        const activationLink = process.env.CLIENT_URL + config.client.activationRoute + '?activation=' + activationHashString;

        return activationLink;
    }

    // checking entered user password
    public checkPassword = (passwordInput: string): boolean => {
        const passwordString = this.passwordSalt + passwordInput + this.passwordSalt;

        const hashedPassword = SHA1(passwordString).toString();
        if (hashedPassword == this.password) {
            return true;
        }
        return false;
    }

    public generateManualPasswordHash = () => {
        // generate new hash
        const setNewPasswordHashString = cryptoRandomString(126);
        SetPasswordHash.create({
            userId: this.id,
            hash: setNewPasswordHashString,
            expiredAt: SetPasswordHash.getExpiredDate()
        }).then().catch((error) => {
            console.log('ERROR creating activation link');
            console.log(error.message);
        });

        // generate activation link
        const setPasswordLink = process.env.CLIENT_URL + config.client.setManualPasswordRoute + '?user_token=' + setNewPasswordHashString;

        return setPasswordLink;
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
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
        showSeed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        emailVerifiedAt: {
            type: new DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        lastLogin: {
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

User.belongsToMany(Role, {
    through: 'users_has_roles',
    uniqueKey: 'id',
    foreignKey: 'userId',
    as: 'roles',
    timestamps: false
});

User.belongsTo(UserPersonalData, {
    foreignKey: 'id',
    as: 'personalData'
});

export default User;