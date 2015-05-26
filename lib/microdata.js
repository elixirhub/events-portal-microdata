/**
 * Modules dependencies
 */

var http = require('http');
var https = require('https');

var cheerio = require('cheerio');
var XRegExp = require('xregexp').XRegExp;


/**
 * Parse
 *
 * @param {String} htmlOrUrl - HTML or URL to parse.
 * @param {Function} [callback] - Add a callback if htmlOrUrl is an URL.
 */

function parse (htmlOrUrl, callback) {

  if (callback && /^(http|https):/.exec(htmlOrUrl)) {

    (RegExp.$1 === 'http' ? http : https).get(htmlOrUrl, function (res) {

      var htmlReceived = '';
      res.setEncoding('utf8');

      res.on('data', function (chunk) {
        htmlReceived += chunk;
      });

      res.on('end', function () {
        callback(null, parseHtml(htmlReceived));
      });

    }).on('error', function (err) {
      callback(err);
    });

  } else if (!callback)

    return parseHtml(htmlOrUrl);

}


/**
 * parseHtml
 *
 * @param {String} html
 */

function parseHtml (html) {

  var result = [];

  var $ = cheerio.load(html, {
    normalizeWhitespace: true
  });

  $('[itemscope]:not([itemprop])').each(function (i, itemscopeElem) {

    var itemtype = $(itemscopeElem).attr('itemtype');

    result[i] = {
      "itemtype": itemtype
    };

    var lastItemscopeObj = result[i];

    $('[itemprop]', itemscopeElem).each(function (j, itempropElem) {

      var itemscopeOriginElem =
        $(itempropElem).closest('[itemscope]:not([itemprop])');

      if ( ! $(itemscopeElem).is(itemscopeOriginElem) )
        return;

      var itemprop = $(itempropElem).attr('itemprop');
      var itemscope = $(itempropElem).attr('itemscope');
      var itemtype = $(itempropElem).attr('itemtype');

      var itemvalue;
      if (itemprop === 'url')
        itemvalue = $(itempropElem).attr('href');
      else if (itemprop === 'startDate')
        itemvalue = $(itempropElem).attr('content');
      else if ( $(itempropElem).is('meta') )
        itemvalue = $(itempropElem).attr('content');
      else
        itemvalue = $(itempropElem).text().trim().replace(
          XRegExp('[\\p{C}\\p{Z}]{2,}', 'g'), ' ');

      var itemscopeParentElem =
        $(itempropElem).parent().closest('[itemscope]');

      if ( $(itemscopeParentElem).is(itemscopeOriginElem) ) {

        if (itemscope !== undefined) {

          if (!result[i].children) result[i].children = [];

          result[i].children.push({
            "itemtype": itemtype,
            "itemprop": itemprop
          });

          lastItemscopeObj = result[i].children[result[i].children.length - 1];

        } else
          result[i][itemprop] = itemvalue;

      } else {

        if (itemscope !== undefined) {

          if (!lastItemscopeObj.children) lastItemscopeObj.children = [];

          lastItemscopeObj.children.push({
            "itemtype": itemtype,
            "itemprop": itemprop
          });

          lastItemscopeObj =
            lastItemscopeObj.children[lastItemscopeObj.children.length -1];

        } else
          lastItemscopeObj[itemprop] = itemvalue;

      }

    });

  });

  return result;

}


/**
 * Exports
 */

exports.parse = parse;
