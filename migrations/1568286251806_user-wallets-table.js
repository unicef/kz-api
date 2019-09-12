exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("users_wallets", {
        userId: {
            type: "integer",
            notNull: true,
            primaryKey: true,
            references: 'users',
            onDelete: 'CASCADE'
        },
        address: {
            type: "varchar(255)", 
            notNull: true,
            unique: true
        },
        ks: {
            type: "text", 
            notNull: true
        },
        pw: {
            type: "text", 
            notNull: true
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("users_wallets", {});
};
