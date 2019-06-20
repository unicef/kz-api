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

# Set user password manualy
Set user password after registration from admin panel

#### Request

**URL: `PUT: /user/password`**

**Body Params:**

?> **hash** - hash from email link (required)<br/>
**password** - user password (required)<br/>
**passwordConfirmation** - password confirmation (required)<br/>

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


# Set show seed phrase flag
Method for changing show seed phrase flag (showSeed = false)

#### Request

**URL: `PATCH: /user/seed`**

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
        message: "Success message"
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

# Send forgot password mail

#### Request

**URL: `POST: /user/forgot`**

**Body Params:**

?> **email** - user email (required)

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
        "message": "success message",
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


# Get user information
Get user data by user id

#### Request

**URL: `GET: /user`**

**URL Params:**

?> **id** - user id (required)

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
        "email": "andrecukerman@mailinator.com",
        "firstNameEn": "Andrew",
        "firstNameRu": "Андрей",
        "lastNameEn": "Cukerman",
        "lastNameRu": "Цукровый",
        "occupationEn": "Back-end developer",
        "occupationRu": "Разработчик серверных приложений",
        "roles": [
            {
                "id": "ra",
                "title": "Responsible assistant",
                "users_has_roles": {
                    "userId": 7,
                    "roleId": "ra"
                }
            },
            {
                "id": "a",
                "title": "Administrator",
                "users_has_roles": {
                    "userId": 7,
                    "roleId": "a"
                }
            }
        ],
        "tel": "380932387878",
        "mobile": "380562381090",
        "id": 7,
        "lastLogin": "19-06-12 07:26:56",
        "createdAt": "19-05-29 14:10:10",
        "company": null
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