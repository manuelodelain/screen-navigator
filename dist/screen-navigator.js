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
    value: function createAnimIn(onComplete) {
      onComplete();
    }
  }, {
    key: 'cancelAnimIn',
    value: function cancelAnimIn(onComplete) {
      onComplete();
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
    value: function createAnimOut(onComplete) {
      onComplete();
    }
  }, {
    key: 'cancelAnimOut',
    value: function cancelAnimOut(onComplete) {
      onComplete();
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
exports.AScreen = exports.Transitions = undefined;

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
    key: 'addItem',
    value: function addItem(id, screen, options) {
      var item = new _ScreenNavigatorItem2.default(screen, options);

      this.items[id] = item;

      return item;
    }
  }, {
    key: 'getItem',
    value: function getItem(id) {
      return this.items[id];
    }
  }, {
    key: 'showScreen',
    value: function showScreen(id, transition, options) {
      if (!this.getItem(id)) {
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
    key: 'startTransition',
    value: function startTransition(transition, options) {
      transition = transition || this.transition;

      var currentItem = this.getItem(this.currentItemId);

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
    value: function onTransitionComplete(cancelTransition, silent) {
      this.transitionRunning = false;

      if (cancelTransition) {
        if (this.transitionCancel) this.transitionCancel();
      }

      this.disposePreviousScreen();

      if (!silent) {
        if (cancelTransition) {
          this.emit('transitionCancel');
        } else {
          this.emit('transitionComplete');
        }
      }

      this.transitionCancel = null;
    }
  }, {
    key: 'dispose',
    value: function dispose(forceDispose) {
      if (typeof forceDispose !== 'boolean') forceDispose = true;

      if (this.transitionRunning) {
        this.onTransitionComplete(true, true);
      }

      this.disposeCurrentScreen();
      this.disposePreviousScreen();

      for (var itemId in this.items) {
        this.items[itemId].dispose(forceDispose);

        delete this.items[itemId];
      }

      this.transition = null;
    }
  }, {
    key: 'disposePreviousScreen',
    value: function disposePreviousScreen() {
      if (!this.previousScreen) return;

      this.getItem(this.previousItemId).disposeScreen(this.previousScreen);

      this.previousScreen = null;
    }
  }, {
    key: 'disposeCurrentScreen',
    value: function disposeCurrentScreen() {
      if (!this.currentScreen) return;

      this.getItem(this.currentItemId).disposeScreen(this.currentScreen);

      this.currentScreen = null;
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
    value: function disposeScreen(instance, forceDispose) {
      if (this.events) this.removeEventsListeners(instance);

      if (!forceDispose && !this.canDispose) return;

      if (typeof instance.dispose === 'function') instance.dispose();

      this.internalInstance = null;
    }
  }, {
    key: 'dispose',
    value: function dispose(forceDispose) {
      if (typeof forceDispose !== 'boolean') forceDispose = true;

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
	var promise = void 0;

	if (newScreen) {
		promise = newScreen.animateIn().then(onComplete);
	} else {
		onComplete();
	}

	function onComplete() {
		if (oldScreen) oldScreen.animateOut();

		completeCallback();
	}

	return function cancel() {
		if (promise) promise.reject('canceled');

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
	var promise = new Promise();

	if (newScreen) promise.then(newScreen.animateIn());
	if (oldScreen) promise.then(oldScreen.animateOut());

	promise.then(completeCallback);

	return function cancel() {
		promise.reject('canceled');

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
	var promise = void 0;

	if (oldScreen) {
		promise = oldScreen.animateOut().then(onComplete);
	} else {
		onComplete();
	}

	function onComplete() {
		if (newScreen) newScreen.animateIn();

		completeCallback();
	}

	return function cancel() {
		if (promise) promise.reject('canceled');

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
	var promises = [];

	if (oldScreen) promises.push(oldScreen.animateOut());
	if (newScreen) promises.push(newScreen.animateIn());

	Promise.all(promises).then(completeCallback);

	return function cancel() {
		promises.forEach(function (promise) {
			return promise.reject('canceled');
		});

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};

;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (newScreen, oldScreen, completeCallback) {
	var promise = Promise.resolve();
	var canceled = false;

	if (oldScreen) promise = promise.then(oldScreen.animateOut.bind(oldScreen));
	if (newScreen) promise = promise.then(newScreen.animateIn.bind(newScreen));

	promise = promise.then(onComplete);

	function onComplete() {
		if (canceled) return;

		completeCallback();
	}

	return function cancel() {
		canceled = true;

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

window.ScreenNavigator = _ScreenNavigator2.default;

},{"./src/ScreenNavigator":3}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdGlueS1lbWl0dGVyL2luZGV4LmpzIiwic3JjL0FTY3JlZW4uanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9yLmpzIiwic3JjL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMiLCJzcmMvVHJhbnNpdGlvbnMuanMiLCJzcmMvdHJhbnNpdGlvbnMvSW4uanMiLCJzcmMvdHJhbnNpdGlvbnMvSW5UaGVuT3V0LmpzIiwic3JjL3RyYW5zaXRpb25zL05vbmUuanMiLCJzcmMvdHJhbnNpdGlvbnMvT3V0LmpzIiwic3JjL3RyYW5zaXRpb25zL091dEFuZEluLmpzIiwic3JjL3RyYW5zaXRpb25zL091dFRoZW5Jbi5qcyIsInN0YW5kYWxvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ2xFQTs7Ozs7Ozs7Ozs7O0lBRXFCLE87Ozs7Ozs7Ozs7OzhCQUNSLENBQ1Y7OztnQ0FFb0M7QUFBQTs7QUFBQSxVQUExQixnQkFBMEIsdUVBQVAsS0FBTzs7QUFDbkMsYUFBTyxJQUFJLE9BQUosQ0FBWSxtQkFBVztBQUM1QixZQUFJLGdCQUFKLEVBQXNCLE9BQUss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UUFBTyxTQUFTLE1BQVQsR0FBaUI7QUFDdkIsYUFBVyxJQUFYOztBQUVBLE1BQUksU0FBSixFQUFlLFVBQVUsVUFBVixDQUFxQixJQUFyQjtBQUNmLE1BQUksU0FBSixFQUFlLFVBQVUsU0FBVixDQUFvQixJQUFwQjtBQUNmLEVBTEQ7QUFNQSxDOztBQUFBOzs7OztBQ3JCRDs7Ozs7O0FBRUEsMEJBQWdCLFdBQWhCLEdBQThCLDRCQUE5QjtBQUNBLDBCQUFnQixPQUFoQixHQUEwQix3QkFBMUI7O0FBRUEsT0FBTyxlQUFQLEdBQXlCLHlCQUF6QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImZ1bmN0aW9uIEUgKCkge1xuICAvLyBLZWVwIHRoaXMgZW1wdHkgc28gaXQncyBlYXNpZXIgdG8gaW5oZXJpdCBmcm9tXG4gIC8vICh2aWEgaHR0cHM6Ly9naXRodWIuY29tL2xpcHNtYWNrIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9pc3N1ZXMvMylcbn1cblxuRS5wcm90b3R5cGUgPSB7XG4gIG9uOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG5cbiAgICAoZVtuYW1lXSB8fCAoZVtuYW1lXSA9IFtdKSkucHVzaCh7XG4gICAgICBmbjogY2FsbGJhY2ssXG4gICAgICBjdHg6IGN0eFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb25jZTogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgZnVuY3Rpb24gbGlzdGVuZXIgKCkge1xuICAgICAgc2VsZi5vZmYobmFtZSwgbGlzdGVuZXIpO1xuICAgICAgY2FsbGJhY2suYXBwbHkoY3R4LCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBsaXN0ZW5lci5fID0gY2FsbGJhY2tcbiAgICByZXR1cm4gdGhpcy5vbihuYW1lLCBsaXN0ZW5lciwgY3R4KTtcbiAgfSxcblxuICBlbWl0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBkYXRhID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBldnRBcnIgPSAoKHRoaXMuZSB8fCAodGhpcy5lID0ge30pKVtuYW1lXSB8fCBbXSkuc2xpY2UoKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGxlbiA9IGV2dEFyci5sZW5ndGg7XG5cbiAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgZXZ0QXJyW2ldLmZuLmFwcGx5KGV2dEFycltpXS5jdHgsIGRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9mZjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcbiAgICB2YXIgZXZ0cyA9IGVbbmFtZV07XG4gICAgdmFyIGxpdmVFdmVudHMgPSBbXTtcblxuICAgIGlmIChldnRzICYmIGNhbGxiYWNrKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZXZ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZXZ0c1tpXS5mbiAhPT0gY2FsbGJhY2sgJiYgZXZ0c1tpXS5mbi5fICE9PSBjYWxsYmFjaylcbiAgICAgICAgICBsaXZlRXZlbnRzLnB1c2goZXZ0c1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGV2ZW50IGZyb20gcXVldWUgdG8gcHJldmVudCBtZW1vcnkgbGVha1xuICAgIC8vIFN1Z2dlc3RlZCBieSBodHRwczovL2dpdGh1Yi5jb20vbGF6ZFxuICAgIC8vIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9jb21taXQvYzZlYmZhYTliYzk3M2IzM2QxMTBhODRhMzA3NzQyYjdjZjk0Yzk1MyNjb21taXRjb21tZW50LTUwMjQ5MTBcblxuICAgIChsaXZlRXZlbnRzLmxlbmd0aClcbiAgICAgID8gZVtuYW1lXSA9IGxpdmVFdmVudHNcbiAgICAgIDogZGVsZXRlIGVbbmFtZV07XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFO1xuIiwiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBU2NyZWVuIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgZGlzcG9zZSAoKSB7XG4gIH1cblxuICBhbmltYXRlSW4gKGNhbmNlbFRyYW5zaXRpb24gPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGlmIChjYW5jZWxUcmFuc2l0aW9uKSB0aGlzLmNhbmNlbEFuaW1JbihyZXNvbHZlKTtcbiAgICAgIGVsc2UgdGhpcy5jcmVhdGVBbmltSW4ocmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBjcmVhdGVBbmltSW4gKG9uQ29tcGxldGUpIHtcbiAgICBvbkNvbXBsZXRlKCk7XG4gIH1cblxuICBjYW5jZWxBbmltSW4gKG9uQ29tcGxldGUpIHtcbiAgICBvbkNvbXBsZXRlKCk7XG4gIH1cbiAgXG4gIGFuaW1hdGVPdXQgKGNhbmNlbFRyYW5zaXRpb24gPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGlmIChjYW5jZWxUcmFuc2l0aW9uKSB0aGlzLmNhbmNlbEFuaW1PdXQocmVzb2x2ZSk7XG4gICAgICBlbHNlIHRoaXMuY3JlYXRlQW5pbU91dChyZXNvbHZlKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNyZWF0ZUFuaW1PdXQgKG9uQ29tcGxldGUpIHtcbiAgICBvbkNvbXBsZXRlKCk7XG4gIH1cblxuICBjYW5jZWxBbmltT3V0IChvbkNvbXBsZXRlKSB7XG4gICAgb25Db21wbGV0ZSgpO1xuICB9XG59XG5cbiIsImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAndGlueS1lbWl0dGVyJztcbmltcG9ydCBTY3JlZW5OYXZpZ2F0b3JJdGVtIGZyb20gJy4vU2NyZWVuTmF2aWdhdG9ySXRlbSc7XG5pbXBvcnQgVHJhbnNpdGlvbnMgZnJvbSAnLi9UcmFuc2l0aW9ucyc7XG5pbXBvcnQgQVNjcmVlbiBmcm9tICcuL0FTY3JlZW4nXG5cbmV4cG9ydCB7VHJhbnNpdGlvbnMsIEFTY3JlZW59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcmVlbk5hdmlnYXRvciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIHN0YXRpYyBkZWZhdWx0VHJhbnNpdGlvbiA9IFRyYW5zaXRpb25zLk5vbmU7XG5cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKCk7XG4gICAgXG4gICAgdGhpcy5pdGVtcyA9IHt9O1xuXG4gICAgdGhpcy5jdXJyZW50SXRlbUlkID0gbnVsbDtcbiAgICB0aGlzLnByZXZpb3VzSXRlbUlkID0gbnVsbDtcblxuICAgIHRoaXMuY3VycmVudFNjcmVlbiA9IG51bGw7XG4gICAgdGhpcy5wcmV2aW91c1NjcmVlbiA9IG51bGw7XG5cbiAgICB0aGlzLnRyYW5zaXRpb24gPSBTY3JlZW5OYXZpZ2F0b3IuZGVmYXVsdFRyYW5zaXRpb247XG4gICAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuICAgIHRoaXMudHJhbnNpdGlvbkNhbmNlbCA9IG51bGw7XG4gIH1cbiAgXG4gIGFkZEl0ZW0gKGlkLCBzY3JlZW4sIG9wdGlvbnMpIHtcbiAgICBjb25zdCBpdGVtID0gbmV3IFNjcmVlbk5hdmlnYXRvckl0ZW0oc2NyZWVuLCBvcHRpb25zKTtcbiAgXG4gICAgdGhpcy5pdGVtc1tpZF0gPSBpdGVtO1xuICBcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIGdldEl0ZW0gKGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXNbaWRdO1xuICB9XG5cbiAgc2hvd1NjcmVlbiAoaWQsIHRyYW5zaXRpb24sIG9wdGlvbnMpIHtcbiAgICBpZiAoIXRoaXMuZ2V0SXRlbShpZCkpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTY3JlZW5OYXZpZ2F0b3IgLSB0aGUgaXRlbSB3aXRoIHRoZSBpZCAnICsgaWQgKyAnIGRvZXNuXFwndCBleGlzdCcpO1xuICAgIH1cbiAgXG4gICAgaWYgKHRoaXMudHJhbnNpdGlvblJ1bm5pbmcpe1xuICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSh0cnVlKTtcbiAgICB9IFxuICBcbiAgICBpZiAodGhpcy5jdXJyZW50U2NyZWVuKXtcbiAgICAgIHRoaXMucHJldmlvdXNJdGVtSWQgPSB0aGlzLmN1cnJlbnRJdGVtSWQ7XG4gICAgICB0aGlzLnByZXZpb3VzU2NyZWVuID0gdGhpcy5jdXJyZW50U2NyZWVuO1xuICAgIH1cbiAgXG4gICAgdGhpcy5jdXJyZW50SXRlbUlkID0gaWQ7XG4gIFxuICAgIHRoaXMub25TY3JlZW5DaGFuZ2UoKTtcbiAgXG4gICAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvbiwgb3B0aW9ucyk7XG4gIH1cblxuICBjbGVhclNjcmVlbiAodHJhbnNpdGlvbikge1xuICAgIGlmICghdGhpcy5jdXJyZW50U2NyZWVuKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIFxuICAgIHRoaXMucHJldmlvdXNJdGVtSWQgPSB0aGlzLmN1cnJlbnRJdGVtSWQ7XG4gICAgdGhpcy5wcmV2aW91c1NjcmVlbiA9IHRoaXMuY3VycmVudFNjcmVlbjtcbiAgXG4gICAgdGhpcy5jdXJyZW50SXRlbUlkID0gbnVsbDtcbiAgXG4gICAgdGhpcy5vblNjcmVlbkNoYW5nZSgpO1xuICBcbiAgICB0aGlzLnN0YXJ0VHJhbnNpdGlvbih0cmFuc2l0aW9uKTtcbiAgfVxuXG4gIHN0YXJ0VHJhbnNpdGlvbiAodHJhbnNpdGlvbiwgb3B0aW9ucykge1xuICAgIHRyYW5zaXRpb24gPSB0cmFuc2l0aW9uIHx8IHRoaXMudHJhbnNpdGlvbjtcbiAgXG4gICAgY29uc3QgY3VycmVudEl0ZW0gPSB0aGlzLmdldEl0ZW0odGhpcy5jdXJyZW50SXRlbUlkKTtcbiAgXG4gICAgaWYgKG9wdGlvbnMpIGN1cnJlbnRJdGVtLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gIFxuICAgIHRoaXMuY3VycmVudFNjcmVlbiA9IGN1cnJlbnRJdGVtID8gY3VycmVudEl0ZW0uZ2V0U2NyZWVuKG9wdGlvbnMpIDogbnVsbDtcbiAgXG4gICAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IHRydWU7XG4gIFxuICAgIHRoaXMuZW1pdCgndHJhbnNpdGlvblN0YXJ0Jyk7XG4gIFxuICAgIHRoaXMudHJhbnNpdGlvbkNhbmNlbCA9IHRyYW5zaXRpb24odGhpcy5jdXJyZW50U2NyZWVuLCB0aGlzLnByZXZpb3VzU2NyZWVuLCB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgb25TY3JlZW5DaGFuZ2UgKCkge1xuICAgIHRoaXMuZW1pdCgnc2NyZWVuQ2hhbmdlJyk7XG4gIH1cblxuICBvblRyYW5zaXRpb25Db21wbGV0ZSAoY2FuY2VsVHJhbnNpdGlvbiwgc2lsZW50KSB7XG4gICAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuICBcbiAgICBpZiAoY2FuY2VsVHJhbnNpdGlvbil7XG4gICAgICBpZiAodGhpcy50cmFuc2l0aW9uQ2FuY2VsKSB0aGlzLnRyYW5zaXRpb25DYW5jZWwoKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5kaXNwb3NlUHJldmlvdXNTY3JlZW4oKTtcbiAgXG4gICAgaWYgKCFzaWxlbnQpe1xuICAgICAgaWYgKGNhbmNlbFRyYW5zaXRpb24pe1xuICAgICAgICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25DYW5jZWwnKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25Db21wbGV0ZScpO1xuICAgICAgfVxuICAgIH1cbiAgXG4gICAgdGhpcy50cmFuc2l0aW9uQ2FuY2VsID0gbnVsbDtcbiAgfVxuXG4gIGRpc3Bvc2UgKGZvcmNlRGlzcG9zZSkge1xuICAgIGlmICh0eXBlb2YgZm9yY2VEaXNwb3NlICE9PSAnYm9vbGVhbicpIGZvcmNlRGlzcG9zZSA9IHRydWU7XG4gIFxuICAgIGlmICh0aGlzLnRyYW5zaXRpb25SdW5uaW5nKXtcbiAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUodHJ1ZSwgdHJ1ZSk7XG4gICAgfVxuICBcbiAgICB0aGlzLmRpc3Bvc2VDdXJyZW50U2NyZWVuKCk7XG4gICAgdGhpcy5kaXNwb3NlUHJldmlvdXNTY3JlZW4oKTtcbiAgXG4gICAgZm9yIChsZXQgaXRlbUlkIGluIHRoaXMuaXRlbXMpe1xuICAgICAgdGhpcy5pdGVtc1tpdGVtSWRdLmRpc3Bvc2UoZm9yY2VEaXNwb3NlKTtcbiAgXG4gICAgICBkZWxldGUgdGhpcy5pdGVtc1tpdGVtSWRdO1xuICAgIH1cbiAgXG4gICAgdGhpcy50cmFuc2l0aW9uID0gbnVsbDtcbiAgfVxuXG4gIGRpc3Bvc2VQcmV2aW91c1NjcmVlbiAoKSB7XG4gICAgaWYgKCF0aGlzLnByZXZpb3VzU2NyZWVuKSByZXR1cm47XG4gIFxuICAgIHRoaXMuZ2V0SXRlbSh0aGlzLnByZXZpb3VzSXRlbUlkKS5kaXNwb3NlU2NyZWVuKHRoaXMucHJldmlvdXNTY3JlZW4pO1xuICBcbiAgICB0aGlzLnByZXZpb3VzU2NyZWVuID0gbnVsbDtcbiAgfVxuXG4gIGRpc3Bvc2VDdXJyZW50U2NyZWVuICgpIHtcbiAgICBpZiAoIXRoaXMuY3VycmVudFNjcmVlbikgcmV0dXJuO1xuICBcbiAgICB0aGlzLmdldEl0ZW0odGhpcy5jdXJyZW50SXRlbUlkKS5kaXNwb3NlU2NyZWVuKHRoaXMuY3VycmVudFNjcmVlbik7XG4gIFxuICAgIHRoaXMuY3VycmVudFNjcmVlbiA9IG51bGw7XG4gIH1cbn1cblxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyZWVuTmF2aWdhdG9ySXRlbSB7XG4gIGNvbnN0cnVjdG9yIChzY3JlZW4sIG9wdGlvbnMpIHtcbiAgICB0aGlzLnNjcmVlbiA9IHNjcmVlbjtcblxuICAgIHRoaXMuaXNJbnN0YW5jZSA9IHR5cGVvZiBzY3JlZW4gIT09ICdmdW5jdGlvbic7XG4gICAgdGhpcy5pbnRlcm5hbEluc3RhbmNlID0gbnVsbDtcblxuICAgIC8vIGRlZmF1bHQgb3B0aW9uc1xuICAgIHRoaXMuYXJndW1lbnRzID0gbnVsbDtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBudWxsO1xuICAgIHRoaXMuY2FuRGlzcG9zZSA9ICF0aGlzLmlzSW5zdGFuY2U7XG4gICAgdGhpcy5ldmVudHMgPSBudWxsO1xuXG4gICAgdGhpcy5oYXNFdmVudHNMaXN0ZW5lcnMgPSBmYWxzZTtcblxuICAgIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgfVxuICBcbiAgc2V0T3B0aW9ucyAob3B0aW9ucykge1xuICAgIGZvciAobGV0IG9wdGlvbktleSBpbiBvcHRpb25zKXtcbiAgICAgIGlmICh0eXBlb2YgdGhpc1tvcHRpb25LZXldICE9PSAndW5kZWZpbmVkJykgdGhpc1tvcHRpb25LZXldID0gb3B0aW9uc1tvcHRpb25LZXldO1xuICAgIH1cbiAgfVxuXG4gIGdldFNjcmVlbiAoKSB7XG4gICAgbGV0IGluc3RhbmNlO1xuXG4gICAgaWYgKHRoaXMuaXNJbnN0YW5jZSl7XG4gICAgICBpbnN0YW5jZSA9IHRoaXMuc2NyZWVuO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pbnRlcm5hbEluc3RhbmNlKXtcbiAgICAgIGluc3RhbmNlID0gdGhpcy5pbnRlcm5hbEluc3RhbmNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhcmdzID0gdGhpcy5hcmd1bWVudHMgfHwgW107XG5cbiAgICAgIGluc3RhbmNlID0gbmV3IHRoaXMuc2NyZWVuKC4uLmFyZ3MpO1xuXG4gICAgICBpZiAoIXRoaXMuY2FuRGlzcG9zZSkgdGhpcy5pbnRlcm5hbEluc3RhbmNlID0gaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcGVydGllcyl7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5wcm9wZXJ0aWVzKXtcbiAgICAgICAgaW5zdGFuY2Vba2V5XSA9IHRoaXMucHJvcGVydGllc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmV2ZW50cykgdGhpcy5hZGRFdmVudHNMaXN0ZW5lcnMoaW5zdGFuY2UpO1xuXG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG5cbiAgYWRkRXZlbnRzTGlzdGVuZXJzIChpbnN0YW5jZSkge1xuICAgIGlmICghdGhpcy5jYW5EaXNwb3NlKXtcbiAgICAgIGlmICh0aGlzLmhhc0V2ZW50c0xpc3RlbmVycykgcmV0dXJuO1xuICBcbiAgICAgIHRoaXMuaGFzRXZlbnRzTGlzdGVuZXJzID0gdHJ1ZTtcbiAgICB9XG4gIFxuICAgIGZvciAobGV0IGV2ZW50TmFtZSBpbiB0aGlzLmV2ZW50cyl7XG4gICAgICBpZiAodHlwZW9mIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPT09ICdmdW5jdGlvbicpe1xuICAgICAgICBpbnN0YW5jZS5vbihldmVudE5hbWUsIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUV2ZW50c0xpc3RlbmVycyAoaW5zdGFuY2UpIHtcbiAgICB0aGlzLmhhc0V2ZW50c0xpc3RlbmVycyA9IGZhbHNlO1xuXG4gICAgZm9yIChsZXQgZXZlbnROYW1lIGluIHRoaXMuZXZlbnRzKXtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgIGluc3RhbmNlLm9mZihldmVudE5hbWUsIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRpc3Bvc2VTY3JlZW4gKGluc3RhbmNlLCBmb3JjZURpc3Bvc2UpIHtcbiAgICBpZiAodGhpcy5ldmVudHMpIHRoaXMucmVtb3ZlRXZlbnRzTGlzdGVuZXJzKGluc3RhbmNlKTtcblxuICAgIGlmICghZm9yY2VEaXNwb3NlICYmICF0aGlzLmNhbkRpc3Bvc2UpIHJldHVybjtcblxuICAgIGlmICh0eXBlb2YgaW5zdGFuY2UuZGlzcG9zZSA9PT0gJ2Z1bmN0aW9uJykgaW5zdGFuY2UuZGlzcG9zZSgpO1xuXG4gICAgdGhpcy5pbnRlcm5hbEluc3RhbmNlID0gbnVsbDtcbiAgfVxuXG4gIGRpc3Bvc2UgKGZvcmNlRGlzcG9zZSkge1xuICAgIGlmICh0eXBlb2YgZm9yY2VEaXNwb3NlICE9PSAnYm9vbGVhbicpIGZvcmNlRGlzcG9zZSA9IHRydWU7XG5cbiAgICBsZXQgaW5zdGFuY2UgPSB0aGlzLmlzSW5zdGFuY2UgPyB0aGlzLnNjcmVlbiA6IHRoaXMuaW50ZXJuYWxJbnN0YW5jZTtcblxuICAgIGlmIChpbnN0YW5jZSl7XG4gICAgICB0aGlzLmRpc3Bvc2VTY3JlZW4oaW5zdGFuY2UsIGZvcmNlRGlzcG9zZSk7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuc2NyZWVuID0gXG4gICAgdGhpcy5pbnRlcm5hbEluc3RhbmNlID0gXG4gICAgdGhpcy5hcmd1bWVudHMgPSBcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBcbiAgICB0aGlzLmV2ZW50cyA9IFxuICAgIG51bGw7XG4gIH1cbn1cblxuIiwiaW1wb3J0IE5vbmUgZnJvbSAnLi90cmFuc2l0aW9ucy9Ob25lLmpzJztcbmltcG9ydCBJbiBmcm9tICcuL3RyYW5zaXRpb25zL0luLmpzJztcbmltcG9ydCBPdXQgZnJvbSAnLi90cmFuc2l0aW9ucy9PdXQuanMnO1xuaW1wb3J0IE91dEFuZEluIGZyb20gJy4vdHJhbnNpdGlvbnMvT3V0QW5kSW4uanMnO1xuaW1wb3J0IE91dFRoZW5JbiBmcm9tICcuL3RyYW5zaXRpb25zL091dFRoZW5Jbi5qcyc7XG5pbXBvcnQgSW5UaGVuT3V0IGZyb20gJy4vdHJhbnNpdGlvbnMvSW5UaGVuT3V0LmpzJztcblxuZXhwb3J0IGRlZmF1bHQge05vbmUsIEluLCBPdXQsIEluVGhlbk91dCwgT3V0QW5kSW4sIE91dFRoZW5Jbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjaykge1xuXHRsZXQgcHJvbWlzZTtcblx0XG5cdGlmIChuZXdTY3JlZW4pIHtcblx0XHRwcm9taXNlID0gbmV3U2NyZWVuLmFuaW1hdGVJbigpLnRoZW4ob25Db21wbGV0ZSk7XG5cdH1lbHNle1xuXHRcdG9uQ29tcGxldGUoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQ29tcGxldGUoKXtcblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCgpO1xuXG5cdFx0Y29tcGxldGVDYWxsYmFjaygpO1xuXHR9XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCgpe1xuXHRcdGlmIChwcm9taXNlKSBwcm9taXNlLnJlamVjdCgnY2FuY2VsZWQnKTtcblx0XHRcblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9O1xufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjaykge1xuXHRsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKCk7XG5cblx0aWYgKG5ld1NjcmVlbikgcHJvbWlzZS50aGVuKG5ld1NjcmVlbi5hbmltYXRlSW4oKSk7XG5cdGlmIChvbGRTY3JlZW4pIHByb21pc2UudGhlbihvbGRTY3JlZW4uYW5pbWF0ZU91dCgpKTtcblxuXHRwcm9taXNlLnRoZW4oY29tcGxldGVDYWxsYmFjayk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCgpe1xuXHRcdHByb21pc2UucmVqZWN0KCdjYW5jZWxlZCcpO1xuXG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblx0fTtcbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIGNvbXBsZXRlQ2FsbGJhY2spIHtcblx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXG5cdGNvbXBsZXRlQ2FsbGJhY2soKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsICgpIHt9O1xufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjaykge1xuXHRsZXQgcHJvbWlzZTtcblxuXHRpZiAob2xkU2NyZWVuKSB7XG5cdFx0cHJvbWlzZSA9IG9sZFNjcmVlbi5hbmltYXRlT3V0KCkudGhlbihvbkNvbXBsZXRlKTtcblx0fWVsc2V7XG5cdFx0b25Db21wbGV0ZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25Db21wbGV0ZSgpe1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblxuXHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRpZiAocHJvbWlzZSkgcHJvbWlzZS5yZWplY3QoJ2NhbmNlbGVkJyk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9O1xufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjaykge1xuXHRsZXQgcHJvbWlzZXMgPSBbXTtcblxuXHRpZiAob2xkU2NyZWVuKSBwcm9taXNlcy5wdXNoKG9sZFNjcmVlbi5hbmltYXRlT3V0KCkpO1xuXHRpZiAobmV3U2NyZWVuKSBwcm9taXNlcy5wdXNoKG5ld1NjcmVlbi5hbmltYXRlSW4oKSk7XG5cblx0UHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oY29tcGxldGVDYWxsYmFjayk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCgpe1xuXHRcdHByb21pc2VzLmZvckVhY2gocHJvbWlzZSA9PiBwcm9taXNlLnJlamVjdCgnY2FuY2VsZWQnKSlcblxuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KHRydWUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4odHJ1ZSk7XG5cdH1cbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKSB7XG5cdGxldCBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdGxldCBjYW5jZWxlZCA9IGZhbHNlO1xuXG5cdGlmIChvbGRTY3JlZW4pIHByb21pc2UgPSBwcm9taXNlLnRoZW4ob2xkU2NyZWVuLmFuaW1hdGVPdXQuYmluZChvbGRTY3JlZW4pKTtcblx0aWYgKG5ld1NjcmVlbikgcHJvbWlzZSA9IHByb21pc2UudGhlbihuZXdTY3JlZW4uYW5pbWF0ZUluLmJpbmQobmV3U2NyZWVuKSk7XG5cblx0cHJvbWlzZSA9IHByb21pc2UudGhlbihvbkNvbXBsZXRlKTtcblxuXHRmdW5jdGlvbiBvbkNvbXBsZXRlICgpIHtcblx0XHRpZiAoY2FuY2VsZWQpIHJldHVybjtcblxuXHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRjYW5jZWxlZCA9IHRydWU7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9O1xufTsiLCJpbXBvcnQgU2NyZWVuTmF2aWdhdG9yLCB7VHJhbnNpdGlvbnMsIEFTY3JlZW59IGZyb20gJy4vc3JjL1NjcmVlbk5hdmlnYXRvcic7XG5cblNjcmVlbk5hdmlnYXRvci5UcmFuc2l0aW9ucyA9IFRyYW5zaXRpb25zO1xuU2NyZWVuTmF2aWdhdG9yLkFTY3JlZW4gPSBBU2NyZWVuO1xuXG53aW5kb3cuU2NyZWVuTmF2aWdhdG9yID0gU2NyZWVuTmF2aWdhdG9yOyJdfQ==
