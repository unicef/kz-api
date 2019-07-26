exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("roles", {
        id: { 
            type: "varchar(255)", 
            notNull: true,
            primaryKey: true
        },
        title: { 
            type: "varchar(255)", 
            notNull: true
        }
    })
};

exports.down = (pgm) => {
    pgm.dropTable("roles", {});
};
