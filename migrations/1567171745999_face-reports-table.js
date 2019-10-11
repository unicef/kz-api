exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("face_reports", {
        id: "id",
        trancheId: { 
            type: "integer", 
            notNull: true,
            references: 'project_tranches'
        },
        statusId: {
            type: "face_status",
            notNull: true,
            default: "confirm"
        },
        isCertify: {
            type: "boolean",
            notNull: true,
            default: false
        },
        isValid: {
            type: "boolean",
            notNull: true,
            default: false
        },
        isAuthorised: {
            type: "boolean",
            notNull: true,
            default: false
        },
        approvedAt: {
            type: "timestamp",
            notNull: false,
            default: null
        },
        successedAt: {
            type: "timestamp",
            notNull: false,
            default: null
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
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable("face_reports", {});
};
