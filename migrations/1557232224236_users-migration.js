exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("users", {
        id: "id",
        email: { 
            type: "varchar(255)", 
            notNull: true
        },
        password: { 
            type: "varchar(255)", 
            notNull: true
        },
        passwordSalt: { 
            type: "varchar(255)", 
            notNull: true
        },
        emailVerifiedAt: { 
            type: "timestamp",
            notNull: false,
            default: null
        },
        isBlocked: {
            type: "boolean",
            default: false
        },
        createdAt: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        },
        updatedAt: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        },
    })
};

exports.down = (pgm) => {
    pgm.dropTable("users", {});
};
