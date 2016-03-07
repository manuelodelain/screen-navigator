(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ScreenNavigator = require('../src/ScreenNavigator.js');
var Home = require('./pages/Home.js');
var About = require('./pages/About.js');
var Transitions = require('../src/ScreenNavigator.js').Transitions;

var navigator = new ScreenNavigator();

navigator.transition = Transitions.outThenIn;

// listen screens changes
navigator.on('change', onPageChange);

// ADD SCREENS
// 
// add screen instance
navigator.addItem('home', new Home(), {
  events: {
    animateInComplete: function(){
      console.log('animateInComplete');
    }
  }
}); 
// 
// add screen class with options
navigator.addItem('about', About, {
	arguments: ['my message'], // constructor arguments
	properties: {}, // set properties at the screen initialization
	canDispose: false
}); 
// 
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
    var fn = function () {
      self.off(name, fn);
      callback.apply(ctx, arguments);
    };
    
    return this.on(name, fn, ctx);
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
        if (evts[i].fn !== callback) liveEvents.push(evts[i]);
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
  this.prevItemId = null;

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
  if (id === this.currentItemId) return;

  var currentItem = this.getItem(id);

  if (!currentItem){
    throw new Error('ScreenNavigator - the item with the id ' + id + ' doesn\'t exist');
  }

  if (this.transitionRunning){
    this.onTransitionComplete(true);
  } 

  if (this.currentItemId){
    this.prevItemId = this.currentItemId;
  }

  this.currentItemId = id;

  this.onScreenChange();

  this.startTransition(transition, options);
};

ScreenNavigator.prototype.clearScreen = function(transition) {
  if (!this.currentScreen){
    return;
  }

  this.prevScreenId = this.currentScreenId;
  this.currentScreenId = null;

  this.onScreenChange();

  this.startTransition(transition);
};

ScreenNavigator.prototype.startTransition = function(transition, options) {
  transition = transition || this.transition;

  var prevItem = this.getItem(this.prevItemId);
  var currentItem = this.getItem(this.currentItemId);

  if (options) currentItem.setOptions(options);

  var currentScreen = currentItem ? currentItem.getScreen(options) : null;
  var prevScreen = prevItem ? prevItem.getScreen() : null;

  this.transitionRunning = true;

  this.emit('transitionStart');

  this.transitionCancel = transition(currentScreen, prevScreen, this.onTransitionComplete.bind(this));
};

ScreenNavigator.prototype.onScreenChange = function() {
  this.emit('screenChange');
};

ScreenNavigator.prototype.onTransitionComplete = function(cancelTransition) {
  this.transitionRunning = false;

  var prevItem = this.getItem(this.prevItemId);

  if (cancelTransition){
    if (this.transitionCancel) this.transitionCancel();
  }

  if (prevItem) prevItem.disposeScreen();

  if (cancelTransition){
    this.emit('transitionCancel');
  }else{
    this.emit('transitionComplete');
  }

  this.transitionCancel = null;
};

ScreenNavigator.prototype.dispose = function() {
  if (this.transitionRunning){
    this.onTransitionComplete(true);
  }

  var item;

  for (var itemId in this.items){
    item = this.items[itemId];

    if (typeof item.dispose === 'function') item.dispose();
  }
};

module.exports = ScreenNavigator;

