exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("request_contracts", {
        requestId: { 
            type: "integer", 
            notNull: true,
            primaryKey: true,
            references: "face_requests",
            onDelete: 'CASCADE'
        },
        contractHash: {
            type: "varchar(255)", 
            notNull: true
        },
        contractAddress: {
            type: "varchar(255)", 
            notNull: false,
            default: null
        },
        validateHash: {
            type: "varchar(255)", 
            notNull: false,
            default: null
        },
        validateReceipt: {
            type: "varchar(255)", 
            notNull: false,
            default: null
        },
        certifyHash: {
            type: "varchar(255)", 
            notNull: false,
            default: null
        },
        certifyReceipt: {
            type: "varchar(255)", 
            notNull: false,
            default: null
        },
        approveHash: {
            type: "varchar(255)", 
            notNull: false,
            default: null
        },
        approveReceipt: {
            type: "varchar(255)", 
            notNull: false,
            default: null
        },
        verifyHash: {
            type: "varchar(255)", 
            notNull: false,
            default: null
        },
        verifyReceipt: {
            type: "varchar(255)", 
            notNull: false,
            default: null
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable("request_contracts", {});
};
