exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.renameColumn("areas_of_work", "title", "titleEn");
    pgm.addColumns("areas_of_work", {
        titleRu: {
            type: "varchar(255)", 
            notNull: true,
            default: ""
        }
    });
    pgm.sql('UPDATE public.areas_of_work SET "titleRu" = \'Развитие и участие  подростков\' WHERE "titleEn" = \'Adolescent Development and Participation\'');
    pgm.sql('UPDATE public.areas_of_work SET "titleRu" = \'Защита прав ребенка\' WHERE "titleEn" = \'Child Protection\'');
    pgm.sql('UPDATE public.areas_of_work SET "titleRu" = \'Климат, Энергия и окружающая среда\' WHERE "titleEn" = \'Climate, Energy and Environment\'');
    pgm.sql('UPDATE public.areas_of_work SET "titleRu" = \'Коммуникации для развития\' WHERE "titleEn" = \'Communication for Development\'');
    pgm.sql('UPDATE public.areas_of_work SET "titleRu" = \'Дети с инвалидностью\' WHERE "titleEn" = \'Disabilities\'');
    pgm.sql('UPDATE public.areas_of_work SET "titleRu" = \'Раннее детское развитие\' WHERE "titleEn" = \'Early Childhood Development\'');
    pgm.sql('UPDATE public.areas_of_work SET "titleRu" = \'Образование\' WHERE "titleEn" = \'Education\'');
    pgm.sql('UPDATE public.areas_of_work SET "titleRu" = \'Гендерное равенство\' WHERE "titleEn" = \'Gender Equality\'');
    pgm.sql('UPDATE public.areas_of_work SET "titleRu" = \'Здравоохранение\' WHERE "titleEn" = \'Health\'');
    pgm.sql('UPDATE public.areas_of_work SET "titleRu" = \'ВИЧ и СПИД\' WHERE "titleEn" = \'HIV & AIDS\'');
    pgm.sql('UPDATE public.areas_of_work SET "titleRu" = \'Гуманитарная помощь и миграция\' WHERE "titleEn" = \'Humanitarians Action and Transition\'');
    pgm.sql('UPDATE public.areas_of_work SET "titleRu" = \'Права человека\' WHERE "titleEn" = \'Human Rights\'');
    pgm.sql('UPDATE public.areas_of_work SET "titleRu" = \'Питание\' WHERE "titleEn" = \'Nutrition\'');
    pgm.sql('UPDATE public.areas_of_work SET "titleRu" = \'Социальная инклюзия\' WHERE "titleEn" = \'Social Inclusion\'');
    pgm.sql('UPDATE public.areas_of_work SET "titleRu" = \'Вода, санитария и гигиена\' WHERE "titleEn" = \'Water, Sanitation and Hygiene\'');


    pgm.renameColumn("companys_ownerships", "title", "titleEn");
    pgm.addColumns("companys_ownerships", {
        titleRu: {
            type: "varchar(255)", 
            notNull: true,
            default: ""
        }
    });
    pgm.sql('UPDATE public.companys_ownerships SET "titleRu" = \'Частная\' WHERE "titleEn" = \'Private owned\'');
    pgm.sql('UPDATE public.companys_ownerships SET "titleRu" = \'Государственная\' WHERE "titleEn" = \'State\'');
    pgm.sql('UPDATE public.companys_ownerships SET "titleRu" = \'Некоммерческая\' WHERE "titleEn" = \'Non-commercial\'');
    pgm.sql('UPDATE public.companys_ownerships SET "titleRu" = \'Международная организация\' WHERE "titleEn" = \'International organization\'');

    pgm.renameColumn("partner_types", "title", "titleEn");
    pgm.addColumns("partner_types", {
        titleRu: {
            type: "varchar(255)", 
            notNull: true,
            default: ""
        }
    });
    pgm.sql('UPDATE public.partner_types SET "titleRu" = \'Двусторонние/Многосторонние\' WHERE "titleEn" = \'Bilateral/multilateral\'');
    pgm.sql('UPDATE public.partner_types SET "titleRu" = \'Организация гражданского общества (ОГО)\' WHERE "titleEn" = \'Civil society\'');
    pgm.sql('UPDATE public.partner_types SET "titleRu" = \'Правительство\' WHERE "titleEn" = \'Government\'');
    pgm.sql('UPDATE public.partner_types SET "titleRu" = \'ООН агенство\' WHERE "titleEn" = \'UN Agency\'');

    pgm.renameColumn("cso_types", "title", "titleEn");
    pgm.addColumns("cso_types", {
        titleRu: {
            type: "varchar(255)", 
            notNull: true,
            default: ""
        }
    });
    pgm.sql('UPDATE public.cso_types SET "titleRu" = \'Международное НПО\' WHERE "titleEn" = \'International NGO\'');
    pgm.sql('UPDATE public.cso_types SET "titleRu" = \'Национальное НПО\' WHERE "titleEn" = \'National NGO\'');
    pgm.sql('UPDATE public.cso_types SET "titleRu" = \'Общественная организация\' WHERE "titleEn" = \'Community based Organization\'');
    pgm.sql('UPDATE public.cso_types SET "titleRu" = \'Академическое учреждение/учебное заведение\' WHERE "titleEn" = \'Academic/Institution\'');
};

exports.down = (pgm) => {

};
