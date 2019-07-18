# Create new donor

#### Request

**URL: `POST: /admin/donor`**

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
    companyEn - donors Company in English(required)<br/>
    companyRu - donors Company in Russian(required)<br/>

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
        message: "Success message",
        userId: 34 // userID 
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