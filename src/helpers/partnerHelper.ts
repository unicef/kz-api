import { Request } from "express";

class PartnerHelper {
    static partnerFields = [
        "tradeNameEn",
        "tradeNameRu",
        "license",
        "countryId",
        "seoFirstNameEn",
        "seoFirstNameRu",
        "seoLastNameEn",
        "seoLastNameRu",
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

    static getPartnerDataFromRequest = (req: Request): {} => {
        let partnerData: any = {};
        PartnerHelper.partnerFields.forEach((field)=>{
            if (req.body.company[field] && req.body.company[field]!== null) {
                partnerData[field] = req.body.company[field];
            }
        })
        return partnerData;
    }
}

export default PartnerHelper;