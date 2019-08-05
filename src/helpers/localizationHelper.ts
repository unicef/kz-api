import { Request } from "express";
import Sequelize from "sequelize";
import i18n from "i18next";

class LocalizationHelper {
    static getValidationMessages = () => {
        i18n
        const validationErrors = {
            string: {
                length: i18n.t('stringLengthValidation'),
                min: i18n.t('stringMinValidation'),
                max: i18n.t('stringMaxValidation'),
                base: i18n.t('stringBaseValidation'),
                email: i18n.t('stringEmailValidation'),
                regex: {
                    base: i18n.t('stringRegexPasswordValidation')
                }
            },
            number: {
                min: i18n.t('numberMinValidation'),
                base: i18n.t('numberBaseValidation'),
            },
            any: {
                required: i18n.t('anyRequiredValidation'),
                empty: i18n.t('anyEmptyValidation'),
                unknown: i18n.t('anyUnknownValidation'),
                allowOnly: i18n.t('anyValidValidation')
            }
        };

        return validationErrors;
    }
}

export default LocalizationHelper;