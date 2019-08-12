# Get project static properties
Get select properties for project form

#### Request

**URL: `GET: /project/properties`**

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
        "programmes": {
            "1": {
                "id": 1,
                "pid": null,
                "code": "2390/A0/05/880",
                "title": "PROGRAMME EFFECTIVENESS OUTCOME",
                "hasChildren": true,
                "children": {
                    "90": {
                                "id": 90,
                                "pid": 89,
                                "code": "2390/A0/05/883/001/001",
                                "title": "STAFF COSTS",
                                "hasChildren": false
                            }
                }
            }
        },
        "KZTRate": 384.57,
        "sections": [
            {
                "id": 1,
                "title": "Adolescent Development and Participation"
            }
        ],
        "officers": [
            {
                "id": 14,
                "name": "First Coordinator"
            }
        ]
    }
}
```
