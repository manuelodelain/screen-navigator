(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var ScreenNavigator = require('../src/ScreenNavigator.js');
var Home = require('./pages/Home.js');
var About = require('./pages/About.js');
var Transitions = require('../src/ScreenNavigator.js').Transitions;

var navigator = new ScreenNavigator();

navigator.transition = Transitions.outThenIn;

// listen screens changes
navigator.on('change', onPageChange);

// ADD SCREENS

// add screen instance
navigator.addItem('home', new Home(), {
  events: {
    animateInComplete: function animateInComplete() {
      console.log('animateInComplete');
    }
  }
});

// add screen class with options
navigator.addItem('about', About, {
  arguments: ['my message'], // constructor arguments
  properties: {}, // set properties at the screen initialization
  canDispose: false
});

// add screen class
navigator.addItem('contact', require('./pages/Contact.js'));

// SHOW FIRST SCREEN
navigator.showScreen('home');

var navItems = document.querySelectorAll('nav li a');

// click on nav links for the example
for (var i = 0; i < navItems.length; i++) {
  navItems[i].addEventListener('click', function (event) {
    event.preventDefault();

    var id = event.currentTarget.getAttribute('href').split('/')[1];
    if (id === '') id = 'home';

    // show screen
    navigator.showScreen(id);
  });
};

function onPageChange() {
  // console.log('change');
}

},{"../src/ScreenNavigator.js":10,"./pages/About.js":3,"./pages/Contact.js":4,"./pages/Home.js":5}],2:[function(require,module,exports){
'use strict';

var AScreen = require('../../src/AScreen.js');
var inherits = require('inherits');

var APage = function APage(id) {
	this.element = document.getElementById(id + '-page');
};

inherits(APage, AScreen);

APage.prototype.animateIn = function (cancel) {
	if (cancel) {
		TweenMax.killTweensOf(this.element);

		this.onAnimateInComplete();

		return;
	}

	TweenMax.to(this.element, .5, {
		opacity: 1,
		onComplete: this.onAnimateInComplete.bind(this)
	});

	this.element.classList.add('active');
};

APage.prototype.animateOut = function (cancel) {
	if (cancel) {
		TweenMax.killTweensOf(this.element);

		this.onAnimateOutComplete();

		return;
	}

	TweenMax.to(this.element, .5, {
		opacity: 0,
		onComplete: this.onAnimateOutComplete.bind(this)
	});
};

APage.prototype.onAnimateInComplete = function () {
	AScreen.prototype.onAnimateInComplete.call(this);
};

APage.prototype.onAnimateOutComplete = function () {
	AScreen.prototype.onAnimateOutComplete.call(this);

	this.element.classList.remove('active');
};

module.exports = APage;

},{"../../src/AScreen.js":9,"inherits":7}],3:[function(require,module,exports){
'use strict';

var APage = require('./APage.js');
var inherits = require('inherits');

var About = function About(msg) {
	console.log(msg);

	APage.call(this, 'about');
};

inherits(About, APage);

// About.prototype.animateIn = function() {
//   this.element.classList.add('active');
// };

module.exports = About;

},{"./APage.js":2,"inherits":7}],4:[function(require,module,exports){
'use strict';

var APage = require('./APage.js');
var inherits = require('inherits');

var Contact = function Contact() {
  APage.call(this, 'contact');
};

inherits(Contact, APage);

// Contact.prototype.animateIn = function() {
//   this.element.classList.add('active');
// };

module.exports = Contact;

},{"./APage.js":2,"inherits":7}],5:[function(require,module,exports){
'use strict';

var APage = require('./APage.js');
var inherits = require('inherits');
var ScreenNavigator = require('../../src/ScreenNavigator.js');
var HomeSubPage = require('./home/HomeSubPage.js');
var Transitions = ScreenNavigator.Transitions;

var Home = function Home() {
  APage.call(this, 'home');

  var that = this;
  var subPagesContainer = document.querySelector('.sub-pages-container');
  var navElement = document.querySelector('.sub-pages-nav ul');

  this.navigator = new ScreenNavigator();

  this.navigator.transition = Transitions.outAndIn;

  this.navigator.on('screenChange', this.onSubPageChange.bind(this));

  this.navigator.on('transitionComplete', function () {
    // console.log('transition complete');
  });

  for (var i = 0; i < 6; i++) {
    this.navigator.addItem('page' + i, new HomeSubPage(subPagesContainer, i));

    var navItem = document.createElement('li');
    navItem.setAttribute('data-screen-id', 'page' + i);
    navElement.appendChild(navItem);

    var navLink = document.createElement('a');
    navLink.href = '#page' + i;
    navItem.appendChild(navLink);

    navLink.addEventListener('click', function (event) {
      event.preventDefault();

      var screenId = event.currentTarget.parentNode.getAttribute('data-screen-id');

      that.navigator.showScreen(screenId);
    });
  };

  this.navigator.showScreen('page0');
};

inherits(Home, APage);

Home.prototype.onSubPageChange = function () {
  var navItems = document.querySelectorAll('.sub-pages-nav li');

  for (var i = 0; i < navItems.length; i++) {
    if (navItems[i].getAttribute('data-screen-id') === this.navigator.currentItemId) {
      navItems[i].classList.add('active');
    } else {
      navItems[i].classList.remove('active');
    }
  };
};

module.exports = Home;

},{"../../src/ScreenNavigator.js":10,"./APage.js":2,"./home/HomeSubPage.js":6,"inherits":7}],6:[function(require,module,exports){
'use strict';

var AScreen = require('../../../src/AScreen.js');
var inherits = require('inherits');

var HomeItem = function HomeItem(container, index) {
  this.element = document.createElement('div');

  this.element.classList.add('sub-page');
  this.element.innerHTML = 'page ' + index;

  this.element.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

  container.appendChild(this.element);
};

inherits(HomeItem, AScreen);

HomeItem.prototype.animateIn = function (cancel) {
  if (cancel) {
    TweenMax.killTweensOf(this.element);

    this.onAnimateInComplete();

    return;
  }

  TweenMax.fromTo(this.element, 1, {
    xPercent: 100
  }, {
    xPercent: 0,
    onComplete: this.onAnimateInComplete.bind(this),
    ease: Expo.easeOut
  });

  this.element.classList.add('active');
};

HomeItem.prototype.onAnimateInComplete = function () {
  AScreen.prototype.onAnimateInComplete.call(this);
};

HomeItem.prototype.animateOut = function (cancel) {
  if (cancel) {
    TweenMax.killTweensOf(this.element);

    this.onAnimateOutComplete();

    return;
  }

  TweenMax.to(this.element, 1, {
    xPercent: -100,
    onComplete: this.onAnimateOutComplete.bind(this),
    ease: Expo.easeOut
  });
};

HomeItem.prototype.onAnimateOutComplete = function () {
  AScreen.prototype.onAnimateOutComplete.call(this);

  this.element.classList.remove('active');
};

module.exports = HomeItem;

},{"../../../src/AScreen.js":9,"inherits":7}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{"inherits":7,"tiny-emitter":8}],10:[function(require,module,exports){
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

},{"./AScreen":9,"./ScreenNavigatorItem":11,"./Transitions":12,"tiny-emitter":8}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
'use strict';

module.exports = {
	none: require('./transitions/none.js'),
	outAndIn: require('./transitions/outAndIn.js'),
	outThenIn: require('./transitions/outThenIn.js'),
	inThenOut: require('./transitions/inThenOut.js'),
	in: require('./transitions/in.js'),
	out: require('./transitions/out.js')
};

},{"./transitions/in.js":13,"./transitions/inThenOut.js":14,"./transitions/none.js":15,"./transitions/out.js":16,"./transitions/outAndIn.js":17,"./transitions/outThenIn.js":18}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
"use strict";

