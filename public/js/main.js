var main =
webpackJsonp_name_([0,1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _component = __webpack_require__(1);

	var _component2 = _interopRequireDefault(_component);

	var _container = __webpack_require__(6);

	var _container2 = _interopRequireDefault(_container);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Created by User on 05.12.2016.
	 */
	var c = new _component2.default();
	var cc = new _container2.default(c);

	cc.view();

	$("body").append(cc.$e);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by User on 05.12.2016.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


	var _tmpl = __webpack_require__(2);

	var _tmpl2 = _interopRequireDefault(_tmpl);

	var _id = __webpack_require__(5);

	var _id2 = _interopRequireDefault(_id);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var eventHandlers = Symbol("eventHandlers");

	var Component = function () {
	    _createClass(Component, null, [{
	        key: "events",
	        get: function get() {
	            return {};
	        }
	    }]);

	    function Component() {
	        var template = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _tmpl2.default;
	        var $e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : $("<span>");

	        _classCallCheck(this, Component);

	        this.id = _id2.default.reserve();
	        this.$e = $e;
	        this.tmpl = template;

	        this[eventHandlers] = {};
	        this.bind();
	    }

	    _createClass(Component, [{
	        key: "getDataForRender",
	        value: function getDataForRender() {
	            return "Component";
	        }
	    }, {
	        key: "view",
	        value: function view() {
	            this.$e.append(this.render());
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            return this.tmpl({
	                data: this.getDataForRender()
	            });
	        }
	    }, {
	        key: "bind",
	        value: function bind() {
	            for (var _event in this.events) {
	                var handlerName = this.events[_event];
	                if ($.isFunction(this[handlerName])) {
	                    var handler = $.proxy(this[handlerName]);
	                    this[eventHandlers][_event] = handler;
	                    this.$e.on(_event + "", handler, this);
	                }
	            }
	        }
	    }, {
	        key: "unbind",
	        value: function unbind() {
	            for (var _event2 in this[eventHandlers]) {
	                var handler = this[eventHandlers][_event2];
	                this.$e.on(_event2 + "", handler, this);
	            }
	            this[eventHandlers][event] = {};
	        }
	    }, {
	        key: "die",
	        value: function die() {
	            this.unbind();
	            this.$e.remove();
	            _id2.default.free(this.id);
	        }
	    }]);

	    return Component;
	}();

		exports.default = Component;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(3);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (data) {
	buf.push(jade.escape(null == (jade_interp = data) ? "" : jade_interp));}.call(this,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined));;return buf.join("");
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.merge = function merge(a, b) {
	  if (arguments.length === 1) {
	    var attrs = a[0];
	    for (var i = 1; i < a.length; i++) {
	      attrs = merge(attrs, a[i]);
	    }
	    return attrs;
	  }
	  var ac = a['class'];
	  var bc = b['class'];

	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    a['class'] = ac.concat(bc).filter(nulls);
	  }

	  for (var key in b) {
	    if (key != 'class') {
	      a[key] = b[key];
	    }
	  }

	  return a;
	};

	/**
	 * Filter null `val`s.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 * @api private
	 */

	function nulls(val) {
	  return val != null && val !== '';
	}

	/**
	 * join array as classes.
	 *
	 * @param {*} val
	 * @return {String}
	 */
	exports.joinClasses = joinClasses;
	function joinClasses(val) {
	  return (Array.isArray(val) ? val.map(joinClasses) : val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' ? Object.keys(val).filter(function (key) {
	    return val[key];
	  }) : [val]).filter(nulls).join(' ');
	}

	/**
	 * Render the given classes.
	 *
	 * @param {Array} classes
	 * @param {Array.<Boolean>} escaped
	 * @return {String}
	 */
	exports.cls = function cls(classes, escaped) {
	  var buf = [];
	  for (var i = 0; i < classes.length; i++) {
	    if (escaped && escaped[i]) {
	      buf.push(exports.escape(joinClasses([classes[i]])));
	    } else {
	      buf.push(joinClasses(classes[i]));
	    }
	  }
	  var text = joinClasses(buf);
	  if (text.length) {
	    return ' class="' + text + '"';
	  } else {
	    return '';
	  }
	};

	exports.style = function (val) {
	  if (val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
	    return Object.keys(val).map(function (style) {
	      return style + ':' + val[style];
	    }).join(';');
	  } else {
	    return val;
	  }
	};
	/**
	 * Render the given attribute.
	 *
	 * @param {String} key
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @param {Boolean} terse
	 * @return {String}
	 */
	exports.attr = function attr(key, val, escaped, terse) {
	  if (key === 'style') {
	    val = exports.style(val);
	  }
	  if ('boolean' == typeof val || null == val) {
	    if (val) {
	      return ' ' + (terse ? key : key + '="' + key + '"');
	    } else {
	      return '';
	    }
	  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
	    if (JSON.stringify(val).indexOf('&') !== -1) {
	      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' + 'will be escaped to `&amp;`');
	    };
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will eliminate the double quotes around dates in ' + 'ISO form after 2.0.0');
	    }
	    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
	  } else if (escaped) {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + exports.escape(val) + '"';
	  } else {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + val + '"';
	  }
	};

	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 */
	exports.attrs = function attrs(obj, terse) {
	  var buf = [];

	  var keys = Object.keys(obj);

	  if (keys.length) {
	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i],
	          val = obj[key];

	      if ('class' == key) {
	        if (val = joinClasses(val)) {
	          buf.push(' ' + key + '="' + val + '"');
	        }
	      } else {
	        buf.push(exports.attr(key, val, false, terse));
	      }
	    }
	  }

	  return buf.join('');
	};

	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */

	var jade_encode_html_rules = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;'
	};
	var jade_match_html = /[&<>"]/g;

	function jade_encode_char(c) {
	  return jade_encode_html_rules[c] || c;
	}

	exports.escape = jade_escape;
	function jade_escape(html) {
	  var result = String(html).replace(jade_match_html, jade_encode_char);
	  if (result === '' + html) return html;else return result;
	};

	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */

	exports.rethrow = function rethrow(err, filename, lineno, str) {
	  if (!(err instanceof Error)) throw err;
	  if ((typeof window != 'undefined' || !filename) && !str) {
	    err.message += ' on line ' + lineno;
	    throw err;
	  }
	  try {
	    str = str || __webpack_require__(4).readFileSync(filename, 'utf8');
	  } catch (ex) {
	    rethrow(err, null, lineno);
	  }
	  var context = 3,
	      lines = str.split('\n'),
	      start = Math.max(lineno - context, 0),
	      end = Math.min(lines.length, lineno + context);

	  // Error context
	  var context = lines.slice(start, end).map(function (line, i) {
	    var curr = i + start + 1;
	    return (curr == lineno ? '  > ' : '    ') + curr + '| ' + line;
	  }).join('\n');

	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'Jade') + ':' + lineno + '\n' + context + '\n\n' + err.message;
	  throw err;
	};

	exports.DebugItem = function DebugItem(lineno, filename) {
	  this.lineno = lineno;
	  this.filename = filename;
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Created by User on 07.12.2016.
	 */

	var setsOfReservedID = Symbol("setsOfReservedID");

	var ID = function () {
	    function ID() {
	        _classCallCheck(this, ID);

	        this[setsOfReservedID] = [];
	    }

	    _createClass(ID, [{
	        key: "reserve",
	        value: function reserve() {
	            if (this[setsOfReservedID].length == 0) {
	                this[setsOfReservedID].push({
	                    start: 0,
	                    end: 0
	                });
	                return 0;
	            }

	            var set = this[setsOfReservedID][0];
	            set.end++;
	            var id = set.end;
	            if (this[setsOfReservedID].length > 1) {
	                var forwardSet = this[setsOfReservedID][1];
	                if (set.end + 1 == forwardSet.start) {
	                    this[setsOfReservedID].split(0, 2, {
	                        start: set.start,
	                        end: forwardSet.end
	                    });
	                }
	            }
	            return id;
	        }
	    }, {
	        key: "free",
	        value: function free(id) {
	            for (var i = 0; i < this[setsOfReservedID].length; i++) {
	                if (this[setsOfReservedID][i].start >= id && this[setsOfReservedID][i] <= id) {
	                    var set = this[setsOfReservedID][i];
	                    if (set.start != id && set.end != id) {
	                        var newSet = { start: set.start, end: id - 1 };
	                        var newNextSet = { start: id + 1, end: set.end };
	                        this[setsOfReservedID].split(i, 1, newSet, newNextSet);
	                    } else {
	                        if (set.start == id) {
	                            set.start++;
	                        }
	                        if (set.end == id) {
	                            set.end--;
	                        }
	                        if (set.start > set.end) {
	                            this[setsOfReservedID].split(i, 1);
	                        }
	                    }
	                    break;
	                }
	            }
	        }
	    }]);

	    return ID;
	}();

		exports.default = new ID();

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _component = __webpack_require__(1);

	var _component2 = _interopRequireDefault(_component);

	var _tmpl = __webpack_require__(7);

	var _tmpl2 = _interopRequireDefault(_tmpl);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by User on 07.12.2016.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


	var Container = function (_Component) {
	    _inherits(Container, _Component);

	    function Container() {
	        var childs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	        var template = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _tmpl2.default;
	        var $e = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : $("<div>");

	        _classCallCheck(this, Container);

	        var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, template, $e));

	        _this.childs = $.isArray(childs) ? childs : childs ? [childs] : [];
	        return _this;
	    }

	    _createClass(Container, [{
	        key: "getDataForRender",
	        value: function getDataForRender() {
	            return "Container";
	        }
	    }, {
	        key: "view",
	        value: function view() {
	            for (var i = 0; i < this.childs.length; i++) {
	                this.childs[i].bind();
	            }
	            _get(Container.prototype.__proto__ || Object.getPrototypeOf(Container.prototype), "view", this).call(this);
	            for (var _i = 0; _i < this.childs.length; _i++) {
	                this.childs[_i].unbind();
	            }
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            //render childs
	            var childWrap = $("<div>");
	            for (var i = 0; i < this.childs.length; i++) {
	                this.childs[i].view();
	                childWrap.append(this.childs[i].$e);
	            }
	            //render container
	            return this.tmpl({
	                data: this.getDataForRender(),
	                childs: childWrap[0].outerHTML
	            });
	        }
	    }]);

	    return Container;
	}(_component2.default);

		exports.default = Container;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(3);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (childs, data) {
	buf.push("" + (jade.escape((jade_interp = data) == null ? '' : jade_interp)) + "\n" + (((jade_interp = childs) == null ? '' : jade_interp)) + "");}.call(this,"childs" in locals_for_with?locals_for_with.childs:typeof childs!=="undefined"?childs:undefined,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined));;return buf.join("");
	}

/***/ }
]);
//# sourceMappingURL=main.js.map