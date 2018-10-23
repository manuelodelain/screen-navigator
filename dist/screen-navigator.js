(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ScreenNavigator = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tinyEmitter = require('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AScreen = function (_EventEmitter) {
  _inherits(AScreen, _EventEmitter);

  function AScreen() {
    _classCallCheck(this, AScreen);

    return _possibleConstructorReturn(this, (AScreen.__proto__ || Object.getPrototypeOf(AScreen)).apply(this, arguments));
  }

  _createClass(AScreen, [{
    key: 'dispose',
    value: function dispose() {}
  }, {
    key: 'animateIn',
    value: function animateIn() {
      var _this2 = this;

      var cancelTransition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      this.emit('animateIn', { cancelTransition: cancelTransition });

      return new Promise(function (resolve) {
        if (cancelTransition) _this2.cancelAnimIn(resolve);else _this2.createAnimIn(resolve);
      }).then(this.onAnimateInComplete.bind(this, cancelTransition)).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'createAnimIn',
    value: function createAnimIn(resolvePromise) {
      resolvePromise();
    }
  }, {
    key: 'cancelAnimIn',
    value: function cancelAnimIn(resolvePromise) {
      resolvePromise();
    }
  }, {
    key: 'animateOut',
    value: function animateOut() {
      var _this3 = this;

      var cancelTransition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      this.emit('animateOut', { cancelTransition: cancelTransition });

      return new Promise(function (resolve) {
        if (cancelTransition) _this3.cancelAnimOut(resolve);else _this3.createAnimOut(resolve);
      }).then(this.onAnimateOutComplete.bind(this, cancelTransition)).catch(function (error) {
        console.log(error);
      });
    }
  }, {
    key: 'createAnimOut',
    value: function createAnimOut(resolvePromise) {
      resolvePromise();
    }
  }, {
    key: 'cancelAnimOut',
    value: function cancelAnimOut(resolvePromise) {
      resolvePromise();
    }
  }, {
    key: 'onAnimateInComplete',
    value: function onAnimateInComplete(canceledTransition) {
      this.emit('animateInComplete', { canceledTransition: canceledTransition });
    }
  }, {
    key: 'onAnimateOutComplete',
    value: function onAnimateOutComplete(canceledTransition) {
      this.emit('animateOutComplete', { canceledTransition: canceledTransition });
    }
  }]);

  return AScreen;
}(_tinyEmitter2.default);

exports.default = AScreen;

},{"tiny-emitter":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ATransition = exports.AScreen = exports.Transitions = exports.ScreenNavigatorItem = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tinyEmitter = require('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

var _ScreenNavigatorItem = require('./ScreenNavigatorItem');

var _ScreenNavigatorItem2 = _interopRequireDefault(_ScreenNavigatorItem);

var _Transitions = require('./Transitions');

var _Transitions2 = _interopRequireDefault(_Transitions);

var _AScreen = require('./AScreen');

var _AScreen2 = _interopRequireDefault(_AScreen);

var _ATransition = require('./transitions/ATransition');

var _ATransition2 = _interopRequireDefault(_ATransition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.ScreenNavigatorItem = _ScreenNavigatorItem2.default;
exports.Transitions = _Transitions2.default;
exports.AScreen = _AScreen2.default;
exports.ATransition = _ATransition2.default;

var ScreenNavigator = function (_EventEmitter) {
  _inherits(ScreenNavigator, _EventEmitter);

  function ScreenNavigator() {
    _classCallCheck(this, ScreenNavigator);

    var _this = _possibleConstructorReturn(this, (ScreenNavigator.__proto__ || Object.getPrototypeOf(ScreenNavigator)).call(this));

    _this.items = {};

    _this.currentItemId = null;
    _this.previousItemId = null;

    _this.currentScreen = null;
    _this.previousScreen = null;

    _this.transition = null;
    _this.transitionType = _Transitions2.default.None;
    return _this;
  }

  /**
   * 
   * @param {boolean} forceDispose 
   */


  _createClass(ScreenNavigator, [{
    key: 'dispose',
    value: function dispose() {
      var forceDispose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (this.transition) {
        this.transition.cancel();
        this.transition = null;
      }

      this.disposeCurrentScreen();
      this.disposePreviousScreen();

      for (var itemId in this.items) {
        this.items[itemId].dispose(forceDispose);

        this.removeScreen(itemId);
      }

      this.transitionType = null;
    }

    /**
     * 
     * @param {string} id - screen id
     * @param {ScreenNavigatorItem} item 
     * 
     * @return {ScreenNavigatorItem} item
     */

  }, {
    key: 'addScreen',
    value: function addScreen(id, item) {
      this.items[id] = item;

      return item;
    }

    /**
     * @param {string} id - screen id
     */

  }, {
    key: 'removeScreen',
    value: function removeScreen(id) {
      if (!this.items[id]) return;

      delete this.items[id];
    }

    /**
     * 
     * @param {string} id - screen id
     */

  }, {
    key: 'getScreen',
    value: function getScreen(id) {
      return this.items[id];
    }

    /**
     * 
     * @param {string} id - screen id
     * @param {ATransition} transition - optional transition, if not provided the default transition will be applied
     * @param {object} options - optional options to apply to the new screen
     */

  }, {
    key: 'showScreen',
    value: function showScreen(id) {
      var transition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (!this.items[id]) {
        throw new Error('ScreenNavigator - the item with the id ' + id + ' doesn\'t exist');
      }
      if (this.transition) {
        this.onTransitionComplete(true);
      }

      if (this.currentScreen) {
        this.previousItemId = this.currentItemId;
        this.previousScreen = this.currentScreen;
      }

      this.currentItemId = id;

      this.onScreenChange();

      this.startTransition(transition, options);

      return this.transition.promise;
    }

    /**
     * 
     * @param {ATransition} transition - optional transition, if not provided the default transition will be applied
     */

  }, {
    key: 'clearScreen',
    value: function clearScreen() {
      var transition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!this.currentScreen) {
        return;
      }

      this.previousItemId = this.currentItemId;
      this.previousScreen = this.currentScreen;

      this.currentItemId = null;

      this.onScreenChange();

      this.startTransition(transition);
    }

    /**
     * 
     * @param {string} id 
     * @param {object} screen
     * @param {boolean} forceDispose 
     */

  }, {
    key: 'disposeScreen',
    value: function disposeScreen(id, screen) {
      var forceDispose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (!screen) return;

      var item = this.items[id];

      if (!item) return;

      item.disposeScreen(screen, forceDispose);
    }
  }, {
    key: 'disposePreviousScreen',
    value: function disposePreviousScreen() {
      if (!this.previousScreen) return;

      this.disposeScreen(this.previousItemId, this.previousScreen);

      this.previousScreen = null;
    }
  }, {
    key: 'disposeCurrentScreen',
    value: function disposeCurrentScreen() {
      if (!this.currentScreen) return;

      this.disposeScreen(this.currentItemId, this.currentScreen);

      this.currentScreen = null;
    }

    /**
     * 
     * @param {ATransition} transition 
     * @param {object} options 
     */

  }, {
    key: 'startTransition',
    value: function startTransition() {
      var transition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var transitionClass = transition || this.transitionType;
      var currentItem = this.items[this.currentItemId];

      if (options) currentItem.setOptions(options);

      this.currentScreen = currentItem ? currentItem.getScreen(options) : null;

      this.emit('transitionStart');

      this.transition = new transitionClass(this.currentScreen, this.previousScreen);

      this.transition.promise.then(this.onTransitionComplete.bind(this));
    }
  }, {
    key: 'onScreenChange',
    value: function onScreenChange() {
      this.emit('screenChange');
    }

    /**
     * 
     * @param {boolean} cancelTransition 
     */

  }, {
    key: 'onTransitionComplete',
    value: function onTransitionComplete() {
      var cancelTransition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (cancelTransition && this.transition) {
        this.transition.cancel();
      }

      this.transition = null;

      this.disposePreviousScreen();

      if (cancelTransition) {
        this.emit('transitionCancel');
      } else {
        this.emit('transitionComplete');
      }
    }
  }]);

  return ScreenNavigator;
}(_tinyEmitter2.default);

exports.default = ScreenNavigator;

},{"./AScreen":2,"./ScreenNavigatorItem":4,"./Transitions":5,"./transitions/ATransition":6,"tiny-emitter":1}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScreenNavigatorItem = function () {
  function ScreenNavigatorItem(screen, options) {
    _classCallCheck(this, ScreenNavigatorItem);

    this.screen = screen;

    this.isInstance = typeof screen !== 'function';
    this.internalInstance = null;

    // default options
    this.arguments = null;
    this.properties = null;
    this.canDispose = !this.isInstance;
    this.events = null;

    this.hasEventsListeners = false;

    this.setOptions(options);
  }

  _createClass(ScreenNavigatorItem, [{
    key: 'setOptions',
    value: function setOptions(options) {
      for (var optionKey in options) {
        if (typeof this[optionKey] !== 'undefined') this[optionKey] = options[optionKey];
      }
    }
  }, {
    key: 'getScreen',
    value: function getScreen() {
      var instance = void 0;

      if (this.isInstance) {
        instance = this.screen;
      } else if (this.internalInstance) {
        instance = this.internalInstance;
      } else {
        var args = this.arguments || [];

        instance = new (Function.prototype.bind.apply(this.screen, [null].concat(_toConsumableArray(args))))();

        if (!this.canDispose) this.internalInstance = instance;
      }

      if (this.properties) {
        for (var key in this.properties) {
          instance[key] = this.properties[key];
        }
      }

      if (this.events) this.addEventsListeners(instance);

      return instance;
    }
  }, {
    key: 'addEventsListeners',
    value: function addEventsListeners(instance) {
      if (!this.canDispose) {
        if (this.hasEventsListeners) return;

        this.hasEventsListeners = true;
      }

      for (var eventName in this.events) {
        if (typeof this.events[eventName] === 'function') {
          instance.on(eventName, this.events[eventName]);
        }
      }
    }
  }, {
    key: 'removeEventsListeners',
    value: function removeEventsListeners(instance) {
      this.hasEventsListeners = false;

      for (var eventName in this.events) {
        if (typeof this.events[eventName] === 'function') {
          instance.off(eventName, this.events[eventName]);
        }
      }
    }
  }, {
    key: 'disposeScreen',
    value: function disposeScreen(instance) {
      var forceDispose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (this.events) this.removeEventsListeners(instance);

      if (!forceDispose && !this.canDispose) return;

      if (typeof instance.dispose === 'function') instance.dispose();

      this.internalInstance = null;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      var forceDispose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var instance = this.isInstance ? this.screen : this.internalInstance;

      if (instance) {
        this.disposeScreen(instance, forceDispose);
      }

      this.screen = this.internalInstance = this.arguments = this.properties = this.events = null;
    }
  }]);

  return ScreenNavigatorItem;
}();

exports.default = ScreenNavigatorItem;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _None = require('./transitions/None.js');

var _None2 = _interopRequireDefault(_None);

var _In = require('./transitions/In.js');

var _In2 = _interopRequireDefault(_In);

var _Out = require('./transitions/Out.js');

var _Out2 = _interopRequireDefault(_Out);

var _OutAndIn = require('./transitions/OutAndIn.js');

var _OutAndIn2 = _interopRequireDefault(_OutAndIn);

var _OutThenIn = require('./transitions/OutThenIn.js');

var _OutThenIn2 = _interopRequireDefault(_OutThenIn);

var _InThenOut = require('./transitions/InThenOut.js');

var _InThenOut2 = _interopRequireDefault(_InThenOut);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { None: _None2.default, In: _In2.default, Out: _Out2.default, InThenOut: _InThenOut2.default, OutAndIn: _OutAndIn2.default, OutThenIn: _OutThenIn2.default };

},{"./transitions/In.js":7,"./transitions/InThenOut.js":8,"./transitions/None.js":9,"./transitions/Out.js":10,"./transitions/OutAndIn.js":11,"./transitions/OutThenIn.js":12}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ATransition = function () {
    function ATransition(newScreen, oldScreen) {
        _classCallCheck(this, ATransition);

        this.newScreen = newScreen;
        this.oldScreen = oldScreen;

        this.promise = this.createPromise();
    }

    _createClass(ATransition, [{
        key: 'createPromise',
        value: function createPromise() {
            return Promise.resolve();
        }
    }, {
        key: 'cancelPromise',
        value: function cancelPromise() {
            return Promise.reject('cancel transition').catch(function (error) {});
        }
    }, {
        key: 'cancel',
        value: function cancel() {
            this.cancelPromise();

            if (this.oldScreen) this.oldScreen.animateOut(true);
            if (this.newScreen) this.newScreen.animateIn(true);
        }
    }]);

    return ATransition;
}();

exports.default = ATransition;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ATransition2 = require('./ATransition');

var _ATransition3 = _interopRequireDefault(_ATransition2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var In = function (_ATransition) {
	_inherits(In, _ATransition);

	function In() {
		_classCallCheck(this, In);

		return _possibleConstructorReturn(this, (In.__proto__ || Object.getPrototypeOf(In)).apply(this, arguments));
	}

	_createClass(In, [{
		key: 'createPromise',
		value: function createPromise() {
			var _this2 = this;

			return Promise.resolve().then(this.newScreen && this.newScreen.animateIn.bind(this.newScreen), this.cancelPromise).then(function () {
				if (_this2.oldScreen) _this2.oldScreen.animateOut();
			}, this.cancelPromise);
		}
	}]);

	return In;
}(_ATransition3.default);

exports.default = In;

},{"./ATransition":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ATransition2 = require('./ATransition');

var _ATransition3 = _interopRequireDefault(_ATransition2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InThenOut = function (_ATransition) {
	_inherits(InThenOut, _ATransition);

	function InThenOut() {
		_classCallCheck(this, InThenOut);

		return _possibleConstructorReturn(this, (InThenOut.__proto__ || Object.getPrototypeOf(InThenOut)).apply(this, arguments));
	}

	_createClass(InThenOut, [{
		key: 'createPromise',
		value: function createPromise() {
			return Promise.resolve().then(this.newScreen && this.newScreen.animateIn.bind(this.newScreen), cancelPromise).then(this.oldScreen && this.oldScreen.animateOut.bind(this.oldScreen), this.cancelPromise);
		}
	}]);

	return InThenOut;
}(_ATransition3.default);

exports.default = InThenOut;

},{"./ATransition":6}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ATransition2 = require('./ATransition');

var _ATransition3 = _interopRequireDefault(_ATransition2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var None = function (_ATransition) {
	_inherits(None, _ATransition);

	function None() {
		_classCallCheck(this, None);

		return _possibleConstructorReturn(this, (None.__proto__ || Object.getPrototypeOf(None)).apply(this, arguments));
	}

	_createClass(None, [{
		key: 'createPromise',
		value: function createPromise() {
			if (this.oldScreen) this.oldScreen.animateOut();
			if (this.newScreen) this.newScreen.animateIn();

			return Promise.resolve();
		}
	}]);

	return None;
}(_ATransition3.default);

exports.default = None;

},{"./ATransition":6}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ATransition2 = require('./ATransition');

var _ATransition3 = _interopRequireDefault(_ATransition2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Out = function (_ATransition) {
	_inherits(Out, _ATransition);

	function Out() {
		_classCallCheck(this, Out);

		return _possibleConstructorReturn(this, (Out.__proto__ || Object.getPrototypeOf(Out)).apply(this, arguments));
	}

	_createClass(Out, [{
		key: 'createPromise',
		value: function createPromise() {
			var _this2 = this;

			return Promise.resolve().then(this.oldScreen && this.oldScreen.animateOut.bind(this.oldScreen), this.cancelPromise).then(function () {
				if (_this2.newScreen) _this2.newScreen.animateIn();
			}, this.cancelPromise);
		}
	}]);

	return Out;
}(_ATransition3.default);

exports.default = Out;

},{"./ATransition":6}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ATransition2 = require('./ATransition');

var _ATransition3 = _interopRequireDefault(_ATransition2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OutAndIn = function (_ATransition) {
	_inherits(OutAndIn, _ATransition);

	function OutAndIn() {
		_classCallCheck(this, OutAndIn);

		return _possibleConstructorReturn(this, (OutAndIn.__proto__ || Object.getPrototypeOf(OutAndIn)).apply(this, arguments));
	}

	_createClass(OutAndIn, [{
		key: 'createPromise',
		value: function createPromise() {
			return Promise.all([Promise.resolve().then(this.oldScreen && this.oldScreen.animateOut.bind(this.oldScreen), this.cancelPromise), Promise.resolve().then(this.newScreen && this.newScreen.animateIn.bind(this.newScreen), this.cancelPromise)]);
		}
	}]);

	return OutAndIn;
}(_ATransition3.default);

exports.default = OutAndIn;

},{"./ATransition":6}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ATransition2 = require('./ATransition');

var _ATransition3 = _interopRequireDefault(_ATransition2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OutThenIn = function (_ATransition) {
	_inherits(OutThenIn, _ATransition);

	function OutThenIn() {
		_classCallCheck(this, OutThenIn);

		return _possibleConstructorReturn(this, (OutThenIn.__proto__ || Object.getPrototypeOf(OutThenIn)).apply(this, arguments));
	}

	_createClass(OutThenIn, [{
		key: 'createPromise',
		value: function createPromise() {
			return Promise.resolve().then(this.oldScreen && this.oldScreen.animateOut.bind(this.oldScreen), this.cancelPromise).then(this.newScreen && this.newScreen.animateIn.bind(this.newScreen), cancelPromise);
		}
	}]);

	return OutThenIn;
}(_ATransition3.default);

exports.default = OutThenIn;

},{"./ATransition":6}]},{},[3])(3)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdGlueS1lbWl0dGVyL2luZGV4LmpzIiwic3JjL0FTY3JlZW4uanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9yLmpzIiwic3JjL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMiLCJzcmMvVHJhbnNpdGlvbnMuanMiLCJzcmMvdHJhbnNpdGlvbnMvQVRyYW5zaXRpb24uanMiLCJzcmMvdHJhbnNpdGlvbnMvSW4uanMiLCJzcmMvdHJhbnNpdGlvbnMvSW5UaGVuT3V0LmpzIiwic3JjL3RyYW5zaXRpb25zL05vbmUuanMiLCJzcmMvdHJhbnNpdGlvbnMvT3V0LmpzIiwic3JjL3RyYW5zaXRpb25zL091dEFuZEluLmpzIiwic3JjL3RyYW5zaXRpb25zL091dFRoZW5Jbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDbEVBOzs7Ozs7Ozs7Ozs7SUFFcUIsTzs7Ozs7Ozs7Ozs7OEJBQ1IsQ0FDVjs7O2dDQUVvQztBQUFBOztBQUFBLFVBQTFCLGdCQUEwQix1RUFBUCxLQUFPOztBQUNuQyxXQUFLLElBQUwsQ0FBVSxXQUFWLEVBQXVCLEVBQUMsa0NBQUQs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LEtBQUssU0FBTCxDQUFlLFNBQWYsQ0FBeUIsSUFBekIsQ0FBOEIsS0FBSyxTQUFuQyxDQUZsQixFQUVpRSxhQUZqRSxDQUFQO0FBR0E7Ozs7RUFMcUMscUI7O2tCQUFsQixTIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZnVuY3Rpb24gRSAoKSB7XG4gIC8vIEtlZXAgdGhpcyBlbXB0eSBzbyBpdCdzIGVhc2llciB0byBpbmhlcml0IGZyb21cbiAgLy8gKHZpYSBodHRwczovL2dpdGh1Yi5jb20vbGlwc21hY2sgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2lzc3Vlcy8zKVxufVxuXG5FLnByb3RvdHlwZSA9IHtcbiAgb246IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcblxuICAgIChlW25hbWVdIHx8IChlW25hbWVdID0gW10pKS5wdXNoKHtcbiAgICAgIGZuOiBjYWxsYmFjayxcbiAgICAgIGN0eDogY3R4XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvbmNlOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBmdW5jdGlvbiBsaXN0ZW5lciAoKSB7XG4gICAgICBzZWxmLm9mZihuYW1lLCBsaXN0ZW5lcik7XG4gICAgICBjYWxsYmFjay5hcHBseShjdHgsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIGxpc3RlbmVyLl8gPSBjYWxsYmFja1xuICAgIHJldHVybiB0aGlzLm9uKG5hbWUsIGxpc3RlbmVyLCBjdHgpO1xuICB9LFxuXG4gIGVtaXQ6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIGRhdGEgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGV2dEFyciA9ICgodGhpcy5lIHx8ICh0aGlzLmUgPSB7fSkpW25hbWVdIHx8IFtdKS5zbGljZSgpO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbGVuID0gZXZ0QXJyLmxlbmd0aDtcblxuICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBldnRBcnJbaV0uZm4uYXBwbHkoZXZ0QXJyW2ldLmN0eCwgZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb2ZmOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuICAgIHZhciBldnRzID0gZVtuYW1lXTtcbiAgICB2YXIgbGl2ZUV2ZW50cyA9IFtdO1xuXG4gICAgaWYgKGV2dHMgJiYgY2FsbGJhY2spIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBldnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChldnRzW2ldLmZuICE9PSBjYWxsYmFjayAmJiBldnRzW2ldLmZuLl8gIT09IGNhbGxiYWNrKVxuICAgICAgICAgIGxpdmVFdmVudHMucHVzaChldnRzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgZXZlbnQgZnJvbSBxdWV1ZSB0byBwcmV2ZW50IG1lbW9yeSBsZWFrXG4gICAgLy8gU3VnZ2VzdGVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9sYXpkXG4gICAgLy8gUmVmOiBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2NvbW1pdC9jNmViZmFhOWJjOTczYjMzZDExMGE4NGEzMDc3NDJiN2NmOTRjOTUzI2NvbW1pdGNvbW1lbnQtNTAyNDkxMFxuXG4gICAgKGxpdmVFdmVudHMubGVuZ3RoKVxuICAgICAgPyBlW25hbWVdID0gbGl2ZUV2ZW50c1xuICAgICAgOiBkZWxldGUgZVtuYW1lXTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEU7XG4iLCJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ3RpbnktZW1pdHRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFTY3JlZW4gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBkaXNwb3NlICgpIHtcbiAgfVxuXG4gIGFuaW1hdGVJbiAoY2FuY2VsVHJhbnNpdGlvbiA9IGZhbHNlKSB7XG4gICAgdGhpcy5lbWl0KCdhbmltYXRlSW4nLCB7Y2FuY2VsVHJhbnNpdGlvbn0pO1xuICAgIFxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGlmIChjYW5jZWxUcmFuc2l0aW9uKSB0aGlzLmNhbmNlbEFuaW1JbihyZXNvbHZlKTtcbiAgICAgIGVsc2UgdGhpcy5jcmVhdGVBbmltSW4ocmVzb2x2ZSk7XG4gICAgfSlcbiAgICAgIC50aGVuKHRoaXMub25BbmltYXRlSW5Db21wbGV0ZS5iaW5kKHRoaXMsIGNhbmNlbFRyYW5zaXRpb24pKVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZUFuaW1JbiAocmVzb2x2ZVByb21pc2UpIHtcbiAgICByZXNvbHZlUHJvbWlzZSgpO1xuICB9XG5cbiAgY2FuY2VsQW5pbUluIChyZXNvbHZlUHJvbWlzZSkge1xuICAgIHJlc29sdmVQcm9taXNlKCk7XG4gIH1cbiAgXG4gIGFuaW1hdGVPdXQgKGNhbmNlbFRyYW5zaXRpb24gPSBmYWxzZSkge1xuICAgIHRoaXMuZW1pdCgnYW5pbWF0ZU91dCcsIHtjYW5jZWxUcmFuc2l0aW9ufSk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAoY2FuY2VsVHJhbnNpdGlvbikgdGhpcy5jYW5jZWxBbmltT3V0KHJlc29sdmUpO1xuICAgICAgZWxzZSB0aGlzLmNyZWF0ZUFuaW1PdXQocmVzb2x2ZSk7XG4gICAgfSlcbiAgICAgIC50aGVuKHRoaXMub25BbmltYXRlT3V0Q29tcGxldGUuYmluZCh0aGlzLCBjYW5jZWxUcmFuc2l0aW9uKSlcbiAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfSk7XG4gIH1cblxuICBjcmVhdGVBbmltT3V0IChyZXNvbHZlUHJvbWlzZSkge1xuICAgIHJlc29sdmVQcm9taXNlKCk7XG4gIH1cblxuICBjYW5jZWxBbmltT3V0IChyZXNvbHZlUHJvbWlzZSkge1xuICAgIHJlc29sdmVQcm9taXNlKCk7XG4gIH1cblxuICBvbkFuaW1hdGVJbkNvbXBsZXRlIChjYW5jZWxlZFRyYW5zaXRpb24pIHtcbiAgICB0aGlzLmVtaXQoJ2FuaW1hdGVJbkNvbXBsZXRlJywge2NhbmNlbGVkVHJhbnNpdGlvbn0pO1xuICB9XG4gIFxuICBvbkFuaW1hdGVPdXRDb21wbGV0ZSAoY2FuY2VsZWRUcmFuc2l0aW9uKSB7XG4gICAgdGhpcy5lbWl0KCdhbmltYXRlT3V0Q29tcGxldGUnLCB7Y2FuY2VsZWRUcmFuc2l0aW9ufSk7XG4gIH1cbn1cblxuIiwiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IFNjcmVlbk5hdmlnYXRvckl0ZW0gZnJvbSAnLi9TY3JlZW5OYXZpZ2F0b3JJdGVtJztcbmltcG9ydCBUcmFuc2l0aW9ucyBmcm9tICcuL1RyYW5zaXRpb25zJztcbmltcG9ydCBBU2NyZWVuIGZyb20gJy4vQVNjcmVlbidcbmltcG9ydCBBVHJhbnNpdGlvbiBmcm9tICcuL3RyYW5zaXRpb25zL0FUcmFuc2l0aW9uJztcblxuZXhwb3J0IHtTY3JlZW5OYXZpZ2F0b3JJdGVtLCBUcmFuc2l0aW9ucywgQVNjcmVlbiwgQVRyYW5zaXRpb259XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcmVlbk5hdmlnYXRvciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpOyBcblxuICAgIHRoaXMuaXRlbXMgPSB7fTtcblxuICAgIHRoaXMuY3VycmVudEl0ZW1JZCA9IG51bGw7XG4gICAgdGhpcy5wcmV2aW91c0l0ZW1JZCA9IG51bGw7XG5cbiAgICB0aGlzLmN1cnJlbnRTY3JlZW4gPSBudWxsO1xuICAgIHRoaXMucHJldmlvdXNTY3JlZW4gPSBudWxsO1xuXG4gICAgdGhpcy50cmFuc2l0aW9uID0gbnVsbDtcbiAgICB0aGlzLnRyYW5zaXRpb25UeXBlID0gVHJhbnNpdGlvbnMuTm9uZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBcbiAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZURpc3Bvc2UgXG4gICAqL1xuICBkaXNwb3NlIChmb3JjZURpc3Bvc2UgPSB0cnVlKSB7XG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbil7XG4gICAgICB0aGlzLnRyYW5zaXRpb24uY2FuY2VsKCk7XG4gICAgICB0aGlzLnRyYW5zaXRpb24gPSBudWxsO1xuICAgIH1cbiAgXG4gICAgdGhpcy5kaXNwb3NlQ3VycmVudFNjcmVlbigpO1xuICAgIHRoaXMuZGlzcG9zZVByZXZpb3VzU2NyZWVuKCk7XG4gIFxuICAgIGZvciAobGV0IGl0ZW1JZCBpbiB0aGlzLml0ZW1zKXtcbiAgICAgIHRoaXMuaXRlbXNbaXRlbUlkXS5kaXNwb3NlKGZvcmNlRGlzcG9zZSk7XG4gIFxuICAgICAgdGhpcy5yZW1vdmVTY3JlZW4oaXRlbUlkKTtcbiAgICB9XG4gIFxuICAgIHRoaXMudHJhbnNpdGlvblR5cGUgPSBudWxsO1xuICB9XG4gIFxuICAvKipcbiAgICogXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIHNjcmVlbiBpZFxuICAgKiBAcGFyYW0ge1NjcmVlbk5hdmlnYXRvckl0ZW19IGl0ZW0gXG4gICAqIFxuICAgKiBAcmV0dXJuIHtTY3JlZW5OYXZpZ2F0b3JJdGVtfSBpdGVtXG4gICAqL1xuICBhZGRTY3JlZW4gKGlkLCBpdGVtKSB7XG4gICAgdGhpcy5pdGVtc1tpZF0gPSBpdGVtO1xuICBcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBzY3JlZW4gaWRcbiAgICovXG4gIHJlbW92ZVNjcmVlbiAoaWQpIHtcbiAgICBpZiAoIXRoaXMuaXRlbXNbaWRdKSByZXR1cm47XG5cbiAgICBkZWxldGUgdGhpcy5pdGVtc1tpZF07XG4gIH1cblxuICAvKipcbiAgICogXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIHNjcmVlbiBpZFxuICAgKi9cbiAgZ2V0U2NyZWVuIChpZCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zW2lkXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gc2NyZWVuIGlkXG4gICAqIEBwYXJhbSB7QVRyYW5zaXRpb259IHRyYW5zaXRpb24gLSBvcHRpb25hbCB0cmFuc2l0aW9uLCBpZiBub3QgcHJvdmlkZWQgdGhlIGRlZmF1bHQgdHJhbnNpdGlvbiB3aWxsIGJlIGFwcGxpZWRcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSBvcHRpb25hbCBvcHRpb25zIHRvIGFwcGx5IHRvIHRoZSBuZXcgc2NyZWVuXG4gICAqL1xuICBzaG93U2NyZWVuIChpZCwgdHJhbnNpdGlvbiA9IG51bGwsIG9wdGlvbnMgPSBudWxsKSB7XG4gICAgaWYgKCF0aGlzLml0ZW1zW2lkXSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NjcmVlbk5hdmlnYXRvciAtIHRoZSBpdGVtIHdpdGggdGhlIGlkICcgKyBpZCArICcgZG9lc25cXCd0IGV4aXN0Jyk7XG4gICAgfVxuICAgIGlmICh0aGlzLnRyYW5zaXRpb24pe1xuICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSh0cnVlKTtcbiAgICB9IFxuICBcbiAgICBpZiAodGhpcy5jdXJyZW50U2NyZWVuKXtcbiAgICAgIHRoaXMucHJldmlvdXNJdGVtSWQgPSB0aGlzLmN1cnJlbnRJdGVtSWQ7XG4gICAgICB0aGlzLnByZXZpb3VzU2NyZWVuID0gdGhpcy5jdXJyZW50U2NyZWVuO1xuICAgIH1cbiAgXG4gICAgdGhpcy5jdXJyZW50SXRlbUlkID0gaWQ7XG4gIFxuICAgIHRoaXMub25TY3JlZW5DaGFuZ2UoKTtcbiAgXG4gICAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvbiwgb3B0aW9ucyk7XG5cbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uLnByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogXG4gICAqIEBwYXJhbSB7QVRyYW5zaXRpb259IHRyYW5zaXRpb24gLSBvcHRpb25hbCB0cmFuc2l0aW9uLCBpZiBub3QgcHJvdmlkZWQgdGhlIGRlZmF1bHQgdHJhbnNpdGlvbiB3aWxsIGJlIGFwcGxpZWRcbiAgICovXG4gIGNsZWFyU2NyZWVuICh0cmFuc2l0aW9uID0gbnVsbCkge1xuICAgIGlmICghdGhpcy5jdXJyZW50U2NyZWVuKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIFxuICAgIHRoaXMucHJldmlvdXNJdGVtSWQgPSB0aGlzLmN1cnJlbnRJdGVtSWQ7XG4gICAgdGhpcy5wcmV2aW91c1NjcmVlbiA9IHRoaXMuY3VycmVudFNjcmVlbjtcbiAgXG4gICAgdGhpcy5jdXJyZW50SXRlbUlkID0gbnVsbDtcbiAgXG4gICAgdGhpcy5vblNjcmVlbkNoYW5nZSgpO1xuICBcbiAgICB0aGlzLnN0YXJ0VHJhbnNpdGlvbih0cmFuc2l0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIFxuICAgKiBAcGFyYW0ge29iamVjdH0gc2NyZWVuXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2VEaXNwb3NlIFxuICAgKi9cbiAgZGlzcG9zZVNjcmVlbiAoaWQsIHNjcmVlbiwgZm9yY2VEaXNwb3NlID0gZmFsc2UpIHtcbiAgICBpZiAoIXNjcmVlbikgcmV0dXJuO1xuICAgIFxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLml0ZW1zW2lkXTtcblxuICAgIGlmICghaXRlbSkgcmV0dXJuO1xuXG4gICAgaXRlbS5kaXNwb3NlU2NyZWVuKHNjcmVlbiwgZm9yY2VEaXNwb3NlKTtcbiAgfVxuXG4gIGRpc3Bvc2VQcmV2aW91c1NjcmVlbiAoKSB7XG4gICAgaWYgKCF0aGlzLnByZXZpb3VzU2NyZWVuKSByZXR1cm47XG4gIFxuICAgIHRoaXMuZGlzcG9zZVNjcmVlbih0aGlzLnByZXZpb3VzSXRlbUlkLCB0aGlzLnByZXZpb3VzU2NyZWVuKTtcbiAgXG4gICAgdGhpcy5wcmV2aW91c1NjcmVlbiA9IG51bGw7XG4gIH1cblxuICBkaXNwb3NlQ3VycmVudFNjcmVlbiAoKSB7XG4gICAgaWYgKCF0aGlzLmN1cnJlbnRTY3JlZW4pIHJldHVybjtcbiAgXG4gICAgdGhpcy5kaXNwb3NlU2NyZWVuKHRoaXMuY3VycmVudEl0ZW1JZCwgdGhpcy5jdXJyZW50U2NyZWVuKTtcbiAgXG4gICAgdGhpcy5jdXJyZW50U2NyZWVuID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBcbiAgICogQHBhcmFtIHtBVHJhbnNpdGlvbn0gdHJhbnNpdGlvbiBcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgXG4gICAqL1xuICBzdGFydFRyYW5zaXRpb24gKHRyYW5zaXRpb24gPSBudWxsLCBvcHRpb25zID0gbnVsbCkge1xuICAgIGNvbnN0IHRyYW5zaXRpb25DbGFzcyA9IHRyYW5zaXRpb24gfHwgdGhpcy50cmFuc2l0aW9uVHlwZTtcbiAgICBjb25zdCBjdXJyZW50SXRlbSA9IHRoaXMuaXRlbXNbdGhpcy5jdXJyZW50SXRlbUlkXTtcbiAgXG4gICAgaWYgKG9wdGlvbnMpIGN1cnJlbnRJdGVtLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gIFxuICAgIHRoaXMuY3VycmVudFNjcmVlbiA9IGN1cnJlbnRJdGVtID8gY3VycmVudEl0ZW0uZ2V0U2NyZWVuKG9wdGlvbnMpIDogbnVsbDtcbiAgXG4gICAgdGhpcy5lbWl0KCd0cmFuc2l0aW9uU3RhcnQnKTtcbiAgXG4gICAgdGhpcy50cmFuc2l0aW9uID0gbmV3IHRyYW5zaXRpb25DbGFzcyh0aGlzLmN1cnJlbnRTY3JlZW4sIHRoaXMucHJldmlvdXNTY3JlZW4pO1xuXG4gICAgdGhpcy50cmFuc2l0aW9uLnByb21pc2UudGhlbih0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgb25TY3JlZW5DaGFuZ2UgKCkge1xuICAgIHRoaXMuZW1pdCgnc2NyZWVuQ2hhbmdlJyk7XG4gIH1cblxuICAvKipcbiAgICogXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2FuY2VsVHJhbnNpdGlvbiBcbiAgICovXG4gIG9uVHJhbnNpdGlvbkNvbXBsZXRlIChjYW5jZWxUcmFuc2l0aW9uID0gZmFsc2UpIHtcbiAgICBpZiAoY2FuY2VsVHJhbnNpdGlvbiAmJiB0aGlzLnRyYW5zaXRpb24pe1xuICAgICAgdGhpcy50cmFuc2l0aW9uLmNhbmNlbCgpO1xuICAgIH1cblxuICAgIHRoaXMudHJhbnNpdGlvbiA9IG51bGw7XG4gICAgXG4gICAgdGhpcy5kaXNwb3NlUHJldmlvdXNTY3JlZW4oKTtcbiAgXG4gICAgaWYgKGNhbmNlbFRyYW5zaXRpb24pe1xuICAgICAgdGhpcy5lbWl0KCd0cmFuc2l0aW9uQ2FuY2VsJyk7XG4gICAgfWVsc2V7XG4gICAgICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25Db21wbGV0ZScpO1xuICAgIH1cbiAgfVxufVxuXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JlZW5OYXZpZ2F0b3JJdGVtIHtcbiAgY29uc3RydWN0b3IgKHNjcmVlbiwgb3B0aW9ucykge1xuICAgIHRoaXMuc2NyZWVuID0gc2NyZWVuO1xuXG4gICAgdGhpcy5pc0luc3RhbmNlID0gdHlwZW9mIHNjcmVlbiAhPT0gJ2Z1bmN0aW9uJztcbiAgICB0aGlzLmludGVybmFsSW5zdGFuY2UgPSBudWxsO1xuXG4gICAgLy8gZGVmYXVsdCBvcHRpb25zXG4gICAgdGhpcy5hcmd1bWVudHMgPSBudWxsO1xuICAgIHRoaXMucHJvcGVydGllcyA9IG51bGw7XG4gICAgdGhpcy5jYW5EaXNwb3NlID0gIXRoaXMuaXNJbnN0YW5jZTtcbiAgICB0aGlzLmV2ZW50cyA9IG51bGw7XG5cbiAgICB0aGlzLmhhc0V2ZW50c0xpc3RlbmVycyA9IGZhbHNlO1xuXG4gICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICB9XG4gIFxuICBzZXRPcHRpb25zIChvcHRpb25zKSB7XG4gICAgZm9yIChsZXQgb3B0aW9uS2V5IGluIG9wdGlvbnMpe1xuICAgICAgaWYgKHR5cGVvZiB0aGlzW29wdGlvbktleV0gIT09ICd1bmRlZmluZWQnKSB0aGlzW29wdGlvbktleV0gPSBvcHRpb25zW29wdGlvbktleV07XG4gICAgfVxuICB9XG5cbiAgZ2V0U2NyZWVuICgpIHtcbiAgICBsZXQgaW5zdGFuY2U7XG5cbiAgICBpZiAodGhpcy5pc0luc3RhbmNlKXtcbiAgICAgIGluc3RhbmNlID0gdGhpcy5zY3JlZW47XG4gICAgfSBlbHNlIGlmICh0aGlzLmludGVybmFsSW5zdGFuY2Upe1xuICAgICAgaW5zdGFuY2UgPSB0aGlzLmludGVybmFsSW5zdGFuY2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmFyZ3VtZW50cyB8fCBbXTtcblxuICAgICAgaW5zdGFuY2UgPSBuZXcgdGhpcy5zY3JlZW4oLi4uYXJncyk7XG5cbiAgICAgIGlmICghdGhpcy5jYW5EaXNwb3NlKSB0aGlzLmludGVybmFsSW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wZXJ0aWVzKXtcbiAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnByb3BlcnRpZXMpe1xuICAgICAgICBpbnN0YW5jZVtrZXldID0gdGhpcy5wcm9wZXJ0aWVzW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZXZlbnRzKSB0aGlzLmFkZEV2ZW50c0xpc3RlbmVycyhpbnN0YW5jZSk7XG5cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICBhZGRFdmVudHNMaXN0ZW5lcnMgKGluc3RhbmNlKSB7XG4gICAgaWYgKCF0aGlzLmNhbkRpc3Bvc2Upe1xuICAgICAgaWYgKHRoaXMuaGFzRXZlbnRzTGlzdGVuZXJzKSByZXR1cm47XG4gIFxuICAgICAgdGhpcy5oYXNFdmVudHNMaXN0ZW5lcnMgPSB0cnVlO1xuICAgIH1cbiAgXG4gICAgZm9yIChsZXQgZXZlbnROYW1lIGluIHRoaXMuZXZlbnRzKXtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgIGluc3RhbmNlLm9uKGV2ZW50TmFtZSwgdGhpcy5ldmVudHNbZXZlbnROYW1lXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRXZlbnRzTGlzdGVuZXJzIChpbnN0YW5jZSkge1xuICAgIHRoaXMuaGFzRXZlbnRzTGlzdGVuZXJzID0gZmFsc2U7XG5cbiAgICBmb3IgKGxldCBldmVudE5hbWUgaW4gdGhpcy5ldmVudHMpe1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLmV2ZW50c1tldmVudE5hbWVdID09PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgaW5zdGFuY2Uub2ZmKGV2ZW50TmFtZSwgdGhpcy5ldmVudHNbZXZlbnROYW1lXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGlzcG9zZVNjcmVlbiAoaW5zdGFuY2UsIGZvcmNlRGlzcG9zZSA9IGZhbHNlKSB7XG4gICAgaWYgKHRoaXMuZXZlbnRzKSB0aGlzLnJlbW92ZUV2ZW50c0xpc3RlbmVycyhpbnN0YW5jZSk7XG5cbiAgICBpZiAoIWZvcmNlRGlzcG9zZSAmJiAhdGhpcy5jYW5EaXNwb3NlKSByZXR1cm47XG5cbiAgICBpZiAodHlwZW9mIGluc3RhbmNlLmRpc3Bvc2UgPT09ICdmdW5jdGlvbicpIGluc3RhbmNlLmRpc3Bvc2UoKTtcblxuICAgIHRoaXMuaW50ZXJuYWxJbnN0YW5jZSA9IG51bGw7XG4gIH1cblxuICBkaXNwb3NlIChmb3JjZURpc3Bvc2UgPSB0cnVlKSB7XG4gICAgbGV0IGluc3RhbmNlID0gdGhpcy5pc0luc3RhbmNlID8gdGhpcy5zY3JlZW4gOiB0aGlzLmludGVybmFsSW5zdGFuY2U7XG5cbiAgICBpZiAoaW5zdGFuY2Upe1xuICAgICAgdGhpcy5kaXNwb3NlU2NyZWVuKGluc3RhbmNlLCBmb3JjZURpc3Bvc2UpO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLnNjcmVlbiA9IFxuICAgIHRoaXMuaW50ZXJuYWxJbnN0YW5jZSA9IFxuICAgIHRoaXMuYXJndW1lbnRzID0gXG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gXG4gICAgdGhpcy5ldmVudHMgPSBcbiAgICBudWxsO1xuICB9XG59XG5cbiIsImltcG9ydCBOb25lIGZyb20gJy4vdHJhbnNpdGlvbnMvTm9uZS5qcyc7XG5pbXBvcnQgSW4gZnJvbSAnLi90cmFuc2l0aW9ucy9Jbi5qcyc7XG5pbXBvcnQgT3V0IGZyb20gJy4vdHJhbnNpdGlvbnMvT3V0LmpzJztcbmltcG9ydCBPdXRBbmRJbiBmcm9tICcuL3RyYW5zaXRpb25zL091dEFuZEluLmpzJztcbmltcG9ydCBPdXRUaGVuSW4gZnJvbSAnLi90cmFuc2l0aW9ucy9PdXRUaGVuSW4uanMnO1xuaW1wb3J0IEluVGhlbk91dCBmcm9tICcuL3RyYW5zaXRpb25zL0luVGhlbk91dC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtOb25lLCBJbiwgT3V0LCBJblRoZW5PdXQsIE91dEFuZEluLCBPdXRUaGVuSW59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQVRyYW5zaXRpb24ge1xuICAgIGNvbnN0cnVjdG9yIChuZXdTY3JlZW4sIG9sZFNjcmVlbikge1xuICAgICAgICB0aGlzLm5ld1NjcmVlbiA9IG5ld1NjcmVlbjtcbiAgICAgICAgdGhpcy5vbGRTY3JlZW4gPSBvbGRTY3JlZW47XG5cbiAgICAgICAgdGhpcy5wcm9taXNlID0gdGhpcy5jcmVhdGVQcm9taXNlKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlUHJvbWlzZSAoKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICBjYW5jZWxQcm9taXNlICgpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCdjYW5jZWwgdHJhbnNpdGlvbicpLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge30pO1xuICAgIH1cblxuICAgIGNhbmNlbCAoKSB7XG4gICAgICAgIHRoaXMuY2FuY2VsUHJvbWlzZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLm9sZFNjcmVlbikgdGhpcy5vbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAodGhpcy5uZXdTY3JlZW4pIHRoaXMubmV3U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcbiAgICB9XG59IiwiaW1wb3J0IEFUcmFuc2l0aW9uIGZyb20gJy4vQVRyYW5zaXRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbiBleHRlbmRzIEFUcmFuc2l0aW9uIHtcblx0Y3JlYXRlUHJvbWlzZSAoKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHQudGhlbih0aGlzLm5ld1NjcmVlbiAmJiB0aGlzLm5ld1NjcmVlbi5hbmltYXRlSW4uYmluZCh0aGlzLm5ld1NjcmVlbiksIHRoaXMuY2FuY2VsUHJvbWlzZSlcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0aWYgKHRoaXMub2xkU2NyZWVuKSB0aGlzLm9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cdFx0XHR9LCB0aGlzLmNhbmNlbFByb21pc2UpO1xuXHR9XG59IiwiaW1wb3J0IEFUcmFuc2l0aW9uIGZyb20gJy4vQVRyYW5zaXRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJblRoZW5PdXQgZXh0ZW5kcyBBVHJhbnNpdGlvbiB7XG5cdGNyZWF0ZVByb21pc2UgKCkge1xuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuXHRcdFx0LnRoZW4odGhpcy5uZXdTY3JlZW4gJiYgdGhpcy5uZXdTY3JlZW4uYW5pbWF0ZUluLmJpbmQodGhpcy5uZXdTY3JlZW4pLCBjYW5jZWxQcm9taXNlKVxuXHRcdFx0LnRoZW4odGhpcy5vbGRTY3JlZW4gJiYgdGhpcy5vbGRTY3JlZW4uYW5pbWF0ZU91dC5iaW5kKHRoaXMub2xkU2NyZWVuKSwgdGhpcy5jYW5jZWxQcm9taXNlKTtcblx0fVxufSIsImltcG9ydCBBVHJhbnNpdGlvbiBmcm9tICcuL0FUcmFuc2l0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9uZSBleHRlbmRzIEFUcmFuc2l0aW9uIHtcblx0Y3JlYXRlUHJvbWlzZSAoKSB7XG5cdFx0aWYgKHRoaXMub2xkU2NyZWVuKSB0aGlzLm9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cdFx0aWYgKHRoaXMubmV3U2NyZWVuKSB0aGlzLm5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblxuXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0fVxufSIsImltcG9ydCBBVHJhbnNpdGlvbiBmcm9tICcuL0FUcmFuc2l0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3V0IGV4dGVuZHMgQVRyYW5zaXRpb24ge1xuXHRjcmVhdGVQcm9taXNlICgpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcblx0XHRcdC50aGVuKHRoaXMub2xkU2NyZWVuICYmIHRoaXMub2xkU2NyZWVuLmFuaW1hdGVPdXQuYmluZCh0aGlzLm9sZFNjcmVlbiksIHRoaXMuY2FuY2VsUHJvbWlzZSlcblx0XHRcdC50aGVuKCgpID0+IHtcblx0XHRcdFx0aWYgKHRoaXMubmV3U2NyZWVuKSB0aGlzLm5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblx0XHRcdH0sIHRoaXMuY2FuY2VsUHJvbWlzZSk7XG5cdH1cbn0iLCJpbXBvcnQgQVRyYW5zaXRpb24gZnJvbSAnLi9BVHJhbnNpdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE91dEFuZEluIGV4dGVuZHMgQVRyYW5zaXRpb24ge1xuXHRjcmVhdGVQcm9taXNlICgpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoW1xuXHRcdFx0UHJvbWlzZS5yZXNvbHZlKCkudGhlbih0aGlzLm9sZFNjcmVlbiAmJiB0aGlzLm9sZFNjcmVlbi5hbmltYXRlT3V0LmJpbmQodGhpcy5vbGRTY3JlZW4pLCB0aGlzLmNhbmNlbFByb21pc2UpLFxuXHRcdFx0UHJvbWlzZS5yZXNvbHZlKCkudGhlbih0aGlzLm5ld1NjcmVlbiAmJiB0aGlzLm5ld1NjcmVlbi5hbmltYXRlSW4uYmluZCh0aGlzLm5ld1NjcmVlbiksIHRoaXMuY2FuY2VsUHJvbWlzZSksXG5cdFx0XSk7XG5cdH1cbn0iLCJpbXBvcnQgQVRyYW5zaXRpb24gZnJvbSAnLi9BVHJhbnNpdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE91dFRoZW5JbiBleHRlbmRzIEFUcmFuc2l0aW9uIHtcblx0Y3JlYXRlUHJvbWlzZSAoKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHQudGhlbih0aGlzLm9sZFNjcmVlbiAmJiB0aGlzLm9sZFNjcmVlbi5hbmltYXRlT3V0LmJpbmQodGhpcy5vbGRTY3JlZW4pLCB0aGlzLmNhbmNlbFByb21pc2UpXG5cdFx0XHQudGhlbih0aGlzLm5ld1NjcmVlbiAmJiB0aGlzLm5ld1NjcmVlbi5hbmltYXRlSW4uYmluZCh0aGlzLm5ld1NjcmVlbiksIGNhbmNlbFByb21pc2UpO1xuXHR9XG59Il19
