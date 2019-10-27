// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"node_modules/ieee754/index.js":[function(require,module,exports) {
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"node_modules/base64-js/index.js","ieee754":"node_modules/ieee754/index.js","isarray":"node_modules/isarray/index.js","buffer":"node_modules/buffer/index.js"}],"jeelizFaceTransfer.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
function ia(b) {
  var d = new XMLHttpRequest();
  d.open("GET", a.Wa + a.save, !0);
  d.withCredentials = !1;

  d.onreadystatechange = function () {
    4 !== d.readyState || 200 !== d.status && 0 !== d.status || b(d.responseText);
  };

  d.send();
}

function ua() {
  for (var b = a.Cb, d = Array(b), e = 0; e < b; ++e) d[e] = 0;

  return d;
}

function xa(b, d, e) {
  b = Math.min(Math.max((e - b) / (d - b), 0), 1);
  return b * b * (3 - 2 * b);
}

function za(b, d, e) {
  return Math.min(Math.max((e - b) / (d - b), 0), 1);
}

function Ba(b, d, e, h) {
  return Math.pow(Math.min(Math.max((h - b) / (d - b), 0), 1), e);
}

function Da(b) {
  switch (b) {
    case "relu":
      return "gl_FragColor=max(vec4(0.,0.,0.,0.),gl_FragColor);";

    case "elu":
      return "gl_FragColor=mix(exp(-abs(gl_FragColor))-vec4(1.,1.,1.,1.),gl_FragColor,step(0.,gl_FragColor));";

    case "elu01":
      return "gl_FragColor=mix(0.1*exp(-abs(gl_FragColor))-vec4(0.1,0.1,0.1,0.1),gl_FragColor,step(0.,gl_FragColor));";

    case "arctan":
      return "gl_FragColor=atan(3.14159265359*texture2D(u0,vUV))/3.14159265359;";

    case "copy":
      return "";

    default:
      return !1;
  }
}

function Ea(b, d) {
  var e = d % 8;
  return b[(d - e) / 8] >> 7 - e & 1;
}

function Fa(b) {
  var d = JSON.parse(b);
  b = d.ne;
  var e = d.nf,
      h = d.n,
      k = "undefined" === typeof btoa ? Buffer.from(d.data, "base64").toString("latin1") : atob(d.data),
      l = k.length,
      q;
  d = new Uint8Array(l);

  for (q = 0; q < l; ++q) d[q] = k.charCodeAt(q);

  k = new Float32Array(h);
  l = new Float32Array(e);
  q = b + e + 1;
  var m, n;

  for (m = 0; m < h; ++m) {
    var g = q * m;
    var t = 0 === Ea(d, g) ? 1 : -1;
    var u = g + 1;
    var B = 1,
        H = 0;

    for (n = u + b - 1; n >= u; --n) H += B * Ea(d, n), B *= 2;

    n = H;
    u = d;
    B = g + 1 + b;
    H = l;
    var D = 0,
        L = H.length;

    for (g = B; g < B + L; ++g) H[D] = Ea(u, g), ++D;

    for (g = u = 0; g < e; ++g) u += l[g] * Math.pow(2, -g - 1);

    t = 0 === u && 0 === n ? 0 : t * (1 + u) * Math.pow(2, 1 + n - Math.pow(2, b - 1));
    k[m] = t;
  }

  return k;
}

