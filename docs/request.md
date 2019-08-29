# Get face request static properties

#### Request

**URL: `GET: /request/properties`**

**Headers: `Lang: ru/en`**

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
