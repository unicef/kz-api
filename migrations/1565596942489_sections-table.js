exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("sections", {
        id: "id",
        titleEn: { 
            type: "varchar(255)", 
            notNull: true
        },
        titleRu: { 
            type: "varchar(255)", 
            notNull: true
        },
    });

    pgm.sql("INSERT INTO public.sections (\"titleEn\", \"titleRu\") VALUES ('Adolescent Development and Participation', 'Развитие и участие  подростков'), ('Child Protection', 'Защита прав ребенка'), ('Climate, Energy and Environment', 'Климат, Энергия и окружающая среда'), ('Communication for Development', 'Коммуникации для развития'), ('Disabilities', 'Дети с инвалидностью'), ('Early Childhood Development', 'Раннее детское развитие'), ('Education', 'Образование'), ('Gender Equality', 'Гендерное равенство'), ('Health', 'Здравоохранение'), ('HIV & AIDS',  'ВИЧ и СПИД'), ('Humanitarians Action and Transition', 'Гуманитарная помощь и миграция'), ('Human Rights', 'Права человека'), ('Nutrition', 'Питание'), ('Social Inclusion', 'Социальная инклюзия'), ('Water, Sanitation and Hygiene', 'Вода, санитария и гигиена')");
};

exports.down = (pgm) => {
    pgm.dropTable("sections", {});
};
