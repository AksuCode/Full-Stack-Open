```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    server-->>browser: Response with HTTP status code 302 and given Location header is /exampleapp/notes
    deactivate server

    Note right of browser: Browser sends text written in the form to the server with 'note' as the name and text inputted in the field as the value
    Note right of server: Server asks browser to make a GET request to https://studies.cs.helsinki.fi/exampleapp/notes

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: The css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: The Javascript file
    deactivate server

    Note right of browser: The browser begins javascript execution that fetches JSON data from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: The JSON file
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
    Note right of server: [{content: 'okay', date: '2024-01-29T09:09:24.564Z'}, ...]
```