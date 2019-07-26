exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.renameColumn("roles", "title", "titleEn");
    pgm.addColumns("roles", {
        titleRu: {
            type: "varchar(255)", 
            notNull: true,
            default: ""
        }
    });
    pgm.sql('UPDATE public.roles SET "titleRu" = \'Проектный координатор\' WHERE "id" = \'ra\'');
    pgm.sql('UPDATE public.roles SET "titleRu" = \'Уполномоченное лицо\' WHERE "id" = \'ap\'');
    pgm.sql('UPDATE public.roles SET "titleRu" = \'Координатор\' WHERE "id" = \'ro\'');
    pgm.sql('UPDATE public.roles SET "titleRu" = \'Владелец бюджета\' WHERE "id" = \'bo\'');
    pgm.sql('UPDATE public.roles SET "titleRu" = \'Заместитель Представителя\' WHERE "id" = \'dr\'');
    pgm.sql('UPDATE public.roles SET "titleRu" = \'Руководитель финансово-административного отдела\' WHERE "id" = \'om\'');
    pgm.sql('UPDATE public.roles SET "titleRu" = \'Донор\' WHERE "id" = \'d\'');
    pgm.sql('UPDATE public.roles SET "titleRu" = \'Администратор\' WHERE "id" = \'a\'');
};

exports.down = (pgm) => {

};
