# Get face request static properties

#### Request

**URL: `GET: /request/properties`**

**Headers: `Lang: ru/en`**

**Query Params:**

?> **projectId** - id or project (optional)<br/>

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
        "type": [
            {
                "id": 1,
                "title": "Direct Cash Transfer"
            },
            {
                "id": 2,
                "title": "Reimbursement"
            },
            {
                "id": 3,
                "title": "Direct Payment"
            }
        ]
    }
}
```
<!-- tabs:end -->

<hr>

# Get face request activities

#### Request

**URL: `GET: /request/activities`**

**Headers: `Lang: ru/en`**

**Query Params:**

?> **projectId** - id of project (required)<br/>
**requestId** - id of request or empty string (required)<br/>

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
        "activities": [],
        "total": {
            "amountE": 0,
            "amountF": 0,
            "amountG": 0
        }
    }
}
```
<!-- tabs:end -->

<hr>

# Create FACE request 

#### Request

**URL: `POST: /request`**

**Body Params:**

?> **projectId** - project id (required)<br/>
**from** - from date "2019-05-21" format (required)<br/>
**to** - to date "2019-05-21" format (required)<br/>
**typeId** - id of request type (required)<br/>
**activities**: - array of activities objects<br/>
    id - activity id<br/>
    title -  activity title<br/>
    amountE -  activity title<br/>

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
        "message": "faceRequestCreatedSuccesfully"
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
