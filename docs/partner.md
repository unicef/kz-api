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