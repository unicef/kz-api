exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("report_confirm_chains", {
        id: "id",
        requestId: { 
            type: "integer", 
            notNull: true,
            references: "face_requests"
        },
        createdBy: {
            type: "integer",
            notNull: true,
            references: "users"
        },
        createdAt: {
            type: "timestamp",
            notNull: true,
            default: pgm.func("current_timestamp")
        },
        confirmBy: {
            type: "integer",
            notNull: true,
            references: "users"
        },
        confirmAt: {
            type: "timestamp",
            notNull: false,
            default: null
        },
        validateBy: {
            type: "integer",
            notNull: false,
            references: "users"
        },
        validateAt: {
            type: "timestamp",
            notNull: false,
            default: null
        },
        certifyBy: {
            type: "integer",
            notNull: false,
            references: "users"
        },
        certifyAt: {
            type: "timestamp",
            notNull: false,
            default: null
        },
        approveBy: {
            type: "integer",
            notNull: false,
            references: "users"
        },
        approveAt: {
            type: "timestamp",
            notNull: false,
            default: null
        },
        verifyBy: {
            type: "integer",
            notNull: false,
            references: "users"
        },
        verifyAt: {
            type: "timestamp",
            notNull: false,
            default: null
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable("report_confirm_chains", {});
};
