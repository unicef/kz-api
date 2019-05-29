exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("cso_types", {
        id: "id",
        title: { 
            type: "varchar(255)", 
            notNull: true
        }
    });

    pgm.sql("INSERT INTO public.cso_types (title) VALUES ('International NGO'), ('National NGO'), ('Community based Organ'), ('Academic/Institution')");
};

exports.down = (pgm) => {
    pgm.dropTable("cso_types", {});
};
