exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("partner_documents", {
        id: "id",
        partnerId: { 
            type: "integer", 
            notNull: true
        },
        userId: { 
            type: "integer", 
            notNull: true
        },
        title: {
            type: "varchar(1000)", 
            notNull: true
        },
        filename: {
            type: "varchar(255)", 
            notNull: true
        },
        size: { 
            type: "integer",
            notNull: true
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
    pgm.dropTable("partner_documents", {});
};
