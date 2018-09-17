(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

      return new Promise(function (resolve) {
        if (cancelTransition) _this2.cancelAnimIn(resolve);else _this2.createAnimIn(resolve);
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

      return new Promise(function (resolve) {
        if (cancelTransition) _this3.cancelAnimOut(resolve);else _this3.createAnimOut(resolve);
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
  }]);

  return AScreen;
}(_tinyEmitter2.default);

exports.default = AScreen;

},{"tiny-emitter":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AScreen = exports.Transitions = exports.ScreenNavigatorItem = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tinyEmitter = require('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

var _ScreenNavigatorItem = require('./ScreenNavigatorItem');

var _ScreenNavigatorItem2 = _interopRequireDefault(_ScreenNavigatorItem);

var _Transitions = require('./Transitions');

var _Transitions2 = _interopRequireDefault(_Transitions);

var _AScreen = require('./AScreen');

var _AScreen2 = _interopRequireDefault(_AScreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.ScreenNavigatorItem = _ScreenNavigatorItem2.default;
exports.Transitions = _Transitions2.default;
exports.AScreen = _AScreen2.default;

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

    _this.transition = ScreenNavigator.defaultTransition;
    _this.transitionRunning = false;
    _this.transitionCancel = null;
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

      if (this.transitionRunning) {
        if (this.transitionCancel) this.transitionCancel();

        this.transitionRunning = false;
      }

      this.transitionCancel = null;

      this.disposeCurrentScreen();
      this.disposePreviousScreen();

      for (var itemId in this.items) {
        this.items[itemId].dispose(forceDispose);

        this.removeScreen(itemId);
      }

      this.transition = null;
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
     * @param {function} transition - optional transition, if not provided the default transition will be applied
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

      if (this.transitionRunning) {
        this.onTransitionComplete(true);
      }

      if (this.currentScreen) {
        this.previousItemId = this.currentItemId;
        this.previousScreen = this.currentScreen;
      }

      this.currentItemId = id;

      this.onScreenChange();

      this.startTransition(transition, options);
    }

    /**
     * 
     * @param {function} transition - optional transition, if not provided the default transition will be applied
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
     * @param {boolean} forceDispose 
     */

  }, {
    key: 'disposeScreen',
    value: function disposeScreen(id) {
      var forceDispose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var item = this.items[id];

      if (!item) return;

      item.disposeScreen(forceDispose);
    }
  }, {
    key: 'disposePreviousScreen',
    value: function disposePreviousScreen() {
      if (!this.previousScreen) return;

      this.disposeScreen(this.previousItemId);

      this.previousScreen = null;
    }
  }, {
    key: 'disposeCurrentScreen',
    value: function disposeCurrentScreen() {
      if (!this.currentScreen) return;

      this.disposeScreen(this.currentItemId);

      this.currentScreen = null;
    }

    /**
     * 
     * @param {function} transition 
     * @param {object} options 
     */

  }, {
    key: 'startTransition',
    value: function startTransition() {
      var transition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      transition = transition || this.transition;

      var currentItem = this.items[this.currentItemId];

      if (options) currentItem.setOptions(options);

      this.currentScreen = currentItem ? currentItem.getScreen(options) : null;

      this.transitionRunning = true;

      this.emit('transitionStart');

      this.transitionCancel = transition(this.currentScreen, this.previousScreen, this.onTransitionComplete.bind(this));
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

      this.transitionRunning = false;

      if (cancelTransition) {
        if (this.transitionCancel) this.transitionCancel();
      }

      this.disposePreviousScreen();

      if (cancelTransition) {
        this.emit('transitionCancel');
      } else {
        this.emit('transitionComplete');
      }

      this.transitionCancel = null;
    }
  }]);

  return ScreenNavigator;
}(_tinyEmitter2.default);

