exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql('INSERT INTO public.users (id, email, "password", "passwordSalt", "emailVerifiedAt", "isBlocked", "createdAt", "updatedAt", "showSeed", "lastLogin") VALUES(1, \'uscipadmin@maildrop.cc\', \'d94294e73354a1f872dff5914d64df1b52c6a5a4ff1d56bb11b8d74798c8d126\', \'33c999afd5\', \'2019-06-04 08:28:59.494\', false, \'2019-06-04 08:27:19.061\', \'2019-06-04 08:28:59.495\', true, NULL)');
    pgm.sql('INSERT INTO public.users_personal_data ("userId", "firstNameEn", "firstNameRu", "lastNameEn", "lastNameRu", "occupationRu", "occupationEn", tel, mobile, "createdAt", "updatedAt") VALUES(1, \'\', \'\', \'\', \'\', \'\', \'\', \'\', \'\', \'2019-06-04 08:27:19.161\', \'2019-06-04 08:27:19.161\')');
    pgm.sql('INSERT INTO public.users_has_roles (id, "userId", "roleId") VALUES(12, 1, \'a\')');
    pgm.sql('INSERT INTO public.users_has_roles (id, "userId", "roleId") VALUES(10, 1, \'ro\')');
};

exports.down = (pgm) => {

};
