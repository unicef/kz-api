import { Model, DataTypes, QueryTypes } from "sequelize";
import sequelize from "../services/sequelize";
import Sequelize from "sequelize";
import Role from "./role";
import SHA1 from "crypto-js/sha256";
import cryptoRandomString from "crypto-random-string";
import ActivationHash from "./activationHash";
import config from "../config/config";
import UserPersonalData from "./userPersonalData";
import SetPasswordHash from "./setPasswordHash";
import Partner from "./partner";
import event from "../services/event";
import UserRegisteredRemotely from "../events/userRegisteredRemotely";

class User extends Model {
    public id!: number;
    public email!: string;
    public password!: string;
    public passwordSalt!: string;
    public isBlocked!: boolean;
    public showSeed!: boolean;
    public partnerId!: number;

    // timestamps!
    public emailVerifiedAt!: Date;
    public lastLogin!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly roles!: [];
    public personalData!: UserPersonalData;

    get status() {
        const isActive: boolean = this.emailVerifiedAt!=null?true:false;
        const isBlocked = this.isBlocked;
        if (!isActive) {
            return 'not active';
        } else if (isBlocked) {
            return 'blocked';
        }
        return 'active';
    }

    public setPassword = (password: string): boolean => {
        const passwordSalt = cryptoRandomString(10);
        const userPassword = User.generatePassword(passwordSalt, password);

        this.passwordSalt = passwordSalt;
        this.password = userPassword;

        this.save();

        return true;
    }

    static generatePassword = (passwordSalt: string, passwordInput: string): string => {
        const passwordString = passwordSalt + passwordInput + passwordSalt;

        const hashedPassword = SHA1(passwordString).toString();

        return hashedPassword;
    }

    // Check is user exists by user email
    static isUserExists = async (email: string): Promise<boolean> => {
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        
        if (user==null) {
            return false;
        }
        return true;
    }

    static generateUser = async (email: string): Promise<User> => {
        const userExists = await User.isUserExists(email);
        if (userExists) {
            throw new Error('User allready exists');
        } else {
            const passwordSalt: string = cryptoRandomString(10);
            const password: string = cryptoRandomString(12);
            let user = await User.create({
                email: email,
                password: User.generatePassword(passwordSalt, password),
                passwordSalt: passwordSalt
            });
    
            event(new UserRegisteredRemotely(user));

            return user;
        }
    }

    // is user administrator
    public isAdmin = (): boolean => {
        let isAdmin = false;
        this.roles.forEach((role: Role) => {
            if (role.id == Role.adminRoleId) {
                isAdmin = true;
            }
        })

        return isAdmin;
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

    public hasRole = (roleId: string): boolean => {
        let hasRole = false;
        if (this.roles == undefined) {
            throw new Error('User has roles not possible because you need to include roles into user query section');
        }
        this.roles.forEach((role: Role) => {
            if (role.id == roleId) {
                hasRole = true;
            }
        })
        return hasRole;
    }

    public isUnicefUser = async () => {
        const userRoles: Array<{roleId: string}> = await sequelize.query(
            'SELECT "roleId" FROM users_has_roles WHERE "userId" = ' + this.id, 
            {type: QueryTypes.SELECT}
        );
        if (userRoles.length < 1) {
            return false;
        }
        
        let isUnicefRole = false;
        userRoles.forEach((element) => {
            switch (element.roleId) {
                case Role.unicefResponsibleId:
                case Role.unicefBudgetId:
                case Role.unicefDeputyId:
                case Role.unicefOperationId:
                    isUnicefRole = true;
            }
        })

        return isUnicefRole;
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
        },
        partnerId: {
            type: DataTypes.INTEGER,
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