ScreenNavigator.defaultTransition = _Transitions2.default.None;
exports.default = ScreenNavigator;

},{"./AScreen":2,"./ScreenNavigatorItem":4,"./Transitions":5,"tiny-emitter":1}],4:[function(require,module,exports){
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

},{"./transitions/In.js":6,"./transitions/InThenOut.js":7,"./transitions/None.js":8,"./transitions/Out.js":9,"./transitions/OutAndIn.js":10,"./transitions/OutThenIn.js":11}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (newScreen, oldScreen, completeCallback) {
	function cancelPromise() {
		return Promise.reject('cancel transition').catch(function (error) {});
	};

	Promise.resolve().then(newScreen && newScreen.animateIn.bind(newScreen), cancelPromise).then(function () {
		if (oldScreen) oldScreen.animateOut();

		completeCallback();
	}, cancelPromise);

	return function cancel() {
		cancelPromise();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};

;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (newScreen, oldScreen, completeCallback) {
	function cancelPromise() {
		return Promise.reject('cancel transition').catch(function (error) {});
	};

	Promise.resolve().then(newScreen && newScreen.animateIn.bind(newScreen), cancelPromise).then(oldScreen && oldScreen.animateOut.bind(oldScreen), cancelPromise).then(completeCallback, cancelPromise);

	return function cancel() {
		cancelPromise();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};

;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (newScreen, oldScreen, completeCallback) {
	if (oldScreen) oldScreen.animateOut();
	if (newScreen) newScreen.animateIn();

	completeCallback();

	return function cancel() {};
};

;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (newScreen, oldScreen, completeCallback) {
	function cancelPromise() {
		return Promise.reject('cancel transition').catch(function (error) {});
	};

	Promise.resolve().then(oldScreen && oldScreen.animateOut.bind(oldScreen), cancelPromise).then(function () {
		if (newScreen) newScreen.animateIn();

		completeCallback();
	}, cancelPromise);

	return function cancel() {
		cancelPromise();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};

;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (newScreen, oldScreen, completeCallback) {
	function cancelPromise() {
		return Promise.reject('cancel transition').catch(function (error) {});
	};

	Promise.all([Promise.resolve().then(oldScreen && oldScreen.animateOut.bind(oldScreen), cancelPromise), Promise.resolve().then(newScreen && newScreen.animateIn.bind(newScreen), cancelPromise)]).then(completeCallback);

	return function cancel() {
		cancelPromise();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};

;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (newScreen, oldScreen, completeCallback) {
	function cancelPromise() {
		return Promise.reject('cancel transition').catch(function (error) {});
	};

	Promise.resolve().then(oldScreen && oldScreen.animateOut.bind(oldScreen), cancelPromise).then(newScreen && newScreen.animateIn.bind(newScreen), cancelPromise).then(completeCallback, cancelPromise);

	return function cancel() {
		cancelPromise();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};

;

},{}],12:[function(require,module,exports){
'use strict';

var _ScreenNavigator = require('./src/ScreenNavigator');

var _ScreenNavigator2 = _interopRequireDefault(_ScreenNavigator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_ScreenNavigator2.default.Transitions = _ScreenNavigator.Transitions;
_ScreenNavigator2.default.AScreen = _ScreenNavigator.AScreen;
_ScreenNavigator2.default.ScreenNavigatorItem = _ScreenNavigator.ScreenNavigatorItem;

window.ScreenNavigator = _ScreenNavigator2.default;

},{"./src/ScreenNavigator":3}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdGlueS1lbWl0dGVyL2luZGV4LmpzIiwic3JjL0FTY3JlZW4uanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9yLmpzIiwic3JjL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMiLCJzcmMvVHJhbnNpdGlvbnMuanMiLCJzcmMvdHJhbnNpdGlvbnMvSW4uanMiLCJzcmMvdHJhbnNpdGlvbnMvSW5UaGVuT3V0LmpzIiwic3JjL3RyYW5zaXRpb25zL05vbmUuanMiLCJzcmMvdHJhbnNpdGlvbnMvT3V0LmpzIiwic3JjL3RyYW5zaXRpb25zL091dEFuZEluLmpzIiwic3JjL3RyYW5zaXRpb25zL091dFRoZW5Jbi5qcyIsInN0YW5kYWxvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ2xFQTs7Ozs7Ozs7Ozs7O0lBRXFCLE87Ozs7Ozs7Ozs7OzhCQUNSLENBQ1Y7OztnQ0FFb0M7QUFBQTs7QUFBQSxVQUExQixnQkFBMEIsdUVBQVAsS0FBTzs7QUFDbkMsYUFBTyxJQUFJLE9BQUosQ0FBWSxtQkFBVztBQUM1QixZQUFJLGdCQUFKLEVBQXNCLE9BQUss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QUNBLDBCQUFnQixPQUFoQixHQUEwQix3QkFBMUI7QUFDQSwwQkFBZ0IsbUJBQWhCLEdBQXNDLG9DQUF0Qzs7QUFFQSxPQUFPLGVBQVAsR0FBeUIseUJBQXpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZnVuY3Rpb24gRSAoKSB7XG4gIC8vIEtlZXAgdGhpcyBlbXB0eSBzbyBpdCdzIGVhc2llciB0byBpbmhlcml0IGZyb21cbiAgLy8gKHZpYSBodHRwczovL2dpdGh1Yi5jb20vbGlwc21hY2sgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2lzc3Vlcy8zKVxufVxuXG5FLnByb3RvdHlwZSA9IHtcbiAgb246IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcblxuICAgIChlW25hbWVdIHx8IChlW25hbWVdID0gW10pKS5wdXNoKHtcbiAgICAgIGZuOiBjYWxsYmFjayxcbiAgICAgIGN0eDogY3R4XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvbmNlOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBmdW5jdGlvbiBsaXN0ZW5lciAoKSB7XG4gICAgICBzZWxmLm9mZihuYW1lLCBsaXN0ZW5lcik7XG4gICAgICBjYWxsYmFjay5hcHBseShjdHgsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIGxpc3RlbmVyLl8gPSBjYWxsYmFja1xuICAgIHJldHVybiB0aGlzLm9uKG5hbWUsIGxpc3RlbmVyLCBjdHgpO1xuICB9LFxuXG4gIGVtaXQ6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIGRhdGEgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGV2dEFyciA9ICgodGhpcy5lIHx8ICh0aGlzLmUgPSB7fSkpW25hbWVdIHx8IFtdKS5zbGljZSgpO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbGVuID0gZXZ0QXJyLmxlbmd0aDtcblxuICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBldnRBcnJbaV0uZm4uYXBwbHkoZXZ0QXJyW2ldLmN0eCwgZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb2ZmOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuICAgIHZhciBldnRzID0gZVtuYW1lXTtcbiAgICB2YXIgbGl2ZUV2ZW50cyA9IFtdO1xuXG4gICAgaWYgKGV2dHMgJiYgY2FsbGJhY2spIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBldnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChldnRzW2ldLmZuICE9PSBjYWxsYmFjayAmJiBldnRzW2ldLmZuLl8gIT09IGNhbGxiYWNrKVxuICAgICAgICAgIGxpdmVFdmVudHMucHVzaChldnRzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgZXZlbnQgZnJvbSBxdWV1ZSB0byBwcmV2ZW50IG1lbW9yeSBsZWFrXG4gICAgLy8gU3VnZ2VzdGVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9sYXpkXG4gICAgLy8gUmVmOiBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2NvbW1pdC9jNmViZmFhOWJjOTczYjMzZDExMGE4NGEzMDc3NDJiN2NmOTRjOTUzI2NvbW1pdGNvbW1lbnQtNTAyNDkxMFxuXG4gICAgKGxpdmVFdmVudHMubGVuZ3RoKVxuICAgICAgPyBlW25hbWVdID0gbGl2ZUV2ZW50c1xuICAgICAgOiBkZWxldGUgZVtuYW1lXTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEU7XG4iLCJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ3RpbnktZW1pdHRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFTY3JlZW4gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBkaXNwb3NlICgpIHtcbiAgfVxuXG4gIGFuaW1hdGVJbiAoY2FuY2VsVHJhbnNpdGlvbiA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgaWYgKGNhbmNlbFRyYW5zaXRpb24pIHRoaXMuY2FuY2VsQW5pbUluKHJlc29sdmUpO1xuICAgICAgZWxzZSB0aGlzLmNyZWF0ZUFuaW1JbihyZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZUFuaW1JbiAocmVzb2x2ZVByb21pc2UpIHtcbiAgICByZXNvbHZlUHJvbWlzZSgpO1xuICB9XG5cbiAgY2FuY2VsQW5pbUluIChyZXNvbHZlUHJvbWlzZSkge1xuICAgIHJlc29sdmVQcm9taXNlKCk7XG4gIH1cbiAgXG4gIGFuaW1hdGVPdXQgKGNhbmNlbFRyYW5zaXRpb24gPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGlmIChjYW5jZWxUcmFuc2l0aW9uKSB0aGlzLmNhbmNlbEFuaW1PdXQocmVzb2x2ZSk7XG4gICAgICBlbHNlIHRoaXMuY3JlYXRlQW5pbU91dChyZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZUFuaW1PdXQgKHJlc29sdmVQcm9taXNlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UoKTtcbiAgfVxuXG4gIGNhbmNlbEFuaW1PdXQgKHJlc29sdmVQcm9taXNlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UoKTtcbiAgfVxufVxuXG4iLCJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ3RpbnktZW1pdHRlcic7XG5pbXBvcnQgU2NyZWVuTmF2aWdhdG9ySXRlbSBmcm9tICcuL1NjcmVlbk5hdmlnYXRvckl0ZW0nO1xuaW1wb3J0IFRyYW5zaXRpb25zIGZyb20gJy4vVHJhbnNpdGlvbnMnO1xuaW1wb3J0IEFTY3JlZW4gZnJvbSAnLi9BU2NyZWVuJ1xuXG5leHBvcnQge1NjcmVlbk5hdmlnYXRvckl0ZW0sIFRyYW5zaXRpb25zLCBBU2NyZWVufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JlZW5OYXZpZ2F0b3IgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBzdGF0aWMgZGVmYXVsdFRyYW5zaXRpb24gPSBUcmFuc2l0aW9ucy5Ob25lO1xuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpO1xuICAgIFxuICAgIHRoaXMuaXRlbXMgPSB7fTtcblxuICAgIHRoaXMuY3VycmVudEl0ZW1JZCA9IG51bGw7XG4gICAgdGhpcy5wcmV2aW91c0l0ZW1JZCA9IG51bGw7XG5cbiAgICB0aGlzLmN1cnJlbnRTY3JlZW4gPSBudWxsO1xuICAgIHRoaXMucHJldmlvdXNTY3JlZW4gPSBudWxsO1xuXG4gICAgdGhpcy50cmFuc2l0aW9uID0gU2NyZWVuTmF2aWdhdG9yLmRlZmF1bHRUcmFuc2l0aW9uO1xuICAgIHRoaXMudHJhbnNpdGlvblJ1bm5pbmcgPSBmYWxzZTtcbiAgICB0aGlzLnRyYW5zaXRpb25DYW5jZWwgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlRGlzcG9zZSBcbiAgICovXG4gIGRpc3Bvc2UgKGZvcmNlRGlzcG9zZSA9IHRydWUpIHtcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uUnVubmluZyl7XG4gICAgICBpZiAodGhpcy50cmFuc2l0aW9uQ2FuY2VsKSB0aGlzLnRyYW5zaXRpb25DYW5jZWwoKTtcblxuICAgICAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuICAgIH1cbiAgXG4gICAgdGhpcy50cmFuc2l0aW9uQ2FuY2VsID0gbnVsbDtcbiAgXG4gICAgdGhpcy5kaXNwb3NlQ3VycmVudFNjcmVlbigpO1xuICAgIHRoaXMuZGlzcG9zZVByZXZpb3VzU2NyZWVuKCk7XG4gIFxuICAgIGZvciAobGV0IGl0ZW1JZCBpbiB0aGlzLml0ZW1zKXtcbiAgICAgIHRoaXMuaXRlbXNbaXRlbUlkXS5kaXNwb3NlKGZvcmNlRGlzcG9zZSk7XG4gIFxuICAgICAgdGhpcy5yZW1vdmVTY3JlZW4oaXRlbUlkKTtcbiAgICB9XG4gIFxuICAgIHRoaXMudHJhbnNpdGlvbiA9IG51bGw7XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gc2NyZWVuIGlkXG4gICAqIEBwYXJhbSB7U2NyZWVuTmF2aWdhdG9ySXRlbX0gaXRlbSBcbiAgICogXG4gICAqIEByZXR1cm4ge1NjcmVlbk5hdmlnYXRvckl0ZW19IGl0ZW1cbiAgICovXG4gIGFkZFNjcmVlbiAoaWQsIGl0ZW0pIHtcbiAgICB0aGlzLml0ZW1zW2lkXSA9IGl0ZW07XG4gIFxuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIHNjcmVlbiBpZFxuICAgKi9cbiAgcmVtb3ZlU2NyZWVuIChpZCkge1xuICAgIGlmICghdGhpcy5pdGVtc1tpZF0pIHJldHVybjtcblxuICAgIGRlbGV0ZSB0aGlzLml0ZW1zW2lkXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkIC0gc2NyZWVuIGlkXG4gICAqL1xuICBnZXRTY3JlZW4gKGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXNbaWRdO1xuICB9XG5cbiAgLyoqXG4gICAqIFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgLSBzY3JlZW4gaWRcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gdHJhbnNpdGlvbiAtIG9wdGlvbmFsIHRyYW5zaXRpb24sIGlmIG5vdCBwcm92aWRlZCB0aGUgZGVmYXVsdCB0cmFuc2l0aW9uIHdpbGwgYmUgYXBwbGllZFxuICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIG9wdGlvbmFsIG9wdGlvbnMgdG8gYXBwbHkgdG8gdGhlIG5ldyBzY3JlZW5cbiAgICovXG4gIHNob3dTY3JlZW4gKGlkLCB0cmFuc2l0aW9uID0gbnVsbCwgb3B0aW9ucyA9IG51bGwpIHtcbiAgICBpZiAoIXRoaXMuaXRlbXNbaWRdKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2NyZWVuTmF2aWdhdG9yIC0gdGhlIGl0ZW0gd2l0aCB0aGUgaWQgJyArIGlkICsgJyBkb2VzblxcJ3QgZXhpc3QnKTtcbiAgICB9XG4gIFxuICAgIGlmICh0aGlzLnRyYW5zaXRpb25SdW5uaW5nKXtcbiAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUodHJ1ZSk7XG4gICAgfSBcbiAgXG4gICAgaWYgKHRoaXMuY3VycmVudFNjcmVlbil7XG4gICAgICB0aGlzLnByZXZpb3VzSXRlbUlkID0gdGhpcy5jdXJyZW50SXRlbUlkO1xuICAgICAgdGhpcy5wcmV2aW91c1NjcmVlbiA9IHRoaXMuY3VycmVudFNjcmVlbjtcbiAgICB9XG4gIFxuICAgIHRoaXMuY3VycmVudEl0ZW1JZCA9IGlkO1xuICBcbiAgICB0aGlzLm9uU2NyZWVuQ2hhbmdlKCk7XG4gIFxuICAgIHRoaXMuc3RhcnRUcmFuc2l0aW9uKHRyYW5zaXRpb24sIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSB0cmFuc2l0aW9uIC0gb3B0aW9uYWwgdHJhbnNpdGlvbiwgaWYgbm90IHByb3ZpZGVkIHRoZSBkZWZhdWx0IHRyYW5zaXRpb24gd2lsbCBiZSBhcHBsaWVkXG4gICAqL1xuICBjbGVhclNjcmVlbiAodHJhbnNpdGlvbiA9IG51bGwpIHtcbiAgICBpZiAoIXRoaXMuY3VycmVudFNjcmVlbil7XG4gICAgICByZXR1cm47XG4gICAgfVxuICBcbiAgICB0aGlzLnByZXZpb3VzSXRlbUlkID0gdGhpcy5jdXJyZW50SXRlbUlkO1xuICAgIHRoaXMucHJldmlvdXNTY3JlZW4gPSB0aGlzLmN1cnJlbnRTY3JlZW47XG4gIFxuICAgIHRoaXMuY3VycmVudEl0ZW1JZCA9IG51bGw7XG4gIFxuICAgIHRoaXMub25TY3JlZW5DaGFuZ2UoKTtcbiAgXG4gICAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZCBcbiAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZURpc3Bvc2UgXG4gICAqL1xuICBkaXNwb3NlU2NyZWVuIChpZCwgZm9yY2VEaXNwb3NlID0gZmFsc2UpIHtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5pdGVtc1tpZF07XG5cbiAgICBpZiAoIWl0ZW0pIHJldHVybjtcblxuICAgIGl0ZW0uZGlzcG9zZVNjcmVlbihmb3JjZURpc3Bvc2UpO1xuICB9XG5cbiAgZGlzcG9zZVByZXZpb3VzU2NyZWVuICgpIHtcbiAgICBpZiAoIXRoaXMucHJldmlvdXNTY3JlZW4pIHJldHVybjtcbiAgXG4gICAgdGhpcy5kaXNwb3NlU2NyZWVuKHRoaXMucHJldmlvdXNJdGVtSWQpO1xuICBcbiAgICB0aGlzLnByZXZpb3VzU2NyZWVuID0gbnVsbDtcbiAgfVxuXG4gIGRpc3Bvc2VDdXJyZW50U2NyZWVuICgpIHtcbiAgICBpZiAoIXRoaXMuY3VycmVudFNjcmVlbikgcmV0dXJuO1xuICBcbiAgICB0aGlzLmRpc3Bvc2VTY3JlZW4odGhpcy5jdXJyZW50SXRlbUlkKTtcbiAgXG4gICAgdGhpcy5jdXJyZW50U2NyZWVuID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gdHJhbnNpdGlvbiBcbiAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgXG4gICAqL1xuICBzdGFydFRyYW5zaXRpb24gKHRyYW5zaXRpb24gPSBudWxsLCBvcHRpb25zID0gbnVsbCkge1xuICAgIHRyYW5zaXRpb24gPSB0cmFuc2l0aW9uIHx8IHRoaXMudHJhbnNpdGlvbjtcbiAgXG4gICAgY29uc3QgY3VycmVudEl0ZW0gPSB0aGlzLml0ZW1zW3RoaXMuY3VycmVudEl0ZW1JZF07XG4gIFxuICAgIGlmIChvcHRpb25zKSBjdXJyZW50SXRlbS5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICBcbiAgICB0aGlzLmN1cnJlbnRTY3JlZW4gPSBjdXJyZW50SXRlbSA/IGN1cnJlbnRJdGVtLmdldFNjcmVlbihvcHRpb25zKSA6IG51bGw7XG4gIFxuICAgIHRoaXMudHJhbnNpdGlvblJ1bm5pbmcgPSB0cnVlO1xuICBcbiAgICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25TdGFydCcpO1xuICBcbiAgICB0aGlzLnRyYW5zaXRpb25DYW5jZWwgPSB0cmFuc2l0aW9uKHRoaXMuY3VycmVudFNjcmVlbiwgdGhpcy5wcmV2aW91c1NjcmVlbiwgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIG9uU2NyZWVuQ2hhbmdlICgpIHtcbiAgICB0aGlzLmVtaXQoJ3NjcmVlbkNoYW5nZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNhbmNlbFRyYW5zaXRpb24gXG4gICAqL1xuICBvblRyYW5zaXRpb25Db21wbGV0ZSAoY2FuY2VsVHJhbnNpdGlvbiA9IGZhbHNlKSB7XG4gICAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuICBcbiAgICBpZiAoY2FuY2VsVHJhbnNpdGlvbil7XG4gICAgICBpZiAodGhpcy50cmFuc2l0aW9uQ2FuY2VsKSB0aGlzLnRyYW5zaXRpb25DYW5jZWwoKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5kaXNwb3NlUHJldmlvdXNTY3JlZW4oKTtcbiAgXG4gICAgICBpZiAoY2FuY2VsVHJhbnNpdGlvbil7XG4gICAgICAgIHRoaXMuZW1pdCgndHJhbnNpdGlvbkNhbmNlbCcpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMuZW1pdCgndHJhbnNpdGlvbkNvbXBsZXRlJyk7XG4gICAgICB9XG4gIFxuICAgIHRoaXMudHJhbnNpdGlvbkNhbmNlbCA9IG51bGw7XG4gIH1cbn1cblxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyZWVuTmF2aWdhdG9ySXRlbSB7XG4gIGNvbnN0cnVjdG9yIChzY3JlZW4sIG9wdGlvbnMpIHtcbiAgICB0aGlzLnNjcmVlbiA9IHNjcmVlbjtcblxuICAgIHRoaXMuaXNJbnN0YW5jZSA9IHR5cGVvZiBzY3JlZW4gIT09ICdmdW5jdGlvbic7XG4gICAgdGhpcy5pbnRlcm5hbEluc3RhbmNlID0gbnVsbDtcblxuICAgIC8vIGRlZmF1bHQgb3B0aW9uc1xuICAgIHRoaXMuYXJndW1lbnRzID0gbnVsbDtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBudWxsO1xuICAgIHRoaXMuY2FuRGlzcG9zZSA9ICF0aGlzLmlzSW5zdGFuY2U7XG4gICAgdGhpcy5ldmVudHMgPSBudWxsO1xuXG4gICAgdGhpcy5oYXNFdmVudHNMaXN0ZW5lcnMgPSBmYWxzZTtcblxuICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgfVxuICBcbiAgc2V0T3B0aW9ucyAob3B0aW9ucykge1xuICAgIGZvciAobGV0IG9wdGlvbktleSBpbiBvcHRpb25zKXtcbiAgICAgIGlmICh0eXBlb2YgdGhpc1tvcHRpb25LZXldICE9PSAndW5kZWZpbmVkJykgdGhpc1tvcHRpb25LZXldID0gb3B0aW9uc1tvcHRpb25LZXldO1xuICAgIH1cbiAgfVxuXG4gIGdldFNjcmVlbiAoKSB7XG4gICAgbGV0IGluc3RhbmNlO1xuXG4gICAgaWYgKHRoaXMuaXNJbnN0YW5jZSl7XG4gICAgICBpbnN0YW5jZSA9IHRoaXMuc2NyZWVuO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pbnRlcm5hbEluc3RhbmNlKXtcbiAgICAgIGluc3RhbmNlID0gdGhpcy5pbnRlcm5hbEluc3RhbmNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhcmdzID0gdGhpcy5hcmd1bWVudHMgfHwgW107XG5cbiAgICAgIGluc3RhbmNlID0gbmV3IHRoaXMuc2NyZWVuKC4uLmFyZ3MpO1xuXG4gICAgICBpZiAoIXRoaXMuY2FuRGlzcG9zZSkgdGhpcy5pbnRlcm5hbEluc3RhbmNlID0gaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcGVydGllcyl7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5wcm9wZXJ0aWVzKXtcbiAgICAgICAgaW5zdGFuY2Vba2V5XSA9IHRoaXMucHJvcGVydGllc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmV2ZW50cykgdGhpcy5hZGRFdmVudHNMaXN0ZW5lcnMoaW5zdGFuY2UpO1xuXG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG5cbiAgYWRkRXZlbnRzTGlzdGVuZXJzIChpbnN0YW5jZSkge1xuICAgIGlmICghdGhpcy5jYW5EaXNwb3NlKXtcbiAgICAgIGlmICh0aGlzLmhhc0V2ZW50c0xpc3RlbmVycykgcmV0dXJuO1xuICBcbiAgICAgIHRoaXMuaGFzRXZlbnRzTGlzdGVuZXJzID0gdHJ1ZTtcbiAgICB9XG4gIFxuICAgIGZvciAobGV0IGV2ZW50TmFtZSBpbiB0aGlzLmV2ZW50cyl7XG4gICAgICBpZiAodHlwZW9mIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPT09ICdmdW5jdGlvbicpe1xuICAgICAgICBpbnN0YW5jZS5vbihldmVudE5hbWUsIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUV2ZW50c0xpc3RlbmVycyAoaW5zdGFuY2UpIHtcbiAgICB0aGlzLmhhc0V2ZW50c0xpc3RlbmVycyA9IGZhbHNlO1xuXG4gICAgZm9yIChsZXQgZXZlbnROYW1lIGluIHRoaXMuZXZlbnRzKXtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgIGluc3RhbmNlLm9mZihldmVudE5hbWUsIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRpc3Bvc2VTY3JlZW4gKGluc3RhbmNlLCBmb3JjZURpc3Bvc2UgPSBmYWxzZSkge1xuICAgIGlmICh0aGlzLmV2ZW50cykgdGhpcy5yZW1vdmVFdmVudHNMaXN0ZW5lcnMoaW5zdGFuY2UpO1xuXG4gICAgaWYgKCFmb3JjZURpc3Bvc2UgJiYgIXRoaXMuY2FuRGlzcG9zZSkgcmV0dXJuO1xuXG4gICAgaWYgKHR5cGVvZiBpbnN0YW5jZS5kaXNwb3NlID09PSAnZnVuY3Rpb24nKSBpbnN0YW5jZS5kaXNwb3NlKCk7XG5cbiAgICB0aGlzLmludGVybmFsSW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgZGlzcG9zZSAoZm9yY2VEaXNwb3NlID0gdHJ1ZSkge1xuICAgIGxldCBpbnN0YW5jZSA9IHRoaXMuaXNJbnN0YW5jZSA/IHRoaXMuc2NyZWVuIDogdGhpcy5pbnRlcm5hbEluc3RhbmNlO1xuXG4gICAgaWYgKGluc3RhbmNlKXtcbiAgICAgIHRoaXMuZGlzcG9zZVNjcmVlbihpbnN0YW5jZSwgZm9yY2VEaXNwb3NlKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5zY3JlZW4gPSBcbiAgICB0aGlzLmludGVybmFsSW5zdGFuY2UgPSBcbiAgICB0aGlzLmFyZ3VtZW50cyA9IFxuICAgIHRoaXMucHJvcGVydGllcyA9IFxuICAgIHRoaXMuZXZlbnRzID0gXG4gICAgbnVsbDtcbiAgfVxufVxuXG4iLCJpbXBvcnQgTm9uZSBmcm9tICcuL3RyYW5zaXRpb25zL05vbmUuanMnO1xuaW1wb3J0IEluIGZyb20gJy4vdHJhbnNpdGlvbnMvSW4uanMnO1xuaW1wb3J0IE91dCBmcm9tICcuL3RyYW5zaXRpb25zL091dC5qcyc7XG5pbXBvcnQgT3V0QW5kSW4gZnJvbSAnLi90cmFuc2l0aW9ucy9PdXRBbmRJbi5qcyc7XG5pbXBvcnQgT3V0VGhlbkluIGZyb20gJy4vdHJhbnNpdGlvbnMvT3V0VGhlbkluLmpzJztcbmltcG9ydCBJblRoZW5PdXQgZnJvbSAnLi90cmFuc2l0aW9ucy9JblRoZW5PdXQuanMnO1xuXG5leHBvcnQgZGVmYXVsdCB7Tm9uZSwgSW4sIE91dCwgSW5UaGVuT3V0LCBPdXRBbmRJbiwgT3V0VGhlbklufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKSB7XG5cdGZ1bmN0aW9uIGNhbmNlbFByb21pc2UoKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KCdjYW5jZWwgdHJhbnNpdGlvbicpLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge30pO1xuXHR9O1xuXG5cdFByb21pc2UucmVzb2x2ZSgpXG5cdFx0LnRoZW4obmV3U2NyZWVuICYmIG5ld1NjcmVlbi5hbmltYXRlSW4uYmluZChuZXdTY3JlZW4pLCBjYW5jZWxQcm9taXNlKVxuXHRcdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cblx0XHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0XHR9LCBjYW5jZWxQcm9taXNlKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7XG5cdFx0Y2FuY2VsUHJvbWlzZSgpO1xuXHRcdFxuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KHRydWUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4odHJ1ZSk7XG5cdH07XG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKSB7XG5cdGZ1bmN0aW9uIGNhbmNlbFByb21pc2UoKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KCdjYW5jZWwgdHJhbnNpdGlvbicpLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge30pO1xuXHR9O1xuXG5cdFByb21pc2UucmVzb2x2ZSgpXG5cdFx0LnRoZW4obmV3U2NyZWVuICYmIG5ld1NjcmVlbi5hbmltYXRlSW4uYmluZChuZXdTY3JlZW4pLCBjYW5jZWxQcm9taXNlKVxuXHRcdC50aGVuKG9sZFNjcmVlbiAmJiBvbGRTY3JlZW4uYW5pbWF0ZU91dC5iaW5kKG9sZFNjcmVlbiksIGNhbmNlbFByb21pc2UpXG5cdFx0LnRoZW4oY29tcGxldGVDYWxsYmFjaywgY2FuY2VsUHJvbWlzZSk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCgpe1xuXHRcdGNhbmNlbFByb21pc2UoKTtcblxuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KHRydWUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4odHJ1ZSk7XG5cdH07XG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKSB7XG5cdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblxuXHRjb21wbGV0ZUNhbGxiYWNrKCk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCAoKSB7fTtcbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIGNvbXBsZXRlQ2FsbGJhY2spIHtcblx0ZnVuY3Rpb24gY2FuY2VsUHJvbWlzZSgpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoJ2NhbmNlbCB0cmFuc2l0aW9uJykuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7fSk7XG5cdH07XG5cblx0UHJvbWlzZS5yZXNvbHZlKClcblx0XHQudGhlbihvbGRTY3JlZW4gJiYgb2xkU2NyZWVuLmFuaW1hdGVPdXQuYmluZChvbGRTY3JlZW4pLCBjYW5jZWxQcm9taXNlKVxuXHRcdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblxuXHRcdFx0Y29tcGxldGVDYWxsYmFjaygpO1xuXHRcdH0sIGNhbmNlbFByb21pc2UpO1xuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRjYW5jZWxQcm9taXNlKCk7XG5cdFx0XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblx0fTtcbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIGNvbXBsZXRlQ2FsbGJhY2spIHtcblx0ZnVuY3Rpb24gY2FuY2VsUHJvbWlzZSgpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoJ2NhbmNlbCB0cmFuc2l0aW9uJykuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7fSk7XG5cdH07XG5cblx0UHJvbWlzZS5hbGwoW1xuXHRcdFByb21pc2UucmVzb2x2ZSgpLnRoZW4ob2xkU2NyZWVuICYmIG9sZFNjcmVlbi5hbmltYXRlT3V0LmJpbmQob2xkU2NyZWVuKSwgY2FuY2VsUHJvbWlzZSksXG5cdFx0UHJvbWlzZS5yZXNvbHZlKCkudGhlbihuZXdTY3JlZW4gJiYgbmV3U2NyZWVuLmFuaW1hdGVJbi5iaW5kKG5ld1NjcmVlbiksIGNhbmNlbFByb21pc2UpLFxuXHRdKS50aGVuKGNvbXBsZXRlQ2FsbGJhY2spO1xuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRjYW5jZWxQcm9taXNlKCk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9XG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjaykge1xuXHRmdW5jdGlvbiBjYW5jZWxQcm9taXNlKCkge1xuXHRcdHJldHVybiBQcm9taXNlLnJlamVjdCgnY2FuY2VsIHRyYW5zaXRpb24nKS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHt9KTtcblx0fTtcblxuXHRQcm9taXNlLnJlc29sdmUoKVxuXHRcdC50aGVuKG9sZFNjcmVlbiAmJiBvbGRTY3JlZW4uYW5pbWF0ZU91dC5iaW5kKG9sZFNjcmVlbiksIGNhbmNlbFByb21pc2UpXG5cdFx0LnRoZW4obmV3U2NyZWVuICYmIG5ld1NjcmVlbi5hbmltYXRlSW4uYmluZChuZXdTY3JlZW4pLCBjYW5jZWxQcm9taXNlKVxuXHRcdC50aGVuKGNvbXBsZXRlQ2FsbGJhY2ssIGNhbmNlbFByb21pc2UpO1xuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRjYW5jZWxQcm9taXNlKCk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9O1xufTsiLCJpbXBvcnQgU2NyZWVuTmF2aWdhdG9yLCB7VHJhbnNpdGlvbnMsIEFTY3JlZW4sIFNjcmVlbk5hdmlnYXRvckl0ZW19IGZyb20gJy4vc3JjL1NjcmVlbk5hdmlnYXRvcic7XG5cblNjcmVlbk5hdmlnYXRvci5UcmFuc2l0aW9ucyA9IFRyYW5zaXRpb25zO1xuU2NyZWVuTmF2aWdhdG9yLkFTY3JlZW4gPSBBU2NyZWVuO1xuU2NyZWVuTmF2aWdhdG9yLlNjcmVlbk5hdmlnYXRvckl0ZW0gPSBTY3JlZW5OYXZpZ2F0b3JJdGVtO1xuXG53aW5kb3cuU2NyZWVuTmF2aWdhdG9yID0gU2NyZWVuTmF2aWdhdG9yOyJdfQ==
