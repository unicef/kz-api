import { Model, DataTypes } from "sequelize";
import sequelize from "../services/sequelize";
import Role from "./role";
import SHA1 from "crypto-js/sha256";
import cryptoRandomString from "crypto-random-string";
import ActivationHash from "./activationHash";
import config from "../config/config";

class User extends Model {
    public id!: number;
    public email!: string;
    public readonly password!: string;
    public readonly passwordSalt!: string;
    public isBlocked!: boolean;

    // timestamps!
    public emailVerifiedAt!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static generatePassword = (passwordSalt: string, passwordInput: string) => {
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
        }).catch((error) => {
            console.log('ERROR destroing activation link');
            console.log(error.message);
        });

        // generate new hash
        const activationHashString = cryptoRandomString(64);
        let activationHash = null;
        ActivationHash.create({
            userId: this.id,
            hash: activationHashString,
            expiredAt: ActivationHash.getExpiredDate()
        }).catch((error) => {
            console.log('ERROR creating activation link');
            console.log(error.message);
        });

        // generate activation link
        const activationLink = process.env.CLIENT_URL + config.client.activationRoute + '?activation=' + activationHashString;

        return activationLink;
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
        emailVerifiedAt: {
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
    through: 'usersHasRoles',
    uniqueKey: 'id',
    foreignKey: 'userId',
    as: 'roles',
    timestamps: false
});

export default User;