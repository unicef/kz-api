exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("tmp_files", {
        id: { type: "varchar(1000)", notNull: true , primaryKey: true },
        userId: { 
            type: "integer", 
            notNull: true
        },
        originalName: {
            type: "varchar(255)", 
            notNull: true
        },
        mimeType: {
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
    pgm.dropTable("tmp_files", {});
};
