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

APage.prototype.animateIn = function(cancel) {
	if (cancel) {
		TweenMax.killTweensOf(this.element);

		this.onAnimateInComplete();

		return;
	}

  TweenMax.to(this.element, 1, {
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

	TweenMax.to(this.element, 1, {
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

var Home = function(){
  APage.call(this, 'home');

  var that = this;
  var subPagesContainer = document.querySelector('.sub-pages-container');
  var navElement = document.querySelector('.sub-pages-nav ul');

  // this.navigator = new ScreenNavigator();

  // this.navigator.defaultTransitionType = ScreenNavigator.TRANSITION_OUT_AND_IN;

  // this.navigator.on('screenChange', this.onSubPageChange.bind(this));
  
  // this.navigator.on('transitionComplete', function(){
  //   // console.log('transition complete');
  // });

  // for (var i = 0; i < 6; i++) {
  //   this.navigator.addItem('page' + i, new HomeSubPage(subPagesContainer, i));

  //   var navItem = document.createElement('li');
  //   navItem.setAttribute('data-screen-id', 'page' + i);
  //   navElement.appendChild(navItem);

  //   var navLink = document.createElement('a');
  //   navLink.href = '#page' + i;
  //   navItem.appendChild(navLink);

  //   navLink.addEventListener('click', function(event){
  //     event.preventDefault();

  //     var screenId = event.currentTarget.parentNode.getAttribute('data-screen-id');

  //     that.navigator.showScreen(screenId);
  //   });
  // };

  // this.navigator.showScreen('page0');
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
  if (!this.canDispose || !this.instance) return;

  this.instance.dispose();
  this.instance = null;
};

ScreenNavigatorItem.prototype.dispose = function() {
  if (this.instance){
    this.instance.dispose();
  }

  this.instance = 
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
		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);

		dispose();
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
		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);

		dispose();
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
		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);

		dispose();
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
		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);

		dispose();
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
		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);

		dispose();
	};
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9pbmRleC5qcyIsImV4YW1wbGUvcGFnZXMvQVBhZ2UuanMiLCJleGFtcGxlL3BhZ2VzL0Fib3V0LmpzIiwiZXhhbXBsZS9wYWdlcy9Db250YWN0LmpzIiwiZXhhbXBsZS9wYWdlcy9Ib21lLmpzIiwiZXhhbXBsZS9wYWdlcy9ob21lL0hvbWVTdWJQYWdlLmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdGlueS1lbWl0dGVyL2luZGV4LmpzIiwic3JjL0FTY3JlZW4uanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9yLmpzIiwic3JjL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMiLCJzcmMvVHJhbnNpdGlvbnMuanMiLCJzcmMvdHJhbnNpdGlvbnMvaW4uanMiLCJzcmMvdHJhbnNpdGlvbnMvaW5UaGVuT3V0LmpzIiwic3JjL3RyYW5zaXRpb25zL25vbmUuanMiLCJzcmMvdHJhbnNpdGlvbnMvb3V0LmpzIiwic3JjL3RyYW5zaXRpb25zL291dEFuZEluLmpzIiwic3JjL3RyYW5zaXRpb25zL291dFRoZW5Jbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBTY3JlZW5OYXZpZ2F0b3IgPSByZXF1aXJlKCcuLi9zcmMvU2NyZWVuTmF2aWdhdG9yLmpzJyk7XG52YXIgSG9tZSA9IHJlcXVpcmUoJy4vcGFnZXMvSG9tZS5qcycpO1xudmFyIEFib3V0ID0gcmVxdWlyZSgnLi9wYWdlcy9BYm91dC5qcycpO1xudmFyIFRyYW5zaXRpb25zID0gcmVxdWlyZSgnLi4vc3JjL1NjcmVlbk5hdmlnYXRvci5qcycpLlRyYW5zaXRpb25zO1xuXG52YXIgbmF2aWdhdG9yID0gbmV3IFNjcmVlbk5hdmlnYXRvcigpO1xuXG5uYXZpZ2F0b3IudHJhbnNpdGlvbiA9IFRyYW5zaXRpb25zLm91dFRoZW5JbjtcblxuLy8gbGlzdGVuIHNjcmVlbnMgY2hhbmdlc1xubmF2aWdhdG9yLm9uKCdjaGFuZ2UnLCBvblBhZ2VDaGFuZ2UpO1xuXG4vLyBBREQgU0NSRUVOU1xuLy8gXG4vLyBhZGQgc2NyZWVuIGluc3RhbmNlXG5uYXZpZ2F0b3IuYWRkSXRlbSgnaG9tZScsIG5ldyBIb21lKCkpOyBcbi8vIFxuLy8gYWRkIHNjcmVlbiBjbGFzcyB3aXRoIG9wdGlvbnNcbm5hdmlnYXRvci5hZGRJdGVtKCdhYm91dCcsIEFib3V0LCB7XG5cdGFyZ3VtZW50czogWydteSBtZXNzYWdlJ10sIC8vIGNvbnN0cnVjdG9yIGFyZ3VtZW50c1xuXHRwcm9wZXJ0aWVzOiB7fSwgLy8gc2V0IHByb3BlcnRpZXMgYXQgdGhlIHNjcmVlbiBpbml0aWFsaXphdGlvblxuXHRjYW5EaXNwb3NlOiBmYWxzZVxufSk7IFxuLy8gXG4vLyBhZGQgc2NyZWVuIGNsYXNzXG5uYXZpZ2F0b3IuYWRkSXRlbSgnY29udGFjdCcsIHJlcXVpcmUoJy4vcGFnZXMvQ29udGFjdC5qcycpKTsgXG5cbi8vIFNIT1cgRklSU1QgU0NSRUVOXG5uYXZpZ2F0b3Iuc2hvd1NjcmVlbignaG9tZScpO1xuXG52YXIgbmF2SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCduYXYgbGkgYScpO1xuXG4vLyBjbGljayBvbiBuYXYgbGlua3MgZm9yIHRoZSBleGFtcGxlXG5mb3IgKHZhciBpID0gMDsgaSA8IG5hdkl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gIG5hdkl0ZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgaWQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpLnNwbGl0KCcvJylbMV07XG4gICAgaWYgKGlkID09PSAnJykgaWQgPSAnaG9tZSc7XG5cbiAgICAvLyBzaG93IHNjcmVlblxuICAgIG5hdmlnYXRvci5zaG93U2NyZWVuKGlkKTtcbiAgfSlcbn07XG5cbmZ1bmN0aW9uIG9uUGFnZUNoYW5nZSgpe1xuICAvLyBjb25zb2xlLmxvZygnY2hhbmdlJyk7XG59XG4iLCJ2YXIgQVNjcmVlbiA9IHJlcXVpcmUoJy4uLy4uL3NyYy9BU2NyZWVuLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQVBhZ2UgPSBmdW5jdGlvbihpZCl7XG4gIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkICsgJy1wYWdlJyk7XG59O1xuXG5pbmhlcml0cyhBUGFnZSwgQVNjcmVlbik7XG5cbkFQYWdlLnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbihjYW5jZWwpIHtcblx0aWYgKGNhbmNlbCkge1xuXHRcdFR3ZWVuTWF4LmtpbGxUd2VlbnNPZih0aGlzLmVsZW1lbnQpO1xuXG5cdFx0dGhpcy5vbkFuaW1hdGVJbkNvbXBsZXRlKCk7XG5cblx0XHRyZXR1cm47XG5cdH1cblxuICBUd2Vlbk1heC50byh0aGlzLmVsZW1lbnQsIDEsIHtcbiAgXHRvcGFjaXR5OiAxLCBcbiAgXHRvbkNvbXBsZXRlOiB0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUuYmluZCh0aGlzKVxuICB9KTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG59O1xuXG5BUGFnZS5wcm90b3R5cGUuYW5pbWF0ZU91dCA9IGZ1bmN0aW9uKGNhbmNlbCkge1xuXHRpZiAoY2FuY2VsKSB7XG5cdFx0VHdlZW5NYXgua2lsbFR3ZWVuc09mKHRoaXMuZWxlbWVudCk7XG5cblx0XHR0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlKCk7XG5cblx0XHRyZXR1cm47XG5cdH1cblxuXHRUd2Vlbk1heC50byh0aGlzLmVsZW1lbnQsIDEsIHtcbiAgXHRvcGFjaXR5OiAwLCBcbiAgXHRvbkNvbXBsZXRlOiB0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlLmJpbmQodGhpcylcbiAgfSk7XG59O1xuXG5BUGFnZS5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuXHRBU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlLmNhbGwodGhpcyk7XG59O1xuXG5BUGFnZS5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUgPSBmdW5jdGlvbigpIHtcblx0QVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUuY2FsbCh0aGlzKTtcblxuXHR0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFQYWdlO1xuXG4iLCJ2YXIgQVBhZ2UgPSByZXF1aXJlKCcuL0FQYWdlLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQWJvdXQgPSBmdW5jdGlvbihtc2cpe1xuXHRjb25zb2xlLmxvZyhtc2cpO1xuXHRcblx0QVBhZ2UuY2FsbCh0aGlzLCAnYWJvdXQnKTtcbn07XG5cbmluaGVyaXRzKEFib3V0LCBBUGFnZSk7XG5cbi8vIEFib3V0LnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbi8vICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuLy8gfTtcblxubW9kdWxlLmV4cG9ydHMgPSBBYm91dDtcbiIsInZhciBBUGFnZSA9IHJlcXVpcmUoJy4vQVBhZ2UuanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBDb250YWN0ID0gZnVuY3Rpb24oKXtcbiAgQVBhZ2UuY2FsbCh0aGlzLCAnY29udGFjdCcpO1xufTtcblxuaW5oZXJpdHMoQ29udGFjdCwgQVBhZ2UpO1xuXG4vLyBDb250YWN0LnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbi8vICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuLy8gfTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250YWN0O1xuIiwidmFyIEFQYWdlID0gcmVxdWlyZSgnLi9BUGFnZS5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbnZhciBTY3JlZW5OYXZpZ2F0b3IgPSByZXF1aXJlKCcuLi8uLi9zcmMvU2NyZWVuTmF2aWdhdG9yLmpzJyk7XG52YXIgSG9tZVN1YlBhZ2UgPSByZXF1aXJlKCcuL2hvbWUvSG9tZVN1YlBhZ2UuanMnKTtcblxudmFyIEhvbWUgPSBmdW5jdGlvbigpe1xuICBBUGFnZS5jYWxsKHRoaXMsICdob21lJyk7XG5cbiAgdmFyIHRoYXQgPSB0aGlzO1xuICB2YXIgc3ViUGFnZXNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3ViLXBhZ2VzLWNvbnRhaW5lcicpO1xuICB2YXIgbmF2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdWItcGFnZXMtbmF2IHVsJyk7XG5cbiAgLy8gdGhpcy5uYXZpZ2F0b3IgPSBuZXcgU2NyZWVuTmF2aWdhdG9yKCk7XG5cbiAgLy8gdGhpcy5uYXZpZ2F0b3IuZGVmYXVsdFRyYW5zaXRpb25UeXBlID0gU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX0FORF9JTjtcblxuICAvLyB0aGlzLm5hdmlnYXRvci5vbignc2NyZWVuQ2hhbmdlJywgdGhpcy5vblN1YlBhZ2VDaGFuZ2UuYmluZCh0aGlzKSk7XG4gIFxuICAvLyB0aGlzLm5hdmlnYXRvci5vbigndHJhbnNpdGlvbkNvbXBsZXRlJywgZnVuY3Rpb24oKXtcbiAgLy8gICAvLyBjb25zb2xlLmxvZygndHJhbnNpdGlvbiBjb21wbGV0ZScpO1xuICAvLyB9KTtcblxuICAvLyBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKykge1xuICAvLyAgIHRoaXMubmF2aWdhdG9yLmFkZEl0ZW0oJ3BhZ2UnICsgaSwgbmV3IEhvbWVTdWJQYWdlKHN1YlBhZ2VzQ29udGFpbmVyLCBpKSk7XG5cbiAgLy8gICB2YXIgbmF2SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gIC8vICAgbmF2SXRlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2NyZWVuLWlkJywgJ3BhZ2UnICsgaSk7XG4gIC8vICAgbmF2RWxlbWVudC5hcHBlbmRDaGlsZChuYXZJdGVtKTtcblxuICAvLyAgIHZhciBuYXZMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAvLyAgIG5hdkxpbmsuaHJlZiA9ICcjcGFnZScgKyBpO1xuICAvLyAgIG5hdkl0ZW0uYXBwZW5kQ2hpbGQobmF2TGluayk7XG5cbiAgLy8gICBuYXZMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAvLyAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAvLyAgICAgdmFyIHNjcmVlbklkID0gZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1zY3JlZW4taWQnKTtcblxuICAvLyAgICAgdGhhdC5uYXZpZ2F0b3Iuc2hvd1NjcmVlbihzY3JlZW5JZCk7XG4gIC8vICAgfSk7XG4gIC8vIH07XG5cbiAgLy8gdGhpcy5uYXZpZ2F0b3Iuc2hvd1NjcmVlbigncGFnZTAnKTtcbn07XG5cbmluaGVyaXRzKEhvbWUsIEFQYWdlKTtcblxuSG9tZS5wcm90b3R5cGUub25TdWJQYWdlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBuYXZJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdWItcGFnZXMtbmF2IGxpJyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXZJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChuYXZJdGVtc1tpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2NyZWVuLWlkJykgPT09IHRoaXMubmF2aWdhdG9yLmN1cnJlbnRJdGVtSWQpe1xuICAgICAgbmF2SXRlbXNbaV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfWVsc2V7XG4gICAgICBuYXZJdGVtc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWU7XG5cbiIsInZhciBBU2NyZWVuID0gcmVxdWlyZSgnLi4vLi4vLi4vc3JjL0FTY3JlZW4uanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBIb21lSXRlbSA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgaW5kZXgpe1xuICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc3ViLXBhZ2UnKTtcbiAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9ICdwYWdlICcgKyBpbmRleDtcblxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcbn07XG5cbmluaGVyaXRzKEhvbWVJdGVtLCBBU2NyZWVuKTtcblxuSG9tZUl0ZW0ucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYW5pbSA9IHRoaXMuZWxlbWVudC5hbmltYXRlKFtcbiAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlKDEwMCUpJ30sXG4gICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZSgwKSd9XG4gIF0sIHtcbiAgICBkdXJhdGlvbjogMTAwMCwgXG4gICAgZWFzaW5nOiAnY3ViaWMtYmV6aWVyKDAuMTkwLCAxLjAwMCwgMC4yMjAsIDEuMDAwKSdcbiAgfSk7XG5cbiAgYW5pbS5hZGRFdmVudExpc3RlbmVyKCdmaW5pc2gnLCB0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUuYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxuSG9tZUl0ZW0ucHJvdG90eXBlLm9uQW5pbWF0ZUluQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZS5jYWxsKHRoaXMpO1xufTtcblxuSG9tZUl0ZW0ucHJvdG90eXBlLmFuaW1hdGVPdXQgPSBmdW5jdGlvbihjb21wbGV0ZSkge1xuICB2YXIgYW5pbSA9IHRoaXMuZWxlbWVudC5hbmltYXRlKFtcbiAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlKDApJ30sXG4gICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZSgtMTAwJSknfVxuICBdLCB7XG4gICAgZHVyYXRpb246IDEwMDAsIFxuICAgIGVhc2luZzogJ2N1YmljLWJlemllcigwLjE5MCwgMS4wMDAsIDAuMjIwLCAxLjAwMCknXG4gIH0pO1xuXG4gIGFuaW0uYWRkRXZlbnRMaXN0ZW5lcignZmluaXNoJywgdGhpcy5vbkFuaW1hdGVPdXRDb21wbGV0ZS5iaW5kKHRoaXMpKTtcbn07XG5cbkhvbWVJdGVtLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICBBU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZS5jYWxsKHRoaXMpO1xuXG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSG9tZUl0ZW07XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsImZ1bmN0aW9uIEUgKCkge1xuXHQvLyBLZWVwIHRoaXMgZW1wdHkgc28gaXQncyBlYXNpZXIgdG8gaW5oZXJpdCBmcm9tXG4gIC8vICh2aWEgaHR0cHM6Ly9naXRodWIuY29tL2xpcHNtYWNrIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9pc3N1ZXMvMylcbn1cblxuRS5wcm90b3R5cGUgPSB7XG5cdG9uOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG4gICAgXG4gICAgKGVbbmFtZV0gfHwgKGVbbmFtZV0gPSBbXSkpLnB1c2goe1xuICAgICAgZm46IGNhbGxiYWNrLFxuICAgICAgY3R4OiBjdHhcbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvbmNlOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLm9mZihuYW1lLCBmbik7XG4gICAgICBjYWxsYmFjay5hcHBseShjdHgsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gdGhpcy5vbihuYW1lLCBmbiwgY3R4KTtcbiAgfSxcblxuICBlbWl0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBkYXRhID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBldnRBcnIgPSAoKHRoaXMuZSB8fCAodGhpcy5lID0ge30pKVtuYW1lXSB8fCBbXSkuc2xpY2UoKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGxlbiA9IGV2dEFyci5sZW5ndGg7XG4gICAgXG4gICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGV2dEFycltpXS5mbi5hcHBseShldnRBcnJbaV0uY3R4LCBkYXRhKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb2ZmOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuICAgIHZhciBldnRzID0gZVtuYW1lXTtcbiAgICB2YXIgbGl2ZUV2ZW50cyA9IFtdO1xuICAgIFxuICAgIGlmIChldnRzICYmIGNhbGxiYWNrKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZXZ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZXZ0c1tpXS5mbiAhPT0gY2FsbGJhY2spIGxpdmVFdmVudHMucHVzaChldnRzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gUmVtb3ZlIGV2ZW50IGZyb20gcXVldWUgdG8gcHJldmVudCBtZW1vcnkgbGVha1xuICAgIC8vIFN1Z2dlc3RlZCBieSBodHRwczovL2dpdGh1Yi5jb20vbGF6ZFxuICAgIC8vIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9jb21taXQvYzZlYmZhYTliYzk3M2IzM2QxMTBhODRhMzA3NzQyYjdjZjk0Yzk1MyNjb21taXRjb21tZW50LTUwMjQ5MTBcblxuICAgIChsaXZlRXZlbnRzLmxlbmd0aCkgXG4gICAgICA/IGVbbmFtZV0gPSBsaXZlRXZlbnRzXG4gICAgICA6IGRlbGV0ZSBlW25hbWVdO1xuICAgIFxuICAgIHJldHVybiB0aGlzO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEU7XG4iLCJ2YXIgVGlueUVtaXR0ZXIgPSByZXF1aXJlKCd0aW55LWVtaXR0ZXInKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBBU2NyZWVuID0gZnVuY3Rpb24oKXtcbn07XG5cbmluaGVyaXRzKEFTY3JlZW4sIFRpbnlFbWl0dGVyKTtcblxuQVNjcmVlbi5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oY2FuY2VsKSB7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgnYW5pbWF0ZUluQ29tcGxldGUnKTtcbn07XG5cbkFTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVPdXQgPSBmdW5jdGlvbihjYW5jZWwpIHtcbn07XG5cbkFTY3JlZW4ucHJvdG90eXBlLm9uQW5pbWF0ZU91dENvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgnYW5pbWF0ZU91dENvbXBsZXRlJyk7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMub2ZmKCdhbmltYXRlSW5Db21wbGV0ZScpXG4gICAgICAub2ZmKCdhbmltYXRlT3V0Q29tcGxldGUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQVNjcmVlbjsiLCJ2YXIgVGlueUVtaXR0ZXIgPSByZXF1aXJlKCd0aW55LWVtaXR0ZXInKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG52YXIgU2NyZWVuTmF2aWdhdG9ySXRlbSA9IHJlcXVpcmUoJy4vU2NyZWVuTmF2aWdhdG9ySXRlbS5qcycpO1xudmFyIFRyYW5zaXRpb25zID0gcmVxdWlyZSgnLi9UcmFuc2l0aW9ucy5qcycpO1xuXG52YXIgU2NyZWVuTmF2aWdhdG9yID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5pdGVtcyA9IHt9O1xuICB0aGlzLmN1cnJlbnRJdGVtSWQgPSBudWxsO1xuICB0aGlzLnByZXZJdGVtSWQgPSBudWxsO1xuXG4gIHRoaXMudHJhbnNpdGlvbiA9IFNjcmVlbk5hdmlnYXRvci5kZWZhdWx0VHJhbnNpdGlvbjtcbiAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuICB0aGlzLnRyYW5zaXRpb25DYW5jZWwgPSBudWxsO1xufTtcblxuaW5oZXJpdHMoU2NyZWVuTmF2aWdhdG9yLCBUaW55RW1pdHRlcik7XG5cblNjcmVlbk5hdmlnYXRvci5kZWZhdWx0VHJhbnNpdGlvbiA9IFRyYW5zaXRpb25zLm5vbmU7XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuYWRkSXRlbSA9IGZ1bmN0aW9uKGlkLCBzY3JlZW4sIG9wdGlvbnMpIHtcbiAgdmFyIGl0ZW0gPSBuZXcgU2NyZWVuTmF2aWdhdG9ySXRlbShzY3JlZW4sIG9wdGlvbnMpO1xuXG4gIHRoaXMuaXRlbXNbaWRdID0gaXRlbTtcbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuZ2V0SXRlbSA9IGZ1bmN0aW9uKGlkKSB7XG4gIHJldHVybiB0aGlzLml0ZW1zW2lkXTtcbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuc2hvd1NjcmVlbiA9IGZ1bmN0aW9uKGlkLCB0cmFuc2l0aW9uKSB7XG4gIGlmIChpZCA9PT0gdGhpcy5jdXJyZW50SXRlbUlkKSByZXR1cm47XG5cbiAgdmFyIGN1cnJlbnRJdGVtID0gdGhpcy5nZXRJdGVtKGlkKTtcblxuICBpZiAoIWN1cnJlbnRJdGVtKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NjcmVlbk5hdmlnYXRvciAtIHRoZSBpdGVtIHdpdGggdGhlIGlkICcgKyBpZCArICcgZG9lc25cXCd0IGV4aXN0Jyk7XG4gIH1cblxuICBpZiAodGhpcy5jdXJyZW50SXRlbUlkKXtcbiAgICB0aGlzLnByZXZJdGVtSWQgPSB0aGlzLmN1cnJlbnRJdGVtSWQ7XG4gIH1cblxuICB0aGlzLmN1cnJlbnRJdGVtSWQgPSBpZDtcblxuICB0aGlzLm9uU2NyZWVuQ2hhbmdlKCk7XG5cbiAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvbik7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmNsZWFyU2NyZWVuID0gZnVuY3Rpb24odHJhbnNpdGlvbikge1xuICBpZiAoIXRoaXMuY3VycmVudFNjcmVlbil7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdGhpcy5wcmV2U2NyZWVuSWQgPSB0aGlzLmN1cnJlbnRTY3JlZW5JZDtcbiAgdGhpcy5jdXJyZW50U2NyZWVuSWQgPSBudWxsO1xuXG4gIHRoaXMub25TY3JlZW5DaGFuZ2UoKTtcblxuICB0aGlzLnN0YXJ0VHJhbnNpdGlvbih0cmFuc2l0aW9uKTtcbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuc3RhcnRUcmFuc2l0aW9uID0gZnVuY3Rpb24odHJhbnNpdGlvbikge1xuICB0cmFuc2l0aW9uID0gdHJhbnNpdGlvbiB8fCB0aGlzLnRyYW5zaXRpb247XG5cbiAgaWYgKHRoaXMudHJhbnNpdGlvblJ1bm5pbmcpe1xuICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUodHJ1ZSk7XG4gIH0gXG5cbiAgdmFyIHByZXZJdGVtID0gdGhpcy5nZXRJdGVtKHRoaXMucHJldkl0ZW1JZCk7XG4gIHZhciBjdXJyZW50SXRlbSA9IHRoaXMuZ2V0SXRlbSh0aGlzLmN1cnJlbnRJdGVtSWQpO1xuXG4gIHZhciBjdXJyZW50U2NyZWVuID0gY3VycmVudEl0ZW0gPyBjdXJyZW50SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG4gIHZhciBwcmV2U2NyZWVuID0gcHJldkl0ZW0gPyBwcmV2SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG5cbiAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IHRydWU7XG5cbiAgdGhpcy5lbWl0KCd0cmFuc2l0aW9uU3RhcnQnKTtcblxuICB0aGlzLnRyYW5zaXRpb25DYW5jZWwgPSB0cmFuc2l0aW9uKGN1cnJlbnRTY3JlZW4sIHByZXZTY3JlZW4sIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUuYmluZCh0aGlzKSk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLm9uU2NyZWVuQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgnc2NyZWVuQ2hhbmdlJyk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLm9uVHJhbnNpdGlvbkNvbXBsZXRlID0gZnVuY3Rpb24oY2FuY2VsVHJhbnNpdGlvbikge1xuICB0aGlzLnRyYW5zaXRpb25SdW5uaW5nID0gZmFsc2U7XG5cbiAgdmFyIHByZXZJdGVtID0gdGhpcy5nZXRJdGVtKHRoaXMucHJldkl0ZW1JZCk7XG5cbiAgaWYgKGNhbmNlbFRyYW5zaXRpb24pe1xuICAgIGlmICh0aGlzLnRyYW5zaXRpb25DYW5jZWwpIHRoaXMudHJhbnNpdGlvbkNhbmNlbCgpO1xuICB9XG5cbiAgaWYgKHByZXZJdGVtKSBwcmV2SXRlbS5kaXNwb3NlU2NyZWVuKCk7XG5cbiAgaWYgKGNhbmNlbFRyYW5zaXRpb24pe1xuICAgIHRoaXMuZW1pdCgndHJhbnNpdGlvbkNhbmNlbCcpO1xuICB9ZWxzZXtcbiAgICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25Db21wbGV0ZScpO1xuICB9XG5cbiAgdGhpcy50cmFuc2l0aW9uQ2FuY2VsID0gbnVsbDtcbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy50cmFuc2l0aW9uUnVubmluZyl7XG4gICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSh0cnVlKTtcbiAgfVxuXG4gIGZvciAodmFyIGl0ZW1JZCBpbiB0aGlzLml0ZW1zKXtcbiAgICB0aGlzLml0ZW1zW2l0ZW1JZF0uZGlzcG9zZSgpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNjcmVlbk5hdmlnYXRvcjtcblxubW9kdWxlLmV4cG9ydHMuQVNjcmVlbiA9IHJlcXVpcmUoJy4vQVNjcmVlbi5qcycpO1xubW9kdWxlLmV4cG9ydHMuU2NyZWVuTmF2aWdhdG9ySXRlbSA9IFNjcmVlbk5hdmlnYXRvckl0ZW07XG5tb2R1bGUuZXhwb3J0cy5UcmFuc2l0aW9ucyA9IFRyYW5zaXRpb25zO1xuXG4iLCJ2YXIgU2NyZWVuTmF2aWdhdG9ySXRlbSA9IGZ1bmN0aW9uKHNjcmVlbiwgb3B0aW9ucyl7XG4gIHRoaXMuc2NyZWVuID0gc2NyZWVuO1xuXG4gIHRoaXMuaXNJbnN0YW5jZSA9IHR5cGVvZiBzY3JlZW4gIT09ICdmdW5jdGlvbic7XG4gIHRoaXMuaW5zdGFuY2UgPSB0aGlzLmlzSW5zdGFuY2UgPyBzY3JlZW4gOiBudWxsO1xuXG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB0aGlzLmFyZ3VtZW50cyA9IG51bGw7XG4gIHRoaXMucHJvcGVydGllcyA9IG51bGw7XG4gIHRoaXMuY2FuRGlzcG9zZSA9ICF0aGlzLmlzSW5zdGFuY2U7XG5cbiAgZm9yICh2YXIgb3B0aW9uS2V5IGluIG9wdGlvbnMpe1xuICAgIGlmICh0eXBlb2YgdGhpc1tvcHRpb25LZXldICE9PSAndW5kZWZpbmVkJykgdGhpc1tvcHRpb25LZXldID0gb3B0aW9uc1tvcHRpb25LZXldO1xuICB9XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5nZXRTY3JlZW4gPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLmluc3RhbmNlKXtcbiAgICB2YXIgYXJncyA9IHRoaXMuYXJndW1lbnRzO1xuICAgIHZhciBjb25zdHJ1Y3RvciA9IHRoaXMuc2NyZWVuO1xuXG4gICAgZnVuY3Rpb24gRigpe1xuICAgICAgY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuXG4gICAgRi5wcm90b3R5cGUgPSBjb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG5cbiAgICB0aGlzLmluc3RhbmNlID0gbmV3IEYoKTtcbiAgfVxuXG4gIGlmICh0aGlzLnByb3BlcnRpZXMpe1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLnByb3BlcnRpZXMpe1xuICAgICAgdGhpcy5pbnN0YW5jZVtrZXldID0gdGhpcy5wcm9wZXJ0aWVzW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5kaXNwb3NlU2NyZWVuID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5jYW5EaXNwb3NlIHx8ICF0aGlzLmluc3RhbmNlKSByZXR1cm47XG5cbiAgdGhpcy5pbnN0YW5jZS5kaXNwb3NlKCk7XG4gIHRoaXMuaW5zdGFuY2UgPSBudWxsO1xufTtcblxuU2NyZWVuTmF2aWdhdG9ySXRlbS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5pbnN0YW5jZSl7XG4gICAgdGhpcy5pbnN0YW5jZS5kaXNwb3NlKCk7XG4gIH1cblxuICB0aGlzLmluc3RhbmNlID0gXG4gIHRoaXMuc2NyZWVuID0gXG4gIHRoaXMuYXJndW1lbnRzID0gXG4gIHRoaXMucHJvcGVydGllcyA9IFxuICBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY3JlZW5OYXZpZ2F0b3JJdGVtO1xuXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0bm9uZTogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9ub25lLmpzJyksXG5cdG91dEFuZEluOiByZXF1aXJlKCcuL3RyYW5zaXRpb25zL291dEFuZEluLmpzJyksXG5cdG91dFRoZW5JbjogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9vdXRUaGVuSW4uanMnKSxcblx0aW5UaGVuT3V0OiByZXF1aXJlKCcuL3RyYW5zaXRpb25zL2luVGhlbk91dC5qcycpLFxuXHRpbjogcmVxdWlyZSgnLi90cmFuc2l0aW9ucy9pbi5qcycpLFxuXHRvdXQ6IHJlcXVpcmUoJy4vdHJhbnNpdGlvbnMvb3V0LmpzJylcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjayl7XG5cdGlmIChuZXdTY3JlZW4pIHtcblx0XHRuZXdTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgb25BbmltSW5Db21wbGV0ZSk7XG5cdFx0bmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXHR9ZWxzZXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLm9mZignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1JbkNvbXBsZXRlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQW5pbUluQ29tcGxldGUoKXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkNvbXBsZXRlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblxuXHRcdGRpc3Bvc2UoKTtcblxuXHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXG5cdFx0ZGlzcG9zZSgpO1xuXHR9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKXtcblx0aWYgKG5ld1NjcmVlbikge1xuXHRcdG5ld1NjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1JbkNvbXBsZXRlKTtcblx0XHRuZXdTY3JlZW4uYW5pbWF0ZUluKCk7XG5cdH1lbHNle1xuXHRcdGFuaW1PdXQoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFuaW1PdXQoKXtcblx0XHRpZiAob2xkU2NyZWVuKXtcblx0XHRcdG9sZFNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltT3V0Q29tcGxldGUpO1xuXHRcdFx0b2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblx0XHR9ZWxzZXtcblx0XHRcdG9uQ29tcGxldGUoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltT3V0Q29tcGxldGUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5vZmYoJ2FuaW1hdGVJbkNvbXBsZXRlJywgb25BbmltSW5Db21wbGV0ZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkFuaW1JbkNvbXBsZXRlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikge1xuXHRcdFx0YW5pbU91dCgpO1xuXHRcdH1lbHNle1xuXHRcdFx0b25Db21wbGV0ZSgpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIG9uQW5pbU91dENvbXBsZXRlKCl7XG5cdFx0b25Db21wbGV0ZSgpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25Db21wbGV0ZSgpe1xuXHRcdGRpc3Bvc2UoKTtcblxuXHRcdGNvbXBsZXRlQ2FsbGJhY2soKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXG5cdFx0ZGlzcG9zZSgpO1xuXHR9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5ld1NjcmVlbiwgb2xkU2NyZWVuLCBjb21wbGV0ZUNhbGxiYWNrKXtcblx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQoKTtcblx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXG5cdGNvbXBsZXRlQ2FsbGJhY2soKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuZXdTY3JlZW4sIG9sZFNjcmVlbiwgY29tcGxldGVDYWxsYmFjayl7XG5cdGlmIChvbGRTY3JlZW4pIHtcblx0XHRvbGRTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbU91dENvbXBsZXRlKTtcblx0XHRvbGRTY3JlZW4uYW5pbWF0ZU91dCgpO1xuXHR9ZWxzZXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltT3V0Q29tcGxldGUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gb25BbmltT3V0Q29tcGxldGUoKXtcblx0XHRvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkNvbXBsZXRlKCl7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbigpO1xuXG5cdFx0ZGlzcG9zZSgpO1xuXG5cdFx0Y29tcGxldGVDYWxsYmFjaygpO1xuXHR9XG5cblx0cmV0dXJuIGZ1bmN0aW9uIGNhbmNlbCgpe1xuXHRcdGlmIChvbGRTY3JlZW4pIG9sZFNjcmVlbi5hbmltYXRlT3V0KHRydWUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5hbmltYXRlSW4odHJ1ZSk7XG5cblx0XHRkaXNwb3NlKCk7XG5cdH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIG9uQ29tcGxldGUpe1xuXHR2YXIgY291bnQgPSAwO1xuXHR2YXIgbWF4Q291bnQgPSAwO1xuXG5cdGlmIChvbGRTY3JlZW4pIG1heENvdW50Kys7XG5cdGlmIChuZXdTY3JlZW4pIG1heENvdW50Kys7XG5cblx0aWYgKG9sZFNjcmVlbikge1xuXHRcdG9sZFNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltQ29tcGxldGUpO1xuXHRcdG9sZFNjcmVlbi5hbmltYXRlT3V0KCk7XG5cdH1cblxuXHRpZiAobmV3U2NyZWVuKSB7XG5cdFx0bmV3U2NyZWVuLm9uKCdhbmltYXRlSW5Db21wbGV0ZScsIG9uQW5pbUNvbXBsZXRlKTtcblx0XHRuZXdTY3JlZW4uYW5pbWF0ZUluKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBvbkFuaW1Db21wbGV0ZSgpe1xuXHRcdGNvdW50Kys7XG5cblx0XHRpZiAoY291bnQgPT09IG1heENvdW50KSBvbkNvbXBsZXRlKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBkaXNwb3NlKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgb25BbmltQ29tcGxldGUpO1xuXHRcdGlmIChuZXdTY3JlZW4pIG5ld1NjcmVlbi5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScsIG9uQW5pbUNvbXBsZXRlKTtcblx0fVxuXG5cdHJldHVybiBmdW5jdGlvbiBjYW5jZWwoKXtcblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcblx0XHRpZiAobmV3U2NyZWVuKSBuZXdTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXG5cdFx0ZGlzcG9zZSgpO1xuXHR9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmV3U2NyZWVuLCBvbGRTY3JlZW4sIGNvbXBsZXRlQ2FsbGJhY2spe1xuXHRpZiAob2xkU2NyZWVuKSB7XG5cdFx0b2xkU2NyZWVuLm9uKCdhbmltYXRlT3V0Q29tcGxldGUnLCBvbkFuaW1PdXRDb21wbGV0ZSk7XG5cblx0XHRvbGRTY3JlZW4uYW5pbWF0ZU91dCgpO1xuXHR9ZWxzZXtcblx0XHRhbmltSW4oKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQW5pbU91dENvbXBsZXRlKCl7XG5cdFx0aWYgKG5ld1NjcmVlbikge1xuXHRcdFx0YW5pbUluKCk7XG5cdFx0fWVsc2V7XG5cdFx0XHRvbkNvbXBsZXRlKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gb25BbmltSW5Db21wbGV0ZSgpe1xuXHRcdG9uQ29tcGxldGUoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGFuaW1Jbigpe1xuXHRcdG5ld1NjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1JbkNvbXBsZXRlKTtcblxuXHRcdG5ld1NjcmVlbi5hbmltYXRlSW4oKTtcblx0fVxuXG5cdGZ1bmN0aW9uIGRpc3Bvc2UoKXtcblx0XHRpZiAob2xkU2NyZWVuKSBvbGRTY3JlZW4ub2ZmKCdhbmltYXRlT3V0Q29tcGxldGUnLCBvbkFuaW1PdXRDb21wbGV0ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLm9mZignYW5pbWF0ZUluQ29tcGxldGUnLCBvbkFuaW1JbkNvbXBsZXRlKTtcblx0fVxuXG5cdGZ1bmN0aW9uIG9uQ29tcGxldGUoKXtcblx0XHRkaXNwb3NlKCk7XG5cblx0XHRjb21wbGV0ZUNhbGxiYWNrKCk7XG5cdH1cblxuXHRyZXR1cm4gZnVuY3Rpb24gY2FuY2VsKCl7XG5cdFx0aWYgKG9sZFNjcmVlbikgb2xkU2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG5cdFx0aWYgKG5ld1NjcmVlbikgbmV3U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblxuXHRcdGRpc3Bvc2UoKTtcblx0fTtcbn07Il19
