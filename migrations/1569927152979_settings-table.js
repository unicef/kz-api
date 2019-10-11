exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("settings", {
        id: "id",
        key: {
            type: "varchar(255)", 
            notNull: true,
            unique: true
        },
        value: {
            type: "text",
            notNull: false,
            default: null
        }
    });

    pgm.sql("INSERT INTO public.settings (\"key\", value) VALUES('KZTRate', '387.81')");
};

exports.down = (pgm) => {
    pgm.dropTable("settings", {});
};
