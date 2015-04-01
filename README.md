# Microdata

## Installation

```Shell
npm install elixirhub/microdata
```


## How to use

```Javascript
var microdata = require('microdata');
var url = 'http://elixir-europe.org/events/';

// without URL
var result = microdata.parse(html);

// with URL
microdata.parse(url, function (err, result) {

});
```

### microdata.parse(htmlOrUrl[, callback])

* `htmlOrUrl` String – An HTML source or an URL.
* `callback` Function – Requied when the first parameter is an URL.


## License

Microdata is licensed under the MIT license.
