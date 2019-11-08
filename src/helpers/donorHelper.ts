class DonorHelper {
    static donorPersonalFields = [
        "firstNameEn",
        "firstNameRu",
        "lastNameEn",
        "lastNameRu",
        "occupationEn",
        "occupationRu",
        "tel",
        "mobile"
    ];

    static getPersonalData = (userInputData: any): {} => {
        let donorData: any = {};
        DonorHelper.donorPersonalFields.forEach((field)=>{
            if (userInputData[field] && userInputData[field]!== null) {
                donorData[field] = userInputData[field];
            } else {
                donorData[field] = '';
            }
        })

        return donorData;
    }

    static getCompanyData = (userInputData: any): {} => {
        let companyData: any = {};
        const companyFields: Array<string> = ['companyEn', 'companyRu'];
        companyFields.forEach((field)=>{
            if (userInputData[field] && userInputData[field]!== null) {
                companyData[field] = userInputData[field];
            } else {
                companyData[field] = '';
            }
        })

        return companyData;
    }

}

export default DonorHelper;