var v = function () {
  function b(f, w) {
    f = r.createShader(f);
    r.shaderSource(f, w);
    r.compileShader(f);
    return r.getShaderParameter(f, r.COMPILE_STATUS) ? f : !1;
  }

  function d(f, w) {
    f = b(r.VERTEX_SHADER, f);
    w = b(r.FRAGMENT_SHADER, w);
    var A = r.createProgram();
    r.attachShader(A, f);
    r.attachShader(A, w);
    r.linkProgram(A);
    return A;
  }

  function e(f) {
    void 0 === f.ca && (f.ca = "precision lowp float;attribute vec2 a0;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=a0*.5+vec2(.5,.5);}");
    void 0 === f.fa && (f.fa = ["a0"]);
    void 0 === f.W && (f.W = [2]);
    if (void 0 === f.precision || "highp" === f.precision) f.precision = n;
    f.id = q++;
    void 0 !== f.ed && f.ed.forEach(function (A, ba) {
      f.c = f.c.replace(A, f.ta[ba]);
    });
    f.Va = 0;
    f.W.forEach(function (A) {
      f.Va += 4 * A;
    });
    f.sa = d(f.ca, "precision " + f.precision + " float;\n" + f.c);
    f.l = {};
    f.f.forEach(function (A) {
      f.l[A] = r.getUniformLocation(f.sa, A);
    });
    f.attributes = {};
    f.X = [];
    f.fa.forEach(function (A) {
      var ba = r.getAttribLocation(f.sa, A);
      f.attributes[A] = ba;
      f.X.push(ba);
    });

    if (f.h) {
      r.useProgram(f.sa);
      l = f;
      k = f.id;

      for (var w in f.h) r.uniform1i(f.l[w], f.h[w]);
    }

    f.Vd = !0;
  }

  function h(f) {
    Ga.ld(N);
    k !== f.id && (N.U(), k = f.id, l = f, r.useProgram(f.sa), f.X.forEach(function (w) {
      0 !== w && r.enableVertexAttribArray(w);
    }));
  }

  var k = -1,
      l = !1,
      q = 0,
      m = !1,
      n = "highp",
      g = ["u1"],
      t = ["u0"],
      u = {
    u1: 0
  },
      B = {
    u0: 0
  },
      H = {
    u1: 0,
    u2: 1
  },
      D = {
    u3: 0
  },
      L = {
    s0: {
      c: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
      f: g,
      h: u
    },
    s1: {
      c: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
      f: g,
      h: u,
      precision: "lowp"
    },
    s2: {
      c: "uniform sampler2D u1,u2;varying vec2 vv0;void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u1,vv0);gl_FragColor=a*b;}",
      f: ["u1", "u2"],
      h: H
    },
    s3: {
      c: "uniform sampler2D u1;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a.r*f;}",
      f: g,
      h: u
    },
    s4: {
      c: "uniform sampler2D u1,u2;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u2,vv0),b=texture2D(u1,vv0);gl_FragColor=a.a*b.r*f;}",
      f: ["u1", "mask"],
      h: H
    },
    s5: {
      c: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(1.-vv0.x,vv0.y));}",
      f: g,
      h: u
    },
    s6: {
      c: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vec2(vv0.x,1.-vv0.y));}",
      f: g,
      h: u
    },
    s7: {
      c: "uniform sampler2D u0;uniform float u4;varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=a*u4;}",
      f: ["u0", "u4"],
      h: B
    },
    s8: {
      c: "uniform sampler2D u0;uniform float u4;varying vec2 vv0;const vec4 g=vec4(.25,.25,.25,.25),e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0);float b=dot(a*u4,g);gl_FragColor=b*e;}",
      f: ["u0", "u4"],
      h: B
    },
    s9: {
      c: "uniform sampler2D u1;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){float a=.25*dot(e,texture2D(u1,vv0));gl_FragColor=a*e;}",
      f: g,
      h: u
    },
    s10: {
      c: "uniform sampler2D u1,u5;uniform float u6;const vec4 f=vec4(1.,1.,1.,1.);varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0),b=texture2D(u5,vv0);gl_FragColor=mix(b,a,u6*f);}",
      f: ["u1", "u5", "u6"],
      h: {
        u1: 0,
        u5: 1
      }
    },
    s11: {
      c: "uniform sampler2D u1;uniform vec2 u7;varying vec2 vv0;void main(){gl_FragColor=.25*(texture2D(u1,vv0+u7)+texture2D(u1,vv0+u7*vec2(1.,-1.))+texture2D(u1,vv0+u7*vec2(-1.,-1.))+texture2D(u1,vv0+u7*vec2(-1.,1.)));}",
      f: ["u1", "u7"],
      h: u
    },
    s12: {
      c: "uniform sampler2D u1;uniform vec4 u8;varying vec2 vv0;float g(float a,float b){a=floor(a)+.5;return floor(a/exp2(b));}float h(float a,float b){return floor(a*exp2(b)+.5);}float i(float a,float b){return mod(a,h(1.,b));}float e(float c,float a,float b){a=floor(a+.5),b=floor(b+.5);return i(g(c,a),b-a);}vec4 k(float a){if(a==0.)return vec4(0.,0.,0.,0.);float l=128.*step(a,0.);a=abs(a);float c=floor(log2(a)),m=c+127.,b=(a/exp2(c)-1.)*8388608.,d=m/2.,n=fract(d)*2.,o=floor(d),p=e(b,0.,8.),q=e(b,8.,16.),r=n*128.+e(b,16.,23.),j=l+o;return vec4(p,q,r,j)/255.;}void main(){float a=dot(texture2D(u1,vv0),u8);gl_FragColor=k(a);}",
      f: ["u1", "u8"],
      h: u
    },
    s13: {
      c: "uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=e/(e+exp(-a));gl_FragColor=b;}",
      f: t,
      h: B
    },
    s14: {
      c: "uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(0.,0.,0.,0.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=max(e,a);}",
      f: t,
      h: B
    },
    s15: {
      c: "uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=mix(exp(-abs(a))-e,a,step(0.,a));}",
      f: t,
      h: B
    },
    s16: {
      c: "uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),b=exp(-abs(a))-e;gl_FragColor=mix(.1*b,a,step(0.,a));}",
      f: t,
      h: B
    },
    s17: {
      c: "uniform sampler2D u0,u6,u9;varying vec2 vv0;const vec4 f=vec4(1.,1.,1.,1.);void main(){vec4 a=texture2D(u0,vv0),c=texture2D(u6,vv0),d=texture2D(u9,vv0),b=a/d;gl_FragColor=c*mix(exp(-abs(b))-f,b,step(0.,a));}",
      f: ["u0", "u6", "u9"],
      h: {
        u0: 0,
        u6: 1,
        u9: 2
      }
    },
    s18: {
      c: "uniform sampler2D u0;const float e=3.141593;varying vec2 vv0;void main(){gl_FragColor=atan(e*texture2D(u0,vv0))/e;}",
      f: t,
      h: B
    },
    s19: {
      c: "uniform sampler2D u0;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.),g=vec4(.5,.5,.5,.5);void main(){vec4 a=texture2D(u0,vv0),b=log(e+a);gl_FragColor=b;}",
      f: t,
      h: B
    },
    s20: {
      c: "uniform sampler2D u0;uniform float gain;varying vec2 vv0;void main(){vec4 a=texture2D(u0,vv0);gl_FragColor=exp(a);}",
      f: ["u0", "u10"],
      h: B
    },
    s21: {
      c: "uniform sampler2D u0,u11;uniform float u12;const vec2 f=vec2(.5,.5);const float g=1e-5;const vec4 h=vec4(1.,1.,1.,1.),i=vec4(0.,0.,0.,0.);varying vec2 vv0;void main(){vec4 a=texture2D(u11,f);float b=u12*u12;vec4 c=max(b*a,g*h);gl_FragColor=texture2D(u0,vv0)/c;}",
      f: ["u0", "u13", "u12"],
      h: {
        u0: 0,
        u13: 1
      }
    },
    s22: {
      c: "uniform sampler2D u1;uniform vec2 u14;varying vec2 vv0;void main(){float a=u14.x*u14.y;vec2 b=floor(vv0*a)/a,c=fract(vv0*a),d=floor(b*u14.y),g=floor(u14.x*fract(b*u14.y)),f=(g*u14.y+d)/a;gl_FragColor=texture2D(u1,f+c/a);}",
      f: ["u1", "u14"],
      h: u
    },
    s23: {
      c: "uniform sampler2D u15,u16,u17;varying vec2 vv0;void main(){vec4 a=texture2D(u17,vv0);vec2 b=a.rg,c=a.ba;vec4 d=texture2D(u15,b),e=texture2D(u16,c);gl_FragColor=d*e;}",
      f: ["u15", "u16", "u17"],
      h: {
        u16: 0,
        u15: 1,
        u17: 2
      }
    },
    s24: {
      c: "uniform float u18;uniform sampler2D u15,u16;varying vec2 vv0;void main(){vec2 a=fract(vv0*u18);vec4 b=texture2D(u15,vv0),c=texture2D(u16,a);gl_FragColor=b*c;}",
      f: ["u16", "u15", "u18"],
      h: {
        u16: 0,
        u15: 1
      }
    },
    s25: {
      c: "uniform float u18;uniform sampler2D u15,u16,u19,u20,u21,u22;varying vec2 vv0;const vec4 e=vec4(1.,1.,1.,1.),g=vec4(1e-3,1e-3,1e-3,1e-3);void main(){vec2 i=vv0*u18,m=floor(i),c=i-m;vec4 n=texture2D(u15,vv0),d=texture2D(u16,c),a=texture2D(u22,vv0);a=a*255.;vec4 o=texture2D(u19,c),p=texture2D(u20,c),q=texture2D(u21,c),j=step(-g,-a),b=e-j,k=b*step(-e-g,-a);b*=e-k;vec4 h=b*step(-2.*e-g,-a);b*=e-h;vec4 l=b;d=j*d+k*o+h*p+l*q,gl_FragColor=n*d;}",
      f: "u15 u16 u18 u22 u19 u20 u21".split(" "),
      h: {
        u16: 0,
        u15: 1,
        u22: 3,
        u19: 4,
        u20: 5,
        u21: 6
      }
    },
    s26: {
      c: "uniform sampler2D u15,u16,u23;uniform float u18,u24,u25,u26;varying vec2 vv0;const vec2 j=vec2(1.,1.);void main(){vec2 a=floor(u24*vv0),g=u24*vv0-a;float b=u18/u24;vec2 c=floor(g*b),d=g*b-c,h=(a+d)/u24;float l=u24*u26/u18;vec2 m=l*c,i=(m+d*u25)/u26,e=step(i,j);vec4 n=texture2D(u15,h),o=texture2D(u16,i),p=n*o*e.x*e.y,k=texture2D(u23,h);gl_FragColor=p*u25*u25+k;}",
      f: "u15 u16 u18 u24 u25 u26 u23".split(" "),
      h: {
        u16: 0,
        u15: 1,
        u23: 2
      }
    },
    s27: {
      c: "uniform sampler2D u15,u16;varying vec2 vv0;void main(){vec4 a=texture2D(u15,vv0),b=texture2D(u16,vv0);gl_FragColor=a*b;}",
      f: ["u15", "u16"],
      h: {
        u16: 0,
        u15: 1
      }
    },
    s28: {
      c: "uniform sampler2D u1,u23;uniform float u27;varying vec2 vv0;void main(){gl_FragColor=texture2D(u23,vv0)+u27*texture2D(u1,vv0);}",
      f: ["u1", "u23", "u27"],
      h: {
        u1: 0,
        u23: 1
      }
    },
    s29: {
      c: "varying vec2 vv0;uniform sampler2D u1;const vec4 g=vec4(1.,1.,1.,1.),e=vec4(.299,.587,.114,0.);void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=dot(a,e)*g;}",
      f: g,
      h: u,
      precision: "lowp"
    },
    s30: {
      c: "varying vec2 vv0;uniform sampler2D u1;uniform float u28;const vec3 e=vec3(.299,.587,.114);void main(){vec3 a=texture2D(u1,vv0).rgb,b=texture2D(u1,vv0+vec2(0.,u28)).rgb,c=texture2D(u1,vv0+vec2(u28,u28)).rgb,d=texture2D(u1,vv0+vec2(u28,0.)).rgb;gl_FragColor=vec4(dot(a,e),dot(b,e),dot(c,e),dot(d,e));}",
      f: ["u1", "u28"],
      h: u,
      precision: "lowp"
    },
    s31: {
      c: "varying vec2 vv0;uniform sampler2D u1;uniform float u28;const vec3 f=vec3(.299,.587,.114);void main(){vec3 a=texture2D(u1,vv0).rgb,b=texture2D(u1,vv0+vec2(0.,u28)).rgb,c=texture2D(u1,vv0+vec2(u28,u28)).rgb,d=texture2D(u1,vv0+vec2(u28,0.)).rgb;gl_FragColor=vec4(a.r,b.g,c.b,dot(d,f));}",
      f: ["u1", "u28"],
      h: u,
      precision: "lowp"
    },
    s32: {
      c: "varying vec2 vv0;uniform sampler2D u1,u2;uniform float u29;const vec4 g=vec4(1.,1.,1.,1.);void main(){vec4 a=vec4(0.);a-=texture2D(u1,vec2(vv0.x-u29,vv0.y-u29))*1.,a-=texture2D(u1,vec2(vv0.x-u29,vv0.y))*2.,a-=texture2D(u1,vec2(vv0.x-u29,vv0.y+u29))*1.,a+=texture2D(u1,vec2(vv0.x+u29,vv0.y-u29))*1.,a+=texture2D(u1,vec2(vv0.x+u29,vv0.y))*2.,a+=texture2D(u1,vec2(vv0.x+u29,vv0.y+u29))*1.;vec4 b=vec4(0.);b-=texture2D(u1,vec2(vv0.x-u29,vv0.y-u29))*1.,b-=texture2D(u1,vec2(vv0.x,vv0.y-u29))*2.,b-=texture2D(u1,vec2(vv0.x+u29,vv0.y-u29))*1.,b+=texture2D(u1,vec2(vv0.x-u29,vv0.y+u29))*1.,b+=texture2D(u1,vec2(vv0.x,vv0.y+u29))*2.,b+=texture2D(u1,vec2(vv0.x+u29,vv0.y+u29))*1.;vec3 c=sqrt(a.rgb*a.rgb+b.rgb*b.rgb);vec4 e=vec4(c,texture2D(u1,vv0).a),f=texture2D(u2,vv0);gl_FragColor=f.a*e.r*g;}",
      f: ["u1", "u2", "u29"],
      h: H
    },
    s33: {
      c: "varying vec2 vv0;uniform sampler2D u1,u2;uniform float u29;const vec4 j=vec4(1.,1.,1.,1.);const vec2 k=vec2(1.,1.);void main(){float i=0.;vec2 l=k*u29,b,c;float d,a,g=0.;for(float f=-4.;f<=4.;f+=1.)for(float e=-4.;e<=4.;e+=1.)b=vec2(f,e),d=length(b)/2.,a=exp(-d*d),c=vv0+l*b,a=1.,i+=a*texture2D(u1,c).r,g+=a;vec4 m=texture2D(u2,vv0);gl_FragColor=m.a*(texture2D(u1,c).r-i/g)*j;}",
      f: ["u1", "u2", "u29"],
      h: H
    },
    s34: {
      c: "uniform sampler2D u3;uniform vec2 u7;varying vec2 vv0;vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}const vec2 h=vec2(.5,.5),i=vec2(1.,0.),j=vec2(0.,1.);void main(){vec2 a=vv0-u7*h;vec4 b=texture2D(u3,a),c=texture2D(u3,a+u7*i),d=texture2D(u3,a+u7*j),k=texture2D(u3,a+u7),l=e(b,c),g=e(d,k);gl_FragColor=e(l,g);}",
      f: ["u3", "u7"],
      h: D
    },
    s35: {
      c: "uniform sampler2D u3;uniform vec2 u7;varying vec2 vv0;const vec2 j=vec2(1.,0.),k=vec2(0.,1.),l=vec2(2.,0.),m=vec2(0.,2.);vec4 e(vec4 a,vec4 b){vec4 c=step(a,b);return mix(a,b,c);}vec4 f(vec2 a){vec4 b=texture2D(u3,a),c=texture2D(u3,a+u7*j),d=texture2D(u3,a+u7*k),g=texture2D(u3,a+u7),i=e(b,c),h=e(d,g);return e(i,h);}void main(){vec2 a=vv0+u7*vec2(-.55,-1.05);vec4 b=f(a),c=f(a+u7*l),d=f(a+u7*2.),g=f(a+u7*m),i=e(b,c),h=e(d,g);gl_FragColor=e(i,h);}",
      f: ["u3", "u7"],
      h: D
    },
    s36: {
      c: "uniform sampler2D u1;varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0);gl_FragColor=a*a;}",
      f: ["u1"],
      h: u,
      precision: "lowp"
    },
    s37: {
      c: "uniform sampler2D u1;uniform vec2 u7;varying vec2 vv0;const vec4 g=vec4(1.,1.,1.,1.);const float d=15444.;void main(){vec4 a=1001./d*texture2D(u1,vv0-3.*u7)+2002./d*texture2D(u1,vv0-2.*u7)+3003./d*texture2D(u1,vv0-u7)+3432./d*texture2D(u1,vv0)+3003./d*texture2D(u1,vv0+u7)+2002./d*texture2D(u1,vv0+2.*u7)+1001./d*texture2D(u1,vv0+3.*u7);gl_FragColor=a;}",
      f: ["u7", "u1"],
      h: u,
      precision: "lowp"
    },
    s38: {
      c: "uniform sampler2D u1,u30,u31;varying vec2 vv0;const vec4 g=vec4(1.,1.,1.,1.);const float h=.1;void main(){vec4 a=texture2D(u30,vv0),b=texture2D(u31,vv0),c=texture2D(u1,vv0),d=max(g*h,b-a*a),f=sqrt(d);gl_FragColor=(c-a)/f;}",
      f: ["u1", "u30", "u31"],
      h: {
        u1: 0,
        u30: 1,
        u31: 2
      }
    }
  },
      Q = {
    s39: {
      c: "uniform float u18,u32;uniform sampler2D u15,u16,u23;varying vec2 vv0;const vec2 ZERO2=vec2(0.,0.),ONE2=vec2(1.,1.),HALF2=vec2(.5,.5),EPS2=vec2(1e-4,1e-4);void main(){vec4 sum=texture2D(u23,vv0);float toSparsity=1.1111;vec2 uvFrom,uvWeight,xyPatch=ZERO2,eps2=EPS2/u18,xyTo=floor(vv0*u18+eps2);float weightSize=toSparsity*u18;vec2 halfFromSparsity=ONE2*(toSparsity-1.)/2.;for(float patch_x=0.;patch_x<1.1111;patch_x+=1.){xyPatch.x=patch_x;for(float patch_y=0.;patch_y<1.1111;patch_y+=1.)xyPatch.y=patch_y,uvFrom=(xyTo+HALF2+u32*(xyPatch-halfFromSparsity))/u18,uvFrom+=step(uvFrom,-eps2),uvFrom-=step(ONE2-eps2,uvFrom),uvWeight=(xyTo*toSparsity+xyPatch+HALF2)/weightSize,sum+=texture2D(u15,uvWeight)*texture2D(u16,uvFrom);}gl_FragColor=sum,gl_FragColor*=2.2222;}",
      f: ["u18", "u15", "u16", "u23", "u32"],
      ta: ["1.1111", "gl_FragColor\\*=2.2222;"]
    },
    s40: {
      c: "uniform float u18,u32,u26;uniform sampler2D u15,u16,u23;varying vec2 vv0;const vec2 ZERO2=vec2(0.,0.),ONE2=vec2(1.,1.),HALF2=vec2(.5,.5),EPS2=vec2(1e-4,1e-4);void main(){vec4 sum=texture2D(u23,vv0);float fromSparsity=1.1111,shrinkFactor=3.3333;vec2 uvFrom,uvWeight,xyFrom,xyPatchTo,xyPatch=ZERO2,xyShrink=ZERO2,eps2=EPS2/u26,xyTo=floor(vv0*u18+eps2);float weightSize=fromSparsity*u26;vec2 halfFromSparsity=ONE2*(fromSparsity-1.)/2.;float toSparsity=weightSize/u18;vec2 xyFrom0=xyTo*shrinkFactor;for(float patch_x=0.;patch_x<1.1111;patch_x+=1.){xyPatch.x=patch_x;for(float patch_y=0.;patch_y<1.1111;patch_y+=1.){xyPatch.y=patch_y;for(float shrink_x=0.;shrink_x<3.3333;shrink_x+=1.){xyShrink.x=shrink_x;for(float shrink_y=0.;shrink_y<3.3333;shrink_y+=1.)xyShrink.y=shrink_y,xyFrom=xyFrom0+xyShrink+shrinkFactor*u32*(xyPatch-halfFromSparsity),uvFrom=(xyFrom+HALF2)/u26,uvFrom+=step(uvFrom,-eps2),uvFrom-=step(ONE2-eps2,uvFrom),xyPatchTo=xyPatch*shrinkFactor+xyShrink,uvWeight=(xyTo*toSparsity+xyPatchTo+HALF2)/weightSize,sum+=texture2D(u15,uvWeight)*texture2D(u16,uvFrom);}}}gl_FragColor=sum,gl_FragColor*=2.2222;}",
      f: "u18 u26 u15 u16 u23 u32".split(" "),
      ta: ["1.1111", "gl_FragColor\\*=2.2222;", "3.3333"]
    }
  },
      N = {
    Ma: function () {
      return m;
    },
    i: function () {
      if (!m) {
        n = "highp";

        for (var f in L) e(L[f], f);

        v.set("s0");
        r.enableVertexAttribArray(0);
        f = Ha.i();
        m = !0;
        return f;
      }
    },
    Xb: function (f) {
      f.forEach(function (w) {
        N.$a(w);
      });
    },
    $a: function (f) {
      L[f.id] = f;
      e(f, f.id);
    },
    qb: function (f, w, A) {
      w || (w = f);
      L[w] = Object.create(Q[f]);
      Q[f].ta && Q[f].ta.forEach(function (ba, pa) {
        L[w].c = L[w].c.replace(new RegExp(ba, "g"), A[pa]);
      });
      e(L[w], w);
    },
    set: function (f) {
      h(L[f]);
    },
    uc: function (f) {
      return "undefined" !== typeof L[f];
    },
    Hd: function () {
      return l.Ed;
    },
    U: function () {
      -1 !== k && (k = -1, l.X.forEach(function (f) {
        0 !== f && r.disableVertexAttribArray(f);
      }));
    },
    Sa: function () {
      var f = 0;
      l.X.forEach(function (w, A) {
        A = l.W[A];
        r.vertexAttribPointer(w, A, r.FLOAT, !1, l.Va, f);
        f += 4 * A;
      });
    },
    Dd: function () {
      r.enableVertexAttribArray(0);
    },
    Ta: function () {
      r.vertexAttribPointer(l.X[0], 2, r.FLOAT, !1, 8, 0);
    },
    ge: function (f, w) {
      r.uniform1i(l.l[f], w);
    },
    A: function (f, w) {
      r.uniform1f(l.l[f], w);
    },
    I: function (f, w, A) {
      r.uniform2f(l.l[f], w, A);
    },
    he: function (f, w) {
      r.uniform2fv(l.l[f], w);
    },
    ie: function (f, w) {
      r.uniform3fv(l.l[f], w);
    },
    Mb: function (f, w, A, ba) {
      r.uniform3f(l.l[f], w, A, ba);
    },
    Nb: function (f, w) {
      r.uniform4fv(l.l[f], w);
    },
    je: function (f, w) {
      r.uniformMatrix2fv(l.l[f], !1, w);
    },
    ke: function (f, w) {
      r.uniformMatrix3fv(l.l[f], !1, w);
    },
    le: function (f, w) {
      r.uniformMatrix4fv(l.l[f], !1, w);
    },
    C: function (f, w) {
      N.set(f);
      w.forEach(function (A) {
        switch (A.type) {
          case "4f":
            r.uniform4fv(l.l[A.name], A.value);
            break;

          case "3f":
            r.uniform3fv(l.l[A.name], A.value);
            break;

          case "2f":
            r.uniform2fv(l.l[A.name], A.value);
            break;

          case "1f":
            r.uniform1f(l.l[A.name], A.value);
            break;

          case "1i":
            r.uniform1i(l.l[A.name], A.value);
            break;

          case "mat2":
            r.uniformMatrix2fv(l.l[A.name], !1, A.value);
            break;

          case "mat3":
            r.uniformMatrix3fv(l.l[A.name], !1, A.value);
            break;

          case "mat4":
            r.uniformMatrix4fv(l.l[A.name], !1, A.value);
        }
      });
    },
    Od: function () {
      return "lowp";
    }
  };
  return N;
}(),
    r = !1,
    Ja = function () {
  function b(g) {
    console.log("ERROR in ContextFeedForward : ", g);
    return !1;
  }

  function d() {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
      var g = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
      g = [parseInt(g[1], 10), parseInt(g[2], 10), parseInt(g[3] || 0, 10)];
      return 12 === g[0] || 13 === g[0] ? !0 : !1;
    }

    return /(Mac)/i.test(navigator.platform) && ((g = navigator.userAgent) ? (g = g.match(/Mac OS X (\d+)_(\d+)/) || g.match(/Mac OS X (\d+).(\d+)/), g = !g || 3 > g.length ? !1 : [parseInt(g[1], 10), parseInt(g[2], 10)]) : g = !1, g && 10 === g[0] && 15 === g[1]) ? !0 : !1;
  }

  var e = !1,
      h = !1,
      k = !1,
      l = !1,
      q = !0,
      m = !1,
      n = {
    o: function () {
      return e.width;
    },
    F: function () {
      return e.height;
    },
    la: function () {
      return e;
    },
    Gd: function () {
      return r;
    },
    m: function () {
      return q;
    },
    flush: function () {
      r.flush();
    },
    yc: function () {
      m || (m = new Uint8Array(e.width * e.height * 4));
      r.readPixels(0, 0, e.width, e.height, r.RGBA, r.UNSIGNED_BYTE, m);
      return m;
    },
    Jd: function () {
      return e.toDataURL("image/jpeg");
    },
    Kd: function () {
      E.D();
      h || (h = document.createElement("canvas"), k = h.getContext("2d"));
      h.width = e.width;
      h.height = e.height;
      var g = n.yc(),
          t = k.createImageData(h.width, h.height),
          u,
          B,
          H = h.width,
          D = h.height,
          L = t.data;

      for (B = 0; B < D; ++B) {
        var Q = D - B - 1;

        for (u = 0; u < H; ++u) {
          var N = 4 * (B * H + u);
          var f = 4 * (Q * H + u);
          L[N] = g[f];
          L[N + 1] = g[f + 1];
          L[N + 2] = g[f + 2];
          L[N + 3] = g[f + 3];
        }
      }

      k.putImageData(t, 0, 0);
      return h.toDataURL("image/png");
    },
    Id: function (g) {
      !h && g && (h = document.createElement("canvas"), k = h.getContext("2d"));
      var t = g ? h : document.createElement("canvas");
      t.width = e.width;
      t.height = e.height;
      (g ? k : t.getContext("2d")).drawImage(e, 0, 0);
      return t;
    },
    i: function (g) {
      g.ib && !g.ia ? e = document.getElementById(g.ib) : g.ia && (e = g.ia);
      e || (e = document.createElement("canvas"));
      e.width = g && void 0 !== g.width ? g.width : 512;
      e.height = g && void 0 !== g.height ? g.height : 512;
      "undefined" === typeof g && (g = {});
      void 0 === g.premultipliedAlpha && (g.premultipliedAlpha = !1);
      void 0 === g.La && (g.La = !0);
      void 0 === g.antialias && (g.antialias = !1);
      var t = {
        antialias: g.antialias,
        alpha: !0,
        preserveDrawingBuffer: !0,
        premultipliedAlpha: g.premultipliedAlpha,
        stencil: !1,
        depth: g.La
      };
      d() || (r = e.getContext("webgl2", t));
      r ? q = !0 : ((r = e.getContext("webgl", t)) || (r = e.getContext("experimental-webgl", t)), q = !1);
      if (!r) return b("WebGL is not enabled");
      (l = r.getExtension("WEBGL_lose_context")) && e.addEventListener("webglcontextlost", g.Zc, !1);
      if (!Ia.i()) return b("Not enough capabilities");
      if (!Ia.fc() && q) return b("Your configuration cannot process color buffer float");
      r.clearColor(0, 0, 0, 0);
      r.disable(r.DEPTH_TEST);
      r.disable(r.BLEND);
      r.disable(r.DITHER);
      r.disable(r.STENCIL_TEST);
      r.GENERATE_MIPMAP_HINT && r.hint(r.GENERATE_MIPMAP_HINT, r.FASTEST);
      r.disable(r.SAMPLE_ALPHA_TO_COVERAGE);
      r.disable(r.SAMPLE_COVERAGE);
      return !0;
    },
    Ud: function () {
      if (!v.i()) return !1;
      r.depthFunc(r.LEQUAL);
      r.clearDepth(1);
      return !0;
    }
  };
  return n;
}(),
    Ga = function () {
  var b = "undefined" === typeof v ? JEShaders : v;
  return {
    ld: function (d) {
      b !== d && (b.U(), b = d);
    },
    Ma: function () {
      return b.Ma();
    },
    Ta: function () {
      b.Ta();
    },
    Sa: function () {
      b.Sa();
    },
    U: function () {
      b.U();
    },
    set: function (d) {
      b.set(d);
    }
  };
}(),
    I = function () {
  var b,
      d,
      e = 0,
      h = -2,
      k = -2,
      l = !1,
      q = {
    reset: function () {
      k = h = -2;
    },
    i: function () {
      l || (b = r.createBuffer(), r.bindBuffer(r.ARRAY_BUFFER, b), r.bufferData(r.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), r.STATIC_DRAW), d = r.createBuffer(), r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, d), r.bufferData(r.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2]), r.STATIC_DRAW), q.Ca(), l = !0);
    },
    a: function (m) {
      var n = e++,
          g = m.L ? m.L.length : 0,
          t = "undefined" === typeof m.mode ? r.STATIC_DRAW : m.mode,
          u = r.createBuffer();
      r.bindBuffer(r.ARRAY_BUFFER, u);
      r.bufferData(r.ARRAY_BUFFER, m.Tb instanceof Float32Array ? m.Tb : new Float32Array(m.Tb), t);
      h = n;

      if (m.L) {
        var B = r.createBuffer();
        r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, B);

        if (65536 > m.L.length) {
          var H = Uint16Array;
          var D = r.UNSIGNED_SHORT;
          var L = 2;
        } else H = Uint32Array, D = r.UNSIGNED_INT, L = 4;

        r.bufferData(r.ELEMENT_ARRAY_BUFFER, m.L instanceof H ? m.L : new H(m.L), t);
        k = n;
      }

      var Q = {
        ec: function (N) {
          h !== n && (r.bindBuffer(r.ARRAY_BUFFER, u), h = n);
          N && Ga.Sa();
        },
        cc: function () {
          k !== n && (r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, B), k = n);
        },
        bind: function (N) {
          Q.ec(N);
          Q.cc();
        },
        Bd: function () {
          r.drawElements(r.TRIANGLES, g, D, 0);
        },
        Cd: function (N, f) {
          r.drawElements(r.TRIANGLES, N, D, f * L);
        },
        remove: function () {
          r.deleteBuffer(u);
          m.L && r.deleteBuffer(B);
          Q = null;
        }
      };
      return Q;
    },
    Ca: function () {
      -1 !== h && (r.bindBuffer(r.ARRAY_BUFFER, b), h = -1);
      -1 !== k && (r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, d), k = -1);
    },
    g: function (m, n) {
      m && I.Ca();
      n && Ga.Ta();
      r.drawElements(r.TRIANGLES, 3, r.UNSIGNED_SHORT, 0);
    },
    xc: function () {
      r.deleteBuffer(b);
      r.deleteBuffer(d);
    }
  };
  return q;
}(),
    E = function () {
  var b,
      d,
      e,
      h = !1,
      k = {
    s: -2,
    vc: 1
  };
  return {
    i: function () {
      if (!h) {
        b = r.createFramebuffer();
        var l = Ia.m();
        d = l && r.DRAW_FRAMEBUFFER ? r.DRAW_FRAMEBUFFER : r.FRAMEBUFFER;
        e = l && r.READ_FRAMEBUFFER ? r.READ_FRAMEBUFFER : r.FRAMEBUFFER;
        h = !0;
      }
    },
    Md: function () {
      return d;
    },
    Ha: function () {
      return e;
    },
    R: function () {
      return r.FRAMEBUFFER;
    },
    Pd: function () {
      return k;
    },
    Fd: function () {
      return b;
    },
    a: function (l) {
      void 0 === l.sb && (l.sb = !1);
      var q = l.ba ? l.ba : !1,
          m = l.width,
          n = void 0 !== l.height ? l.height : l.width,
          g = b,
          t = !1,
          u = !1,
          B = 0;
      q && (m = m ? m : q.o(), n = n ? n : q.F());
      var H = {
        Kb: function () {
          u || (g = r.createFramebuffer(), u = !0, B = k.vc++);
        },
        Wb: function () {
          H.Kb();
          H.j();
          t = r.createRenderbuffer();
          r.bindRenderbuffer(r.RENDERBUFFER, t);
          r.renderbufferStorage(r.RENDERBUFFER, r.DEPTH_COMPONENT16, m, n);
          r.framebufferRenderbuffer(d, r.DEPTH_ATTACHMENT, r.RENDERBUFFER, t);
          r.clearDepth(1);
        },
        bind: function (D, L) {
          B !== k.s && (r.bindFramebuffer(d, g), k.s = B);
          q && q.j();
          L && r.viewport(0, 0, m, n);
          D && r.clear(r.COLOR_BUFFER_BIT | r.DEPTH_BUFFER_BIT);
        },
        vd: function () {
          B !== k.s && (r.bindFramebuffer(d, g), k.s = B);
        },
        clear: function () {
          r.clear(r.COLOR_BUFFER_BIT | r.DEPTH_BUFFER_BIT);
        },
        yd: function () {
          r.clear(r.COLOR_BUFFER_BIT);
        },
        zd: function () {
          r.clear(r.DEPTH_BUFFER_BIT);
        },
        md: function () {
          r.viewport(0, 0, m, n);
        },
        j: function () {
          B !== k.s && (r.bindFramebuffer(d, g), k.s = B);
        },
        rtt: function (D) {
          q = D;
          k.s !== B && (r.bindFramebuffer(r.FRAMEBUFFER, g), k.s = B);
          D.j();
        },
        D: function () {
          r.bindFramebuffer(d, null);
          k.s = -1;
        },
        resize: function (D, L) {
          m = D;
          n = L;
          t && (r.bindRenderbuffer(r.RENDERBUFFER, t), r.renderbufferStorage(r.RENDERBUFFER, r.DEPTH_COMPONENT16, m, n));
        },
        remove: function () {
          r.bindFramebuffer(d, g);
          r.framebufferTexture2D(d, r.COLOR_ATTACHMENT0, r.TEXTURE_2D, null, 0);
          t && r.framebufferRenderbuffer(d, r.DEPTH_ATTACHMENT, r.RENDERBUFFER, null);
          r.bindFramebuffer(d, null);
          r.deleteFramebuffer(g);
          t && r.deleteRenderbuffer(t);
          H = null;
        }
      };
      l.sb && H.Wb();
      return H;
    },
    D: function () {
      r.bindFramebuffer(d, null);
      k.s = -1;
    },
    rd: function () {
      r.bindFramebuffer(d, null);
      r.clear(r.COLOR_BUFFER_BIT | r.DEPTH_BUFFER_BIT);
      r.viewport(0, 0, Ia.o(), Ia.F());
      k.s = -1;
    },
    reset: function () {
      k.s = -2;
    },
    H: function () {
      0 !== k.s && (r.bindFramebuffer(d, b), k.s = 0);
    },
    clear: function () {
      r.viewport(0, 0, Ia.o(), Ia.F());
      r.clear(r.COLOR_BUFFER_BIT);
    }
  };
}(),
    K = function () {
  function b(c) {
    r.bindTexture(r.TEXTURE_2D, c);
  }

  function d(c) {
    pa[0] = c;
    c = sa[0];
    var C = c >> 16 & 32768,
        J = c >> 12 & 2047,
        O = c >> 23 & 255;
    return 103 > O ? C : 142 < O ? C | 31744 | ((255 == O ? 0 : 1) && c & 8388607) : 113 > O ? (J |= 2048, C | (J >> 114 - O) + (J >> 113 - O & 1)) : C = (C | O - 112 << 10 | J >> 1) + (J & 1);
  }

  function e(c) {
    var C = new Uint16Array(c.length);
    c.forEach(function (J, O) {
      C[O] = d(J);
    });
    return C;
  }

  function h() {
    if (null !== ma.Ia) return ma.Ia;
    var c = l(e([1, 1, 1, 1]));
    return null === c ? !0 : ma.Ia = c;
  }

  function k() {
    if (null !== ma.Ja) return ma.Ja;
    var c = l(new Uint8Array([255, 255, 255, 255]));
    return null === c ? !0 : ma.Ja = c;
  }

  function l(c) {
    if (!Ga.Ma() || !D) return null;

    try {
      var C = r.getError(),
          J = W.a({
        isFloat: !1,
        B: !0,
        array: c,
        width: 1
      });
      C = r.getError();
      if (C !== r.NO_ERROR) return !1;
    } catch (O) {
      return !1;
    }

    E.D();
    r.viewport(0, 0, 1, 1);
    r.clearColor(0, 0, 0, 0);
    r.clear(r.COLOR_BUFFER_BIT);
    Ga.set("s0");
    J.eb(0);
    I.g(!1, !0);
    c = new Uint8Array(4);
    r.readPixels(0, 0, 1, 1, r.RGBA, r.UNSIGNED_BYTE, c);
    c = .9 < c[0];
    J.remove();
    E.H();
    return c;
  }

  var q = 0,
      m,
      n = 0,
      g,
      t = !1,
      u,
      B,
      H,
      D = !1,
      L = !1,
      Q,
      N,
      f,
      w = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]],
      A = !1,
      ba = !1,
      pa = new Float32Array(1),
      sa = new Int32Array(pa.buffer),
      ma = {
    Ia: null,
    Ja: null
  },
      W = {
    i: function () {
      if (!D) {
        B = [r.RGB, !1, r.RGB, r.RGBA];
        H = [r.RGB, !1, r.RGB, r.RGBA];
        m = [r.TEXTURE0, r.TEXTURE1, r.TEXTURE2, r.TEXTURE3, r.TEXTURE4, r.TEXTURE5, r.TEXTURE6, r.TEXTURE7];
        A = "undefined" !== typeof JEContext;
        ba = "undefined" !== typeof Ia;
        A && JEContext.ae() && m.push(r.TEXTURE8, r.TEXTURE9);
        g = [-1, -1, -1, -1, -1, -1, -1, -1];
        u = [r.UNSIGNED_BYTE, r.FLOAT, r.FLOAT];

        if (!t) {
          for (var c = new Float32Array(16384), C = 0; 16384 > C; ++C) c[C] = 2 * Math.random() - 1;

          t = {
            random: W.a({
              isFloat: !0,
              isPot: !0,
              array: c,
              width: 64
            }),
            Rb: W.a({
              isFloat: !1,
              isPot: !0,
              width: 1,
              array: new Uint8Array([0, 0, 0, 0])
            })
          };
        }

        D = !0;
      }
    },
    Ic: function () {
      W.sd();
    },
    Sd: function () {
      return t.Rb;
    },
    sd: function () {
      u[1] = Ia.ma();
    },
    gd: function () {
      H = B = [r.RGBA, r.RGBA, r.RGBA, r.RGBA];
    },
    bd: function (c, C) {
      v.set("s1");
      E.D();
      var J = c.o(),
          O = c.F();
      r.viewport(0, 0, J, O);
      c.b(0);
      I.g(!1, !1);
      r.readPixels(0, 0, J, O, r.RGBA, r.UNSIGNED_BYTE, C);
    },
    wc: function (c, C, J) {
      r.activeTexture(r.TEXTURE0);
      q = 0;
      var O = r.createTexture();
      b(O);
      var X = Ia.m() && r.RGBA32F ? r.RGBA32F : r.FLOAT;
      C = C instanceof Float32Array ? C : new Float32Array(C);
      var Y = Math.log2(C.length);
      Y !== Math.floor(Y) && (r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE));
      r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.NEAREST);
      r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.NEAREST);
      r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, J);
      r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, c.o(), c.F(), 0, r.RGBA, X, C);
      b(null);
      r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1);
      E.H();
      v.set("s0");
      c.u();
      r.clearColor(0, 0, 0, 0);
      r.clear(r.COLOR_BUFFER_BIT);
      b(O);
      I.g(!0, !1);
      r.deleteTexture(O);
    },
    a: function (c) {
      function C() {
        b(ca);
        qa && r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, qa);
        c.isPot ? (r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, c.ub ? r.MIRRORED_REPEAT : r.REPEAT), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, c.M ? r.MIRRORED_REPEAT : r.REPEAT)) : (r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE));
        c.pa && "undefined" !== typeof JESETTINGS && r.texParameterf(r.TEXTURE_2D, JEContext.Ld().TEXTURE_MAX_ANISOTROPY_EXT, JESETTINGS.ud);
        r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, c.isLinear ? r.LINEAR : r.NEAREST);
        c.isLinear ? r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, c.isMipmap && !va ? r.NEAREST_MIPMAP_LINEAR : r.LINEAR) : r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, c.isMipmap && !va ? r.NEAREST_MIPMAP_NEAREST : r.NEAREST);
        ja = B[c.aa - 1];
        da = H[c.aa - 1];
        la = u[J];

        if (Ia.m()) {
          var p = r.RGBA32F;
          ja === r.RGBA && la === r.FLOAT && p && (da = p);
          ja === r.RGB && la === r.FLOAT && p && (da = p, ja = r.RGBA);
        }

        if (c.B && !c.isFloat || c.isFloat && c.isMipmap && Ha.Lc()) (p = r.RGBA16F) && (da = p), la = Ia.ma();
        c.xb && "undefined" !== typeof r.texStorage2D && (y = c.xb);
        c.vb && 4 === c.aa && (ja = JEContext.Qd());
        if (c.v) r.texImage2D(r.TEXTURE_2D, 0, da, ja, la, c.v);else if (c.url) r.texImage2D(r.TEXTURE_2D, 0, da, ja, la, na);else if (S) {
          try {
            r.getError(), r.texImage2D(r.TEXTURE_2D, 0, da, M, z, 0, ja, la, S), r.getError() !== r.NO_ERROR && (r.texImage2D(r.TEXTURE_2D, 0, da, M, z, 0, ja, la, null), r.getError() !== r.NO_ERROR && r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, M, z, 0, r.RGBA, r.UNSIGNED_BYTE, null));
          } catch (fa) {
            r.texImage2D(r.TEXTURE_2D, 0, da, M, z, 0, ja, la, null);
          }

          c.isKeepArray || (S = null);
        } else r.texImage2D(r.TEXTURE_2D, 0, da, M, z, 0, ja, la, null);
        if (c.isMipmap) if (!va && F) F.Ga(), G = !0;else if (va) {
          p = Math.log(Math.min(M, z)) / Math.log(2);
          var x;
          ka = Array(1 + p);
          ka[0] = ca;

          for (x = 1; x <= p; ++x) {
            var P = Math.pow(2, x);
            var oa = M / P;
            P = z / P;
            var ea = r.createTexture();
            b(ea);
            r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.NEAREST);
            r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.NEAREST);
            r.texImage2D(r.TEXTURE_2D, 0, da, oa, P, 0, ja, la, null);
            b(null);
            ka[x] = ea;
          }

          G = !0;
        }
        b(null);
        g[q] = -1;
        qa && r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1);
        T = !0;
        Z && F && (Z(F), Z = !1);
      }

      "undefined" === typeof c.isFloat && (c.isFloat = !1);
      "undefined" === typeof c.B && (c.B = !1);
      "undefined" === typeof c.isPot && (c.isPot = !0);
      "undefined" === typeof c.isLinear && (c.isLinear = !1);
      "undefined" === typeof c.isMipmap && (c.isMipmap = !1);
      "undefined" === typeof c.Da && (c.Da = !1);
      void 0 === c.pa && (c.pa = !1);
      void 0 === c.M && (c.M = !1);
      void 0 === c.ub && (c.ub = !1);
      void 0 === c.vb && (c.vb = !1);
      void 0 === c.aa && (c.aa = 4);
      void 0 === c.tb && (c.tb = !1);
      "undefined" === typeof c.isFlipY && (c.isFlipY = c.url || c.array ? !0 : !1);
      "undefined" === typeof c.isKeepArray && (c.isKeepArray = !1);
      c.data && (c.array = "string" === typeof c.data ? Fa(c.data) : c.isFloat ? new Float32Array(c.data) : new Uint8Array(c.data), c.isFlipY = !1);
      var J = 0,
          O = c.v ? !0 : !1,
          X = null,
          Y = null,
          aa = !1,
          ra = null;
      c.isFloat && (c.B = !0);
      c.B && (J = 1);
      c.tb || Ia.m() || !c.isFloat || !ba || Ia.gb() || (c.isFloat = !1);
      c.isFloat && (J = 2);
      c.pa && A && !JEContext.Wd() && (c.pa = !1);
      var ca = r.createTexture(),
          Z = c.Da,
          na = null,
          S = !1,
          M = 0,
          z = 0,
          T = !1,
          U = n++,
          R = !1,
          ha,
          ta,
          Ca,
          Aa,
          da,
          ja,
          la,
          qa = c.isFlipY,
          va = c.B && c.isMipmap && "undefined" !== typeof Ha && !Ha.hc() ? !0 : !1,
          ka,
          y = -1,
          G = !1;
      "undefined" !== typeof c.width && c.width && (M = c.width, z = "undefined" !== typeof c.height && c.height ? c.height : M);
      var F = {
        get: function () {
          return ca;
        },
        o: function () {
          return M;
        },
        F: function () {
          return z;
        },
        Td: function () {
          return c.url;
        },
        Xd: function () {
          return c.isFloat;
        },
        Zd: function () {
          return c.B;
        },
        $d: function () {
          return c.isLinear;
        },
        Ga: function () {
          r.generateMipmap(r.TEXTURE_2D);
        },
        fb: function (p, x) {
          va ? (p || (p = F.lb()), F.Ba(x), b(ka[p]), g[x] = -1) : F.b(x);
        },
        lb: function () {
          -1 === y && (y = Math.log(M) / Math.log(2));
          return y;
        },
        kb: function (p) {
          if (va) {
            p || (p = F.lb());
            v.set("s11");
            F.Ba(0);
            var x,
                P = M,
                oa = z;

            for (x = 1; x <= p; ++x) P /= 2, oa /= 2, v.I("u7", .25 / P, .25 / oa), r.viewport(0, 0, P, oa), b(ka[x - 1]), r.framebufferTexture2D(E.R(), r.COLOR_ATTACHMENT0, r.TEXTURE_2D, ka[x], 0), I.g(!1, 1 === x);

            g[0] = -1;
          } else F.Ga();
        },
        Ba: function (p) {
          p !== q && (r.activeTexture(m[p]), q = p);
        },
        b: function (p) {
          if (!T) return !1;
          F.Ba(p);
          if (g[p] === U) return !1;
          b(ca);
          g[p] = U;
          return !0;
        },
        eb: function (p) {
          r.activeTexture(m[p]);
          q = p;
          b(ca);
          g[p] = U;
        },
        j: function () {
          r.framebufferTexture2D(E.R(), r.COLOR_ATTACHMENT0, r.TEXTURE_2D, ca, 0);
        },
        u: function () {
          r.viewport(0, 0, M, z);
          r.framebufferTexture2D(E.R(), r.COLOR_ATTACHMENT0, r.TEXTURE_2D, ca, 0);
        },
        pe: function () {
          r.framebufferTexture2D(E.R(), r.COLOR_ATTACHMENT0, r.TEXTURE_2D, null, 0);
        },
        resize: function (p, x) {
          M = p;
          z = x;
          C();
        },
        clone: function (p) {
          p = W.a({
            width: M,
            height: z,
            B: c.B,
            isFloat: c.isFloat,
            isLinear: c.isLinear,
            M: c.M,
            isFlipY: p ? !qa : qa,
            isPot: c.isPot
          });
          Ga.set("s0");
          E.H();
          p.j();
          r.viewport(0, 0, M, z);
          F.b(0);
          I.g(!0, !0);
          return p;
        },
        md: function () {
          r.viewport(0, 0, M, z);
        },
        remove: function () {
          r.deleteTexture(ca);
          F = null;
        },
        refresh: function () {
          F.eb(0);
          qa && r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !0);
          O ? r.texImage2D(r.TEXTURE_2D, 0, da, ja, r.UNSIGNED_BYTE, c.v) : r.texImage2D(r.TEXTURE_2D, 0, da, M, z, 0, ja, la, S);
          qa && r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1);
        },
        hb: function () {
          var p = M * z * 4;
          ta = [new Uint8Array(p), new Uint8Array(p), new Uint8Array(p), new Uint8Array(p)];
          ha = [new Float32Array(ta[0].buffer), new Float32Array(ta[1].buffer), new Float32Array(ta[2].buffer), new Float32Array(ta[3].buffer)];
          Ca = new Uint8Array(4 * p);
          Aa = new Float32Array(Ca.buffer);
          R = !0;
        },
        Ra: function () {
          R || F.hb();
          r.readPixels(0, 0, M, 4 * z, r.RGBA, r.UNSIGNED_BYTE, Ca);
          var p,
              x = M * z,
              P = 2 * x,
              oa = 3 * x;

          for (p = 0; p < x; ++p) ha[0][p] = Aa[p], ha[1][p] = Aa[p + x], ha[2][p] = Aa[p + P], ha[3][p] = Aa[p + oa];

          return ha;
        },
        Ea: function () {
          E.D();
          v.set("s12");
          F.b(0);

          for (var p = 0; 4 > p; ++p) r.viewport(0, z * p, M, z), v.Nb("u8", w[p]), I.g(!1, 0 === p);
        },
        qe: function (p) {
          var x = la === u[0] && !k();
          b(ca);
          qa && r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, qa);
          x ? (aa || (X = document.createElement("canvas"), X.width = M, X.height = z, Y = X.getContext("2d"), ra = Y.createImageData(M, z), aa = !0), ra.data.set(p), Y.putImageData(ra, 0, 0), r.texImage2D(r.TEXTURE_2D, 0, da, ja, la, X)) : r.texImage2D(r.TEXTURE_2D, 0, da, M, z, 0, ja, la, p);
          g[q] = U;
          qa && r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1);
        },
        re: function (p, x) {
          b(ca);
          r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, x);
          r.texImage2D(r.TEXTURE_2D, 0, da, ja, la, p);
          g[q] = U;
          x && r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL, !1);
        },
        ee: function (p, x) {
          var P = M * z,
              oa = 4 * P;
          p = c.B ? p ? "RGBE" : "JSON" : "RGBA";
          x && (p = x);
          x = Ia.m() && !1;

          switch (p) {
            case "RGBE":
              var ea = "s41";
              break;

            case "JSON":
              ea = x ? "s0" : "s12";
              break;

            case "RGBA":
            case "RGBAARRAY":
              ea = "s6";
          }

          R || ("RGBA" === p || "RGBE" === p || "RGBAARRAY" === p ? (ta = new Uint8Array(oa), R = !0) : "JSON" !== p || x || F.hb());
          E.D();
          v.set(ea);
          F.b(0);

          if ("RGBA" === p || "RGBE" === p || "RGBAARRAY" === p) {
            r.viewport(0, 0, M, z);
            I.g(!0, !0);
            r.readPixels(0, 0, M, z, r.RGBA, r.UNSIGNED_BYTE, ta);
            if ("RGBAARRAY" === p) return {
              data: ta
            };
            L || (Q = document.createElement("canvas"), N = Q.getContext("2d"), L = !0);
            Q.width = M;
            Q.height = z;
            f = N.createImageData(M, z);
            f.data.set(ta);
            N.putImageData(f, 0, 0);
            var fa = Q.toDataURL("image/png");
          } else if ("JSON" === p) if (x) fa = new Float32Array(P), r.viewport(0, 0, M, z), I.g(!0, !0), r.readPixels(0, 0, M, z, r.RGBA, r.FLOAT, fa);else {
            for (fa = 0; 4 > fa; ++fa) r.viewport(0, z * fa, M, z), v.Nb("u8", w[fa]), I.g(!fa, !fa);

            F.Ra();
            fa = Array(P);

            for (ea = 0; ea < P; ++ea) fa[4 * ea] = ha[0][ea], fa[4 * ea + 1] = ha[1][ea], fa[4 * ea + 2] = ha[2][ea], fa[4 * ea + 3] = ha[3][ea];
          }

          return {
            format: p,
            data: fa,
            width: M,
            height: z,
            isMirrorY: c.M,
            isFlipY: "RGBA" === p ? c.isFlipY : !c.isFlipY
          };
        }
      };
      c.isMipmap && !va && T && !G && (F.Ga(), G = !0);
      if (c.url) b(ca), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, 1, 1, 0, r.RGBA, r.UNSIGNED_BYTE, null), na = new Image(), na.Ad = "Anonymous", na.crossOrigin = "Anonymous", na.src = c.url, na.onload = function () {
        M = na.width;
        z = na.height;
        C();
      };else if (c.v) {
        var ya = function () {
          M = void 0 !== c.v.videoWidth ? c.v.videoWidth : c.v.width;
          z = void 0 !== c.v.videoHeight ? c.v.videoHeight : c.v.height;
          M ? C() : setTimeout(ya, 1);
        };

        ya();
      } else c.array ? (c.B && !c.isFloat ? c.array instanceof Uint16Array ? (S = c.array, C()) : h() ? (S = e(c.array), C()) : (C(), W.wc(F, c.array, qa)) : (S = c.isFloat ? c.array instanceof Float32Array ? c.array : new Float32Array(c.array) : c.array instanceof Uint8Array ? c.array : new Uint8Array(c.array), C()), c.isKeepArray || (S && S !== c.array && (S = null), delete c.array)) : C();
      F.Fc = F.o;
      Z && T && (Z(F), Z = !1);
      return F;
    },
    D: function (c) {
      c !== q && (r.activeTexture(m[c]), q = c);
      g[c] = -1;
      b(null);
    },
    wd: function (c) {
      t.random.b(c);
    },
    reset: function () {
      for (var c = 0; c < m.length; ++c) g[c] = -1;

      q = -1;
    },
    de: function () {
      q = -1;
    },
    me: function () {
      for (var c = 0; c < m.length; ++c) W.D(c);
    },
    xc: function () {
      t && (t.random.remove(), t.Rb.remove());
    },
    oe: function (c, C) {
      if ("RGBA" === c.format || "RGBE" === c.format) {
        var J = new Image();
        J.src = c.data;

        J.onload = function () {
          W.a({
            M: c.isMirrorY,
            isFlipY: c.isFlipY,
            isFloat: !1,
            v: J,
            Da: function (O) {
              if ("RGBA" === c.format) C(O);else {
                var X = c.width,
                    Y = c.height,
                    aa = W.a({
                  M: c.isMirrorY,
                  isFloat: !0,
                  width: X,
                  height: Y,
                  isFlipY: c.isFlipY
                });
                E.H();
                r.viewport(0, 0, X, Y);
                v.set("s42");
                aa.j();
                O.b(0);
                I.g(!0, !0);
                W.D(0);
                C(aa);
                r.flush();
                setTimeout(O.remove, 50);
              }
            }
          });
        };
      } else "JSON" === c.format ? C(W.a({
        isFloat: !0,
        isFlipY: c.isFlipY,
        width: c.width,
        height: c.height,
        array: new Float32Array(c.data)
      })) : C(!1);
    }
  };
  return W;
}(),
    Ka = {
  a: function (b) {
    var d = [K.a(b), K.a(b)],
        e = [d[1], d[0]],
        h = e,
        k = {
      Lb: function (l) {
        h[1].j();
        h[0].b(l);
        k.Qb();
      },
      fe: function (l) {
        h[1].u();
        h[0].b(l);
        k.Qb();
      },
      Qb: function () {
        h = h === d ? e : d;
      },
      refresh: function () {
        h[0].refresh();
        h[1].refresh();
      },
      b: function (l) {
        h[0].b(l);
      },
      Ac: function () {
        return h[0];
      }
    };
    return k;
  }
},
    Ia = function () {
  function b() {
    d = "undefined" === typeof Ja ? JEContext : Ja;
    e = !0;
  }

  var d,
      e = !1,
      h = !1,
      k = !1,
      l = !1,
      q = !1,
      m = !1,
      n = !1,
      g = !1,
      t = !1,
      u = !1,
      B = !1,
      H = !0,
      D = !0,
      L = !0,
      Q = !1,
      N = "undefined" === typeof window ? {} : window,
      f = {
    i: function () {
      if (e) return !0;
      b();
      f.jb();
      f.Fa();
      f.sc();
      f.tc();
      E.i();
      K.i();
      if (!f.nc()) return !1;
      I.i();
      K.Ic();
      return !0;
    },
    o: function () {
      e || b();
      return d.o();
    },
    F: function () {
      e || b();
      return d.F();
    },
    m: function () {
      e || b();
      return d.m();
    },
    sc: function () {
      B = (u = r.getExtension("EXT_color_buffer_float") || r.getExtension("WEBGL_color_buffer_float") || r.getExtension("OES_color_buffer_float")) ? !0 : !1;
      N.GL_EXT_COLORBUFFERFLOAT = u;
    },
    tc: function () {
      r.getExtension("EXT_color_buffer_half_float") || r.getExtension("WEBGL_color_buffer_half_float") || r.getExtension("OES_color_buffer_half_float");
    },
    jb: function () {
      if (!h) {
        this.m() || (k = r.getExtension("OES_texture_float") || r.getExtension("MOZ_OES_texture_float") || r.getExtension("WEBKIT_OES_texture_float"), q = (N.GL_EXT_FLOAT = k) ? !0 : !1);
        if (q || this.m()) l = r.getExtension("OES_texture_float_linear") || r.getExtension("MOZ_OES_texture_float_linear") || r.getExtension("WEBKIT_OES_texture_float_linear"), N.GL_EXT_FLOATLINEAR = l;
        h = !0;
      }
    },
    Fa: function () {
      if (!t) {
        if (!this.m()) {
          if (m = r.getExtension("OES_texture_half_float") || r.getExtension("MOZ_OES_texture_half_float") || r.getExtension("WEBKIT_OES_texture_half_float")) Q = m.HALF_FLOAT_OES, n = !0;
          !Q && r.HALF_FLOAT && (Q = r.HALF_FLOAT);
          !Q && r.FLOAT && (Q = r.FLOAT);
          N.GL_EXT_HALFFLOAT = m;
        }

        if (n || this.m()) g = r.getExtension("OES_texture_half_float_linear") || r.getExtension("MOZ_OES_texture_half_float_linear") || r.getExtension("WEBKIT_OES_texture_half_float_linear"), N.GL_EXT_HALFFLOATLINEAR = g;
        t = !0;
      }
    },
    ma: function () {
      if (f.m()) return r.HALF_FLOAT;
      f.Fa();
      return n ? Q : r.FLOAT;
    },
    gb: function () {
      return H;
    },
    gc: function () {
      return D;
    },
    xd: function () {
      return L;
    },
    fc: function () {
      return B;
    },
    pc: function () {
      D = H = !0;
      var w = r.createFramebuffer();
      r.bindFramebuffer(r.FRAMEBUFFER, w);
      var A = r.createTexture();
      r.bindTexture(r.TEXTURE_2D, A);
      r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.NEAREST);
      r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.NEAREST);
      r.texImage2D(r.TEXTURE_2D, 0, f.m() && r.RGBA32F ? r.RGBA32F : r.RGBA, 1, 1, 0, r.RGBA, r.FLOAT, null);
      r.framebufferTexture2D(E.R(), r.COLOR_ATTACHMENT0, r.TEXTURE_2D, A, 0);
      var ba = r.checkFramebufferStatus(E.Ha());
      ba !== r.FRAMEBUFFER_COMPLETE && (H = !1);
      r.texImage2D(r.TEXTURE_2D, 0, f.m() && r.RGBA16F ? r.RGBA16F : r.RGBA, 1, 1, 0, r.RGBA, f.ma(), null);
      r.framebufferTexture2D(E.R(), r.COLOR_ATTACHMENT0, r.TEXTURE_2D, A, 0);
      ba = r.checkFramebufferStatus(E.Ha());
      ba !== r.FRAMEBUFFER_COMPLETE && (D = !1);
      r.bindTexture(r.TEXTURE_2D, null);
      r.bindFramebuffer(r.FRAMEBUFFER, null);
      r.deleteTexture(A);
      r.deleteFramebuffer(w);
    },
    oc: function () {
      var w = E.a({
        width: 1
      });
      w.Kb();
      var A = K.a({
        width: 1,
        isFloat: !0,
        aa: 3
      });
      w.j();
      A.j();
      r.flush();
      r.checkFramebufferStatus(E.Ha()) !== r.FRAMEBUFFER_COMPLETE ? (K.gd(), L = !1) : L = !0;
      w.remove();
      A.remove();
    },
    nc: function () {
      f.pc();
      if (!H && !D) return !1;
      f.oc();
      return !0;
    }
  };
  return f;
}(),
    Ha = function () {
  function b(D, L, Q, N) {
    r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, N ? r.NEAREST_MIPMAP_NEAREST : r.LINEAR);

    try {
      var f = r.getError();
      f !== r.NO_ERROR && console.log("GLERR in test_mipmapping() :", f);
      r.texImage2D(r.TEXTURE_2D, 0, D, 2, 2, 0, r.RGBA, L, Q);
      f = r.getError();
      if (f !== r.NO_ERROR) return !1;
    } catch (w) {
      return !1;
    }

    N && r.generateMipmap(r.TEXTURE_2D);
    I.Ca();
    I.g(!1, !0);
    r.readPixels(0, 0, 1, 1, r.RGBA, r.UNSIGNED_BYTE, m);
    f = r.getError();
    f === r.INVALID_OPERATION && "undefined" !== typeof r.PIXEL_PACK_BUFFER && (r.bindBuffer(r.PIXEL_PACK_BUFFER, null), r.readPixels(0, 0, 1, 1, r.RGBA, r.UNSIGNED_BYTE, m), f = r.getError());
    return f !== r.NO_ERROR ? !1 : 0 !== m[0];
  }

  function d(D) {
    return Ia.gb() && b(u, r.FLOAT, new Float32Array(g), D) ? (l = k.Ya, !0) : !1;
  }

  function e(D) {
    return Ia.gc() ? b(B, Ia.ma(), new Uint16Array(g), D) || b(B, r.FLOAT, new Float32Array(g), D) ? (l = k.xa, !0) : !1 : !1;
  }

  var h = !1,
      k = {
    Ya: 3,
    xa: 2,
    RGBA8: 0
  },
      l = k.RGBA8,
      q,
      m = new Uint8Array(4),
      n = [.8, 1, .8, 1],
      g = n.concat(n, n, n),
      t = !0,
      u,
      B,
      H = {
    i: function () {
      Ia.jb();
      Ia.Fa();
      B = u = r.RGBA;

      if (Ja.m()) {
        var D = r.RGBA32F;
        D && (u = D);
        (D = r.RGBA16F) && (B = D);
      }

      I.i();
      E.reset();
      E.D();
      r.viewport(0, 0, 1, 1);
      v.set("s0");
      h = !0;
      q = r.createTexture();
      r.activeTexture(r.TEXTURE0);
      r.bindTexture(r.TEXTURE_2D, q);
      r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.REPEAT);
      r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.REPEAT);
      r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.NEAREST);
      if (e(!0) || d(!0)) return !0;
      t = !1;
      if (e(!1) || d(!1)) return !0;

      if (Ja.m()) {
        B = u = r.RGBA;
        if (e(!0) || d(!0)) return !0;
        t = !1;
        if (e(!1) || d(!1)) return !0;
      }

      return !1;
    },
    hc: function () {
      return t;
    },
    Nd: function () {
      return l;
    },
    Yd: function () {
      h || H.i();
      return l === k.Ya;
    },
    Lc: function () {
      h || H.i();
      return l === k.xa;
    }
  };
  return H;
}(),
    La = {
  a: function (b) {
    var d = K.a(b.alpha),
        e = K.a(b.beta);
    return {
      rc: function () {
        d.b(1);
        e.b(2);
      }
    };
  }
},
    Oa = {
  a: function (b) {
    var d = b.od;
    d.index = b.index;
    d.N = b.N;
    d.parent = b.parent;

    switch (d.type) {
      case "input":
        b = Ma.a(d);
        break;

      default:
        b = Na.a(d);
    }

    return b;
  }
},
    Ma = {
  a: function (b) {
    "undefined" === typeof b.sift && (b.sift = !1);
    "undefined" === typeof b.DWT && (b.DWT = !1);
    "undefined" === typeof b.blur && (b.blur = !1);
    "undefined" === typeof b.siftOutWidth && (b.siftOutWidth = !1);
    "undefined" === typeof b.density && (b.density = 1);
    var d = !1;

    if (b.mask) {
      d = !0;
      a && void 0 !== a.ac && (b.mask = a.ac + b.mask);
      var e = K.a({
        isFloat: !1,
        url: b.mask
      });
    }

    var h = !1,
        k = "undefined" !== typeof b.preprocessing ? b.preprocessing : !1,
        l = !1,
        q = !1;
    b.sift ? Sift.i({
      Hc: r,
      ia: !1,
      width: b.size,
      ce: b.siftOutWidth
    }) : b.DWT && DWT.i({
      Hc: r,
      ia: !1,
      width: b.size
    });
    var m = !1;
    b.customInputShader && (m = "s43", v.$a({
      name: "_",
      id: m,
      c: b.customInputShader,
      f: ["uSource"],
      precision: "lowp"
    }), v.C(m, [{
      type: "1i",
      name: "_",
      value: 0
    }]));

    switch (k) {
      case "sobel":
        var n = "s32";
        l = !0;
        break;

      case "meanNormalization":
        n = "s33";
        l = !0;
        break;

      case "grayScale":
        n = "s29";
        l = !1;
        break;

      case "grayScaleTilt":
        n = "s30";
        q = !0;
        l = !1;
        break;

      case "rgbGrayTilt":
        n = "s31";
        q = !0;
        l = !1;
        break;

      case "copy":
        n = m ? m : "s0";
        break;

      case "inputLightRegulation":
        n = m ? m : "s29";
        Pa.i({
          width: b.size,
          zb: b.nBlurPass,
          Kc: !1
        });
        h = !0;
        break;

      case "direct":
      case "none":
        n = !1;
        break;

      default:
        n = "s3";
    }

    q && v.C(n, [{
      name: "u28",
      type: "1f",
      value: b.tilt
    }]);
    d && (n += "Mask");
    if (b.blur) var g = K.a({
      isFloat: !1,
      isPot: !1,
      width: b.size
    });
    var t = K.a({
      isFloat: !1,
      isPot: !1,
      width: b.size
    }),
        u = {
      o: function () {
        return b.sift ? Sift.$() : b.size;
      },
      $: function () {
        return u.o();
      },
      Dc: function () {
        return b.sift ? Sift.na() : b.DWT ? DWT.na() : h ? Pa.na() : t;
      },
      w: function () {
        E.H();
        b.blur && (g.u(), v.set("s44"), v.I("u7", 1 / b.size, 1 / b.size), I.g(!1, !0), g.b(0));
        n && (v.set(n), l && v.A("u29", 1 / b.size), t.u(), d && e.b(1), I.g(!1, !1), t.b(0), h ? Pa.Qa(t) : b.sift ? (v.U(), Sift.Qa()) : b.DWT && (v.U(), DWT.Qa(4)));
      }
    };
    return u;
  }
},
    Na = {
  a: function (b) {
    "undefined" === typeof b.disableNormalize && (b.disableNormalize = !1);
    var d = [],
        e = [],
        h,
        k,
        l = !1,
        q,
        m = !0,
        n,
        g,
        t = b.isReorganize ? b.isReorganize : !1,
        u = b.kernelsNumber ? !0 : !1,
        B = b.dynPelu ? La.a(b.dynPelu) : !1,
        H = B ? !0 : !1,
        D = {
      isEnabled: !1
    },
        L;

    if ("softmax" === b.type) {
      b.activation = "softmax";
      b.size = Math.pow(2, Math.ceil(Math.log2(Math.sqrt(b.num_classes))));
      b.sparsity = "undefined" !== typeof b.sparsity ? b.sparsity : b.N.$();
      b.gain = "undefined" !== typeof b.gain ? b.gain : 1;
      v.C("s20", [{
        type: "1f",
        name: "u10",
        value: b.gain
      }]);
      var Q = K.a({
        isFloat: !0,
        isPot: !1,
        width: b.size
      }),
          N = K.a({
        isFloat: !0,
        isPot: !1,
        width: b.size,
        isMipmap: !0
      });
      m = !1;
      var f = new Uint8Array(Math.pow(4 * b.size, 2)),
          w;

      for (w = 0; w < b.size * b.size; ++w) {
        var A = w < b.num_classes ? 255 : 0;
        f[4 * w] = A;
        f[4 * w + 1] = A;
        f[4 * w + 2] = A;
        f[4 * w + 3] = A;
      }

      var ba = K.a({
        isFloat: !1,
        isPot: !1,
        width: b.size,
        array: f
      });
    } else b.cost ? (b.sparsity = "undefined" !== typeof b.sparsity ? b.sparsity : b.N.$(), m = !1) : "full" === b.connectivityUp && (b.sparsity = b.N.$());

    var pa = {
      elu: "s15",
      elu01: "s16",
      relu: "s14",
      arctan: "s18",
      sigmoid: "s13",
      copy: "s0",
      softplus: "s19",
      softmax: "s20",
      dynPelu: "s17"
    }[b.activation],
        sa = b.sparsity * b.sparsity,
        ma = !1,
        W = b.size;

    if (b.maxPooling) {
      switch (b.maxPooling.size) {
        case 2:
          var c = "s34";
          break;

        case 4:
          c = "s35";
      }

      ma = !0;
      W /= b.maxPooling.size;
      var C = K.a({
        isFloat: !0,
        isPot: !1,
        width: W
      });
    }

    var J = void 0 !== b.Yc && b.Yc ? !0 : !1,
        O = null,
        X = null,
        Y = null;
    J && (O = "s45" + b.index.toString(), v.qb("s45", O, [((b.normalization.n - 1) / 2).toFixed(1)]), v.C(O, [{
      type: "1i",
      name: "u1",
      value: 0
    }, {
      type: "2f",
      name: "u7",
      value: [1 / b.size, 1 / b.size]
    }, {
      type: "1f",
      name: "u6",
      value: b.normalization.alpha
    }, {
      type: "1f",
      name: "u9",
      value: b.normalization.beta
    }, {
      type: "1f",
      name: "u33",
      value: b.normalization.k
    }]), X = K.a({
      isFloat: !0,
      isPot: !0,
      width: b.size
    }), Y = K.a({
      isFloat: !0,
      isPot: !0,
      width: b.size
    }));
    var aa, ra, ca, Z;
    m && (Z = K.a({
      isFloat: !0,
      isPot: !1,
      width: b.size
    }));
    var na = K.a(b.bias),
        S,
        M = {
      o: function () {
        return b.size;
      },
      $: function () {
        return W;
      },
      mb: function () {
        return b.num_classes;
      },
      dc: function (z) {
        L.b(z);
      },
      ad: function () {
        b.remap && b.remap.isEnabled && (D = {
          isEnabled: !0,
          Nc: K.a({
            isFloat: !1,
            isFlipY: !1,
            array: new Uint8Array(b.remap.maskTexture.data),
            width: b.remap.maskTexture.width,
            isPot: !1
          }),
          layers: b.remap.layers.map(function (z) {
            return b.parent.Bc(z);
          }),
          depth: b.remap.depth
        });
      },
      jd: function () {
        switch (b.connectivityUp) {
          case "gaussian":
            S = Qa.a(b.connectivity);
            break;

          case "direct":
            S = Ra.a(b.connectivity);
            break;

          case "square":
            S = Sa.a(b.connectivity);
            break;

          case "squareFast":
            S = Ta.a(b.connectivity, b.activation);
            break;

          case "full":
            S = Ua.a(b.connectivity);
            break;

          case "conv":
            g = b.kernelsNumber, S = Va.a(b.connectivity), t && (n = K.a({
              width: W,
              isFloat: !0,
              isFlipY: !1,
              isPot: !1
            }));
        }

        if (S.O) {
          var z = b.size * b.sparsity;
          ra = Math.log(z / b.size) / Math.log(2);
          aa = K.a({
            isMipmap: !0,
            isFloat: !0,
            isPot: !0,
            width: z,
            xb: ra
          });
          ca = K.a({
            isFloat: !0,
            isPot: !0,
            width: b.size
          });
        }
      },
      w: function (z, T) {
        L = z;
        S.O ? (aa.u(), u && na.b(2), S.w(D), aa.b(0), aa.kb(ra), ca.u(), u ? v.set("s0") : (v.set("s28"), v.A("u27", sa), na.b(1)), aa.fb(ra, 0), I.g(!1, !1), v.set(pa), J ? X.j() : Z.j(), ca.b(0), H && B.rc(), I.g(!1, !1)) : (Z.u(), na.b(1), S.w());
        J && (v.set(O), Y.j(), X.b(0), I.g(!1, !1), v.set("s46"), v.A("u6", 1), Z.j(), Y.b(1), I.g(!1, !1));
        if (m) return ma ? (C.u(), Z.b(0), v.set(c), v.I("u7", 1 / b.size, 1 / b.size), I.g(!1, !1), T = C) : T = Z, T.b(0), t && (n.j(), v.set("s22"), v.I("u14", g, W / g), I.g(!1, !1), T = n, n.b(0)), T;

        if ("softmax" === b.type) {
          v.set("s20");
          Z.b(0);
          Q.j();
          I.g(!1, !1);
          b.disableNormalize ? z = Q : (v.set("s2"), Q.b(0), ba.b(1), N.j(), I.g(!1, !1), v.set("s0"), k.u(), N.b(0), N.kb(!1), I.g(!1, !1), v.set("s21"), h.u(), N.fb(!1, 0), v.A("u12", Z.Fc()), k.b(1), I.g(!1, !1), z = h);

          if (T) {
            switch (l) {
              case "cpuRGBAAvg":
                break;

              default:
                var U = M.Eb(z);
            }

            return U;
          }

          return !1;
        }

        if (b.cost) {
          v.set("gpuRawAvg" === l ? "s8" : "s7");
          T = Z;
          b.disableNormalize || (v.A("u4", 1 / b.size), h.u(), Z.b(0), I.g(!1, !1), T = h);

          switch (l) {
            case "cpuRGBA2Float":
              T.Ea();
              U = M.Eb(T);
              q(U);
              break;

            case "gpuRawAvg":
            case "gpuRaw":
              T.b(0), q(T);
          }

          return !1;
        }
      },
      kc: function (z) {
        z && "undefined" !== typeof z.Db && (l = z.Db, q = z.$c);
        Z = K.a({
          isFloat: !0,
          isPot: !0,
          isMipmap: "softmax" === b.type,
          width: b.size
        });
        "softmax" === b.type && (k = K.a({
          isFloat: !0,
          isPot: !0,
          width: 1
        }));
        var T = 0,
            U = 0,
            R = "undefined" !== typeof b.num_classes && b.num_classes ? b.num_classes : b.size * b.size;

        for (z = 0; z < R; ++z) d.push(T + (b.size - 1 - U) * b.size), e.push([-1, -1, -1, -1]), ++T, T === b.size && (T = 0, ++U);

        b.disableNormalize || (h = K.a({
          isFloat: !0,
          isPot: !0,
          width: b.size
        }));
      },
      Eb: function (z) {
        z.Ea();
        var T = z.Ra();
        d.forEach(function (U, R) {
          e[R][0] = T[0][U];
          e[R][1] = T[1][U];
          e[R][2] = T[2][U];
          e[R][3] = T[3][U];
        });
        return e;
      }
    };
    b.N && M.jd(b.N);
    return M;
  }
};

