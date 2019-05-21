# Get all locales
Retunes all available languages in the system.

#### Request

**URL: `GET: /localization/locales`**

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
        en: {
            code: "en",
            title: "English"
        },
        ru: {
            code: "ru",
            title: "Русский"
        }
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

# Get all translations by phrase key
Retunes all phrase translations by phrase key

#### Request

**URL: `GET: /localization/phrase`**

**URL Params:**

?> **key** - phrase key (required)

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
        key: "test.test",
        en: "Test phrase",
        ru: "Тестирование перевода ЗАПИСЬ"
    }
}
```

#### ** Success Response 2 **
- Code: `200`</br>
- Content:
```json
{
    success: true,
    error: {},
    data: null
}
```

!> key does not exist

#### ** 400 Error Response **
- Code: `400 Bad Request` <br />
- Content:
```json
{
    success: false,
    error: {
        devMessage: "Validation error",
        message: "child "key" fails because ["key" is required]",
        status: 400
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

# Get all translations by language code
Retunes all phrases by language code.


#### Request

**URL: `GET: /localization`**

**URL Params:**

?> **code** - code of language (non-required)


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
        test.long: "Test phrase MFKTest phrase MFKTest phrase MFKTest phrase MFKTest phrase MFKTest phrase MFKTest phrase MFKTest phrase MFKTest phrase MFKTest phrase MFKTest phrase MFKTest phrase MFKTest phrase MFK",
        test.test: "Test phrase MFK",
        test.test1: "Test phrase MFK",
        test.test12: "Test phrase MFK",
        test.test13: "Test phrase MFK"
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
        message: "child "code" fails because ["code" must be one of [ru, en]]",
        status: 400
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

# Set new or update existing translation

#### Request

**URL: `POST: /localization/phrase`**

**Body Params:**

?> **key** - key of translation phrase <br/>
**en** - English translation <br/>
**ru** - Russian translation <br/>

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
        key: "inserted key",
        en: "inserted en",
        ru: "inserted ru",
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
        message: "child "key" fails because ["key" must be required]",
        status: 400
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
