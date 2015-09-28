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

  if (prevItem) prevItem.disposeScreen();

  if (cancelTransition){
    if (this.transitionCancel) this.transitionCancel();

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9pbmRleC5qcyIsImV4YW1wbGUvcGFnZXMvQVBhZ2UuanMiLCJleGFtcGxlL3BhZ2VzL0Fib3V0LmpzIiwiZXhhbXBsZS9wYWdlcy9Db250YWN0LmpzIiwiZXhhbXBsZS9wYWdlcy9Ib21lLmpzIiwiZXhhbXBsZS9wYWdlcy9ob21lL0hvbWVTdWJQYWdlLmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdGlueS1lbWl0dGVyL2luZGV4LmpzIiwic3JjL0FTY3JlZW4uanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9yLmpzIiwic3JjL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMiLCJzcmMvVHJhbnNpdGlvbnMuanMiLCJzcmMvdHJhbnNpdGlvbnMvbm9uZS5qcyIsInNyYy90cmFuc2l0aW9ucy9vdXRBbmRJbi5qcyIsInNyYy90cmFuc2l0aW9ucy9vdXRUaGVuSW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgU2NyZWVuTmF2aWdhdG9yID0gcmVxdWlyZSgnLi4vc3JjL1NjcmVlbk5hdmlnYXRvci5qcycpO1xudmFyIEhvbWUgPSByZXF1aXJlKCcuL3BhZ2VzL0hvbWUuanMnKTtcbnZhciBBYm91dCA9IHJlcXVpcmUoJy4vcGFnZXMvQWJvdXQuanMnKTtcblxudmFyIG5hdmlnYXRvciA9IG5ldyBTY3JlZW5OYXZpZ2F0b3IoKTtcblxuLy8gbGlzdGVuIHNjcmVlbnMgY2hhbmdlc1xubmF2aWdhdG9yLm9uKCdjaGFuZ2UnLCBvblBhZ2VDaGFuZ2UpO1xuXG4vLyBBREQgU0NSRUVOU1xuLy8gXG4vLyBhZGQgc2NyZWVuIGluc3RhbmNlXG5uYXZpZ2F0b3IuYWRkSXRlbSgnaG9tZScsIG5ldyBIb21lKCkpOyBcbi8vIFxuLy8gYWRkIHNjcmVlbiBjbGFzcyB3aXRoIG9wdGlvbnNcbm5hdmlnYXRvci5hZGRJdGVtKCdhYm91dCcsIEFib3V0LCB7XG5cdGFyZ3VtZW50czogWydteSBtZXNzYWdlJ10sIC8vIGNvbnN0cnVjdG9yIGFyZ3VtZW50c1xuXHRwcm9wZXJ0aWVzOiB7fSwgLy8gc2V0IHByb3BlcnRpZXMgYXQgdGhlIHNjcmVlbiBpbml0aWFsaXphdGlvblxuXHRjYW5EaXNwb3NlOiBmYWxzZVxufSk7IFxuLy8gXG4vLyBhZGQgc2NyZWVuIGNsYXNzXG5uYXZpZ2F0b3IuYWRkSXRlbSgnY29udGFjdCcsIHJlcXVpcmUoJy4vcGFnZXMvQ29udGFjdC5qcycpKTsgXG5cbi8vIFNIT1cgRklSU1QgU0NSRUVOXG5uYXZpZ2F0b3Iuc2hvd1NjcmVlbignaG9tZScpO1xuXG52YXIgbmF2SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCduYXYgbGkgYScpO1xuXG4vLyBjbGljayBvbiBuYXYgbGlua3MgZm9yIHRoZSBleGFtcGxlXG5mb3IgKHZhciBpID0gMDsgaSA8IG5hdkl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gIG5hdkl0ZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgaWQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpLnNwbGl0KCcvJylbMV07XG4gICAgaWYgKGlkID09PSAnJykgaWQgPSAnaG9tZSc7XG5cbiAgICAvLyBzaG93IHNjcmVlblxuICAgIG5hdmlnYXRvci5zaG93U2NyZWVuKGlkKTtcbiAgfSlcbn07XG5cbmZ1bmN0aW9uIG9uUGFnZUNoYW5nZSgpe1xuICAvLyBjb25zb2xlLmxvZygnY2hhbmdlJyk7XG59XG4iLCJ2YXIgQVNjcmVlbiA9IHJlcXVpcmUoJy4uLy4uL3NyYy9BU2NyZWVuLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQVBhZ2UgPSBmdW5jdGlvbihpZCl7XG4gIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkICsgJy1wYWdlJyk7XG59O1xuXG5pbmhlcml0cyhBUGFnZSwgQVNjcmVlbik7XG5cbkFQYWdlLnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXG4gIHRoaXMub25BbmltYXRlSW5Db21wbGV0ZSgpO1xufTtcblxuQVBhZ2UucHJvdG90eXBlLmFuaW1hdGVPdXQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXG4gIHRoaXMub25BbmltYXRlT3V0Q29tcGxldGUoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQVBhZ2U7XG5cbiIsInZhciBBUGFnZSA9IHJlcXVpcmUoJy4vQVBhZ2UuanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBBYm91dCA9IGZ1bmN0aW9uKG1zZyl7XG5cdGNvbnNvbGUubG9nKG1zZyk7XG5cdFxuXHRBUGFnZS5jYWxsKHRoaXMsICdhYm91dCcpO1xufTtcblxuaW5oZXJpdHMoQWJvdXQsIEFQYWdlKTtcblxuQWJvdXQucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFib3V0O1xuIiwidmFyIEFQYWdlID0gcmVxdWlyZSgnLi9BUGFnZS5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIENvbnRhY3QgPSBmdW5jdGlvbigpe1xuICBBUGFnZS5jYWxsKHRoaXMsICdjb250YWN0Jyk7XG59O1xuXG5pbmhlcml0cyhDb250YWN0LCBBUGFnZSk7XG5cbkNvbnRhY3QucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRhY3Q7XG4iLCJ2YXIgQVBhZ2UgPSByZXF1aXJlKCcuL0FQYWdlLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xudmFyIFNjcmVlbk5hdmlnYXRvciA9IHJlcXVpcmUoJy4uLy4uL3NyYy9TY3JlZW5OYXZpZ2F0b3IuanMnKTtcbnZhciBIb21lU3ViUGFnZSA9IHJlcXVpcmUoJy4vaG9tZS9Ib21lU3ViUGFnZS5qcycpO1xuXG52YXIgSG9tZSA9IGZ1bmN0aW9uKCl7XG4gIEFQYWdlLmNhbGwodGhpcywgJ2hvbWUnKTtcblxuICB2YXIgdGhhdCA9IHRoaXM7XG4gIHZhciBzdWJQYWdlc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdWItcGFnZXMtY29udGFpbmVyJyk7XG4gIHZhciBuYXZFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN1Yi1wYWdlcy1uYXYgdWwnKTtcblxuICB0aGlzLm5hdmlnYXRvciA9IG5ldyBTY3JlZW5OYXZpZ2F0b3IoKTtcbiAgdGhpcy5uYXZpZ2F0b3IuZGVmYXVsdFRyYW5zaXRpb25UeXBlID0gU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX0FORF9JTjtcbiAgdGhpcy5uYXZpZ2F0b3Iub24oJ3NjcmVlbkNoYW5nZScsIHRoaXMub25TdWJQYWdlQ2hhbmdlLmJpbmQodGhpcykpO1xuICB0aGlzLm5hdmlnYXRvci5vbigndHJhbnNpdGlvbkNvbXBsZXRlJywgZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZygndHJhbnNpdGlvbiBjb21wbGV0ZScpO1xuICB9KTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgIHRoaXMubmF2aWdhdG9yLmFkZEl0ZW0oJ3BhZ2UnICsgaSwgbmV3IEhvbWVTdWJQYWdlKHN1YlBhZ2VzQ29udGFpbmVyLCBpKSk7XG5cbiAgICB2YXIgbmF2SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgbmF2SXRlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2NyZWVuLWlkJywgJ3BhZ2UnICsgaSk7XG4gICAgbmF2RWxlbWVudC5hcHBlbmRDaGlsZChuYXZJdGVtKTtcblxuICAgIHZhciBuYXZMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIG5hdkxpbmsuaHJlZiA9ICcjcGFnZScgKyBpO1xuICAgIG5hdkl0ZW0uYXBwZW5kQ2hpbGQobmF2TGluayk7XG5cbiAgICBuYXZMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdmFyIHNjcmVlbklkID0gZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1zY3JlZW4taWQnKTtcblxuICAgICAgdGhhdC5uYXZpZ2F0b3Iuc2hvd1NjcmVlbihzY3JlZW5JZCk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5uYXZpZ2F0b3Iuc2hvd1NjcmVlbigncGFnZTAnKTtcbn07XG5cbmluaGVyaXRzKEhvbWUsIEFQYWdlKTtcblxuSG9tZS5wcm90b3R5cGUub25TdWJQYWdlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBuYXZJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdWItcGFnZXMtbmF2IGxpJyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXZJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChuYXZJdGVtc1tpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2NyZWVuLWlkJykgPT09IHRoaXMubmF2aWdhdG9yLmN1cnJlbnRJdGVtSWQpe1xuICAgICAgbmF2SXRlbXNbaV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfWVsc2V7XG4gICAgICBuYXZJdGVtc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWU7XG5cbiIsInZhciBBU2NyZWVuID0gcmVxdWlyZSgnLi4vLi4vLi4vc3JjL0FTY3JlZW4uanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBIb21lSXRlbSA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgaW5kZXgpe1xuICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc3ViLXBhZ2UnKTtcbiAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9ICdwYWdlICcgKyBpbmRleDtcblxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcbn07XG5cbmluaGVyaXRzKEhvbWVJdGVtLCBBU2NyZWVuKTtcblxuSG9tZUl0ZW0ucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYW5pbSA9IHRoaXMuZWxlbWVudC5hbmltYXRlKFtcbiAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlKDEwMCUpJ30sXG4gICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZSgwKSd9XG4gIF0sIHtcbiAgICBkdXJhdGlvbjogMTAwMCwgXG4gICAgZWFzaW5nOiAnY3ViaWMtYmV6aWVyKDAuMTkwLCAxLjAwMCwgMC4yMjAsIDEuMDAwKSdcbiAgfSk7XG5cbiAgYW5pbS5hZGRFdmVudExpc3RlbmVyKCdmaW5pc2gnLCB0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUuYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxuSG9tZUl0ZW0ucHJvdG90eXBlLm9uQW5pbWF0ZUluQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZS5jYWxsKHRoaXMpO1xufTtcblxuSG9tZUl0ZW0ucHJvdG90eXBlLmFuaW1hdGVPdXQgPSBmdW5jdGlvbihjb21wbGV0ZSkge1xuICB2YXIgYW5pbSA9IHRoaXMuZWxlbWVudC5hbmltYXRlKFtcbiAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlKDApJ30sXG4gICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZSgtMTAwJSknfVxuICBdLCB7XG4gICAgZHVyYXRpb246IDEwMDAsIFxuICAgIGVhc2luZzogJ2N1YmljLWJlemllcigwLjE5MCwgMS4wMDAsIDAuMjIwLCAxLjAwMCknXG4gIH0pO1xuXG4gIGFuaW0uYWRkRXZlbnRMaXN0ZW5lcignZmluaXNoJywgdGhpcy5vbkFuaW1hdGVPdXRDb21wbGV0ZS5iaW5kKHRoaXMpKTtcbn07XG5cbkhvbWVJdGVtLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICBBU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZS5jYWxsKHRoaXMpO1xuXG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSG9tZUl0ZW07XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsImZ1bmN0aW9uIEUgKCkge1xuXHQvLyBLZWVwIHRoaXMgZW1wdHkgc28gaXQncyBlYXNpZXIgdG8gaW5oZXJpdCBmcm9tXG4gIC8vICh2aWEgaHR0cHM6Ly9naXRodWIuY29tL2xpcHNtYWNrIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9pc3N1ZXMvMylcbn1cblxuRS5wcm90b3R5cGUgPSB7XG5cdG9uOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG4gICAgXG4gICAgKGVbbmFtZV0gfHwgKGVbbmFtZV0gPSBbXSkpLnB1c2goe1xuICAgICAgZm46IGNhbGxiYWNrLFxuICAgICAgY3R4OiBjdHhcbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvbmNlOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLm9mZihuYW1lLCBmbik7XG4gICAgICBjYWxsYmFjay5hcHBseShjdHgsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gdGhpcy5vbihuYW1lLCBmbiwgY3R4KTtcbiAgfSxcblxuICBlbWl0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBkYXRhID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBldnRBcnIgPSAoKHRoaXMuZSB8fCAodGhpcy5lID0ge30pKVtuYW1lXSB8fCBbXSkuc2xpY2UoKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGxlbiA9IGV2dEFyci5sZW5ndGg7XG4gICAgXG4gICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGV2dEFycltpXS5mbi5hcHBseShldnRBcnJbaV0uY3R4LCBkYXRhKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb2ZmOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuICAgIHZhciBldnRzID0gZVtuYW1lXTtcbiAgICB2YXIgbGl2ZUV2ZW50cyA9IFtdO1xuICAgIFxuICAgIGlmIChldnRzICYmIGNhbGxiYWNrKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZXZ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZXZ0c1tpXS5mbiAhPT0gY2FsbGJhY2spIGxpdmVFdmVudHMucHVzaChldnRzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gUmVtb3ZlIGV2ZW50IGZyb20gcXVldWUgdG8gcHJldmVudCBtZW1vcnkgbGVha1xuICAgIC8vIFN1Z2dlc3RlZCBieSBodHRwczovL2dpdGh1Yi5jb20vbGF6ZFxuICAgIC8vIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9jb21taXQvYzZlYmZhYTliYzk3M2IzM2QxMTBhODRhMzA3NzQyYjdjZjk0Yzk1MyNjb21taXRjb21tZW50LTUwMjQ5MTBcblxuICAgIChsaXZlRXZlbnRzLmxlbmd0aCkgXG4gICAgICA/IGVbbmFtZV0gPSBsaXZlRXZlbnRzXG4gICAgICA6IGRlbGV0ZSBlW25hbWVdO1xuICAgIFxuICAgIHJldHVybiB0aGlzO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEU7XG4iLCJ2YXIgVGlueUVtaXR0ZXIgPSByZXF1aXJlKCd0aW55LWVtaXR0ZXInKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBBU2NyZWVuID0gZnVuY3Rpb24oKXtcbn07XG5cbmluaGVyaXRzKEFTY3JlZW4sIFRpbnlFbWl0dGVyKTtcblxuQVNjcmVlbi5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oY2FuY2VsKSB7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgnYW5pbWF0ZUluQ29tcGxldGUnKTtcbn07XG5cbkFTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVPdXQgPSBmdW5jdGlvbihjYW5jZWwpIHtcbn07XG5cbkFTY3JlZW4ucHJvdG90eXBlLm9uQW5pbWF0ZU91dENvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgnYW5pbWF0ZU91dENvbXBsZXRlJyk7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMub2ZmKCdhbmltYXRlSW5Db21wbGV0ZScpXG4gICAgICAub2ZmKCdhbmltYXRlT3V0Q29tcGxldGUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQVNjcmVlbjsiLCJ2YXIgVGlueUVtaXR0ZXIgPSByZXF1aXJlKCd0aW55LWVtaXR0ZXInKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG52YXIgU2NyZWVuTmF2aWdhdG9ySXRlbSA9IHJlcXVpcmUoJy4vU2NyZWVuTmF2aWdhdG9ySXRlbS5qcycpO1xudmFyIFRyYW5zaXRpb25zID0gcmVxdWlyZSgnLi9UcmFuc2l0aW9ucy5qcycpO1xuXG52YXIgU2NyZWVuTmF2aWdhdG9yID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5pdGVtcyA9IHt9O1xuICB0aGlzLmN1cnJlbnRJdGVtSWQgPSBudWxsO1xuICB0aGlzLnByZXZJdGVtSWQgPSBudWxsO1xuXG4gIHRoaXMudHJhbnNpdGlvbiA9IFNjcmVlbk5hdmlnYXRvci5kZWZhdWx0VHJhbnNpdGlvbjtcbiAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuICB0aGlzLnRyYW5zaXRpb25DYW5jZWwgPSBudWxsO1xufTtcblxuaW5oZXJpdHMoU2NyZWVuTmF2aWdhdG9yLCBUaW55RW1pdHRlcik7XG5cblNjcmVlbk5hdmlnYXRvci5kZWZhdWx0VHJhbnNpdGlvbiA9IFRyYW5zaXRpb25zLm5vbmU7XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuYWRkSXRlbSA9IGZ1bmN0aW9uKGlkLCBzY3JlZW4sIG9wdGlvbnMpIHtcbiAgdmFyIGl0ZW0gPSBuZXcgU2NyZWVuTmF2aWdhdG9ySXRlbShzY3JlZW4sIG9wdGlvbnMpO1xuXG4gIHRoaXMuaXRlbXNbaWRdID0gaXRlbTtcbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuZ2V0SXRlbSA9IGZ1bmN0aW9uKGlkKSB7XG4gIHJldHVybiB0aGlzLml0ZW1zW2lkXTtcbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuc2hvd1NjcmVlbiA9IGZ1bmN0aW9uKGlkLCB0cmFuc2l0aW9uKSB7XG4gIGlmIChpZCA9PT0gdGhpcy5jdXJyZW50SXRlbUlkKSByZXR1cm47XG5cbiAgdmFyIGN1cnJlbnRJdGVtID0gdGhpcy5nZXRJdGVtKGlkKTtcblxuICBpZiAoIWN1cnJlbnRJdGVtKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NjcmVlbk5hdmlnYXRvciAtIHRoZSBpdGVtIHdpdGggdGhlIGlkICcgKyBpZCArICcgZG9lc25cXCd0IGV4aXN0Jyk7XG4gIH1cblxuICBpZiAodGhpcy5jdXJyZW50SXRlbUlkKXtcbiAgICB0aGlzLnByZXZJdGVtSWQgPSB0aGlzLmN1cnJlbnRJdGVtSWQ7XG4gIH1cblxuICB0aGlzLmN1cnJlbnRJdGVtSWQgPSBpZDtcblxuICB0aGlzLm9uU2NyZWVuQ2hhbmdlKCk7XG5cbiAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvbik7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmNsZWFyU2NyZWVuID0gZnVuY3Rpb24odHJhbnNpdGlvbikge1xuICBpZiAoIXRoaXMuY3VycmVudFNjcmVlbil7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5wcmV2U2NyZWVuSWQgPSB0aGlzLmN1cnJlbnRTY3JlZW5JZDtcbiAgdGhpcy5jdXJyZW50U2NyZWVuSWQgPSBudWxsO1xuXG4gIHRoaXMub25TY3JlZW5DaGFuZ2UoKTtcblxuICB0aGlzLnN0YXJ0VHJhbnNpdGlvbih0cmFuc2l0aW9uKTtcbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuc3RhcnRUcmFuc2l0aW9uID0gZnVuY3Rpb24odHJhbnNpdGlvbikge1xuICB0cmFuc2l0aW9uID0gdHJhbnNpdGlvbiB8fCB0aGlzLnRyYW5zaXRpb247XG5cbiAgaWYgKHRoaXMudHJhbnNpdGlvblJ1bm5pbmcpe1xuICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUodHJ1ZSk7XG4gIH0gXG5cbiAgdmFyIHByZXZJdGVtID0gdGhpcy5nZXRJdGVtKHRoaXMucHJldkl0ZW1JZCk7XG4gIHZhciBjdXJyZW50SXRlbSA9IHRoaXMuZ2V0SXRlbSh0aGlzLmN1cnJlbnRJdGVtSWQpO1xuXG4gIHZhciBjdXJyZW50U2NyZWVuID0gY3VycmVudEl0ZW0gPyBjdXJyZW50SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG4gIHZhciBwcmV2U2NyZWVuID0gcHJldkl0ZW0gPyBwcmV2SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG5cbiAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IHRydWU7XG5cbiAgdGhpcy5lbWl0KCd0cmFuc2l0aW9uU3RhcnQnKTtcblxuICB0aGlzLnRyYW5zaXRpb25DYW5jZWwgPSB0cmFuc2l0aW9uKGN1cnJlbnRTY3JlZW4sIHByZXZTY3JlZW4sIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUuYmluZCh0aGlzKSk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLm9uU2NyZWVuQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgnc2NyZWVuQ2hhbmdlJyk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLm9uVHJhbnNpdGlvbkNvbXBsZXRlID0gZnVuY3Rpb24oY2FuY2VsVHJhbnNpdGlvbikge1xuICB0aGlzLnRyYW5zaXRpb25SdW5uaW5nID0gZmFsc2U7XG5cbiAgdmFyIHByZXZJdGVtID0gdGhpcy5nZXRJdGVtKHRoaXMucHJldkl0ZW1JZCk7XG5cbiAgaWYgKHByZXZJdGVtKSBwcmV2SXRlbS5kaXNwb3NlU2NyZWVuKCk7XG5cbiAgaWYgKGNhbmNlbFRyYW5zaXRpb24pe1xuICAgIGlmICh0aGlzLnRyYW5zaXRpb25DYW5jZWwpIHRoaXMudHJhbnNpdGlvbkNhbmNlbCgpO1xuXG4gICAgdGhpcy5lbWl0KCd0cmFuc2l0aW9uQ2FuY2VsJyk7XG4gIH1lbHNle1xuICAgIHRoaXMuZW1pdCgndHJhbnNpdGlvbkNvbXBsZXRlJyk7XG4gIH1cblxuICB0aGlzLnRyYW5zaXRpb25DYW5jZWwgPSBudWxsO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnRyYW5zaXRpb25SdW5uaW5nKXtcbiAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKHRydWUpO1xuICB9XG5cbiAgZm9yICh2YXIgaXRlbUlkIGluIHRoaXMuaXRlbXMpe1xuICAgIHRoaXMuaXRlbXNbaXRlbUlkXS5kaXNwb3NlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLkFTY3JlZW4gPSByZXF1aXJlKCcuL0FTY3JlZW4uanMnKTtcbm1vZHVsZS5leHBvcnRzLlNjcmVlbk5hdmlnYXRvckl0ZW0gPSBTY3JlZW5OYXZpZ2F0b3JJdGVtO1xubW9kdWxlLmV4cG9ydHMuVHJhbnNpdGlvbnMgPSBUcmFuc2l0aW9ucztcblxubW9kdWxlLmV4cG9ydHMgPSBTY3JlZW5OYXZpZ2F0b3I7XG5cbiIsInZhciBTY3JlZW5OYXZpZ2F0b3JJdGVtID0gZnVuY3Rpb24oc2NyZWVuLCBvcHRpb25zKXtcbiAgdGhpcy5zY3JlZW4gPSBzY3JlZW47XG5cbiAgdGhpcy5pc0luc3RhbmNlID0gdHlwZW9mIHNjcmVlbiAhPT0gJ2Z1bmN0aW9uJztcbiAgdGhpcy5pbnN0YW5jZSA9IHRoaXMuaXNJbnN0YW5jZSA/IHNjcmVlbiA6IG51bGw7XG5cbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHRoaXMuYXJndW1lbnRzID0gbnVsbDtcbiAgdGhpcy5wcm9wZXJ0aWVzID0gbnVsbDtcbiAgdGhpcy5jYW5EaXNwb3NlID0gIXRoaXMuaXNJbnN0YW5jZTtcblxuICBmb3IgKHZhciBvcHRpb25LZXkgaW4gb3B0aW9ucyl7XG4gICAgaWYgKHR5cGVvZiB0aGlzW29wdGlvbktleV0gIT09ICd1bmRlZmluZWQnKSB0aGlzW29wdGlvbktleV0gPSBvcHRpb25zW29wdGlvbktleV07XG4gIH1cbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLmdldFNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuaW5zdGFuY2Upe1xuICAgIHZhciBhcmdzID0gdGhpcy5hcmd1bWVudHM7XG4gICAgdmFyIGNvbnN0cnVjdG9yID0gdGhpcy5zY3JlZW47XG5cbiAgICBmdW5jdGlvbiBGKCl7XG4gICAgICBjb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG5cbiAgICBGLnByb3RvdHlwZSA9IGNvbnN0cnVjdG9yLnByb3RvdHlwZTtcblxuICAgIHRoaXMuaW5zdGFuY2UgPSBuZXcgRigpO1xuICB9XG5cbiAgaWYgKHRoaXMucHJvcGVydGllcyl7XG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMucHJvcGVydGllcyl7XG4gICAgICB0aGlzLmluc3RhbmNlW2tleV0gPSB0aGlzLnByb3BlcnRpZXNba2V5XTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLmRpc3Bvc2VTY3JlZW4gPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLmNhbkRpc3Bvc2UpIHJldHVybjtcblxuICB0aGlzLmluc3RhbmNlLmRpc3Bvc2UoKTtcbiAgdGhpcy5pbnN0YW5jZSA9IG51bGw7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmluc3RhbmNlKXtcbiAgICB0aGlzLmluc3RhbmNlLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHRoaXMuaW5zdGFuY2UgPSB0aGlzLnNjcmVlbiA9IG51bGw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNjcmVlbk5hdmlnYXRvckl0ZW07XG5cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHRub25lOiByZXF1aXJlKCcuL3RyYW5zaXRpb25zL25vbmUuanMnKSxcblx0b3V0QW5kSW46IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMvb3V0QW5kSW4uanMnKSxcblx0b3V0VGhlbkluOiByZXF1aXJlKCcuL3RyYW5zaXRpb25zL291dFRoZW5Jbi5qcycpXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIGNvbXBsZXRlQ2FsbGJhY2spe1xuXHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCgpO1xuXG5cdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblxuXHRjb21wbGV0ZUNhbGxiYWNrKCk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCgpe307XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIG9uQ29tcGxldGUpe1xuXHR2YXIgY291bnQgPSAwO1xuXG5cdGlmIChvbGRTY3JlZW4pIHtcblx0XHRvbGRTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbUNvbXBsZXRlKTtcblx0XHRvbGRTY3JlZW4uYW5pbWF0ZU91dCgpO1xuXHR9XG5cblx0aWYgKG5ld1NjcmVlbikge1xuXHRcdG5ld1NjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1Db21wbGV0ZSk7XG5cdFx0bmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25BbmltQ29tcGxldGUoKXtcblx0XHRjb3VudCsrO1xuXG5cdFx0aWYgKGNvdW50ID09PSAyKSBvbkNvbXBsZXRlKCk7XG5cdH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjayl7XG5cdHZhciBjb3VudCA9IDA7XG5cblx0aWYgKG9sZFNjcmVlbikge1xuXHRcdG9sZFNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgZnVuY3Rpb24gb25BbmltT3V0Q29tcGxldGUoKXtcblx0XHRcdGlmIChuZXdTY3JlZW4pIHtcblx0XHRcdFx0YW5pbUluKCk7XG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0b25Db21wbGV0ZSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0b2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblx0fWVsc2V7XG5cdFx0YW5pbUluKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBhbmltSW4oKXtcblx0XHRuZXdTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgZnVuY3Rpb24gb25BbmltSW5Db21wbGV0ZSgpe1xuXHRcdFx0b25Db21wbGV0ZSgpO1xuXHRcdH0pO1xuXG5cdFx0bmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gZGlzcG9zZSgpe1xuXHRcdG9sZFNjcmVlbi5vZmYoJ2FuaW1hdGVJbkNvbXBsZXRlJyk7XG5cdFx0bmV3U2NyZWVuLm9mZignYW5pbWF0ZUluQ29tcGxldGUnKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQ29tcGxldGUoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRjb21wbGV0ZUNhbGxiYWNrKCk7XG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7XG5cdFx0ZGlzcG9zZSgpO1xuXHR9O1xufTsiXX0=
