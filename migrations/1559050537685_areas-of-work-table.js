exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("areas_of_work", {
        id: "id",
        title: { 
            type: "varchar(255)", 
            notNull: true
        }
    });

    pgm.sql("INSERT INTO public.areas_of_work (title) VALUES ('Adolescent Development and Participation'), ('Child Protection'), ('Climate, Energy and Environment'), ('Communication for Development'), ('Disabilities'), ('Early Childhood Development'), ('Education'), ('Gender Equality'), ('Health'), ('HIV & AIDS'), ('Humanitarians Action and Transition'), ('Human Rights'), ('Nutrition'), ('Social Inclusion'), ('Water, Sanitation and Hygiene')");
};

exports.down = (pgm) => {
    pgm.dropTable("areas_of_work", {});
};