function Wa() {
  var b = {},
      d,
      e,
      h;
  b || (b = {});

  this.Bc = function (k) {
    return d[k];
  };

  this.fd = function (k) {
    var l = !1;
    d = k.map(function (q, m) {
      return l = q = Oa.a({
        index: m,
        parent: this,
        od: q,
        N: l
      });
    });
    e = d[0];
    h = d[d.length - 1];
    d.forEach(function (q, m) {
      0 !== m && q.ad();
    });
  };

  this.w = function (k, l) {
    var q = l;
    d.forEach(function (m) {
      q = m.w(q, k);
    });
    return q;
  };

  this.zc = function () {
    return e.o();
  };

  this.Ec = function () {
    return h.o();
  };

  this.na = function () {
    return h.Dc();
  };

  this.hd = function (k) {
    h.kc(k);
  };

  this.mb = function () {
    return h.mb();
  };
}

var Ra = {
  a: function (b) {
    var d = K.a(b.weights);
    delete b.weights.data;
    return {
      O: !0,
      Z: function () {
        return 1;
      },
      Gc: function () {
        return d;
      },
      w: function () {
        v.set("s27");
        d.b(1);
        I.g(!1, !1);
      }
    };
  }
},
    Ua = {
  a: function (b) {
    var d = b.fromLayerSize,
        e = K.a(b.weights);
    return {
      O: !0,
      Z: function () {
        return d;
      },
      w: function (h) {
        if (h.isEnabled) {
          v.set("s25");
          h.Nc.b(3);
          var k,
              l = Math.min(h.layers.length, h.depth);

          for (k = 0; k < l; ++k) h.layers[k].dc(4 + k);
        } else v.set("s24");

        v.A("u18", b.toLayerSize);
        e.b(1);
        I.g(!1, !1);
      }
    };
  }
},
    Qa = {
  a: function (b) {
    var d = b.toSparsity * b.toLayerSize,
        e = d / b.fromLayerSize,
        h = K.a(b.weights);
    K.a({
      width: d,
      isFloat: !0,
      array: new Float32Array(b.fromBindings),
      isPot: !0
    });
    var k = K.a({
      width: d,
      isFloat: !0,
      array: new Float32Array(b.toBindings),
      isPot: !0
    });
    return {
      O: !0,
      Z: function () {
        return e;
      },
      w: function () {
        v.set("s23");
        h.b(1);
        k.b(2);
        I.g(!1, !0);
      }
    };
  }
},
    Sa = {
  a: function (b) {
    var d = b.fromLayerSize,
        e = b.toLayerSize,
        h = b.toSparsity,
        k = h * e,
        l = k / d,
        q = d / e,
        m,
        n,
        g,
        t,
        u = 0,
        B = 0,
        H = 0,
        D = Array(h * e * h * e * 4),
        L = Array(h * e * h * e * 4),
        Q = Array(d * d);

    for (m = 0; m < Q.length; ++m) Q[m] = 0;

    var N = Math.floor(h / 2),
        f = .5 / e,
        w = .5 / d,
        A = .5 / k;

    for (m = 0; m < e; ++m) for (n = 0; n < e; ++n) {
      var ba = Math.round(m * q);
      var pa = Math.round(n * q);
      var sa = m / e;
      var ma = n / e;
      sa += f;
      ma += f;

      for (g = 0; g < h; ++g) for (t = 0; t < h; ++t) {
        var W = u / k;
        var c = B / k;
        var C = ba + g - N;
        var J = pa + t - N;
        0 > C && (C += d);
        0 > J && (J += d);
        C >= d && (C -= d);
        J >= d && (J -= d);
        var O = C / d;
        var X = J / d;
        c = 1 - c - 1 / k;
        O += w;
        X += w;
        W += A;
        c += A;
        var Y = m * h + g,
            aa = n * h + t;
        aa = e * h - aa - 1;
        Y = aa * e * h + Y;
        D[4 * Y] = W;
        D[4 * Y + 1] = c;
        D[4 * Y + 2] = O;
        D[4 * Y + 3] = X;
        O = Q[J * d + C]++;
        X = O % l;
        C = C * l + X;
        J = J * l + (O - X) / l;
        J = d * l - 1 - J;
        J = J * d * l + C;
        L[4 * J] = W;
        L[4 * J + 1] = c;
        L[4 * J + 2] = sa;
        L[4 * J + 3] = ma;
        ++u >= k && (u = 0, ++B);
        ++H;
      }
    }

    var ra = K.a(b.weights);
    K.a({
      width: k,
      isFloat: !0,
      array: new Float32Array(L),
      isPot: !0
    });
    L = null;
    var ca = K.a({
      width: k,
      isFloat: !0,
      array: new Float32Array(D),
      isPot: !0
    });
    D = null;
    return {
      O: !0,
      Z: function () {
        return l;
      },
      w: function () {
        v.set("s23");
        ra.b(1);
        ca.b(2);
        I.g(!1, !1);
      }
    };
  }
},
    Va = {
  a: function (b) {
    var d = b.kernelsNumber,
        e = b.toSparsity,
        h = e * b.toLayerSize / b.fromLayerSize,
        k = K.a(b.weights);
    return {
      O: !0,
      Z: function () {
        return h;
      },
      Rd: function () {
        return e;
      },
      Gc: function () {
        return k;
      },
      w: function () {
        v.set("s26");
        v.A("u24", d);
        v.A("u25", e);
        v.A("u18", b.toLayerSize);
        v.A("u26", b.fromLayerSize);
        k.b(1);
        I.g(!1, !1);
      }
    };
  }
},
    Ta = {
  a: function (b, d) {
    var e = b.fromLayerSize,
        h = b.toLayerSize,
        k = b.toSparsity,
        l = b.stride ? b.stride : 1,
        q = k * h / e,
        m = h < e,
        n = e / h,
        g = K.a(b.weights),
        t = "s47" + [e.toString(), h.toString(), k.toString(), l.toString(), d].join("_");
    v.uc(t) || (b = Da(d), h = [{
      type: "1f",
      name: "u18",
      value: h
    }, {
      type: "1f",
      name: "u32",
      value: l
    }], m && h.push({
      type: "1f",
      name: "u26",
      value: e
    }), e = [(m ? q : k).toFixed(1), b], m && e.push(n.toFixed(1)), v.qb(m ? "s40" : "s39", t, e), v.C(t, h.concat([{
      type: "1i",
      name: "u16",
      value: 0
    }, {
      type: "1i",
      name: "u23",
      value: 1
    }, {
      type: "1i",
      name: "u15",
      value: 3
    }])));
    return {
      O: !1,
      Z: function () {
        return q;
      },
      w: function () {
        v.set(t);
        g.b(3);
        I.g(!1, !1);
      }
    };
  }
},
    Pa = function () {
  var b, d, e, h, k, l, q, m, n;
  return {
    i: function (g) {
      b = g.zb ? g.zb : 3;
      d = g.width ? g.width : 64;
      h = g.Kc ? !0 : !1;
      g = {
        isFloat: !1,
        width: d,
        isPot: !1,
        isFlipY: !1
      };
      k = K.a(g);
      l = K.a(g);
      q = K.a(g);
      m = K.a(g);
      n = K.a({
        isFloat: !0,
        width: d,
        isPot: !1,
        isFlipY: !1
      });
      e = 1 / d;
    },
    Qa: function (g) {
      v.set("s37");

      for (var t = 0; t < b; ++t) k.j(), v.I("u7", e, 0), I.g(h, !1), l.j(), k.b(0), v.I("u7", 0, e), I.g(h, !1), l.b(0);

      v.set("s36");
      m.j();
      g.b(0);
      I.g(h);
      v.set("s37");

      for (t = 0; t < b; ++t) q.j(), m.b(0), v.I("u7", e, 0), I.g(h, !1), m.j(), q.b(0), v.I("u7", 0, e), I.g(h, !1);

      v.set("s38");
      n.j();
      g.b(0);
      l.b(1);
      m.b(2);
      I.g(h, !1);
      n.b(0);
    },
    na: function () {
      return n;
    }
  };
}();

