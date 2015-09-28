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
	arguments: ['yes'], // constructor arguments
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
  this.currentItem = null;
  this.currentItemId = null;
  this.prevItem = null;

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

  if (this.currentItem){
    this.prevItem = this.currentItem;
  }

  this.currentItemId = id;
  this.currentItem = this.getItem(id);

  if (!this.currentItem){
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

  var currentScreen = this.currentItem ? this.currentItem.getScreen() : null;
  var prevScreen = this.prevItem ? this.prevItem.getScreen() : null;

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
  this.transitionRunning = false;

  this.disposeTransition();

  if (this.prevItem){
    this.prevItem.getScreen().animateOut(true);
  }

  if (this.currentItem){
    this.currentItem.getScreen().animateOut(true);
  }
};

ScreenNavigator.prototype.onChange = function() {
  this.emit('change');
};

ScreenNavigator.prototype.onTransitionStart = function() {
  this.emit('transitionStart');
};

ScreenNavigator.prototype.onAnimateInComplete = function() {
  var currentScreen = this.currentItem ? this.currentItem.getScreen() : null;
  var prevScreen = this.prevItem ? this.prevItem.getScreen() : null;

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
  var currentScreen = this.currentItem ? this.currentItem.getScreen() : null;
  var prevScreen = this.prevItem ? this.prevItem.getScreen() : null;

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
  var currentScreen = this.currentItem ? this.currentItem.getScreen() : null;
  var prevScreen = this.prevItem ? this.prevItem.getScreen() : null;

  if (prevScreen){
    prevScreen.off('animateInComplete', this.animateInCompleteCb)
              .off('animateOutComplete', this.animateOutCompleteCb);

    this.prevItem.disposeScreen();
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9pbmRleC5qcyIsImV4YW1wbGUvcGFnZXMvQVBhZ2UuanMiLCJleGFtcGxlL3BhZ2VzL0Fib3V0LmpzIiwiZXhhbXBsZS9wYWdlcy9Db250YWN0LmpzIiwiZXhhbXBsZS9wYWdlcy9Ib21lLmpzIiwiZXhhbXBsZS9wYWdlcy9ob21lL0hvbWVTdWJQYWdlLmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdGlueS1lbWl0dGVyL2luZGV4LmpzIiwic3JjL0FTY3JlZW4uanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9yLmpzIiwic3JjL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFNjcmVlbk5hdmlnYXRvciA9IHJlcXVpcmUoJy4uL3NyYy9TY3JlZW5OYXZpZ2F0b3IuanMnKTtcbnZhciBIb21lID0gcmVxdWlyZSgnLi9wYWdlcy9Ib21lLmpzJyk7XG52YXIgQWJvdXQgPSByZXF1aXJlKCcuL3BhZ2VzL0Fib3V0LmpzJyk7XG5cbnZhciBuYXZpZ2F0b3IgPSBuZXcgU2NyZWVuTmF2aWdhdG9yKCk7XG5cbi8vIGxpc3RlbiBzY3JlZW5zIGNoYW5nZXNcbm5hdmlnYXRvci5vbignY2hhbmdlJywgb25QYWdlQ2hhbmdlKTtcblxuLy8gQUREIFNDUkVFTlNcbi8vIFxuLy8gYWRkIHNjcmVlbiBpbnN0YW5jZVxubmF2aWdhdG9yLmFkZEl0ZW0oJ2hvbWUnLCBuZXcgSG9tZSgpKTsgXG4vLyBcbi8vIGFkZCBzY3JlZW4gY2xhc3Mgd2l0aCBvcHRpb25zXG5uYXZpZ2F0b3IuYWRkSXRlbSgnYWJvdXQnLCBBYm91dCwge1xuXHRhcmd1bWVudHM6IFsneWVzJ10sIC8vIGNvbnN0cnVjdG9yIGFyZ3VtZW50c1xuXHRwcm9wZXJ0aWVzOiB7fSwgLy8gc2V0IHByb3BlcnRpZXMgYXQgdGhlIHNjcmVlbiBpbml0aWFsaXphdGlvblxuXHRjYW5EaXNwb3NlOiBmYWxzZVxufSk7IFxuLy8gXG4vLyBhZGQgc2NyZWVuIGNsYXNzXG5uYXZpZ2F0b3IuYWRkSXRlbSgnY29udGFjdCcsIHJlcXVpcmUoJy4vcGFnZXMvQ29udGFjdC5qcycpKTsgXG5cbi8vIFNIT1cgRklSU1QgU0NSRUVOXG5uYXZpZ2F0b3Iuc2hvd1NjcmVlbignaG9tZScpO1xuXG52YXIgbmF2SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCduYXYgbGkgYScpO1xuXG4vLyBjbGljayBvbiBuYXYgbGlua3MgZm9yIHRoZSBleGFtcGxlXG5mb3IgKHZhciBpID0gMDsgaSA8IG5hdkl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gIG5hdkl0ZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgaWQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpLnNwbGl0KCcvJylbMV07XG4gICAgaWYgKGlkID09PSAnJykgaWQgPSAnaG9tZSc7XG5cbiAgICAvLyBzaG93IHNjcmVlblxuICAgIG5hdmlnYXRvci5zaG93U2NyZWVuKGlkKTtcbiAgfSlcbn07XG5cbmZ1bmN0aW9uIG9uUGFnZUNoYW5nZSgpe1xuICAvLyBjb25zb2xlLmxvZygnY2hhbmdlJyk7XG59XG4iLCJ2YXIgQVNjcmVlbiA9IHJlcXVpcmUoJy4uLy4uL3NyYy9BU2NyZWVuLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQVBhZ2UgPSBmdW5jdGlvbihpZCl7XG4gIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkICsgJy1wYWdlJyk7XG59O1xuXG5pbmhlcml0cyhBUGFnZSwgQVNjcmVlbik7XG5cbkFQYWdlLnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxuQVBhZ2UucHJvdG90eXBlLmFuaW1hdGVPdXQgPSBmdW5jdGlvbihjb21wbGV0ZSkge1xuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cbiAgaWYgKGNvbXBsZXRlKSB7XG4gICAgdGhpcy5vbkFuaW1hdGVPdXRDb21wbGV0ZSgpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFQYWdlO1xuXG4iLCJ2YXIgQVBhZ2UgPSByZXF1aXJlKCcuL0FQYWdlLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQWJvdXQgPSBmdW5jdGlvbihtc2cpe1xuXHRjb25zb2xlLmxvZyhtc2cpO1xuICBBUGFnZS5jYWxsKHRoaXMsICdhYm91dCcpO1xufTtcblxuaW5oZXJpdHMoQWJvdXQsIEFQYWdlKTtcblxuQWJvdXQucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFib3V0O1xuIiwidmFyIEFQYWdlID0gcmVxdWlyZSgnLi9BUGFnZS5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIENvbnRhY3QgPSBmdW5jdGlvbigpe1xuICBBUGFnZS5jYWxsKHRoaXMsICdjb250YWN0Jyk7XG59O1xuXG5pbmhlcml0cyhDb250YWN0LCBBUGFnZSk7XG5cbkNvbnRhY3QucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRhY3Q7XG4iLCJ2YXIgQVBhZ2UgPSByZXF1aXJlKCcuL0FQYWdlLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xudmFyIFNjcmVlbk5hdmlnYXRvciA9IHJlcXVpcmUoJy4uLy4uL3NyYy9TY3JlZW5OYXZpZ2F0b3IuanMnKTtcbnZhciBIb21lU3ViUGFnZSA9IHJlcXVpcmUoJy4vaG9tZS9Ib21lU3ViUGFnZS5qcycpO1xuXG52YXIgSG9tZSA9IGZ1bmN0aW9uKCl7XG4gIEFQYWdlLmNhbGwodGhpcywgJ2hvbWUnKTtcblxuICB2YXIgdGhhdCA9IHRoaXM7XG4gIHZhciBzdWJQYWdlc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdWItcGFnZXMtY29udGFpbmVyJyk7XG4gIHZhciBuYXZFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN1Yi1wYWdlcy1uYXYgdWwnKTtcblxuICB0aGlzLm5hdmlnYXRvciA9IG5ldyBTY3JlZW5OYXZpZ2F0b3IoKTtcbiAgdGhpcy5uYXZpZ2F0b3IuZGVmYXVsdFRyYW5zaXRpb25UeXBlID0gU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX0FORF9JTjtcbiAgdGhpcy5uYXZpZ2F0b3Iub24oJ2NoYW5nZScsIHRoaXMub25TdWJQYWdlQ2hhbmdlLmJpbmQodGhpcykpO1xuICB0aGlzLm5hdmlnYXRvci5vbigndHJhbnNpdGlvbkNvbXBsZXRlJywgZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZygndHJhbnNpdGlvbiBjb21wbGV0ZScpO1xuICB9KTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgIHRoaXMubmF2aWdhdG9yLmFkZEl0ZW0oJ3BhZ2UnICsgaSwgbmV3IEhvbWVTdWJQYWdlKHN1YlBhZ2VzQ29udGFpbmVyLCBpKSk7XG5cbiAgICB2YXIgbmF2SXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgbmF2SXRlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2NyZWVuLWlkJywgJ3BhZ2UnICsgaSk7XG4gICAgbmF2RWxlbWVudC5hcHBlbmRDaGlsZChuYXZJdGVtKTtcblxuICAgIHZhciBuYXZMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIG5hdkxpbmsuaHJlZiA9ICcjcGFnZScgKyBpO1xuICAgIG5hdkl0ZW0uYXBwZW5kQ2hpbGQobmF2TGluayk7XG5cbiAgICBuYXZMaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdmFyIHNjcmVlbklkID0gZXZlbnQuY3VycmVudFRhcmdldC5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1zY3JlZW4taWQnKTtcblxuICAgICAgdGhhdC5uYXZpZ2F0b3Iuc2hvd1NjcmVlbihzY3JlZW5JZCk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5uYXZpZ2F0b3Iuc2hvd1NjcmVlbigncGFnZTAnKTtcbn07XG5cbmluaGVyaXRzKEhvbWUsIEFQYWdlKTtcblxuSG9tZS5wcm90b3R5cGUub25TdWJQYWdlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBuYXZJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdWItcGFnZXMtbmF2IGxpJyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXZJdGVtcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChuYXZJdGVtc1tpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2NyZWVuLWlkJykgPT09IHRoaXMubmF2aWdhdG9yLmN1cnJlbnRJdGVtSWQpe1xuICAgICAgbmF2SXRlbXNbaV0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgfWVsc2V7XG4gICAgICBuYXZJdGVtc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWU7XG5cbiIsInZhciBBU2NyZWVuID0gcmVxdWlyZSgnLi4vLi4vLi4vc3JjL0FTY3JlZW4uanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBIb21lSXRlbSA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgaW5kZXgpe1xuICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc3ViLXBhZ2UnKTtcbiAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9ICdwYWdlICcgKyBpbmRleDtcblxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcbn07XG5cbmluaGVyaXRzKEhvbWVJdGVtLCBBU2NyZWVuKTtcblxuSG9tZUl0ZW0ucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYW5pbSA9IHRoaXMuZWxlbWVudC5hbmltYXRlKFtcbiAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlKDEwMCUpJ30sXG4gICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZSgwKSd9XG4gIF0sIHtcbiAgICBkdXJhdGlvbjogMTAwMCwgXG4gICAgZWFzaW5nOiAnY3ViaWMtYmV6aWVyKDAuMTkwLCAxLjAwMCwgMC4yMjAsIDEuMDAwKSdcbiAgfSk7XG5cbiAgYW5pbS5hZGRFdmVudExpc3RlbmVyKCdmaW5pc2gnLCB0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUuYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxuSG9tZUl0ZW0ucHJvdG90eXBlLm9uQW5pbWF0ZUluQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZS5jYWxsKHRoaXMpO1xufTtcblxuSG9tZUl0ZW0ucHJvdG90eXBlLmFuaW1hdGVPdXQgPSBmdW5jdGlvbihjb21wbGV0ZSkge1xuICB2YXIgYW5pbSA9IHRoaXMuZWxlbWVudC5hbmltYXRlKFtcbiAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlKDApJ30sXG4gICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZSgtMTAwJSknfVxuICBdLCB7XG4gICAgZHVyYXRpb246IDEwMDAsIFxuICAgIGVhc2luZzogJ2N1YmljLWJlemllcigwLjE5MCwgMS4wMDAsIDAuMjIwLCAxLjAwMCknXG4gIH0pO1xuXG4gIGFuaW0uYWRkRXZlbnRMaXN0ZW5lcignZmluaXNoJywgdGhpcy5vbkFuaW1hdGVPdXRDb21wbGV0ZS5iaW5kKHRoaXMpKTtcbiAgXG4gIGlmIChjb21wbGV0ZSkge1xuICAgIHRoaXMub25BbmltYXRlT3V0Q29tcGxldGUoKTtcbiAgfVxufTtcblxuSG9tZUl0ZW0ucHJvdG90eXBlLm9uQW5pbWF0ZU91dENvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIEFTY3JlZW4ucHJvdG90eXBlLm9uQW5pbWF0ZU91dENvbXBsZXRlLmNhbGwodGhpcyk7XG5cbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIb21lSXRlbTtcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiZnVuY3Rpb24gRSAoKSB7XG5cdC8vIEtlZXAgdGhpcyBlbXB0eSBzbyBpdCdzIGVhc2llciB0byBpbmhlcml0IGZyb21cbiAgLy8gKHZpYSBodHRwczovL2dpdGh1Yi5jb20vbGlwc21hY2sgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2lzc3Vlcy8zKVxufVxuXG5FLnByb3RvdHlwZSA9IHtcblx0b246IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcbiAgICBcbiAgICAoZVtuYW1lXSB8fCAoZVtuYW1lXSA9IFtdKSkucHVzaCh7XG4gICAgICBmbjogY2FsbGJhY2ssXG4gICAgICBjdHg6IGN0eFxuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9uY2U6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBmbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYub2ZmKG5hbWUsIGZuKTtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGN0eCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiB0aGlzLm9uKG5hbWUsIGZuLCBjdHgpO1xuICB9LFxuXG4gIGVtaXQ6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIGRhdGEgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGV2dEFyciA9ICgodGhpcy5lIHx8ICh0aGlzLmUgPSB7fSkpW25hbWVdIHx8IFtdKS5zbGljZSgpO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbGVuID0gZXZ0QXJyLmxlbmd0aDtcbiAgICBcbiAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgZXZ0QXJyW2ldLmZuLmFwcGx5KGV2dEFycltpXS5jdHgsIGRhdGEpO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvZmY6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG4gICAgdmFyIGV2dHMgPSBlW25hbWVdO1xuICAgIHZhciBsaXZlRXZlbnRzID0gW107XG4gICAgXG4gICAgaWYgKGV2dHMgJiYgY2FsbGJhY2spIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBldnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChldnRzW2ldLmZuICE9PSBjYWxsYmFjaykgbGl2ZUV2ZW50cy5wdXNoKGV2dHNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBSZW1vdmUgZXZlbnQgZnJvbSBxdWV1ZSB0byBwcmV2ZW50IG1lbW9yeSBsZWFrXG4gICAgLy8gU3VnZ2VzdGVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9sYXpkXG4gICAgLy8gUmVmOiBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2NvbW1pdC9jNmViZmFhOWJjOTczYjMzZDExMGE4NGEzMDc3NDJiN2NmOTRjOTUzI2NvbW1pdGNvbW1lbnQtNTAyNDkxMFxuXG4gICAgKGxpdmVFdmVudHMubGVuZ3RoKSBcbiAgICAgID8gZVtuYW1lXSA9IGxpdmVFdmVudHNcbiAgICAgIDogZGVsZXRlIGVbbmFtZV07XG4gICAgXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRTtcbiIsInZhciBUaW55RW1pdHRlciA9IHJlcXVpcmUoJ3RpbnktZW1pdHRlcicpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIEFTY3JlZW4gPSBmdW5jdGlvbigpe1xufTtcblxuaW5oZXJpdHMoQVNjcmVlbiwgVGlueUVtaXR0ZXIpO1xuXG5BU2NyZWVuLnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbihjb21wbGV0ZSkge1xuICB0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUoKTtcbn07XG5cbkFTY3JlZW4ucHJvdG90eXBlLm9uQW5pbWF0ZUluQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbWl0KCdhbmltYXRlSW5Db21wbGV0ZScpO1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUuYW5pbWF0ZU91dCA9IGZ1bmN0aW9uKGNvbXBsZXRlKSB7XG4gIHRoaXMub25BbmltYXRlT3V0Q29tcGxldGUoKTtcbn07XG5cbkFTY3JlZW4ucHJvdG90eXBlLm9uQW5pbWF0ZU91dENvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgnYW5pbWF0ZU91dENvbXBsZXRlJyk7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMub2ZmKCdhbmltYXRlSW5Db21wbGV0ZScpXG4gICAgICAub2ZmKCdhbmltYXRlT3V0Q29tcGxldGUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQVNjcmVlbjsiLCJ2YXIgVGlueUVtaXR0ZXIgPSByZXF1aXJlKCd0aW55LWVtaXR0ZXInKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG52YXIgU2NyZWVuTmF2aWdhdG9ySXRlbSA9IHJlcXVpcmUoJy4vU2NyZWVuTmF2aWdhdG9ySXRlbS5qcycpO1xuXG52YXIgU2NyZWVuTmF2aWdhdG9yID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5pdGVtcyA9IHt9O1xuICB0aGlzLmN1cnJlbnRJdGVtID0gbnVsbDtcbiAgdGhpcy5jdXJyZW50SXRlbUlkID0gbnVsbDtcbiAgdGhpcy5wcmV2SXRlbSA9IG51bGw7XG5cbiAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuICB0aGlzLnRyYW5zaXRpb25UeXBlID0gU2NyZWVuTmF2aWdhdG9yLmRlZmF1bHRUcmFuc2l0aW9uVHlwZTtcblxuICB0aGlzLmFuaW1hdGVJbkNvbXBsZXRlQ2IgPSB0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUuYmluZCh0aGlzKTtcbiAgdGhpcy5hbmltYXRlT3V0Q29tcGxldGVDYiA9IHRoaXMub25BbmltYXRlSW5Db21wbGV0ZS5iaW5kKHRoaXMpO1xuICB0aGlzLmFuaW1hdGVDb21wbGV0ZUNvdW50ID0gMDtcbn07XG5cbmluaGVyaXRzKFNjcmVlbk5hdmlnYXRvciwgVGlueUVtaXR0ZXIpO1xuXG5TY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9PVVRfQU5EX0lOID0gJ291dEFuZEluJztcblNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9USEVOX0lOID0gJ291dFRoZW5Jbic7XG5TY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9JTl9USEVOX09VVCA9ICdpblRoZW5PdXQnO1xuU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUID0gJ291dCc7XG5TY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9JTiA9ICdpbic7XG5TY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9OT05FID0gJ25vbmUnO1xuXG5TY3JlZW5OYXZpZ2F0b3IuZGVmYXVsdFRyYW5zaXRpb25UeXBlID0gU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fTk9ORTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5hZGRJdGVtID0gZnVuY3Rpb24oaWQsIHNjcmVlbiwgb3B0aW9ucykge1xuICB2YXIgaXRlbSA9IG5ldyBTY3JlZW5OYXZpZ2F0b3JJdGVtKHNjcmVlbiwgb3B0aW9ucyk7XG5cbiAgdGhpcy5pdGVtc1tpZF0gPSBpdGVtO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5nZXRJdGVtID0gZnVuY3Rpb24oaWQpIHtcbiAgcmV0dXJuIHRoaXMuaXRlbXNbaWRdO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5zaG93U2NyZWVuID0gZnVuY3Rpb24oaWQsIHRyYW5zaXRpb25UeXBlKSB7XG4gIGlmIChpZCA9PT0gdGhpcy5jdXJyZW50SXRlbUlkKSByZXR1cm47XG5cbiAgaWYgKHRoaXMuY3VycmVudEl0ZW0pe1xuICAgIHRoaXMucHJldkl0ZW0gPSB0aGlzLmN1cnJlbnRJdGVtO1xuICB9XG5cbiAgdGhpcy5jdXJyZW50SXRlbUlkID0gaWQ7XG4gIHRoaXMuY3VycmVudEl0ZW0gPSB0aGlzLmdldEl0ZW0oaWQpO1xuXG4gIGlmICghdGhpcy5jdXJyZW50SXRlbSl7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTY3JlZW5OYXZpZ2F0b3IgLSB0aGUgaXRlbSB3aXRoIHRoZSBpZCAnICsgaWQgKyAnIGRvZXNuXFwndCBleGlzdCcpO1xuICB9XG5cbiAgdGhpcy5vbkNoYW5nZSgpO1xuXG4gIHRoaXMuc3RhcnRUcmFuc2l0aW9uKHRyYW5zaXRpb25UeXBlKTtcbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuY2xlYXJTY3JlZW4gPSBmdW5jdGlvbih0cmFuc2l0aW9uVHlwZSkge1xuICBpZiAodGhpcy5jdXJyZW50U2NyZWVuKXtcbiAgICB0aGlzLnByZXZTY3JlZW4gPSB0aGlzLmN1cnJlbnRTY3JlZW47XG4gIH1cblxuICB0aGlzLm9uQ2hhbmdlKCk7XG5cbiAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvblR5cGUpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5zdGFydFRyYW5zaXRpb24gPSBmdW5jdGlvbih0cmFuc2l0aW9uVHlwZSkge1xuICBpZiAodGhpcy50cmFuc2l0aW9uUnVubmluZyl7XG4gICAgdGhpcy5jYW5jZWxUcmFuc2l0aW9uKCk7XG4gIH0gXG5cbiAgdmFyIGN1cnJlbnRTY3JlZW4gPSB0aGlzLmN1cnJlbnRJdGVtID8gdGhpcy5jdXJyZW50SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG4gIHZhciBwcmV2U2NyZWVuID0gdGhpcy5wcmV2SXRlbSA/IHRoaXMucHJldkl0ZW0uZ2V0U2NyZWVuKCkgOiBudWxsO1xuXG4gIHRoaXMuYW5pbWF0ZUNvbXBsZXRlQ291bnQgPSAwO1xuICB0aGlzLnRyYW5zaXRpb25UeXBlID0gdHJhbnNpdGlvblR5cGUgPyB0cmFuc2l0aW9uVHlwZSA6IHRoaXMuZGVmYXVsdFRyYW5zaXRpb25UeXBlO1xuXG4gIHN3aXRjaCh0aGlzLnRyYW5zaXRpb25UeXBlKXtcbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9BTkRfSU46XG4gICAgICBpZiAocHJldlNjcmVlbikge1xuICAgICAgICBwcmV2U2NyZWVuLm9uKCdhbmltYXRlT3V0Q29tcGxldGUnLCB0aGlzLmFuaW1hdGVPdXRDb21wbGV0ZUNiKTtcbiAgICAgICAgcHJldlNjcmVlbi5hbmltYXRlT3V0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjdXJyZW50U2NyZWVuKSB7XG4gICAgICAgIGN1cnJlbnRTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgdGhpcy5hbmltYXRlSW5Db21wbGV0ZUNiKTtcbiAgICAgICAgY3VycmVudFNjcmVlbi5hbmltYXRlSW4oKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9PVVRfVEhFTl9JTjpcbiAgICAgIGlmIChwcmV2U2NyZWVuKSB7XG4gICAgICAgIHByZXZTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIHRoaXMuYW5pbWF0ZU91dENvbXBsZXRlQ2IpO1xuICAgICAgICBwcmV2U2NyZWVuLmFuaW1hdGVPdXQoKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fSU5fVEhFTl9PVVQ6XG4gICAgICBpZiAoY3VycmVudFNjcmVlbikge1xuICAgICAgICBjdXJyZW50U2NyZWVuLm9uKCdhbmltYXRlSW5Db21wbGV0ZScsIHRoaXMuYW5pbWF0ZUluQ29tcGxldGVDYik7XG4gICAgICAgIGN1cnJlbnRTY3JlZW4uYW5pbWF0ZUluKCk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGhpcy5vbkFuaW1hdGVJbkNvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUOlxuICAgICAgaWYgKHByZXZTY3JlZW4pIHtcbiAgICAgICAgcHJldlNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgdGhpcy5hbmltYXRlT3V0Q29tcGxldGVDYik7XG4gICAgICAgIHByZXZTY3JlZW4uYW5pbWF0ZU91dCgpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9JTjpcbiAgICAgIGlmIChjdXJyZW50U2NyZWVuKSB7XG4gICAgICAgIGN1cnJlbnRTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgdGhpcy5hbmltYXRlSW5Db21wbGV0ZUNiKTtcbiAgICAgICAgY3VycmVudFNjcmVlbi5hbmltYXRlSW4oKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fTk9ORTpcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpcy50cmFuc2l0aW9uVHlwZSA9IFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX05PTkU7XG5cbiAgICAgIGlmIChwcmV2U2NyZWVuKSBwcmV2U2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG4gICAgICBpZiAoY3VycmVudFNjcmVlbikgY3VycmVudFNjcmVlbi5hbmltYXRlSW4odHJ1ZSk7XG5cbiAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUoKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdGhpcy5vblRyYW5zaXRpb25TdGFydCgpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5jYW5jZWxUcmFuc2l0aW9uID0gZnVuY3Rpb24oY29tcGxldGUpIHtcbiAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuXG4gIHRoaXMuZGlzcG9zZVRyYW5zaXRpb24oKTtcblxuICBpZiAodGhpcy5wcmV2SXRlbSl7XG4gICAgdGhpcy5wcmV2SXRlbS5nZXRTY3JlZW4oKS5hbmltYXRlT3V0KHRydWUpO1xuICB9XG5cbiAgaWYgKHRoaXMuY3VycmVudEl0ZW0pe1xuICAgIHRoaXMuY3VycmVudEl0ZW0uZ2V0U2NyZWVuKCkuYW5pbWF0ZU91dCh0cnVlKTtcbiAgfVxufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5vbkNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5vblRyYW5zaXRpb25TdGFydCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25TdGFydCcpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjdXJyZW50U2NyZWVuID0gdGhpcy5jdXJyZW50SXRlbSA/IHRoaXMuY3VycmVudEl0ZW0uZ2V0U2NyZWVuKCkgOiBudWxsO1xuICB2YXIgcHJldlNjcmVlbiA9IHRoaXMucHJldkl0ZW0gPyB0aGlzLnByZXZJdGVtLmdldFNjcmVlbigpIDogbnVsbDtcblxuICB0aGlzLmFuaW1hdGVDb21wbGV0ZUNvdW50Kys7IFxuICBcbiAgc3dpdGNoKHRoaXMudHJhbnNpdGlvblR5cGUpe1xuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX0FORF9JTjpcbiAgICAgIGlmICh0aGlzLmFuaW1hdGVDb21wbGV0ZUNvdW50ID09PSAyIHx8ICF0aGlzLnByZXZJdGVtKSB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX1RIRU5fSU46XG4gICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fSU5fVEhFTl9PVVQ6XG4gICAgICBpZiAocHJldlNjcmVlbil7XG4gICAgICAgIHByZXZTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIHRoaXMuYW5pbWF0ZU91dENvbXBsZXRlQ2IpO1xuICAgICAgICBwcmV2U2NyZWVuLmFuaW1hdGVPdXQoKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fSU46XG4gICAgICAgIGlmICh0aGlzLnByZXZJdGVtKSB0aGlzLnByZXZJdGVtLmdldFNjcmVlbigpLmFuaW1hdGVPdXQodHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGN1cnJlbnRTY3JlZW4gPSB0aGlzLmN1cnJlbnRJdGVtID8gdGhpcy5jdXJyZW50SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG4gIHZhciBwcmV2U2NyZWVuID0gdGhpcy5wcmV2SXRlbSA/IHRoaXMucHJldkl0ZW0uZ2V0U2NyZWVuKCkgOiBudWxsO1xuXG4gIHRoaXMuYW5pbWF0ZUNvbXBsZXRlQ291bnQrKztcbiAgXG4gIHN3aXRjaCh0aGlzLnRyYW5zaXRpb25UeXBlKXtcbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9BTkRfSU46XG4gICAgICBpZiAodGhpcy5hbmltYXRlQ29tcGxldGVDb3VudCA9PT0gMiB8fCAhdGhpcy5jdXJyZW50SXRlbSkgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9USEVOX0lOOlxuICAgICAgaWYgKGN1cnJlbnRTY3JlZW4pe1xuICAgICAgICBjdXJyZW50U2NyZWVuLm9uKCdhbmltYXRlSW5Db21wbGV0ZScsIHRoaXMuYW5pbWF0ZUluQ29tcGxldGVDYik7XG4gICAgICAgIGN1cnJlbnRTY3JlZW4uYW5pbWF0ZUluKCk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX0lOX1RIRU5fT1VUOlxuICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVDpcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRJdGVtKSB0aGlzLmN1cnJlbnRJdGVtLmdldFNjcmVlbigpLmFuaW1hdGVJbih0cnVlKTtcblxuICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUub25UcmFuc2l0aW9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuXG4gIHRoaXMuZGlzcG9zZVRyYW5zaXRpb24oKTtcblxuICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25Db21wbGV0ZScpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0cmFuc2l0aW9uUnVubmluZyl7XG4gICAgdGhpcy5jYW5jZWxUcmFuc2l0aW9uKCk7XG4gIH1cbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuZGlzcG9zZVRyYW5zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGN1cnJlbnRTY3JlZW4gPSB0aGlzLmN1cnJlbnRJdGVtID8gdGhpcy5jdXJyZW50SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG4gIHZhciBwcmV2U2NyZWVuID0gdGhpcy5wcmV2SXRlbSA/IHRoaXMucHJldkl0ZW0uZ2V0U2NyZWVuKCkgOiBudWxsO1xuXG4gIGlmIChwcmV2U2NyZWVuKXtcbiAgICBwcmV2U2NyZWVuLm9mZignYW5pbWF0ZUluQ29tcGxldGUnLCB0aGlzLmFuaW1hdGVJbkNvbXBsZXRlQ2IpXG4gICAgICAgICAgICAgIC5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScsIHRoaXMuYW5pbWF0ZU91dENvbXBsZXRlQ2IpO1xuXG4gICAgdGhpcy5wcmV2SXRlbS5kaXNwb3NlU2NyZWVuKCk7XG4gIH1cblxuICBpZiAoY3VycmVudFNjcmVlbil7XG4gICAgY3VycmVudFNjcmVlbi5vZmYoJ2FuaW1hdGVJbkNvbXBsZXRlJywgdGhpcy5hbmltYXRlSW5Db21wbGV0ZUNiKVxuICAgICAgICAgICAgICAgICAub2ZmKCdhbmltYXRlT3V0Q29tcGxldGUnLCB0aGlzLmFuaW1hdGVPdXRDb21wbGV0ZUNiKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuQVNjcmVlbiA9IHJlcXVpcmUoJy4vQVNjcmVlbi5qcycpO1xubW9kdWxlLmV4cG9ydHMuU2NyZWVuTmF2aWdhdG9ySXRlbSA9IFNjcmVlbk5hdmlnYXRvckl0ZW07XG5cbm1vZHVsZS5leHBvcnRzID0gU2NyZWVuTmF2aWdhdG9yO1xuXG4iLCJ2YXIgU2NyZWVuTmF2aWdhdG9ySXRlbSA9IGZ1bmN0aW9uKHNjcmVlbiwgb3B0aW9ucyl7XG4gIHRoaXMuc2NyZWVuID0gc2NyZWVuO1xuXG4gIHRoaXMuaXNJbnN0YW5jZSA9IHR5cGVvZiBzY3JlZW4gIT09ICdmdW5jdGlvbic7XG4gIHRoaXMuaW5zdGFuY2UgPSB0aGlzLmlzSW5zdGFuY2UgPyBzY3JlZW4gOiBudWxsO1xuXG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB0aGlzLmFyZ3VtZW50cyA9IG51bGw7XG4gIHRoaXMucHJvcGVydGllcyA9IG51bGw7XG4gIHRoaXMuY2FuRGlzcG9zZSA9ICF0aGlzLmlzSW5zdGFuY2U7XG5cbiAgZm9yICh2YXIgb3B0aW9uS2V5IGluIG9wdGlvbnMpe1xuICAgIGlmICh0eXBlb2YgdGhpc1tvcHRpb25LZXldICE9PSAndW5kZWZpbmVkJykgdGhpc1tvcHRpb25LZXldID0gb3B0aW9uc1tvcHRpb25LZXldO1xuICB9XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5nZXRTY3JlZW4gPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLmluc3RhbmNlKXtcbiAgICB2YXIgYXJncyA9IHRoaXMuYXJndW1lbnRzO1xuICAgIHZhciBjb25zdHJ1Y3RvciA9IHRoaXMuc2NyZWVuO1xuXG4gICAgZnVuY3Rpb24gRigpe1xuICAgICAgY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuXG4gICAgRi5wcm90b3R5cGUgPSBjb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG5cbiAgICB0aGlzLmluc3RhbmNlID0gbmV3IEYoKTtcbiAgfVxuXG4gIGlmICh0aGlzLnByb3BlcnRpZXMpe1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLnByb3BlcnRpZXMpe1xuICAgICAgdGhpcy5pbnN0YW5jZVtrZXldID0gdGhpcy5wcm9wZXJ0aWVzW2tleV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5kaXNwb3NlU2NyZWVuID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5jYW5EaXNwb3NlKSByZXR1cm47XG5cbiAgdGhpcy5pbnN0YW5jZS5kaXNwb3NlKCk7XG4gIHRoaXMuaW5zdGFuY2UgPSBudWxsO1xufTtcblxuU2NyZWVuTmF2aWdhdG9ySXRlbS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5pbnN0YW5jZSl7XG4gICAgdGhpcy5pbnN0YW5jZS5kaXNwb3NlKCk7XG4gIH1cblxuICB0aGlzLmluc3RhbmNlID0gdGhpcy5zY3JlZW4gPSBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTY3JlZW5OYXZpZ2F0b3JJdGVtO1xuXG4iXX0=
