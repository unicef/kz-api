# Create new page

#### Request

**URL: `POST: /admin/page`**

**Headers: `Authorization: Bearer <Auth token>`**

**Body Params:**

?> **key** - key of translation phrase <br/>
**titleEn** - English page title <br/>
**titleRu** - Russian page title <br/>
**textEn** - English page text <br/>
**textRu** - Russian page text <br/>
**isPublic** - (boolean) is page public flag<br/>

#### Request body example:
```json
{
	"key": "testpage",
	"titleEn": "Test page",
	"titleRu": "Тестовая страница",
	"textEn": "Lorem ipsum dolor sit amet, his mazim nobis interesset ut, nec ea harum adolescens concludaturque. Cum alii quidam appetere ex, vel an diam possim definitionem. Eam ad case vide graece, assum quaeque pertinacia eos ne. Ut mea sale ipsum, eum alia ipsum doctus at. Nam graeco vituperatoribus no.In perpetua iracundia has, mel suscipit similique ne, et eirmod vocibus adversarium eos. Ut suas falli est, pri probo reque verterem et, nobis atomorum mel cu. Ei decore gubergren vis, in nobis signiferumque pro. Tractatos voluptaria ad vix, veniam aliquid ei eam. Erant homero antiopam cu his, in nam hinc porro deseruisse.",
	"textRu": "Большая часть текста сделана из разделов 1.10.32–3 книги Цицерона «На грани Добра и Зла» («De finibus bonorum et malorum»). Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit является первой известной человечеству версией («Больше нет никого из тех, кто любит скорбь, поскольку это горе и поэтому хочет заполучить это»). Находка присваивается Ричарду МакКлинтоку (Richard McClintock), филологу, руководителю публикаций в колледже Хампден-Сидней, что в Вирджинии; он искал «citings consectetur» в классической латинской литературе, термин, который встречается удивительно редко в том литературном тексте.",
	"isPublic": true
}
```

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
        "message": "successCreatingPage",
        "page": {
            "id": 1,
            "key": "testpage",
            "titleEn": "Test page",
            "titleRu": "Тестовая страница",
            "textEn": "Lorem ipsum dolor sit amet, his mazim nobis interesset ut, nec ea harum adolescens concludaturque. Cum alii quidam appetere ex, vel an diam possim definitionem. Eam ad case vide graece, assum quaeque pertinacia eos ne. Ut mea sale ipsum, eum alia ipsum doctus at. Nam graeco vituperatoribus no.In perpetua iracundia has, mel suscipit similique ne, et eirmod vocibus adversarium eos. Ut suas falli est, pri probo reque verterem et, nobis atomorum mel cu. Ei decore gubergren vis, in nobis signiferumque pro. Tractatos voluptaria ad vix, veniam aliquid ei eam. Erant homero antiopam cu his, in nam hinc porro deseruisse.",
            "textRu": "Большая часть текста сделана из разделов 1.10.32–3 книги Цицерона «На грани Добра и Зла» («De finibus bonorum et malorum»). Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit является первой известной человечеству версией («Больше нет никого из тех, кто любит скорбь, поскольку это горе и поэтому хочет заполучить это»). Находка присваивается Ричарду МакКлинтоку (Richard McClintock), филологу, руководителю публикаций в колледже Хампден-Сидней, что в Вирджинии; он искал «citings consectetur» в классической латинской литературе, термин, который встречается удивительно редко в том литературном тексте.",
            "isPublic": true,
            "updatedAt": "2019-07-17T08:47:32.567Z",
            "createdAt": "2019-07-17T08:47:32.567Z"
        }
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

# Update page

#### Request

**URL: `PUT: /admin/page`**

**Headers: `Authorization: Bearer <Auth token>`**

**Body Params:**

?> **id** - page id <br/>
**key** - key of translation phrase <br/>
**titleEn** - English page title <br/>
**titleRu** - Russian page title <br/>
**textEn** - English page text <br/>
**textRu** - Russian page text <br/>
**isPublic** - (boolean) is page public flag<br/>

