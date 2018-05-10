(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
    animateInComplete: function(){
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
  navItems[i].addEventListener('click', function(event){
    event.preventDefault();

    var id = event.currentTarget.getAttribute('href').split('/')[1];
    if (id === '') id = 'home';

    // show screen
    navigator.showScreen(id);
  })
};

function onPageChange(){
  // console.log('change');
}

},{"../src/ScreenNavigator.js":10,"./pages/About.js":3,"./pages/Contact.js":4,"./pages/Home.js":5}],2:[function(require,module,exports){
var AScreen = require('../../src/AScreen.js');
var inherits = require('inherits');

var APage = function(id){
  this.element = document.getElementById(id + '-page');
};

inherits(APage, AScreen);

APage.prototype.animateIn = function(cancel) {
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

APage.prototype.animateOut = function(cancel) {
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

APage.prototype.onAnimateInComplete = function() {
	AScreen.prototype.onAnimateInComplete.call(this);
};

APage.prototype.onAnimateOutComplete = function() {
	AScreen.prototype.onAnimateOutComplete.call(this);

	this.element.classList.remove('active');
};

module.exports = APage;


},{"../../src/AScreen.js":9,"inherits":7}],3:[function(require,module,exports){
var APage = require('./APage.js');
var inherits = require('inherits');

var About = function(msg){
	console.log(msg);

	APage.call(this, 'about');
};

inherits(About, APage);

// About.prototype.animateIn = function() {
//   this.element.classList.add('active');
// };

module.exports = About;

},{"./APage.js":2,"inherits":7}],4:[function(require,module,exports){
var APage = require('./APage.js');
var inherits = require('inherits');

var Contact = function(){
  APage.call(this, 'contact');
};

inherits(Contact, APage);

// Contact.prototype.animateIn = function() {
//   this.element.classList.add('active');
// };

module.exports = Contact;

},{"./APage.js":2,"inherits":7}],5:[function(require,module,exports){
var APage = require('./APage.js');
var inherits = require('inherits');
var ScreenNavigator = require('../../src/ScreenNavigator.js');
var HomeSubPage = require('./home/HomeSubPage.js');
var Transitions = ScreenNavigator.Transitions;

var Home = function(){
  APage.call(this, 'home');

  var that = this;
  var subPagesContainer = document.querySelector('.sub-pages-container');
  var navElement = document.querySelector('.sub-pages-nav ul');

  this.navigator = new ScreenNavigator();

  this.navigator.transition = Transitions.outAndIn;

  this.navigator.on('screenChange', this.onSubPageChange.bind(this));
  
  this.navigator.on('transitionComplete', function(){
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

    navLink.addEventListener('click', function(event){
      event.preventDefault();

      var screenId = event.currentTarget.parentNode.getAttribute('data-screen-id');

      that.navigator.showScreen(screenId);
    });
  };

  this.navigator.showScreen('page0');
};

inherits(Home, APage);

Home.prototype.onSubPageChange = function() {
  var navItems = document.querySelectorAll('.sub-pages-nav li');

  for (var i = 0; i < navItems.length; i++) {
    if (navItems[i].getAttribute('data-screen-id') === this.navigator.currentItemId){
      navItems[i].classList.add('active');
    }else{
      navItems[i].classList.remove('active');
    }
  };
};

module.exports = Home;


},{"../../src/ScreenNavigator.js":10,"./APage.js":2,"./home/HomeSubPage.js":6,"inherits":7}],6:[function(require,module,exports){
var AScreen = require('../../../src/AScreen.js');
var inherits = require('inherits');

var HomeItem = function(container, index){
  this.element = document.createElement('div');

  this.element.classList.add('sub-page');
  this.element.innerHTML = 'page ' + index;

  this.element.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

  container.appendChild(this.element);
};

inherits(HomeItem, AScreen);

HomeItem.prototype.animateIn = function(cancel) {
  if (cancel){
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

HomeItem.prototype.onAnimateInComplete = function() {
  AScreen.prototype.onAnimateInComplete.call(this);
};

HomeItem.prototype.animateOut = function(cancel) {
  if (cancel){
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

HomeItem.prototype.onAnimateOutComplete = function() {
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
var TinyEmitter = require('tiny-emitter');
var inherits = require('inherits');

var AScreen = function(){
};

inherits(AScreen, TinyEmitter);

AScreen.prototype.animateIn = function(cancel) {
};

AScreen.prototype.onAnimateInComplete = function() {
  this.emit('animateInComplete');
};

AScreen.prototype.animateOut = function(cancel) {
};

AScreen.prototype.onAnimateOutComplete = function() {
  this.emit('animateOutComplete');
};

AScreen.prototype.dispose = function() {
  this.off('animateInComplete')
      .off('animateOutComplete');
};

module.exports = AScreen;
},{"inherits":7,"tiny-emitter":8}],10:[function(require,module,exports){
var TinyEmitter = require('tiny-emitter');
var inherits = require('inherits');
var ScreenNavigatorItem = require('./ScreenNavigatorItem.js');
var Transitions = require('./Transitions.js');

var ScreenNavigator = function(){
  this.items = {};

  this.currentItemId = null;
  this.previousItemId = null;

  this.currentScreen = null;
  this.previousScreen = null;

  this.transition = ScreenNavigator.defaultTransition;
  this.transitionRunning = false;
  this.transitionCancel = null;
};

inherits(ScreenNavigator, TinyEmitter);

ScreenNavigator.defaultTransition = Transitions.none;

ScreenNavigator.prototype.addItem = function(id, screen, options) {
  var item = new ScreenNavigatorItem(screen, options);

  this.items[id] = item;

  return item;
};

ScreenNavigator.prototype.getItem = function(id) {
  return this.items[id];
};

ScreenNavigator.prototype.showScreen = function(id, transition, options) {
  if (!this.getItem(id)){
    throw new Error('ScreenNavigator - the item with the id ' + id + ' doesn\'t exist');
  }

  if (this.transitionRunning){
    this.onTransitionComplete(true);
  } 

  if (this.currentScreen){
    this.previousItemId = this.currentItemId;
    this.previousScreen = this.currentScreen;
  }

  this.currentItemId = id;

  this.onScreenChange();

  this.startTransition(transition, options);
};

ScreenNavigator.prototype.clearScreen = function(transition) {
  if (!this.currentScreen){
    return;
  }

  this.previousItemId = this.currentItemId;
  this.previousScreen = this.currentScreen;

  this.currentItemId = null;

  this.onScreenChange();

  this.startTransition(transition);
};

ScreenNavigator.prototype.startTransition = function(transition, options) {
  transition = transition || this.transition;

  var currentItem = this.getItem(this.currentItemId);

  if (options) currentItem.setOptions(options);

  this.currentScreen = currentItem ? currentItem.getScreen(options) : null;

  this.transitionRunning = true;

  this.emit('transitionStart');

  this.transitionCancel = transition(this.currentScreen, this.previousScreen, this.onTransitionComplete.bind(this));
};

ScreenNavigator.prototype.onScreenChange = function() {
  this.emit('screenChange');
};

ScreenNavigator.prototype.onTransitionComplete = function(cancelTransition, silent) {
  this.transitionRunning = false;

  if (cancelTransition){
    if (this.transitionCancel) this.transitionCancel();
  }
  
  this.disposePreviousScreen();

  if (!silent){
    if (cancelTransition){
      this.emit('transitionCancel');
    }else{
      this.emit('transitionComplete');
    }
  }

  this.transitionCancel = null;
};

ScreenNavigator.prototype.dispose = function(forceDispose) {
  if (typeof forceDispose !== 'boolean') forceDispose = true;

  if (this.transitionRunning){
    this.onTransitionComplete(true, true);
  }

  this.disposeCurrentScreen();
  this.disposePreviousScreen();

  var item;

  for (var itemId in this.items){
    this.items[itemId].dispose(forceDispose);

    delete this.items[itemId];
  }

  this.transition = null;
};

ScreenNavigator.prototype.disposePreviousScreen = function() {
  if (!this.previousScreen) return;

  this.getItem(this.previousItemId).disposeScreen(this.previousScreen);

  this.previousScreen = null;
};

ScreenNavigator.prototype.disposeCurrentScreen = function() {
  if (!this.currentScreen) return;

  this.getItem(this.currentItemId).disposeScreen(this.currentScreen);

  this.currentScreen = null;
};

module.exports = ScreenNavigator;

module.exports.AScreen = require('./AScreen.js');
module.exports.ScreenNavigatorItem = ScreenNavigatorItem;
module.exports.Transitions = Transitions;


},{"./AScreen.js":9,"./ScreenNavigatorItem.js":11,"./Transitions.js":12,"inherits":7,"tiny-emitter":8}],11:[function(require,module,exports){
var ScreenNavigatorItem = function(screen, options){
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

ScreenNavigatorItem.prototype.setOptions = function(options) {
  for (var optionKey in options){
    if (typeof this[optionKey] !== 'undefined') this[optionKey] = options[optionKey];
  }
};

ScreenNavigatorItem.prototype.getScreen = function() {
  var instance;

  if (this.isInstance){
    instance = this.screen;
  } else if (this.internalInstance){
    instance = this.internalInstance;
  } else {
    var args = this.arguments;
    var ScreenClass = this.screen;

    function WrappedScreenClass(){
      ScreenClass.apply(this, args);
    }

    WrappedScreenClass.prototype = ScreenClass.prototype;

    instance = new WrappedScreenClass();

    if (!this.canDispose) this.internalInstance = instance;
  }

  if (this.properties){
    for (var key in this.properties){
      instance[key] = this.properties[key];
    }
  }

  if (this.events) this.addEventsListeners(instance);

  return instance;
};

ScreenNavigatorItem.prototype.addEventsListeners = function(instance) {
  if (!this.canDispose){
    if (this.hasEventsListeners) return;

    this.hasEventsListeners = true;
  }

  for (var eventName in this.events){
    if (typeof this.events[eventName] === 'function'){
      instance.on(eventName, this.events[eventName]);
    }
  }
};

ScreenNavigatorItem.prototype.removeEventsListeners = function(instance) {
  this.hasEventsListeners = false;

  for (var eventName in this.events){
    if (typeof this.events[eventName] === 'function'){
      instance.off(eventName, this.events[eventName]);
    }
  }
};

ScreenNavigatorItem.prototype.disposeScreen = function(instance, forceDispose) {
  if (this.events) this.removeEventsListeners(instance);

  if (!forceDispose && !this.canDispose) return;

  if (typeof instance.dispose === 'function') instance.dispose();

  this.internalInstance = null;
};

ScreenNavigatorItem.prototype.dispose = function(forceDispose) {
  if (typeof forceDispose !== 'boolean') forceDispose = true;

  var instance = this.isInstance ? this.screen : this.internalInstance;

  if (instance){
    this.disposeScreen(instance, forceDispose);
  }
  
  this.screen = 
  this.internalInstance = 
  this.arguments = 
  this.properties = 
  this.events = 
  null;
};

module.exports = ScreenNavigatorItem;


},{}],12:[function(require,module,exports){
module.exports = {
	none: require('./transitions/none.js'),
	outAndIn: require('./transitions/outAndIn.js'),
	outThenIn: require('./transitions/outThenIn.js'),
	inThenOut: require('./transitions/inThenOut.js'),
	in: require('./transitions/in.js'),
	out: require('./transitions/out.js')
};
},{"./transitions/in.js":13,"./transitions/inThenOut.js":14,"./transitions/none.js":15,"./transitions/out.js":16,"./transitions/outAndIn.js":17,"./transitions/outThenIn.js":18}],13:[function(require,module,exports){
module.exports = function(newScreen, oldScreen, completeCallback){
	if (newScreen) {
		newScreen.on('animateInComplete', onAnimInComplete);
		newScreen.animateIn();
	}else{
		onComplete();
	}

	function dispose(){
		if (newScreen) newScreen.off('animateInComplete', onAnimInComplete);
	}

	function onAnimInComplete(){
		onComplete();
	}

	function onComplete(){
		if (oldScreen) oldScreen.animateOut();

		dispose();

		completeCallback();
	}

	return function cancel(){
		dispose();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};
},{}],14:[function(require,module,exports){
module.exports = function(newScreen, oldScreen, completeCallback){
	if (newScreen) {
		newScreen.on('animateInComplete', onAnimInComplete);
		newScreen.animateIn();
	}else{
		animOut();
	}

	function animOut(){
		if (oldScreen){
			oldScreen.on('animateOutComplete', onAnimOutComplete);
			oldScreen.animateOut();
		}else{
			onComplete();
		}
	}

	function dispose(){
		if (oldScreen) oldScreen.off('animateOutComplete', onAnimOutComplete);
		if (newScreen) newScreen.off('animateInComplete', onAnimInComplete);
	}

	function onAnimInComplete(){
		if (oldScreen) {
			animOut();
		}else{
			onComplete();
		}
	}

	function onAnimOutComplete(){
		onComplete();
	}

	function onComplete(){
		dispose();

		completeCallback();
	}

	return function cancel(){
		dispose();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};
},{}],15:[function(require,module,exports){
module.exports = function(newScreen, oldScreen, completeCallback){
	if (oldScreen) oldScreen.animateOut();
	if (newScreen) newScreen.animateIn();

	completeCallback();

	return function cancel(){};
};
},{}],16:[function(require,module,exports){
module.exports = function(newScreen, oldScreen, completeCallback){
	if (oldScreen) {
		oldScreen.on('animateOutComplete', onAnimOutComplete);
		oldScreen.animateOut();
	}else{
		onComplete();
	}

	function dispose(){
		if (oldScreen) oldScreen.off('animateOutComplete', onAnimOutComplete);
	}

	function onAnimOutComplete(){
		onComplete();
	}

	function onComplete(){
		if (newScreen) newScreen.animateIn();

		dispose();

		completeCallback();
	}

	return function cancel(){
		dispose();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};
},{}],17:[function(require,module,exports){
module.exports = function(newScreen, oldScreen, onComplete){
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

	function onAnimComplete(){
		count++;

		if (count === maxCount) onComplete();
	}

	function dispose(){
		if (oldScreen) oldScreen.off('animateOutComplete', onAnimComplete);
		if (newScreen) newScreen.off('animateOutComplete', onAnimComplete);
	}

	return function cancel(){
		dispose();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	}
};
},{}],18:[function(require,module,exports){
module.exports = function(newScreen, oldScreen, completeCallback){
	if (oldScreen) {
		oldScreen.on('animateOutComplete', onAnimOutComplete);

		oldScreen.animateOut();
	}else{
		animIn();
	}

	function onAnimOutComplete(){
		if (newScreen) {
			animIn();
		}else{
			onComplete();
		}
	}

	function onAnimInComplete(){
		onComplete();
	}

	function animIn(){
		newScreen.on('animateInComplete', onAnimInComplete);

		newScreen.animateIn();
	}

	function dispose(){
		if (oldScreen) oldScreen.off('animateOutComplete', onAnimOutComplete);
		if (newScreen) newScreen.off('animateInComplete', onAnimInComplete);
	}

	function onComplete(){
		dispose();

		completeCallback();
	}

	return function cancel(){
		dispose();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL2luZGV4LmpzIiwiZXhhbXBsZS9wYWdlcy9BUGFnZS5qcyIsImV4YW1wbGUvcGFnZXMvQWJvdXQuanMiLCJleGFtcGxlL3BhZ2VzL0NvbnRhY3QuanMiLCJleGFtcGxlL3BhZ2VzL0hvbWUuanMiLCJleGFtcGxlL3BhZ2VzL2hvbWUvSG9tZVN1YlBhZ2UuanMiLCJub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy90aW55LWVtaXR0ZXIvaW5kZXguanMiLCJzcmMvQVNjcmVlbi5qcyIsInNyYy9TY3JlZW5OYXZpZ2F0b3IuanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9ySXRlbS5qcyIsInNyYy9UcmFuc2l0aW9ucy5qcyIsInNyYy90cmFuc2l0aW9ucy9pbi5qcyIsInNyYy90cmFuc2l0aW9ucy9pblRoZW5PdXQuanMiLCJzcmMvdHJhbnNpdGlvbnMvbm9uZS5qcyIsInNyYy90cmFuc2l0aW9ucy9vdXQuanMiLCJzcmMvdHJhbnNpdGlvbnMvb3V0QW5kSW4uanMiLCJzcmMvdHJhbnNpdGlvbnMvb3V0VGhlbkluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJ2YXIgU2NyZWVuTmF2aWdhdG9yID0gcmVxdWlyZSgnLi4vc3JjL1NjcmVlbk5hdmlnYXRvci5qcycpO1xudmFyIEhvbWUgPSByZXF1aXJlKCcuL3BhZ2VzL0hvbWUuanMnKTtcbnZhciBBYm91dCA9IHJlcXVpcmUoJy4vcGFnZXMvQWJvdXQuanMnKTtcbnZhciBUcmFuc2l0aW9ucyA9IHJlcXVpcmUoJy4uL3NyYy9TY3JlZW5OYXZpZ2F0b3IuanMnKS5UcmFuc2l0aW9ucztcblxudmFyIG5hdmlnYXRvciA9IG5ldyBTY3JlZW5OYXZpZ2F0b3IoKTtcblxubmF2aWdhdG9yLnRyYW5zaXRpb24gPSBUcmFuc2l0aW9ucy5vdXRUaGVuSW47XG5cbi8vIGxpc3RlbiBzY3JlZW5zIGNoYW5nZXNcbm5hdmlnYXRvci5vbignY2hhbmdlJywgb25QYWdlQ2hhbmdlKTtcblxuLy8gQUREIFNDUkVFTlNcblxuLy8gYWRkIHNjcmVlbiBpbnN0YW5jZVxubmF2aWdhdG9yLmFkZEl0ZW0oJ2hvbWUnLCBuZXcgSG9tZSgpLCB7XG4gIGV2ZW50czoge1xuICAgIGFuaW1hdGVJbkNvbXBsZXRlOiBmdW5jdGlvbigpe1xuICAgICAgY29uc29sZS5sb2coJ2FuaW1hdGVJbkNvbXBsZXRlJyk7XG4gICAgfVxuICB9XG59KTsgXG5cbi8vIGFkZCBzY3JlZW4gY2xhc3Mgd2l0aCBvcHRpb25zXG5uYXZpZ2F0b3IuYWRkSXRlbSgnYWJvdXQnLCBBYm91dCwge1xuXHRhcmd1bWVudHM6IFsnbXkgbWVzc2FnZSddLCAvLyBjb25zdHJ1Y3RvciBhcmd1bWVudHNcblx0cHJvcGVydGllczoge30sIC8vIHNldCBwcm9wZXJ0aWVzIGF0IHRoZSBzY3JlZW4gaW5pdGlhbGl6YXRpb25cblx0Y2FuRGlzcG9zZTogZmFsc2Vcbn0pOyBcblxuLy8gYWRkIHNjcmVlbiBjbGFzc1xubmF2aWdhdG9yLmFkZEl0ZW0oJ2NvbnRhY3QnLCByZXF1aXJlKCcuL3BhZ2VzL0NvbnRhY3QuanMnKSk7IFxuXG4vLyBTSE9XIEZJUlNUIFNDUkVFTlxubmF2aWdhdG9yLnNob3dTY3JlZW4oJ2hvbWUnKTtcblxudmFyIG5hdkl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbmF2IGxpIGEnKTtcblxuLy8gY2xpY2sgb24gbmF2IGxpbmtzIGZvciB0aGUgZXhhbXBsZVxuZm9yICh2YXIgaSA9IDA7IGkgPCBuYXZJdGVtcy5sZW5ndGg7IGkrKykge1xuICBuYXZJdGVtc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdmFyIGlkID0gZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zcGxpdCgnLycpWzFdO1xuICAgIGlmIChpZCA9PT0gJycpIGlkID0gJ2hvbWUnO1xuXG4gICAgLy8gc2hvdyBzY3JlZW5cbiAgICBuYXZpZ2F0b3Iuc2hvd1NjcmVlbihpZCk7XG4gIH0pXG59O1xuXG5mdW5jdGlvbiBvblBhZ2VDaGFuZ2UoKXtcbiAgLy8gY29uc29sZS5sb2coJ2NoYW5nZScpO1xufVxuIiwidmFyIEFTY3JlZW4gPSByZXF1aXJlKCcuLi8uLi9zcmMvQVNjcmVlbi5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIEFQYWdlID0gZnVuY3Rpb24oaWQpe1xuICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCArICctcGFnZScpO1xufTtcblxuaW5oZXJpdHMoQVBhZ2UsIEFTY3JlZW4pO1xuXG5BUGFnZS5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oY2FuY2VsKSB7XG5cdGlmIChjYW5jZWwpIHtcblx0XHRUd2Vlbk1heC5raWxsVHdlZW5zT2YodGhpcy5lbGVtZW50KTtcblxuXHRcdHRoaXMub25BbmltYXRlSW5Db21wbGV0ZSgpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cbiAgVHdlZW5NYXgudG8odGhpcy5lbGVtZW50LCAuNSwge1xuICBcdG9wYWNpdHk6IDEsIFxuICBcdG9uQ29tcGxldGU6IHRoaXMub25BbmltYXRlSW5Db21wbGV0ZS5iaW5kKHRoaXMpXG4gIH0pO1xuXG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbn07XG5cbkFQYWdlLnByb3RvdHlwZS5hbmltYXRlT3V0ID0gZnVuY3Rpb24oY2FuY2VsKSB7XG5cdGlmIChjYW5jZWwpIHtcblx0XHRUd2Vlbk1heC5raWxsVHdlZW5zT2YodGhpcy5lbGVtZW50KTtcblxuXHRcdHRoaXMub25BbmltYXRlT3V0Q29tcGxldGUoKTtcblxuXHRcdHJldHVybjtcblx0fVxuXG5cdFR3ZWVuTWF4LnRvKHRoaXMuZWxlbWVudCwgLjUsIHtcbiAgXHRvcGFjaXR5OiAwLCBcbiAgXHRvbkNvbXBsZXRlOiB0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlLmJpbmQodGhpcylcbiAgfSk7XG59O1xuXG5BUGFnZS5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuXHRBU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlLmNhbGwodGhpcyk7XG59O1xuXG5BUGFnZS5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUgPSBmdW5jdGlvbigpIHtcblx0QVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUuY2FsbCh0aGlzKTtcblxuXHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFQYWdlO1xuXG4iLCJ2YXIgQVBhZ2UgPSByZXF1aXJlKCcuL0FQYWdlLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQWJvdXQgPSBmdW5jdGlvbihtc2cpe1xuXHRjb25zb2xlLmxvZyhtc2cpO1xuXG5cdEFQYWdlLmNhbGwodGhpcywgJ2Fib3V0Jyk7XG59O1xuXG5pbmhlcml0cyhBYm91dCwgQVBhZ2UpO1xuXG4vLyBBYm91dC5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oKSB7XG4vLyAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbi8vIH07XG5cbm1vZHVsZS5leHBvcnRzID0gQWJvdXQ7XG4iLCJ2YXIgQVBhZ2UgPSByZXF1aXJlKCcuL0FQYWdlLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQ29udGFjdCA9IGZ1bmN0aW9uKCl7XG4gIEFQYWdlLmNhbGwodGhpcywgJ2NvbnRhY3QnKTtcbn07XG5cbmluaGVyaXRzKENvbnRhY3QsIEFQYWdlKTtcblxuLy8gQ29udGFjdC5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oKSB7XG4vLyAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbi8vIH07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGFjdDtcbiIsInZhciBBUGFnZSA9IHJlcXVpcmUoJy4vQVBhZ2UuanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG52YXIgU2NyZWVuTmF2aWdhdG9yID0gcmVxdWlyZSgnLi4vLi4vc3JjL1NjcmVlbk5hdmlnYXRvci5qcycpO1xudmFyIEhvbWVTdWJQYWdlID0gcmVxdWlyZSgnLi9ob21lL0hvbWVTdWJQYWdlLmpzJyk7XG52YXIgVHJhbnNpdGlvbnMgPSBTY3JlZW5OYXZpZ2F0b3IuVHJhbnNpdGlvbnM7XG5cbnZhciBIb21lID0gZnVuY3Rpb24oKXtcbiAgQVBhZ2UuY2FsbCh0aGlzLCAnaG9tZScpO1xuXG4gIHZhciB0aGF0ID0gdGhpcztcbiAgdmFyIHN1YlBhZ2VzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN1Yi1wYWdlcy1jb250YWluZXInKTtcbiAgdmFyIG5hdkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3ViLXBhZ2VzLW5hdiB1bCcpO1xuXG4gIHRoaXMubmF2aWdhdG9yID0gbmV3IFNjcmVlbk5hdmlnYXRvcigpO1xuXG4gIHRoaXMubmF2aWdhdG9yLnRyYW5zaXRpb24gPSBUcmFuc2l0aW9ucy5vdXRBbmRJbjtcblxuICB0aGlzLm5hdmlnYXRvci5vbignc2NyZWVuQ2hhbmdlJywgdGhpcy5vblN1YlBhZ2VDaGFuZ2UuYmluZCh0aGlzKSk7XG4gIFxuICB0aGlzLm5hdmlnYXRvci5vbigndHJhbnNpdGlvbkNvbXBsZXRlJywgZnVuY3Rpb24oKXtcbiAgICAvLyBjb25zb2xlLmxvZygndHJhbnNpdGlvbiBjb21wbGV0ZScpO1xuICB9KTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgIHRoaXMubmF2aWdhdG9yLmFkZEl0ZW0oJ3BhZ2UnICsgaSwgbmV3IEhvbWVTdWJQYWdlKHN1YlBhZ2VzQ29udGFpbmVyLCBpKSk7XG5cbiAgICB2YXIgbmF2SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgbmF2SXRlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2NyZWVuLWlkJywgJ3BhZ2UnICsgaSk7XG4gICAgbmF2RWxlbWVudC5hcHBlbmRDaGlsZChuYXZJdGVtKTtcblxuICAgIHZhciBuYXZMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIG5hdkxpbmsuaHJlZiA9ICcjcGFnZScgKyBpO1xuICAgIG5hdkl0ZW0uYXBwZW5kQ2hpbGQobmF2TGluayk7XG5cbiAgICBuYXZMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdmFyIHNjcmVlbklkID0gZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1zY3JlZW4taWQnKTtcblxuICAgICAgdGhhdC5uYXZpZ2F0b3Iuc2hvd1NjcmVlbihzY3JlZW5JZCk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5uYXZpZ2F0b3Iuc2hvd1NjcmVlbigncGFnZTAnKTtcbn07XG5cbmluaGVyaXRzKEhvbWUsIEFQYWdlKTtcblxuSG9tZS5wcm90b3R5cGUub25TdWJQYWdlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBuYXZJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdWItcGFnZXMtbmF2IGxpJyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXZJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChuYXZJdGVtc1tpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2NyZWVuLWlkJykgPT09IHRoaXMubmF2aWdhdG9yLmN1cnJlbnRJdGVtSWQpe1xuICAgICAgbmF2SXRlbXNbaV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfWVsc2V7XG4gICAgICBuYXZJdGVtc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWU7XG5cbiIsInZhciBBU2NyZWVuID0gcmVxdWlyZSgnLi4vLi4vLi4vc3JjL0FTY3JlZW4uanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBIb21lSXRlbSA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgaW5kZXgpe1xuICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc3ViLXBhZ2UnKTtcbiAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9ICdwYWdlICcgKyBpbmRleDtcblxuICB0aGlzLmVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyMnICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTY3NzcyMTUpLnRvU3RyaW5nKDE2KTtcblxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcbn07XG5cbmluaGVyaXRzKEhvbWVJdGVtLCBBU2NyZWVuKTtcblxuSG9tZUl0ZW0ucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKGNhbmNlbCkge1xuICBpZiAoY2FuY2VsKXtcbiAgICBUd2Vlbk1heC5raWxsVHdlZW5zT2YodGhpcy5lbGVtZW50KTtcblxuICAgIHRoaXMub25BbmltYXRlSW5Db21wbGV0ZSgpO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgVHdlZW5NYXguZnJvbVRvKHRoaXMuZWxlbWVudCwgMSwge1xuICAgIHhQZXJjZW50OiAxMDBcbiAgfSwge1xuICAgIHhQZXJjZW50OiAwLFxuICAgIG9uQ29tcGxldGU6IHRoaXMub25BbmltYXRlSW5Db21wbGV0ZS5iaW5kKHRoaXMpLFxuICAgIGVhc2U6IEV4cG8uZWFzZU91dFxuICB9KTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG59O1xuXG5Ib21lSXRlbS5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICBBU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlLmNhbGwodGhpcyk7XG59O1xuXG5Ib21lSXRlbS5wcm90b3R5cGUuYW5pbWF0ZU91dCA9IGZ1bmN0aW9uKGNhbmNlbCkge1xuICBpZiAoY2FuY2VsKXtcbiAgICBUd2Vlbk1heC5raWxsVHdlZW5zT2YodGhpcy5lbGVtZW50KTtcblxuICAgIHRoaXMub25BbmltYXRlT3V0Q29tcGxldGUoKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIFR3ZWVuTWF4LnRvKHRoaXMuZWxlbWVudCwgMSwge1xuICAgIHhQZXJjZW50OiAtMTAwLFxuICAgIG9uQ29tcGxldGU6IHRoaXMub25BbmltYXRlT3V0Q29tcGxldGUuYmluZCh0aGlzKSxcbiAgICBlYXNlOiBFeHBvLmVhc2VPdXRcbiAgfSk7XG59O1xuXG5Ib21lSXRlbS5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUuY2FsbCh0aGlzKTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWVJdGVtO1xuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCJmdW5jdGlvbiBFICgpIHtcbiAgLy8gS2VlcCB0aGlzIGVtcHR5IHNvIGl0J3MgZWFzaWVyIHRvIGluaGVyaXQgZnJvbVxuICAvLyAodmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9saXBzbWFjayBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvaXNzdWVzLzMpXG59XG5cbkUucHJvdG90eXBlID0ge1xuICBvbjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuXG4gICAgKGVbbmFtZV0gfHwgKGVbbmFtZV0gPSBbXSkpLnB1c2goe1xuICAgICAgZm46IGNhbGxiYWNrLFxuICAgICAgY3R4OiBjdHhcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9uY2U6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGZ1bmN0aW9uIGxpc3RlbmVyICgpIHtcbiAgICAgIHNlbGYub2ZmKG5hbWUsIGxpc3RlbmVyKTtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGN0eCwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgbGlzdGVuZXIuXyA9IGNhbGxiYWNrXG4gICAgcmV0dXJuIHRoaXMub24obmFtZSwgbGlzdGVuZXIsIGN0eCk7XG4gIH0sXG5cbiAgZW1pdDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgZGF0YSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgZXZ0QXJyID0gKCh0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KSlbbmFtZV0gfHwgW10pLnNsaWNlKCk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBsZW4gPSBldnRBcnIubGVuZ3RoO1xuXG4gICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGV2dEFycltpXS5mbi5hcHBseShldnRBcnJbaV0uY3R4LCBkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvZmY6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG4gICAgdmFyIGV2dHMgPSBlW25hbWVdO1xuICAgIHZhciBsaXZlRXZlbnRzID0gW107XG5cbiAgICBpZiAoZXZ0cyAmJiBjYWxsYmFjaykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV2dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGV2dHNbaV0uZm4gIT09IGNhbGxiYWNrICYmIGV2dHNbaV0uZm4uXyAhPT0gY2FsbGJhY2spXG4gICAgICAgICAgbGl2ZUV2ZW50cy5wdXNoKGV2dHNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBldmVudCBmcm9tIHF1ZXVlIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtcbiAgICAvLyBTdWdnZXN0ZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2xhemRcbiAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvY29tbWl0L2M2ZWJmYWE5YmM5NzNiMzNkMTEwYTg0YTMwNzc0MmI3Y2Y5NGM5NTMjY29tbWl0Y29tbWVudC01MDI0OTEwXG5cbiAgICAobGl2ZUV2ZW50cy5sZW5ndGgpXG4gICAgICA/IGVbbmFtZV0gPSBsaXZlRXZlbnRzXG4gICAgICA6IGRlbGV0ZSBlW25hbWVdO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRTtcbiIsInZhciBUaW55RW1pdHRlciA9IHJlcXVpcmUoJ3RpbnktZW1pdHRlcicpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIEFTY3JlZW4gPSBmdW5jdGlvbigpe1xufTtcblxuaW5oZXJpdHMoQVNjcmVlbiwgVGlueUVtaXR0ZXIpO1xuXG5BU2NyZWVuLnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbihjYW5jZWwpIHtcbn07XG5cbkFTY3JlZW4ucHJvdG90eXBlLm9uQW5pbWF0ZUluQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbWl0KCdhbmltYXRlSW5Db21wbGV0ZScpO1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUuYW5pbWF0ZU91dCA9IGZ1bmN0aW9uKGNhbmNlbCkge1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbWl0KCdhbmltYXRlT3V0Q29tcGxldGUnKTtcbn07XG5cbkFTY3JlZW4ucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5vZmYoJ2FuaW1hdGVJbkNvbXBsZXRlJylcbiAgICAgIC5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBU2NyZWVuOyIsInZhciBUaW55RW1pdHRlciA9IHJlcXVpcmUoJ3RpbnktZW1pdHRlcicpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbnZhciBTY3JlZW5OYXZpZ2F0b3JJdGVtID0gcmVxdWlyZSgnLi9TY3JlZW5OYXZpZ2F0b3JJdGVtLmpzJyk7XG52YXIgVHJhbnNpdGlvbnMgPSByZXF1aXJlKCcuL1RyYW5zaXRpb25zLmpzJyk7XG5cbnZhciBTY3JlZW5OYXZpZ2F0b3IgPSBmdW5jdGlvbigpe1xuICB0aGlzLml0ZW1zID0ge307XG5cbiAgdGhpcy5jdXJyZW50SXRlbUlkID0gbnVsbDtcbiAgdGhpcy5wcmV2aW91c0l0ZW1JZCA9IG51bGw7XG5cbiAgdGhpcy5jdXJyZW50U2NyZWVuID0gbnVsbDtcbiAgdGhpcy5wcmV2aW91c1NjcmVlbiA9IG51bGw7XG5cbiAgdGhpcy50cmFuc2l0aW9uID0gU2NyZWVuTmF2aWdhdG9yLmRlZmF1bHRUcmFuc2l0aW9uO1xuICB0aGlzLnRyYW5zaXRpb25SdW5uaW5nID0gZmFsc2U7XG4gIHRoaXMudHJhbnNpdGlvbkNhbmNlbCA9IG51bGw7XG59O1xuXG5pbmhlcml0cyhTY3JlZW5OYXZpZ2F0b3IsIFRpbnlFbWl0dGVyKTtcblxuU2NyZWVuTmF2aWdhdG9yLmRlZmF1bHRUcmFuc2l0aW9uID0gVHJhbnNpdGlvbnMubm9uZTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5hZGRJdGVtID0gZnVuY3Rpb24oaWQsIHNjcmVlbiwgb3B0aW9ucykge1xuICB2YXIgaXRlbSA9IG5ldyBTY3JlZW5OYXZpZ2F0b3JJdGVtKHNjcmVlbiwgb3B0aW9ucyk7XG5cbiAgdGhpcy5pdGVtc1tpZF0gPSBpdGVtO1xuXG4gIHJldHVybiBpdGVtO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5nZXRJdGVtID0gZnVuY3Rpb24oaWQpIHtcbiAgcmV0dXJuIHRoaXMuaXRlbXNbaWRdO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5zaG93U2NyZWVuID0gZnVuY3Rpb24oaWQsIHRyYW5zaXRpb24sIG9wdGlvbnMpIHtcbiAgaWYgKCF0aGlzLmdldEl0ZW0oaWQpKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NjcmVlbk5hdmlnYXRvciAtIHRoZSBpdGVtIHdpdGggdGhlIGlkICcgKyBpZCArICcgZG9lc25cXCd0IGV4aXN0Jyk7XG4gIH1cblxuICBpZiAodGhpcy50cmFuc2l0aW9uUnVubmluZyl7XG4gICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSh0cnVlKTtcbiAgfSBcblxuICBpZiAodGhpcy5jdXJyZW50U2NyZWVuKXtcbiAgICB0aGlzLnByZXZpb3VzSXRlbUlkID0gdGhpcy5jdXJyZW50SXRlbUlkO1xuICAgIHRoaXMucHJldmlvdXNTY3JlZW4gPSB0aGlzLmN1cnJlbnRTY3JlZW47XG4gIH1cblxuICB0aGlzLmN1cnJlbnRJdGVtSWQgPSBpZDtcblxuICB0aGlzLm9uU2NyZWVuQ2hhbmdlKCk7XG5cbiAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvbiwgb3B0aW9ucyk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmNsZWFyU2NyZWVuID0gZnVuY3Rpb24odHJhbnNpdGlvbikge1xuICBpZiAoIXRoaXMuY3VycmVudFNjcmVlbil7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5wcmV2aW91c0l0ZW1JZCA9IHRoaXMuY3VycmVudEl0ZW1JZDtcbiAgdGhpcy5wcmV2aW91c1NjcmVlbiA9IHRoaXMuY3VycmVudFNjcmVlbjtcblxuICB0aGlzLmN1cnJlbnRJdGVtSWQgPSBudWxsO1xuXG4gIHRoaXMub25TY3JlZW5DaGFuZ2UoKTtcblxuICB0aGlzLnN0YXJ0VHJhbnNpdGlvbih0cmFuc2l0aW9uKTtcbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuc3RhcnRUcmFuc2l0aW9uID0gZnVuY3Rpb24odHJhbnNpdGlvbiwgb3B0aW9ucykge1xuICB0cmFuc2l0aW9uID0gdHJhbnNpdGlvbiB8fCB0aGlzLnRyYW5zaXRpb247XG5cbiAgdmFyIGN1cnJlbnRJdGVtID0gdGhpcy5nZXRJdGVtKHRoaXMuY3VycmVudEl0ZW1JZCk7XG5cbiAgaWYgKG9wdGlvbnMpIGN1cnJlbnRJdGVtLnNldE9wdGlvbnMob3B0aW9ucyk7XG5cbiAgdGhpcy5jdXJyZW50U2NyZWVuID0gY3VycmVudEl0ZW0gPyBjdXJyZW50SXRlbS5nZXRTY3JlZW4ob3B0aW9ucykgOiBudWxsO1xuXG4gIHRoaXMudHJhbnNpdGlvblJ1bm5pbmcgPSB0cnVlO1xuXG4gIHRoaXMuZW1pdCgndHJhbnNpdGlvblN0YXJ0Jyk7XG5cbiAgdGhpcy50cmFuc2l0aW9uQ2FuY2VsID0gdHJhbnNpdGlvbih0aGlzLmN1cnJlbnRTY3JlZW4sIHRoaXMucHJldmlvdXNTY3JlZW4sIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUuYmluZCh0aGlzKSk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLm9uU2NyZWVuQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgnc2NyZWVuQ2hhbmdlJyk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLm9uVHJhbnNpdGlvbkNvbXBsZXRlID0gZnVuY3Rpb24oY2FuY2VsVHJhbnNpdGlvbiwgc2lsZW50KSB7XG4gIHRoaXMudHJhbnNpdGlvblJ1bm5pbmcgPSBmYWxzZTtcblxuICBpZiAoY2FuY2VsVHJhbnNpdGlvbil7XG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbkNhbmNlbCkgdGhpcy50cmFuc2l0aW9uQ2FuY2VsKCk7XG4gIH1cbiAgXG4gIHRoaXMuZGlzcG9zZVByZXZpb3VzU2NyZWVuKCk7XG5cbiAgaWYgKCFzaWxlbnQpe1xuICAgIGlmIChjYW5jZWxUcmFuc2l0aW9uKXtcbiAgICAgIHRoaXMuZW1pdCgndHJhbnNpdGlvbkNhbmNlbCcpO1xuICAgIH1lbHNle1xuICAgICAgdGhpcy5lbWl0KCd0cmFuc2l0aW9uQ29tcGxldGUnKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLnRyYW5zaXRpb25DYW5jZWwgPSBudWxsO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oZm9yY2VEaXNwb3NlKSB7XG4gIGlmICh0eXBlb2YgZm9yY2VEaXNwb3NlICE9PSAnYm9vbGVhbicpIGZvcmNlRGlzcG9zZSA9IHRydWU7XG5cbiAgaWYgKHRoaXMudHJhbnNpdGlvblJ1bm5pbmcpe1xuICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUodHJ1ZSwgdHJ1ZSk7XG4gIH1cblxuICB0aGlzLmRpc3Bvc2VDdXJyZW50U2NyZWVuKCk7XG4gIHRoaXMuZGlzcG9zZVByZXZpb3VzU2NyZWVuKCk7XG5cbiAgdmFyIGl0ZW07XG5cbiAgZm9yICh2YXIgaXRlbUlkIGluIHRoaXMuaXRlbXMpe1xuICAgIHRoaXMuaXRlbXNbaXRlbUlkXS5kaXNwb3NlKGZvcmNlRGlzcG9zZSk7XG5cbiAgICBkZWxldGUgdGhpcy5pdGVtc1tpdGVtSWRdO1xuICB9XG5cbiAgdGhpcy50cmFuc2l0aW9uID0gbnVsbDtcbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuZGlzcG9zZVByZXZpb3VzU2NyZWVuID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5wcmV2aW91c1NjcmVlbikgcmV0dXJuO1xuXG4gIHRoaXMuZ2V0SXRlbSh0aGlzLnByZXZpb3VzSXRlbUlkKS5kaXNwb3NlU2NyZWVuKHRoaXMucHJldmlvdXNTY3JlZW4pO1xuXG4gIHRoaXMucHJldmlvdXNTY3JlZW4gPSBudWxsO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5kaXNwb3NlQ3VycmVudFNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuY3VycmVudFNjcmVlbikgcmV0dXJuO1xuXG4gIHRoaXMuZ2V0SXRlbSh0aGlzLmN1cnJlbnRJdGVtSWQpLmRpc3Bvc2VTY3JlZW4odGhpcy5jdXJyZW50U2NyZWVuKTtcblxuICB0aGlzLmN1cnJlbnRTY3JlZW4gPSBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY3JlZW5OYXZpZ2F0b3I7XG5cbm1vZHVsZS5leHBvcnRzLkFTY3JlZW4gPSByZXF1aXJlKCcuL0FTY3JlZW4uanMnKTtcbm1vZHVsZS5leHBvcnRzLlNjcmVlbk5hdmlnYXRvckl0ZW0gPSBTY3JlZW5OYXZpZ2F0b3JJdGVtO1xubW9kdWxlLmV4cG9ydHMuVHJhbnNpdGlvbnMgPSBUcmFuc2l0aW9ucztcblxuIiwidmFyIFNjcmVlbk5hdmlnYXRvckl0ZW0gPSBmdW5jdGlvbihzY3JlZW4sIG9wdGlvbnMpe1xuICB0aGlzLnNjcmVlbiA9IHNjcmVlbjtcblxuICB0aGlzLmlzSW5zdGFuY2UgPSB0eXBlb2Ygc2NyZWVuICE9PSAnZnVuY3Rpb24nO1xuICB0aGlzLmludGVybmFsSW5zdGFuY2UgPSBudWxsO1xuXG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB0aGlzLmFyZ3VtZW50cyA9IG51bGw7XG4gIHRoaXMucHJvcGVydGllcyA9IG51bGw7XG4gIHRoaXMuY2FuRGlzcG9zZSA9ICF0aGlzLmlzSW5zdGFuY2U7XG4gIHRoaXMuZXZlbnRzID0gbnVsbDtcblxuICB0aGlzLmhhc0V2ZW50c0xpc3RlbmVycyA9IGZhbHNlO1xuXG4gIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIGZvciAodmFyIG9wdGlvbktleSBpbiBvcHRpb25zKXtcbiAgICBpZiAodHlwZW9mIHRoaXNbb3B0aW9uS2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHRoaXNbb3B0aW9uS2V5XSA9IG9wdGlvbnNbb3B0aW9uS2V5XTtcbiAgfVxufTtcblxuU2NyZWVuTmF2aWdhdG9ySXRlbS5wcm90b3R5cGUuZ2V0U2NyZWVuID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpbnN0YW5jZTtcblxuICBpZiAodGhpcy5pc0luc3RhbmNlKXtcbiAgICBpbnN0YW5jZSA9IHRoaXMuc2NyZWVuO1xuICB9IGVsc2UgaWYgKHRoaXMuaW50ZXJuYWxJbnN0YW5jZSl7XG4gICAgaW5zdGFuY2UgPSB0aGlzLmludGVybmFsSW5zdGFuY2U7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGFyZ3MgPSB0aGlzLmFyZ3VtZW50cztcbiAgICB2YXIgU2NyZWVuQ2xhc3MgPSB0aGlzLnNjcmVlbjtcblxuICAgIGZ1bmN0aW9uIFdyYXBwZWRTY3JlZW5DbGFzcygpe1xuICAgICAgU2NyZWVuQ2xhc3MuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuXG4gICAgV3JhcHBlZFNjcmVlbkNsYXNzLnByb3RvdHlwZSA9IFNjcmVlbkNsYXNzLnByb3RvdHlwZTtcblxuICAgIGluc3RhbmNlID0gbmV3IFdyYXBwZWRTY3JlZW5DbGFzcygpO1xuXG4gICAgaWYgKCF0aGlzLmNhbkRpc3Bvc2UpIHRoaXMuaW50ZXJuYWxJbnN0YW5jZSA9IGluc3RhbmNlO1xuICB9XG5cbiAgaWYgKHRoaXMucHJvcGVydGllcyl7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMucHJvcGVydGllcyl7XG4gICAgICBpbnN0YW5jZVtrZXldID0gdGhpcy5wcm9wZXJ0aWVzW2tleV07XG4gICAgfVxuICB9XG5cbiAgaWYgKHRoaXMuZXZlbnRzKSB0aGlzLmFkZEV2ZW50c0xpc3RlbmVycyhpbnN0YW5jZSk7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufTtcblxuU2NyZWVuTmF2aWdhdG9ySXRlbS5wcm90b3R5cGUuYWRkRXZlbnRzTGlzdGVuZXJzID0gZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaWYgKCF0aGlzLmNhbkRpc3Bvc2Upe1xuICAgIGlmICh0aGlzLmhhc0V2ZW50c0xpc3RlbmVycykgcmV0dXJuO1xuXG4gICAgdGhpcy5oYXNFdmVudHNMaXN0ZW5lcnMgPSB0cnVlO1xuICB9XG5cbiAgZm9yICh2YXIgZXZlbnROYW1lIGluIHRoaXMuZXZlbnRzKXtcbiAgICBpZiAodHlwZW9mIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPT09ICdmdW5jdGlvbicpe1xuICAgICAgaW5zdGFuY2Uub24oZXZlbnROYW1lLCB0aGlzLmV2ZW50c1tldmVudE5hbWVdKTtcbiAgICB9XG4gIH1cbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLnJlbW92ZUV2ZW50c0xpc3RlbmVycyA9IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIHRoaXMuaGFzRXZlbnRzTGlzdGVuZXJzID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgZXZlbnROYW1lIGluIHRoaXMuZXZlbnRzKXtcbiAgICBpZiAodHlwZW9mIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPT09ICdmdW5jdGlvbicpe1xuICAgICAgaW5zdGFuY2Uub2ZmKGV2ZW50TmFtZSwgdGhpcy5ldmVudHNbZXZlbnROYW1lXSk7XG4gICAgfVxuICB9XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5kaXNwb3NlU2NyZWVuID0gZnVuY3Rpb24oaW5zdGFuY2UsIGZvcmNlRGlzcG9zZSkge1xuICBpZiAodGhpcy5ldmVudHMpIHRoaXMucmVtb3ZlRXZlbnRzTGlzdGVuZXJzKGluc3RhbmNlKTtcblxuICBpZiAoIWZvcmNlRGlzcG9zZSAmJiAhdGhpcy5jYW5EaXNwb3NlKSByZXR1cm47XG5cbiAgaWYgKHR5cGVvZiBpbnN0YW5jZS5kaXNwb3NlID09PSAnZnVuY3Rpb24nKSBpbnN0YW5jZS5kaXNwb3NlKCk7XG5cbiAgdGhpcy5pbnRlcm5hbEluc3RhbmNlID0gbnVsbDtcbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbihmb3JjZURpc3Bvc2UpIHtcbiAgaWYgKHR5cGVvZiBmb3JjZURpc3Bvc2UgIT09ICdib29sZWFuJykgZm9yY2VEaXNwb3NlID0gdHJ1ZTtcblxuICB2YXIgaW5zdGFuY2UgPSB0aGlzLmlzSW5zdGFuY2UgPyB0aGlzLnNjcmVlbiA6IHRoaXMuaW50ZXJuYWxJbnN0YW5jZTtcblxuICBpZiAoaW5zdGFuY2Upe1xuICAgIHRoaXMuZGlzcG9zZVNjcmVlbihpbnN0YW5jZSwgZm9yY2VEaXNwb3NlKTtcbiAgfVxuICBcbiAgdGhpcy5zY3JlZW4gPSBcbiAgdGhpcy5pbnRlcm5hbEluc3RhbmNlID0gXG4gIHRoaXMuYXJndW1lbnRzID0gXG4gIHRoaXMucHJvcGVydGllcyA9IFxuICB0aGlzLmV2ZW50cyA9IFxuICBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY3JlZW5OYXZpZ2F0b3JJdGVtO1xuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0bm9uZTogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9ub25lLmpzJyksXG5cdG91dEFuZEluOiByZXF1aXJlKCcuL3RyYW5zaXRpb25zL291dEFuZEluLmpzJyksXG5cdG91dFRoZW5JbjogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9vdXRUaGVuSW4uanMnKSxcblx0aW5UaGVuT3V0OiByZXF1aXJlKCcuL3RyYW5zaXRpb25zL2luVGhlbk91dC5qcycpLFxuXHRpbjogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9pbi5qcycpLFxuXHRvdXQ6IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMvb3V0LmpzJylcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjayl7XG5cdGlmIChuZXdTY3JlZW4pIHtcblx0XHRuZXdTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgb25BbmltSW5Db21wbGV0ZSk7XG5cdFx0bmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXHR9ZWxzZXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLm9mZignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1JbkNvbXBsZXRlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQW5pbUluQ29tcGxldGUoKXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkNvbXBsZXRlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblxuXHRcdGRpc3Bvc2UoKTtcblxuXHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKXtcblx0aWYgKG5ld1NjcmVlbikge1xuXHRcdG5ld1NjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1JbkNvbXBsZXRlKTtcblx0XHRuZXdTY3JlZW4uYW5pbWF0ZUluKCk7XG5cdH1lbHNle1xuXHRcdGFuaW1PdXQoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFuaW1PdXQoKXtcblx0XHRpZiAob2xkU2NyZWVuKXtcblx0XHRcdG9sZFNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltT3V0Q29tcGxldGUpO1xuXHRcdFx0b2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblx0XHR9ZWxzZXtcblx0XHRcdG9uQ29tcGxldGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltT3V0Q29tcGxldGUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5vZmYoJ2FuaW1hdGVJbkNvbXBsZXRlJywgb25BbmltSW5Db21wbGV0ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkFuaW1JbkNvbXBsZXRlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikge1xuXHRcdFx0YW5pbU91dCgpO1xuXHRcdH1lbHNle1xuXHRcdFx0b25Db21wbGV0ZSgpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIG9uQW5pbU91dENvbXBsZXRlKCl7XG5cdFx0b25Db21wbGV0ZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25Db21wbGV0ZSgpe1xuXHRcdGRpc3Bvc2UoKTtcblxuXHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKXtcblx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXG5cdGNvbXBsZXRlQ2FsbGJhY2soKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjayl7XG5cdGlmIChvbGRTY3JlZW4pIHtcblx0XHRvbGRTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbU91dENvbXBsZXRlKTtcblx0XHRvbGRTY3JlZW4uYW5pbWF0ZU91dCgpO1xuXHR9ZWxzZXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltT3V0Q29tcGxldGUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25BbmltT3V0Q29tcGxldGUoKXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkNvbXBsZXRlKCl7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXG5cdFx0ZGlzcG9zZSgpO1xuXG5cdFx0Y29tcGxldGVDYWxsYmFjaygpO1xuXHR9XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCgpe1xuXHRcdGRpc3Bvc2UoKTtcblxuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KHRydWUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4odHJ1ZSk7XG5cdH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIG9uQ29tcGxldGUpe1xuXHR2YXIgY291bnQgPSAwO1xuXHR2YXIgbWF4Q291bnQgPSAwO1xuXG5cdGlmIChvbGRTY3JlZW4pIG1heENvdW50Kys7XG5cdGlmIChuZXdTY3JlZW4pIG1heENvdW50Kys7XG5cblx0aWYgKG9sZFNjcmVlbikge1xuXHRcdG9sZFNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltQ29tcGxldGUpO1xuXHRcdG9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cdH1cblxuXHRpZiAobmV3U2NyZWVuKSB7XG5cdFx0bmV3U2NyZWVuLm9uKCdhbmltYXRlSW5Db21wbGV0ZScsIG9uQW5pbUNvbXBsZXRlKTtcblx0XHRuZXdTY3JlZW4uYW5pbWF0ZUluKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkFuaW1Db21wbGV0ZSgpe1xuXHRcdGNvdW50Kys7XG5cblx0XHRpZiAoY291bnQgPT09IG1heENvdW50KSBvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltQ29tcGxldGUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbUNvbXBsZXRlKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIGNvbXBsZXRlQ2FsbGJhY2spe1xuXHRpZiAob2xkU2NyZWVuKSB7XG5cdFx0b2xkU2NyZWVuLm9uKCdhbmltYXRlT3V0Q29tcGxldGUnLCBvbkFuaW1PdXRDb21wbGV0ZSk7XG5cblx0XHRvbGRTY3JlZW4uYW5pbWF0ZU91dCgpO1xuXHR9ZWxzZXtcblx0XHRhbmltSW4oKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQW5pbU91dENvbXBsZXRlKCl7XG5cdFx0aWYgKG5ld1NjcmVlbikge1xuXHRcdFx0YW5pbUluKCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRvbkNvbXBsZXRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gb25BbmltSW5Db21wbGV0ZSgpe1xuXHRcdG9uQ29tcGxldGUoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFuaW1Jbigpe1xuXHRcdG5ld1NjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1JbkNvbXBsZXRlKTtcblxuXHRcdG5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRpc3Bvc2UoKXtcblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4ub2ZmKCdhbmltYXRlT3V0Q29tcGxldGUnLCBvbkFuaW1PdXRDb21wbGV0ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLm9mZignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1JbkNvbXBsZXRlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQ29tcGxldGUoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRjb21wbGV0ZUNhbGxiYWNrKCk7XG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7XG5cdFx0ZGlzcG9zZSgpO1xuXG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblx0fTtcbn07Il19
