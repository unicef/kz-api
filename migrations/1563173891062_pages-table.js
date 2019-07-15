exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("pages", {
        id: "id",
        key: {
            type: "varchar(255)", 
            notNull: true,
            unique: true
        },
        titleEn: {
            type: "varchar(255)", 
            notNull: true
        },
        titleRu: {
            type: "varchar(255)", 
            notNull: true
        },
        textEn: {
            type: "text", 
            notNull: true
        },
        textRu: {
            type: "text", 
            notNull: true
        },
        isPublic: {
            type: "boolean", 
            default: true
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
    pgm.dropTable("pages", {});
};
