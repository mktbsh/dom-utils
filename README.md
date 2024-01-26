
# @mktbsh/dom-utils

A library for making DOM manipulation a bit more convenient.


## Table of contents

 - [Installation](https://github.com/mktbsh/dom-utils#Installation)
 - [Examples](https://github.com/mktbsh/dom-utils#Examples)
 - [License](https://github.com/mktbsh/dom-utils#License)

## Installation

npm

```bash
npm install @mktbsh/dom-utils
```

yarn

```bash
yarn add @mktbsh/dom-utils
```

pnpm

```bash
pnpm install @mktbsh/dom-utils
```
    
## Examples

```javascript
import { imageElementToBlob } from '@mktbsh/dom-utils'


async function main() {
  const img = document.querySelector('img');

  const blob = await imageElementToBlob(img);

  console.log(blob.size);
}

```


## License

Licensed under the [MIT](https://choosealicense.com/licenses/mit/)