function Xa(b, d) {
  b[d] = !0;
  b.setAttribute(d, "true");
}

function Ya() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function Za() {
  var b = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
  return [parseInt(b[1], 10), parseInt(b[2], 10), parseInt(b[3] || 0, 10)];
}

function $a() {
  var b = navigator.userAgent.toLowerCase();
  return -1 !== b.indexOf("safari") && -1 === b.indexOf("chrome") ? !0 : !1;
}

function ab() {
  return navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? !0 : !1;
}

function bb(b) {
  if (!b) return b;
  var d = !1;

  if (b.video) {
    var e = function (h) {
      var k = {};
      "undefined" !== typeof h.min && (k.min = h.min);
      "undefined" !== typeof h.max && (k.max = h.max);
      "undefined" !== typeof h.ideal && (k.ideal = h.ideal);
      return k;
    };

    d = {};
    "undefined" !== typeof b.video.width && (d.width = e(b.video.width));
    "undefined" !== typeof b.video.height && (d.height = e(b.video.height));
    "undefined" !== typeof b.video.facingMode && (d.facingMode = b.video.facingMode);
  }

  d = {
    audio: b.audio,
    video: d
  };
  "undefined" !== typeof b.deviceId && (d.deviceId = b.deviceId);
  return d;
}

function cb(b) {
  var d = b.video.width;
  b.video.width = b.video.height;
  b.video.height = d;
  return b;
}

