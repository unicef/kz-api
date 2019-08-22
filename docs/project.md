# Get project static properties
Get select properties for project form

#### Request

**URL: `GET: /project/properties`**

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
        "programmes": {
            "1": {
                "id": 1,
                "pid": null,
                "code": "2390/A0/05/880",
                "title": "PROGRAMME EFFECTIVENESS OUTCOME",
                "hasChildren": true,
                "children": {
                    "90": {
                                "id": 90,
                                "pid": 89,
                                "code": "2390/A0/05/883/001/001",
                                "title": "STAFF COSTS",
                                "hasChildren": false
                            }
                }
            }
        },
        "KZTRate": 384.57,
        "sections": [
            {
                "id": 1,
                "title": "Adolescent Development and Participation"
            }
        ],
        "officers": [
            {
                "id": 14,
                "name": "First Coordinator"
            }
        ]
    }
}
```
<!-- tabs:end -->

<hr>

# Create project 

#### Request

**URL: `POST: /project`**

**Body Params:**

?> **titleEn** - project English title (required)<br/>
**titleRu** - project Russian title (required)<br/>
 **programme**:<br/> 
    id - programme id (required)<br/>
    title - programme title<br/>
    code - programme code<br/>
**deadline** - date of deadline YYYY-MM-DD format (required)<br/>
**ice** - project budget in KZT (required)<br/>
**usdRate** - usd exchange rate (required)<br/>
**officer**: (responsible officer object)<br/> 
    id - user id (required)<br/>
    name - user name<br/>
**section**: (project section object)<br/> 
    id - section id (required)<br/>
    title - section title<br/>
**descriptionEn** - project English description (required)<br/>
**descriptionRu** - project Russian description (required)<br/>
**documents**: - array of document objects<br/>
    title -  document title<br/>
    id - uploaded document id<br/>

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
        "message": "projectSuccessfullyCreated",
        "projectId": 36
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

# Get project details
Get project data for edit form

#### Request

**URL: `GET: /project`**

**URL Params:**

?> **id** - project id (required)

**Headers:** <br/>
**`Authorization: Bearer <Auth token>`**<br/>
**`Lang: ru/en`**

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
        "project": {
            "id": 36,
            "status": "Created",
            "titleEn": "First project",
            "titleRu": "Первый проект",
            "type": "SSFA",
            "projectCode": "SSFA_KAZ_2019_36",
            "deadline": "2019-09-19",
            "ice": "400500.00",
            "usdRate": "308.32",
            "descriptionEn": "My first project description",
            "descriptionRu": "Мой первый проект с описанием",
            "createdAt": "2019-Aug-19",
            "programme": {
                "id": 15,
                "title": "IMPROVED EFFECTIVENESS OF TSA",
                "code": "2390/A0/05/881/001/003"
            },
            "officer": {
                "id": 14,
                "name": "FirstCoordinator"
            },
            "partnerName" : "",
            "section": {
                "id": 7,
                "title": "Education"
            },
            "assistName": ""
        }
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

# Get project short details
Get project data for modal summary

#### Request

**URL: `GET: /project/short`**

**URL Params:**

?> **id** - project id (required)

**Headers:** <br/>
**`Authorization: Bearer <Auth token>`**<br/>
**`Lang: ru/en`**

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
        "project": {
            "id": 36,
            "title": "First project edit",
            "projectCode": "SSFA_KAZ_2019_36",
            "deadline": "2019-09-19",
            "createdAt": "2019-Aug-19",
            "ice": "400501.24 KZT",
            "description": "My first project description edit",
            "programme": {
                "title": "IMPROVED EFFECTIVENESS OF TSA",
                "code": "2390/A0/05/881/001/003"
            }
        }
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

# Get project documents
Get project documents list

#### Request

**URL: `GET: /project/documents`**

**URL Params:**

?> **id** - project id (required)

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
            "href": "http://localhost:3000/project/document?id=1",
            "id": 1,
            "title": "TEST document"
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


# Delete project document
Delete project document

#### Request

**URL: `DELETE: /project/document`**

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

# Selecting IP into project

#### Request

**URL: `POST: /project/progress`**

**Body Params:**

?> **id** - project id (required)<br/>
**partner**:<br/> 
    id - selected partner id (required)<br/>
    name - selected partner name<br/>
**documents**: - array of document objects<br/>
    title -  document title<br/>
    id - uploaded document id<br/>
**tranches**: - array of traches objects<br/>
    from -  date string<br/>
    to -  date string<br/>
    amount - amount of tranche<br/>

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
        "message": "IPSuccessfullySelected",
        "project": {
            "id": 36,
            "status": "In progress",
            "titleEn": "First project edit",
            "titleRu": "Первый проект редактирование",
            "type": "SSFA",
            "partnerId": 1,
            "projectCode": "SSFA_KAZ_2019_36",
            "deadline": "2019-09-19",
            "ice": "400501.24",
            "usdRate": "309.12",
            "descriptionEn": "My first project description edit",
            "descriptionRu": "Мой первый проект с описанием редактироввание",
            "createdAt": "2019-Aug-19",
            "programme": {
                "id": 15,
                "title": "IMPROVED EFFECTIVENESS OF TSA",
                "code": "2390/A0/05/881/001/003"
            },
            "officer": {
                "id": 14,
                "name": "FirstCoordinator"
            },
            "partnerName": "First partner",
            "section": {
                "id": 7,
                "title": "Education"
            },
            "assistantName": "Partner Assistant"
        }
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

# Create project link

#### Request

**URL: `POST: /project/link`**

**Body Params:**

?> **projectId** - project id (required)<br/>
**link** - link (required)<br/>

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
        "message": "Success message",
        "linkId": 1
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

# Get project links
Get project links list

#### Request

**URL: `GET: /project/links`**

**URL Params:**

?> **projectId** - project id (required)

**Headers:** <br/>
**`Authorization: Bearer <Auth token>`**<br/>
**`Lang: ru/en`**

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
        "links": [
            {
                "href": "http://google.com",
                "title": "http://google.com"
            }
        ]
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