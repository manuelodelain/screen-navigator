(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ScreenNavigator = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
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

},{}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tinyEmitter = _dereq_('tiny-emitter');

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

},{"tiny-emitter":1}],3:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ATransition = exports.AScreen = exports.Transitions = exports.ScreenNavigatorItem = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tinyEmitter = _dereq_('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

var _ScreenNavigatorItem = _dereq_('./ScreenNavigatorItem');

var _ScreenNavigatorItem2 = _interopRequireDefault(_ScreenNavigatorItem);

var _Transitions = _dereq_('./Transitions');

var _Transitions2 = _interopRequireDefault(_Transitions);

var _AScreen = _dereq_('./AScreen');

var _AScreen2 = _interopRequireDefault(_AScreen);

var _ATransition = _dereq_('./transitions/ATransition');

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

},{"./AScreen":2,"./ScreenNavigatorItem":4,"./Transitions":5,"./transitions/ATransition":6,"tiny-emitter":1}],4:[function(_dereq_,module,exports){
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

},{}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _None = _dereq_('./transitions/None.js');

var _None2 = _interopRequireDefault(_None);

var _In = _dereq_('./transitions/In.js');

var _In2 = _interopRequireDefault(_In);

var _Out = _dereq_('./transitions/Out.js');

var _Out2 = _interopRequireDefault(_Out);

var _OutAndIn = _dereq_('./transitions/OutAndIn.js');

var _OutAndIn2 = _interopRequireDefault(_OutAndIn);

var _OutThenIn = _dereq_('./transitions/OutThenIn.js');

var _OutThenIn2 = _interopRequireDefault(_OutThenIn);

var _InThenOut = _dereq_('./transitions/InThenOut.js');

var _InThenOut2 = _interopRequireDefault(_InThenOut);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { None: _None2.default, In: _In2.default, Out: _Out2.default, InThenOut: _InThenOut2.default, OutAndIn: _OutAndIn2.default, OutThenIn: _OutThenIn2.default };

},{"./transitions/In.js":7,"./transitions/InThenOut.js":8,"./transitions/None.js":9,"./transitions/Out.js":10,"./transitions/OutAndIn.js":11,"./transitions/OutThenIn.js":12}],6:[function(_dereq_,module,exports){
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

},{}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ATransition2 = _dereq_('./ATransition');

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

},{"./ATransition":6}],8:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ATransition2 = _dereq_('./ATransition');

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
			return Promise.resolve().then(this.newScreen && this.newScreen.animateIn.bind(this.newScreen), this.cancelPromise).then(this.oldScreen && this.oldScreen.animateOut.bind(this.oldScreen), this.cancelPromise);
		}
	}]);

	return InThenOut;
}(_ATransition3.default);

exports.default = InThenOut;

},{"./ATransition":6}],9:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ATransition2 = _dereq_('./ATransition');

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

},{"./ATransition":6}],10:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ATransition2 = _dereq_('./ATransition');

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

},{"./ATransition":6}],11:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ATransition2 = _dereq_('./ATransition');

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

},{"./ATransition":6}],12:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ATransition2 = _dereq_('./ATransition');

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
			return Promise.resolve().then(this.oldScreen && this.oldScreen.animateOut.bind(this.oldScreen), this.cancelPromise).then(this.newScreen && this.newScreen.animateIn.bind(this.newScreen), this.cancelPromise);
		}
	}]);

	return OutThenIn;
}(_ATransition3.default);

exports.default = OutThenIn;

},{"./ATransition":6}]},{},[3])(3)
});
