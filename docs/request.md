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
