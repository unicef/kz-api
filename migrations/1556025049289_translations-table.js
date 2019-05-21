exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("translations", {
        key: { type: "varchar(1000)", notNull: true , primaryKey: true },
        ru: { type: "varchar(1000)", notNull: true },
        en: { type: "varchar(1000)", notNull: true }
      });
};

exports.down = (pgm) => {
    pgm.dropTable("translations", {});
};
