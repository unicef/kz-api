exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('common.fields.validation.field.onlyLetters', 'Допустимы только буквы', 'Only letters are allowed')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('common.fields.validation.field.onlyDigits', 'Допустимы только цифры', 'Only digits allowed')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('userDetails.title', 'Детали о пользователе', 'User Details')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('common.fields.email', 'Email', 'Email')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('common.btns.save', 'Сохранить', 'Save')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('common.btns.cancel', 'Отмена', 'Cancel')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('common.btns.next', 'Далее', 'Next')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('common.btns.back', 'Назад', 'Back')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('common.fields.validation.field.required', 'Поле является обязательным', 'Field us required')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('translations.title', 'Управлять переводами', 'Manage translations')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('translations.keyOfThePhrase', 'Ключ фразы', 'Key of the phrase')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('translations.translations', 'Переводы', 'Translations')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('badSetPasswordLink', 'Неправильная ссылка установки пароля', 'Incorrect set password link')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('validationError', 'Невалидные входящие данные', 'Bad request data')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('badRecaptcha', 'Ошибка проверки каптчи', 'Bad recaptcha')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('numberMinValidation', '{{label}} должен быть больше {{limit}}', '{{label}} must be larger than or equal to {{limit}}')");
    pgm.sql("INSERT INTO public.translations (\"key\", ru, en) VALUES('numberBaseValidation', '{{label}} должен быть числом', '{{label}} must be a number')");

    
};

exports.down = (pgm) => {

};
