# Get page by key

#### Request

**URL: `GET: /page`**

**Query params:**

?> **key** - page key (required)<br/>

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
        "page": {
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
}
```

#### ** 404 Error Response **
- Code: `404 Not found` <br />
- Content:
```json
{
    success: false,
    error: {
        devMessage: "Page not found",
        message: "Error message",
        status: 404,
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

# Get pages list

#### Request

**URL: `GET: /page/list`**

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
                "key": "testpage1",
                "titleRu": "Тестовая страница",
                "titleEn": "Test page"
            },
            {
                "key": "agreements",
                "titleRu": "Соглашения",
                "titleEn": "Agreements"
            },
            {
                "key": "terms",
                "titleRu": "Условия и положения",
                "titleEn": "Terms and conditions"
            }
        ]
    }
}
```
<!-- tabs:end -->
<hr>


