
# Terminate project
Set project status Project termination

#### Request

**URL: `PATCH: /admin/project/terminate`**

**Body params:**

?> **id** - id of terminating project (required)<br/>

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