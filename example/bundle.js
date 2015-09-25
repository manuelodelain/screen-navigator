(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ScreenNavigator = require('../src/ScreenNavigator.js');
var ScreenNavigatorItem = require('../src/ScreenNavigatorItem.js');
var Home = require('./pages/Home.js');
var About = require('./pages/About.js');

var navigator = new ScreenNavigator();
console.log(ScreenNavigator.defaultTransitionType);
// listen to screens changes
navigator.on('change', onPageChange);

// add screens
navigator.addItem('home', new ScreenNavigatorItem(new Home())); 
navigator.addItem('about', new ScreenNavigatorItem(About)); 
navigator.addItem('contact', new ScreenNavigatorItem(require('./pages/Contact.js'))); 

// show first screen
navigator.showScreen('home');

var navItems = document.querySelectorAll('nav li a');

// click on nav links for the example
for (var i = 0; i < navItems.length; i++) {
  navItems[i].addEventListener('click', function(event){
    event.preventDefault();

    var id = event.currentTarget.getAttribute('href').split('/')[1];
    if (id === '') id = 'home';

    navigator.showScreen(id);
  })
};

function onPageChange(){
  // console.log('change');
}

},{"../src/ScreenNavigator.js":10,"../src/ScreenNavigatorItem.js":11,"./pages/About.js":3,"./pages/Contact.js":4,"./pages/Home.js":5}],2:[function(require,module,exports){
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

var About = function(){
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
var ScreenNavigatorItem = require('../../src/ScreenNavigatorItem.js');
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
    this.navigator.addItem('page' + i, new ScreenNavigatorItem(new HomeSubPage(subPagesContainer, i)));

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


},{"../../src/ScreenNavigator.js":10,"../../src/ScreenNavigatorItem.js":11,"./APage.js":2,"./home/HomeSubPage.js":6,"inherits":7}],6:[function(require,module,exports){
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

ScreenNavigator.prototype.addItem = function(id, item) {
  this.items[id] = item;
};

ScreenNavigator.prototype.getItem = function(id) {
  return this.items[id];
};

ScreenNavigator.prototype.showScreen = function(id, transitionType) {
  if (id === this.currentItemId) return;


  var newItem = this.getItem(id);

  if (!newItem){
    throw new Error('ScreenNavigator - the item with the id ' + id + ' doesn\'t exist');
  }

  if (this.currentItem){
    this.prevItem = this.currentItem;
  }

  this.currentItemId = id;
  this.currentItem = newItem;

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
module.exports.ScreenNavigatorItem = require('./ScreenNavigatorItem.js');

module.exports = ScreenNavigator;


},{"./AScreen.js":9,"./ScreenNavigatorItem.js":11,"inherits":7,"tiny-emitter":8}],11:[function(require,module,exports){
var ScreenNavigatorItem = function(screen, events){
  this.screen = screen;

  this.isInstance = typeof screen === 'function' ? false : true;
  this.instance = null;
};

ScreenNavigatorItem.prototype.getScreen = function() {
  if (!this.instance){
    if (this.isInstance) {
      this.instance = this.screen;
    }else{
      this.instance = new this.screen();
    }
  }

  return this.instance;
};

ScreenNavigatorItem.prototype.disposeScreen = function() {
  if (this.isInstance) return;

  this.instance.dispose();
  this.instance = null;
};

ScreenNavigatorItem.prototype.dispose = function() {
  if (this.isInstance){
    this.screen.dispose();
  }else if (this.instance){
    this.instance.dispose();
  }

  this.instance = this.screen = null;
};

module.exports = ScreenNavigatorItem;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9pbmRleC5qcyIsImV4YW1wbGUvcGFnZXMvQVBhZ2UuanMiLCJleGFtcGxlL3BhZ2VzL0Fib3V0LmpzIiwiZXhhbXBsZS9wYWdlcy9Db250YWN0LmpzIiwiZXhhbXBsZS9wYWdlcy9Ib21lLmpzIiwiZXhhbXBsZS9wYWdlcy9ob21lL0hvbWVTdWJQYWdlLmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdGlueS1lbWl0dGVyL2luZGV4LmpzIiwic3JjL0FTY3JlZW4uanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9yLmpzIiwic3JjL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBTY3JlZW5OYXZpZ2F0b3IgPSByZXF1aXJlKCcuLi9zcmMvU2NyZWVuTmF2aWdhdG9yLmpzJyk7XG52YXIgU2NyZWVuTmF2aWdhdG9ySXRlbSA9IHJlcXVpcmUoJy4uL3NyYy9TY3JlZW5OYXZpZ2F0b3JJdGVtLmpzJyk7XG52YXIgSG9tZSA9IHJlcXVpcmUoJy4vcGFnZXMvSG9tZS5qcycpO1xudmFyIEFib3V0ID0gcmVxdWlyZSgnLi9wYWdlcy9BYm91dC5qcycpO1xuXG52YXIgbmF2aWdhdG9yID0gbmV3IFNjcmVlbk5hdmlnYXRvcigpO1xuY29uc29sZS5sb2coU2NyZWVuTmF2aWdhdG9yLmRlZmF1bHRUcmFuc2l0aW9uVHlwZSk7XG4vLyBsaXN0ZW4gdG8gc2NyZWVucyBjaGFuZ2VzXG5uYXZpZ2F0b3Iub24oJ2NoYW5nZScsIG9uUGFnZUNoYW5nZSk7XG5cbi8vIGFkZCBzY3JlZW5zXG5uYXZpZ2F0b3IuYWRkSXRlbSgnaG9tZScsIG5ldyBTY3JlZW5OYXZpZ2F0b3JJdGVtKG5ldyBIb21lKCkpKTsgXG5uYXZpZ2F0b3IuYWRkSXRlbSgnYWJvdXQnLCBuZXcgU2NyZWVuTmF2aWdhdG9ySXRlbShBYm91dCkpOyBcbm5hdmlnYXRvci5hZGRJdGVtKCdjb250YWN0JywgbmV3IFNjcmVlbk5hdmlnYXRvckl0ZW0ocmVxdWlyZSgnLi9wYWdlcy9Db250YWN0LmpzJykpKTsgXG5cbi8vIHNob3cgZmlyc3Qgc2NyZWVuXG5uYXZpZ2F0b3Iuc2hvd1NjcmVlbignaG9tZScpO1xuXG52YXIgbmF2SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCduYXYgbGkgYScpO1xuXG4vLyBjbGljayBvbiBuYXYgbGlua3MgZm9yIHRoZSBleGFtcGxlXG5mb3IgKHZhciBpID0gMDsgaSA8IG5hdkl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gIG5hdkl0ZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgaWQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpLnNwbGl0KCcvJylbMV07XG4gICAgaWYgKGlkID09PSAnJykgaWQgPSAnaG9tZSc7XG5cbiAgICBuYXZpZ2F0b3Iuc2hvd1NjcmVlbihpZCk7XG4gIH0pXG59O1xuXG5mdW5jdGlvbiBvblBhZ2VDaGFuZ2UoKXtcbiAgLy8gY29uc29sZS5sb2coJ2NoYW5nZScpO1xufVxuIiwidmFyIEFTY3JlZW4gPSByZXF1aXJlKCcuLi8uLi9zcmMvQVNjcmVlbi5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIEFQYWdlID0gZnVuY3Rpb24oaWQpe1xuICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCArICctcGFnZScpO1xufTtcblxuaW5oZXJpdHMoQVBhZ2UsIEFTY3JlZW4pO1xuXG5BUGFnZS5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbn07XG5cbkFQYWdlLnByb3RvdHlwZS5hbmltYXRlT3V0ID0gZnVuY3Rpb24oY29tcGxldGUpIHtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXG4gIGlmIChjb21wbGV0ZSkge1xuICAgIHRoaXMub25BbmltYXRlT3V0Q29tcGxldGUoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBUGFnZTtcblxuIiwidmFyIEFQYWdlID0gcmVxdWlyZSgnLi9BUGFnZS5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIEFib3V0ID0gZnVuY3Rpb24oKXtcbiAgQVBhZ2UuY2FsbCh0aGlzLCAnYWJvdXQnKTtcbn07XG5cbmluaGVyaXRzKEFib3V0LCBBUGFnZSk7XG5cbkFib3V0LnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBYm91dDtcbiIsInZhciBBUGFnZSA9IHJlcXVpcmUoJy4vQVBhZ2UuanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBDb250YWN0ID0gZnVuY3Rpb24oKXtcbiAgQVBhZ2UuY2FsbCh0aGlzLCAnY29udGFjdCcpO1xufTtcblxuaW5oZXJpdHMoQ29udGFjdCwgQVBhZ2UpO1xuXG5Db250YWN0LnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250YWN0O1xuIiwidmFyIEFQYWdlID0gcmVxdWlyZSgnLi9BUGFnZS5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbnZhciBTY3JlZW5OYXZpZ2F0b3IgPSByZXF1aXJlKCcuLi8uLi9zcmMvU2NyZWVuTmF2aWdhdG9yLmpzJyk7XG52YXIgU2NyZWVuTmF2aWdhdG9ySXRlbSA9IHJlcXVpcmUoJy4uLy4uL3NyYy9TY3JlZW5OYXZpZ2F0b3JJdGVtLmpzJyk7XG52YXIgSG9tZVN1YlBhZ2UgPSByZXF1aXJlKCcuL2hvbWUvSG9tZVN1YlBhZ2UuanMnKTtcblxudmFyIEhvbWUgPSBmdW5jdGlvbigpe1xuICBBUGFnZS5jYWxsKHRoaXMsICdob21lJyk7XG5cbiAgdmFyIHRoYXQgPSB0aGlzO1xuICB2YXIgc3ViUGFnZXNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3ViLXBhZ2VzLWNvbnRhaW5lcicpO1xuICB2YXIgbmF2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdWItcGFnZXMtbmF2IHVsJyk7XG5cbiAgdGhpcy5uYXZpZ2F0b3IgPSBuZXcgU2NyZWVuTmF2aWdhdG9yKCk7XG4gIHRoaXMubmF2aWdhdG9yLmRlZmF1bHRUcmFuc2l0aW9uVHlwZSA9IFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9BTkRfSU47XG4gIHRoaXMubmF2aWdhdG9yLm9uKCdjaGFuZ2UnLCB0aGlzLm9uU3ViUGFnZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgdGhpcy5uYXZpZ2F0b3Iub24oJ3RyYW5zaXRpb25Db21wbGV0ZScsIGZ1bmN0aW9uKCl7XG4gICAgY29uc29sZS5sb2coJ3RyYW5zaXRpb24gY29tcGxldGUnKTtcbiAgfSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICB0aGlzLm5hdmlnYXRvci5hZGRJdGVtKCdwYWdlJyArIGksIG5ldyBTY3JlZW5OYXZpZ2F0b3JJdGVtKG5ldyBIb21lU3ViUGFnZShzdWJQYWdlc0NvbnRhaW5lciwgaSkpKTtcblxuICAgIHZhciBuYXZJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBuYXZJdGVtLnNldEF0dHJpYnV0ZSgnZGF0YS1zY3JlZW4taWQnLCAncGFnZScgKyBpKTtcbiAgICBuYXZFbGVtZW50LmFwcGVuZENoaWxkKG5hdkl0ZW0pO1xuXG4gICAgdmFyIG5hdkxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgbmF2TGluay5ocmVmID0gJyNwYWdlJyArIGk7XG4gICAgbmF2SXRlbS5hcHBlbmRDaGlsZChuYXZMaW5rKTtcblxuICAgIG5hdkxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB2YXIgc2NyZWVuSWQgPSBldmVudC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXNjcmVlbi1pZCcpO1xuXG4gICAgICB0aGF0Lm5hdmlnYXRvci5zaG93U2NyZWVuKHNjcmVlbklkKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLm5hdmlnYXRvci5zaG93U2NyZWVuKCdwYWdlMCcpO1xufTtcblxuaW5oZXJpdHMoSG9tZSwgQVBhZ2UpO1xuXG5Ib21lLnByb3RvdHlwZS5vblN1YlBhZ2VDaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG5hdkl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnN1Yi1wYWdlcy1uYXYgbGknKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5hdkl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG5hdkl0ZW1zW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS1zY3JlZW4taWQnKSA9PT0gdGhpcy5uYXZpZ2F0b3IuY3VycmVudEl0ZW1JZCl7XG4gICAgICBuYXZJdGVtc1tpXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9ZWxzZXtcbiAgICAgIG5hdkl0ZW1zW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH1cbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSG9tZTtcblxuIiwidmFyIEFTY3JlZW4gPSByZXF1aXJlKCcuLi8uLi8uLi9zcmMvQVNjcmVlbi5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIEhvbWVJdGVtID0gZnVuY3Rpb24oY29udGFpbmVyLCBpbmRleCl7XG4gIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzdWItcGFnZScpO1xuICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gJ3BhZ2UgJyArIGluZGV4O1xuXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xufTtcblxuaW5oZXJpdHMoSG9tZUl0ZW0sIEFTY3JlZW4pO1xuXG5Ib21lSXRlbS5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oKSB7XG4gIHZhciBhbmltID0gdGhpcy5lbGVtZW50LmFuaW1hdGUoW1xuICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUoMTAwJSknfSxcbiAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlKDApJ31cbiAgXSwge1xuICAgIGR1cmF0aW9uOiAxMDAwLCBcbiAgICBlYXNpbmc6ICdjdWJpYy1iZXppZXIoMC4xOTAsIDEuMDAwLCAwLjIyMCwgMS4wMDApJ1xuICB9KTtcblxuICBhbmltLmFkZEV2ZW50TGlzdGVuZXIoJ2ZpbmlzaCcsIHRoaXMub25BbmltYXRlSW5Db21wbGV0ZS5iaW5kKHRoaXMpKTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG59O1xuXG5Ib21lSXRlbS5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICBBU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlLmNhbGwodGhpcyk7XG59O1xuXG5Ib21lSXRlbS5wcm90b3R5cGUuYW5pbWF0ZU91dCA9IGZ1bmN0aW9uKGNvbXBsZXRlKSB7XG4gIHZhciBhbmltID0gdGhpcy5lbGVtZW50LmFuaW1hdGUoW1xuICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUoMCknfSxcbiAgICB7dHJhbnNmb3JtOiAndHJhbnNsYXRlKC0xMDAlKSd9XG4gIF0sIHtcbiAgICBkdXJhdGlvbjogMTAwMCwgXG4gICAgZWFzaW5nOiAnY3ViaWMtYmV6aWVyKDAuMTkwLCAxLjAwMCwgMC4yMjAsIDEuMDAwKSdcbiAgfSk7XG5cbiAgYW5pbS5hZGRFdmVudExpc3RlbmVyKCdmaW5pc2gnLCB0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlLmJpbmQodGhpcykpO1xuICBcbiAgaWYgKGNvbXBsZXRlKSB7XG4gICAgdGhpcy5vbkFuaW1hdGVPdXRDb21wbGV0ZSgpO1xuICB9XG59O1xuXG5Ib21lSXRlbS5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUuY2FsbCh0aGlzKTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWVJdGVtO1xuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCJmdW5jdGlvbiBFICgpIHtcblx0Ly8gS2VlcCB0aGlzIGVtcHR5IHNvIGl0J3MgZWFzaWVyIHRvIGluaGVyaXQgZnJvbVxuICAvLyAodmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9saXBzbWFjayBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvaXNzdWVzLzMpXG59XG5cbkUucHJvdG90eXBlID0ge1xuXHRvbjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuICAgIFxuICAgIChlW25hbWVdIHx8IChlW25hbWVdID0gW10pKS5wdXNoKHtcbiAgICAgIGZuOiBjYWxsYmFjayxcbiAgICAgIGN0eDogY3R4XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb25jZTogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGZuID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5vZmYobmFtZSwgZm4pO1xuICAgICAgY2FsbGJhY2suYXBwbHkoY3R4LCBhcmd1bWVudHMpO1xuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIHRoaXMub24obmFtZSwgZm4sIGN0eCk7XG4gIH0sXG5cbiAgZW1pdDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgZGF0YSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgZXZ0QXJyID0gKCh0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KSlbbmFtZV0gfHwgW10pLnNsaWNlKCk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBsZW4gPSBldnRBcnIubGVuZ3RoO1xuICAgIFxuICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBldnRBcnJbaV0uZm4uYXBwbHkoZXZ0QXJyW2ldLmN0eCwgZGF0YSk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9mZjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcbiAgICB2YXIgZXZ0cyA9IGVbbmFtZV07XG4gICAgdmFyIGxpdmVFdmVudHMgPSBbXTtcbiAgICBcbiAgICBpZiAoZXZ0cyAmJiBjYWxsYmFjaykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV2dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGV2dHNbaV0uZm4gIT09IGNhbGxiYWNrKSBsaXZlRXZlbnRzLnB1c2goZXZ0c1tpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFJlbW92ZSBldmVudCBmcm9tIHF1ZXVlIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtcbiAgICAvLyBTdWdnZXN0ZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2xhemRcbiAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvY29tbWl0L2M2ZWJmYWE5YmM5NzNiMzNkMTEwYTg0YTMwNzc0MmI3Y2Y5NGM5NTMjY29tbWl0Y29tbWVudC01MDI0OTEwXG5cbiAgICAobGl2ZUV2ZW50cy5sZW5ndGgpIFxuICAgICAgPyBlW25hbWVdID0gbGl2ZUV2ZW50c1xuICAgICAgOiBkZWxldGUgZVtuYW1lXTtcbiAgICBcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFO1xuIiwidmFyIFRpbnlFbWl0dGVyID0gcmVxdWlyZSgndGlueS1lbWl0dGVyJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQVNjcmVlbiA9IGZ1bmN0aW9uKCl7XG59O1xuXG5pbmhlcml0cyhBU2NyZWVuLCBUaW55RW1pdHRlcik7XG5cbkFTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKGNvbXBsZXRlKSB7XG4gIHRoaXMub25BbmltYXRlSW5Db21wbGV0ZSgpO1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ2FuaW1hdGVJbkNvbXBsZXRlJyk7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5hbmltYXRlT3V0ID0gZnVuY3Rpb24oY29tcGxldGUpIHtcbiAgdGhpcy5vbkFuaW1hdGVPdXRDb21wbGV0ZSgpO1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbWl0KCdhbmltYXRlT3V0Q29tcGxldGUnKTtcbn07XG5cbkFTY3JlZW4ucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5vZmYoJ2FuaW1hdGVJbkNvbXBsZXRlJylcbiAgICAgIC5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBU2NyZWVuOyIsInZhciBUaW55RW1pdHRlciA9IHJlcXVpcmUoJ3RpbnktZW1pdHRlcicpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIFNjcmVlbk5hdmlnYXRvciA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMuaXRlbXMgPSB7fTtcbiAgdGhpcy5jdXJyZW50SXRlbSA9IG51bGw7XG4gIHRoaXMuY3VycmVudEl0ZW1JZCA9IG51bGw7XG4gIHRoaXMucHJldkl0ZW0gPSBudWxsO1xuXG4gIHRoaXMudHJhbnNpdGlvblJ1bm5pbmcgPSBmYWxzZTtcbiAgdGhpcy50cmFuc2l0aW9uVHlwZSA9IFNjcmVlbk5hdmlnYXRvci5kZWZhdWx0VHJhbnNpdGlvblR5cGU7XG4gIHRoaXMuYW5pbWF0ZUluQ29tcGxldGVDYiA9IHRoaXMub25BbmltYXRlSW5Db21wbGV0ZS5iaW5kKHRoaXMpO1xuICB0aGlzLmFuaW1hdGVPdXRDb21wbGV0ZUNiID0gdGhpcy5vbkFuaW1hdGVJbkNvbXBsZXRlLmJpbmQodGhpcyk7XG4gIHRoaXMuYW5pbWF0ZUNvbXBsZXRlQ291bnQgPSAwO1xufTtcblxuaW5oZXJpdHMoU2NyZWVuTmF2aWdhdG9yLCBUaW55RW1pdHRlcik7XG5cblNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9BTkRfSU4gPSAnb3V0QW5kSW4nO1xuU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX1RIRU5fSU4gPSAnb3V0VGhlbkluJztcblNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX0lOX1RIRU5fT1VUID0gJ2luVGhlbk91dCc7XG5TY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9PVVQgPSAnb3V0JztcblNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX0lOID0gJ2luJztcblNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX05PTkUgPSAnbm9uZSc7XG5cblNjcmVlbk5hdmlnYXRvci5kZWZhdWx0VHJhbnNpdGlvblR5cGUgPSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9OT05FO1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmFkZEl0ZW0gPSBmdW5jdGlvbihpZCwgaXRlbSkge1xuICB0aGlzLml0ZW1zW2lkXSA9IGl0ZW07XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmdldEl0ZW0gPSBmdW5jdGlvbihpZCkge1xuICByZXR1cm4gdGhpcy5pdGVtc1tpZF07XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLnNob3dTY3JlZW4gPSBmdW5jdGlvbihpZCwgdHJhbnNpdGlvblR5cGUpIHtcbiAgaWYgKGlkID09PSB0aGlzLmN1cnJlbnRJdGVtSWQpIHJldHVybjtcblxuXG4gIHZhciBuZXdJdGVtID0gdGhpcy5nZXRJdGVtKGlkKTtcblxuICBpZiAoIW5ld0l0ZW0pe1xuICAgIHRocm93IG5ldyBFcnJvcignU2NyZWVuTmF2aWdhdG9yIC0gdGhlIGl0ZW0gd2l0aCB0aGUgaWQgJyArIGlkICsgJyBkb2VzblxcJ3QgZXhpc3QnKTtcbiAgfVxuXG4gIGlmICh0aGlzLmN1cnJlbnRJdGVtKXtcbiAgICB0aGlzLnByZXZJdGVtID0gdGhpcy5jdXJyZW50SXRlbTtcbiAgfVxuXG4gIHRoaXMuY3VycmVudEl0ZW1JZCA9IGlkO1xuICB0aGlzLmN1cnJlbnRJdGVtID0gbmV3SXRlbTtcblxuICB0aGlzLm9uQ2hhbmdlKCk7XG5cbiAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvblR5cGUpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5jbGVhclNjcmVlbiA9IGZ1bmN0aW9uKHRyYW5zaXRpb25UeXBlKSB7XG4gIGlmICh0aGlzLmN1cnJlbnRTY3JlZW4pe1xuICAgIHRoaXMucHJldlNjcmVlbiA9IHRoaXMuY3VycmVudFNjcmVlbjtcbiAgfVxuXG4gIHRoaXMub25DaGFuZ2UoKTtcblxuICB0aGlzLnN0YXJ0VHJhbnNpdGlvbih0cmFuc2l0aW9uVHlwZSk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLnN0YXJ0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHRyYW5zaXRpb25UeXBlKSB7XG4gIGlmICh0aGlzLnRyYW5zaXRpb25SdW5uaW5nKXtcbiAgICB0aGlzLmNhbmNlbFRyYW5zaXRpb24oKTtcbiAgfSBcblxuICB2YXIgY3VycmVudFNjcmVlbiA9IHRoaXMuY3VycmVudEl0ZW0gPyB0aGlzLmN1cnJlbnRJdGVtLmdldFNjcmVlbigpIDogbnVsbDtcbiAgdmFyIHByZXZTY3JlZW4gPSB0aGlzLnByZXZJdGVtID8gdGhpcy5wcmV2SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG5cbiAgdGhpcy5hbmltYXRlQ29tcGxldGVDb3VudCA9IDA7XG4gIHRoaXMudHJhbnNpdGlvblR5cGUgPSB0cmFuc2l0aW9uVHlwZSA/IHRyYW5zaXRpb25UeXBlIDogdGhpcy5kZWZhdWx0VHJhbnNpdGlvblR5cGU7XG5cbiAgc3dpdGNoKHRoaXMudHJhbnNpdGlvblR5cGUpe1xuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX0FORF9JTjpcbiAgICAgIGlmIChwcmV2U2NyZWVuKSB7XG4gICAgICAgIHByZXZTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIHRoaXMuYW5pbWF0ZU91dENvbXBsZXRlQ2IpO1xuICAgICAgICBwcmV2U2NyZWVuLmFuaW1hdGVPdXQoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGN1cnJlbnRTY3JlZW4pIHtcbiAgICAgICAgY3VycmVudFNjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCB0aGlzLmFuaW1hdGVJbkNvbXBsZXRlQ2IpO1xuICAgICAgICBjdXJyZW50U2NyZWVuLmFuaW1hdGVJbigpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9USEVOX0lOOlxuICAgICAgaWYgKHByZXZTY3JlZW4pIHtcbiAgICAgICAgcHJldlNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgdGhpcy5hbmltYXRlT3V0Q29tcGxldGVDYik7XG4gICAgICAgIHByZXZTY3JlZW4uYW5pbWF0ZU91dCgpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMub25BbmltYXRlT3V0Q29tcGxldGUoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9JTl9USEVOX09VVDpcbiAgICAgIGlmIChjdXJyZW50U2NyZWVuKSB7XG4gICAgICAgIGN1cnJlbnRTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgdGhpcy5hbmltYXRlSW5Db21wbGV0ZUNiKTtcbiAgICAgICAgY3VycmVudFNjcmVlbi5hbmltYXRlSW4oKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9PVVQ6XG4gICAgICBpZiAocHJldlNjcmVlbikge1xuICAgICAgICBwcmV2U2NyZWVuLm9uKCdhbmltYXRlT3V0Q29tcGxldGUnLCB0aGlzLmFuaW1hdGVPdXRDb21wbGV0ZUNiKTtcbiAgICAgICAgcHJldlNjcmVlbi5hbmltYXRlT3V0KCk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX0lOOlxuICAgICAgaWYgKGN1cnJlbnRTY3JlZW4pIHtcbiAgICAgICAgY3VycmVudFNjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCB0aGlzLmFuaW1hdGVJbkNvbXBsZXRlQ2IpO1xuICAgICAgICBjdXJyZW50U2NyZWVuLmFuaW1hdGVJbigpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9OT05FOlxuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzLnRyYW5zaXRpb25UeXBlID0gU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fTk9ORTtcblxuICAgICAgaWYgKHByZXZTY3JlZW4pIHByZXZTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcbiAgICAgIGlmIChjdXJyZW50U2NyZWVuKSBjdXJyZW50U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblxuICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB0aGlzLm9uVHJhbnNpdGlvblN0YXJ0KCk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmNhbmNlbFRyYW5zaXRpb24gPSBmdW5jdGlvbihjb21wbGV0ZSkge1xuICB0aGlzLnRyYW5zaXRpb25SdW5uaW5nID0gZmFsc2U7XG5cbiAgdGhpcy5kaXNwb3NlVHJhbnNpdGlvbigpO1xuXG4gIGlmICh0aGlzLnByZXZJdGVtKXtcbiAgICB0aGlzLnByZXZJdGVtLmdldFNjcmVlbigpLmFuaW1hdGVPdXQodHJ1ZSk7XG4gIH1cblxuICBpZiAodGhpcy5jdXJyZW50SXRlbSl7XG4gICAgdGhpcy5jdXJyZW50SXRlbS5nZXRTY3JlZW4oKS5hbmltYXRlT3V0KHRydWUpO1xuICB9XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLm9uQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLm9uVHJhbnNpdGlvblN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgndHJhbnNpdGlvblN0YXJ0Jyk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLm9uQW5pbWF0ZUluQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGN1cnJlbnRTY3JlZW4gPSB0aGlzLmN1cnJlbnRJdGVtID8gdGhpcy5jdXJyZW50SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG4gIHZhciBwcmV2U2NyZWVuID0gdGhpcy5wcmV2SXRlbSA/IHRoaXMucHJldkl0ZW0uZ2V0U2NyZWVuKCkgOiBudWxsO1xuXG4gIHRoaXMuYW5pbWF0ZUNvbXBsZXRlQ291bnQrKzsgXG4gIFxuICBzd2l0Y2godGhpcy50cmFuc2l0aW9uVHlwZSl7XG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9PVVRfQU5EX0lOOlxuICAgICAgaWYgKHRoaXMuYW5pbWF0ZUNvbXBsZXRlQ291bnQgPT09IDIgfHwgIXRoaXMucHJldkl0ZW0pIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9PVVRfVEhFTl9JTjpcbiAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9JTl9USEVOX09VVDpcbiAgICAgIGlmIChwcmV2U2NyZWVuKXtcbiAgICAgICAgcHJldlNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgdGhpcy5hbmltYXRlT3V0Q29tcGxldGVDYik7XG4gICAgICAgIHByZXZTY3JlZW4uYW5pbWF0ZU91dCgpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9JTjpcbiAgICAgICAgaWYgKHRoaXMucHJldkl0ZW0pIHRoaXMucHJldkl0ZW0uZ2V0U2NyZWVuKCkuYW5pbWF0ZU91dCh0cnVlKTtcblxuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcbiAgfVxufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY3VycmVudFNjcmVlbiA9IHRoaXMuY3VycmVudEl0ZW0gPyB0aGlzLmN1cnJlbnRJdGVtLmdldFNjcmVlbigpIDogbnVsbDtcbiAgdmFyIHByZXZTY3JlZW4gPSB0aGlzLnByZXZJdGVtID8gdGhpcy5wcmV2SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG5cbiAgdGhpcy5hbmltYXRlQ29tcGxldGVDb3VudCsrO1xuICBcbiAgc3dpdGNoKHRoaXMudHJhbnNpdGlvblR5cGUpe1xuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX0FORF9JTjpcbiAgICAgIGlmICh0aGlzLmFuaW1hdGVDb21wbGV0ZUNvdW50ID09PSAyIHx8ICF0aGlzLmN1cnJlbnRJdGVtKSB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX1RIRU5fSU46XG4gICAgICBpZiAoY3VycmVudFNjcmVlbil7XG4gICAgICAgIGN1cnJlbnRTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgdGhpcy5hbmltYXRlSW5Db21wbGV0ZUNiKTtcbiAgICAgICAgY3VycmVudFNjcmVlbi5hbmltYXRlSW4oKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fSU5fVEhFTl9PVVQ6XG4gICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUOlxuICAgICAgaWYgKHRoaXMuY3VycmVudEl0ZW0pIHRoaXMuY3VycmVudEl0ZW0uZ2V0U2NyZWVuKCkuYW5pbWF0ZUluKHRydWUpO1xuXG4gICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcbiAgfVxufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5vblRyYW5zaXRpb25Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnRyYW5zaXRpb25SdW5uaW5nID0gZmFsc2U7XG5cbiAgdGhpcy5kaXNwb3NlVHJhbnNpdGlvbigpO1xuXG4gIHRoaXMuZW1pdCgndHJhbnNpdGlvbkNvbXBsZXRlJyk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRyYW5zaXRpb25SdW5uaW5nKXtcbiAgICB0aGlzLmNhbmNlbFRyYW5zaXRpb24oKTtcbiAgfVxufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5kaXNwb3NlVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY3VycmVudFNjcmVlbiA9IHRoaXMuY3VycmVudEl0ZW0gPyB0aGlzLmN1cnJlbnRJdGVtLmdldFNjcmVlbigpIDogbnVsbDtcbiAgdmFyIHByZXZTY3JlZW4gPSB0aGlzLnByZXZJdGVtID8gdGhpcy5wcmV2SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG5cbiAgaWYgKHByZXZTY3JlZW4pe1xuICAgIHByZXZTY3JlZW4ub2ZmKCdhbmltYXRlSW5Db21wbGV0ZScsIHRoaXMuYW5pbWF0ZUluQ29tcGxldGVDYilcbiAgICAgICAgICAgICAgLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgdGhpcy5hbmltYXRlT3V0Q29tcGxldGVDYik7XG5cbiAgICB0aGlzLnByZXZJdGVtLmRpc3Bvc2VTY3JlZW4oKTtcbiAgfVxuXG4gIGlmIChjdXJyZW50U2NyZWVuKXtcbiAgICBjdXJyZW50U2NyZWVuLm9mZignYW5pbWF0ZUluQ29tcGxldGUnLCB0aGlzLmFuaW1hdGVJbkNvbXBsZXRlQ2IpXG4gICAgICAgICAgICAgICAgIC5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScsIHRoaXMuYW5pbWF0ZU91dENvbXBsZXRlQ2IpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5BU2NyZWVuID0gcmVxdWlyZSgnLi9BU2NyZWVuLmpzJyk7XG5tb2R1bGUuZXhwb3J0cy5TY3JlZW5OYXZpZ2F0b3JJdGVtID0gcmVxdWlyZSgnLi9TY3JlZW5OYXZpZ2F0b3JJdGVtLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2NyZWVuTmF2aWdhdG9yO1xuXG4iLCJ2YXIgU2NyZWVuTmF2aWdhdG9ySXRlbSA9IGZ1bmN0aW9uKHNjcmVlbiwgZXZlbnRzKXtcbiAgdGhpcy5zY3JlZW4gPSBzY3JlZW47XG5cbiAgdGhpcy5pc0luc3RhbmNlID0gdHlwZW9mIHNjcmVlbiA9PT0gJ2Z1bmN0aW9uJyA/IGZhbHNlIDogdHJ1ZTtcbiAgdGhpcy5pbnN0YW5jZSA9IG51bGw7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5nZXRTY3JlZW4gPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLmluc3RhbmNlKXtcbiAgICBpZiAodGhpcy5pc0luc3RhbmNlKSB7XG4gICAgICB0aGlzLmluc3RhbmNlID0gdGhpcy5zY3JlZW47XG4gICAgfWVsc2V7XG4gICAgICB0aGlzLmluc3RhbmNlID0gbmV3IHRoaXMuc2NyZWVuKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5kaXNwb3NlU2NyZWVuID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmlzSW5zdGFuY2UpIHJldHVybjtcblxuICB0aGlzLmluc3RhbmNlLmRpc3Bvc2UoKTtcbiAgdGhpcy5pbnN0YW5jZSA9IG51bGw7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmlzSW5zdGFuY2Upe1xuICAgIHRoaXMuc2NyZWVuLmRpc3Bvc2UoKTtcbiAgfWVsc2UgaWYgKHRoaXMuaW5zdGFuY2Upe1xuICAgIHRoaXMuaW5zdGFuY2UuZGlzcG9zZSgpO1xuICB9XG5cbiAgdGhpcy5pbnN0YW5jZSA9IHRoaXMuc2NyZWVuID0gbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2NyZWVuTmF2aWdhdG9ySXRlbTsiXX0=
