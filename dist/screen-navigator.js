(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
'use strict';

var TinyEmitter = require('tiny-emitter');
var inherits = require('inherits');

var AScreen = function AScreen() {};

inherits(AScreen, TinyEmitter);

AScreen.prototype.animateIn = function (cancel) {};

AScreen.prototype.onAnimateInComplete = function () {
  this.emit('animateInComplete');
};

AScreen.prototype.animateOut = function (cancel) {};

AScreen.prototype.onAnimateOutComplete = function () {
  this.emit('animateOutComplete');
};

AScreen.prototype.dispose = function () {
  this.off('animateInComplete').off('animateOutComplete');
};

module.exports = AScreen;

},{"inherits":1,"tiny-emitter":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

    ScreenNavigator.defaultTransition = _Transitions2.default.none;
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

exports.default = ScreenNavigator;

},{"./AScreen":3,"./ScreenNavigatorItem":5,"./Transitions":6,"tiny-emitter":2}],5:[function(require,module,exports){
'use strict';

var ScreenNavigatorItem = function ScreenNavigatorItem(screen, options) {
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
};

ScreenNavigatorItem.prototype.setOptions = function (options) {
  for (var optionKey in options) {
    if (typeof this[optionKey] !== 'undefined') this[optionKey] = options[optionKey];
  }
};

ScreenNavigatorItem.prototype.getScreen = function () {
  var instance;

  if (this.isInstance) {
    instance = this.screen;
  } else if (this.internalInstance) {
    instance = this.internalInstance;
  } else {
    var WrappedScreenClass = function WrappedScreenClass() {
      ScreenClass.apply(this, args);
    };

    var args = this.arguments;
    var ScreenClass = this.screen;

    WrappedScreenClass.prototype = ScreenClass.prototype;

    instance = new WrappedScreenClass();

    if (!this.canDispose) this.internalInstance = instance;
  }

  if (this.properties) {
    for (var key in this.properties) {
      instance[key] = this.properties[key];
    }
  }

  if (this.events) this.addEventsListeners(instance);

  return instance;
};

ScreenNavigatorItem.prototype.addEventsListeners = function (instance) {
  if (!this.canDispose) {
    if (this.hasEventsListeners) return;

    this.hasEventsListeners = true;
  }

  for (var eventName in this.events) {
    if (typeof this.events[eventName] === 'function') {
      instance.on(eventName, this.events[eventName]);
    }
  }
};

ScreenNavigatorItem.prototype.removeEventsListeners = function (instance) {
  this.hasEventsListeners = false;

  for (var eventName in this.events) {
    if (typeof this.events[eventName] === 'function') {
      instance.off(eventName, this.events[eventName]);
    }
  }
};

ScreenNavigatorItem.prototype.disposeScreen = function (instance, forceDispose) {
  if (this.events) this.removeEventsListeners(instance);

  if (!forceDispose && !this.canDispose) return;

  if (typeof instance.dispose === 'function') instance.dispose();

  this.internalInstance = null;
};

ScreenNavigatorItem.prototype.dispose = function (forceDispose) {
  if (typeof forceDispose !== 'boolean') forceDispose = true;

  var instance = this.isInstance ? this.screen : this.internalInstance;

  if (instance) {
    this.disposeScreen(instance, forceDispose);
  }

  this.screen = this.internalInstance = this.arguments = this.properties = this.events = null;
};

module.exports = ScreenNavigatorItem;

},{}],6:[function(require,module,exports){
'use strict';

module.exports = {
	none: require('./transitions/none.js'),
	outAndIn: require('./transitions/outAndIn.js'),
	outThenIn: require('./transitions/outThenIn.js'),
	inThenOut: require('./transitions/inThenOut.js'),
	in: require('./transitions/in.js'),
	out: require('./transitions/out.js')
};

},{"./transitions/in.js":7,"./transitions/inThenOut.js":8,"./transitions/none.js":9,"./transitions/out.js":10,"./transitions/outAndIn.js":11,"./transitions/outThenIn.js":12}],7:[function(require,module,exports){
'use strict';

module.exports = function (newScreen, oldScreen, completeCallback) {
	if (newScreen) {
		newScreen.on('animateInComplete', onAnimInComplete);
		newScreen.animateIn();
	} else {
		onComplete();
	}

	function dispose() {
		if (newScreen) newScreen.off('animateInComplete', onAnimInComplete);
	}

	function onAnimInComplete() {
		onComplete();
	}

	function onComplete() {
		if (oldScreen) oldScreen.animateOut();

		dispose();

		completeCallback();
	}

	return function cancel() {
		dispose();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};

},{}],8:[function(require,module,exports){
'use strict';

module.exports = function (newScreen, oldScreen, completeCallback) {
	if (newScreen) {
		newScreen.on('animateInComplete', onAnimInComplete);
		newScreen.animateIn();
	} else {
		animOut();
	}

	function animOut() {
		if (oldScreen) {
			oldScreen.on('animateOutComplete', onAnimOutComplete);
			oldScreen.animateOut();
		} else {
			onComplete();
		}
	}

	function dispose() {
		if (oldScreen) oldScreen.off('animateOutComplete', onAnimOutComplete);
		if (newScreen) newScreen.off('animateInComplete', onAnimInComplete);
	}

	function onAnimInComplete() {
		if (oldScreen) {
			animOut();
		} else {
			onComplete();
		}
	}

	function onAnimOutComplete() {
		onComplete();
	}

	function onComplete() {
		dispose();

		completeCallback();
	}

	return function cancel() {
		dispose();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};

},{}],9:[function(require,module,exports){
"use strict";

module.exports = function (newScreen, oldScreen, completeCallback) {
	if (oldScreen) oldScreen.animateOut();
	if (newScreen) newScreen.animateIn();

	completeCallback();

	return function cancel() {};
};

},{}],10:[function(require,module,exports){
'use strict';

module.exports = function (newScreen, oldScreen, completeCallback) {
	if (oldScreen) {
		oldScreen.on('animateOutComplete', onAnimOutComplete);
		oldScreen.animateOut();
	} else {
		onComplete();
	}

	function dispose() {
		if (oldScreen) oldScreen.off('animateOutComplete', onAnimOutComplete);
	}

	function onAnimOutComplete() {
		onComplete();
	}

	function onComplete() {
		if (newScreen) newScreen.animateIn();

		dispose();

		completeCallback();
	}

	return function cancel() {
		dispose();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};

},{}],11:[function(require,module,exports){
'use strict';

module.exports = function (newScreen, oldScreen, onComplete) {
	var count = 0;
	var maxCount = 0;

	if (oldScreen) maxCount++;
	if (newScreen) maxCount++;

	if (oldScreen) {
		oldScreen.on('animateOutComplete', onAnimComplete);
		oldScreen.animateOut();
	}

	if (newScreen) {
		newScreen.on('animateInComplete', onAnimComplete);
		newScreen.animateIn();
	}

	function onAnimComplete() {
		count++;

		if (count === maxCount) onComplete();
	}

	function dispose() {
		if (oldScreen) oldScreen.off('animateOutComplete', onAnimComplete);
		if (newScreen) newScreen.off('animateOutComplete', onAnimComplete);
	}

	return function cancel() {
		dispose();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};

},{}],12:[function(require,module,exports){
'use strict';

module.exports = function (newScreen, oldScreen, completeCallback) {
	if (oldScreen) {
		oldScreen.on('animateOutComplete', onAnimOutComplete);

		oldScreen.animateOut();
	} else {
		animIn();
	}

	function onAnimOutComplete() {
		if (newScreen) {
			animIn();
		} else {
			onComplete();
		}
	}

	function onAnimInComplete() {
		onComplete();
	}

	function animIn() {
		newScreen.on('animateInComplete', onAnimInComplete);

		newScreen.animateIn();
	}

	function dispose() {
		if (oldScreen) oldScreen.off('animateOutComplete', onAnimOutComplete);
		if (newScreen) newScreen.off('animateInComplete', onAnimInComplete);
	}

	function onComplete() {
		dispose();

		completeCallback();
	}

	return function cancel() {
		dispose();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy90aW55LWVtaXR0ZXIvaW5kZXguanMiLCJzcmMvQVNjcmVlbi5qcyIsInNyYy9TY3JlZW5OYXZpZ2F0b3IuanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9ySXRlbS5qcyIsInNyYy9UcmFuc2l0aW9ucy5qcyIsInNyYy90cmFuc2l0aW9ucy9pbi5qcyIsInNyYy90cmFuc2l0aW9ucy9pblRoZW5PdXQuanMiLCJzcmMvdHJhbnNpdGlvbnMvbm9uZS5qcyIsInNyYy90cmFuc2l0aW9ucy9vdXQuanMiLCJzcmMvdHJhbnNpdGlvbnMvb3V0QW5kSW4uanMiLCJzcmMvdHJhbnNpdGlvbnMvb3V0VGhlbkluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2xFQSxJ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SixFQUFlLFVBQVUsU0FBVixDQUFvQixJQUFwQjtBQUNmLEVBTEQ7QUFNQSxDQWxDRDs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsVUFBUyxTQUFULEVBQW9CLFNBQXBCLEVBQStCLGdCQUEvQixFQUFnRDtBQUNoRSxLQUFJLFNBQUosRUFBZTtBQUNkLFlBQVUsRUFBVixDQUFhLG9CQUFiLEVBQW1DLGlCQUFuQzs7QUFFQSxZQUFVLFVBQVY7QUFDQSxFQUpELE1BSUs7QUFDSjtBQUNBOztBQUVELFVBQVMsaUJBQVQsR0FBNEI7QUFDM0IsTUFBSSxTQUFKLEVBQWU7QUFDZDtBQUNBLEdBRkQsTUFFSztBQUNKO0FBQ0E7QUFDRDs7QUFFRCxVQUFTLGdCQUFULEdBQTJCO0FBQzFCO0FBQ0E7O0FBRUQsVUFBUyxNQUFULEdBQWlCO0FBQ2hCLFlBQVUsRUFBVixDQUFhLG1CQUFiLEVBQWtDLGdCQUFsQzs7QUFFQSxZQUFVLFNBQVY7QUFDQTs7QUFFRCxVQUFTLE9BQVQsR0FBa0I7QUFDakIsTUFBSSxTQUFKLEVBQWUsVUFBVSxHQUFWLENBQWMsb0JBQWQsRUFBb0MsaUJBQXBDO0FBQ2YsTUFBSSxTQUFKLEVBQWUsVUFBVSxHQUFWLENBQWMsbUJBQWQsRUFBbUMsZ0JBQW5DO0FBQ2Y7O0FBRUQsVUFBUyxVQUFULEdBQXFCO0FBQ3BCOztBQUVBO0FBQ0E7O0FBRUQsUUFBTyxTQUFTLE1BQVQsR0FBaUI7QUFDdkI7O0FBRUEsTUFBSSxTQUFKLEVBQWUsVUFBVSxVQUFWLENBQXFCLElBQXJCO0FBQ2YsTUFBSSxTQUFKLEVBQWUsVUFBVSxTQUFWLENBQW9CLElBQXBCO0FBQ2YsRUFMRDtBQU1BLENBNUNEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCJmdW5jdGlvbiBFICgpIHtcbiAgLy8gS2VlcCB0aGlzIGVtcHR5IHNvIGl0J3MgZWFzaWVyIHRvIGluaGVyaXQgZnJvbVxuICAvLyAodmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9saXBzbWFjayBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvaXNzdWVzLzMpXG59XG5cbkUucHJvdG90eXBlID0ge1xuICBvbjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuXG4gICAgKGVbbmFtZV0gfHwgKGVbbmFtZV0gPSBbXSkpLnB1c2goe1xuICAgICAgZm46IGNhbGxiYWNrLFxuICAgICAgY3R4OiBjdHhcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9uY2U6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGZ1bmN0aW9uIGxpc3RlbmVyICgpIHtcbiAgICAgIHNlbGYub2ZmKG5hbWUsIGxpc3RlbmVyKTtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGN0eCwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgbGlzdGVuZXIuXyA9IGNhbGxiYWNrXG4gICAgcmV0dXJuIHRoaXMub24obmFtZSwgbGlzdGVuZXIsIGN0eCk7XG4gIH0sXG5cbiAgZW1pdDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgZGF0YSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgZXZ0QXJyID0gKCh0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KSlbbmFtZV0gfHwgW10pLnNsaWNlKCk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBsZW4gPSBldnRBcnIubGVuZ3RoO1xuXG4gICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGV2dEFycltpXS5mbi5hcHBseShldnRBcnJbaV0uY3R4LCBkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvZmY6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG4gICAgdmFyIGV2dHMgPSBlW25hbWVdO1xuICAgIHZhciBsaXZlRXZlbnRzID0gW107XG5cbiAgICBpZiAoZXZ0cyAmJiBjYWxsYmFjaykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV2dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGV2dHNbaV0uZm4gIT09IGNhbGxiYWNrICYmIGV2dHNbaV0uZm4uXyAhPT0gY2FsbGJhY2spXG4gICAgICAgICAgbGl2ZUV2ZW50cy5wdXNoKGV2dHNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBldmVudCBmcm9tIHF1ZXVlIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtcbiAgICAvLyBTdWdnZXN0ZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2xhemRcbiAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvY29tbWl0L2M2ZWJmYWE5YmM5NzNiMzNkMTEwYTg0YTMwNzc0MmI3Y2Y5NGM5NTMjY29tbWl0Y29tbWVudC01MDI0OTEwXG5cbiAgICAobGl2ZUV2ZW50cy5sZW5ndGgpXG4gICAgICA/IGVbbmFtZV0gPSBsaXZlRXZlbnRzXG4gICAgICA6IGRlbGV0ZSBlW25hbWVdO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRTtcbiIsInZhciBUaW55RW1pdHRlciA9IHJlcXVpcmUoJ3RpbnktZW1pdHRlcicpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIEFTY3JlZW4gPSBmdW5jdGlvbigpe1xufTtcblxuaW5oZXJpdHMoQVNjcmVlbiwgVGlueUVtaXR0ZXIpO1xuXG5BU2NyZWVuLnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbihjYW5jZWwpIHtcbn07XG5cbkFTY3JlZW4ucHJvdG90eXBlLm9uQW5pbWF0ZUluQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbWl0KCdhbmltYXRlSW5Db21wbGV0ZScpO1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUuYW5pbWF0ZU91dCA9IGZ1bmN0aW9uKGNhbmNlbCkge1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbWl0KCdhbmltYXRlT3V0Q29tcGxldGUnKTtcbn07XG5cbkFTY3JlZW4ucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5vZmYoJ2FuaW1hdGVJbkNvbXBsZXRlJylcbiAgICAgIC5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBU2NyZWVuOyIsImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAndGlueS1lbWl0dGVyJztcbmltcG9ydCBTY3JlZW5OYXZpZ2F0b3JJdGVtIGZyb20gJy4vU2NyZWVuTmF2aWdhdG9ySXRlbSc7XG5pbXBvcnQgVHJhbnNpdGlvbnMgZnJvbSAnLi9UcmFuc2l0aW9ucyc7XG5pbXBvcnQgQVNjcmVlbiBmcm9tICcuL0FTY3JlZW4nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JlZW5OYXZpZ2F0b3IgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKTtcbiAgICBcbiAgICB0aGlzLml0ZW1zID0ge307XG5cbiAgICB0aGlzLmN1cnJlbnRJdGVtSWQgPSBudWxsO1xuICAgIHRoaXMucHJldmlvdXNJdGVtSWQgPSBudWxsO1xuXG4gICAgdGhpcy5jdXJyZW50U2NyZWVuID0gbnVsbDtcbiAgICB0aGlzLnByZXZpb3VzU2NyZWVuID0gbnVsbDtcblxuICAgIHRoaXMudHJhbnNpdGlvbiA9IFNjcmVlbk5hdmlnYXRvci5kZWZhdWx0VHJhbnNpdGlvbjtcbiAgICB0aGlzLnRyYW5zaXRpb25SdW5uaW5nID0gZmFsc2U7XG4gICAgdGhpcy50cmFuc2l0aW9uQ2FuY2VsID0gbnVsbDtcblxuICAgIFNjcmVlbk5hdmlnYXRvci5kZWZhdWx0VHJhbnNpdGlvbiA9IFRyYW5zaXRpb25zLm5vbmU7XG4gIH1cbiAgXG4gIGFkZEl0ZW0gKGlkLCBzY3JlZW4sIG9wdGlvbnMpIHtcbiAgICBjb25zdCBpdGVtID0gbmV3IFNjcmVlbk5hdmlnYXRvckl0ZW0oc2NyZWVuLCBvcHRpb25zKTtcbiAgXG4gICAgdGhpcy5pdGVtc1tpZF0gPSBpdGVtO1xuICBcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIGdldEl0ZW0gKGlkKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXNbaWRdO1xuICB9XG5cbiAgc2hvd1NjcmVlbiAoaWQsIHRyYW5zaXRpb24sIG9wdGlvbnMpIHtcbiAgICBpZiAoIXRoaXMuZ2V0SXRlbShpZCkpe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdTY3JlZW5OYXZpZ2F0b3IgLSB0aGUgaXRlbSB3aXRoIHRoZSBpZCAnICsgaWQgKyAnIGRvZXNuXFwndCBleGlzdCcpO1xuICAgIH1cbiAgXG4gICAgaWYgKHRoaXMudHJhbnNpdGlvblJ1bm5pbmcpe1xuICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSh0cnVlKTtcbiAgICB9IFxuICBcbiAgICBpZiAodGhpcy5jdXJyZW50U2NyZWVuKXtcbiAgICAgIHRoaXMucHJldmlvdXNJdGVtSWQgPSB0aGlzLmN1cnJlbnRJdGVtSWQ7XG4gICAgICB0aGlzLnByZXZpb3VzU2NyZWVuID0gdGhpcy5jdXJyZW50U2NyZWVuO1xuICAgIH1cbiAgXG4gICAgdGhpcy5jdXJyZW50SXRlbUlkID0gaWQ7XG4gIFxuICAgIHRoaXMub25TY3JlZW5DaGFuZ2UoKTtcbiAgXG4gICAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvbiwgb3B0aW9ucyk7XG4gIH1cblxuICBjbGVhclNjcmVlbiAodHJhbnNpdGlvbikge1xuICAgIGlmICghdGhpcy5jdXJyZW50U2NyZWVuKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIFxuICAgIHRoaXMucHJldmlvdXNJdGVtSWQgPSB0aGlzLmN1cnJlbnRJdGVtSWQ7XG4gICAgdGhpcy5wcmV2aW91c1NjcmVlbiA9IHRoaXMuY3VycmVudFNjcmVlbjtcbiAgXG4gICAgdGhpcy5jdXJyZW50SXRlbUlkID0gbnVsbDtcbiAgXG4gICAgdGhpcy5vblNjcmVlbkNoYW5nZSgpO1xuICBcbiAgICB0aGlzLnN0YXJ0VHJhbnNpdGlvbih0cmFuc2l0aW9uKTtcbiAgfVxuXG4gIHN0YXJ0VHJhbnNpdGlvbiAodHJhbnNpdGlvbiwgb3B0aW9ucykge1xuICAgIHRyYW5zaXRpb24gPSB0cmFuc2l0aW9uIHx8IHRoaXMudHJhbnNpdGlvbjtcbiAgXG4gICAgY29uc3QgY3VycmVudEl0ZW0gPSB0aGlzLmdldEl0ZW0odGhpcy5jdXJyZW50SXRlbUlkKTtcbiAgXG4gICAgaWYgKG9wdGlvbnMpIGN1cnJlbnRJdGVtLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gIFxuICAgIHRoaXMuY3VycmVudFNjcmVlbiA9IGN1cnJlbnRJdGVtID8gY3VycmVudEl0ZW0uZ2V0U2NyZWVuKG9wdGlvbnMpIDogbnVsbDtcbiAgXG4gICAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IHRydWU7XG4gIFxuICAgIHRoaXMuZW1pdCgndHJhbnNpdGlvblN0YXJ0Jyk7XG4gIFxuICAgIHRoaXMudHJhbnNpdGlvbkNhbmNlbCA9IHRyYW5zaXRpb24odGhpcy5jdXJyZW50U2NyZWVuLCB0aGlzLnByZXZpb3VzU2NyZWVuLCB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgb25TY3JlZW5DaGFuZ2UgKCkge1xuICAgIHRoaXMuZW1pdCgnc2NyZWVuQ2hhbmdlJyk7XG4gIH1cblxuICBvblRyYW5zaXRpb25Db21wbGV0ZSAoY2FuY2VsVHJhbnNpdGlvbiwgc2lsZW50KSB7XG4gICAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuICBcbiAgICBpZiAoY2FuY2VsVHJhbnNpdGlvbil7XG4gICAgICBpZiAodGhpcy50cmFuc2l0aW9uQ2FuY2VsKSB0aGlzLnRyYW5zaXRpb25DYW5jZWwoKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5kaXNwb3NlUHJldmlvdXNTY3JlZW4oKTtcbiAgXG4gICAgaWYgKCFzaWxlbnQpe1xuICAgICAgaWYgKGNhbmNlbFRyYW5zaXRpb24pe1xuICAgICAgICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25DYW5jZWwnKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25Db21wbGV0ZScpO1xuICAgICAgfVxuICAgIH1cbiAgXG4gICAgdGhpcy50cmFuc2l0aW9uQ2FuY2VsID0gbnVsbDtcbiAgfVxuXG4gIGRpc3Bvc2UgKGZvcmNlRGlzcG9zZSkge1xuICAgIGlmICh0eXBlb2YgZm9yY2VEaXNwb3NlICE9PSAnYm9vbGVhbicpIGZvcmNlRGlzcG9zZSA9IHRydWU7XG4gIFxuICAgIGlmICh0aGlzLnRyYW5zaXRpb25SdW5uaW5nKXtcbiAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUodHJ1ZSwgdHJ1ZSk7XG4gICAgfVxuICBcbiAgICB0aGlzLmRpc3Bvc2VDdXJyZW50U2NyZWVuKCk7XG4gICAgdGhpcy5kaXNwb3NlUHJldmlvdXNTY3JlZW4oKTtcbiAgXG4gICAgZm9yIChsZXQgaXRlbUlkIGluIHRoaXMuaXRlbXMpe1xuICAgICAgdGhpcy5pdGVtc1tpdGVtSWRdLmRpc3Bvc2UoZm9yY2VEaXNwb3NlKTtcbiAgXG4gICAgICBkZWxldGUgdGhpcy5pdGVtc1tpdGVtSWRdO1xuICAgIH1cbiAgXG4gICAgdGhpcy50cmFuc2l0aW9uID0gbnVsbDtcbiAgfVxuXG4gIGRpc3Bvc2VQcmV2aW91c1NjcmVlbiAoKSB7XG4gICAgaWYgKCF0aGlzLnByZXZpb3VzU2NyZWVuKSByZXR1cm47XG4gIFxuICAgIHRoaXMuZ2V0SXRlbSh0aGlzLnByZXZpb3VzSXRlbUlkKS5kaXNwb3NlU2NyZWVuKHRoaXMucHJldmlvdXNTY3JlZW4pO1xuICBcbiAgICB0aGlzLnByZXZpb3VzU2NyZWVuID0gbnVsbDtcbiAgfVxuXG4gIGRpc3Bvc2VDdXJyZW50U2NyZWVuICgpIHtcbiAgICBpZiAoIXRoaXMuY3VycmVudFNjcmVlbikgcmV0dXJuO1xuICBcbiAgICB0aGlzLmdldEl0ZW0odGhpcy5jdXJyZW50SXRlbUlkKS5kaXNwb3NlU2NyZWVuKHRoaXMuY3VycmVudFNjcmVlbik7XG4gIFxuICAgIHRoaXMuY3VycmVudFNjcmVlbiA9IG51bGw7XG4gIH1cbn1cblxuIiwidmFyIFNjcmVlbk5hdmlnYXRvckl0ZW0gPSBmdW5jdGlvbihzY3JlZW4sIG9wdGlvbnMpe1xuICB0aGlzLnNjcmVlbiA9IHNjcmVlbjtcblxuICB0aGlzLmlzSW5zdGFuY2UgPSB0eXBlb2Ygc2NyZWVuICE9PSAnZnVuY3Rpb24nO1xuICB0aGlzLmludGVybmFsSW5zdGFuY2UgPSBudWxsO1xuXG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB0aGlzLmFyZ3VtZW50cyA9IG51bGw7XG4gIHRoaXMucHJvcGVydGllcyA9IG51bGw7XG4gIHRoaXMuY2FuRGlzcG9zZSA9ICF0aGlzLmlzSW5zdGFuY2U7XG4gIHRoaXMuZXZlbnRzID0gbnVsbDtcblxuICB0aGlzLmhhc0V2ZW50c0xpc3RlbmVycyA9IGZhbHNlO1xuXG4gIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIGZvciAodmFyIG9wdGlvbktleSBpbiBvcHRpb25zKXtcbiAgICBpZiAodHlwZW9mIHRoaXNbb3B0aW9uS2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHRoaXNbb3B0aW9uS2V5XSA9IG9wdGlvbnNbb3B0aW9uS2V5XTtcbiAgfVxufTtcblxuU2NyZWVuTmF2aWdhdG9ySXRlbS5wcm90b3R5cGUuZ2V0U2NyZWVuID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpbnN0YW5jZTtcblxuICBpZiAodGhpcy5pc0luc3RhbmNlKXtcbiAgICBpbnN0YW5jZSA9IHRoaXMuc2NyZWVuO1xuICB9IGVsc2UgaWYgKHRoaXMuaW50ZXJuYWxJbnN0YW5jZSl7XG4gICAgaW5zdGFuY2UgPSB0aGlzLmludGVybmFsSW5zdGFuY2U7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGFyZ3MgPSB0aGlzLmFyZ3VtZW50cztcbiAgICB2YXIgU2NyZWVuQ2xhc3MgPSB0aGlzLnNjcmVlbjtcblxuICAgIGZ1bmN0aW9uIFdyYXBwZWRTY3JlZW5DbGFzcygpe1xuICAgICAgU2NyZWVuQ2xhc3MuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuXG4gICAgV3JhcHBlZFNjcmVlbkNsYXNzLnByb3RvdHlwZSA9IFNjcmVlbkNsYXNzLnByb3RvdHlwZTtcblxuICAgIGluc3RhbmNlID0gbmV3IFdyYXBwZWRTY3JlZW5DbGFzcygpO1xuXG4gICAgaWYgKCF0aGlzLmNhbkRpc3Bvc2UpIHRoaXMuaW50ZXJuYWxJbnN0YW5jZSA9IGluc3RhbmNlO1xuICB9XG5cbiAgaWYgKHRoaXMucHJvcGVydGllcyl7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMucHJvcGVydGllcyl7XG4gICAgICBpbnN0YW5jZVtrZXldID0gdGhpcy5wcm9wZXJ0aWVzW2tleV07XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMuZXZlbnRzKSB0aGlzLmFkZEV2ZW50c0xpc3RlbmVycyhpbnN0YW5jZSk7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufTtcblxuU2NyZWVuTmF2aWdhdG9ySXRlbS5wcm90b3R5cGUuYWRkRXZlbnRzTGlzdGVuZXJzID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaWYgKCF0aGlzLmNhbkRpc3Bvc2Upe1xuICAgIGlmICh0aGlzLmhhc0V2ZW50c0xpc3RlbmVycykgcmV0dXJuO1xuXG4gICAgdGhpcy5oYXNFdmVudHNMaXN0ZW5lcnMgPSB0cnVlO1xuICB9XG5cbiAgZm9yICh2YXIgZXZlbnROYW1lIGluIHRoaXMuZXZlbnRzKXtcbiAgICBpZiAodHlwZW9mIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPT09ICdmdW5jdGlvbicpe1xuICAgICAgaW5zdGFuY2Uub24oZXZlbnROYW1lLCB0aGlzLmV2ZW50c1tldmVudE5hbWVdKTtcbiAgICB9XG4gIH1cbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLnJlbW92ZUV2ZW50c0xpc3RlbmVycyA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHRoaXMuaGFzRXZlbnRzTGlzdGVuZXJzID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgZXZlbnROYW1lIGluIHRoaXMuZXZlbnRzKXtcbiAgICBpZiAodHlwZW9mIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPT09ICdmdW5jdGlvbicpe1xuICAgICAgaW5zdGFuY2Uub2ZmKGV2ZW50TmFtZSwgdGhpcy5ldmVudHNbZXZlbnROYW1lXSk7XG4gICAgfVxuICB9XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5kaXNwb3NlU2NyZWVuID0gZnVuY3Rpb24oaW5zdGFuY2UsIGZvcmNlRGlzcG9zZSkge1xuICBpZiAodGhpcy5ldmVudHMpIHRoaXMucmVtb3ZlRXZlbnRzTGlzdGVuZXJzKGluc3RhbmNlKTtcblxuICBpZiAoIWZvcmNlRGlzcG9zZSAmJiAhdGhpcy5jYW5EaXNwb3NlKSByZXR1cm47XG5cbiAgaWYgKHR5cGVvZiBpbnN0YW5jZS5kaXNwb3NlID09PSAnZnVuY3Rpb24nKSBpbnN0YW5jZS5kaXNwb3NlKCk7XG5cbiAgdGhpcy5pbnRlcm5hbEluc3RhbmNlID0gbnVsbDtcbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbihmb3JjZURpc3Bvc2UpIHtcbiAgaWYgKHR5cGVvZiBmb3JjZURpc3Bvc2UgIT09ICdib29sZWFuJykgZm9yY2VEaXNwb3NlID0gdHJ1ZTtcblxuICB2YXIgaW5zdGFuY2UgPSB0aGlzLmlzSW5zdGFuY2UgPyB0aGlzLnNjcmVlbiA6IHRoaXMuaW50ZXJuYWxJbnN0YW5jZTtcblxuICBpZiAoaW5zdGFuY2Upe1xuICAgIHRoaXMuZGlzcG9zZVNjcmVlbihpbnN0YW5jZSwgZm9yY2VEaXNwb3NlKTtcbiAgfVxuICBcbiAgdGhpcy5zY3JlZW4gPSBcbiAgdGhpcy5pbnRlcm5hbEluc3RhbmNlID0gXG4gIHRoaXMuYXJndW1lbnRzID0gXG4gIHRoaXMucHJvcGVydGllcyA9IFxuICB0aGlzLmV2ZW50cyA9IFxuICBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY3JlZW5OYXZpZ2F0b3JJdGVtO1xuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0bm9uZTogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9ub25lLmpzJyksXG5cdG91dEFuZEluOiByZXF1aXJlKCcuL3RyYW5zaXRpb25zL291dEFuZEluLmpzJyksXG5cdG91dFRoZW5JbjogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9vdXRUaGVuSW4uanMnKSxcblx0aW5UaGVuT3V0OiByZXF1aXJlKCcuL3RyYW5zaXRpb25zL2luVGhlbk91dC5qcycpLFxuXHRpbjogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9pbi5qcycpLFxuXHRvdXQ6IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMvb3V0LmpzJylcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjayl7XG5cdGlmIChuZXdTY3JlZW4pIHtcblx0XHRuZXdTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgb25BbmltSW5Db21wbGV0ZSk7XG5cdFx0bmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXHR9ZWxzZXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLm9mZignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1JbkNvbXBsZXRlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQW5pbUluQ29tcGxldGUoKXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkNvbXBsZXRlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblxuXHRcdGRpc3Bvc2UoKTtcblxuXHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKXtcblx0aWYgKG5ld1NjcmVlbikge1xuXHRcdG5ld1NjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1JbkNvbXBsZXRlKTtcblx0XHRuZXdTY3JlZW4uYW5pbWF0ZUluKCk7XG5cdH1lbHNle1xuXHRcdGFuaW1PdXQoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFuaW1PdXQoKXtcblx0XHRpZiAob2xkU2NyZWVuKXtcblx0XHRcdG9sZFNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltT3V0Q29tcGxldGUpO1xuXHRcdFx0b2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblx0XHR9ZWxzZXtcblx0XHRcdG9uQ29tcGxldGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltT3V0Q29tcGxldGUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5vZmYoJ2FuaW1hdGVJbkNvbXBsZXRlJywgb25BbmltSW5Db21wbGV0ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkFuaW1JbkNvbXBsZXRlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikge1xuXHRcdFx0YW5pbU91dCgpO1xuXHRcdH1lbHNle1xuXHRcdFx0b25Db21wbGV0ZSgpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIG9uQW5pbU91dENvbXBsZXRlKCl7XG5cdFx0b25Db21wbGV0ZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25Db21wbGV0ZSgpe1xuXHRcdGRpc3Bvc2UoKTtcblxuXHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKXtcblx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXG5cdGNvbXBsZXRlQ2FsbGJhY2soKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjayl7XG5cdGlmIChvbGRTY3JlZW4pIHtcblx0XHRvbGRTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbU91dENvbXBsZXRlKTtcblx0XHRvbGRTY3JlZW4uYW5pbWF0ZU91dCgpO1xuXHR9ZWxzZXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltT3V0Q29tcGxldGUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25BbmltT3V0Q29tcGxldGUoKXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkNvbXBsZXRlKCl7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXG5cdFx0ZGlzcG9zZSgpO1xuXG5cdFx0Y29tcGxldGVDYWxsYmFjaygpO1xuXHR9XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCgpe1xuXHRcdGRpc3Bvc2UoKTtcblxuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KHRydWUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4odHJ1ZSk7XG5cdH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIG9uQ29tcGxldGUpe1xuXHR2YXIgY291bnQgPSAwO1xuXHR2YXIgbWF4Q291bnQgPSAwO1xuXG5cdGlmIChvbGRTY3JlZW4pIG1heENvdW50Kys7XG5cdGlmIChuZXdTY3JlZW4pIG1heENvdW50Kys7XG5cblx0aWYgKG9sZFNjcmVlbikge1xuXHRcdG9sZFNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltQ29tcGxldGUpO1xuXHRcdG9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cdH1cblxuXHRpZiAobmV3U2NyZWVuKSB7XG5cdFx0bmV3U2NyZWVuLm9uKCdhbmltYXRlSW5Db21wbGV0ZScsIG9uQW5pbUNvbXBsZXRlKTtcblx0XHRuZXdTY3JlZW4uYW5pbWF0ZUluKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkFuaW1Db21wbGV0ZSgpe1xuXHRcdGNvdW50Kys7XG5cblx0XHRpZiAoY291bnQgPT09IG1heENvdW50KSBvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltQ29tcGxldGUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbUNvbXBsZXRlKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIGNvbXBsZXRlQ2FsbGJhY2spe1xuXHRpZiAob2xkU2NyZWVuKSB7XG5cdFx0b2xkU2NyZWVuLm9uKCdhbmltYXRlT3V0Q29tcGxldGUnLCBvbkFuaW1PdXRDb21wbGV0ZSk7XG5cblx0XHRvbGRTY3JlZW4uYW5pbWF0ZU91dCgpO1xuXHR9ZWxzZXtcblx0XHRhbmltSW4oKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQW5pbU91dENvbXBsZXRlKCl7XG5cdFx0aWYgKG5ld1NjcmVlbikge1xuXHRcdFx0YW5pbUluKCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRvbkNvbXBsZXRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gb25BbmltSW5Db21wbGV0ZSgpe1xuXHRcdG9uQ29tcGxldGUoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFuaW1Jbigpe1xuXHRcdG5ld1NjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1JbkNvbXBsZXRlKTtcblxuXHRcdG5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRpc3Bvc2UoKXtcblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4ub2ZmKCdhbmltYXRlT3V0Q29tcGxldGUnLCBvbkFuaW1PdXRDb21wbGV0ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLm9mZignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1JbkNvbXBsZXRlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQ29tcGxldGUoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRjb21wbGV0ZUNhbGxiYWNrKCk7XG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7XG5cdFx0ZGlzcG9zZSgpO1xuXG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblx0fTtcbn07Il19