function db(b) {
  function d(u) {
    return [480, 576, 640, 648, 720, 768, 800, 960, 1080, 1152, 1280, 1366, 1920].sort(function (B, H) {
      return Math.abs(B - u) - Math.abs(H - u);
    });
  }

  function e(u) {
    var B = bb(b);
    h.push(u(B));
  }

  var h = [];
  if (!b || !b.video) return h;

  if (b.video.width && b.video.height) {
    if (b.video.width.ideal && b.video.height.ideal) {
      var k = d(b.video.width.ideal).slice(0, 3),
          l = d(b.video.height.ideal).slice(0, 3),
          q = {},
          m = 0;

      for (q.K = void 0; m < k.length; q = {
        K: q.K
      }, ++m) {
        q.K = k[m];
        var n = {},
            g = 0;

        for (n.J = void 0; g < l.length; n = {
          J: n.J
        }, ++g) if (n.J = l[g], q.K !== b.video.width.ideal || n.J !== b.video.height.ideal) {
          var t = Math.max(q.K, n.J) / Math.min(q.K, n.J);
          t < 4 / 3 - .1 || t > 16 / 9 + .1 || e(function (u, B) {
            return function (H) {
              H.video.width.ideal = u.K;
              H.video.height.ideal = B.J;
              return H;
            };
          }(q, n));
        }
      }
    }

    e(function (u) {
      return cb(u);
    });
  }

  b.video.width && b.video.height && (b.video.width.ideal && b.video.height.ideal && e(function (u) {
    delete u.video.width.ideal;
    delete u.video.height.ideal;
    return u;
  }), e(function (u) {
    delete u.video.width;
    delete u.video.height;
    return u;
  }));
  b.video.facingMode && (e(function (u) {
    delete u.video.facingMode;
    return u;
  }), b.video.width && b.video.height && e(function (u) {
    cb(u);
    delete u.video.facingMode;
    return u;
  }));
  h.push({
    audio: b.audio,
    video: !0
  });
  return h;
}

