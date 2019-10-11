exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createType("face_status", ["waiting", "confirm", "validate", "certify", "approve", "verify", "success", "reject"]);
    pgm.createTable("face_requests", {
        id: "id",
        trancheId: { 
            type: "integer", 
            notNull: true,
            references: 'project_tranches'
        },
        from: {
            type: "timestamp",
            notNull: true
        },
        to: {
            type: "timestamp",
            notNull: true
        },
        statusId: {
            type: "face_status",
            notNull: true,
            default: "confirm"
        },
        typeId: {
            type: "integer",
            notNull: true,
            default: 1
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
    pgm.dropTable("face_requests", {});
    pgm.dropType("face_request_status");
};
