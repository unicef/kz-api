exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("users_activation_hashes", {
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
    pgm.dropTable("users_activation_hashes", {});
};
