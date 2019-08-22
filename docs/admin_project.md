# Termination reasons
get termination reasons list

#### Request

**URL: `GET: /admin/project/terminate/reasons`**

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
        "reasons": [
            {
                "key": "mouf",
                "title": "Нецелевое расходование денежных средств ЮНИСЕФ"
            },
            {
                "key": "tfm",
                "title": "Форс мажор"
            },
            {
                "key": "pawn",
                "title": "Запланированные активности не привели к желаемому  результату"
            },
            {
                "key": "aahs",
                "title": "Проведенные мероприятия по обеспечению качества показали нерациональное расходование средств"
            },
            {
                "key": "oo",
                "title": "Другое (пожалуйста предоставьте письменное подтверждение за подписью уполномоченного лица)"
            }
        ]
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

# Terminate project
Set project status Project termination

#### Request

**URL: `PATCH: /admin/project/terminate`**

**Body params:**

?> **id** - id of terminating project (required)<br/>
**reason** - object of termination reason (required) {key,title}<br/>

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
		"message": "Success message"
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

# Delete project
Delete project

#### Request

**URL: `DELETE: /admin/project`**

**Body params:**

?> **id** - id of deleting project (required)<br/>

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
		"message": "Success message"
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