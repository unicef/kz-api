# Get partner static properties
Get select properties for partner form

#### Request

**URL: `GET: /partner/properties`**

**Query Params:**

?> **key** - key of property (optional)<br/>

#### Response
<!-- tabs:start -->
#### ** Success Response **
- Code: `200`</br>
- Content:
```json
{
    "success": true,
    "error": {},
    "data": {
        "roles": [
            {
                "id": "ra",
                "title": "Responsible assistant"
            }
        ],
        "countries": [
            {
                "id": 1,
                "code": "AF",
                "title": "Afghanistan"
            }
        ],
        "areasOfWork": [
            {
                "id": 1,
                "title": "Adolescent Development and Participation"
            }
        ],
        "ownerships": [
            {
                "id": 1,
                "title": "Private owned"
            }
        ],
        "partnerTypes": [
            {
                "id": 1,
                "title": "Bilateral/multilateral"
            }
        ],
        "csoTypes": [
            {
                "id": 1,
                "title": "International NGO"
            }
        ]
    }
}
```

#### ** Success Response with key param **
- Param: key=areasOfWork</br>
- Code: `200`</br>
- Content:
```json
{
    "success": true,
    "error": {},
    "data": {
        "areasOfWork": [
            {
                "id": 1,
                "title": "Adolescent Development and Participation"
            }
        ]
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

# Get partner information
Get partner data by partner id

#### Request

**URL: `GET: /partner`**

**URL Params:**

?> **id** - partner id (required)

**Headers: `Authorization: Bearer <Auth token>`**

#### Response
<!-- tabs:start -->
#### ** Success Response **
- Code: `200`</br>
- Content:
```json
{
    "success": true,
    "error": {},
    "data": {
        "id": 1,
        "statusId": "filled",
        "assistId": 12,
        "authorisedId": 13,
        "nameEn": "First test company",
        "nameRu": "ПТК Первая тестовая компания",
        "tradeNameEn": "Volognyanskiy and grandsons",
        "tradeNameRu": "ОАО Воложнянский и внуки",
        "license": "20385G-3A9-FE321",
        "countryId": 228,
        "ceoFirstNameEn": "Vasil",
        "ceoFirstNameRu": "Василий",
        "ceoLastNameEn": "Georgemichelov",
        "ceoLastNameRu": "Жоржмайклов",
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
        "addressRu": "ул. Шолохова 22, кв. 12",
        "zip": "49080",
        "createdAt": "2019-05-30T12:23:16.478Z",
        "updatedAt": "2019-05-30T12:23:16.478Z",
        "country": {
            "id": 228,
            "code": "UA",
            "title": "Ukraine"
        },
        "areaOfWork": {
            "id": 8,
            "title": "Gender Equality"
        },
        "ownership": {
            "id": 2,
            "title": "State"
        },
        "partnerType": {
            "id": 1,
            "title": "Bilateral/multilateral"
        },
        "csoType": null
    }
}
```

#### ** 401 Error Response **
- Code: `401 Unauthenticated` <br />
- Content:
```json
{
    success: false,
    error: {
        devMessage: "User doesn't authenticated",
        message: "Error message",
        status: 401,
        errorCode: 131 //error validation code
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

# Get partner documents
Get partner documents list

#### Request

**URL: `GET: /partner/documents`**

**URL Params:**

?> **id** - partner id (required)

**Headers: `Authorization: Bearer <Auth token>`**


#### Response
<!-- tabs:start -->
#### ** Success Response **
- Code: `200`</br>
- Content:
```json
{
    "success": true,
    "error": {},
    "data": [
        {
            "href": "http://api.uscip.iskytest.com/document?id=1",
            "id": 1,
            "title": "First Test document"
        },
        {
            "href": "http://api.uscip.iskytest.com/document?id=3",
            "id": 3,
            "title": "Third Test document"
        }
    ]
}
```

#### ** 401 Error Response **
- Code: `401 Unauthenticated` <br />
- Content:
```json
{
    success: false,
    error: {
        devMessage: "User doesn't authenticated",
        message: "Error message",
        status: 401,
        errorCode: 131 //error validation code
    }
}
```

#### ** 403 Error Response **
- Code: `403 Forbidden` <br />
- Content:
```json
{
    success: false,
    error: {
        devMessage: "User's permissions not enough",
        message: "Error message",
        status: 403,
        errorCode: 102 
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

# Get single document
Get partner document

#### Request

**URL: `GET: /partner/document`**

**URL Params:**

?> **id** - document id (required)

**Headers: `Authorization: Bearer <Auth token>`**


#### Response
<!-- tabs:start -->
#### ** Success Response **
- Code: `200`</br>
- Content:
```document body

```

#### ** 401 Error Response **
- Code: `401 Unauthenticated` <br />
- Content:
```json
{
    success: false,
    error: {
        devMessage: "User doesn't authenticated",
        message: "Error message",
        status: 401,
        errorCode: 131 //error validation code
    }
}
```

#### ** 403 Error Response **
- Code: `403 Forbidden` <br />
- Content:
```json
{
    success: false,
    error: {
        devMessage: "User's permissions not enough",
        message: "Error message",
        status: 403,
        errorCode: 102 
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


# Delete partner document
Delete partner document

#### Request

**URL: `DELETE: /partner/document`**

**URL Params:**

?> **id** - document id (required)

**Headers: `Authorization: Bearer <Auth token>`**


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
        message: "success message"
    }
}
```

#### ** 401 Error Response **
- Code: `401 Unauthenticated` <br />
- Content:
```json
{
    success: false,
    error: {
        devMessage: "User doesn't authenticated",
        message: "Error message",
        status: 401,
        errorCode: 131 //error validation code
    }
}
```

#### ** 403 Error Response **
- Code: `403 Forbidden` <br />
- Content:
```json
{
    success: false,
    error: {
        devMessage: "User's permissions not enough",
        message: "Error message",
        status: 403,
        errorCode: 102 
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
