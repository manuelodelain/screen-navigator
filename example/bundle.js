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
	arguments: ['new About page'], // constructor arguments
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
};

APage.prototype.animateOut = function(complete) {
  this.element.classList.remove('active');

  if (complete) {
    this.onAnimateOutComplete();
  }
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
  this.navigator.on('change', this.onSubPageChange.bind(this));
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
  
  if (complete) {
    this.onAnimateOutComplete();
  }
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

AScreen.prototype.animateIn = function(complete) {
  this.onAnimateInComplete();
};

AScreen.prototype.onAnimateInComplete = function() {
  this.emit('animateInComplete');
};

AScreen.prototype.animateOut = function(complete) {
  this.onAnimateOutComplete();
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

var ScreenNavigator = function(){
  this.items = {};
  this.currentItemId = null;
  this.prevItemId = null;

  this.transitionRunning = false;
  this.transitionType = ScreenNavigator.defaultTransitionType;

  this.animateInCompleteCb = this.onAnimateInComplete.bind(this);
  this.animateOutCompleteCb = this.onAnimateInComplete.bind(this);
  this.animateCompleteCount = 0;
};

inherits(ScreenNavigator, TinyEmitter);

ScreenNavigator.TRANSITION_OUT_AND_IN = 'outAndIn';
ScreenNavigator.TRANSITION_OUT_THEN_IN = 'outThenIn';
ScreenNavigator.TRANSITION_IN_THEN_OUT = 'inThenOut';
ScreenNavigator.TRANSITION_OUT = 'out';
ScreenNavigator.TRANSITION_IN = 'in';
ScreenNavigator.TRANSITION_NONE = 'none';

ScreenNavigator.defaultTransitionType = ScreenNavigator.TRANSITION_NONE;

ScreenNavigator.prototype.addItem = function(id, screen, options) {
  var item = new ScreenNavigatorItem(screen, options);

  this.items[id] = item;
};

ScreenNavigator.prototype.getItem = function(id) {
  return this.items[id];
};

ScreenNavigator.prototype.showScreen = function(id, transitionType) {
  if (id === this.currentItemId) return;

  if (this.currentItemId){
    this.prevItemId = this.currentItemId;
  }

  this.currentItemId = id;

  var currentItem = this.getItem(id);

  if (!currentItem){
    throw new Error('ScreenNavigator - the item with the id ' + id + ' doesn\'t exist');
  }

  this.onChange();

  this.startTransition(transitionType);
};

ScreenNavigator.prototype.clearScreen = function(transitionType) {
  if (this.currentScreen){
    this.prevScreen = this.currentScreen;
  }

  this.onChange();

  this.startTransition(transitionType);
};

ScreenNavigator.prototype.startTransition = function(transitionType) {
  if (this.transitionRunning){
    this.cancelTransition();
  } 

  var prevItem = this.getItem(this.prevItemId);
  var currentItem = this.getItem(this.currentItemId);
  var currentScreen = currentItem ? currentItem.getScreen() : null;
  var prevScreen = prevItem ? prevItem.getScreen() : null;

  this.animateCompleteCount = 0;
  this.transitionType = transitionType ? transitionType : this.defaultTransitionType;

  switch(this.transitionType){
    case ScreenNavigator.TRANSITION_OUT_AND_IN:
      if (prevScreen) {
        prevScreen.on('animateOutComplete', this.animateOutCompleteCb);
        prevScreen.animateOut();
      }

      if (currentScreen) {
        currentScreen.on('animateInComplete', this.animateInCompleteCb);
        currentScreen.animateIn();
      }
      break;

    case ScreenNavigator.TRANSITION_OUT_THEN_IN:
      if (prevScreen) {
        prevScreen.on('animateOutComplete', this.animateOutCompleteCb);
        prevScreen.animateOut();
      }else{
        this.onAnimateOutComplete();
      }
      break;

    case ScreenNavigator.TRANSITION_IN_THEN_OUT:
      if (currentScreen) {
        currentScreen.on('animateInComplete', this.animateInCompleteCb);
        currentScreen.animateIn();
      }else{
        this.onAnimateInComplete();
      }
      break;

    case ScreenNavigator.TRANSITION_OUT:
      if (prevScreen) {
        prevScreen.on('animateOutComplete', this.animateOutCompleteCb);
        prevScreen.animateOut();
      }else{
        this.onTransitionComplete();
      }
      break;

    case ScreenNavigator.TRANSITION_IN:
      if (currentScreen) {
        currentScreen.on('animateInComplete', this.animateInCompleteCb);
        currentScreen.animateIn();
      }else{
        this.onTransitionComplete();
      }
      break;

    case ScreenNavigator.TRANSITION_NONE:
    default:
      this.transitionType = ScreenNavigator.TRANSITION_NONE;

      if (prevScreen) prevScreen.animateOut(true);
      if (currentScreen) currentScreen.animateIn(true);

      this.onTransitionComplete();
      break;
  }

  this.onTransitionStart();
};

ScreenNavigator.prototype.cancelTransition = function(complete) {
  var prevItem = this.getItem(this.prevItemId);
  var currentItem = this.getItem(this.currentItemId);

  this.transitionRunning = false;

  this.disposeTransition();

  if (prevItem){
    prevItem.getScreen().animateOut(true);
  }

  if (currentItem){
    currentItem.getScreen().animateOut(true);
  }
};

ScreenNavigator.prototype.onChange = function() {
  this.emit('change');
};

ScreenNavigator.prototype.onTransitionStart = function() {
  this.emit('transitionStart');
};

ScreenNavigator.prototype.onAnimateInComplete = function() {
  var prevItem = this.getItem(this.prevItemId);
  var currentItem = this.getItem(this.currentItemId);
  var currentScreen = currentItem ? currentItem.getScreen() : null;
  var prevScreen = prevItem ? prevItem.getScreen() : null;

  this.animateCompleteCount++; 
  
  switch(this.transitionType){
    case ScreenNavigator.TRANSITION_OUT_AND_IN:
      if (this.animateCompleteCount === 2 || !this.prevItem) this.onTransitionComplete();
      break;

    case ScreenNavigator.TRANSITION_OUT_THEN_IN:
      this.onTransitionComplete();
      break;

    case ScreenNavigator.TRANSITION_IN_THEN_OUT:
      if (prevScreen){
        prevScreen.on('animateOutComplete', this.animateOutCompleteCb);
        prevScreen.animateOut();
      }else{
        this.onTransitionComplete();
      }
      break;

    case ScreenNavigator.TRANSITION_IN:
        if (this.prevItem) this.prevItem.getScreen().animateOut(true);

        this.onTransitionComplete();
      break;
  }
};

ScreenNavigator.prototype.onAnimateOutComplete = function() {
  var prevItem = this.getItem(this.prevItemId);
  var currentItem = this.getItem(this.currentItemId);
  var currentScreen = currentItem ? currentItem.getScreen() : null;
  var prevScreen = prevItem ? prevItem.getScreen() : null;

  this.animateCompleteCount++;
  
  switch(this.transitionType){
    case ScreenNavigator.TRANSITION_OUT_AND_IN:
      if (this.animateCompleteCount === 2 || !this.currentItem) this.onTransitionComplete();
      break;

    case ScreenNavigator.TRANSITION_OUT_THEN_IN:
      if (currentScreen){
        currentScreen.on('animateInComplete', this.animateInCompleteCb);
        currentScreen.animateIn();
      }else{
        this.onTransitionComplete();
      }
      break;

    case ScreenNavigator.TRANSITION_IN_THEN_OUT:
      this.onTransitionComplete();
      break;

    case ScreenNavigator.TRANSITION_OUT:
      if (this.currentItem) this.currentItem.getScreen().animateIn(true);

      this.onTransitionComplete();
      break;
  }
};

ScreenNavigator.prototype.onTransitionComplete = function() {
  this.transitionRunning = false;

  this.disposeTransition();

  this.emit('transitionComplete');
};

ScreenNavigator.prototype.dispose = function() {
  if (transitionRunning){
    this.cancelTransition();
  }
};

ScreenNavigator.prototype.disposeTransition = function() {
  var prevItem = this.getItem(this.prevItemId);
  var currentItem = this.getItem(this.currentItemId);
  var currentScreen = currentItem ? currentItem.getScreen() : null;
  var prevScreen = prevItem ? prevItem.getScreen() : null;

  if (prevScreen){
    prevScreen.off('animateInComplete', this.animateInCompleteCb)
              .off('animateOutComplete', this.animateOutCompleteCb);

    prevItem.disposeScreen();
  }

  if (currentScreen){
    currentScreen.off('animateInComplete', this.animateInCompleteCb)
                 .off('animateOutComplete', this.animateOutCompleteCb);
  }
};

module.exports.AScreen = require('./AScreen.js');
module.exports.ScreenNavigatorItem = ScreenNavigatorItem;

module.exports = ScreenNavigator;


},{"./AScreen.js":9,"./ScreenNavigatorItem.js":11,"inherits":7,"tiny-emitter":8}],11:[function(require,module,exports){
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


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9pbmRleC5qcyIsImV4YW1wbGUvcGFnZXMvQVBhZ2UuanMiLCJleGFtcGxlL3BhZ2VzL0Fib3V0LmpzIiwiZXhhbXBsZS9wYWdlcy9Db250YWN0LmpzIiwiZXhhbXBsZS9wYWdlcy9Ib21lLmpzIiwiZXhhbXBsZS9wYWdlcy9ob21lL0hvbWVTdWJQYWdlLmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdGlueS1lbWl0dGVyL2luZGV4LmpzIiwic3JjL0FTY3JlZW4uanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9yLmpzIiwic3JjL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBTY3JlZW5OYXZpZ2F0b3IgPSByZXF1aXJlKCcuLi9zcmMvU2NyZWVuTmF2aWdhdG9yLmpzJyk7XG52YXIgSG9tZSA9IHJlcXVpcmUoJy4vcGFnZXMvSG9tZS5qcycpO1xudmFyIEFib3V0ID0gcmVxdWlyZSgnLi9wYWdlcy9BYm91dC5qcycpO1xuXG52YXIgbmF2aWdhdG9yID0gbmV3IFNjcmVlbk5hdmlnYXRvcigpO1xuXG4vLyBsaXN0ZW4gc2NyZWVucyBjaGFuZ2VzXG5uYXZpZ2F0b3Iub24oJ2NoYW5nZScsIG9uUGFnZUNoYW5nZSk7XG5cbi8vIEFERCBTQ1JFRU5TXG4vLyBcbi8vIGFkZCBzY3JlZW4gaW5zdGFuY2Vcbm5hdmlnYXRvci5hZGRJdGVtKCdob21lJywgbmV3IEhvbWUoKSk7IFxuLy8gXG4vLyBhZGQgc2NyZWVuIGNsYXNzIHdpdGggb3B0aW9uc1xubmF2aWdhdG9yLmFkZEl0ZW0oJ2Fib3V0JywgQWJvdXQsIHtcblx0YXJndW1lbnRzOiBbJ25ldyBBYm91dCBwYWdlJ10sIC8vIGNvbnN0cnVjdG9yIGFyZ3VtZW50c1xuXHRwcm9wZXJ0aWVzOiB7fSwgLy8gc2V0IHByb3BlcnRpZXMgYXQgdGhlIHNjcmVlbiBpbml0aWFsaXphdGlvblxuXHRjYW5EaXNwb3NlOiBmYWxzZVxufSk7IFxuLy8gXG4vLyBhZGQgc2NyZWVuIGNsYXNzXG5uYXZpZ2F0b3IuYWRkSXRlbSgnY29udGFjdCcsIHJlcXVpcmUoJy4vcGFnZXMvQ29udGFjdC5qcycpKTsgXG5cbi8vIFNIT1cgRklSU1QgU0NSRUVOXG5uYXZpZ2F0b3Iuc2hvd1NjcmVlbignaG9tZScpO1xuXG52YXIgbmF2SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCduYXYgbGkgYScpO1xuXG4vLyBjbGljayBvbiBuYXYgbGlua3MgZm9yIHRoZSBleGFtcGxlXG5mb3IgKHZhciBpID0gMDsgaSA8IG5hdkl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gIG5hdkl0ZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgaWQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpLnNwbGl0KCcvJylbMV07XG4gICAgaWYgKGlkID09PSAnJykgaWQgPSAnaG9tZSc7XG5cbiAgICAvLyBzaG93IHNjcmVlblxuICAgIG5hdmlnYXRvci5zaG93U2NyZWVuKGlkKTtcbiAgfSlcbn07XG5cbmZ1bmN0aW9uIG9uUGFnZUNoYW5nZSgpe1xuICAvLyBjb25zb2xlLmxvZygnY2hhbmdlJyk7XG59XG4iLCJ2YXIgQVNjcmVlbiA9IHJlcXVpcmUoJy4uLy4uL3NyYy9BU2NyZWVuLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQVBhZ2UgPSBmdW5jdGlvbihpZCl7XG4gIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkICsgJy1wYWdlJyk7XG59O1xuXG5pbmhlcml0cyhBUGFnZSwgQVNjcmVlbik7XG5cbkFQYWdlLnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxuQVBhZ2UucHJvdG90eXBlLmFuaW1hdGVPdXQgPSBmdW5jdGlvbihjb21wbGV0ZSkge1xuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cbiAgaWYgKGNvbXBsZXRlKSB7XG4gICAgdGhpcy5vbkFuaW1hdGVPdXRDb21wbGV0ZSgpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFQYWdlO1xuXG4iLCJ2YXIgQVBhZ2UgPSByZXF1aXJlKCcuL0FQYWdlLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQWJvdXQgPSBmdW5jdGlvbihtc2cpe1xuXHRjb25zb2xlLmxvZyhtc2cpO1xuXHRcblx0QVBhZ2UuY2FsbCh0aGlzLCAnYWJvdXQnKTtcbn07XG5cbmluaGVyaXRzKEFib3V0LCBBUGFnZSk7XG5cbkFib3V0LnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBYm91dDtcbiIsInZhciBBUGFnZSA9IHJlcXVpcmUoJy4vQVBhZ2UuanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBDb250YWN0ID0gZnVuY3Rpb24oKXtcbiAgQVBhZ2UuY2FsbCh0aGlzLCAnY29udGFjdCcpO1xufTtcblxuaW5oZXJpdHMoQ29udGFjdCwgQVBhZ2UpO1xuXG5Db250YWN0LnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250YWN0O1xuIiwidmFyIEFQYWdlID0gcmVxdWlyZSgnLi9BUGFnZS5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbnZhciBTY3JlZW5OYXZpZ2F0b3IgPSByZXF1aXJlKCcuLi8uLi9zcmMvU2NyZWVuTmF2aWdhdG9yLmpzJyk7XG52YXIgSG9tZVN1YlBhZ2UgPSByZXF1aXJlKCcuL2hvbWUvSG9tZVN1YlBhZ2UuanMnKTtcblxudmFyIEhvbWUgPSBmdW5jdGlvbigpe1xuICBBUGFnZS5jYWxsKHRoaXMsICdob21lJyk7XG5cbiAgdmFyIHRoYXQgPSB0aGlzO1xuICB2YXIgc3ViUGFnZXNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3ViLXBhZ2VzLWNvbnRhaW5lcicpO1xuICB2YXIgbmF2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdWItcGFnZXMtbmF2IHVsJyk7XG5cbiAgdGhpcy5uYXZpZ2F0b3IgPSBuZXcgU2NyZWVuTmF2aWdhdG9yKCk7XG4gIHRoaXMubmF2aWdhdG9yLmRlZmF1bHRUcmFuc2l0aW9uVHlwZSA9IFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9BTkRfSU47XG4gIHRoaXMubmF2aWdhdG9yLm9uKCdjaGFuZ2UnLCB0aGlzLm9uU3ViUGFnZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgdGhpcy5uYXZpZ2F0b3Iub24oJ3RyYW5zaXRpb25Db21wbGV0ZScsIGZ1bmN0aW9uKCl7XG4gICAgY29uc29sZS5sb2coJ3RyYW5zaXRpb24gY29tcGxldGUnKTtcbiAgfSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICB0aGlzLm5hdmlnYXRvci5hZGRJdGVtKCdwYWdlJyArIGksIG5ldyBIb21lU3ViUGFnZShzdWJQYWdlc0NvbnRhaW5lciwgaSkpO1xuXG4gICAgdmFyIG5hdkl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIG5hdkl0ZW0uc2V0QXR0cmlidXRlKCdkYXRhLXNjcmVlbi1pZCcsICdwYWdlJyArIGkpO1xuICAgIG5hdkVsZW1lbnQuYXBwZW5kQ2hpbGQobmF2SXRlbSk7XG5cbiAgICB2YXIgbmF2TGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBuYXZMaW5rLmhyZWYgPSAnI3BhZ2UnICsgaTtcbiAgICBuYXZJdGVtLmFwcGVuZENoaWxkKG5hdkxpbmspO1xuXG4gICAgbmF2TGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHZhciBzY3JlZW5JZCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2NyZWVuLWlkJyk7XG5cbiAgICAgIHRoYXQubmF2aWdhdG9yLnNob3dTY3JlZW4oc2NyZWVuSWQpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMubmF2aWdhdG9yLnNob3dTY3JlZW4oJ3BhZ2UwJyk7XG59O1xuXG5pbmhlcml0cyhIb21lLCBBUGFnZSk7XG5cbkhvbWUucHJvdG90eXBlLm9uU3ViUGFnZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbmF2SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc3ViLXBhZ2VzLW5hdiBsaScpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmF2SXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAobmF2SXRlbXNbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLXNjcmVlbi1pZCcpID09PSB0aGlzLm5hdmlnYXRvci5jdXJyZW50SXRlbUlkKXtcbiAgICAgIG5hdkl0ZW1zW2ldLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1lbHNle1xuICAgICAgbmF2SXRlbXNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIb21lO1xuXG4iLCJ2YXIgQVNjcmVlbiA9IHJlcXVpcmUoJy4uLy4uLy4uL3NyYy9BU2NyZWVuLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgSG9tZUl0ZW0gPSBmdW5jdGlvbihjb250YWluZXIsIGluZGV4KXtcbiAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3N1Yi1wYWdlJyk7XG4gIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSAncGFnZSAnICsgaW5kZXg7XG5cbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG59O1xuXG5pbmhlcml0cyhIb21lSXRlbSwgQVNjcmVlbik7XG5cbkhvbWVJdGVtLnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGFuaW0gPSB0aGlzLmVsZW1lbnQuYW5pbWF0ZShbXG4gICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZSgxMDAlKSd9LFxuICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUoMCknfVxuICBdLCB7XG4gICAgZHVyYXRpb246IDEwMDAsIFxuICAgIGVhc2luZzogJ2N1YmljLWJlemllcigwLjE5MCwgMS4wMDAsIDAuMjIwLCAxLjAwMCknXG4gIH0pO1xuXG4gIGFuaW0uYWRkRXZlbnRMaXN0ZW5lcignZmluaXNoJywgdGhpcy5vbkFuaW1hdGVJbkNvbXBsZXRlLmJpbmQodGhpcykpO1xuXG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbn07XG5cbkhvbWVJdGVtLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIEFTY3JlZW4ucHJvdG90eXBlLm9uQW5pbWF0ZUluQ29tcGxldGUuY2FsbCh0aGlzKTtcbn07XG5cbkhvbWVJdGVtLnByb3RvdHlwZS5hbmltYXRlT3V0ID0gZnVuY3Rpb24oY29tcGxldGUpIHtcbiAgdmFyIGFuaW0gPSB0aGlzLmVsZW1lbnQuYW5pbWF0ZShbXG4gICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZSgwKSd9LFxuICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTEwMCUpJ31cbiAgXSwge1xuICAgIGR1cmF0aW9uOiAxMDAwLCBcbiAgICBlYXNpbmc6ICdjdWJpYy1iZXppZXIoMC4xOTAsIDEuMDAwLCAwLjIyMCwgMS4wMDApJ1xuICB9KTtcblxuICBhbmltLmFkZEV2ZW50TGlzdGVuZXIoJ2ZpbmlzaCcsIHRoaXMub25BbmltYXRlT3V0Q29tcGxldGUuYmluZCh0aGlzKSk7XG4gIFxuICBpZiAoY29tcGxldGUpIHtcbiAgICB0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlKCk7XG4gIH1cbn07XG5cbkhvbWVJdGVtLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICBBU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZS5jYWxsKHRoaXMpO1xuXG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSG9tZUl0ZW07XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsImZ1bmN0aW9uIEUgKCkge1xuXHQvLyBLZWVwIHRoaXMgZW1wdHkgc28gaXQncyBlYXNpZXIgdG8gaW5oZXJpdCBmcm9tXG4gIC8vICh2aWEgaHR0cHM6Ly9naXRodWIuY29tL2xpcHNtYWNrIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9pc3N1ZXMvMylcbn1cblxuRS5wcm90b3R5cGUgPSB7XG5cdG9uOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG4gICAgXG4gICAgKGVbbmFtZV0gfHwgKGVbbmFtZV0gPSBbXSkpLnB1c2goe1xuICAgICAgZm46IGNhbGxiYWNrLFxuICAgICAgY3R4OiBjdHhcbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvbmNlOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLm9mZihuYW1lLCBmbik7XG4gICAgICBjYWxsYmFjay5hcHBseShjdHgsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gdGhpcy5vbihuYW1lLCBmbiwgY3R4KTtcbiAgfSxcblxuICBlbWl0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBkYXRhID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBldnRBcnIgPSAoKHRoaXMuZSB8fCAodGhpcy5lID0ge30pKVtuYW1lXSB8fCBbXSkuc2xpY2UoKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGxlbiA9IGV2dEFyci5sZW5ndGg7XG4gICAgXG4gICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGV2dEFycltpXS5mbi5hcHBseShldnRBcnJbaV0uY3R4LCBkYXRhKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb2ZmOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuICAgIHZhciBldnRzID0gZVtuYW1lXTtcbiAgICB2YXIgbGl2ZUV2ZW50cyA9IFtdO1xuICAgIFxuICAgIGlmIChldnRzICYmIGNhbGxiYWNrKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZXZ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZXZ0c1tpXS5mbiAhPT0gY2FsbGJhY2spIGxpdmVFdmVudHMucHVzaChldnRzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gUmVtb3ZlIGV2ZW50IGZyb20gcXVldWUgdG8gcHJldmVudCBtZW1vcnkgbGVha1xuICAgIC8vIFN1Z2dlc3RlZCBieSBodHRwczovL2dpdGh1Yi5jb20vbGF6ZFxuICAgIC8vIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9jb21taXQvYzZlYmZhYTliYzk3M2IzM2QxMTBhODRhMzA3NzQyYjdjZjk0Yzk1MyNjb21taXRjb21tZW50LTUwMjQ5MTBcblxuICAgIChsaXZlRXZlbnRzLmxlbmd0aCkgXG4gICAgICA/IGVbbmFtZV0gPSBsaXZlRXZlbnRzXG4gICAgICA6IGRlbGV0ZSBlW25hbWVdO1xuICAgIFxuICAgIHJldHVybiB0aGlzO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEU7XG4iLCJ2YXIgVGlueUVtaXR0ZXIgPSByZXF1aXJlKCd0aW55LWVtaXR0ZXInKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBBU2NyZWVuID0gZnVuY3Rpb24oKXtcbn07XG5cbmluaGVyaXRzKEFTY3JlZW4sIFRpbnlFbWl0dGVyKTtcblxuQVNjcmVlbi5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oY29tcGxldGUpIHtcbiAgdGhpcy5vbkFuaW1hdGVJbkNvbXBsZXRlKCk7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgnYW5pbWF0ZUluQ29tcGxldGUnKTtcbn07XG5cbkFTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVPdXQgPSBmdW5jdGlvbihjb21wbGV0ZSkge1xuICB0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlKCk7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ2FuaW1hdGVPdXRDb21wbGV0ZScpO1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm9mZignYW5pbWF0ZUluQ29tcGxldGUnKVxuICAgICAgLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFTY3JlZW47IiwidmFyIFRpbnlFbWl0dGVyID0gcmVxdWlyZSgndGlueS1lbWl0dGVyJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xudmFyIFNjcmVlbk5hdmlnYXRvckl0ZW0gPSByZXF1aXJlKCcuL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMnKTtcblxudmFyIFNjcmVlbk5hdmlnYXRvciA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMuaXRlbXMgPSB7fTtcbiAgdGhpcy5jdXJyZW50SXRlbUlkID0gbnVsbDtcbiAgdGhpcy5wcmV2SXRlbUlkID0gbnVsbDtcblxuICB0aGlzLnRyYW5zaXRpb25SdW5uaW5nID0gZmFsc2U7XG4gIHRoaXMudHJhbnNpdGlvblR5cGUgPSBTY3JlZW5OYXZpZ2F0b3IuZGVmYXVsdFRyYW5zaXRpb25UeXBlO1xuXG4gIHRoaXMuYW5pbWF0ZUluQ29tcGxldGVDYiA9IHRoaXMub25BbmltYXRlSW5Db21wbGV0ZS5iaW5kKHRoaXMpO1xuICB0aGlzLmFuaW1hdGVPdXRDb21wbGV0ZUNiID0gdGhpcy5vbkFuaW1hdGVJbkNvbXBsZXRlLmJpbmQodGhpcyk7XG4gIHRoaXMuYW5pbWF0ZUNvbXBsZXRlQ291bnQgPSAwO1xufTtcblxuaW5oZXJpdHMoU2NyZWVuTmF2aWdhdG9yLCBUaW55RW1pdHRlcik7XG5cblNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9BTkRfSU4gPSAnb3V0QW5kSW4nO1xuU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX1RIRU5fSU4gPSAnb3V0VGhlbkluJztcblNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX0lOX1RIRU5fT1VUID0gJ2luVGhlbk91dCc7XG5TY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9PVVQgPSAnb3V0JztcblNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX0lOID0gJ2luJztcblNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX05PTkUgPSAnbm9uZSc7XG5cblNjcmVlbk5hdmlnYXRvci5kZWZhdWx0VHJhbnNpdGlvblR5cGUgPSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9OT05FO1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmFkZEl0ZW0gPSBmdW5jdGlvbihpZCwgc2NyZWVuLCBvcHRpb25zKSB7XG4gIHZhciBpdGVtID0gbmV3IFNjcmVlbk5hdmlnYXRvckl0ZW0oc2NyZWVuLCBvcHRpb25zKTtcblxuICB0aGlzLml0ZW1zW2lkXSA9IGl0ZW07XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmdldEl0ZW0gPSBmdW5jdGlvbihpZCkge1xuICByZXR1cm4gdGhpcy5pdGVtc1tpZF07XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLnNob3dTY3JlZW4gPSBmdW5jdGlvbihpZCwgdHJhbnNpdGlvblR5cGUpIHtcbiAgaWYgKGlkID09PSB0aGlzLmN1cnJlbnRJdGVtSWQpIHJldHVybjtcblxuICBpZiAodGhpcy5jdXJyZW50SXRlbUlkKXtcbiAgICB0aGlzLnByZXZJdGVtSWQgPSB0aGlzLmN1cnJlbnRJdGVtSWQ7XG4gIH1cblxuICB0aGlzLmN1cnJlbnRJdGVtSWQgPSBpZDtcblxuICB2YXIgY3VycmVudEl0ZW0gPSB0aGlzLmdldEl0ZW0oaWQpO1xuXG4gIGlmICghY3VycmVudEl0ZW0pe1xuICAgIHRocm93IG5ldyBFcnJvcignU2NyZWVuTmF2aWdhdG9yIC0gdGhlIGl0ZW0gd2l0aCB0aGUgaWQgJyArIGlkICsgJyBkb2VzblxcJ3QgZXhpc3QnKTtcbiAgfVxuXG4gIHRoaXMub25DaGFuZ2UoKTtcblxuICB0aGlzLnN0YXJ0VHJhbnNpdGlvbih0cmFuc2l0aW9uVHlwZSk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmNsZWFyU2NyZWVuID0gZnVuY3Rpb24odHJhbnNpdGlvblR5cGUpIHtcbiAgaWYgKHRoaXMuY3VycmVudFNjcmVlbil7XG4gICAgdGhpcy5wcmV2U2NyZWVuID0gdGhpcy5jdXJyZW50U2NyZWVuO1xuICB9XG5cbiAgdGhpcy5vbkNoYW5nZSgpO1xuXG4gIHRoaXMuc3RhcnRUcmFuc2l0aW9uKHRyYW5zaXRpb25UeXBlKTtcbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuc3RhcnRUcmFuc2l0aW9uID0gZnVuY3Rpb24odHJhbnNpdGlvblR5cGUpIHtcbiAgaWYgKHRoaXMudHJhbnNpdGlvblJ1bm5pbmcpe1xuICAgIHRoaXMuY2FuY2VsVHJhbnNpdGlvbigpO1xuICB9IFxuXG4gIHZhciBwcmV2SXRlbSA9IHRoaXMuZ2V0SXRlbSh0aGlzLnByZXZJdGVtSWQpO1xuICB2YXIgY3VycmVudEl0ZW0gPSB0aGlzLmdldEl0ZW0odGhpcy5jdXJyZW50SXRlbUlkKTtcbiAgdmFyIGN1cnJlbnRTY3JlZW4gPSBjdXJyZW50SXRlbSA/IGN1cnJlbnRJdGVtLmdldFNjcmVlbigpIDogbnVsbDtcbiAgdmFyIHByZXZTY3JlZW4gPSBwcmV2SXRlbSA/IHByZXZJdGVtLmdldFNjcmVlbigpIDogbnVsbDtcblxuICB0aGlzLmFuaW1hdGVDb21wbGV0ZUNvdW50ID0gMDtcbiAgdGhpcy50cmFuc2l0aW9uVHlwZSA9IHRyYW5zaXRpb25UeXBlID8gdHJhbnNpdGlvblR5cGUgOiB0aGlzLmRlZmF1bHRUcmFuc2l0aW9uVHlwZTtcblxuICBzd2l0Y2godGhpcy50cmFuc2l0aW9uVHlwZSl7XG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9PVVRfQU5EX0lOOlxuICAgICAgaWYgKHByZXZTY3JlZW4pIHtcbiAgICAgICAgcHJldlNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgdGhpcy5hbmltYXRlT3V0Q29tcGxldGVDYik7XG4gICAgICAgIHByZXZTY3JlZW4uYW5pbWF0ZU91dCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudFNjcmVlbikge1xuICAgICAgICBjdXJyZW50U2NyZWVuLm9uKCdhbmltYXRlSW5Db21wbGV0ZScsIHRoaXMuYW5pbWF0ZUluQ29tcGxldGVDYik7XG4gICAgICAgIGN1cnJlbnRTY3JlZW4uYW5pbWF0ZUluKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX1RIRU5fSU46XG4gICAgICBpZiAocHJldlNjcmVlbikge1xuICAgICAgICBwcmV2U2NyZWVuLm9uKCdhbmltYXRlT3V0Q29tcGxldGUnLCB0aGlzLmFuaW1hdGVPdXRDb21wbGV0ZUNiKTtcbiAgICAgICAgcHJldlNjcmVlbi5hbmltYXRlT3V0KCk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGhpcy5vbkFuaW1hdGVPdXRDb21wbGV0ZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX0lOX1RIRU5fT1VUOlxuICAgICAgaWYgKGN1cnJlbnRTY3JlZW4pIHtcbiAgICAgICAgY3VycmVudFNjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCB0aGlzLmFuaW1hdGVJbkNvbXBsZXRlQ2IpO1xuICAgICAgICBjdXJyZW50U2NyZWVuLmFuaW1hdGVJbigpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMub25BbmltYXRlSW5Db21wbGV0ZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVDpcbiAgICAgIGlmIChwcmV2U2NyZWVuKSB7XG4gICAgICAgIHByZXZTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIHRoaXMuYW5pbWF0ZU91dENvbXBsZXRlQ2IpO1xuICAgICAgICBwcmV2U2NyZWVuLmFuaW1hdGVPdXQoKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fSU46XG4gICAgICBpZiAoY3VycmVudFNjcmVlbikge1xuICAgICAgICBjdXJyZW50U2NyZWVuLm9uKCdhbmltYXRlSW5Db21wbGV0ZScsIHRoaXMuYW5pbWF0ZUluQ29tcGxldGVDYik7XG4gICAgICAgIGN1cnJlbnRTY3JlZW4uYW5pbWF0ZUluKCk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX05PTkU6XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXMudHJhbnNpdGlvblR5cGUgPSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9OT05FO1xuXG4gICAgICBpZiAocHJldlNjcmVlbikgcHJldlNjcmVlbi5hbmltYXRlT3V0KHRydWUpO1xuICAgICAgaWYgKGN1cnJlbnRTY3JlZW4pIGN1cnJlbnRTY3JlZW4uYW5pbWF0ZUluKHRydWUpO1xuXG4gICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHRoaXMub25UcmFuc2l0aW9uU3RhcnQoKTtcbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuY2FuY2VsVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKGNvbXBsZXRlKSB7XG4gIHZhciBwcmV2SXRlbSA9IHRoaXMuZ2V0SXRlbSh0aGlzLnByZXZJdGVtSWQpO1xuICB2YXIgY3VycmVudEl0ZW0gPSB0aGlzLmdldEl0ZW0odGhpcy5jdXJyZW50SXRlbUlkKTtcblxuICB0aGlzLnRyYW5zaXRpb25SdW5uaW5nID0gZmFsc2U7XG5cbiAgdGhpcy5kaXNwb3NlVHJhbnNpdGlvbigpO1xuXG4gIGlmIChwcmV2SXRlbSl7XG4gICAgcHJldkl0ZW0uZ2V0U2NyZWVuKCkuYW5pbWF0ZU91dCh0cnVlKTtcbiAgfVxuXG4gIGlmIChjdXJyZW50SXRlbSl7XG4gICAgY3VycmVudEl0ZW0uZ2V0U2NyZWVuKCkuYW5pbWF0ZU91dCh0cnVlKTtcbiAgfVxufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5vbkNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5vblRyYW5zaXRpb25TdGFydCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25TdGFydCcpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwcmV2SXRlbSA9IHRoaXMuZ2V0SXRlbSh0aGlzLnByZXZJdGVtSWQpO1xuICB2YXIgY3VycmVudEl0ZW0gPSB0aGlzLmdldEl0ZW0odGhpcy5jdXJyZW50SXRlbUlkKTtcbiAgdmFyIGN1cnJlbnRTY3JlZW4gPSBjdXJyZW50SXRlbSA/IGN1cnJlbnRJdGVtLmdldFNjcmVlbigpIDogbnVsbDtcbiAgdmFyIHByZXZTY3JlZW4gPSBwcmV2SXRlbSA/IHByZXZJdGVtLmdldFNjcmVlbigpIDogbnVsbDtcblxuICB0aGlzLmFuaW1hdGVDb21wbGV0ZUNvdW50Kys7IFxuICBcbiAgc3dpdGNoKHRoaXMudHJhbnNpdGlvblR5cGUpe1xuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX0FORF9JTjpcbiAgICAgIGlmICh0aGlzLmFuaW1hdGVDb21wbGV0ZUNvdW50ID09PSAyIHx8ICF0aGlzLnByZXZJdGVtKSB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX1RIRU5fSU46XG4gICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fSU5fVEhFTl9PVVQ6XG4gICAgICBpZiAocHJldlNjcmVlbil7XG4gICAgICAgIHByZXZTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIHRoaXMuYW5pbWF0ZU91dENvbXBsZXRlQ2IpO1xuICAgICAgICBwcmV2U2NyZWVuLmFuaW1hdGVPdXQoKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fSU46XG4gICAgICAgIGlmICh0aGlzLnByZXZJdGVtKSB0aGlzLnByZXZJdGVtLmdldFNjcmVlbigpLmFuaW1hdGVPdXQodHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHByZXZJdGVtID0gdGhpcy5nZXRJdGVtKHRoaXMucHJldkl0ZW1JZCk7XG4gIHZhciBjdXJyZW50SXRlbSA9IHRoaXMuZ2V0SXRlbSh0aGlzLmN1cnJlbnRJdGVtSWQpO1xuICB2YXIgY3VycmVudFNjcmVlbiA9IGN1cnJlbnRJdGVtID8gY3VycmVudEl0ZW0uZ2V0U2NyZWVuKCkgOiBudWxsO1xuICB2YXIgcHJldlNjcmVlbiA9IHByZXZJdGVtID8gcHJldkl0ZW0uZ2V0U2NyZWVuKCkgOiBudWxsO1xuXG4gIHRoaXMuYW5pbWF0ZUNvbXBsZXRlQ291bnQrKztcbiAgXG4gIHN3aXRjaCh0aGlzLnRyYW5zaXRpb25UeXBlKXtcbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9BTkRfSU46XG4gICAgICBpZiAodGhpcy5hbmltYXRlQ29tcGxldGVDb3VudCA9PT0gMiB8fCAhdGhpcy5jdXJyZW50SXRlbSkgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9USEVOX0lOOlxuICAgICAgaWYgKGN1cnJlbnRTY3JlZW4pe1xuICAgICAgICBjdXJyZW50U2NyZWVuLm9uKCdhbmltYXRlSW5Db21wbGV0ZScsIHRoaXMuYW5pbWF0ZUluQ29tcGxldGVDYik7XG4gICAgICAgIGN1cnJlbnRTY3JlZW4uYW5pbWF0ZUluKCk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX0lOX1RIRU5fT1VUOlxuICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVDpcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRJdGVtKSB0aGlzLmN1cnJlbnRJdGVtLmdldFNjcmVlbigpLmFuaW1hdGVJbih0cnVlKTtcblxuICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUub25UcmFuc2l0aW9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuXG4gIHRoaXMuZGlzcG9zZVRyYW5zaXRpb24oKTtcblxuICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25Db21wbGV0ZScpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0cmFuc2l0aW9uUnVubmluZyl7XG4gICAgdGhpcy5jYW5jZWxUcmFuc2l0aW9uKCk7XG4gIH1cbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuZGlzcG9zZVRyYW5zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHByZXZJdGVtID0gdGhpcy5nZXRJdGVtKHRoaXMucHJldkl0ZW1JZCk7XG4gIHZhciBjdXJyZW50SXRlbSA9IHRoaXMuZ2V0SXRlbSh0aGlzLmN1cnJlbnRJdGVtSWQpO1xuICB2YXIgY3VycmVudFNjcmVlbiA9IGN1cnJlbnRJdGVtID8gY3VycmVudEl0ZW0uZ2V0U2NyZWVuKCkgOiBudWxsO1xuICB2YXIgcHJldlNjcmVlbiA9IHByZXZJdGVtID8gcHJldkl0ZW0uZ2V0U2NyZWVuKCkgOiBudWxsO1xuXG4gIGlmIChwcmV2U2NyZWVuKXtcbiAgICBwcmV2U2NyZWVuLm9mZignYW5pbWF0ZUluQ29tcGxldGUnLCB0aGlzLmFuaW1hdGVJbkNvbXBsZXRlQ2IpXG4gICAgICAgICAgICAgIC5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScsIHRoaXMuYW5pbWF0ZU91dENvbXBsZXRlQ2IpO1xuXG4gICAgcHJldkl0ZW0uZGlzcG9zZVNjcmVlbigpO1xuICB9XG5cbiAgaWYgKGN1cnJlbnRTY3JlZW4pe1xuICAgIGN1cnJlbnRTY3JlZW4ub2ZmKCdhbmltYXRlSW5Db21wbGV0ZScsIHRoaXMuYW5pbWF0ZUluQ29tcGxldGVDYilcbiAgICAgICAgICAgICAgICAgLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgdGhpcy5hbmltYXRlT3V0Q29tcGxldGVDYik7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLkFTY3JlZW4gPSByZXF1aXJlKCcuL0FTY3JlZW4uanMnKTtcbm1vZHVsZS5leHBvcnRzLlNjcmVlbk5hdmlnYXRvckl0ZW0gPSBTY3JlZW5OYXZpZ2F0b3JJdGVtO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNjcmVlbk5hdmlnYXRvcjtcblxuIiwidmFyIFNjcmVlbk5hdmlnYXRvckl0ZW0gPSBmdW5jdGlvbihzY3JlZW4sIG9wdGlvbnMpe1xuICB0aGlzLnNjcmVlbiA9IHNjcmVlbjtcblxuICB0aGlzLmlzSW5zdGFuY2UgPSB0eXBlb2Ygc2NyZWVuICE9PSAnZnVuY3Rpb24nO1xuICB0aGlzLmluc3RhbmNlID0gdGhpcy5pc0luc3RhbmNlID8gc2NyZWVuIDogbnVsbDtcblxuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdGhpcy5hcmd1bWVudHMgPSBudWxsO1xuICB0aGlzLnByb3BlcnRpZXMgPSBudWxsO1xuICB0aGlzLmNhbkRpc3Bvc2UgPSAhdGhpcy5pc0luc3RhbmNlO1xuXG4gIGZvciAodmFyIG9wdGlvbktleSBpbiBvcHRpb25zKXtcbiAgICBpZiAodHlwZW9mIHRoaXNbb3B0aW9uS2V5XSAhPT0gJ3VuZGVmaW5lZCcpIHRoaXNbb3B0aW9uS2V5XSA9IG9wdGlvbnNbb3B0aW9uS2V5XTtcbiAgfVxufTtcblxuU2NyZWVuTmF2aWdhdG9ySXRlbS5wcm90b3R5cGUuZ2V0U2NyZWVuID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5pbnN0YW5jZSl7XG4gICAgdmFyIGFyZ3MgPSB0aGlzLmFyZ3VtZW50cztcbiAgICB2YXIgY29uc3RydWN0b3IgPSB0aGlzLnNjcmVlbjtcblxuICAgIGZ1bmN0aW9uIEYoKXtcbiAgICAgIGNvbnN0cnVjdG9yLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cblxuICAgIEYucHJvdG90eXBlID0gY29uc3RydWN0b3IucHJvdG90eXBlO1xuXG4gICAgdGhpcy5pbnN0YW5jZSA9IG5ldyBGKCk7XG4gIH1cblxuICBpZiAodGhpcy5wcm9wZXJ0aWVzKXtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5wcm9wZXJ0aWVzKXtcbiAgICAgIHRoaXMuaW5zdGFuY2Vba2V5XSA9IHRoaXMucHJvcGVydGllc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLmluc3RhbmNlO1xufTtcblxuU2NyZWVuTmF2aWdhdG9ySXRlbS5wcm90b3R5cGUuZGlzcG9zZVNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuY2FuRGlzcG9zZSkgcmV0dXJuO1xuXG4gIHRoaXMuaW5zdGFuY2UuZGlzcG9zZSgpO1xuICB0aGlzLmluc3RhbmNlID0gbnVsbDtcbn07XG5cblNjcmVlbk5hdmlnYXRvckl0ZW0ucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuaW5zdGFuY2Upe1xuICAgIHRoaXMuaW5zdGFuY2UuZGlzcG9zZSgpO1xuICB9XG5cbiAgdGhpcy5pbnN0YW5jZSA9IHRoaXMuc2NyZWVuID0gbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2NyZWVuTmF2aWdhdG9ySXRlbTtcblxuIl19
