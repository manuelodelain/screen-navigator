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

},{}],13:[function(require,module,exports){
'use strict';

var _ScreenNavigator = require('./src/ScreenNavigator');

var _ScreenNavigator2 = _interopRequireDefault(_ScreenNavigator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_ScreenNavigator2.default.Transitions = _ScreenNavigator.Transitions;
_ScreenNavigator2.default.AScreen = _ScreenNavigator.AScreen;

window.ScreenNavigator = _ScreenNavigator2.default;

},{"./src/ScreenNavigator":4}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy90aW55LWVtaXR0ZXIvaW5kZXguanMiLCJzcmMvQVNjcmVlbi5qcyIsInNyYy9TY3JlZW5OYXZpZ2F0b3IuanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9ySXRlbS5qcyIsInNyYy9UcmFuc2l0aW9ucy5qcyIsInNyYy90cmFuc2l0aW9ucy9pbi5qcyIsInNyYy90cmFuc2l0aW9ucy9pblRoZW5PdXQuanMiLCJzcmMvdHJhbnNpdGlvbnMvbm9uZS5qcyIsInNyYy90cmFuc2l0aW9ucy9vdXQuanMiLCJzcmMvdHJhbnNpdGlvbnMvb3V0QW5kSW4uanMiLCJzcmMvdHJhbnNpdGlvbnMvb3V0VGhlbkluLmpzIiwic3RhbmRhbG9uZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Iiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsImZ1bmN0aW9uIEUgKCkge1xuICAvLyBLZWVwIHRoaXMgZW1wdHkgc28gaXQncyBlYXNpZXIgdG8gaW5oZXJpdCBmcm9tXG4gIC8vICh2aWEgaHR0cHM6Ly9naXRodWIuY29tL2xpcHNtYWNrIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9pc3N1ZXMvMylcbn1cblxuRS5wcm90b3R5cGUgPSB7XG4gIG9uOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG5cbiAgICAoZVtuYW1lXSB8fCAoZVtuYW1lXSA9IFtdKSkucHVzaCh7XG4gICAgICBmbjogY2FsbGJhY2ssXG4gICAgICBjdHg6IGN0eFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb25jZTogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgZnVuY3Rpb24gbGlzdGVuZXIgKCkge1xuICAgICAgc2VsZi5vZmYobmFtZSwgbGlzdGVuZXIpO1xuICAgICAgY2FsbGJhY2suYXBwbHkoY3R4LCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBsaXN0ZW5lci5fID0gY2FsbGJhY2tcbiAgICByZXR1cm4gdGhpcy5vbihuYW1lLCBsaXN0ZW5lciwgY3R4KTtcbiAgfSxcblxuICBlbWl0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBkYXRhID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBldnRBcnIgPSAoKHRoaXMuZSB8fCAodGhpcy5lID0ge30pKVtuYW1lXSB8fCBbXSkuc2xpY2UoKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGxlbiA9IGV2dEFyci5sZW5ndGg7XG5cbiAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgZXZ0QXJyW2ldLmZuLmFwcGx5KGV2dEFycltpXS5jdHgsIGRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9mZjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcbiAgICB2YXIgZXZ0cyA9IGVbbmFtZV07XG4gICAgdmFyIGxpdmVFdmVudHMgPSBbXTtcblxuICAgIGlmIChldnRzICYmIGNhbGxiYWNrKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZXZ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZXZ0c1tpXS5mbiAhPT0gY2FsbGJhY2sgJiYgZXZ0c1tpXS5mbi5fICE9PSBjYWxsYmFjaylcbiAgICAgICAgICBsaXZlRXZlbnRzLnB1c2goZXZ0c1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGV2ZW50IGZyb20gcXVldWUgdG8gcHJldmVudCBtZW1vcnkgbGVha1xuICAgIC8vIFN1Z2dlc3RlZCBieSBodHRwczovL2dpdGh1Yi5jb20vbGF6ZFxuICAgIC8vIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9jb21taXQvYzZlYmZhYTliYzk3M2IzM2QxMTBhODRhMzA3NzQyYjdjZjk0Yzk1MyNjb21taXRjb21tZW50LTUwMjQ5MTBcblxuICAgIChsaXZlRXZlbnRzLmxlbmd0aClcbiAgICAgID8gZVtuYW1lXSA9IGxpdmVFdmVudHNcbiAgICAgIDogZGVsZXRlIGVbbmFtZV07XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFO1xuIiwidmFyIFRpbnlFbWl0dGVyID0gcmVxdWlyZSgndGlueS1lbWl0dGVyJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQVNjcmVlbiA9IGZ1bmN0aW9uKCl7XG59O1xuXG5pbmhlcml0cyhBU2NyZWVuLCBUaW55RW1pdHRlcik7XG5cbkFTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKGNhbmNlbCkge1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ2FuaW1hdGVJbkNvbXBsZXRlJyk7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5hbmltYXRlT3V0ID0gZnVuY3Rpb24oY2FuY2VsKSB7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ2FuaW1hdGVPdXRDb21wbGV0ZScpO1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm9mZignYW5pbWF0ZUluQ29tcGxldGUnKVxuICAgICAgLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFTY3JlZW47IiwiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IFNjcmVlbk5hdmlnYXRvckl0ZW0gZnJvbSAnLi9TY3JlZW5OYXZpZ2F0b3JJdGVtJztcbmltcG9ydCBUcmFuc2l0aW9ucyBmcm9tICcuL1RyYW5zaXRpb25zJztcbmltcG9ydCBBU2NyZWVuIGZyb20gJy4vQVNjcmVlbidcblxuZXhwb3J0IHtUcmFuc2l0aW9ucywgQVNjcmVlbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyZWVuTmF2aWdhdG9yIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKCk7XG4gICAgXG4gICAgdGhpcy5pdGVtcyA9IHt9O1xuXG4gICAgdGhpcy5jdXJyZW50SXRlbUlkID0gbnVsbDtcbiAgICB0aGlzLnByZXZpb3VzSXRlbUlkID0gbnVsbDtcblxuICAgIHRoaXMuY3VycmVudFNjcmVlbiA9IG51bGw7XG4gICAgdGhpcy5wcmV2aW91c1NjcmVlbiA9IG51bGw7XG5cbiAgICB0aGlzLnRyYW5zaXRpb24gPSBTY3JlZW5OYXZpZ2F0b3IuZGVmYXVsdFRyYW5zaXRpb247XG4gICAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuICAgIHRoaXMudHJhbnNpdGlvbkNhbmNlbCA9IG51bGw7XG5cbiAgICBTY3JlZW5OYXZpZ2F0b3IuZGVmYXVsdFRyYW5zaXRpb24gPSBUcmFuc2l0aW9ucy5ub25lO1xuICB9XG4gIFxuICBhZGRJdGVtIChpZCwgc2NyZWVuLCBvcHRpb25zKSB7XG4gICAgY29uc3QgaXRlbSA9IG5ldyBTY3JlZW5OYXZpZ2F0b3JJdGVtKHNjcmVlbiwgb3B0aW9ucyk7XG4gIFxuICAgIHRoaXMuaXRlbXNbaWRdID0gaXRlbTtcbiAgXG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICBnZXRJdGVtIChpZCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zW2lkXTtcbiAgfVxuXG4gIHNob3dTY3JlZW4gKGlkLCB0cmFuc2l0aW9uLCBvcHRpb25zKSB7XG4gICAgaWYgKCF0aGlzLmdldEl0ZW0oaWQpKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2NyZWVuTmF2aWdhdG9yIC0gdGhlIGl0ZW0gd2l0aCB0aGUgaWQgJyArIGlkICsgJyBkb2VzblxcJ3QgZXhpc3QnKTtcbiAgICB9XG4gIFxuICAgIGlmICh0aGlzLnRyYW5zaXRpb25SdW5uaW5nKXtcbiAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUodHJ1ZSk7XG4gICAgfSBcbiAgXG4gICAgaWYgKHRoaXMuY3VycmVudFNjcmVlbil7XG4gICAgICB0aGlzLnByZXZpb3VzSXRlbUlkID0gdGhpcy5jdXJyZW50SXRlbUlkO1xuICAgICAgdGhpcy5wcmV2aW91c1NjcmVlbiA9IHRoaXMuY3VycmVudFNjcmVlbjtcbiAgICB9XG4gIFxuICAgIHRoaXMuY3VycmVudEl0ZW1JZCA9IGlkO1xuICBcbiAgICB0aGlzLm9uU2NyZWVuQ2hhbmdlKCk7XG4gIFxuICAgIHRoaXMuc3RhcnRUcmFuc2l0aW9uKHRyYW5zaXRpb24sIG9wdGlvbnMpO1xuICB9XG5cbiAgY2xlYXJTY3JlZW4gKHRyYW5zaXRpb24pIHtcbiAgICBpZiAoIXRoaXMuY3VycmVudFNjcmVlbil7XG4gICAgICByZXR1cm47XG4gICAgfVxuICBcbiAgICB0aGlzLnByZXZpb3VzSXRlbUlkID0gdGhpcy5jdXJyZW50SXRlbUlkO1xuICAgIHRoaXMucHJldmlvdXNTY3JlZW4gPSB0aGlzLmN1cnJlbnRTY3JlZW47XG4gIFxuICAgIHRoaXMuY3VycmVudEl0ZW1JZCA9IG51bGw7XG4gIFxuICAgIHRoaXMub25TY3JlZW5DaGFuZ2UoKTtcbiAgXG4gICAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvbik7XG4gIH1cblxuICBzdGFydFRyYW5zaXRpb24gKHRyYW5zaXRpb24sIG9wdGlvbnMpIHtcbiAgICB0cmFuc2l0aW9uID0gdHJhbnNpdGlvbiB8fCB0aGlzLnRyYW5zaXRpb247XG4gIFxuICAgIGNvbnN0IGN1cnJlbnRJdGVtID0gdGhpcy5nZXRJdGVtKHRoaXMuY3VycmVudEl0ZW1JZCk7XG4gIFxuICAgIGlmIChvcHRpb25zKSBjdXJyZW50SXRlbS5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICBcbiAgICB0aGlzLmN1cnJlbnRTY3JlZW4gPSBjdXJyZW50SXRlbSA/IGN1cnJlbnRJdGVtLmdldFNjcmVlbihvcHRpb25zKSA6IG51bGw7XG4gIFxuICAgIHRoaXMudHJhbnNpdGlvblJ1bm5pbmcgPSB0cnVlO1xuICBcbiAgICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25TdGFydCcpO1xuICBcbiAgICB0aGlzLnRyYW5zaXRpb25DYW5jZWwgPSB0cmFuc2l0aW9uKHRoaXMuY3VycmVudFNjcmVlbiwgdGhpcy5wcmV2aW91c1NjcmVlbiwgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIG9uU2NyZWVuQ2hhbmdlICgpIHtcbiAgICB0aGlzLmVtaXQoJ3NjcmVlbkNoYW5nZScpO1xuICB9XG5cbiAgb25UcmFuc2l0aW9uQ29tcGxldGUgKGNhbmNlbFRyYW5zaXRpb24sIHNpbGVudCkge1xuICAgIHRoaXMudHJhbnNpdGlvblJ1bm5pbmcgPSBmYWxzZTtcbiAgXG4gICAgaWYgKGNhbmNlbFRyYW5zaXRpb24pe1xuICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbkNhbmNlbCkgdGhpcy50cmFuc2l0aW9uQ2FuY2VsKCk7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuZGlzcG9zZVByZXZpb3VzU2NyZWVuKCk7XG4gIFxuICAgIGlmICghc2lsZW50KXtcbiAgICAgIGlmIChjYW5jZWxUcmFuc2l0aW9uKXtcbiAgICAgICAgdGhpcy5lbWl0KCd0cmFuc2l0aW9uQ2FuY2VsJyk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGhpcy5lbWl0KCd0cmFuc2l0aW9uQ29tcGxldGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIFxuICAgIHRoaXMudHJhbnNpdGlvbkNhbmNlbCA9IG51bGw7XG4gIH1cblxuICBkaXNwb3NlIChmb3JjZURpc3Bvc2UpIHtcbiAgICBpZiAodHlwZW9mIGZvcmNlRGlzcG9zZSAhPT0gJ2Jvb2xlYW4nKSBmb3JjZURpc3Bvc2UgPSB0cnVlO1xuICBcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uUnVubmluZyl7XG4gICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKHRydWUsIHRydWUpO1xuICAgIH1cbiAgXG4gICAgdGhpcy5kaXNwb3NlQ3VycmVudFNjcmVlbigpO1xuICAgIHRoaXMuZGlzcG9zZVByZXZpb3VzU2NyZWVuKCk7XG4gIFxuICAgIGZvciAobGV0IGl0ZW1JZCBpbiB0aGlzLml0ZW1zKXtcbiAgICAgIHRoaXMuaXRlbXNbaXRlbUlkXS5kaXNwb3NlKGZvcmNlRGlzcG9zZSk7XG4gIFxuICAgICAgZGVsZXRlIHRoaXMuaXRlbXNbaXRlbUlkXTtcbiAgICB9XG4gIFxuICAgIHRoaXMudHJhbnNpdGlvbiA9IG51bGw7XG4gIH1cblxuICBkaXNwb3NlUHJldmlvdXNTY3JlZW4gKCkge1xuICAgIGlmICghdGhpcy5wcmV2aW91c1NjcmVlbikgcmV0dXJuO1xuICBcbiAgICB0aGlzLmdldEl0ZW0odGhpcy5wcmV2aW91c0l0ZW1JZCkuZGlzcG9zZVNjcmVlbih0aGlzLnByZXZpb3VzU2NyZWVuKTtcbiAgXG4gICAgdGhpcy5wcmV2aW91c1NjcmVlbiA9IG51bGw7XG4gIH1cblxuICBkaXNwb3NlQ3VycmVudFNjcmVlbiAoKSB7XG4gICAgaWYgKCF0aGlzLmN1cnJlbnRTY3JlZW4pIHJldHVybjtcbiAgXG4gICAgdGhpcy5nZXRJdGVtKHRoaXMuY3VycmVudEl0ZW1JZCkuZGlzcG9zZVNjcmVlbih0aGlzLmN1cnJlbnRTY3JlZW4pO1xuICBcbiAgICB0aGlzLmN1cnJlbnRTY3JlZW4gPSBudWxsO1xuICB9XG59XG5cbiIsInZhciBTY3JlZW5OYXZpZ2F0b3JJdGVtID0gZnVuY3Rpb24oc2NyZWVuLCBvcHRpb25zKXtcbiAgdGhpcy5zY3JlZW4gPSBzY3JlZW47XG5cbiAgdGhpcy5pc0luc3RhbmNlID0gdHlwZW9mIHNjcmVlbiAhPT0gJ2Z1bmN0aW9uJztcbiAgdGhpcy5pbnRlcm5hbEluc3RhbmNlID0gbnVsbDtcblxuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdGhpcy5hcmd1bWVudHMgPSBudWxsO1xuICB0aGlzLnByb3BlcnRpZXMgPSBudWxsO1xuICB0aGlzLmNhbkRpc3Bvc2UgPSAhdGhpcy5pc0luc3RhbmNlO1xuICB0aGlzLmV2ZW50cyA9IG51bGw7XG5cbiAgdGhpcy5oYXNFdmVudHNMaXN0ZW5lcnMgPSBmYWxzZTtcblxuICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICBmb3IgKHZhciBvcHRpb25LZXkgaW4gb3B0aW9ucyl7XG4gICAgaWYgKHR5cGVvZiB0aGlzW29wdGlvbktleV0gIT09ICd1bmRlZmluZWQnKSB0aGlzW29wdGlvbktleV0gPSBvcHRpb25zW29wdGlvbktleV07XG4gIH1cbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLmdldFNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaW5zdGFuY2U7XG5cbiAgaWYgKHRoaXMuaXNJbnN0YW5jZSl7XG4gICAgaW5zdGFuY2UgPSB0aGlzLnNjcmVlbjtcbiAgfSBlbHNlIGlmICh0aGlzLmludGVybmFsSW5zdGFuY2Upe1xuICAgIGluc3RhbmNlID0gdGhpcy5pbnRlcm5hbEluc3RhbmNlO1xuICB9IGVsc2Uge1xuICAgIHZhciBhcmdzID0gdGhpcy5hcmd1bWVudHM7XG4gICAgdmFyIFNjcmVlbkNsYXNzID0gdGhpcy5zY3JlZW47XG5cbiAgICBmdW5jdGlvbiBXcmFwcGVkU2NyZWVuQ2xhc3MoKXtcbiAgICAgIFNjcmVlbkNsYXNzLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cblxuICAgIFdyYXBwZWRTY3JlZW5DbGFzcy5wcm90b3R5cGUgPSBTY3JlZW5DbGFzcy5wcm90b3R5cGU7XG5cbiAgICBpbnN0YW5jZSA9IG5ldyBXcmFwcGVkU2NyZWVuQ2xhc3MoKTtcblxuICAgIGlmICghdGhpcy5jYW5EaXNwb3NlKSB0aGlzLmludGVybmFsSW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgfVxuXG4gIGlmICh0aGlzLnByb3BlcnRpZXMpe1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLnByb3BlcnRpZXMpe1xuICAgICAgaW5zdGFuY2Vba2V5XSA9IHRoaXMucHJvcGVydGllc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLmV2ZW50cykgdGhpcy5hZGRFdmVudHNMaXN0ZW5lcnMoaW5zdGFuY2UpO1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLmFkZEV2ZW50c0xpc3RlbmVycyA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGlmICghdGhpcy5jYW5EaXNwb3NlKXtcbiAgICBpZiAodGhpcy5oYXNFdmVudHNMaXN0ZW5lcnMpIHJldHVybjtcblxuICAgIHRoaXMuaGFzRXZlbnRzTGlzdGVuZXJzID0gdHJ1ZTtcbiAgfVxuXG4gIGZvciAodmFyIGV2ZW50TmFtZSBpbiB0aGlzLmV2ZW50cyl7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmV2ZW50c1tldmVudE5hbWVdID09PSAnZnVuY3Rpb24nKXtcbiAgICAgIGluc3RhbmNlLm9uKGV2ZW50TmFtZSwgdGhpcy5ldmVudHNbZXZlbnROYW1lXSk7XG4gICAgfVxuICB9XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5yZW1vdmVFdmVudHNMaXN0ZW5lcnMgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB0aGlzLmhhc0V2ZW50c0xpc3RlbmVycyA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGV2ZW50TmFtZSBpbiB0aGlzLmV2ZW50cyl7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmV2ZW50c1tldmVudE5hbWVdID09PSAnZnVuY3Rpb24nKXtcbiAgICAgIGluc3RhbmNlLm9mZihldmVudE5hbWUsIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pO1xuICAgIH1cbiAgfVxufTtcblxuU2NyZWVuTmF2aWdhdG9ySXRlbS5wcm90b3R5cGUuZGlzcG9zZVNjcmVlbiA9IGZ1bmN0aW9uKGluc3RhbmNlLCBmb3JjZURpc3Bvc2UpIHtcbiAgaWYgKHRoaXMuZXZlbnRzKSB0aGlzLnJlbW92ZUV2ZW50c0xpc3RlbmVycyhpbnN0YW5jZSk7XG5cbiAgaWYgKCFmb3JjZURpc3Bvc2UgJiYgIXRoaXMuY2FuRGlzcG9zZSkgcmV0dXJuO1xuXG4gIGlmICh0eXBlb2YgaW5zdGFuY2UuZGlzcG9zZSA9PT0gJ2Z1bmN0aW9uJykgaW5zdGFuY2UuZGlzcG9zZSgpO1xuXG4gIHRoaXMuaW50ZXJuYWxJbnN0YW5jZSA9IG51bGw7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oZm9yY2VEaXNwb3NlKSB7XG4gIGlmICh0eXBlb2YgZm9yY2VEaXNwb3NlICE9PSAnYm9vbGVhbicpIGZvcmNlRGlzcG9zZSA9IHRydWU7XG5cbiAgdmFyIGluc3RhbmNlID0gdGhpcy5pc0luc3RhbmNlID8gdGhpcy5zY3JlZW4gOiB0aGlzLmludGVybmFsSW5zdGFuY2U7XG5cbiAgaWYgKGluc3RhbmNlKXtcbiAgICB0aGlzLmRpc3Bvc2VTY3JlZW4oaW5zdGFuY2UsIGZvcmNlRGlzcG9zZSk7XG4gIH1cbiAgXG4gIHRoaXMuc2NyZWVuID0gXG4gIHRoaXMuaW50ZXJuYWxJbnN0YW5jZSA9IFxuICB0aGlzLmFyZ3VtZW50cyA9IFxuICB0aGlzLnByb3BlcnRpZXMgPSBcbiAgdGhpcy5ldmVudHMgPSBcbiAgbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2NyZWVuTmF2aWdhdG9ySXRlbTtcblxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdG5vbmU6IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMvbm9uZS5qcycpLFxuXHRvdXRBbmRJbjogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9vdXRBbmRJbi5qcycpLFxuXHRvdXRUaGVuSW46IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMvb3V0VGhlbkluLmpzJyksXG5cdGluVGhlbk91dDogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9pblRoZW5PdXQuanMnKSxcblx0aW46IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMvaW4uanMnKSxcblx0b3V0OiByZXF1aXJlKCcuL3RyYW5zaXRpb25zL291dC5qcycpXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIGNvbXBsZXRlQ2FsbGJhY2spe1xuXHRpZiAobmV3U2NyZWVuKSB7XG5cdFx0bmV3U2NyZWVuLm9uKCdhbmltYXRlSW5Db21wbGV0ZScsIG9uQW5pbUluQ29tcGxldGUpO1xuXHRcdG5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblx0fWVsc2V7XG5cdFx0b25Db21wbGV0ZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzcG9zZSgpe1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5vZmYoJ2FuaW1hdGVJbkNvbXBsZXRlJywgb25BbmltSW5Db21wbGV0ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkFuaW1JbkNvbXBsZXRlKCl7XG5cdFx0b25Db21wbGV0ZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25Db21wbGV0ZSgpe1xuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cblx0XHRkaXNwb3NlKCk7XG5cblx0XHRjb21wbGV0ZUNhbGxiYWNrKCk7XG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7XG5cdFx0ZGlzcG9zZSgpO1xuXG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblx0fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjayl7XG5cdGlmIChuZXdTY3JlZW4pIHtcblx0XHRuZXdTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgb25BbmltSW5Db21wbGV0ZSk7XG5cdFx0bmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXHR9ZWxzZXtcblx0XHRhbmltT3V0KCk7XG5cdH1cblxuXHRmdW5jdGlvbiBhbmltT3V0KCl7XG5cdFx0aWYgKG9sZFNjcmVlbil7XG5cdFx0XHRvbGRTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbU91dENvbXBsZXRlKTtcblx0XHRcdG9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRvbkNvbXBsZXRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gZGlzcG9zZSgpe1xuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbU91dENvbXBsZXRlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4ub2ZmKCdhbmltYXRlSW5Db21wbGV0ZScsIG9uQW5pbUluQ29tcGxldGUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25BbmltSW5Db21wbGV0ZSgpe1xuXHRcdGlmIChvbGRTY3JlZW4pIHtcblx0XHRcdGFuaW1PdXQoKTtcblx0XHR9ZWxzZXtcblx0XHRcdG9uQ29tcGxldGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBvbkFuaW1PdXRDb21wbGV0ZSgpe1xuXHRcdG9uQ29tcGxldGUoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQ29tcGxldGUoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRjb21wbGV0ZUNhbGxiYWNrKCk7XG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7XG5cdFx0ZGlzcG9zZSgpO1xuXG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblx0fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjayl7XG5cdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblxuXHRjb21wbGV0ZUNhbGxiYWNrKCk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCgpe307XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIGNvbXBsZXRlQ2FsbGJhY2spe1xuXHRpZiAob2xkU2NyZWVuKSB7XG5cdFx0b2xkU2NyZWVuLm9uKCdhbmltYXRlT3V0Q29tcGxldGUnLCBvbkFuaW1PdXRDb21wbGV0ZSk7XG5cdFx0b2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblx0fWVsc2V7XG5cdFx0b25Db21wbGV0ZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzcG9zZSgpe1xuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbU91dENvbXBsZXRlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQW5pbU91dENvbXBsZXRlKCl7XG5cdFx0b25Db21wbGV0ZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25Db21wbGV0ZSgpe1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblxuXHRcdGRpc3Bvc2UoKTtcblxuXHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBvbkNvbXBsZXRlKXtcblx0dmFyIGNvdW50ID0gMDtcblx0dmFyIG1heENvdW50ID0gMDtcblxuXHRpZiAob2xkU2NyZWVuKSBtYXhDb3VudCsrO1xuXHRpZiAobmV3U2NyZWVuKSBtYXhDb3VudCsrO1xuXG5cdGlmIChvbGRTY3JlZW4pIHtcblx0XHRvbGRTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbUNvbXBsZXRlKTtcblx0XHRvbGRTY3JlZW4uYW5pbWF0ZU91dCgpO1xuXHR9XG5cblx0aWYgKG5ld1NjcmVlbikge1xuXHRcdG5ld1NjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1Db21wbGV0ZSk7XG5cdFx0bmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25BbmltQ29tcGxldGUoKXtcblx0XHRjb3VudCsrO1xuXG5cdFx0aWYgKGNvdW50ID09PSBtYXhDb3VudCkgb25Db21wbGV0ZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzcG9zZSgpe1xuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbUNvbXBsZXRlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4ub2ZmKCdhbmltYXRlT3V0Q29tcGxldGUnLCBvbkFuaW1Db21wbGV0ZSk7XG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7XG5cdFx0ZGlzcG9zZSgpO1xuXG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblx0fVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKXtcblx0aWYgKG9sZFNjcmVlbikge1xuXHRcdG9sZFNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltT3V0Q29tcGxldGUpO1xuXG5cdFx0b2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblx0fWVsc2V7XG5cdFx0YW5pbUluKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkFuaW1PdXRDb21wbGV0ZSgpe1xuXHRcdGlmIChuZXdTY3JlZW4pIHtcblx0XHRcdGFuaW1JbigpO1xuXHRcdH1lbHNle1xuXHRcdFx0b25Db21wbGV0ZSgpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIG9uQW5pbUluQ29tcGxldGUoKXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBhbmltSW4oKXtcblx0XHRuZXdTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgb25BbmltSW5Db21wbGV0ZSk7XG5cblx0XHRuZXdTY3JlZW4uYW5pbWF0ZUluKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltT3V0Q29tcGxldGUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5vZmYoJ2FuaW1hdGVJbkNvbXBsZXRlJywgb25BbmltSW5Db21wbGV0ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkNvbXBsZXRlKCl7XG5cdFx0ZGlzcG9zZSgpO1xuXG5cdFx0Y29tcGxldGVDYWxsYmFjaygpO1xuXHR9XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCgpe1xuXHRcdGRpc3Bvc2UoKTtcblxuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KHRydWUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4odHJ1ZSk7XG5cdH07XG59OyIsImltcG9ydCBTY3JlZW5OYXZpZ2F0b3IsIHtUcmFuc2l0aW9ucywgQVNjcmVlbn0gZnJvbSAnLi9zcmMvU2NyZWVuTmF2aWdhdG9yJztcblxuU2NyZWVuTmF2aWdhdG9yLlRyYW5zaXRpb25zID0gVHJhbnNpdGlvbnM7XG5TY3JlZW5OYXZpZ2F0b3IuQVNjcmVlbiA9IEFTY3JlZW47XG5cbndpbmRvdy5TY3JlZW5OYXZpZ2F0b3IgPSBTY3JlZW5OYXZpZ2F0b3I7Il19
