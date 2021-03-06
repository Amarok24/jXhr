# Oxhr v1.1
An object-oriented XHR (XMLHttpRequest) wrapper/library.

### Modern programmers use fetch, others prefer Oxhr 🐮

<img width="180" alt="Oxhr logo" src="./oxhr-logo.svg" />

### Why Oxhr?
- Promise-based (asynchronous)
- Tiny (2kb minified) and pretty simple
- Ready to use ES module `oxhr.min.js` for your JavaScript projects
- No dependencies
- Written in TypeScript
- An alternative to _XMLHttpRequest_ and _fetch_
- An alternative to feature-rich libraries like [_axios_](https://github.com/axios/axios)
- A small demo included, see `index.html`

If you are not familiar with ES modules have a look [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

There is also an old version of the library called jXhr which was not written using OOP, see [here](https://github.com/Amarok24/Oxhr/tree/non-oop-version).

---
## API

__Import modules and create a new instance in TypeScript__

```ts
import { Oxhr } from "./oxhr.js";
import type { IOxhrParams, IRequestHeader } from "./oxhr_types.js";

async function fetchDataExample()
{
  let response: any;
  const options: IOxhrParams = {
    url: "https://swapi.dev/api/people/1",
    consoleInfo: "Establishing my connection...",
    onLoadEnd: () => { console.log("Loading finished!") }
  };

  // The shortest possible call if you don't care about the return type.
  const myConnection = new Oxhr(options);

  // Send request to the server and output response data to console.
  response = await myConnection.send();
  console.log(result);
}
```

__The parameters interface__

```ts
interface IOxhrParams
{
  url: string;
  method?: "GET" | "POST" | "HEAD" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";
  responseType?: XMLHttpRequestResponseType;
  data?: BodyInit | Document | null;
  requestHeaders?: IRequestHeader[];
  timeoutMs?: number;
  consoleInfo?: string;
  onLoadEnd?: () => void;
  onProgress?: (percent: number, bytes: number) => void;
  onTimeOut?: () => void;
  onAbort?: () => void;
}
```

### Parameters

| Parameter      |   Description            | Required | Default   | Accepted types                                        |
| :------------- | :----------------------- | :------: | :-------: | :---------------------------------------------------- |
| url            | URL for http request     |   x      |           | string                                                |
| method         | HTTP request method      |          | "get"     | string ("GET" \| "POST" \| etc...))                   |
| responseType   | A valid response type    |          | ""        | "", "arraybuffer", "blob", "document", "json", "text" |
| data           | Data to send             |          | null      | Blob, BufferSource, FormData, URLSearchParams,  ReadableStream, string, Document, null |
| requestHeaders | Array of IRequestHeader  |          |           | IRequestHeader[]                                      |
| timeoutMs      | Timeout in milliseconds  |          | 60'000    | number                                                |
| consoleInfo    | Description for console output |    |           | string                                                |


### Callbacks

| Name       | Description                                   | Parameters                       |
| :--        | :--                                           | :--                              |
| onLoadEnd  | Called after success, timeout, abort or error | --                               |
| onProgress | Ongoing loading progress in percent and bytes | (percent: number, bytes: number) |
| onTimeOut  | Time-out callback (see timeoutMs parameter)   | --                               |
| onAbort    | When an open connection gets aborted          | --                               |

Please note that progress in % must not always work because it depends on server settings (not all connections give you the total data/file size).

### Methods

| Name   | Description                     | Parameters   |
| :--    | :--                             | :--          |
| send   | Sends the request to the server | data?        |
| abort  | Aborts an open connection       | --           |


There is also a simple getter for reading the "readyState" of current XMLHttpRequest connection.

## FAQs

__How can I stop a running connection?__
- Very easily, you don't need special constructs like the `AbortController()` in Fetch API. In Oxhr you simply call the `abort` method. See the included demo.

__Can I open multiple connections at once?__
- Yes and no. It's not possible using one instance of Oxhr, but you can create multiple (independent) instances. Since Oxhr works with EcmaScript's Promise object you can also make use of Promise.all(), Promise.any() etc. Additionally, you can start multiple "await ... send()" requests using one class instance, they will be handled one after another.


---


### License:
This project is released as permissive free software under the Apache License, Version 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
