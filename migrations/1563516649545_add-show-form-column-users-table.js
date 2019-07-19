exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.addColumns("users", {
        showForm: { 
            type: "boolean",
            default: true
        }
    });

    pgm.sql('INSERT INTO public.donors_companies ("userId", "companyEn", "companyRu") VALUES(18, \'Donors company\', \'Донормская компания\')');
};

exports.down = (pgm) => {

};