function eb(b) {
  try {
    var d = window.matchMedia("(orientation: portrait)").matches ? !0 : !1;
  } catch (h) {
    d = window.innerHeight > window.innerWidth;
  }

  if (d && b && b.video) {
    d = b.video.width;
    var e = b.video.height;
    d && e && d.ideal && e.ideal && d.ideal > e.ideal && (b.video.height = d, b.video.width = e);
  }
}

function fb(b) {
  b.volume = 0;
  Xa(b, "muted");

  if ($a()) {
    if (1 === b.volume) {
      var d = function () {
        b.volume = 0;
        window.removeEventListener("mousemove", d, !1);
        window.removeEventListener("touchstart", d, !1);
      };

      window.addEventListener("mousemove", d, !1);
      window.addEventListener("touchstart", d, !1);
    }

    setTimeout(function () {
      b.volume = 0;
      Xa(b, "muted");
    }, 5);
  }
}

function gb(b, d, e, h) {
  function k(q) {
    l || (l = !0, e(q));
  }

  var l = !1;
  navigator.mediaDevices.getUserMedia(h).then(function (q) {
    function m() {
      setTimeout(function () {
        if (b.currentTime) {
          var n = b.videoWidth,
              g = b.videoHeight;
          if (0 === n || 0 === g) k("VIDEO_NULLSIZE");else {
            n && (b.style.width = n.toString() + "px");
            g && (b.style.height = g.toString() + "px");
            n = {
              ic: null,
              nd: null,
              Qc: null
            };

            try {
              var t = q.getVideoTracks()[0];
              t && (n.Qc = t, n.ic = t.getCapabilities(), n.nd = t.getSettings());
            } catch (u) {}

            $a() || Ya() ? b.parentNode && null !== b.parentNode ? (l || d(b, q, n), setTimeout(function () {
              b.play();
            }, 100)) : (document.body.appendChild(b), fb(b), l || d(b, q, n), setTimeout(function () {
              b.style.transform = "scale(0.0001,0.0001)";
              b.style.position = "fixed";
              b.style.bottom = "0px";
              b.style.right = "0px";
              fb(b);
              setTimeout(function () {
                b.play();
              }, 100);
            }, 80)) : l || d(b, q, n);
          }
        } else k("VIDEO_NOTSTARTED");
      }, 700);
    }

    "undefined" !== typeof b.srcObject ? b.srcObject = q : (b.src = window.URL.createObjectURL(q), b.videoStream = q);
    fb(b);
    b.addEventListener("loadeddata", function () {
      var n = b.play();
      fb(b);
      "undefined" === typeof n ? m() : n.then(function () {
        m();
      }).catch(function () {
        k("VIDEO_PLAYPROMISEREJECTED");
      });
    }, !1);
  }).catch(function (q) {
    k(q);
  });
}

