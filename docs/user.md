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

<hr>

# Login user
Login user process (get json web token)

#### Request

**URL: `POST: /user/login`**

**Body Params:**

?> **email** - user email address<br/>
**password** - user password (must be at least 10 symbols, must contain at least 1 number, must contain at least 1 special sign, must contain at least 1 capital letter, lowercase letters a-z) <br/>

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
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJhbmRyZWN1a2VybWFuQG1haWxpbmF0b3IuY29tIiwiaWF0IjoxNTU4OTQwNzMzLCJleHAiOjE1NTkwMjcxMzN9.AHequidXYPlgq1fnNYRMR_ThF1DB9G7dY5E7n5JMgjE"// auth token 
        message: "Success message"
    }
}
```

#### ** 403 Forbidden **
Bad user email or password
- Code: `403 Forbidden` <br />
- Content:
```json
{
    success: false,
    error: {
        devMessage: "Validation error",
        message: "Bad email or user password",
        status: 403,
        errorCode: 142 //error validation code
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

# Get authenticated user information

#### Request

**URL: `GET: /me`**

**Headers: `Authorization: Bearer <Auth token>`**

#### Response
<!-- tabs:start -->
#### ** Success Response **
- Code: `200`</br>
- Content:
```json
{
    id: 17,
    email: "andrecukerman@mailinator.com",
    showSeed: true,
    createdAt: "19-05-24 06:12:39",
    roles: [
        "U2FsdGVkX19JIaSvK8objk0JIGRHJ3sD8x+yrrMSq7Q="
    ],
    seedPrase: {
        phrase: "plot tank rate alarm dysfunctional approve garrulous saw pinch unbecoming zippy direful",
        link: "http://localhost:3000/files?id=17"
    }
}
```
#### ** 401 Unauthorized **
- Code: `401 Unauthorized` <br />
- Content:
```json
{
    success: false,
    error: {
        message: "Bad token",
        status: 400,
        errorCode: 214 //error validation code
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

# Set user information
Update user personal information (firstName, lastName, occupation, phones)

#### Request

**URL: `PUT: /user/information`**

**Headers: `Authorization: Bearer <Auth token>`**

**Body Params:**

?> **firstNameEn** - user first name in English (required)<br/>
**firstNameRu** - user first name in Russian (required)<br/>
**lastNameEn** - user last name in English (required)<br/>
**lastNameRu** - user last name in Russian (required)<br/>
**occupationEn** - user occupation/job title in English (required)<br/>
**occupationRu** - user occupation/job title in Russian (required)<br/>
**tel** - user Telephone number (required)<br/>
**mobile** - user Mobile number (required)<br/>

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