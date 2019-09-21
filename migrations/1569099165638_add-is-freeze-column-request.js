exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.addColumns("face_requests", {
        isFreeze: {
            type: "boolean", 
            notNull: true,
            default: false
        }
    });
};

exports.down = (pgm) => {

};
