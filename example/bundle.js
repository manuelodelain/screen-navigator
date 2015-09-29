(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ScreenNavigator = require('../src/ScreenNavigator.js');
var Home = require('./pages/Home.js');
var About = require('./pages/About.js');

var navigator = new ScreenNavigator();

// listen screens changes
navigator.on('change', onPageChange);

// ADD SCREENS
// 
// add screen instance
navigator.addItem('home', new Home()); 
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

APage.prototype.animateIn = function() {
  this.element.classList.add('active');

  this.onAnimateInComplete();
};

APage.prototype.animateOut = function() {
  this.element.classList.remove('active');

  this.onAnimateOutComplete();
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

About.prototype.animateIn = function() {
  this.element.classList.add('active');
};

module.exports = About;

},{"./APage.js":2,"inherits":7}],4:[function(require,module,exports){
var APage = require('./APage.js');
var inherits = require('inherits');

var Contact = function(){
  APage.call(this, 'contact');
};

inherits(Contact, APage);

Contact.prototype.animateIn = function() {
  this.element.classList.add('active');
};

module.exports = Contact;

},{"./APage.js":2,"inherits":7}],5:[function(require,module,exports){
var APage = require('./APage.js');
var inherits = require('inherits');
var ScreenNavigator = require('../../src/ScreenNavigator.js');
var HomeSubPage = require('./home/HomeSubPage.js');

var Home = function(){
  APage.call(this, 'home');

  var that = this;
  var subPagesContainer = document.querySelector('.sub-pages-container');
  var navElement = document.querySelector('.sub-pages-nav ul');

  this.navigator = new ScreenNavigator();
  this.navigator.defaultTransitionType = ScreenNavigator.TRANSITION_OUT_AND_IN;
  this.navigator.on('screenChange', this.onSubPageChange.bind(this));
  this.navigator.on('transitionComplete', function(){
    console.log('transition complete');
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

  container.appendChild(this.element);
};

inherits(HomeItem, AScreen);

HomeItem.prototype.animateIn = function() {
  var anim = this.element.animate([
    {transform: 'translate(100%)'},
    {transform: 'translate(0)'}
  ], {
    duration: 1000, 
    easing: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)'
  });

  anim.addEventListener('finish', this.onAnimateInComplete.bind(this));

  this.element.classList.add('active');
};

HomeItem.prototype.onAnimateInComplete = function() {
  AScreen.prototype.onAnimateInComplete.call(this);
};

HomeItem.prototype.animateOut = function(complete) {
  var anim = this.element.animate([
    {transform: 'translate(0)'},
    {transform: 'translate(-100%)'}
  ], {
    duration: 1000, 
    easing: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)'
  });

  anim.addEventListener('finish', this.onAnimateOutComplete.bind(this));
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
};

ScreenNavigator.prototype.getItem = function(id) {
  return this.items[id];
};

ScreenNavigator.prototype.showScreen = function(id, transition) {
  if (id === this.currentItemId) return;

  var currentItem = this.getItem(id);

  if (!currentItem){
    throw new Error('ScreenNavigator - the item with the id ' + id + ' doesn\'t exist');
  }

  if (this.currentItemId){
    this.prevItemId = this.currentItemId;
  }

  this.currentItemId = id;

  this.onScreenChange();

  this.startTransition(transition);
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

ScreenNavigator.prototype.startTransition = function(transition) {
  transition = transition || this.transition;

  if (this.transitionRunning){
    this.onTransitionComplete(true);
  } 

  var prevItem = this.getItem(this.prevItemId);
  var currentItem = this.getItem(this.currentItemId);

  var currentScreen = currentItem ? currentItem.getScreen() : null;
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

  for (var itemId in this.items){
    this.items[itemId].dispose();
  }
};

module.exports.AScreen = require('./AScreen.js');
module.exports.ScreenNavigatorItem = ScreenNavigatorItem;
module.exports.Transitions = Transitions;

module.exports = ScreenNavigator;


},{"./AScreen.js":9,"./ScreenNavigatorItem.js":11,"./Transitions.js":12,"inherits":7,"tiny-emitter":8}],11:[function(require,module,exports){
var ScreenNavigatorItem = function(screen, options){
  this.screen = screen;

  this.isInstance = typeof screen !== 'function';
  this.instance = this.isInstance ? screen : null;

  // default options
  this.arguments = null;
  this.properties = null;
  this.canDispose = !this.isInstance;

  for (var optionKey in options){
    if (typeof this[optionKey] !== 'undefined') this[optionKey] = options[optionKey];
  }
};

ScreenNavigatorItem.prototype.getScreen = function() {
  if (!this.instance){
    var args = this.arguments;
    var constructor = this.screen;

    function F(){
      constructor.apply(this, args);
    }

    F.prototype = constructor.prototype;

    this.instance = new F();
  }

  if (this.properties){
    for (var key in this.properties){
      this.instance[key] = this.properties[key];
    }
  }

  return this.instance;
};

ScreenNavigatorItem.prototype.disposeScreen = function() {
  if (!this.canDispose) return;

  this.instance.dispose();
  this.instance = null;
};

ScreenNavigatorItem.prototype.dispose = function() {
  if (this.instance){
    this.instance.dispose();
  }

  this.instance = this.screen = null;
};

module.exports = ScreenNavigatorItem;


},{}],12:[function(require,module,exports){
module.exports = {
	none: require('./transitions/none.js'),
	outAndIn: require('./transitions/outAndIn.js'),
	outThenIn: require('./transitions/outThenIn.js')
};
},{"./transitions/none.js":13,"./transitions/outAndIn.js":14,"./transitions/outThenIn.js":15}],13:[function(require,module,exports){
module.exports = function(newScreen, oldScreen, completeCallback){
	if (oldScreen) oldScreen.animateOut();

	if (newScreen) newScreen.animateIn();

	completeCallback();

	return function cancel(){};
};
},{}],14:[function(require,module,exports){
module.exports = function(newScreen, oldScreen, onComplete){
	var count = 0;

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

		if (count === 2) onComplete();
	}
};
},{}],15:[function(require,module,exports){
module.exports = function(newScreen, oldScreen, completeCallback){
	var count = 0;

	if (oldScreen) {
		oldScreen.on('animateOutComplete', function onAnimOutComplete(){
			if (newScreen) {
				animIn();
			}else{
				onComplete();
			}
		});

		oldScreen.animateOut();
	}else{
		animIn();
	}

	function animIn(){
		newScreen.on('animateInComplete', function onAnimInComplete(){
			onComplete();
		});

		newScreen.animateIn();
	}

	function dispose(){
		oldScreen.off('animateInComplete');
		newScreen.off('animateInComplete');
	}

	function onComplete(){
		dispose();

		completeCallback();
	}

	return function cancel(){
		dispose();
	};
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9pbmRleC5qcyIsImV4YW1wbGUvcGFnZXMvQVBhZ2UuanMiLCJleGFtcGxlL3BhZ2VzL0Fib3V0LmpzIiwiZXhhbXBsZS9wYWdlcy9Db250YWN0LmpzIiwiZXhhbXBsZS9wYWdlcy9Ib21lLmpzIiwiZXhhbXBsZS9wYWdlcy9ob21lL0hvbWVTdWJQYWdlLmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdGlueS1lbWl0dGVyL2luZGV4LmpzIiwic3JjL0FTY3JlZW4uanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9yLmpzIiwic3JjL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMiLCJzcmMvVHJhbnNpdGlvbnMuanMiLCJzcmMvdHJhbnNpdGlvbnMvbm9uZS5qcyIsInNyYy90cmFuc2l0aW9ucy9vdXRBbmRJbi5qcyIsInNyYy90cmFuc2l0aW9ucy9vdXRUaGVuSW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFNjcmVlbk5hdmlnYXRvciA9IHJlcXVpcmUoJy4uL3NyYy9TY3JlZW5OYXZpZ2F0b3IuanMnKTtcbnZhciBIb21lID0gcmVxdWlyZSgnLi9wYWdlcy9Ib21lLmpzJyk7XG52YXIgQWJvdXQgPSByZXF1aXJlKCcuL3BhZ2VzL0Fib3V0LmpzJyk7XG5cbnZhciBuYXZpZ2F0b3IgPSBuZXcgU2NyZWVuTmF2aWdhdG9yKCk7XG5cbi8vIGxpc3RlbiBzY3JlZW5zIGNoYW5nZXNcbm5hdmlnYXRvci5vbignY2hhbmdlJywgb25QYWdlQ2hhbmdlKTtcblxuLy8gQUREIFNDUkVFTlNcbi8vIFxuLy8gYWRkIHNjcmVlbiBpbnN0YW5jZVxubmF2aWdhdG9yLmFkZEl0ZW0oJ2hvbWUnLCBuZXcgSG9tZSgpKTsgXG4vLyBcbi8vIGFkZCBzY3JlZW4gY2xhc3Mgd2l0aCBvcHRpb25zXG5uYXZpZ2F0b3IuYWRkSXRlbSgnYWJvdXQnLCBBYm91dCwge1xuXHRhcmd1bWVudHM6IFsnbXkgbWVzc2FnZSddLCAvLyBjb25zdHJ1Y3RvciBhcmd1bWVudHNcblx0cHJvcGVydGllczoge30sIC8vIHNldCBwcm9wZXJ0aWVzIGF0IHRoZSBzY3JlZW4gaW5pdGlhbGl6YXRpb25cblx0Y2FuRGlzcG9zZTogZmFsc2Vcbn0pOyBcbi8vIFxuLy8gYWRkIHNjcmVlbiBjbGFzc1xubmF2aWdhdG9yLmFkZEl0ZW0oJ2NvbnRhY3QnLCByZXF1aXJlKCcuL3BhZ2VzL0NvbnRhY3QuanMnKSk7IFxuXG4vLyBTSE9XIEZJUlNUIFNDUkVFTlxubmF2aWdhdG9yLnNob3dTY3JlZW4oJ2hvbWUnKTtcblxudmFyIG5hdkl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbmF2IGxpIGEnKTtcblxuLy8gY2xpY2sgb24gbmF2IGxpbmtzIGZvciB0aGUgZXhhbXBsZVxuZm9yICh2YXIgaSA9IDA7IGkgPCBuYXZJdGVtcy5sZW5ndGg7IGkrKykge1xuICBuYXZJdGVtc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdmFyIGlkID0gZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zcGxpdCgnLycpWzFdO1xuICAgIGlmIChpZCA9PT0gJycpIGlkID0gJ2hvbWUnO1xuXG4gICAgLy8gc2hvdyBzY3JlZW5cbiAgICBuYXZpZ2F0b3Iuc2hvd1NjcmVlbihpZCk7XG4gIH0pXG59O1xuXG5mdW5jdGlvbiBvblBhZ2VDaGFuZ2UoKXtcbiAgLy8gY29uc29sZS5sb2coJ2NoYW5nZScpO1xufVxuIiwidmFyIEFTY3JlZW4gPSByZXF1aXJlKCcuLi8uLi9zcmMvQVNjcmVlbi5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIEFQYWdlID0gZnVuY3Rpb24oaWQpe1xuICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCArICctcGFnZScpO1xufTtcblxuaW5oZXJpdHMoQVBhZ2UsIEFTY3JlZW4pO1xuXG5BUGFnZS5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblxuICB0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUoKTtcbn07XG5cbkFQYWdlLnByb3RvdHlwZS5hbmltYXRlT3V0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcblxuICB0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFQYWdlO1xuXG4iLCJ2YXIgQVBhZ2UgPSByZXF1aXJlKCcuL0FQYWdlLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQWJvdXQgPSBmdW5jdGlvbihtc2cpe1xuXHRjb25zb2xlLmxvZyhtc2cpO1xuXHRcblx0QVBhZ2UuY2FsbCh0aGlzLCAnYWJvdXQnKTtcbn07XG5cbmluaGVyaXRzKEFib3V0LCBBUGFnZSk7XG5cbkFib3V0LnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBYm91dDtcbiIsInZhciBBUGFnZSA9IHJlcXVpcmUoJy4vQVBhZ2UuanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBDb250YWN0ID0gZnVuY3Rpb24oKXtcbiAgQVBhZ2UuY2FsbCh0aGlzLCAnY29udGFjdCcpO1xufTtcblxuaW5oZXJpdHMoQ29udGFjdCwgQVBhZ2UpO1xuXG5Db250YWN0LnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250YWN0O1xuIiwidmFyIEFQYWdlID0gcmVxdWlyZSgnLi9BUGFnZS5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbnZhciBTY3JlZW5OYXZpZ2F0b3IgPSByZXF1aXJlKCcuLi8uLi9zcmMvU2NyZWVuTmF2aWdhdG9yLmpzJyk7XG52YXIgSG9tZVN1YlBhZ2UgPSByZXF1aXJlKCcuL2hvbWUvSG9tZVN1YlBhZ2UuanMnKTtcblxudmFyIEhvbWUgPSBmdW5jdGlvbigpe1xuICBBUGFnZS5jYWxsKHRoaXMsICdob21lJyk7XG5cbiAgdmFyIHRoYXQgPSB0aGlzO1xuICB2YXIgc3ViUGFnZXNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3ViLXBhZ2VzLWNvbnRhaW5lcicpO1xuICB2YXIgbmF2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdWItcGFnZXMtbmF2IHVsJyk7XG5cbiAgdGhpcy5uYXZpZ2F0b3IgPSBuZXcgU2NyZWVuTmF2aWdhdG9yKCk7XG4gIHRoaXMubmF2aWdhdG9yLmRlZmF1bHRUcmFuc2l0aW9uVHlwZSA9IFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9BTkRfSU47XG4gIHRoaXMubmF2aWdhdG9yLm9uKCdzY3JlZW5DaGFuZ2UnLCB0aGlzLm9uU3ViUGFnZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgdGhpcy5uYXZpZ2F0b3Iub24oJ3RyYW5zaXRpb25Db21wbGV0ZScsIGZ1bmN0aW9uKCl7XG4gICAgY29uc29sZS5sb2coJ3RyYW5zaXRpb24gY29tcGxldGUnKTtcbiAgfSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICB0aGlzLm5hdmlnYXRvci5hZGRJdGVtKCdwYWdlJyArIGksIG5ldyBIb21lU3ViUGFnZShzdWJQYWdlc0NvbnRhaW5lciwgaSkpO1xuXG4gICAgdmFyIG5hdkl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIG5hdkl0ZW0uc2V0QXR0cmlidXRlKCdkYXRhLXNjcmVlbi1pZCcsICdwYWdlJyArIGkpO1xuICAgIG5hdkVsZW1lbnQuYXBwZW5kQ2hpbGQobmF2SXRlbSk7XG5cbiAgICB2YXIgbmF2TGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBuYXZMaW5rLmhyZWYgPSAnI3BhZ2UnICsgaTtcbiAgICBuYXZJdGVtLmFwcGVuZENoaWxkKG5hdkxpbmspO1xuXG4gICAgbmF2TGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHZhciBzY3JlZW5JZCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2NyZWVuLWlkJyk7XG5cbiAgICAgIHRoYXQubmF2aWdhdG9yLnNob3dTY3JlZW4oc2NyZWVuSWQpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMubmF2aWdhdG9yLnNob3dTY3JlZW4oJ3BhZ2UwJyk7XG59O1xuXG5pbmhlcml0cyhIb21lLCBBUGFnZSk7XG5cbkhvbWUucHJvdG90eXBlLm9uU3ViUGFnZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbmF2SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc3ViLXBhZ2VzLW5hdiBsaScpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmF2SXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAobmF2SXRlbXNbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLXNjcmVlbi1pZCcpID09PSB0aGlzLm5hdmlnYXRvci5jdXJyZW50SXRlbUlkKXtcbiAgICAgIG5hdkl0ZW1zW2ldLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1lbHNle1xuICAgICAgbmF2SXRlbXNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIb21lO1xuXG4iLCJ2YXIgQVNjcmVlbiA9IHJlcXVpcmUoJy4uLy4uLy4uL3NyYy9BU2NyZWVuLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgSG9tZUl0ZW0gPSBmdW5jdGlvbihjb250YWluZXIsIGluZGV4KXtcbiAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3N1Yi1wYWdlJyk7XG4gIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSAncGFnZSAnICsgaW5kZXg7XG5cbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG59O1xuXG5pbmhlcml0cyhIb21lSXRlbSwgQVNjcmVlbik7XG5cbkhvbWVJdGVtLnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGFuaW0gPSB0aGlzLmVsZW1lbnQuYW5pbWF0ZShbXG4gICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZSgxMDAlKSd9LFxuICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUoMCknfVxuICBdLCB7XG4gICAgZHVyYXRpb246IDEwMDAsIFxuICAgIGVhc2luZzogJ2N1YmljLWJlemllcigwLjE5MCwgMS4wMDAsIDAuMjIwLCAxLjAwMCknXG4gIH0pO1xuXG4gIGFuaW0uYWRkRXZlbnRMaXN0ZW5lcignZmluaXNoJywgdGhpcy5vbkFuaW1hdGVJbkNvbXBsZXRlLmJpbmQodGhpcykpO1xuXG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbn07XG5cbkhvbWVJdGVtLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIEFTY3JlZW4ucHJvdG90eXBlLm9uQW5pbWF0ZUluQ29tcGxldGUuY2FsbCh0aGlzKTtcbn07XG5cbkhvbWVJdGVtLnByb3RvdHlwZS5hbmltYXRlT3V0ID0gZnVuY3Rpb24oY29tcGxldGUpIHtcbiAgdmFyIGFuaW0gPSB0aGlzLmVsZW1lbnQuYW5pbWF0ZShbXG4gICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZSgwKSd9LFxuICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTEwMCUpJ31cbiAgXSwge1xuICAgIGR1cmF0aW9uOiAxMDAwLCBcbiAgICBlYXNpbmc6ICdjdWJpYy1iZXppZXIoMC4xOTAsIDEuMDAwLCAwLjIyMCwgMS4wMDApJ1xuICB9KTtcblxuICBhbmltLmFkZEV2ZW50TGlzdGVuZXIoJ2ZpbmlzaCcsIHRoaXMub25BbmltYXRlT3V0Q29tcGxldGUuYmluZCh0aGlzKSk7XG59O1xuXG5Ib21lSXRlbS5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUuY2FsbCh0aGlzKTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWVJdGVtO1xuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCJmdW5jdGlvbiBFICgpIHtcblx0Ly8gS2VlcCB0aGlzIGVtcHR5IHNvIGl0J3MgZWFzaWVyIHRvIGluaGVyaXQgZnJvbVxuICAvLyAodmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9saXBzbWFjayBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvaXNzdWVzLzMpXG59XG5cbkUucHJvdG90eXBlID0ge1xuXHRvbjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuICAgIFxuICAgIChlW25hbWVdIHx8IChlW25hbWVdID0gW10pKS5wdXNoKHtcbiAgICAgIGZuOiBjYWxsYmFjayxcbiAgICAgIGN0eDogY3R4XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb25jZTogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGZuID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5vZmYobmFtZSwgZm4pO1xuICAgICAgY2FsbGJhY2suYXBwbHkoY3R4LCBhcmd1bWVudHMpO1xuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIHRoaXMub24obmFtZSwgZm4sIGN0eCk7XG4gIH0sXG5cbiAgZW1pdDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgZGF0YSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgZXZ0QXJyID0gKCh0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KSlbbmFtZV0gfHwgW10pLnNsaWNlKCk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBsZW4gPSBldnRBcnIubGVuZ3RoO1xuICAgIFxuICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBldnRBcnJbaV0uZm4uYXBwbHkoZXZ0QXJyW2ldLmN0eCwgZGF0YSk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9mZjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcbiAgICB2YXIgZXZ0cyA9IGVbbmFtZV07XG4gICAgdmFyIGxpdmVFdmVudHMgPSBbXTtcbiAgICBcbiAgICBpZiAoZXZ0cyAmJiBjYWxsYmFjaykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV2dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGV2dHNbaV0uZm4gIT09IGNhbGxiYWNrKSBsaXZlRXZlbnRzLnB1c2goZXZ0c1tpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFJlbW92ZSBldmVudCBmcm9tIHF1ZXVlIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtcbiAgICAvLyBTdWdnZXN0ZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2xhemRcbiAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvY29tbWl0L2M2ZWJmYWE5YmM5NzNiMzNkMTEwYTg0YTMwNzc0MmI3Y2Y5NGM5NTMjY29tbWl0Y29tbWVudC01MDI0OTEwXG5cbiAgICAobGl2ZUV2ZW50cy5sZW5ndGgpIFxuICAgICAgPyBlW25hbWVdID0gbGl2ZUV2ZW50c1xuICAgICAgOiBkZWxldGUgZVtuYW1lXTtcbiAgICBcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFO1xuIiwidmFyIFRpbnlFbWl0dGVyID0gcmVxdWlyZSgndGlueS1lbWl0dGVyJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQVNjcmVlbiA9IGZ1bmN0aW9uKCl7XG59O1xuXG5pbmhlcml0cyhBU2NyZWVuLCBUaW55RW1pdHRlcik7XG5cbkFTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKGNhbmNlbCkge1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ2FuaW1hdGVJbkNvbXBsZXRlJyk7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5hbmltYXRlT3V0ID0gZnVuY3Rpb24oY2FuY2VsKSB7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ2FuaW1hdGVPdXRDb21wbGV0ZScpO1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm9mZignYW5pbWF0ZUluQ29tcGxldGUnKVxuICAgICAgLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFTY3JlZW47IiwidmFyIFRpbnlFbWl0dGVyID0gcmVxdWlyZSgndGlueS1lbWl0dGVyJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xudmFyIFNjcmVlbk5hdmlnYXRvckl0ZW0gPSByZXF1aXJlKCcuL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMnKTtcbnZhciBUcmFuc2l0aW9ucyA9IHJlcXVpcmUoJy4vVHJhbnNpdGlvbnMuanMnKTtcblxudmFyIFNjcmVlbk5hdmlnYXRvciA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMuaXRlbXMgPSB7fTtcbiAgdGhpcy5jdXJyZW50SXRlbUlkID0gbnVsbDtcbiAgdGhpcy5wcmV2SXRlbUlkID0gbnVsbDtcblxuICB0aGlzLnRyYW5zaXRpb24gPSBTY3JlZW5OYXZpZ2F0b3IuZGVmYXVsdFRyYW5zaXRpb247XG4gIHRoaXMudHJhbnNpdGlvblJ1bm5pbmcgPSBmYWxzZTtcbiAgdGhpcy50cmFuc2l0aW9uQ2FuY2VsID0gbnVsbDtcbn07XG5cbmluaGVyaXRzKFNjcmVlbk5hdmlnYXRvciwgVGlueUVtaXR0ZXIpO1xuXG5TY3JlZW5OYXZpZ2F0b3IuZGVmYXVsdFRyYW5zaXRpb24gPSBUcmFuc2l0aW9ucy5ub25lO1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmFkZEl0ZW0gPSBmdW5jdGlvbihpZCwgc2NyZWVuLCBvcHRpb25zKSB7XG4gIHZhciBpdGVtID0gbmV3IFNjcmVlbk5hdmlnYXRvckl0ZW0oc2NyZWVuLCBvcHRpb25zKTtcblxuICB0aGlzLml0ZW1zW2lkXSA9IGl0ZW07XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmdldEl0ZW0gPSBmdW5jdGlvbihpZCkge1xuICByZXR1cm4gdGhpcy5pdGVtc1tpZF07XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLnNob3dTY3JlZW4gPSBmdW5jdGlvbihpZCwgdHJhbnNpdGlvbikge1xuICBpZiAoaWQgPT09IHRoaXMuY3VycmVudEl0ZW1JZCkgcmV0dXJuO1xuXG4gIHZhciBjdXJyZW50SXRlbSA9IHRoaXMuZ2V0SXRlbShpZCk7XG5cbiAgaWYgKCFjdXJyZW50SXRlbSl7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTY3JlZW5OYXZpZ2F0b3IgLSB0aGUgaXRlbSB3aXRoIHRoZSBpZCAnICsgaWQgKyAnIGRvZXNuXFwndCBleGlzdCcpO1xuICB9XG5cbiAgaWYgKHRoaXMuY3VycmVudEl0ZW1JZCl7XG4gICAgdGhpcy5wcmV2SXRlbUlkID0gdGhpcy5jdXJyZW50SXRlbUlkO1xuICB9XG5cbiAgdGhpcy5jdXJyZW50SXRlbUlkID0gaWQ7XG5cbiAgdGhpcy5vblNjcmVlbkNoYW5nZSgpO1xuXG4gIHRoaXMuc3RhcnRUcmFuc2l0aW9uKHRyYW5zaXRpb24pO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5jbGVhclNjcmVlbiA9IGZ1bmN0aW9uKHRyYW5zaXRpb24pIHtcbiAgaWYgKCF0aGlzLmN1cnJlbnRTY3JlZW4pe1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMucHJldlNjcmVlbklkID0gdGhpcy5jdXJyZW50U2NyZWVuSWQ7XG4gIHRoaXMuY3VycmVudFNjcmVlbklkID0gbnVsbDtcblxuICB0aGlzLm9uU2NyZWVuQ2hhbmdlKCk7XG5cbiAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvbik7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLnN0YXJ0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHRyYW5zaXRpb24pIHtcbiAgdHJhbnNpdGlvbiA9IHRyYW5zaXRpb24gfHwgdGhpcy50cmFuc2l0aW9uO1xuXG4gIGlmICh0aGlzLnRyYW5zaXRpb25SdW5uaW5nKXtcbiAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKHRydWUpO1xuICB9IFxuXG4gIHZhciBwcmV2SXRlbSA9IHRoaXMuZ2V0SXRlbSh0aGlzLnByZXZJdGVtSWQpO1xuICB2YXIgY3VycmVudEl0ZW0gPSB0aGlzLmdldEl0ZW0odGhpcy5jdXJyZW50SXRlbUlkKTtcblxuICB2YXIgY3VycmVudFNjcmVlbiA9IGN1cnJlbnRJdGVtID8gY3VycmVudEl0ZW0uZ2V0U2NyZWVuKCkgOiBudWxsO1xuICB2YXIgcHJldlNjcmVlbiA9IHByZXZJdGVtID8gcHJldkl0ZW0uZ2V0U2NyZWVuKCkgOiBudWxsO1xuXG4gIHRoaXMudHJhbnNpdGlvblJ1bm5pbmcgPSB0cnVlO1xuXG4gIHRoaXMuZW1pdCgndHJhbnNpdGlvblN0YXJ0Jyk7XG5cbiAgdGhpcy50cmFuc2l0aW9uQ2FuY2VsID0gdHJhbnNpdGlvbihjdXJyZW50U2NyZWVuLCBwcmV2U2NyZWVuLCB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlLmJpbmQodGhpcykpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5vblNjcmVlbkNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ3NjcmVlbkNoYW5nZScpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5vblRyYW5zaXRpb25Db21wbGV0ZSA9IGZ1bmN0aW9uKGNhbmNlbFRyYW5zaXRpb24pIHtcbiAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuXG4gIHZhciBwcmV2SXRlbSA9IHRoaXMuZ2V0SXRlbSh0aGlzLnByZXZJdGVtSWQpO1xuXG4gIGlmIChjYW5jZWxUcmFuc2l0aW9uKXtcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uQ2FuY2VsKSB0aGlzLnRyYW5zaXRpb25DYW5jZWwoKTtcbiAgfVxuXG4gIGlmIChwcmV2SXRlbSkgcHJldkl0ZW0uZGlzcG9zZVNjcmVlbigpO1xuXG4gIGlmIChjYW5jZWxUcmFuc2l0aW9uKXtcbiAgICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25DYW5jZWwnKTtcbiAgfWVsc2V7XG4gICAgdGhpcy5lbWl0KCd0cmFuc2l0aW9uQ29tcGxldGUnKTtcbiAgfVxuXG4gIHRoaXMudHJhbnNpdGlvbkNhbmNlbCA9IG51bGw7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMudHJhbnNpdGlvblJ1bm5pbmcpe1xuICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUodHJ1ZSk7XG4gIH1cblxuICBmb3IgKHZhciBpdGVtSWQgaW4gdGhpcy5pdGVtcyl7XG4gICAgdGhpcy5pdGVtc1tpdGVtSWRdLmRpc3Bvc2UoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuQVNjcmVlbiA9IHJlcXVpcmUoJy4vQVNjcmVlbi5qcycpO1xubW9kdWxlLmV4cG9ydHMuU2NyZWVuTmF2aWdhdG9ySXRlbSA9IFNjcmVlbk5hdmlnYXRvckl0ZW07XG5tb2R1bGUuZXhwb3J0cy5UcmFuc2l0aW9ucyA9IFRyYW5zaXRpb25zO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNjcmVlbk5hdmlnYXRvcjtcblxuIiwidmFyIFNjcmVlbk5hdmlnYXRvckl0ZW0gPSBmdW5jdGlvbihzY3JlZW4sIG9wdGlvbnMpe1xuICB0aGlzLnNjcmVlbiA9IHNjcmVlbjtcblxuICB0aGlzLmlzSW5zdGFuY2UgPSB0eXBlb2Ygc2NyZWVuICE9PSAnZnVuY3Rpb24nO1xuICB0aGlzLmluc3RhbmNlID0gdGhpcy5pc0luc3RhbmNlID8gc2NyZWVuIDogbnVsbDtcblxuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdGhpcy5hcmd1bWVudHMgPSBudWxsO1xuICB0aGlzLnByb3BlcnRpZXMgPSBudWxsO1xuICB0aGlzLmNhbkRpc3Bvc2UgPSAhdGhpcy5pc0luc3RhbmNlO1xuXG4gIGZvciAodmFyIG9wdGlvbktleSBpbiBvcHRpb25zKXtcbiAgICBpZiAodHlwZW9mIHRoaXNbb3B0aW9uS2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHRoaXNbb3B0aW9uS2V5XSA9IG9wdGlvbnNbb3B0aW9uS2V5XTtcbiAgfVxufTtcblxuU2NyZWVuTmF2aWdhdG9ySXRlbS5wcm90b3R5cGUuZ2V0U2NyZWVuID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5pbnN0YW5jZSl7XG4gICAgdmFyIGFyZ3MgPSB0aGlzLmFyZ3VtZW50cztcbiAgICB2YXIgY29uc3RydWN0b3IgPSB0aGlzLnNjcmVlbjtcblxuICAgIGZ1bmN0aW9uIEYoKXtcbiAgICAgIGNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cblxuICAgIEYucHJvdG90eXBlID0gY29uc3RydWN0b3IucHJvdG90eXBlO1xuXG4gICAgdGhpcy5pbnN0YW5jZSA9IG5ldyBGKCk7XG4gIH1cblxuICBpZiAodGhpcy5wcm9wZXJ0aWVzKXtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5wcm9wZXJ0aWVzKXtcbiAgICAgIHRoaXMuaW5zdGFuY2Vba2V5XSA9IHRoaXMucHJvcGVydGllc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLmluc3RhbmNlO1xufTtcblxuU2NyZWVuTmF2aWdhdG9ySXRlbS5wcm90b3R5cGUuZGlzcG9zZVNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuY2FuRGlzcG9zZSkgcmV0dXJuO1xuXG4gIHRoaXMuaW5zdGFuY2UuZGlzcG9zZSgpO1xuICB0aGlzLmluc3RhbmNlID0gbnVsbDtcbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuaW5zdGFuY2Upe1xuICAgIHRoaXMuaW5zdGFuY2UuZGlzcG9zZSgpO1xuICB9XG5cbiAgdGhpcy5pbnN0YW5jZSA9IHRoaXMuc2NyZWVuID0gbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2NyZWVuTmF2aWdhdG9ySXRlbTtcblxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdG5vbmU6IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMvbm9uZS5qcycpLFxuXHRvdXRBbmRJbjogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9vdXRBbmRJbi5qcycpLFxuXHRvdXRUaGVuSW46IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMvb3V0VGhlbkluLmpzJylcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjayl7XG5cdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cblx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXG5cdGNvbXBsZXRlQ2FsbGJhY2soKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgb25Db21wbGV0ZSl7XG5cdHZhciBjb3VudCA9IDA7XG5cblx0aWYgKG9sZFNjcmVlbikge1xuXHRcdG9sZFNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltQ29tcGxldGUpO1xuXHRcdG9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cdH1cblxuXHRpZiAobmV3U2NyZWVuKSB7XG5cdFx0bmV3U2NyZWVuLm9uKCdhbmltYXRlSW5Db21wbGV0ZScsIG9uQW5pbUNvbXBsZXRlKTtcblx0XHRuZXdTY3JlZW4uYW5pbWF0ZUluKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkFuaW1Db21wbGV0ZSgpe1xuXHRcdGNvdW50Kys7XG5cblx0XHRpZiAoY291bnQgPT09IDIpIG9uQ29tcGxldGUoKTtcblx0fVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKXtcblx0dmFyIGNvdW50ID0gMDtcblxuXHRpZiAob2xkU2NyZWVuKSB7XG5cdFx0b2xkU2NyZWVuLm9uKCdhbmltYXRlT3V0Q29tcGxldGUnLCBmdW5jdGlvbiBvbkFuaW1PdXRDb21wbGV0ZSgpe1xuXHRcdFx0aWYgKG5ld1NjcmVlbikge1xuXHRcdFx0XHRhbmltSW4oKTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRvbkNvbXBsZXRlKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRvbGRTY3JlZW4uYW5pbWF0ZU91dCgpO1xuXHR9ZWxzZXtcblx0XHRhbmltSW4oKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFuaW1Jbigpe1xuXHRcdG5ld1NjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCBmdW5jdGlvbiBvbkFuaW1JbkNvbXBsZXRlKCl7XG5cdFx0XHRvbkNvbXBsZXRlKCk7XG5cdFx0fSk7XG5cblx0XHRuZXdTY3JlZW4uYW5pbWF0ZUluKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0b2xkU2NyZWVuLm9mZignYW5pbWF0ZUluQ29tcGxldGUnKTtcblx0XHRuZXdTY3JlZW4ub2ZmKCdhbmltYXRlSW5Db21wbGV0ZScpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25Db21wbGV0ZSgpe1xuXHRcdGRpc3Bvc2UoKTtcblxuXHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRkaXNwb3NlKCk7XG5cdH07XG59OyJdfQ==
