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

  _createClass(ScreenNavigator, [{
    key: 'addScreen',
    value: function addScreen(id, item) {
      this.items[id] = item;

      return item;
    }
  }, {
    key: 'removeScreen',
    value: function removeScreen(id) {
      if (!this.items[id]) return;

      delete this.items[id];
    }
  }, {
    key: 'getScreen',
    value: function getScreen(id) {
      return this.items[id];
    }
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
  }, {
    key: 'clearScreen',
    value: function clearScreen(transition) {
      if (!this.currentScreen) {
        return;
      }

      this.previousItemId = this.currentItemId;
      this.previousScreen = this.currentScreen;

      this.currentItemId = null;

      this.onScreenChange();

      this.startTransition(transition);
    }
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
  }, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdGlueS1lbWl0dGVyL2luZGV4LmpzIiwic3JjL0FTY3JlZW4uanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9yLmpzIiwic3JjL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMiLCJzcmMvVHJhbnNpdGlvbnMuanMiLCJzcmMvdHJhbnNpdGlvbnMvSW4uanMiLCJzcmMvdHJhbnNpdGlvbnMvSW5UaGVuT3V0LmpzIiwic3JjL3RyYW5zaXRpb25zL05vbmUuanMiLCJzcmMvdHJhbnNpdGlvbnMvT3V0LmpzIiwic3JjL3RyYW5zaXRpb25zL091dEFuZEluLmpzIiwic3JjL3RyYW5zaXRpb25zL091dFRoZW5Jbi5qcyIsInN0YW5kYWxvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ2xFQTs7Ozs7Ozs7Ozs7O0lBRXFCLE87Ozs7Ozs7Ozs7OzhCQUNSLENBQ1Y7OztnQ0FFb0M7QUFBQTs7QUFBQSxVQUExQixnQkFBMEIsdUVBQVAsS0FBTzs7QUFDbkMsYUFBTyxJQUFJLE9BQUosQ0FBWSxtQkFBVztBQUM1QixZQUFJLGdCQUFKLEVBQXNCLE9BQUss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Y2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImZ1bmN0aW9uIEUgKCkge1xuICAvLyBLZWVwIHRoaXMgZW1wdHkgc28gaXQncyBlYXNpZXIgdG8gaW5oZXJpdCBmcm9tXG4gIC8vICh2aWEgaHR0cHM6Ly9naXRodWIuY29tL2xpcHNtYWNrIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9pc3N1ZXMvMylcbn1cblxuRS5wcm90b3R5cGUgPSB7XG4gIG9uOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG5cbiAgICAoZVtuYW1lXSB8fCAoZVtuYW1lXSA9IFtdKSkucHVzaCh7XG4gICAgICBmbjogY2FsbGJhY2ssXG4gICAgICBjdHg6IGN0eFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb25jZTogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgZnVuY3Rpb24gbGlzdGVuZXIgKCkge1xuICAgICAgc2VsZi5vZmYobmFtZSwgbGlzdGVuZXIpO1xuICAgICAgY2FsbGJhY2suYXBwbHkoY3R4LCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBsaXN0ZW5lci5fID0gY2FsbGJhY2tcbiAgICByZXR1cm4gdGhpcy5vbihuYW1lLCBsaXN0ZW5lciwgY3R4KTtcbiAgfSxcblxuICBlbWl0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBkYXRhID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBldnRBcnIgPSAoKHRoaXMuZSB8fCAodGhpcy5lID0ge30pKVtuYW1lXSB8fCBbXSkuc2xpY2UoKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGxlbiA9IGV2dEFyci5sZW5ndGg7XG5cbiAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgZXZ0QXJyW2ldLmZuLmFwcGx5KGV2dEFycltpXS5jdHgsIGRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9mZjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcbiAgICB2YXIgZXZ0cyA9IGVbbmFtZV07XG4gICAgdmFyIGxpdmVFdmVudHMgPSBbXTtcblxuICAgIGlmIChldnRzICYmIGNhbGxiYWNrKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZXZ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZXZ0c1tpXS5mbiAhPT0gY2FsbGJhY2sgJiYgZXZ0c1tpXS5mbi5fICE9PSBjYWxsYmFjaylcbiAgICAgICAgICBsaXZlRXZlbnRzLnB1c2goZXZ0c1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGV2ZW50IGZyb20gcXVldWUgdG8gcHJldmVudCBtZW1vcnkgbGVha1xuICAgIC8vIFN1Z2dlc3RlZCBieSBodHRwczovL2dpdGh1Yi5jb20vbGF6ZFxuICAgIC8vIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9jb21taXQvYzZlYmZhYTliYzk3M2IzM2QxMTBhODRhMzA3NzQyYjdjZjk0Yzk1MyNjb21taXRjb21tZW50LTUwMjQ5MTBcblxuICAgIChsaXZlRXZlbnRzLmxlbmd0aClcbiAgICAgID8gZVtuYW1lXSA9IGxpdmVFdmVudHNcbiAgICAgIDogZGVsZXRlIGVbbmFtZV07XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFO1xuIiwiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBU2NyZWVuIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgZGlzcG9zZSAoKSB7XG4gIH1cblxuICBhbmltYXRlSW4gKGNhbmNlbFRyYW5zaXRpb24gPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGlmIChjYW5jZWxUcmFuc2l0aW9uKSB0aGlzLmNhbmNlbEFuaW1JbihyZXNvbHZlKTtcbiAgICAgIGVsc2UgdGhpcy5jcmVhdGVBbmltSW4ocmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBjcmVhdGVBbmltSW4gKHJlc29sdmVQcm9taXNlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UoKTtcbiAgfVxuXG4gIGNhbmNlbEFuaW1JbiAocmVzb2x2ZVByb21pc2UpIHtcbiAgICByZXNvbHZlUHJvbWlzZSgpO1xuICB9XG4gIFxuICBhbmltYXRlT3V0IChjYW5jZWxUcmFuc2l0aW9uID0gZmFsc2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAoY2FuY2VsVHJhbnNpdGlvbikgdGhpcy5jYW5jZWxBbmltT3V0KHJlc29sdmUpO1xuICAgICAgZWxzZSB0aGlzLmNyZWF0ZUFuaW1PdXQocmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBjcmVhdGVBbmltT3V0IChyZXNvbHZlUHJvbWlzZSkge1xuICAgIHJlc29sdmVQcm9taXNlKCk7XG4gIH1cblxuICBjYW5jZWxBbmltT3V0IChyZXNvbHZlUHJvbWlzZSkge1xuICAgIHJlc29sdmVQcm9taXNlKCk7XG4gIH1cbn1cblxuIiwiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IFNjcmVlbk5hdmlnYXRvckl0ZW0gZnJvbSAnLi9TY3JlZW5OYXZpZ2F0b3JJdGVtJztcbmltcG9ydCBUcmFuc2l0aW9ucyBmcm9tICcuL1RyYW5zaXRpb25zJztcbmltcG9ydCBBU2NyZWVuIGZyb20gJy4vQVNjcmVlbidcblxuZXhwb3J0IHtTY3JlZW5OYXZpZ2F0b3JJdGVtLCBUcmFuc2l0aW9ucywgQVNjcmVlbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyZWVuTmF2aWdhdG9yIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgc3RhdGljIGRlZmF1bHRUcmFuc2l0aW9uID0gVHJhbnNpdGlvbnMuTm9uZTtcblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKTtcbiAgICBcbiAgICB0aGlzLml0ZW1zID0ge307XG5cbiAgICB0aGlzLmN1cnJlbnRJdGVtSWQgPSBudWxsO1xuICAgIHRoaXMucHJldmlvdXNJdGVtSWQgPSBudWxsO1xuXG4gICAgdGhpcy5jdXJyZW50U2NyZWVuID0gbnVsbDtcbiAgICB0aGlzLnByZXZpb3VzU2NyZWVuID0gbnVsbDtcblxuICAgIHRoaXMudHJhbnNpdGlvbiA9IFNjcmVlbk5hdmlnYXRvci5kZWZhdWx0VHJhbnNpdGlvbjtcbiAgICB0aGlzLnRyYW5zaXRpb25SdW5uaW5nID0gZmFsc2U7XG4gICAgdGhpcy50cmFuc2l0aW9uQ2FuY2VsID0gbnVsbDtcbiAgfVxuICBcbiAgYWRkU2NyZWVuIChpZCwgaXRlbSkge1xuICAgIHRoaXMuaXRlbXNbaWRdID0gaXRlbTtcbiAgXG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICByZW1vdmVTY3JlZW4gKGlkKSB7XG4gICAgaWYgKCF0aGlzLml0ZW1zW2lkXSkgcmV0dXJuO1xuXG4gICAgZGVsZXRlIHRoaXMuaXRlbXNbaWRdO1xuICB9XG5cbiAgZ2V0U2NyZWVuIChpZCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zW2lkXTtcbiAgfVxuXG4gIHNob3dTY3JlZW4gKGlkLCB0cmFuc2l0aW9uID0gbnVsbCwgb3B0aW9ucyA9IG51bGwpIHtcbiAgICBpZiAoIXRoaXMuaXRlbXNbaWRdKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2NyZWVuTmF2aWdhdG9yIC0gdGhlIGl0ZW0gd2l0aCB0aGUgaWQgJyArIGlkICsgJyBkb2VzblxcJ3QgZXhpc3QnKTtcbiAgICB9XG4gIFxuICAgIGlmICh0aGlzLnRyYW5zaXRpb25SdW5uaW5nKXtcbiAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUodHJ1ZSk7XG4gICAgfSBcbiAgXG4gICAgaWYgKHRoaXMuY3VycmVudFNjcmVlbil7XG4gICAgICB0aGlzLnByZXZpb3VzSXRlbUlkID0gdGhpcy5jdXJyZW50SXRlbUlkO1xuICAgICAgdGhpcy5wcmV2aW91c1NjcmVlbiA9IHRoaXMuY3VycmVudFNjcmVlbjtcbiAgICB9XG4gIFxuICAgIHRoaXMuY3VycmVudEl0ZW1JZCA9IGlkO1xuICBcbiAgICB0aGlzLm9uU2NyZWVuQ2hhbmdlKCk7XG4gIFxuICAgIHRoaXMuc3RhcnRUcmFuc2l0aW9uKHRyYW5zaXRpb24sIG9wdGlvbnMpO1xuICB9XG5cbiAgY2xlYXJTY3JlZW4gKHRyYW5zaXRpb24pIHtcbiAgICBpZiAoIXRoaXMuY3VycmVudFNjcmVlbil7XG4gICAgICByZXR1cm47XG4gICAgfVxuICBcbiAgICB0aGlzLnByZXZpb3VzSXRlbUlkID0gdGhpcy5jdXJyZW50SXRlbUlkO1xuICAgIHRoaXMucHJldmlvdXNTY3JlZW4gPSB0aGlzLmN1cnJlbnRTY3JlZW47XG4gIFxuICAgIHRoaXMuY3VycmVudEl0ZW1JZCA9IG51bGw7XG4gIFxuICAgIHRoaXMub25TY3JlZW5DaGFuZ2UoKTtcbiAgXG4gICAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvbik7XG4gIH1cblxuICBkaXNwb3NlU2NyZWVuIChpZCwgZm9yY2VEaXNwb3NlID0gZmFsc2UpIHtcbiAgICBjb25zdCBpdGVtID0gdGhpcy5pdGVtc1tpZF07XG5cbiAgICBpZiAoIWl0ZW0pIHJldHVybjtcblxuICAgIGl0ZW0uZGlzcG9zZVNjcmVlbihmb3JjZURpc3Bvc2UpO1xuICB9XG5cbiAgZGlzcG9zZVByZXZpb3VzU2NyZWVuICgpIHtcbiAgICBpZiAoIXRoaXMucHJldmlvdXNTY3JlZW4pIHJldHVybjtcbiAgXG4gICAgdGhpcy5kaXNwb3NlU2NyZWVuKHRoaXMucHJldmlvdXNJdGVtSWQpO1xuICBcbiAgICB0aGlzLnByZXZpb3VzU2NyZWVuID0gbnVsbDtcbiAgfVxuXG4gIGRpc3Bvc2VDdXJyZW50U2NyZWVuICgpIHtcbiAgICBpZiAoIXRoaXMuY3VycmVudFNjcmVlbikgcmV0dXJuO1xuICBcbiAgICB0aGlzLmRpc3Bvc2VTY3JlZW4odGhpcy5jdXJyZW50SXRlbUlkKTtcbiAgXG4gICAgdGhpcy5jdXJyZW50U2NyZWVuID0gbnVsbDtcbiAgfVxuXG4gIHN0YXJ0VHJhbnNpdGlvbiAodHJhbnNpdGlvbiA9IG51bGwsIG9wdGlvbnMgPSBudWxsKSB7XG4gICAgdHJhbnNpdGlvbiA9IHRyYW5zaXRpb24gfHwgdGhpcy50cmFuc2l0aW9uO1xuICBcbiAgICBjb25zdCBjdXJyZW50SXRlbSA9IHRoaXMuaXRlbXNbdGhpcy5jdXJyZW50SXRlbUlkXTtcbiAgXG4gICAgaWYgKG9wdGlvbnMpIGN1cnJlbnRJdGVtLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gIFxuICAgIHRoaXMuY3VycmVudFNjcmVlbiA9IGN1cnJlbnRJdGVtID8gY3VycmVudEl0ZW0uZ2V0U2NyZWVuKG9wdGlvbnMpIDogbnVsbDtcbiAgXG4gICAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IHRydWU7XG4gIFxuICAgIHRoaXMuZW1pdCgndHJhbnNpdGlvblN0YXJ0Jyk7XG4gIFxuICAgIHRoaXMudHJhbnNpdGlvbkNhbmNlbCA9IHRyYW5zaXRpb24odGhpcy5jdXJyZW50U2NyZWVuLCB0aGlzLnByZXZpb3VzU2NyZWVuLCB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgb25TY3JlZW5DaGFuZ2UgKCkge1xuICAgIHRoaXMuZW1pdCgnc2NyZWVuQ2hhbmdlJyk7XG4gIH1cblxuICBvblRyYW5zaXRpb25Db21wbGV0ZSAoY2FuY2VsVHJhbnNpdGlvbiA9IGZhbHNlKSB7XG4gICAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuICBcbiAgICBpZiAoY2FuY2VsVHJhbnNpdGlvbil7XG4gICAgICBpZiAodGhpcy50cmFuc2l0aW9uQ2FuY2VsKSB0aGlzLnRyYW5zaXRpb25DYW5jZWwoKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5kaXNwb3NlUHJldmlvdXNTY3JlZW4oKTtcbiAgXG4gICAgICBpZiAoY2FuY2VsVHJhbnNpdGlvbil7XG4gICAgICAgIHRoaXMuZW1pdCgndHJhbnNpdGlvbkNhbmNlbCcpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMuZW1pdCgndHJhbnNpdGlvbkNvbXBsZXRlJyk7XG4gICAgICB9XG4gIFxuICAgIHRoaXMudHJhbnNpdGlvbkNhbmNlbCA9IG51bGw7XG4gIH1cblxuICBkaXNwb3NlIChmb3JjZURpc3Bvc2UgPSB0cnVlKSB7XG4gICAgaWYgKHRoaXMudHJhbnNpdGlvblJ1bm5pbmcpe1xuICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbkNhbmNlbCkgdGhpcy50cmFuc2l0aW9uQ2FuY2VsKCk7XG5cbiAgICAgIHRoaXMudHJhbnNpdGlvblJ1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG4gIFxuICAgIHRoaXMudHJhbnNpdGlvbkNhbmNlbCA9IG51bGw7XG4gIFxuICAgIHRoaXMuZGlzcG9zZUN1cnJlbnRTY3JlZW4oKTtcbiAgICB0aGlzLmRpc3Bvc2VQcmV2aW91c1NjcmVlbigpO1xuICBcbiAgICBmb3IgKGxldCBpdGVtSWQgaW4gdGhpcy5pdGVtcyl7XG4gICAgICB0aGlzLml0ZW1zW2l0ZW1JZF0uZGlzcG9zZShmb3JjZURpc3Bvc2UpO1xuICBcbiAgICAgIHRoaXMucmVtb3ZlU2NyZWVuKGl0ZW1JZCk7XG4gICAgfVxuICBcbiAgICB0aGlzLnRyYW5zaXRpb24gPSBudWxsO1xuICB9XG59XG5cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcmVlbk5hdmlnYXRvckl0ZW0ge1xuICBjb25zdHJ1Y3RvciAoc2NyZWVuLCBvcHRpb25zKSB7XG4gICAgdGhpcy5zY3JlZW4gPSBzY3JlZW47XG5cbiAgICB0aGlzLmlzSW5zdGFuY2UgPSB0eXBlb2Ygc2NyZWVuICE9PSAnZnVuY3Rpb24nO1xuICAgIHRoaXMuaW50ZXJuYWxJbnN0YW5jZSA9IG51bGw7XG5cbiAgICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgICB0aGlzLmFyZ3VtZW50cyA9IG51bGw7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gbnVsbDtcbiAgICB0aGlzLmNhbkRpc3Bvc2UgPSAhdGhpcy5pc0luc3RhbmNlO1xuICAgIHRoaXMuZXZlbnRzID0gbnVsbDtcblxuICAgIHRoaXMuaGFzRXZlbnRzTGlzdGVuZXJzID0gZmFsc2U7XG5cbiAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gIH1cbiAgXG4gIHNldE9wdGlvbnMgKG9wdGlvbnMpIHtcbiAgICBmb3IgKGxldCBvcHRpb25LZXkgaW4gb3B0aW9ucyl7XG4gICAgICBpZiAodHlwZW9mIHRoaXNbb3B0aW9uS2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHRoaXNbb3B0aW9uS2V5XSA9IG9wdGlvbnNbb3B0aW9uS2V5XTtcbiAgICB9XG4gIH1cblxuICBnZXRTY3JlZW4gKCkge1xuICAgIGxldCBpbnN0YW5jZTtcblxuICAgIGlmICh0aGlzLmlzSW5zdGFuY2Upe1xuICAgICAgaW5zdGFuY2UgPSB0aGlzLnNjcmVlbjtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaW50ZXJuYWxJbnN0YW5jZSl7XG4gICAgICBpbnN0YW5jZSA9IHRoaXMuaW50ZXJuYWxJbnN0YW5jZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYXJncyA9IHRoaXMuYXJndW1lbnRzIHx8IFtdO1xuXG4gICAgICBpbnN0YW5jZSA9IG5ldyB0aGlzLnNjcmVlbiguLi5hcmdzKTtcblxuICAgICAgaWYgKCF0aGlzLmNhbkRpc3Bvc2UpIHRoaXMuaW50ZXJuYWxJbnN0YW5jZSA9IGluc3RhbmNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BlcnRpZXMpe1xuICAgICAgZm9yIChsZXQga2V5IGluIHRoaXMucHJvcGVydGllcyl7XG4gICAgICAgIGluc3RhbmNlW2tleV0gPSB0aGlzLnByb3BlcnRpZXNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5ldmVudHMpIHRoaXMuYWRkRXZlbnRzTGlzdGVuZXJzKGluc3RhbmNlKTtcblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIGFkZEV2ZW50c0xpc3RlbmVycyAoaW5zdGFuY2UpIHtcbiAgICBpZiAoIXRoaXMuY2FuRGlzcG9zZSl7XG4gICAgICBpZiAodGhpcy5oYXNFdmVudHNMaXN0ZW5lcnMpIHJldHVybjtcbiAgXG4gICAgICB0aGlzLmhhc0V2ZW50c0xpc3RlbmVycyA9IHRydWU7XG4gICAgfVxuICBcbiAgICBmb3IgKGxldCBldmVudE5hbWUgaW4gdGhpcy5ldmVudHMpe1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLmV2ZW50c1tldmVudE5hbWVdID09PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgaW5zdGFuY2Uub24oZXZlbnROYW1lLCB0aGlzLmV2ZW50c1tldmVudE5hbWVdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZW1vdmVFdmVudHNMaXN0ZW5lcnMgKGluc3RhbmNlKSB7XG4gICAgdGhpcy5oYXNFdmVudHNMaXN0ZW5lcnMgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGV2ZW50TmFtZSBpbiB0aGlzLmV2ZW50cyl7XG4gICAgICBpZiAodHlwZW9mIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPT09ICdmdW5jdGlvbicpe1xuICAgICAgICBpbnN0YW5jZS5vZmYoZXZlbnROYW1lLCB0aGlzLmV2ZW50c1tldmVudE5hbWVdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkaXNwb3NlU2NyZWVuIChpbnN0YW5jZSwgZm9yY2VEaXNwb3NlID0gZmFsc2UpIHtcbiAgICBpZiAodGhpcy5ldmVudHMpIHRoaXMucmVtb3ZlRXZlbnRzTGlzdGVuZXJzKGluc3RhbmNlKTtcblxuICAgIGlmICghZm9yY2VEaXNwb3NlICYmICF0aGlzLmNhbkRpc3Bvc2UpIHJldHVybjtcblxuICAgIGlmICh0eXBlb2YgaW5zdGFuY2UuZGlzcG9zZSA9PT0gJ2Z1bmN0aW9uJykgaW5zdGFuY2UuZGlzcG9zZSgpO1xuXG4gICAgdGhpcy5pbnRlcm5hbEluc3RhbmNlID0gbnVsbDtcbiAgfVxuXG4gIGRpc3Bvc2UgKGZvcmNlRGlzcG9zZSA9IHRydWUpIHtcbiAgICBsZXQgaW5zdGFuY2UgPSB0aGlzLmlzSW5zdGFuY2UgPyB0aGlzLnNjcmVlbiA6IHRoaXMuaW50ZXJuYWxJbnN0YW5jZTtcblxuICAgIGlmIChpbnN0YW5jZSl7XG4gICAgICB0aGlzLmRpc3Bvc2VTY3JlZW4oaW5zdGFuY2UsIGZvcmNlRGlzcG9zZSk7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuc2NyZWVuID0gXG4gICAgdGhpcy5pbnRlcm5hbEluc3RhbmNlID0gXG4gICAgdGhpcy5hcmd1bWVudHMgPSBcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBcbiAgICB0aGlzLmV2ZW50cyA9IFxuICAgIG51bGw7XG4gIH1cbn1cblxuIiwiaW1wb3J0IE5vbmUgZnJvbSAnLi90cmFuc2l0aW9ucy9Ob25lLmpzJztcbmltcG9ydCBJbiBmcm9tICcuL3RyYW5zaXRpb25zL0luLmpzJztcbmltcG9ydCBPdXQgZnJvbSAnLi90cmFuc2l0aW9ucy9PdXQuanMnO1xuaW1wb3J0IE91dEFuZEluIGZyb20gJy4vdHJhbnNpdGlvbnMvT3V0QW5kSW4uanMnO1xuaW1wb3J0IE91dFRoZW5JbiBmcm9tICcuL3RyYW5zaXRpb25zL091dFRoZW5Jbi5qcyc7XG5pbXBvcnQgSW5UaGVuT3V0IGZyb20gJy4vdHJhbnNpdGlvbnMvSW5UaGVuT3V0LmpzJztcblxuZXhwb3J0IGRlZmF1bHQge05vbmUsIEluLCBPdXQsIEluVGhlbk91dCwgT3V0QW5kSW4sIE91dFRoZW5Jbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjaykge1xuXHRmdW5jdGlvbiBjYW5jZWxQcm9taXNlKCkge1xuXHRcdHJldHVybiBQcm9taXNlLnJlamVjdCgnY2FuY2VsIHRyYW5zaXRpb24nKS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHt9KTtcblx0fTtcblxuXHRQcm9taXNlLnJlc29sdmUoKVxuXHRcdC50aGVuKG5ld1NjcmVlbiAmJiBuZXdTY3JlZW4uYW5pbWF0ZUluLmJpbmQobmV3U2NyZWVuKSwgY2FuY2VsUHJvbWlzZSlcblx0XHQudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCgpO1xuXG5cdFx0XHRjb21wbGV0ZUNhbGxiYWNrKCk7XG5cdFx0fSwgY2FuY2VsUHJvbWlzZSk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCgpe1xuXHRcdGNhbmNlbFByb21pc2UoKTtcblx0XHRcblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9O1xufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjaykge1xuXHRmdW5jdGlvbiBjYW5jZWxQcm9taXNlKCkge1xuXHRcdHJldHVybiBQcm9taXNlLnJlamVjdCgnY2FuY2VsIHRyYW5zaXRpb24nKS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHt9KTtcblx0fTtcblxuXHRQcm9taXNlLnJlc29sdmUoKVxuXHRcdC50aGVuKG5ld1NjcmVlbiAmJiBuZXdTY3JlZW4uYW5pbWF0ZUluLmJpbmQobmV3U2NyZWVuKSwgY2FuY2VsUHJvbWlzZSlcblx0XHQudGhlbihvbGRTY3JlZW4gJiYgb2xkU2NyZWVuLmFuaW1hdGVPdXQuYmluZChvbGRTY3JlZW4pLCBjYW5jZWxQcm9taXNlKVxuXHRcdC50aGVuKGNvbXBsZXRlQ2FsbGJhY2ssIGNhbmNlbFByb21pc2UpO1xuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRjYW5jZWxQcm9taXNlKCk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9O1xufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjaykge1xuXHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCgpO1xuXHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKCk7XG5cblx0Y29tcGxldGVDYWxsYmFjaygpO1xuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwgKCkge307XG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKSB7XG5cdGZ1bmN0aW9uIGNhbmNlbFByb21pc2UoKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KCdjYW5jZWwgdHJhbnNpdGlvbicpLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge30pO1xuXHR9O1xuXG5cdFByb21pc2UucmVzb2x2ZSgpXG5cdFx0LnRoZW4ob2xkU2NyZWVuICYmIG9sZFNjcmVlbi5hbmltYXRlT3V0LmJpbmQob2xkU2NyZWVuKSwgY2FuY2VsUHJvbWlzZSlcblx0XHQudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKCk7XG5cblx0XHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0XHR9LCBjYW5jZWxQcm9taXNlKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7XG5cdFx0Y2FuY2VsUHJvbWlzZSgpO1xuXHRcdFxuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KHRydWUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4odHJ1ZSk7XG5cdH07XG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKSB7XG5cdGZ1bmN0aW9uIGNhbmNlbFByb21pc2UoKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KCdjYW5jZWwgdHJhbnNpdGlvbicpLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge30pO1xuXHR9O1xuXG5cdFByb21pc2UuYWxsKFtcblx0XHRQcm9taXNlLnJlc29sdmUoKS50aGVuKG9sZFNjcmVlbiAmJiBvbGRTY3JlZW4uYW5pbWF0ZU91dC5iaW5kKG9sZFNjcmVlbiksIGNhbmNlbFByb21pc2UpLFxuXHRcdFByb21pc2UucmVzb2x2ZSgpLnRoZW4obmV3U2NyZWVuICYmIG5ld1NjcmVlbi5hbmltYXRlSW4uYmluZChuZXdTY3JlZW4pLCBjYW5jZWxQcm9taXNlKSxcblx0XSkudGhlbihjb21wbGV0ZUNhbGxiYWNrKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7XG5cdFx0Y2FuY2VsUHJvbWlzZSgpO1xuXG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblx0fVxufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAobmV3U2NyZWVuLCBvbGRTY3JlZW4sIGNvbXBsZXRlQ2FsbGJhY2spIHtcblx0ZnVuY3Rpb24gY2FuY2VsUHJvbWlzZSgpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoJ2NhbmNlbCB0cmFuc2l0aW9uJykuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7fSk7XG5cdH07XG5cblx0UHJvbWlzZS5yZXNvbHZlKClcblx0XHQudGhlbihvbGRTY3JlZW4gJiYgb2xkU2NyZWVuLmFuaW1hdGVPdXQuYmluZChvbGRTY3JlZW4pLCBjYW5jZWxQcm9taXNlKVxuXHRcdC50aGVuKG5ld1NjcmVlbiAmJiBuZXdTY3JlZW4uYW5pbWF0ZUluLmJpbmQobmV3U2NyZWVuKSwgY2FuY2VsUHJvbWlzZSlcblx0XHQudGhlbihjb21wbGV0ZUNhbGxiYWNrLCBjYW5jZWxQcm9taXNlKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7XG5cdFx0Y2FuY2VsUHJvbWlzZSgpO1xuXG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblx0fTtcbn07IiwiaW1wb3J0IFNjcmVlbk5hdmlnYXRvciwge1RyYW5zaXRpb25zLCBBU2NyZWVuLCBTY3JlZW5OYXZpZ2F0b3JJdGVtfSBmcm9tICcuL3NyYy9TY3JlZW5OYXZpZ2F0b3InO1xuXG5TY3JlZW5OYXZpZ2F0b3IuVHJhbnNpdGlvbnMgPSBUcmFuc2l0aW9ucztcblNjcmVlbk5hdmlnYXRvci5BU2NyZWVuID0gQVNjcmVlbjtcblNjcmVlbk5hdmlnYXRvci5TY3JlZW5OYXZpZ2F0b3JJdGVtID0gU2NyZWVuTmF2aWdhdG9ySXRlbTtcblxud2luZG93LlNjcmVlbk5hdmlnYXRvciA9IFNjcmVlbk5hdmlnYXRvcjsiXX0=