function hb(b, d, e) {
  var h = ab() ? document.createElement("video") : !1;
  if (h) {
    if (ab()) {
      if (e && e.video) {
        if (Ya()) {
          var k = Za();
          (12 > k[0] || 12 === k[0] && 2 > k[1]) && eb(e);
        }

        e.video.width && e.video.width.ideal && (h.style.width = e.video.width.ideal + "px");
        e.video.height && e.video.height.ideal && (h.style.height = e.video.height.ideal + "px");
      }

      Xa(h, "autoplay");
      Xa(h, "playsinline");
      e && e.audio ? h.volume = 0 : Xa(h, "muted");
      gb(h, b, function () {
        function l(m) {
          if (0 === m.length) d("INVALID_FALLBACKCONSTRAINTS");else {
            var n = m.shift();
            gb(h, b, function () {
              l(m);
            }, n);
          }
        }

        var q = db(e);
        l(q);
      }, e);
    } else d && d("MEDIASTREAMAPI_NOTFOUND");
  } else d && d("VIDEO_NOTPROVIDED");
}

var ib = function () {
  var b = 0,
      d,
      e,
      h,
      k;
  return {
    i: function (l, q) {
      b = l.length;
      d = q;
      e = l;
      h = new Float32Array(b);
      k = new Float32Array(b);
    },
    Cc: function () {
      return k;
    },
    pd: function (l, q, m) {
      l.forEach(function (n, g) {
        var t = Math.min(1, e[g] * m * (q + .33 * (1 - q)));
        n = t * n + (1 - t) * h[g];
        h[g] = n;
        k[g] = d[g](n);
      });
    }
  };
}(),
    V = {
  V: [],
  za: !1,
  Aa: !1,
  ya: !1,
  Za: !1,
  ea: !0,
  da: !1,
  ready: !1,
  initialized: !1
},
    jb = {
  facingMode: "user",
  idealWidth: 320,
  idealHeight: 240,
  minWidth: 240,
  maxWidth: 1280,
  minHeight: 240,
  maxHeight: 1280
},
    a = {
  save: "built/jeefacetransferNNC.json",
  Wa: "../../",
  Zb: 0,
  width: 512,
  height: 512,
  Rc: .25,
  Oc: .7,
  Vc: 3,
  borderWidth: .4,
  Y: .35,
  Wc: 5,
  Xc: 3,
  Ua: [.06, .08, .15],
  qd: 55,
  Sc: .6,
  Pc: 5.8,
  Vb: .75,
  Ub: 1,
  ab: [.03, 1],
  td: 20,
  ga_: .2,
  P: [30, 55],
  Xa: 3,
  bc: 1 / 3.5,
  Cb: 11,
  yb: 1,
  Tc: 1,
  bb: [.1, .01],
  cd: [.4, -.7, -.4],
  dd: [.3, 0, 0],
  Jb: [5, 7],
  qc: !1,
  T: [0, 7],
  $b: .001,
  cb: [Math.PI / 10, Math.PI / 6],
  Fb: [0, 6],
  Gb: [.1, .4],
  Hb: [.009, .02],
  Ib: [.02, .04],
  Oa: 8,
  pb: [3, 7],
  ob: .05,
  Yb: [.2, .2, .15, .15, .15, .15, .2, .2, .15, .15, .2],
  Uc: [xa.bind(null, .05, .7), xa.bind(null, .05, .7), xa.bind(null, 0, .4), xa.bind(null, 0, .4), xa.bind(null, 0, .6), xa.bind(null, 0, .6), za.bind(null, .1, .6), xa.bind(null, .1, .4), Ba.bind(null, .68, .77, 2), Ba.bind(null, .68, .77, 2), xa.bind(null, .15, .5)]
};

V.get_nMorphs = function () {
  return a.Cb;
};

var kb = !1,
    lb = !1;