#### Request body example:
```json
{
	"id": 1,
	"key": "first page update",
	"titleEn": "Test page update",
	"titleRu": "Тестовая страница",
	"textEn": "Lorem ipsum dolor sit amet, his mazim nobis interesset ut, nec ea harum adolescens concludaturque. Cum alii quidam appetere ex, vel an diam possim definitionem. Eam ad case vide graece, assum quaeque pertinacia eos ne. Ut mea sale ipsum, eum alia ipsum doctus at. Nam graeco vituperatoribus no.In perpetua iracundia has, mel suscipit similique ne, et eirmod vocibus adversarium eos. Ut suas falli est, pri probo reque verterem et, nobis atomorum mel cu. Ei decore gubergren vis, in nobis signiferumque pro. Tractatos voluptaria ad vix, veniam aliquid ei eam. Erant homero antiopam cu his, in nam hinc porro deseruisse.",
	"textRu": "Большая часть текста сделана из разделов 1.10.32–3 книги Цицерона «На грани Добра и Зла» («De finibus bonorum et malorum»). Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit является первой известной человечеству версией («Больше нет никого из тех, кто любит скорбь, поскольку это горе и поэтому хочет заполучить это»). Находка присваивается Ричарду МакКлинтоку (Richard McClintock), филологу, руководителю публикаций в колледже Хампден-Сидней, что в Вирджинии; он искал «citings consectetur» в классической латинской литературе, термин, который встречается удивительно редко в том литературном тексте.",
	"isPublic": false
}
```

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
        "message": "successUpdatingPage"
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

# Get pages list

#### Request

**URL: `GET: /admin/page/list`**

**Query params:**

?> **page** - list page (optional)<br/>
**search** - search phrase (optional)<br/>

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
        "pages": [
            {
                "id": 1,
                "key": "first page update",
                "titleEn": "Test page update",
                "titleRu": "Тестовая страница",
                "textEn": "Lorem ipsum dolor sit amet, his mazim nobis interesset ut, nec ea harum adolescens concludaturque. Cum alii quidam appetere ex, vel an diam possim definitionem. Eam ad case vide graece, assum quaeque pertinacia eos ne. Ut mea sale ipsum, eum alia ipsum doctus at. Nam graeco vituperatoribus no.In perpetua iracundia has, mel suscipit similique ne, et eirmod vocibus adversarium eos. Ut suas falli est, pri probo reque verterem et, nobis atomorum mel cu. Ei decore gubergren vis, in nobis signiferumque pro. Tractatos voluptaria ad vix, veniam aliquid ei eam. Erant homero antiopam cu his, in nam hinc porro deseruisse.",
                "textRu": "Большая часть текста сделана из разделов 1.10.32–3 книги Цицерона «На грани Добра и Зла» («De finibus bonorum et malorum»). Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit является первой известной человечеству версией («Больше нет никого из тех, кто любит скорбь, поскольку это горе и поэтому хочет заполучить это»). Находка присваивается Ричарду МакКлинтоку (Richard McClintock), филологу, руководителю публикаций в колледже Хампден-Сидней, что в Вирджинии; он искал «citings consectetur» в классической латинской литературе, термин, который встречается удивительно редко в том литературном тексте.",
                "isPublic": false,
                "createdAt": "2019-07-17T08:47:32.567Z",
                "updatedAt": "2019-07-17T08:52:13.928Z"
            }
        ],
        "currentPage": 1,
        "lastPage": 1
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

# Get single page

#### Request

**URL: `GET: /admin/page`**

**Query params:**

?> **id** - list page (required)<br/>

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
        "id": 1,
        "key": "first page update",
        "titleEn": "Test page update",
        "titleRu": "Тестовая страница",
        "textEn": "Lorem ipsum dolor sit amet, his mazim nobis interesset ut, nec ea harum adolescens concludaturque. Cum alii quidam appetere ex, vel an diam possim definitionem. Eam ad case vide graece, assum quaeque pertinacia eos ne. Ut mea sale ipsum, eum alia ipsum doctus at. Nam graeco vituperatoribus no.In perpetua iracundia has, mel suscipit similique ne, et eirmod vocibus adversarium eos. Ut suas falli est, pri probo reque verterem et, nobis atomorum mel cu. Ei decore gubergren vis, in nobis signiferumque pro. Tractatos voluptaria ad vix, veniam aliquid ei eam. Erant homero antiopam cu his, in nam hinc porro deseruisse.",
        "textRu": "Большая часть текста сделана из разделов 1.10.32–3 книги Цицерона «На грани Добра и Зла» («De finibus bonorum et malorum»). Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit является первой известной человечеству версией («Больше нет никого из тех, кто любит скорбь, поскольку это горе и поэтому хочет заполучить это»). Находка присваивается Ричарду МакКлинтоку (Richard McClintock), филологу, руководителю публикаций в колледже Хампден-Сидней, что в Вирджинии; он искал «citings consectetur» в классической латинской литературе, термин, который встречается удивительно редко в том литературном тексте.",
        "isPublic": false,
        "createdAt": "2019-07-17T08:47:32.567Z",
        "updatedAt": "2019-07-17T08:52:13.928Z"
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
