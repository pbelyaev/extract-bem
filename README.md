# Extract BEM NPM Package

This package will help you to get BEM blocks from your HTML.

Only elements with classes like this will apear in an output object:
```html
<div class="block"></div>
<div class="some-block"></div>
<div class="someBlock"></div>
```

## Usage

Install package via npm:

```bash
$ npm install extract-bem
```

Require the package:
```nodejs
var extractBEM = require('extract-bem');
```

In your script put down these lines of code:
```nodejs
var blocks = extractBEM({
    blade: false, // turn on blade engine parser (this options could help you with Laravel templates)
    directory: './src/html', // the directory where your files (also can be an array)
    extension: 'html', // the extension of your files (also can be an array)
    encoding: 'utf8' // the encoding of your files
});
```

The output will be an object like this:
```json
{
    'filename-without-extension': ['block', 'some-block', 'someBlock'],
    'another-file-without-extension': []
}
```
