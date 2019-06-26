import { Request } from "express";

class PartnerHelper {
    static partnerFields = [
        "nameEn",
        "nameRu",
        "tradeNameEn",
        "tradeNameRu",
        "license",
        "countryId",
        "ceoFirstNameEn",
        "ceoFirstNameRu",
        "ceoLastNameEn",
        "ceoLastNameRu",
        "establishmentYear",
        "employersCount",
        "areaOfWorkId",
        "ownershipId",
        "partnerTypeId",
        "csoTypeId",
        "tel",
        "website",
        "cityEn",
        "cityRu",
        "addressEn",
        "addressRu",
        "zip"
    ];

    static partnerSelectFields = [
        "country",
        "areaOfWork",
        "ownership",
        "partnerType",
        "csoType"
    ];

    static getPartnerDataFromRequest = (companyData: any): {} => {
        let partnerData: any = {};
        PartnerHelper.partnerFields.forEach((field)=>{
            if ((companyData[field] && companyData[field]!== null) || companyData[field] == '') {
                partnerData[field] = companyData[field];
            }
        })

        PartnerHelper.partnerSelectFields.forEach((field)=>{
            if (companyData[field] && companyData[field]!== null) {
                partnerData[field+"Id"] = companyData[field]["id"];
            }
        })

        return partnerData;
    }
}

export default PartnerHelper;