module.exports.AScreen = require('./AScreen.js');
module.exports.ScreenNavigatorItem = ScreenNavigatorItem;
module.exports.Transitions = Transitions;


},{"./AScreen.js":9,"./ScreenNavigatorItem.js":11,"./Transitions.js":12,"inherits":7,"tiny-emitter":8}],11:[function(require,module,exports){
var ScreenNavigatorItem = function(screen, options){
  this.screen = screen;

  this.isInstance = typeof screen !== 'function';
  this.instance = this.isInstance ? screen : null;

  // default options
  this.arguments = null;
  this.properties = null;
  this.canDispose = !this.isInstance;
  this.events = null;

  this.setOptions(options);
};

ScreenNavigatorItem.prototype.setOptions = function(options) {
  for (var optionKey in options){
    if (typeof this[optionKey] !== 'undefined') this[optionKey] = options[optionKey];
  }
};

ScreenNavigatorItem.prototype.getScreen = function() {
  if (!this.instance){
    var args = this.arguments;
    var ScreenClass = this.screen;

    function WrappedScreenClass(){
      ScreenClass.apply(this, args);
    }

    WrappedScreenClass.prototype = ScreenClass.prototype;

    this.instance = new WrappedScreenClass();
  }

  if (this.properties){
    for (var key in this.properties){
      this.instance[key] = this.properties[key];
    }
  }

  if (this.events) this.addEventsListeners();

  return this.instance;
};

ScreenNavigatorItem.prototype.addEventsListeners = function() {
  for (var eventName in this.events){
    if (typeof this.events[eventName] === 'function'){
      this.instance.on(eventName, this.events[eventName]);
    }
  }
};

ScreenNavigatorItem.prototype.removeEventsListeners = function() {
  for (var eventName in this.events){
    if (typeof this.events[eventName] === 'function'){
      this.instance.off(eventName, this.events[eventName]);
    }
  }
};

ScreenNavigatorItem.prototype.disposeScreen = function(forceDispose) {
  if (!this.instance) return;

  if (this.events) this.removeEventsListeners();

  if (!forceDispose && !this.canDispose) return;

  if (typeof this.instance.dispose === 'function') this.instance.dispose();
  
  this.instance = null;
};

ScreenNavigatorItem.prototype.dispose = function() {
  this.disposeScreen(true);

  this.screen = 
  this.arguments = 
  this.properties = 
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9pbmRleC5qcyIsImV4YW1wbGUvcGFnZXMvQVBhZ2UuanMiLCJleGFtcGxlL3BhZ2VzL0Fib3V0LmpzIiwiZXhhbXBsZS9wYWdlcy9Db250YWN0LmpzIiwiZXhhbXBsZS9wYWdlcy9Ib21lLmpzIiwiZXhhbXBsZS9wYWdlcy9ob21lL0hvbWVTdWJQYWdlLmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdGlueS1lbWl0dGVyL2luZGV4LmpzIiwic3JjL0FTY3JlZW4uanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9yLmpzIiwic3JjL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMiLCJzcmMvVHJhbnNpdGlvbnMuanMiLCJzcmMvdHJhbnNpdGlvbnMvaW4uanMiLCJzcmMvdHJhbnNpdGlvbnMvaW5UaGVuT3V0LmpzIiwic3JjL3RyYW5zaXRpb25zL25vbmUuanMiLCJzcmMvdHJhbnNpdGlvbnMvb3V0LmpzIiwic3JjL3RyYW5zaXRpb25zL291dEFuZEluLmpzIiwic3JjL3RyYW5zaXRpb25zL291dFRoZW5Jbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFNjcmVlbk5hdmlnYXRvciA9IHJlcXVpcmUoJy4uL3NyYy9TY3JlZW5OYXZpZ2F0b3IuanMnKTtcbnZhciBIb21lID0gcmVxdWlyZSgnLi9wYWdlcy9Ib21lLmpzJyk7XG52YXIgQWJvdXQgPSByZXF1aXJlKCcuL3BhZ2VzL0Fib3V0LmpzJyk7XG52YXIgVHJhbnNpdGlvbnMgPSByZXF1aXJlKCcuLi9zcmMvU2NyZWVuTmF2aWdhdG9yLmpzJykuVHJhbnNpdGlvbnM7XG5cbnZhciBuYXZpZ2F0b3IgPSBuZXcgU2NyZWVuTmF2aWdhdG9yKCk7XG5cbm5hdmlnYXRvci50cmFuc2l0aW9uID0gVHJhbnNpdGlvbnMub3V0VGhlbkluO1xuXG4vLyBsaXN0ZW4gc2NyZWVucyBjaGFuZ2VzXG5uYXZpZ2F0b3Iub24oJ2NoYW5nZScsIG9uUGFnZUNoYW5nZSk7XG5cbi8vIEFERCBTQ1JFRU5TXG4vLyBcbi8vIGFkZCBzY3JlZW4gaW5zdGFuY2Vcbm5hdmlnYXRvci5hZGRJdGVtKCdob21lJywgbmV3IEhvbWUoKSwge1xuICBldmVudHM6IHtcbiAgICBhbmltYXRlSW5Db21wbGV0ZTogZnVuY3Rpb24oKXtcbiAgICAgIGNvbnNvbGUubG9nKCdhbmltYXRlSW5Db21wbGV0ZScpO1xuICAgIH1cbiAgfVxufSk7IFxuLy8gXG4vLyBhZGQgc2NyZWVuIGNsYXNzIHdpdGggb3B0aW9uc1xubmF2aWdhdG9yLmFkZEl0ZW0oJ2Fib3V0JywgQWJvdXQsIHtcblx0YXJndW1lbnRzOiBbJ215IG1lc3NhZ2UnXSwgLy8gY29uc3RydWN0b3IgYXJndW1lbnRzXG5cdHByb3BlcnRpZXM6IHt9LCAvLyBzZXQgcHJvcGVydGllcyBhdCB0aGUgc2NyZWVuIGluaXRpYWxpemF0aW9uXG5cdGNhbkRpc3Bvc2U6IGZhbHNlXG59KTsgXG4vLyBcbi8vIGFkZCBzY3JlZW4gY2xhc3Ncbm5hdmlnYXRvci5hZGRJdGVtKCdjb250YWN0JywgcmVxdWlyZSgnLi9wYWdlcy9Db250YWN0LmpzJykpOyBcblxuLy8gU0hPVyBGSVJTVCBTQ1JFRU5cbm5hdmlnYXRvci5zaG93U2NyZWVuKCdob21lJyk7XG5cbnZhciBuYXZJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ25hdiBsaSBhJyk7XG5cbi8vIGNsaWNrIG9uIG5hdiBsaW5rcyBmb3IgdGhlIGV4YW1wbGVcbmZvciAodmFyIGkgPSAwOyBpIDwgbmF2SXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgbmF2SXRlbXNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciBpZCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJykuc3BsaXQoJy8nKVsxXTtcbiAgICBpZiAoaWQgPT09ICcnKSBpZCA9ICdob21lJztcblxuICAgIC8vIHNob3cgc2NyZWVuXG4gICAgbmF2aWdhdG9yLnNob3dTY3JlZW4oaWQpO1xuICB9KVxufTtcblxuZnVuY3Rpb24gb25QYWdlQ2hhbmdlKCl7XG4gIC8vIGNvbnNvbGUubG9nKCdjaGFuZ2UnKTtcbn1cbiIsInZhciBBU2NyZWVuID0gcmVxdWlyZSgnLi4vLi4vc3JjL0FTY3JlZW4uanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBBUGFnZSA9IGZ1bmN0aW9uKGlkKXtcbiAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQgKyAnLXBhZ2UnKTtcbn07XG5cbmluaGVyaXRzKEFQYWdlLCBBU2NyZWVuKTtcblxuQVBhZ2UucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKGNhbmNlbCkge1xuXHRpZiAoY2FuY2VsKSB7XG5cdFx0VHdlZW5NYXgua2lsbFR3ZWVuc09mKHRoaXMuZWxlbWVudCk7XG5cblx0XHR0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUoKTtcblxuXHRcdHJldHVybjtcblx0fVxuXG4gIFR3ZWVuTWF4LnRvKHRoaXMuZWxlbWVudCwgLjUsIHtcbiAgXHRvcGFjaXR5OiAxLCBcbiAgXHRvbkNvbXBsZXRlOiB0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUuYmluZCh0aGlzKVxuICB9KTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG59O1xuXG5BUGFnZS5wcm90b3R5cGUuYW5pbWF0ZU91dCA9IGZ1bmN0aW9uKGNhbmNlbCkge1xuXHRpZiAoY2FuY2VsKSB7XG5cdFx0VHdlZW5NYXgua2lsbFR3ZWVuc09mKHRoaXMuZWxlbWVudCk7XG5cblx0XHR0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlKCk7XG5cblx0XHRyZXR1cm47XG5cdH1cblxuXHRUd2Vlbk1heC50byh0aGlzLmVsZW1lbnQsIC41LCB7XG4gIFx0b3BhY2l0eTogMCwgXG4gIFx0b25Db21wbGV0ZTogdGhpcy5vbkFuaW1hdGVPdXRDb21wbGV0ZS5iaW5kKHRoaXMpXG4gIH0pO1xufTtcblxuQVBhZ2UucHJvdG90eXBlLm9uQW5pbWF0ZUluQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcblx0QVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZS5jYWxsKHRoaXMpO1xufTtcblxuQVBhZ2UucHJvdG90eXBlLm9uQW5pbWF0ZU91dENvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG5cdEFTY3JlZW4ucHJvdG90eXBlLm9uQW5pbWF0ZU91dENvbXBsZXRlLmNhbGwodGhpcyk7XG5cblx0dGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBUGFnZTtcblxuIiwidmFyIEFQYWdlID0gcmVxdWlyZSgnLi9BUGFnZS5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIEFib3V0ID0gZnVuY3Rpb24obXNnKXtcblx0Y29uc29sZS5sb2cobXNnKTtcblx0XG5cdEFQYWdlLmNhbGwodGhpcywgJ2Fib3V0Jyk7XG59O1xuXG5pbmhlcml0cyhBYm91dCwgQVBhZ2UpO1xuXG4vLyBBYm91dC5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oKSB7XG4vLyAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbi8vIH07XG5cbm1vZHVsZS5leHBvcnRzID0gQWJvdXQ7XG4iLCJ2YXIgQVBhZ2UgPSByZXF1aXJlKCcuL0FQYWdlLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQ29udGFjdCA9IGZ1bmN0aW9uKCl7XG4gIEFQYWdlLmNhbGwodGhpcywgJ2NvbnRhY3QnKTtcbn07XG5cbmluaGVyaXRzKENvbnRhY3QsIEFQYWdlKTtcblxuLy8gQ29udGFjdC5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oKSB7XG4vLyAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbi8vIH07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGFjdDtcbiIsInZhciBBUGFnZSA9IHJlcXVpcmUoJy4vQVBhZ2UuanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG52YXIgU2NyZWVuTmF2aWdhdG9yID0gcmVxdWlyZSgnLi4vLi4vc3JjL1NjcmVlbk5hdmlnYXRvci5qcycpO1xudmFyIEhvbWVTdWJQYWdlID0gcmVxdWlyZSgnLi9ob21lL0hvbWVTdWJQYWdlLmpzJyk7XG52YXIgVHJhbnNpdGlvbnMgPSBTY3JlZW5OYXZpZ2F0b3IuVHJhbnNpdGlvbnM7XG5cbnZhciBIb21lID0gZnVuY3Rpb24oKXtcbiAgQVBhZ2UuY2FsbCh0aGlzLCAnaG9tZScpO1xuXG4gIHZhciB0aGF0ID0gdGhpcztcbiAgdmFyIHN1YlBhZ2VzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN1Yi1wYWdlcy1jb250YWluZXInKTtcbiAgdmFyIG5hdkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3ViLXBhZ2VzLW5hdiB1bCcpO1xuXG4gIHRoaXMubmF2aWdhdG9yID0gbmV3IFNjcmVlbk5hdmlnYXRvcigpO1xuXG4gIHRoaXMubmF2aWdhdG9yLnRyYW5zaXRpb24gPSBUcmFuc2l0aW9ucy5vdXRBbmRJbjtcblxuICB0aGlzLm5hdmlnYXRvci5vbignc2NyZWVuQ2hhbmdlJywgdGhpcy5vblN1YlBhZ2VDaGFuZ2UuYmluZCh0aGlzKSk7XG4gIFxuICB0aGlzLm5hdmlnYXRvci5vbigndHJhbnNpdGlvbkNvbXBsZXRlJywgZnVuY3Rpb24oKXtcbiAgICAvLyBjb25zb2xlLmxvZygndHJhbnNpdGlvbiBjb21wbGV0ZScpO1xuICB9KTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgIHRoaXMubmF2aWdhdG9yLmFkZEl0ZW0oJ3BhZ2UnICsgaSwgbmV3IEhvbWVTdWJQYWdlKHN1YlBhZ2VzQ29udGFpbmVyLCBpKSk7XG5cbiAgICB2YXIgbmF2SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgbmF2SXRlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2NyZWVuLWlkJywgJ3BhZ2UnICsgaSk7XG4gICAgbmF2RWxlbWVudC5hcHBlbmRDaGlsZChuYXZJdGVtKTtcblxuICAgIHZhciBuYXZMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIG5hdkxpbmsuaHJlZiA9ICcjcGFnZScgKyBpO1xuICAgIG5hdkl0ZW0uYXBwZW5kQ2hpbGQobmF2TGluayk7XG5cbiAgICBuYXZMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdmFyIHNjcmVlbklkID0gZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1zY3JlZW4taWQnKTtcblxuICAgICAgdGhhdC5uYXZpZ2F0b3Iuc2hvd1NjcmVlbihzY3JlZW5JZCk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5uYXZpZ2F0b3Iuc2hvd1NjcmVlbigncGFnZTAnKTtcbn07XG5cbmluaGVyaXRzKEhvbWUsIEFQYWdlKTtcblxuSG9tZS5wcm90b3R5cGUub25TdWJQYWdlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBuYXZJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdWItcGFnZXMtbmF2IGxpJyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXZJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChuYXZJdGVtc1tpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2NyZWVuLWlkJykgPT09IHRoaXMubmF2aWdhdG9yLmN1cnJlbnRJdGVtSWQpe1xuICAgICAgbmF2SXRlbXNbaV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfWVsc2V7XG4gICAgICBuYXZJdGVtc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWU7XG5cbiIsInZhciBBU2NyZWVuID0gcmVxdWlyZSgnLi4vLi4vLi4vc3JjL0FTY3JlZW4uanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBIb21lSXRlbSA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgaW5kZXgpe1xuICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc3ViLXBhZ2UnKTtcbiAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9ICdwYWdlICcgKyBpbmRleDtcblxuICB0aGlzLmVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyMnICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTY3NzcyMTUpLnRvU3RyaW5nKDE2KTtcblxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcbn07XG5cbmluaGVyaXRzKEhvbWVJdGVtLCBBU2NyZWVuKTtcblxuSG9tZUl0ZW0ucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKGNhbmNlbCkge1xuICBpZiAoY2FuY2VsKXtcbiAgICBUd2Vlbk1heC5raWxsVHdlZW5zT2YodGhpcy5lbGVtZW50KTtcblxuICAgIHRoaXMub25BbmltYXRlSW5Db21wbGV0ZSgpO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgVHdlZW5NYXguZnJvbVRvKHRoaXMuZWxlbWVudCwgMSwge1xuICAgIHhQZXJjZW50OiAxMDBcbiAgfSwge1xuICAgIHhQZXJjZW50OiAwLFxuICAgIG9uQ29tcGxldGU6IHRoaXMub25BbmltYXRlSW5Db21wbGV0ZS5iaW5kKHRoaXMpLFxuICAgIGVhc2U6IEV4cG8uZWFzZU91dFxuICB9KTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG59O1xuXG5Ib21lSXRlbS5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICBBU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlLmNhbGwodGhpcyk7XG59O1xuXG5Ib21lSXRlbS5wcm90b3R5cGUuYW5pbWF0ZU91dCA9IGZ1bmN0aW9uKGNhbmNlbCkge1xuICBpZiAoY2FuY2VsKXtcbiAgICBUd2Vlbk1heC5raWxsVHdlZW5zT2YodGhpcy5lbGVtZW50KTtcblxuICAgIHRoaXMub25BbmltYXRlT3V0Q29tcGxldGUoKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIFR3ZWVuTWF4LnRvKHRoaXMuZWxlbWVudCwgMSwge1xuICAgIHhQZXJjZW50OiAtMTAwLFxuICAgIG9uQ29tcGxldGU6IHRoaXMub25BbmltYXRlT3V0Q29tcGxldGUuYmluZCh0aGlzKSxcbiAgICBlYXNlOiBFeHBvLmVhc2VPdXRcbiAgfSk7XG59O1xuXG5Ib21lSXRlbS5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUuY2FsbCh0aGlzKTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWVJdGVtO1xuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCJmdW5jdGlvbiBFICgpIHtcblx0Ly8gS2VlcCB0aGlzIGVtcHR5IHNvIGl0J3MgZWFzaWVyIHRvIGluaGVyaXQgZnJvbVxuICAvLyAodmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9saXBzbWFjayBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvaXNzdWVzLzMpXG59XG5cbkUucHJvdG90eXBlID0ge1xuXHRvbjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuICAgIFxuICAgIChlW25hbWVdIHx8IChlW25hbWVdID0gW10pKS5wdXNoKHtcbiAgICAgIGZuOiBjYWxsYmFjayxcbiAgICAgIGN0eDogY3R4XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb25jZTogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGZuID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5vZmYobmFtZSwgZm4pO1xuICAgICAgY2FsbGJhY2suYXBwbHkoY3R4LCBhcmd1bWVudHMpO1xuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIHRoaXMub24obmFtZSwgZm4sIGN0eCk7XG4gIH0sXG5cbiAgZW1pdDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgZGF0YSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgZXZ0QXJyID0gKCh0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KSlbbmFtZV0gfHwgW10pLnNsaWNlKCk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBsZW4gPSBldnRBcnIubGVuZ3RoO1xuICAgIFxuICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBldnRBcnJbaV0uZm4uYXBwbHkoZXZ0QXJyW2ldLmN0eCwgZGF0YSk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9mZjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcbiAgICB2YXIgZXZ0cyA9IGVbbmFtZV07XG4gICAgdmFyIGxpdmVFdmVudHMgPSBbXTtcbiAgICBcbiAgICBpZiAoZXZ0cyAmJiBjYWxsYmFjaykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV2dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGV2dHNbaV0uZm4gIT09IGNhbGxiYWNrKSBsaXZlRXZlbnRzLnB1c2goZXZ0c1tpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFJlbW92ZSBldmVudCBmcm9tIHF1ZXVlIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtcbiAgICAvLyBTdWdnZXN0ZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2xhemRcbiAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvY29tbWl0L2M2ZWJmYWE5YmM5NzNiMzNkMTEwYTg0YTMwNzc0MmI3Y2Y5NGM5NTMjY29tbWl0Y29tbWVudC01MDI0OTEwXG5cbiAgICAobGl2ZUV2ZW50cy5sZW5ndGgpIFxuICAgICAgPyBlW25hbWVdID0gbGl2ZUV2ZW50c1xuICAgICAgOiBkZWxldGUgZVtuYW1lXTtcbiAgICBcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFO1xuIiwidmFyIFRpbnlFbWl0dGVyID0gcmVxdWlyZSgndGlueS1lbWl0dGVyJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQVNjcmVlbiA9IGZ1bmN0aW9uKCl7XG59O1xuXG5pbmhlcml0cyhBU2NyZWVuLCBUaW55RW1pdHRlcik7XG5cbkFTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKGNhbmNlbCkge1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ2FuaW1hdGVJbkNvbXBsZXRlJyk7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5hbmltYXRlT3V0ID0gZnVuY3Rpb24oY2FuY2VsKSB7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ2FuaW1hdGVPdXRDb21wbGV0ZScpO1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm9mZignYW5pbWF0ZUluQ29tcGxldGUnKVxuICAgICAgLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFTY3JlZW47IiwidmFyIFRpbnlFbWl0dGVyID0gcmVxdWlyZSgndGlueS1lbWl0dGVyJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xudmFyIFNjcmVlbk5hdmlnYXRvckl0ZW0gPSByZXF1aXJlKCcuL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMnKTtcbnZhciBUcmFuc2l0aW9ucyA9IHJlcXVpcmUoJy4vVHJhbnNpdGlvbnMuanMnKTtcblxudmFyIFNjcmVlbk5hdmlnYXRvciA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMuaXRlbXMgPSB7fTtcbiAgdGhpcy5jdXJyZW50SXRlbUlkID0gbnVsbDtcbiAgdGhpcy5wcmV2SXRlbUlkID0gbnVsbDtcblxuICB0aGlzLnRyYW5zaXRpb24gPSBTY3JlZW5OYXZpZ2F0b3IuZGVmYXVsdFRyYW5zaXRpb247XG4gIHRoaXMudHJhbnNpdGlvblJ1bm5pbmcgPSBmYWxzZTtcbiAgdGhpcy50cmFuc2l0aW9uQ2FuY2VsID0gbnVsbDtcbn07XG5cbmluaGVyaXRzKFNjcmVlbk5hdmlnYXRvciwgVGlueUVtaXR0ZXIpO1xuXG5TY3JlZW5OYXZpZ2F0b3IuZGVmYXVsdFRyYW5zaXRpb24gPSBUcmFuc2l0aW9ucy5ub25lO1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmFkZEl0ZW0gPSBmdW5jdGlvbihpZCwgc2NyZWVuLCBvcHRpb25zKSB7XG4gIHZhciBpdGVtID0gbmV3IFNjcmVlbk5hdmlnYXRvckl0ZW0oc2NyZWVuLCBvcHRpb25zKTtcblxuICB0aGlzLml0ZW1zW2lkXSA9IGl0ZW07XG5cbiAgcmV0dXJuIGl0ZW07XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmdldEl0ZW0gPSBmdW5jdGlvbihpZCkge1xuICByZXR1cm4gdGhpcy5pdGVtc1tpZF07XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLnNob3dTY3JlZW4gPSBmdW5jdGlvbihpZCwgdHJhbnNpdGlvbiwgb3B0aW9ucykge1xuICBpZiAoaWQgPT09IHRoaXMuY3VycmVudEl0ZW1JZCkgcmV0dXJuO1xuXG4gIHZhciBjdXJyZW50SXRlbSA9IHRoaXMuZ2V0SXRlbShpZCk7XG5cbiAgaWYgKCFjdXJyZW50SXRlbSl7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTY3JlZW5OYXZpZ2F0b3IgLSB0aGUgaXRlbSB3aXRoIHRoZSBpZCAnICsgaWQgKyAnIGRvZXNuXFwndCBleGlzdCcpO1xuICB9XG5cbiAgaWYgKHRoaXMudHJhbnNpdGlvblJ1bm5pbmcpe1xuICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUodHJ1ZSk7XG4gIH0gXG5cbiAgaWYgKHRoaXMuY3VycmVudEl0ZW1JZCl7XG4gICAgdGhpcy5wcmV2SXRlbUlkID0gdGhpcy5jdXJyZW50SXRlbUlkO1xuICB9XG5cbiAgdGhpcy5jdXJyZW50SXRlbUlkID0gaWQ7XG5cbiAgdGhpcy5vblNjcmVlbkNoYW5nZSgpO1xuXG4gIHRoaXMuc3RhcnRUcmFuc2l0aW9uKHRyYW5zaXRpb24sIG9wdGlvbnMpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5jbGVhclNjcmVlbiA9IGZ1bmN0aW9uKHRyYW5zaXRpb24pIHtcbiAgaWYgKCF0aGlzLmN1cnJlbnRTY3JlZW4pe1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMucHJldlNjcmVlbklkID0gdGhpcy5jdXJyZW50U2NyZWVuSWQ7XG4gIHRoaXMuY3VycmVudFNjcmVlbklkID0gbnVsbDtcblxuICB0aGlzLm9uU2NyZWVuQ2hhbmdlKCk7XG5cbiAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvbik7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLnN0YXJ0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHRyYW5zaXRpb24sIG9wdGlvbnMpIHtcbiAgdHJhbnNpdGlvbiA9IHRyYW5zaXRpb24gfHwgdGhpcy50cmFuc2l0aW9uO1xuXG4gIHZhciBwcmV2SXRlbSA9IHRoaXMuZ2V0SXRlbSh0aGlzLnByZXZJdGVtSWQpO1xuICB2YXIgY3VycmVudEl0ZW0gPSB0aGlzLmdldEl0ZW0odGhpcy5jdXJyZW50SXRlbUlkKTtcblxuICBpZiAob3B0aW9ucykgY3VycmVudEl0ZW0uc2V0T3B0aW9ucyhvcHRpb25zKTtcblxuICB2YXIgY3VycmVudFNjcmVlbiA9IGN1cnJlbnRJdGVtID8gY3VycmVudEl0ZW0uZ2V0U2NyZWVuKG9wdGlvbnMpIDogbnVsbDtcbiAgdmFyIHByZXZTY3JlZW4gPSBwcmV2SXRlbSA/IHByZXZJdGVtLmdldFNjcmVlbigpIDogbnVsbDtcblxuICB0aGlzLnRyYW5zaXRpb25SdW5uaW5nID0gdHJ1ZTtcblxuICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25TdGFydCcpO1xuXG4gIHRoaXMudHJhbnNpdGlvbkNhbmNlbCA9IHRyYW5zaXRpb24oY3VycmVudFNjcmVlbiwgcHJldlNjcmVlbiwgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZS5iaW5kKHRoaXMpKTtcbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUub25TY3JlZW5DaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbWl0KCdzY3JlZW5DaGFuZ2UnKTtcbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUub25UcmFuc2l0aW9uQ29tcGxldGUgPSBmdW5jdGlvbihjYW5jZWxUcmFuc2l0aW9uKSB7XG4gIHRoaXMudHJhbnNpdGlvblJ1bm5pbmcgPSBmYWxzZTtcblxuICB2YXIgcHJldkl0ZW0gPSB0aGlzLmdldEl0ZW0odGhpcy5wcmV2SXRlbUlkKTtcblxuICBpZiAoY2FuY2VsVHJhbnNpdGlvbil7XG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbkNhbmNlbCkgdGhpcy50cmFuc2l0aW9uQ2FuY2VsKCk7XG4gIH1cblxuICBpZiAocHJldkl0ZW0pIHByZXZJdGVtLmRpc3Bvc2VTY3JlZW4oKTtcblxuICBpZiAoY2FuY2VsVHJhbnNpdGlvbil7XG4gICAgdGhpcy5lbWl0KCd0cmFuc2l0aW9uQ2FuY2VsJyk7XG4gIH1lbHNle1xuICAgIHRoaXMuZW1pdCgndHJhbnNpdGlvbkNvbXBsZXRlJyk7XG4gIH1cblxuICB0aGlzLnRyYW5zaXRpb25DYW5jZWwgPSBudWxsO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnRyYW5zaXRpb25SdW5uaW5nKXtcbiAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKHRydWUpO1xuICB9XG5cbiAgdmFyIGl0ZW07XG5cbiAgZm9yICh2YXIgaXRlbUlkIGluIHRoaXMuaXRlbXMpe1xuICAgIGl0ZW0gPSB0aGlzLml0ZW1zW2l0ZW1JZF07XG5cbiAgICBpZiAodHlwZW9mIGl0ZW0uZGlzcG9zZSA9PT0gJ2Z1bmN0aW9uJykgaXRlbS5kaXNwb3NlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2NyZWVuTmF2aWdhdG9yO1xuXG5tb2R1bGUuZXhwb3J0cy5BU2NyZWVuID0gcmVxdWlyZSgnLi9BU2NyZWVuLmpzJyk7XG5tb2R1bGUuZXhwb3J0cy5TY3JlZW5OYXZpZ2F0b3JJdGVtID0gU2NyZWVuTmF2aWdhdG9ySXRlbTtcbm1vZHVsZS5leHBvcnRzLlRyYW5zaXRpb25zID0gVHJhbnNpdGlvbnM7XG5cbiIsInZhciBTY3JlZW5OYXZpZ2F0b3JJdGVtID0gZnVuY3Rpb24oc2NyZWVuLCBvcHRpb25zKXtcbiAgdGhpcy5zY3JlZW4gPSBzY3JlZW47XG5cbiAgdGhpcy5pc0luc3RhbmNlID0gdHlwZW9mIHNjcmVlbiAhPT0gJ2Z1bmN0aW9uJztcbiAgdGhpcy5pbnN0YW5jZSA9IHRoaXMuaXNJbnN0YW5jZSA/IHNjcmVlbiA6IG51bGw7XG5cbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHRoaXMuYXJndW1lbnRzID0gbnVsbDtcbiAgdGhpcy5wcm9wZXJ0aWVzID0gbnVsbDtcbiAgdGhpcy5jYW5EaXNwb3NlID0gIXRoaXMuaXNJbnN0YW5jZTtcbiAgdGhpcy5ldmVudHMgPSBudWxsO1xuXG4gIHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIGZvciAodmFyIG9wdGlvbktleSBpbiBvcHRpb25zKXtcbiAgICBpZiAodHlwZW9mIHRoaXNbb3B0aW9uS2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHRoaXNbb3B0aW9uS2V5XSA9IG9wdGlvbnNbb3B0aW9uS2V5XTtcbiAgfVxufTtcblxuU2NyZWVuTmF2aWdhdG9ySXRlbS5wcm90b3R5cGUuZ2V0U2NyZWVuID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5pbnN0YW5jZSl7XG4gICAgdmFyIGFyZ3MgPSB0aGlzLmFyZ3VtZW50cztcbiAgICB2YXIgU2NyZWVuQ2xhc3MgPSB0aGlzLnNjcmVlbjtcblxuICAgIGZ1bmN0aW9uIFdyYXBwZWRTY3JlZW5DbGFzcygpe1xuICAgICAgU2NyZWVuQ2xhc3MuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuXG4gICAgV3JhcHBlZFNjcmVlbkNsYXNzLnByb3RvdHlwZSA9IFNjcmVlbkNsYXNzLnByb3RvdHlwZTtcblxuICAgIHRoaXMuaW5zdGFuY2UgPSBuZXcgV3JhcHBlZFNjcmVlbkNsYXNzKCk7XG4gIH1cblxuICBpZiAodGhpcy5wcm9wZXJ0aWVzKXtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5wcm9wZXJ0aWVzKXtcbiAgICAgIHRoaXMuaW5zdGFuY2Vba2V5XSA9IHRoaXMucHJvcGVydGllc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzLmV2ZW50cykgdGhpcy5hZGRFdmVudHNMaXN0ZW5lcnMoKTtcblxuICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLmFkZEV2ZW50c0xpc3RlbmVycyA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBldmVudE5hbWUgaW4gdGhpcy5ldmVudHMpe1xuICAgIGlmICh0eXBlb2YgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgICB0aGlzLmluc3RhbmNlLm9uKGV2ZW50TmFtZSwgdGhpcy5ldmVudHNbZXZlbnROYW1lXSk7XG4gICAgfVxuICB9XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5yZW1vdmVFdmVudHNMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgZXZlbnROYW1lIGluIHRoaXMuZXZlbnRzKXtcbiAgICBpZiAodHlwZW9mIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPT09ICdmdW5jdGlvbicpe1xuICAgICAgdGhpcy5pbnN0YW5jZS5vZmYoZXZlbnROYW1lLCB0aGlzLmV2ZW50c1tldmVudE5hbWVdKTtcbiAgICB9XG4gIH1cbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLmRpc3Bvc2VTY3JlZW4gPSBmdW5jdGlvbihmb3JjZURpc3Bvc2UpIHtcbiAgaWYgKCF0aGlzLmluc3RhbmNlKSByZXR1cm47XG5cbiAgaWYgKHRoaXMuZXZlbnRzKSB0aGlzLnJlbW92ZUV2ZW50c0xpc3RlbmVycygpO1xuXG4gIGlmICghZm9yY2VEaXNwb3NlICYmICF0aGlzLmNhbkRpc3Bvc2UpIHJldHVybjtcblxuICBpZiAodHlwZW9mIHRoaXMuaW5zdGFuY2UuZGlzcG9zZSA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5pbnN0YW5jZS5kaXNwb3NlKCk7XG4gIFxuICB0aGlzLmluc3RhbmNlID0gbnVsbDtcbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5kaXNwb3NlU2NyZWVuKHRydWUpO1xuXG4gIHRoaXMuc2NyZWVuID0gXG4gIHRoaXMuYXJndW1lbnRzID0gXG4gIHRoaXMucHJvcGVydGllcyA9IFxuICBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY3JlZW5OYXZpZ2F0b3JJdGVtO1xuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0bm9uZTogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9ub25lLmpzJyksXG5cdG91dEFuZEluOiByZXF1aXJlKCcuL3RyYW5zaXRpb25zL291dEFuZEluLmpzJyksXG5cdG91dFRoZW5JbjogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9vdXRUaGVuSW4uanMnKSxcblx0aW5UaGVuT3V0OiByZXF1aXJlKCcuL3RyYW5zaXRpb25zL2luVGhlbk91dC5qcycpLFxuXHRpbjogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9pbi5qcycpLFxuXHRvdXQ6IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMvb3V0LmpzJylcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjayl7XG5cdGlmIChuZXdTY3JlZW4pIHtcblx0XHRuZXdTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgb25BbmltSW5Db21wbGV0ZSk7XG5cdFx0bmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXHR9ZWxzZXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLm9mZignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1JbkNvbXBsZXRlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQW5pbUluQ29tcGxldGUoKXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkNvbXBsZXRlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblxuXHRcdGRpc3Bvc2UoKTtcblxuXHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKXtcblx0aWYgKG5ld1NjcmVlbikge1xuXHRcdG5ld1NjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1JbkNvbXBsZXRlKTtcblx0XHRuZXdTY3JlZW4uYW5pbWF0ZUluKCk7XG5cdH1lbHNle1xuXHRcdGFuaW1PdXQoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFuaW1PdXQoKXtcblx0XHRpZiAob2xkU2NyZWVuKXtcblx0XHRcdG9sZFNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltT3V0Q29tcGxldGUpO1xuXHRcdFx0b2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblx0XHR9ZWxzZXtcblx0XHRcdG9uQ29tcGxldGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltT3V0Q29tcGxldGUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5vZmYoJ2FuaW1hdGVJbkNvbXBsZXRlJywgb25BbmltSW5Db21wbGV0ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkFuaW1JbkNvbXBsZXRlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikge1xuXHRcdFx0YW5pbU91dCgpO1xuXHRcdH1lbHNle1xuXHRcdFx0b25Db21wbGV0ZSgpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIG9uQW5pbU91dENvbXBsZXRlKCl7XG5cdFx0b25Db21wbGV0ZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25Db21wbGV0ZSgpe1xuXHRcdGRpc3Bvc2UoKTtcblxuXHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKXtcblx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXG5cdGNvbXBsZXRlQ2FsbGJhY2soKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjayl7XG5cdGlmIChvbGRTY3JlZW4pIHtcblx0XHRvbGRTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbU91dENvbXBsZXRlKTtcblx0XHRvbGRTY3JlZW4uYW5pbWF0ZU91dCgpO1xuXHR9ZWxzZXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltT3V0Q29tcGxldGUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25BbmltT3V0Q29tcGxldGUoKXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkNvbXBsZXRlKCl7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXG5cdFx0ZGlzcG9zZSgpO1xuXG5cdFx0Y29tcGxldGVDYWxsYmFjaygpO1xuXHR9XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCgpe1xuXHRcdGRpc3Bvc2UoKTtcblxuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KHRydWUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4odHJ1ZSk7XG5cdH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIG9uQ29tcGxldGUpe1xuXHR2YXIgY291bnQgPSAwO1xuXHR2YXIgbWF4Q291bnQgPSAwO1xuXG5cdGlmIChvbGRTY3JlZW4pIG1heENvdW50Kys7XG5cdGlmIChuZXdTY3JlZW4pIG1heENvdW50Kys7XG5cblx0aWYgKG9sZFNjcmVlbikge1xuXHRcdG9sZFNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltQ29tcGxldGUpO1xuXHRcdG9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cdH1cblxuXHRpZiAobmV3U2NyZWVuKSB7XG5cdFx0bmV3U2NyZWVuLm9uKCdhbmltYXRlSW5Db21wbGV0ZScsIG9uQW5pbUNvbXBsZXRlKTtcblx0XHRuZXdTY3JlZW4uYW5pbWF0ZUluKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkFuaW1Db21wbGV0ZSgpe1xuXHRcdGNvdW50Kys7XG5cblx0XHRpZiAoY291bnQgPT09IG1heENvdW50KSBvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltQ29tcGxldGUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbUNvbXBsZXRlKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXHR9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIGNvbXBsZXRlQ2FsbGJhY2spe1xuXHRpZiAob2xkU2NyZWVuKSB7XG5cdFx0b2xkU2NyZWVuLm9uKCdhbmltYXRlT3V0Q29tcGxldGUnLCBvbkFuaW1PdXRDb21wbGV0ZSk7XG5cblx0XHRvbGRTY3JlZW4uYW5pbWF0ZU91dCgpO1xuXHR9ZWxzZXtcblx0XHRhbmltSW4oKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQW5pbU91dENvbXBsZXRlKCl7XG5cdFx0aWYgKG5ld1NjcmVlbikge1xuXHRcdFx0YW5pbUluKCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRvbkNvbXBsZXRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gb25BbmltSW5Db21wbGV0ZSgpe1xuXHRcdG9uQ29tcGxldGUoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFuaW1Jbigpe1xuXHRcdG5ld1NjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1JbkNvbXBsZXRlKTtcblxuXHRcdG5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRpc3Bvc2UoKXtcblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4ub2ZmKCdhbmltYXRlT3V0Q29tcGxldGUnLCBvbkFuaW1PdXRDb21wbGV0ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLm9mZignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1JbkNvbXBsZXRlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQ29tcGxldGUoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRjb21wbGV0ZUNhbGxiYWNrKCk7XG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7XG5cdFx0ZGlzcG9zZSgpO1xuXG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblx0fTtcbn07Il19
