(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ScreenNavigator = require('../src/ScreenNavigator.js');
var ScreenNavigatorItem = require('../src/ScreenNavigatorItem.js');
var Home = require('./pages/Home.js');
var About = require('./pages/About.js');

var navigator = new ScreenNavigator();

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
  this.transitionType = this.defaultTransitionType = ScreenNavigator.TRANSITION_NONE;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9pbmRleC5qcyIsImV4YW1wbGUvcGFnZXMvQVBhZ2UuanMiLCJleGFtcGxlL3BhZ2VzL0Fib3V0LmpzIiwiZXhhbXBsZS9wYWdlcy9Db250YWN0LmpzIiwiZXhhbXBsZS9wYWdlcy9Ib21lLmpzIiwiZXhhbXBsZS9wYWdlcy9ob21lL0hvbWVTdWJQYWdlLmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdGlueS1lbWl0dGVyL2luZGV4LmpzIiwic3JjL0FTY3JlZW4uanMiLCJzcmMvU2NyZWVuTmF2aWdhdG9yLmpzIiwic3JjL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFNjcmVlbk5hdmlnYXRvciA9IHJlcXVpcmUoJy4uL3NyYy9TY3JlZW5OYXZpZ2F0b3IuanMnKTtcbnZhciBTY3JlZW5OYXZpZ2F0b3JJdGVtID0gcmVxdWlyZSgnLi4vc3JjL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMnKTtcbnZhciBIb21lID0gcmVxdWlyZSgnLi9wYWdlcy9Ib21lLmpzJyk7XG52YXIgQWJvdXQgPSByZXF1aXJlKCcuL3BhZ2VzL0Fib3V0LmpzJyk7XG5cbnZhciBuYXZpZ2F0b3IgPSBuZXcgU2NyZWVuTmF2aWdhdG9yKCk7XG5cbi8vIGxpc3RlbiB0byBzY3JlZW5zIGNoYW5nZXNcbm5hdmlnYXRvci5vbignY2hhbmdlJywgb25QYWdlQ2hhbmdlKTtcblxuLy8gYWRkIHNjcmVlbnNcbm5hdmlnYXRvci5hZGRJdGVtKCdob21lJywgbmV3IFNjcmVlbk5hdmlnYXRvckl0ZW0obmV3IEhvbWUoKSkpOyBcbm5hdmlnYXRvci5hZGRJdGVtKCdhYm91dCcsIG5ldyBTY3JlZW5OYXZpZ2F0b3JJdGVtKEFib3V0KSk7IFxubmF2aWdhdG9yLmFkZEl0ZW0oJ2NvbnRhY3QnLCBuZXcgU2NyZWVuTmF2aWdhdG9ySXRlbShyZXF1aXJlKCcuL3BhZ2VzL0NvbnRhY3QuanMnKSkpOyBcblxuLy8gc2hvdyBmaXJzdCBzY3JlZW5cbm5hdmlnYXRvci5zaG93U2NyZWVuKCdob21lJyk7XG5cbnZhciBuYXZJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ25hdiBsaSBhJyk7XG5cbi8vIGNsaWNrIG9uIG5hdiBsaW5rcyBmb3IgdGhlIGV4YW1wbGVcbmZvciAodmFyIGkgPSAwOyBpIDwgbmF2SXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgbmF2SXRlbXNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHZhciBpZCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJykuc3BsaXQoJy8nKVsxXTtcbiAgICBpZiAoaWQgPT09ICcnKSBpZCA9ICdob21lJztcblxuICAgIG5hdmlnYXRvci5zaG93U2NyZWVuKGlkKTtcbiAgfSlcbn07XG5cbmZ1bmN0aW9uIG9uUGFnZUNoYW5nZSgpe1xuICAvLyBjb25zb2xlLmxvZygnY2hhbmdlJyk7XG59XG4iLCJ2YXIgQVNjcmVlbiA9IHJlcXVpcmUoJy4uLy4uL3NyYy9BU2NyZWVuLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQVBhZ2UgPSBmdW5jdGlvbihpZCl7XG4gIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkICsgJy1wYWdlJyk7XG59O1xuXG5pbmhlcml0cyhBUGFnZSwgQVNjcmVlbik7XG5cbkFQYWdlLnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxuQVBhZ2UucHJvdG90eXBlLmFuaW1hdGVPdXQgPSBmdW5jdGlvbihjb21wbGV0ZSkge1xuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG5cbiAgaWYgKGNvbXBsZXRlKSB7XG4gICAgdGhpcy5vbkFuaW1hdGVPdXRDb21wbGV0ZSgpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFQYWdlO1xuXG4iLCJ2YXIgQVBhZ2UgPSByZXF1aXJlKCcuL0FQYWdlLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQWJvdXQgPSBmdW5jdGlvbigpe1xuICBBUGFnZS5jYWxsKHRoaXMsICdhYm91dCcpO1xufTtcblxuaW5oZXJpdHMoQWJvdXQsIEFQYWdlKTtcblxuQWJvdXQucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFib3V0O1xuIiwidmFyIEFQYWdlID0gcmVxdWlyZSgnLi9BUGFnZS5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIENvbnRhY3QgPSBmdW5jdGlvbigpe1xuICBBUGFnZS5jYWxsKHRoaXMsICdjb250YWN0Jyk7XG59O1xuXG5pbmhlcml0cyhDb250YWN0LCBBUGFnZSk7XG5cbkNvbnRhY3QucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRhY3Q7XG4iLCJ2YXIgQVBhZ2UgPSByZXF1aXJlKCcuL0FQYWdlLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xudmFyIFNjcmVlbk5hdmlnYXRvciA9IHJlcXVpcmUoJy4uLy4uL3NyYy9TY3JlZW5OYXZpZ2F0b3IuanMnKTtcbnZhciBTY3JlZW5OYXZpZ2F0b3JJdGVtID0gcmVxdWlyZSgnLi4vLi4vc3JjL1NjcmVlbk5hdmlnYXRvckl0ZW0uanMnKTtcbnZhciBIb21lU3ViUGFnZSA9IHJlcXVpcmUoJy4vaG9tZS9Ib21lU3ViUGFnZS5qcycpO1xuXG52YXIgSG9tZSA9IGZ1bmN0aW9uKCl7XG4gIEFQYWdlLmNhbGwodGhpcywgJ2hvbWUnKTtcblxuICB2YXIgdGhhdCA9IHRoaXM7XG4gIHZhciBzdWJQYWdlc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdWItcGFnZXMtY29udGFpbmVyJyk7XG4gIHZhciBuYXZFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN1Yi1wYWdlcy1uYXYgdWwnKTtcblxuICB0aGlzLm5hdmlnYXRvciA9IG5ldyBTY3JlZW5OYXZpZ2F0b3IoKTtcbiAgdGhpcy5uYXZpZ2F0b3IuZGVmYXVsdFRyYW5zaXRpb25UeXBlID0gU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX0FORF9JTjtcbiAgdGhpcy5uYXZpZ2F0b3Iub24oJ2NoYW5nZScsIHRoaXMub25TdWJQYWdlQ2hhbmdlLmJpbmQodGhpcykpO1xuICB0aGlzLm5hdmlnYXRvci5vbigndHJhbnNpdGlvbkNvbXBsZXRlJywgZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZygndHJhbnNpdGlvbiBjb21wbGV0ZScpO1xuICB9KTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IDY7IGkrKykge1xuICAgIHRoaXMubmF2aWdhdG9yLmFkZEl0ZW0oJ3BhZ2UnICsgaSwgbmV3IFNjcmVlbk5hdmlnYXRvckl0ZW0obmV3IEhvbWVTdWJQYWdlKHN1YlBhZ2VzQ29udGFpbmVyLCBpKSkpO1xuXG4gICAgdmFyIG5hdkl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIG5hdkl0ZW0uc2V0QXR0cmlidXRlKCdkYXRhLXNjcmVlbi1pZCcsICdwYWdlJyArIGkpO1xuICAgIG5hdkVsZW1lbnQuYXBwZW5kQ2hpbGQobmF2SXRlbSk7XG5cbiAgICB2YXIgbmF2TGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBuYXZMaW5rLmhyZWYgPSAnI3BhZ2UnICsgaTtcbiAgICBuYXZJdGVtLmFwcGVuZENoaWxkKG5hdkxpbmspO1xuXG4gICAgbmF2TGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHZhciBzY3JlZW5JZCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2NyZWVuLWlkJyk7XG5cbiAgICAgIHRoYXQubmF2aWdhdG9yLnNob3dTY3JlZW4oc2NyZWVuSWQpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMubmF2aWdhdG9yLnNob3dTY3JlZW4oJ3BhZ2UwJyk7XG59O1xuXG5pbmhlcml0cyhIb21lLCBBUGFnZSk7XG5cbkhvbWUucHJvdG90eXBlLm9uU3ViUGFnZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbmF2SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc3ViLXBhZ2VzLW5hdiBsaScpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbmF2SXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAobmF2SXRlbXNbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLXNjcmVlbi1pZCcpID09PSB0aGlzLm5hdmlnYXRvci5jdXJyZW50SXRlbUlkKXtcbiAgICAgIG5hdkl0ZW1zW2ldLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIH1lbHNle1xuICAgICAgbmF2SXRlbXNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfVxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIb21lO1xuXG4iLCJ2YXIgQVNjcmVlbiA9IHJlcXVpcmUoJy4uLy4uLy4uL3NyYy9BU2NyZWVuLmpzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgSG9tZUl0ZW0gPSBmdW5jdGlvbihjb250YWluZXIsIGluZGV4KXtcbiAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3N1Yi1wYWdlJyk7XG4gIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSAncGFnZSAnICsgaW5kZXg7XG5cbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG59O1xuXG5pbmhlcml0cyhIb21lSXRlbSwgQVNjcmVlbik7XG5cbkhvbWVJdGVtLnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGFuaW0gPSB0aGlzLmVsZW1lbnQuYW5pbWF0ZShbXG4gICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZSgxMDAlKSd9LFxuICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUoMCknfVxuICBdLCB7XG4gICAgZHVyYXRpb246IDEwMDAsIFxuICAgIGVhc2luZzogJ2N1YmljLWJlemllcigwLjE5MCwgMS4wMDAsIDAuMjIwLCAxLjAwMCknXG4gIH0pO1xuXG4gIGFuaW0uYWRkRXZlbnRMaXN0ZW5lcignZmluaXNoJywgdGhpcy5vbkFuaW1hdGVJbkNvbXBsZXRlLmJpbmQodGhpcykpO1xuXG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbn07XG5cbkhvbWVJdGVtLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIEFTY3JlZW4ucHJvdG90eXBlLm9uQW5pbWF0ZUluQ29tcGxldGUuY2FsbCh0aGlzKTtcbn07XG5cbkhvbWVJdGVtLnByb3RvdHlwZS5hbmltYXRlT3V0ID0gZnVuY3Rpb24oY29tcGxldGUpIHtcbiAgdmFyIGFuaW0gPSB0aGlzLmVsZW1lbnQuYW5pbWF0ZShbXG4gICAge3RyYW5zZm9ybTogJ3RyYW5zbGF0ZSgwKSd9LFxuICAgIHt0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTEwMCUpJ31cbiAgXSwge1xuICAgIGR1cmF0aW9uOiAxMDAwLCBcbiAgICBlYXNpbmc6ICdjdWJpYy1iZXppZXIoMC4xOTAsIDEuMDAwLCAwLjIyMCwgMS4wMDApJ1xuICB9KTtcblxuICBhbmltLmFkZEV2ZW50TGlzdGVuZXIoJ2ZpbmlzaCcsIHRoaXMub25BbmltYXRlT3V0Q29tcGxldGUuYmluZCh0aGlzKSk7XG4gIFxuICBpZiAoY29tcGxldGUpIHtcbiAgICB0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlKCk7XG4gIH1cbn07XG5cbkhvbWVJdGVtLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICBBU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZS5jYWxsKHRoaXMpO1xuXG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSG9tZUl0ZW07XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsImZ1bmN0aW9uIEUgKCkge1xuXHQvLyBLZWVwIHRoaXMgZW1wdHkgc28gaXQncyBlYXNpZXIgdG8gaW5oZXJpdCBmcm9tXG4gIC8vICh2aWEgaHR0cHM6Ly9naXRodWIuY29tL2xpcHNtYWNrIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9pc3N1ZXMvMylcbn1cblxuRS5wcm90b3R5cGUgPSB7XG5cdG9uOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG4gICAgXG4gICAgKGVbbmFtZV0gfHwgKGVbbmFtZV0gPSBbXSkpLnB1c2goe1xuICAgICAgZm46IGNhbGxiYWNrLFxuICAgICAgY3R4OiBjdHhcbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvbmNlOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLm9mZihuYW1lLCBmbik7XG4gICAgICBjYWxsYmFjay5hcHBseShjdHgsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4gdGhpcy5vbihuYW1lLCBmbiwgY3R4KTtcbiAgfSxcblxuICBlbWl0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBkYXRhID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBldnRBcnIgPSAoKHRoaXMuZSB8fCAodGhpcy5lID0ge30pKVtuYW1lXSB8fCBbXSkuc2xpY2UoKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGxlbiA9IGV2dEFyci5sZW5ndGg7XG4gICAgXG4gICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGV2dEFycltpXS5mbi5hcHBseShldnRBcnJbaV0uY3R4LCBkYXRhKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb2ZmOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuICAgIHZhciBldnRzID0gZVtuYW1lXTtcbiAgICB2YXIgbGl2ZUV2ZW50cyA9IFtdO1xuICAgIFxuICAgIGlmIChldnRzICYmIGNhbGxiYWNrKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZXZ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZXZ0c1tpXS5mbiAhPT0gY2FsbGJhY2spIGxpdmVFdmVudHMucHVzaChldnRzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gUmVtb3ZlIGV2ZW50IGZyb20gcXVldWUgdG8gcHJldmVudCBtZW1vcnkgbGVha1xuICAgIC8vIFN1Z2dlc3RlZCBieSBodHRwczovL2dpdGh1Yi5jb20vbGF6ZFxuICAgIC8vIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9jb21taXQvYzZlYmZhYTliYzk3M2IzM2QxMTBhODRhMzA3NzQyYjdjZjk0Yzk1MyNjb21taXRjb21tZW50LTUwMjQ5MTBcblxuICAgIChsaXZlRXZlbnRzLmxlbmd0aCkgXG4gICAgICA/IGVbbmFtZV0gPSBsaXZlRXZlbnRzXG4gICAgICA6IGRlbGV0ZSBlW25hbWVdO1xuICAgIFxuICAgIHJldHVybiB0aGlzO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEU7XG4iLCJ2YXIgVGlueUVtaXR0ZXIgPSByZXF1aXJlKCd0aW55LWVtaXR0ZXInKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBBU2NyZWVuID0gZnVuY3Rpb24oKXtcbn07XG5cbmluaGVyaXRzKEFTY3JlZW4sIFRpbnlFbWl0dGVyKTtcblxuQVNjcmVlbi5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oY29tcGxldGUpIHtcbiAgdGhpcy5vbkFuaW1hdGVJbkNvbXBsZXRlKCk7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgnYW5pbWF0ZUluQ29tcGxldGUnKTtcbn07XG5cbkFTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVPdXQgPSBmdW5jdGlvbihjb21wbGV0ZSkge1xuICB0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlKCk7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ2FuaW1hdGVPdXRDb21wbGV0ZScpO1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLm9mZignYW5pbWF0ZUluQ29tcGxldGUnKVxuICAgICAgLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFTY3JlZW47IiwidmFyIFRpbnlFbWl0dGVyID0gcmVxdWlyZSgndGlueS1lbWl0dGVyJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgU2NyZWVuTmF2aWdhdG9yID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5pdGVtcyA9IHt9O1xuICB0aGlzLmN1cnJlbnRJdGVtID0gbnVsbDtcbiAgdGhpcy5jdXJyZW50SXRlbUlkID0gbnVsbDtcbiAgdGhpcy5wcmV2SXRlbSA9IG51bGw7XG5cbiAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuICB0aGlzLnRyYW5zaXRpb25UeXBlID0gdGhpcy5kZWZhdWx0VHJhbnNpdGlvblR5cGUgPSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9OT05FO1xuICB0aGlzLmFuaW1hdGVJbkNvbXBsZXRlQ2IgPSB0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUuYmluZCh0aGlzKTtcbiAgdGhpcy5hbmltYXRlT3V0Q29tcGxldGVDYiA9IHRoaXMub25BbmltYXRlSW5Db21wbGV0ZS5iaW5kKHRoaXMpO1xuICB0aGlzLmFuaW1hdGVDb21wbGV0ZUNvdW50ID0gMDtcbn07XG5cbmluaGVyaXRzKFNjcmVlbk5hdmlnYXRvciwgVGlueUVtaXR0ZXIpO1xuXG5TY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9PVVRfQU5EX0lOID0gJ291dEFuZEluJztcblNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9USEVOX0lOID0gJ291dFRoZW5Jbic7XG5TY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9JTl9USEVOX09VVCA9ICdpblRoZW5PdXQnO1xuU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUID0gJ291dCc7XG5TY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9JTiA9ICdpbic7XG5TY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9OT05FID0gJ25vbmUnO1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmFkZEl0ZW0gPSBmdW5jdGlvbihpZCwgaXRlbSkge1xuICB0aGlzLml0ZW1zW2lkXSA9IGl0ZW07XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmdldEl0ZW0gPSBmdW5jdGlvbihpZCkge1xuICByZXR1cm4gdGhpcy5pdGVtc1tpZF07XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLnNob3dTY3JlZW4gPSBmdW5jdGlvbihpZCwgdHJhbnNpdGlvblR5cGUpIHtcbiAgaWYgKGlkID09PSB0aGlzLmN1cnJlbnRJdGVtSWQpIHJldHVybjtcblxuXG4gIHZhciBuZXdJdGVtID0gdGhpcy5nZXRJdGVtKGlkKTtcblxuICBpZiAoIW5ld0l0ZW0pe1xuICAgIHRocm93IG5ldyBFcnJvcignU2NyZWVuTmF2aWdhdG9yIC0gdGhlIGl0ZW0gd2l0aCB0aGUgaWQgJyArIGlkICsgJyBkb2VzblxcJ3QgZXhpc3QnKTtcbiAgfVxuXG4gIGlmICh0aGlzLmN1cnJlbnRJdGVtKXtcbiAgICB0aGlzLnByZXZJdGVtID0gdGhpcy5jdXJyZW50SXRlbTtcbiAgfVxuXG4gIHRoaXMuY3VycmVudEl0ZW1JZCA9IGlkO1xuICB0aGlzLmN1cnJlbnRJdGVtID0gbmV3SXRlbTtcblxuICB0aGlzLm9uQ2hhbmdlKCk7XG5cbiAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvblR5cGUpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5jbGVhclNjcmVlbiA9IGZ1bmN0aW9uKHRyYW5zaXRpb25UeXBlKSB7XG4gIGlmICh0aGlzLmN1cnJlbnRTY3JlZW4pe1xuICAgIHRoaXMucHJldlNjcmVlbiA9IHRoaXMuY3VycmVudFNjcmVlbjtcbiAgfVxuXG4gIHRoaXMub25DaGFuZ2UoKTtcblxuICB0aGlzLnN0YXJ0VHJhbnNpdGlvbih0cmFuc2l0aW9uVHlwZSk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLnN0YXJ0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHRyYW5zaXRpb25UeXBlKSB7XG4gIGlmICh0aGlzLnRyYW5zaXRpb25SdW5uaW5nKXtcbiAgICB0aGlzLmNhbmNlbFRyYW5zaXRpb24oKTtcbiAgfSBcblxuICB2YXIgY3VycmVudFNjcmVlbiA9IHRoaXMuY3VycmVudEl0ZW0gPyB0aGlzLmN1cnJlbnRJdGVtLmdldFNjcmVlbigpIDogbnVsbDtcbiAgdmFyIHByZXZTY3JlZW4gPSB0aGlzLnByZXZJdGVtID8gdGhpcy5wcmV2SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG5cbiAgdGhpcy5hbmltYXRlQ29tcGxldGVDb3VudCA9IDA7XG4gIHRoaXMudHJhbnNpdGlvblR5cGUgPSB0cmFuc2l0aW9uVHlwZSA/IHRyYW5zaXRpb25UeXBlIDogdGhpcy5kZWZhdWx0VHJhbnNpdGlvblR5cGU7XG5cbiAgc3dpdGNoKHRoaXMudHJhbnNpdGlvblR5cGUpe1xuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX0FORF9JTjpcbiAgICAgIGlmIChwcmV2U2NyZWVuKSB7XG4gICAgICAgIHByZXZTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIHRoaXMuYW5pbWF0ZU91dENvbXBsZXRlQ2IpO1xuICAgICAgICBwcmV2U2NyZWVuLmFuaW1hdGVPdXQoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGN1cnJlbnRTY3JlZW4pIHtcbiAgICAgICAgY3VycmVudFNjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCB0aGlzLmFuaW1hdGVJbkNvbXBsZXRlQ2IpO1xuICAgICAgICBjdXJyZW50U2NyZWVuLmFuaW1hdGVJbigpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9USEVOX0lOOlxuICAgICAgaWYgKHByZXZTY3JlZW4pIHtcbiAgICAgICAgcHJldlNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgdGhpcy5hbmltYXRlT3V0Q29tcGxldGVDYik7XG4gICAgICAgIHByZXZTY3JlZW4uYW5pbWF0ZU91dCgpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMub25BbmltYXRlT3V0Q29tcGxldGUoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9JTl9USEVOX09VVDpcbiAgICAgIGlmIChjdXJyZW50U2NyZWVuKSB7XG4gICAgICAgIGN1cnJlbnRTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgdGhpcy5hbmltYXRlSW5Db21wbGV0ZUNiKTtcbiAgICAgICAgY3VycmVudFNjcmVlbi5hbmltYXRlSW4oKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9PVVQ6XG4gICAgICBpZiAocHJldlNjcmVlbikge1xuICAgICAgICBwcmV2U2NyZWVuLm9uKCdhbmltYXRlT3V0Q29tcGxldGUnLCB0aGlzLmFuaW1hdGVPdXRDb21wbGV0ZUNiKTtcbiAgICAgICAgcHJldlNjcmVlbi5hbmltYXRlT3V0KCk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX0lOOlxuICAgICAgaWYgKGN1cnJlbnRTY3JlZW4pIHtcbiAgICAgICAgY3VycmVudFNjcmVlbi5vbignYW5pbWF0ZUluQ29tcGxldGUnLCB0aGlzLmFuaW1hdGVJbkNvbXBsZXRlQ2IpO1xuICAgICAgICBjdXJyZW50U2NyZWVuLmFuaW1hdGVJbigpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9OT05FOlxuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzLnRyYW5zaXRpb25UeXBlID0gU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fTk9ORTtcblxuICAgICAgaWYgKHByZXZTY3JlZW4pIHByZXZTY3JlZW4uYW5pbWF0ZU91dCh0cnVlKTtcbiAgICAgIGlmIChjdXJyZW50U2NyZWVuKSBjdXJyZW50U2NyZWVuLmFuaW1hdGVJbih0cnVlKTtcblxuICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICB0aGlzLm9uVHJhbnNpdGlvblN0YXJ0KCk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmNhbmNlbFRyYW5zaXRpb24gPSBmdW5jdGlvbihjb21wbGV0ZSkge1xuICB0aGlzLnRyYW5zaXRpb25SdW5uaW5nID0gZmFsc2U7XG5cbiAgdGhpcy5kaXNwb3NlVHJhbnNpdGlvbigpO1xuXG4gIGlmICh0aGlzLnByZXZJdGVtKXtcbiAgICB0aGlzLnByZXZJdGVtLmdldFNjcmVlbigpLmFuaW1hdGVPdXQodHJ1ZSk7XG4gIH1cblxuICBpZiAodGhpcy5jdXJyZW50SXRlbSl7XG4gICAgdGhpcy5jdXJyZW50SXRlbS5nZXRTY3JlZW4oKS5hbmltYXRlT3V0KHRydWUpO1xuICB9XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLm9uQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgnY2hhbmdlJyk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLm9uVHJhbnNpdGlvblN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgndHJhbnNpdGlvblN0YXJ0Jyk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLm9uQW5pbWF0ZUluQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGN1cnJlbnRTY3JlZW4gPSB0aGlzLmN1cnJlbnRJdGVtID8gdGhpcy5jdXJyZW50SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG4gIHZhciBwcmV2U2NyZWVuID0gdGhpcy5wcmV2SXRlbSA/IHRoaXMucHJldkl0ZW0uZ2V0U2NyZWVuKCkgOiBudWxsO1xuXG4gIHRoaXMuYW5pbWF0ZUNvbXBsZXRlQ291bnQrKzsgXG4gIFxuICBzd2l0Y2godGhpcy50cmFuc2l0aW9uVHlwZSl7XG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9PVVRfQU5EX0lOOlxuICAgICAgaWYgKHRoaXMuYW5pbWF0ZUNvbXBsZXRlQ291bnQgPT09IDIgfHwgIXRoaXMucHJldkl0ZW0pIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9PVVRfVEhFTl9JTjpcbiAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUoKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9JTl9USEVOX09VVDpcbiAgICAgIGlmIChwcmV2U2NyZWVuKXtcbiAgICAgICAgcHJldlNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgdGhpcy5hbmltYXRlT3V0Q29tcGxldGVDYik7XG4gICAgICAgIHByZXZTY3JlZW4uYW5pbWF0ZU91dCgpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9JTjpcbiAgICAgICAgaWYgKHRoaXMucHJldkl0ZW0pIHRoaXMucHJldkl0ZW0uZ2V0U2NyZWVuKCkuYW5pbWF0ZU91dCh0cnVlKTtcblxuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcbiAgfVxufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY3VycmVudFNjcmVlbiA9IHRoaXMuY3VycmVudEl0ZW0gPyB0aGlzLmN1cnJlbnRJdGVtLmdldFNjcmVlbigpIDogbnVsbDtcbiAgdmFyIHByZXZTY3JlZW4gPSB0aGlzLnByZXZJdGVtID8gdGhpcy5wcmV2SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG5cbiAgdGhpcy5hbmltYXRlQ29tcGxldGVDb3VudCsrO1xuICBcbiAgc3dpdGNoKHRoaXMudHJhbnNpdGlvblR5cGUpe1xuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX0FORF9JTjpcbiAgICAgIGlmICh0aGlzLmFuaW1hdGVDb21wbGV0ZUNvdW50ID09PSAyIHx8ICF0aGlzLmN1cnJlbnRJdGVtKSB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX1RIRU5fSU46XG4gICAgICBpZiAoY3VycmVudFNjcmVlbil7XG4gICAgICAgIGN1cnJlbnRTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgdGhpcy5hbmltYXRlSW5Db21wbGV0ZUNiKTtcbiAgICAgICAgY3VycmVudFNjcmVlbi5hbmltYXRlSW4oKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fSU5fVEhFTl9PVVQ6XG4gICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUOlxuICAgICAgaWYgKHRoaXMuY3VycmVudEl0ZW0pIHRoaXMuY3VycmVudEl0ZW0uZ2V0U2NyZWVuKCkuYW5pbWF0ZUluKHRydWUpO1xuXG4gICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcbiAgfVxufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5vblRyYW5zaXRpb25Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnRyYW5zaXRpb25SdW5uaW5nID0gZmFsc2U7XG5cbiAgdGhpcy5kaXNwb3NlVHJhbnNpdGlvbigpO1xuXG4gIHRoaXMuZW1pdCgndHJhbnNpdGlvbkNvbXBsZXRlJyk7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3IucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRyYW5zaXRpb25SdW5uaW5nKXtcbiAgICB0aGlzLmNhbmNlbFRyYW5zaXRpb24oKTtcbiAgfVxufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5kaXNwb3NlVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY3VycmVudFNjcmVlbiA9IHRoaXMuY3VycmVudEl0ZW0gPyB0aGlzLmN1cnJlbnRJdGVtLmdldFNjcmVlbigpIDogbnVsbDtcbiAgdmFyIHByZXZTY3JlZW4gPSB0aGlzLnByZXZJdGVtID8gdGhpcy5wcmV2SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG5cbiAgaWYgKHByZXZTY3JlZW4pe1xuICAgIHByZXZTY3JlZW4ub2ZmKCdhbmltYXRlSW5Db21wbGV0ZScsIHRoaXMuYW5pbWF0ZUluQ29tcGxldGVDYilcbiAgICAgICAgICAgICAgLm9mZignYW5pbWF0ZU91dENvbXBsZXRlJywgdGhpcy5hbmltYXRlT3V0Q29tcGxldGVDYik7XG5cbiAgICB0aGlzLnByZXZJdGVtLmRpc3Bvc2VTY3JlZW4oKTtcbiAgfVxuXG4gIGlmIChjdXJyZW50U2NyZWVuKXtcbiAgICBjdXJyZW50U2NyZWVuLm9mZignYW5pbWF0ZUluQ29tcGxldGUnLCB0aGlzLmFuaW1hdGVJbkNvbXBsZXRlQ2IpXG4gICAgICAgICAgICAgICAgIC5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScsIHRoaXMuYW5pbWF0ZU91dENvbXBsZXRlQ2IpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5BU2NyZWVuID0gcmVxdWlyZSgnLi9BU2NyZWVuLmpzJyk7XG5tb2R1bGUuZXhwb3J0cy5TY3JlZW5OYXZpZ2F0b3JJdGVtID0gcmVxdWlyZSgnLi9TY3JlZW5OYXZpZ2F0b3JJdGVtLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2NyZWVuTmF2aWdhdG9yO1xuXG4iLCJ2YXIgU2NyZWVuTmF2aWdhdG9ySXRlbSA9IGZ1bmN0aW9uKHNjcmVlbiwgZXZlbnRzKXtcbiAgdGhpcy5zY3JlZW4gPSBzY3JlZW47XG5cbiAgdGhpcy5pc0luc3RhbmNlID0gdHlwZW9mIHNjcmVlbiA9PT0gJ2Z1bmN0aW9uJyA/IGZhbHNlIDogdHJ1ZTtcbiAgdGhpcy5pbnN0YW5jZSA9IG51bGw7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5nZXRTY3JlZW4gPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLmluc3RhbmNlKXtcbiAgICBpZiAodGhpcy5pc0luc3RhbmNlKSB7XG4gICAgICB0aGlzLmluc3RhbmNlID0gdGhpcy5zY3JlZW47XG4gICAgfWVsc2V7XG4gICAgICB0aGlzLmluc3RhbmNlID0gbmV3IHRoaXMuc2NyZWVuKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXMuaW5zdGFuY2U7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5kaXNwb3NlU2NyZWVuID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmlzSW5zdGFuY2UpIHJldHVybjtcblxuICB0aGlzLmluc3RhbmNlLmRpc3Bvc2UoKTtcbiAgdGhpcy5pbnN0YW5jZSA9IG51bGw7XG59O1xuXG5TY3JlZW5OYXZpZ2F0b3JJdGVtLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmlzSW5zdGFuY2Upe1xuICAgIHRoaXMuc2NyZWVuLmRpc3Bvc2UoKTtcbiAgfWVsc2UgaWYgKHRoaXMuaW5zdGFuY2Upe1xuICAgIHRoaXMuaW5zdGFuY2UuZGlzcG9zZSgpO1xuICB9XG5cbiAgdGhpcy5pbnN0YW5jZSA9IHRoaXMuc2NyZWVuID0gbnVsbDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2NyZWVuTmF2aWdhdG9ySXRlbTsiXX0=
