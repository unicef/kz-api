# Create new partner account

#### Request

**URL: `POST: /admin/partner`**

**Body Params:**

?> **user**:<br/>
    email - user email address (required)<br/>
    firstNameEn - user first name in English<br/>
    firstNameRu - user first name in Russian<br/>
    lastNameEn - user last name in English<br/>
    lastNameRu - user last name in Russian<br/>
    occupationEn - user occupation in English<br/>
    occupationRu - user occupation in Russian<br/>
    tel - user phone number<br/> 
    mobile - user mobile number<br/>
    roleId - role id (required)<br/>
**company**:<br/> 
    nameEn - company name in English (required)<br/>
    nameRu - company name in Russian (required)<br/>
    tradeNameEn - trade company name in English<br/>
    tradeNameRu - trade company name in Russian<br/>
    license - company license number<br/>
    countryId - country id<br/>
    seoFirstNameEn - seo first name in English<br/>
    seoFirstNameRu - seo first name in Russian<br/>
    seoLastNameEn - seo last name in English<br/>
    seoLastNameRu - seo last name in Russian<br/>
    establishmentYear - establishment year<br/> 
    employersCount - count of employers<br/> 
    areaOfWorkId - id area of work<br/> 
    ownershipId - id company ownership<br/> 
    partnerTypeId - id partner type<br/> 
    csoTypeId - id CSO type<br/> 
    tel - company phone number<br/> 
    website - company website<br/>
    cityEn - company city in English<br/>
    cityRu - company city in Russian<br/>
    addressEn - company address in English<br/>
    addressRu - company address in Russian<br/>
    zip - postal zip code<br/>
**documents**: - array of document objects<br/>
    title -  document title<br/>
    docId - document uploaded id<br/>

#### Request body example:
```json
{
	"user": {
		"email": "test@test.com",
		"firstNameEn": "Oleg",
		"firstNameRu": "Олег",
		"lastNameEn": "Dyatlov",
		"lastNameRu": "Дятлов",
		"occupationEn": "PHP developer",
		"occupationRu": "Разработчик серверных приложений",
		"tel": "+38 56 238 10 93",
		"mobile": "+38 093 587 18 18",
		"roleId": "ra"
	},
	"company": {
		"nameEn": "First test company",
		"nameRu": "ПТК Первая тестовая компания",
		"tradeNameEn": "Volognyanskiy and grandsons",
		"tradeNameRu": "ОАО Воложнянский и внуки",
		"license": "20385G-3A9-FE321",
		"countryId": 228,
		"seoFirstNameEn": "Vasil",
		"seoFirstNameRu": "Василий",
		"seoLastNameEn": "Georgemichelov",
		"seoLastNameRu": "Жоржмайклов",
		"establishmentYear": 1996,
		"employersCount": 27,
		"areaOfWorkId": 8,
		"ownershipId": 2,
		"partnerTypeId": 1,
		"csoTypeId": null,
		"tel": "+38093 238 78 78",
		"website": "https://cukerman.pro",
		"cityEn": "Dnipro",
		"cityRu": "Днепр",
		"addressEn": "Sholokhova str. 25/12",
		"addressRu": "ул. Шолохова 25, кв. 12",
		"zip": "49080"
	},
	"documents": [
		{
			"title": "Регистрация",
			"docId": "039snnv932mc"
		},
		{
			"title": "Перерегистрация",
			"docId": "4dkjnv9e32mc"
		}
	]
}
```

#### Response
<!-- tabs:start -->
#### ** Success Response **
- Code: `200`</br>
- Content:
```json
{
    success: true,
    error: {},
    data: {
        message: "Success message",
        userId: 34, // userID 
        companyId: 12 // company id
    }
}
```

#### ** 400 Error Response **
- Code: `400 Bad Request` <br />
- Content:
```json
{
    success: false,
    error: {
        devMessage: "Validation error",
        message: "validation error message",
        status: 400,
        errorCode: 132 //error validation code
    }
}
```

#### ** 500 Error Response **
- Code: `500 SERVER ERROR` <br />
- Content:
```json
{
    success: false,
    error: {
        status: 500, 
        message: "error message"
    }
}
```

<!-- tabs:end -->

<hr>