module.exports = function (newScreen, oldScreen, completeCallback) {
	if (oldScreen) oldScreen.animateOut();
	if (newScreen) newScreen.animateIn();

	completeCallback();

	return function cancel() {};
};

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL2luZGV4LmpzIiwiZXhhbXBsZS9wYWdlcy9BUGFnZS5qcyIsImV4YW1wbGUvcGFnZXMvQWJvdXQuanMiLCJleGFtcGxlL3BhZ2VzL0NvbnRhY3QuanMiLCJleGFtcGxlL3BhZ2VzL0hvbWUuanMiLCJleGFtcGxlL3BhZ2VzL2hvbWUvSG9tZVN1YlBhZ2UuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy90aW55LWVtaXR0ZXIvaW5kZXguanMiLCJzcmMvQVNjcmVlbi5qcyIsInNyYy9TY3JlZW5OYXZpZ2F0b3IuanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9ySXRlbS5qcyIsInNyYy9UcmFuc2l0aW9ucy5qcyIsInNyYy90cmFuc2l0aW9ucy9pbi5qcyIsInNyYy90cmFuc2l0aW9ucy9pblRoZW5PdXQuanMiLCJzcmMvdHJhbnNpdGlvbnMvbm9uZS5qcyIsInNyYy90cmFuc2l0aW9ucy9vdXQuanMiLCJzcmMvdHJhbnNpdGlvbnMvb3V0QW5kSW4uanMiLCJzcmMvdHJhbnNpdGlvbnMvb3V0VGhlbkluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLGtCQUFrQixRQUFRLDJCQUFSLENBQXRCO0FBQ0EsSUFBSSxPQUFPLFFBQVEsaUJBQVIsQ0FBWDtBQUNBLElBQUksUUFBUSxRQUFRLGtCQUFSLENBQVo7QUFDQSxJQUFJLGNBQWMsUUFBUSwyQkFBUixFQUFxQyxXQUF2RDs7QUFFQSxJQUFJLFlBQVksSUFBSSxlQUFKLEVBQWhCOztBQUVBLFVBQVUsVUFBVixHQUF1QixZQUFZLFNBQW5DOztBQUVBO0FBQ0EsVUFBVSxFQUFWLENBQWEsUUFBYixFQUF1QixZQUF2Qjs7QUFFQTs7QUFFQTtBQUNBLFVBQVUsT0FBVixDQUFrQixNQUFsQixFQUEwQixJQUFJLElBQUosRUFBMUIsRUFBc0M7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SSxTQUFKLEVBQWUsVUFBVSxVQUFWLENBQXFCLElBQXJCO0FBQ2YsTUFBSSxTQUFKLEVBQWUsVUFBVSxTQUFWLENBQW9CLElBQXBCO0FBQ2YsRUFMRDtBQU1BLENBNUNEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwidmFyIFNjcmVlbk5hdmlnYXRvciA9IHJlcXVpcmUoJy4uL3NyYy9TY3JlZW5OYXZpZ2F0b3IuanMnKTtcbnZhciBIb21lID0gcmVxdWlyZSgnLi9wYWdlcy9Ib21lLmpzJyk7XG52YXIgQWJvdXQgPSByZXF1aXJlKCcuL3BhZ2VzL0Fib3V0LmpzJyk7XG52YXIgVHJhbnNpdGlvbnMgPSByZXF1aXJlKCcuLi9zcmMvU2NyZWVuTmF2aWdhdG9yLmpzJykuVHJhbnNpdGlvbnM7XG5cbnZhciBuYXZpZ2F0b3IgPSBuZXcgU2NyZWVuTmF2aWdhdG9yKCk7XG5cbm5hdmlnYXRvci50cmFuc2l0aW9uID0gVHJhbnNpdGlvbnMub3V0VGhlbkluO1xuXG4vLyBsaXN0ZW4gc2NyZWVucyBjaGFuZ2VzXG5uYXZpZ2F0b3Iub24oJ2NoYW5nZScsIG9uUGFnZUNoYW5nZSk7XG5cbi8vIEFERCBTQ1JFRU5TXG5cbi8vIGFkZCBzY3JlZW4gaW5zdGFuY2Vcbm5hdmlnYXRvci5hZGRJdGVtKCdob21lJywgbmV3IEhvbWUoKSwge1xuICBldmVudHM6IHtcbiAgICBhbmltYXRlSW5Db21wbGV0ZTogZnVuY3Rpb24oKXtcbiAgICAgIGNvbnNvbGUubG9nKCdhbmltYXRlSW5Db21wbGV0ZScpO1xuICAgIH1cbiAgfVxufSk7IFxuXG4vLyBhZGQgc2NyZWVuIGNsYXNzIHdpdGggb3B0aW9uc1xubmF2aWdhdG9yLmFkZEl0ZW0oJ2Fib3V0JywgQWJvdXQsIHtcblx0YXJndW1lbnRzOiBbJ215IG1lc3NhZ2UnXSwgLy8gY29uc3RydWN0b3IgYXJndW1lbnRzXG5cdHByb3BlcnRpZXM6IHt9LCAvLyBzZXQgcHJvcGVydGllcyBhdCB0aGUgc2NyZWVuIGluaXRpYWxpemF0aW9uXG5cdGNhbkRpc3Bvc2U6IGZhbHNlXG59KTsgXG5cbi8vIGFkZCBzY3JlZW4gY2xhc3Ncbm5hdmlnYXRvci5hZGRJdGVtKCdjb250YWN0JywgcmVxdWlyZSgnLi9wYWdlcy9Db250YWN0LmpzJykpOyBcblxuLy8gU0hPVyBGSVJTVCBTQ1JFRU5cbm5hdmlnYXRvci5zaG93U2NyZWVuKCdob21lJyk7XG5cbnZhciBuYXZJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ25hdiBsaSBhJyk7XG5cbi8vIGNsaWNrIG9uIG5hdiBsaW5rcyBmb3IgdGhlIGV4YW1wbGVcbmZvciAodmFyIGkgPSAwOyBpIDwgbmF2SXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgbmF2SXRlbXNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciBpZCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJykuc3BsaXQoJy8nKVsxXTtcbiAgICBpZiAoaWQgPT09ICcnKSBpZCA9ICdob21lJztcblxuICAgIC8vIHNob3cgc2NyZWVuXG4gICAgbmF2aWdhdG9yLnNob3dTY3JlZW4oaWQpO1xuICB9KVxufTtcblxuZnVuY3Rpb24gb25QYWdlQ2hhbmdlKCl7XG4gIC8vIGNvbnNvbGUubG9nKCdjaGFuZ2UnKTtcbn1cbiIsInZhciBBU2NyZWVuID0gcmVxdWlyZSgnLi4vLi4vc3JjL0FTY3JlZW4uanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBBUGFnZSA9IGZ1bmN0aW9uKGlkKXtcbiAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQgKyAnLXBhZ2UnKTtcbn07XG5cbmluaGVyaXRzKEFQYWdlLCBBU2NyZWVuKTtcblxuQVBhZ2UucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKGNhbmNlbCkge1xuXHRpZiAoY2FuY2VsKSB7XG5cdFx0VHdlZW5NYXgua2lsbFR3ZWVuc09mKHRoaXMuZWxlbWVudCk7XG5cblx0XHR0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUoKTtcblxuXHRcdHJldHVybjtcblx0fVxuXG4gIFR3ZWVuTWF4LnRvKHRoaXMuZWxlbWVudCwgLjUsIHtcbiAgXHRvcGFjaXR5OiAxLCBcbiAgXHRvbkNvbXBsZXRlOiB0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUuYmluZCh0aGlzKVxuICB9KTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG59O1xuXG5BUGFnZS5wcm90b3R5cGUuYW5pbWF0ZU91dCA9IGZ1bmN0aW9uKGNhbmNlbCkge1xuXHRpZiAoY2FuY2VsKSB7XG5cdFx0VHdlZW5NYXgua2lsbFR3ZWVuc09mKHRoaXMuZWxlbWVudCk7XG5cblx0XHR0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlKCk7XG5cblx0XHRyZXR1cm47XG5cdH1cblxuXHRUd2Vlbk1heC50byh0aGlzLmVsZW1lbnQsIC41LCB7XG4gIFx0b3BhY2l0eTogMCwgXG4gIFx0b25Db21wbGV0ZTogdGhpcy5vbkFuaW1hdGVPdXRDb21wbGV0ZS5iaW5kKHRoaXMpXG4gIH0pO1xufTtcblxuQVBhZ2UucHJvdG90eXBlLm9uQW5pbWF0ZUluQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcblx0QVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZS5jYWxsKHRoaXMpO1xufTtcblxuQVBhZ2UucHJvdG90eXBlLm9uQW5pbWF0ZU91dENvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG5cdEFTY3JlZW4ucHJvdG90eXBlLm9uQW5pbWF0ZU91dENvbXBsZXRlLmNhbGwodGhpcyk7XG5cblx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBUGFnZTtcblxuIiwidmFyIEFQYWdlID0gcmVxdWlyZSgnLi9BUGFnZS5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIEFib3V0ID0gZnVuY3Rpb24obXNnKXtcblx0Y29uc29sZS5sb2cobXNnKTtcblxuXHRBUGFnZS5jYWxsKHRoaXMsICdhYm91dCcpO1xufTtcblxuaW5oZXJpdHMoQWJvdXQsIEFQYWdlKTtcblxuLy8gQWJvdXQucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKCkge1xuLy8gICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4vLyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFib3V0O1xuIiwidmFyIEFQYWdlID0gcmVxdWlyZSgnLi9BUGFnZS5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIENvbnRhY3QgPSBmdW5jdGlvbigpe1xuICBBUGFnZS5jYWxsKHRoaXMsICdjb250YWN0Jyk7XG59O1xuXG5pbmhlcml0cyhDb250YWN0LCBBUGFnZSk7XG5cbi8vIENvbnRhY3QucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKCkge1xuLy8gICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4vLyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRhY3Q7XG4iLCJ2YXIgQVBhZ2UgPSByZXF1aXJlKCcuL0FQYWdlLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xudmFyIFNjcmVlbk5hdmlnYXRvciA9IHJlcXVpcmUoJy4uLy4uL3NyYy9TY3JlZW5OYXZpZ2F0b3IuanMnKTtcbnZhciBIb21lU3ViUGFnZSA9IHJlcXVpcmUoJy4vaG9tZS9Ib21lU3ViUGFnZS5qcycpO1xudmFyIFRyYW5zaXRpb25zID0gU2NyZWVuTmF2aWdhdG9yLlRyYW5zaXRpb25zO1xuXG52YXIgSG9tZSA9IGZ1bmN0aW9uKCl7XG4gIEFQYWdlLmNhbGwodGhpcywgJ2hvbWUnKTtcblxuICB2YXIgdGhhdCA9IHRoaXM7XG4gIHZhciBzdWJQYWdlc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdWItcGFnZXMtY29udGFpbmVyJyk7XG4gIHZhciBuYXZFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN1Yi1wYWdlcy1uYXYgdWwnKTtcblxuICB0aGlzLm5hdmlnYXRvciA9IG5ldyBTY3JlZW5OYXZpZ2F0b3IoKTtcblxuICB0aGlzLm5hdmlnYXRvci50cmFuc2l0aW9uID0gVHJhbnNpdGlvbnMub3V0QW5kSW47XG5cbiAgdGhpcy5uYXZpZ2F0b3Iub24oJ3NjcmVlbkNoYW5nZScsIHRoaXMub25TdWJQYWdlQ2hhbmdlLmJpbmQodGhpcykpO1xuICBcbiAgdGhpcy5uYXZpZ2F0b3Iub24oJ3RyYW5zaXRpb25Db21wbGV0ZScsIGZ1bmN0aW9uKCl7XG4gICAgLy8gY29uc29sZS5sb2coJ3RyYW5zaXRpb24gY29tcGxldGUnKTtcbiAgfSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICB0aGlzLm5hdmlnYXRvci5hZGRJdGVtKCdwYWdlJyArIGksIG5ldyBIb21lU3ViUGFnZShzdWJQYWdlc0NvbnRhaW5lciwgaSkpO1xuXG4gICAgdmFyIG5hdkl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIG5hdkl0ZW0uc2V0QXR0cmlidXRlKCdkYXRhLXNjcmVlbi1pZCcsICdwYWdlJyArIGkpO1xuICAgIG5hdkVsZW1lbnQuYXBwZW5kQ2hpbGQobmF2SXRlbSk7XG5cbiAgICB2YXIgbmF2TGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBuYXZMaW5rLmhyZWYgPSAnI3BhZ2UnICsgaTtcbiAgICBuYXZJdGVtLmFwcGVuZENoaWxkKG5hdkxpbmspO1xuXG4gICAgbmF2TGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHZhciBzY3JlZW5JZCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2NyZWVuLWlkJyk7XG5cbiAgICAgIHRoYXQubmF2aWdhdG9yLnNob3dTY3JlZW4oc2NyZWVuSWQpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMubmF2aWdhdG9yLnNob3dTY3JlZW4oJ3BhZ2UwJyk7XG59O1xuXG5pbmhlcml0cyhIb21lLCBBUGFnZSk7XG5cbkhvbWUucHJvdG90eXBlLm9uU3ViUGFnZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbmF2SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc3ViLXBhZ2VzLW5hdiBsaScpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmF2SXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAobmF2SXRlbXNbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLXNjcmVlbi1pZCcpID09PSB0aGlzLm5hdmlnYXRvci5jdXJyZW50SXRlbUlkKXtcbiAgICAgIG5hdkl0ZW1zW2ldLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1lbHNle1xuICAgICAgbmF2SXRlbXNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIb21lO1xuXG4iLCJ2YXIgQVNjcmVlbiA9IHJlcXVpcmUoJy4uLy4uLy4uL3NyYy9BU2NyZWVuLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgSG9tZUl0ZW0gPSBmdW5jdGlvbihjb250YWluZXIsIGluZGV4KXtcbiAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3N1Yi1wYWdlJyk7XG4gIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSAncGFnZSAnICsgaW5kZXg7XG5cbiAgdGhpcy5lbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2Nzc3MjE1KS50b1N0cmluZygxNik7XG5cbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG59O1xuXG5pbmhlcml0cyhIb21lSXRlbSwgQVNjcmVlbik7XG5cbkhvbWVJdGVtLnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbihjYW5jZWwpIHtcbiAgaWYgKGNhbmNlbCl7XG4gICAgVHdlZW5NYXgua2lsbFR3ZWVuc09mKHRoaXMuZWxlbWVudCk7XG5cbiAgICB0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUoKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIFR3ZWVuTWF4LmZyb21Ubyh0aGlzLmVsZW1lbnQsIDEsIHtcbiAgICB4UGVyY2VudDogMTAwXG4gIH0sIHtcbiAgICB4UGVyY2VudDogMCxcbiAgICBvbkNvbXBsZXRlOiB0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUuYmluZCh0aGlzKSxcbiAgICBlYXNlOiBFeHBvLmVhc2VPdXRcbiAgfSk7XG5cbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxuSG9tZUl0ZW0ucHJvdG90eXBlLm9uQW5pbWF0ZUluQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZS5jYWxsKHRoaXMpO1xufTtcblxuSG9tZUl0ZW0ucHJvdG90eXBlLmFuaW1hdGVPdXQgPSBmdW5jdGlvbihjYW5jZWwpIHtcbiAgaWYgKGNhbmNlbCl7XG4gICAgVHdlZW5NYXgua2lsbFR3ZWVuc09mKHRoaXMuZWxlbWVudCk7XG5cbiAgICB0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlKCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBUd2Vlbk1heC50byh0aGlzLmVsZW1lbnQsIDEsIHtcbiAgICB4UGVyY2VudDogLTEwMCxcbiAgICBvbkNvbXBsZXRlOiB0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlLmJpbmQodGhpcyksXG4gICAgZWFzZTogRXhwby5lYXNlT3V0XG4gIH0pO1xufTtcblxuSG9tZUl0ZW0ucHJvdG90eXBlLm9uQW5pbWF0ZU91dENvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIEFTY3JlZW4ucHJvdG90eXBlLm9uQW5pbWF0ZU91dENvbXBsZXRlLmNhbGwodGhpcyk7XG5cbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIb21lSXRlbTtcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiZnVuY3Rpb24gRSAoKSB7XG4gIC8vIEtlZXAgdGhpcyBlbXB0eSBzbyBpdCdzIGVhc2llciB0byBpbmhlcml0IGZyb21cbiAgLy8gKHZpYSBodHRwczovL2dpdGh1Yi5jb20vbGlwc21hY2sgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2lzc3Vlcy8zKVxufVxuXG5FLnByb3RvdHlwZSA9IHtcbiAgb246IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcblxuICAgIChlW25hbWVdIHx8IChlW25hbWVdID0gW10pKS5wdXNoKHtcbiAgICAgIGZuOiBjYWxsYmFjayxcbiAgICAgIGN0eDogY3R4XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvbmNlOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBmdW5jdGlvbiBsaXN0ZW5lciAoKSB7XG4gICAgICBzZWxmLm9mZihuYW1lLCBsaXN0ZW5lcik7XG4gICAgICBjYWxsYmFjay5hcHBseShjdHgsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIGxpc3RlbmVyLl8gPSBjYWxsYmFja1xuICAgIHJldHVybiB0aGlzLm9uKG5hbWUsIGxpc3RlbmVyLCBjdHgpO1xuICB9LFxuXG4gIGVtaXQ6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIGRhdGEgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGV2dEFyciA9ICgodGhpcy5lIHx8ICh0aGlzLmUgPSB7fSkpW25hbWVdIHx8IFtdKS5zbGljZSgpO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbGVuID0gZXZ0QXJyLmxlbmd0aDtcblxuICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBldnRBcnJbaV0uZm4uYXBwbHkoZXZ0QXJyW2ldLmN0eCwgZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb2ZmOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuICAgIHZhciBldnRzID0gZVtuYW1lXTtcbiAgICB2YXIgbGl2ZUV2ZW50cyA9IFtdO1xuXG4gICAgaWYgKGV2dHMgJiYgY2FsbGJhY2spIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBldnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChldnRzW2ldLmZuICE9PSBjYWxsYmFjayAmJiBldnRzW2ldLmZuLl8gIT09IGNhbGxiYWNrKVxuICAgICAgICAgIGxpdmVFdmVudHMucHVzaChldnRzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgZXZlbnQgZnJvbSBxdWV1ZSB0byBwcmV2ZW50IG1lbW9yeSBsZWFrXG4gICAgLy8gU3VnZ2VzdGVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9sYXpkXG4gICAgLy8gUmVmOiBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2NvbW1pdC9jNmViZmFhOWJjOTczYjMzZDExMGE4NGEzMDc3NDJiN2NmOTRjOTUzI2NvbW1pdGNvbW1lbnQtNTAyNDkxMFxuXG4gICAgKGxpdmVFdmVudHMubGVuZ3RoKVxuICAgICAgPyBlW25hbWVdID0gbGl2ZUV2ZW50c1xuICAgICAgOiBkZWxldGUgZVtuYW1lXTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEU7XG4iLCJ2YXIgVGlueUVtaXR0ZXIgPSByZXF1aXJlKCd0aW55LWVtaXR0ZXInKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBBU2NyZWVuID0gZnVuY3Rpb24oKXtcbn07XG5cbmluaGVyaXRzKEFTY3JlZW4sIFRpbnlFbWl0dGVyKTtcblxuQVNjcmVlbi5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oY2FuY2VsKSB7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgnYW5pbWF0ZUluQ29tcGxldGUnKTtcbn07XG5cbkFTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVPdXQgPSBmdW5jdGlvbihjYW5jZWwpIHtcbn07XG5cbkFTY3JlZW4ucHJvdG90eXBlLm9uQW5pbWF0ZU91dENvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgnYW5pbWF0ZU91dENvbXBsZXRlJyk7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMub2ZmKCdhbmltYXRlSW5Db21wbGV0ZScpXG4gICAgICAub2ZmKCdhbmltYXRlT3V0Q29tcGxldGUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQVNjcmVlbjsiLCJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ3RpbnktZW1pdHRlcic7XG5pbXBvcnQgU2NyZWVuTmF2aWdhdG9ySXRlbSBmcm9tICcuL1NjcmVlbk5hdmlnYXRvckl0ZW0nO1xuaW1wb3J0IFRyYW5zaXRpb25zIGZyb20gJy4vVHJhbnNpdGlvbnMnO1xuaW1wb3J0IEFTY3JlZW4gZnJvbSAnLi9BU2NyZWVuJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NyZWVuTmF2aWdhdG9yIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKCk7XG4gICAgXG4gICAgdGhpcy5pdGVtcyA9IHt9O1xuXG4gICAgdGhpcy5jdXJyZW50SXRlbUlkID0gbnVsbDtcbiAgICB0aGlzLnByZXZpb3VzSXRlbUlkID0gbnVsbDtcblxuICAgIHRoaXMuY3VycmVudFNjcmVlbiA9IG51bGw7XG4gICAgdGhpcy5wcmV2aW91c1NjcmVlbiA9IG51bGw7XG5cbiAgICB0aGlzLnRyYW5zaXRpb24gPSBTY3JlZW5OYXZpZ2F0b3IuZGVmYXVsdFRyYW5zaXRpb247XG4gICAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuICAgIHRoaXMudHJhbnNpdGlvbkNhbmNlbCA9IG51bGw7XG5cbiAgICBTY3JlZW5OYXZpZ2F0b3IuZGVmYXVsdFRyYW5zaXRpb24gPSBUcmFuc2l0aW9ucy5ub25lO1xuICB9XG4gIFxuICBhZGRJdGVtIChpZCwgc2NyZWVuLCBvcHRpb25zKSB7XG4gICAgY29uc3QgaXRlbSA9IG5ldyBTY3JlZW5OYXZpZ2F0b3JJdGVtKHNjcmVlbiwgb3B0aW9ucyk7XG4gIFxuICAgIHRoaXMuaXRlbXNbaWRdID0gaXRlbTtcbiAgXG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICBnZXRJdGVtIChpZCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zW2lkXTtcbiAgfVxuXG4gIHNob3dTY3JlZW4gKGlkLCB0cmFuc2l0aW9uLCBvcHRpb25zKSB7XG4gICAgaWYgKCF0aGlzLmdldEl0ZW0oaWQpKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcignU2NyZWVuTmF2aWdhdG9yIC0gdGhlIGl0ZW0gd2l0aCB0aGUgaWQgJyArIGlkICsgJyBkb2VzblxcJ3QgZXhpc3QnKTtcbiAgICB9XG4gIFxuICAgIGlmICh0aGlzLnRyYW5zaXRpb25SdW5uaW5nKXtcbiAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUodHJ1ZSk7XG4gICAgfSBcbiAgXG4gICAgaWYgKHRoaXMuY3VycmVudFNjcmVlbil7XG4gICAgICB0aGlzLnByZXZpb3VzSXRlbUlkID0gdGhpcy5jdXJyZW50SXRlbUlkO1xuICAgICAgdGhpcy5wcmV2aW91c1NjcmVlbiA9IHRoaXMuY3VycmVudFNjcmVlbjtcbiAgICB9XG4gIFxuICAgIHRoaXMuY3VycmVudEl0ZW1JZCA9IGlkO1xuICBcbiAgICB0aGlzLm9uU2NyZWVuQ2hhbmdlKCk7XG4gIFxuICAgIHRoaXMuc3RhcnRUcmFuc2l0aW9uKHRyYW5zaXRpb24sIG9wdGlvbnMpO1xuICB9XG5cbiAgY2xlYXJTY3JlZW4gKHRyYW5zaXRpb24pIHtcbiAgICBpZiAoIXRoaXMuY3VycmVudFNjcmVlbil7XG4gICAgICByZXR1cm47XG4gICAgfVxuICBcbiAgICB0aGlzLnByZXZpb3VzSXRlbUlkID0gdGhpcy5jdXJyZW50SXRlbUlkO1xuICAgIHRoaXMucHJldmlvdXNTY3JlZW4gPSB0aGlzLmN1cnJlbnRTY3JlZW47XG4gIFxuICAgIHRoaXMuY3VycmVudEl0ZW1JZCA9IG51bGw7XG4gIFxuICAgIHRoaXMub25TY3JlZW5DaGFuZ2UoKTtcbiAgXG4gICAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvbik7XG4gIH1cblxuICBzdGFydFRyYW5zaXRpb24gKHRyYW5zaXRpb24sIG9wdGlvbnMpIHtcbiAgICB0cmFuc2l0aW9uID0gdHJhbnNpdGlvbiB8fCB0aGlzLnRyYW5zaXRpb247XG4gIFxuICAgIGNvbnN0IGN1cnJlbnRJdGVtID0gdGhpcy5nZXRJdGVtKHRoaXMuY3VycmVudEl0ZW1JZCk7XG4gIFxuICAgIGlmIChvcHRpb25zKSBjdXJyZW50SXRlbS5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICBcbiAgICB0aGlzLmN1cnJlbnRTY3JlZW4gPSBjdXJyZW50SXRlbSA/IGN1cnJlbnRJdGVtLmdldFNjcmVlbihvcHRpb25zKSA6IG51bGw7XG4gIFxuICAgIHRoaXMudHJhbnNpdGlvblJ1bm5pbmcgPSB0cnVlO1xuICBcbiAgICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25TdGFydCcpO1xuICBcbiAgICB0aGlzLnRyYW5zaXRpb25DYW5jZWwgPSB0cmFuc2l0aW9uKHRoaXMuY3VycmVudFNjcmVlbiwgdGhpcy5wcmV2aW91c1NjcmVlbiwgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIG9uU2NyZWVuQ2hhbmdlICgpIHtcbiAgICB0aGlzLmVtaXQoJ3NjcmVlbkNoYW5nZScpO1xuICB9XG5cbiAgb25UcmFuc2l0aW9uQ29tcGxldGUgKGNhbmNlbFRyYW5zaXRpb24sIHNpbGVudCkge1xuICAgIHRoaXMudHJhbnNpdGlvblJ1bm5pbmcgPSBmYWxzZTtcbiAgXG4gICAgaWYgKGNhbmNlbFRyYW5zaXRpb24pe1xuICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbkNhbmNlbCkgdGhpcy50cmFuc2l0aW9uQ2FuY2VsKCk7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuZGlzcG9zZVByZXZpb3VzU2NyZWVuKCk7XG4gIFxuICAgIGlmICghc2lsZW50KXtcbiAgICAgIGlmIChjYW5jZWxUcmFuc2l0aW9uKXtcbiAgICAgICAgdGhpcy5lbWl0KCd0cmFuc2l0aW9uQ2FuY2VsJyk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGhpcy5lbWl0KCd0cmFuc2l0aW9uQ29tcGxldGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIFxuICAgIHRoaXMudHJhbnNpdGlvbkNhbmNlbCA9IG51bGw7XG4gIH1cblxuICBkaXNwb3NlIChmb3JjZURpc3Bvc2UpIHtcbiAgICBpZiAodHlwZW9mIGZvcmNlRGlzcG9zZSAhPT0gJ2Jvb2xlYW4nKSBmb3JjZURpc3Bvc2UgPSB0cnVlO1xuICBcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uUnVubmluZyl7XG4gICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKHRydWUsIHRydWUpO1xuICAgIH1cbiAgXG4gICAgdGhpcy5kaXNwb3NlQ3VycmVudFNjcmVlbigpO1xuICAgIHRoaXMuZGlzcG9zZVByZXZpb3VzU2NyZWVuKCk7XG4gIFxuICAgIGZvciAobGV0IGl0ZW1JZCBpbiB0aGlzLml0ZW1zKXtcbiAgICAgIHRoaXMuaXRlbXNbaXRlbUlkXS5kaXNwb3NlKGZvcmNlRGlzcG9zZSk7XG4gIFxuICAgICAgZGVsZXRlIHRoaXMuaXRlbXNbaXRlbUlkXTtcbiAgICB9XG4gIFxuICAgIHRoaXMudHJhbnNpdGlvbiA9IG51bGw7XG4gIH1cblxuICBkaXNwb3NlUHJldmlvdXNTY3JlZW4gKCkge1xuICAgIGlmICghdGhpcy5wcmV2aW91c1NjcmVlbikgcmV0dXJuO1xuICBcbiAgICB0aGlzLmdldEl0ZW0odGhpcy5wcmV2aW91c0l0ZW1JZCkuZGlzcG9zZVNjcmVlbih0aGlzLnByZXZpb3VzU2NyZWVuKTtcbiAgXG4gICAgdGhpcy5wcmV2aW91c1NjcmVlbiA9IG51bGw7XG4gIH1cblxuICBkaXNwb3NlQ3VycmVudFNjcmVlbiAoKSB7XG4gICAgaWYgKCF0aGlzLmN1cnJlbnRTY3JlZW4pIHJldHVybjtcbiAgXG4gICAgdGhpcy5nZXRJdGVtKHRoaXMuY3VycmVudEl0ZW1JZCkuZGlzcG9zZVNjcmVlbih0aGlzLmN1cnJlbnRTY3JlZW4pO1xuICBcbiAgICB0aGlzLmN1cnJlbnRTY3JlZW4gPSBudWxsO1xuICB9XG59XG5cbiIsInZhciBTY3JlZW5OYXZpZ2F0b3JJdGVtID0gZnVuY3Rpb24oc2NyZWVuLCBvcHRpb25zKXtcbiAgdGhpcy5zY3JlZW4gPSBzY3JlZW47XG5cbiAgdGhpcy5pc0luc3RhbmNlID0gdHlwZW9mIHNjcmVlbiAhPT0gJ2Z1bmN0aW9uJztcbiAgdGhpcy5pbnRlcm5hbEluc3RhbmNlID0gbnVsbDtcblxuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdGhpcy5hcmd1bWVudHMgPSBudWxsO1xuICB0aGlzLnByb3BlcnRpZXMgPSBudWxsO1xuICB0aGlzLmNhbkRpc3Bvc2UgPSAhdGhpcy5pc0luc3RhbmNlO1xuICB0aGlzLmV2ZW50cyA9IG51bGw7XG5cbiAgdGhpcy5oYXNFdmVudHNMaXN0ZW5lcnMgPSBmYWxzZTtcblxuICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICBmb3IgKHZhciBvcHRpb25LZXkgaW4gb3B0aW9ucyl7XG4gICAgaWYgKHR5cGVvZiB0aGlzW29wdGlvbktleV0gIT09ICd1bmRlZmluZWQnKSB0aGlzW29wdGlvbktleV0gPSBvcHRpb25zW29wdGlvbktleV07XG4gIH1cbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLmdldFNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaW5zdGFuY2U7XG5cbiAgaWYgKHRoaXMuaXNJbnN0YW5jZSl7XG4gICAgaW5zdGFuY2UgPSB0aGlzLnNjcmVlbjtcbiAgfSBlbHNlIGlmICh0aGlzLmludGVybmFsSW5zdGFuY2Upe1xuICAgIGluc3RhbmNlID0gdGhpcy5pbnRlcm5hbEluc3RhbmNlO1xuICB9IGVsc2Uge1xuICAgIHZhciBhcmdzID0gdGhpcy5hcmd1bWVudHM7XG4gICAgdmFyIFNjcmVlbkNsYXNzID0gdGhpcy5zY3JlZW47XG5cbiAgICBmdW5jdGlvbiBXcmFwcGVkU2NyZWVuQ2xhc3MoKXtcbiAgICAgIFNjcmVlbkNsYXNzLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cblxuICAgIFdyYXBwZWRTY3JlZW5DbGFzcy5wcm90b3R5cGUgPSBTY3JlZW5DbGFzcy5wcm90b3R5cGU7XG5cbiAgICBpbnN0YW5jZSA9IG5ldyBXcmFwcGVkU2NyZWVuQ2xhc3MoKTtcblxuICAgIGlmICghdGhpcy5jYW5EaXNwb3NlKSB0aGlzLmludGVybmFsSW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgfVxuXG4gIGlmICh0aGlzLnByb3BlcnRpZXMpe1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLnByb3BlcnRpZXMpe1xuICAgICAgaW5zdGFuY2Vba2V5XSA9IHRoaXMucHJvcGVydGllc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLmV2ZW50cykgdGhpcy5hZGRFdmVudHNMaXN0ZW5lcnMoaW5zdGFuY2UpO1xuXG4gIHJldHVybiBpbnN0YW5jZTtcbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLmFkZEV2ZW50c0xpc3RlbmVycyA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGlmICghdGhpcy5jYW5EaXNwb3NlKXtcbiAgICBpZiAodGhpcy5oYXNFdmVudHNMaXN0ZW5lcnMpIHJldHVybjtcblxuICAgIHRoaXMuaGFzRXZlbnRzTGlzdGVuZXJzID0gdHJ1ZTtcbiAgfVxuXG4gIGZvciAodmFyIGV2ZW50TmFtZSBpbiB0aGlzLmV2ZW50cyl7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmV2ZW50c1tldmVudE5hbWVdID09PSAnZnVuY3Rpb24nKXtcbiAgICAgIGluc3RhbmNlLm9uKGV2ZW50TmFtZSwgdGhpcy5ldmVudHNbZXZlbnROYW1lXSk7XG4gICAgfVxuICB9XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5yZW1vdmVFdmVudHNMaXN0ZW5lcnMgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuICB0aGlzLmhhc0V2ZW50c0xpc3RlbmVycyA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGV2ZW50TmFtZSBpbiB0aGlzLmV2ZW50cyl7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmV2ZW50c1tldmVudE5hbWVdID09PSAnZnVuY3Rpb24nKXtcbiAgICAgIGluc3RhbmNlLm9mZihldmVudE5hbWUsIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pO1xuICAgIH1cbiAgfVxufTtcblxuU2NyZWVuTmF2aWdhdG9ySXRlbS5wcm90b3R5cGUuZGlzcG9zZVNjcmVlbiA9IGZ1bmN0aW9uKGluc3RhbmNlLCBmb3JjZURpc3Bvc2UpIHtcbiAgaWYgKHRoaXMuZXZlbnRzKSB0aGlzLnJlbW92ZUV2ZW50c0xpc3RlbmVycyhpbnN0YW5jZSk7XG5cbiAgaWYgKCFmb3JjZURpc3Bvc2UgJiYgIXRoaXMuY2FuRGlzcG9zZSkgcmV0dXJuO1xuXG4gIGlmICh0eXBlb2YgaW5zdGFuY2UuZGlzcG9zZSA9PT0gJ2Z1bmN0aW9uJykgaW5zdGFuY2UuZGlzcG9zZSgpO1xuXG4gIHRoaXMuaW50ZXJuYWxJbnN0YW5jZSA9IG51bGw7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oZm9yY2VEaXNwb3NlKSB7XG4gIGlmICh0eXBlb2YgZm9yY2VEaXNwb3NlICE9PSAnYm9vbGVhbicpIGZvcmNlRGlzcG9zZSA9IHRydWU7XG5cbiAgdmFyIGluc3RhbmNlID0gdGhpcy5pc0luc3RhbmNlID8gdGhpcy5zY3JlZW4gOiB0aGlzLmludGVybmFsSW5zdGFuY2U7XG5cbiAgaWYgKGluc3RhbmNlKXtcbiAgICB0aGlzLmRpc3Bvc2VTY3JlZW4oaW5zdGFuY2UsIGZvcmNlRGlzcG9zZSk7XG4gIH1cbiAgXG4gIHRoaXMuc2NyZWVuID0gXG4gIHRoaXMuaW50ZXJuYWxJbnN0YW5jZSA9IFxuICB0aGlzLmFyZ3VtZW50cyA9IFxuICB0aGlzLnByb3BlcnRpZXMgPSBcbiAgdGhpcy5ldmVudHMgPSBcbiAgbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2NyZWVuTmF2aWdhdG9ySXRlbTtcblxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdG5vbmU6IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMvbm9uZS5qcycpLFxuXHRvdXRBbmRJbjogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9vdXRBbmRJbi5qcycpLFxuXHRvdXRUaGVuSW46IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMvb3V0VGhlbkluLmpzJyksXG5cdGluVGhlbk91dDogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9pblRoZW5PdXQuanMnKSxcblx0aW46IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMvaW4uanMnKSxcblx0b3V0OiByZXF1aXJlKCcuL3RyYW5zaXRpb25zL291dC5qcycpXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIGNvbXBsZXRlQ2FsbGJhY2spe1xuXHRpZiAobmV3U2NyZWVuKSB7XG5cdFx0bmV3U2NyZWVuLm9uKCdhbmltYXRlSW5Db21wbGV0ZScsIG9uQW5pbUluQ29tcGxldGUpO1xuXHRcdG5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblx0fWVsc2V7XG5cdFx0b25Db21wbGV0ZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzcG9zZSgpe1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5vZmYoJ2FuaW1hdGVJbkNvbXBsZXRlJywgb25BbmltSW5Db21wbGV0ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkFuaW1JbkNvbXBsZXRlKCl7XG5cdFx0b25Db21wbGV0ZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25Db21wbGV0ZSgpe1xuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cblx0XHRkaXNwb3NlKCk7XG5cblx0XHRjb21wbGV0ZUNhbGxiYWNrKCk7XG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7XG5cdFx0ZGlzcG9zZSgpO1xuXG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblx0fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjayl7XG5cdGlmIChuZXdTY3JlZW4pIHtcblx0XHRuZXdTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgb25BbmltSW5Db21wbGV0ZSk7XG5cdFx0bmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXHR9ZWxzZXtcblx0XHRhbmltT3V0KCk7XG5cdH1cblxuXHRmdW5jdGlvbiBhbmltT3V0KCl7XG5cdFx0aWYgKG9sZFNjcmVlbil7XG5cdFx0XHRvbGRTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbU91dENvbXBsZXRlKTtcblx0XHRcdG9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRvbkNvbXBsZXRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gZGlzcG9zZSgpe1xuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbU91dENvbXBsZXRlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4ub2ZmKCdhbmltYXRlSW5Db21wbGV0ZScsIG9uQW5pbUluQ29tcGxldGUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25BbmltSW5Db21wbGV0ZSgpe1xuXHRcdGlmIChvbGRTY3JlZW4pIHtcblx0XHRcdGFuaW1PdXQoKTtcblx0XHR9ZWxzZXtcblx0XHRcdG9uQ29tcGxldGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBvbkFuaW1PdXRDb21wbGV0ZSgpe1xuXHRcdG9uQ29tcGxldGUoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQ29tcGxldGUoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRjb21wbGV0ZUNhbGxiYWNrKCk7XG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7XG5cdFx0ZGlzcG9zZSgpO1xuXG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblx0fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjayl7XG5cdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblxuXHRjb21wbGV0ZUNhbGxiYWNrKCk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCgpe307XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIGNvbXBsZXRlQ2FsbGJhY2spe1xuXHRpZiAob2xkU2NyZWVuKSB7XG5cdFx0b2xkU2NyZWVuLm9uKCdhbmltYXRlT3V0Q29tcGxldGUnLCBvbkFuaW1PdXRDb21wbGV0ZSk7XG5cdFx0b2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblx0fWVsc2V7XG5cdFx0b25Db21wbGV0ZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzcG9zZSgpe1xuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbU91dENvbXBsZXRlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQW5pbU91dENvbXBsZXRlKCl7XG5cdFx0b25Db21wbGV0ZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25Db21wbGV0ZSgpe1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblxuXHRcdGRpc3Bvc2UoKTtcblxuXHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBvbkNvbXBsZXRlKXtcblx0dmFyIGNvdW50ID0gMDtcblx0dmFyIG1heENvdW50ID0gMDtcblxuXHRpZiAob2xkU2NyZWVuKSBtYXhDb3VudCsrO1xuXHRpZiAobmV3U2NyZWVuKSBtYXhDb3VudCsrO1xuXG5cdGlmIChvbGRTY3JlZW4pIHtcblx0XHRvbGRTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbUNvbXBsZXRlKTtcblx0XHRvbGRTY3JlZW4uYW5pbWF0ZU91dCgpO1xuXHR9XG5cblx0aWYgKG5ld1NjcmVlbikge1xuXHRcdG5ld1NjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1Db21wbGV0ZSk7XG5cdFx0bmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25BbmltQ29tcGxldGUoKXtcblx0XHRjb3VudCsrO1xuXG5cdFx0aWYgKGNvdW50ID09PSBtYXhDb3VudCkgb25Db21wbGV0ZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzcG9zZSgpe1xuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbUNvbXBsZXRlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4ub2ZmKCdhbmltYXRlT3V0Q29tcGxldGUnLCBvbkFuaW1Db21wbGV0ZSk7XG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7XG5cdFx0ZGlzcG9zZSgpO1xuXG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblx0fVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKXtcblx0aWYgKG9sZFNjcmVlbikge1xuXHRcdG9sZFNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltT3V0Q29tcGxldGUpO1xuXG5cdFx0b2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblx0fWVsc2V7XG5cdFx0YW5pbUluKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkFuaW1PdXRDb21wbGV0ZSgpe1xuXHRcdGlmIChuZXdTY3JlZW4pIHtcblx0XHRcdGFuaW1JbigpO1xuXHRcdH1lbHNle1xuXHRcdFx0b25Db21wbGV0ZSgpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIG9uQW5pbUluQ29tcGxldGUoKXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBhbmltSW4oKXtcblx0XHRuZXdTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgb25BbmltSW5Db21wbGV0ZSk7XG5cblx0XHRuZXdTY3JlZW4uYW5pbWF0ZUluKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltT3V0Q29tcGxldGUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5vZmYoJ2FuaW1hdGVJbkNvbXBsZXRlJywgb25BbmltSW5Db21wbGV0ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkNvbXBsZXRlKCl7XG5cdFx0ZGlzcG9zZSgpO1xuXG5cdFx0Y29tcGxldGVDYWxsYmFjaygpO1xuXHR9XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCgpe1xuXHRcdGRpc3Bvc2UoKTtcblxuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KHRydWUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4odHJ1ZSk7XG5cdH07XG59OyJdfQ==
