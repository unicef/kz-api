# Responsible assistant registration
Registration process for Partner account (Responsible assistant)

#### Request

**URL: `POST: /user/partner`**

**Body Params:**

?> **email** - user email address<br/>
**password** - user password (must be at least 10 symbols, must contain at least 1 number, must contain at least 1 special sign, must contain at least 1 capital letter, lowercase letters a-z) <br/>
**passwordConfirmation** - password repeat <br/>
**g-recaptcha-response** - google recaptcha response <br/>

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
        usedId: 34 // userID 
        message: "Success message"
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

# User activation
Method for user activation (after sending activation email)

#### Request

**URL: `POST: /user/activation`**

**Body Params:**

?> **hash** - user activation hash string<br/>

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
        message: "Success message"
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
