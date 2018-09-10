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

window.ScreenNavigator = _ScreenNavigator2.default;

},{"./src/ScreenNavigator":3}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdGlueS1lbWl0dGVyL2luZGV4LmpzIiwic3JjL0FTY3JlZW4uanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9yLmpzIiwic3JjL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMiLCJzcmMvVHJhbnNpdGlvbnMuanMiLCJzcmMvdHJhbnNpdGlvbnMvSW4uanMiLCJzcmMvdHJhbnNpdGlvbnMvSW5UaGVuT3V0LmpzIiwic3JjL3RyYW5zaXRpb25zL05vbmUuanMiLCJzcmMvdHJhbnNpdGlvbnMvT3V0LmpzIiwic3JjL3RyYW5zaXRpb25zL091dEFuZEluLmpzIiwic3JjL3RyYW5zaXRpb25zL091dFRoZW5Jbi5qcyIsInN0YW5kYWxvbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ2xFQTs7Ozs7Ozs7Ozs7O0lBRXFCLE87Ozs7Ozs7Ozs7OzhCQUNSLENBQ1Y7OztnQ0FFb0M7QUFBQTs7QUFBQSxVQUExQixnQkFBMEIsdUVBQVAsS0FBTzs7QUFDbkMsYUFBTyxJQUFJLE9BQUosQ0FBWSxtQkFBVztBQUM1QixZQUFJLGdCQUFKLEVBQXNCLE9BQUss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OztrQkNoQmMsVUFBVSxTQUFWLEVBQXFCLFNBQXJCLEVBQWdDLGdCQUFoQyxFQUFrRDtBQUNoRSxVQUFTLGFBQVQsR0FBeUI7QUFDeEIsU0FBTyxRQUFRLE1BQVIsQ0FBZSxtQkFBZixFQUFvQyxLQUFwQyxDQUEwQyxVQUFVLEtBQVYsRUFBaUIsQ0FBRSxDQUE3RCxDQUFQO0FBQ0E7O0FBRUQsU0FBUSxPQUFSLEdBQ0UsSUFERixDQUNPLGFBQWEsVUFBVSxVQUFWLENBQXFCLElBQXJCLENBQTBCLFNBQTFCLENBRHBCLEVBQzBELGFBRDFELEVBRUUsSUFGRixDQUVPLGFBQWEsVUFBVSxTQUFWLENBQW9CLElBQXBCLENBQXlCLFNBQXpCLENBRnBCLEVBRXlELGFBRnpELEVBR0UsSUFIRixDQUdPLGdCQUhQLEVBR3lCLGFBSHpCOztBQUtBLFFBQU8sU0FBUyxNQUFULEdBQWlCO0FBQ3ZCOztBQUVBLE1BQUksU0FBSixFQUFlLFVBQVUsVUFBVixDQUFxQixJQUFyQjtBQUNmLE1BQUksU0FBSixFQUFlLFVBQVUsU0FBVixDQUFvQixJQUFwQjtBQUNmLEVBTEQ7QUFNQSxDOztBQUFBOzs7OztBQ2hCRDs7Ozs7O0FBRUEsMEJBQWdCLFdBQWhCLEdBQThCLDRCQUE5QjtBQUNBLDBCQUFnQixPQUFoQixHQUEwQix3QkFBMUI7O0FBRUEsT0FBTyxlQUFQLEdBQXlCLHlCQUF6QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImZ1bmN0aW9uIEUgKCkge1xuICAvLyBLZWVwIHRoaXMgZW1wdHkgc28gaXQncyBlYXNpZXIgdG8gaW5oZXJpdCBmcm9tXG4gIC8vICh2aWEgaHR0cHM6Ly9naXRodWIuY29tL2xpcHNtYWNrIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9pc3N1ZXMvMylcbn1cblxuRS5wcm90b3R5cGUgPSB7XG4gIG9uOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG5cbiAgICAoZVtuYW1lXSB8fCAoZVtuYW1lXSA9IFtdKSkucHVzaCh7XG4gICAgICBmbjogY2FsbGJhY2ssXG4gICAgICBjdHg6IGN0eFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb25jZTogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgZnVuY3Rpb24gbGlzdGVuZXIgKCkge1xuICAgICAgc2VsZi5vZmYobmFtZSwgbGlzdGVuZXIpO1xuICAgICAgY2FsbGJhY2suYXBwbHkoY3R4LCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBsaXN0ZW5lci5fID0gY2FsbGJhY2tcbiAgICByZXR1cm4gdGhpcy5vbihuYW1lLCBsaXN0ZW5lciwgY3R4KTtcbiAgfSxcblxuICBlbWl0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBkYXRhID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBldnRBcnIgPSAoKHRoaXMuZSB8fCAodGhpcy5lID0ge30pKVtuYW1lXSB8fCBbXSkuc2xpY2UoKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGxlbiA9IGV2dEFyci5sZW5ndGg7XG5cbiAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgZXZ0QXJyW2ldLmZuLmFwcGx5KGV2dEFycltpXS5jdHgsIGRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9mZjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcbiAgICB2YXIgZXZ0cyA9IGVbbmFtZV07XG4gICAgdmFyIGxpdmVFdmVudHMgPSBbXTtcblxuICAgIGlmIChldnRzICYmIGNhbGxiYWNrKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZXZ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZXZ0c1tpXS5mbiAhPT0gY2FsbGJhY2sgJiYgZXZ0c1tpXS5mbi5fICE9PSBjYWxsYmFjaylcbiAgICAgICAgICBsaXZlRXZlbnRzLnB1c2goZXZ0c1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGV2ZW50IGZyb20gcXVldWUgdG8gcHJldmVudCBtZW1vcnkgbGVha1xuICAgIC8vIFN1Z2dlc3RlZCBieSBodHRwczovL2dpdGh1Yi5jb20vbGF6ZFxuICAgIC8vIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9jb21taXQvYzZlYmZhYTliYzk3M2IzM2QxMTBhODRhMzA3NzQyYjdjZjk0Yzk1MyNjb21taXRjb21tZW50LTUwMjQ5MTBcblxuICAgIChsaXZlRXZlbnRzLmxlbmd0aClcbiAgICAgID8gZVtuYW1lXSA9IGxpdmVFdmVudHNcbiAgICAgIDogZGVsZXRlIGVbbmFtZV07XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFO1xuIiwiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBU2NyZWVuIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgZGlzcG9zZSAoKSB7XG4gIH1cblxuICBhbmltYXRlSW4gKGNhbmNlbFRyYW5zaXRpb24gPSBmYWxzZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGlmIChjYW5jZWxUcmFuc2l0aW9uKSB0aGlzLmNhbmNlbEFuaW1JbihyZXNvbHZlKTtcbiAgICAgIGVsc2UgdGhpcy5jcmVhdGVBbmltSW4ocmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBjcmVhdGVBbmltSW4gKHJlc29sdmVQcm9taXNlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UoKTtcbiAgfVxuXG4gIGNhbmNlbEFuaW1JbiAocmVzb2x2ZVByb21pc2UpIHtcbiAgICByZXNvbHZlUHJvbWlzZSgpO1xuICB9XG4gIFxuICBhbmltYXRlT3V0IChjYW5jZWxUcmFuc2l0aW9uID0gZmFsc2UpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAoY2FuY2VsVHJhbnNpdGlvbikgdGhpcy5jYW5jZWxBbmltT3V0KHJlc29sdmUpO1xuICAgICAgZWxzZSB0aGlzLmNyZWF0ZUFuaW1PdXQocmVzb2x2ZSk7XG4gICAgfSk7XG4gIH1cblxuICBjcmVhdGVBbmltT3V0IChyZXNvbHZlUHJvbWlzZSkge1xuICAgIHJlc29sdmVQcm9taXNlKCk7XG4gIH1cblxuICBjYW5jZWxBbmltT3V0IChyZXNvbHZlUHJvbWlzZSkge1xuICAgIHJlc29sdmVQcm9taXNlKCk7XG4gIH1cbn1cblxuIiwiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IFNjcmVlbk5hdmlnYXRvckl0ZW0gZnJvbSAnLi9TY3JlZW5OYXZpZ2F0b3JJdGVtJztcbmltcG9ydCBUcmFuc2l0aW9ucyBmcm9tICcuL1RyYW5zaXRpb25zJztcbmltcG9ydCBBU2NyZWVuIGZyb20gJy4vQVNjcmVlbidcblxuZXhwb3J0IHtUcmFuc2l0aW9ucywgQVNjcmVlbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyZWVuTmF2aWdhdG9yIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgc3RhdGljIGRlZmF1bHRUcmFuc2l0aW9uID0gVHJhbnNpdGlvbnMuTm9uZTtcblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKTtcbiAgICBcbiAgICB0aGlzLml0ZW1zID0ge307XG5cbiAgICB0aGlzLmN1cnJlbnRJdGVtSWQgPSBudWxsO1xuICAgIHRoaXMucHJldmlvdXNJdGVtSWQgPSBudWxsO1xuXG4gICAgdGhpcy5jdXJyZW50U2NyZWVuID0gbnVsbDtcbiAgICB0aGlzLnByZXZpb3VzU2NyZWVuID0gbnVsbDtcblxuICAgIHRoaXMudHJhbnNpdGlvbiA9IFNjcmVlbk5hdmlnYXRvci5kZWZhdWx0VHJhbnNpdGlvbjtcbiAgICB0aGlzLnRyYW5zaXRpb25SdW5uaW5nID0gZmFsc2U7XG4gICAgdGhpcy50cmFuc2l0aW9uQ2FuY2VsID0gbnVsbDtcbiAgfVxuICBcbiAgYWRkSXRlbSAoaWQsIHNjcmVlbiwgb3B0aW9ucykge1xuICAgIGNvbnN0IGl0ZW0gPSBuZXcgU2NyZWVuTmF2aWdhdG9ySXRlbShzY3JlZW4sIG9wdGlvbnMpO1xuICBcbiAgICB0aGlzLml0ZW1zW2lkXSA9IGl0ZW07XG4gIFxuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgZ2V0SXRlbSAoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtc1tpZF07XG4gIH1cblxuICBzaG93U2NyZWVuIChpZCwgdHJhbnNpdGlvbiwgb3B0aW9ucykge1xuICAgIGlmICghdGhpcy5nZXRJdGVtKGlkKSl7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NjcmVlbk5hdmlnYXRvciAtIHRoZSBpdGVtIHdpdGggdGhlIGlkICcgKyBpZCArICcgZG9lc25cXCd0IGV4aXN0Jyk7XG4gICAgfVxuICBcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uUnVubmluZyl7XG4gICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKHRydWUpO1xuICAgIH0gXG4gIFxuICAgIGlmICh0aGlzLmN1cnJlbnRTY3JlZW4pe1xuICAgICAgdGhpcy5wcmV2aW91c0l0ZW1JZCA9IHRoaXMuY3VycmVudEl0ZW1JZDtcbiAgICAgIHRoaXMucHJldmlvdXNTY3JlZW4gPSB0aGlzLmN1cnJlbnRTY3JlZW47XG4gICAgfVxuICBcbiAgICB0aGlzLmN1cnJlbnRJdGVtSWQgPSBpZDtcbiAgXG4gICAgdGhpcy5vblNjcmVlbkNoYW5nZSgpO1xuICBcbiAgICB0aGlzLnN0YXJ0VHJhbnNpdGlvbih0cmFuc2l0aW9uLCBvcHRpb25zKTtcbiAgfVxuXG4gIGNsZWFyU2NyZWVuICh0cmFuc2l0aW9uKSB7XG4gICAgaWYgKCF0aGlzLmN1cnJlbnRTY3JlZW4pe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgXG4gICAgdGhpcy5wcmV2aW91c0l0ZW1JZCA9IHRoaXMuY3VycmVudEl0ZW1JZDtcbiAgICB0aGlzLnByZXZpb3VzU2NyZWVuID0gdGhpcy5jdXJyZW50U2NyZWVuO1xuICBcbiAgICB0aGlzLmN1cnJlbnRJdGVtSWQgPSBudWxsO1xuICBcbiAgICB0aGlzLm9uU2NyZWVuQ2hhbmdlKCk7XG4gIFxuICAgIHRoaXMuc3RhcnRUcmFuc2l0aW9uKHRyYW5zaXRpb24pO1xuICB9XG5cbiAgc3RhcnRUcmFuc2l0aW9uICh0cmFuc2l0aW9uLCBvcHRpb25zKSB7XG4gICAgdHJhbnNpdGlvbiA9IHRyYW5zaXRpb24gfHwgdGhpcy50cmFuc2l0aW9uO1xuICBcbiAgICBjb25zdCBjdXJyZW50SXRlbSA9IHRoaXMuZ2V0SXRlbSh0aGlzLmN1cnJlbnRJdGVtSWQpO1xuICBcbiAgICBpZiAob3B0aW9ucykgY3VycmVudEl0ZW0uc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgXG4gICAgdGhpcy5jdXJyZW50U2NyZWVuID0gY3VycmVudEl0ZW0gPyBjdXJyZW50SXRlbS5nZXRTY3JlZW4ob3B0aW9ucykgOiBudWxsO1xuICBcbiAgICB0aGlzLnRyYW5zaXRpb25SdW5uaW5nID0gdHJ1ZTtcbiAgXG4gICAgdGhpcy5lbWl0KCd0cmFuc2l0aW9uU3RhcnQnKTtcbiAgXG4gICAgdGhpcy50cmFuc2l0aW9uQ2FuY2VsID0gdHJhbnNpdGlvbih0aGlzLmN1cnJlbnRTY3JlZW4sIHRoaXMucHJldmlvdXNTY3JlZW4sIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUuYmluZCh0aGlzKSk7XG4gIH1cblxuICBvblNjcmVlbkNoYW5nZSAoKSB7XG4gICAgdGhpcy5lbWl0KCdzY3JlZW5DaGFuZ2UnKTtcbiAgfVxuXG4gIG9uVHJhbnNpdGlvbkNvbXBsZXRlIChjYW5jZWxUcmFuc2l0aW9uLCBzaWxlbnQpIHtcbiAgICB0aGlzLnRyYW5zaXRpb25SdW5uaW5nID0gZmFsc2U7XG4gIFxuICAgIGlmIChjYW5jZWxUcmFuc2l0aW9uKXtcbiAgICAgIGlmICh0aGlzLnRyYW5zaXRpb25DYW5jZWwpIHRoaXMudHJhbnNpdGlvbkNhbmNlbCgpO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLmRpc3Bvc2VQcmV2aW91c1NjcmVlbigpO1xuICBcbiAgICBpZiAoIXNpbGVudCl7XG4gICAgICBpZiAoY2FuY2VsVHJhbnNpdGlvbil7XG4gICAgICAgIHRoaXMuZW1pdCgndHJhbnNpdGlvbkNhbmNlbCcpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMuZW1pdCgndHJhbnNpdGlvbkNvbXBsZXRlJyk7XG4gICAgICB9XG4gICAgfVxuICBcbiAgICB0aGlzLnRyYW5zaXRpb25DYW5jZWwgPSBudWxsO1xuICB9XG5cbiAgZGlzcG9zZSAoZm9yY2VEaXNwb3NlKSB7XG4gICAgaWYgKHR5cGVvZiBmb3JjZURpc3Bvc2UgIT09ICdib29sZWFuJykgZm9yY2VEaXNwb3NlID0gdHJ1ZTtcbiAgXG4gICAgaWYgKHRoaXMudHJhbnNpdGlvblJ1bm5pbmcpe1xuICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSh0cnVlLCB0cnVlKTtcbiAgICB9XG4gIFxuICAgIHRoaXMuZGlzcG9zZUN1cnJlbnRTY3JlZW4oKTtcbiAgICB0aGlzLmRpc3Bvc2VQcmV2aW91c1NjcmVlbigpO1xuICBcbiAgICBmb3IgKGxldCBpdGVtSWQgaW4gdGhpcy5pdGVtcyl7XG4gICAgICB0aGlzLml0ZW1zW2l0ZW1JZF0uZGlzcG9zZShmb3JjZURpc3Bvc2UpO1xuICBcbiAgICAgIGRlbGV0ZSB0aGlzLml0ZW1zW2l0ZW1JZF07XG4gICAgfVxuICBcbiAgICB0aGlzLnRyYW5zaXRpb24gPSBudWxsO1xuICB9XG5cbiAgZGlzcG9zZVByZXZpb3VzU2NyZWVuICgpIHtcbiAgICBpZiAoIXRoaXMucHJldmlvdXNTY3JlZW4pIHJldHVybjtcbiAgXG4gICAgdGhpcy5nZXRJdGVtKHRoaXMucHJldmlvdXNJdGVtSWQpLmRpc3Bvc2VTY3JlZW4odGhpcy5wcmV2aW91c1NjcmVlbik7XG4gIFxuICAgIHRoaXMucHJldmlvdXNTY3JlZW4gPSBudWxsO1xuICB9XG5cbiAgZGlzcG9zZUN1cnJlbnRTY3JlZW4gKCkge1xuICAgIGlmICghdGhpcy5jdXJyZW50U2NyZWVuKSByZXR1cm47XG4gIFxuICAgIHRoaXMuZ2V0SXRlbSh0aGlzLmN1cnJlbnRJdGVtSWQpLmRpc3Bvc2VTY3JlZW4odGhpcy5jdXJyZW50U2NyZWVuKTtcbiAgXG4gICAgdGhpcy5jdXJyZW50U2NyZWVuID0gbnVsbDtcbiAgfVxufVxuXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JlZW5OYXZpZ2F0b3JJdGVtIHtcbiAgY29uc3RydWN0b3IgKHNjcmVlbiwgb3B0aW9ucykge1xuICAgIHRoaXMuc2NyZWVuID0gc2NyZWVuO1xuXG4gICAgdGhpcy5pc0luc3RhbmNlID0gdHlwZW9mIHNjcmVlbiAhPT0gJ2Z1bmN0aW9uJztcbiAgICB0aGlzLmludGVybmFsSW5zdGFuY2UgPSBudWxsO1xuXG4gICAgLy8gZGVmYXVsdCBvcHRpb25zXG4gICAgdGhpcy5hcmd1bWVudHMgPSBudWxsO1xuICAgIHRoaXMucHJvcGVydGllcyA9IG51bGw7XG4gICAgdGhpcy5jYW5EaXNwb3NlID0gIXRoaXMuaXNJbnN0YW5jZTtcbiAgICB0aGlzLmV2ZW50cyA9IG51bGw7XG5cbiAgICB0aGlzLmhhc0V2ZW50c0xpc3RlbmVycyA9IGZhbHNlO1xuXG4gICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICB9XG4gIFxuICBzZXRPcHRpb25zIChvcHRpb25zKSB7XG4gICAgZm9yIChsZXQgb3B0aW9uS2V5IGluIG9wdGlvbnMpe1xuICAgICAgaWYgKHR5cGVvZiB0aGlzW29wdGlvbktleV0gIT09ICd1bmRlZmluZWQnKSB0aGlzW29wdGlvbktleV0gPSBvcHRpb25zW29wdGlvbktleV07XG4gICAgfVxuICB9XG5cbiAgZ2V0U2NyZWVuICgpIHtcbiAgICBsZXQgaW5zdGFuY2U7XG5cbiAgICBpZiAodGhpcy5pc0luc3RhbmNlKXtcbiAgICAgIGluc3RhbmNlID0gdGhpcy5zY3JlZW47XG4gICAgfSBlbHNlIGlmICh0aGlzLmludGVybmFsSW5zdGFuY2Upe1xuICAgICAgaW5zdGFuY2UgPSB0aGlzLmludGVybmFsSW5zdGFuY2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLmFyZ3VtZW50cyB8fCBbXTtcblxuICAgICAgaW5zdGFuY2UgPSBuZXcgdGhpcy5zY3JlZW4oLi4uYXJncyk7XG5cbiAgICAgIGlmICghdGhpcy5jYW5EaXNwb3NlKSB0aGlzLmludGVybmFsSW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wZXJ0aWVzKXtcbiAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLnByb3BlcnRpZXMpe1xuICAgICAgICBpbnN0YW5jZVtrZXldID0gdGhpcy5wcm9wZXJ0aWVzW2tleV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZXZlbnRzKSB0aGlzLmFkZEV2ZW50c0xpc3RlbmVycyhpbnN0YW5jZSk7XG5cbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH1cblxuICBhZGRFdmVudHNMaXN0ZW5lcnMgKGluc3RhbmNlKSB7XG4gICAgaWYgKCF0aGlzLmNhbkRpc3Bvc2Upe1xuICAgICAgaWYgKHRoaXMuaGFzRXZlbnRzTGlzdGVuZXJzKSByZXR1cm47XG4gIFxuICAgICAgdGhpcy5oYXNFdmVudHNMaXN0ZW5lcnMgPSB0cnVlO1xuICAgIH1cbiAgXG4gICAgZm9yIChsZXQgZXZlbnROYW1lIGluIHRoaXMuZXZlbnRzKXtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgIGluc3RhbmNlLm9uKGV2ZW50TmFtZSwgdGhpcy5ldmVudHNbZXZlbnROYW1lXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRXZlbnRzTGlzdGVuZXJzIChpbnN0YW5jZSkge1xuICAgIHRoaXMuaGFzRXZlbnRzTGlzdGVuZXJzID0gZmFsc2U7XG5cbiAgICBmb3IgKGxldCBldmVudE5hbWUgaW4gdGhpcy5ldmVudHMpe1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLmV2ZW50c1tldmVudE5hbWVdID09PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgaW5zdGFuY2Uub2ZmKGV2ZW50TmFtZSwgdGhpcy5ldmVudHNbZXZlbnROYW1lXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGlzcG9zZVNjcmVlbiAoaW5zdGFuY2UsIGZvcmNlRGlzcG9zZSkge1xuICAgIGlmICh0aGlzLmV2ZW50cykgdGhpcy5yZW1vdmVFdmVudHNMaXN0ZW5lcnMoaW5zdGFuY2UpO1xuXG4gICAgaWYgKCFmb3JjZURpc3Bvc2UgJiYgIXRoaXMuY2FuRGlzcG9zZSkgcmV0dXJuO1xuXG4gICAgaWYgKHR5cGVvZiBpbnN0YW5jZS5kaXNwb3NlID09PSAnZnVuY3Rpb24nKSBpbnN0YW5jZS5kaXNwb3NlKCk7XG5cbiAgICB0aGlzLmludGVybmFsSW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgZGlzcG9zZSAoZm9yY2VEaXNwb3NlKSB7XG4gICAgaWYgKHR5cGVvZiBmb3JjZURpc3Bvc2UgIT09ICdib29sZWFuJykgZm9yY2VEaXNwb3NlID0gdHJ1ZTtcblxuICAgIGxldCBpbnN0YW5jZSA9IHRoaXMuaXNJbnN0YW5jZSA/IHRoaXMuc2NyZWVuIDogdGhpcy5pbnRlcm5hbEluc3RhbmNlO1xuXG4gICAgaWYgKGluc3RhbmNlKXtcbiAgICAgIHRoaXMuZGlzcG9zZVNjcmVlbihpbnN0YW5jZSwgZm9yY2VEaXNwb3NlKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5zY3JlZW4gPSBcbiAgICB0aGlzLmludGVybmFsSW5zdGFuY2UgPSBcbiAgICB0aGlzLmFyZ3VtZW50cyA9IFxuICAgIHRoaXMucHJvcGVydGllcyA9IFxuICAgIHRoaXMuZXZlbnRzID0gXG4gICAgbnVsbDtcbiAgfVxufVxuXG4iLCJpbXBvcnQgTm9uZSBmcm9tICcuL3RyYW5zaXRpb25zL05vbmUuanMnO1xuaW1wb3J0IEluIGZyb20gJy4vdHJhbnNpdGlvbnMvSW4uanMnO1xuaW1wb3J0IE91dCBmcm9tICcuL3RyYW5zaXRpb25zL091dC5qcyc7XG5pbXBvcnQgT3V0QW5kSW4gZnJvbSAnLi90cmFuc2l0aW9ucy9PdXRBbmRJbi5qcyc7XG5pbXBvcnQgT3V0VGhlbkluIGZyb20gJy4vdHJhbnNpdGlvbnMvT3V0VGhlbkluLmpzJztcbmltcG9ydCBJblRoZW5PdXQgZnJvbSAnLi90cmFuc2l0aW9ucy9JblRoZW5PdXQuanMnO1xuXG5leHBvcnQgZGVmYXVsdCB7Tm9uZSwgSW4sIE91dCwgSW5UaGVuT3V0LCBPdXRBbmRJbiwgT3V0VGhlbklufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKSB7XG5cdGZ1bmN0aW9uIGNhbmNlbFByb21pc2UoKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KCdjYW5jZWwgdHJhbnNpdGlvbicpLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge30pO1xuXHR9O1xuXG5cdFByb21pc2UucmVzb2x2ZSgpXG5cdFx0LnRoZW4obmV3U2NyZWVuICYmIG5ld1NjcmVlbi5hbmltYXRlSW4uYmluZChuZXdTY3JlZW4pLCBjYW5jZWxQcm9taXNlKVxuXHRcdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cblx0XHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0XHR9LCBjYW5jZWxQcm9taXNlKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7XG5cdFx0Y2FuY2VsUHJvbWlzZSgpO1xuXHRcdFxuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KHRydWUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4odHJ1ZSk7XG5cdH07XG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKSB7XG5cdGZ1bmN0aW9uIGNhbmNlbFByb21pc2UoKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KCdjYW5jZWwgdHJhbnNpdGlvbicpLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge30pO1xuXHR9O1xuXG5cdFByb21pc2UucmVzb2x2ZSgpXG5cdFx0LnRoZW4obmV3U2NyZWVuICYmIG5ld1NjcmVlbi5hbmltYXRlSW4uYmluZChuZXdTY3JlZW4pLCBjYW5jZWxQcm9taXNlKVxuXHRcdC50aGVuKG9sZFNjcmVlbiAmJiBvbGRTY3JlZW4uYW5pbWF0ZU91dC5iaW5kKG9sZFNjcmVlbiksIGNhbmNlbFByb21pc2UpXG5cdFx0LnRoZW4oY29tcGxldGVDYWxsYmFjaywgY2FuY2VsUHJvbWlzZSk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCgpe1xuXHRcdGNhbmNlbFByb21pc2UoKTtcblxuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KHRydWUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4odHJ1ZSk7XG5cdH07XG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKSB7XG5cdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblxuXHRjb21wbGV0ZUNhbGxiYWNrKCk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCAoKSB7fTtcbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIGNvbXBsZXRlQ2FsbGJhY2spIHtcblx0ZnVuY3Rpb24gY2FuY2VsUHJvbWlzZSgpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoJ2NhbmNlbCB0cmFuc2l0aW9uJykuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7fSk7XG5cdH07XG5cblx0UHJvbWlzZS5yZXNvbHZlKClcblx0XHQudGhlbihvbGRTY3JlZW4gJiYgb2xkU2NyZWVuLmFuaW1hdGVPdXQuYmluZChvbGRTY3JlZW4pLCBjYW5jZWxQcm9taXNlKVxuXHRcdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblxuXHRcdFx0Y29tcGxldGVDYWxsYmFjaygpO1xuXHRcdH0sIGNhbmNlbFByb21pc2UpO1xuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRjYW5jZWxQcm9taXNlKCk7XG5cdFx0XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblx0fTtcbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIGNvbXBsZXRlQ2FsbGJhY2spIHtcblx0ZnVuY3Rpb24gY2FuY2VsUHJvbWlzZSgpIHtcblx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoJ2NhbmNlbCB0cmFuc2l0aW9uJykuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7fSk7XG5cdH07XG5cblx0UHJvbWlzZS5hbGwoW1xuXHRcdFByb21pc2UucmVzb2x2ZSgpLnRoZW4ob2xkU2NyZWVuICYmIG9sZFNjcmVlbi5hbmltYXRlT3V0LmJpbmQob2xkU2NyZWVuKSwgY2FuY2VsUHJvbWlzZSksXG5cdFx0UHJvbWlzZS5yZXNvbHZlKCkudGhlbihuZXdTY3JlZW4gJiYgbmV3U2NyZWVuLmFuaW1hdGVJbi5iaW5kKG5ld1NjcmVlbiksIGNhbmNlbFByb21pc2UpLFxuXHRdKS50aGVuKGNvbXBsZXRlQ2FsbGJhY2spO1xuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRjYW5jZWxQcm9taXNlKCk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9XG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjaykge1xuXHRmdW5jdGlvbiBjYW5jZWxQcm9taXNlKCkge1xuXHRcdHJldHVybiBQcm9taXNlLnJlamVjdCgnY2FuY2VsIHRyYW5zaXRpb24nKS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHt9KTtcblx0fTtcblxuXHRQcm9taXNlLnJlc29sdmUoKVxuXHRcdC50aGVuKG9sZFNjcmVlbiAmJiBvbGRTY3JlZW4uYW5pbWF0ZU91dC5iaW5kKG9sZFNjcmVlbiksIGNhbmNlbFByb21pc2UpXG5cdFx0LnRoZW4obmV3U2NyZWVuICYmIG5ld1NjcmVlbi5hbmltYXRlSW4uYmluZChuZXdTY3JlZW4pLCBjYW5jZWxQcm9taXNlKVxuXHRcdC50aGVuKGNvbXBsZXRlQ2FsbGJhY2ssIGNhbmNlbFByb21pc2UpO1xuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRjYW5jZWxQcm9taXNlKCk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9O1xufTsiLCJpbXBvcnQgU2NyZWVuTmF2aWdhdG9yLCB7VHJhbnNpdGlvbnMsIEFTY3JlZW59IGZyb20gJy4vc3JjL1NjcmVlbk5hdmlnYXRvcic7XG5cblNjcmVlbk5hdmlnYXRvci5UcmFuc2l0aW9ucyA9IFRyYW5zaXRpb25zO1xuU2NyZWVuTmF2aWdhdG9yLkFTY3JlZW4gPSBBU2NyZWVuO1xuXG53aW5kb3cuU2NyZWVuTmF2aWdhdG9yID0gU2NyZWVuTmF2aWdhdG9yOyJdfQ==
