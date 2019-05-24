exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("usersActivationHashes", {
        id: "id",
        userId: { 
            type: "integer", 
            notNull: true
        },
        hash: { 
            type: "varchar(255)", 
            notNull: true
        },
        expiredAt: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        }
    })
};

exports.down = (pgm) => {
    pgm.dropTable("usersActivationHashes", {});
};
