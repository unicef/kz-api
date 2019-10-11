exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.renameColumn("report_confirm_chains", "requestId", "reportId");
};

exports.down = (pgm) => {

};
