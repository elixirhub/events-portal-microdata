# Microdata

## Installation

Manually:

```Shell
git clone git://github.com/elixirhub/microdata.git
```


## How to use

```Javascript
var microdata = require('microdata');
var url = 'http://elixir-europe.org/events/';

// without URL
var result1 = microdata.parse(html);

// with URL
var result2 = microdata.parse(url, function (err, result) {

});
```

### microdata.parse(htmlOrUrl[, callback])

* `htmlOrUrl` String – An HTML source or an URL.
* `callback` Function – Requied when the first parameter is an URL.