function mb() {
  var b, d, e, h, k, l, q, m, n, g, t;

  function u() {
    1 === ++M && (ib.i(a.Yb, a.Uc), B(), V.ready = !0, V.V.forEach(function (y) {
      y();
    }), V.V.splice(0, V.V.length), H(), M = 0);
  }

  function B() {
    O = ua();
    X = new Uint8Array(sa * sa * 4);

    V.get_morphTargetInfluences = function () {
      return O;
    };

    V.get_morphTargetInfluencesStabilized = function () {
      return ib.Cc();
    };

    V.set_morphUpdateCallback = function (y) {
      Y = y;
    };

    V.get_rotation = function () {
      return ra;
    };

    V.get_positionScale = function () {
      var y = C.Pb.Ac();
      y.Ea();
      y = y.Ra();
      na[0] = 1 - y[1][0];
      na[1] = y[2][0];
      na[2] = y[3][0] * ma[0];
      return na;
    };

    V.get_rotationStabilized = function () {
      return Z;
    };

    V.switch_sleep = function (y) {
      T !== z.ua || y ? T = y ? z.ua : z.ka : H();
    };

    V.on_detect = function (y) {
      y(U.G);
      U.Pa.push(y);
    };

    V.is_detected = function () {
      return U.G;
    };

    V.set_animateDelay = function (y) {
      w = y;
    };
  }

  function H() {
    T !== z.ka && (T = z.ka, R.timestamp = Date.now(), A && window.clearTimeout(A), ba && window.cancelAnimationFrame(ba), L());
  }

  function D() {
    T !== z.ua && (A = setTimeout(L, w));
  }

  function L() {
    a: {
      if ("VIDEO" === S.element.nodeName) {
        var y = S.element.currentTime - va;
        0 > y && (va = S.element.currentTime);
        if (1E3 * y < a.td) break a;
        va += y;
      }

      S.ba.refresh();
      y = ka.nb();
      y[0] === S.ja[0] && y[1] === S.ja[1] || ka.Sb();
      v.set("s49");
      E.H();
      C.Ka.u();
      S.ba.b(0);
      I.g(!1, !0);
    }

    y = T === z.ka ? R.ra : 1;

    for (var G = 0; G < y; ++G) {
      var F = C,
          ya = pa;
      v.set("s50");
      E.H();
      F.oa.u();
      F.Ka.b(0);
      F.va.b(1);
      I.g(!1, !1);
      F.oa.b(0);
      ya.w(!1, F.oa);
    }

    V.ea && (E.rd(), v.set("s5"), C.Ka.b(0), I.g(!1, !1), r.enable(r.BLEND), r.blendFunc(r.SRC_ALPHA, r.ONE), J.b(0), I.g(!1, !1), r.disable(r.BLEND));
    r.flush();
    G = Date.now();
    F = G - R.timestamp;
    R.timestamp = G;
    R.Ab = y / F;
    R.Na = R.Ab * a.ga_ + R.Na * (1 - a.ga_);
    R.Bb = 1E3 / F;
    R.S = R.Bb * a.ga_ + R.S * (1 - a.ga_);
    R.S > a.P[1] ? (++R.ra, R.S = (a.P[0] + a.P[1]) / 2) : R.S < a.P[0] && (R.ra = Math.max(R.ra - 1, a.Xa), R.S = (a.P[0] + a.P[1]) / 2);
    R.ha = a.bc / Math.max(R.Na, .001);
    T !== z.ua && (ba = window.requestAnimationFrame(D));
  }

  var Q,
      N,
      f = 64,
      w = a.Zb,
      A = !1,
      ba = !1,
      pa,
      sa,
      ma,
      W,
      c,
      C = {},
      J,
      O = !1,
      X,
      Y = !1,
      aa = [0, 0, 0],
      ra = [0, 0, 0],
      ca = [0, 0, 0],
      Z = [0, 0, 0],
      na = [0, 0, 0],
      S = {
    element: null,
    ba: null,
    ja: [-1, -1]
  },
      M = 0,
      z = {
    Mc: -2,
    ua: -1,
    ka: 0
  },
      T = z.Mc,
      U = {
    qa: 0,
    G: !1,
    Pa: []
  },
      R = {
    timestamp: 0,
    Ab: 0,
    Na: 0,
    ra: a.Xa,
    Bb: 0,
    S: 0,
    ha: 1
  },
      ha = 1,
      ta = 1,
      Ca = 1,
      Aa = 1,
      da = [0, 0, 0],
      ja = Date.now(),
      la = new Float32Array(a.Oa),
      qa = 0,
      va = 0,
      ka = {
    rb: function () {
      Q = a.width;
      N = a.height;
      W = a.Rc;
      c = a.Oc;
      var y = Q / f;
      W *= y;
      c *= y;
      k = (1 - 2 * a.borderWidth) / a.Wc;
      l = (1 - 2 * a.Y) / a.Xc;
      q = (c - W) / a.Vc;
      m = a.borderWidth;
      n = a.Y;
      g = 1 - a.borderWidth;
      t = 1 - a.Y;
      b = 0;
      d = a.borderWidth;
      e = a.Y;
      h = W;
      ma = [f / Q, f / N];
    },
    Ob: function () {
      v.C("s50", [{
        type: "1i",
        name: "u1",
        value: 0
      }, {
        type: "1i",
        name: "u34",
        value: 1
      }, {
        type: "2f",
        name: "u35",
        value: ma
      }]);
      v.C("s51", [{
        type: "1i",
        name: "u34",
        value: 0
      }, {
        type: "2f",
        name: "u35",
        value: ma
      }, {
        type: "3f",
        name: "u36",
        value: [0, .5, 1]
      }]);
      v.C("s52", [{
        type: "1i",
        name: "u37",
        value: 0
      }, {
        type: "1i",
        name: "u34",
        value: 1
      }, {
        type: "1f",
        name: "u38",
        value: a.Sc
      }, {
        type: "1f",
        name: "u39",
        value: a.Pc
      }, {
        type: "1f",
        name: "u40",
        value: a.qd
      }, {
        type: "1f",
        name: "u41",
        value: a.Vb
      }, {
        type: "1f",
        name: "u42",
        value: a.Ub
      }, {
        type: "1f",
        name: "u43",
        value: ma[0]
      }]);
      v.C("s53", [{
        type: "1i",
        name: "u1",
        value: 0
      }, {
        type: "1i",
        name: "u5",
        value: 1
      }, {
        type: "1f",
        name: "u44",
        value: a.ab[0]
      }, {
        type: "1f",
        name: "u45",
        value: a.ab[1]
      }]);
    },
    lc: function () {
      v.Xb([{
        id: "s49",
        name: "_",
        ca: "attribute vec2 a0;uniform vec2 u46,u47;varying vec2 vv0;void main(){gl_Position=vec4(a0,0.,1.),vv0=u47+u46*a0;}",
        fa: ["a0"],
        W: [2],
        c: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
        f: ["u1", "u46", "u47"],
        precision: "lowp"
      }, {
        id: "s50",
        name: "_",
        c: "uniform sampler2D u1;varying vec2 vv0;void main(){gl_FragColor=texture2D(u1,vv0);}",
        ca: "attribute vec2 a0;uniform sampler2D u34;uniform vec2 u35;const vec2 f=vec2(.25,.5),h=vec2(.75,.5),e=vec2(.5,.5);varying vec2 vv0;void main(){vec4 a=texture2D(u34,f);vec2 b=a.gb,c=a.a*u35,d=a0*.5+e;vv0=b+(d-e)*c,gl_Position=vec4(a0,0.,1.);}",
        fa: ["a0"],
        W: [2],
        f: ["u1", "u34", "u35"],
        precision: "lowp"
      }, {
        id: "s52",
        name: "_",
        ca: "attribute vec2 a0;void main(){gl_Position=vec4(a0,0.,1.);}",
        c: "uniform sampler2D u37,u34;uniform vec3 u48,u49;uniform float u38,u39,u40,u41,u42,u43,u50;varying vec2 vv0;const vec4 e=vec4(.25,.25,.25,.25);void main(){vec4 g=texture2D(u37,vec2(.4375,.9375)),h=texture2D(u37,vec2(.5625,.9375)),a=texture2D(u34,vec2(.5,.5));float c=dot(g,e),i=dot(h,e);bool d=c>u41&&c>i+u42;d?a.r=2.:a.r>u40?a.r=0.:a.r>1.9&&(a.a>u39||a.a<u38)?a.r=0.:a.r>1.9?a.r+=1.:0.;if(a.r<.9)a.gba=u48,a.r=1.;else{float j=dot(e,texture2D(u37,vec2(.0625,.9375))),k=dot(e,texture2D(u37,vec2(.1875,.9375))),l=dot(e,texture2D(u37,vec2(.3125,.9375))),b;if(a.r>1.9)b=1.-u50;else b=1.,a.r=0.;float f=a.a*u43;a.gba+=vec3(j,k,l)*u49*b*f;}gl_FragColor=a;}",
        f: "u37 u34 u48 u38 u39 u40 u41 u42 u49 u43 u50".split(" ")
      }, {
        id: "s51",
        name: "_",
        c: "uniform sampler2D u34;uniform vec3 u36;uniform vec2 u35;varying vec2 vv0;const vec2 i=vec2(1.,1.);void main(){vec4 g=texture2D(u34,vec2(.25,.5));vec2 h=g.gb;float j=g.a;vec2 a=j*u35,c=h+a,d=h;d-=a/2.,c-=a/2.;vec2 k=.5*(d+c),f=step(d,vv0)*step(vv0,c);float l=f.x*f.y;vec2 b=2.*abs(k-vv0)/a;b=pow(b,3.*i),gl_FragColor=vec4(l*u36*max(b.x,b.y),1.);}",
        f: ["u34", "u35", "u36"],
        precision: "lowp"
      }, {
        id: "s53",
        name: "_",
        c: "uniform sampler2D u1,u5;uniform float u44,u45,u50;const vec4 f=vec4(1.,1.,1.,1.);varying vec2 vv0;void main(){vec4 a=texture2D(u1,vv0),b=texture2D(u5,vv0);float c=(1.-u50)*(u45-u44)+u44;gl_FragColor=mix(b,a,c*f);}",
        f: ["u1", "u5", "u44", "u45", "u50"]
      }]);
    },
    Jc: function (y) {
      var G = new Float32Array([0, a.borderWidth, a.Y, 0]);
      y.Ka = K.a({
        isPot: !1,
        be: !0,
        isFloat: !1,
        width: Q,
        height: N
      });
      y.oa = K.a({
        isPot: !0,
        isFloat: !1,
        width: f
      });
      G = {
        width: 1,
        height: 1,
        isFloat: !0,
        isPot: !1,
        array: G
      };
      y.va = Ka.a(G);
      y.Pb = Ka.a(G);
    },
    mc: function () {
      S.ba = K.a({
        v: S.element,
        isPot: !1,
        isFloat: !1,
        isFlipY: !0
      });
      J = K.a({
        isPot: !1,
        isFloat: !1,
        width: Q,
        height: N
      });
    },
    i: function () {
      function y() {
        var p = G(a.pb[0], a.pb[1]);
        U.qa = a.ob * p + (1 - a.ob) * U.qa;
        .6 < U.qa && !U.G ? (U.Pa.forEach(function (x) {
          x(!0);
        }), U.G = !0) : .4 > U.qa && U.G && (U.Pa.forEach(function (x) {
          x(!1);
        }), U.G = !1);
      }

      function G(p, x) {
        p += sa * x;
        return (X[4 * p] + X[4 * p + 1] + X[4 * p + 2] + X[4 * p + 3]) / 1020;
      }

      function F() {
        O.forEach(function (p, x) {
          if (U.G) {
            p = (a.yb + x) % sa;
            var P = a.Tc + Math.floor((a.yb + x) / sa);
            P = sa - 1 - P;
            p = G(p, P);
            O[x] = p;
          } else O[x] = 0;
        });
      }

      function ya(p) {
        pa = new Wa();
        pa.fd(p.layers);
        pa.hd({
          Db: "gpuRaw",
          $c: function (x) {
            var P = C;
            P.va.Lb(1);
            r.viewport(0, 0, 1, 1);
            v.set("s52");
            v.A("u50", ha);
            v.Mb("u48", d, e, h);
            v.Mb("u49", 1 * a.Ua[0], 1 * a.Ua[1], 1 * a.Ua[2]);
            I.g(!1, !1);
            1 !== ++b % 2 && (h += q, h > c && (d += k, h = W, d > g && (d = m, e += l, e > t && (e = n))));
            P.Pb.Lb(1);
            v.set("s53");
            v.A("u50", ha);
            P.va.b(0);
            I.g(!1, !1);
            K.bd(x, X);
            F();
            if (!a.qc && U.G) for (x = 0; 3 > x; ++x) P = G(x + a.Jb[0], a.Jb[1]), P = (2 * P - 1) * a.cd[x], P += a.dd[x], aa[x] = P;
            y();
            x = Date.now();
            P = x - ja;
            var oa = G(a.Fb[0], a.Fb[1]);
            Ca = za(a.Gb[0], a.Gb[1], oa);
            oa = G(a.T[0], a.T[1]);
            var ea = G(a.T[0] + 1, a.T[1]),
                fa = G(a.T[0] + 2, a.T[1]);
            ta = 1 - za(a.Ib[0], a.Ib[1], Math.sqrt(oa * oa + ea * ea + fa * fa) / P);
            oa = da[0] - aa[0];
            ea = da[1] - aa[1];
            fa = da[2] - aa[2];
            P = Math.sqrt(oa * oa + ea * ea + fa * fa) / P;
            da[0] = aa[0];
            da[1] = aa[1];
            da[2] = aa[2];
            Aa = 1 - za(a.Hb[0], a.Hb[1], P);
            ha = Ca * ta * Aa;
            ja = x;
            la[qa] = ha;
            qa = (qa + 1) % a.Oa;

            for (x = 0; x < a.Oa; ++x) ha = Math.min(la[x], ha);

            ib.pd(O, ha, R.ha);
            Y && Y(ha, R.ha);
            if (U.G) for (x = a.bb[1] * ha + a.bb[0] * (1 - ha), x *= R.ha, P = 0; 3 > P; ++P) ra[P] = x * aa[P] + (1 - x) * ra[P], Z[P] = ra[P];else x = Date.now() * a.$b, ca[0] = a.cb[0] * Math.sin(x), ca[1] = a.cb[1] * Math.cos(x), Z[0] = ca[0], Z[1] = ca[1], Z[2] = ca[2];
            x = C;
            E.H();
            J.u();
            v.set("s51");
            x.va.b(0);
            I.g(!1, !1);
          }
        });
        p = pa.zc();
        p !== f && (f = p, ka.rb(), C.oa.resize(f, f), ka.Ob());
        sa = pa.Ec();
        u();
      }

      ka.mc();
      ka.Jc(C);
      lb ? ya(lb) : ia(function (p) {
        p = JSON.parse(p);
        ya(p);
      });
    },
    kd: function (y, G) {
      for (var F in y) "undefined" !== typeof G[F] && (y[F] = G[F]);
    },
    jc: function (y) {
      V.za && V.za();
      var G = {
        video: {
          facingMode: {
            ideal: jb.facingMode
          },
          width: {
            min: jb.minWidth,
            max: jb.maxWidth,
            ideal: jb.idealWidth
          },
          height: {
            min: jb.minHeight,
            max: jb.maxHeight,
            ideal: jb.idealHeight
          }
        },
        audio: V.Za
      };
      jb.deviceId && (constraints.deviceId = jb.deviceId);
      hb(function (F, ya) {
        kb = ya;
        V.Aa && V.Aa();
        y(F);
      }, function () {
        window.wa && window.wa("WEBCAM_UNAVAILABLE");
      }, G);
    },
    wb: function (y, G) {
      ka.lc();
      S.element = y;
      ka.Sb();
      ka.rb();
      ka.Ob();
      ka.i();
      G && G();
    },
    nb: function () {
      var y = [-1, -1],
          G = S.element;
      "VIDEO" === G.nodeName ? (y[0] = G.videoWidth, y[1] = G.videoHeight) : (y[0] = G.width, y[1] = G.height);
      return y;
    },
    Sb: function () {
      var y = ka.nb();
      S.ja[0] = y[0];
      S.ja[1] = y[1];
      Ja.la().width = y[0];
      Ja.la().height = y[1];
      a.width = y[0];
      a.height = y[1];
      var G = [.5, .5],
          F = y[1] / y[0];
      y = Ja.F() / Ja.o();
      F > y ? 1 >= F ? G[0] *= F : G[1] /= F : (G[0] *= F, F = 1 / y, G[0] *= F, G[1] *= F);
      G[1] *= y;
      v.C("s49", [{
        type: "1i",
        name: "u1",
        value: 0
      }, {
        type: "2f",
        name: "u46",
        value: G
      }, {
        type: "2f",
        name: "u47",
        value: [.5, .5]
      }]);
    }
  };
  return ka;
}

V.onLoad = function (b) {
  V.ready ? b() : V.V.push(b);
};

V.set_audio = function (b) {
  V.Za = b;
};

V.switch_displayVideo = function (b) {
  V.ea = b;
  V.da && (V.da.style.display = V.ea ? "block" : "none");
};

V.onWebcamAsk = function (b) {
  V.za = b;
};

V.onContextLost = function (b) {
  V.ya = b;
};

V.onWebcamGet = function (b) {
  V.Aa = b;
};

V.set_size = function (b, d) {
  a.width = b;
  a.height = d;
};

V.get_size = function () {
  return {
    width: a.width,
    height: a.height
  };
};

V.get_videoStream = function () {
  return kb;
};

V.get_cv = function () {
  return Ja.la();
};

V.set_color = function (b) {
  v.C("s51", [{
    type: "3f",
    name: "u36",
    value: b
  }]);
};

V.init = function (b) {
  var d = mb(),
      e = b.callbackReady ? b.callbackReady : function (k) {
    console.log("ERR:", k);
  },
      h = b.callbackReady ? b.callbackReady.bind(!1) : !1;
  if ("undefined" === typeof b.canvasId) e("NO_CANVASID");else if (document.getElementById(b.canvasId)) {
    if (V.initialized) e("ALREADY_INITIALIZED");else {
      V.initialized = !0;
      window.wa = e ? function (k) {
        e(k);
        window.wa = !1;
      } : !1;
      b.NNCpath && (a.Wa = b.NNCpath);
      "undefined" !== typeof b.NNC && (lb = "string" === typeof b.NNC ? JSON.parse(b.NNC) : b.NNC);
      h && V.V.push(h);
      if (!Ja.i({
        ib: b.canvasId,
        width: a.width,
        height: a.height,
        debug: !1,
        La: !1,
        Zc: function () {
          V.ya && V.ya();
        },
        premultipliedAlpha: !1
      })) return e("GL_INCOMPATIBLE"), !1;
      V.da = Ja.la();
      V.ea || (V.da.style.display = "none");
      I.i();
      E.i();
      v.i();
      K.i();
      r.depthFunc(r.LEQUAL);
      r.clearDepth(1);
      b.videoSettings && b.videoSettings.videoElement ? d.wb(b.videoSettings.videoElement, !1) : (b.videoSettings && d.kd(jb, b.videoSettings), d.jc(function (k) {
        d.wb(k, !1);
      }));
      return !0;
    }
  } else e("INVALID_CANVASID");
};

window.JEEFACETRANSFERAPI = V;
;

if (typeof module !== 'undefined') {
  module.exports = JEEFACETRANSFERAPI;
}
},{"buffer":"node_modules/buffer/index.js"}]},{},["jeelizFaceTransfer.js"], null)
//# sourceMappingURL=/jeelizFaceTransfer.fec241de.js.map