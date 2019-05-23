exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("usersHasRoles", {
        id: "id",
        userId: { 
            type: "integer", 
            notNull: true
        },
        roleId: { 
            type: "varchar(255)", 
            notNull: true
        }
    })
};

exports.down = (pgm) => {
    pgm.dropTable("usersHasRoles", {});
};
