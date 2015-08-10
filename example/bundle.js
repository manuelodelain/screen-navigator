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

},{"../src/ScreenNavigator.js":11,"../src/ScreenNavigatorItem.js":12,"./pages/About.js":3,"./pages/Contact.js":4,"./pages/Home.js":5}],2:[function(require,module,exports){
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


},{"../../src/AScreen.js":10,"inherits":8}],3:[function(require,module,exports){
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

},{"./APage.js":2,"inherits":8}],4:[function(require,module,exports){
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

},{"./APage.js":2,"inherits":8}],5:[function(require,module,exports){
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


},{"../../src/ScreenNavigator.js":11,"../../src/ScreenNavigatorItem.js":12,"./APage.js":2,"./home/HomeSubPage.js":6,"inherits":8}],6:[function(require,module,exports){
var AScreen = require('../../../src/AScreen.js');
var inherits = require('inherits');
var TweenMax = require('gsap');

var HomeItem = function(container, index){
  this.element = document.createElement('div');

  this.element.classList.add('sub-page');
  this.element.innerHTML = 'page ' + index;

  container.appendChild(this.element);
};

inherits(HomeItem, AScreen);

HomeItem.prototype.animateIn = function() {
  TweenMax.fromTo(this.element, 1, {
    xPercent: 100
  }, {
    xPercent: 0,
    ease: Expo.easeInOut,
    onComplete: this.onAnimateInComplete.bind(this)
  });

  this.element.classList.add('active');
};

HomeItem.prototype.onAnimateInComplete = function() {
  AScreen.prototype.onAnimateInComplete.call(this);
};

HomeItem.prototype.animateOut = function(complete) {
  TweenMax.to(this.element, 1, {
    xPercent: -100,
    ease: Expo.easeOut,
    onComplete: this.onAnimateOutComplete.bind(this)
  });
  
  if (complete) {
    this.onAnimateOutComplete();
  }
};

HomeItem.prototype.onAnimateOutComplete = function() {
  AScreen.prototype.onAnimateOutComplete.call(this);

  this.element.classList.remove('active');
};

module.exports = HomeItem;

},{"../../../src/AScreen.js":10,"gsap":7,"inherits":8}],7:[function(require,module,exports){
(function (global){
/*!
 * VERSION: 1.17.0
 * DATE: 2015-05-27
 * UPDATES AND DOCS AT: http://greensock.com
 * 
 * Includes all of the following: TweenLite, TweenMax, TimelineLite, TimelineMax, EasePack, CSSPlugin, RoundPropsPlugin, BezierPlugin, AttrPlugin, DirectionalRotationPlugin
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {

	"use strict";

	_gsScope._gsDefine("TweenMax", ["core.Animation","core.SimpleTimeline","TweenLite"], function(Animation, SimpleTimeline, TweenLite) {

		var _slice = function(a) { //don't use [].slice because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
				var b = [],
					l = a.length,
					i;
				for (i = 0; i !== l; b.push(a[i++]));
				return b;
			},
			TweenMax = function(target, duration, vars) {
				TweenLite.call(this, target, duration, vars);
				this._cycle = 0;
				this._yoyo = (this.vars.yoyo === true);
				this._repeat = this.vars.repeat || 0;
				this._repeatDelay = this.vars.repeatDelay || 0;
				this._dirty = true; //ensures that if there is any repeat, the totalDuration will get recalculated to accurately report it.
				this.render = TweenMax.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)
			},
			_tinyNum = 0.0000000001,
			TweenLiteInternals = TweenLite._internals,
			_isSelector = TweenLiteInternals.isSelector,
			_isArray = TweenLiteInternals.isArray,
			p = TweenMax.prototype = TweenLite.to({}, 0.1, {}),
			_blankArray = [];

		TweenMax.version = "1.17.0";
		p.constructor = TweenMax;
		p.kill()._gc = false;
		TweenMax.killTweensOf = TweenMax.killDelayedCallsTo = TweenLite.killTweensOf;
		TweenMax.getTweensOf = TweenLite.getTweensOf;
		TweenMax.lagSmoothing = TweenLite.lagSmoothing;
		TweenMax.ticker = TweenLite.ticker;
		TweenMax.render = TweenLite.render;

		p.invalidate = function() {
			this._yoyo = (this.vars.yoyo === true);
			this._repeat = this.vars.repeat || 0;
			this._repeatDelay = this.vars.repeatDelay || 0;
			this._uncache(true);
			return TweenLite.prototype.invalidate.call(this);
		};
		
		p.updateTo = function(vars, resetDuration) {
			var curRatio = this.ratio,
				immediate = this.vars.immediateRender || vars.immediateRender,
				p;
			if (resetDuration && this._startTime < this._timeline._time) {
				this._startTime = this._timeline._time;
				this._uncache(false);
				if (this._gc) {
					this._enabled(true, false);
				} else {
					this._timeline.insert(this, this._startTime - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
				}
			}
			for (p in vars) {
				this.vars[p] = vars[p];
			}
			if (this._initted || immediate) {
				if (resetDuration) {
					this._initted = false;
					if (immediate) {
						this.render(0, true, true);
					}
				} else {
					if (this._gc) {
						this._enabled(true, false);
					}
					if (this._notifyPluginsOfEnabled && this._firstPT) {
						TweenLite._onPluginEvent("_onDisable", this); //in case a plugin like MotionBlur must perform some cleanup tasks
					}
					if (this._time / this._duration > 0.998) { //if the tween has finished (or come extremely close to finishing), we just need to rewind it to 0 and then render it again at the end which forces it to re-initialize (parsing the new vars). We allow tweens that are close to finishing (but haven't quite finished) to work this way too because otherwise, the values are so small when determining where to project the starting values that binary math issues creep in and can make the tween appear to render incorrectly when run backwards. 
						var prevTime = this._time;
						this.render(0, true, false);
						this._initted = false;
						this.render(prevTime, true, false);
					} else if (this._time > 0 || immediate) {
						this._initted = false;
						this._init();
						var inv = 1 / (1 - curRatio),
							pt = this._firstPT, endValue;
						while (pt) {
							endValue = pt.s + pt.c; 
							pt.c *= inv;
							pt.s = endValue - pt.c;
							pt = pt._next;
						}
					}
				}
			}
			return this;
		};
				
		p.render = function(time, suppressEvents, force) {
			if (!this._initted) if (this._duration === 0 && this.vars.repeat) { //zero duration tweens that render immediately have render() called from TweenLite's constructor, before TweenMax's constructor has finished setting _repeat, _repeatDelay, and _yoyo which are critical in determining totalDuration() so we need to call invalidate() which is a low-kb way to get those set properly.
				this.invalidate();
			}
			var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
				prevTime = this._time,
				prevTotalTime = this._totalTime, 
				prevCycle = this._cycle,
				duration = this._duration,
				prevRawPrevTime = this._rawPrevTime,
				isComplete, callback, pt, cycleDuration, r, type, pow, rawPrevTime;
			if (time >= totalDur) {
				this._totalTime = totalDur;
				this._cycle = this._repeat;
				if (this._yoyo && (this._cycle & 1) !== 0) {
					this._time = 0;
					this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
				} else {
					this._time = duration;
					this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
				}
				if (!this._reversed) {
					isComplete = true;
					callback = "onComplete";
					force = (force || this._timeline.autoRemoveChildren); //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
				}
				if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
					if (this._startTime === this._timeline._duration) { //if a zero-duration tween is at the VERY end of a timeline and that timeline renders at its end, it will typically add a tiny bit of cushion to the render time to prevent rounding errors from getting in the way of tweens rendering their VERY end. If we then reverse() that timeline, the zero-duration tween will trigger its onReverseComplete even though technically the playhead didn't pass over it again. It's a very specific edge case we must accommodate.
						time = 0;
					}
					if (time === 0 || prevRawPrevTime < 0 || prevRawPrevTime === _tinyNum) if (prevRawPrevTime !== time) {
						force = true;
						if (prevRawPrevTime > _tinyNum) {
							callback = "onReverseComplete";
						}
					}
					this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				}
				
			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				this._totalTime = this._time = this._cycle = 0;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
				if (prevTotalTime !== 0 || (duration === 0 && prevRawPrevTime > 0)) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						if (prevRawPrevTime >= 0) {
							force = true;
						}
						this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					}
				}
				if (!this._initted) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
					force = true;
				}
			} else {
				this._totalTime = this._time = time;
				
				if (this._repeat !== 0) {
					cycleDuration = duration + this._repeatDelay;
					this._cycle = (this._totalTime / cycleDuration) >> 0; //originally _totalTime % cycleDuration but floating point errors caused problems, so I normalized it. (4 % 0.8 should be 0 but Flash reports it as 0.79999999!)
					if (this._cycle !== 0) if (this._cycle === this._totalTime / cycleDuration) {
						this._cycle--; //otherwise when rendered exactly at the end time, it will act as though it is repeating (at the beginning)
					}
					this._time = this._totalTime - (this._cycle * cycleDuration);
					if (this._yoyo) if ((this._cycle & 1) !== 0) {
						this._time = duration - this._time;
					}
					if (this._time > duration) {
						this._time = duration;
					} else if (this._time < 0) {
						this._time = 0;
					}
				}

				if (this._easeType) {
					r = this._time / duration;
					type = this._easeType;
					pow = this._easePower;
					if (type === 1 || (type === 3 && r >= 0.5)) {
						r = 1 - r;
					}
					if (type === 3) {
						r *= 2;
					}
					if (pow === 1) {
						r *= r;
					} else if (pow === 2) {
						r *= r * r;
					} else if (pow === 3) {
						r *= r * r * r;
					} else if (pow === 4) {
						r *= r * r * r * r;
					}

					if (type === 1) {
						this.ratio = 1 - r;
					} else if (type === 2) {
						this.ratio = r;
					} else if (this._time / duration < 0.5) {
						this.ratio = r / 2;
					} else {
						this.ratio = 1 - (r / 2);
					}

				} else {
					this.ratio = this._ease.getRatio(this._time / duration);
				}
				
			}
				
			if (prevTime === this._time && !force && prevCycle === this._cycle) {
				if (prevTotalTime !== this._totalTime) if (this._onUpdate) if (!suppressEvents) { //so that onUpdate fires even during the repeatDelay - as long as the totalTime changed, we should trigger onUpdate.
					this._callback("onUpdate");
				}
				return;
			} else if (!this._initted) {
				this._init();
				if (!this._initted || this._gc) { //immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly. Also, if all of the tweening properties have been overwritten (which would cause _gc to be true, as set in _init()), we shouldn't continue otherwise an onStart callback could be called for example.
					return;
				} else if (!force && this._firstPT && ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration))) { //we stick it in the queue for rendering at the very end of the tick - this is a performance optimization because browsers invalidate styles and force a recalculation if you read, write, and then read style data (so it's better to read/read/read/write/write/write than read/write/read/write/read/write). The down side, of course, is that usually you WANT things to render immediately because you may have code running right after that which depends on the change. Like imagine running TweenLite.set(...) and then immediately after that, creating a nother tween that animates the same property to another value; the starting values of that 2nd tween wouldn't be accurate if lazy is true.
					this._time = prevTime;
					this._totalTime = prevTotalTime;
					this._rawPrevTime = prevRawPrevTime;
					this._cycle = prevCycle;
					TweenLiteInternals.lazyTweens.push(this);
					this._lazy = [time, suppressEvents];
					return;
				}
				//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
				if (this._time && !isComplete) {
					this.ratio = this._ease.getRatio(this._time / duration);
				} else if (isComplete && this._ease._calcEnd) {
					this.ratio = this._ease.getRatio((this._time === 0) ? 0 : 1);
				}
			}
			if (this._lazy !== false) {
				this._lazy = false;
			}

			if (!this._active) if (!this._paused && this._time !== prevTime && time >= 0) {
				this._active = true; //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
			}
			if (prevTotalTime === 0) {
				if (this._initted === 2 && time > 0) {
					//this.invalidate();
					this._init(); //will just apply overwriting since _initted of (2) means it was a from() tween that had immediateRender:true
				}
				if (this._startAt) {
					if (time >= 0) {
						this._startAt.render(time, suppressEvents, force);
					} else if (!callback) {
						callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
					}
				}
				if (this.vars.onStart) if (this._totalTime !== 0 || duration === 0) if (!suppressEvents) {
					this._callback("onStart");
				}
			}
			
			pt = this._firstPT;
			while (pt) {
				if (pt.f) {
					pt.t[pt.p](pt.c * this.ratio + pt.s);
				} else {
					pt.t[pt.p] = pt.c * this.ratio + pt.s;
				}
				pt = pt._next;
			}
			
			if (this._onUpdate) {
				if (time < 0) if (this._startAt && this._startTime) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
					this._startAt.render(time, suppressEvents, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
				}
				if (!suppressEvents) if (this._totalTime !== prevTotalTime || isComplete) {
					this._callback("onUpdate");
				}
			}
			if (this._cycle !== prevCycle) if (!suppressEvents) if (!this._gc) if (this.vars.onRepeat) {
				this._callback("onRepeat");
			}
			if (callback) if (!this._gc || force) { //check gc because there's a chance that kill() could be called in an onUpdate
				if (time < 0 && this._startAt && !this._onUpdate && this._startTime) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
					this._startAt.render(time, suppressEvents, force);
				}
				if (isComplete) {
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this._callback(callback);
				}
				if (duration === 0 && this._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) { //the onComplete or onReverseComplete could trigger movement of the playhead and for zero-duration tweens (which must discern direction) that land directly back on their start time, we don't want to fire again on the next render. Think of several addPause()'s in a timeline that forces the playhead to a certain spot, but what if it's already paused and another tween is tweening the "time" of the timeline? Each time it moves [forward] past that spot, it would move back, and since suppressEvents is true, it'd reset _rawPrevTime to _tinyNum so that when it begins again, the callback would fire (so ultimately it could bounce back and forth during that tween). Again, this is a very uncommon scenario, but possible nonetheless.
					this._rawPrevTime = 0;
				}
			}
		};
		
//---- STATIC FUNCTIONS -----------------------------------------------------------------------------------------------------------
		
		TweenMax.to = function(target, duration, vars) {
			return new TweenMax(target, duration, vars);
		};
		
		TweenMax.from = function(target, duration, vars) {
			vars.runBackwards = true;
			vars.immediateRender = (vars.immediateRender != false);
			return new TweenMax(target, duration, vars);
		};
		
		TweenMax.fromTo = function(target, duration, fromVars, toVars) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return new TweenMax(target, duration, toVars);
		};
		
		TweenMax.staggerTo = TweenMax.allTo = function(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			stagger = stagger || 0;
			var delay = vars.delay || 0,
				a = [],
				finalComplete = function() {
					if (vars.onComplete) {
						vars.onComplete.apply(vars.onCompleteScope || this, arguments);
					}
					onCompleteAll.apply(onCompleteAllScope || vars.callbackScope || this, onCompleteAllParams || _blankArray);
				},
				l, copy, i, p;
			if (!_isArray(targets)) {
				if (typeof(targets) === "string") {
					targets = TweenLite.selector(targets) || targets;
				}
				if (_isSelector(targets)) {
					targets = _slice(targets);
				}
			}
			targets = targets || [];
			if (stagger < 0) {
				targets = _slice(targets);
				targets.reverse();
				stagger *= -1;
			}
			l = targets.length - 1;
			for (i = 0; i <= l; i++) {
				copy = {};
				for (p in vars) {
					copy[p] = vars[p];
				}
				copy.delay = delay;
				if (i === l && onCompleteAll) {
					copy.onComplete = finalComplete;
				}
				a[i] = new TweenMax(targets[i], duration, copy);
				delay += stagger;
			}
			return a;
		};
		
		TweenMax.staggerFrom = TweenMax.allFrom = function(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			vars.runBackwards = true;
			vars.immediateRender = (vars.immediateRender != false);
			return TweenMax.staggerTo(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};
		
		TweenMax.staggerFromTo = TweenMax.allFromTo = function(targets, duration, fromVars, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return TweenMax.staggerTo(targets, duration, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};
				
		TweenMax.delayedCall = function(delay, callback, params, scope, useFrames) {
			return new TweenMax(callback, 0, {delay:delay, onComplete:callback, onCompleteParams:params, callbackScope:scope, onReverseComplete:callback, onReverseCompleteParams:params, immediateRender:false, useFrames:useFrames, overwrite:0});
		};
		
		TweenMax.set = function(target, vars) {
			return new TweenMax(target, 0, vars);
		};
		
		TweenMax.isTweening = function(target) {
			return (TweenLite.getTweensOf(target, true).length > 0);
		};
		
		var _getChildrenOf = function(timeline, includeTimelines) {
				var a = [],
					cnt = 0,
					tween = timeline._first;
				while (tween) {
					if (tween instanceof TweenLite) {
						a[cnt++] = tween;
					} else {
						if (includeTimelines) {
							a[cnt++] = tween;
						}
						a = a.concat(_getChildrenOf(tween, includeTimelines));
						cnt = a.length;
					}
					tween = tween._next;
				}
				return a;
			}, 
			getAllTweens = TweenMax.getAllTweens = function(includeTimelines) {
				return _getChildrenOf(Animation._rootTimeline, includeTimelines).concat( _getChildrenOf(Animation._rootFramesTimeline, includeTimelines) );
			};
		
		TweenMax.killAll = function(complete, tweens, delayedCalls, timelines) {
			if (tweens == null) {
				tweens = true;
			}
			if (delayedCalls == null) {
				delayedCalls = true;
			}
			var a = getAllTweens((timelines != false)),
				l = a.length,
				allTrue = (tweens && delayedCalls && timelines),
				isDC, tween, i;
			for (i = 0; i < l; i++) {
				tween = a[i];
				if (allTrue || (tween instanceof SimpleTimeline) || ((isDC = (tween.target === tween.vars.onComplete)) && delayedCalls) || (tweens && !isDC)) {
					if (complete) {
						tween.totalTime(tween._reversed ? 0 : tween.totalDuration());
					} else {
						tween._enabled(false, false);
					}
				}
			}
		};
		
		TweenMax.killChildTweensOf = function(parent, complete) {
			if (parent == null) {
				return;
			}
			var tl = TweenLiteInternals.tweenLookup,
				a, curParent, p, i, l;
			if (typeof(parent) === "string") {
				parent = TweenLite.selector(parent) || parent;
			}
			if (_isSelector(parent)) {
				parent = _slice(parent);
			}
			if (_isArray(parent)) {
				i = parent.length;
				while (--i > -1) {
					TweenMax.killChildTweensOf(parent[i], complete);
				}
				return;
			}
			a = [];
			for (p in tl) {
				curParent = tl[p].target.parentNode;
				while (curParent) {
					if (curParent === parent) {
						a = a.concat(tl[p].tweens);
					}
					curParent = curParent.parentNode;
				}
			}
			l = a.length;
			for (i = 0; i < l; i++) {
				if (complete) {
					a[i].totalTime(a[i].totalDuration());
				}
				a[i]._enabled(false, false);
			}
		};

		var _changePause = function(pause, tweens, delayedCalls, timelines) {
			tweens = (tweens !== false);
			delayedCalls = (delayedCalls !== false);
			timelines = (timelines !== false);
			var a = getAllTweens(timelines),
				allTrue = (tweens && delayedCalls && timelines),
				i = a.length,
				isDC, tween;
			while (--i > -1) {
				tween = a[i];
				if (allTrue || (tween instanceof SimpleTimeline) || ((isDC = (tween.target === tween.vars.onComplete)) && delayedCalls) || (tweens && !isDC)) {
					tween.paused(pause);
				}
			}
		};
		
		TweenMax.pauseAll = function(tweens, delayedCalls, timelines) {
			_changePause(true, tweens, delayedCalls, timelines);
		};
		
		TweenMax.resumeAll = function(tweens, delayedCalls, timelines) {
			_changePause(false, tweens, delayedCalls, timelines);
		};

		TweenMax.globalTimeScale = function(value) {
			var tl = Animation._rootTimeline,
				t = TweenLite.ticker.time;
			if (!arguments.length) {
				return tl._timeScale;
			}
			value = value || _tinyNum; //can't allow zero because it'll throw the math off
			tl._startTime = t - ((t - tl._startTime) * tl._timeScale / value);
			tl = Animation._rootFramesTimeline;
			t = TweenLite.ticker.frame;
			tl._startTime = t - ((t - tl._startTime) * tl._timeScale / value);
			tl._timeScale = Animation._rootTimeline._timeScale = value;
			return value;
		};
		
	
//---- GETTERS / SETTERS ----------------------------------------------------------------------------------------------------------
		
		p.progress = function(value) {
			return (!arguments.length) ? this._time / this.duration() : this.totalTime( this.duration() * ((this._yoyo && (this._cycle & 1) !== 0) ? 1 - value : value) + (this._cycle * (this._duration + this._repeatDelay)), false);
		};
		
		p.totalProgress = function(value) {
			return (!arguments.length) ? this._totalTime / this.totalDuration() : this.totalTime( this.totalDuration() * value, false);
		};
		
		p.time = function(value, suppressEvents) {
			if (!arguments.length) {
				return this._time;
			}
			if (this._dirty) {
				this.totalDuration();
			}
			if (value > this._duration) {
				value = this._duration;
			}
			if (this._yoyo && (this._cycle & 1) !== 0) {
				value = (this._duration - value) + (this._cycle * (this._duration + this._repeatDelay));
			} else if (this._repeat !== 0) {
				value += this._cycle * (this._duration + this._repeatDelay);
			}
			return this.totalTime(value, suppressEvents);
		};

		p.duration = function(value) {
			if (!arguments.length) {
				return this._duration; //don't set _dirty = false because there could be repeats that haven't been factored into the _totalDuration yet. Otherwise, if you create a repeated TweenMax and then immediately check its duration(), it would cache the value and the totalDuration would not be correct, thus repeats wouldn't take effect.
			}
			return Animation.prototype.duration.call(this, value);
		};

		p.totalDuration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					//instead of Infinity, we use 999999999999 so that we can accommodate reverses
					this._totalDuration = (this._repeat === -1) ? 999999999999 : this._duration * (this._repeat + 1) + (this._repeatDelay * this._repeat);
					this._dirty = false;
				}
				return this._totalDuration;
			}
			return (this._repeat === -1) ? this : this.duration( (value - (this._repeat * this._repeatDelay)) / (this._repeat + 1) );
		};
		
		p.repeat = function(value) {
			if (!arguments.length) {
				return this._repeat;
			}
			this._repeat = value;
			return this._uncache(true);
		};
		
		p.repeatDelay = function(value) {
			if (!arguments.length) {
				return this._repeatDelay;
			}
			this._repeatDelay = value;
			return this._uncache(true);
		};
		
		p.yoyo = function(value) {
			if (!arguments.length) {
				return this._yoyo;
			}
			this._yoyo = value;
			return this;
		};
		
		
		return TweenMax;
		
	}, true);








/*
 * ----------------------------------------------------------------
 * TimelineLite
 * ----------------------------------------------------------------
 */
	_gsScope._gsDefine("TimelineLite", ["core.Animation","core.SimpleTimeline","TweenLite"], function(Animation, SimpleTimeline, TweenLite) {

		var TimelineLite = function(vars) {
				SimpleTimeline.call(this, vars);
				this._labels = {};
				this.autoRemoveChildren = (this.vars.autoRemoveChildren === true);
				this.smoothChildTiming = (this.vars.smoothChildTiming === true);
				this._sortChildren = true;
				this._onUpdate = this.vars.onUpdate;
				var v = this.vars,
					val, p;
				for (p in v) {
					val = v[p];
					if (_isArray(val)) if (val.join("").indexOf("{self}") !== -1) {
						v[p] = this._swapSelfInParams(val);
					}
				}
				if (_isArray(v.tweens)) {
					this.add(v.tweens, 0, v.align, v.stagger);
				}
			},
			_tinyNum = 0.0000000001,
			TweenLiteInternals = TweenLite._internals,
			_internals = TimelineLite._internals = {},
			_isSelector = TweenLiteInternals.isSelector,
			_isArray = TweenLiteInternals.isArray,
			_lazyTweens = TweenLiteInternals.lazyTweens,
			_lazyRender = TweenLiteInternals.lazyRender,
			_blankArray = [],
			_globals = _gsScope._gsDefine.globals,
			_copy = function(vars) {
				var copy = {}, p;
				for (p in vars) {
					copy[p] = vars[p];
				}
				return copy;
			},
			_pauseCallback = _internals.pauseCallback = function(tween, callback, params, scope) {
				var tl = tween._timeline,
					time = tl._totalTime,
					startTime = tween._startTime,
					reversed = (tween._rawPrevTime < 0 || (tween._rawPrevTime === 0 && tl._reversed)),//don't use tween.ratio because if the playhead lands exactly on top of the addPause(), ratio will be 1 even if the master timeline was reversed (which is correct). The key here is to sense the direction of the playhead.
					next = reversed ? 0 : _tinyNum,
					prev = reversed ? _tinyNum : 0,
					sibling;
				if (callback || !this._forcingPlayhead) { //if the user calls a method that moves the playhead (like progress() or time()), it should honor that and skip any pauses (although if there's a callback positioned at that pause, it must jump there and make the call to ensure the time is EXACTLY what it is supposed to be, and then proceed to where the playhead is being forced). Otherwise, imagine placing a pause in the middle of a timeline and then doing timeline.progress(0.9) - it would get stuck where the pause is.
					tl.pause(startTime);
					//now find sibling tweens that are EXACTLY at the same spot on the timeline and adjust the _rawPrevTime so that they fire (or don't fire) correctly on the next render. This is primarily to accommodate zero-duration tweens/callbacks that are positioned right on top of a pause. For example, tl.to(...).call(...).addPause(...).call(...) - notice that there's a call() on each side of the pause, so when it's running forward it should call the first one and then pause, and then when resumed, call the other. Zero-duration tweens use _rawPrevTime to sense momentum figure out if events were suppressed when arriving directly on top of that time.
					sibling = tween._prev;
					while (sibling && sibling._startTime === startTime) {
						sibling._rawPrevTime = prev;
						sibling = sibling._prev;
					}
					sibling = tween._next;
					while (sibling && sibling._startTime === startTime) {
						sibling._rawPrevTime = next;
						sibling = sibling._next;
					}
					if (callback) {
						callback.apply(scope || tl.vars.callbackScope || tl, params || _blankArray);
					}
					if (this._forcingPlayhead || !tl._paused) { //the callback could have called resume().
						tl.seek(time);
					}
				}
			},
			_slice = function(a) { //don't use [].slice because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
				var b = [],
					l = a.length,
					i;
				for (i = 0; i !== l; b.push(a[i++]));
				return b;
			},
			p = TimelineLite.prototype = new SimpleTimeline();

		TimelineLite.version = "1.17.0";
		p.constructor = TimelineLite;
		p.kill()._gc = p._forcingPlayhead = false;

		/* might use later...
		//translates a local time inside an animation to the corresponding time on the root/global timeline, factoring in all nesting and timeScales.
		function localToGlobal(time, animation) {
			while (animation) {
				time = (time / animation._timeScale) + animation._startTime;
				animation = animation.timeline;
			}
			return time;
		}

		//translates the supplied time on the root/global timeline into the corresponding local time inside a particular animation, factoring in all nesting and timeScales
		function globalToLocal(time, animation) {
			var scale = 1;
			time -= localToGlobal(0, animation);
			while (animation) {
				scale *= animation._timeScale;
				animation = animation.timeline;
			}
			return time * scale;
		}
		*/

		p.to = function(target, duration, vars, position) {
			var Engine = (vars.repeat && _globals.TweenMax) || TweenLite;
			return duration ? this.add( new Engine(target, duration, vars), position) : this.set(target, vars, position);
		};

		p.from = function(target, duration, vars, position) {
			return this.add( ((vars.repeat && _globals.TweenMax) || TweenLite).from(target, duration, vars), position);
		};

		p.fromTo = function(target, duration, fromVars, toVars, position) {
			var Engine = (toVars.repeat && _globals.TweenMax) || TweenLite;
			return duration ? this.add( Engine.fromTo(target, duration, fromVars, toVars), position) : this.set(target, toVars, position);
		};

		p.staggerTo = function(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			var tl = new TimelineLite({onComplete:onCompleteAll, onCompleteParams:onCompleteAllParams, callbackScope:onCompleteAllScope, smoothChildTiming:this.smoothChildTiming}),
				i;
			if (typeof(targets) === "string") {
				targets = TweenLite.selector(targets) || targets;
			}
			targets = targets || [];
			if (_isSelector(targets)) { //senses if the targets object is a selector. If it is, we should translate it into an array.
				targets = _slice(targets);
			}
			stagger = stagger || 0;
			if (stagger < 0) {
				targets = _slice(targets);
				targets.reverse();
				stagger *= -1;
			}
			for (i = 0; i < targets.length; i++) {
				if (vars.startAt) {
					vars.startAt = _copy(vars.startAt);
				}
				tl.to(targets[i], duration, _copy(vars), i * stagger);
			}
			return this.add(tl, position);
		};

		p.staggerFrom = function(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			vars.immediateRender = (vars.immediateRender != false);
			vars.runBackwards = true;
			return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};

		p.staggerFromTo = function(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
		};

		p.call = function(callback, params, scope, position) {
			return this.add( TweenLite.delayedCall(0, callback, params, scope), position);
		};

		p.set = function(target, vars, position) {
			position = this._parseTimeOrLabel(position, 0, true);
			if (vars.immediateRender == null) {
				vars.immediateRender = (position === this._time && !this._paused);
			}
			return this.add( new TweenLite(target, 0, vars), position);
		};

		TimelineLite.exportRoot = function(vars, ignoreDelayedCalls) {
			vars = vars || {};
			if (vars.smoothChildTiming == null) {
				vars.smoothChildTiming = true;
			}
			var tl = new TimelineLite(vars),
				root = tl._timeline,
				tween, next;
			if (ignoreDelayedCalls == null) {
				ignoreDelayedCalls = true;
			}
			root._remove(tl, true);
			tl._startTime = 0;
			tl._rawPrevTime = tl._time = tl._totalTime = root._time;
			tween = root._first;
			while (tween) {
				next = tween._next;
				if (!ignoreDelayedCalls || !(tween instanceof TweenLite && tween.target === tween.vars.onComplete)) {
					tl.add(tween, tween._startTime - tween._delay);
				}
				tween = next;
			}
			root.add(tl, 0);
			return tl;
		};

		p.add = function(value, position, align, stagger) {
			var curTime, l, i, child, tl, beforeRawTime;
			if (typeof(position) !== "number") {
				position = this._parseTimeOrLabel(position, 0, true, value);
			}
			if (!(value instanceof Animation)) {
				if ((value instanceof Array) || (value && value.push && _isArray(value))) {
					align = align || "normal";
					stagger = stagger || 0;
					curTime = position;
					l = value.length;
					for (i = 0; i < l; i++) {
						if (_isArray(child = value[i])) {
							child = new TimelineLite({tweens:child});
						}
						this.add(child, curTime);
						if (typeof(child) !== "string" && typeof(child) !== "function") {
							if (align === "sequence") {
								curTime = child._startTime + (child.totalDuration() / child._timeScale);
							} else if (align === "start") {
								child._startTime -= child.delay();
							}
						}
						curTime += stagger;
					}
					return this._uncache(true);
				} else if (typeof(value) === "string") {
					return this.addLabel(value, position);
				} else if (typeof(value) === "function") {
					value = TweenLite.delayedCall(0, value);
				} else {
					throw("Cannot add " + value + " into the timeline; it is not a tween, timeline, function, or string.");
				}
			}

			SimpleTimeline.prototype.add.call(this, value, position);

			//if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.
			if (this._gc || this._time === this._duration) if (!this._paused) if (this._duration < this.duration()) {
				//in case any of the ancestors had completed but should now be enabled...
				tl = this;
				beforeRawTime = (tl.rawTime() > value._startTime); //if the tween is placed on the timeline so that it starts BEFORE the current rawTime, we should align the playhead (move the timeline). This is because sometimes users will create a timeline, let it finish, and much later append a tween and expect it to run instead of jumping to its end state. While technically one could argue that it should jump to its end state, that's not what users intuitively expect.
				while (tl._timeline) {
					if (beforeRawTime && tl._timeline.smoothChildTiming) {
						tl.totalTime(tl._totalTime, true); //moves the timeline (shifts its startTime) if necessary, and also enables it.
					} else if (tl._gc) {
						tl._enabled(true, false);
					}
					tl = tl._timeline;
				}
			}

			return this;
		};

		p.remove = function(value) {
			if (value instanceof Animation) {
				return this._remove(value, false);
			} else if (value instanceof Array || (value && value.push && _isArray(value))) {
				var i = value.length;
				while (--i > -1) {
					this.remove(value[i]);
				}
				return this;
			} else if (typeof(value) === "string") {
				return this.removeLabel(value);
			}
			return this.kill(null, value);
		};

		p._remove = function(tween, skipDisable) {
			SimpleTimeline.prototype._remove.call(this, tween, skipDisable);
			var last = this._last;
			if (!last) {
				this._time = this._totalTime = this._duration = this._totalDuration = 0;
			} else if (this._time > last._startTime + last._totalDuration / last._timeScale) {
				this._time = this.duration();
				this._totalTime = this._totalDuration;
			}
			return this;
		};

		p.append = function(value, offsetOrLabel) {
			return this.add(value, this._parseTimeOrLabel(null, offsetOrLabel, true, value));
		};

		p.insert = p.insertMultiple = function(value, position, align, stagger) {
			return this.add(value, position || 0, align, stagger);
		};

		p.appendMultiple = function(tweens, offsetOrLabel, align, stagger) {
			return this.add(tweens, this._parseTimeOrLabel(null, offsetOrLabel, true, tweens), align, stagger);
		};

		p.addLabel = function(label, position) {
			this._labels[label] = this._parseTimeOrLabel(position);
			return this;
		};

		p.addPause = function(position, callback, params, scope) {
			var t = TweenLite.delayedCall(0, _pauseCallback, ["{self}", callback, params, scope], this);
			t.data = "isPause"; // we use this flag in TweenLite's render() method to identify it as a special case that shouldn't be triggered when the virtual playhead is LEAVING the exact position where the pause is, otherwise timeline.addPause(1).play(1) would end up paused on the very next tick.
			return this.add(t, position);
		};

		p.removeLabel = function(label) {
			delete this._labels[label];
			return this;
		};

		p.getLabelTime = function(label) {
			return (this._labels[label] != null) ? this._labels[label] : -1;
		};

		p._parseTimeOrLabel = function(timeOrLabel, offsetOrLabel, appendIfAbsent, ignore) {
			var i;
			//if we're about to add a tween/timeline (or an array of them) that's already a child of this timeline, we should remove it first so that it doesn't contaminate the duration().
			if (ignore instanceof Animation && ignore.timeline === this) {
				this.remove(ignore);
			} else if (ignore && ((ignore instanceof Array) || (ignore.push && _isArray(ignore)))) {
				i = ignore.length;
				while (--i > -1) {
					if (ignore[i] instanceof Animation && ignore[i].timeline === this) {
						this.remove(ignore[i]);
					}
				}
			}
			if (typeof(offsetOrLabel) === "string") {
				return this._parseTimeOrLabel(offsetOrLabel, (appendIfAbsent && typeof(timeOrLabel) === "number" && this._labels[offsetOrLabel] == null) ? timeOrLabel - this.duration() : 0, appendIfAbsent);
			}
			offsetOrLabel = offsetOrLabel || 0;
			if (typeof(timeOrLabel) === "string" && (isNaN(timeOrLabel) || this._labels[timeOrLabel] != null)) { //if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
				i = timeOrLabel.indexOf("=");
				if (i === -1) {
					if (this._labels[timeOrLabel] == null) {
						return appendIfAbsent ? (this._labels[timeOrLabel] = this.duration() + offsetOrLabel) : offsetOrLabel;
					}
					return this._labels[timeOrLabel] + offsetOrLabel;
				}
				offsetOrLabel = parseInt(timeOrLabel.charAt(i-1) + "1", 10) * Number(timeOrLabel.substr(i+1));
				timeOrLabel = (i > 1) ? this._parseTimeOrLabel(timeOrLabel.substr(0, i-1), 0, appendIfAbsent) : this.duration();
			} else if (timeOrLabel == null) {
				timeOrLabel = this.duration();
			}
			return Number(timeOrLabel) + offsetOrLabel;
		};

		p.seek = function(position, suppressEvents) {
			return this.totalTime((typeof(position) === "number") ? position : this._parseTimeOrLabel(position), (suppressEvents !== false));
		};

		p.stop = function() {
			return this.paused(true);
		};

		p.gotoAndPlay = function(position, suppressEvents) {
			return this.play(position, suppressEvents);
		};

		p.gotoAndStop = function(position, suppressEvents) {
			return this.pause(position, suppressEvents);
		};

		p.render = function(time, suppressEvents, force) {
			if (this._gc) {
				this._enabled(true, false);
			}
			var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
				prevTime = this._time,
				prevStart = this._startTime,
				prevTimeScale = this._timeScale,
				prevPaused = this._paused,
				tween, isComplete, next, callback, internalForce;
			if (time >= totalDur) {
				this._totalTime = this._time = totalDur;
				if (!this._reversed) if (!this._hasPausedChild()) {
					isComplete = true;
					callback = "onComplete";
					internalForce = !!this._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
					if (this._duration === 0) if (time === 0 || this._rawPrevTime < 0 || this._rawPrevTime === _tinyNum) if (this._rawPrevTime !== time && this._first) {
						internalForce = true;
						if (this._rawPrevTime > _tinyNum) {
							callback = "onReverseComplete";
						}
					}
				}
				this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				time = totalDur + 0.0001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off). Try (999999999999.7 - 999999999999) * 1 = 0.699951171875 instead of 0.7.

			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				this._totalTime = this._time = 0;
				if (prevTime !== 0 || (this._duration === 0 && this._rawPrevTime !== _tinyNum && (this._rawPrevTime > 0 || (time < 0 && this._rawPrevTime >= 0)))) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (this._timeline.autoRemoveChildren && this._reversed) { //ensures proper GC if a timeline is resumed after it's finished reversing.
						internalForce = isComplete = true;
						callback = "onReverseComplete";
					} else if (this._rawPrevTime >= 0 && this._first) { //when going back beyond the start, force a render so that zero-duration tweens that sit at the very beginning render their start values properly. Otherwise, if the parent timeline's playhead lands exactly at this timeline's startTime, and then moves backwards, the zero-duration tweens at the beginning would still be at their end state.
						internalForce = true;
					}
					this._rawPrevTime = time;
				} else {
					this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					if (time === 0 && isComplete) { //if there's a zero-duration tween at the very beginning of a timeline and the playhead lands EXACTLY at time 0, that tween will correctly render its end values, but we need to keep the timeline alive for one more render so that the beginning values render properly as the parent's playhead keeps moving beyond the begining. Imagine obj.x starts at 0 and then we do tl.set(obj, {x:100}).to(obj, 1, {x:200}) and then later we tl.reverse()...the goal is to have obj.x revert to 0. If the playhead happens to land on exactly 0, without this chunk of code, it'd complete the timeline and remove it from the rendering queue (not good).
						tween = this._first;
						while (tween && tween._startTime === 0) {
							if (!tween._duration) {
								isComplete = false;
							}
							tween = tween._next;
						}
					}
					time = 0; //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)
					if (!this._initted) {
						internalForce = true;
					}
				}

			} else {
				this._totalTime = this._time = this._rawPrevTime = time;
			}
			if ((this._time === prevTime || !this._first) && !force && !internalForce) {
				return;
			} else if (!this._initted) {
				this._initted = true;
			}

			if (!this._active) if (!this._paused && this._time !== prevTime && time > 0) {
				this._active = true;  //so that if the user renders the timeline (as opposed to the parent timeline rendering it), it is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the timeline already finished but the user manually re-renders it as halfway done, for example.
			}

			if (prevTime === 0) if (this.vars.onStart) if (this._time !== 0) if (!suppressEvents) {
				this._callback("onStart");
			}

			if (this._time >= prevTime) {
				tween = this._first;
				while (tween) {
					next = tween._next; //record it here because the value could change after rendering...
					if (this._paused && !prevPaused) { //in case a tween pauses the timeline when rendering
						break;
					} else if (tween._active || (tween._startTime <= this._time && !tween._paused && !tween._gc)) {
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}
					}
					tween = next;
				}
			} else {
				tween = this._last;
				while (tween) {
					next = tween._prev; //record it here because the value could change after rendering...
					if (this._paused && !prevPaused) { //in case a tween pauses the timeline when rendering
						break;
					} else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}
					}
					tween = next;
				}
			}

			if (this._onUpdate) if (!suppressEvents) {
				if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.
					_lazyRender();
				}
				this._callback("onUpdate");
			}

			if (callback) if (!this._gc) if (prevStart === this._startTime || prevTimeScale !== this._timeScale) if (this._time === 0 || totalDur >= this.totalDuration()) { //if one of the tweens that was rendered altered this timeline's startTime (like if an onComplete reversed the timeline), it probably isn't complete. If it is, don't worry, because whatever call altered the startTime would complete if it was necessary at the new time. The only exception is the timeScale property. Also check _gc because there's a chance that kill() could be called in an onUpdate
				if (isComplete) {
					if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onComplete on a timeline that reports/checks tweened values.
						_lazyRender();
					}
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this._callback(callback);
				}
			}
		};

		p._hasPausedChild = function() {
			var tween = this._first;
			while (tween) {
				if (tween._paused || ((tween instanceof TimelineLite) && tween._hasPausedChild())) {
					return true;
				}
				tween = tween._next;
			}
			return false;
		};

		p.getChildren = function(nested, tweens, timelines, ignoreBeforeTime) {
			ignoreBeforeTime = ignoreBeforeTime || -9999999999;
			var a = [],
				tween = this._first,
				cnt = 0;
			while (tween) {
				if (tween._startTime < ignoreBeforeTime) {
					//do nothing
				} else if (tween instanceof TweenLite) {
					if (tweens !== false) {
						a[cnt++] = tween;
					}
				} else {
					if (timelines !== false) {
						a[cnt++] = tween;
					}
					if (nested !== false) {
						a = a.concat(tween.getChildren(true, tweens, timelines));
						cnt = a.length;
					}
				}
				tween = tween._next;
			}
			return a;
		};

		p.getTweensOf = function(target, nested) {
			var disabled = this._gc,
				a = [],
				cnt = 0,
				tweens, i;
			if (disabled) {
				this._enabled(true, true); //getTweensOf() filters out disabled tweens, and we have to mark them as _gc = true when the timeline completes in order to allow clean garbage collection, so temporarily re-enable the timeline here.
			}
			tweens = TweenLite.getTweensOf(target);
			i = tweens.length;
			while (--i > -1) {
				if (tweens[i].timeline === this || (nested && this._contains(tweens[i]))) {
					a[cnt++] = tweens[i];
				}
			}
			if (disabled) {
				this._enabled(false, true);
			}
			return a;
		};

		p.recent = function() {
			return this._recent;
		};

		p._contains = function(tween) {
			var tl = tween.timeline;
			while (tl) {
				if (tl === this) {
					return true;
				}
				tl = tl.timeline;
			}
			return false;
		};

		p.shiftChildren = function(amount, adjustLabels, ignoreBeforeTime) {
			ignoreBeforeTime = ignoreBeforeTime || 0;
			var tween = this._first,
				labels = this._labels,
				p;
			while (tween) {
				if (tween._startTime >= ignoreBeforeTime) {
					tween._startTime += amount;
				}
				tween = tween._next;
			}
			if (adjustLabels) {
				for (p in labels) {
					if (labels[p] >= ignoreBeforeTime) {
						labels[p] += amount;
					}
				}
			}
			return this._uncache(true);
		};

		p._kill = function(vars, target) {
			if (!vars && !target) {
				return this._enabled(false, false);
			}
			var tweens = (!target) ? this.getChildren(true, true, false) : this.getTweensOf(target),
				i = tweens.length,
				changed = false;
			while (--i > -1) {
				if (tweens[i]._kill(vars, target)) {
					changed = true;
				}
			}
			return changed;
		};

		p.clear = function(labels) {
			var tweens = this.getChildren(false, true, true),
				i = tweens.length;
			this._time = this._totalTime = 0;
			while (--i > -1) {
				tweens[i]._enabled(false, false);
			}
			if (labels !== false) {
				this._labels = {};
			}
			return this._uncache(true);
		};

		p.invalidate = function() {
			var tween = this._first;
			while (tween) {
				tween.invalidate();
				tween = tween._next;
			}
			return Animation.prototype.invalidate.call(this);;
		};

		p._enabled = function(enabled, ignoreTimeline) {
			if (enabled === this._gc) {
				var tween = this._first;
				while (tween) {
					tween._enabled(enabled, true);
					tween = tween._next;
				}
			}
			return SimpleTimeline.prototype._enabled.call(this, enabled, ignoreTimeline);
		};

		p.totalTime = function(time, suppressEvents, uncapped) {
			this._forcingPlayhead = true;
			var val = Animation.prototype.totalTime.apply(this, arguments);
			this._forcingPlayhead = false;
			return val;
		};

		p.duration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					this.totalDuration(); //just triggers recalculation
				}
				return this._duration;
			}
			if (this.duration() !== 0 && value !== 0) {
				this.timeScale(this._duration / value);
			}
			return this;
		};

		p.totalDuration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					var max = 0,
						tween = this._last,
						prevStart = 999999999999,
						prev, end;
					while (tween) {
						prev = tween._prev; //record it here in case the tween changes position in the sequence...
						if (tween._dirty) {
							tween.totalDuration(); //could change the tween._startTime, so make sure the tween's cache is clean before analyzing it.
						}
						if (tween._startTime > prevStart && this._sortChildren && !tween._paused) { //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
							this.add(tween, tween._startTime - tween._delay);
						} else {
							prevStart = tween._startTime;
						}
						if (tween._startTime < 0 && !tween._paused) { //children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
							max -= tween._startTime;
							if (this._timeline.smoothChildTiming) {
								this._startTime += tween._startTime / this._timeScale;
							}
							this.shiftChildren(-tween._startTime, false, -9999999999);
							prevStart = 0;
						}
						end = tween._startTime + (tween._totalDuration / tween._timeScale);
						if (end > max) {
							max = end;
						}
						tween = prev;
					}
					this._duration = this._totalDuration = max;
					this._dirty = false;
				}
				return this._totalDuration;
			}
			if (this.totalDuration() !== 0) if (value !== 0) {
				this.timeScale(this._totalDuration / value);
			}
			return this;
		};

		p.paused = function(value) {
			if (!value) { //if there's a pause directly at the spot from where we're unpausing, skip it.
				var tween = this._first,
					time = this._time;
				while (tween) {
					if (tween._startTime === time && tween.data === "isPause") {
						tween._rawPrevTime = 0; //remember, _rawPrevTime is how zero-duration tweens/callbacks sense directionality and determine whether or not to fire. If _rawPrevTime is the same as _startTime on the next render, it won't fire.
					}
					tween = tween._next;
				}
			}
			return Animation.prototype.paused.apply(this, arguments);
		};

		p.usesFrames = function() {
			var tl = this._timeline;
			while (tl._timeline) {
				tl = tl._timeline;
			}
			return (tl === Animation._rootFramesTimeline);
		};

		p.rawTime = function() {
			return this._paused ? this._totalTime : (this._timeline.rawTime() - this._startTime) * this._timeScale;
		};

		return TimelineLite;

	}, true);
	







	
	
	
	
	
/*
 * ----------------------------------------------------------------
 * TimelineMax
 * ----------------------------------------------------------------
 */
	_gsScope._gsDefine("TimelineMax", ["TimelineLite","TweenLite","easing.Ease"], function(TimelineLite, TweenLite, Ease) {

		var TimelineMax = function(vars) {
				TimelineLite.call(this, vars);
				this._repeat = this.vars.repeat || 0;
				this._repeatDelay = this.vars.repeatDelay || 0;
				this._cycle = 0;
				this._yoyo = (this.vars.yoyo === true);
				this._dirty = true;
			},
			_tinyNum = 0.0000000001,
			TweenLiteInternals = TweenLite._internals,
			_lazyTweens = TweenLiteInternals.lazyTweens,
			_lazyRender = TweenLiteInternals.lazyRender,
			_easeNone = new Ease(null, null, 1, 0),
			p = TimelineMax.prototype = new TimelineLite();

		p.constructor = TimelineMax;
		p.kill()._gc = false;
		TimelineMax.version = "1.17.0";

		p.invalidate = function() {
			this._yoyo = (this.vars.yoyo === true);
			this._repeat = this.vars.repeat || 0;
			this._repeatDelay = this.vars.repeatDelay || 0;
			this._uncache(true);
			return TimelineLite.prototype.invalidate.call(this);
		};

		p.addCallback = function(callback, position, params, scope) {
			return this.add( TweenLite.delayedCall(0, callback, params, scope), position);
		};

		p.removeCallback = function(callback, position) {
			if (callback) {
				if (position == null) {
					this._kill(null, callback);
				} else {
					var a = this.getTweensOf(callback, false),
						i = a.length,
						time = this._parseTimeOrLabel(position);
					while (--i > -1) {
						if (a[i]._startTime === time) {
							a[i]._enabled(false, false);
						}
					}
				}
			}
			return this;
		};

		p.removePause = function(position) {
			return this.removeCallback(TimelineLite._internals.pauseCallback, position);
		};

		p.tweenTo = function(position, vars) {
			vars = vars || {};
			var copy = {ease:_easeNone, useFrames:this.usesFrames(), immediateRender:false},
				duration, p, t;
			for (p in vars) {
				copy[p] = vars[p];
			}
			copy.time = this._parseTimeOrLabel(position);
			duration = (Math.abs(Number(copy.time) - this._time) / this._timeScale) || 0.001;
			t = new TweenLite(this, duration, copy);
			copy.onStart = function() {
				t.target.paused(true);
				if (t.vars.time !== t.target.time() && duration === t.duration()) { //don't make the duration zero - if it's supposed to be zero, don't worry because it's already initting the tween and will complete immediately, effectively making the duration zero anyway. If we make duration zero, the tween won't run at all.
					t.duration( Math.abs( t.vars.time - t.target.time()) / t.target._timeScale );
				}
				if (vars.onStart) { //in case the user had an onStart in the vars - we don't want to overwrite it.
					t._callback("onStart");
				}
			};
			return t;
		};

		p.tweenFromTo = function(fromPosition, toPosition, vars) {
			vars = vars || {};
			fromPosition = this._parseTimeOrLabel(fromPosition);
			vars.startAt = {onComplete:this.seek, onCompleteParams:[fromPosition], callbackScope:this};
			vars.immediateRender = (vars.immediateRender !== false);
			var t = this.tweenTo(toPosition, vars);
			return t.duration((Math.abs( t.vars.time - fromPosition) / this._timeScale) || 0.001);
		};

		p.render = function(time, suppressEvents, force) {
			if (this._gc) {
				this._enabled(true, false);
			}
			var totalDur = (!this._dirty) ? this._totalDuration : this.totalDuration(),
				dur = this._duration,
				prevTime = this._time,
				prevTotalTime = this._totalTime,
				prevStart = this._startTime,
				prevTimeScale = this._timeScale,
				prevRawPrevTime = this._rawPrevTime,
				prevPaused = this._paused,
				prevCycle = this._cycle,
				tween, isComplete, next, callback, internalForce, cycleDuration;
			if (time >= totalDur) {
				if (!this._locked) {
					this._totalTime = totalDur;
					this._cycle = this._repeat;
				}
				if (!this._reversed) if (!this._hasPausedChild()) {
					isComplete = true;
					callback = "onComplete";
					internalForce = !!this._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
					if (this._duration === 0) if (time === 0 || prevRawPrevTime < 0 || prevRawPrevTime === _tinyNum) if (prevRawPrevTime !== time && this._first) {
						internalForce = true;
						if (prevRawPrevTime > _tinyNum) {
							callback = "onReverseComplete";
						}
					}
				}
				this._rawPrevTime = (this._duration || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				if (this._yoyo && (this._cycle & 1) !== 0) {
					this._time = time = 0;
				} else {
					this._time = dur;
					time = dur + 0.0001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off). Try (999999999999.7 - 999999999999) * 1 = 0.699951171875 instead of 0.7. We cannot do less then 0.0001 because the same issue can occur when the duration is extremely large like 999999999999 in which case adding 0.00000001, for example, causes it to act like nothing was added.
				}

			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				if (!this._locked) {
					this._totalTime = this._cycle = 0;
				}
				this._time = 0;
				if (prevTime !== 0 || (dur === 0 && prevRawPrevTime !== _tinyNum && (prevRawPrevTime > 0 || (time < 0 && prevRawPrevTime >= 0)) && !this._locked)) { //edge case for checking time < 0 && prevRawPrevTime >= 0: a zero-duration fromTo() tween inside a zero-duration timeline (yeah, very rare)
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (this._timeline.autoRemoveChildren && this._reversed) {
						internalForce = isComplete = true;
						callback = "onReverseComplete";
					} else if (prevRawPrevTime >= 0 && this._first) { //when going back beyond the start, force a render so that zero-duration tweens that sit at the very beginning render their start values properly. Otherwise, if the parent timeline's playhead lands exactly at this timeline's startTime, and then moves backwards, the zero-duration tweens at the beginning would still be at their end state.
						internalForce = true;
					}
					this._rawPrevTime = time;
				} else {
					this._rawPrevTime = (dur || !suppressEvents || time || this._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					if (time === 0 && isComplete) { //if there's a zero-duration tween at the very beginning of a timeline and the playhead lands EXACTLY at time 0, that tween will correctly render its end values, but we need to keep the timeline alive for one more render so that the beginning values render properly as the parent's playhead keeps moving beyond the begining. Imagine obj.x starts at 0 and then we do tl.set(obj, {x:100}).to(obj, 1, {x:200}) and then later we tl.reverse()...the goal is to have obj.x revert to 0. If the playhead happens to land on exactly 0, without this chunk of code, it'd complete the timeline and remove it from the rendering queue (not good).
						tween = this._first;
						while (tween && tween._startTime === 0) {
							if (!tween._duration) {
								isComplete = false;
							}
							tween = tween._next;
						}
					}
					time = 0; //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)
					if (!this._initted) {
						internalForce = true;
					}
				}

			} else {
				if (dur === 0 && prevRawPrevTime < 0) { //without this, zero-duration repeating timelines (like with a simple callback nested at the very beginning and a repeatDelay) wouldn't render the first time through.
					internalForce = true;
				}
				this._time = this._rawPrevTime = time;
				if (!this._locked) {
					this._totalTime = time;
					if (this._repeat !== 0) {
						cycleDuration = dur + this._repeatDelay;
						this._cycle = (this._totalTime / cycleDuration) >> 0; //originally _totalTime % cycleDuration but floating point errors caused problems, so I normalized it. (4 % 0.8 should be 0 but it gets reported as 0.79999999!)
						if (this._cycle !== 0) if (this._cycle === this._totalTime / cycleDuration) {
							this._cycle--; //otherwise when rendered exactly at the end time, it will act as though it is repeating (at the beginning)
						}
						this._time = this._totalTime - (this._cycle * cycleDuration);
						if (this._yoyo) if ((this._cycle & 1) !== 0) {
							this._time = dur - this._time;
						}
						if (this._time > dur) {
							this._time = dur;
							time = dur + 0.0001; //to avoid occasional floating point rounding error
						} else if (this._time < 0) {
							this._time = time = 0;
						} else {
							time = this._time;
						}
					}
				}
			}

			if (this._cycle !== prevCycle) if (!this._locked) {
				/*
				make sure children at the end/beginning of the timeline are rendered properly. If, for example,
				a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
				would get transated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
				could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
				we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
				ensure that zero-duration tweens at the very beginning or end of the TimelineMax work.
				*/
				var backwards = (this._yoyo && (prevCycle & 1) !== 0),
					wrap = (backwards === (this._yoyo && (this._cycle & 1) !== 0)),
					recTotalTime = this._totalTime,
					recCycle = this._cycle,
					recRawPrevTime = this._rawPrevTime,
					recTime = this._time;

				this._totalTime = prevCycle * dur;
				if (this._cycle < prevCycle) {
					backwards = !backwards;
				} else {
					this._totalTime += dur;
				}
				this._time = prevTime; //temporarily revert _time so that render() renders the children in the correct order. Without this, tweens won't rewind correctly. We could arhictect things in a "cleaner" way by splitting out the rendering queue into a separate method but for performance reasons, we kept it all inside this method.

				this._rawPrevTime = (dur === 0) ? prevRawPrevTime - 0.0001 : prevRawPrevTime;
				this._cycle = prevCycle;
				this._locked = true; //prevents changes to totalTime and skips repeat/yoyo behavior when we recursively call render()
				prevTime = (backwards) ? 0 : dur;
				this.render(prevTime, suppressEvents, (dur === 0));
				if (!suppressEvents) if (!this._gc) {
					if (this.vars.onRepeat) {
						this._callback("onRepeat");
					}
				}
				if (wrap) {
					prevTime = (backwards) ? dur + 0.0001 : -0.0001;
					this.render(prevTime, true, false);
				}
				this._locked = false;
				if (this._paused && !prevPaused) { //if the render() triggered callback that paused this timeline, we should abort (very rare, but possible)
					return;
				}
				this._time = recTime;
				this._totalTime = recTotalTime;
				this._cycle = recCycle;
				this._rawPrevTime = recRawPrevTime;
			}

			if ((this._time === prevTime || !this._first) && !force && !internalForce) {
				if (prevTotalTime !== this._totalTime) if (this._onUpdate) if (!suppressEvents) { //so that onUpdate fires even during the repeatDelay - as long as the totalTime changed, we should trigger onUpdate.
					this._callback("onUpdate");
				}
				return;
			} else if (!this._initted) {
				this._initted = true;
			}

			if (!this._active) if (!this._paused && this._totalTime !== prevTotalTime && time > 0) {
				this._active = true;  //so that if the user renders the timeline (as opposed to the parent timeline rendering it), it is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the timeline already finished but the user manually re-renders it as halfway done, for example.
			}

			if (prevTotalTime === 0) if (this.vars.onStart) if (this._totalTime !== 0) if (!suppressEvents) {
				this._callback("onStart");
			}

			if (this._time >= prevTime) {
				tween = this._first;
				while (tween) {
					next = tween._next; //record it here because the value could change after rendering...
					if (this._paused && !prevPaused) { //in case a tween pauses the timeline when rendering
						break;
					} else if (tween._active || (tween._startTime <= this._time && !tween._paused && !tween._gc)) {
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}

					}
					tween = next;
				}
			} else {
				tween = this._last;
				while (tween) {
					next = tween._prev; //record it here because the value could change after rendering...
					if (this._paused && !prevPaused) { //in case a tween pauses the timeline when rendering
						break;
					} else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
						if (!tween._reversed) {
							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
						} else {
							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
						}
					}
					tween = next;
				}
			}

			if (this._onUpdate) if (!suppressEvents) {
				if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.
					_lazyRender();
				}
				this._callback("onUpdate");
			}
			if (callback) if (!this._locked) if (!this._gc) if (prevStart === this._startTime || prevTimeScale !== this._timeScale) if (this._time === 0 || totalDur >= this.totalDuration()) { //if one of the tweens that was rendered altered this timeline's startTime (like if an onComplete reversed the timeline), it probably isn't complete. If it is, don't worry, because whatever call altered the startTime would complete if it was necessary at the new time. The only exception is the timeScale property. Also check _gc because there's a chance that kill() could be called in an onUpdate
				if (isComplete) {
					if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onComplete on a timeline that reports/checks tweened values.
						_lazyRender();
					}
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this._callback(callback);
				}
			}
		};

		p.getActive = function(nested, tweens, timelines) {
			if (nested == null) {
				nested = true;
			}
			if (tweens == null) {
				tweens = true;
			}
			if (timelines == null) {
				timelines = false;
			}
			var a = [],
				all = this.getChildren(nested, tweens, timelines),
				cnt = 0,
				l = all.length,
				i, tween;
			for (i = 0; i < l; i++) {
				tween = all[i];
				if (tween.isActive()) {
					a[cnt++] = tween;
				}
			}
			return a;
		};


		p.getLabelAfter = function(time) {
			if (!time) if (time !== 0) { //faster than isNan()
				time = this._time;
			}
			var labels = this.getLabelsArray(),
				l = labels.length,
				i;
			for (i = 0; i < l; i++) {
				if (labels[i].time > time) {
					return labels[i].name;
				}
			}
			return null;
		};

		p.getLabelBefore = function(time) {
			if (time == null) {
				time = this._time;
			}
			var labels = this.getLabelsArray(),
				i = labels.length;
			while (--i > -1) {
				if (labels[i].time < time) {
					return labels[i].name;
				}
			}
			return null;
		};

		p.getLabelsArray = function() {
			var a = [],
				cnt = 0,
				p;
			for (p in this._labels) {
				a[cnt++] = {time:this._labels[p], name:p};
			}
			a.sort(function(a,b) {
				return a.time - b.time;
			});
			return a;
		};


//---- GETTERS / SETTERS -------------------------------------------------------------------------------------------------------

		p.progress = function(value, suppressEvents) {
			return (!arguments.length) ? this._time / this.duration() : this.totalTime( this.duration() * ((this._yoyo && (this._cycle & 1) !== 0) ? 1 - value : value) + (this._cycle * (this._duration + this._repeatDelay)), suppressEvents);
		};

		p.totalProgress = function(value, suppressEvents) {
			return (!arguments.length) ? this._totalTime / this.totalDuration() : this.totalTime( this.totalDuration() * value, suppressEvents);
		};

		p.totalDuration = function(value) {
			if (!arguments.length) {
				if (this._dirty) {
					TimelineLite.prototype.totalDuration.call(this); //just forces refresh
					//Instead of Infinity, we use 999999999999 so that we can accommodate reverses.
					this._totalDuration = (this._repeat === -1) ? 999999999999 : this._duration * (this._repeat + 1) + (this._repeatDelay * this._repeat);
				}
				return this._totalDuration;
			}
			return (this._repeat === -1) ? this : this.duration( (value - (this._repeat * this._repeatDelay)) / (this._repeat + 1) );
		};

		p.time = function(value, suppressEvents) {
			if (!arguments.length) {
				return this._time;
			}
			if (this._dirty) {
				this.totalDuration();
			}
			if (value > this._duration) {
				value = this._duration;
			}
			if (this._yoyo && (this._cycle & 1) !== 0) {
				value = (this._duration - value) + (this._cycle * (this._duration + this._repeatDelay));
			} else if (this._repeat !== 0) {
				value += this._cycle * (this._duration + this._repeatDelay);
			}
			return this.totalTime(value, suppressEvents);
		};

		p.repeat = function(value) {
			if (!arguments.length) {
				return this._repeat;
			}
			this._repeat = value;
			return this._uncache(true);
		};

		p.repeatDelay = function(value) {
			if (!arguments.length) {
				return this._repeatDelay;
			}
			this._repeatDelay = value;
			return this._uncache(true);
		};

		p.yoyo = function(value) {
			if (!arguments.length) {
				return this._yoyo;
			}
			this._yoyo = value;
			return this;
		};

		p.currentLabel = function(value) {
			if (!arguments.length) {
				return this.getLabelBefore(this._time + 0.00000001);
			}
			return this.seek(value, true);
		};

		return TimelineMax;

	}, true);
	




	
	
	
	
	
	
	
/*
 * ----------------------------------------------------------------
 * BezierPlugin
 * ----------------------------------------------------------------
 */
	(function() {

		var _RAD2DEG = 180 / Math.PI,
			_r1 = [],
			_r2 = [],
			_r3 = [],
			_corProps = {},
			_globals = _gsScope._gsDefine.globals,
			Segment = function(a, b, c, d) {
				this.a = a;
				this.b = b;
				this.c = c;
				this.d = d;
				this.da = d - a;
				this.ca = c - a;
				this.ba = b - a;
			},
			_correlate = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",
			cubicToQuadratic = function(a, b, c, d) {
				var q1 = {a:a},
					q2 = {},
					q3 = {},
					q4 = {c:d},
					mab = (a + b) / 2,
					mbc = (b + c) / 2,
					mcd = (c + d) / 2,
					mabc = (mab + mbc) / 2,
					mbcd = (mbc + mcd) / 2,
					m8 = (mbcd - mabc) / 8;
				q1.b = mab + (a - mab) / 4;
				q2.b = mabc + m8;
				q1.c = q2.a = (q1.b + q2.b) / 2;
				q2.c = q3.a = (mabc + mbcd) / 2;
				q3.b = mbcd - m8;
				q4.b = mcd + (d - mcd) / 4;
				q3.c = q4.a = (q3.b + q4.b) / 2;
				return [q1, q2, q3, q4];
			},
			_calculateControlPoints = function(a, curviness, quad, basic, correlate) {
				var l = a.length - 1,
					ii = 0,
					cp1 = a[0].a,
					i, p1, p2, p3, seg, m1, m2, mm, cp2, qb, r1, r2, tl;
				for (i = 0; i < l; i++) {
					seg = a[ii];
					p1 = seg.a;
					p2 = seg.d;
					p3 = a[ii+1].d;

					if (correlate) {
						r1 = _r1[i];
						r2 = _r2[i];
						tl = ((r2 + r1) * curviness * 0.25) / (basic ? 0.5 : _r3[i] || 0.5);
						m1 = p2 - (p2 - p1) * (basic ? curviness * 0.5 : (r1 !== 0 ? tl / r1 : 0));
						m2 = p2 + (p3 - p2) * (basic ? curviness * 0.5 : (r2 !== 0 ? tl / r2 : 0));
						mm = p2 - (m1 + (((m2 - m1) * ((r1 * 3 / (r1 + r2)) + 0.5) / 4) || 0));
					} else {
						m1 = p2 - (p2 - p1) * curviness * 0.5;
						m2 = p2 + (p3 - p2) * curviness * 0.5;
						mm = p2 - (m1 + m2) / 2;
					}
					m1 += mm;
					m2 += mm;

					seg.c = cp2 = m1;
					if (i !== 0) {
						seg.b = cp1;
					} else {
						seg.b = cp1 = seg.a + (seg.c - seg.a) * 0.6; //instead of placing b on a exactly, we move it inline with c so that if the user specifies an ease like Back.easeIn or Elastic.easeIn which goes BEYOND the beginning, it will do so smoothly.
					}

					seg.da = p2 - p1;
					seg.ca = cp2 - p1;
					seg.ba = cp1 - p1;

					if (quad) {
						qb = cubicToQuadratic(p1, cp1, cp2, p2);
						a.splice(ii, 1, qb[0], qb[1], qb[2], qb[3]);
						ii += 4;
					} else {
						ii++;
					}

					cp1 = m2;
				}
				seg = a[ii];
				seg.b = cp1;
				seg.c = cp1 + (seg.d - cp1) * 0.4; //instead of placing c on d exactly, we move it inline with b so that if the user specifies an ease like Back.easeOut or Elastic.easeOut which goes BEYOND the end, it will do so smoothly.
				seg.da = seg.d - seg.a;
				seg.ca = seg.c - seg.a;
				seg.ba = cp1 - seg.a;
				if (quad) {
					qb = cubicToQuadratic(seg.a, cp1, seg.c, seg.d);
					a.splice(ii, 1, qb[0], qb[1], qb[2], qb[3]);
				}
			},
			_parseAnchors = function(values, p, correlate, prepend) {
				var a = [],
					l, i, p1, p2, p3, tmp;
				if (prepend) {
					values = [prepend].concat(values);
					i = values.length;
					while (--i > -1) {
						if (typeof( (tmp = values[i][p]) ) === "string") if (tmp.charAt(1) === "=") {
							values[i][p] = prepend[p] + Number(tmp.charAt(0) + tmp.substr(2)); //accommodate relative values. Do it inline instead of breaking it out into a function for speed reasons
						}
					}
				}
				l = values.length - 2;
				if (l < 0) {
					a[0] = new Segment(values[0][p], 0, 0, values[(l < -1) ? 0 : 1][p]);
					return a;
				}
				for (i = 0; i < l; i++) {
					p1 = values[i][p];
					p2 = values[i+1][p];
					a[i] = new Segment(p1, 0, 0, p2);
					if (correlate) {
						p3 = values[i+2][p];
						_r1[i] = (_r1[i] || 0) + (p2 - p1) * (p2 - p1);
						_r2[i] = (_r2[i] || 0) + (p3 - p2) * (p3 - p2);
					}
				}
				a[i] = new Segment(values[i][p], 0, 0, values[i+1][p]);
				return a;
			},
			bezierThrough = function(values, curviness, quadratic, basic, correlate, prepend) {
				var obj = {},
					props = [],
					first = prepend || values[0],
					i, p, a, j, r, l, seamless, last;
				correlate = (typeof(correlate) === "string") ? ","+correlate+"," : _correlate;
				if (curviness == null) {
					curviness = 1;
				}
				for (p in values[0]) {
					props.push(p);
				}
				//check to see if the last and first values are identical (well, within 0.05). If so, make seamless by appending the second element to the very end of the values array and the 2nd-to-last element to the very beginning (we'll remove those segments later)
				if (values.length > 1) {
					last = values[values.length - 1];
					seamless = true;
					i = props.length;
					while (--i > -1) {
						p = props[i];
						if (Math.abs(first[p] - last[p]) > 0.05) { //build in a tolerance of +/-0.05 to accommodate rounding errors. For example, if you set an object's position to 4.945, Flash will make it 4.9
							seamless = false;
							break;
						}
					}
					if (seamless) {
						values = values.concat(); //duplicate the array to avoid contaminating the original which the user may be reusing for other tweens
						if (prepend) {
							values.unshift(prepend);
						}
						values.push(values[1]);
						prepend = values[values.length - 3];
					}
				}
				_r1.length = _r2.length = _r3.length = 0;
				i = props.length;
				while (--i > -1) {
					p = props[i];
					_corProps[p] = (correlate.indexOf(","+p+",") !== -1);
					obj[p] = _parseAnchors(values, p, _corProps[p], prepend);
				}
				i = _r1.length;
				while (--i > -1) {
					_r1[i] = Math.sqrt(_r1[i]);
					_r2[i] = Math.sqrt(_r2[i]);
				}
				if (!basic) {
					i = props.length;
					while (--i > -1) {
						if (_corProps[p]) {
							a = obj[props[i]];
							l = a.length - 1;
							for (j = 0; j < l; j++) {
								r = a[j+1].da / _r2[j] + a[j].da / _r1[j];
								_r3[j] = (_r3[j] || 0) + r * r;
							}
						}
					}
					i = _r3.length;
					while (--i > -1) {
						_r3[i] = Math.sqrt(_r3[i]);
					}
				}
				i = props.length;
				j = quadratic ? 4 : 1;
				while (--i > -1) {
					p = props[i];
					a = obj[p];
					_calculateControlPoints(a, curviness, quadratic, basic, _corProps[p]); //this method requires that _parseAnchors() and _setSegmentRatios() ran first so that _r1, _r2, and _r3 values are populated for all properties
					if (seamless) {
						a.splice(0, j);
						a.splice(a.length - j, j);
					}
				}
				return obj;
			},
			_parseBezierData = function(values, type, prepend) {
				type = type || "soft";
				var obj = {},
					inc = (type === "cubic") ? 3 : 2,
					soft = (type === "soft"),
					props = [],
					a, b, c, d, cur, i, j, l, p, cnt, tmp;
				if (soft && prepend) {
					values = [prepend].concat(values);
				}
				if (values == null || values.length < inc + 1) { throw "invalid Bezier data"; }
				for (p in values[0]) {
					props.push(p);
				}
				i = props.length;
				while (--i > -1) {
					p = props[i];
					obj[p] = cur = [];
					cnt = 0;
					l = values.length;
					for (j = 0; j < l; j++) {
						a = (prepend == null) ? values[j][p] : (typeof( (tmp = values[j][p]) ) === "string" && tmp.charAt(1) === "=") ? prepend[p] + Number(tmp.charAt(0) + tmp.substr(2)) : Number(tmp);
						if (soft) if (j > 1) if (j < l - 1) {
							cur[cnt++] = (a + cur[cnt-2]) / 2;
						}
						cur[cnt++] = a;
					}
					l = cnt - inc + 1;
					cnt = 0;
					for (j = 0; j < l; j += inc) {
						a = cur[j];
						b = cur[j+1];
						c = cur[j+2];
						d = (inc === 2) ? 0 : cur[j+3];
						cur[cnt++] = tmp = (inc === 3) ? new Segment(a, b, c, d) : new Segment(a, (2 * b + a) / 3, (2 * b + c) / 3, c);
					}
					cur.length = cnt;
				}
				return obj;
			},
			_addCubicLengths = function(a, steps, resolution) {
				var inc = 1 / resolution,
					j = a.length,
					d, d1, s, da, ca, ba, p, i, inv, bez, index;
				while (--j > -1) {
					bez = a[j];
					s = bez.a;
					da = bez.d - s;
					ca = bez.c - s;
					ba = bez.b - s;
					d = d1 = 0;
					for (i = 1; i <= resolution; i++) {
						p = inc * i;
						inv = 1 - p;
						d = d1 - (d1 = (p * p * da + 3 * inv * (p * ca + inv * ba)) * p);
						index = j * resolution + i - 1;
						steps[index] = (steps[index] || 0) + d * d;
					}
				}
			},
			_parseLengthData = function(obj, resolution) {
				resolution = resolution >> 0 || 6;
				var a = [],
					lengths = [],
					d = 0,
					total = 0,
					threshold = resolution - 1,
					segments = [],
					curLS = [], //current length segments array
					p, i, l, index;
				for (p in obj) {
					_addCubicLengths(obj[p], a, resolution);
				}
				l = a.length;
				for (i = 0; i < l; i++) {
					d += Math.sqrt(a[i]);
					index = i % resolution;
					curLS[index] = d;
					if (index === threshold) {
						total += d;
						index = (i / resolution) >> 0;
						segments[index] = curLS;
						lengths[index] = total;
						d = 0;
						curLS = [];
					}
				}
				return {length:total, lengths:lengths, segments:segments};
			},



			BezierPlugin = _gsScope._gsDefine.plugin({
					propName: "bezier",
					priority: -1,
					version: "1.3.4",
					API: 2,
					global:true,

					//gets called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
					init: function(target, vars, tween) {
						this._target = target;
						if (vars instanceof Array) {
							vars = {values:vars};
						}
						this._func = {};
						this._round = {};
						this._props = [];
						this._timeRes = (vars.timeResolution == null) ? 6 : parseInt(vars.timeResolution, 10);
						var values = vars.values || [],
							first = {},
							second = values[0],
							autoRotate = vars.autoRotate || tween.vars.orientToBezier,
							p, isFunc, i, j, prepend;

						this._autoRotate = autoRotate ? (autoRotate instanceof Array) ? autoRotate : [["x","y","rotation",((autoRotate === true) ? 0 : Number(autoRotate) || 0)]] : null;
						for (p in second) {
							this._props.push(p);
						}

						i = this._props.length;
						while (--i > -1) {
							p = this._props[i];

							this._overwriteProps.push(p);
							isFunc = this._func[p] = (typeof(target[p]) === "function");
							first[p] = (!isFunc) ? parseFloat(target[p]) : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]();
							if (!prepend) if (first[p] !== values[0][p]) {
								prepend = first;
							}
						}
						this._beziers = (vars.type !== "cubic" && vars.type !== "quadratic" && vars.type !== "soft") ? bezierThrough(values, isNaN(vars.curviness) ? 1 : vars.curviness, false, (vars.type === "thruBasic"), vars.correlate, prepend) : _parseBezierData(values, vars.type, first);
						this._segCount = this._beziers[p].length;

						if (this._timeRes) {
							var ld = _parseLengthData(this._beziers, this._timeRes);
							this._length = ld.length;
							this._lengths = ld.lengths;
							this._segments = ld.segments;
							this._l1 = this._li = this._s1 = this._si = 0;
							this._l2 = this._lengths[0];
							this._curSeg = this._segments[0];
							this._s2 = this._curSeg[0];
							this._prec = 1 / this._curSeg.length;
						}

						if ((autoRotate = this._autoRotate)) {
							this._initialRotations = [];
							if (!(autoRotate[0] instanceof Array)) {
								this._autoRotate = autoRotate = [autoRotate];
							}
							i = autoRotate.length;
							while (--i > -1) {
								for (j = 0; j < 3; j++) {
									p = autoRotate[i][j];
									this._func[p] = (typeof(target[p]) === "function") ? target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ] : false;
								}
								p = autoRotate[i][2];
								this._initialRotations[i] = this._func[p] ? this._func[p].call(this._target) : this._target[p];
							}
						}
						this._startRatio = tween.vars.runBackwards ? 1 : 0; //we determine the starting ratio when the tween inits which is always 0 unless the tween has runBackwards:true (indicating it's a from() tween) in which case it's 1.
						return true;
					},

					//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
					set: function(v) {
						var segments = this._segCount,
							func = this._func,
							target = this._target,
							notStart = (v !== this._startRatio),
							curIndex, inv, i, p, b, t, val, l, lengths, curSeg;
						if (!this._timeRes) {
							curIndex = (v < 0) ? 0 : (v >= 1) ? segments - 1 : (segments * v) >> 0;
							t = (v - (curIndex * (1 / segments))) * segments;
						} else {
							lengths = this._lengths;
							curSeg = this._curSeg;
							v *= this._length;
							i = this._li;
							//find the appropriate segment (if the currently cached one isn't correct)
							if (v > this._l2 && i < segments - 1) {
								l = segments - 1;
								while (i < l && (this._l2 = lengths[++i]) <= v) {	}
								this._l1 = lengths[i-1];
								this._li = i;
								this._curSeg = curSeg = this._segments[i];
								this._s2 = curSeg[(this._s1 = this._si = 0)];
							} else if (v < this._l1 && i > 0) {
								while (i > 0 && (this._l1 = lengths[--i]) >= v) { }
								if (i === 0 && v < this._l1) {
									this._l1 = 0;
								} else {
									i++;
								}
								this._l2 = lengths[i];
								this._li = i;
								this._curSeg = curSeg = this._segments[i];
								this._s1 = curSeg[(this._si = curSeg.length - 1) - 1] || 0;
								this._s2 = curSeg[this._si];
							}
							curIndex = i;
							//now find the appropriate sub-segment (we split it into the number of pieces that was defined by "precision" and measured each one)
							v -= this._l1;
							i = this._si;
							if (v > this._s2 && i < curSeg.length - 1) {
								l = curSeg.length - 1;
								while (i < l && (this._s2 = curSeg[++i]) <= v) {	}
								this._s1 = curSeg[i-1];
								this._si = i;
							} else if (v < this._s1 && i > 0) {
								while (i > 0 && (this._s1 = curSeg[--i]) >= v) {	}
								if (i === 0 && v < this._s1) {
									this._s1 = 0;
								} else {
									i++;
								}
								this._s2 = curSeg[i];
								this._si = i;
							}
							t = (i + (v - this._s1) / (this._s2 - this._s1)) * this._prec;
						}
						inv = 1 - t;

						i = this._props.length;
						while (--i > -1) {
							p = this._props[i];
							b = this._beziers[p][curIndex];
							val = (t * t * b.da + 3 * inv * (t * b.ca + inv * b.ba)) * t + b.a;
							if (this._round[p]) {
								val = Math.round(val);
							}
							if (func[p]) {
								target[p](val);
							} else {
								target[p] = val;
							}
						}

						if (this._autoRotate) {
							var ar = this._autoRotate,
								b2, x1, y1, x2, y2, add, conv;
							i = ar.length;
							while (--i > -1) {
								p = ar[i][2];
								add = ar[i][3] || 0;
								conv = (ar[i][4] === true) ? 1 : _RAD2DEG;
								b = this._beziers[ar[i][0]];
								b2 = this._beziers[ar[i][1]];

								if (b && b2) { //in case one of the properties got overwritten.
									b = b[curIndex];
									b2 = b2[curIndex];

									x1 = b.a + (b.b - b.a) * t;
									x2 = b.b + (b.c - b.b) * t;
									x1 += (x2 - x1) * t;
									x2 += ((b.c + (b.d - b.c) * t) - x2) * t;

									y1 = b2.a + (b2.b - b2.a) * t;
									y2 = b2.b + (b2.c - b2.b) * t;
									y1 += (y2 - y1) * t;
									y2 += ((b2.c + (b2.d - b2.c) * t) - y2) * t;

									val = notStart ? Math.atan2(y2 - y1, x2 - x1) * conv + add : this._initialRotations[i];

									if (func[p]) {
										target[p](val);
									} else {
										target[p] = val;
									}
								}
							}
						}
					}
			}),
			p = BezierPlugin.prototype;


		BezierPlugin.bezierThrough = bezierThrough;
		BezierPlugin.cubicToQuadratic = cubicToQuadratic;
		BezierPlugin._autoCSS = true; //indicates that this plugin can be inserted into the "css" object using the autoCSS feature of TweenLite
		BezierPlugin.quadraticToCubic = function(a, b, c) {
			return new Segment(a, (2 * b + a) / 3, (2 * b + c) / 3, c);
		};

		BezierPlugin._cssRegister = function() {
			var CSSPlugin = _globals.CSSPlugin;
			if (!CSSPlugin) {
				return;
			}
			var _internals = CSSPlugin._internals,
				_parseToProxy = _internals._parseToProxy,
				_setPluginRatio = _internals._setPluginRatio,
				CSSPropTween = _internals.CSSPropTween;
			_internals._registerComplexSpecialProp("bezier", {parser:function(t, e, prop, cssp, pt, plugin) {
				if (e instanceof Array) {
					e = {values:e};
				}
				plugin = new BezierPlugin();
				var values = e.values,
					l = values.length - 1,
					pluginValues = [],
					v = {},
					i, p, data;
				if (l < 0) {
					return pt;
				}
				for (i = 0; i <= l; i++) {
					data = _parseToProxy(t, values[i], cssp, pt, plugin, (l !== i));
					pluginValues[i] = data.end;
				}
				for (p in e) {
					v[p] = e[p]; //duplicate the vars object because we need to alter some things which would cause problems if the user plans to reuse the same vars object for another tween.
				}
				v.values = pluginValues;
				pt = new CSSPropTween(t, "bezier", 0, 0, data.pt, 2);
				pt.data = data;
				pt.plugin = plugin;
				pt.setRatio = _setPluginRatio;
				if (v.autoRotate === 0) {
					v.autoRotate = true;
				}
				if (v.autoRotate && !(v.autoRotate instanceof Array)) {
					i = (v.autoRotate === true) ? 0 : Number(v.autoRotate);
					v.autoRotate = (data.end.left != null) ? [["left","top","rotation",i,false]] : (data.end.x != null) ? [["x","y","rotation",i,false]] : false;
				}
				if (v.autoRotate) {
					if (!cssp._transform) {
						cssp._enableTransforms(false);
					}
					data.autoRotate = cssp._target._gsTransform;
				}
				plugin._onInitTween(data.proxy, v, cssp._tween);
				return pt;
			}});
		};

		p._roundProps = function(lookup, value) {
			var op = this._overwriteProps,
				i = op.length;
			while (--i > -1) {
				if (lookup[op[i]] || lookup.bezier || lookup.bezierThrough) {
					this._round[op[i]] = value;
				}
			}
		};

		p._kill = function(lookup) {
			var a = this._props,
				p, i;
			for (p in this._beziers) {
				if (p in lookup) {
					delete this._beziers[p];
					delete this._func[p];
					i = a.length;
					while (--i > -1) {
						if (a[i] === p) {
							a.splice(i, 1);
						}
					}
				}
			}
			return this._super._kill.call(this, lookup);
		};

	}());






	
	
	
	
	
	
	
	
/*
 * ----------------------------------------------------------------
 * CSSPlugin
 * ----------------------------------------------------------------
 */
	_gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin","TweenLite"], function(TweenPlugin, TweenLite) {

		/** @constructor **/
		var CSSPlugin = function() {
				TweenPlugin.call(this, "css");
				this._overwriteProps.length = 0;
				this.setRatio = CSSPlugin.prototype.setRatio; //speed optimization (avoid prototype lookup on this "hot" method)
			},
			_globals = _gsScope._gsDefine.globals,
			_hasPriority, //turns true whenever a CSSPropTween instance is created that has a priority other than 0. This helps us discern whether or not we should spend the time organizing the linked list or not after a CSSPlugin's _onInitTween() method is called.
			_suffixMap, //we set this in _onInitTween() each time as a way to have a persistent variable we can use in other methods like _parse() without having to pass it around as a parameter and we keep _parse() decoupled from a particular CSSPlugin instance
			_cs, //computed style (we store this in a shared variable to conserve memory and make minification tighter
			_overwriteProps, //alias to the currently instantiating CSSPlugin's _overwriteProps array. We use this closure in order to avoid having to pass a reference around from method to method and aid in minification.
			_specialProps = {},
			p = CSSPlugin.prototype = new TweenPlugin("css");

		p.constructor = CSSPlugin;
		CSSPlugin.version = "1.17.0";
		CSSPlugin.API = 2;
		CSSPlugin.defaultTransformPerspective = 0;
		CSSPlugin.defaultSkewType = "compensated";
		CSSPlugin.defaultSmoothOrigin = true;
		p = "px"; //we'll reuse the "p" variable to keep file size down
		CSSPlugin.suffixMap = {top:p, right:p, bottom:p, left:p, width:p, height:p, fontSize:p, padding:p, margin:p, perspective:p, lineHeight:""};


		var _numExp = /(?:\d|\-\d|\.\d|\-\.\d)+/g,
			_relNumExp = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
			_valuesExp = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi, //finds all the values that begin with numbers or += or -= and then a number. Includes suffixes. We use this to split complex values apart like "1px 5px 20px rgb(255,102,51)"
			_NaNExp = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g, //also allows scientific notation and doesn't kill the leading -/+ in -= and +=
			_suffixExp = /(?:\d|\-|\+|=|#|\.)*/g,
			_opacityExp = /opacity *= *([^)]*)/i,
			_opacityValExp = /opacity:([^;]*)/i,
			_alphaFilterExp = /alpha\(opacity *=.+?\)/i,
			_rgbhslExp = /^(rgb|hsl)/,
			_capsExp = /([A-Z])/g,
			_camelExp = /-([a-z])/gi,
			_urlExp = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi, //for pulling out urls from url(...) or url("...") strings (some browsers wrap urls in quotes, some don't when reporting things like backgroundImage)
			_camelFunc = function(s, g) { return g.toUpperCase(); },
			_horizExp = /(?:Left|Right|Width)/i,
			_ieGetMatrixExp = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
			_ieSetMatrixExp = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
			_commasOutsideParenExp = /,(?=[^\)]*(?:\(|$))/gi, //finds any commas that are not within parenthesis
			_DEG2RAD = Math.PI / 180,
			_RAD2DEG = 180 / Math.PI,
			_forcePT = {},
			_doc = document,
			_createElement = function(type) {
				return _doc.createElementNS ? _doc.createElementNS("http://www.w3.org/1999/xhtml", type) : _doc.createElement(type);
			},
			_tempDiv = _createElement("div"),
			_tempImg = _createElement("img"),
			_internals = CSSPlugin._internals = {_specialProps:_specialProps}, //provides a hook to a few internal methods that we need to access from inside other plugins
			_agent = navigator.userAgent,
			_autoRound,
			_reqSafariFix, //we won't apply the Safari transform fix until we actually come across a tween that affects a transform property (to maintain best performance).

			_isSafari,
			_isFirefox, //Firefox has a bug that causes 3D transformed elements to randomly disappear unless a repaint is forced after each update on each element.
			_isSafariLT6, //Safari (and Android 4 which uses a flavor of Safari) has a bug that prevents changes to "top" and "left" properties from rendering properly if changed on the same frame as a transform UNLESS we set the element's WebkitBackfaceVisibility to hidden (weird, I know). Doing this for Android 3 and earlier seems to actually cause other problems, though (fun!)
			_ieVers,
			_supportsOpacity = (function() { //we set _isSafari, _ieVers, _isFirefox, and _supportsOpacity all in one function here to reduce file size slightly, especially in the minified version.
				var i = _agent.indexOf("Android"),
					a = _createElement("a");
				_isSafari = (_agent.indexOf("Safari") !== -1 && _agent.indexOf("Chrome") === -1 && (i === -1 || Number(_agent.substr(i+8, 1)) > 3));
				_isSafariLT6 = (_isSafari && (Number(_agent.substr(_agent.indexOf("Version/")+8, 1)) < 6));
				_isFirefox = (_agent.indexOf("Firefox") !== -1);
				if ((/MSIE ([0-9]{1,}[\.0-9]{0,})/).exec(_agent) || (/Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/).exec(_agent)) {
					_ieVers = parseFloat( RegExp.$1 );
				}
				if (!a) {
					return false;
				}
				a.style.cssText = "top:1px;opacity:.55;";
				return /^0.55/.test(a.style.opacity);
			}()),
			_getIEOpacity = function(v) {
				return (_opacityExp.test( ((typeof(v) === "string") ? v : (v.currentStyle ? v.currentStyle.filter : v.style.filter) || "") ) ? ( parseFloat( RegExp.$1 ) / 100 ) : 1);
			},
			_log = function(s) {//for logging messages, but in a way that won't throw errors in old versions of IE.
				if (window.console) {
					console.log(s);
				}
			},

			_prefixCSS = "", //the non-camelCase vendor prefix like "-o-", "-moz-", "-ms-", or "-webkit-"
			_prefix = "", //camelCase vendor prefix like "O", "ms", "Webkit", or "Moz".

			// @private feed in a camelCase property name like "transform" and it will check to see if it is valid as-is or if it needs a vendor prefix. It returns the corrected camelCase property name (i.e. "WebkitTransform" or "MozTransform" or "transform" or null if no such property is found, like if the browser is IE8 or before, "transform" won't be found at all)
			_checkPropPrefix = function(p, e) {
				e = e || _tempDiv;
				var s = e.style,
					a, i;
				if (s[p] !== undefined) {
					return p;
				}
				p = p.charAt(0).toUpperCase() + p.substr(1);
				a = ["O","Moz","ms","Ms","Webkit"];
				i = 5;
				while (--i > -1 && s[a[i]+p] === undefined) { }
				if (i >= 0) {
					_prefix = (i === 3) ? "ms" : a[i];
					_prefixCSS = "-" + _prefix.toLowerCase() + "-";
					return _prefix + p;
				}
				return null;
			},

			_getComputedStyle = _doc.defaultView ? _doc.defaultView.getComputedStyle : function() {},

			/**
			 * @private Returns the css style for a particular property of an element. For example, to get whatever the current "left" css value for an element with an ID of "myElement", you could do:
			 * var currentLeft = CSSPlugin.getStyle( document.getElementById("myElement"), "left");
			 *
			 * @param {!Object} t Target element whose style property you want to query
			 * @param {!string} p Property name (like "left" or "top" or "marginTop", etc.)
			 * @param {Object=} cs Computed style object. This just provides a way to speed processing if you're going to get several properties on the same element in quick succession - you can reuse the result of the getComputedStyle() call.
			 * @param {boolean=} calc If true, the value will not be read directly from the element's "style" property (if it exists there), but instead the getComputedStyle() result will be used. This can be useful when you want to ensure that the browser itself is interpreting the value.
			 * @param {string=} dflt Default value that should be returned in the place of null, "none", "auto" or "auto auto".
			 * @return {?string} The current property value
			 */
			_getStyle = CSSPlugin.getStyle = function(t, p, cs, calc, dflt) {
				var rv;
				if (!_supportsOpacity) if (p === "opacity") { //several versions of IE don't use the standard "opacity" property - they use things like filter:alpha(opacity=50), so we parse that here.
					return _getIEOpacity(t);
				}
				if (!calc && t.style[p]) {
					rv = t.style[p];
				} else if ((cs = cs || _getComputedStyle(t))) {
					rv = cs[p] || cs.getPropertyValue(p) || cs.getPropertyValue(p.replace(_capsExp, "-$1").toLowerCase());
				} else if (t.currentStyle) {
					rv = t.currentStyle[p];
				}
				return (dflt != null && (!rv || rv === "none" || rv === "auto" || rv === "auto auto")) ? dflt : rv;
			},

			/**
			 * @private Pass the target element, the property name, the numeric value, and the suffix (like "%", "em", "px", etc.) and it will spit back the equivalent pixel number.
			 * @param {!Object} t Target element
			 * @param {!string} p Property name (like "left", "top", "marginLeft", etc.)
			 * @param {!number} v Value
			 * @param {string=} sfx Suffix (like "px" or "%" or "em")
			 * @param {boolean=} recurse If true, the call is a recursive one. In some browsers (like IE7/8), occasionally the value isn't accurately reported initially, but if we run the function again it will take effect.
			 * @return {number} value in pixels
			 */
			_convertToPixels = _internals.convertToPixels = function(t, p, v, sfx, recurse) {
				if (sfx === "px" || !sfx) { return v; }
				if (sfx === "auto" || !v) { return 0; }
				var horiz = _horizExp.test(p),
					node = t,
					style = _tempDiv.style,
					neg = (v < 0),
					pix, cache, time;
				if (neg) {
					v = -v;
				}
				if (sfx === "%" && p.indexOf("border") !== -1) {
					pix = (v / 100) * (horiz ? t.clientWidth : t.clientHeight);
				} else {
					style.cssText = "border:0 solid red;position:" + _getStyle(t, "position") + ";line-height:0;";
					if (sfx === "%" || !node.appendChild) {
						node = t.parentNode || _doc.body;
						cache = node._gsCache;
						time = TweenLite.ticker.frame;
						if (cache && horiz && cache.time === time) { //performance optimization: we record the width of elements along with the ticker frame so that we can quickly get it again on the same tick (seems relatively safe to assume it wouldn't change on the same tick)
							return cache.width * v / 100;
						}
						style[(horiz ? "width" : "height")] = v + sfx;
					} else {
						style[(horiz ? "borderLeftWidth" : "borderTopWidth")] = v + sfx;
					}
					node.appendChild(_tempDiv);
					pix = parseFloat(_tempDiv[(horiz ? "offsetWidth" : "offsetHeight")]);
					node.removeChild(_tempDiv);
					if (horiz && sfx === "%" && CSSPlugin.cacheWidths !== false) {
						cache = node._gsCache = node._gsCache || {};
						cache.time = time;
						cache.width = pix / v * 100;
					}
					if (pix === 0 && !recurse) {
						pix = _convertToPixels(t, p, v, sfx, true);
					}
				}
				return neg ? -pix : pix;
			},
			_calculateOffset = _internals.calculateOffset = function(t, p, cs) { //for figuring out "top" or "left" in px when it's "auto". We need to factor in margin with the offsetLeft/offsetTop
				if (_getStyle(t, "position", cs) !== "absolute") { return 0; }
				var dim = ((p === "left") ? "Left" : "Top"),
					v = _getStyle(t, "margin" + dim, cs);
				return t["offset" + dim] - (_convertToPixels(t, p, parseFloat(v), v.replace(_suffixExp, "")) || 0);
			},

			// @private returns at object containing ALL of the style properties in camelCase and their associated values.
			_getAllStyles = function(t, cs) {
				var s = {},
					i, tr, p;
				if ((cs = cs || _getComputedStyle(t, null))) {
					if ((i = cs.length)) {
						while (--i > -1) {
							p = cs[i];
							if (p.indexOf("-transform") === -1 || _transformPropCSS === p) { //Some webkit browsers duplicate transform values, one non-prefixed and one prefixed ("transform" and "WebkitTransform"), so we must weed out the extra one here.
								s[p.replace(_camelExp, _camelFunc)] = cs.getPropertyValue(p);
							}
						}
					} else { //some browsers behave differently - cs.length is always 0, so we must do a for...in loop.
						for (i in cs) {
							if (i.indexOf("Transform") === -1 || _transformProp === i) { //Some webkit browsers duplicate transform values, one non-prefixed and one prefixed ("transform" and "WebkitTransform"), so we must weed out the extra one here.
								s[i] = cs[i];
							}
						}
					}
				} else if ((cs = t.currentStyle || t.style)) {
					for (i in cs) {
						if (typeof(i) === "string" && s[i] === undefined) {
							s[i.replace(_camelExp, _camelFunc)] = cs[i];
						}
					}
				}
				if (!_supportsOpacity) {
					s.opacity = _getIEOpacity(t);
				}
				tr = _getTransform(t, cs, false);
				s.rotation = tr.rotation;
				s.skewX = tr.skewX;
				s.scaleX = tr.scaleX;
				s.scaleY = tr.scaleY;
				s.x = tr.x;
				s.y = tr.y;
				if (_supports3D) {
					s.z = tr.z;
					s.rotationX = tr.rotationX;
					s.rotationY = tr.rotationY;
					s.scaleZ = tr.scaleZ;
				}
				if (s.filters) {
					delete s.filters;
				}
				return s;
			},

			// @private analyzes two style objects (as returned by _getAllStyles()) and only looks for differences between them that contain tweenable values (like a number or color). It returns an object with a "difs" property which refers to an object containing only those isolated properties and values for tweening, and a "firstMPT" property which refers to the first MiniPropTween instance in a linked list that recorded all the starting values of the different properties so that we can revert to them at the end or beginning of the tween - we don't want the cascading to get messed up. The forceLookup parameter is an optional generic object with properties that should be forced into the results - this is necessary for className tweens that are overwriting others because imagine a scenario where a rollover/rollout adds/removes a class and the user swipes the mouse over the target SUPER fast, thus nothing actually changed yet and the subsequent comparison of the properties would indicate they match (especially when px rounding is taken into consideration), thus no tweening is necessary even though it SHOULD tween and remove those properties after the tween (otherwise the inline styles will contaminate things). See the className SpecialProp code for details.
			_cssDif = function(t, s1, s2, vars, forceLookup) {
				var difs = {},
					style = t.style,
					val, p, mpt;
				for (p in s2) {
					if (p !== "cssText") if (p !== "length") if (isNaN(p)) if (s1[p] !== (val = s2[p]) || (forceLookup && forceLookup[p])) if (p.indexOf("Origin") === -1) if (typeof(val) === "number" || typeof(val) === "string") {
						difs[p] = (val === "auto" && (p === "left" || p === "top")) ? _calculateOffset(t, p) : ((val === "" || val === "auto" || val === "none") && typeof(s1[p]) === "string" && s1[p].replace(_NaNExp, "") !== "") ? 0 : val; //if the ending value is defaulting ("" or "auto"), we check the starting value and if it can be parsed into a number (a string which could have a suffix too, like 700px), then we swap in 0 for "" or "auto" so that things actually tween.
						if (style[p] !== undefined) { //for className tweens, we must remember which properties already existed inline - the ones that didn't should be removed when the tween isn't in progress because they were only introduced to facilitate the transition between classes.
							mpt = new MiniPropTween(style, p, style[p], mpt);
						}
					}
				}
				if (vars) {
					for (p in vars) { //copy properties (except className)
						if (p !== "className") {
							difs[p] = vars[p];
						}
					}
				}
				return {difs:difs, firstMPT:mpt};
			},
			_dimensions = {width:["Left","Right"], height:["Top","Bottom"]},
			_margins = ["marginLeft","marginRight","marginTop","marginBottom"],

			/**
			 * @private Gets the width or height of an element
			 * @param {!Object} t Target element
			 * @param {!string} p Property name ("width" or "height")
			 * @param {Object=} cs Computed style object (if one exists). Just a speed optimization.
			 * @return {number} Dimension (in pixels)
			 */
			_getDimension = function(t, p, cs) {
				var v = parseFloat((p === "width") ? t.offsetWidth : t.offsetHeight),
					a = _dimensions[p],
					i = a.length;
				cs = cs || _getComputedStyle(t, null);
				while (--i > -1) {
					v -= parseFloat( _getStyle(t, "padding" + a[i], cs, true) ) || 0;
					v -= parseFloat( _getStyle(t, "border" + a[i] + "Width", cs, true) ) || 0;
				}
				return v;
			},

			// @private Parses position-related complex strings like "top left" or "50px 10px" or "70% 20%", etc. which are used for things like transformOrigin or backgroundPosition. Optionally decorates a supplied object (recObj) with the following properties: "ox" (offsetX), "oy" (offsetY), "oxp" (if true, "ox" is a percentage not a pixel value), and "oxy" (if true, "oy" is a percentage not a pixel value)
			_parsePosition = function(v, recObj) {
				if (v == null || v === "" || v === "auto" || v === "auto auto") { //note: Firefox uses "auto auto" as default whereas Chrome uses "auto".
					v = "0 0";
				}
				var a = v.split(" "),
					x = (v.indexOf("left") !== -1) ? "0%" : (v.indexOf("right") !== -1) ? "100%" : a[0],
					y = (v.indexOf("top") !== -1) ? "0%" : (v.indexOf("bottom") !== -1) ? "100%" : a[1];
				if (y == null) {
					y = (x === "center") ? "50%" : "0";
				} else if (y === "center") {
					y = "50%";
				}
				if (x === "center" || (isNaN(parseFloat(x)) && (x + "").indexOf("=") === -1)) { //remember, the user could flip-flop the values and say "bottom center" or "center bottom", etc. "center" is ambiguous because it could be used to describe horizontal or vertical, hence the isNaN(). If there's an "=" sign in the value, it's relative.
					x = "50%";
				}
				v = x + " " + y + ((a.length > 2) ? " " + a[2] : "");
				if (recObj) {
					recObj.oxp = (x.indexOf("%") !== -1);
					recObj.oyp = (y.indexOf("%") !== -1);
					recObj.oxr = (x.charAt(1) === "=");
					recObj.oyr = (y.charAt(1) === "=");
					recObj.ox = parseFloat(x.replace(_NaNExp, ""));
					recObj.oy = parseFloat(y.replace(_NaNExp, ""));
					recObj.v = v;
				}
				return recObj || v;
			},

			/**
			 * @private Takes an ending value (typically a string, but can be a number) and a starting value and returns the change between the two, looking for relative value indicators like += and -= and it also ignores suffixes (but make sure the ending value starts with a number or +=/-= and that the starting value is a NUMBER!)
			 * @param {(number|string)} e End value which is typically a string, but could be a number
			 * @param {(number|string)} b Beginning value which is typically a string but could be a number
			 * @return {number} Amount of change between the beginning and ending values (relative values that have a "+=" or "-=" are recognized)
			 */
			_parseChange = function(e, b) {
				return (typeof(e) === "string" && e.charAt(1) === "=") ? parseInt(e.charAt(0) + "1", 10) * parseFloat(e.substr(2)) : parseFloat(e) - parseFloat(b);
			},

			/**
			 * @private Takes a value and a default number, checks if the value is relative, null, or numeric and spits back a normalized number accordingly. Primarily used in the _parseTransform() function.
			 * @param {Object} v Value to be parsed
			 * @param {!number} d Default value (which is also used for relative calculations if "+=" or "-=" is found in the first parameter)
			 * @return {number} Parsed value
			 */
			_parseVal = function(v, d) {
				return (v == null) ? d : (typeof(v) === "string" && v.charAt(1) === "=") ? parseInt(v.charAt(0) + "1", 10) * parseFloat(v.substr(2)) + d : parseFloat(v);
			},

			/**
			 * @private Translates strings like "40deg" or "40" or 40rad" or "+=40deg" or "270_short" or "-90_cw" or "+=45_ccw" to a numeric radian angle. Of course a starting/default value must be fed in too so that relative values can be calculated properly.
			 * @param {Object} v Value to be parsed
			 * @param {!number} d Default value (which is also used for relative calculations if "+=" or "-=" is found in the first parameter)
			 * @param {string=} p property name for directionalEnd (optional - only used when the parsed value is directional ("_short", "_cw", or "_ccw" suffix). We need a way to store the uncompensated value so that at the end of the tween, we set it to exactly what was requested with no directional compensation). Property name would be "rotation", "rotationX", or "rotationY"
			 * @param {Object=} directionalEnd An object that will store the raw end values for directional angles ("_short", "_cw", or "_ccw" suffix). We need a way to store the uncompensated value so that at the end of the tween, we set it to exactly what was requested with no directional compensation.
			 * @return {number} parsed angle in radians
			 */
			_parseAngle = function(v, d, p, directionalEnd) {
				var min = 0.000001,
					cap, split, dif, result, isRelative;
				if (v == null) {
					result = d;
				} else if (typeof(v) === "number") {
					result = v;
				} else {
					cap = 360;
					split = v.split("_");
					isRelative = (v.charAt(1) === "=");
					dif = (isRelative ? parseInt(v.charAt(0) + "1", 10) * parseFloat(split[0].substr(2)) : parseFloat(split[0])) * ((v.indexOf("rad") === -1) ? 1 : _RAD2DEG) - (isRelative ? 0 : d);
					if (split.length) {
						if (directionalEnd) {
							directionalEnd[p] = d + dif;
						}
						if (v.indexOf("short") !== -1) {
							dif = dif % cap;
							if (dif !== dif % (cap / 2)) {
								dif = (dif < 0) ? dif + cap : dif - cap;
							}
						}
						if (v.indexOf("_cw") !== -1 && dif < 0) {
							dif = ((dif + cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
						} else if (v.indexOf("ccw") !== -1 && dif > 0) {
							dif = ((dif - cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
						}
					}
					result = d + dif;
				}
				if (result < min && result > -min) {
					result = 0;
				}
				return result;
			},

			_colorLookup = {aqua:[0,255,255],
				lime:[0,255,0],
				silver:[192,192,192],
				black:[0,0,0],
				maroon:[128,0,0],
				teal:[0,128,128],
				blue:[0,0,255],
				navy:[0,0,128],
				white:[255,255,255],
				fuchsia:[255,0,255],
				olive:[128,128,0],
				yellow:[255,255,0],
				orange:[255,165,0],
				gray:[128,128,128],
				purple:[128,0,128],
				green:[0,128,0],
				red:[255,0,0],
				pink:[255,192,203],
				cyan:[0,255,255],
				transparent:[255,255,255,0]},

			_hue = function(h, m1, m2) {
				h = (h < 0) ? h + 1 : (h > 1) ? h - 1 : h;
				return ((((h * 6 < 1) ? m1 + (m2 - m1) * h * 6 : (h < 0.5) ? m2 : (h * 3 < 2) ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * 255) + 0.5) | 0;
			},

			/**
			 * @private Parses a color (like #9F0, #FF9900, or rgb(255,51,153)) into an array with 3 elements for red, green, and blue. Also handles rgba() values (splits into array of 4 elements of course)
			 * @param {(string|number)} v The value the should be parsed which could be a string like #9F0 or rgb(255,102,51) or rgba(255,0,0,0.5) or it could be a number like 0xFF00CC or even a named color like red, blue, purple, etc.
			 * @return {Array.<number>} An array containing red, green, and blue (and optionally alpha) in that order.
			 */
			_parseColor = CSSPlugin.parseColor = function(v) {
				var c1, c2, c3, h, s, l;
				if (!v || v === "") {
					return _colorLookup.black;
				}
				if (typeof(v) === "number") {
					return [v >> 16, (v >> 8) & 255, v & 255];
				}
				if (v.charAt(v.length - 1) === ",") { //sometimes a trailing commma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
					v = v.substr(0, v.length - 1);
				}
				if (_colorLookup[v]) {
					return _colorLookup[v];
				}
				if (v.charAt(0) === "#") {
					if (v.length === 4) { //for shorthand like #9F0
						c1 = v.charAt(1),
						c2 = v.charAt(2),
						c3 = v.charAt(3);
						v = "#" + c1 + c1 + c2 + c2 + c3 + c3;
					}
					v = parseInt(v.substr(1), 16);
					return [v >> 16, (v >> 8) & 255, v & 255];
				}
				if (v.substr(0, 3) === "hsl") {
					v = v.match(_numExp);
					h = (Number(v[0]) % 360) / 360;
					s = Number(v[1]) / 100;
					l = Number(v[2]) / 100;
					c2 = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
					c1 = l * 2 - c2;
					if (v.length > 3) {
						v[3] = Number(v[3]);
					}
					v[0] = _hue(h + 1 / 3, c1, c2);
					v[1] = _hue(h, c1, c2);
					v[2] = _hue(h - 1 / 3, c1, c2);
					return v;
				}
				v = v.match(_numExp) || _colorLookup.transparent;
				v[0] = Number(v[0]);
				v[1] = Number(v[1]);
				v[2] = Number(v[2]);
				if (v.length > 3) {
					v[3] = Number(v[3]);
				}
				return v;
			},
			_colorExp = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b"; //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.

		for (p in _colorLookup) {
			_colorExp += "|" + p + "\\b";
		}
		_colorExp = new RegExp(_colorExp+")", "gi");

		/**
		 * @private Returns a formatter function that handles taking a string (or number in some cases) and returning a consistently formatted one in terms of delimiters, quantity of values, etc. For example, we may get boxShadow values defined as "0px red" or "0px 0px 10px rgb(255,0,0)" or "0px 0px 20px 20px #F00" and we need to ensure that what we get back is described with 4 numbers and a color. This allows us to feed it into the _parseComplex() method and split the values up appropriately. The neat thing about this _getFormatter() function is that the dflt defines a pattern as well as a default, so for example, _getFormatter("0px 0px 0px 0px #777", true) not only sets the default as 0px for all distances and #777 for the color, but also sets the pattern such that 4 numbers and a color will always get returned.
		 * @param {!string} dflt The default value and pattern to follow. So "0px 0px 0px 0px #777" will ensure that 4 numbers and a color will always get returned.
		 * @param {boolean=} clr If true, the values should be searched for color-related data. For example, boxShadow values typically contain a color whereas borderRadius don't.
		 * @param {boolean=} collapsible If true, the value is a top/left/right/bottom style one that acts like margin or padding, where if only one value is received, it's used for all 4; if 2 are received, the first is duplicated for 3rd (bottom) and the 2nd is duplicated for the 4th spot (left), etc.
		 * @return {Function} formatter function
		 */
		var _getFormatter = function(dflt, clr, collapsible, multi) {
				if (dflt == null) {
					return function(v) {return v;};
				}
				var dColor = clr ? (dflt.match(_colorExp) || [""])[0] : "",
					dVals = dflt.split(dColor).join("").match(_valuesExp) || [],
					pfx = dflt.substr(0, dflt.indexOf(dVals[0])),
					sfx = (dflt.charAt(dflt.length - 1) === ")") ? ")" : "",
					delim = (dflt.indexOf(" ") !== -1) ? " " : ",",
					numVals = dVals.length,
					dSfx = (numVals > 0) ? dVals[0].replace(_numExp, "") : "",
					formatter;
				if (!numVals) {
					return function(v) {return v;};
				}
				if (clr) {
					formatter = function(v) {
						var color, vals, i, a;
						if (typeof(v) === "number") {
							v += dSfx;
						} else if (multi && _commasOutsideParenExp.test(v)) {
							a = v.replace(_commasOutsideParenExp, "|").split("|");
							for (i = 0; i < a.length; i++) {
								a[i] = formatter(a[i]);
							}
							return a.join(",");
						}
						color = (v.match(_colorExp) || [dColor])[0];
						vals = v.split(color).join("").match(_valuesExp) || [];
						i = vals.length;
						if (numVals > i--) {
							while (++i < numVals) {
								vals[i] = collapsible ? vals[(((i - 1) / 2) | 0)] : dVals[i];
							}
						}
						return pfx + vals.join(delim) + delim + color + sfx + (v.indexOf("inset") !== -1 ? " inset" : "");
					};
					return formatter;

				}
				formatter = function(v) {
					var vals, a, i;
					if (typeof(v) === "number") {
						v += dSfx;
					} else if (multi && _commasOutsideParenExp.test(v)) {
						a = v.replace(_commasOutsideParenExp, "|").split("|");
						for (i = 0; i < a.length; i++) {
							a[i] = formatter(a[i]);
						}
						return a.join(",");
					}
					vals = v.match(_valuesExp) || [];
					i = vals.length;
					if (numVals > i--) {
						while (++i < numVals) {
							vals[i] = collapsible ? vals[(((i - 1) / 2) | 0)] : dVals[i];
						}
					}
					return pfx + vals.join(delim) + sfx;
				};
				return formatter;
			},

			/**
			 * @private returns a formatter function that's used for edge-related values like marginTop, marginLeft, paddingBottom, paddingRight, etc. Just pass a comma-delimited list of property names related to the edges.
			 * @param {!string} props a comma-delimited list of property names in order from top to left, like "marginTop,marginRight,marginBottom,marginLeft"
			 * @return {Function} a formatter function
			 */
			_getEdgeParser = function(props) {
				props = props.split(",");
				return function(t, e, p, cssp, pt, plugin, vars) {
					var a = (e + "").split(" "),
						i;
					vars = {};
					for (i = 0; i < 4; i++) {
						vars[props[i]] = a[i] = a[i] || a[(((i - 1) / 2) >> 0)];
					}
					return cssp.parse(t, vars, pt, plugin);
				};
			},

			// @private used when other plugins must tween values first, like BezierPlugin or ThrowPropsPlugin, etc. That plugin's setRatio() gets called first so that the values are updated, and then we loop through the MiniPropTweens  which handle copying the values into their appropriate slots so that they can then be applied correctly in the main CSSPlugin setRatio() method. Remember, we typically create a proxy object that has a bunch of uniquely-named properties that we feed to the sub-plugin and it does its magic normally, and then we must interpret those values and apply them to the css because often numbers must get combined/concatenated, suffixes added, etc. to work with css, like boxShadow could have 4 values plus a color.
			_setPluginRatio = _internals._setPluginRatio = function(v) {
				this.plugin.setRatio(v);
				var d = this.data,
					proxy = d.proxy,
					mpt = d.firstMPT,
					min = 0.000001,
					val, pt, i, str;
				while (mpt) {
					val = proxy[mpt.v];
					if (mpt.r) {
						val = Math.round(val);
					} else if (val < min && val > -min) {
						val = 0;
					}
					mpt.t[mpt.p] = val;
					mpt = mpt._next;
				}
				if (d.autoRotate) {
					d.autoRotate.rotation = proxy.rotation;
				}
				//at the end, we must set the CSSPropTween's "e" (end) value dynamically here because that's what is used in the final setRatio() method.
				if (v === 1) {
					mpt = d.firstMPT;
					while (mpt) {
						pt = mpt.t;
						if (!pt.type) {
							pt.e = pt.s + pt.xs0;
						} else if (pt.type === 1) {
							str = pt.xs0 + pt.s + pt.xs1;
							for (i = 1; i < pt.l; i++) {
								str += pt["xn"+i] + pt["xs"+(i+1)];
							}
							pt.e = str;
						}
						mpt = mpt._next;
					}
				}
			},

			/**
			 * @private @constructor Used by a few SpecialProps to hold important values for proxies. For example, _parseToProxy() creates a MiniPropTween instance for each property that must get tweened on the proxy, and we record the original property name as well as the unique one we create for the proxy, plus whether or not the value needs to be rounded plus the original value.
			 * @param {!Object} t target object whose property we're tweening (often a CSSPropTween)
			 * @param {!string} p property name
			 * @param {(number|string|object)} v value
			 * @param {MiniPropTween=} next next MiniPropTween in the linked list
			 * @param {boolean=} r if true, the tweened value should be rounded to the nearest integer
			 */
			MiniPropTween = function(t, p, v, next, r) {
				this.t = t;
				this.p = p;
				this.v = v;
				this.r = r;
				if (next) {
					next._prev = this;
					this._next = next;
				}
			},

			/**
			 * @private Most other plugins (like BezierPlugin and ThrowPropsPlugin and others) can only tween numeric values, but CSSPlugin must accommodate special values that have a bunch of extra data (like a suffix or strings between numeric values, etc.). For example, boxShadow has values like "10px 10px 20px 30px rgb(255,0,0)" which would utterly confuse other plugins. This method allows us to split that data apart and grab only the numeric data and attach it to uniquely-named properties of a generic proxy object ({}) so that we can feed that to virtually any plugin to have the numbers tweened. However, we must also keep track of which properties from the proxy go with which CSSPropTween values and instances. So we create a linked list of MiniPropTweens. Each one records a target (the original CSSPropTween), property (like "s" or "xn1" or "xn2") that we're tweening and the unique property name that was used for the proxy (like "boxShadow_xn1" and "boxShadow_xn2") and whether or not they need to be rounded. That way, in the _setPluginRatio() method we can simply copy the values over from the proxy to the CSSPropTween instance(s). Then, when the main CSSPlugin setRatio() method runs and applies the CSSPropTween values accordingly, they're updated nicely. So the external plugin tweens the numbers, _setPluginRatio() copies them over, and setRatio() acts normally, applying css-specific values to the element.
			 * This method returns an object that has the following properties:
			 *  - proxy: a generic object containing the starting values for all the properties that will be tweened by the external plugin.  This is what we feed to the external _onInitTween() as the target
			 *  - end: a generic object containing the ending values for all the properties that will be tweened by the external plugin. This is what we feed to the external plugin's _onInitTween() as the destination values
			 *  - firstMPT: the first MiniPropTween in the linked list
			 *  - pt: the first CSSPropTween in the linked list that was created when parsing. If shallow is true, this linked list will NOT attach to the one passed into the _parseToProxy() as the "pt" (4th) parameter.
			 * @param {!Object} t target object to be tweened
			 * @param {!(Object|string)} vars the object containing the information about the tweening values (typically the end/destination values) that should be parsed
			 * @param {!CSSPlugin} cssp The CSSPlugin instance
			 * @param {CSSPropTween=} pt the next CSSPropTween in the linked list
			 * @param {TweenPlugin=} plugin the external TweenPlugin instance that will be handling tweening the numeric values
			 * @param {boolean=} shallow if true, the resulting linked list from the parse will NOT be attached to the CSSPropTween that was passed in as the "pt" (4th) parameter.
			 * @return An object containing the following properties: proxy, end, firstMPT, and pt (see above for descriptions)
			 */
			_parseToProxy = _internals._parseToProxy = function(t, vars, cssp, pt, plugin, shallow) {
				var bpt = pt,
					start = {},
					end = {},
					transform = cssp._transform,
					oldForce = _forcePT,
					i, p, xp, mpt, firstPT;
				cssp._transform = null;
				_forcePT = vars;
				pt = firstPT = cssp.parse(t, vars, pt, plugin);
				_forcePT = oldForce;
				//break off from the linked list so the new ones are isolated.
				if (shallow) {
					cssp._transform = transform;
					if (bpt) {
						bpt._prev = null;
						if (bpt._prev) {
							bpt._prev._next = null;
						}
					}
				}
				while (pt && pt !== bpt) {
					if (pt.type <= 1) {
						p = pt.p;
						end[p] = pt.s + pt.c;
						start[p] = pt.s;
						if (!shallow) {
							mpt = new MiniPropTween(pt, "s", p, mpt, pt.r);
							pt.c = 0;
						}
						if (pt.type === 1) {
							i = pt.l;
							while (--i > 0) {
								xp = "xn" + i;
								p = pt.p + "_" + xp;
								end[p] = pt.data[xp];
								start[p] = pt[xp];
								if (!shallow) {
									mpt = new MiniPropTween(pt, xp, p, mpt, pt.rxp[xp]);
								}
							}
						}
					}
					pt = pt._next;
				}
				return {proxy:start, end:end, firstMPT:mpt, pt:firstPT};
			},



			/**
			 * @constructor Each property that is tweened has at least one CSSPropTween associated with it. These instances store important information like the target, property, starting value, amount of change, etc. They can also optionally have a number of "extra" strings and numeric values named xs1, xn1, xs2, xn2, xs3, xn3, etc. where "s" indicates string and "n" indicates number. These can be pieced together in a complex-value tween (type:1) that has alternating types of data like a string, number, string, number, etc. For example, boxShadow could be "5px 5px 8px rgb(102, 102, 51)". In that value, there are 6 numbers that may need to tween and then pieced back together into a string again with spaces, suffixes, etc. xs0 is special in that it stores the suffix for standard (type:0) tweens, -OR- the first string (prefix) in a complex-value (type:1) CSSPropTween -OR- it can be the non-tweening value in a type:-1 CSSPropTween. We do this to conserve memory.
			 * CSSPropTweens have the following optional properties as well (not defined through the constructor):
			 *  - l: Length in terms of the number of extra properties that the CSSPropTween has (default: 0). For example, for a boxShadow we may need to tween 5 numbers in which case l would be 5; Keep in mind that the start/end values for the first number that's tweened are always stored in the s and c properties to conserve memory. All additional values thereafter are stored in xn1, xn2, etc.
			 *  - xfirst: The first instance of any sub-CSSPropTweens that are tweening properties of this instance. For example, we may split up a boxShadow tween so that there's a main CSSPropTween of type:1 that has various xs* and xn* values associated with the h-shadow, v-shadow, blur, color, etc. Then we spawn a CSSPropTween for each of those that has a higher priority and runs BEFORE the main CSSPropTween so that the values are all set by the time it needs to re-assemble them. The xfirst gives us an easy way to identify the first one in that chain which typically ends at the main one (because they're all prepende to the linked list)
			 *  - plugin: The TweenPlugin instance that will handle the tweening of any complex values. For example, sometimes we don't want to use normal subtweens (like xfirst refers to) to tween the values - we might want ThrowPropsPlugin or BezierPlugin some other plugin to do the actual tweening, so we create a plugin instance and store a reference here. We need this reference so that if we get a request to round values or disable a tween, we can pass along that request.
			 *  - data: Arbitrary data that needs to be stored with the CSSPropTween. Typically if we're going to have a plugin handle the tweening of a complex-value tween, we create a generic object that stores the END values that we're tweening to and the CSSPropTween's xs1, xs2, etc. have the starting values. We store that object as data. That way, we can simply pass that object to the plugin and use the CSSPropTween as the target.
			 *  - setRatio: Only used for type:2 tweens that require custom functionality. In this case, we call the CSSPropTween's setRatio() method and pass the ratio each time the tween updates. This isn't quite as efficient as doing things directly in the CSSPlugin's setRatio() method, but it's very convenient and flexible.
			 * @param {!Object} t Target object whose property will be tweened. Often a DOM element, but not always. It could be anything.
			 * @param {string} p Property to tween (name). For example, to tween element.width, p would be "width".
			 * @param {number} s Starting numeric value
			 * @param {number} c Change in numeric value over the course of the entire tween. For example, if element.width starts at 5 and should end at 100, c would be 95.
			 * @param {CSSPropTween=} next The next CSSPropTween in the linked list. If one is defined, we will define its _prev as the new instance, and the new instance's _next will be pointed at it.
			 * @param {number=} type The type of CSSPropTween where -1 = a non-tweening value, 0 = a standard simple tween, 1 = a complex value (like one that has multiple numbers in a comma- or space-delimited string like border:"1px solid red"), and 2 = one that uses a custom setRatio function that does all of the work of applying the values on each update.
			 * @param {string=} n Name of the property that should be used for overwriting purposes which is typically the same as p but not always. For example, we may need to create a subtween for the 2nd part of a "clip:rect(...)" tween in which case "p" might be xs1 but "n" is still "clip"
			 * @param {boolean=} r If true, the value(s) should be rounded
			 * @param {number=} pr Priority in the linked list order. Higher priority CSSPropTweens will be updated before lower priority ones. The default priority is 0.
			 * @param {string=} b Beginning value. We store this to ensure that it is EXACTLY what it was when the tween began without any risk of interpretation issues.
			 * @param {string=} e Ending value. We store this to ensure that it is EXACTLY what the user defined at the end of the tween without any risk of interpretation issues.
			 */
			CSSPropTween = _internals.CSSPropTween = function(t, p, s, c, next, type, n, r, pr, b, e) {
				this.t = t; //target
				this.p = p; //property
				this.s = s; //starting value
				this.c = c; //change value
				this.n = n || p; //name that this CSSPropTween should be associated to (usually the same as p, but not always - n is what overwriting looks at)
				if (!(t instanceof CSSPropTween)) {
					_overwriteProps.push(this.n);
				}
				this.r = r; //round (boolean)
				this.type = type || 0; //0 = normal tween, -1 = non-tweening (in which case xs0 will be applied to the target's property, like tp.t[tp.p] = tp.xs0), 1 = complex-value SpecialProp, 2 = custom setRatio() that does all the work
				if (pr) {
					this.pr = pr;
					_hasPriority = true;
				}
				this.b = (b === undefined) ? s : b;
				this.e = (e === undefined) ? s + c : e;
				if (next) {
					this._next = next;
					next._prev = this;
				}
			},

			_addNonTweeningNumericPT = function(target, prop, start, end, next, overwriteProp) { //cleans up some code redundancies and helps minification. Just a fast way to add a NUMERIC non-tweening CSSPropTween
				var pt = new CSSPropTween(target, prop, start, end - start, next, -1, overwriteProp);
				pt.b = start;
				pt.e = pt.xs0 = end;
				return pt;
			},

			/**
			 * Takes a target, the beginning value and ending value (as strings) and parses them into a CSSPropTween (possibly with child CSSPropTweens) that accommodates multiple numbers, colors, comma-delimited values, etc. For example:
			 * sp.parseComplex(element, "boxShadow", "5px 10px 20px rgb(255,102,51)", "0px 0px 0px red", true, "0px 0px 0px rgb(0,0,0,0)", pt);
			 * It will walk through the beginning and ending values (which should be in the same format with the same number and type of values) and figure out which parts are numbers, what strings separate the numeric/tweenable values, and then create the CSSPropTweens accordingly. If a plugin is defined, no child CSSPropTweens will be created. Instead, the ending values will be stored in the "data" property of the returned CSSPropTween like: {s:-5, xn1:-10, xn2:-20, xn3:255, xn4:0, xn5:0} so that it can be fed to any other plugin and it'll be plain numeric tweens but the recomposition of the complex value will be handled inside CSSPlugin's setRatio().
			 * If a setRatio is defined, the type of the CSSPropTween will be set to 2 and recomposition of the values will be the responsibility of that method.
			 *
			 * @param {!Object} t Target whose property will be tweened
			 * @param {!string} p Property that will be tweened (its name, like "left" or "backgroundColor" or "boxShadow")
			 * @param {string} b Beginning value
			 * @param {string} e Ending value
			 * @param {boolean} clrs If true, the value could contain a color value like "rgb(255,0,0)" or "#F00" or "red". The default is false, so no colors will be recognized (a performance optimization)
			 * @param {(string|number|Object)} dflt The default beginning value that should be used if no valid beginning value is defined or if the number of values inside the complex beginning and ending values don't match
			 * @param {?CSSPropTween} pt CSSPropTween instance that is the current head of the linked list (we'll prepend to this).
			 * @param {number=} pr Priority in the linked list order. Higher priority properties will be updated before lower priority ones. The default priority is 0.
			 * @param {TweenPlugin=} plugin If a plugin should handle the tweening of extra properties, pass the plugin instance here. If one is defined, then NO subtweens will be created for any extra properties (the properties will be created - just not additional CSSPropTween instances to tween them) because the plugin is expected to do so. However, the end values WILL be populated in the "data" property, like {s:100, xn1:50, xn2:300}
			 * @param {function(number)=} setRatio If values should be set in a custom function instead of being pieced together in a type:1 (complex-value) CSSPropTween, define that custom function here.
			 * @return {CSSPropTween} The first CSSPropTween in the linked list which includes the new one(s) added by the parseComplex() call.
			 */
			_parseComplex = CSSPlugin.parseComplex = function(t, p, b, e, clrs, dflt, pt, pr, plugin, setRatio) {
				//DEBUG: _log("parseComplex: "+p+", b: "+b+", e: "+e);
				b = b || dflt || "";
				pt = new CSSPropTween(t, p, 0, 0, pt, (setRatio ? 2 : 1), null, false, pr, b, e);
				e += ""; //ensures it's a string
				var ba = b.split(", ").join(",").split(" "), //beginning array
					ea = e.split(", ").join(",").split(" "), //ending array
					l = ba.length,
					autoRound = (_autoRound !== false),
					i, xi, ni, bv, ev, bnums, enums, bn, rgba, temp, cv, str;
				if (e.indexOf(",") !== -1 || b.indexOf(",") !== -1) {
					ba = ba.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
					ea = ea.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
					l = ba.length;
				}
				if (l !== ea.length) {
					//DEBUG: _log("mismatched formatting detected on " + p + " (" + b + " vs " + e + ")");
					ba = (dflt || "").split(" ");
					l = ba.length;
				}
				pt.plugin = plugin;
				pt.setRatio = setRatio;
				for (i = 0; i < l; i++) {
					bv = ba[i];
					ev = ea[i];
					bn = parseFloat(bv);
					//if the value begins with a number (most common). It's fine if it has a suffix like px
					if (bn || bn === 0) {
						pt.appendXtra("", bn, _parseChange(ev, bn), ev.replace(_relNumExp, ""), (autoRound && ev.indexOf("px") !== -1), true);

					//if the value is a color
					} else if (clrs && (bv.charAt(0) === "#" || _colorLookup[bv] || _rgbhslExp.test(bv))) {
						str = ev.charAt(ev.length - 1) === "," ? ")," : ")"; //if there's a comma at the end, retain it.
						bv = _parseColor(bv);
						ev = _parseColor(ev);
						rgba = (bv.length + ev.length > 6);
						if (rgba && !_supportsOpacity && ev[3] === 0) { //older versions of IE don't support rgba(), so if the destination alpha is 0, just use "transparent" for the end color
							pt["xs" + pt.l] += pt.l ? " transparent" : "transparent";
							pt.e = pt.e.split(ea[i]).join("transparent");
						} else {
							if (!_supportsOpacity) { //old versions of IE don't support rgba().
								rgba = false;
							}
							pt.appendXtra((rgba ? "rgba(" : "rgb("), bv[0], ev[0] - bv[0], ",", true, true)
								.appendXtra("", bv[1], ev[1] - bv[1], ",", true)
								.appendXtra("", bv[2], ev[2] - bv[2], (rgba ? "," : str), true);
							if (rgba) {
								bv = (bv.length < 4) ? 1 : bv[3];
								pt.appendXtra("", bv, ((ev.length < 4) ? 1 : ev[3]) - bv, str, false);
							}
						}

					} else {
						bnums = bv.match(_numExp); //gets each group of numbers in the beginning value string and drops them into an array

						//if no number is found, treat it as a non-tweening value and just append the string to the current xs.
						if (!bnums) {
							pt["xs" + pt.l] += pt.l ? " " + bv : bv;

						//loop through all the numbers that are found and construct the extra values on the pt.
						} else {
							enums = ev.match(_relNumExp); //get each group of numbers in the end value string and drop them into an array. We allow relative values too, like +=50 or -=.5
							if (!enums || enums.length !== bnums.length) {
								//DEBUG: _log("mismatched formatting detected on " + p + " (" + b + " vs " + e + ")");
								return pt;
							}
							ni = 0;
							for (xi = 0; xi < bnums.length; xi++) {
								cv = bnums[xi];
								temp = bv.indexOf(cv, ni);
								pt.appendXtra(bv.substr(ni, temp - ni), Number(cv), _parseChange(enums[xi], cv), "", (autoRound && bv.substr(temp + cv.length, 2) === "px"), (xi === 0));
								ni = temp + cv.length;
							}
							pt["xs" + pt.l] += bv.substr(ni);
						}
					}
				}
				//if there are relative values ("+=" or "-=" prefix), we need to adjust the ending value to eliminate the prefixes and combine the values properly.
				if (e.indexOf("=") !== -1) if (pt.data) {
					str = pt.xs0 + pt.data.s;
					for (i = 1; i < pt.l; i++) {
						str += pt["xs" + i] + pt.data["xn" + i];
					}
					pt.e = str + pt["xs" + i];
				}
				if (!pt.l) {
					pt.type = -1;
					pt.xs0 = pt.e;
				}
				return pt.xfirst || pt;
			},
			i = 9;


		p = CSSPropTween.prototype;
		p.l = p.pr = 0; //length (number of extra properties like xn1, xn2, xn3, etc.
		while (--i > 0) {
			p["xn" + i] = 0;
			p["xs" + i] = "";
		}
		p.xs0 = "";
		p._next = p._prev = p.xfirst = p.data = p.plugin = p.setRatio = p.rxp = null;


		/**
		 * Appends and extra tweening value to a CSSPropTween and automatically manages any prefix and suffix strings. The first extra value is stored in the s and c of the main CSSPropTween instance, but thereafter any extras are stored in the xn1, xn2, xn3, etc. The prefixes and suffixes are stored in the xs0, xs1, xs2, etc. properties. For example, if I walk through a clip value like "rect(10px, 5px, 0px, 20px)", the values would be stored like this:
		 * xs0:"rect(", s:10, xs1:"px, ", xn1:5, xs2:"px, ", xn2:0, xs3:"px, ", xn3:20, xn4:"px)"
		 * And they'd all get joined together when the CSSPlugin renders (in the setRatio() method).
		 * @param {string=} pfx Prefix (if any)
		 * @param {!number} s Starting value
		 * @param {!number} c Change in numeric value over the course of the entire tween. For example, if the start is 5 and the end is 100, the change would be 95.
		 * @param {string=} sfx Suffix (if any)
		 * @param {boolean=} r Round (if true).
		 * @param {boolean=} pad If true, this extra value should be separated by the previous one by a space. If there is no previous extra and pad is true, it will automatically drop the space.
		 * @return {CSSPropTween} returns itself so that multiple methods can be chained together.
		 */
		p.appendXtra = function(pfx, s, c, sfx, r, pad) {
			var pt = this,
				l = pt.l;
			pt["xs" + l] += (pad && l) ? " " + pfx : pfx || "";
			if (!c) if (l !== 0 && !pt.plugin) { //typically we'll combine non-changing values right into the xs to optimize performance, but we don't combine them when there's a plugin that will be tweening the values because it may depend on the values being split apart, like for a bezier, if a value doesn't change between the first and second iteration but then it does on the 3rd, we'll run into trouble because there's no xn slot for that value!
				pt["xs" + l] += s + (sfx || "");
				return pt;
			}
			pt.l++;
			pt.type = pt.setRatio ? 2 : 1;
			pt["xs" + pt.l] = sfx || "";
			if (l > 0) {
				pt.data["xn" + l] = s + c;
				pt.rxp["xn" + l] = r; //round extra property (we need to tap into this in the _parseToProxy() method)
				pt["xn" + l] = s;
				if (!pt.plugin) {
					pt.xfirst = new CSSPropTween(pt, "xn" + l, s, c, pt.xfirst || pt, 0, pt.n, r, pt.pr);
					pt.xfirst.xs0 = 0; //just to ensure that the property stays numeric which helps modern browsers speed up processing. Remember, in the setRatio() method, we do pt.t[pt.p] = val + pt.xs0 so if pt.xs0 is "" (the default), it'll cast the end value as a string. When a property is a number sometimes and a string sometimes, it prevents the compiler from locking in the data type, slowing things down slightly.
				}
				return pt;
			}
			pt.data = {s:s + c};
			pt.rxp = {};
			pt.s = s;
			pt.c = c;
			pt.r = r;
			return pt;
		};

		/**
		 * @constructor A SpecialProp is basically a css property that needs to be treated in a non-standard way, like if it may contain a complex value like boxShadow:"5px 10px 15px rgb(255, 102, 51)" or if it is associated with another plugin like ThrowPropsPlugin or BezierPlugin. Every SpecialProp is associated with a particular property name like "boxShadow" or "throwProps" or "bezier" and it will intercept those values in the vars object that's passed to the CSSPlugin and handle them accordingly.
		 * @param {!string} p Property name (like "boxShadow" or "throwProps")
		 * @param {Object=} options An object containing any of the following configuration options:
		 *                      - defaultValue: the default value
		 *                      - parser: A function that should be called when the associated property name is found in the vars. This function should return a CSSPropTween instance and it should ensure that it is properly inserted into the linked list. It will receive 4 paramters: 1) The target, 2) The value defined in the vars, 3) The CSSPlugin instance (whose _firstPT should be used for the linked list), and 4) A computed style object if one was calculated (this is a speed optimization that allows retrieval of starting values quicker)
		 *                      - formatter: a function that formats any value received for this special property (for example, boxShadow could take "5px 5px red" and format it to "5px 5px 0px 0px red" so that both the beginning and ending values have a common order and quantity of values.)
		 *                      - prefix: if true, we'll determine whether or not this property requires a vendor prefix (like Webkit or Moz or ms or O)
		 *                      - color: set this to true if the value for this SpecialProp may contain color-related values like rgb(), rgba(), etc.
		 *                      - priority: priority in the linked list order. Higher priority SpecialProps will be updated before lower priority ones. The default priority is 0.
		 *                      - multi: if true, the formatter should accommodate a comma-delimited list of values, like boxShadow could have multiple boxShadows listed out.
		 *                      - collapsible: if true, the formatter should treat the value like it's a top/right/bottom/left value that could be collapsed, like "5px" would apply to all, "5px, 10px" would use 5px for top/bottom and 10px for right/left, etc.
		 *                      - keyword: a special keyword that can [optionally] be found inside the value (like "inset" for boxShadow). This allows us to validate beginning/ending values to make sure they match (if the keyword is found in one, it'll be added to the other for consistency by default).
		 */
		var SpecialProp = function(p, options) {
				options = options || {};
				this.p = options.prefix ? _checkPropPrefix(p) || p : p;
				_specialProps[p] = _specialProps[this.p] = this;
				this.format = options.formatter || _getFormatter(options.defaultValue, options.color, options.collapsible, options.multi);
				if (options.parser) {
					this.parse = options.parser;
				}
				this.clrs = options.color;
				this.multi = options.multi;
				this.keyword = options.keyword;
				this.dflt = options.defaultValue;
				this.pr = options.priority || 0;
			},

			//shortcut for creating a new SpecialProp that can accept multiple properties as a comma-delimited list (helps minification). dflt can be an array for multiple values (we don't do a comma-delimited list because the default value may contain commas, like rect(0px,0px,0px,0px)). We attach this method to the SpecialProp class/object instead of using a private _createSpecialProp() method so that we can tap into it externally if necessary, like from another plugin.
			_registerComplexSpecialProp = _internals._registerComplexSpecialProp = function(p, options, defaults) {
				if (typeof(options) !== "object") {
					options = {parser:defaults}; //to make backwards compatible with older versions of BezierPlugin and ThrowPropsPlugin
				}
				var a = p.split(","),
					d = options.defaultValue,
					i, temp;
				defaults = defaults || [d];
				for (i = 0; i < a.length; i++) {
					options.prefix = (i === 0 && options.prefix);
					options.defaultValue = defaults[i] || d;
					temp = new SpecialProp(a[i], options);
				}
			},

			//creates a placeholder special prop for a plugin so that the property gets caught the first time a tween of it is attempted, and at that time it makes the plugin register itself, thus taking over for all future tweens of that property. This allows us to not mandate that things load in a particular order and it also allows us to log() an error that informs the user when they attempt to tween an external plugin-related property without loading its .js file.
			_registerPluginProp = function(p) {
				if (!_specialProps[p]) {
					var pluginName = p.charAt(0).toUpperCase() + p.substr(1) + "Plugin";
					_registerComplexSpecialProp(p, {parser:function(t, e, p, cssp, pt, plugin, vars) {
						var pluginClass = _globals.com.greensock.plugins[pluginName];
						if (!pluginClass) {
							_log("Error: " + pluginName + " js file not loaded.");
							return pt;
						}
						pluginClass._cssRegister();
						return _specialProps[p].parse(t, e, p, cssp, pt, plugin, vars);
					}});
				}
			};


		p = SpecialProp.prototype;

		/**
		 * Alias for _parseComplex() that automatically plugs in certain values for this SpecialProp, like its property name, whether or not colors should be sensed, the default value, and priority. It also looks for any keyword that the SpecialProp defines (like "inset" for boxShadow) and ensures that the beginning and ending values have the same number of values for SpecialProps where multi is true (like boxShadow and textShadow can have a comma-delimited list)
		 * @param {!Object} t target element
		 * @param {(string|number|object)} b beginning value
		 * @param {(string|number|object)} e ending (destination) value
		 * @param {CSSPropTween=} pt next CSSPropTween in the linked list
		 * @param {TweenPlugin=} plugin If another plugin will be tweening the complex value, that TweenPlugin instance goes here.
		 * @param {function=} setRatio If a custom setRatio() method should be used to handle this complex value, that goes here.
		 * @return {CSSPropTween=} First CSSPropTween in the linked list
		 */
		p.parseComplex = function(t, b, e, pt, plugin, setRatio) {
			var kwd = this.keyword,
				i, ba, ea, l, bi, ei;
			//if this SpecialProp's value can contain a comma-delimited list of values (like boxShadow or textShadow), we must parse them in a special way, and look for a keyword (like "inset" for boxShadow) and ensure that the beginning and ending BOTH have it if the end defines it as such. We also must ensure that there are an equal number of values specified (we can't tween 1 boxShadow to 3 for example)
			if (this.multi) if (_commasOutsideParenExp.test(e) || _commasOutsideParenExp.test(b)) {
				ba = b.replace(_commasOutsideParenExp, "|").split("|");
				ea = e.replace(_commasOutsideParenExp, "|").split("|");
			} else if (kwd) {
				ba = [b];
				ea = [e];
			}
			if (ea) {
				l = (ea.length > ba.length) ? ea.length : ba.length;
				for (i = 0; i < l; i++) {
					b = ba[i] = ba[i] || this.dflt;
					e = ea[i] = ea[i] || this.dflt;
					if (kwd) {
						bi = b.indexOf(kwd);
						ei = e.indexOf(kwd);
						if (bi !== ei) {
							if (ei === -1) { //if the keyword isn't in the end value, remove it from the beginning one.
								ba[i] = ba[i].split(kwd).join("");
							} else if (bi === -1) { //if the keyword isn't in the beginning, add it.
								ba[i] += " " + kwd;
							}
						}
					}
				}
				b = ba.join(", ");
				e = ea.join(", ");
			}
			return _parseComplex(t, this.p, b, e, this.clrs, this.dflt, pt, this.pr, plugin, setRatio);
		};

		/**
		 * Accepts a target and end value and spits back a CSSPropTween that has been inserted into the CSSPlugin's linked list and conforms with all the conventions we use internally, like type:-1, 0, 1, or 2, setting up any extra property tweens, priority, etc. For example, if we have a boxShadow SpecialProp and call:
		 * this._firstPT = sp.parse(element, "5px 10px 20px rgb(2550,102,51)", "boxShadow", this);
		 * It should figure out the starting value of the element's boxShadow, compare it to the provided end value and create all the necessary CSSPropTweens of the appropriate types to tween the boxShadow. The CSSPropTween that gets spit back should already be inserted into the linked list (the 4th parameter is the current head, so prepend to that).
		 * @param {!Object} t Target object whose property is being tweened
		 * @param {Object} e End value as provided in the vars object (typically a string, but not always - like a throwProps would be an object).
		 * @param {!string} p Property name
		 * @param {!CSSPlugin} cssp The CSSPlugin instance that should be associated with this tween.
		 * @param {?CSSPropTween} pt The CSSPropTween that is the current head of the linked list (we'll prepend to it)
		 * @param {TweenPlugin=} plugin If a plugin will be used to tween the parsed value, this is the plugin instance.
		 * @param {Object=} vars Original vars object that contains the data for parsing.
		 * @return {CSSPropTween} The first CSSPropTween in the linked list which includes the new one(s) added by the parse() call.
		 */
		p.parse = function(t, e, p, cssp, pt, plugin, vars) {
			return this.parseComplex(t.style, this.format(_getStyle(t, this.p, _cs, false, this.dflt)), this.format(e), pt, plugin);
		};

		/**
		 * Registers a special property that should be intercepted from any "css" objects defined in tweens. This allows you to handle them however you want without CSSPlugin doing it for you. The 2nd parameter should be a function that accepts 3 parameters:
		 *  1) Target object whose property should be tweened (typically a DOM element)
		 *  2) The end/destination value (could be a string, number, object, or whatever you want)
		 *  3) The tween instance (you probably don't need to worry about this, but it can be useful for looking up information like the duration)
		 *
		 * Then, your function should return a function which will be called each time the tween gets rendered, passing a numeric "ratio" parameter to your function that indicates the change factor (usually between 0 and 1). For example:
		 *
		 * CSSPlugin.registerSpecialProp("myCustomProp", function(target, value, tween) {
		 *      var start = target.style.width;
		 *      return function(ratio) {
		 *              target.style.width = (start + value * ratio) + "px";
		 *              console.log("set width to " + target.style.width);
		 *          }
		 * }, 0);
		 *
		 * Then, when I do this tween, it will trigger my special property:
		 *
		 * TweenLite.to(element, 1, {css:{myCustomProp:100}});
		 *
		 * In the example, of course, we're just changing the width, but you can do anything you want.
		 *
		 * @param {!string} name Property name (or comma-delimited list of property names) that should be intercepted and handled by your function. For example, if I define "myCustomProp", then it would handle that portion of the following tween: TweenLite.to(element, 1, {css:{myCustomProp:100}})
		 * @param {!function(Object, Object, Object, string):function(number)} onInitTween The function that will be called when a tween of this special property is performed. The function will receive 4 parameters: 1) Target object that should be tweened, 2) Value that was passed to the tween, 3) The tween instance itself (rarely used), and 4) The property name that's being tweened. Your function should return a function that should be called on every update of the tween. That function will receive a single parameter that is a "change factor" value (typically between 0 and 1) indicating the amount of change as a ratio. You can use this to determine how to set the values appropriately in your function.
		 * @param {number=} priority Priority that helps the engine determine the order in which to set the properties (default: 0). Higher priority properties will be updated before lower priority ones.
		 */
		CSSPlugin.registerSpecialProp = function(name, onInitTween, priority) {
			_registerComplexSpecialProp(name, {parser:function(t, e, p, cssp, pt, plugin, vars) {
				var rv = new CSSPropTween(t, p, 0, 0, pt, 2, p, false, priority);
				rv.plugin = plugin;
				rv.setRatio = onInitTween(t, e, cssp._tween, p);
				return rv;
			}, priority:priority});
		};






		//transform-related methods and properties
		CSSPlugin.useSVGTransformAttr = _isSafari || _isFirefox; //Safari and Firefox both have some rendering bugs when applying CSS transforms to SVG elements, so default to using the "transform" attribute instead (users can override this).
		var _transformProps = ("scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent").split(","),
			_transformProp = _checkPropPrefix("transform"), //the Javascript (camelCase) transform property, like msTransform, WebkitTransform, MozTransform, or OTransform.
			_transformPropCSS = _prefixCSS + "transform",
			_transformOriginProp = _checkPropPrefix("transformOrigin"),
			_supports3D = (_checkPropPrefix("perspective") !== null),
			Transform = _internals.Transform = function() {
				this.perspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0;
				this.force3D = (CSSPlugin.defaultForce3D === false || !_supports3D) ? false : CSSPlugin.defaultForce3D || "auto";
			},
			_SVGElement = window.SVGElement,
			_useSVGTransformAttr,
			//Some browsers (like Firefox and IE) don't honor transform-origin properly in SVG elements, so we need to manually adjust the matrix accordingly. We feature detect here rather than always doing the conversion for certain browsers because they may fix the problem at some point in the future.

			_createSVG = function(type, container, attributes) {
				var element = _doc.createElementNS("http://www.w3.org/2000/svg", type),
					reg = /([a-z])([A-Z])/g,
					p;
				for (p in attributes) {
					element.setAttributeNS(null, p.replace(reg, "$1-$2").toLowerCase(), attributes[p]);
				}
				container.appendChild(element);
				return element;
			},
			_docElement = _doc.documentElement,
			_forceSVGTransformAttr = (function() {
				//IE and Android stock don't support CSS transforms on SVG elements, so we must write them to the "transform" attribute. We populate this variable in the _parseTransform() method, and only if/when we come across an SVG element
				var force = _ieVers || (/Android/i.test(_agent) && !window.chrome),
					svg, rect, width;
				if (_doc.createElementNS && !force) { //IE8 and earlier doesn't support SVG anyway
					svg = _createSVG("svg", _docElement);
					rect = _createSVG("rect", svg, {width:100, height:50, x:100});
					width = rect.getBoundingClientRect().width;
					rect.style[_transformOriginProp] = "50% 50%";
					rect.style[_transformProp] = "scaleX(0.5)";
					force = (width === rect.getBoundingClientRect().width && !(_isFirefox && _supports3D)); //note: Firefox fails the test even though it does support CSS transforms in 3D. Since we can't push 3D stuff into the transform attribute, we force Firefox to pass the test here (as long as it does truly support 3D).
					_docElement.removeChild(svg);
				}
				return force;
			})(),
			_parseSVGOrigin = function(e, local, decoratee, absolute, smoothOrigin) {
				var tm = e._gsTransform,
					m = _getMatrix(e, true),
					v, x, y, xOrigin, yOrigin, a, b, c, d, tx, ty, determinant, xOriginOld, yOriginOld;
				if (tm) {
					xOriginOld = tm.xOrigin; //record the original values before we alter them.
					yOriginOld = tm.yOrigin;
				}
				if (!absolute || (v = absolute.split(" ")).length < 2) {
					b = e.getBBox();
					local = _parsePosition(local).split(" ");
					v = [(local[0].indexOf("%") !== -1 ? parseFloat(local[0]) / 100 * b.width : parseFloat(local[0])) + b.x,
						 (local[1].indexOf("%") !== -1 ? parseFloat(local[1]) / 100 * b.height : parseFloat(local[1])) + b.y];
				}
				decoratee.xOrigin = xOrigin = parseFloat(v[0]);
				decoratee.yOrigin = yOrigin = parseFloat(v[1]);
				if (absolute && m !== _identity2DMatrix) { //if svgOrigin is being set, we must invert the matrix and determine where the absolute point is, factoring in the current transforms. Otherwise, the svgOrigin would be based on the element's non-transformed position on the canvas.
					a = m[0];
					b = m[1];
					c = m[2];
					d = m[3];
					tx = m[4];
					ty = m[5];
					determinant = (a * d - b * c);
					x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + ((c * ty - d * tx) / determinant);
					y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - ((a * ty - b * tx) / determinant);
					xOrigin = decoratee.xOrigin = v[0] = x;
					yOrigin = decoratee.yOrigin = v[1] = y;
				}
				if (tm) { //avoid jump when transformOrigin is changed - adjust the x/y values accordingly
					if (smoothOrigin || (smoothOrigin !== false && CSSPlugin.defaultSmoothOrigin !== false)) {
						x = xOrigin - xOriginOld;
						y = yOrigin - yOriginOld;
						//originally, we simply adjusted the x and y values, but that would cause problems if, for example, you created a rotational tween part-way through an x/y tween. Managing the offset in a separate variable gives us ultimate flexibility.
						//tm.x -= x - (x * m[0] + y * m[2]);
						//tm.y -= y - (x * m[1] + y * m[3]);
						tm.xOffset += (x * m[0] + y * m[2]) - x;
						tm.yOffset += (x * m[1] + y * m[3]) - y;
					} else {
						tm.xOffset = tm.yOffset = 0;
					}
				}
				e.setAttribute("data-svg-origin", v.join(" "));
			},
			_isSVG = function(e) {
				return !!(_SVGElement && typeof(e.getBBox) === "function" && e.getCTM && (!e.parentNode || (e.parentNode.getBBox && e.parentNode.getCTM)));
			},
			_identity2DMatrix = [1,0,0,1,0,0],
			_getMatrix = function(e, force2D) {
				var tm = e._gsTransform || new Transform(),
					rnd = 100000,
					isDefault, s, m, n, dec;
				if (_transformProp) {
					s = _getStyle(e, _transformPropCSS, null, true);
				} else if (e.currentStyle) {
					//for older versions of IE, we need to interpret the filter portion that is in the format: progid:DXImageTransform.Microsoft.Matrix(M11=6.123233995736766e-17, M12=-1, M21=1, M22=6.123233995736766e-17, sizingMethod='auto expand') Notice that we need to swap b and c compared to a normal matrix.
					s = e.currentStyle.filter.match(_ieGetMatrixExp);
					s = (s && s.length === 4) ? [s[0].substr(4), Number(s[2].substr(4)), Number(s[1].substr(4)), s[3].substr(4), (tm.x || 0), (tm.y || 0)].join(",") : "";
				}
				isDefault = (!s || s === "none" || s === "matrix(1, 0, 0, 1, 0, 0)");
				if (tm.svg || (e.getBBox && _isSVG(e))) {
					if (isDefault && (e.style[_transformProp] + "").indexOf("matrix") !== -1) { //some browsers (like Chrome 40) don't correctly report transforms that are applied inline on an SVG element (they don't get included in the computed style), so we double-check here and accept matrix values
						s = e.style[_transformProp];
						isDefault = 0;
					}
					m = e.getAttribute("transform");
					if (isDefault && m) {
						if (m.indexOf("matrix") !== -1) { //just in case there's a "transform" value specified as an attribute instead of CSS style. Accept either a matrix() or simple translate() value though.
							s = m;
							isDefault = 0;
						} else if (m.indexOf("translate") !== -1) {
							s = "matrix(1,0,0,1," + m.match(/(?:\-|\b)[\d\-\.e]+\b/gi).join(",") + ")";
							isDefault = 0;
						}
					}
				}
				if (isDefault) {
					return _identity2DMatrix;
				}
				//split the matrix values out into an array (m for matrix)
				m = (s || "").match(/(?:\-|\b)[\d\-\.e]+\b/gi) || [];
				i = m.length;
				while (--i > -1) {
					n = Number(m[i]);
					m[i] = (dec = n - (n |= 0)) ? ((dec * rnd + (dec < 0 ? -0.5 : 0.5)) | 0) / rnd + n : n; //convert strings to Numbers and round to 5 decimal places to avoid issues with tiny numbers. Roughly 20x faster than Number.toFixed(). We also must make sure to round before dividing so that values like 0.9999999999 become 1 to avoid glitches in browser rendering and interpretation of flipped/rotated 3D matrices. And don't just multiply the number by rnd, floor it, and then divide by rnd because the bitwise operations max out at a 32-bit signed integer, thus it could get clipped at a relatively low value (like 22,000.00000 for example).
				}
				return (force2D && m.length > 6) ? [m[0], m[1], m[4], m[5], m[12], m[13]] : m;
			},

			/**
			 * Parses the transform values for an element, returning an object with x, y, z, scaleX, scaleY, scaleZ, rotation, rotationX, rotationY, skewX, and skewY properties. Note: by default (for performance reasons), all skewing is combined into skewX and rotation but skewY still has a place in the transform object so that we can record how much of the skew is attributed to skewX vs skewY. Remember, a skewY of 10 looks the same as a rotation of 10 and skewX of -10.
			 * @param {!Object} t target element
			 * @param {Object=} cs computed style object (optional)
			 * @param {boolean=} rec if true, the transform values will be recorded to the target element's _gsTransform object, like target._gsTransform = {x:0, y:0, z:0, scaleX:1...}
			 * @param {boolean=} parse if true, we'll ignore any _gsTransform values that already exist on the element, and force a reparsing of the css (calculated style)
			 * @return {object} object containing all of the transform properties/values like {x:0, y:0, z:0, scaleX:1...}
			 */
			_getTransform = _internals.getTransform = function(t, cs, rec, parse) {
				if (t._gsTransform && rec && !parse) {
					return t._gsTransform; //if the element already has a _gsTransform, use that. Note: some browsers don't accurately return the calculated style for the transform (particularly for SVG), so it's almost always safest to just use the values we've already applied rather than re-parsing things.
				}
				var tm = rec ? t._gsTransform || new Transform() : new Transform(),
					invX = (tm.scaleX < 0), //in order to interpret things properly, we need to know if the user applied a negative scaleX previously so that we can adjust the rotation and skewX accordingly. Otherwise, if we always interpret a flipped matrix as affecting scaleY and the user only wants to tween the scaleX on multiple sequential tweens, it would keep the negative scaleY without that being the user's intent.
					min = 0.00002,
					rnd = 100000,
					zOrigin = _supports3D ? parseFloat(_getStyle(t, _transformOriginProp, cs, false, "0 0 0").split(" ")[2]) || tm.zOrigin  || 0 : 0,
					defaultTransformPerspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0,
					m, i, scaleX, scaleY, rotation, skewX;

				tm.svg = !!(t.getBBox && _isSVG(t));
				if (tm.svg) {
					_parseSVGOrigin(t, _getStyle(t, _transformOriginProp, _cs, false, "50% 50%") + "", tm, t.getAttribute("data-svg-origin"));
					_useSVGTransformAttr = CSSPlugin.useSVGTransformAttr || _forceSVGTransformAttr;
				}
				m = _getMatrix(t);
				if (m !== _identity2DMatrix) {

					if (m.length === 16) {
						//we'll only look at these position-related 6 variables first because if x/y/z all match, it's relatively safe to assume we don't need to re-parse everything which risks losing important rotational information (like rotationX:180 plus rotationY:180 would look the same as rotation:180 - there's no way to know for sure which direction was taken based solely on the matrix3d() values)
						var a11 = m[0], a21 = m[1], a31 = m[2], a41 = m[3],
							a12 = m[4], a22 = m[5], a32 = m[6], a42 = m[7],
							a13 = m[8], a23 = m[9], a33 = m[10],
							a14 = m[12], a24 = m[13], a34 = m[14],
							a43 = m[11],
							angle = Math.atan2(a32, a33),
							t1, t2, t3, t4, cos, sin;

						//we manually compensate for non-zero z component of transformOrigin to work around bugs in Safari
						if (tm.zOrigin) {
							a34 = -tm.zOrigin;
							a14 = a13*a34-m[12];
							a24 = a23*a34-m[13];
							a34 = a33*a34+tm.zOrigin-m[14];
						}
						tm.rotationX = angle * _RAD2DEG;
						//rotationX
						if (angle) {
							cos = Math.cos(-angle);
							sin = Math.sin(-angle);
							t1 = a12*cos+a13*sin;
							t2 = a22*cos+a23*sin;
							t3 = a32*cos+a33*sin;
							a13 = a12*-sin+a13*cos;
							a23 = a22*-sin+a23*cos;
							a33 = a32*-sin+a33*cos;
							a43 = a42*-sin+a43*cos;
							a12 = t1;
							a22 = t2;
							a32 = t3;
						}
						//rotationY
						angle = Math.atan2(a13, a33);
						tm.rotationY = angle * _RAD2DEG;
						if (angle) {
							cos = Math.cos(-angle);
							sin = Math.sin(-angle);
							t1 = a11*cos-a13*sin;
							t2 = a21*cos-a23*sin;
							t3 = a31*cos-a33*sin;
							a23 = a21*sin+a23*cos;
							a33 = a31*sin+a33*cos;
							a43 = a41*sin+a43*cos;
							a11 = t1;
							a21 = t2;
							a31 = t3;
						}
						//rotationZ
						angle = Math.atan2(a21, a11);
						tm.rotation = angle * _RAD2DEG;
						if (angle) {
							cos = Math.cos(-angle);
							sin = Math.sin(-angle);
							a11 = a11*cos+a12*sin;
							t2 = a21*cos+a22*sin;
							a22 = a21*-sin+a22*cos;
							a32 = a31*-sin+a32*cos;
							a21 = t2;
						}

						if (tm.rotationX && Math.abs(tm.rotationX) + Math.abs(tm.rotation) > 359.9) { //when rotationY is set, it will often be parsed as 180 degrees different than it should be, and rotationX and rotation both being 180 (it looks the same), so we adjust for that here.
							tm.rotationX = tm.rotation = 0;
							tm.rotationY += 180;
						}

						tm.scaleX = ((Math.sqrt(a11 * a11 + a21 * a21) * rnd + 0.5) | 0) / rnd;
						tm.scaleY = ((Math.sqrt(a22 * a22 + a23 * a23) * rnd + 0.5) | 0) / rnd;
						tm.scaleZ = ((Math.sqrt(a32 * a32 + a33 * a33) * rnd + 0.5) | 0) / rnd;
						tm.skewX = 0;
						tm.perspective = a43 ? 1 / ((a43 < 0) ? -a43 : a43) : 0;
						tm.x = a14;
						tm.y = a24;
						tm.z = a34;
						if (tm.svg) {
							tm.x -= tm.xOrigin - (tm.xOrigin * a11 - tm.yOrigin * a12);
							tm.y -= tm.yOrigin - (tm.yOrigin * a21 - tm.xOrigin * a22);
						}

					} else if ((!_supports3D || parse || !m.length || tm.x !== m[4] || tm.y !== m[5] || (!tm.rotationX && !tm.rotationY)) && !(tm.x !== undefined && _getStyle(t, "display", cs) === "none")) { //sometimes a 6-element matrix is returned even when we performed 3D transforms, like if rotationX and rotationY are 180. In cases like this, we still need to honor the 3D transforms. If we just rely on the 2D info, it could affect how the data is interpreted, like scaleY might get set to -1 or rotation could get offset by 180 degrees. For example, do a TweenLite.to(element, 1, {css:{rotationX:180, rotationY:180}}) and then later, TweenLite.to(element, 1, {css:{rotationX:0}}) and without this conditional logic in place, it'd jump to a state of being unrotated when the 2nd tween starts. Then again, we need to honor the fact that the user COULD alter the transforms outside of CSSPlugin, like by manually applying new css, so we try to sense that by looking at x and y because if those changed, we know the changes were made outside CSSPlugin and we force a reinterpretation of the matrix values. Also, in Webkit browsers, if the element's "display" is "none", its calculated style value will always return empty, so if we've already recorded the values in the _gsTransform object, we'll just rely on those.
						var k = (m.length >= 6),
							a = k ? m[0] : 1,
							b = m[1] || 0,
							c = m[2] || 0,
							d = k ? m[3] : 1;
						tm.x = m[4] || 0;
						tm.y = m[5] || 0;
						scaleX = Math.sqrt(a * a + b * b);
						scaleY = Math.sqrt(d * d + c * c);
						rotation = (a || b) ? Math.atan2(b, a) * _RAD2DEG : tm.rotation || 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).
						skewX = (c || d) ? Math.atan2(c, d) * _RAD2DEG + rotation : tm.skewX || 0;
						if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
							if (invX) {
								scaleX *= -1;
								skewX += (rotation <= 0) ? 180 : -180;
								rotation += (rotation <= 0) ? 180 : -180;
							} else {
								scaleY *= -1;
								skewX += (skewX <= 0) ? 180 : -180;
							}
						}
						tm.scaleX = scaleX;
						tm.scaleY = scaleY;
						tm.rotation = rotation;
						tm.skewX = skewX;
						if (_supports3D) {
							tm.rotationX = tm.rotationY = tm.z = 0;
							tm.perspective = defaultTransformPerspective;
							tm.scaleZ = 1;
						}
						if (tm.svg) {
							tm.x -= tm.xOrigin - (tm.xOrigin * a + tm.yOrigin * c);
							tm.y -= tm.yOrigin - (tm.xOrigin * b + tm.yOrigin * d);
						}
					}
					tm.zOrigin = zOrigin;
					//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 0 in these cases. The conditional logic here is faster than calling Math.abs(). Also, browsers tend to render a SLIGHTLY rotated object in a fuzzy way, so we need to snap to exactly 0 when appropriate.
					for (i in tm) {
						if (tm[i] < min) if (tm[i] > -min) {
							tm[i] = 0;
						}
					}
				}
				//DEBUG: _log("parsed rotation of " + t.getAttribute("id")+": "+(tm.rotationX)+", "+(tm.rotationY)+", "+(tm.rotation)+", scale: "+tm.scaleX+", "+tm.scaleY+", "+tm.scaleZ+", position: "+tm.x+", "+tm.y+", "+tm.z+", perspective: "+tm.perspective+ ", origin: "+ tm.xOrigin+ ","+ tm.yOrigin);
				if (rec) {
					t._gsTransform = tm; //record to the object's _gsTransform which we use so that tweens can control individual properties independently (we need all the properties to accurately recompose the matrix in the setRatio() method)
					if (tm.svg) { //if we're supposed to apply transforms to the SVG element's "transform" attribute, make sure there aren't any CSS transforms applied or they'll override the attribute ones. Also clear the transform attribute if we're using CSS, just to be clean.
						if (_useSVGTransformAttr && t.style[_transformProp]) {
							TweenLite.delayedCall(0.001, function(){ //if we apply this right away (before anything has rendered), we risk there being no transforms for a brief moment and it also interferes with adjusting the transformOrigin in a tween with immediateRender:true (it'd try reading the matrix and it wouldn't have the appropriate data in place because we just removed it).
								_removeProp(t.style, _transformProp);
							});
						} else if (!_useSVGTransformAttr && t.getAttribute("transform")) {
							TweenLite.delayedCall(0.001, function(){
								t.removeAttribute("transform");
							});
						}
					}
				}
				return tm;
			},

			//for setting 2D transforms in IE6, IE7, and IE8 (must use a "filter" to emulate the behavior of modern day browser transforms)
			_setIETransformRatio = function(v) {
				var t = this.data, //refers to the element's _gsTransform object
					ang = -t.rotation * _DEG2RAD,
					skew = ang + t.skewX * _DEG2RAD,
					rnd = 100000,
					a = ((Math.cos(ang) * t.scaleX * rnd) | 0) / rnd,
					b = ((Math.sin(ang) * t.scaleX * rnd) | 0) / rnd,
					c = ((Math.sin(skew) * -t.scaleY * rnd) | 0) / rnd,
					d = ((Math.cos(skew) * t.scaleY * rnd) | 0) / rnd,
					style = this.t.style,
					cs = this.t.currentStyle,
					filters, val;
				if (!cs) {
					return;
				}
				val = b; //just for swapping the variables an inverting them (reused "val" to avoid creating another variable in memory). IE's filter matrix uses a non-standard matrix configuration (angle goes the opposite way, and b and c are reversed and inverted)
				b = -c;
				c = -val;
				filters = cs.filter;
				style.filter = ""; //remove filters so that we can accurately measure offsetWidth/offsetHeight
				var w = this.t.offsetWidth,
					h = this.t.offsetHeight,
					clip = (cs.position !== "absolute"),
					m = "progid:DXImageTransform.Microsoft.Matrix(M11=" + a + ", M12=" + b + ", M21=" + c + ", M22=" + d,
					ox = t.x + (w * t.xPercent / 100),
					oy = t.y + (h * t.yPercent / 100),
					dx, dy;

				//if transformOrigin is being used, adjust the offset x and y
				if (t.ox != null) {
					dx = ((t.oxp) ? w * t.ox * 0.01 : t.ox) - w / 2;
					dy = ((t.oyp) ? h * t.oy * 0.01 : t.oy) - h / 2;
					ox += dx - (dx * a + dy * b);
					oy += dy - (dx * c + dy * d);
				}

				if (!clip) {
					m += ", sizingMethod='auto expand')";
				} else {
					dx = (w / 2);
					dy = (h / 2);
					//translate to ensure that transformations occur around the correct origin (default is center).
					m += ", Dx=" + (dx - (dx * a + dy * b) + ox) + ", Dy=" + (dy - (dx * c + dy * d) + oy) + ")";
				}
				if (filters.indexOf("DXImageTransform.Microsoft.Matrix(") !== -1) {
					style.filter = filters.replace(_ieSetMatrixExp, m);
				} else {
					style.filter = m + " " + filters; //we must always put the transform/matrix FIRST (before alpha(opacity=xx)) to avoid an IE bug that slices part of the object when rotation is applied with alpha.
				}

				//at the end or beginning of the tween, if the matrix is normal (1, 0, 0, 1) and opacity is 100 (or doesn't exist), remove the filter to improve browser performance.
				if (v === 0 || v === 1) if (a === 1) if (b === 0) if (c === 0) if (d === 1) if (!clip || m.indexOf("Dx=0, Dy=0") !== -1) if (!_opacityExp.test(filters) || parseFloat(RegExp.$1) === 100) if (filters.indexOf("gradient(" && filters.indexOf("Alpha")) === -1) {
					style.removeAttribute("filter");
				}

				//we must set the margins AFTER applying the filter in order to avoid some bugs in IE8 that could (in rare scenarios) cause them to be ignored intermittently (vibration).
				if (!clip) {
					var mult = (_ieVers < 8) ? 1 : -1, //in Internet Explorer 7 and before, the box model is broken, causing the browser to treat the width/height of the actual rotated filtered image as the width/height of the box itself, but Microsoft corrected that in IE8. We must use a negative offset in IE8 on the right/bottom
						marg, prop, dif;
					dx = t.ieOffsetX || 0;
					dy = t.ieOffsetY || 0;
					t.ieOffsetX = Math.round((w - ((a < 0 ? -a : a) * w + (b < 0 ? -b : b) * h)) / 2 + ox);
					t.ieOffsetY = Math.round((h - ((d < 0 ? -d : d) * h + (c < 0 ? -c : c) * w)) / 2 + oy);
					for (i = 0; i < 4; i++) {
						prop = _margins[i];
						marg = cs[prop];
						//we need to get the current margin in case it is being tweened separately (we want to respect that tween's changes)
						val = (marg.indexOf("px") !== -1) ? parseFloat(marg) : _convertToPixels(this.t, prop, parseFloat(marg), marg.replace(_suffixExp, "")) || 0;
						if (val !== t[prop]) {
							dif = (i < 2) ? -t.ieOffsetX : -t.ieOffsetY; //if another tween is controlling a margin, we cannot only apply the difference in the ieOffsets, so we essentially zero-out the dx and dy here in that case. We record the margin(s) later so that we can keep comparing them, making this code very flexible.
						} else {
							dif = (i < 2) ? dx - t.ieOffsetX : dy - t.ieOffsetY;
						}
						style[prop] = (t[prop] = Math.round( val - dif * ((i === 0 || i === 2) ? 1 : mult) )) + "px";
					}
				}
			},

			/* translates a super small decimal to a string WITHOUT scientific notation
			_safeDecimal = function(n) {
				var s = (n < 0 ? -n : n) + "",
					a = s.split("e-");
				return (n < 0 ? "-0." : "0.") + new Array(parseInt(a[1], 10) || 0).join("0") + a[0].split(".").join("");
			},
			*/

			_setTransformRatio = _internals.set3DTransformRatio = _internals.setTransformRatio = function(v) {
				var t = this.data, //refers to the element's _gsTransform object
					style = this.t.style,
					angle = t.rotation,
					rotationX = t.rotationX,
					rotationY = t.rotationY,
					sx = t.scaleX,
					sy = t.scaleY,
					sz = t.scaleZ,
					x = t.x,
					y = t.y,
					z = t.z,
					isSVG = t.svg,
					perspective = t.perspective,
					force3D = t.force3D,
					a11, a12, a13, a21, a22, a23, a31, a32, a33, a41, a42, a43,
					zOrigin, min, cos, sin, t1, t2, transform, comma, zero, skew, rnd;
				//check to see if we should render as 2D (and SVGs must use 2D when _useSVGTransformAttr is true)
				if (((((v === 1 || v === 0) && force3D === "auto" && (this.tween._totalTime === this.tween._totalDuration || !this.tween._totalTime)) || !force3D) && !z && !perspective && !rotationY && !rotationX) || (_useSVGTransformAttr && isSVG) || !_supports3D) { //on the final render (which could be 0 for a from tween), if there are no 3D aspects, render in 2D to free up memory and improve performance especially on mobile devices. Check the tween's totalTime/totalDuration too in order to make sure it doesn't happen between repeats if it's a repeating tween.

					//2D
					if (angle || t.skewX || isSVG) {
						angle *= _DEG2RAD;
						skew = t.skewX * _DEG2RAD;
						rnd = 100000;
						a11 = Math.cos(angle) * sx;
						a21 = Math.sin(angle) * sx;
						a12 = Math.sin(angle - skew) * -sy;
						a22 = Math.cos(angle - skew) * sy;
						if (skew && t.skewType === "simple") { //by default, we compensate skewing on the other axis to make it look more natural, but you can set the skewType to "simple" to use the uncompensated skewing that CSS does
							t1 = Math.tan(skew);
							t1 = Math.sqrt(1 + t1 * t1);
							a12 *= t1;
							a22 *= t1;
							if (t.skewY) {
								a11 *= t1;
								a21 *= t1;
							}
						}
						if (isSVG) {
							x += t.xOrigin - (t.xOrigin * a11 + t.yOrigin * a12) + t.xOffset;
							y += t.yOrigin - (t.xOrigin * a21 + t.yOrigin * a22) + t.yOffset;
							if (_useSVGTransformAttr && (t.xPercent || t.yPercent)) { //The SVG spec doesn't support percentage-based translation in the "transform" attribute, so we merge it into the matrix to simulate it.
								min = this.t.getBBox();
								x += t.xPercent * 0.01 * min.width;
								y += t.yPercent * 0.01 * min.height;
							}
							min = 0.000001;
							if (x < min) if (x > -min) {
								x = 0;
							}
							if (y < min) if (y > -min) {
								y = 0;
							}
						}
						transform = (((a11 * rnd) | 0) / rnd) + "," + (((a21 * rnd) | 0) / rnd) + "," + (((a12 * rnd) | 0) / rnd) + "," + (((a22 * rnd) | 0) / rnd) + "," + x + "," + y + ")";
						if (isSVG && _useSVGTransformAttr) {
							this.t.setAttribute("transform", "matrix(" + transform);
						} else {
							//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 5 decimal places.
							style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix(" : "matrix(") + transform;
						}
					} else {
						style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix(" : "matrix(") + sx + ",0,0," + sy + "," + x + "," + y + ")";
					}
					return;

				}
				if (_isFirefox) { //Firefox has a bug (at least in v25) that causes it to render the transparent part of 32-bit PNG images as black when displayed inside an iframe and the 3D scale is very small and doesn't change sufficiently enough between renders (like if you use a Power4.easeInOut to scale from 0 to 1 where the beginning values only change a tiny amount to begin the tween before accelerating). In this case, we force the scale to be 0.00002 instead which is visually the same but works around the Firefox issue.
					min = 0.0001;
					if (sx < min && sx > -min) {
						sx = sz = 0.00002;
					}
					if (sy < min && sy > -min) {
						sy = sz = 0.00002;
					}
					if (perspective && !t.z && !t.rotationX && !t.rotationY) { //Firefox has a bug that causes elements to have an odd super-thin, broken/dotted black border on elements that have a perspective set but aren't utilizing 3D space (no rotationX, rotationY, or z).
						perspective = 0;
					}
				}
				if (angle || t.skewX) {
					angle *= _DEG2RAD;
					cos = a11 = Math.cos(angle);
					sin = a21 = Math.sin(angle);
					if (t.skewX) {
						angle -= t.skewX * _DEG2RAD;
						cos = Math.cos(angle);
						sin = Math.sin(angle);
						if (t.skewType === "simple") { //by default, we compensate skewing on the other axis to make it look more natural, but you can set the skewType to "simple" to use the uncompensated skewing that CSS does
							t1 = Math.tan(t.skewX * _DEG2RAD);
							t1 = Math.sqrt(1 + t1 * t1);
							cos *= t1;
							sin *= t1;
							if (t.skewY) {
								a11 *= t1;
								a21 *= t1;
							}
						}
					}
					a12 = -sin;
					a22 = cos;

				} else if (!rotationY && !rotationX && sz === 1 && !perspective && !isSVG) { //if we're only translating and/or 2D scaling, this is faster...
					style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) translate3d(" : "translate3d(") + x + "px," + y + "px," + z +"px)" + ((sx !== 1 || sy !== 1) ? " scale(" + sx + "," + sy + ")" : "");
					return;
				} else {
					a11 = a22 = 1;
					a12 = a21 = 0;
				}
				// KEY  INDEX   AFFECTS
				// a11  0       rotation, rotationY, scaleX
				// a21  1       rotation, rotationY, scaleX
				// a31  2       rotationY, scaleX
				// a41  3       rotationY, scaleX
				// a12  4       rotation, skewX, rotationX, scaleY
				// a22  5       rotation, skewX, rotationX, scaleY
				// a32  6       rotationX, scaleY
				// a42  7       rotationX, scaleY
				// a13  8       rotationY, rotationX, scaleZ
				// a23  9       rotationY, rotationX, scaleZ
				// a33  10      rotationY, rotationX, scaleZ
				// a43  11      rotationY, rotationX, perspective, scaleZ
				// a14  12      x, zOrigin, svgOrigin
				// a24  13      y, zOrigin, svgOrigin
				// a34  14      z, zOrigin
				// a44  15
				// rotation: Math.atan2(a21, a11)
				// rotationY: Math.atan2(a13, a33) (or Math.atan2(a13, a11))
				// rotationX: Math.atan2(a32, a33)
				a33 = 1;
				a13 = a23 = a31 = a32 = a41 = a42 = 0;
				a43 = (perspective) ? -1 / perspective : 0;
				zOrigin = t.zOrigin;
				min = 0.000001; //threshold below which browsers use scientific notation which won't work.
				comma = ",";
				zero = "0";
				angle = rotationY * _DEG2RAD;
				if (angle) {
					cos = Math.cos(angle);
					sin = Math.sin(angle);
					a31 = -sin;
					a41 = a43*-sin;
					a13 = a11*sin;
					a23 = a21*sin;
					a33 = cos;
					a43 *= cos;
					a11 *= cos;
					a21 *= cos;
				}
				angle = rotationX * _DEG2RAD;
				if (angle) {
					cos = Math.cos(angle);
					sin = Math.sin(angle);
					t1 = a12*cos+a13*sin;
					t2 = a22*cos+a23*sin;
					a32 = a33*sin;
					a42 = a43*sin;
					a13 = a12*-sin+a13*cos;
					a23 = a22*-sin+a23*cos;
					a33 = a33*cos;
					a43 = a43*cos;
					a12 = t1;
					a22 = t2;
				}
				if (sz !== 1) {
					a13*=sz;
					a23*=sz;
					a33*=sz;
					a43*=sz;
				}
				if (sy !== 1) {
					a12*=sy;
					a22*=sy;
					a32*=sy;
					a42*=sy;
				}
				if (sx !== 1) {
					a11*=sx;
					a21*=sx;
					a31*=sx;
					a41*=sx;
				}

				if (zOrigin || isSVG) {
					if (zOrigin) {
						x += a13*-zOrigin;
						y += a23*-zOrigin;
						z += a33*-zOrigin+zOrigin;
					}
					if (isSVG) { //due to bugs in some browsers, we need to manage the transform-origin of SVG manually
						x += t.xOrigin - (t.xOrigin * a11 + t.yOrigin * a12) + t.xOffset;
						y += t.yOrigin - (t.xOrigin * a21 + t.yOrigin * a22) + t.yOffset;
					}
					if (x < min && x > -min) {
						x = zero;
					}
					if (y < min && y > -min) {
						y = zero;
					}
					if (z < min && z > -min) {
						z = 0; //don't use string because we calculate perspective later and need the number.
					}
				}

				//optimized way of concatenating all the values into a string. If we do it all in one shot, it's slower because of the way browsers have to create temp strings and the way it affects memory. If we do it piece-by-piece with +=, it's a bit slower too. We found that doing it in these sized chunks works best overall:
				transform = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix3d(" : "matrix3d(");
				transform += ((a11 < min && a11 > -min) ? zero : a11) + comma + ((a21 < min && a21 > -min) ? zero : a21) + comma + ((a31 < min && a31 > -min) ? zero : a31);
				transform += comma + ((a41 < min && a41 > -min) ? zero : a41) + comma + ((a12 < min && a12 > -min) ? zero : a12) + comma + ((a22 < min && a22 > -min) ? zero : a22);
				if (rotationX || rotationY) { //performance optimization (often there's no rotationX or rotationY, so we can skip these calculations)
					transform += comma + ((a32 < min && a32 > -min) ? zero : a32) + comma + ((a42 < min && a42 > -min) ? zero : a42) + comma + ((a13 < min && a13 > -min) ? zero : a13);
					transform += comma + ((a23 < min && a23 > -min) ? zero : a23) + comma + ((a33 < min && a33 > -min) ? zero : a33) + comma + ((a43 < min && a43 > -min) ? zero : a43) + comma;
				} else {
					transform += ",0,0,0,0,1,0,";
				}
				transform += x + comma + y + comma + z + comma + (perspective ? (1 + (-z / perspective)) : 1) + ")";

				style[_transformProp] = transform;
			};

		p = Transform.prototype;
		p.x = p.y = p.z = p.skewX = p.skewY = p.rotation = p.rotationX = p.rotationY = p.zOrigin = p.xPercent = p.yPercent = p.xOffset = p.yOffset = 0;
		p.scaleX = p.scaleY = p.scaleZ = 1;

		_registerComplexSpecialProp("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {parser:function(t, e, p, cssp, pt, plugin, vars) {
			if (cssp._lastParsedTransform === vars) { return pt; } //only need to parse the transform once, and only if the browser supports it.
			cssp._lastParsedTransform = vars;
			var originalGSTransform = t._gsTransform,
				m1 = cssp._transform = _getTransform(t, _cs, true, vars.parseTransform),
				style = t.style,
				min = 0.000001,
				i = _transformProps.length,
				v = vars,
				endRotations = {},
				transformOriginString = "transformOrigin",
				m2, skewY, copy, orig, has3D, hasChange, dr, x, y;
			if (typeof(v.transform) === "string" && _transformProp) { //for values like transform:"rotate(60deg) scale(0.5, 0.8)"
				copy = _tempDiv.style; //don't use the original target because it might be SVG in which case some browsers don't report computed style correctly.
				copy[_transformProp] = v.transform;
				copy.display = "block"; //if display is "none", the browser often refuses to report the transform properties correctly.
				copy.position = "absolute";
				_doc.body.appendChild(_tempDiv);
				m2 = _getTransform(_tempDiv, null, false);
				_doc.body.removeChild(_tempDiv);
				if (v.xPercent != null) {
					m2.xPercent = _parseVal(v.xPercent, m1.xPercent);
				}
				if (v.yPercent != null) {
					m2.yPercent = _parseVal(v.yPercent, m1.yPercent);
				}
			} else if (typeof(v) === "object") { //for values like scaleX, scaleY, rotation, x, y, skewX, and skewY or transform:{...} (object)
				m2 = {scaleX:_parseVal((v.scaleX != null) ? v.scaleX : v.scale, m1.scaleX),
					scaleY:_parseVal((v.scaleY != null) ? v.scaleY : v.scale, m1.scaleY),
					scaleZ:_parseVal(v.scaleZ, m1.scaleZ),
					x:_parseVal(v.x, m1.x),
					y:_parseVal(v.y, m1.y),
					z:_parseVal(v.z, m1.z),
					xPercent:_parseVal(v.xPercent, m1.xPercent),
					yPercent:_parseVal(v.yPercent, m1.yPercent),
					perspective:_parseVal(v.transformPerspective, m1.perspective)};
				dr = v.directionalRotation;
				if (dr != null) {
					if (typeof(dr) === "object") {
						for (copy in dr) {
							v[copy] = dr[copy];
						}
					} else {
						v.rotation = dr;
					}
				}
				if (typeof(v.x) === "string" && v.x.indexOf("%") !== -1) {
					m2.x = 0;
					m2.xPercent = _parseVal(v.x, m1.xPercent);
				}
				if (typeof(v.y) === "string" && v.y.indexOf("%") !== -1) {
					m2.y = 0;
					m2.yPercent = _parseVal(v.y, m1.yPercent);
				}

				m2.rotation = _parseAngle(("rotation" in v) ? v.rotation : ("shortRotation" in v) ? v.shortRotation + "_short" : ("rotationZ" in v) ? v.rotationZ : m1.rotation, m1.rotation, "rotation", endRotations);
				if (_supports3D) {
					m2.rotationX = _parseAngle(("rotationX" in v) ? v.rotationX : ("shortRotationX" in v) ? v.shortRotationX + "_short" : m1.rotationX || 0, m1.rotationX, "rotationX", endRotations);
					m2.rotationY = _parseAngle(("rotationY" in v) ? v.rotationY : ("shortRotationY" in v) ? v.shortRotationY + "_short" : m1.rotationY || 0, m1.rotationY, "rotationY", endRotations);
				}
				m2.skewX = (v.skewX == null) ? m1.skewX : _parseAngle(v.skewX, m1.skewX);

				//note: for performance reasons, we combine all skewing into the skewX and rotation values, ignoring skewY but we must still record it so that we can discern how much of the overall skew is attributed to skewX vs. skewY. Otherwise, if the skewY would always act relative (tween skewY to 10deg, for example, multiple times and if we always combine things into skewX, we can't remember that skewY was 10 from last time). Remember, a skewY of 10 degrees looks the same as a rotation of 10 degrees plus a skewX of -10 degrees.
				m2.skewY = (v.skewY == null) ? m1.skewY : _parseAngle(v.skewY, m1.skewY);
				if ((skewY = m2.skewY - m1.skewY)) {
					m2.skewX += skewY;
					m2.rotation += skewY;
				}
			}
			if (_supports3D && v.force3D != null) {
				m1.force3D = v.force3D;
				hasChange = true;
			}

			m1.skewType = v.skewType || m1.skewType || CSSPlugin.defaultSkewType;

			has3D = (m1.force3D || m1.z || m1.rotationX || m1.rotationY || m2.z || m2.rotationX || m2.rotationY || m2.perspective);
			if (!has3D && v.scale != null) {
				m2.scaleZ = 1; //no need to tween scaleZ.
			}

			while (--i > -1) {
				p = _transformProps[i];
				orig = m2[p] - m1[p];
				if (orig > min || orig < -min || v[p] != null || _forcePT[p] != null) {
					hasChange = true;
					pt = new CSSPropTween(m1, p, m1[p], orig, pt);
					if (p in endRotations) {
						pt.e = endRotations[p]; //directional rotations typically have compensated values during the tween, but we need to make sure they end at exactly what the user requested
					}
					pt.xs0 = 0; //ensures the value stays numeric in setRatio()
					pt.plugin = plugin;
					cssp._overwriteProps.push(pt.n);
				}
			}

			orig = v.transformOrigin;
			if (m1.svg && (orig || v.svgOrigin)) {
				x = m1.xOffset; //when we change the origin, in order to prevent things from jumping we adjust the x/y so we must record those here so that we can create PropTweens for them and flip them at the same time as the origin
				y = m1.yOffset;
				_parseSVGOrigin(t, _parsePosition(orig), m2, v.svgOrigin, v.smoothOrigin);
				pt = _addNonTweeningNumericPT(m1, "xOrigin", (originalGSTransform ? m1 : m2).xOrigin, m2.xOrigin, pt, transformOriginString); //note: if there wasn't a transformOrigin defined yet, just start with the destination one; it's wasteful otherwise, and it causes problems with fromTo() tweens. For example, TweenLite.to("#wheel", 3, {rotation:180, transformOrigin:"50% 50%", delay:1}); TweenLite.fromTo("#wheel", 3, {scale:0.5, transformOrigin:"50% 50%"}, {scale:1, delay:2}); would cause a jump when the from values revert at the beginning of the 2nd tween.
				pt = _addNonTweeningNumericPT(m1, "yOrigin", (originalGSTransform ? m1 : m2).yOrigin, m2.yOrigin, pt, transformOriginString);
				if (x !== m1.xOffset || y !== m1.yOffset) {
					pt = _addNonTweeningNumericPT(m1, "xOffset", (originalGSTransform ? x : m1.xOffset), m1.xOffset, pt, transformOriginString);
					pt = _addNonTweeningNumericPT(m1, "yOffset", (originalGSTransform ? y : m1.yOffset), m1.yOffset, pt, transformOriginString);
				}
				orig = _useSVGTransformAttr ? null : "0px 0px"; //certain browsers (like firefox) completely botch transform-origin, so we must remove it to prevent it from contaminating transforms. We manage it ourselves with xOrigin and yOrigin
			}
			if (orig || (_supports3D && has3D && m1.zOrigin)) { //if anything 3D is happening and there's a transformOrigin with a z component that's non-zero, we must ensure that the transformOrigin's z-component is set to 0 so that we can manually do those calculations to get around Safari bugs. Even if the user didn't specifically define a "transformOrigin" in this particular tween (maybe they did it via css directly).
				if (_transformProp) {
					hasChange = true;
					p = _transformOriginProp;
					orig = (orig || _getStyle(t, p, _cs, false, "50% 50%")) + ""; //cast as string to avoid errors
					pt = new CSSPropTween(style, p, 0, 0, pt, -1, transformOriginString);
					pt.b = style[p];
					pt.plugin = plugin;
					if (_supports3D) {
						copy = m1.zOrigin;
						orig = orig.split(" ");
						m1.zOrigin = ((orig.length > 2 && !(copy !== 0 && orig[2] === "0px")) ? parseFloat(orig[2]) : copy) || 0; //Safari doesn't handle the z part of transformOrigin correctly, so we'll manually handle it in the _set3DTransformRatio() method.
						pt.xs0 = pt.e = orig[0] + " " + (orig[1] || "50%") + " 0px"; //we must define a z value of 0px specifically otherwise iOS 5 Safari will stick with the old one (if one was defined)!
						pt = new CSSPropTween(m1, "zOrigin", 0, 0, pt, -1, pt.n); //we must create a CSSPropTween for the _gsTransform.zOrigin so that it gets reset properly at the beginning if the tween runs backward (as opposed to just setting m1.zOrigin here)
						pt.b = copy;
						pt.xs0 = pt.e = m1.zOrigin;
					} else {
						pt.xs0 = pt.e = orig;
					}

					//for older versions of IE (6-8), we need to manually calculate things inside the setRatio() function. We record origin x and y (ox and oy) and whether or not the values are percentages (oxp and oyp).
				} else {
					_parsePosition(orig + "", m1);
				}
			}
			if (hasChange) {
				cssp._transformType = (!(m1.svg && _useSVGTransformAttr) && (has3D || this._transformType === 3)) ? 3 : 2; //quicker than calling cssp._enableTransforms();
			}
			return pt;
		}, prefix:true});

		_registerComplexSpecialProp("boxShadow", {defaultValue:"0px 0px 0px 0px #999", prefix:true, color:true, multi:true, keyword:"inset"});

		_registerComplexSpecialProp("borderRadius", {defaultValue:"0px", parser:function(t, e, p, cssp, pt, plugin) {
			e = this.format(e);
			var props = ["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],
				style = t.style,
				ea1, i, es2, bs2, bs, es, bn, en, w, h, esfx, bsfx, rel, hn, vn, em;
			w = parseFloat(t.offsetWidth);
			h = parseFloat(t.offsetHeight);
			ea1 = e.split(" ");
			for (i = 0; i < props.length; i++) { //if we're dealing with percentages, we must convert things separately for the horizontal and vertical axis!
				if (this.p.indexOf("border")) { //older browsers used a prefix
					props[i] = _checkPropPrefix(props[i]);
				}
				bs = bs2 = _getStyle(t, props[i], _cs, false, "0px");
				if (bs.indexOf(" ") !== -1) {
					bs2 = bs.split(" ");
					bs = bs2[0];
					bs2 = bs2[1];
				}
				es = es2 = ea1[i];
				bn = parseFloat(bs);
				bsfx = bs.substr((bn + "").length);
				rel = (es.charAt(1) === "=");
				if (rel) {
					en = parseInt(es.charAt(0)+"1", 10);
					es = es.substr(2);
					en *= parseFloat(es);
					esfx = es.substr((en + "").length - (en < 0 ? 1 : 0)) || "";
				} else {
					en = parseFloat(es);
					esfx = es.substr((en + "").length);
				}
				if (esfx === "") {
					esfx = _suffixMap[p] || bsfx;
				}
				if (esfx !== bsfx) {
					hn = _convertToPixels(t, "borderLeft", bn, bsfx); //horizontal number (we use a bogus "borderLeft" property just because the _convertToPixels() method searches for the keywords "Left", "Right", "Top", and "Bottom" to determine of it's a horizontal or vertical property, and we need "border" in the name so that it knows it should measure relative to the element itself, not its parent.
					vn = _convertToPixels(t, "borderTop", bn, bsfx); //vertical number
					if (esfx === "%") {
						bs = (hn / w * 100) + "%";
						bs2 = (vn / h * 100) + "%";
					} else if (esfx === "em") {
						em = _convertToPixels(t, "borderLeft", 1, "em");
						bs = (hn / em) + "em";
						bs2 = (vn / em) + "em";
					} else {
						bs = hn + "px";
						bs2 = vn + "px";
					}
					if (rel) {
						es = (parseFloat(bs) + en) + esfx;
						es2 = (parseFloat(bs2) + en) + esfx;
					}
				}
				pt = _parseComplex(style, props[i], bs + " " + bs2, es + " " + es2, false, "0px", pt);
			}
			return pt;
		}, prefix:true, formatter:_getFormatter("0px 0px 0px 0px", false, true)});
		_registerComplexSpecialProp("backgroundPosition", {defaultValue:"0 0", parser:function(t, e, p, cssp, pt, plugin) {
			var bp = "background-position",
				cs = (_cs || _getComputedStyle(t, null)),
				bs = this.format( ((cs) ? _ieVers ? cs.getPropertyValue(bp + "-x") + " " + cs.getPropertyValue(bp + "-y") : cs.getPropertyValue(bp) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"), //Internet Explorer doesn't report background-position correctly - we must query background-position-x and background-position-y and combine them (even in IE10). Before IE9, we must do the same with the currentStyle object and use camelCase
				es = this.format(e),
				ba, ea, i, pct, overlap, src;
			if ((bs.indexOf("%") !== -1) !== (es.indexOf("%") !== -1)) {
				src = _getStyle(t, "backgroundImage").replace(_urlExp, "");
				if (src && src !== "none") {
					ba = bs.split(" ");
					ea = es.split(" ");
					_tempImg.setAttribute("src", src); //set the temp IMG's src to the background-image so that we can measure its width/height
					i = 2;
					while (--i > -1) {
						bs = ba[i];
						pct = (bs.indexOf("%") !== -1);
						if (pct !== (ea[i].indexOf("%") !== -1)) {
							overlap = (i === 0) ? t.offsetWidth - _tempImg.width : t.offsetHeight - _tempImg.height;
							ba[i] = pct ? (parseFloat(bs) / 100 * overlap) + "px" : (parseFloat(bs) / overlap * 100) + "%";
						}
					}
					bs = ba.join(" ");
				}
			}
			return this.parseComplex(t.style, bs, es, pt, plugin);
		}, formatter:_parsePosition});
		_registerComplexSpecialProp("backgroundSize", {defaultValue:"0 0", formatter:_parsePosition});
		_registerComplexSpecialProp("perspective", {defaultValue:"0px", prefix:true});
		_registerComplexSpecialProp("perspectiveOrigin", {defaultValue:"50% 50%", prefix:true});
		_registerComplexSpecialProp("transformStyle", {prefix:true});
		_registerComplexSpecialProp("backfaceVisibility", {prefix:true});
		_registerComplexSpecialProp("userSelect", {prefix:true});
		_registerComplexSpecialProp("margin", {parser:_getEdgeParser("marginTop,marginRight,marginBottom,marginLeft")});
		_registerComplexSpecialProp("padding", {parser:_getEdgeParser("paddingTop,paddingRight,paddingBottom,paddingLeft")});
		_registerComplexSpecialProp("clip", {defaultValue:"rect(0px,0px,0px,0px)", parser:function(t, e, p, cssp, pt, plugin){
			var b, cs, delim;
			if (_ieVers < 9) { //IE8 and earlier don't report a "clip" value in the currentStyle - instead, the values are split apart into clipTop, clipRight, clipBottom, and clipLeft. Also, in IE7 and earlier, the values inside rect() are space-delimited, not comma-delimited.
				cs = t.currentStyle;
				delim = _ieVers < 8 ? " " : ",";
				b = "rect(" + cs.clipTop + delim + cs.clipRight + delim + cs.clipBottom + delim + cs.clipLeft + ")";
				e = this.format(e).split(",").join(delim);
			} else {
				b = this.format(_getStyle(t, this.p, _cs, false, this.dflt));
				e = this.format(e);
			}
			return this.parseComplex(t.style, b, e, pt, plugin);
		}});
		_registerComplexSpecialProp("textShadow", {defaultValue:"0px 0px 0px #999", color:true, multi:true});
		_registerComplexSpecialProp("autoRound,strictUnits", {parser:function(t, e, p, cssp, pt) {return pt;}}); //just so that we can ignore these properties (not tween them)
		_registerComplexSpecialProp("border", {defaultValue:"0px solid #000", parser:function(t, e, p, cssp, pt, plugin) {
				return this.parseComplex(t.style, this.format(_getStyle(t, "borderTopWidth", _cs, false, "0px") + " " + _getStyle(t, "borderTopStyle", _cs, false, "solid") + " " + _getStyle(t, "borderTopColor", _cs, false, "#000")), this.format(e), pt, plugin);
			}, color:true, formatter:function(v) {
				var a = v.split(" ");
				return a[0] + " " + (a[1] || "solid") + " " + (v.match(_colorExp) || ["#000"])[0];
			}});
		_registerComplexSpecialProp("borderWidth", {parser:_getEdgeParser("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}); //Firefox doesn't pick up on borderWidth set in style sheets (only inline).
		_registerComplexSpecialProp("float,cssFloat,styleFloat", {parser:function(t, e, p, cssp, pt, plugin) {
			var s = t.style,
				prop = ("cssFloat" in s) ? "cssFloat" : "styleFloat";
			return new CSSPropTween(s, prop, 0, 0, pt, -1, p, false, 0, s[prop], e);
		}});

		//opacity-related
		var _setIEOpacityRatio = function(v) {
				var t = this.t, //refers to the element's style property
					filters = t.filter || _getStyle(this.data, "filter") || "",
					val = (this.s + this.c * v) | 0,
					skip;
				if (val === 100) { //for older versions of IE that need to use a filter to apply opacity, we should remove the filter if opacity hits 1 in order to improve performance, but make sure there isn't a transform (matrix) or gradient in the filters.
					if (filters.indexOf("atrix(") === -1 && filters.indexOf("radient(") === -1 && filters.indexOf("oader(") === -1) {
						t.removeAttribute("filter");
						skip = (!_getStyle(this.data, "filter")); //if a class is applied that has an alpha filter, it will take effect (we don't want that), so re-apply our alpha filter in that case. We must first remove it and then check.
					} else {
						t.filter = filters.replace(_alphaFilterExp, "");
						skip = true;
					}
				}
				if (!skip) {
					if (this.xn1) {
						t.filter = filters = filters || ("alpha(opacity=" + val + ")"); //works around bug in IE7/8 that prevents changes to "visibility" from being applied properly if the filter is changed to a different alpha on the same frame.
					}
					if (filters.indexOf("pacity") === -1) { //only used if browser doesn't support the standard opacity style property (IE 7 and 8). We omit the "O" to avoid case-sensitivity issues
						if (val !== 0 || !this.xn1) { //bugs in IE7/8 won't render the filter properly if opacity is ADDED on the same frame/render as "visibility" changes (this.xn1 is 1 if this tween is an "autoAlpha" tween)
							t.filter = filters + " alpha(opacity=" + val + ")"; //we round the value because otherwise, bugs in IE7/8 can prevent "visibility" changes from being applied properly.
						}
					} else {
						t.filter = filters.replace(_opacityExp, "opacity=" + val);
					}
				}
			};
		_registerComplexSpecialProp("opacity,alpha,autoAlpha", {defaultValue:"1", parser:function(t, e, p, cssp, pt, plugin) {
			var b = parseFloat(_getStyle(t, "opacity", _cs, false, "1")),
				style = t.style,
				isAutoAlpha = (p === "autoAlpha");
			if (typeof(e) === "string" && e.charAt(1) === "=") {
				e = ((e.charAt(0) === "-") ? -1 : 1) * parseFloat(e.substr(2)) + b;
			}
			if (isAutoAlpha && b === 1 && _getStyle(t, "visibility", _cs) === "hidden" && e !== 0) { //if visibility is initially set to "hidden", we should interpret that as intent to make opacity 0 (a convenience)
				b = 0;
			}
			if (_supportsOpacity) {
				pt = new CSSPropTween(style, "opacity", b, e - b, pt);
			} else {
				pt = new CSSPropTween(style, "opacity", b * 100, (e - b) * 100, pt);
				pt.xn1 = isAutoAlpha ? 1 : 0; //we need to record whether or not this is an autoAlpha so that in the setRatio(), we know to duplicate the setting of the alpha in order to work around a bug in IE7 and IE8 that prevents changes to "visibility" from taking effect if the filter is changed to a different alpha(opacity) at the same time. Setting it to the SAME value first, then the new value works around the IE7/8 bug.
				style.zoom = 1; //helps correct an IE issue.
				pt.type = 2;
				pt.b = "alpha(opacity=" + pt.s + ")";
				pt.e = "alpha(opacity=" + (pt.s + pt.c) + ")";
				pt.data = t;
				pt.plugin = plugin;
				pt.setRatio = _setIEOpacityRatio;
			}
			if (isAutoAlpha) { //we have to create the "visibility" PropTween after the opacity one in the linked list so that they run in the order that works properly in IE8 and earlier
				pt = new CSSPropTween(style, "visibility", 0, 0, pt, -1, null, false, 0, ((b !== 0) ? "inherit" : "hidden"), ((e === 0) ? "hidden" : "inherit"));
				pt.xs0 = "inherit";
				cssp._overwriteProps.push(pt.n);
				cssp._overwriteProps.push(p);
			}
			return pt;
		}});


		var _removeProp = function(s, p) {
				if (p) {
					if (s.removeProperty) {
						if (p.substr(0,2) === "ms" || p.substr(0,6) === "webkit") { //Microsoft and some Webkit browsers don't conform to the standard of capitalizing the first prefix character, so we adjust so that when we prefix the caps with a dash, it's correct (otherwise it'd be "ms-transform" instead of "-ms-transform" for IE9, for example)
							p = "-" + p;
						}
						s.removeProperty(p.replace(_capsExp, "-$1").toLowerCase());
					} else { //note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
						s.removeAttribute(p);
					}
				}
			},
			_setClassNameRatio = function(v) {
				this.t._gsClassPT = this;
				if (v === 1 || v === 0) {
					this.t.setAttribute("class", (v === 0) ? this.b : this.e);
					var mpt = this.data, //first MiniPropTween
						s = this.t.style;
					while (mpt) {
						if (!mpt.v) {
							_removeProp(s, mpt.p);
						} else {
							s[mpt.p] = mpt.v;
						}
						mpt = mpt._next;
					}
					if (v === 1 && this.t._gsClassPT === this) {
						this.t._gsClassPT = null;
					}
				} else if (this.t.getAttribute("class") !== this.e) {
					this.t.setAttribute("class", this.e);
				}
			};
		_registerComplexSpecialProp("className", {parser:function(t, e, p, cssp, pt, plugin, vars) {
			var b = t.getAttribute("class") || "", //don't use t.className because it doesn't work consistently on SVG elements; getAttribute("class") and setAttribute("class", value") is more reliable.
				cssText = t.style.cssText,
				difData, bs, cnpt, cnptLookup, mpt;
			pt = cssp._classNamePT = new CSSPropTween(t, p, 0, 0, pt, 2);
			pt.setRatio = _setClassNameRatio;
			pt.pr = -11;
			_hasPriority = true;
			pt.b = b;
			bs = _getAllStyles(t, _cs);
			//if there's a className tween already operating on the target, force it to its end so that the necessary inline styles are removed and the class name is applied before we determine the end state (we don't want inline styles interfering that were there just for class-specific values)
			cnpt = t._gsClassPT;
			if (cnpt) {
				cnptLookup = {};
				mpt = cnpt.data; //first MiniPropTween which stores the inline styles - we need to force these so that the inline styles don't contaminate things. Otherwise, there's a small chance that a tween could start and the inline values match the destination values and they never get cleaned.
				while (mpt) {
					cnptLookup[mpt.p] = 1;
					mpt = mpt._next;
				}
				cnpt.setRatio(1);
			}
			t._gsClassPT = pt;
			pt.e = (e.charAt(1) !== "=") ? e : b.replace(new RegExp("\\s*\\b" + e.substr(2) + "\\b"), "") + ((e.charAt(0) === "+") ? " " + e.substr(2) : "");
			t.setAttribute("class", pt.e);
			difData = _cssDif(t, bs, _getAllStyles(t), vars, cnptLookup);
			t.setAttribute("class", b);
			pt.data = difData.firstMPT;
			t.style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
			pt = pt.xfirst = cssp.parse(t, difData.difs, pt, plugin); //we record the CSSPropTween as the xfirst so that we can handle overwriting propertly (if "className" gets overwritten, we must kill all the properties associated with the className part of the tween, so we can loop through from xfirst to the pt itself)
			return pt;
		}});


		var _setClearPropsRatio = function(v) {
			if (v === 1 || v === 0) if (this.data._totalTime === this.data._totalDuration && this.data.data !== "isFromStart") { //this.data refers to the tween. Only clear at the END of the tween (remember, from() tweens make the ratio go from 1 to 0, so we can't just check that and if the tween is the zero-duration one that's created internally to render the starting values in a from() tween, ignore that because otherwise, for example, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in).
				var s = this.t.style,
					transformParse = _specialProps.transform.parse,
					a, p, i, clearTransform, transform;
				if (this.e === "all") {
					s.cssText = "";
					clearTransform = true;
				} else {
					a = this.e.split(" ").join("").split(",");
					i = a.length;
					while (--i > -1) {
						p = a[i];
						if (_specialProps[p]) {
							if (_specialProps[p].parse === transformParse) {
								clearTransform = true;
							} else {
								p = (p === "transformOrigin") ? _transformOriginProp : _specialProps[p].p; //ensures that special properties use the proper browser-specific property name, like "scaleX" might be "-webkit-transform" or "boxShadow" might be "-moz-box-shadow"
							}
						}
						_removeProp(s, p);
					}
				}
				if (clearTransform) {
					_removeProp(s, _transformProp);
					transform = this.t._gsTransform;
					if (transform) {
						if (transform.svg) {
							this.t.removeAttribute("data-svg-origin");
						}
						delete this.t._gsTransform;
					}
				}

			}
		};
		_registerComplexSpecialProp("clearProps", {parser:function(t, e, p, cssp, pt) {
			pt = new CSSPropTween(t, p, 0, 0, pt, 2);
			pt.setRatio = _setClearPropsRatio;
			pt.e = e;
			pt.pr = -10;
			pt.data = cssp._tween;
			_hasPriority = true;
			return pt;
		}});

		p = "bezier,throwProps,physicsProps,physics2D".split(",");
		i = p.length;
		while (i--) {
			_registerPluginProp(p[i]);
		}








		p = CSSPlugin.prototype;
		p._firstPT = p._lastParsedTransform = p._transform = null;

		//gets called when the tween renders for the first time. This kicks everything off, recording start/end values, etc.
		p._onInitTween = function(target, vars, tween) {
			if (!target.nodeType) { //css is only for dom elements
				return false;
			}
			this._target = target;
			this._tween = tween;
			this._vars = vars;
			_autoRound = vars.autoRound;
			_hasPriority = false;
			_suffixMap = vars.suffixMap || CSSPlugin.suffixMap;
			_cs = _getComputedStyle(target, "");
			_overwriteProps = this._overwriteProps;
			var style = target.style,
				v, pt, pt2, first, last, next, zIndex, tpt, threeD;
			if (_reqSafariFix) if (style.zIndex === "") {
				v = _getStyle(target, "zIndex", _cs);
				if (v === "auto" || v === "") {
					//corrects a bug in [non-Android] Safari that prevents it from repainting elements in their new positions if they don't have a zIndex set. We also can't just apply this inside _parseTransform() because anything that's moved in any way (like using "left" or "top" instead of transforms like "x" and "y") can be affected, so it is best to ensure that anything that's tweening has a z-index. Setting "WebkitPerspective" to a non-zero value worked too except that on iOS Safari things would flicker randomly. Plus zIndex is less memory-intensive.
					this._addLazySet(style, "zIndex", 0);
				}
			}

			if (typeof(vars) === "string") {
				first = style.cssText;
				v = _getAllStyles(target, _cs);
				style.cssText = first + ";" + vars;
				v = _cssDif(target, v, _getAllStyles(target)).difs;
				if (!_supportsOpacity && _opacityValExp.test(vars)) {
					v.opacity = parseFloat( RegExp.$1 );
				}
				vars = v;
				style.cssText = first;
			}

			if (vars.className) { //className tweens will combine any differences they find in the css with the vars that are passed in, so {className:"myClass", scale:0.5, left:20} would work.
				this._firstPT = pt = _specialProps.className.parse(target, vars.className, "className", this, null, null, vars);
			} else {
				this._firstPT = pt = this.parse(target, vars, null);
			}

			if (this._transformType) {
				threeD = (this._transformType === 3);
				if (!_transformProp) {
					style.zoom = 1; //helps correct an IE issue.
				} else if (_isSafari) {
					_reqSafariFix = true;
					//if zIndex isn't set, iOS Safari doesn't repaint things correctly sometimes (seemingly at random).
					if (style.zIndex === "") {
						zIndex = _getStyle(target, "zIndex", _cs);
						if (zIndex === "auto" || zIndex === "") {
							this._addLazySet(style, "zIndex", 0);
						}
					}
					//Setting WebkitBackfaceVisibility corrects 3 bugs:
					// 1) [non-Android] Safari skips rendering changes to "top" and "left" that are made on the same frame/render as a transform update.
					// 2) iOS Safari sometimes neglects to repaint elements in their new positions. Setting "WebkitPerspective" to a non-zero value worked too except that on iOS Safari things would flicker randomly.
					// 3) Safari sometimes displayed odd artifacts when tweening the transform (or WebkitTransform) property, like ghosts of the edges of the element remained. Definitely a browser bug.
					//Note: we allow the user to override the auto-setting by defining WebkitBackfaceVisibility in the vars of the tween.
					if (_isSafariLT6) {
						this._addLazySet(style, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (threeD ? "visible" : "hidden"));
					}
				}
				pt2 = pt;
				while (pt2 && pt2._next) {
					pt2 = pt2._next;
				}
				tpt = new CSSPropTween(target, "transform", 0, 0, null, 2);
				this._linkCSSP(tpt, null, pt2);
				tpt.setRatio = _transformProp ? _setTransformRatio : _setIETransformRatio;
				tpt.data = this._transform || _getTransform(target, _cs, true);
				tpt.tween = tween;
				tpt.pr = -1; //ensures that the transforms get applied after the components are updated.
				_overwriteProps.pop(); //we don't want to force the overwrite of all "transform" tweens of the target - we only care about individual transform properties like scaleX, rotation, etc. The CSSPropTween constructor automatically adds the property to _overwriteProps which is why we need to pop() here.
			}

			if (_hasPriority) {
				//reorders the linked list in order of pr (priority)
				while (pt) {
					next = pt._next;
					pt2 = first;
					while (pt2 && pt2.pr > pt.pr) {
						pt2 = pt2._next;
					}
					if ((pt._prev = pt2 ? pt2._prev : last)) {
						pt._prev._next = pt;
					} else {
						first = pt;
					}
					if ((pt._next = pt2)) {
						pt2._prev = pt;
					} else {
						last = pt;
					}
					pt = next;
				}
				this._firstPT = first;
			}
			return true;
		};


		p.parse = function(target, vars, pt, plugin) {
			var style = target.style,
				p, sp, bn, en, bs, es, bsfx, esfx, isStr, rel;
			for (p in vars) {
				es = vars[p]; //ending value string
				sp = _specialProps[p]; //SpecialProp lookup.
				if (sp) {
					pt = sp.parse(target, es, p, this, pt, plugin, vars);

				} else {
					bs = _getStyle(target, p, _cs) + "";
					isStr = (typeof(es) === "string");
					if (p === "color" || p === "fill" || p === "stroke" || p.indexOf("Color") !== -1 || (isStr && _rgbhslExp.test(es))) { //Opera uses background: to define color sometimes in addition to backgroundColor:
						if (!isStr) {
							es = _parseColor(es);
							es = ((es.length > 3) ? "rgba(" : "rgb(") + es.join(",") + ")";
						}
						pt = _parseComplex(style, p, bs, es, true, "transparent", pt, 0, plugin);

					} else if (isStr && (es.indexOf(" ") !== -1 || es.indexOf(",") !== -1)) {
						pt = _parseComplex(style, p, bs, es, true, null, pt, 0, plugin);

					} else {
						bn = parseFloat(bs);
						bsfx = (bn || bn === 0) ? bs.substr((bn + "").length) : ""; //remember, bs could be non-numeric like "normal" for fontWeight, so we should default to a blank suffix in that case.

						if (bs === "" || bs === "auto") {
							if (p === "width" || p === "height") {
								bn = _getDimension(target, p, _cs);
								bsfx = "px";
							} else if (p === "left" || p === "top") {
								bn = _calculateOffset(target, p, _cs);
								bsfx = "px";
							} else {
								bn = (p !== "opacity") ? 0 : 1;
								bsfx = "";
							}
						}

						rel = (isStr && es.charAt(1) === "=");
						if (rel) {
							en = parseInt(es.charAt(0) + "1", 10);
							es = es.substr(2);
							en *= parseFloat(es);
							esfx = es.replace(_suffixExp, "");
						} else {
							en = parseFloat(es);
							esfx = isStr ? es.replace(_suffixExp, "") : "";
						}

						if (esfx === "") {
							esfx = (p in _suffixMap) ? _suffixMap[p] : bsfx; //populate the end suffix, prioritizing the map, then if none is found, use the beginning suffix.
						}

						es = (en || en === 0) ? (rel ? en + bn : en) + esfx : vars[p]; //ensures that any += or -= prefixes are taken care of. Record the end value before normalizing the suffix because we always want to end the tween on exactly what they intended even if it doesn't match the beginning value's suffix.

						//if the beginning/ending suffixes don't match, normalize them...
						if (bsfx !== esfx) if (esfx !== "") if (en || en === 0) if (bn) { //note: if the beginning value (bn) is 0, we don't need to convert units!
							bn = _convertToPixels(target, p, bn, bsfx);
							if (esfx === "%") {
								bn /= _convertToPixels(target, p, 100, "%") / 100;
								if (vars.strictUnits !== true) { //some browsers report only "px" values instead of allowing "%" with getComputedStyle(), so we assume that if we're tweening to a %, we should start there too unless strictUnits:true is defined. This approach is particularly useful for responsive designs that use from() tweens.
									bs = bn + "%";
								}

							} else if (esfx === "em") {
								bn /= _convertToPixels(target, p, 1, "em");

							//otherwise convert to pixels.
							} else if (esfx !== "px") {
								en = _convertToPixels(target, p, en, esfx);
								esfx = "px"; //we don't use bsfx after this, so we don't need to set it to px too.
							}
							if (rel) if (en || en === 0) {
								es = (en + bn) + esfx; //the changes we made affect relative calculations, so adjust the end value here.
							}
						}

						if (rel) {
							en += bn;
						}

						if ((bn || bn === 0) && (en || en === 0)) { //faster than isNaN(). Also, previously we required en !== bn but that doesn't really gain much performance and it prevents _parseToProxy() from working properly if beginning and ending values match but need to get tweened by an external plugin anyway. For example, a bezier tween where the target starts at left:0 and has these points: [{left:50},{left:0}] wouldn't work properly because when parsing the last point, it'd match the first (current) one and a non-tweening CSSPropTween would be recorded when we actually need a normal tween (type:0) so that things get updated during the tween properly.
							pt = new CSSPropTween(style, p, bn, en - bn, pt, 0, p, (_autoRound !== false && (esfx === "px" || p === "zIndex")), 0, bs, es);
							pt.xs0 = esfx;
							//DEBUG: _log("tween "+p+" from "+pt.b+" ("+bn+esfx+") to "+pt.e+" with suffix: "+pt.xs0);
						} else if (style[p] === undefined || !es && (es + "" === "NaN" || es == null)) {
							_log("invalid " + p + " tween value: " + vars[p]);
						} else {
							pt = new CSSPropTween(style, p, en || bn || 0, 0, pt, -1, p, false, 0, bs, es);
							pt.xs0 = (es === "none" && (p === "display" || p.indexOf("Style") !== -1)) ? bs : es; //intermediate value should typically be set immediately (end value) except for "display" or things like borderTopStyle, borderBottomStyle, etc. which should use the beginning value during the tween.
							//DEBUG: _log("non-tweening value "+p+": "+pt.xs0);
						}
					}
				}
				if (plugin) if (pt && !pt.plugin) {
					pt.plugin = plugin;
				}
			}
			return pt;
		};


		//gets called every time the tween updates, passing the new ratio (typically a value between 0 and 1, but not always (for example, if an Elastic.easeOut is used, the value can jump above 1 mid-tween). It will always start and 0 and end at 1.
		p.setRatio = function(v) {
			var pt = this._firstPT,
				min = 0.000001,
				val, str, i;
			//at the end of the tween, we set the values to exactly what we received in order to make sure non-tweening values (like "position" or "float" or whatever) are set and so that if the beginning/ending suffixes (units) didn't match and we normalized to px, the value that the user passed in is used here. We check to see if the tween is at its beginning in case it's a from() tween in which case the ratio will actually go from 1 to 0 over the course of the tween (backwards).
			if (v === 1 && (this._tween._time === this._tween._duration || this._tween._time === 0)) {
				while (pt) {
					if (pt.type !== 2) {
						if (pt.r && pt.type !== -1) {
							val = Math.round(pt.s + pt.c);
							if (!pt.type) {
								pt.t[pt.p] = val + pt.xs0;
							} else if (pt.type === 1) { //complex value (one that typically has multiple numbers inside a string, like "rect(5px,10px,20px,25px)"
								i = pt.l;
								str = pt.xs0 + val + pt.xs1;
								for (i = 1; i < pt.l; i++) {
									str += pt["xn"+i] + pt["xs"+(i+1)];
								}
								pt.t[pt.p] = str;
							}
						} else {
							pt.t[pt.p] = pt.e;
						}
					} else {
						pt.setRatio(v);
					}
					pt = pt._next;
				}

			} else if (v || !(this._tween._time === this._tween._duration || this._tween._time === 0) || this._tween._rawPrevTime === -0.000001) {
				while (pt) {
					val = pt.c * v + pt.s;
					if (pt.r) {
						val = Math.round(val);
					} else if (val < min) if (val > -min) {
						val = 0;
					}
					if (!pt.type) {
						pt.t[pt.p] = val + pt.xs0;
					} else if (pt.type === 1) { //complex value (one that typically has multiple numbers inside a string, like "rect(5px,10px,20px,25px)"
						i = pt.l;
						if (i === 2) {
							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2;
						} else if (i === 3) {
							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3;
						} else if (i === 4) {
							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4;
						} else if (i === 5) {
							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4 + pt.xn4 + pt.xs5;
						} else {
							str = pt.xs0 + val + pt.xs1;
							for (i = 1; i < pt.l; i++) {
								str += pt["xn"+i] + pt["xs"+(i+1)];
							}
							pt.t[pt.p] = str;
						}

					} else if (pt.type === -1) { //non-tweening value
						pt.t[pt.p] = pt.xs0;

					} else if (pt.setRatio) { //custom setRatio() for things like SpecialProps, external plugins, etc.
						pt.setRatio(v);
					}
					pt = pt._next;
				}

			//if the tween is reversed all the way back to the beginning, we need to restore the original values which may have different units (like % instead of px or em or whatever).
			} else {
				while (pt) {
					if (pt.type !== 2) {
						pt.t[pt.p] = pt.b;
					} else {
						pt.setRatio(v);
					}
					pt = pt._next;
				}
			}
		};

		/**
		 * @private
		 * Forces rendering of the target's transforms (rotation, scale, etc.) whenever the CSSPlugin's setRatio() is called.
		 * Basically, this tells the CSSPlugin to create a CSSPropTween (type 2) after instantiation that runs last in the linked
		 * list and calls the appropriate (3D or 2D) rendering function. We separate this into its own method so that we can call
		 * it from other plugins like BezierPlugin if, for example, it needs to apply an autoRotation and this CSSPlugin
		 * doesn't have any transform-related properties of its own. You can call this method as many times as you
		 * want and it won't create duplicate CSSPropTweens.
		 *
		 * @param {boolean} threeD if true, it should apply 3D tweens (otherwise, just 2D ones are fine and typically faster)
		 */
		p._enableTransforms = function(threeD) {
			this._transform = this._transform || _getTransform(this._target, _cs, true); //ensures that the element has a _gsTransform property with the appropriate values.
			this._transformType = (!(this._transform.svg && _useSVGTransformAttr) && (threeD || this._transformType === 3)) ? 3 : 2;
		};

		var lazySet = function(v) {
			this.t[this.p] = this.e;
			this.data._linkCSSP(this, this._next, null, true); //we purposefully keep this._next even though it'd make sense to null it, but this is a performance optimization, as this happens during the while (pt) {} loop in setRatio() at the bottom of which it sets pt = pt._next, so if we null it, the linked list will be broken in that loop.
		};
		/** @private Gives us a way to set a value on the first render (and only the first render). **/
		p._addLazySet = function(t, p, v) {
			var pt = this._firstPT = new CSSPropTween(t, p, 0, 0, this._firstPT, 2);
			pt.e = v;
			pt.setRatio = lazySet;
			pt.data = this;
		};

		/** @private **/
		p._linkCSSP = function(pt, next, prev, remove) {
			if (pt) {
				if (next) {
					next._prev = pt;
				}
				if (pt._next) {
					pt._next._prev = pt._prev;
				}
				if (pt._prev) {
					pt._prev._next = pt._next;
				} else if (this._firstPT === pt) {
					this._firstPT = pt._next;
					remove = true; //just to prevent resetting this._firstPT 5 lines down in case pt._next is null. (optimized for speed)
				}
				if (prev) {
					prev._next = pt;
				} else if (!remove && this._firstPT === null) {
					this._firstPT = pt;
				}
				pt._next = next;
				pt._prev = prev;
			}
			return pt;
		};

		//we need to make sure that if alpha or autoAlpha is killed, opacity is too. And autoAlpha affects the "visibility" property.
		p._kill = function(lookup) {
			var copy = lookup,
				pt, p, xfirst;
			if (lookup.autoAlpha || lookup.alpha) {
				copy = {};
				for (p in lookup) { //copy the lookup so that we're not changing the original which may be passed elsewhere.
					copy[p] = lookup[p];
				}
				copy.opacity = 1;
				if (copy.autoAlpha) {
					copy.visibility = 1;
				}
			}
			if (lookup.className && (pt = this._classNamePT)) { //for className tweens, we need to kill any associated CSSPropTweens too; a linked list starts at the className's "xfirst".
				xfirst = pt.xfirst;
				if (xfirst && xfirst._prev) {
					this._linkCSSP(xfirst._prev, pt._next, xfirst._prev._prev); //break off the prev
				} else if (xfirst === this._firstPT) {
					this._firstPT = pt._next;
				}
				if (pt._next) {
					this._linkCSSP(pt._next, pt._next._next, xfirst._prev);
				}
				this._classNamePT = null;
			}
			return TweenPlugin.prototype._kill.call(this, copy);
		};



		//used by cascadeTo() for gathering all the style properties of each child element into an array for comparison.
		var _getChildStyles = function(e, props, targets) {
				var children, i, child, type;
				if (e.slice) {
					i = e.length;
					while (--i > -1) {
						_getChildStyles(e[i], props, targets);
					}
					return;
				}
				children = e.childNodes;
				i = children.length;
				while (--i > -1) {
					child = children[i];
					type = child.type;
					if (child.style) {
						props.push(_getAllStyles(child));
						if (targets) {
							targets.push(child);
						}
					}
					if ((type === 1 || type === 9 || type === 11) && child.childNodes.length) {
						_getChildStyles(child, props, targets);
					}
				}
			};

		/**
		 * Typically only useful for className tweens that may affect child elements, this method creates a TweenLite
		 * and then compares the style properties of all the target's child elements at the tween's start and end, and
		 * if any are different, it also creates tweens for those and returns an array containing ALL of the resulting
		 * tweens (so that you can easily add() them to a TimelineLite, for example). The reason this functionality is
		 * wrapped into a separate static method of CSSPlugin instead of being integrated into all regular className tweens
		 * is because it creates entirely new tweens that may have completely different targets than the original tween,
		 * so if they were all lumped into the original tween instance, it would be inconsistent with the rest of the API
		 * and it would create other problems. For example:
		 *  - If I create a tween of elementA, that tween instance may suddenly change its target to include 50 other elements (unintuitive if I specifically defined the target I wanted)
		 *  - We can't just create new independent tweens because otherwise, what happens if the original/parent tween is reversed or pause or dropped into a TimelineLite for tight control? You'd expect that tween's behavior to affect all the others.
		 *  - Analyzing every style property of every child before and after the tween is an expensive operation when there are many children, so this behavior shouldn't be imposed on all className tweens by default, especially since it's probably rare that this extra functionality is needed.
		 *
		 * @param {Object} target object to be tweened
		 * @param {number} Duration in seconds (or frames for frames-based tweens)
		 * @param {Object} Object containing the end values, like {className:"newClass", ease:Linear.easeNone}
		 * @return {Array} An array of TweenLite instances
		 */
		CSSPlugin.cascadeTo = function(target, duration, vars) {
			var tween = TweenLite.to(target, duration, vars),
				results = [tween],
				b = [],
				e = [],
				targets = [],
				_reservedProps = TweenLite._internals.reservedProps,
				i, difs, p, from;
			target = tween._targets || tween.target;
			_getChildStyles(target, b, targets);
			tween.render(duration, true, true);
			_getChildStyles(target, e);
			tween.render(0, true, true);
			tween._enabled(true);
			i = targets.length;
			while (--i > -1) {
				difs = _cssDif(targets[i], b[i], e[i]);
				if (difs.firstMPT) {
					difs = difs.difs;
					for (p in vars) {
						if (_reservedProps[p]) {
							difs[p] = vars[p];
						}
					}
					from = {};
					for (p in difs) {
						from[p] = b[i][p];
					}
					results.push(TweenLite.fromTo(targets[i], duration, from, difs));
				}
			}
			return results;
		};

		TweenPlugin.activate([CSSPlugin]);
		return CSSPlugin;

	}, true);

	
	
	
	
	
	
	
	
	
	
/*
 * ----------------------------------------------------------------
 * RoundPropsPlugin
 * ----------------------------------------------------------------
 */
	(function() {

		var RoundPropsPlugin = _gsScope._gsDefine.plugin({
				propName: "roundProps",
				priority: -1,
				API: 2,

				//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
				init: function(target, value, tween) {
					this._tween = tween;
					return true;
				}

			}),
			p = RoundPropsPlugin.prototype;

		p._onInitAllProps = function() {
			var tween = this._tween,
				rp = (tween.vars.roundProps instanceof Array) ? tween.vars.roundProps : tween.vars.roundProps.split(","),
				i = rp.length,
				lookup = {},
				rpt = tween._propLookup.roundProps,
				prop, pt, next;
			while (--i > -1) {
				lookup[rp[i]] = 1;
			}
			i = rp.length;
			while (--i > -1) {
				prop = rp[i];
				pt = tween._firstPT;
				while (pt) {
					next = pt._next; //record here, because it may get removed
					if (pt.pg) {
						pt.t._roundProps(lookup, true);
					} else if (pt.n === prop) {
						this._add(pt.t, prop, pt.s, pt.c);
						//remove from linked list
						if (next) {
							next._prev = pt._prev;
						}
						if (pt._prev) {
							pt._prev._next = next;
						} else if (tween._firstPT === pt) {
							tween._firstPT = next;
						}
						pt._next = pt._prev = null;
						tween._propLookup[prop] = rpt;
					}
					pt = next;
				}
			}
			return false;
		};

		p._add = function(target, p, s, c) {
			this._addTween(target, p, s, s + c, p, true);
			this._overwriteProps.push(p);
		};

	}());










/*
 * ----------------------------------------------------------------
 * AttrPlugin
 * ----------------------------------------------------------------
 */

	(function() {
		var _numExp = /(?:\d|\-|\+|=|#|\.)*/g,
			_suffixExp = /[A-Za-z%]/g;

		_gsScope._gsDefine.plugin({
			propName: "attr",
			API: 2,
			version: "0.4.0",

			//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
			init: function(target, value, tween) {
				var p, start, end, suffix, i;
				if (typeof(target.setAttribute) !== "function") {
					return false;
				}
				this._target = target;
				this._proxy = {};
				this._start = {}; // we record start and end values exactly as they are in case they're strings (not numbers) - we need to be able to revert to them cleanly.
				this._end = {};
				this._suffix = {};
				for (p in value) {
					this._start[p] = this._proxy[p] = start = target.getAttribute(p) + "";
					this._end[p] = end = value[p] + "";
					this._suffix[p] = suffix = _suffixExp.test(end) ? end.replace(_numExp, "") : _suffixExp.test(start) ? start.replace(_numExp, "") : "";
					if (suffix) {
						i = end.indexOf(suffix);
						if (i !== -1) {
							end = end.substr(0, i);
						}
					}
					if(!this._addTween(this._proxy, p, parseFloat(start), end, p)) {
						this._suffix[p] = ""; //not a valid tween - perhaps something like an <img src=""> attribute.
					}
					if (end.charAt(1) === "=") {
						this._end[p] = (this._firstPT.s + this._firstPT.c) + suffix;
					}
					this._overwriteProps.push(p);
				}
				return true;
			},

			//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
			set: function(ratio) {
				this._super.setRatio.call(this, ratio);
				var props = this._overwriteProps,
					i = props.length,
					lookup = (ratio === 1) ? this._end : ratio ? this._proxy : this._start,
					useSuffix = (lookup === this._proxy),
					p;
				while (--i > -1) {
					p = props[i];
					this._target.setAttribute(p, lookup[p] + (useSuffix ? this._suffix[p] : ""));
				}
			}

		});
	}());










/*
 * ----------------------------------------------------------------
 * DirectionalRotationPlugin
 * ----------------------------------------------------------------
 */
	_gsScope._gsDefine.plugin({
		propName: "directionalRotation",
		version: "0.2.1",
		API: 2,

		//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
		init: function(target, value, tween) {
			if (typeof(value) !== "object") {
				value = {rotation:value};
			}
			this.finals = {};
			var cap = (value.useRadians === true) ? Math.PI * 2 : 360,
				min = 0.000001,
				p, v, start, end, dif, split;
			for (p in value) {
				if (p !== "useRadians") {
					split = (value[p] + "").split("_");
					v = split[0];
					start = parseFloat( (typeof(target[p]) !== "function") ? target[p] : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]() );
					end = this.finals[p] = (typeof(v) === "string" && v.charAt(1) === "=") ? start + parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) : Number(v) || 0;
					dif = end - start;
					if (split.length) {
						v = split.join("_");
						if (v.indexOf("short") !== -1) {
							dif = dif % cap;
							if (dif !== dif % (cap / 2)) {
								dif = (dif < 0) ? dif + cap : dif - cap;
							}
						}
						if (v.indexOf("_cw") !== -1 && dif < 0) {
							dif = ((dif + cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
						} else if (v.indexOf("ccw") !== -1 && dif > 0) {
							dif = ((dif - cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
						}
					}
					if (dif > min || dif < -min) {
						this._addTween(target, p, start, start + dif, p);
						this._overwriteProps.push(p);
					}
				}
			}
			return true;
		},

		//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
		set: function(ratio) {
			var pt;
			if (ratio !== 1) {
				this._super.setRatio.call(this, ratio);
			} else {
				pt = this._firstPT;
				while (pt) {
					if (pt.f) {
						pt.t[pt.p](this.finals[pt.p]);
					} else {
						pt.t[pt.p] = this.finals[pt.p];
					}
					pt = pt._next;
				}
			}
		}

	})._autoCSS = true;







	
	
	
	
/*
 * ----------------------------------------------------------------
 * EasePack
 * ----------------------------------------------------------------
 */
	_gsScope._gsDefine("easing.Back", ["easing.Ease"], function(Ease) {
		
		var w = (_gsScope.GreenSockGlobals || _gsScope),
			gs = w.com.greensock,
			_2PI = Math.PI * 2,
			_HALF_PI = Math.PI / 2,
			_class = gs._class,
			_create = function(n, f) {
				var C = _class("easing." + n, function(){}, true),
					p = C.prototype = new Ease();
				p.constructor = C;
				p.getRatio = f;
				return C;
			},
			_easeReg = Ease.register || function(){}, //put an empty function in place just as a safety measure in case someone loads an OLD version of TweenLite.js where Ease.register doesn't exist.
			_wrap = function(name, EaseOut, EaseIn, EaseInOut, aliases) {
				var C = _class("easing."+name, {
					easeOut:new EaseOut(),
					easeIn:new EaseIn(),
					easeInOut:new EaseInOut()
				}, true);
				_easeReg(C, name);
				return C;
			},
			EasePoint = function(time, value, next) {
				this.t = time;
				this.v = value;
				if (next) {
					this.next = next;
					next.prev = this;
					this.c = next.v - value;
					this.gap = next.t - time;
				}
			},

			//Back
			_createBack = function(n, f) {
				var C = _class("easing." + n, function(overshoot) {
						this._p1 = (overshoot || overshoot === 0) ? overshoot : 1.70158;
						this._p2 = this._p1 * 1.525;
					}, true),
					p = C.prototype = new Ease();
				p.constructor = C;
				p.getRatio = f;
				p.config = function(overshoot) {
					return new C(overshoot);
				};
				return C;
			},

			Back = _wrap("Back",
				_createBack("BackOut", function(p) {
					return ((p = p - 1) * p * ((this._p1 + 1) * p + this._p1) + 1);
				}),
				_createBack("BackIn", function(p) {
					return p * p * ((this._p1 + 1) * p - this._p1);
				}),
				_createBack("BackInOut", function(p) {
					return ((p *= 2) < 1) ? 0.5 * p * p * ((this._p2 + 1) * p - this._p2) : 0.5 * ((p -= 2) * p * ((this._p2 + 1) * p + this._p2) + 2);
				})
			),


			//SlowMo
			SlowMo = _class("easing.SlowMo", function(linearRatio, power, yoyoMode) {
				power = (power || power === 0) ? power : 0.7;
				if (linearRatio == null) {
					linearRatio = 0.7;
				} else if (linearRatio > 1) {
					linearRatio = 1;
				}
				this._p = (linearRatio !== 1) ? power : 0;
				this._p1 = (1 - linearRatio) / 2;
				this._p2 = linearRatio;
				this._p3 = this._p1 + this._p2;
				this._calcEnd = (yoyoMode === true);
			}, true),
			p = SlowMo.prototype = new Ease(),
			SteppedEase, RoughEase, _createElastic;

		p.constructor = SlowMo;
		p.getRatio = function(p) {
			var r = p + (0.5 - p) * this._p;
			if (p < this._p1) {
				return this._calcEnd ? 1 - ((p = 1 - (p / this._p1)) * p) : r - ((p = 1 - (p / this._p1)) * p * p * p * r);
			} else if (p > this._p3) {
				return this._calcEnd ? 1 - (p = (p - this._p3) / this._p1) * p : r + ((p - r) * (p = (p - this._p3) / this._p1) * p * p * p);
			}
			return this._calcEnd ? 1 : r;
		};
		SlowMo.ease = new SlowMo(0.7, 0.7);

		p.config = SlowMo.config = function(linearRatio, power, yoyoMode) {
			return new SlowMo(linearRatio, power, yoyoMode);
		};


		//SteppedEase
		SteppedEase = _class("easing.SteppedEase", function(steps) {
				steps = steps || 1;
				this._p1 = 1 / steps;
				this._p2 = steps + 1;
			}, true);
		p = SteppedEase.prototype = new Ease();
		p.constructor = SteppedEase;
		p.getRatio = function(p) {
			if (p < 0) {
				p = 0;
			} else if (p >= 1) {
				p = 0.999999999;
			}
			return ((this._p2 * p) >> 0) * this._p1;
		};
		p.config = SteppedEase.config = function(steps) {
			return new SteppedEase(steps);
		};


		//RoughEase
		RoughEase = _class("easing.RoughEase", function(vars) {
			vars = vars || {};
			var taper = vars.taper || "none",
				a = [],
				cnt = 0,
				points = (vars.points || 20) | 0,
				i = points,
				randomize = (vars.randomize !== false),
				clamp = (vars.clamp === true),
				template = (vars.template instanceof Ease) ? vars.template : null,
				strength = (typeof(vars.strength) === "number") ? vars.strength * 0.4 : 0.4,
				x, y, bump, invX, obj, pnt;
			while (--i > -1) {
				x = randomize ? Math.random() : (1 / points) * i;
				y = template ? template.getRatio(x) : x;
				if (taper === "none") {
					bump = strength;
				} else if (taper === "out") {
					invX = 1 - x;
					bump = invX * invX * strength;
				} else if (taper === "in") {
					bump = x * x * strength;
				} else if (x < 0.5) {  //"both" (start)
					invX = x * 2;
					bump = invX * invX * 0.5 * strength;
				} else {				//"both" (end)
					invX = (1 - x) * 2;
					bump = invX * invX * 0.5 * strength;
				}
				if (randomize) {
					y += (Math.random() * bump) - (bump * 0.5);
				} else if (i % 2) {
					y += bump * 0.5;
				} else {
					y -= bump * 0.5;
				}
				if (clamp) {
					if (y > 1) {
						y = 1;
					} else if (y < 0) {
						y = 0;
					}
				}
				a[cnt++] = {x:x, y:y};
			}
			a.sort(function(a, b) {
				return a.x - b.x;
			});

			pnt = new EasePoint(1, 1, null);
			i = points;
			while (--i > -1) {
				obj = a[i];
				pnt = new EasePoint(obj.x, obj.y, pnt);
			}

			this._prev = new EasePoint(0, 0, (pnt.t !== 0) ? pnt : pnt.next);
		}, true);
		p = RoughEase.prototype = new Ease();
		p.constructor = RoughEase;
		p.getRatio = function(p) {
			var pnt = this._prev;
			if (p > pnt.t) {
				while (pnt.next && p >= pnt.t) {
					pnt = pnt.next;
				}
				pnt = pnt.prev;
			} else {
				while (pnt.prev && p <= pnt.t) {
					pnt = pnt.prev;
				}
			}
			this._prev = pnt;
			return (pnt.v + ((p - pnt.t) / pnt.gap) * pnt.c);
		};
		p.config = function(vars) {
			return new RoughEase(vars);
		};
		RoughEase.ease = new RoughEase();


		//Bounce
		_wrap("Bounce",
			_create("BounceOut", function(p) {
				if (p < 1 / 2.75) {
					return 7.5625 * p * p;
				} else if (p < 2 / 2.75) {
					return 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
				} else if (p < 2.5 / 2.75) {
					return 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
				}
				return 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
			}),
			_create("BounceIn", function(p) {
				if ((p = 1 - p) < 1 / 2.75) {
					return 1 - (7.5625 * p * p);
				} else if (p < 2 / 2.75) {
					return 1 - (7.5625 * (p -= 1.5 / 2.75) * p + 0.75);
				} else if (p < 2.5 / 2.75) {
					return 1 - (7.5625 * (p -= 2.25 / 2.75) * p + 0.9375);
				}
				return 1 - (7.5625 * (p -= 2.625 / 2.75) * p + 0.984375);
			}),
			_create("BounceInOut", function(p) {
				var invert = (p < 0.5);
				if (invert) {
					p = 1 - (p * 2);
				} else {
					p = (p * 2) - 1;
				}
				if (p < 1 / 2.75) {
					p = 7.5625 * p * p;
				} else if (p < 2 / 2.75) {
					p = 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
				} else if (p < 2.5 / 2.75) {
					p = 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
				} else {
					p = 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
				}
				return invert ? (1 - p) * 0.5 : p * 0.5 + 0.5;
			})
		);


		//CIRC
		_wrap("Circ",
			_create("CircOut", function(p) {
				return Math.sqrt(1 - (p = p - 1) * p);
			}),
			_create("CircIn", function(p) {
				return -(Math.sqrt(1 - (p * p)) - 1);
			}),
			_create("CircInOut", function(p) {
				return ((p*=2) < 1) ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
			})
		);


		//Elastic
		_createElastic = function(n, f, def) {
			var C = _class("easing." + n, function(amplitude, period) {
					this._p1 = (amplitude >= 1) ? amplitude : 1; //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
					this._p2 = (period || def) / (amplitude < 1 ? amplitude : 1);
					this._p3 = this._p2 / _2PI * (Math.asin(1 / this._p1) || 0);
					this._p2 = _2PI / this._p2; //precalculate to optimize
				}, true),
				p = C.prototype = new Ease();
			p.constructor = C;
			p.getRatio = f;
			p.config = function(amplitude, period) {
				return new C(amplitude, period);
			};
			return C;
		};
		_wrap("Elastic",
			_createElastic("ElasticOut", function(p) {
				return this._p1 * Math.pow(2, -10 * p) * Math.sin( (p - this._p3) * this._p2 ) + 1;
			}, 0.3),
			_createElastic("ElasticIn", function(p) {
				return -(this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._p3) * this._p2 ));
			}, 0.3),
			_createElastic("ElasticInOut", function(p) {
				return ((p *= 2) < 1) ? -0.5 * (this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._p3) * this._p2)) : this._p1 * Math.pow(2, -10 *(p -= 1)) * Math.sin( (p - this._p3) * this._p2 ) * 0.5 + 1;
			}, 0.45)
		);


		//Expo
		_wrap("Expo",
			_create("ExpoOut", function(p) {
				return 1 - Math.pow(2, -10 * p);
			}),
			_create("ExpoIn", function(p) {
				return Math.pow(2, 10 * (p - 1)) - 0.001;
			}),
			_create("ExpoInOut", function(p) {
				return ((p *= 2) < 1) ? 0.5 * Math.pow(2, 10 * (p - 1)) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
			})
		);


		//Sine
		_wrap("Sine",
			_create("SineOut", function(p) {
				return Math.sin(p * _HALF_PI);
			}),
			_create("SineIn", function(p) {
				return -Math.cos(p * _HALF_PI) + 1;
			}),
			_create("SineInOut", function(p) {
				return -0.5 * (Math.cos(Math.PI * p) - 1);
			})
		);

		_class("easing.EaseLookup", {
				find:function(s) {
					return Ease.map[s];
				}
			}, true);

		//register the non-standard eases
		_easeReg(w.SlowMo, "SlowMo", "ease,");
		_easeReg(RoughEase, "RoughEase", "ease,");
		_easeReg(SteppedEase, "SteppedEase", "ease,");

		return Back;
		
	}, true);


});

if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); } //necessary in case TweenLite was already loaded separately.











/*
 * ----------------------------------------------------------------
 * Base classes like TweenLite, SimpleTimeline, Ease, Ticker, etc.
 * ----------------------------------------------------------------
 */
(function(window, moduleName) {

		"use strict";
		var _globals = window.GreenSockGlobals = window.GreenSockGlobals || window;
		if (_globals.TweenLite) {
			return; //in case the core set of classes is already loaded, don't instantiate twice.
		}
		var _namespace = function(ns) {
				var a = ns.split("."),
					p = _globals, i;
				for (i = 0; i < a.length; i++) {
					p[a[i]] = p = p[a[i]] || {};
				}
				return p;
			},
			gs = _namespace("com.greensock"),
			_tinyNum = 0.0000000001,
			_slice = function(a) { //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
				var b = [],
					l = a.length,
					i;
				for (i = 0; i !== l; b.push(a[i++]));
				return b;
			},
			_emptyFunc = function() {},
			_isArray = (function() { //works around issues in iframe environments where the Array global isn't shared, thus if the object originates in a different window/iframe, "(obj instanceof Array)" will evaluate false. We added some speed optimizations to avoid Object.prototype.toString.call() unless it's absolutely necessary because it's VERY slow (like 20x slower)
				var toString = Object.prototype.toString,
					array = toString.call([]);
				return function(obj) {
					return obj != null && (obj instanceof Array || (typeof(obj) === "object" && !!obj.push && toString.call(obj) === array));
				};
			}()),
			a, i, p, _ticker, _tickerActive,
			_defLookup = {},

			/**
			 * @constructor
			 * Defines a GreenSock class, optionally with an array of dependencies that must be instantiated first and passed into the definition.
			 * This allows users to load GreenSock JS files in any order even if they have interdependencies (like CSSPlugin extends TweenPlugin which is
			 * inside TweenLite.js, but if CSSPlugin is loaded first, it should wait to run its code until TweenLite.js loads and instantiates TweenPlugin
			 * and then pass TweenPlugin to CSSPlugin's definition). This is all done automatically and internally.
			 *
			 * Every definition will be added to a "com.greensock" global object (typically window, but if a window.GreenSockGlobals object is found,
			 * it will go there as of v1.7). For example, TweenLite will be found at window.com.greensock.TweenLite and since it's a global class that should be available anywhere,
			 * it is ALSO referenced at window.TweenLite. However some classes aren't considered global, like the base com.greensock.core.Animation class, so
			 * those will only be at the package like window.com.greensock.core.Animation. Again, if you define a GreenSockGlobals object on the window, everything
			 * gets tucked neatly inside there instead of on the window directly. This allows you to do advanced things like load multiple versions of GreenSock
			 * files and put them into distinct objects (imagine a banner ad uses a newer version but the main site uses an older one). In that case, you could
			 * sandbox the banner one like:
			 *
			 * <script>
			 *     var gs = window.GreenSockGlobals = {}; //the newer version we're about to load could now be referenced in a "gs" object, like gs.TweenLite.to(...). Use whatever alias you want as long as it's unique, "gs" or "banner" or whatever.
			 * </script>
			 * <script src="js/greensock/v1.7/TweenMax.js"></script>
			 * <script>
			 *     window.GreenSockGlobals = window._gsQueue = window._gsDefine = null; //reset it back to null (along with the special _gsQueue variable) so that the next load of TweenMax affects the window and we can reference things directly like TweenLite.to(...)
			 * </script>
			 * <script src="js/greensock/v1.6/TweenMax.js"></script>
			 * <script>
			 *     gs.TweenLite.to(...); //would use v1.7
			 *     TweenLite.to(...); //would use v1.6
			 * </script>
			 *
			 * @param {!string} ns The namespace of the class definition, leaving off "com.greensock." as that's assumed. For example, "TweenLite" or "plugins.CSSPlugin" or "easing.Back".
			 * @param {!Array.<string>} dependencies An array of dependencies (described as their namespaces minus "com.greensock." prefix). For example ["TweenLite","plugins.TweenPlugin","core.Animation"]
			 * @param {!function():Object} func The function that should be called and passed the resolved dependencies which will return the actual class for this definition.
			 * @param {boolean=} global If true, the class will be added to the global scope (typically window unless you define a window.GreenSockGlobals object)
			 */
			Definition = function(ns, dependencies, func, global) {
				this.sc = (_defLookup[ns]) ? _defLookup[ns].sc : []; //subclasses
				_defLookup[ns] = this;
				this.gsClass = null;
				this.func = func;
				var _classes = [];
				this.check = function(init) {
					var i = dependencies.length,
						missing = i,
						cur, a, n, cl;
					while (--i > -1) {
						if ((cur = _defLookup[dependencies[i]] || new Definition(dependencies[i], [])).gsClass) {
							_classes[i] = cur.gsClass;
							missing--;
						} else if (init) {
							cur.sc.push(this);
						}
					}
					if (missing === 0 && func) {
						a = ("com.greensock." + ns).split(".");
						n = a.pop();
						cl = _namespace(a.join("."))[n] = this.gsClass = func.apply(func, _classes);

						//exports to multiple environments
						if (global) {
							_globals[n] = cl; //provides a way to avoid global namespace pollution. By default, the main classes like TweenLite, Power1, Strong, etc. are added to window unless a GreenSockGlobals is defined. So if you want to have things added to a custom object instead, just do something like window.GreenSockGlobals = {} before loading any GreenSock files. You can even set up an alias like window.GreenSockGlobals = windows.gs = {} so that you can access everything like gs.TweenLite. Also remember that ALL classes are added to the window.com.greensock object (in their respective packages, like com.greensock.easing.Power1, com.greensock.TweenLite, etc.)
							if (typeof(define) === "function" && define.amd){ //AMD
								define((window.GreenSockAMDPath ? window.GreenSockAMDPath + "/" : "") + ns.split(".").pop(), [], function() { return cl; });
							} else if (ns === moduleName && typeof(module) !== "undefined" && module.exports){ //node
								module.exports = cl;
							}
						}
						for (i = 0; i < this.sc.length; i++) {
							this.sc[i].check();
						}
					}
				};
				this.check(true);
			},

			//used to create Definition instances (which basically registers a class that has dependencies).
			_gsDefine = window._gsDefine = function(ns, dependencies, func, global) {
				return new Definition(ns, dependencies, func, global);
			},

			//a quick way to create a class that doesn't have any dependencies. Returns the class, but first registers it in the GreenSock namespace so that other classes can grab it (other classes might be dependent on the class).
			_class = gs._class = function(ns, func, global) {
				func = func || function() {};
				_gsDefine(ns, [], function(){ return func; }, global);
				return func;
			};

		_gsDefine.globals = _globals;



/*
 * ----------------------------------------------------------------
 * Ease
 * ----------------------------------------------------------------
 */
		var _baseParams = [0, 0, 1, 1],
			_blankArray = [],
			Ease = _class("easing.Ease", function(func, extraParams, type, power) {
				this._func = func;
				this._type = type || 0;
				this._power = power || 0;
				this._params = extraParams ? _baseParams.concat(extraParams) : _baseParams;
			}, true),
			_easeMap = Ease.map = {},
			_easeReg = Ease.register = function(ease, names, types, create) {
				var na = names.split(","),
					i = na.length,
					ta = (types || "easeIn,easeOut,easeInOut").split(","),
					e, name, j, type;
				while (--i > -1) {
					name = na[i];
					e = create ? _class("easing."+name, null, true) : gs.easing[name] || {};
					j = ta.length;
					while (--j > -1) {
						type = ta[j];
						_easeMap[name + "." + type] = _easeMap[type + name] = e[type] = ease.getRatio ? ease : ease[type] || new ease();
					}
				}
			};

		p = Ease.prototype;
		p._calcEnd = false;
		p.getRatio = function(p) {
			if (this._func) {
				this._params[0] = p;
				return this._func.apply(null, this._params);
			}
			var t = this._type,
				pw = this._power,
				r = (t === 1) ? 1 - p : (t === 2) ? p : (p < 0.5) ? p * 2 : (1 - p) * 2;
			if (pw === 1) {
				r *= r;
			} else if (pw === 2) {
				r *= r * r;
			} else if (pw === 3) {
				r *= r * r * r;
			} else if (pw === 4) {
				r *= r * r * r * r;
			}
			return (t === 1) ? 1 - r : (t === 2) ? r : (p < 0.5) ? r / 2 : 1 - (r / 2);
		};

		//create all the standard eases like Linear, Quad, Cubic, Quart, Quint, Strong, Power0, Power1, Power2, Power3, and Power4 (each with easeIn, easeOut, and easeInOut)
		a = ["Linear","Quad","Cubic","Quart","Quint,Strong"];
		i = a.length;
		while (--i > -1) {
			p = a[i]+",Power"+i;
			_easeReg(new Ease(null,null,1,i), p, "easeOut", true);
			_easeReg(new Ease(null,null,2,i), p, "easeIn" + ((i === 0) ? ",easeNone" : ""));
			_easeReg(new Ease(null,null,3,i), p, "easeInOut");
		}
		_easeMap.linear = gs.easing.Linear.easeIn;
		_easeMap.swing = gs.easing.Quad.easeInOut; //for jQuery folks


/*
 * ----------------------------------------------------------------
 * EventDispatcher
 * ----------------------------------------------------------------
 */
		var EventDispatcher = _class("events.EventDispatcher", function(target) {
			this._listeners = {};
			this._eventTarget = target || this;
		});
		p = EventDispatcher.prototype;

		p.addEventListener = function(type, callback, scope, useParam, priority) {
			priority = priority || 0;
			var list = this._listeners[type],
				index = 0,
				listener, i;
			if (list == null) {
				this._listeners[type] = list = [];
			}
			i = list.length;
			while (--i > -1) {
				listener = list[i];
				if (listener.c === callback && listener.s === scope) {
					list.splice(i, 1);
				} else if (index === 0 && listener.pr < priority) {
					index = i + 1;
				}
			}
			list.splice(index, 0, {c:callback, s:scope, up:useParam, pr:priority});
			if (this === _ticker && !_tickerActive) {
				_ticker.wake();
			}
		};

		p.removeEventListener = function(type, callback) {
			var list = this._listeners[type], i;
			if (list) {
				i = list.length;
				while (--i > -1) {
					if (list[i].c === callback) {
						list.splice(i, 1);
						return;
					}
				}
			}
		};

		p.dispatchEvent = function(type) {
			var list = this._listeners[type],
				i, t, listener;
			if (list) {
				i = list.length;
				t = this._eventTarget;
				while (--i > -1) {
					listener = list[i];
					if (listener) {
						if (listener.up) {
							listener.c.call(listener.s || t, {type:type, target:t});
						} else {
							listener.c.call(listener.s || t);
						}
					}
				}
			}
		};


/*
 * ----------------------------------------------------------------
 * Ticker
 * ----------------------------------------------------------------
 */
 		var _reqAnimFrame = window.requestAnimationFrame,
			_cancelAnimFrame = window.cancelAnimationFrame,
			_getTime = Date.now || function() {return new Date().getTime();},
			_lastUpdate = _getTime();

		//now try to determine the requestAnimationFrame and cancelAnimationFrame functions and if none are found, we'll use a setTimeout()/clearTimeout() polyfill.
		a = ["ms","moz","webkit","o"];
		i = a.length;
		while (--i > -1 && !_reqAnimFrame) {
			_reqAnimFrame = window[a[i] + "RequestAnimationFrame"];
			_cancelAnimFrame = window[a[i] + "CancelAnimationFrame"] || window[a[i] + "CancelRequestAnimationFrame"];
		}

		_class("Ticker", function(fps, useRAF) {
			var _self = this,
				_startTime = _getTime(),
				_useRAF = (useRAF !== false && _reqAnimFrame),
				_lagThreshold = 500,
				_adjustedLag = 33,
				_tickWord = "tick", //helps reduce gc burden
				_fps, _req, _id, _gap, _nextTime,
				_tick = function(manual) {
					var elapsed = _getTime() - _lastUpdate,
						overlap, dispatch;
					if (elapsed > _lagThreshold) {
						_startTime += elapsed - _adjustedLag;
					}
					_lastUpdate += elapsed;
					_self.time = (_lastUpdate - _startTime) / 1000;
					overlap = _self.time - _nextTime;
					if (!_fps || overlap > 0 || manual === true) {
						_self.frame++;
						_nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
						dispatch = true;
					}
					if (manual !== true) { //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.
						_id = _req(_tick);
					}
					if (dispatch) {
						_self.dispatchEvent(_tickWord);
					}
				};

			EventDispatcher.call(_self);
			_self.time = _self.frame = 0;
			_self.tick = function() {
				_tick(true);
			};

			_self.lagSmoothing = function(threshold, adjustedLag) {
				_lagThreshold = threshold || (1 / _tinyNum); //zero should be interpreted as basically unlimited
				_adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
			};

			_self.sleep = function() {
				if (_id == null) {
					return;
				}
				if (!_useRAF || !_cancelAnimFrame) {
					clearTimeout(_id);
				} else {
					_cancelAnimFrame(_id);
				}
				_req = _emptyFunc;
				_id = null;
				if (_self === _ticker) {
					_tickerActive = false;
				}
			};

			_self.wake = function() {
				if (_id !== null) {
					_self.sleep();
				} else if (_self.frame > 10) { //don't trigger lagSmoothing if we're just waking up, and make sure that at least 10 frames have elapsed because of the iOS bug that we work around below with the 1.5-second setTimout().
					_lastUpdate = _getTime() - _lagThreshold + 5;
				}
				_req = (_fps === 0) ? _emptyFunc : (!_useRAF || !_reqAnimFrame) ? function(f) { return setTimeout(f, ((_nextTime - _self.time) * 1000 + 1) | 0); } : _reqAnimFrame;
				if (_self === _ticker) {
					_tickerActive = true;
				}
				_tick(2);
			};

			_self.fps = function(value) {
				if (!arguments.length) {
					return _fps;
				}
				_fps = value;
				_gap = 1 / (_fps || 60);
				_nextTime = this.time + _gap;
				_self.wake();
			};

			_self.useRAF = function(value) {
				if (!arguments.length) {
					return _useRAF;
				}
				_self.sleep();
				_useRAF = value;
				_self.fps(_fps);
			};
			_self.fps(fps);

			//a bug in iOS 6 Safari occasionally prevents the requestAnimationFrame from working initially, so we use a 1.5-second timeout that automatically falls back to setTimeout() if it senses this condition.
			setTimeout(function() {
				if (_useRAF && _self.frame < 5) {
					_self.useRAF(false);
				}
			}, 1500);
		});

		p = gs.Ticker.prototype = new gs.events.EventDispatcher();
		p.constructor = gs.Ticker;


/*
 * ----------------------------------------------------------------
 * Animation
 * ----------------------------------------------------------------
 */
		var Animation = _class("core.Animation", function(duration, vars) {
				this.vars = vars = vars || {};
				this._duration = this._totalDuration = duration || 0;
				this._delay = Number(vars.delay) || 0;
				this._timeScale = 1;
				this._active = (vars.immediateRender === true);
				this.data = vars.data;
				this._reversed = (vars.reversed === true);

				if (!_rootTimeline) {
					return;
				}
				if (!_tickerActive) { //some browsers (like iOS 6 Safari) shut down JavaScript execution when the tab is disabled and they [occasionally] neglect to start up requestAnimationFrame again when returning - this code ensures that the engine starts up again properly.
					_ticker.wake();
				}

				var tl = this.vars.useFrames ? _rootFramesTimeline : _rootTimeline;
				tl.add(this, tl._time);

				if (this.vars.paused) {
					this.paused(true);
				}
			});

		_ticker = Animation.ticker = new gs.Ticker();
		p = Animation.prototype;
		p._dirty = p._gc = p._initted = p._paused = false;
		p._totalTime = p._time = 0;
		p._rawPrevTime = -1;
		p._next = p._last = p._onUpdate = p._timeline = p.timeline = null;
		p._paused = false;


		//some browsers (like iOS) occasionally drop the requestAnimationFrame event when the user switches to a different tab and then comes back again, so we use a 2-second setTimeout() to sense if/when that condition occurs and then wake() the ticker.
		var _checkTimeout = function() {
				if (_tickerActive && _getTime() - _lastUpdate > 2000) {
					_ticker.wake();
				}
				setTimeout(_checkTimeout, 2000);
			};
		_checkTimeout();


		p.play = function(from, suppressEvents) {
			if (from != null) {
				this.seek(from, suppressEvents);
			}
			return this.reversed(false).paused(false);
		};

		p.pause = function(atTime, suppressEvents) {
			if (atTime != null) {
				this.seek(atTime, suppressEvents);
			}
			return this.paused(true);
		};

		p.resume = function(from, suppressEvents) {
			if (from != null) {
				this.seek(from, suppressEvents);
			}
			return this.paused(false);
		};

		p.seek = function(time, suppressEvents) {
			return this.totalTime(Number(time), suppressEvents !== false);
		};

		p.restart = function(includeDelay, suppressEvents) {
			return this.reversed(false).paused(false).totalTime(includeDelay ? -this._delay : 0, (suppressEvents !== false), true);
		};

		p.reverse = function(from, suppressEvents) {
			if (from != null) {
				this.seek((from || this.totalDuration()), suppressEvents);
			}
			return this.reversed(true).paused(false);
		};

		p.render = function(time, suppressEvents, force) {
			//stub - we override this method in subclasses.
		};

		p.invalidate = function() {
			this._time = this._totalTime = 0;
			this._initted = this._gc = false;
			this._rawPrevTime = -1;
			if (this._gc || !this.timeline) {
				this._enabled(true);
			}
			return this;
		};

		p.isActive = function() {
			var tl = this._timeline, //the 2 root timelines won't have a _timeline; they're always active.
				startTime = this._startTime,
				rawTime;
			return (!tl || (!this._gc && !this._paused && tl.isActive() && (rawTime = tl.rawTime()) >= startTime && rawTime < startTime + this.totalDuration() / this._timeScale));
		};

		p._enabled = function (enabled, ignoreTimeline) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			this._gc = !enabled;
			this._active = this.isActive();
			if (ignoreTimeline !== true) {
				if (enabled && !this.timeline) {
					this._timeline.add(this, this._startTime - this._delay);
				} else if (!enabled && this.timeline) {
					this._timeline._remove(this, true);
				}
			}
			return false;
		};


		p._kill = function(vars, target) {
			return this._enabled(false, false);
		};

		p.kill = function(vars, target) {
			this._kill(vars, target);
			return this;
		};

		p._uncache = function(includeSelf) {
			var tween = includeSelf ? this : this.timeline;
			while (tween) {
				tween._dirty = true;
				tween = tween.timeline;
			}
			return this;
		};

		p._swapSelfInParams = function(params) {
			var i = params.length,
				copy = params.concat();
			while (--i > -1) {
				if (params[i] === "{self}") {
					copy[i] = this;
				}
			}
			return copy;
		};

		p._callback = function(type) {
			var v = this.vars;
			v[type].apply(v[type + "Scope"] || v.callbackScope || this, v[type + "Params"] || _blankArray);
		};

//----Animation getters/setters --------------------------------------------------------

		p.eventCallback = function(type, callback, params, scope) {
			if ((type || "").substr(0,2) === "on") {
				var v = this.vars;
				if (arguments.length === 1) {
					return v[type];
				}
				if (callback == null) {
					delete v[type];
				} else {
					v[type] = callback;
					v[type + "Params"] = (_isArray(params) && params.join("").indexOf("{self}") !== -1) ? this._swapSelfInParams(params) : params;
					v[type + "Scope"] = scope;
				}
				if (type === "onUpdate") {
					this._onUpdate = callback;
				}
			}
			return this;
		};

		p.delay = function(value) {
			if (!arguments.length) {
				return this._delay;
			}
			if (this._timeline.smoothChildTiming) {
				this.startTime( this._startTime + value - this._delay );
			}
			this._delay = value;
			return this;
		};

		p.duration = function(value) {
			if (!arguments.length) {
				this._dirty = false;
				return this._duration;
			}
			this._duration = this._totalDuration = value;
			this._uncache(true); //true in case it's a TweenMax or TimelineMax that has a repeat - we'll need to refresh the totalDuration.
			if (this._timeline.smoothChildTiming) if (this._time > 0) if (this._time < this._duration) if (value !== 0) {
				this.totalTime(this._totalTime * (value / this._duration), true);
			}
			return this;
		};

		p.totalDuration = function(value) {
			this._dirty = false;
			return (!arguments.length) ? this._totalDuration : this.duration(value);
		};

		p.time = function(value, suppressEvents) {
			if (!arguments.length) {
				return this._time;
			}
			if (this._dirty) {
				this.totalDuration();
			}
			return this.totalTime((value > this._duration) ? this._duration : value, suppressEvents);
		};

		p.totalTime = function(time, suppressEvents, uncapped) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			if (!arguments.length) {
				return this._totalTime;
			}
			if (this._timeline) {
				if (time < 0 && !uncapped) {
					time += this.totalDuration();
				}
				if (this._timeline.smoothChildTiming) {
					if (this._dirty) {
						this.totalDuration();
					}
					var totalDuration = this._totalDuration,
						tl = this._timeline;
					if (time > totalDuration && !uncapped) {
						time = totalDuration;
					}
					this._startTime = (this._paused ? this._pauseTime : tl._time) - ((!this._reversed ? time : totalDuration - time) / this._timeScale);
					if (!tl._dirty) { //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
						this._uncache(false);
					}
					//in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The startTime of that child would get pushed out, but one of the ancestors may have completed.
					if (tl._timeline) {
						while (tl._timeline) {
							if (tl._timeline._time !== (tl._startTime + tl._totalTime) / tl._timeScale) {
								tl.totalTime(tl._totalTime, true);
							}
							tl = tl._timeline;
						}
					}
				}
				if (this._gc) {
					this._enabled(true, false);
				}
				if (this._totalTime !== time || this._duration === 0) {
					this.render(time, suppressEvents, false);
					if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
						_lazyRender();
					}
				}
			}
			return this;
		};

		p.progress = p.totalProgress = function(value, suppressEvents) {
			return (!arguments.length) ? this._time / this.duration() : this.totalTime(this.duration() * value, suppressEvents);
		};

		p.startTime = function(value) {
			if (!arguments.length) {
				return this._startTime;
			}
			if (value !== this._startTime) {
				this._startTime = value;
				if (this.timeline) if (this.timeline._sortChildren) {
					this.timeline.add(this, value - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
				}
			}
			return this;
		};

		p.endTime = function(includeRepeats) {
			return this._startTime + ((includeRepeats != false) ? this.totalDuration() : this.duration()) / this._timeScale;
		};

		p.timeScale = function(value) {
			if (!arguments.length) {
				return this._timeScale;
			}
			value = value || _tinyNum; //can't allow zero because it'll throw the math off
			if (this._timeline && this._timeline.smoothChildTiming) {
				var pauseTime = this._pauseTime,
					t = (pauseTime || pauseTime === 0) ? pauseTime : this._timeline.totalTime();
				this._startTime = t - ((t - this._startTime) * this._timeScale / value);
			}
			this._timeScale = value;
			return this._uncache(false);
		};

		p.reversed = function(value) {
			if (!arguments.length) {
				return this._reversed;
			}
			if (value != this._reversed) {
				this._reversed = value;
				this.totalTime(((this._timeline && !this._timeline.smoothChildTiming) ? this.totalDuration() - this._totalTime : this._totalTime), true);
			}
			return this;
		};

		p.paused = function(value) {
			if (!arguments.length) {
				return this._paused;
			}
			var tl = this._timeline,
				raw, elapsed;
			if (value != this._paused) if (tl) {
				if (!_tickerActive && !value) {
					_ticker.wake();
				}
				raw = tl.rawTime();
				elapsed = raw - this._pauseTime;
				if (!value && tl.smoothChildTiming) {
					this._startTime += elapsed;
					this._uncache(false);
				}
				this._pauseTime = value ? raw : null;
				this._paused = value;
				this._active = this.isActive();
				if (!value && elapsed !== 0 && this._initted && this.duration()) {
					this.render((tl.smoothChildTiming ? this._totalTime : (raw - this._startTime) / this._timeScale), true, true); //in case the target's properties changed via some other tween or manual update by the user, we should force a render.
				}
			}
			if (this._gc && !value) {
				this._enabled(true, false);
			}
			return this;
		};


/*
 * ----------------------------------------------------------------
 * SimpleTimeline
 * ----------------------------------------------------------------
 */
		var SimpleTimeline = _class("core.SimpleTimeline", function(vars) {
			Animation.call(this, 0, vars);
			this.autoRemoveChildren = this.smoothChildTiming = true;
		});

		p = SimpleTimeline.prototype = new Animation();
		p.constructor = SimpleTimeline;
		p.kill()._gc = false;
		p._first = p._last = p._recent = null;
		p._sortChildren = false;

		p.add = p.insert = function(child, position, align, stagger) {
			var prevTween, st;
			child._startTime = Number(position || 0) + child._delay;
			if (child._paused) if (this !== child._timeline) { //we only adjust the _pauseTime if it wasn't in this timeline already. Remember, sometimes a tween will be inserted again into the same timeline when its startTime is changed so that the tweens in the TimelineLite/Max are re-ordered properly in the linked list (so everything renders in the proper order).
				child._pauseTime = child._startTime + ((this.rawTime() - child._startTime) / child._timeScale);
			}
			if (child.timeline) {
				child.timeline._remove(child, true); //removes from existing timeline so that it can be properly added to this one.
			}
			child.timeline = child._timeline = this;
			if (child._gc) {
				child._enabled(true, true);
			}
			prevTween = this._last;
			if (this._sortChildren) {
				st = child._startTime;
				while (prevTween && prevTween._startTime > st) {
					prevTween = prevTween._prev;
				}
			}
			if (prevTween) {
				child._next = prevTween._next;
				prevTween._next = child;
			} else {
				child._next = this._first;
				this._first = child;
			}
			if (child._next) {
				child._next._prev = child;
			} else {
				this._last = child;
			}
			child._prev = prevTween;
			this._recent = child;
			if (this._timeline) {
				this._uncache(true);
			}
			return this;
		};

		p._remove = function(tween, skipDisable) {
			if (tween.timeline === this) {
				if (!skipDisable) {
					tween._enabled(false, true);
				}

				if (tween._prev) {
					tween._prev._next = tween._next;
				} else if (this._first === tween) {
					this._first = tween._next;
				}
				if (tween._next) {
					tween._next._prev = tween._prev;
				} else if (this._last === tween) {
					this._last = tween._prev;
				}
				tween._next = tween._prev = tween.timeline = null;
				if (tween === this._recent) {
					this._recent = this._last;
				}

				if (this._timeline) {
					this._uncache(true);
				}
			}
			return this;
		};

		p.render = function(time, suppressEvents, force) {
			var tween = this._first,
				next;
			this._totalTime = this._time = this._rawPrevTime = time;
			while (tween) {
				next = tween._next; //record it here because the value could change after rendering...
				if (tween._active || (time >= tween._startTime && !tween._paused)) {
					if (!tween._reversed) {
						tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
					} else {
						tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
					}
				}
				tween = next;
			}
		};

		p.rawTime = function() {
			if (!_tickerActive) {
				_ticker.wake();
			}
			return this._totalTime;
		};

/*
 * ----------------------------------------------------------------
 * TweenLite
 * ----------------------------------------------------------------
 */
		var TweenLite = _class("TweenLite", function(target, duration, vars) {
				Animation.call(this, duration, vars);
				this.render = TweenLite.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)

				if (target == null) {
					throw "Cannot tween a null target.";
				}

				this.target = target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;

				var isSelector = (target.jquery || (target.length && target !== window && target[0] && (target[0] === window || (target[0].nodeType && target[0].style && !target.nodeType)))),
					overwrite = this.vars.overwrite,
					i, targ, targets;

				this._overwrite = overwrite = (overwrite == null) ? _overwriteLookup[TweenLite.defaultOverwrite] : (typeof(overwrite) === "number") ? overwrite >> 0 : _overwriteLookup[overwrite];

				if ((isSelector || target instanceof Array || (target.push && _isArray(target))) && typeof(target[0]) !== "number") {
					this._targets = targets = _slice(target);  //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
					this._propLookup = [];
					this._siblings = [];
					for (i = 0; i < targets.length; i++) {
						targ = targets[i];
						if (!targ) {
							targets.splice(i--, 1);
							continue;
						} else if (typeof(targ) === "string") {
							targ = targets[i--] = TweenLite.selector(targ); //in case it's an array of strings
							if (typeof(targ) === "string") {
								targets.splice(i+1, 1); //to avoid an endless loop (can't imagine why the selector would return a string, but just in case)
							}
							continue;
						} else if (targ.length && targ !== window && targ[0] && (targ[0] === window || (targ[0].nodeType && targ[0].style && !targ.nodeType))) { //in case the user is passing in an array of selector objects (like jQuery objects), we need to check one more level and pull things out if necessary. Also note that <select> elements pass all the criteria regarding length and the first child having style, so we must also check to ensure the target isn't an HTML node itself.
							targets.splice(i--, 1);
							this._targets = targets = targets.concat(_slice(targ));
							continue;
						}
						this._siblings[i] = _register(targ, this, false);
						if (overwrite === 1) if (this._siblings[i].length > 1) {
							_applyOverwrite(targ, this, null, 1, this._siblings[i]);
						}
					}

				} else {
					this._propLookup = {};
					this._siblings = _register(target, this, false);
					if (overwrite === 1) if (this._siblings.length > 1) {
						_applyOverwrite(target, this, null, 1, this._siblings);
					}
				}
				if (this.vars.immediateRender || (duration === 0 && this._delay === 0 && this.vars.immediateRender !== false)) {
					this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
					this.render(-this._delay);
				}
			}, true),
			_isSelector = function(v) {
				return (v && v.length && v !== window && v[0] && (v[0] === window || (v[0].nodeType && v[0].style && !v.nodeType))); //we cannot check "nodeType" if the target is window from within an iframe, otherwise it will trigger a security error in some browsers like Firefox.
			},
			_autoCSS = function(vars, target) {
				var css = {},
					p;
				for (p in vars) {
					if (!_reservedProps[p] && (!(p in target) || p === "transform" || p === "x" || p === "y" || p === "width" || p === "height" || p === "className" || p === "border") && (!_plugins[p] || (_plugins[p] && _plugins[p]._autoCSS))) { //note: <img> elements contain read-only "x" and "y" properties. We should also prioritize editing css width/height rather than the element's properties.
						css[p] = vars[p];
						delete vars[p];
					}
				}
				vars.css = css;
			};

		p = TweenLite.prototype = new Animation();
		p.constructor = TweenLite;
		p.kill()._gc = false;

//----TweenLite defaults, overwrite management, and root updates ----------------------------------------------------

		p.ratio = 0;
		p._firstPT = p._targets = p._overwrittenProps = p._startAt = null;
		p._notifyPluginsOfEnabled = p._lazy = false;

		TweenLite.version = "1.17.0";
		TweenLite.defaultEase = p._ease = new Ease(null, null, 1, 1);
		TweenLite.defaultOverwrite = "auto";
		TweenLite.ticker = _ticker;
		TweenLite.autoSleep = 120;
		TweenLite.lagSmoothing = function(threshold, adjustedLag) {
			_ticker.lagSmoothing(threshold, adjustedLag);
		};

		TweenLite.selector = window.$ || window.jQuery || function(e) {
			var selector = window.$ || window.jQuery;
			if (selector) {
				TweenLite.selector = selector;
				return selector(e);
			}
			return (typeof(document) === "undefined") ? e : (document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById((e.charAt(0) === "#") ? e.substr(1) : e));
		};

		var _lazyTweens = [],
			_lazyLookup = {},
			_internals = TweenLite._internals = {isArray:_isArray, isSelector:_isSelector, lazyTweens:_lazyTweens}, //gives us a way to expose certain private values to other GreenSock classes without contaminating tha main TweenLite object.
			_plugins = TweenLite._plugins = {},
			_tweenLookup = _internals.tweenLookup = {},
			_tweenLookupNum = 0,
			_reservedProps = _internals.reservedProps = {ease:1, delay:1, overwrite:1, onComplete:1, onCompleteParams:1, onCompleteScope:1, useFrames:1, runBackwards:1, startAt:1, onUpdate:1, onUpdateParams:1, onUpdateScope:1, onStart:1, onStartParams:1, onStartScope:1, onReverseComplete:1, onReverseCompleteParams:1, onReverseCompleteScope:1, onRepeat:1, onRepeatParams:1, onRepeatScope:1, easeParams:1, yoyo:1, immediateRender:1, repeat:1, repeatDelay:1, data:1, paused:1, reversed:1, autoCSS:1, lazy:1, onOverwrite:1, callbackScope:1},
			_overwriteLookup = {none:0, all:1, auto:2, concurrent:3, allOnStart:4, preexisting:5, "true":1, "false":0},
			_rootFramesTimeline = Animation._rootFramesTimeline = new SimpleTimeline(),
			_rootTimeline = Animation._rootTimeline = new SimpleTimeline(),
			_nextGCFrame = 30,
			_lazyRender = _internals.lazyRender = function() {
				var i = _lazyTweens.length,
					tween;
				_lazyLookup = {};
				while (--i > -1) {
					tween = _lazyTweens[i];
					if (tween && tween._lazy !== false) {
						tween.render(tween._lazy[0], tween._lazy[1], true);
						tween._lazy = false;
					}
				}
				_lazyTweens.length = 0;
			};

		_rootTimeline._startTime = _ticker.time;
		_rootFramesTimeline._startTime = _ticker.frame;
		_rootTimeline._active = _rootFramesTimeline._active = true;
		setTimeout(_lazyRender, 1); //on some mobile devices, there isn't a "tick" before code runs which means any lazy renders wouldn't run before the next official "tick".

		Animation._updateRoot = TweenLite.render = function() {
				var i, a, p;
				if (_lazyTweens.length) { //if code is run outside of the requestAnimationFrame loop, there may be tweens queued AFTER the engine refreshed, so we need to ensure any pending renders occur before we refresh again.
					_lazyRender();
				}
				_rootTimeline.render((_ticker.time - _rootTimeline._startTime) * _rootTimeline._timeScale, false, false);
				_rootFramesTimeline.render((_ticker.frame - _rootFramesTimeline._startTime) * _rootFramesTimeline._timeScale, false, false);
				if (_lazyTweens.length) {
					_lazyRender();
				}
				if (_ticker.frame >= _nextGCFrame) { //dump garbage every 120 frames or whatever the user sets TweenLite.autoSleep to
					_nextGCFrame = _ticker.frame + (parseInt(TweenLite.autoSleep, 10) || 120);
					for (p in _tweenLookup) {
						a = _tweenLookup[p].tweens;
						i = a.length;
						while (--i > -1) {
							if (a[i]._gc) {
								a.splice(i, 1);
							}
						}
						if (a.length === 0) {
							delete _tweenLookup[p];
						}
					}
					//if there are no more tweens in the root timelines, or if they're all paused, make the _timer sleep to reduce load on the CPU slightly
					p = _rootTimeline._first;
					if (!p || p._paused) if (TweenLite.autoSleep && !_rootFramesTimeline._first && _ticker._listeners.tick.length === 1) {
						while (p && p._paused) {
							p = p._next;
						}
						if (!p) {
							_ticker.sleep();
						}
					}
				}
			};

		_ticker.addEventListener("tick", Animation._updateRoot);

		var _register = function(target, tween, scrub) {
				var id = target._gsTweenID, a, i;
				if (!_tweenLookup[id || (target._gsTweenID = id = "t" + (_tweenLookupNum++))]) {
					_tweenLookup[id] = {target:target, tweens:[]};
				}
				if (tween) {
					a = _tweenLookup[id].tweens;
					a[(i = a.length)] = tween;
					if (scrub) {
						while (--i > -1) {
							if (a[i] === tween) {
								a.splice(i, 1);
							}
						}
					}
				}
				return _tweenLookup[id].tweens;
			},

			_onOverwrite = function(overwrittenTween, overwritingTween, target, killedProps) {
				var func = overwrittenTween.vars.onOverwrite, r1, r2;
				if (func) {
					r1 = func(overwrittenTween, overwritingTween, target, killedProps);
				}
				func = TweenLite.onOverwrite;
				if (func) {
					r2 = func(overwrittenTween, overwritingTween, target, killedProps);
				}
				return (r1 !== false && r2 !== false);
			},
			_applyOverwrite = function(target, tween, props, mode, siblings) {
				var i, changed, curTween, l;
				if (mode === 1 || mode >= 4) {
					l = siblings.length;
					for (i = 0; i < l; i++) {
						if ((curTween = siblings[i]) !== tween) {
							if (!curTween._gc) {
								if (curTween._kill(null, target, tween)) {
									changed = true;
								}
							}
						} else if (mode === 5) {
							break;
						}
					}
					return changed;
				}
				//NOTE: Add 0.0000000001 to overcome floating point errors that can cause the startTime to be VERY slightly off (when a tween's time() is set for example)
				var startTime = tween._startTime + _tinyNum,
					overlaps = [],
					oCount = 0,
					zeroDur = (tween._duration === 0),
					globalStart;
				i = siblings.length;
				while (--i > -1) {
					if ((curTween = siblings[i]) === tween || curTween._gc || curTween._paused) {
						//ignore
					} else if (curTween._timeline !== tween._timeline) {
						globalStart = globalStart || _checkOverlap(tween, 0, zeroDur);
						if (_checkOverlap(curTween, globalStart, zeroDur) === 0) {
							overlaps[oCount++] = curTween;
						}
					} else if (curTween._startTime <= startTime) if (curTween._startTime + curTween.totalDuration() / curTween._timeScale > startTime) if (!((zeroDur || !curTween._initted) && startTime - curTween._startTime <= 0.0000000002)) {
						overlaps[oCount++] = curTween;
					}
				}

				i = oCount;
				while (--i > -1) {
					curTween = overlaps[i];
					if (mode === 2) if (curTween._kill(props, target, tween)) {
						changed = true;
					}
					if (mode !== 2 || (!curTween._firstPT && curTween._initted)) {
						if (mode !== 2 && !_onOverwrite(curTween, tween)) {
							continue;
						}
						if (curTween._enabled(false, false)) { //if all property tweens have been overwritten, kill the tween.
							changed = true;
						}
					}
				}
				return changed;
			},

			_checkOverlap = function(tween, reference, zeroDur) {
				var tl = tween._timeline,
					ts = tl._timeScale,
					t = tween._startTime;
				while (tl._timeline) {
					t += tl._startTime;
					ts *= tl._timeScale;
					if (tl._paused) {
						return -100;
					}
					tl = tl._timeline;
				}
				t /= ts;
				return (t > reference) ? t - reference : ((zeroDur && t === reference) || (!tween._initted && t - reference < 2 * _tinyNum)) ? _tinyNum : ((t += tween.totalDuration() / tween._timeScale / ts) > reference + _tinyNum) ? 0 : t - reference - _tinyNum;
			};


//---- TweenLite instance methods -----------------------------------------------------------------------------

		p._init = function() {
			var v = this.vars,
				op = this._overwrittenProps,
				dur = this._duration,
				immediate = !!v.immediateRender,
				ease = v.ease,
				i, initPlugins, pt, p, startVars;
			if (v.startAt) {
				if (this._startAt) {
					this._startAt.render(-1, true); //if we've run a startAt previously (when the tween instantiated), we should revert it so that the values re-instantiate correctly particularly for relative tweens. Without this, a TweenLite.fromTo(obj, 1, {x:"+=100"}, {x:"-=100"}), for example, would actually jump to +=200 because the startAt would run twice, doubling the relative change.
					this._startAt.kill();
				}
				startVars = {};
				for (p in v.startAt) { //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, 1, from, to).fromTo(e, 1, to, from);
					startVars[p] = v.startAt[p];
				}
				startVars.overwrite = false;
				startVars.immediateRender = true;
				startVars.lazy = (immediate && v.lazy !== false);
				startVars.startAt = startVars.delay = null; //no nesting of startAt objects allowed (otherwise it could cause an infinite loop).
				this._startAt = TweenLite.to(this.target, 0, startVars);
				if (immediate) {
					if (this._time > 0) {
						this._startAt = null; //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in TimelineLite/Max instances where immediateRender was false (which is the default in the convenience methods like from()).
					} else if (dur !== 0) {
						return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a TimelineLite or TimelineMax, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
					}
				}
			} else if (v.runBackwards && dur !== 0) {
				//from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
				if (this._startAt) {
					this._startAt.render(-1, true);
					this._startAt.kill();
					this._startAt = null;
				} else {
					if (this._time !== 0) { //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0
						immediate = false;
					}
					pt = {};
					for (p in v) { //copy props into a new object and skip any reserved props, otherwise onComplete or onUpdate or onStart could fire. We should, however, permit autoCSS to go through.
						if (!_reservedProps[p] || p === "autoCSS") {
							pt[p] = v[p];
						}
					}
					pt.overwrite = 0;
					pt.data = "isFromStart"; //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
					pt.lazy = (immediate && v.lazy !== false);
					pt.immediateRender = immediate; //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
					this._startAt = TweenLite.to(this.target, 0, pt);
					if (!immediate) {
						this._startAt._init(); //ensures that the initial values are recorded
						this._startAt._enabled(false); //no need to have the tween render on the next cycle. Disable it because we'll always manually control the renders of the _startAt tween.
						if (this.vars.immediateRender) {
							this._startAt = null;
						}
					} else if (this._time === 0) {
						return;
					}
				}
			}
			this._ease = ease = (!ease) ? TweenLite.defaultEase : (ease instanceof Ease) ? ease : (typeof(ease) === "function") ? new Ease(ease, v.easeParams) : _easeMap[ease] || TweenLite.defaultEase;
			if (v.easeParams instanceof Array && ease.config) {
				this._ease = ease.config.apply(ease, v.easeParams);
			}
			this._easeType = this._ease._type;
			this._easePower = this._ease._power;
			this._firstPT = null;

			if (this._targets) {
				i = this._targets.length;
				while (--i > -1) {
					if ( this._initProps( this._targets[i], (this._propLookup[i] = {}), this._siblings[i], (op ? op[i] : null)) ) {
						initPlugins = true;
					}
				}
			} else {
				initPlugins = this._initProps(this.target, this._propLookup, this._siblings, op);
			}

			if (initPlugins) {
				TweenLite._onPluginEvent("_onInitAllProps", this); //reorders the array in order of priority. Uses a static TweenPlugin method in order to minimize file size in TweenLite
			}
			if (op) if (!this._firstPT) if (typeof(this.target) !== "function") { //if all tweening properties have been overwritten, kill the tween. If the target is a function, it's probably a delayedCall so let it live.
				this._enabled(false, false);
			}
			if (v.runBackwards) {
				pt = this._firstPT;
				while (pt) {
					pt.s += pt.c;
					pt.c = -pt.c;
					pt = pt._next;
				}
			}
			this._onUpdate = v.onUpdate;
			this._initted = true;
		};

		p._initProps = function(target, propLookup, siblings, overwrittenProps) {
			var p, i, initPlugins, plugin, pt, v;
			if (target == null) {
				return false;
			}

			if (_lazyLookup[target._gsTweenID]) {
				_lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)
			}

			if (!this.vars.css) if (target.style) if (target !== window && target.nodeType) if (_plugins.css) if (this.vars.autoCSS !== false) { //it's so common to use TweenLite/Max to animate the css of DOM elements, we assume that if the target is a DOM element, that's what is intended (a convenience so that users don't have to wrap things in css:{}, although we still recommend it for a slight performance boost and better specificity). Note: we cannot check "nodeType" on the window inside an iframe.
				_autoCSS(this.vars, target);
			}
			for (p in this.vars) {
				v = this.vars[p];
				if (_reservedProps[p]) {
					if (v) if ((v instanceof Array) || (v.push && _isArray(v))) if (v.join("").indexOf("{self}") !== -1) {
						this.vars[p] = v = this._swapSelfInParams(v, this);
					}

				} else if (_plugins[p] && (plugin = new _plugins[p]())._onInitTween(target, this.vars[p], this)) {

					//t - target 		[object]
					//p - property 		[string]
					//s - start			[number]
					//c - change		[number]
					//f - isFunction	[boolean]
					//n - name			[string]
					//pg - isPlugin 	[boolean]
					//pr - priority		[number]
					this._firstPT = pt = {_next:this._firstPT, t:plugin, p:"setRatio", s:0, c:1, f:true, n:p, pg:true, pr:plugin._priority};
					i = plugin._overwriteProps.length;
					while (--i > -1) {
						propLookup[plugin._overwriteProps[i]] = this._firstPT;
					}
					if (plugin._priority || plugin._onInitAllProps) {
						initPlugins = true;
					}
					if (plugin._onDisable || plugin._onEnable) {
						this._notifyPluginsOfEnabled = true;
					}

				} else {
					this._firstPT = propLookup[p] = pt = {_next:this._firstPT, t:target, p:p, f:(typeof(target[p]) === "function"), n:p, pg:false, pr:0};
					pt.s = (!pt.f) ? parseFloat(target[p]) : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]();
					pt.c = (typeof(v) === "string" && v.charAt(1) === "=") ? parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) : (Number(v) - pt.s) || 0;
				}
				if (pt) if (pt._next) {
					pt._next._prev = pt;
				}
			}

			if (overwrittenProps) if (this._kill(overwrittenProps, target)) { //another tween may have tried to overwrite properties of this tween before init() was called (like if two tweens start at the same time, the one created second will run first)
				return this._initProps(target, propLookup, siblings, overwrittenProps);
			}
			if (this._overwrite > 1) if (this._firstPT) if (siblings.length > 1) if (_applyOverwrite(target, this, propLookup, this._overwrite, siblings)) {
				this._kill(propLookup, target);
				return this._initProps(target, propLookup, siblings, overwrittenProps);
			}
			if (this._firstPT) if ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration)) { //zero duration tweens don't lazy render by default; everything else does.
				_lazyLookup[target._gsTweenID] = true;
			}
			return initPlugins;
		};

		p.render = function(time, suppressEvents, force) {
			var prevTime = this._time,
				duration = this._duration,
				prevRawPrevTime = this._rawPrevTime,
				isComplete, callback, pt, rawPrevTime;
			if (time >= duration) {
				this._totalTime = this._time = duration;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1;
				if (!this._reversed ) {
					isComplete = true;
					callback = "onComplete";
					force = (force || this._timeline.autoRemoveChildren); //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
				}
				if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
					if (this._startTime === this._timeline._duration) { //if a zero-duration tween is at the VERY end of a timeline and that timeline renders at its end, it will typically add a tiny bit of cushion to the render time to prevent rounding errors from getting in the way of tweens rendering their VERY end. If we then reverse() that timeline, the zero-duration tween will trigger its onReverseComplete even though technically the playhead didn't pass over it again. It's a very specific edge case we must accommodate.
						time = 0;
					}
					if (time === 0 || prevRawPrevTime < 0 || (prevRawPrevTime === _tinyNum && this.data !== "isPause")) if (prevRawPrevTime !== time) { //note: when this.data is "isPause", it's a callback added by addPause() on a timeline that we should not be triggered when LEAVING its exact start time. In other words, tl.addPause(1).play(1) shouldn't pause.
						force = true;
						if (prevRawPrevTime > _tinyNum) {
							callback = "onReverseComplete";
						}
					}
					this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
				}

			} else if (time < 0.0000001) { //to work around occasional floating point math artifacts, round super small values to 0.
				this._totalTime = this._time = 0;
				this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0;
				if (prevTime !== 0 || (duration === 0 && prevRawPrevTime > 0)) {
					callback = "onReverseComplete";
					isComplete = this._reversed;
				}
				if (time < 0) {
					this._active = false;
					if (duration === 0) if (this._initted || !this.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
						if (prevRawPrevTime >= 0 && !(prevRawPrevTime === _tinyNum && this.data === "isPause")) {
							force = true;
						}
						this._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
					}
				}
				if (!this._initted) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
					force = true;
				}
			} else {
				this._totalTime = this._time = time;

				if (this._easeType) {
					var r = time / duration, type = this._easeType, pow = this._easePower;
					if (type === 1 || (type === 3 && r >= 0.5)) {
						r = 1 - r;
					}
					if (type === 3) {
						r *= 2;
					}
					if (pow === 1) {
						r *= r;
					} else if (pow === 2) {
						r *= r * r;
					} else if (pow === 3) {
						r *= r * r * r;
					} else if (pow === 4) {
						r *= r * r * r * r;
					}

					if (type === 1) {
						this.ratio = 1 - r;
					} else if (type === 2) {
						this.ratio = r;
					} else if (time / duration < 0.5) {
						this.ratio = r / 2;
					} else {
						this.ratio = 1 - (r / 2);
					}

				} else {
					this.ratio = this._ease.getRatio(time / duration);
				}
			}

			if (this._time === prevTime && !force) {
				return;
			} else if (!this._initted) {
				this._init();
				if (!this._initted || this._gc) { //immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly. Also, if all of the tweening properties have been overwritten (which would cause _gc to be true, as set in _init()), we shouldn't continue otherwise an onStart callback could be called for example.
					return;
				} else if (!force && this._firstPT && ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration))) {
					this._time = this._totalTime = prevTime;
					this._rawPrevTime = prevRawPrevTime;
					_lazyTweens.push(this);
					this._lazy = [time, suppressEvents];
					return;
				}
				//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
				if (this._time && !isComplete) {
					this.ratio = this._ease.getRatio(this._time / duration);
				} else if (isComplete && this._ease._calcEnd) {
					this.ratio = this._ease.getRatio((this._time === 0) ? 0 : 1);
				}
			}
			if (this._lazy !== false) { //in case a lazy render is pending, we should flush it because the new render is occurring now (imagine a lazy tween instantiating and then immediately the user calls tween.seek(tween.duration()), skipping to the end - the end render would be forced, and then if we didn't flush the lazy render, it'd fire AFTER the seek(), rendering it at the wrong time.
				this._lazy = false;
			}
			if (!this._active) if (!this._paused && this._time !== prevTime && time >= 0) {
				this._active = true;  //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
			}
			if (prevTime === 0) {
				if (this._startAt) {
					if (time >= 0) {
						this._startAt.render(time, suppressEvents, force);
					} else if (!callback) {
						callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
					}
				}
				if (this.vars.onStart) if (this._time !== 0 || duration === 0) if (!suppressEvents) {
					this._callback("onStart");
				}
			}
			pt = this._firstPT;
			while (pt) {
				if (pt.f) {
					pt.t[pt.p](pt.c * this.ratio + pt.s);
				} else {
					pt.t[pt.p] = pt.c * this.ratio + pt.s;
				}
				pt = pt._next;
			}

			if (this._onUpdate) {
				if (time < 0) if (this._startAt && time !== -0.0001) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
					this._startAt.render(time, suppressEvents, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
				}
				if (!suppressEvents) if (this._time !== prevTime || isComplete) {
					this._callback("onUpdate");
				}
			}
			if (callback) if (!this._gc || force) { //check _gc because there's a chance that kill() could be called in an onUpdate
				if (time < 0 && this._startAt && !this._onUpdate && time !== -0.0001) { //-0.0001 is a special value that we use when looping back to the beginning of a repeated TimelineMax, in which case we shouldn't render the _startAt values.
					this._startAt.render(time, suppressEvents, force);
				}
				if (isComplete) {
					if (this._timeline.autoRemoveChildren) {
						this._enabled(false, false);
					}
					this._active = false;
				}
				if (!suppressEvents && this.vars[callback]) {
					this._callback(callback);
				}
				if (duration === 0 && this._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) { //the onComplete or onReverseComplete could trigger movement of the playhead and for zero-duration tweens (which must discern direction) that land directly back on their start time, we don't want to fire again on the next render. Think of several addPause()'s in a timeline that forces the playhead to a certain spot, but what if it's already paused and another tween is tweening the "time" of the timeline? Each time it moves [forward] past that spot, it would move back, and since suppressEvents is true, it'd reset _rawPrevTime to _tinyNum so that when it begins again, the callback would fire (so ultimately it could bounce back and forth during that tween). Again, this is a very uncommon scenario, but possible nonetheless.
					this._rawPrevTime = 0;
				}
			}
		};

		p._kill = function(vars, target, overwritingTween) {
			if (vars === "all") {
				vars = null;
			}
			if (vars == null) if (target == null || target === this.target) {
				this._lazy = false;
				return this._enabled(false, false);
			}
			target = (typeof(target) !== "string") ? (target || this._targets || this.target) : TweenLite.selector(target) || target;
			var simultaneousOverwrite = (overwritingTween && this._time && overwritingTween._startTime === this._startTime && this._timeline === overwritingTween._timeline),
				i, overwrittenProps, p, pt, propLookup, changed, killProps, record, killed;
			if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
				i = target.length;
				while (--i > -1) {
					if (this._kill(vars, target[i], overwritingTween)) {
						changed = true;
					}
				}
			} else {
				if (this._targets) {
					i = this._targets.length;
					while (--i > -1) {
						if (target === this._targets[i]) {
							propLookup = this._propLookup[i] || {};
							this._overwrittenProps = this._overwrittenProps || [];
							overwrittenProps = this._overwrittenProps[i] = vars ? this._overwrittenProps[i] || {} : "all";
							break;
						}
					}
				} else if (target !== this.target) {
					return false;
				} else {
					propLookup = this._propLookup;
					overwrittenProps = this._overwrittenProps = vars ? this._overwrittenProps || {} : "all";
				}

				if (propLookup) {
					killProps = vars || propLookup;
					record = (vars !== overwrittenProps && overwrittenProps !== "all" && vars !== propLookup && (typeof(vars) !== "object" || !vars._tempKill)); //_tempKill is a super-secret way to delete a particular tweening property but NOT have it remembered as an official overwritten property (like in BezierPlugin)
					if (overwritingTween && (TweenLite.onOverwrite || this.vars.onOverwrite)) {
						for (p in killProps) {
							if (propLookup[p]) {
								if (!killed) {
									killed = [];
								}
								killed.push(p);
							}
						}
						if ((killed || !vars) && !_onOverwrite(this, overwritingTween, target, killed)) { //if the onOverwrite returned false, that means the user wants to override the overwriting (cancel it).
							return false;
						}
					}

					for (p in killProps) {
						if ((pt = propLookup[p])) {
							if (simultaneousOverwrite) { //if another tween overwrites this one and they both start at exactly the same time, yet this tween has already rendered once (for example, at 0.001) because it's first in the queue, we should revert the values to where they were at 0 so that the starting values aren't contaminated on the overwriting tween.
								if (pt.f) {
									pt.t[pt.p](pt.s);
								} else {
									pt.t[pt.p] = pt.s;
								}
								changed = true;
							}
							if (pt.pg && pt.t._kill(killProps)) {
								changed = true; //some plugins need to be notified so they can perform cleanup tasks first
							}
							if (!pt.pg || pt.t._overwriteProps.length === 0) {
								if (pt._prev) {
									pt._prev._next = pt._next;
								} else if (pt === this._firstPT) {
									this._firstPT = pt._next;
								}
								if (pt._next) {
									pt._next._prev = pt._prev;
								}
								pt._next = pt._prev = null;
							}
							delete propLookup[p];
						}
						if (record) {
							overwrittenProps[p] = 1;
						}
					}
					if (!this._firstPT && this._initted) { //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.
						this._enabled(false, false);
					}
				}
			}
			return changed;
		};

		p.invalidate = function() {
			if (this._notifyPluginsOfEnabled) {
				TweenLite._onPluginEvent("_onDisable", this);
			}
			this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null;
			this._notifyPluginsOfEnabled = this._active = this._lazy = false;
			this._propLookup = (this._targets) ? {} : [];
			Animation.prototype.invalidate.call(this);
			if (this.vars.immediateRender) {
				this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
				this.render(-this._delay);
			}
			return this;
		};

		p._enabled = function(enabled, ignoreTimeline) {
			if (!_tickerActive) {
				_ticker.wake();
			}
			if (enabled && this._gc) {
				var targets = this._targets,
					i;
				if (targets) {
					i = targets.length;
					while (--i > -1) {
						this._siblings[i] = _register(targets[i], this, true);
					}
				} else {
					this._siblings = _register(this.target, this, true);
				}
			}
			Animation.prototype._enabled.call(this, enabled, ignoreTimeline);
			if (this._notifyPluginsOfEnabled) if (this._firstPT) {
				return TweenLite._onPluginEvent((enabled ? "_onEnable" : "_onDisable"), this);
			}
			return false;
		};


//----TweenLite static methods -----------------------------------------------------

		TweenLite.to = function(target, duration, vars) {
			return new TweenLite(target, duration, vars);
		};

		TweenLite.from = function(target, duration, vars) {
			vars.runBackwards = true;
			vars.immediateRender = (vars.immediateRender != false);
			return new TweenLite(target, duration, vars);
		};

		TweenLite.fromTo = function(target, duration, fromVars, toVars) {
			toVars.startAt = fromVars;
			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
			return new TweenLite(target, duration, toVars);
		};

		TweenLite.delayedCall = function(delay, callback, params, scope, useFrames) {
			return new TweenLite(callback, 0, {delay:delay, onComplete:callback, onCompleteParams:params, callbackScope:scope, onReverseComplete:callback, onReverseCompleteParams:params, immediateRender:false, lazy:false, useFrames:useFrames, overwrite:0});
		};

		TweenLite.set = function(target, vars) {
			return new TweenLite(target, 0, vars);
		};

		TweenLite.getTweensOf = function(target, onlyActive) {
			if (target == null) { return []; }
			target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;
			var i, a, j, t;
			if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
				i = target.length;
				a = [];
				while (--i > -1) {
					a = a.concat(TweenLite.getTweensOf(target[i], onlyActive));
				}
				i = a.length;
				//now get rid of any duplicates (tweens of arrays of objects could cause duplicates)
				while (--i > -1) {
					t = a[i];
					j = i;
					while (--j > -1) {
						if (t === a[j]) {
							a.splice(i, 1);
						}
					}
				}
			} else {
				a = _register(target).concat();
				i = a.length;
				while (--i > -1) {
					if (a[i]._gc || (onlyActive && !a[i].isActive())) {
						a.splice(i, 1);
					}
				}
			}
			return a;
		};

		TweenLite.killTweensOf = TweenLite.killDelayedCallsTo = function(target, onlyActive, vars) {
			if (typeof(onlyActive) === "object") {
				vars = onlyActive; //for backwards compatibility (before "onlyActive" parameter was inserted)
				onlyActive = false;
			}
			var a = TweenLite.getTweensOf(target, onlyActive),
				i = a.length;
			while (--i > -1) {
				a[i]._kill(vars, target);
			}
		};



/*
 * ----------------------------------------------------------------
 * TweenPlugin   (could easily be split out as a separate file/class, but included for ease of use (so that people don't need to include another script call before loading plugins which is easy to forget)
 * ----------------------------------------------------------------
 */
		var TweenPlugin = _class("plugins.TweenPlugin", function(props, priority) {
					this._overwriteProps = (props || "").split(",");
					this._propName = this._overwriteProps[0];
					this._priority = priority || 0;
					this._super = TweenPlugin.prototype;
				}, true);

		p = TweenPlugin.prototype;
		TweenPlugin.version = "1.10.1";
		TweenPlugin.API = 2;
		p._firstPT = null;

		p._addTween = function(target, prop, start, end, overwriteProp, round) {
			var c, pt;
			if (end != null && (c = (typeof(end) === "number" || end.charAt(1) !== "=") ? Number(end) - Number(start) : parseInt(end.charAt(0) + "1", 10) * Number(end.substr(2)))) {
				this._firstPT = pt = {_next:this._firstPT, t:target, p:prop, s:start, c:c, f:(typeof(target[prop]) === "function"), n:overwriteProp || prop, r:round};
				if (pt._next) {
					pt._next._prev = pt;
				}
				return pt;
			}
		};

		p.setRatio = function(v) {
			var pt = this._firstPT,
				min = 0.000001,
				val;
			while (pt) {
				val = pt.c * v + pt.s;
				if (pt.r) {
					val = Math.round(val);
				} else if (val < min) if (val > -min) { //prevents issues with converting very small numbers to strings in the browser
					val = 0;
				}
				if (pt.f) {
					pt.t[pt.p](val);
				} else {
					pt.t[pt.p] = val;
				}
				pt = pt._next;
			}
		};

		p._kill = function(lookup) {
			var a = this._overwriteProps,
				pt = this._firstPT,
				i;
			if (lookup[this._propName] != null) {
				this._overwriteProps = [];
			} else {
				i = a.length;
				while (--i > -1) {
					if (lookup[a[i]] != null) {
						a.splice(i, 1);
					}
				}
			}
			while (pt) {
				if (lookup[pt.n] != null) {
					if (pt._next) {
						pt._next._prev = pt._prev;
					}
					if (pt._prev) {
						pt._prev._next = pt._next;
						pt._prev = null;
					} else if (this._firstPT === pt) {
						this._firstPT = pt._next;
					}
				}
				pt = pt._next;
			}
			return false;
		};

		p._roundProps = function(lookup, value) {
			var pt = this._firstPT;
			while (pt) {
				if (lookup[this._propName] || (pt.n != null && lookup[ pt.n.split(this._propName + "_").join("") ])) { //some properties that are very plugin-specific add a prefix named after the _propName plus an underscore, so we need to ignore that extra stuff here.
					pt.r = value;
				}
				pt = pt._next;
			}
		};

		TweenLite._onPluginEvent = function(type, tween) {
			var pt = tween._firstPT,
				changed, pt2, first, last, next;
			if (type === "_onInitAllProps") {
				//sorts the PropTween linked list in order of priority because some plugins need to render earlier/later than others, like MotionBlurPlugin applies its effects after all x/y/alpha tweens have rendered on each frame.
				while (pt) {
					next = pt._next;
					pt2 = first;
					while (pt2 && pt2.pr > pt.pr) {
						pt2 = pt2._next;
					}
					if ((pt._prev = pt2 ? pt2._prev : last)) {
						pt._prev._next = pt;
					} else {
						first = pt;
					}
					if ((pt._next = pt2)) {
						pt2._prev = pt;
					} else {
						last = pt;
					}
					pt = next;
				}
				pt = tween._firstPT = first;
			}
			while (pt) {
				if (pt.pg) if (typeof(pt.t[type]) === "function") if (pt.t[type]()) {
					changed = true;
				}
				pt = pt._next;
			}
			return changed;
		};

		TweenPlugin.activate = function(plugins) {
			var i = plugins.length;
			while (--i > -1) {
				if (plugins[i].API === TweenPlugin.API) {
					_plugins[(new plugins[i]())._propName] = plugins[i];
				}
			}
			return true;
		};

		//provides a more concise way to define plugins that have no dependencies besides TweenPlugin and TweenLite, wrapping common boilerplate stuff into one function (added in 1.9.0). You don't NEED to use this to define a plugin - the old way still works and can be useful in certain (rare) situations.
		_gsDefine.plugin = function(config) {
			if (!config || !config.propName || !config.init || !config.API) { throw "illegal plugin definition."; }
			var propName = config.propName,
				priority = config.priority || 0,
				overwriteProps = config.overwriteProps,
				map = {init:"_onInitTween", set:"setRatio", kill:"_kill", round:"_roundProps", initAll:"_onInitAllProps"},
				Plugin = _class("plugins." + propName.charAt(0).toUpperCase() + propName.substr(1) + "Plugin",
					function() {
						TweenPlugin.call(this, propName, priority);
						this._overwriteProps = overwriteProps || [];
					}, (config.global === true)),
				p = Plugin.prototype = new TweenPlugin(propName),
				prop;
			p.constructor = Plugin;
			Plugin.API = config.API;
			for (prop in map) {
				if (typeof(config[prop]) === "function") {
					p[map[prop]] = config[prop];
				}
			}
			Plugin.version = config.version;
			TweenPlugin.activate([Plugin]);
			return Plugin;
		};


		//now run through all the dependencies discovered and if any are missing, log that to the console as a warning. This is why it's best to have TweenLite load last - it can check all the dependencies for you.
		a = window._gsQueue;
		if (a) {
			for (i = 0; i < a.length; i++) {
				a[i]();
			}
			for (p in _defLookup) {
				if (!_defLookup[p].func) {
					window.console.log("GSAP encountered missing dependency: com.greensock." + p);
				}
			}
		}

		_tickerActive = false; //ensures that the first official animation forces a ticker.tick() to update the time when it is instantiated

})((typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window, "TweenMax");
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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
},{"inherits":8,"tiny-emitter":9}],11:[function(require,module,exports){
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


},{"./AScreen.js":10,"./ScreenNavigatorItem.js":12,"inherits":8,"tiny-emitter":9}],12:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9pbmRleC5qcyIsImV4YW1wbGUvcGFnZXMvQVBhZ2UuanMiLCJleGFtcGxlL3BhZ2VzL0Fib3V0LmpzIiwiZXhhbXBsZS9wYWdlcy9Db250YWN0LmpzIiwiZXhhbXBsZS9wYWdlcy9Ib21lLmpzIiwiZXhhbXBsZS9wYWdlcy9ob21lL0hvbWVTdWJQYWdlLmpzIiwibm9kZV9tb2R1bGVzL2dzYXAvc3JjL3VuY29tcHJlc3NlZC9Ud2Vlbk1heC5qcyIsIm5vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3RpbnktZW1pdHRlci9pbmRleC5qcyIsInNyYy9BU2NyZWVuLmpzIiwic3JjL1NjcmVlbk5hdmlnYXRvci5qcyIsInNyYy9TY3JlZW5OYXZpZ2F0b3JJdGVtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcHJPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBTY3JlZW5OYXZpZ2F0b3IgPSByZXF1aXJlKCcuLi9zcmMvU2NyZWVuTmF2aWdhdG9yLmpzJyk7XG52YXIgU2NyZWVuTmF2aWdhdG9ySXRlbSA9IHJlcXVpcmUoJy4uL3NyYy9TY3JlZW5OYXZpZ2F0b3JJdGVtLmpzJyk7XG52YXIgSG9tZSA9IHJlcXVpcmUoJy4vcGFnZXMvSG9tZS5qcycpO1xudmFyIEFib3V0ID0gcmVxdWlyZSgnLi9wYWdlcy9BYm91dC5qcycpO1xuXG52YXIgbmF2aWdhdG9yID0gbmV3IFNjcmVlbk5hdmlnYXRvcigpO1xuXG4vLyBsaXN0ZW4gdG8gc2NyZWVucyBjaGFuZ2VzXG5uYXZpZ2F0b3Iub24oJ2NoYW5nZScsIG9uUGFnZUNoYW5nZSk7XG5cbi8vIGFkZCBzY3JlZW5zXG5uYXZpZ2F0b3IuYWRkSXRlbSgnaG9tZScsIG5ldyBTY3JlZW5OYXZpZ2F0b3JJdGVtKG5ldyBIb21lKCkpKTsgXG5uYXZpZ2F0b3IuYWRkSXRlbSgnYWJvdXQnLCBuZXcgU2NyZWVuTmF2aWdhdG9ySXRlbShBYm91dCkpOyBcbm5hdmlnYXRvci5hZGRJdGVtKCdjb250YWN0JywgbmV3IFNjcmVlbk5hdmlnYXRvckl0ZW0ocmVxdWlyZSgnLi9wYWdlcy9Db250YWN0LmpzJykpKTsgXG5cbi8vIHNob3cgZmlyc3Qgc2NyZWVuXG5uYXZpZ2F0b3Iuc2hvd1NjcmVlbignaG9tZScpO1xuXG52YXIgbmF2SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCduYXYgbGkgYScpO1xuXG4vLyBjbGljayBvbiBuYXYgbGlua3MgZm9yIHRoZSBleGFtcGxlXG5mb3IgKHZhciBpID0gMDsgaSA8IG5hdkl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gIG5hdkl0ZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB2YXIgaWQgPSBldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSgnaHJlZicpLnNwbGl0KCcvJylbMV07XG4gICAgaWYgKGlkID09PSAnJykgaWQgPSAnaG9tZSc7XG5cbiAgICBuYXZpZ2F0b3Iuc2hvd1NjcmVlbihpZCk7XG4gIH0pXG59O1xuXG5mdW5jdGlvbiBvblBhZ2VDaGFuZ2UoKXtcbiAgLy8gY29uc29sZS5sb2coJ2NoYW5nZScpO1xufVxuIiwidmFyIEFTY3JlZW4gPSByZXF1aXJlKCcuLi8uLi9zcmMvQVNjcmVlbi5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIEFQYWdlID0gZnVuY3Rpb24oaWQpe1xuICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCArICctcGFnZScpO1xufTtcblxuaW5oZXJpdHMoQVBhZ2UsIEFTY3JlZW4pO1xuXG5BUGFnZS5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbn07XG5cbkFQYWdlLnByb3RvdHlwZS5hbmltYXRlT3V0ID0gZnVuY3Rpb24oY29tcGxldGUpIHtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuXG4gIGlmIChjb21wbGV0ZSkge1xuICAgIHRoaXMub25BbmltYXRlT3V0Q29tcGxldGUoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBUGFnZTtcblxuIiwidmFyIEFQYWdlID0gcmVxdWlyZSgnLi9BUGFnZS5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIEFib3V0ID0gZnVuY3Rpb24oKXtcbiAgQVBhZ2UuY2FsbCh0aGlzLCAnYWJvdXQnKTtcbn07XG5cbmluaGVyaXRzKEFib3V0LCBBUGFnZSk7XG5cbkFib3V0LnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBYm91dDtcbiIsInZhciBBUGFnZSA9IHJlcXVpcmUoJy4vQVBhZ2UuanMnKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBDb250YWN0ID0gZnVuY3Rpb24oKXtcbiAgQVBhZ2UuY2FsbCh0aGlzLCAnY29udGFjdCcpO1xufTtcblxuaW5oZXJpdHMoQ29udGFjdCwgQVBhZ2UpO1xuXG5Db250YWN0LnByb3RvdHlwZS5hbmltYXRlSW4gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb250YWN0O1xuIiwidmFyIEFQYWdlID0gcmVxdWlyZSgnLi9BUGFnZS5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbnZhciBTY3JlZW5OYXZpZ2F0b3IgPSByZXF1aXJlKCcuLi8uLi9zcmMvU2NyZWVuTmF2aWdhdG9yLmpzJyk7XG52YXIgU2NyZWVuTmF2aWdhdG9ySXRlbSA9IHJlcXVpcmUoJy4uLy4uL3NyYy9TY3JlZW5OYXZpZ2F0b3JJdGVtLmpzJyk7XG52YXIgSG9tZVN1YlBhZ2UgPSByZXF1aXJlKCcuL2hvbWUvSG9tZVN1YlBhZ2UuanMnKTtcblxudmFyIEhvbWUgPSBmdW5jdGlvbigpe1xuICBBUGFnZS5jYWxsKHRoaXMsICdob21lJyk7XG5cbiAgdmFyIHRoYXQgPSB0aGlzO1xuICB2YXIgc3ViUGFnZXNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3ViLXBhZ2VzLWNvbnRhaW5lcicpO1xuICB2YXIgbmF2RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdWItcGFnZXMtbmF2IHVsJyk7XG5cbiAgdGhpcy5uYXZpZ2F0b3IgPSBuZXcgU2NyZWVuTmF2aWdhdG9yKCk7XG4gIHRoaXMubmF2aWdhdG9yLmRlZmF1bHRUcmFuc2l0aW9uVHlwZSA9IFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9BTkRfSU47XG4gIHRoaXMubmF2aWdhdG9yLm9uKCdjaGFuZ2UnLCB0aGlzLm9uU3ViUGFnZUNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgdGhpcy5uYXZpZ2F0b3Iub24oJ3RyYW5zaXRpb25Db21wbGV0ZScsIGZ1bmN0aW9uKCl7XG4gICAgY29uc29sZS5sb2coJ3RyYW5zaXRpb24gY29tcGxldGUnKTtcbiAgfSk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICB0aGlzLm5hdmlnYXRvci5hZGRJdGVtKCdwYWdlJyArIGksIG5ldyBTY3JlZW5OYXZpZ2F0b3JJdGVtKG5ldyBIb21lU3ViUGFnZShzdWJQYWdlc0NvbnRhaW5lciwgaSkpKTtcblxuICAgIHZhciBuYXZJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBuYXZJdGVtLnNldEF0dHJpYnV0ZSgnZGF0YS1zY3JlZW4taWQnLCAncGFnZScgKyBpKTtcbiAgICBuYXZFbGVtZW50LmFwcGVuZENoaWxkKG5hdkl0ZW0pO1xuXG4gICAgdmFyIG5hdkxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgbmF2TGluay5ocmVmID0gJyNwYWdlJyArIGk7XG4gICAgbmF2SXRlbS5hcHBlbmRDaGlsZChuYXZMaW5rKTtcblxuICAgIG5hdkxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICB2YXIgc2NyZWVuSWQgPSBldmVudC5jdXJyZW50VGFyZ2V0LnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLXNjcmVlbi1pZCcpO1xuXG4gICAgICB0aGF0Lm5hdmlnYXRvci5zaG93U2NyZWVuKHNjcmVlbklkKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLm5hdmlnYXRvci5zaG93U2NyZWVuKCdwYWdlMCcpO1xufTtcblxuaW5oZXJpdHMoSG9tZSwgQVBhZ2UpO1xuXG5Ib21lLnByb3RvdHlwZS5vblN1YlBhZ2VDaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG5hdkl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnN1Yi1wYWdlcy1uYXYgbGknKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG5hdkl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG5hdkl0ZW1zW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS1zY3JlZW4taWQnKSA9PT0gdGhpcy5uYXZpZ2F0b3IuY3VycmVudEl0ZW1JZCl7XG4gICAgICBuYXZJdGVtc1tpXS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICB9ZWxzZXtcbiAgICAgIG5hdkl0ZW1zW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH1cbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSG9tZTtcblxuIiwidmFyIEFTY3JlZW4gPSByZXF1aXJlKCcuLi8uLi8uLi9zcmMvQVNjcmVlbi5qcycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbnZhciBUd2Vlbk1heCA9IHJlcXVpcmUoJ2dzYXAnKTtcblxudmFyIEhvbWVJdGVtID0gZnVuY3Rpb24oY29udGFpbmVyLCBpbmRleCl7XG4gIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzdWItcGFnZScpO1xuICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gJ3BhZ2UgJyArIGluZGV4O1xuXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xufTtcblxuaW5oZXJpdHMoSG9tZUl0ZW0sIEFTY3JlZW4pO1xuXG5Ib21lSXRlbS5wcm90b3R5cGUuYW5pbWF0ZUluID0gZnVuY3Rpb24oKSB7XG4gIFR3ZWVuTWF4LmZyb21Ubyh0aGlzLmVsZW1lbnQsIDEsIHtcbiAgICB4UGVyY2VudDogMTAwXG4gIH0sIHtcbiAgICB4UGVyY2VudDogMCxcbiAgICBlYXNlOiBFeHBvLmVhc2VJbk91dCxcbiAgICBvbkNvbXBsZXRlOiB0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUuYmluZCh0aGlzKVxuICB9KTtcblxuICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG59O1xuXG5Ib21lSXRlbS5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICBBU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlLmNhbGwodGhpcyk7XG59O1xuXG5Ib21lSXRlbS5wcm90b3R5cGUuYW5pbWF0ZU91dCA9IGZ1bmN0aW9uKGNvbXBsZXRlKSB7XG4gIFR3ZWVuTWF4LnRvKHRoaXMuZWxlbWVudCwgMSwge1xuICAgIHhQZXJjZW50OiAtMTAwLFxuICAgIGVhc2U6IEV4cG8uZWFzZU91dCxcbiAgICBvbkNvbXBsZXRlOiB0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlLmJpbmQodGhpcylcbiAgfSk7XG4gIFxuICBpZiAoY29tcGxldGUpIHtcbiAgICB0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlKCk7XG4gIH1cbn07XG5cbkhvbWVJdGVtLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICBBU2NyZWVuLnByb3RvdHlwZS5vbkFuaW1hdGVPdXRDb21wbGV0ZS5jYWxsKHRoaXMpO1xuXG4gIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSG9tZUl0ZW07XG4iLCIvKiFcbiAqIFZFUlNJT046IDEuMTcuMFxuICogREFURTogMjAxNS0wNS0yN1xuICogVVBEQVRFUyBBTkQgRE9DUyBBVDogaHR0cDovL2dyZWVuc29jay5jb21cbiAqIFxuICogSW5jbHVkZXMgYWxsIG9mIHRoZSBmb2xsb3dpbmc6IFR3ZWVuTGl0ZSwgVHdlZW5NYXgsIFRpbWVsaW5lTGl0ZSwgVGltZWxpbmVNYXgsIEVhc2VQYWNrLCBDU1NQbHVnaW4sIFJvdW5kUHJvcHNQbHVnaW4sIEJlemllclBsdWdpbiwgQXR0clBsdWdpbiwgRGlyZWN0aW9uYWxSb3RhdGlvblBsdWdpblxuICpcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwOC0yMDE1LCBHcmVlblNvY2suIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIHdvcmsgaXMgc3ViamVjdCB0byB0aGUgdGVybXMgYXQgaHR0cDovL2dyZWVuc29jay5jb20vc3RhbmRhcmQtbGljZW5zZSBvciBmb3JcbiAqIENsdWIgR3JlZW5Tb2NrIG1lbWJlcnMsIHRoZSBzb2Z0d2FyZSBhZ3JlZW1lbnQgdGhhdCB3YXMgaXNzdWVkIHdpdGggeW91ciBtZW1iZXJzaGlwLlxuICogXG4gKiBAYXV0aG9yOiBKYWNrIERveWxlLCBqYWNrQGdyZWVuc29jay5jb21cbiAqKi9cbnZhciBfZ3NTY29wZSA9ICh0eXBlb2YobW9kdWxlKSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cyAmJiB0eXBlb2YoZ2xvYmFsKSAhPT0gXCJ1bmRlZmluZWRcIikgPyBnbG9iYWwgOiB0aGlzIHx8IHdpbmRvdzsgLy9oZWxwcyBlbnN1cmUgY29tcGF0aWJpbGl0eSB3aXRoIEFNRC9SZXF1aXJlSlMgYW5kIENvbW1vbkpTL05vZGVcbihfZ3NTY29wZS5fZ3NRdWV1ZSB8fCAoX2dzU2NvcGUuX2dzUXVldWUgPSBbXSkpLnB1c2goIGZ1bmN0aW9uKCkge1xuXG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdF9nc1Njb3BlLl9nc0RlZmluZShcIlR3ZWVuTWF4XCIsIFtcImNvcmUuQW5pbWF0aW9uXCIsXCJjb3JlLlNpbXBsZVRpbWVsaW5lXCIsXCJUd2VlbkxpdGVcIl0sIGZ1bmN0aW9uKEFuaW1hdGlvbiwgU2ltcGxlVGltZWxpbmUsIFR3ZWVuTGl0ZSkge1xuXG5cdFx0dmFyIF9zbGljZSA9IGZ1bmN0aW9uKGEpIHsgLy9kb24ndCB1c2UgW10uc2xpY2UgYmVjYXVzZSB0aGF0IGRvZXNuJ3Qgd29yayBpbiBJRTggd2l0aCBhIE5vZGVMaXN0IHRoYXQncyByZXR1cm5lZCBieSBxdWVyeVNlbGVjdG9yQWxsKClcblx0XHRcdFx0dmFyIGIgPSBbXSxcblx0XHRcdFx0XHRsID0gYS5sZW5ndGgsXG5cdFx0XHRcdFx0aTtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSAhPT0gbDsgYi5wdXNoKGFbaSsrXSkpO1xuXHRcdFx0XHRyZXR1cm4gYjtcblx0XHRcdH0sXG5cdFx0XHRUd2Vlbk1heCA9IGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIHZhcnMpIHtcblx0XHRcdFx0VHdlZW5MaXRlLmNhbGwodGhpcywgdGFyZ2V0LCBkdXJhdGlvbiwgdmFycyk7XG5cdFx0XHRcdHRoaXMuX2N5Y2xlID0gMDtcblx0XHRcdFx0dGhpcy5feW95byA9ICh0aGlzLnZhcnMueW95byA9PT0gdHJ1ZSk7XG5cdFx0XHRcdHRoaXMuX3JlcGVhdCA9IHRoaXMudmFycy5yZXBlYXQgfHwgMDtcblx0XHRcdFx0dGhpcy5fcmVwZWF0RGVsYXkgPSB0aGlzLnZhcnMucmVwZWF0RGVsYXkgfHwgMDtcblx0XHRcdFx0dGhpcy5fZGlydHkgPSB0cnVlOyAvL2Vuc3VyZXMgdGhhdCBpZiB0aGVyZSBpcyBhbnkgcmVwZWF0LCB0aGUgdG90YWxEdXJhdGlvbiB3aWxsIGdldCByZWNhbGN1bGF0ZWQgdG8gYWNjdXJhdGVseSByZXBvcnQgaXQuXG5cdFx0XHRcdHRoaXMucmVuZGVyID0gVHdlZW5NYXgucHJvdG90eXBlLnJlbmRlcjsgLy9zcGVlZCBvcHRpbWl6YXRpb24gKGF2b2lkIHByb3RvdHlwZSBsb29rdXAgb24gdGhpcyBcImhvdFwiIG1ldGhvZClcblx0XHRcdH0sXG5cdFx0XHRfdGlueU51bSA9IDAuMDAwMDAwMDAwMSxcblx0XHRcdFR3ZWVuTGl0ZUludGVybmFscyA9IFR3ZWVuTGl0ZS5faW50ZXJuYWxzLFxuXHRcdFx0X2lzU2VsZWN0b3IgPSBUd2VlbkxpdGVJbnRlcm5hbHMuaXNTZWxlY3Rvcixcblx0XHRcdF9pc0FycmF5ID0gVHdlZW5MaXRlSW50ZXJuYWxzLmlzQXJyYXksXG5cdFx0XHRwID0gVHdlZW5NYXgucHJvdG90eXBlID0gVHdlZW5MaXRlLnRvKHt9LCAwLjEsIHt9KSxcblx0XHRcdF9ibGFua0FycmF5ID0gW107XG5cblx0XHRUd2Vlbk1heC52ZXJzaW9uID0gXCIxLjE3LjBcIjtcblx0XHRwLmNvbnN0cnVjdG9yID0gVHdlZW5NYXg7XG5cdFx0cC5raWxsKCkuX2djID0gZmFsc2U7XG5cdFx0VHdlZW5NYXgua2lsbFR3ZWVuc09mID0gVHdlZW5NYXgua2lsbERlbGF5ZWRDYWxsc1RvID0gVHdlZW5MaXRlLmtpbGxUd2VlbnNPZjtcblx0XHRUd2Vlbk1heC5nZXRUd2VlbnNPZiA9IFR3ZWVuTGl0ZS5nZXRUd2VlbnNPZjtcblx0XHRUd2Vlbk1heC5sYWdTbW9vdGhpbmcgPSBUd2VlbkxpdGUubGFnU21vb3RoaW5nO1xuXHRcdFR3ZWVuTWF4LnRpY2tlciA9IFR3ZWVuTGl0ZS50aWNrZXI7XG5cdFx0VHdlZW5NYXgucmVuZGVyID0gVHdlZW5MaXRlLnJlbmRlcjtcblxuXHRcdHAuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5feW95byA9ICh0aGlzLnZhcnMueW95byA9PT0gdHJ1ZSk7XG5cdFx0XHR0aGlzLl9yZXBlYXQgPSB0aGlzLnZhcnMucmVwZWF0IHx8IDA7XG5cdFx0XHR0aGlzLl9yZXBlYXREZWxheSA9IHRoaXMudmFycy5yZXBlYXREZWxheSB8fCAwO1xuXHRcdFx0dGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHRcdHJldHVybiBUd2VlbkxpdGUucHJvdG90eXBlLmludmFsaWRhdGUuY2FsbCh0aGlzKTtcblx0XHR9O1xuXHRcdFxuXHRcdHAudXBkYXRlVG8gPSBmdW5jdGlvbih2YXJzLCByZXNldER1cmF0aW9uKSB7XG5cdFx0XHR2YXIgY3VyUmF0aW8gPSB0aGlzLnJhdGlvLFxuXHRcdFx0XHRpbW1lZGlhdGUgPSB0aGlzLnZhcnMuaW1tZWRpYXRlUmVuZGVyIHx8IHZhcnMuaW1tZWRpYXRlUmVuZGVyLFxuXHRcdFx0XHRwO1xuXHRcdFx0aWYgKHJlc2V0RHVyYXRpb24gJiYgdGhpcy5fc3RhcnRUaW1lIDwgdGhpcy5fdGltZWxpbmUuX3RpbWUpIHtcblx0XHRcdFx0dGhpcy5fc3RhcnRUaW1lID0gdGhpcy5fdGltZWxpbmUuX3RpbWU7XG5cdFx0XHRcdHRoaXMuX3VuY2FjaGUoZmFsc2UpO1xuXHRcdFx0XHRpZiAodGhpcy5fZ2MpIHtcblx0XHRcdFx0XHR0aGlzLl9lbmFibGVkKHRydWUsIGZhbHNlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl90aW1lbGluZS5pbnNlcnQodGhpcywgdGhpcy5fc3RhcnRUaW1lIC0gdGhpcy5fZGVsYXkpOyAvL2Vuc3VyZXMgdGhhdCBhbnkgbmVjZXNzYXJ5IHJlLXNlcXVlbmNpbmcgb2YgQW5pbWF0aW9ucyBpbiB0aGUgdGltZWxpbmUgb2NjdXJzIHRvIG1ha2Ugc3VyZSB0aGUgcmVuZGVyaW5nIG9yZGVyIGlzIGNvcnJlY3QuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGZvciAocCBpbiB2YXJzKSB7XG5cdFx0XHRcdHRoaXMudmFyc1twXSA9IHZhcnNbcF07XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5faW5pdHRlZCB8fCBpbW1lZGlhdGUpIHtcblx0XHRcdFx0aWYgKHJlc2V0RHVyYXRpb24pIHtcblx0XHRcdFx0XHR0aGlzLl9pbml0dGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0aWYgKGltbWVkaWF0ZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5yZW5kZXIoMCwgdHJ1ZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmICh0aGlzLl9nYykge1xuXHRcdFx0XHRcdFx0dGhpcy5fZW5hYmxlZCh0cnVlLCBmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0aGlzLl9ub3RpZnlQbHVnaW5zT2ZFbmFibGVkICYmIHRoaXMuX2ZpcnN0UFQpIHtcblx0XHRcdFx0XHRcdFR3ZWVuTGl0ZS5fb25QbHVnaW5FdmVudChcIl9vbkRpc2FibGVcIiwgdGhpcyk7IC8vaW4gY2FzZSBhIHBsdWdpbiBsaWtlIE1vdGlvbkJsdXIgbXVzdCBwZXJmb3JtIHNvbWUgY2xlYW51cCB0YXNrc1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodGhpcy5fdGltZSAvIHRoaXMuX2R1cmF0aW9uID4gMC45OTgpIHsgLy9pZiB0aGUgdHdlZW4gaGFzIGZpbmlzaGVkIChvciBjb21lIGV4dHJlbWVseSBjbG9zZSB0byBmaW5pc2hpbmcpLCB3ZSBqdXN0IG5lZWQgdG8gcmV3aW5kIGl0IHRvIDAgYW5kIHRoZW4gcmVuZGVyIGl0IGFnYWluIGF0IHRoZSBlbmQgd2hpY2ggZm9yY2VzIGl0IHRvIHJlLWluaXRpYWxpemUgKHBhcnNpbmcgdGhlIG5ldyB2YXJzKS4gV2UgYWxsb3cgdHdlZW5zIHRoYXQgYXJlIGNsb3NlIHRvIGZpbmlzaGluZyAoYnV0IGhhdmVuJ3QgcXVpdGUgZmluaXNoZWQpIHRvIHdvcmsgdGhpcyB3YXkgdG9vIGJlY2F1c2Ugb3RoZXJ3aXNlLCB0aGUgdmFsdWVzIGFyZSBzbyBzbWFsbCB3aGVuIGRldGVybWluaW5nIHdoZXJlIHRvIHByb2plY3QgdGhlIHN0YXJ0aW5nIHZhbHVlcyB0aGF0IGJpbmFyeSBtYXRoIGlzc3VlcyBjcmVlcCBpbiBhbmQgY2FuIG1ha2UgdGhlIHR3ZWVuIGFwcGVhciB0byByZW5kZXIgaW5jb3JyZWN0bHkgd2hlbiBydW4gYmFja3dhcmRzLiBcblx0XHRcdFx0XHRcdHZhciBwcmV2VGltZSA9IHRoaXMuX3RpbWU7XG5cdFx0XHRcdFx0XHR0aGlzLnJlbmRlcigwLCB0cnVlLCBmYWxzZSk7XG5cdFx0XHRcdFx0XHR0aGlzLl9pbml0dGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR0aGlzLnJlbmRlcihwcmV2VGltZSwgdHJ1ZSwgZmFsc2UpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fdGltZSA+IDAgfHwgaW1tZWRpYXRlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9pbml0dGVkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHR0aGlzLl9pbml0KCk7XG5cdFx0XHRcdFx0XHR2YXIgaW52ID0gMSAvICgxIC0gY3VyUmF0aW8pLFxuXHRcdFx0XHRcdFx0XHRwdCA9IHRoaXMuX2ZpcnN0UFQsIGVuZFZhbHVlO1xuXHRcdFx0XHRcdFx0d2hpbGUgKHB0KSB7XG5cdFx0XHRcdFx0XHRcdGVuZFZhbHVlID0gcHQucyArIHB0LmM7IFxuXHRcdFx0XHRcdFx0XHRwdC5jICo9IGludjtcblx0XHRcdFx0XHRcdFx0cHQucyA9IGVuZFZhbHVlIC0gcHQuYztcblx0XHRcdFx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cdFx0XHRcdFxuXHRcdHAucmVuZGVyID0gZnVuY3Rpb24odGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKSB7XG5cdFx0XHRpZiAoIXRoaXMuX2luaXR0ZWQpIGlmICh0aGlzLl9kdXJhdGlvbiA9PT0gMCAmJiB0aGlzLnZhcnMucmVwZWF0KSB7IC8vemVybyBkdXJhdGlvbiB0d2VlbnMgdGhhdCByZW5kZXIgaW1tZWRpYXRlbHkgaGF2ZSByZW5kZXIoKSBjYWxsZWQgZnJvbSBUd2VlbkxpdGUncyBjb25zdHJ1Y3RvciwgYmVmb3JlIFR3ZWVuTWF4J3MgY29uc3RydWN0b3IgaGFzIGZpbmlzaGVkIHNldHRpbmcgX3JlcGVhdCwgX3JlcGVhdERlbGF5LCBhbmQgX3lveW8gd2hpY2ggYXJlIGNyaXRpY2FsIGluIGRldGVybWluaW5nIHRvdGFsRHVyYXRpb24oKSBzbyB3ZSBuZWVkIHRvIGNhbGwgaW52YWxpZGF0ZSgpIHdoaWNoIGlzIGEgbG93LWtiIHdheSB0byBnZXQgdGhvc2Ugc2V0IHByb3Blcmx5LlxuXHRcdFx0XHR0aGlzLmludmFsaWRhdGUoKTtcblx0XHRcdH1cblx0XHRcdHZhciB0b3RhbER1ciA9ICghdGhpcy5fZGlydHkpID8gdGhpcy5fdG90YWxEdXJhdGlvbiA6IHRoaXMudG90YWxEdXJhdGlvbigpLFxuXHRcdFx0XHRwcmV2VGltZSA9IHRoaXMuX3RpbWUsXG5cdFx0XHRcdHByZXZUb3RhbFRpbWUgPSB0aGlzLl90b3RhbFRpbWUsIFxuXHRcdFx0XHRwcmV2Q3ljbGUgPSB0aGlzLl9jeWNsZSxcblx0XHRcdFx0ZHVyYXRpb24gPSB0aGlzLl9kdXJhdGlvbixcblx0XHRcdFx0cHJldlJhd1ByZXZUaW1lID0gdGhpcy5fcmF3UHJldlRpbWUsXG5cdFx0XHRcdGlzQ29tcGxldGUsIGNhbGxiYWNrLCBwdCwgY3ljbGVEdXJhdGlvbiwgciwgdHlwZSwgcG93LCByYXdQcmV2VGltZTtcblx0XHRcdGlmICh0aW1lID49IHRvdGFsRHVyKSB7XG5cdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRvdGFsRHVyO1xuXHRcdFx0XHR0aGlzLl9jeWNsZSA9IHRoaXMuX3JlcGVhdDtcblx0XHRcdFx0aWYgKHRoaXMuX3lveW8gJiYgKHRoaXMuX2N5Y2xlICYgMSkgIT09IDApIHtcblx0XHRcdFx0XHR0aGlzLl90aW1lID0gMDtcblx0XHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5fY2FsY0VuZCA/IHRoaXMuX2Vhc2UuZ2V0UmF0aW8oMCkgOiAwO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX3RpbWUgPSBkdXJhdGlvbjtcblx0XHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5fY2FsY0VuZCA/IHRoaXMuX2Vhc2UuZ2V0UmF0aW8oMSkgOiAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghdGhpcy5fcmV2ZXJzZWQpIHtcblx0XHRcdFx0XHRpc0NvbXBsZXRlID0gdHJ1ZTtcblx0XHRcdFx0XHRjYWxsYmFjayA9IFwib25Db21wbGV0ZVwiO1xuXHRcdFx0XHRcdGZvcmNlID0gKGZvcmNlIHx8IHRoaXMuX3RpbWVsaW5lLmF1dG9SZW1vdmVDaGlsZHJlbik7IC8vb3RoZXJ3aXNlLCBpZiB0aGUgYW5pbWF0aW9uIGlzIHVucGF1c2VkL2FjdGl2YXRlZCBhZnRlciBpdCdzIGFscmVhZHkgZmluaXNoZWQsIGl0IGRvZXNuJ3QgZ2V0IHJlbW92ZWQgZnJvbSB0aGUgcGFyZW50IHRpbWVsaW5lLlxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChkdXJhdGlvbiA9PT0gMCkgaWYgKHRoaXMuX2luaXR0ZWQgfHwgIXRoaXMudmFycy5sYXp5IHx8IGZvcmNlKSB7IC8vemVyby1kdXJhdGlvbiB0d2VlbnMgYXJlIHRyaWNreSBiZWNhdXNlIHdlIG11c3QgZGlzY2VybiB0aGUgbW9tZW50dW0vZGlyZWN0aW9uIG9mIHRpbWUgaW4gb3JkZXIgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIHN0YXJ0aW5nIHZhbHVlcyBzaG91bGQgYmUgcmVuZGVyZWQgb3IgdGhlIGVuZGluZyB2YWx1ZXMuIElmIHRoZSBcInBsYXloZWFkXCIgb2YgaXRzIHRpbWVsaW5lIGdvZXMgcGFzdCB0aGUgemVyby1kdXJhdGlvbiB0d2VlbiBpbiB0aGUgZm9yd2FyZCBkaXJlY3Rpb24gb3IgbGFuZHMgZGlyZWN0bHkgb24gaXQsIHRoZSBlbmQgdmFsdWVzIHNob3VsZCBiZSByZW5kZXJlZCwgYnV0IGlmIHRoZSB0aW1lbGluZSdzIFwicGxheWhlYWRcIiBtb3ZlcyBwYXN0IGl0IGluIHRoZSBiYWNrd2FyZCBkaXJlY3Rpb24gKGZyb20gYSBwb3N0aXRpdmUgdGltZSB0byBhIG5lZ2F0aXZlIHRpbWUpLCB0aGUgc3RhcnRpbmcgdmFsdWVzIG11c3QgYmUgcmVuZGVyZWQuXG5cdFx0XHRcdFx0aWYgKHRoaXMuX3N0YXJ0VGltZSA9PT0gdGhpcy5fdGltZWxpbmUuX2R1cmF0aW9uKSB7IC8vaWYgYSB6ZXJvLWR1cmF0aW9uIHR3ZWVuIGlzIGF0IHRoZSBWRVJZIGVuZCBvZiBhIHRpbWVsaW5lIGFuZCB0aGF0IHRpbWVsaW5lIHJlbmRlcnMgYXQgaXRzIGVuZCwgaXQgd2lsbCB0eXBpY2FsbHkgYWRkIGEgdGlueSBiaXQgb2YgY3VzaGlvbiB0byB0aGUgcmVuZGVyIHRpbWUgdG8gcHJldmVudCByb3VuZGluZyBlcnJvcnMgZnJvbSBnZXR0aW5nIGluIHRoZSB3YXkgb2YgdHdlZW5zIHJlbmRlcmluZyB0aGVpciBWRVJZIGVuZC4gSWYgd2UgdGhlbiByZXZlcnNlKCkgdGhhdCB0aW1lbGluZSwgdGhlIHplcm8tZHVyYXRpb24gdHdlZW4gd2lsbCB0cmlnZ2VyIGl0cyBvblJldmVyc2VDb21wbGV0ZSBldmVuIHRob3VnaCB0ZWNobmljYWxseSB0aGUgcGxheWhlYWQgZGlkbid0IHBhc3Mgb3ZlciBpdCBhZ2Fpbi4gSXQncyBhIHZlcnkgc3BlY2lmaWMgZWRnZSBjYXNlIHdlIG11c3QgYWNjb21tb2RhdGUuXG5cdFx0XHRcdFx0XHR0aW1lID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHRpbWUgPT09IDAgfHwgcHJldlJhd1ByZXZUaW1lIDwgMCB8fCBwcmV2UmF3UHJldlRpbWUgPT09IF90aW55TnVtKSBpZiAocHJldlJhd1ByZXZUaW1lICE9PSB0aW1lKSB7XG5cdFx0XHRcdFx0XHRmb3JjZSA9IHRydWU7XG5cdFx0XHRcdFx0XHRpZiAocHJldlJhd1ByZXZUaW1lID4gX3RpbnlOdW0pIHtcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uUmV2ZXJzZUNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gcmF3UHJldlRpbWUgPSAoIXN1cHByZXNzRXZlbnRzIHx8IHRpbWUgfHwgcHJldlJhd1ByZXZUaW1lID09PSB0aW1lKSA/IHRpbWUgOiBfdGlueU51bTsgLy93aGVuIHRoZSBwbGF5aGVhZCBhcnJpdmVzIGF0IEVYQUNUTFkgdGltZSAwIChyaWdodCBvbiB0b3ApIG9mIGEgemVyby1kdXJhdGlvbiB0d2Vlbiwgd2UgbmVlZCB0byBkaXNjZXJuIGlmIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBzbyB0aGF0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIGFnYWluIChuZXh0IHRpbWUpLCBpdCdsbCB0cmlnZ2VyIHRoZSBjYWxsYmFjay4gSWYgZXZlbnRzIGFyZSBOT1Qgc3VwcHJlc3NlZCwgb2J2aW91c2x5IHRoZSBjYWxsYmFjayB3b3VsZCBiZSB0cmlnZ2VyZWQgaW4gdGhpcyByZW5kZXIuIEJhc2ljYWxseSwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlIGVpdGhlciB3aGVuIHRoZSBwbGF5aGVhZCBBUlJJVkVTIG9yIExFQVZFUyB0aGlzIGV4YWN0IHNwb3QsIG5vdCBib3RoLiBJbWFnaW5lIGRvaW5nIGEgdGltZWxpbmUuc2VlaygwKSBhbmQgdGhlcmUncyBhIGNhbGxiYWNrIHRoYXQgc2l0cyBhdCAwLiBTaW5jZSBldmVudHMgYXJlIHN1cHByZXNzZWQgb24gdGhhdCBzZWVrKCkgYnkgZGVmYXVsdCwgbm90aGluZyB3aWxsIGZpcmUsIGJ1dCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBvZmYgb2YgdGhhdCBwb3NpdGlvbiwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlLiBUaGlzIGJlaGF2aW9yIGlzIHdoYXQgcGVvcGxlIGludHVpdGl2ZWx5IGV4cGVjdC4gV2Ugc2V0IHRoZSBfcmF3UHJldlRpbWUgdG8gYmUgYSBwcmVjaXNlIHRpbnkgbnVtYmVyIHRvIGluZGljYXRlIHRoaXMgc2NlbmFyaW8gcmF0aGVyIHRoYW4gdXNpbmcgYW5vdGhlciBwcm9wZXJ0eS92YXJpYWJsZSB3aGljaCB3b3VsZCBpbmNyZWFzZSBtZW1vcnkgdXNhZ2UuIFRoaXMgdGVjaG5pcXVlIGlzIGxlc3MgcmVhZGFibGUsIGJ1dCBtb3JlIGVmZmljaWVudC5cblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdH0gZWxzZSBpZiAodGltZSA8IDAuMDAwMDAwMSkgeyAvL3RvIHdvcmsgYXJvdW5kIG9jY2FzaW9uYWwgZmxvYXRpbmcgcG9pbnQgbWF0aCBhcnRpZmFjdHMsIHJvdW5kIHN1cGVyIHNtYWxsIHZhbHVlcyB0byAwLlxuXHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0aGlzLl90aW1lID0gdGhpcy5fY3ljbGUgPSAwO1xuXHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5fY2FsY0VuZCA/IHRoaXMuX2Vhc2UuZ2V0UmF0aW8oMCkgOiAwO1xuXHRcdFx0XHRpZiAocHJldlRvdGFsVGltZSAhPT0gMCB8fCAoZHVyYXRpb24gPT09IDAgJiYgcHJldlJhd1ByZXZUaW1lID4gMCkpIHtcblx0XHRcdFx0XHRjYWxsYmFjayA9IFwib25SZXZlcnNlQ29tcGxldGVcIjtcblx0XHRcdFx0XHRpc0NvbXBsZXRlID0gdGhpcy5fcmV2ZXJzZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRpbWUgPCAwKSB7XG5cdFx0XHRcdFx0dGhpcy5fYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdFx0aWYgKGR1cmF0aW9uID09PSAwKSBpZiAodGhpcy5faW5pdHRlZCB8fCAhdGhpcy52YXJzLmxhenkgfHwgZm9yY2UpIHsgLy96ZXJvLWR1cmF0aW9uIHR3ZWVucyBhcmUgdHJpY2t5IGJlY2F1c2Ugd2UgbXVzdCBkaXNjZXJuIHRoZSBtb21lbnR1bS9kaXJlY3Rpb24gb2YgdGltZSBpbiBvcmRlciB0byBkZXRlcm1pbmUgd2hldGhlciB0aGUgc3RhcnRpbmcgdmFsdWVzIHNob3VsZCBiZSByZW5kZXJlZCBvciB0aGUgZW5kaW5nIHZhbHVlcy4gSWYgdGhlIFwicGxheWhlYWRcIiBvZiBpdHMgdGltZWxpbmUgZ29lcyBwYXN0IHRoZSB6ZXJvLWR1cmF0aW9uIHR3ZWVuIGluIHRoZSBmb3J3YXJkIGRpcmVjdGlvbiBvciBsYW5kcyBkaXJlY3RseSBvbiBpdCwgdGhlIGVuZCB2YWx1ZXMgc2hvdWxkIGJlIHJlbmRlcmVkLCBidXQgaWYgdGhlIHRpbWVsaW5lJ3MgXCJwbGF5aGVhZFwiIG1vdmVzIHBhc3QgaXQgaW4gdGhlIGJhY2t3YXJkIGRpcmVjdGlvbiAoZnJvbSBhIHBvc3RpdGl2ZSB0aW1lIHRvIGEgbmVnYXRpdmUgdGltZSksIHRoZSBzdGFydGluZyB2YWx1ZXMgbXVzdCBiZSByZW5kZXJlZC5cblx0XHRcdFx0XHRcdGlmIChwcmV2UmF3UHJldlRpbWUgPj0gMCkge1xuXHRcdFx0XHRcdFx0XHRmb3JjZSA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9IHJhd1ByZXZUaW1lID0gKCFzdXBwcmVzc0V2ZW50cyB8fCB0aW1lIHx8IHByZXZSYXdQcmV2VGltZSA9PT0gdGltZSkgPyB0aW1lIDogX3RpbnlOdW07IC8vd2hlbiB0aGUgcGxheWhlYWQgYXJyaXZlcyBhdCBFWEFDVExZIHRpbWUgMCAocmlnaHQgb24gdG9wKSBvZiBhIHplcm8tZHVyYXRpb24gdHdlZW4sIHdlIG5lZWQgdG8gZGlzY2VybiBpZiBldmVudHMgYXJlIHN1cHByZXNzZWQgc28gdGhhdCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBhZ2FpbiAobmV4dCB0aW1lKSwgaXQnbGwgdHJpZ2dlciB0aGUgY2FsbGJhY2suIElmIGV2ZW50cyBhcmUgTk9UIHN1cHByZXNzZWQsIG9idmlvdXNseSB0aGUgY2FsbGJhY2sgd291bGQgYmUgdHJpZ2dlcmVkIGluIHRoaXMgcmVuZGVyLiBCYXNpY2FsbHksIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZSBlaXRoZXIgd2hlbiB0aGUgcGxheWhlYWQgQVJSSVZFUyBvciBMRUFWRVMgdGhpcyBleGFjdCBzcG90LCBub3QgYm90aC4gSW1hZ2luZSBkb2luZyBhIHRpbWVsaW5lLnNlZWsoMCkgYW5kIHRoZXJlJ3MgYSBjYWxsYmFjayB0aGF0IHNpdHMgYXQgMC4gU2luY2UgZXZlbnRzIGFyZSBzdXBwcmVzc2VkIG9uIHRoYXQgc2VlaygpIGJ5IGRlZmF1bHQsIG5vdGhpbmcgd2lsbCBmaXJlLCBidXQgd2hlbiB0aGUgcGxheWhlYWQgbW92ZXMgb2ZmIG9mIHRoYXQgcG9zaXRpb24sIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZS4gVGhpcyBiZWhhdmlvciBpcyB3aGF0IHBlb3BsZSBpbnR1aXRpdmVseSBleHBlY3QuIFdlIHNldCB0aGUgX3Jhd1ByZXZUaW1lIHRvIGJlIGEgcHJlY2lzZSB0aW55IG51bWJlciB0byBpbmRpY2F0ZSB0aGlzIHNjZW5hcmlvIHJhdGhlciB0aGFuIHVzaW5nIGFub3RoZXIgcHJvcGVydHkvdmFyaWFibGUgd2hpY2ggd291bGQgaW5jcmVhc2UgbWVtb3J5IHVzYWdlLiBUaGlzIHRlY2huaXF1ZSBpcyBsZXNzIHJlYWRhYmxlLCBidXQgbW9yZSBlZmZpY2llbnQuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghdGhpcy5faW5pdHRlZCkgeyAvL2lmIHdlIHJlbmRlciB0aGUgdmVyeSBiZWdpbm5pbmcgKHRpbWUgPT0gMCkgb2YgYSBmcm9tVG8oKSwgd2UgbXVzdCBmb3JjZSB0aGUgcmVuZGVyIChub3JtYWwgdHdlZW5zIHdvdWxkbid0IG5lZWQgdG8gcmVuZGVyIGF0IGEgdGltZSBvZiAwIHdoZW4gdGhlIHByZXZUaW1lIHdhcyBhbHNvIDApLiBUaGlzIGlzIGFsc28gbWFuZGF0b3J5IHRvIG1ha2Ugc3VyZSBvdmVyd3JpdGluZyBraWNrcyBpbiBpbW1lZGlhdGVseS5cblx0XHRcdFx0XHRmb3JjZSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRoaXMuX3RpbWUgPSB0aW1lO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYgKHRoaXMuX3JlcGVhdCAhPT0gMCkge1xuXHRcdFx0XHRcdGN5Y2xlRHVyYXRpb24gPSBkdXJhdGlvbiArIHRoaXMuX3JlcGVhdERlbGF5O1xuXHRcdFx0XHRcdHRoaXMuX2N5Y2xlID0gKHRoaXMuX3RvdGFsVGltZSAvIGN5Y2xlRHVyYXRpb24pID4+IDA7IC8vb3JpZ2luYWxseSBfdG90YWxUaW1lICUgY3ljbGVEdXJhdGlvbiBidXQgZmxvYXRpbmcgcG9pbnQgZXJyb3JzIGNhdXNlZCBwcm9ibGVtcywgc28gSSBub3JtYWxpemVkIGl0LiAoNCAlIDAuOCBzaG91bGQgYmUgMCBidXQgRmxhc2ggcmVwb3J0cyBpdCBhcyAwLjc5OTk5OTk5ISlcblx0XHRcdFx0XHRpZiAodGhpcy5fY3ljbGUgIT09IDApIGlmICh0aGlzLl9jeWNsZSA9PT0gdGhpcy5fdG90YWxUaW1lIC8gY3ljbGVEdXJhdGlvbikge1xuXHRcdFx0XHRcdFx0dGhpcy5fY3ljbGUtLTsgLy9vdGhlcndpc2Ugd2hlbiByZW5kZXJlZCBleGFjdGx5IGF0IHRoZSBlbmQgdGltZSwgaXQgd2lsbCBhY3QgYXMgdGhvdWdoIGl0IGlzIHJlcGVhdGluZyAoYXQgdGhlIGJlZ2lubmluZylcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fdGltZSA9IHRoaXMuX3RvdGFsVGltZSAtICh0aGlzLl9jeWNsZSAqIGN5Y2xlRHVyYXRpb24pO1xuXHRcdFx0XHRcdGlmICh0aGlzLl95b3lvKSBpZiAoKHRoaXMuX2N5Y2xlICYgMSkgIT09IDApIHtcblx0XHRcdFx0XHRcdHRoaXMuX3RpbWUgPSBkdXJhdGlvbiAtIHRoaXMuX3RpbWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lID4gZHVyYXRpb24pIHtcblx0XHRcdFx0XHRcdHRoaXMuX3RpbWUgPSBkdXJhdGlvbjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuX3RpbWUgPCAwKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl90aW1lID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpcy5fZWFzZVR5cGUpIHtcblx0XHRcdFx0XHRyID0gdGhpcy5fdGltZSAvIGR1cmF0aW9uO1xuXHRcdFx0XHRcdHR5cGUgPSB0aGlzLl9lYXNlVHlwZTtcblx0XHRcdFx0XHRwb3cgPSB0aGlzLl9lYXNlUG93ZXI7XG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09IDEgfHwgKHR5cGUgPT09IDMgJiYgciA+PSAwLjUpKSB7XG5cdFx0XHRcdFx0XHRyID0gMSAtIHI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAzKSB7XG5cdFx0XHRcdFx0XHRyICo9IDI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwb3cgPT09IDEpIHtcblx0XHRcdFx0XHRcdHIgKj0gcjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHBvdyA9PT0gMikge1xuXHRcdFx0XHRcdFx0ciAqPSByICogcjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHBvdyA9PT0gMykge1xuXHRcdFx0XHRcdFx0ciAqPSByICogciAqIHI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwb3cgPT09IDQpIHtcblx0XHRcdFx0XHRcdHIgKj0gciAqIHIgKiByICogcjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0dGhpcy5yYXRpbyA9IDEgLSByO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHlwZSA9PT0gMikge1xuXHRcdFx0XHRcdFx0dGhpcy5yYXRpbyA9IHI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl90aW1lIC8gZHVyYXRpb24gPCAwLjUpIHtcblx0XHRcdFx0XHRcdHRoaXMucmF0aW8gPSByIC8gMjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5yYXRpbyA9IDEgLSAociAvIDIpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMucmF0aW8gPSB0aGlzLl9lYXNlLmdldFJhdGlvKHRoaXMuX3RpbWUgLyBkdXJhdGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0aWYgKHByZXZUaW1lID09PSB0aGlzLl90aW1lICYmICFmb3JjZSAmJiBwcmV2Q3ljbGUgPT09IHRoaXMuX2N5Y2xlKSB7XG5cdFx0XHRcdGlmIChwcmV2VG90YWxUaW1lICE9PSB0aGlzLl90b3RhbFRpbWUpIGlmICh0aGlzLl9vblVwZGF0ZSkgaWYgKCFzdXBwcmVzc0V2ZW50cykgeyAvL3NvIHRoYXQgb25VcGRhdGUgZmlyZXMgZXZlbiBkdXJpbmcgdGhlIHJlcGVhdERlbGF5IC0gYXMgbG9uZyBhcyB0aGUgdG90YWxUaW1lIGNoYW5nZWQsIHdlIHNob3VsZCB0cmlnZ2VyIG9uVXBkYXRlLlxuXHRcdFx0XHRcdHRoaXMuX2NhbGxiYWNrKFwib25VcGRhdGVcIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fSBlbHNlIGlmICghdGhpcy5faW5pdHRlZCkge1xuXHRcdFx0XHR0aGlzLl9pbml0KCk7XG5cdFx0XHRcdGlmICghdGhpcy5faW5pdHRlZCB8fCB0aGlzLl9nYykgeyAvL2ltbWVkaWF0ZVJlbmRlciB0d2VlbnMgdHlwaWNhbGx5IHdvbid0IGluaXRpYWxpemUgdW50aWwgdGhlIHBsYXloZWFkIGFkdmFuY2VzIChfdGltZSBpcyBncmVhdGVyIHRoYW4gMCkgaW4gb3JkZXIgdG8gZW5zdXJlIHRoYXQgb3ZlcndyaXRpbmcgb2NjdXJzIHByb3Blcmx5LiBBbHNvLCBpZiBhbGwgb2YgdGhlIHR3ZWVuaW5nIHByb3BlcnRpZXMgaGF2ZSBiZWVuIG92ZXJ3cml0dGVuICh3aGljaCB3b3VsZCBjYXVzZSBfZ2MgdG8gYmUgdHJ1ZSwgYXMgc2V0IGluIF9pbml0KCkpLCB3ZSBzaG91bGRuJ3QgY29udGludWUgb3RoZXJ3aXNlIGFuIG9uU3RhcnQgY2FsbGJhY2sgY291bGQgYmUgY2FsbGVkIGZvciBleGFtcGxlLlxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fSBlbHNlIGlmICghZm9yY2UgJiYgdGhpcy5fZmlyc3RQVCAmJiAoKHRoaXMudmFycy5sYXp5ICE9PSBmYWxzZSAmJiB0aGlzLl9kdXJhdGlvbikgfHwgKHRoaXMudmFycy5sYXp5ICYmICF0aGlzLl9kdXJhdGlvbikpKSB7IC8vd2Ugc3RpY2sgaXQgaW4gdGhlIHF1ZXVlIGZvciByZW5kZXJpbmcgYXQgdGhlIHZlcnkgZW5kIG9mIHRoZSB0aWNrIC0gdGhpcyBpcyBhIHBlcmZvcm1hbmNlIG9wdGltaXphdGlvbiBiZWNhdXNlIGJyb3dzZXJzIGludmFsaWRhdGUgc3R5bGVzIGFuZCBmb3JjZSBhIHJlY2FsY3VsYXRpb24gaWYgeW91IHJlYWQsIHdyaXRlLCBhbmQgdGhlbiByZWFkIHN0eWxlIGRhdGEgKHNvIGl0J3MgYmV0dGVyIHRvIHJlYWQvcmVhZC9yZWFkL3dyaXRlL3dyaXRlL3dyaXRlIHRoYW4gcmVhZC93cml0ZS9yZWFkL3dyaXRlL3JlYWQvd3JpdGUpLiBUaGUgZG93biBzaWRlLCBvZiBjb3Vyc2UsIGlzIHRoYXQgdXN1YWxseSB5b3UgV0FOVCB0aGluZ3MgdG8gcmVuZGVyIGltbWVkaWF0ZWx5IGJlY2F1c2UgeW91IG1heSBoYXZlIGNvZGUgcnVubmluZyByaWdodCBhZnRlciB0aGF0IHdoaWNoIGRlcGVuZHMgb24gdGhlIGNoYW5nZS4gTGlrZSBpbWFnaW5lIHJ1bm5pbmcgVHdlZW5MaXRlLnNldCguLi4pIGFuZCB0aGVuIGltbWVkaWF0ZWx5IGFmdGVyIHRoYXQsIGNyZWF0aW5nIGEgbm90aGVyIHR3ZWVuIHRoYXQgYW5pbWF0ZXMgdGhlIHNhbWUgcHJvcGVydHkgdG8gYW5vdGhlciB2YWx1ZTsgdGhlIHN0YXJ0aW5nIHZhbHVlcyBvZiB0aGF0IDJuZCB0d2VlbiB3b3VsZG4ndCBiZSBhY2N1cmF0ZSBpZiBsYXp5IGlzIHRydWUuXG5cdFx0XHRcdFx0dGhpcy5fdGltZSA9IHByZXZUaW1lO1xuXHRcdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHByZXZUb3RhbFRpbWU7XG5cdFx0XHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSBwcmV2UmF3UHJldlRpbWU7XG5cdFx0XHRcdFx0dGhpcy5fY3ljbGUgPSBwcmV2Q3ljbGU7XG5cdFx0XHRcdFx0VHdlZW5MaXRlSW50ZXJuYWxzLmxhenlUd2VlbnMucHVzaCh0aGlzKTtcblx0XHRcdFx0XHR0aGlzLl9sYXp5ID0gW3RpbWUsIHN1cHByZXNzRXZlbnRzXTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9fZWFzZSBpcyBpbml0aWFsbHkgc2V0IHRvIGRlZmF1bHRFYXNlLCBzbyBub3cgdGhhdCBpbml0KCkgaGFzIHJ1biwgX2Vhc2UgaXMgc2V0IHByb3Blcmx5IGFuZCB3ZSBuZWVkIHRvIHJlY2FsY3VsYXRlIHRoZSByYXRpby4gT3ZlcmFsbCB0aGlzIGlzIGZhc3RlciB0aGFuIHVzaW5nIGNvbmRpdGlvbmFsIGxvZ2ljIGVhcmxpZXIgaW4gdGhlIG1ldGhvZCB0byBhdm9pZCBoYXZpbmcgdG8gc2V0IHJhdGlvIHR3aWNlIGJlY2F1c2Ugd2Ugb25seSBpbml0KCkgb25jZSBidXQgcmVuZGVyVGltZSgpIGdldHMgY2FsbGVkIFZFUlkgZnJlcXVlbnRseS5cblx0XHRcdFx0aWYgKHRoaXMuX3RpbWUgJiYgIWlzQ29tcGxldGUpIHtcblx0XHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5nZXRSYXRpbyh0aGlzLl90aW1lIC8gZHVyYXRpb24pO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGlzQ29tcGxldGUgJiYgdGhpcy5fZWFzZS5fY2FsY0VuZCkge1xuXHRcdFx0XHRcdHRoaXMucmF0aW8gPSB0aGlzLl9lYXNlLmdldFJhdGlvKCh0aGlzLl90aW1lID09PSAwKSA/IDAgOiAxKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuX2xhenkgIT09IGZhbHNlKSB7XG5cdFx0XHRcdHRoaXMuX2xhenkgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCF0aGlzLl9hY3RpdmUpIGlmICghdGhpcy5fcGF1c2VkICYmIHRoaXMuX3RpbWUgIT09IHByZXZUaW1lICYmIHRpbWUgPj0gMCkge1xuXHRcdFx0XHR0aGlzLl9hY3RpdmUgPSB0cnVlOyAvL3NvIHRoYXQgaWYgdGhlIHVzZXIgcmVuZGVycyBhIHR3ZWVuIChhcyBvcHBvc2VkIHRvIHRoZSB0aW1lbGluZSByZW5kZXJpbmcgaXQpLCB0aGUgdGltZWxpbmUgaXMgZm9yY2VkIHRvIHJlLXJlbmRlciBhbmQgYWxpZ24gaXQgd2l0aCB0aGUgcHJvcGVyIHRpbWUvZnJhbWUgb24gdGhlIG5leHQgcmVuZGVyaW5nIGN5Y2xlLiBNYXliZSB0aGUgdHdlZW4gYWxyZWFkeSBmaW5pc2hlZCBidXQgdGhlIHVzZXIgbWFudWFsbHkgcmUtcmVuZGVycyBpdCBhcyBoYWxmd2F5IGRvbmUuXG5cdFx0XHR9XG5cdFx0XHRpZiAocHJldlRvdGFsVGltZSA9PT0gMCkge1xuXHRcdFx0XHRpZiAodGhpcy5faW5pdHRlZCA9PT0gMiAmJiB0aW1lID4gMCkge1xuXHRcdFx0XHRcdC8vdGhpcy5pbnZhbGlkYXRlKCk7XG5cdFx0XHRcdFx0dGhpcy5faW5pdCgpOyAvL3dpbGwganVzdCBhcHBseSBvdmVyd3JpdGluZyBzaW5jZSBfaW5pdHRlZCBvZiAoMikgbWVhbnMgaXQgd2FzIGEgZnJvbSgpIHR3ZWVuIHRoYXQgaGFkIGltbWVkaWF0ZVJlbmRlcjp0cnVlXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMuX3N0YXJ0QXQpIHtcblx0XHRcdFx0XHRpZiAodGltZSA+PSAwKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9zdGFydEF0LnJlbmRlcih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIWNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayA9IFwiX2R1bW15R1NcIjsgLy9pZiBubyBjYWxsYmFjayBpcyBkZWZpbmVkLCB1c2UgYSBkdW1teSB2YWx1ZSBqdXN0IHNvIHRoYXQgdGhlIGNvbmRpdGlvbiBhdCB0aGUgZW5kIGV2YWx1YXRlcyBhcyB0cnVlIGJlY2F1c2UgX3N0YXJ0QXQgc2hvdWxkIHJlbmRlciBBRlRFUiB0aGUgbm9ybWFsIHJlbmRlciBsb29wIHdoZW4gdGhlIHRpbWUgaXMgbmVnYXRpdmUuIFdlIGNvdWxkIGhhbmRsZSB0aGlzIGluIGEgbW9yZSBpbnR1aXRpdmUgd2F5LCBvZiBjb3Vyc2UsIGJ1dCB0aGUgcmVuZGVyIGxvb3AgaXMgdGhlIE1PU1QgaW1wb3J0YW50IHRoaW5nIHRvIG9wdGltaXplLCBzbyB0aGlzIHRlY2huaXF1ZSBhbGxvd3MgdXMgdG8gYXZvaWQgYWRkaW5nIGV4dHJhIGNvbmRpdGlvbmFsIGxvZ2ljIGluIGEgaGlnaC1mcmVxdWVuY3kgYXJlYS5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMudmFycy5vblN0YXJ0KSBpZiAodGhpcy5fdG90YWxUaW1lICE9PSAwIHx8IGR1cmF0aW9uID09PSAwKSBpZiAoIXN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2soXCJvblN0YXJ0XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHB0ID0gdGhpcy5fZmlyc3RQVDtcblx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRpZiAocHQuZikge1xuXHRcdFx0XHRcdHB0LnRbcHQucF0ocHQuYyAqIHRoaXMucmF0aW8gKyBwdC5zKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQuYyAqIHRoaXMucmF0aW8gKyBwdC5zO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmICh0aGlzLl9vblVwZGF0ZSkge1xuXHRcdFx0XHRpZiAodGltZSA8IDApIGlmICh0aGlzLl9zdGFydEF0ICYmIHRoaXMuX3N0YXJ0VGltZSkgeyAvL2lmIHRoZSB0d2VlbiBpcyBwb3NpdGlvbmVkIGF0IHRoZSBWRVJZIGJlZ2lubmluZyAoX3N0YXJ0VGltZSAwKSBvZiBpdHMgcGFyZW50IHRpbWVsaW5lLCBpdCdzIGlsbGVnYWwgZm9yIHRoZSBwbGF5aGVhZCB0byBnbyBiYWNrIGZ1cnRoZXIsIHNvIHdlIHNob3VsZCBub3QgcmVuZGVyIHRoZSByZWNvcmRlZCBzdGFydEF0IHZhbHVlcy5cblx0XHRcdFx0XHR0aGlzLl9zdGFydEF0LnJlbmRlcih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpOyAvL25vdGU6IGZvciBwZXJmb3JtYW5jZSByZWFzb25zLCB3ZSB0dWNrIHRoaXMgY29uZGl0aW9uYWwgbG9naWMgaW5zaWRlIGxlc3MgdHJhdmVsZWQgYXJlYXMgKG1vc3QgdHdlZW5zIGRvbid0IGhhdmUgYW4gb25VcGRhdGUpLiBXZSdkIGp1c3QgaGF2ZSBpdCBhdCB0aGUgZW5kIGJlZm9yZSB0aGUgb25Db21wbGV0ZSwgYnV0IHRoZSB2YWx1ZXMgc2hvdWxkIGJlIHVwZGF0ZWQgYmVmb3JlIGFueSBvblVwZGF0ZSBpcyBjYWxsZWQsIHNvIHdlIEFMU08gcHV0IGl0IGhlcmUgYW5kIHRoZW4gaWYgaXQncyBub3QgY2FsbGVkLCB3ZSBkbyBzbyBsYXRlciBuZWFyIHRoZSBvbkNvbXBsZXRlLlxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghc3VwcHJlc3NFdmVudHMpIGlmICh0aGlzLl90b3RhbFRpbWUgIT09IHByZXZUb3RhbFRpbWUgfHwgaXNDb21wbGV0ZSkge1xuXHRcdFx0XHRcdHRoaXMuX2NhbGxiYWNrKFwib25VcGRhdGVcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9jeWNsZSAhPT0gcHJldkN5Y2xlKSBpZiAoIXN1cHByZXNzRXZlbnRzKSBpZiAoIXRoaXMuX2djKSBpZiAodGhpcy52YXJzLm9uUmVwZWF0KSB7XG5cdFx0XHRcdHRoaXMuX2NhbGxiYWNrKFwib25SZXBlYXRcIik7XG5cdFx0XHR9XG5cdFx0XHRpZiAoY2FsbGJhY2spIGlmICghdGhpcy5fZ2MgfHwgZm9yY2UpIHsgLy9jaGVjayBnYyBiZWNhdXNlIHRoZXJlJ3MgYSBjaGFuY2UgdGhhdCBraWxsKCkgY291bGQgYmUgY2FsbGVkIGluIGFuIG9uVXBkYXRlXG5cdFx0XHRcdGlmICh0aW1lIDwgMCAmJiB0aGlzLl9zdGFydEF0ICYmICF0aGlzLl9vblVwZGF0ZSAmJiB0aGlzLl9zdGFydFRpbWUpIHsgLy9pZiB0aGUgdHdlZW4gaXMgcG9zaXRpb25lZCBhdCB0aGUgVkVSWSBiZWdpbm5pbmcgKF9zdGFydFRpbWUgMCkgb2YgaXRzIHBhcmVudCB0aW1lbGluZSwgaXQncyBpbGxlZ2FsIGZvciB0aGUgcGxheWhlYWQgdG8gZ28gYmFjayBmdXJ0aGVyLCBzbyB3ZSBzaG91bGQgbm90IHJlbmRlciB0aGUgcmVjb3JkZWQgc3RhcnRBdCB2YWx1ZXMuXG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5yZW5kZXIodGltZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaXNDb21wbGV0ZSkge1xuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW4pIHtcblx0XHRcdFx0XHRcdHRoaXMuX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFzdXBwcmVzc0V2ZW50cyAmJiB0aGlzLnZhcnNbY2FsbGJhY2tdKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2soY2FsbGJhY2spO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChkdXJhdGlvbiA9PT0gMCAmJiB0aGlzLl9yYXdQcmV2VGltZSA9PT0gX3RpbnlOdW0gJiYgcmF3UHJldlRpbWUgIT09IF90aW55TnVtKSB7IC8vdGhlIG9uQ29tcGxldGUgb3Igb25SZXZlcnNlQ29tcGxldGUgY291bGQgdHJpZ2dlciBtb3ZlbWVudCBvZiB0aGUgcGxheWhlYWQgYW5kIGZvciB6ZXJvLWR1cmF0aW9uIHR3ZWVucyAod2hpY2ggbXVzdCBkaXNjZXJuIGRpcmVjdGlvbikgdGhhdCBsYW5kIGRpcmVjdGx5IGJhY2sgb24gdGhlaXIgc3RhcnQgdGltZSwgd2UgZG9uJ3Qgd2FudCB0byBmaXJlIGFnYWluIG9uIHRoZSBuZXh0IHJlbmRlci4gVGhpbmsgb2Ygc2V2ZXJhbCBhZGRQYXVzZSgpJ3MgaW4gYSB0aW1lbGluZSB0aGF0IGZvcmNlcyB0aGUgcGxheWhlYWQgdG8gYSBjZXJ0YWluIHNwb3QsIGJ1dCB3aGF0IGlmIGl0J3MgYWxyZWFkeSBwYXVzZWQgYW5kIGFub3RoZXIgdHdlZW4gaXMgdHdlZW5pbmcgdGhlIFwidGltZVwiIG9mIHRoZSB0aW1lbGluZT8gRWFjaCB0aW1lIGl0IG1vdmVzIFtmb3J3YXJkXSBwYXN0IHRoYXQgc3BvdCwgaXQgd291bGQgbW92ZSBiYWNrLCBhbmQgc2luY2Ugc3VwcHJlc3NFdmVudHMgaXMgdHJ1ZSwgaXQnZCByZXNldCBfcmF3UHJldlRpbWUgdG8gX3RpbnlOdW0gc28gdGhhdCB3aGVuIGl0IGJlZ2lucyBhZ2FpbiwgdGhlIGNhbGxiYWNrIHdvdWxkIGZpcmUgKHNvIHVsdGltYXRlbHkgaXQgY291bGQgYm91bmNlIGJhY2sgYW5kIGZvcnRoIGR1cmluZyB0aGF0IHR3ZWVuKS4gQWdhaW4sIHRoaXMgaXMgYSB2ZXJ5IHVuY29tbW9uIHNjZW5hcmlvLCBidXQgcG9zc2libGUgbm9uZXRoZWxlc3MuXG5cdFx0XHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRcbi8vLS0tLSBTVEFUSUMgRlVOQ1RJT05TIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XG5cdFx0VHdlZW5NYXgudG8gPSBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCB2YXJzKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFR3ZWVuTWF4KHRhcmdldCwgZHVyYXRpb24sIHZhcnMpO1xuXHRcdH07XG5cdFx0XG5cdFx0VHdlZW5NYXguZnJvbSA9IGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIHZhcnMpIHtcblx0XHRcdHZhcnMucnVuQmFja3dhcmRzID0gdHJ1ZTtcblx0XHRcdHZhcnMuaW1tZWRpYXRlUmVuZGVyID0gKHZhcnMuaW1tZWRpYXRlUmVuZGVyICE9IGZhbHNlKTtcblx0XHRcdHJldHVybiBuZXcgVHdlZW5NYXgodGFyZ2V0LCBkdXJhdGlvbiwgdmFycyk7XG5cdFx0fTtcblx0XHRcblx0XHRUd2Vlbk1heC5mcm9tVG8gPSBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCBmcm9tVmFycywgdG9WYXJzKSB7XG5cdFx0XHR0b1ZhcnMuc3RhcnRBdCA9IGZyb21WYXJzO1xuXHRcdFx0dG9WYXJzLmltbWVkaWF0ZVJlbmRlciA9ICh0b1ZhcnMuaW1tZWRpYXRlUmVuZGVyICE9IGZhbHNlICYmIGZyb21WYXJzLmltbWVkaWF0ZVJlbmRlciAhPSBmYWxzZSk7XG5cdFx0XHRyZXR1cm4gbmV3IFR3ZWVuTWF4KHRhcmdldCwgZHVyYXRpb24sIHRvVmFycyk7XG5cdFx0fTtcblx0XHRcblx0XHRUd2Vlbk1heC5zdGFnZ2VyVG8gPSBUd2Vlbk1heC5hbGxUbyA9IGZ1bmN0aW9uKHRhcmdldHMsIGR1cmF0aW9uLCB2YXJzLCBzdGFnZ2VyLCBvbkNvbXBsZXRlQWxsLCBvbkNvbXBsZXRlQWxsUGFyYW1zLCBvbkNvbXBsZXRlQWxsU2NvcGUpIHtcblx0XHRcdHN0YWdnZXIgPSBzdGFnZ2VyIHx8IDA7XG5cdFx0XHR2YXIgZGVsYXkgPSB2YXJzLmRlbGF5IHx8IDAsXG5cdFx0XHRcdGEgPSBbXSxcblx0XHRcdFx0ZmluYWxDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmICh2YXJzLm9uQ29tcGxldGUpIHtcblx0XHRcdFx0XHRcdHZhcnMub25Db21wbGV0ZS5hcHBseSh2YXJzLm9uQ29tcGxldGVTY29wZSB8fCB0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRvbkNvbXBsZXRlQWxsLmFwcGx5KG9uQ29tcGxldGVBbGxTY29wZSB8fCB2YXJzLmNhbGxiYWNrU2NvcGUgfHwgdGhpcywgb25Db21wbGV0ZUFsbFBhcmFtcyB8fCBfYmxhbmtBcnJheSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGwsIGNvcHksIGksIHA7XG5cdFx0XHRpZiAoIV9pc0FycmF5KHRhcmdldHMpKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YodGFyZ2V0cykgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHR0YXJnZXRzID0gVHdlZW5MaXRlLnNlbGVjdG9yKHRhcmdldHMpIHx8IHRhcmdldHM7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKF9pc1NlbGVjdG9yKHRhcmdldHMpKSB7XG5cdFx0XHRcdFx0dGFyZ2V0cyA9IF9zbGljZSh0YXJnZXRzKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGFyZ2V0cyA9IHRhcmdldHMgfHwgW107XG5cdFx0XHRpZiAoc3RhZ2dlciA8IDApIHtcblx0XHRcdFx0dGFyZ2V0cyA9IF9zbGljZSh0YXJnZXRzKTtcblx0XHRcdFx0dGFyZ2V0cy5yZXZlcnNlKCk7XG5cdFx0XHRcdHN0YWdnZXIgKj0gLTE7XG5cdFx0XHR9XG5cdFx0XHRsID0gdGFyZ2V0cy5sZW5ndGggLSAxO1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8PSBsOyBpKyspIHtcblx0XHRcdFx0Y29weSA9IHt9O1xuXHRcdFx0XHRmb3IgKHAgaW4gdmFycykge1xuXHRcdFx0XHRcdGNvcHlbcF0gPSB2YXJzW3BdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvcHkuZGVsYXkgPSBkZWxheTtcblx0XHRcdFx0aWYgKGkgPT09IGwgJiYgb25Db21wbGV0ZUFsbCkge1xuXHRcdFx0XHRcdGNvcHkub25Db21wbGV0ZSA9IGZpbmFsQ29tcGxldGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0YVtpXSA9IG5ldyBUd2Vlbk1heCh0YXJnZXRzW2ldLCBkdXJhdGlvbiwgY29weSk7XG5cdFx0XHRcdGRlbGF5ICs9IHN0YWdnZXI7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYTtcblx0XHR9O1xuXHRcdFxuXHRcdFR3ZWVuTWF4LnN0YWdnZXJGcm9tID0gVHdlZW5NYXguYWxsRnJvbSA9IGZ1bmN0aW9uKHRhcmdldHMsIGR1cmF0aW9uLCB2YXJzLCBzdGFnZ2VyLCBvbkNvbXBsZXRlQWxsLCBvbkNvbXBsZXRlQWxsUGFyYW1zLCBvbkNvbXBsZXRlQWxsU2NvcGUpIHtcblx0XHRcdHZhcnMucnVuQmFja3dhcmRzID0gdHJ1ZTtcblx0XHRcdHZhcnMuaW1tZWRpYXRlUmVuZGVyID0gKHZhcnMuaW1tZWRpYXRlUmVuZGVyICE9IGZhbHNlKTtcblx0XHRcdHJldHVybiBUd2Vlbk1heC5zdGFnZ2VyVG8odGFyZ2V0cywgZHVyYXRpb24sIHZhcnMsIHN0YWdnZXIsIG9uQ29tcGxldGVBbGwsIG9uQ29tcGxldGVBbGxQYXJhbXMsIG9uQ29tcGxldGVBbGxTY29wZSk7XG5cdFx0fTtcblx0XHRcblx0XHRUd2Vlbk1heC5zdGFnZ2VyRnJvbVRvID0gVHdlZW5NYXguYWxsRnJvbVRvID0gZnVuY3Rpb24odGFyZ2V0cywgZHVyYXRpb24sIGZyb21WYXJzLCB0b1ZhcnMsIHN0YWdnZXIsIG9uQ29tcGxldGVBbGwsIG9uQ29tcGxldGVBbGxQYXJhbXMsIG9uQ29tcGxldGVBbGxTY29wZSkge1xuXHRcdFx0dG9WYXJzLnN0YXJ0QXQgPSBmcm9tVmFycztcblx0XHRcdHRvVmFycy5pbW1lZGlhdGVSZW5kZXIgPSAodG9WYXJzLmltbWVkaWF0ZVJlbmRlciAhPSBmYWxzZSAmJiBmcm9tVmFycy5pbW1lZGlhdGVSZW5kZXIgIT0gZmFsc2UpO1xuXHRcdFx0cmV0dXJuIFR3ZWVuTWF4LnN0YWdnZXJUbyh0YXJnZXRzLCBkdXJhdGlvbiwgdG9WYXJzLCBzdGFnZ2VyLCBvbkNvbXBsZXRlQWxsLCBvbkNvbXBsZXRlQWxsUGFyYW1zLCBvbkNvbXBsZXRlQWxsU2NvcGUpO1xuXHRcdH07XG5cdFx0XHRcdFxuXHRcdFR3ZWVuTWF4LmRlbGF5ZWRDYWxsID0gZnVuY3Rpb24oZGVsYXksIGNhbGxiYWNrLCBwYXJhbXMsIHNjb3BlLCB1c2VGcmFtZXMpIHtcblx0XHRcdHJldHVybiBuZXcgVHdlZW5NYXgoY2FsbGJhY2ssIDAsIHtkZWxheTpkZWxheSwgb25Db21wbGV0ZTpjYWxsYmFjaywgb25Db21wbGV0ZVBhcmFtczpwYXJhbXMsIGNhbGxiYWNrU2NvcGU6c2NvcGUsIG9uUmV2ZXJzZUNvbXBsZXRlOmNhbGxiYWNrLCBvblJldmVyc2VDb21wbGV0ZVBhcmFtczpwYXJhbXMsIGltbWVkaWF0ZVJlbmRlcjpmYWxzZSwgdXNlRnJhbWVzOnVzZUZyYW1lcywgb3ZlcndyaXRlOjB9KTtcblx0XHR9O1xuXHRcdFxuXHRcdFR3ZWVuTWF4LnNldCA9IGZ1bmN0aW9uKHRhcmdldCwgdmFycykge1xuXHRcdFx0cmV0dXJuIG5ldyBUd2Vlbk1heCh0YXJnZXQsIDAsIHZhcnMpO1xuXHRcdH07XG5cdFx0XG5cdFx0VHdlZW5NYXguaXNUd2VlbmluZyA9IGZ1bmN0aW9uKHRhcmdldCkge1xuXHRcdFx0cmV0dXJuIChUd2VlbkxpdGUuZ2V0VHdlZW5zT2YodGFyZ2V0LCB0cnVlKS5sZW5ndGggPiAwKTtcblx0XHR9O1xuXHRcdFxuXHRcdHZhciBfZ2V0Q2hpbGRyZW5PZiA9IGZ1bmN0aW9uKHRpbWVsaW5lLCBpbmNsdWRlVGltZWxpbmVzKSB7XG5cdFx0XHRcdHZhciBhID0gW10sXG5cdFx0XHRcdFx0Y250ID0gMCxcblx0XHRcdFx0XHR0d2VlbiA9IHRpbWVsaW5lLl9maXJzdDtcblx0XHRcdFx0d2hpbGUgKHR3ZWVuKSB7XG5cdFx0XHRcdFx0aWYgKHR3ZWVuIGluc3RhbmNlb2YgVHdlZW5MaXRlKSB7XG5cdFx0XHRcdFx0XHRhW2NudCsrXSA9IHR3ZWVuO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiAoaW5jbHVkZVRpbWVsaW5lcykge1xuXHRcdFx0XHRcdFx0XHRhW2NudCsrXSA9IHR3ZWVuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YSA9IGEuY29uY2F0KF9nZXRDaGlsZHJlbk9mKHR3ZWVuLCBpbmNsdWRlVGltZWxpbmVzKSk7XG5cdFx0XHRcdFx0XHRjbnQgPSBhLmxlbmd0aDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dHdlZW4gPSB0d2Vlbi5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gYTtcblx0XHRcdH0sIFxuXHRcdFx0Z2V0QWxsVHdlZW5zID0gVHdlZW5NYXguZ2V0QWxsVHdlZW5zID0gZnVuY3Rpb24oaW5jbHVkZVRpbWVsaW5lcykge1xuXHRcdFx0XHRyZXR1cm4gX2dldENoaWxkcmVuT2YoQW5pbWF0aW9uLl9yb290VGltZWxpbmUsIGluY2x1ZGVUaW1lbGluZXMpLmNvbmNhdCggX2dldENoaWxkcmVuT2YoQW5pbWF0aW9uLl9yb290RnJhbWVzVGltZWxpbmUsIGluY2x1ZGVUaW1lbGluZXMpICk7XG5cdFx0XHR9O1xuXHRcdFxuXHRcdFR3ZWVuTWF4LmtpbGxBbGwgPSBmdW5jdGlvbihjb21wbGV0ZSwgdHdlZW5zLCBkZWxheWVkQ2FsbHMsIHRpbWVsaW5lcykge1xuXHRcdFx0aWYgKHR3ZWVucyA9PSBudWxsKSB7XG5cdFx0XHRcdHR3ZWVucyA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZGVsYXllZENhbGxzID09IG51bGwpIHtcblx0XHRcdFx0ZGVsYXllZENhbGxzID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHZhciBhID0gZ2V0QWxsVHdlZW5zKCh0aW1lbGluZXMgIT0gZmFsc2UpKSxcblx0XHRcdFx0bCA9IGEubGVuZ3RoLFxuXHRcdFx0XHRhbGxUcnVlID0gKHR3ZWVucyAmJiBkZWxheWVkQ2FsbHMgJiYgdGltZWxpbmVzKSxcblx0XHRcdFx0aXNEQywgdHdlZW4sIGk7XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdHR3ZWVuID0gYVtpXTtcblx0XHRcdFx0aWYgKGFsbFRydWUgfHwgKHR3ZWVuIGluc3RhbmNlb2YgU2ltcGxlVGltZWxpbmUpIHx8ICgoaXNEQyA9ICh0d2Vlbi50YXJnZXQgPT09IHR3ZWVuLnZhcnMub25Db21wbGV0ZSkpICYmIGRlbGF5ZWRDYWxscykgfHwgKHR3ZWVucyAmJiAhaXNEQykpIHtcblx0XHRcdFx0XHRpZiAoY29tcGxldGUpIHtcblx0XHRcdFx0XHRcdHR3ZWVuLnRvdGFsVGltZSh0d2Vlbi5fcmV2ZXJzZWQgPyAwIDogdHdlZW4udG90YWxEdXJhdGlvbigpKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dHdlZW4uX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuXHRcdFR3ZWVuTWF4LmtpbGxDaGlsZFR3ZWVuc09mID0gZnVuY3Rpb24ocGFyZW50LCBjb21wbGV0ZSkge1xuXHRcdFx0aWYgKHBhcmVudCA9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHZhciB0bCA9IFR3ZWVuTGl0ZUludGVybmFscy50d2Vlbkxvb2t1cCxcblx0XHRcdFx0YSwgY3VyUGFyZW50LCBwLCBpLCBsO1xuXHRcdFx0aWYgKHR5cGVvZihwYXJlbnQpID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdHBhcmVudCA9IFR3ZWVuTGl0ZS5zZWxlY3RvcihwYXJlbnQpIHx8IHBhcmVudDtcblx0XHRcdH1cblx0XHRcdGlmIChfaXNTZWxlY3RvcihwYXJlbnQpKSB7XG5cdFx0XHRcdHBhcmVudCA9IF9zbGljZShwYXJlbnQpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKF9pc0FycmF5KHBhcmVudCkpIHtcblx0XHRcdFx0aSA9IHBhcmVudC5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFR3ZWVuTWF4LmtpbGxDaGlsZFR3ZWVuc09mKHBhcmVudFtpXSwgY29tcGxldGUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGEgPSBbXTtcblx0XHRcdGZvciAocCBpbiB0bCkge1xuXHRcdFx0XHRjdXJQYXJlbnQgPSB0bFtwXS50YXJnZXQucGFyZW50Tm9kZTtcblx0XHRcdFx0d2hpbGUgKGN1clBhcmVudCkge1xuXHRcdFx0XHRcdGlmIChjdXJQYXJlbnQgPT09IHBhcmVudCkge1xuXHRcdFx0XHRcdFx0YSA9IGEuY29uY2F0KHRsW3BdLnR3ZWVucyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGN1clBhcmVudCA9IGN1clBhcmVudC5wYXJlbnROb2RlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRsID0gYS5sZW5ndGg7XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdGlmIChjb21wbGV0ZSkge1xuXHRcdFx0XHRcdGFbaV0udG90YWxUaW1lKGFbaV0udG90YWxEdXJhdGlvbigpKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhW2ldLl9lbmFibGVkKGZhbHNlLCBmYWxzZSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHZhciBfY2hhbmdlUGF1c2UgPSBmdW5jdGlvbihwYXVzZSwgdHdlZW5zLCBkZWxheWVkQ2FsbHMsIHRpbWVsaW5lcykge1xuXHRcdFx0dHdlZW5zID0gKHR3ZWVucyAhPT0gZmFsc2UpO1xuXHRcdFx0ZGVsYXllZENhbGxzID0gKGRlbGF5ZWRDYWxscyAhPT0gZmFsc2UpO1xuXHRcdFx0dGltZWxpbmVzID0gKHRpbWVsaW5lcyAhPT0gZmFsc2UpO1xuXHRcdFx0dmFyIGEgPSBnZXRBbGxUd2VlbnModGltZWxpbmVzKSxcblx0XHRcdFx0YWxsVHJ1ZSA9ICh0d2VlbnMgJiYgZGVsYXllZENhbGxzICYmIHRpbWVsaW5lcyksXG5cdFx0XHRcdGkgPSBhLmxlbmd0aCxcblx0XHRcdFx0aXNEQywgdHdlZW47XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0dHdlZW4gPSBhW2ldO1xuXHRcdFx0XHRpZiAoYWxsVHJ1ZSB8fCAodHdlZW4gaW5zdGFuY2VvZiBTaW1wbGVUaW1lbGluZSkgfHwgKChpc0RDID0gKHR3ZWVuLnRhcmdldCA9PT0gdHdlZW4udmFycy5vbkNvbXBsZXRlKSkgJiYgZGVsYXllZENhbGxzKSB8fCAodHdlZW5zICYmICFpc0RDKSkge1xuXHRcdFx0XHRcdHR3ZWVuLnBhdXNlZChwYXVzZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuXHRcdFR3ZWVuTWF4LnBhdXNlQWxsID0gZnVuY3Rpb24odHdlZW5zLCBkZWxheWVkQ2FsbHMsIHRpbWVsaW5lcykge1xuXHRcdFx0X2NoYW5nZVBhdXNlKHRydWUsIHR3ZWVucywgZGVsYXllZENhbGxzLCB0aW1lbGluZXMpO1xuXHRcdH07XG5cdFx0XG5cdFx0VHdlZW5NYXgucmVzdW1lQWxsID0gZnVuY3Rpb24odHdlZW5zLCBkZWxheWVkQ2FsbHMsIHRpbWVsaW5lcykge1xuXHRcdFx0X2NoYW5nZVBhdXNlKGZhbHNlLCB0d2VlbnMsIGRlbGF5ZWRDYWxscywgdGltZWxpbmVzKTtcblx0XHR9O1xuXG5cdFx0VHdlZW5NYXguZ2xvYmFsVGltZVNjYWxlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHZhciB0bCA9IEFuaW1hdGlvbi5fcm9vdFRpbWVsaW5lLFxuXHRcdFx0XHR0ID0gVHdlZW5MaXRlLnRpY2tlci50aW1lO1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0bC5fdGltZVNjYWxlO1xuXHRcdFx0fVxuXHRcdFx0dmFsdWUgPSB2YWx1ZSB8fCBfdGlueU51bTsgLy9jYW4ndCBhbGxvdyB6ZXJvIGJlY2F1c2UgaXQnbGwgdGhyb3cgdGhlIG1hdGggb2ZmXG5cdFx0XHR0bC5fc3RhcnRUaW1lID0gdCAtICgodCAtIHRsLl9zdGFydFRpbWUpICogdGwuX3RpbWVTY2FsZSAvIHZhbHVlKTtcblx0XHRcdHRsID0gQW5pbWF0aW9uLl9yb290RnJhbWVzVGltZWxpbmU7XG5cdFx0XHR0ID0gVHdlZW5MaXRlLnRpY2tlci5mcmFtZTtcblx0XHRcdHRsLl9zdGFydFRpbWUgPSB0IC0gKCh0IC0gdGwuX3N0YXJ0VGltZSkgKiB0bC5fdGltZVNjYWxlIC8gdmFsdWUpO1xuXHRcdFx0dGwuX3RpbWVTY2FsZSA9IEFuaW1hdGlvbi5fcm9vdFRpbWVsaW5lLl90aW1lU2NhbGUgPSB2YWx1ZTtcblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9O1xuXHRcdFxuXHRcbi8vLS0tLSBHRVRURVJTIC8gU0VUVEVSUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XG5cdFx0cC5wcm9ncmVzcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gKCFhcmd1bWVudHMubGVuZ3RoKSA/IHRoaXMuX3RpbWUgLyB0aGlzLmR1cmF0aW9uKCkgOiB0aGlzLnRvdGFsVGltZSggdGhpcy5kdXJhdGlvbigpICogKCh0aGlzLl95b3lvICYmICh0aGlzLl9jeWNsZSAmIDEpICE9PSAwKSA/IDEgLSB2YWx1ZSA6IHZhbHVlKSArICh0aGlzLl9jeWNsZSAqICh0aGlzLl9kdXJhdGlvbiArIHRoaXMuX3JlcGVhdERlbGF5KSksIGZhbHNlKTtcblx0XHR9O1xuXHRcdFxuXHRcdHAudG90YWxQcm9ncmVzcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRyZXR1cm4gKCFhcmd1bWVudHMubGVuZ3RoKSA/IHRoaXMuX3RvdGFsVGltZSAvIHRoaXMudG90YWxEdXJhdGlvbigpIDogdGhpcy50b3RhbFRpbWUoIHRoaXMudG90YWxEdXJhdGlvbigpICogdmFsdWUsIGZhbHNlKTtcblx0XHR9O1xuXHRcdFxuXHRcdHAudGltZSA9IGZ1bmN0aW9uKHZhbHVlLCBzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl90aW1lO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuX2RpcnR5KSB7XG5cdFx0XHRcdHRoaXMudG90YWxEdXJhdGlvbigpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZhbHVlID4gdGhpcy5fZHVyYXRpb24pIHtcblx0XHRcdFx0dmFsdWUgPSB0aGlzLl9kdXJhdGlvbjtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl95b3lvICYmICh0aGlzLl9jeWNsZSAmIDEpICE9PSAwKSB7XG5cdFx0XHRcdHZhbHVlID0gKHRoaXMuX2R1cmF0aW9uIC0gdmFsdWUpICsgKHRoaXMuX2N5Y2xlICogKHRoaXMuX2R1cmF0aW9uICsgdGhpcy5fcmVwZWF0RGVsYXkpKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5fcmVwZWF0ICE9PSAwKSB7XG5cdFx0XHRcdHZhbHVlICs9IHRoaXMuX2N5Y2xlICogKHRoaXMuX2R1cmF0aW9uICsgdGhpcy5fcmVwZWF0RGVsYXkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMudG90YWxUaW1lKHZhbHVlLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0fTtcblxuXHRcdHAuZHVyYXRpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9kdXJhdGlvbjsgLy9kb24ndCBzZXQgX2RpcnR5ID0gZmFsc2UgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSByZXBlYXRzIHRoYXQgaGF2ZW4ndCBiZWVuIGZhY3RvcmVkIGludG8gdGhlIF90b3RhbER1cmF0aW9uIHlldC4gT3RoZXJ3aXNlLCBpZiB5b3UgY3JlYXRlIGEgcmVwZWF0ZWQgVHdlZW5NYXggYW5kIHRoZW4gaW1tZWRpYXRlbHkgY2hlY2sgaXRzIGR1cmF0aW9uKCksIGl0IHdvdWxkIGNhY2hlIHRoZSB2YWx1ZSBhbmQgdGhlIHRvdGFsRHVyYXRpb24gd291bGQgbm90IGJlIGNvcnJlY3QsIHRodXMgcmVwZWF0cyB3b3VsZG4ndCB0YWtlIGVmZmVjdC5cblx0XHRcdH1cblx0XHRcdHJldHVybiBBbmltYXRpb24ucHJvdG90eXBlLmR1cmF0aW9uLmNhbGwodGhpcywgdmFsdWUpO1xuXHRcdH07XG5cblx0XHRwLnRvdGFsRHVyYXRpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdGlmICh0aGlzLl9kaXJ0eSkge1xuXHRcdFx0XHRcdC8vaW5zdGVhZCBvZiBJbmZpbml0eSwgd2UgdXNlIDk5OTk5OTk5OTk5OSBzbyB0aGF0IHdlIGNhbiBhY2NvbW1vZGF0ZSByZXZlcnNlc1xuXHRcdFx0XHRcdHRoaXMuX3RvdGFsRHVyYXRpb24gPSAodGhpcy5fcmVwZWF0ID09PSAtMSkgPyA5OTk5OTk5OTk5OTkgOiB0aGlzLl9kdXJhdGlvbiAqICh0aGlzLl9yZXBlYXQgKyAxKSArICh0aGlzLl9yZXBlYXREZWxheSAqIHRoaXMuX3JlcGVhdCk7XG5cdFx0XHRcdFx0dGhpcy5fZGlydHkgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fdG90YWxEdXJhdGlvbjtcblx0XHRcdH1cblx0XHRcdHJldHVybiAodGhpcy5fcmVwZWF0ID09PSAtMSkgPyB0aGlzIDogdGhpcy5kdXJhdGlvbiggKHZhbHVlIC0gKHRoaXMuX3JlcGVhdCAqIHRoaXMuX3JlcGVhdERlbGF5KSkgLyAodGhpcy5fcmVwZWF0ICsgMSkgKTtcblx0XHR9O1xuXHRcdFxuXHRcdHAucmVwZWF0ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fcmVwZWF0O1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fcmVwZWF0ID0gdmFsdWU7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHR9O1xuXHRcdFxuXHRcdHAucmVwZWF0RGVsYXkgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9yZXBlYXREZWxheTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3JlcGVhdERlbGF5ID0gdmFsdWU7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHR9O1xuXHRcdFxuXHRcdHAueW95byA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3lveW87XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl95b3lvID0gdmFsdWU7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXHRcdFxuXHRcdFxuXHRcdHJldHVybiBUd2Vlbk1heDtcblx0XHRcblx0fSwgdHJ1ZSk7XG5cblxuXG5cblxuXG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFRpbWVsaW5lTGl0ZVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdF9nc1Njb3BlLl9nc0RlZmluZShcIlRpbWVsaW5lTGl0ZVwiLCBbXCJjb3JlLkFuaW1hdGlvblwiLFwiY29yZS5TaW1wbGVUaW1lbGluZVwiLFwiVHdlZW5MaXRlXCJdLCBmdW5jdGlvbihBbmltYXRpb24sIFNpbXBsZVRpbWVsaW5lLCBUd2VlbkxpdGUpIHtcblxuXHRcdHZhciBUaW1lbGluZUxpdGUgPSBmdW5jdGlvbih2YXJzKSB7XG5cdFx0XHRcdFNpbXBsZVRpbWVsaW5lLmNhbGwodGhpcywgdmFycyk7XG5cdFx0XHRcdHRoaXMuX2xhYmVscyA9IHt9O1xuXHRcdFx0XHR0aGlzLmF1dG9SZW1vdmVDaGlsZHJlbiA9ICh0aGlzLnZhcnMuYXV0b1JlbW92ZUNoaWxkcmVuID09PSB0cnVlKTtcblx0XHRcdFx0dGhpcy5zbW9vdGhDaGlsZFRpbWluZyA9ICh0aGlzLnZhcnMuc21vb3RoQ2hpbGRUaW1pbmcgPT09IHRydWUpO1xuXHRcdFx0XHR0aGlzLl9zb3J0Q2hpbGRyZW4gPSB0cnVlO1xuXHRcdFx0XHR0aGlzLl9vblVwZGF0ZSA9IHRoaXMudmFycy5vblVwZGF0ZTtcblx0XHRcdFx0dmFyIHYgPSB0aGlzLnZhcnMsXG5cdFx0XHRcdFx0dmFsLCBwO1xuXHRcdFx0XHRmb3IgKHAgaW4gdikge1xuXHRcdFx0XHRcdHZhbCA9IHZbcF07XG5cdFx0XHRcdFx0aWYgKF9pc0FycmF5KHZhbCkpIGlmICh2YWwuam9pbihcIlwiKS5pbmRleE9mKFwie3NlbGZ9XCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0dltwXSA9IHRoaXMuX3N3YXBTZWxmSW5QYXJhbXModmFsKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKF9pc0FycmF5KHYudHdlZW5zKSkge1xuXHRcdFx0XHRcdHRoaXMuYWRkKHYudHdlZW5zLCAwLCB2LmFsaWduLCB2LnN0YWdnZXIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0X3RpbnlOdW0gPSAwLjAwMDAwMDAwMDEsXG5cdFx0XHRUd2VlbkxpdGVJbnRlcm5hbHMgPSBUd2VlbkxpdGUuX2ludGVybmFscyxcblx0XHRcdF9pbnRlcm5hbHMgPSBUaW1lbGluZUxpdGUuX2ludGVybmFscyA9IHt9LFxuXHRcdFx0X2lzU2VsZWN0b3IgPSBUd2VlbkxpdGVJbnRlcm5hbHMuaXNTZWxlY3Rvcixcblx0XHRcdF9pc0FycmF5ID0gVHdlZW5MaXRlSW50ZXJuYWxzLmlzQXJyYXksXG5cdFx0XHRfbGF6eVR3ZWVucyA9IFR3ZWVuTGl0ZUludGVybmFscy5sYXp5VHdlZW5zLFxuXHRcdFx0X2xhenlSZW5kZXIgPSBUd2VlbkxpdGVJbnRlcm5hbHMubGF6eVJlbmRlcixcblx0XHRcdF9ibGFua0FycmF5ID0gW10sXG5cdFx0XHRfZ2xvYmFscyA9IF9nc1Njb3BlLl9nc0RlZmluZS5nbG9iYWxzLFxuXHRcdFx0X2NvcHkgPSBmdW5jdGlvbih2YXJzKSB7XG5cdFx0XHRcdHZhciBjb3B5ID0ge30sIHA7XG5cdFx0XHRcdGZvciAocCBpbiB2YXJzKSB7XG5cdFx0XHRcdFx0Y29weVtwXSA9IHZhcnNbcF07XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGNvcHk7XG5cdFx0XHR9LFxuXHRcdFx0X3BhdXNlQ2FsbGJhY2sgPSBfaW50ZXJuYWxzLnBhdXNlQ2FsbGJhY2sgPSBmdW5jdGlvbih0d2VlbiwgY2FsbGJhY2ssIHBhcmFtcywgc2NvcGUpIHtcblx0XHRcdFx0dmFyIHRsID0gdHdlZW4uX3RpbWVsaW5lLFxuXHRcdFx0XHRcdHRpbWUgPSB0bC5fdG90YWxUaW1lLFxuXHRcdFx0XHRcdHN0YXJ0VGltZSA9IHR3ZWVuLl9zdGFydFRpbWUsXG5cdFx0XHRcdFx0cmV2ZXJzZWQgPSAodHdlZW4uX3Jhd1ByZXZUaW1lIDwgMCB8fCAodHdlZW4uX3Jhd1ByZXZUaW1lID09PSAwICYmIHRsLl9yZXZlcnNlZCkpLC8vZG9uJ3QgdXNlIHR3ZWVuLnJhdGlvIGJlY2F1c2UgaWYgdGhlIHBsYXloZWFkIGxhbmRzIGV4YWN0bHkgb24gdG9wIG9mIHRoZSBhZGRQYXVzZSgpLCByYXRpbyB3aWxsIGJlIDEgZXZlbiBpZiB0aGUgbWFzdGVyIHRpbWVsaW5lIHdhcyByZXZlcnNlZCAod2hpY2ggaXMgY29ycmVjdCkuIFRoZSBrZXkgaGVyZSBpcyB0byBzZW5zZSB0aGUgZGlyZWN0aW9uIG9mIHRoZSBwbGF5aGVhZC5cblx0XHRcdFx0XHRuZXh0ID0gcmV2ZXJzZWQgPyAwIDogX3RpbnlOdW0sXG5cdFx0XHRcdFx0cHJldiA9IHJldmVyc2VkID8gX3RpbnlOdW0gOiAwLFxuXHRcdFx0XHRcdHNpYmxpbmc7XG5cdFx0XHRcdGlmIChjYWxsYmFjayB8fCAhdGhpcy5fZm9yY2luZ1BsYXloZWFkKSB7IC8vaWYgdGhlIHVzZXIgY2FsbHMgYSBtZXRob2QgdGhhdCBtb3ZlcyB0aGUgcGxheWhlYWQgKGxpa2UgcHJvZ3Jlc3MoKSBvciB0aW1lKCkpLCBpdCBzaG91bGQgaG9ub3IgdGhhdCBhbmQgc2tpcCBhbnkgcGF1c2VzIChhbHRob3VnaCBpZiB0aGVyZSdzIGEgY2FsbGJhY2sgcG9zaXRpb25lZCBhdCB0aGF0IHBhdXNlLCBpdCBtdXN0IGp1bXAgdGhlcmUgYW5kIG1ha2UgdGhlIGNhbGwgdG8gZW5zdXJlIHRoZSB0aW1lIGlzIEVYQUNUTFkgd2hhdCBpdCBpcyBzdXBwb3NlZCB0byBiZSwgYW5kIHRoZW4gcHJvY2VlZCB0byB3aGVyZSB0aGUgcGxheWhlYWQgaXMgYmVpbmcgZm9yY2VkKS4gT3RoZXJ3aXNlLCBpbWFnaW5lIHBsYWNpbmcgYSBwYXVzZSBpbiB0aGUgbWlkZGxlIG9mIGEgdGltZWxpbmUgYW5kIHRoZW4gZG9pbmcgdGltZWxpbmUucHJvZ3Jlc3MoMC45KSAtIGl0IHdvdWxkIGdldCBzdHVjayB3aGVyZSB0aGUgcGF1c2UgaXMuXG5cdFx0XHRcdFx0dGwucGF1c2Uoc3RhcnRUaW1lKTtcblx0XHRcdFx0XHQvL25vdyBmaW5kIHNpYmxpbmcgdHdlZW5zIHRoYXQgYXJlIEVYQUNUTFkgYXQgdGhlIHNhbWUgc3BvdCBvbiB0aGUgdGltZWxpbmUgYW5kIGFkanVzdCB0aGUgX3Jhd1ByZXZUaW1lIHNvIHRoYXQgdGhleSBmaXJlIChvciBkb24ndCBmaXJlKSBjb3JyZWN0bHkgb24gdGhlIG5leHQgcmVuZGVyLiBUaGlzIGlzIHByaW1hcmlseSB0byBhY2NvbW1vZGF0ZSB6ZXJvLWR1cmF0aW9uIHR3ZWVucy9jYWxsYmFja3MgdGhhdCBhcmUgcG9zaXRpb25lZCByaWdodCBvbiB0b3Agb2YgYSBwYXVzZS4gRm9yIGV4YW1wbGUsIHRsLnRvKC4uLikuY2FsbCguLi4pLmFkZFBhdXNlKC4uLikuY2FsbCguLi4pIC0gbm90aWNlIHRoYXQgdGhlcmUncyBhIGNhbGwoKSBvbiBlYWNoIHNpZGUgb2YgdGhlIHBhdXNlLCBzbyB3aGVuIGl0J3MgcnVubmluZyBmb3J3YXJkIGl0IHNob3VsZCBjYWxsIHRoZSBmaXJzdCBvbmUgYW5kIHRoZW4gcGF1c2UsIGFuZCB0aGVuIHdoZW4gcmVzdW1lZCwgY2FsbCB0aGUgb3RoZXIuIFplcm8tZHVyYXRpb24gdHdlZW5zIHVzZSBfcmF3UHJldlRpbWUgdG8gc2Vuc2UgbW9tZW50dW0gZmlndXJlIG91dCBpZiBldmVudHMgd2VyZSBzdXBwcmVzc2VkIHdoZW4gYXJyaXZpbmcgZGlyZWN0bHkgb24gdG9wIG9mIHRoYXQgdGltZS5cblx0XHRcdFx0XHRzaWJsaW5nID0gdHdlZW4uX3ByZXY7XG5cdFx0XHRcdFx0d2hpbGUgKHNpYmxpbmcgJiYgc2libGluZy5fc3RhcnRUaW1lID09PSBzdGFydFRpbWUpIHtcblx0XHRcdFx0XHRcdHNpYmxpbmcuX3Jhd1ByZXZUaW1lID0gcHJldjtcblx0XHRcdFx0XHRcdHNpYmxpbmcgPSBzaWJsaW5nLl9wcmV2O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzaWJsaW5nID0gdHdlZW4uX25leHQ7XG5cdFx0XHRcdFx0d2hpbGUgKHNpYmxpbmcgJiYgc2libGluZy5fc3RhcnRUaW1lID09PSBzdGFydFRpbWUpIHtcblx0XHRcdFx0XHRcdHNpYmxpbmcuX3Jhd1ByZXZUaW1lID0gbmV4dDtcblx0XHRcdFx0XHRcdHNpYmxpbmcgPSBzaWJsaW5nLl9uZXh0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoY2FsbGJhY2spIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrLmFwcGx5KHNjb3BlIHx8IHRsLnZhcnMuY2FsbGJhY2tTY29wZSB8fCB0bCwgcGFyYW1zIHx8IF9ibGFua0FycmF5KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHRoaXMuX2ZvcmNpbmdQbGF5aGVhZCB8fCAhdGwuX3BhdXNlZCkgeyAvL3RoZSBjYWxsYmFjayBjb3VsZCBoYXZlIGNhbGxlZCByZXN1bWUoKS5cblx0XHRcdFx0XHRcdHRsLnNlZWsodGltZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0X3NsaWNlID0gZnVuY3Rpb24oYSkgeyAvL2Rvbid0IHVzZSBbXS5zbGljZSBiZWNhdXNlIHRoYXQgZG9lc24ndCB3b3JrIGluIElFOCB3aXRoIGEgTm9kZUxpc3QgdGhhdCdzIHJldHVybmVkIGJ5IHF1ZXJ5U2VsZWN0b3JBbGwoKVxuXHRcdFx0XHR2YXIgYiA9IFtdLFxuXHRcdFx0XHRcdGwgPSBhLmxlbmd0aCxcblx0XHRcdFx0XHRpO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpICE9PSBsOyBiLnB1c2goYVtpKytdKSk7XG5cdFx0XHRcdHJldHVybiBiO1xuXHRcdFx0fSxcblx0XHRcdHAgPSBUaW1lbGluZUxpdGUucHJvdG90eXBlID0gbmV3IFNpbXBsZVRpbWVsaW5lKCk7XG5cblx0XHRUaW1lbGluZUxpdGUudmVyc2lvbiA9IFwiMS4xNy4wXCI7XG5cdFx0cC5jb25zdHJ1Y3RvciA9IFRpbWVsaW5lTGl0ZTtcblx0XHRwLmtpbGwoKS5fZ2MgPSBwLl9mb3JjaW5nUGxheWhlYWQgPSBmYWxzZTtcblxuXHRcdC8qIG1pZ2h0IHVzZSBsYXRlci4uLlxuXHRcdC8vdHJhbnNsYXRlcyBhIGxvY2FsIHRpbWUgaW5zaWRlIGFuIGFuaW1hdGlvbiB0byB0aGUgY29ycmVzcG9uZGluZyB0aW1lIG9uIHRoZSByb290L2dsb2JhbCB0aW1lbGluZSwgZmFjdG9yaW5nIGluIGFsbCBuZXN0aW5nIGFuZCB0aW1lU2NhbGVzLlxuXHRcdGZ1bmN0aW9uIGxvY2FsVG9HbG9iYWwodGltZSwgYW5pbWF0aW9uKSB7XG5cdFx0XHR3aGlsZSAoYW5pbWF0aW9uKSB7XG5cdFx0XHRcdHRpbWUgPSAodGltZSAvIGFuaW1hdGlvbi5fdGltZVNjYWxlKSArIGFuaW1hdGlvbi5fc3RhcnRUaW1lO1xuXHRcdFx0XHRhbmltYXRpb24gPSBhbmltYXRpb24udGltZWxpbmU7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGltZTtcblx0XHR9XG5cblx0XHQvL3RyYW5zbGF0ZXMgdGhlIHN1cHBsaWVkIHRpbWUgb24gdGhlIHJvb3QvZ2xvYmFsIHRpbWVsaW5lIGludG8gdGhlIGNvcnJlc3BvbmRpbmcgbG9jYWwgdGltZSBpbnNpZGUgYSBwYXJ0aWN1bGFyIGFuaW1hdGlvbiwgZmFjdG9yaW5nIGluIGFsbCBuZXN0aW5nIGFuZCB0aW1lU2NhbGVzXG5cdFx0ZnVuY3Rpb24gZ2xvYmFsVG9Mb2NhbCh0aW1lLCBhbmltYXRpb24pIHtcblx0XHRcdHZhciBzY2FsZSA9IDE7XG5cdFx0XHR0aW1lIC09IGxvY2FsVG9HbG9iYWwoMCwgYW5pbWF0aW9uKTtcblx0XHRcdHdoaWxlIChhbmltYXRpb24pIHtcblx0XHRcdFx0c2NhbGUgKj0gYW5pbWF0aW9uLl90aW1lU2NhbGU7XG5cdFx0XHRcdGFuaW1hdGlvbiA9IGFuaW1hdGlvbi50aW1lbGluZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aW1lICogc2NhbGU7XG5cdFx0fVxuXHRcdCovXG5cblx0XHRwLnRvID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycywgcG9zaXRpb24pIHtcblx0XHRcdHZhciBFbmdpbmUgPSAodmFycy5yZXBlYXQgJiYgX2dsb2JhbHMuVHdlZW5NYXgpIHx8IFR3ZWVuTGl0ZTtcblx0XHRcdHJldHVybiBkdXJhdGlvbiA/IHRoaXMuYWRkKCBuZXcgRW5naW5lKHRhcmdldCwgZHVyYXRpb24sIHZhcnMpLCBwb3NpdGlvbikgOiB0aGlzLnNldCh0YXJnZXQsIHZhcnMsIHBvc2l0aW9uKTtcblx0XHR9O1xuXG5cdFx0cC5mcm9tID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgdmFycywgcG9zaXRpb24pIHtcblx0XHRcdHJldHVybiB0aGlzLmFkZCggKCh2YXJzLnJlcGVhdCAmJiBfZ2xvYmFscy5Ud2Vlbk1heCkgfHwgVHdlZW5MaXRlKS5mcm9tKHRhcmdldCwgZHVyYXRpb24sIHZhcnMpLCBwb3NpdGlvbik7XG5cdFx0fTtcblxuXHRcdHAuZnJvbVRvID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgZnJvbVZhcnMsIHRvVmFycywgcG9zaXRpb24pIHtcblx0XHRcdHZhciBFbmdpbmUgPSAodG9WYXJzLnJlcGVhdCAmJiBfZ2xvYmFscy5Ud2Vlbk1heCkgfHwgVHdlZW5MaXRlO1xuXHRcdFx0cmV0dXJuIGR1cmF0aW9uID8gdGhpcy5hZGQoIEVuZ2luZS5mcm9tVG8odGFyZ2V0LCBkdXJhdGlvbiwgZnJvbVZhcnMsIHRvVmFycyksIHBvc2l0aW9uKSA6IHRoaXMuc2V0KHRhcmdldCwgdG9WYXJzLCBwb3NpdGlvbik7XG5cdFx0fTtcblxuXHRcdHAuc3RhZ2dlclRvID0gZnVuY3Rpb24odGFyZ2V0cywgZHVyYXRpb24sIHZhcnMsIHN0YWdnZXIsIHBvc2l0aW9uLCBvbkNvbXBsZXRlQWxsLCBvbkNvbXBsZXRlQWxsUGFyYW1zLCBvbkNvbXBsZXRlQWxsU2NvcGUpIHtcblx0XHRcdHZhciB0bCA9IG5ldyBUaW1lbGluZUxpdGUoe29uQ29tcGxldGU6b25Db21wbGV0ZUFsbCwgb25Db21wbGV0ZVBhcmFtczpvbkNvbXBsZXRlQWxsUGFyYW1zLCBjYWxsYmFja1Njb3BlOm9uQ29tcGxldGVBbGxTY29wZSwgc21vb3RoQ2hpbGRUaW1pbmc6dGhpcy5zbW9vdGhDaGlsZFRpbWluZ30pLFxuXHRcdFx0XHRpO1xuXHRcdFx0aWYgKHR5cGVvZih0YXJnZXRzKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHR0YXJnZXRzID0gVHdlZW5MaXRlLnNlbGVjdG9yKHRhcmdldHMpIHx8IHRhcmdldHM7XG5cdFx0XHR9XG5cdFx0XHR0YXJnZXRzID0gdGFyZ2V0cyB8fCBbXTtcblx0XHRcdGlmIChfaXNTZWxlY3Rvcih0YXJnZXRzKSkgeyAvL3NlbnNlcyBpZiB0aGUgdGFyZ2V0cyBvYmplY3QgaXMgYSBzZWxlY3Rvci4gSWYgaXQgaXMsIHdlIHNob3VsZCB0cmFuc2xhdGUgaXQgaW50byBhbiBhcnJheS5cblx0XHRcdFx0dGFyZ2V0cyA9IF9zbGljZSh0YXJnZXRzKTtcblx0XHRcdH1cblx0XHRcdHN0YWdnZXIgPSBzdGFnZ2VyIHx8IDA7XG5cdFx0XHRpZiAoc3RhZ2dlciA8IDApIHtcblx0XHRcdFx0dGFyZ2V0cyA9IF9zbGljZSh0YXJnZXRzKTtcblx0XHRcdFx0dGFyZ2V0cy5yZXZlcnNlKCk7XG5cdFx0XHRcdHN0YWdnZXIgKj0gLTE7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgdGFyZ2V0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAodmFycy5zdGFydEF0KSB7XG5cdFx0XHRcdFx0dmFycy5zdGFydEF0ID0gX2NvcHkodmFycy5zdGFydEF0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0bC50byh0YXJnZXRzW2ldLCBkdXJhdGlvbiwgX2NvcHkodmFycyksIGkgKiBzdGFnZ2VyKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLmFkZCh0bCwgcG9zaXRpb24pO1xuXHRcdH07XG5cblx0XHRwLnN0YWdnZXJGcm9tID0gZnVuY3Rpb24odGFyZ2V0cywgZHVyYXRpb24sIHZhcnMsIHN0YWdnZXIsIHBvc2l0aW9uLCBvbkNvbXBsZXRlQWxsLCBvbkNvbXBsZXRlQWxsUGFyYW1zLCBvbkNvbXBsZXRlQWxsU2NvcGUpIHtcblx0XHRcdHZhcnMuaW1tZWRpYXRlUmVuZGVyID0gKHZhcnMuaW1tZWRpYXRlUmVuZGVyICE9IGZhbHNlKTtcblx0XHRcdHZhcnMucnVuQmFja3dhcmRzID0gdHJ1ZTtcblx0XHRcdHJldHVybiB0aGlzLnN0YWdnZXJUbyh0YXJnZXRzLCBkdXJhdGlvbiwgdmFycywgc3RhZ2dlciwgcG9zaXRpb24sIG9uQ29tcGxldGVBbGwsIG9uQ29tcGxldGVBbGxQYXJhbXMsIG9uQ29tcGxldGVBbGxTY29wZSk7XG5cdFx0fTtcblxuXHRcdHAuc3RhZ2dlckZyb21UbyA9IGZ1bmN0aW9uKHRhcmdldHMsIGR1cmF0aW9uLCBmcm9tVmFycywgdG9WYXJzLCBzdGFnZ2VyLCBwb3NpdGlvbiwgb25Db21wbGV0ZUFsbCwgb25Db21wbGV0ZUFsbFBhcmFtcywgb25Db21wbGV0ZUFsbFNjb3BlKSB7XG5cdFx0XHR0b1ZhcnMuc3RhcnRBdCA9IGZyb21WYXJzO1xuXHRcdFx0dG9WYXJzLmltbWVkaWF0ZVJlbmRlciA9ICh0b1ZhcnMuaW1tZWRpYXRlUmVuZGVyICE9IGZhbHNlICYmIGZyb21WYXJzLmltbWVkaWF0ZVJlbmRlciAhPSBmYWxzZSk7XG5cdFx0XHRyZXR1cm4gdGhpcy5zdGFnZ2VyVG8odGFyZ2V0cywgZHVyYXRpb24sIHRvVmFycywgc3RhZ2dlciwgcG9zaXRpb24sIG9uQ29tcGxldGVBbGwsIG9uQ29tcGxldGVBbGxQYXJhbXMsIG9uQ29tcGxldGVBbGxTY29wZSk7XG5cdFx0fTtcblxuXHRcdHAuY2FsbCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBwYXJhbXMsIHNjb3BlLCBwb3NpdGlvbikge1xuXHRcdFx0cmV0dXJuIHRoaXMuYWRkKCBUd2VlbkxpdGUuZGVsYXllZENhbGwoMCwgY2FsbGJhY2ssIHBhcmFtcywgc2NvcGUpLCBwb3NpdGlvbik7XG5cdFx0fTtcblxuXHRcdHAuc2V0ID0gZnVuY3Rpb24odGFyZ2V0LCB2YXJzLCBwb3NpdGlvbikge1xuXHRcdFx0cG9zaXRpb24gPSB0aGlzLl9wYXJzZVRpbWVPckxhYmVsKHBvc2l0aW9uLCAwLCB0cnVlKTtcblx0XHRcdGlmICh2YXJzLmltbWVkaWF0ZVJlbmRlciA9PSBudWxsKSB7XG5cdFx0XHRcdHZhcnMuaW1tZWRpYXRlUmVuZGVyID0gKHBvc2l0aW9uID09PSB0aGlzLl90aW1lICYmICF0aGlzLl9wYXVzZWQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuYWRkKCBuZXcgVHdlZW5MaXRlKHRhcmdldCwgMCwgdmFycyksIHBvc2l0aW9uKTtcblx0XHR9O1xuXG5cdFx0VGltZWxpbmVMaXRlLmV4cG9ydFJvb3QgPSBmdW5jdGlvbih2YXJzLCBpZ25vcmVEZWxheWVkQ2FsbHMpIHtcblx0XHRcdHZhcnMgPSB2YXJzIHx8IHt9O1xuXHRcdFx0aWYgKHZhcnMuc21vb3RoQ2hpbGRUaW1pbmcgPT0gbnVsbCkge1xuXHRcdFx0XHR2YXJzLnNtb290aENoaWxkVGltaW5nID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHZhciB0bCA9IG5ldyBUaW1lbGluZUxpdGUodmFycyksXG5cdFx0XHRcdHJvb3QgPSB0bC5fdGltZWxpbmUsXG5cdFx0XHRcdHR3ZWVuLCBuZXh0O1xuXHRcdFx0aWYgKGlnbm9yZURlbGF5ZWRDYWxscyA9PSBudWxsKSB7XG5cdFx0XHRcdGlnbm9yZURlbGF5ZWRDYWxscyA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRyb290Ll9yZW1vdmUodGwsIHRydWUpO1xuXHRcdFx0dGwuX3N0YXJ0VGltZSA9IDA7XG5cdFx0XHR0bC5fcmF3UHJldlRpbWUgPSB0bC5fdGltZSA9IHRsLl90b3RhbFRpbWUgPSByb290Ll90aW1lO1xuXHRcdFx0dHdlZW4gPSByb290Ll9maXJzdDtcblx0XHRcdHdoaWxlICh0d2Vlbikge1xuXHRcdFx0XHRuZXh0ID0gdHdlZW4uX25leHQ7XG5cdFx0XHRcdGlmICghaWdub3JlRGVsYXllZENhbGxzIHx8ICEodHdlZW4gaW5zdGFuY2VvZiBUd2VlbkxpdGUgJiYgdHdlZW4udGFyZ2V0ID09PSB0d2Vlbi52YXJzLm9uQ29tcGxldGUpKSB7XG5cdFx0XHRcdFx0dGwuYWRkKHR3ZWVuLCB0d2Vlbi5fc3RhcnRUaW1lIC0gdHdlZW4uX2RlbGF5KTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0d2VlbiA9IG5leHQ7XG5cdFx0XHR9XG5cdFx0XHRyb290LmFkZCh0bCwgMCk7XG5cdFx0XHRyZXR1cm4gdGw7XG5cdFx0fTtcblxuXHRcdHAuYWRkID0gZnVuY3Rpb24odmFsdWUsIHBvc2l0aW9uLCBhbGlnbiwgc3RhZ2dlcikge1xuXHRcdFx0dmFyIGN1clRpbWUsIGwsIGksIGNoaWxkLCB0bCwgYmVmb3JlUmF3VGltZTtcblx0XHRcdGlmICh0eXBlb2YocG9zaXRpb24pICE9PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdHBvc2l0aW9uID0gdGhpcy5fcGFyc2VUaW1lT3JMYWJlbChwb3NpdGlvbiwgMCwgdHJ1ZSwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCEodmFsdWUgaW5zdGFuY2VvZiBBbmltYXRpb24pKSB7XG5cdFx0XHRcdGlmICgodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkgfHwgKHZhbHVlICYmIHZhbHVlLnB1c2ggJiYgX2lzQXJyYXkodmFsdWUpKSkge1xuXHRcdFx0XHRcdGFsaWduID0gYWxpZ24gfHwgXCJub3JtYWxcIjtcblx0XHRcdFx0XHRzdGFnZ2VyID0gc3RhZ2dlciB8fCAwO1xuXHRcdFx0XHRcdGN1clRpbWUgPSBwb3NpdGlvbjtcblx0XHRcdFx0XHRsID0gdmFsdWUubGVuZ3RoO1xuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmIChfaXNBcnJheShjaGlsZCA9IHZhbHVlW2ldKSkge1xuXHRcdFx0XHRcdFx0XHRjaGlsZCA9IG5ldyBUaW1lbGluZUxpdGUoe3R3ZWVuczpjaGlsZH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGhpcy5hZGQoY2hpbGQsIGN1clRpbWUpO1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZihjaGlsZCkgIT09IFwic3RyaW5nXCIgJiYgdHlwZW9mKGNoaWxkKSAhPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChhbGlnbiA9PT0gXCJzZXF1ZW5jZVwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0Y3VyVGltZSA9IGNoaWxkLl9zdGFydFRpbWUgKyAoY2hpbGQudG90YWxEdXJhdGlvbigpIC8gY2hpbGQuX3RpbWVTY2FsZSk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYWxpZ24gPT09IFwic3RhcnRcIikge1xuXHRcdFx0XHRcdFx0XHRcdGNoaWxkLl9zdGFydFRpbWUgLT0gY2hpbGQuZGVsYXkoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Y3VyVGltZSArPSBzdGFnZ2VyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YodmFsdWUpID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkTGFiZWwodmFsdWUsIHBvc2l0aW9uKTtcblx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YodmFsdWUpID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHR2YWx1ZSA9IFR3ZWVuTGl0ZS5kZWxheWVkQ2FsbCgwLCB2YWx1ZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhyb3coXCJDYW5ub3QgYWRkIFwiICsgdmFsdWUgKyBcIiBpbnRvIHRoZSB0aW1lbGluZTsgaXQgaXMgbm90IGEgdHdlZW4sIHRpbWVsaW5lLCBmdW5jdGlvbiwgb3Igc3RyaW5nLlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRTaW1wbGVUaW1lbGluZS5wcm90b3R5cGUuYWRkLmNhbGwodGhpcywgdmFsdWUsIHBvc2l0aW9uKTtcblxuXHRcdFx0Ly9pZiB0aGUgdGltZWxpbmUgaGFzIGFscmVhZHkgZW5kZWQgYnV0IHRoZSBpbnNlcnRlZCB0d2Vlbi90aW1lbGluZSBleHRlbmRzIHRoZSBkdXJhdGlvbiwgd2Ugc2hvdWxkIGVuYWJsZSB0aGlzIHRpbWVsaW5lIGFnYWluIHNvIHRoYXQgaXQgcmVuZGVycyBwcm9wZXJseS4gV2Ugc2hvdWxkIGFsc28gYWxpZ24gdGhlIHBsYXloZWFkIHdpdGggdGhlIHBhcmVudCB0aW1lbGluZSdzIHdoZW4gYXBwcm9wcmlhdGUuXG5cdFx0XHRpZiAodGhpcy5fZ2MgfHwgdGhpcy5fdGltZSA9PT0gdGhpcy5fZHVyYXRpb24pIGlmICghdGhpcy5fcGF1c2VkKSBpZiAodGhpcy5fZHVyYXRpb24gPCB0aGlzLmR1cmF0aW9uKCkpIHtcblx0XHRcdFx0Ly9pbiBjYXNlIGFueSBvZiB0aGUgYW5jZXN0b3JzIGhhZCBjb21wbGV0ZWQgYnV0IHNob3VsZCBub3cgYmUgZW5hYmxlZC4uLlxuXHRcdFx0XHR0bCA9IHRoaXM7XG5cdFx0XHRcdGJlZm9yZVJhd1RpbWUgPSAodGwucmF3VGltZSgpID4gdmFsdWUuX3N0YXJ0VGltZSk7IC8vaWYgdGhlIHR3ZWVuIGlzIHBsYWNlZCBvbiB0aGUgdGltZWxpbmUgc28gdGhhdCBpdCBzdGFydHMgQkVGT1JFIHRoZSBjdXJyZW50IHJhd1RpbWUsIHdlIHNob3VsZCBhbGlnbiB0aGUgcGxheWhlYWQgKG1vdmUgdGhlIHRpbWVsaW5lKS4gVGhpcyBpcyBiZWNhdXNlIHNvbWV0aW1lcyB1c2VycyB3aWxsIGNyZWF0ZSBhIHRpbWVsaW5lLCBsZXQgaXQgZmluaXNoLCBhbmQgbXVjaCBsYXRlciBhcHBlbmQgYSB0d2VlbiBhbmQgZXhwZWN0IGl0IHRvIHJ1biBpbnN0ZWFkIG9mIGp1bXBpbmcgdG8gaXRzIGVuZCBzdGF0ZS4gV2hpbGUgdGVjaG5pY2FsbHkgb25lIGNvdWxkIGFyZ3VlIHRoYXQgaXQgc2hvdWxkIGp1bXAgdG8gaXRzIGVuZCBzdGF0ZSwgdGhhdCdzIG5vdCB3aGF0IHVzZXJzIGludHVpdGl2ZWx5IGV4cGVjdC5cblx0XHRcdFx0d2hpbGUgKHRsLl90aW1lbGluZSkge1xuXHRcdFx0XHRcdGlmIChiZWZvcmVSYXdUaW1lICYmIHRsLl90aW1lbGluZS5zbW9vdGhDaGlsZFRpbWluZykge1xuXHRcdFx0XHRcdFx0dGwudG90YWxUaW1lKHRsLl90b3RhbFRpbWUsIHRydWUpOyAvL21vdmVzIHRoZSB0aW1lbGluZSAoc2hpZnRzIGl0cyBzdGFydFRpbWUpIGlmIG5lY2Vzc2FyeSwgYW5kIGFsc28gZW5hYmxlcyBpdC5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKHRsLl9nYykge1xuXHRcdFx0XHRcdFx0dGwuX2VuYWJsZWQodHJ1ZSwgZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0bCA9IHRsLl90aW1lbGluZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC5yZW1vdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKHZhbHVlIGluc3RhbmNlb2YgQW5pbWF0aW9uKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9yZW1vdmUodmFsdWUsIGZhbHNlKTtcblx0XHRcdH0gZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSB8fCAodmFsdWUgJiYgdmFsdWUucHVzaCAmJiBfaXNBcnJheSh2YWx1ZSkpKSB7XG5cdFx0XHRcdHZhciBpID0gdmFsdWUubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHR0aGlzLnJlbW92ZSh2YWx1ZVtpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZih2YWx1ZSkgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVtb3ZlTGFiZWwodmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMua2lsbChudWxsLCB2YWx1ZSk7XG5cdFx0fTtcblxuXHRcdHAuX3JlbW92ZSA9IGZ1bmN0aW9uKHR3ZWVuLCBza2lwRGlzYWJsZSkge1xuXHRcdFx0U2ltcGxlVGltZWxpbmUucHJvdG90eXBlLl9yZW1vdmUuY2FsbCh0aGlzLCB0d2Vlbiwgc2tpcERpc2FibGUpO1xuXHRcdFx0dmFyIGxhc3QgPSB0aGlzLl9sYXN0O1xuXHRcdFx0aWYgKCFsYXN0KSB7XG5cdFx0XHRcdHRoaXMuX3RpbWUgPSB0aGlzLl90b3RhbFRpbWUgPSB0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX3RvdGFsRHVyYXRpb24gPSAwO1xuXHRcdFx0fSBlbHNlIGlmICh0aGlzLl90aW1lID4gbGFzdC5fc3RhcnRUaW1lICsgbGFzdC5fdG90YWxEdXJhdGlvbiAvIGxhc3QuX3RpbWVTY2FsZSkge1xuXHRcdFx0XHR0aGlzLl90aW1lID0gdGhpcy5kdXJhdGlvbigpO1xuXHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0aGlzLl90b3RhbER1cmF0aW9uO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuYXBwZW5kID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldE9yTGFiZWwpIHtcblx0XHRcdHJldHVybiB0aGlzLmFkZCh2YWx1ZSwgdGhpcy5fcGFyc2VUaW1lT3JMYWJlbChudWxsLCBvZmZzZXRPckxhYmVsLCB0cnVlLCB2YWx1ZSkpO1xuXHRcdH07XG5cblx0XHRwLmluc2VydCA9IHAuaW5zZXJ0TXVsdGlwbGUgPSBmdW5jdGlvbih2YWx1ZSwgcG9zaXRpb24sIGFsaWduLCBzdGFnZ2VyKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hZGQodmFsdWUsIHBvc2l0aW9uIHx8IDAsIGFsaWduLCBzdGFnZ2VyKTtcblx0XHR9O1xuXG5cdFx0cC5hcHBlbmRNdWx0aXBsZSA9IGZ1bmN0aW9uKHR3ZWVucywgb2Zmc2V0T3JMYWJlbCwgYWxpZ24sIHN0YWdnZXIpIHtcblx0XHRcdHJldHVybiB0aGlzLmFkZCh0d2VlbnMsIHRoaXMuX3BhcnNlVGltZU9yTGFiZWwobnVsbCwgb2Zmc2V0T3JMYWJlbCwgdHJ1ZSwgdHdlZW5zKSwgYWxpZ24sIHN0YWdnZXIpO1xuXHRcdH07XG5cblx0XHRwLmFkZExhYmVsID0gZnVuY3Rpb24obGFiZWwsIHBvc2l0aW9uKSB7XG5cdFx0XHR0aGlzLl9sYWJlbHNbbGFiZWxdID0gdGhpcy5fcGFyc2VUaW1lT3JMYWJlbChwb3NpdGlvbik7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC5hZGRQYXVzZSA9IGZ1bmN0aW9uKHBvc2l0aW9uLCBjYWxsYmFjaywgcGFyYW1zLCBzY29wZSkge1xuXHRcdFx0dmFyIHQgPSBUd2VlbkxpdGUuZGVsYXllZENhbGwoMCwgX3BhdXNlQ2FsbGJhY2ssIFtcIntzZWxmfVwiLCBjYWxsYmFjaywgcGFyYW1zLCBzY29wZV0sIHRoaXMpO1xuXHRcdFx0dC5kYXRhID0gXCJpc1BhdXNlXCI7IC8vIHdlIHVzZSB0aGlzIGZsYWcgaW4gVHdlZW5MaXRlJ3MgcmVuZGVyKCkgbWV0aG9kIHRvIGlkZW50aWZ5IGl0IGFzIGEgc3BlY2lhbCBjYXNlIHRoYXQgc2hvdWxkbid0IGJlIHRyaWdnZXJlZCB3aGVuIHRoZSB2aXJ0dWFsIHBsYXloZWFkIGlzIExFQVZJTkcgdGhlIGV4YWN0IHBvc2l0aW9uIHdoZXJlIHRoZSBwYXVzZSBpcywgb3RoZXJ3aXNlIHRpbWVsaW5lLmFkZFBhdXNlKDEpLnBsYXkoMSkgd291bGQgZW5kIHVwIHBhdXNlZCBvbiB0aGUgdmVyeSBuZXh0IHRpY2suXG5cdFx0XHRyZXR1cm4gdGhpcy5hZGQodCwgcG9zaXRpb24pO1xuXHRcdH07XG5cblx0XHRwLnJlbW92ZUxhYmVsID0gZnVuY3Rpb24obGFiZWwpIHtcblx0XHRcdGRlbGV0ZSB0aGlzLl9sYWJlbHNbbGFiZWxdO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuZ2V0TGFiZWxUaW1lID0gZnVuY3Rpb24obGFiZWwpIHtcblx0XHRcdHJldHVybiAodGhpcy5fbGFiZWxzW2xhYmVsXSAhPSBudWxsKSA/IHRoaXMuX2xhYmVsc1tsYWJlbF0gOiAtMTtcblx0XHR9O1xuXG5cdFx0cC5fcGFyc2VUaW1lT3JMYWJlbCA9IGZ1bmN0aW9uKHRpbWVPckxhYmVsLCBvZmZzZXRPckxhYmVsLCBhcHBlbmRJZkFic2VudCwgaWdub3JlKSB7XG5cdFx0XHR2YXIgaTtcblx0XHRcdC8vaWYgd2UncmUgYWJvdXQgdG8gYWRkIGEgdHdlZW4vdGltZWxpbmUgKG9yIGFuIGFycmF5IG9mIHRoZW0pIHRoYXQncyBhbHJlYWR5IGEgY2hpbGQgb2YgdGhpcyB0aW1lbGluZSwgd2Ugc2hvdWxkIHJlbW92ZSBpdCBmaXJzdCBzbyB0aGF0IGl0IGRvZXNuJ3QgY29udGFtaW5hdGUgdGhlIGR1cmF0aW9uKCkuXG5cdFx0XHRpZiAoaWdub3JlIGluc3RhbmNlb2YgQW5pbWF0aW9uICYmIGlnbm9yZS50aW1lbGluZSA9PT0gdGhpcykge1xuXHRcdFx0XHR0aGlzLnJlbW92ZShpZ25vcmUpO1xuXHRcdFx0fSBlbHNlIGlmIChpZ25vcmUgJiYgKChpZ25vcmUgaW5zdGFuY2VvZiBBcnJheSkgfHwgKGlnbm9yZS5wdXNoICYmIF9pc0FycmF5KGlnbm9yZSkpKSkge1xuXHRcdFx0XHRpID0gaWdub3JlLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0aWYgKGlnbm9yZVtpXSBpbnN0YW5jZW9mIEFuaW1hdGlvbiAmJiBpZ25vcmVbaV0udGltZWxpbmUgPT09IHRoaXMpIHtcblx0XHRcdFx0XHRcdHRoaXMucmVtb3ZlKGlnbm9yZVtpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAodHlwZW9mKG9mZnNldE9yTGFiZWwpID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9wYXJzZVRpbWVPckxhYmVsKG9mZnNldE9yTGFiZWwsIChhcHBlbmRJZkFic2VudCAmJiB0eXBlb2YodGltZU9yTGFiZWwpID09PSBcIm51bWJlclwiICYmIHRoaXMuX2xhYmVsc1tvZmZzZXRPckxhYmVsXSA9PSBudWxsKSA/IHRpbWVPckxhYmVsIC0gdGhpcy5kdXJhdGlvbigpIDogMCwgYXBwZW5kSWZBYnNlbnQpO1xuXHRcdFx0fVxuXHRcdFx0b2Zmc2V0T3JMYWJlbCA9IG9mZnNldE9yTGFiZWwgfHwgMDtcblx0XHRcdGlmICh0eXBlb2YodGltZU9yTGFiZWwpID09PSBcInN0cmluZ1wiICYmIChpc05hTih0aW1lT3JMYWJlbCkgfHwgdGhpcy5fbGFiZWxzW3RpbWVPckxhYmVsXSAhPSBudWxsKSkgeyAvL2lmIHRoZSBzdHJpbmcgaXMgYSBudW1iZXIgbGlrZSBcIjFcIiwgY2hlY2sgdG8gc2VlIGlmIHRoZXJlJ3MgYSBsYWJlbCB3aXRoIHRoYXQgbmFtZSwgb3RoZXJ3aXNlIGludGVycHJldCBpdCBhcyBhIG51bWJlciAoYWJzb2x1dGUgdmFsdWUpLlxuXHRcdFx0XHRpID0gdGltZU9yTGFiZWwuaW5kZXhPZihcIj1cIik7XG5cdFx0XHRcdGlmIChpID09PSAtMSkge1xuXHRcdFx0XHRcdGlmICh0aGlzLl9sYWJlbHNbdGltZU9yTGFiZWxdID09IG51bGwpIHtcblx0XHRcdFx0XHRcdHJldHVybiBhcHBlbmRJZkFic2VudCA/ICh0aGlzLl9sYWJlbHNbdGltZU9yTGFiZWxdID0gdGhpcy5kdXJhdGlvbigpICsgb2Zmc2V0T3JMYWJlbCkgOiBvZmZzZXRPckxhYmVsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fbGFiZWxzW3RpbWVPckxhYmVsXSArIG9mZnNldE9yTGFiZWw7XG5cdFx0XHRcdH1cblx0XHRcdFx0b2Zmc2V0T3JMYWJlbCA9IHBhcnNlSW50KHRpbWVPckxhYmVsLmNoYXJBdChpLTEpICsgXCIxXCIsIDEwKSAqIE51bWJlcih0aW1lT3JMYWJlbC5zdWJzdHIoaSsxKSk7XG5cdFx0XHRcdHRpbWVPckxhYmVsID0gKGkgPiAxKSA/IHRoaXMuX3BhcnNlVGltZU9yTGFiZWwodGltZU9yTGFiZWwuc3Vic3RyKDAsIGktMSksIDAsIGFwcGVuZElmQWJzZW50KSA6IHRoaXMuZHVyYXRpb24oKTtcblx0XHRcdH0gZWxzZSBpZiAodGltZU9yTGFiZWwgPT0gbnVsbCkge1xuXHRcdFx0XHR0aW1lT3JMYWJlbCA9IHRoaXMuZHVyYXRpb24oKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBOdW1iZXIodGltZU9yTGFiZWwpICsgb2Zmc2V0T3JMYWJlbDtcblx0XHR9O1xuXG5cdFx0cC5zZWVrID0gZnVuY3Rpb24ocG9zaXRpb24sIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy50b3RhbFRpbWUoKHR5cGVvZihwb3NpdGlvbikgPT09IFwibnVtYmVyXCIpID8gcG9zaXRpb24gOiB0aGlzLl9wYXJzZVRpbWVPckxhYmVsKHBvc2l0aW9uKSwgKHN1cHByZXNzRXZlbnRzICE9PSBmYWxzZSkpO1xuXHRcdH07XG5cblx0XHRwLnN0b3AgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLnBhdXNlZCh0cnVlKTtcblx0XHR9O1xuXG5cdFx0cC5nb3RvQW5kUGxheSA9IGZ1bmN0aW9uKHBvc2l0aW9uLCBzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0cmV0dXJuIHRoaXMucGxheShwb3NpdGlvbiwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cblx0XHRwLmdvdG9BbmRTdG9wID0gZnVuY3Rpb24ocG9zaXRpb24sIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXVzZShwb3NpdGlvbiwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cblx0XHRwLnJlbmRlciA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSkge1xuXHRcdFx0aWYgKHRoaXMuX2djKSB7XG5cdFx0XHRcdHRoaXMuX2VuYWJsZWQodHJ1ZSwgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHRvdGFsRHVyID0gKCF0aGlzLl9kaXJ0eSkgPyB0aGlzLl90b3RhbER1cmF0aW9uIDogdGhpcy50b3RhbER1cmF0aW9uKCksXG5cdFx0XHRcdHByZXZUaW1lID0gdGhpcy5fdGltZSxcblx0XHRcdFx0cHJldlN0YXJ0ID0gdGhpcy5fc3RhcnRUaW1lLFxuXHRcdFx0XHRwcmV2VGltZVNjYWxlID0gdGhpcy5fdGltZVNjYWxlLFxuXHRcdFx0XHRwcmV2UGF1c2VkID0gdGhpcy5fcGF1c2VkLFxuXHRcdFx0XHR0d2VlbiwgaXNDb21wbGV0ZSwgbmV4dCwgY2FsbGJhY2ssIGludGVybmFsRm9yY2U7XG5cdFx0XHRpZiAodGltZSA+PSB0b3RhbER1cikge1xuXHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0aGlzLl90aW1lID0gdG90YWxEdXI7XG5cdFx0XHRcdGlmICghdGhpcy5fcmV2ZXJzZWQpIGlmICghdGhpcy5faGFzUGF1c2VkQ2hpbGQoKSkge1xuXHRcdFx0XHRcdGlzQ29tcGxldGUgPSB0cnVlO1xuXHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvbkNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9ICEhdGhpcy5fdGltZWxpbmUuYXV0b1JlbW92ZUNoaWxkcmVuOyAvL290aGVyd2lzZSwgaWYgdGhlIGFuaW1hdGlvbiBpcyB1bnBhdXNlZC9hY3RpdmF0ZWQgYWZ0ZXIgaXQncyBhbHJlYWR5IGZpbmlzaGVkLCBpdCBkb2Vzbid0IGdldCByZW1vdmVkIGZyb20gdGhlIHBhcmVudCB0aW1lbGluZS5cblx0XHRcdFx0XHRpZiAodGhpcy5fZHVyYXRpb24gPT09IDApIGlmICh0aW1lID09PSAwIHx8IHRoaXMuX3Jhd1ByZXZUaW1lIDwgMCB8fCB0aGlzLl9yYXdQcmV2VGltZSA9PT0gX3RpbnlOdW0pIGlmICh0aGlzLl9yYXdQcmV2VGltZSAhPT0gdGltZSAmJiB0aGlzLl9maXJzdCkge1xuXHRcdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9IHRydWU7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5fcmF3UHJldlRpbWUgPiBfdGlueU51bSkge1xuXHRcdFx0XHRcdFx0XHRjYWxsYmFjayA9IFwib25SZXZlcnNlQ29tcGxldGVcIjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSAodGhpcy5fZHVyYXRpb24gfHwgIXN1cHByZXNzRXZlbnRzIHx8IHRpbWUgfHwgdGhpcy5fcmF3UHJldlRpbWUgPT09IHRpbWUpID8gdGltZSA6IF90aW55TnVtOyAvL3doZW4gdGhlIHBsYXloZWFkIGFycml2ZXMgYXQgRVhBQ1RMWSB0aW1lIDAgKHJpZ2h0IG9uIHRvcCkgb2YgYSB6ZXJvLWR1cmF0aW9uIHRpbWVsaW5lIG9yIHR3ZWVuLCB3ZSBuZWVkIHRvIGRpc2Nlcm4gaWYgZXZlbnRzIGFyZSBzdXBwcmVzc2VkIHNvIHRoYXQgd2hlbiB0aGUgcGxheWhlYWQgbW92ZXMgYWdhaW4gKG5leHQgdGltZSksIGl0J2xsIHRyaWdnZXIgdGhlIGNhbGxiYWNrLiBJZiBldmVudHMgYXJlIE5PVCBzdXBwcmVzc2VkLCBvYnZpb3VzbHkgdGhlIGNhbGxiYWNrIHdvdWxkIGJlIHRyaWdnZXJlZCBpbiB0aGlzIHJlbmRlci4gQmFzaWNhbGx5LCB0aGUgY2FsbGJhY2sgc2hvdWxkIGZpcmUgZWl0aGVyIHdoZW4gdGhlIHBsYXloZWFkIEFSUklWRVMgb3IgTEVBVkVTIHRoaXMgZXhhY3Qgc3BvdCwgbm90IGJvdGguIEltYWdpbmUgZG9pbmcgYSB0aW1lbGluZS5zZWVrKDApIGFuZCB0aGVyZSdzIGEgY2FsbGJhY2sgdGhhdCBzaXRzIGF0IDAuIFNpbmNlIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBvbiB0aGF0IHNlZWsoKSBieSBkZWZhdWx0LCBub3RoaW5nIHdpbGwgZmlyZSwgYnV0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIG9mZiBvZiB0aGF0IHBvc2l0aW9uLCB0aGUgY2FsbGJhY2sgc2hvdWxkIGZpcmUuIFRoaXMgYmVoYXZpb3IgaXMgd2hhdCBwZW9wbGUgaW50dWl0aXZlbHkgZXhwZWN0LiBXZSBzZXQgdGhlIF9yYXdQcmV2VGltZSB0byBiZSBhIHByZWNpc2UgdGlueSBudW1iZXIgdG8gaW5kaWNhdGUgdGhpcyBzY2VuYXJpbyByYXRoZXIgdGhhbiB1c2luZyBhbm90aGVyIHByb3BlcnR5L3ZhcmlhYmxlIHdoaWNoIHdvdWxkIGluY3JlYXNlIG1lbW9yeSB1c2FnZS4gVGhpcyB0ZWNobmlxdWUgaXMgbGVzcyByZWFkYWJsZSwgYnV0IG1vcmUgZWZmaWNpZW50LlxuXHRcdFx0XHR0aW1lID0gdG90YWxEdXIgKyAwLjAwMDE7IC8vdG8gYXZvaWQgb2NjYXNpb25hbCBmbG9hdGluZyBwb2ludCByb3VuZGluZyBlcnJvcnMgLSBzb21ldGltZXMgY2hpbGQgdHdlZW5zL3RpbWVsaW5lcyB3ZXJlIG5vdCBiZWluZyBmdWxseSBjb21wbGV0ZWQgKHRoZWlyIHByb2dyZXNzIG1pZ2h0IGJlIDAuOTk5OTk5OTk5OTk5OTk4IGluc3RlYWQgb2YgMSBiZWNhdXNlIHdoZW4gX3RpbWUgLSB0d2Vlbi5fc3RhcnRUaW1lIGlzIHBlcmZvcm1lZCwgZmxvYXRpbmcgcG9pbnQgZXJyb3JzIHdvdWxkIHJldHVybiBhIHZhbHVlIHRoYXQgd2FzIFNMSUdIVExZIG9mZikuIFRyeSAoOTk5OTk5OTk5OTk5LjcgLSA5OTk5OTk5OTk5OTkpICogMSA9IDAuNjk5OTUxMTcxODc1IGluc3RlYWQgb2YgMC43LlxuXG5cdFx0XHR9IGVsc2UgaWYgKHRpbWUgPCAwLjAwMDAwMDEpIHsgLy90byB3b3JrIGFyb3VuZCBvY2Nhc2lvbmFsIGZsb2F0aW5nIHBvaW50IG1hdGggYXJ0aWZhY3RzLCByb3VuZCBzdXBlciBzbWFsbCB2YWx1ZXMgdG8gMC5cblx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGhpcy5fdGltZSA9IDA7XG5cdFx0XHRcdGlmIChwcmV2VGltZSAhPT0gMCB8fCAodGhpcy5fZHVyYXRpb24gPT09IDAgJiYgdGhpcy5fcmF3UHJldlRpbWUgIT09IF90aW55TnVtICYmICh0aGlzLl9yYXdQcmV2VGltZSA+IDAgfHwgKHRpbWUgPCAwICYmIHRoaXMuX3Jhd1ByZXZUaW1lID49IDApKSkpIHtcblx0XHRcdFx0XHRjYWxsYmFjayA9IFwib25SZXZlcnNlQ29tcGxldGVcIjtcblx0XHRcdFx0XHRpc0NvbXBsZXRlID0gdGhpcy5fcmV2ZXJzZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRpbWUgPCAwKSB7XG5cdFx0XHRcdFx0dGhpcy5fYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lLmF1dG9SZW1vdmVDaGlsZHJlbiAmJiB0aGlzLl9yZXZlcnNlZCkgeyAvL2Vuc3VyZXMgcHJvcGVyIEdDIGlmIGEgdGltZWxpbmUgaXMgcmVzdW1lZCBhZnRlciBpdCdzIGZpbmlzaGVkIHJldmVyc2luZy5cblx0XHRcdFx0XHRcdGludGVybmFsRm9yY2UgPSBpc0NvbXBsZXRlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvblJldmVyc2VDb21wbGV0ZVwiO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fcmF3UHJldlRpbWUgPj0gMCAmJiB0aGlzLl9maXJzdCkgeyAvL3doZW4gZ29pbmcgYmFjayBiZXlvbmQgdGhlIHN0YXJ0LCBmb3JjZSBhIHJlbmRlciBzbyB0aGF0IHplcm8tZHVyYXRpb24gdHdlZW5zIHRoYXQgc2l0IGF0IHRoZSB2ZXJ5IGJlZ2lubmluZyByZW5kZXIgdGhlaXIgc3RhcnQgdmFsdWVzIHByb3Blcmx5LiBPdGhlcndpc2UsIGlmIHRoZSBwYXJlbnQgdGltZWxpbmUncyBwbGF5aGVhZCBsYW5kcyBleGFjdGx5IGF0IHRoaXMgdGltZWxpbmUncyBzdGFydFRpbWUsIGFuZCB0aGVuIG1vdmVzIGJhY2t3YXJkcywgdGhlIHplcm8tZHVyYXRpb24gdHdlZW5zIGF0IHRoZSBiZWdpbm5pbmcgd291bGQgc3RpbGwgYmUgYXQgdGhlaXIgZW5kIHN0YXRlLlxuXHRcdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gdGltZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9ICh0aGlzLl9kdXJhdGlvbiB8fCAhc3VwcHJlc3NFdmVudHMgfHwgdGltZSB8fCB0aGlzLl9yYXdQcmV2VGltZSA9PT0gdGltZSkgPyB0aW1lIDogX3RpbnlOdW07IC8vd2hlbiB0aGUgcGxheWhlYWQgYXJyaXZlcyBhdCBFWEFDVExZIHRpbWUgMCAocmlnaHQgb24gdG9wKSBvZiBhIHplcm8tZHVyYXRpb24gdGltZWxpbmUgb3IgdHdlZW4sIHdlIG5lZWQgdG8gZGlzY2VybiBpZiBldmVudHMgYXJlIHN1cHByZXNzZWQgc28gdGhhdCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBhZ2FpbiAobmV4dCB0aW1lKSwgaXQnbGwgdHJpZ2dlciB0aGUgY2FsbGJhY2suIElmIGV2ZW50cyBhcmUgTk9UIHN1cHByZXNzZWQsIG9idmlvdXNseSB0aGUgY2FsbGJhY2sgd291bGQgYmUgdHJpZ2dlcmVkIGluIHRoaXMgcmVuZGVyLiBCYXNpY2FsbHksIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZSBlaXRoZXIgd2hlbiB0aGUgcGxheWhlYWQgQVJSSVZFUyBvciBMRUFWRVMgdGhpcyBleGFjdCBzcG90LCBub3QgYm90aC4gSW1hZ2luZSBkb2luZyBhIHRpbWVsaW5lLnNlZWsoMCkgYW5kIHRoZXJlJ3MgYSBjYWxsYmFjayB0aGF0IHNpdHMgYXQgMC4gU2luY2UgZXZlbnRzIGFyZSBzdXBwcmVzc2VkIG9uIHRoYXQgc2VlaygpIGJ5IGRlZmF1bHQsIG5vdGhpbmcgd2lsbCBmaXJlLCBidXQgd2hlbiB0aGUgcGxheWhlYWQgbW92ZXMgb2ZmIG9mIHRoYXQgcG9zaXRpb24sIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZS4gVGhpcyBiZWhhdmlvciBpcyB3aGF0IHBlb3BsZSBpbnR1aXRpdmVseSBleHBlY3QuIFdlIHNldCB0aGUgX3Jhd1ByZXZUaW1lIHRvIGJlIGEgcHJlY2lzZSB0aW55IG51bWJlciB0byBpbmRpY2F0ZSB0aGlzIHNjZW5hcmlvIHJhdGhlciB0aGFuIHVzaW5nIGFub3RoZXIgcHJvcGVydHkvdmFyaWFibGUgd2hpY2ggd291bGQgaW5jcmVhc2UgbWVtb3J5IHVzYWdlLiBUaGlzIHRlY2huaXF1ZSBpcyBsZXNzIHJlYWRhYmxlLCBidXQgbW9yZSBlZmZpY2llbnQuXG5cdFx0XHRcdFx0aWYgKHRpbWUgPT09IDAgJiYgaXNDb21wbGV0ZSkgeyAvL2lmIHRoZXJlJ3MgYSB6ZXJvLWR1cmF0aW9uIHR3ZWVuIGF0IHRoZSB2ZXJ5IGJlZ2lubmluZyBvZiBhIHRpbWVsaW5lIGFuZCB0aGUgcGxheWhlYWQgbGFuZHMgRVhBQ1RMWSBhdCB0aW1lIDAsIHRoYXQgdHdlZW4gd2lsbCBjb3JyZWN0bHkgcmVuZGVyIGl0cyBlbmQgdmFsdWVzLCBidXQgd2UgbmVlZCB0byBrZWVwIHRoZSB0aW1lbGluZSBhbGl2ZSBmb3Igb25lIG1vcmUgcmVuZGVyIHNvIHRoYXQgdGhlIGJlZ2lubmluZyB2YWx1ZXMgcmVuZGVyIHByb3Blcmx5IGFzIHRoZSBwYXJlbnQncyBwbGF5aGVhZCBrZWVwcyBtb3ZpbmcgYmV5b25kIHRoZSBiZWdpbmluZy4gSW1hZ2luZSBvYmoueCBzdGFydHMgYXQgMCBhbmQgdGhlbiB3ZSBkbyB0bC5zZXQob2JqLCB7eDoxMDB9KS50byhvYmosIDEsIHt4OjIwMH0pIGFuZCB0aGVuIGxhdGVyIHdlIHRsLnJldmVyc2UoKS4uLnRoZSBnb2FsIGlzIHRvIGhhdmUgb2JqLnggcmV2ZXJ0IHRvIDAuIElmIHRoZSBwbGF5aGVhZCBoYXBwZW5zIHRvIGxhbmQgb24gZXhhY3RseSAwLCB3aXRob3V0IHRoaXMgY2h1bmsgb2YgY29kZSwgaXQnZCBjb21wbGV0ZSB0aGUgdGltZWxpbmUgYW5kIHJlbW92ZSBpdCBmcm9tIHRoZSByZW5kZXJpbmcgcXVldWUgKG5vdCBnb29kKS5cblx0XHRcdFx0XHRcdHR3ZWVuID0gdGhpcy5fZmlyc3Q7XG5cdFx0XHRcdFx0XHR3aGlsZSAodHdlZW4gJiYgdHdlZW4uX3N0YXJ0VGltZSA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIXR3ZWVuLl9kdXJhdGlvbikge1xuXHRcdFx0XHRcdFx0XHRcdGlzQ29tcGxldGUgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR0d2VlbiA9IHR3ZWVuLl9uZXh0O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aW1lID0gMDsgLy90byBhdm9pZCBvY2Nhc2lvbmFsIGZsb2F0aW5nIHBvaW50IHJvdW5kaW5nIGVycm9ycyAoY291bGQgY2F1c2UgcHJvYmxlbXMgZXNwZWNpYWxseSB3aXRoIHplcm8tZHVyYXRpb24gdHdlZW5zIGF0IHRoZSB2ZXJ5IGJlZ2lubmluZyBvZiB0aGUgdGltZWxpbmUpXG5cdFx0XHRcdFx0aWYgKCF0aGlzLl9pbml0dGVkKSB7XG5cdFx0XHRcdFx0XHRpbnRlcm5hbEZvcmNlID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGhpcy5fdGltZSA9IHRoaXMuX3Jhd1ByZXZUaW1lID0gdGltZTtcblx0XHRcdH1cblx0XHRcdGlmICgodGhpcy5fdGltZSA9PT0gcHJldlRpbWUgfHwgIXRoaXMuX2ZpcnN0KSAmJiAhZm9yY2UgJiYgIWludGVybmFsRm9yY2UpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fSBlbHNlIGlmICghdGhpcy5faW5pdHRlZCkge1xuXHRcdFx0XHR0aGlzLl9pbml0dGVkID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCF0aGlzLl9hY3RpdmUpIGlmICghdGhpcy5fcGF1c2VkICYmIHRoaXMuX3RpbWUgIT09IHByZXZUaW1lICYmIHRpbWUgPiAwKSB7XG5cdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IHRydWU7ICAvL3NvIHRoYXQgaWYgdGhlIHVzZXIgcmVuZGVycyB0aGUgdGltZWxpbmUgKGFzIG9wcG9zZWQgdG8gdGhlIHBhcmVudCB0aW1lbGluZSByZW5kZXJpbmcgaXQpLCBpdCBpcyBmb3JjZWQgdG8gcmUtcmVuZGVyIGFuZCBhbGlnbiBpdCB3aXRoIHRoZSBwcm9wZXIgdGltZS9mcmFtZSBvbiB0aGUgbmV4dCByZW5kZXJpbmcgY3ljbGUuIE1heWJlIHRoZSB0aW1lbGluZSBhbHJlYWR5IGZpbmlzaGVkIGJ1dCB0aGUgdXNlciBtYW51YWxseSByZS1yZW5kZXJzIGl0IGFzIGhhbGZ3YXkgZG9uZSwgZm9yIGV4YW1wbGUuXG5cdFx0XHR9XG5cblx0XHRcdGlmIChwcmV2VGltZSA9PT0gMCkgaWYgKHRoaXMudmFycy5vblN0YXJ0KSBpZiAodGhpcy5fdGltZSAhPT0gMCkgaWYgKCFzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0XHR0aGlzLl9jYWxsYmFjayhcIm9uU3RhcnRcIik7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLl90aW1lID49IHByZXZUaW1lKSB7XG5cdFx0XHRcdHR3ZWVuID0gdGhpcy5fZmlyc3Q7XG5cdFx0XHRcdHdoaWxlICh0d2Vlbikge1xuXHRcdFx0XHRcdG5leHQgPSB0d2Vlbi5fbmV4dDsgLy9yZWNvcmQgaXQgaGVyZSBiZWNhdXNlIHRoZSB2YWx1ZSBjb3VsZCBjaGFuZ2UgYWZ0ZXIgcmVuZGVyaW5nLi4uXG5cdFx0XHRcdFx0aWYgKHRoaXMuX3BhdXNlZCAmJiAhcHJldlBhdXNlZCkgeyAvL2luIGNhc2UgYSB0d2VlbiBwYXVzZXMgdGhlIHRpbWVsaW5lIHdoZW4gcmVuZGVyaW5nXG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR3ZWVuLl9hY3RpdmUgfHwgKHR3ZWVuLl9zdGFydFRpbWUgPD0gdGhpcy5fdGltZSAmJiAhdHdlZW4uX3BhdXNlZCAmJiAhdHdlZW4uX2djKSkge1xuXHRcdFx0XHRcdFx0aWYgKCF0d2Vlbi5fcmV2ZXJzZWQpIHtcblx0XHRcdFx0XHRcdFx0dHdlZW4ucmVuZGVyKCh0aW1lIC0gdHdlZW4uX3N0YXJ0VGltZSkgKiB0d2Vlbi5fdGltZVNjYWxlLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dHdlZW4ucmVuZGVyKCgoIXR3ZWVuLl9kaXJ0eSkgPyB0d2Vlbi5fdG90YWxEdXJhdGlvbiA6IHR3ZWVuLnRvdGFsRHVyYXRpb24oKSkgLSAoKHRpbWUgLSB0d2Vlbi5fc3RhcnRUaW1lKSAqIHR3ZWVuLl90aW1lU2NhbGUpLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0d2VlbiA9IG5leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHR3ZWVuID0gdGhpcy5fbGFzdDtcblx0XHRcdFx0d2hpbGUgKHR3ZWVuKSB7XG5cdFx0XHRcdFx0bmV4dCA9IHR3ZWVuLl9wcmV2OyAvL3JlY29yZCBpdCBoZXJlIGJlY2F1c2UgdGhlIHZhbHVlIGNvdWxkIGNoYW5nZSBhZnRlciByZW5kZXJpbmcuLi5cblx0XHRcdFx0XHRpZiAodGhpcy5fcGF1c2VkICYmICFwcmV2UGF1c2VkKSB7IC8vaW4gY2FzZSBhIHR3ZWVuIHBhdXNlcyB0aGUgdGltZWxpbmUgd2hlbiByZW5kZXJpbmdcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHdlZW4uX2FjdGl2ZSB8fCAodHdlZW4uX3N0YXJ0VGltZSA8PSBwcmV2VGltZSAmJiAhdHdlZW4uX3BhdXNlZCAmJiAhdHdlZW4uX2djKSkge1xuXHRcdFx0XHRcdFx0aWYgKCF0d2Vlbi5fcmV2ZXJzZWQpIHtcblx0XHRcdFx0XHRcdFx0dHdlZW4ucmVuZGVyKCh0aW1lIC0gdHdlZW4uX3N0YXJ0VGltZSkgKiB0d2Vlbi5fdGltZVNjYWxlLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dHdlZW4ucmVuZGVyKCgoIXR3ZWVuLl9kaXJ0eSkgPyB0d2Vlbi5fdG90YWxEdXJhdGlvbiA6IHR3ZWVuLnRvdGFsRHVyYXRpb24oKSkgLSAoKHRpbWUgLSB0d2Vlbi5fc3RhcnRUaW1lKSAqIHR3ZWVuLl90aW1lU2NhbGUpLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0d2VlbiA9IG5leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuX29uVXBkYXRlKSBpZiAoIXN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRcdGlmIChfbGF6eVR3ZWVucy5sZW5ndGgpIHsgLy9pbiBjYXNlIHJlbmRlcmluZyBjYXVzZWQgYW55IHR3ZWVucyB0byBsYXp5LWluaXQsIHdlIHNob3VsZCByZW5kZXIgdGhlbSBiZWNhdXNlIHR5cGljYWxseSB3aGVuIGEgdGltZWxpbmUgZmluaXNoZXMsIHVzZXJzIGV4cGVjdCB0aGluZ3MgdG8gaGF2ZSByZW5kZXJlZCBmdWxseS4gSW1hZ2luZSBhbiBvblVwZGF0ZSBvbiBhIHRpbWVsaW5lIHRoYXQgcmVwb3J0cy9jaGVja3MgdHdlZW5lZCB2YWx1ZXMuXG5cdFx0XHRcdFx0X2xhenlSZW5kZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9jYWxsYmFjayhcIm9uVXBkYXRlXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoY2FsbGJhY2spIGlmICghdGhpcy5fZ2MpIGlmIChwcmV2U3RhcnQgPT09IHRoaXMuX3N0YXJ0VGltZSB8fCBwcmV2VGltZVNjYWxlICE9PSB0aGlzLl90aW1lU2NhbGUpIGlmICh0aGlzLl90aW1lID09PSAwIHx8IHRvdGFsRHVyID49IHRoaXMudG90YWxEdXJhdGlvbigpKSB7IC8vaWYgb25lIG9mIHRoZSB0d2VlbnMgdGhhdCB3YXMgcmVuZGVyZWQgYWx0ZXJlZCB0aGlzIHRpbWVsaW5lJ3Mgc3RhcnRUaW1lIChsaWtlIGlmIGFuIG9uQ29tcGxldGUgcmV2ZXJzZWQgdGhlIHRpbWVsaW5lKSwgaXQgcHJvYmFibHkgaXNuJ3QgY29tcGxldGUuIElmIGl0IGlzLCBkb24ndCB3b3JyeSwgYmVjYXVzZSB3aGF0ZXZlciBjYWxsIGFsdGVyZWQgdGhlIHN0YXJ0VGltZSB3b3VsZCBjb21wbGV0ZSBpZiBpdCB3YXMgbmVjZXNzYXJ5IGF0IHRoZSBuZXcgdGltZS4gVGhlIG9ubHkgZXhjZXB0aW9uIGlzIHRoZSB0aW1lU2NhbGUgcHJvcGVydHkuIEFsc28gY2hlY2sgX2djIGJlY2F1c2UgdGhlcmUncyBhIGNoYW5jZSB0aGF0IGtpbGwoKSBjb3VsZCBiZSBjYWxsZWQgaW4gYW4gb25VcGRhdGVcblx0XHRcdFx0aWYgKGlzQ29tcGxldGUpIHtcblx0XHRcdFx0XHRpZiAoX2xhenlUd2VlbnMubGVuZ3RoKSB7IC8vaW4gY2FzZSByZW5kZXJpbmcgY2F1c2VkIGFueSB0d2VlbnMgdG8gbGF6eS1pbml0LCB3ZSBzaG91bGQgcmVuZGVyIHRoZW0gYmVjYXVzZSB0eXBpY2FsbHkgd2hlbiBhIHRpbWVsaW5lIGZpbmlzaGVzLCB1c2VycyBleHBlY3QgdGhpbmdzIHRvIGhhdmUgcmVuZGVyZWQgZnVsbHkuIEltYWdpbmUgYW4gb25Db21wbGV0ZSBvbiBhIHRpbWVsaW5lIHRoYXQgcmVwb3J0cy9jaGVja3MgdHdlZW5lZCB2YWx1ZXMuXG5cdFx0XHRcdFx0XHRfbGF6eVJlbmRlcigpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodGhpcy5fdGltZWxpbmUuYXV0b1JlbW92ZUNoaWxkcmVuKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9lbmFibGVkKGZhbHNlLCBmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghc3VwcHJlc3NFdmVudHMgJiYgdGhpcy52YXJzW2NhbGxiYWNrXSkge1xuXHRcdFx0XHRcdHRoaXMuX2NhbGxiYWNrKGNhbGxiYWNrKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRwLl9oYXNQYXVzZWRDaGlsZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHR3ZWVuID0gdGhpcy5fZmlyc3Q7XG5cdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0aWYgKHR3ZWVuLl9wYXVzZWQgfHwgKCh0d2VlbiBpbnN0YW5jZW9mIFRpbWVsaW5lTGl0ZSkgJiYgdHdlZW4uX2hhc1BhdXNlZENoaWxkKCkpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0dHdlZW4gPSB0d2Vlbi5fbmV4dDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cdFx0cC5nZXRDaGlsZHJlbiA9IGZ1bmN0aW9uKG5lc3RlZCwgdHdlZW5zLCB0aW1lbGluZXMsIGlnbm9yZUJlZm9yZVRpbWUpIHtcblx0XHRcdGlnbm9yZUJlZm9yZVRpbWUgPSBpZ25vcmVCZWZvcmVUaW1lIHx8IC05OTk5OTk5OTk5O1xuXHRcdFx0dmFyIGEgPSBbXSxcblx0XHRcdFx0dHdlZW4gPSB0aGlzLl9maXJzdCxcblx0XHRcdFx0Y250ID0gMDtcblx0XHRcdHdoaWxlICh0d2Vlbikge1xuXHRcdFx0XHRpZiAodHdlZW4uX3N0YXJ0VGltZSA8IGlnbm9yZUJlZm9yZVRpbWUpIHtcblx0XHRcdFx0XHQvL2RvIG5vdGhpbmdcblx0XHRcdFx0fSBlbHNlIGlmICh0d2VlbiBpbnN0YW5jZW9mIFR3ZWVuTGl0ZSkge1xuXHRcdFx0XHRcdGlmICh0d2VlbnMgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHRhW2NudCsrXSA9IHR3ZWVuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAodGltZWxpbmVzICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0YVtjbnQrK10gPSB0d2Vlbjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKG5lc3RlZCAhPT0gZmFsc2UpIHtcblx0XHRcdFx0XHRcdGEgPSBhLmNvbmNhdCh0d2Vlbi5nZXRDaGlsZHJlbih0cnVlLCB0d2VlbnMsIHRpbWVsaW5lcykpO1xuXHRcdFx0XHRcdFx0Y250ID0gYS5sZW5ndGg7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHR3ZWVuID0gdHdlZW4uX25leHQ7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gYTtcblx0XHR9O1xuXG5cdFx0cC5nZXRUd2VlbnNPZiA9IGZ1bmN0aW9uKHRhcmdldCwgbmVzdGVkKSB7XG5cdFx0XHR2YXIgZGlzYWJsZWQgPSB0aGlzLl9nYyxcblx0XHRcdFx0YSA9IFtdLFxuXHRcdFx0XHRjbnQgPSAwLFxuXHRcdFx0XHR0d2VlbnMsIGk7XG5cdFx0XHRpZiAoZGlzYWJsZWQpIHtcblx0XHRcdFx0dGhpcy5fZW5hYmxlZCh0cnVlLCB0cnVlKTsgLy9nZXRUd2VlbnNPZigpIGZpbHRlcnMgb3V0IGRpc2FibGVkIHR3ZWVucywgYW5kIHdlIGhhdmUgdG8gbWFyayB0aGVtIGFzIF9nYyA9IHRydWUgd2hlbiB0aGUgdGltZWxpbmUgY29tcGxldGVzIGluIG9yZGVyIHRvIGFsbG93IGNsZWFuIGdhcmJhZ2UgY29sbGVjdGlvbiwgc28gdGVtcG9yYXJpbHkgcmUtZW5hYmxlIHRoZSB0aW1lbGluZSBoZXJlLlxuXHRcdFx0fVxuXHRcdFx0dHdlZW5zID0gVHdlZW5MaXRlLmdldFR3ZWVuc09mKHRhcmdldCk7XG5cdFx0XHRpID0gdHdlZW5zLmxlbmd0aDtcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRpZiAodHdlZW5zW2ldLnRpbWVsaW5lID09PSB0aGlzIHx8IChuZXN0ZWQgJiYgdGhpcy5fY29udGFpbnModHdlZW5zW2ldKSkpIHtcblx0XHRcdFx0XHRhW2NudCsrXSA9IHR3ZWVuc1tpXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGRpc2FibGVkKSB7XG5cdFx0XHRcdHRoaXMuX2VuYWJsZWQoZmFsc2UsIHRydWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGE7XG5cdFx0fTtcblxuXHRcdHAucmVjZW50ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fcmVjZW50O1xuXHRcdH07XG5cblx0XHRwLl9jb250YWlucyA9IGZ1bmN0aW9uKHR3ZWVuKSB7XG5cdFx0XHR2YXIgdGwgPSB0d2Vlbi50aW1lbGluZTtcblx0XHRcdHdoaWxlICh0bCkge1xuXHRcdFx0XHRpZiAodGwgPT09IHRoaXMpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0bCA9IHRsLnRpbWVsaW5lO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG5cblx0XHRwLnNoaWZ0Q2hpbGRyZW4gPSBmdW5jdGlvbihhbW91bnQsIGFkanVzdExhYmVscywgaWdub3JlQmVmb3JlVGltZSkge1xuXHRcdFx0aWdub3JlQmVmb3JlVGltZSA9IGlnbm9yZUJlZm9yZVRpbWUgfHwgMDtcblx0XHRcdHZhciB0d2VlbiA9IHRoaXMuX2ZpcnN0LFxuXHRcdFx0XHRsYWJlbHMgPSB0aGlzLl9sYWJlbHMsXG5cdFx0XHRcdHA7XG5cdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0aWYgKHR3ZWVuLl9zdGFydFRpbWUgPj0gaWdub3JlQmVmb3JlVGltZSkge1xuXHRcdFx0XHRcdHR3ZWVuLl9zdGFydFRpbWUgKz0gYW1vdW50O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHR3ZWVuID0gdHdlZW4uX25leHQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYWRqdXN0TGFiZWxzKSB7XG5cdFx0XHRcdGZvciAocCBpbiBsYWJlbHMpIHtcblx0XHRcdFx0XHRpZiAobGFiZWxzW3BdID49IGlnbm9yZUJlZm9yZVRpbWUpIHtcblx0XHRcdFx0XHRcdGxhYmVsc1twXSArPSBhbW91bnQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHR9O1xuXG5cdFx0cC5fa2lsbCA9IGZ1bmN0aW9uKHZhcnMsIHRhcmdldCkge1xuXHRcdFx0aWYgKCF2YXJzICYmICF0YXJnZXQpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdH1cblx0XHRcdHZhciB0d2VlbnMgPSAoIXRhcmdldCkgPyB0aGlzLmdldENoaWxkcmVuKHRydWUsIHRydWUsIGZhbHNlKSA6IHRoaXMuZ2V0VHdlZW5zT2YodGFyZ2V0KSxcblx0XHRcdFx0aSA9IHR3ZWVucy5sZW5ndGgsXG5cdFx0XHRcdGNoYW5nZWQgPSBmYWxzZTtcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRpZiAodHdlZW5zW2ldLl9raWxsKHZhcnMsIHRhcmdldCkpIHtcblx0XHRcdFx0XHRjaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGNoYW5nZWQ7XG5cdFx0fTtcblxuXHRcdHAuY2xlYXIgPSBmdW5jdGlvbihsYWJlbHMpIHtcblx0XHRcdHZhciB0d2VlbnMgPSB0aGlzLmdldENoaWxkcmVuKGZhbHNlLCB0cnVlLCB0cnVlKSxcblx0XHRcdFx0aSA9IHR3ZWVucy5sZW5ndGg7XG5cdFx0XHR0aGlzLl90aW1lID0gdGhpcy5fdG90YWxUaW1lID0gMDtcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHR0d2VlbnNbaV0uX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdH1cblx0XHRcdGlmIChsYWJlbHMgIT09IGZhbHNlKSB7XG5cdFx0XHRcdHRoaXMuX2xhYmVscyA9IHt9O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX3VuY2FjaGUodHJ1ZSk7XG5cdFx0fTtcblxuXHRcdHAuaW52YWxpZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHR3ZWVuID0gdGhpcy5fZmlyc3Q7XG5cdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0dHdlZW4uaW52YWxpZGF0ZSgpO1xuXHRcdFx0XHR0d2VlbiA9IHR3ZWVuLl9uZXh0O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIEFuaW1hdGlvbi5wcm90b3R5cGUuaW52YWxpZGF0ZS5jYWxsKHRoaXMpOztcblx0XHR9O1xuXG5cdFx0cC5fZW5hYmxlZCA9IGZ1bmN0aW9uKGVuYWJsZWQsIGlnbm9yZVRpbWVsaW5lKSB7XG5cdFx0XHRpZiAoZW5hYmxlZCA9PT0gdGhpcy5fZ2MpIHtcblx0XHRcdFx0dmFyIHR3ZWVuID0gdGhpcy5fZmlyc3Q7XG5cdFx0XHRcdHdoaWxlICh0d2Vlbikge1xuXHRcdFx0XHRcdHR3ZWVuLl9lbmFibGVkKGVuYWJsZWQsIHRydWUpO1xuXHRcdFx0XHRcdHR3ZWVuID0gdHdlZW4uX25leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBTaW1wbGVUaW1lbGluZS5wcm90b3R5cGUuX2VuYWJsZWQuY2FsbCh0aGlzLCBlbmFibGVkLCBpZ25vcmVUaW1lbGluZSk7XG5cdFx0fTtcblxuXHRcdHAudG90YWxUaW1lID0gZnVuY3Rpb24odGltZSwgc3VwcHJlc3NFdmVudHMsIHVuY2FwcGVkKSB7XG5cdFx0XHR0aGlzLl9mb3JjaW5nUGxheWhlYWQgPSB0cnVlO1xuXHRcdFx0dmFyIHZhbCA9IEFuaW1hdGlvbi5wcm90b3R5cGUudG90YWxUaW1lLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHR0aGlzLl9mb3JjaW5nUGxheWhlYWQgPSBmYWxzZTtcblx0XHRcdHJldHVybiB2YWw7XG5cdFx0fTtcblxuXHRcdHAuZHVyYXRpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdGlmICh0aGlzLl9kaXJ0eSkge1xuXHRcdFx0XHRcdHRoaXMudG90YWxEdXJhdGlvbigpOyAvL2p1c3QgdHJpZ2dlcnMgcmVjYWxjdWxhdGlvblxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB0aGlzLl9kdXJhdGlvbjtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLmR1cmF0aW9uKCkgIT09IDAgJiYgdmFsdWUgIT09IDApIHtcblx0XHRcdFx0dGhpcy50aW1lU2NhbGUodGhpcy5fZHVyYXRpb24gLyB2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC50b3RhbER1cmF0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRpZiAodGhpcy5fZGlydHkpIHtcblx0XHRcdFx0XHR2YXIgbWF4ID0gMCxcblx0XHRcdFx0XHRcdHR3ZWVuID0gdGhpcy5fbGFzdCxcblx0XHRcdFx0XHRcdHByZXZTdGFydCA9IDk5OTk5OTk5OTk5OSxcblx0XHRcdFx0XHRcdHByZXYsIGVuZDtcblx0XHRcdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0XHRcdHByZXYgPSB0d2Vlbi5fcHJldjsgLy9yZWNvcmQgaXQgaGVyZSBpbiBjYXNlIHRoZSB0d2VlbiBjaGFuZ2VzIHBvc2l0aW9uIGluIHRoZSBzZXF1ZW5jZS4uLlxuXHRcdFx0XHRcdFx0aWYgKHR3ZWVuLl9kaXJ0eSkge1xuXHRcdFx0XHRcdFx0XHR0d2Vlbi50b3RhbER1cmF0aW9uKCk7IC8vY291bGQgY2hhbmdlIHRoZSB0d2Vlbi5fc3RhcnRUaW1lLCBzbyBtYWtlIHN1cmUgdGhlIHR3ZWVuJ3MgY2FjaGUgaXMgY2xlYW4gYmVmb3JlIGFuYWx5emluZyBpdC5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICh0d2Vlbi5fc3RhcnRUaW1lID4gcHJldlN0YXJ0ICYmIHRoaXMuX3NvcnRDaGlsZHJlbiAmJiAhdHdlZW4uX3BhdXNlZCkgeyAvL2luIGNhc2Ugb25lIG9mIHRoZSB0d2VlbnMgc2hpZnRlZCBvdXQgb2Ygb3JkZXIsIGl0IG5lZWRzIHRvIGJlIHJlLWluc2VydGVkIGludG8gdGhlIGNvcnJlY3QgcG9zaXRpb24gaW4gdGhlIHNlcXVlbmNlXG5cdFx0XHRcdFx0XHRcdHRoaXMuYWRkKHR3ZWVuLCB0d2Vlbi5fc3RhcnRUaW1lIC0gdHdlZW4uX2RlbGF5KTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHByZXZTdGFydCA9IHR3ZWVuLl9zdGFydFRpbWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAodHdlZW4uX3N0YXJ0VGltZSA8IDAgJiYgIXR3ZWVuLl9wYXVzZWQpIHsgLy9jaGlsZHJlbiBhcmVuJ3QgYWxsb3dlZCB0byBoYXZlIG5lZ2F0aXZlIHN0YXJ0VGltZXMgdW5sZXNzIHNtb290aENoaWxkVGltaW5nIGlzIHRydWUsIHNvIGFkanVzdCBoZXJlIGlmIG9uZSBpcyBmb3VuZC5cblx0XHRcdFx0XHRcdFx0bWF4IC09IHR3ZWVuLl9zdGFydFRpbWU7XG5cdFx0XHRcdFx0XHRcdGlmICh0aGlzLl90aW1lbGluZS5zbW9vdGhDaGlsZFRpbWluZykge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3N0YXJ0VGltZSArPSB0d2Vlbi5fc3RhcnRUaW1lIC8gdGhpcy5fdGltZVNjYWxlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHRoaXMuc2hpZnRDaGlsZHJlbigtdHdlZW4uX3N0YXJ0VGltZSwgZmFsc2UsIC05OTk5OTk5OTk5KTtcblx0XHRcdFx0XHRcdFx0cHJldlN0YXJ0ID0gMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVuZCA9IHR3ZWVuLl9zdGFydFRpbWUgKyAodHdlZW4uX3RvdGFsRHVyYXRpb24gLyB0d2Vlbi5fdGltZVNjYWxlKTtcblx0XHRcdFx0XHRcdGlmIChlbmQgPiBtYXgpIHtcblx0XHRcdFx0XHRcdFx0bWF4ID0gZW5kO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dHdlZW4gPSBwcmV2O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX3RvdGFsRHVyYXRpb24gPSBtYXg7XG5cdFx0XHRcdFx0dGhpcy5fZGlydHkgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fdG90YWxEdXJhdGlvbjtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLnRvdGFsRHVyYXRpb24oKSAhPT0gMCkgaWYgKHZhbHVlICE9PSAwKSB7XG5cdFx0XHRcdHRoaXMudGltZVNjYWxlKHRoaXMuX3RvdGFsRHVyYXRpb24gLyB2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC5wYXVzZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKCF2YWx1ZSkgeyAvL2lmIHRoZXJlJ3MgYSBwYXVzZSBkaXJlY3RseSBhdCB0aGUgc3BvdCBmcm9tIHdoZXJlIHdlJ3JlIHVucGF1c2luZywgc2tpcCBpdC5cblx0XHRcdFx0dmFyIHR3ZWVuID0gdGhpcy5fZmlyc3QsXG5cdFx0XHRcdFx0dGltZSA9IHRoaXMuX3RpbWU7XG5cdFx0XHRcdHdoaWxlICh0d2Vlbikge1xuXHRcdFx0XHRcdGlmICh0d2Vlbi5fc3RhcnRUaW1lID09PSB0aW1lICYmIHR3ZWVuLmRhdGEgPT09IFwiaXNQYXVzZVwiKSB7XG5cdFx0XHRcdFx0XHR0d2Vlbi5fcmF3UHJldlRpbWUgPSAwOyAvL3JlbWVtYmVyLCBfcmF3UHJldlRpbWUgaXMgaG93IHplcm8tZHVyYXRpb24gdHdlZW5zL2NhbGxiYWNrcyBzZW5zZSBkaXJlY3Rpb25hbGl0eSBhbmQgZGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IHRvIGZpcmUuIElmIF9yYXdQcmV2VGltZSBpcyB0aGUgc2FtZSBhcyBfc3RhcnRUaW1lIG9uIHRoZSBuZXh0IHJlbmRlciwgaXQgd29uJ3QgZmlyZS5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dHdlZW4gPSB0d2Vlbi5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIEFuaW1hdGlvbi5wcm90b3R5cGUucGF1c2VkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0fTtcblxuXHRcdHAudXNlc0ZyYW1lcyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRsID0gdGhpcy5fdGltZWxpbmU7XG5cdFx0XHR3aGlsZSAodGwuX3RpbWVsaW5lKSB7XG5cdFx0XHRcdHRsID0gdGwuX3RpbWVsaW5lO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICh0bCA9PT0gQW5pbWF0aW9uLl9yb290RnJhbWVzVGltZWxpbmUpO1xuXHRcdH07XG5cblx0XHRwLnJhd1RpbWUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9wYXVzZWQgPyB0aGlzLl90b3RhbFRpbWUgOiAodGhpcy5fdGltZWxpbmUucmF3VGltZSgpIC0gdGhpcy5fc3RhcnRUaW1lKSAqIHRoaXMuX3RpbWVTY2FsZTtcblx0XHR9O1xuXG5cdFx0cmV0dXJuIFRpbWVsaW5lTGl0ZTtcblxuXHR9LCB0cnVlKTtcblx0XG5cblxuXG5cblxuXG5cblx0XG5cdFxuXHRcblx0XG5cdFxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFRpbWVsaW5lTWF4XG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0X2dzU2NvcGUuX2dzRGVmaW5lKFwiVGltZWxpbmVNYXhcIiwgW1wiVGltZWxpbmVMaXRlXCIsXCJUd2VlbkxpdGVcIixcImVhc2luZy5FYXNlXCJdLCBmdW5jdGlvbihUaW1lbGluZUxpdGUsIFR3ZWVuTGl0ZSwgRWFzZSkge1xuXG5cdFx0dmFyIFRpbWVsaW5lTWF4ID0gZnVuY3Rpb24odmFycykge1xuXHRcdFx0XHRUaW1lbGluZUxpdGUuY2FsbCh0aGlzLCB2YXJzKTtcblx0XHRcdFx0dGhpcy5fcmVwZWF0ID0gdGhpcy52YXJzLnJlcGVhdCB8fCAwO1xuXHRcdFx0XHR0aGlzLl9yZXBlYXREZWxheSA9IHRoaXMudmFycy5yZXBlYXREZWxheSB8fCAwO1xuXHRcdFx0XHR0aGlzLl9jeWNsZSA9IDA7XG5cdFx0XHRcdHRoaXMuX3lveW8gPSAodGhpcy52YXJzLnlveW8gPT09IHRydWUpO1xuXHRcdFx0XHR0aGlzLl9kaXJ0eSA9IHRydWU7XG5cdFx0XHR9LFxuXHRcdFx0X3RpbnlOdW0gPSAwLjAwMDAwMDAwMDEsXG5cdFx0XHRUd2VlbkxpdGVJbnRlcm5hbHMgPSBUd2VlbkxpdGUuX2ludGVybmFscyxcblx0XHRcdF9sYXp5VHdlZW5zID0gVHdlZW5MaXRlSW50ZXJuYWxzLmxhenlUd2VlbnMsXG5cdFx0XHRfbGF6eVJlbmRlciA9IFR3ZWVuTGl0ZUludGVybmFscy5sYXp5UmVuZGVyLFxuXHRcdFx0X2Vhc2VOb25lID0gbmV3IEVhc2UobnVsbCwgbnVsbCwgMSwgMCksXG5cdFx0XHRwID0gVGltZWxpbmVNYXgucHJvdG90eXBlID0gbmV3IFRpbWVsaW5lTGl0ZSgpO1xuXG5cdFx0cC5jb25zdHJ1Y3RvciA9IFRpbWVsaW5lTWF4O1xuXHRcdHAua2lsbCgpLl9nYyA9IGZhbHNlO1xuXHRcdFRpbWVsaW5lTWF4LnZlcnNpb24gPSBcIjEuMTcuMFwiO1xuXG5cdFx0cC5pbnZhbGlkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLl95b3lvID0gKHRoaXMudmFycy55b3lvID09PSB0cnVlKTtcblx0XHRcdHRoaXMuX3JlcGVhdCA9IHRoaXMudmFycy5yZXBlYXQgfHwgMDtcblx0XHRcdHRoaXMuX3JlcGVhdERlbGF5ID0gdGhpcy52YXJzLnJlcGVhdERlbGF5IHx8IDA7XG5cdFx0XHR0aGlzLl91bmNhY2hlKHRydWUpO1xuXHRcdFx0cmV0dXJuIFRpbWVsaW5lTGl0ZS5wcm90b3R5cGUuaW52YWxpZGF0ZS5jYWxsKHRoaXMpO1xuXHRcdH07XG5cblx0XHRwLmFkZENhbGxiYWNrID0gZnVuY3Rpb24oY2FsbGJhY2ssIHBvc2l0aW9uLCBwYXJhbXMsIHNjb3BlKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5hZGQoIFR3ZWVuTGl0ZS5kZWxheWVkQ2FsbCgwLCBjYWxsYmFjaywgcGFyYW1zLCBzY29wZSksIHBvc2l0aW9uKTtcblx0XHR9O1xuXG5cdFx0cC5yZW1vdmVDYWxsYmFjayA9IGZ1bmN0aW9uKGNhbGxiYWNrLCBwb3NpdGlvbikge1xuXHRcdFx0aWYgKGNhbGxiYWNrKSB7XG5cdFx0XHRcdGlmIChwb3NpdGlvbiA9PSBudWxsKSB7XG5cdFx0XHRcdFx0dGhpcy5fa2lsbChudWxsLCBjYWxsYmFjayk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIGEgPSB0aGlzLmdldFR3ZWVuc09mKGNhbGxiYWNrLCBmYWxzZSksXG5cdFx0XHRcdFx0XHRpID0gYS5sZW5ndGgsXG5cdFx0XHRcdFx0XHR0aW1lID0gdGhpcy5fcGFyc2VUaW1lT3JMYWJlbChwb3NpdGlvbik7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRpZiAoYVtpXS5fc3RhcnRUaW1lID09PSB0aW1lKSB7XG5cdFx0XHRcdFx0XHRcdGFbaV0uX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLnJlbW92ZVBhdXNlID0gZnVuY3Rpb24ocG9zaXRpb24pIHtcblx0XHRcdHJldHVybiB0aGlzLnJlbW92ZUNhbGxiYWNrKFRpbWVsaW5lTGl0ZS5faW50ZXJuYWxzLnBhdXNlQ2FsbGJhY2ssIHBvc2l0aW9uKTtcblx0XHR9O1xuXG5cdFx0cC50d2VlblRvID0gZnVuY3Rpb24ocG9zaXRpb24sIHZhcnMpIHtcblx0XHRcdHZhcnMgPSB2YXJzIHx8IHt9O1xuXHRcdFx0dmFyIGNvcHkgPSB7ZWFzZTpfZWFzZU5vbmUsIHVzZUZyYW1lczp0aGlzLnVzZXNGcmFtZXMoKSwgaW1tZWRpYXRlUmVuZGVyOmZhbHNlfSxcblx0XHRcdFx0ZHVyYXRpb24sIHAsIHQ7XG5cdFx0XHRmb3IgKHAgaW4gdmFycykge1xuXHRcdFx0XHRjb3B5W3BdID0gdmFyc1twXTtcblx0XHRcdH1cblx0XHRcdGNvcHkudGltZSA9IHRoaXMuX3BhcnNlVGltZU9yTGFiZWwocG9zaXRpb24pO1xuXHRcdFx0ZHVyYXRpb24gPSAoTWF0aC5hYnMoTnVtYmVyKGNvcHkudGltZSkgLSB0aGlzLl90aW1lKSAvIHRoaXMuX3RpbWVTY2FsZSkgfHwgMC4wMDE7XG5cdFx0XHR0ID0gbmV3IFR3ZWVuTGl0ZSh0aGlzLCBkdXJhdGlvbiwgY29weSk7XG5cdFx0XHRjb3B5Lm9uU3RhcnQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0dC50YXJnZXQucGF1c2VkKHRydWUpO1xuXHRcdFx0XHRpZiAodC52YXJzLnRpbWUgIT09IHQudGFyZ2V0LnRpbWUoKSAmJiBkdXJhdGlvbiA9PT0gdC5kdXJhdGlvbigpKSB7IC8vZG9uJ3QgbWFrZSB0aGUgZHVyYXRpb24gemVybyAtIGlmIGl0J3Mgc3VwcG9zZWQgdG8gYmUgemVybywgZG9uJ3Qgd29ycnkgYmVjYXVzZSBpdCdzIGFscmVhZHkgaW5pdHRpbmcgdGhlIHR3ZWVuIGFuZCB3aWxsIGNvbXBsZXRlIGltbWVkaWF0ZWx5LCBlZmZlY3RpdmVseSBtYWtpbmcgdGhlIGR1cmF0aW9uIHplcm8gYW55d2F5LiBJZiB3ZSBtYWtlIGR1cmF0aW9uIHplcm8sIHRoZSB0d2VlbiB3b24ndCBydW4gYXQgYWxsLlxuXHRcdFx0XHRcdHQuZHVyYXRpb24oIE1hdGguYWJzKCB0LnZhcnMudGltZSAtIHQudGFyZ2V0LnRpbWUoKSkgLyB0LnRhcmdldC5fdGltZVNjYWxlICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHZhcnMub25TdGFydCkgeyAvL2luIGNhc2UgdGhlIHVzZXIgaGFkIGFuIG9uU3RhcnQgaW4gdGhlIHZhcnMgLSB3ZSBkb24ndCB3YW50IHRvIG92ZXJ3cml0ZSBpdC5cblx0XHRcdFx0XHR0Ll9jYWxsYmFjayhcIm9uU3RhcnRcIik7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0XHRyZXR1cm4gdDtcblx0XHR9O1xuXG5cdFx0cC50d2VlbkZyb21UbyA9IGZ1bmN0aW9uKGZyb21Qb3NpdGlvbiwgdG9Qb3NpdGlvbiwgdmFycykge1xuXHRcdFx0dmFycyA9IHZhcnMgfHwge307XG5cdFx0XHRmcm9tUG9zaXRpb24gPSB0aGlzLl9wYXJzZVRpbWVPckxhYmVsKGZyb21Qb3NpdGlvbik7XG5cdFx0XHR2YXJzLnN0YXJ0QXQgPSB7b25Db21wbGV0ZTp0aGlzLnNlZWssIG9uQ29tcGxldGVQYXJhbXM6W2Zyb21Qb3NpdGlvbl0sIGNhbGxiYWNrU2NvcGU6dGhpc307XG5cdFx0XHR2YXJzLmltbWVkaWF0ZVJlbmRlciA9ICh2YXJzLmltbWVkaWF0ZVJlbmRlciAhPT0gZmFsc2UpO1xuXHRcdFx0dmFyIHQgPSB0aGlzLnR3ZWVuVG8odG9Qb3NpdGlvbiwgdmFycyk7XG5cdFx0XHRyZXR1cm4gdC5kdXJhdGlvbigoTWF0aC5hYnMoIHQudmFycy50aW1lIC0gZnJvbVBvc2l0aW9uKSAvIHRoaXMuX3RpbWVTY2FsZSkgfHwgMC4wMDEpO1xuXHRcdH07XG5cblx0XHRwLnJlbmRlciA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSkge1xuXHRcdFx0aWYgKHRoaXMuX2djKSB7XG5cdFx0XHRcdHRoaXMuX2VuYWJsZWQodHJ1ZSwgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHRvdGFsRHVyID0gKCF0aGlzLl9kaXJ0eSkgPyB0aGlzLl90b3RhbER1cmF0aW9uIDogdGhpcy50b3RhbER1cmF0aW9uKCksXG5cdFx0XHRcdGR1ciA9IHRoaXMuX2R1cmF0aW9uLFxuXHRcdFx0XHRwcmV2VGltZSA9IHRoaXMuX3RpbWUsXG5cdFx0XHRcdHByZXZUb3RhbFRpbWUgPSB0aGlzLl90b3RhbFRpbWUsXG5cdFx0XHRcdHByZXZTdGFydCA9IHRoaXMuX3N0YXJ0VGltZSxcblx0XHRcdFx0cHJldlRpbWVTY2FsZSA9IHRoaXMuX3RpbWVTY2FsZSxcblx0XHRcdFx0cHJldlJhd1ByZXZUaW1lID0gdGhpcy5fcmF3UHJldlRpbWUsXG5cdFx0XHRcdHByZXZQYXVzZWQgPSB0aGlzLl9wYXVzZWQsXG5cdFx0XHRcdHByZXZDeWNsZSA9IHRoaXMuX2N5Y2xlLFxuXHRcdFx0XHR0d2VlbiwgaXNDb21wbGV0ZSwgbmV4dCwgY2FsbGJhY2ssIGludGVybmFsRm9yY2UsIGN5Y2xlRHVyYXRpb247XG5cdFx0XHRpZiAodGltZSA+PSB0b3RhbER1cikge1xuXHRcdFx0XHRpZiAoIXRoaXMuX2xvY2tlZCkge1xuXHRcdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRvdGFsRHVyO1xuXHRcdFx0XHRcdHRoaXMuX2N5Y2xlID0gdGhpcy5fcmVwZWF0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghdGhpcy5fcmV2ZXJzZWQpIGlmICghdGhpcy5faGFzUGF1c2VkQ2hpbGQoKSkge1xuXHRcdFx0XHRcdGlzQ29tcGxldGUgPSB0cnVlO1xuXHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvbkNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9ICEhdGhpcy5fdGltZWxpbmUuYXV0b1JlbW92ZUNoaWxkcmVuOyAvL290aGVyd2lzZSwgaWYgdGhlIGFuaW1hdGlvbiBpcyB1bnBhdXNlZC9hY3RpdmF0ZWQgYWZ0ZXIgaXQncyBhbHJlYWR5IGZpbmlzaGVkLCBpdCBkb2Vzbid0IGdldCByZW1vdmVkIGZyb20gdGhlIHBhcmVudCB0aW1lbGluZS5cblx0XHRcdFx0XHRpZiAodGhpcy5fZHVyYXRpb24gPT09IDApIGlmICh0aW1lID09PSAwIHx8IHByZXZSYXdQcmV2VGltZSA8IDAgfHwgcHJldlJhd1ByZXZUaW1lID09PSBfdGlueU51bSkgaWYgKHByZXZSYXdQcmV2VGltZSAhPT0gdGltZSAmJiB0aGlzLl9maXJzdCkge1xuXHRcdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9IHRydWU7XG5cdFx0XHRcdFx0XHRpZiAocHJldlJhd1ByZXZUaW1lID4gX3RpbnlOdW0pIHtcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uUmV2ZXJzZUNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gKHRoaXMuX2R1cmF0aW9uIHx8ICFzdXBwcmVzc0V2ZW50cyB8fCB0aW1lIHx8IHRoaXMuX3Jhd1ByZXZUaW1lID09PSB0aW1lKSA/IHRpbWUgOiBfdGlueU51bTsgLy93aGVuIHRoZSBwbGF5aGVhZCBhcnJpdmVzIGF0IEVYQUNUTFkgdGltZSAwIChyaWdodCBvbiB0b3ApIG9mIGEgemVyby1kdXJhdGlvbiB0aW1lbGluZSBvciB0d2Vlbiwgd2UgbmVlZCB0byBkaXNjZXJuIGlmIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBzbyB0aGF0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIGFnYWluIChuZXh0IHRpbWUpLCBpdCdsbCB0cmlnZ2VyIHRoZSBjYWxsYmFjay4gSWYgZXZlbnRzIGFyZSBOT1Qgc3VwcHJlc3NlZCwgb2J2aW91c2x5IHRoZSBjYWxsYmFjayB3b3VsZCBiZSB0cmlnZ2VyZWQgaW4gdGhpcyByZW5kZXIuIEJhc2ljYWxseSwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlIGVpdGhlciB3aGVuIHRoZSBwbGF5aGVhZCBBUlJJVkVTIG9yIExFQVZFUyB0aGlzIGV4YWN0IHNwb3QsIG5vdCBib3RoLiBJbWFnaW5lIGRvaW5nIGEgdGltZWxpbmUuc2VlaygwKSBhbmQgdGhlcmUncyBhIGNhbGxiYWNrIHRoYXQgc2l0cyBhdCAwLiBTaW5jZSBldmVudHMgYXJlIHN1cHByZXNzZWQgb24gdGhhdCBzZWVrKCkgYnkgZGVmYXVsdCwgbm90aGluZyB3aWxsIGZpcmUsIGJ1dCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBvZmYgb2YgdGhhdCBwb3NpdGlvbiwgdGhlIGNhbGxiYWNrIHNob3VsZCBmaXJlLiBUaGlzIGJlaGF2aW9yIGlzIHdoYXQgcGVvcGxlIGludHVpdGl2ZWx5IGV4cGVjdC4gV2Ugc2V0IHRoZSBfcmF3UHJldlRpbWUgdG8gYmUgYSBwcmVjaXNlIHRpbnkgbnVtYmVyIHRvIGluZGljYXRlIHRoaXMgc2NlbmFyaW8gcmF0aGVyIHRoYW4gdXNpbmcgYW5vdGhlciBwcm9wZXJ0eS92YXJpYWJsZSB3aGljaCB3b3VsZCBpbmNyZWFzZSBtZW1vcnkgdXNhZ2UuIFRoaXMgdGVjaG5pcXVlIGlzIGxlc3MgcmVhZGFibGUsIGJ1dCBtb3JlIGVmZmljaWVudC5cblx0XHRcdFx0aWYgKHRoaXMuX3lveW8gJiYgKHRoaXMuX2N5Y2xlICYgMSkgIT09IDApIHtcblx0XHRcdFx0XHR0aGlzLl90aW1lID0gdGltZSA9IDA7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fdGltZSA9IGR1cjtcblx0XHRcdFx0XHR0aW1lID0gZHVyICsgMC4wMDAxOyAvL3RvIGF2b2lkIG9jY2FzaW9uYWwgZmxvYXRpbmcgcG9pbnQgcm91bmRpbmcgZXJyb3JzIC0gc29tZXRpbWVzIGNoaWxkIHR3ZWVucy90aW1lbGluZXMgd2VyZSBub3QgYmVpbmcgZnVsbHkgY29tcGxldGVkICh0aGVpciBwcm9ncmVzcyBtaWdodCBiZSAwLjk5OTk5OTk5OTk5OTk5OCBpbnN0ZWFkIG9mIDEgYmVjYXVzZSB3aGVuIF90aW1lIC0gdHdlZW4uX3N0YXJ0VGltZSBpcyBwZXJmb3JtZWQsIGZsb2F0aW5nIHBvaW50IGVycm9ycyB3b3VsZCByZXR1cm4gYSB2YWx1ZSB0aGF0IHdhcyBTTElHSFRMWSBvZmYpLiBUcnkgKDk5OTk5OTk5OTk5OS43IC0gOTk5OTk5OTk5OTk5KSAqIDEgPSAwLjY5OTk1MTE3MTg3NSBpbnN0ZWFkIG9mIDAuNy4gV2UgY2Fubm90IGRvIGxlc3MgdGhlbiAwLjAwMDEgYmVjYXVzZSB0aGUgc2FtZSBpc3N1ZSBjYW4gb2NjdXIgd2hlbiB0aGUgZHVyYXRpb24gaXMgZXh0cmVtZWx5IGxhcmdlIGxpa2UgOTk5OTk5OTk5OTk5IGluIHdoaWNoIGNhc2UgYWRkaW5nIDAuMDAwMDAwMDEsIGZvciBleGFtcGxlLCBjYXVzZXMgaXQgdG8gYWN0IGxpa2Ugbm90aGluZyB3YXMgYWRkZWQuXG5cdFx0XHRcdH1cblxuXHRcdFx0fSBlbHNlIGlmICh0aW1lIDwgMC4wMDAwMDAxKSB7IC8vdG8gd29yayBhcm91bmQgb2NjYXNpb25hbCBmbG9hdGluZyBwb2ludCBtYXRoIGFydGlmYWN0cywgcm91bmQgc3VwZXIgc21hbGwgdmFsdWVzIHRvIDAuXG5cdFx0XHRcdGlmICghdGhpcy5fbG9ja2VkKSB7XG5cdFx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGhpcy5fY3ljbGUgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3RpbWUgPSAwO1xuXHRcdFx0XHRpZiAocHJldlRpbWUgIT09IDAgfHwgKGR1ciA9PT0gMCAmJiBwcmV2UmF3UHJldlRpbWUgIT09IF90aW55TnVtICYmIChwcmV2UmF3UHJldlRpbWUgPiAwIHx8ICh0aW1lIDwgMCAmJiBwcmV2UmF3UHJldlRpbWUgPj0gMCkpICYmICF0aGlzLl9sb2NrZWQpKSB7IC8vZWRnZSBjYXNlIGZvciBjaGVja2luZyB0aW1lIDwgMCAmJiBwcmV2UmF3UHJldlRpbWUgPj0gMDogYSB6ZXJvLWR1cmF0aW9uIGZyb21UbygpIHR3ZWVuIGluc2lkZSBhIHplcm8tZHVyYXRpb24gdGltZWxpbmUgKHllYWgsIHZlcnkgcmFyZSlcblx0XHRcdFx0XHRjYWxsYmFjayA9IFwib25SZXZlcnNlQ29tcGxldGVcIjtcblx0XHRcdFx0XHRpc0NvbXBsZXRlID0gdGhpcy5fcmV2ZXJzZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRpbWUgPCAwKSB7XG5cdFx0XHRcdFx0dGhpcy5fYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lLmF1dG9SZW1vdmVDaGlsZHJlbiAmJiB0aGlzLl9yZXZlcnNlZCkge1xuXHRcdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9IGlzQ29tcGxldGUgPSB0cnVlO1xuXHRcdFx0XHRcdFx0Y2FsbGJhY2sgPSBcIm9uUmV2ZXJzZUNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChwcmV2UmF3UHJldlRpbWUgPj0gMCAmJiB0aGlzLl9maXJzdCkgeyAvL3doZW4gZ29pbmcgYmFjayBiZXlvbmQgdGhlIHN0YXJ0LCBmb3JjZSBhIHJlbmRlciBzbyB0aGF0IHplcm8tZHVyYXRpb24gdHdlZW5zIHRoYXQgc2l0IGF0IHRoZSB2ZXJ5IGJlZ2lubmluZyByZW5kZXIgdGhlaXIgc3RhcnQgdmFsdWVzIHByb3Blcmx5LiBPdGhlcndpc2UsIGlmIHRoZSBwYXJlbnQgdGltZWxpbmUncyBwbGF5aGVhZCBsYW5kcyBleGFjdGx5IGF0IHRoaXMgdGltZWxpbmUncyBzdGFydFRpbWUsIGFuZCB0aGVuIG1vdmVzIGJhY2t3YXJkcywgdGhlIHplcm8tZHVyYXRpb24gdHdlZW5zIGF0IHRoZSBiZWdpbm5pbmcgd291bGQgc3RpbGwgYmUgYXQgdGhlaXIgZW5kIHN0YXRlLlxuXHRcdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gdGltZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9IChkdXIgfHwgIXN1cHByZXNzRXZlbnRzIHx8IHRpbWUgfHwgdGhpcy5fcmF3UHJldlRpbWUgPT09IHRpbWUpID8gdGltZSA6IF90aW55TnVtOyAvL3doZW4gdGhlIHBsYXloZWFkIGFycml2ZXMgYXQgRVhBQ1RMWSB0aW1lIDAgKHJpZ2h0IG9uIHRvcCkgb2YgYSB6ZXJvLWR1cmF0aW9uIHRpbWVsaW5lIG9yIHR3ZWVuLCB3ZSBuZWVkIHRvIGRpc2Nlcm4gaWYgZXZlbnRzIGFyZSBzdXBwcmVzc2VkIHNvIHRoYXQgd2hlbiB0aGUgcGxheWhlYWQgbW92ZXMgYWdhaW4gKG5leHQgdGltZSksIGl0J2xsIHRyaWdnZXIgdGhlIGNhbGxiYWNrLiBJZiBldmVudHMgYXJlIE5PVCBzdXBwcmVzc2VkLCBvYnZpb3VzbHkgdGhlIGNhbGxiYWNrIHdvdWxkIGJlIHRyaWdnZXJlZCBpbiB0aGlzIHJlbmRlci4gQmFzaWNhbGx5LCB0aGUgY2FsbGJhY2sgc2hvdWxkIGZpcmUgZWl0aGVyIHdoZW4gdGhlIHBsYXloZWFkIEFSUklWRVMgb3IgTEVBVkVTIHRoaXMgZXhhY3Qgc3BvdCwgbm90IGJvdGguIEltYWdpbmUgZG9pbmcgYSB0aW1lbGluZS5zZWVrKDApIGFuZCB0aGVyZSdzIGEgY2FsbGJhY2sgdGhhdCBzaXRzIGF0IDAuIFNpbmNlIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBvbiB0aGF0IHNlZWsoKSBieSBkZWZhdWx0LCBub3RoaW5nIHdpbGwgZmlyZSwgYnV0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIG9mZiBvZiB0aGF0IHBvc2l0aW9uLCB0aGUgY2FsbGJhY2sgc2hvdWxkIGZpcmUuIFRoaXMgYmVoYXZpb3IgaXMgd2hhdCBwZW9wbGUgaW50dWl0aXZlbHkgZXhwZWN0LiBXZSBzZXQgdGhlIF9yYXdQcmV2VGltZSB0byBiZSBhIHByZWNpc2UgdGlueSBudW1iZXIgdG8gaW5kaWNhdGUgdGhpcyBzY2VuYXJpbyByYXRoZXIgdGhhbiB1c2luZyBhbm90aGVyIHByb3BlcnR5L3ZhcmlhYmxlIHdoaWNoIHdvdWxkIGluY3JlYXNlIG1lbW9yeSB1c2FnZS4gVGhpcyB0ZWNobmlxdWUgaXMgbGVzcyByZWFkYWJsZSwgYnV0IG1vcmUgZWZmaWNpZW50LlxuXHRcdFx0XHRcdGlmICh0aW1lID09PSAwICYmIGlzQ29tcGxldGUpIHsgLy9pZiB0aGVyZSdzIGEgemVyby1kdXJhdGlvbiB0d2VlbiBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgb2YgYSB0aW1lbGluZSBhbmQgdGhlIHBsYXloZWFkIGxhbmRzIEVYQUNUTFkgYXQgdGltZSAwLCB0aGF0IHR3ZWVuIHdpbGwgY29ycmVjdGx5IHJlbmRlciBpdHMgZW5kIHZhbHVlcywgYnV0IHdlIG5lZWQgdG8ga2VlcCB0aGUgdGltZWxpbmUgYWxpdmUgZm9yIG9uZSBtb3JlIHJlbmRlciBzbyB0aGF0IHRoZSBiZWdpbm5pbmcgdmFsdWVzIHJlbmRlciBwcm9wZXJseSBhcyB0aGUgcGFyZW50J3MgcGxheWhlYWQga2VlcHMgbW92aW5nIGJleW9uZCB0aGUgYmVnaW5pbmcuIEltYWdpbmUgb2JqLnggc3RhcnRzIGF0IDAgYW5kIHRoZW4gd2UgZG8gdGwuc2V0KG9iaiwge3g6MTAwfSkudG8ob2JqLCAxLCB7eDoyMDB9KSBhbmQgdGhlbiBsYXRlciB3ZSB0bC5yZXZlcnNlKCkuLi50aGUgZ29hbCBpcyB0byBoYXZlIG9iai54IHJldmVydCB0byAwLiBJZiB0aGUgcGxheWhlYWQgaGFwcGVucyB0byBsYW5kIG9uIGV4YWN0bHkgMCwgd2l0aG91dCB0aGlzIGNodW5rIG9mIGNvZGUsIGl0J2QgY29tcGxldGUgdGhlIHRpbWVsaW5lIGFuZCByZW1vdmUgaXQgZnJvbSB0aGUgcmVuZGVyaW5nIHF1ZXVlIChub3QgZ29vZCkuXG5cdFx0XHRcdFx0XHR0d2VlbiA9IHRoaXMuX2ZpcnN0O1xuXHRcdFx0XHRcdFx0d2hpbGUgKHR3ZWVuICYmIHR3ZWVuLl9zdGFydFRpbWUgPT09IDApIHtcblx0XHRcdFx0XHRcdFx0aWYgKCF0d2Vlbi5fZHVyYXRpb24pIHtcblx0XHRcdFx0XHRcdFx0XHRpc0NvbXBsZXRlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dHdlZW4gPSB0d2Vlbi5fbmV4dDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGltZSA9IDA7IC8vdG8gYXZvaWQgb2NjYXNpb25hbCBmbG9hdGluZyBwb2ludCByb3VuZGluZyBlcnJvcnMgKGNvdWxkIGNhdXNlIHByb2JsZW1zIGVzcGVjaWFsbHkgd2l0aCB6ZXJvLWR1cmF0aW9uIHR3ZWVucyBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgb2YgdGhlIHRpbWVsaW5lKVxuXHRcdFx0XHRcdGlmICghdGhpcy5faW5pdHRlZCkge1xuXHRcdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChkdXIgPT09IDAgJiYgcHJldlJhd1ByZXZUaW1lIDwgMCkgeyAvL3dpdGhvdXQgdGhpcywgemVyby1kdXJhdGlvbiByZXBlYXRpbmcgdGltZWxpbmVzIChsaWtlIHdpdGggYSBzaW1wbGUgY2FsbGJhY2sgbmVzdGVkIGF0IHRoZSB2ZXJ5IGJlZ2lubmluZyBhbmQgYSByZXBlYXREZWxheSkgd291bGRuJ3QgcmVuZGVyIHRoZSBmaXJzdCB0aW1lIHRocm91Z2guXG5cdFx0XHRcdFx0aW50ZXJuYWxGb3JjZSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fdGltZSA9IHRoaXMuX3Jhd1ByZXZUaW1lID0gdGltZTtcblx0XHRcdFx0aWYgKCF0aGlzLl9sb2NrZWQpIHtcblx0XHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0aW1lO1xuXHRcdFx0XHRcdGlmICh0aGlzLl9yZXBlYXQgIT09IDApIHtcblx0XHRcdFx0XHRcdGN5Y2xlRHVyYXRpb24gPSBkdXIgKyB0aGlzLl9yZXBlYXREZWxheTtcblx0XHRcdFx0XHRcdHRoaXMuX2N5Y2xlID0gKHRoaXMuX3RvdGFsVGltZSAvIGN5Y2xlRHVyYXRpb24pID4+IDA7IC8vb3JpZ2luYWxseSBfdG90YWxUaW1lICUgY3ljbGVEdXJhdGlvbiBidXQgZmxvYXRpbmcgcG9pbnQgZXJyb3JzIGNhdXNlZCBwcm9ibGVtcywgc28gSSBub3JtYWxpemVkIGl0LiAoNCAlIDAuOCBzaG91bGQgYmUgMCBidXQgaXQgZ2V0cyByZXBvcnRlZCBhcyAwLjc5OTk5OTk5ISlcblx0XHRcdFx0XHRcdGlmICh0aGlzLl9jeWNsZSAhPT0gMCkgaWYgKHRoaXMuX2N5Y2xlID09PSB0aGlzLl90b3RhbFRpbWUgLyBjeWNsZUR1cmF0aW9uKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2N5Y2xlLS07IC8vb3RoZXJ3aXNlIHdoZW4gcmVuZGVyZWQgZXhhY3RseSBhdCB0aGUgZW5kIHRpbWUsIGl0IHdpbGwgYWN0IGFzIHRob3VnaCBpdCBpcyByZXBlYXRpbmcgKGF0IHRoZSBiZWdpbm5pbmcpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLl90aW1lID0gdGhpcy5fdG90YWxUaW1lIC0gKHRoaXMuX2N5Y2xlICogY3ljbGVEdXJhdGlvbik7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5feW95bykgaWYgKCh0aGlzLl9jeWNsZSAmIDEpICE9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3RpbWUgPSBkdXIgLSB0aGlzLl90aW1lO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX3RpbWUgPiBkdXIpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fdGltZSA9IGR1cjtcblx0XHRcdFx0XHRcdFx0dGltZSA9IGR1ciArIDAuMDAwMTsgLy90byBhdm9pZCBvY2Nhc2lvbmFsIGZsb2F0aW5nIHBvaW50IHJvdW5kaW5nIGVycm9yXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuX3RpbWUgPCAwKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3RpbWUgPSB0aW1lID0gMDtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRpbWUgPSB0aGlzLl90aW1lO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fY3ljbGUgIT09IHByZXZDeWNsZSkgaWYgKCF0aGlzLl9sb2NrZWQpIHtcblx0XHRcdFx0Lypcblx0XHRcdFx0bWFrZSBzdXJlIGNoaWxkcmVuIGF0IHRoZSBlbmQvYmVnaW5uaW5nIG9mIHRoZSB0aW1lbGluZSBhcmUgcmVuZGVyZWQgcHJvcGVybHkuIElmLCBmb3IgZXhhbXBsZSxcblx0XHRcdFx0YSAzLXNlY29uZCBsb25nIHRpbWVsaW5lIHJlbmRlcmVkIGF0IDIuOSBzZWNvbmRzIHByZXZpb3VzbHksIGFuZCBub3cgcmVuZGVycyBhdCAzLjIgc2Vjb25kcyAod2hpY2hcblx0XHRcdFx0d291bGQgZ2V0IHRyYW5zYXRlZCB0byAyLjggc2Vjb25kcyBpZiB0aGUgdGltZWxpbmUgeW95b3Mgb3IgMC4yIHNlY29uZHMgaWYgaXQganVzdCByZXBlYXRzKSwgdGhlcmVcblx0XHRcdFx0Y291bGQgYmUgYSBjYWxsYmFjayBvciBhIHNob3J0IHR3ZWVuIHRoYXQncyBhdCAyLjk1IG9yIDMgc2Vjb25kcyBpbiB3aGljaCB3b3VsZG4ndCByZW5kZXIuIFNvXG5cdFx0XHRcdHdlIG5lZWQgdG8gcHVzaCB0aGUgdGltZWxpbmUgdG8gdGhlIGVuZCAoYW5kL29yIGJlZ2lubmluZyBkZXBlbmRpbmcgb24gaXRzIHlveW8gdmFsdWUpLiBBbHNvIHdlIG11c3Rcblx0XHRcdFx0ZW5zdXJlIHRoYXQgemVyby1kdXJhdGlvbiB0d2VlbnMgYXQgdGhlIHZlcnkgYmVnaW5uaW5nIG9yIGVuZCBvZiB0aGUgVGltZWxpbmVNYXggd29yay5cblx0XHRcdFx0Ki9cblx0XHRcdFx0dmFyIGJhY2t3YXJkcyA9ICh0aGlzLl95b3lvICYmIChwcmV2Q3ljbGUgJiAxKSAhPT0gMCksXG5cdFx0XHRcdFx0d3JhcCA9IChiYWNrd2FyZHMgPT09ICh0aGlzLl95b3lvICYmICh0aGlzLl9jeWNsZSAmIDEpICE9PSAwKSksXG5cdFx0XHRcdFx0cmVjVG90YWxUaW1lID0gdGhpcy5fdG90YWxUaW1lLFxuXHRcdFx0XHRcdHJlY0N5Y2xlID0gdGhpcy5fY3ljbGUsXG5cdFx0XHRcdFx0cmVjUmF3UHJldlRpbWUgPSB0aGlzLl9yYXdQcmV2VGltZSxcblx0XHRcdFx0XHRyZWNUaW1lID0gdGhpcy5fdGltZTtcblxuXHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSBwcmV2Q3ljbGUgKiBkdXI7XG5cdFx0XHRcdGlmICh0aGlzLl9jeWNsZSA8IHByZXZDeWNsZSkge1xuXHRcdFx0XHRcdGJhY2t3YXJkcyA9ICFiYWNrd2FyZHM7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5fdG90YWxUaW1lICs9IGR1cjtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl90aW1lID0gcHJldlRpbWU7IC8vdGVtcG9yYXJpbHkgcmV2ZXJ0IF90aW1lIHNvIHRoYXQgcmVuZGVyKCkgcmVuZGVycyB0aGUgY2hpbGRyZW4gaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIFdpdGhvdXQgdGhpcywgdHdlZW5zIHdvbid0IHJld2luZCBjb3JyZWN0bHkuIFdlIGNvdWxkIGFyaGljdGVjdCB0aGluZ3MgaW4gYSBcImNsZWFuZXJcIiB3YXkgYnkgc3BsaXR0aW5nIG91dCB0aGUgcmVuZGVyaW5nIHF1ZXVlIGludG8gYSBzZXBhcmF0ZSBtZXRob2QgYnV0IGZvciBwZXJmb3JtYW5jZSByZWFzb25zLCB3ZSBrZXB0IGl0IGFsbCBpbnNpZGUgdGhpcyBtZXRob2QuXG5cblx0XHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSAoZHVyID09PSAwKSA/IHByZXZSYXdQcmV2VGltZSAtIDAuMDAwMSA6IHByZXZSYXdQcmV2VGltZTtcblx0XHRcdFx0dGhpcy5fY3ljbGUgPSBwcmV2Q3ljbGU7XG5cdFx0XHRcdHRoaXMuX2xvY2tlZCA9IHRydWU7IC8vcHJldmVudHMgY2hhbmdlcyB0byB0b3RhbFRpbWUgYW5kIHNraXBzIHJlcGVhdC95b3lvIGJlaGF2aW9yIHdoZW4gd2UgcmVjdXJzaXZlbHkgY2FsbCByZW5kZXIoKVxuXHRcdFx0XHRwcmV2VGltZSA9IChiYWNrd2FyZHMpID8gMCA6IGR1cjtcblx0XHRcdFx0dGhpcy5yZW5kZXIocHJldlRpbWUsIHN1cHByZXNzRXZlbnRzLCAoZHVyID09PSAwKSk7XG5cdFx0XHRcdGlmICghc3VwcHJlc3NFdmVudHMpIGlmICghdGhpcy5fZ2MpIHtcblx0XHRcdFx0XHRpZiAodGhpcy52YXJzLm9uUmVwZWF0KSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9jYWxsYmFjayhcIm9uUmVwZWF0XCIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAod3JhcCkge1xuXHRcdFx0XHRcdHByZXZUaW1lID0gKGJhY2t3YXJkcykgPyBkdXIgKyAwLjAwMDEgOiAtMC4wMDAxO1xuXHRcdFx0XHRcdHRoaXMucmVuZGVyKHByZXZUaW1lLCB0cnVlLCBmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fbG9ja2VkID0gZmFsc2U7XG5cdFx0XHRcdGlmICh0aGlzLl9wYXVzZWQgJiYgIXByZXZQYXVzZWQpIHsgLy9pZiB0aGUgcmVuZGVyKCkgdHJpZ2dlcmVkIGNhbGxiYWNrIHRoYXQgcGF1c2VkIHRoaXMgdGltZWxpbmUsIHdlIHNob3VsZCBhYm9ydCAodmVyeSByYXJlLCBidXQgcG9zc2libGUpXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3RpbWUgPSByZWNUaW1lO1xuXHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSByZWNUb3RhbFRpbWU7XG5cdFx0XHRcdHRoaXMuX2N5Y2xlID0gcmVjQ3ljbGU7XG5cdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gcmVjUmF3UHJldlRpbWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICgodGhpcy5fdGltZSA9PT0gcHJldlRpbWUgfHwgIXRoaXMuX2ZpcnN0KSAmJiAhZm9yY2UgJiYgIWludGVybmFsRm9yY2UpIHtcblx0XHRcdFx0aWYgKHByZXZUb3RhbFRpbWUgIT09IHRoaXMuX3RvdGFsVGltZSkgaWYgKHRoaXMuX29uVXBkYXRlKSBpZiAoIXN1cHByZXNzRXZlbnRzKSB7IC8vc28gdGhhdCBvblVwZGF0ZSBmaXJlcyBldmVuIGR1cmluZyB0aGUgcmVwZWF0RGVsYXkgLSBhcyBsb25nIGFzIHRoZSB0b3RhbFRpbWUgY2hhbmdlZCwgd2Ugc2hvdWxkIHRyaWdnZXIgb25VcGRhdGUuXG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2soXCJvblVwZGF0ZVwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9IGVsc2UgaWYgKCF0aGlzLl9pbml0dGVkKSB7XG5cdFx0XHRcdHRoaXMuX2luaXR0ZWQgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXRoaXMuX2FjdGl2ZSkgaWYgKCF0aGlzLl9wYXVzZWQgJiYgdGhpcy5fdG90YWxUaW1lICE9PSBwcmV2VG90YWxUaW1lICYmIHRpbWUgPiAwKSB7XG5cdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IHRydWU7ICAvL3NvIHRoYXQgaWYgdGhlIHVzZXIgcmVuZGVycyB0aGUgdGltZWxpbmUgKGFzIG9wcG9zZWQgdG8gdGhlIHBhcmVudCB0aW1lbGluZSByZW5kZXJpbmcgaXQpLCBpdCBpcyBmb3JjZWQgdG8gcmUtcmVuZGVyIGFuZCBhbGlnbiBpdCB3aXRoIHRoZSBwcm9wZXIgdGltZS9mcmFtZSBvbiB0aGUgbmV4dCByZW5kZXJpbmcgY3ljbGUuIE1heWJlIHRoZSB0aW1lbGluZSBhbHJlYWR5IGZpbmlzaGVkIGJ1dCB0aGUgdXNlciBtYW51YWxseSByZS1yZW5kZXJzIGl0IGFzIGhhbGZ3YXkgZG9uZSwgZm9yIGV4YW1wbGUuXG5cdFx0XHR9XG5cblx0XHRcdGlmIChwcmV2VG90YWxUaW1lID09PSAwKSBpZiAodGhpcy52YXJzLm9uU3RhcnQpIGlmICh0aGlzLl90b3RhbFRpbWUgIT09IDApIGlmICghc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdFx0dGhpcy5fY2FsbGJhY2soXCJvblN0YXJ0XCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fdGltZSA+PSBwcmV2VGltZSkge1xuXHRcdFx0XHR0d2VlbiA9IHRoaXMuX2ZpcnN0O1xuXHRcdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0XHRuZXh0ID0gdHdlZW4uX25leHQ7IC8vcmVjb3JkIGl0IGhlcmUgYmVjYXVzZSB0aGUgdmFsdWUgY291bGQgY2hhbmdlIGFmdGVyIHJlbmRlcmluZy4uLlxuXHRcdFx0XHRcdGlmICh0aGlzLl9wYXVzZWQgJiYgIXByZXZQYXVzZWQpIHsgLy9pbiBjYXNlIGEgdHdlZW4gcGF1c2VzIHRoZSB0aW1lbGluZSB3aGVuIHJlbmRlcmluZ1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0d2Vlbi5fYWN0aXZlIHx8ICh0d2Vlbi5fc3RhcnRUaW1lIDw9IHRoaXMuX3RpbWUgJiYgIXR3ZWVuLl9wYXVzZWQgJiYgIXR3ZWVuLl9nYykpIHtcblx0XHRcdFx0XHRcdGlmICghdHdlZW4uX3JldmVyc2VkKSB7XG5cdFx0XHRcdFx0XHRcdHR3ZWVuLnJlbmRlcigodGltZSAtIHR3ZWVuLl9zdGFydFRpbWUpICogdHdlZW4uX3RpbWVTY2FsZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHR3ZWVuLnJlbmRlcigoKCF0d2Vlbi5fZGlydHkpID8gdHdlZW4uX3RvdGFsRHVyYXRpb24gOiB0d2Vlbi50b3RhbER1cmF0aW9uKCkpIC0gKCh0aW1lIC0gdHdlZW4uX3N0YXJ0VGltZSkgKiB0d2Vlbi5fdGltZVNjYWxlKSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0d2VlbiA9IG5leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHR3ZWVuID0gdGhpcy5fbGFzdDtcblx0XHRcdFx0d2hpbGUgKHR3ZWVuKSB7XG5cdFx0XHRcdFx0bmV4dCA9IHR3ZWVuLl9wcmV2OyAvL3JlY29yZCBpdCBoZXJlIGJlY2F1c2UgdGhlIHZhbHVlIGNvdWxkIGNoYW5nZSBhZnRlciByZW5kZXJpbmcuLi5cblx0XHRcdFx0XHRpZiAodGhpcy5fcGF1c2VkICYmICFwcmV2UGF1c2VkKSB7IC8vaW4gY2FzZSBhIHR3ZWVuIHBhdXNlcyB0aGUgdGltZWxpbmUgd2hlbiByZW5kZXJpbmdcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodHdlZW4uX2FjdGl2ZSB8fCAodHdlZW4uX3N0YXJ0VGltZSA8PSBwcmV2VGltZSAmJiAhdHdlZW4uX3BhdXNlZCAmJiAhdHdlZW4uX2djKSkge1xuXHRcdFx0XHRcdFx0aWYgKCF0d2Vlbi5fcmV2ZXJzZWQpIHtcblx0XHRcdFx0XHRcdFx0dHdlZW4ucmVuZGVyKCh0aW1lIC0gdHdlZW4uX3N0YXJ0VGltZSkgKiB0d2Vlbi5fdGltZVNjYWxlLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0dHdlZW4ucmVuZGVyKCgoIXR3ZWVuLl9kaXJ0eSkgPyB0d2Vlbi5fdG90YWxEdXJhdGlvbiA6IHR3ZWVuLnRvdGFsRHVyYXRpb24oKSkgLSAoKHRpbWUgLSB0d2Vlbi5fc3RhcnRUaW1lKSAqIHR3ZWVuLl90aW1lU2NhbGUpLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0d2VlbiA9IG5leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuX29uVXBkYXRlKSBpZiAoIXN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRcdGlmIChfbGF6eVR3ZWVucy5sZW5ndGgpIHsgLy9pbiBjYXNlIHJlbmRlcmluZyBjYXVzZWQgYW55IHR3ZWVucyB0byBsYXp5LWluaXQsIHdlIHNob3VsZCByZW5kZXIgdGhlbSBiZWNhdXNlIHR5cGljYWxseSB3aGVuIGEgdGltZWxpbmUgZmluaXNoZXMsIHVzZXJzIGV4cGVjdCB0aGluZ3MgdG8gaGF2ZSByZW5kZXJlZCBmdWxseS4gSW1hZ2luZSBhbiBvblVwZGF0ZSBvbiBhIHRpbWVsaW5lIHRoYXQgcmVwb3J0cy9jaGVja3MgdHdlZW5lZCB2YWx1ZXMuXG5cdFx0XHRcdFx0X2xhenlSZW5kZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9jYWxsYmFjayhcIm9uVXBkYXRlXCIpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGNhbGxiYWNrKSBpZiAoIXRoaXMuX2xvY2tlZCkgaWYgKCF0aGlzLl9nYykgaWYgKHByZXZTdGFydCA9PT0gdGhpcy5fc3RhcnRUaW1lIHx8IHByZXZUaW1lU2NhbGUgIT09IHRoaXMuX3RpbWVTY2FsZSkgaWYgKHRoaXMuX3RpbWUgPT09IDAgfHwgdG90YWxEdXIgPj0gdGhpcy50b3RhbER1cmF0aW9uKCkpIHsgLy9pZiBvbmUgb2YgdGhlIHR3ZWVucyB0aGF0IHdhcyByZW5kZXJlZCBhbHRlcmVkIHRoaXMgdGltZWxpbmUncyBzdGFydFRpbWUgKGxpa2UgaWYgYW4gb25Db21wbGV0ZSByZXZlcnNlZCB0aGUgdGltZWxpbmUpLCBpdCBwcm9iYWJseSBpc24ndCBjb21wbGV0ZS4gSWYgaXQgaXMsIGRvbid0IHdvcnJ5LCBiZWNhdXNlIHdoYXRldmVyIGNhbGwgYWx0ZXJlZCB0aGUgc3RhcnRUaW1lIHdvdWxkIGNvbXBsZXRlIGlmIGl0IHdhcyBuZWNlc3NhcnkgYXQgdGhlIG5ldyB0aW1lLiBUaGUgb25seSBleGNlcHRpb24gaXMgdGhlIHRpbWVTY2FsZSBwcm9wZXJ0eS4gQWxzbyBjaGVjayBfZ2MgYmVjYXVzZSB0aGVyZSdzIGEgY2hhbmNlIHRoYXQga2lsbCgpIGNvdWxkIGJlIGNhbGxlZCBpbiBhbiBvblVwZGF0ZVxuXHRcdFx0XHRpZiAoaXNDb21wbGV0ZSkge1xuXHRcdFx0XHRcdGlmIChfbGF6eVR3ZWVucy5sZW5ndGgpIHsgLy9pbiBjYXNlIHJlbmRlcmluZyBjYXVzZWQgYW55IHR3ZWVucyB0byBsYXp5LWluaXQsIHdlIHNob3VsZCByZW5kZXIgdGhlbSBiZWNhdXNlIHR5cGljYWxseSB3aGVuIGEgdGltZWxpbmUgZmluaXNoZXMsIHVzZXJzIGV4cGVjdCB0aGluZ3MgdG8gaGF2ZSByZW5kZXJlZCBmdWxseS4gSW1hZ2luZSBhbiBvbkNvbXBsZXRlIG9uIGEgdGltZWxpbmUgdGhhdCByZXBvcnRzL2NoZWNrcyB0d2VlbmVkIHZhbHVlcy5cblx0XHRcdFx0XHRcdF9sYXp5UmVuZGVyKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW4pIHtcblx0XHRcdFx0XHRcdHRoaXMuX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fYWN0aXZlID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFzdXBwcmVzc0V2ZW50cyAmJiB0aGlzLnZhcnNbY2FsbGJhY2tdKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2soY2FsbGJhY2spO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHAuZ2V0QWN0aXZlID0gZnVuY3Rpb24obmVzdGVkLCB0d2VlbnMsIHRpbWVsaW5lcykge1xuXHRcdFx0aWYgKG5lc3RlZCA9PSBudWxsKSB7XG5cdFx0XHRcdG5lc3RlZCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAodHdlZW5zID09IG51bGwpIHtcblx0XHRcdFx0dHdlZW5zID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmICh0aW1lbGluZXMgPT0gbnVsbCkge1xuXHRcdFx0XHR0aW1lbGluZXMgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHZhciBhID0gW10sXG5cdFx0XHRcdGFsbCA9IHRoaXMuZ2V0Q2hpbGRyZW4obmVzdGVkLCB0d2VlbnMsIHRpbWVsaW5lcyksXG5cdFx0XHRcdGNudCA9IDAsXG5cdFx0XHRcdGwgPSBhbGwubGVuZ3RoLFxuXHRcdFx0XHRpLCB0d2Vlbjtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0dHdlZW4gPSBhbGxbaV07XG5cdFx0XHRcdGlmICh0d2Vlbi5pc0FjdGl2ZSgpKSB7XG5cdFx0XHRcdFx0YVtjbnQrK10gPSB0d2Vlbjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGE7XG5cdFx0fTtcblxuXG5cdFx0cC5nZXRMYWJlbEFmdGVyID0gZnVuY3Rpb24odGltZSkge1xuXHRcdFx0aWYgKCF0aW1lKSBpZiAodGltZSAhPT0gMCkgeyAvL2Zhc3RlciB0aGFuIGlzTmFuKClcblx0XHRcdFx0dGltZSA9IHRoaXMuX3RpbWU7XG5cdFx0XHR9XG5cdFx0XHR2YXIgbGFiZWxzID0gdGhpcy5nZXRMYWJlbHNBcnJheSgpLFxuXHRcdFx0XHRsID0gbGFiZWxzLmxlbmd0aCxcblx0XHRcdFx0aTtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0aWYgKGxhYmVsc1tpXS50aW1lID4gdGltZSkge1xuXHRcdFx0XHRcdHJldHVybiBsYWJlbHNbaV0ubmFtZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fTtcblxuXHRcdHAuZ2V0TGFiZWxCZWZvcmUgPSBmdW5jdGlvbih0aW1lKSB7XG5cdFx0XHRpZiAodGltZSA9PSBudWxsKSB7XG5cdFx0XHRcdHRpbWUgPSB0aGlzLl90aW1lO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGxhYmVscyA9IHRoaXMuZ2V0TGFiZWxzQXJyYXkoKSxcblx0XHRcdFx0aSA9IGxhYmVscy5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0aWYgKGxhYmVsc1tpXS50aW1lIDwgdGltZSkge1xuXHRcdFx0XHRcdHJldHVybiBsYWJlbHNbaV0ubmFtZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fTtcblxuXHRcdHAuZ2V0TGFiZWxzQXJyYXkgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBhID0gW10sXG5cdFx0XHRcdGNudCA9IDAsXG5cdFx0XHRcdHA7XG5cdFx0XHRmb3IgKHAgaW4gdGhpcy5fbGFiZWxzKSB7XG5cdFx0XHRcdGFbY250KytdID0ge3RpbWU6dGhpcy5fbGFiZWxzW3BdLCBuYW1lOnB9O1xuXHRcdFx0fVxuXHRcdFx0YS5zb3J0KGZ1bmN0aW9uKGEsYikge1xuXHRcdFx0XHRyZXR1cm4gYS50aW1lIC0gYi50aW1lO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gYTtcblx0XHR9O1xuXG5cbi8vLS0tLSBHRVRURVJTIC8gU0VUVEVSUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0XHRwLnByb2dyZXNzID0gZnVuY3Rpb24odmFsdWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gKCFhcmd1bWVudHMubGVuZ3RoKSA/IHRoaXMuX3RpbWUgLyB0aGlzLmR1cmF0aW9uKCkgOiB0aGlzLnRvdGFsVGltZSggdGhpcy5kdXJhdGlvbigpICogKCh0aGlzLl95b3lvICYmICh0aGlzLl9jeWNsZSAmIDEpICE9PSAwKSA/IDEgLSB2YWx1ZSA6IHZhbHVlKSArICh0aGlzLl9jeWNsZSAqICh0aGlzLl9kdXJhdGlvbiArIHRoaXMuX3JlcGVhdERlbGF5KSksIHN1cHByZXNzRXZlbnRzKTtcblx0XHR9O1xuXG5cdFx0cC50b3RhbFByb2dyZXNzID0gZnVuY3Rpb24odmFsdWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gKCFhcmd1bWVudHMubGVuZ3RoKSA/IHRoaXMuX3RvdGFsVGltZSAvIHRoaXMudG90YWxEdXJhdGlvbigpIDogdGhpcy50b3RhbFRpbWUoIHRoaXMudG90YWxEdXJhdGlvbigpICogdmFsdWUsIHN1cHByZXNzRXZlbnRzKTtcblx0XHR9O1xuXG5cdFx0cC50b3RhbER1cmF0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRpZiAodGhpcy5fZGlydHkpIHtcblx0XHRcdFx0XHRUaW1lbGluZUxpdGUucHJvdG90eXBlLnRvdGFsRHVyYXRpb24uY2FsbCh0aGlzKTsgLy9qdXN0IGZvcmNlcyByZWZyZXNoXG5cdFx0XHRcdFx0Ly9JbnN0ZWFkIG9mIEluZmluaXR5LCB3ZSB1c2UgOTk5OTk5OTk5OTk5IHNvIHRoYXQgd2UgY2FuIGFjY29tbW9kYXRlIHJldmVyc2VzLlxuXHRcdFx0XHRcdHRoaXMuX3RvdGFsRHVyYXRpb24gPSAodGhpcy5fcmVwZWF0ID09PSAtMSkgPyA5OTk5OTk5OTk5OTkgOiB0aGlzLl9kdXJhdGlvbiAqICh0aGlzLl9yZXBlYXQgKyAxKSArICh0aGlzLl9yZXBlYXREZWxheSAqIHRoaXMuX3JlcGVhdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMuX3RvdGFsRHVyYXRpb247XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKHRoaXMuX3JlcGVhdCA9PT0gLTEpID8gdGhpcyA6IHRoaXMuZHVyYXRpb24oICh2YWx1ZSAtICh0aGlzLl9yZXBlYXQgKiB0aGlzLl9yZXBlYXREZWxheSkpIC8gKHRoaXMuX3JlcGVhdCArIDEpICk7XG5cdFx0fTtcblxuXHRcdHAudGltZSA9IGZ1bmN0aW9uKHZhbHVlLCBzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl90aW1lO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuX2RpcnR5KSB7XG5cdFx0XHRcdHRoaXMudG90YWxEdXJhdGlvbigpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHZhbHVlID4gdGhpcy5fZHVyYXRpb24pIHtcblx0XHRcdFx0dmFsdWUgPSB0aGlzLl9kdXJhdGlvbjtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl95b3lvICYmICh0aGlzLl9jeWNsZSAmIDEpICE9PSAwKSB7XG5cdFx0XHRcdHZhbHVlID0gKHRoaXMuX2R1cmF0aW9uIC0gdmFsdWUpICsgKHRoaXMuX2N5Y2xlICogKHRoaXMuX2R1cmF0aW9uICsgdGhpcy5fcmVwZWF0RGVsYXkpKTtcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5fcmVwZWF0ICE9PSAwKSB7XG5cdFx0XHRcdHZhbHVlICs9IHRoaXMuX2N5Y2xlICogKHRoaXMuX2R1cmF0aW9uICsgdGhpcy5fcmVwZWF0RGVsYXkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMudG90YWxUaW1lKHZhbHVlLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0fTtcblxuXHRcdHAucmVwZWF0ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fcmVwZWF0O1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fcmVwZWF0ID0gdmFsdWU7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdW5jYWNoZSh0cnVlKTtcblx0XHR9O1xuXG5cdFx0cC5yZXBlYXREZWxheSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3JlcGVhdERlbGF5O1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fcmVwZWF0RGVsYXkgPSB2YWx1ZTtcblx0XHRcdHJldHVybiB0aGlzLl91bmNhY2hlKHRydWUpO1xuXHRcdH07XG5cblx0XHRwLnlveW8gPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl95b3lvO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5feW95byA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuY3VycmVudExhYmVsID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5nZXRMYWJlbEJlZm9yZSh0aGlzLl90aW1lICsgMC4wMDAwMDAwMSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5zZWVrKHZhbHVlLCB0cnVlKTtcblx0XHR9O1xuXG5cdFx0cmV0dXJuIFRpbWVsaW5lTWF4O1xuXG5cdH0sIHRydWUpO1xuXHRcblxuXG5cblxuXHRcblx0XG5cdFxuXHRcblx0XG5cdFxuXHRcbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCZXppZXJQbHVnaW5cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXHQoZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgX1JBRDJERUcgPSAxODAgLyBNYXRoLlBJLFxuXHRcdFx0X3IxID0gW10sXG5cdFx0XHRfcjIgPSBbXSxcblx0XHRcdF9yMyA9IFtdLFxuXHRcdFx0X2NvclByb3BzID0ge30sXG5cdFx0XHRfZ2xvYmFscyA9IF9nc1Njb3BlLl9nc0RlZmluZS5nbG9iYWxzLFxuXHRcdFx0U2VnbWVudCA9IGZ1bmN0aW9uKGEsIGIsIGMsIGQpIHtcblx0XHRcdFx0dGhpcy5hID0gYTtcblx0XHRcdFx0dGhpcy5iID0gYjtcblx0XHRcdFx0dGhpcy5jID0gYztcblx0XHRcdFx0dGhpcy5kID0gZDtcblx0XHRcdFx0dGhpcy5kYSA9IGQgLSBhO1xuXHRcdFx0XHR0aGlzLmNhID0gYyAtIGE7XG5cdFx0XHRcdHRoaXMuYmEgPSBiIC0gYTtcblx0XHRcdH0sXG5cdFx0XHRfY29ycmVsYXRlID0gXCIseCx5LHosbGVmdCx0b3AscmlnaHQsYm90dG9tLG1hcmdpblRvcCxtYXJnaW5MZWZ0LG1hcmdpblJpZ2h0LG1hcmdpbkJvdHRvbSxwYWRkaW5nTGVmdCxwYWRkaW5nVG9wLHBhZGRpbmdSaWdodCxwYWRkaW5nQm90dG9tLGJhY2tncm91bmRQb3NpdGlvbixiYWNrZ3JvdW5kUG9zaXRpb25feSxcIixcblx0XHRcdGN1YmljVG9RdWFkcmF0aWMgPSBmdW5jdGlvbihhLCBiLCBjLCBkKSB7XG5cdFx0XHRcdHZhciBxMSA9IHthOmF9LFxuXHRcdFx0XHRcdHEyID0ge30sXG5cdFx0XHRcdFx0cTMgPSB7fSxcblx0XHRcdFx0XHRxNCA9IHtjOmR9LFxuXHRcdFx0XHRcdG1hYiA9IChhICsgYikgLyAyLFxuXHRcdFx0XHRcdG1iYyA9IChiICsgYykgLyAyLFxuXHRcdFx0XHRcdG1jZCA9IChjICsgZCkgLyAyLFxuXHRcdFx0XHRcdG1hYmMgPSAobWFiICsgbWJjKSAvIDIsXG5cdFx0XHRcdFx0bWJjZCA9IChtYmMgKyBtY2QpIC8gMixcblx0XHRcdFx0XHRtOCA9IChtYmNkIC0gbWFiYykgLyA4O1xuXHRcdFx0XHRxMS5iID0gbWFiICsgKGEgLSBtYWIpIC8gNDtcblx0XHRcdFx0cTIuYiA9IG1hYmMgKyBtODtcblx0XHRcdFx0cTEuYyA9IHEyLmEgPSAocTEuYiArIHEyLmIpIC8gMjtcblx0XHRcdFx0cTIuYyA9IHEzLmEgPSAobWFiYyArIG1iY2QpIC8gMjtcblx0XHRcdFx0cTMuYiA9IG1iY2QgLSBtODtcblx0XHRcdFx0cTQuYiA9IG1jZCArIChkIC0gbWNkKSAvIDQ7XG5cdFx0XHRcdHEzLmMgPSBxNC5hID0gKHEzLmIgKyBxNC5iKSAvIDI7XG5cdFx0XHRcdHJldHVybiBbcTEsIHEyLCBxMywgcTRdO1xuXHRcdFx0fSxcblx0XHRcdF9jYWxjdWxhdGVDb250cm9sUG9pbnRzID0gZnVuY3Rpb24oYSwgY3VydmluZXNzLCBxdWFkLCBiYXNpYywgY29ycmVsYXRlKSB7XG5cdFx0XHRcdHZhciBsID0gYS5sZW5ndGggLSAxLFxuXHRcdFx0XHRcdGlpID0gMCxcblx0XHRcdFx0XHRjcDEgPSBhWzBdLmEsXG5cdFx0XHRcdFx0aSwgcDEsIHAyLCBwMywgc2VnLCBtMSwgbTIsIG1tLCBjcDIsIHFiLCByMSwgcjIsIHRsO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0c2VnID0gYVtpaV07XG5cdFx0XHRcdFx0cDEgPSBzZWcuYTtcblx0XHRcdFx0XHRwMiA9IHNlZy5kO1xuXHRcdFx0XHRcdHAzID0gYVtpaSsxXS5kO1xuXG5cdFx0XHRcdFx0aWYgKGNvcnJlbGF0ZSkge1xuXHRcdFx0XHRcdFx0cjEgPSBfcjFbaV07XG5cdFx0XHRcdFx0XHRyMiA9IF9yMltpXTtcblx0XHRcdFx0XHRcdHRsID0gKChyMiArIHIxKSAqIGN1cnZpbmVzcyAqIDAuMjUpIC8gKGJhc2ljID8gMC41IDogX3IzW2ldIHx8IDAuNSk7XG5cdFx0XHRcdFx0XHRtMSA9IHAyIC0gKHAyIC0gcDEpICogKGJhc2ljID8gY3VydmluZXNzICogMC41IDogKHIxICE9PSAwID8gdGwgLyByMSA6IDApKTtcblx0XHRcdFx0XHRcdG0yID0gcDIgKyAocDMgLSBwMikgKiAoYmFzaWMgPyBjdXJ2aW5lc3MgKiAwLjUgOiAocjIgIT09IDAgPyB0bCAvIHIyIDogMCkpO1xuXHRcdFx0XHRcdFx0bW0gPSBwMiAtIChtMSArICgoKG0yIC0gbTEpICogKChyMSAqIDMgLyAocjEgKyByMikpICsgMC41KSAvIDQpIHx8IDApKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bTEgPSBwMiAtIChwMiAtIHAxKSAqIGN1cnZpbmVzcyAqIDAuNTtcblx0XHRcdFx0XHRcdG0yID0gcDIgKyAocDMgLSBwMikgKiBjdXJ2aW5lc3MgKiAwLjU7XG5cdFx0XHRcdFx0XHRtbSA9IHAyIC0gKG0xICsgbTIpIC8gMjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bTEgKz0gbW07XG5cdFx0XHRcdFx0bTIgKz0gbW07XG5cblx0XHRcdFx0XHRzZWcuYyA9IGNwMiA9IG0xO1xuXHRcdFx0XHRcdGlmIChpICE9PSAwKSB7XG5cdFx0XHRcdFx0XHRzZWcuYiA9IGNwMTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c2VnLmIgPSBjcDEgPSBzZWcuYSArIChzZWcuYyAtIHNlZy5hKSAqIDAuNjsgLy9pbnN0ZWFkIG9mIHBsYWNpbmcgYiBvbiBhIGV4YWN0bHksIHdlIG1vdmUgaXQgaW5saW5lIHdpdGggYyBzbyB0aGF0IGlmIHRoZSB1c2VyIHNwZWNpZmllcyBhbiBlYXNlIGxpa2UgQmFjay5lYXNlSW4gb3IgRWxhc3RpYy5lYXNlSW4gd2hpY2ggZ29lcyBCRVlPTkQgdGhlIGJlZ2lubmluZywgaXQgd2lsbCBkbyBzbyBzbW9vdGhseS5cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRzZWcuZGEgPSBwMiAtIHAxO1xuXHRcdFx0XHRcdHNlZy5jYSA9IGNwMiAtIHAxO1xuXHRcdFx0XHRcdHNlZy5iYSA9IGNwMSAtIHAxO1xuXG5cdFx0XHRcdFx0aWYgKHF1YWQpIHtcblx0XHRcdFx0XHRcdHFiID0gY3ViaWNUb1F1YWRyYXRpYyhwMSwgY3AxLCBjcDIsIHAyKTtcblx0XHRcdFx0XHRcdGEuc3BsaWNlKGlpLCAxLCBxYlswXSwgcWJbMV0sIHFiWzJdLCBxYlszXSk7XG5cdFx0XHRcdFx0XHRpaSArPSA0O1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpaSsrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNwMSA9IG0yO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNlZyA9IGFbaWldO1xuXHRcdFx0XHRzZWcuYiA9IGNwMTtcblx0XHRcdFx0c2VnLmMgPSBjcDEgKyAoc2VnLmQgLSBjcDEpICogMC40OyAvL2luc3RlYWQgb2YgcGxhY2luZyBjIG9uIGQgZXhhY3RseSwgd2UgbW92ZSBpdCBpbmxpbmUgd2l0aCBiIHNvIHRoYXQgaWYgdGhlIHVzZXIgc3BlY2lmaWVzIGFuIGVhc2UgbGlrZSBCYWNrLmVhc2VPdXQgb3IgRWxhc3RpYy5lYXNlT3V0IHdoaWNoIGdvZXMgQkVZT05EIHRoZSBlbmQsIGl0IHdpbGwgZG8gc28gc21vb3RobHkuXG5cdFx0XHRcdHNlZy5kYSA9IHNlZy5kIC0gc2VnLmE7XG5cdFx0XHRcdHNlZy5jYSA9IHNlZy5jIC0gc2VnLmE7XG5cdFx0XHRcdHNlZy5iYSA9IGNwMSAtIHNlZy5hO1xuXHRcdFx0XHRpZiAocXVhZCkge1xuXHRcdFx0XHRcdHFiID0gY3ViaWNUb1F1YWRyYXRpYyhzZWcuYSwgY3AxLCBzZWcuYywgc2VnLmQpO1xuXHRcdFx0XHRcdGEuc3BsaWNlKGlpLCAxLCBxYlswXSwgcWJbMV0sIHFiWzJdLCBxYlszXSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHRfcGFyc2VBbmNob3JzID0gZnVuY3Rpb24odmFsdWVzLCBwLCBjb3JyZWxhdGUsIHByZXBlbmQpIHtcblx0XHRcdFx0dmFyIGEgPSBbXSxcblx0XHRcdFx0XHRsLCBpLCBwMSwgcDIsIHAzLCB0bXA7XG5cdFx0XHRcdGlmIChwcmVwZW5kKSB7XG5cdFx0XHRcdFx0dmFsdWVzID0gW3ByZXBlbmRdLmNvbmNhdCh2YWx1ZXMpO1xuXHRcdFx0XHRcdGkgPSB2YWx1ZXMubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiggKHRtcCA9IHZhbHVlc1tpXVtwXSkgKSA9PT0gXCJzdHJpbmdcIikgaWYgKHRtcC5jaGFyQXQoMSkgPT09IFwiPVwiKSB7XG5cdFx0XHRcdFx0XHRcdHZhbHVlc1tpXVtwXSA9IHByZXBlbmRbcF0gKyBOdW1iZXIodG1wLmNoYXJBdCgwKSArIHRtcC5zdWJzdHIoMikpOyAvL2FjY29tbW9kYXRlIHJlbGF0aXZlIHZhbHVlcy4gRG8gaXQgaW5saW5lIGluc3RlYWQgb2YgYnJlYWtpbmcgaXQgb3V0IGludG8gYSBmdW5jdGlvbiBmb3Igc3BlZWQgcmVhc29uc1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRsID0gdmFsdWVzLmxlbmd0aCAtIDI7XG5cdFx0XHRcdGlmIChsIDwgMCkge1xuXHRcdFx0XHRcdGFbMF0gPSBuZXcgU2VnbWVudCh2YWx1ZXNbMF1bcF0sIDAsIDAsIHZhbHVlc1sobCA8IC0xKSA/IDAgOiAxXVtwXSk7XG5cdFx0XHRcdFx0cmV0dXJuIGE7XG5cdFx0XHRcdH1cblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuXHRcdFx0XHRcdHAxID0gdmFsdWVzW2ldW3BdO1xuXHRcdFx0XHRcdHAyID0gdmFsdWVzW2krMV1bcF07XG5cdFx0XHRcdFx0YVtpXSA9IG5ldyBTZWdtZW50KHAxLCAwLCAwLCBwMik7XG5cdFx0XHRcdFx0aWYgKGNvcnJlbGF0ZSkge1xuXHRcdFx0XHRcdFx0cDMgPSB2YWx1ZXNbaSsyXVtwXTtcblx0XHRcdFx0XHRcdF9yMVtpXSA9IChfcjFbaV0gfHwgMCkgKyAocDIgLSBwMSkgKiAocDIgLSBwMSk7XG5cdFx0XHRcdFx0XHRfcjJbaV0gPSAoX3IyW2ldIHx8IDApICsgKHAzIC0gcDIpICogKHAzIC0gcDIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRhW2ldID0gbmV3IFNlZ21lbnQodmFsdWVzW2ldW3BdLCAwLCAwLCB2YWx1ZXNbaSsxXVtwXSk7XG5cdFx0XHRcdHJldHVybiBhO1xuXHRcdFx0fSxcblx0XHRcdGJlemllclRocm91Z2ggPSBmdW5jdGlvbih2YWx1ZXMsIGN1cnZpbmVzcywgcXVhZHJhdGljLCBiYXNpYywgY29ycmVsYXRlLCBwcmVwZW5kKSB7XG5cdFx0XHRcdHZhciBvYmogPSB7fSxcblx0XHRcdFx0XHRwcm9wcyA9IFtdLFxuXHRcdFx0XHRcdGZpcnN0ID0gcHJlcGVuZCB8fCB2YWx1ZXNbMF0sXG5cdFx0XHRcdFx0aSwgcCwgYSwgaiwgciwgbCwgc2VhbWxlc3MsIGxhc3Q7XG5cdFx0XHRcdGNvcnJlbGF0ZSA9ICh0eXBlb2YoY29ycmVsYXRlKSA9PT0gXCJzdHJpbmdcIikgPyBcIixcIitjb3JyZWxhdGUrXCIsXCIgOiBfY29ycmVsYXRlO1xuXHRcdFx0XHRpZiAoY3VydmluZXNzID09IG51bGwpIHtcblx0XHRcdFx0XHRjdXJ2aW5lc3MgPSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGZvciAocCBpbiB2YWx1ZXNbMF0pIHtcblx0XHRcdFx0XHRwcm9wcy5wdXNoKHApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vY2hlY2sgdG8gc2VlIGlmIHRoZSBsYXN0IGFuZCBmaXJzdCB2YWx1ZXMgYXJlIGlkZW50aWNhbCAod2VsbCwgd2l0aGluIDAuMDUpLiBJZiBzbywgbWFrZSBzZWFtbGVzcyBieSBhcHBlbmRpbmcgdGhlIHNlY29uZCBlbGVtZW50IHRvIHRoZSB2ZXJ5IGVuZCBvZiB0aGUgdmFsdWVzIGFycmF5IGFuZCB0aGUgMm5kLXRvLWxhc3QgZWxlbWVudCB0byB0aGUgdmVyeSBiZWdpbm5pbmcgKHdlJ2xsIHJlbW92ZSB0aG9zZSBzZWdtZW50cyBsYXRlcilcblx0XHRcdFx0aWYgKHZhbHVlcy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdFx0bGFzdCA9IHZhbHVlc1t2YWx1ZXMubGVuZ3RoIC0gMV07XG5cdFx0XHRcdFx0c2VhbWxlc3MgPSB0cnVlO1xuXHRcdFx0XHRcdGkgPSBwcm9wcy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRwID0gcHJvcHNbaV07XG5cdFx0XHRcdFx0XHRpZiAoTWF0aC5hYnMoZmlyc3RbcF0gLSBsYXN0W3BdKSA+IDAuMDUpIHsgLy9idWlsZCBpbiBhIHRvbGVyYW5jZSBvZiArLy0wLjA1IHRvIGFjY29tbW9kYXRlIHJvdW5kaW5nIGVycm9ycy4gRm9yIGV4YW1wbGUsIGlmIHlvdSBzZXQgYW4gb2JqZWN0J3MgcG9zaXRpb24gdG8gNC45NDUsIEZsYXNoIHdpbGwgbWFrZSBpdCA0Ljlcblx0XHRcdFx0XHRcdFx0c2VhbWxlc3MgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChzZWFtbGVzcykge1xuXHRcdFx0XHRcdFx0dmFsdWVzID0gdmFsdWVzLmNvbmNhdCgpOyAvL2R1cGxpY2F0ZSB0aGUgYXJyYXkgdG8gYXZvaWQgY29udGFtaW5hdGluZyB0aGUgb3JpZ2luYWwgd2hpY2ggdGhlIHVzZXIgbWF5IGJlIHJldXNpbmcgZm9yIG90aGVyIHR3ZWVuc1xuXHRcdFx0XHRcdFx0aWYgKHByZXBlbmQpIHtcblx0XHRcdFx0XHRcdFx0dmFsdWVzLnVuc2hpZnQocHJlcGVuZCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR2YWx1ZXMucHVzaCh2YWx1ZXNbMV0pO1xuXHRcdFx0XHRcdFx0cHJlcGVuZCA9IHZhbHVlc1t2YWx1ZXMubGVuZ3RoIC0gM107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdF9yMS5sZW5ndGggPSBfcjIubGVuZ3RoID0gX3IzLmxlbmd0aCA9IDA7XG5cdFx0XHRcdGkgPSBwcm9wcy5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdHAgPSBwcm9wc1tpXTtcblx0XHRcdFx0XHRfY29yUHJvcHNbcF0gPSAoY29ycmVsYXRlLmluZGV4T2YoXCIsXCIrcCtcIixcIikgIT09IC0xKTtcblx0XHRcdFx0XHRvYmpbcF0gPSBfcGFyc2VBbmNob3JzKHZhbHVlcywgcCwgX2NvclByb3BzW3BdLCBwcmVwZW5kKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpID0gX3IxLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0X3IxW2ldID0gTWF0aC5zcXJ0KF9yMVtpXSk7XG5cdFx0XHRcdFx0X3IyW2ldID0gTWF0aC5zcXJ0KF9yMltpXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFiYXNpYykge1xuXHRcdFx0XHRcdGkgPSBwcm9wcy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRpZiAoX2NvclByb3BzW3BdKSB7XG5cdFx0XHRcdFx0XHRcdGEgPSBvYmpbcHJvcHNbaV1dO1xuXHRcdFx0XHRcdFx0XHRsID0gYS5sZW5ndGggLSAxO1xuXHRcdFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbDsgaisrKSB7XG5cdFx0XHRcdFx0XHRcdFx0ciA9IGFbaisxXS5kYSAvIF9yMltqXSArIGFbal0uZGEgLyBfcjFbal07XG5cdFx0XHRcdFx0XHRcdFx0X3IzW2pdID0gKF9yM1tqXSB8fCAwKSArIHIgKiByO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGkgPSBfcjMubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0X3IzW2ldID0gTWF0aC5zcXJ0KF9yM1tpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGkgPSBwcm9wcy5sZW5ndGg7XG5cdFx0XHRcdGogPSBxdWFkcmF0aWMgPyA0IDogMTtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0cCA9IHByb3BzW2ldO1xuXHRcdFx0XHRcdGEgPSBvYmpbcF07XG5cdFx0XHRcdFx0X2NhbGN1bGF0ZUNvbnRyb2xQb2ludHMoYSwgY3VydmluZXNzLCBxdWFkcmF0aWMsIGJhc2ljLCBfY29yUHJvcHNbcF0pOyAvL3RoaXMgbWV0aG9kIHJlcXVpcmVzIHRoYXQgX3BhcnNlQW5jaG9ycygpIGFuZCBfc2V0U2VnbWVudFJhdGlvcygpIHJhbiBmaXJzdCBzbyB0aGF0IF9yMSwgX3IyLCBhbmQgX3IzIHZhbHVlcyBhcmUgcG9wdWxhdGVkIGZvciBhbGwgcHJvcGVydGllc1xuXHRcdFx0XHRcdGlmIChzZWFtbGVzcykge1xuXHRcdFx0XHRcdFx0YS5zcGxpY2UoMCwgaik7XG5cdFx0XHRcdFx0XHRhLnNwbGljZShhLmxlbmd0aCAtIGosIGopO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gb2JqO1xuXHRcdFx0fSxcblx0XHRcdF9wYXJzZUJlemllckRhdGEgPSBmdW5jdGlvbih2YWx1ZXMsIHR5cGUsIHByZXBlbmQpIHtcblx0XHRcdFx0dHlwZSA9IHR5cGUgfHwgXCJzb2Z0XCI7XG5cdFx0XHRcdHZhciBvYmogPSB7fSxcblx0XHRcdFx0XHRpbmMgPSAodHlwZSA9PT0gXCJjdWJpY1wiKSA/IDMgOiAyLFxuXHRcdFx0XHRcdHNvZnQgPSAodHlwZSA9PT0gXCJzb2Z0XCIpLFxuXHRcdFx0XHRcdHByb3BzID0gW10sXG5cdFx0XHRcdFx0YSwgYiwgYywgZCwgY3VyLCBpLCBqLCBsLCBwLCBjbnQsIHRtcDtcblx0XHRcdFx0aWYgKHNvZnQgJiYgcHJlcGVuZCkge1xuXHRcdFx0XHRcdHZhbHVlcyA9IFtwcmVwZW5kXS5jb25jYXQodmFsdWVzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodmFsdWVzID09IG51bGwgfHwgdmFsdWVzLmxlbmd0aCA8IGluYyArIDEpIHsgdGhyb3cgXCJpbnZhbGlkIEJlemllciBkYXRhXCI7IH1cblx0XHRcdFx0Zm9yIChwIGluIHZhbHVlc1swXSkge1xuXHRcdFx0XHRcdHByb3BzLnB1c2gocCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aSA9IHByb3BzLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0cCA9IHByb3BzW2ldO1xuXHRcdFx0XHRcdG9ialtwXSA9IGN1ciA9IFtdO1xuXHRcdFx0XHRcdGNudCA9IDA7XG5cdFx0XHRcdFx0bCA9IHZhbHVlcy5sZW5ndGg7XG5cdFx0XHRcdFx0Zm9yIChqID0gMDsgaiA8IGw7IGorKykge1xuXHRcdFx0XHRcdFx0YSA9IChwcmVwZW5kID09IG51bGwpID8gdmFsdWVzW2pdW3BdIDogKHR5cGVvZiggKHRtcCA9IHZhbHVlc1tqXVtwXSkgKSA9PT0gXCJzdHJpbmdcIiAmJiB0bXAuY2hhckF0KDEpID09PSBcIj1cIikgPyBwcmVwZW5kW3BdICsgTnVtYmVyKHRtcC5jaGFyQXQoMCkgKyB0bXAuc3Vic3RyKDIpKSA6IE51bWJlcih0bXApO1xuXHRcdFx0XHRcdFx0aWYgKHNvZnQpIGlmIChqID4gMSkgaWYgKGogPCBsIC0gMSkge1xuXHRcdFx0XHRcdFx0XHRjdXJbY250KytdID0gKGEgKyBjdXJbY250LTJdKSAvIDI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjdXJbY250KytdID0gYTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bCA9IGNudCAtIGluYyArIDE7XG5cdFx0XHRcdFx0Y250ID0gMDtcblx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgbDsgaiArPSBpbmMpIHtcblx0XHRcdFx0XHRcdGEgPSBjdXJbal07XG5cdFx0XHRcdFx0XHRiID0gY3VyW2orMV07XG5cdFx0XHRcdFx0XHRjID0gY3VyW2orMl07XG5cdFx0XHRcdFx0XHRkID0gKGluYyA9PT0gMikgPyAwIDogY3VyW2orM107XG5cdFx0XHRcdFx0XHRjdXJbY250KytdID0gdG1wID0gKGluYyA9PT0gMykgPyBuZXcgU2VnbWVudChhLCBiLCBjLCBkKSA6IG5ldyBTZWdtZW50KGEsICgyICogYiArIGEpIC8gMywgKDIgKiBiICsgYykgLyAzLCBjKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y3VyLmxlbmd0aCA9IGNudDtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gb2JqO1xuXHRcdFx0fSxcblx0XHRcdF9hZGRDdWJpY0xlbmd0aHMgPSBmdW5jdGlvbihhLCBzdGVwcywgcmVzb2x1dGlvbikge1xuXHRcdFx0XHR2YXIgaW5jID0gMSAvIHJlc29sdXRpb24sXG5cdFx0XHRcdFx0aiA9IGEubGVuZ3RoLFxuXHRcdFx0XHRcdGQsIGQxLCBzLCBkYSwgY2EsIGJhLCBwLCBpLCBpbnYsIGJleiwgaW5kZXg7XG5cdFx0XHRcdHdoaWxlICgtLWogPiAtMSkge1xuXHRcdFx0XHRcdGJleiA9IGFbal07XG5cdFx0XHRcdFx0cyA9IGJlei5hO1xuXHRcdFx0XHRcdGRhID0gYmV6LmQgLSBzO1xuXHRcdFx0XHRcdGNhID0gYmV6LmMgLSBzO1xuXHRcdFx0XHRcdGJhID0gYmV6LmIgLSBzO1xuXHRcdFx0XHRcdGQgPSBkMSA9IDA7XG5cdFx0XHRcdFx0Zm9yIChpID0gMTsgaSA8PSByZXNvbHV0aW9uOyBpKyspIHtcblx0XHRcdFx0XHRcdHAgPSBpbmMgKiBpO1xuXHRcdFx0XHRcdFx0aW52ID0gMSAtIHA7XG5cdFx0XHRcdFx0XHRkID0gZDEgLSAoZDEgPSAocCAqIHAgKiBkYSArIDMgKiBpbnYgKiAocCAqIGNhICsgaW52ICogYmEpKSAqIHApO1xuXHRcdFx0XHRcdFx0aW5kZXggPSBqICogcmVzb2x1dGlvbiArIGkgLSAxO1xuXHRcdFx0XHRcdFx0c3RlcHNbaW5kZXhdID0gKHN0ZXBzW2luZGV4XSB8fCAwKSArIGQgKiBkO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdF9wYXJzZUxlbmd0aERhdGEgPSBmdW5jdGlvbihvYmosIHJlc29sdXRpb24pIHtcblx0XHRcdFx0cmVzb2x1dGlvbiA9IHJlc29sdXRpb24gPj4gMCB8fCA2O1xuXHRcdFx0XHR2YXIgYSA9IFtdLFxuXHRcdFx0XHRcdGxlbmd0aHMgPSBbXSxcblx0XHRcdFx0XHRkID0gMCxcblx0XHRcdFx0XHR0b3RhbCA9IDAsXG5cdFx0XHRcdFx0dGhyZXNob2xkID0gcmVzb2x1dGlvbiAtIDEsXG5cdFx0XHRcdFx0c2VnbWVudHMgPSBbXSxcblx0XHRcdFx0XHRjdXJMUyA9IFtdLCAvL2N1cnJlbnQgbGVuZ3RoIHNlZ21lbnRzIGFycmF5XG5cdFx0XHRcdFx0cCwgaSwgbCwgaW5kZXg7XG5cdFx0XHRcdGZvciAocCBpbiBvYmopIHtcblx0XHRcdFx0XHRfYWRkQ3ViaWNMZW5ndGhzKG9ialtwXSwgYSwgcmVzb2x1dGlvbik7XG5cdFx0XHRcdH1cblx0XHRcdFx0bCA9IGEubGVuZ3RoO1xuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG5cdFx0XHRcdFx0ZCArPSBNYXRoLnNxcnQoYVtpXSk7XG5cdFx0XHRcdFx0aW5kZXggPSBpICUgcmVzb2x1dGlvbjtcblx0XHRcdFx0XHRjdXJMU1tpbmRleF0gPSBkO1xuXHRcdFx0XHRcdGlmIChpbmRleCA9PT0gdGhyZXNob2xkKSB7XG5cdFx0XHRcdFx0XHR0b3RhbCArPSBkO1xuXHRcdFx0XHRcdFx0aW5kZXggPSAoaSAvIHJlc29sdXRpb24pID4+IDA7XG5cdFx0XHRcdFx0XHRzZWdtZW50c1tpbmRleF0gPSBjdXJMUztcblx0XHRcdFx0XHRcdGxlbmd0aHNbaW5kZXhdID0gdG90YWw7XG5cdFx0XHRcdFx0XHRkID0gMDtcblx0XHRcdFx0XHRcdGN1ckxTID0gW107XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB7bGVuZ3RoOnRvdGFsLCBsZW5ndGhzOmxlbmd0aHMsIHNlZ21lbnRzOnNlZ21lbnRzfTtcblx0XHRcdH0sXG5cblxuXG5cdFx0XHRCZXppZXJQbHVnaW4gPSBfZ3NTY29wZS5fZ3NEZWZpbmUucGx1Z2luKHtcblx0XHRcdFx0XHRwcm9wTmFtZTogXCJiZXppZXJcIixcblx0XHRcdFx0XHRwcmlvcml0eTogLTEsXG5cdFx0XHRcdFx0dmVyc2lvbjogXCIxLjMuNFwiLFxuXHRcdFx0XHRcdEFQSTogMixcblx0XHRcdFx0XHRnbG9iYWw6dHJ1ZSxcblxuXHRcdFx0XHRcdC8vZ2V0cyBjYWxsZWQgd2hlbiB0aGUgdHdlZW4gcmVuZGVycyBmb3IgdGhlIGZpcnN0IHRpbWUuIFRoaXMgaXMgd2hlcmUgaW5pdGlhbCB2YWx1ZXMgc2hvdWxkIGJlIHJlY29yZGVkIGFuZCBhbnkgc2V0dXAgcm91dGluZXMgc2hvdWxkIHJ1bi5cblx0XHRcdFx0XHRpbml0OiBmdW5jdGlvbih0YXJnZXQsIHZhcnMsIHR3ZWVuKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl90YXJnZXQgPSB0YXJnZXQ7XG5cdFx0XHRcdFx0XHRpZiAodmFycyBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRcdFx0XHRcdHZhcnMgPSB7dmFsdWVzOnZhcnN9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGhpcy5fZnVuYyA9IHt9O1xuXHRcdFx0XHRcdFx0dGhpcy5fcm91bmQgPSB7fTtcblx0XHRcdFx0XHRcdHRoaXMuX3Byb3BzID0gW107XG5cdFx0XHRcdFx0XHR0aGlzLl90aW1lUmVzID0gKHZhcnMudGltZVJlc29sdXRpb24gPT0gbnVsbCkgPyA2IDogcGFyc2VJbnQodmFycy50aW1lUmVzb2x1dGlvbiwgMTApO1xuXHRcdFx0XHRcdFx0dmFyIHZhbHVlcyA9IHZhcnMudmFsdWVzIHx8IFtdLFxuXHRcdFx0XHRcdFx0XHRmaXJzdCA9IHt9LFxuXHRcdFx0XHRcdFx0XHRzZWNvbmQgPSB2YWx1ZXNbMF0sXG5cdFx0XHRcdFx0XHRcdGF1dG9Sb3RhdGUgPSB2YXJzLmF1dG9Sb3RhdGUgfHwgdHdlZW4udmFycy5vcmllbnRUb0Jlemllcixcblx0XHRcdFx0XHRcdFx0cCwgaXNGdW5jLCBpLCBqLCBwcmVwZW5kO1xuXG5cdFx0XHRcdFx0XHR0aGlzLl9hdXRvUm90YXRlID0gYXV0b1JvdGF0ZSA/IChhdXRvUm90YXRlIGluc3RhbmNlb2YgQXJyYXkpID8gYXV0b1JvdGF0ZSA6IFtbXCJ4XCIsXCJ5XCIsXCJyb3RhdGlvblwiLCgoYXV0b1JvdGF0ZSA9PT0gdHJ1ZSkgPyAwIDogTnVtYmVyKGF1dG9Sb3RhdGUpIHx8IDApXV0gOiBudWxsO1xuXHRcdFx0XHRcdFx0Zm9yIChwIGluIHNlY29uZCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9wcm9wcy5wdXNoKHApO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpID0gdGhpcy5fcHJvcHMubGVuZ3RoO1xuXHRcdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHAgPSB0aGlzLl9wcm9wc1tpXTtcblxuXHRcdFx0XHRcdFx0XHR0aGlzLl9vdmVyd3JpdGVQcm9wcy5wdXNoKHApO1xuXHRcdFx0XHRcdFx0XHRpc0Z1bmMgPSB0aGlzLl9mdW5jW3BdID0gKHR5cGVvZih0YXJnZXRbcF0pID09PSBcImZ1bmN0aW9uXCIpO1xuXHRcdFx0XHRcdFx0XHRmaXJzdFtwXSA9ICghaXNGdW5jKSA/IHBhcnNlRmxvYXQodGFyZ2V0W3BdKSA6IHRhcmdldFsgKChwLmluZGV4T2YoXCJzZXRcIikgfHwgdHlwZW9mKHRhcmdldFtcImdldFwiICsgcC5zdWJzdHIoMyldKSAhPT0gXCJmdW5jdGlvblwiKSA/IHAgOiBcImdldFwiICsgcC5zdWJzdHIoMykpIF0oKTtcblx0XHRcdFx0XHRcdFx0aWYgKCFwcmVwZW5kKSBpZiAoZmlyc3RbcF0gIT09IHZhbHVlc1swXVtwXSkge1xuXHRcdFx0XHRcdFx0XHRcdHByZXBlbmQgPSBmaXJzdDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGhpcy5fYmV6aWVycyA9ICh2YXJzLnR5cGUgIT09IFwiY3ViaWNcIiAmJiB2YXJzLnR5cGUgIT09IFwicXVhZHJhdGljXCIgJiYgdmFycy50eXBlICE9PSBcInNvZnRcIikgPyBiZXppZXJUaHJvdWdoKHZhbHVlcywgaXNOYU4odmFycy5jdXJ2aW5lc3MpID8gMSA6IHZhcnMuY3VydmluZXNzLCBmYWxzZSwgKHZhcnMudHlwZSA9PT0gXCJ0aHJ1QmFzaWNcIiksIHZhcnMuY29ycmVsYXRlLCBwcmVwZW5kKSA6IF9wYXJzZUJlemllckRhdGEodmFsdWVzLCB2YXJzLnR5cGUsIGZpcnN0KTtcblx0XHRcdFx0XHRcdHRoaXMuX3NlZ0NvdW50ID0gdGhpcy5fYmV6aWVyc1twXS5sZW5ndGg7XG5cblx0XHRcdFx0XHRcdGlmICh0aGlzLl90aW1lUmVzKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBsZCA9IF9wYXJzZUxlbmd0aERhdGEodGhpcy5fYmV6aWVycywgdGhpcy5fdGltZVJlcyk7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2xlbmd0aCA9IGxkLmxlbmd0aDtcblx0XHRcdFx0XHRcdFx0dGhpcy5fbGVuZ3RocyA9IGxkLmxlbmd0aHM7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3NlZ21lbnRzID0gbGQuc2VnbWVudHM7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2wxID0gdGhpcy5fbGkgPSB0aGlzLl9zMSA9IHRoaXMuX3NpID0gMDtcblx0XHRcdFx0XHRcdFx0dGhpcy5fbDIgPSB0aGlzLl9sZW5ndGhzWzBdO1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9jdXJTZWcgPSB0aGlzLl9zZWdtZW50c1swXTtcblx0XHRcdFx0XHRcdFx0dGhpcy5fczIgPSB0aGlzLl9jdXJTZWdbMF07XG5cdFx0XHRcdFx0XHRcdHRoaXMuX3ByZWMgPSAxIC8gdGhpcy5fY3VyU2VnLmxlbmd0aDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKChhdXRvUm90YXRlID0gdGhpcy5fYXV0b1JvdGF0ZSkpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5faW5pdGlhbFJvdGF0aW9ucyA9IFtdO1xuXHRcdFx0XHRcdFx0XHRpZiAoIShhdXRvUm90YXRlWzBdIGluc3RhbmNlb2YgQXJyYXkpKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fYXV0b1JvdGF0ZSA9IGF1dG9Sb3RhdGUgPSBbYXV0b1JvdGF0ZV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0aSA9IGF1dG9Sb3RhdGUubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGogPSAwOyBqIDwgMzsgaisrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRwID0gYXV0b1JvdGF0ZVtpXVtqXTtcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2Z1bmNbcF0gPSAodHlwZW9mKHRhcmdldFtwXSkgPT09IFwiZnVuY3Rpb25cIikgPyB0YXJnZXRbICgocC5pbmRleE9mKFwic2V0XCIpIHx8IHR5cGVvZih0YXJnZXRbXCJnZXRcIiArIHAuc3Vic3RyKDMpXSkgIT09IFwiZnVuY3Rpb25cIikgPyBwIDogXCJnZXRcIiArIHAuc3Vic3RyKDMpKSBdIDogZmFsc2U7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHAgPSBhdXRvUm90YXRlW2ldWzJdO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2luaXRpYWxSb3RhdGlvbnNbaV0gPSB0aGlzLl9mdW5jW3BdID8gdGhpcy5fZnVuY1twXS5jYWxsKHRoaXMuX3RhcmdldCkgOiB0aGlzLl90YXJnZXRbcF07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMuX3N0YXJ0UmF0aW8gPSB0d2Vlbi52YXJzLnJ1bkJhY2t3YXJkcyA/IDEgOiAwOyAvL3dlIGRldGVybWluZSB0aGUgc3RhcnRpbmcgcmF0aW8gd2hlbiB0aGUgdHdlZW4gaW5pdHMgd2hpY2ggaXMgYWx3YXlzIDAgdW5sZXNzIHRoZSB0d2VlbiBoYXMgcnVuQmFja3dhcmRzOnRydWUgKGluZGljYXRpbmcgaXQncyBhIGZyb20oKSB0d2VlbikgaW4gd2hpY2ggY2FzZSBpdCdzIDEuXG5cdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0Ly9jYWxsZWQgZWFjaCB0aW1lIHRoZSB2YWx1ZXMgc2hvdWxkIGJlIHVwZGF0ZWQsIGFuZCB0aGUgcmF0aW8gZ2V0cyBwYXNzZWQgYXMgdGhlIG9ubHkgcGFyYW1ldGVyICh0eXBpY2FsbHkgaXQncyBhIHZhbHVlIGJldHdlZW4gMCBhbmQgMSwgYnV0IGl0IGNhbiBleGNlZWQgdGhvc2Ugd2hlbiB1c2luZyBhbiBlYXNlIGxpa2UgRWxhc3RpYy5lYXNlT3V0IG9yIEJhY2suZWFzZU91dCwgZXRjLilcblx0XHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0XHRcdHZhciBzZWdtZW50cyA9IHRoaXMuX3NlZ0NvdW50LFxuXHRcdFx0XHRcdFx0XHRmdW5jID0gdGhpcy5fZnVuYyxcblx0XHRcdFx0XHRcdFx0dGFyZ2V0ID0gdGhpcy5fdGFyZ2V0LFxuXHRcdFx0XHRcdFx0XHRub3RTdGFydCA9ICh2ICE9PSB0aGlzLl9zdGFydFJhdGlvKSxcblx0XHRcdFx0XHRcdFx0Y3VySW5kZXgsIGludiwgaSwgcCwgYiwgdCwgdmFsLCBsLCBsZW5ndGhzLCBjdXJTZWc7XG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuX3RpbWVSZXMpIHtcblx0XHRcdFx0XHRcdFx0Y3VySW5kZXggPSAodiA8IDApID8gMCA6ICh2ID49IDEpID8gc2VnbWVudHMgLSAxIDogKHNlZ21lbnRzICogdikgPj4gMDtcblx0XHRcdFx0XHRcdFx0dCA9ICh2IC0gKGN1ckluZGV4ICogKDEgLyBzZWdtZW50cykpKSAqIHNlZ21lbnRzO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0bGVuZ3RocyA9IHRoaXMuX2xlbmd0aHM7XG5cdFx0XHRcdFx0XHRcdGN1clNlZyA9IHRoaXMuX2N1clNlZztcblx0XHRcdFx0XHRcdFx0diAqPSB0aGlzLl9sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdGkgPSB0aGlzLl9saTtcblx0XHRcdFx0XHRcdFx0Ly9maW5kIHRoZSBhcHByb3ByaWF0ZSBzZWdtZW50IChpZiB0aGUgY3VycmVudGx5IGNhY2hlZCBvbmUgaXNuJ3QgY29ycmVjdClcblx0XHRcdFx0XHRcdFx0aWYgKHYgPiB0aGlzLl9sMiAmJiBpIDwgc2VnbWVudHMgLSAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0bCA9IHNlZ21lbnRzIC0gMTtcblx0XHRcdFx0XHRcdFx0XHR3aGlsZSAoaSA8IGwgJiYgKHRoaXMuX2wyID0gbGVuZ3Roc1srK2ldKSA8PSB2KSB7XHR9XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fbDEgPSBsZW5ndGhzW2ktMV07XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fbGkgPSBpO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2N1clNlZyA9IGN1clNlZyA9IHRoaXMuX3NlZ21lbnRzW2ldO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3MyID0gY3VyU2VnWyh0aGlzLl9zMSA9IHRoaXMuX3NpID0gMCldO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHYgPCB0aGlzLl9sMSAmJiBpID4gMCkge1xuXHRcdFx0XHRcdFx0XHRcdHdoaWxlIChpID4gMCAmJiAodGhpcy5fbDEgPSBsZW5ndGhzWy0taV0pID49IHYpIHsgfVxuXHRcdFx0XHRcdFx0XHRcdGlmIChpID09PSAwICYmIHYgPCB0aGlzLl9sMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fbDEgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2wyID0gbGVuZ3Roc1tpXTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9saSA9IGk7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fY3VyU2VnID0gY3VyU2VnID0gdGhpcy5fc2VnbWVudHNbaV07XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fczEgPSBjdXJTZWdbKHRoaXMuX3NpID0gY3VyU2VnLmxlbmd0aCAtIDEpIC0gMV0gfHwgMDtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9zMiA9IGN1clNlZ1t0aGlzLl9zaV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0Y3VySW5kZXggPSBpO1xuXHRcdFx0XHRcdFx0XHQvL25vdyBmaW5kIHRoZSBhcHByb3ByaWF0ZSBzdWItc2VnbWVudCAod2Ugc3BsaXQgaXQgaW50byB0aGUgbnVtYmVyIG9mIHBpZWNlcyB0aGF0IHdhcyBkZWZpbmVkIGJ5IFwicHJlY2lzaW9uXCIgYW5kIG1lYXN1cmVkIGVhY2ggb25lKVxuXHRcdFx0XHRcdFx0XHR2IC09IHRoaXMuX2wxO1xuXHRcdFx0XHRcdFx0XHRpID0gdGhpcy5fc2k7XG5cdFx0XHRcdFx0XHRcdGlmICh2ID4gdGhpcy5fczIgJiYgaSA8IGN1clNlZy5sZW5ndGggLSAxKSB7XG5cdFx0XHRcdFx0XHRcdFx0bCA9IGN1clNlZy5sZW5ndGggLSAxO1xuXHRcdFx0XHRcdFx0XHRcdHdoaWxlIChpIDwgbCAmJiAodGhpcy5fczIgPSBjdXJTZWdbKytpXSkgPD0gdikge1x0fVxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3MxID0gY3VyU2VnW2ktMV07XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fc2kgPSBpO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHYgPCB0aGlzLl9zMSAmJiBpID4gMCkge1xuXHRcdFx0XHRcdFx0XHRcdHdoaWxlIChpID4gMCAmJiAodGhpcy5fczEgPSBjdXJTZWdbLS1pXSkgPj0gdikge1x0fVxuXHRcdFx0XHRcdFx0XHRcdGlmIChpID09PSAwICYmIHYgPCB0aGlzLl9zMSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fczEgPSAwO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3MyID0gY3VyU2VnW2ldO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3NpID0gaTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR0ID0gKGkgKyAodiAtIHRoaXMuX3MxKSAvICh0aGlzLl9zMiAtIHRoaXMuX3MxKSkgKiB0aGlzLl9wcmVjO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aW52ID0gMSAtIHQ7XG5cblx0XHRcdFx0XHRcdGkgPSB0aGlzLl9wcm9wcy5sZW5ndGg7XG5cdFx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0cCA9IHRoaXMuX3Byb3BzW2ldO1xuXHRcdFx0XHRcdFx0XHRiID0gdGhpcy5fYmV6aWVyc1twXVtjdXJJbmRleF07XG5cdFx0XHRcdFx0XHRcdHZhbCA9ICh0ICogdCAqIGIuZGEgKyAzICogaW52ICogKHQgKiBiLmNhICsgaW52ICogYi5iYSkpICogdCArIGIuYTtcblx0XHRcdFx0XHRcdFx0aWYgKHRoaXMuX3JvdW5kW3BdKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsID0gTWF0aC5yb3VuZCh2YWwpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmIChmdW5jW3BdKSB7XG5cdFx0XHRcdFx0XHRcdFx0dGFyZ2V0W3BdKHZhbCk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0dGFyZ2V0W3BdID0gdmFsO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICh0aGlzLl9hdXRvUm90YXRlKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBhciA9IHRoaXMuX2F1dG9Sb3RhdGUsXG5cdFx0XHRcdFx0XHRcdFx0YjIsIHgxLCB5MSwgeDIsIHkyLCBhZGQsIGNvbnY7XG5cdFx0XHRcdFx0XHRcdGkgPSBhci5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRcdHAgPSBhcltpXVsyXTtcblx0XHRcdFx0XHRcdFx0XHRhZGQgPSBhcltpXVszXSB8fCAwO1xuXHRcdFx0XHRcdFx0XHRcdGNvbnYgPSAoYXJbaV1bNF0gPT09IHRydWUpID8gMSA6IF9SQUQyREVHO1xuXHRcdFx0XHRcdFx0XHRcdGIgPSB0aGlzLl9iZXppZXJzW2FyW2ldWzBdXTtcblx0XHRcdFx0XHRcdFx0XHRiMiA9IHRoaXMuX2JlemllcnNbYXJbaV1bMV1dO1xuXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGIgJiYgYjIpIHsgLy9pbiBjYXNlIG9uZSBvZiB0aGUgcHJvcGVydGllcyBnb3Qgb3ZlcndyaXR0ZW4uXG5cdFx0XHRcdFx0XHRcdFx0XHRiID0gYltjdXJJbmRleF07XG5cdFx0XHRcdFx0XHRcdFx0XHRiMiA9IGIyW2N1ckluZGV4XTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0eDEgPSBiLmEgKyAoYi5iIC0gYi5hKSAqIHQ7XG5cdFx0XHRcdFx0XHRcdFx0XHR4MiA9IGIuYiArIChiLmMgLSBiLmIpICogdDtcblx0XHRcdFx0XHRcdFx0XHRcdHgxICs9ICh4MiAtIHgxKSAqIHQ7XG5cdFx0XHRcdFx0XHRcdFx0XHR4MiArPSAoKGIuYyArIChiLmQgLSBiLmMpICogdCkgLSB4MikgKiB0O1xuXG5cdFx0XHRcdFx0XHRcdFx0XHR5MSA9IGIyLmEgKyAoYjIuYiAtIGIyLmEpICogdDtcblx0XHRcdFx0XHRcdFx0XHRcdHkyID0gYjIuYiArIChiMi5jIC0gYjIuYikgKiB0O1xuXHRcdFx0XHRcdFx0XHRcdFx0eTEgKz0gKHkyIC0geTEpICogdDtcblx0XHRcdFx0XHRcdFx0XHRcdHkyICs9ICgoYjIuYyArIChiMi5kIC0gYjIuYykgKiB0KSAtIHkyKSAqIHQ7XG5cblx0XHRcdFx0XHRcdFx0XHRcdHZhbCA9IG5vdFN0YXJ0ID8gTWF0aC5hdGFuMih5MiAtIHkxLCB4MiAtIHgxKSAqIGNvbnYgKyBhZGQgOiB0aGlzLl9pbml0aWFsUm90YXRpb25zW2ldO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoZnVuY1twXSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR0YXJnZXRbcF0odmFsKTtcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHRhcmdldFtwXSA9IHZhbDtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHR9KSxcblx0XHRcdHAgPSBCZXppZXJQbHVnaW4ucHJvdG90eXBlO1xuXG5cblx0XHRCZXppZXJQbHVnaW4uYmV6aWVyVGhyb3VnaCA9IGJlemllclRocm91Z2g7XG5cdFx0QmV6aWVyUGx1Z2luLmN1YmljVG9RdWFkcmF0aWMgPSBjdWJpY1RvUXVhZHJhdGljO1xuXHRcdEJlemllclBsdWdpbi5fYXV0b0NTUyA9IHRydWU7IC8vaW5kaWNhdGVzIHRoYXQgdGhpcyBwbHVnaW4gY2FuIGJlIGluc2VydGVkIGludG8gdGhlIFwiY3NzXCIgb2JqZWN0IHVzaW5nIHRoZSBhdXRvQ1NTIGZlYXR1cmUgb2YgVHdlZW5MaXRlXG5cdFx0QmV6aWVyUGx1Z2luLnF1YWRyYXRpY1RvQ3ViaWMgPSBmdW5jdGlvbihhLCBiLCBjKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFNlZ21lbnQoYSwgKDIgKiBiICsgYSkgLyAzLCAoMiAqIGIgKyBjKSAvIDMsIGMpO1xuXHRcdH07XG5cblx0XHRCZXppZXJQbHVnaW4uX2Nzc1JlZ2lzdGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgQ1NTUGx1Z2luID0gX2dsb2JhbHMuQ1NTUGx1Z2luO1xuXHRcdFx0aWYgKCFDU1NQbHVnaW4pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0dmFyIF9pbnRlcm5hbHMgPSBDU1NQbHVnaW4uX2ludGVybmFscyxcblx0XHRcdFx0X3BhcnNlVG9Qcm94eSA9IF9pbnRlcm5hbHMuX3BhcnNlVG9Qcm94eSxcblx0XHRcdFx0X3NldFBsdWdpblJhdGlvID0gX2ludGVybmFscy5fc2V0UGx1Z2luUmF0aW8sXG5cdFx0XHRcdENTU1Byb3BUd2VlbiA9IF9pbnRlcm5hbHMuQ1NTUHJvcFR3ZWVuO1xuXHRcdFx0X2ludGVybmFscy5fcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJiZXppZXJcIiwge3BhcnNlcjpmdW5jdGlvbih0LCBlLCBwcm9wLCBjc3NwLCBwdCwgcGx1Z2luKSB7XG5cdFx0XHRcdGlmIChlIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRcdFx0XHRlID0ge3ZhbHVlczplfTtcblx0XHRcdFx0fVxuXHRcdFx0XHRwbHVnaW4gPSBuZXcgQmV6aWVyUGx1Z2luKCk7XG5cdFx0XHRcdHZhciB2YWx1ZXMgPSBlLnZhbHVlcyxcblx0XHRcdFx0XHRsID0gdmFsdWVzLmxlbmd0aCAtIDEsXG5cdFx0XHRcdFx0cGx1Z2luVmFsdWVzID0gW10sXG5cdFx0XHRcdFx0diA9IHt9LFxuXHRcdFx0XHRcdGksIHAsIGRhdGE7XG5cdFx0XHRcdGlmIChsIDwgMCkge1xuXHRcdFx0XHRcdHJldHVybiBwdDtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDw9IGw7IGkrKykge1xuXHRcdFx0XHRcdGRhdGEgPSBfcGFyc2VUb1Byb3h5KHQsIHZhbHVlc1tpXSwgY3NzcCwgcHQsIHBsdWdpbiwgKGwgIT09IGkpKTtcblx0XHRcdFx0XHRwbHVnaW5WYWx1ZXNbaV0gPSBkYXRhLmVuZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRmb3IgKHAgaW4gZSkge1xuXHRcdFx0XHRcdHZbcF0gPSBlW3BdOyAvL2R1cGxpY2F0ZSB0aGUgdmFycyBvYmplY3QgYmVjYXVzZSB3ZSBuZWVkIHRvIGFsdGVyIHNvbWUgdGhpbmdzIHdoaWNoIHdvdWxkIGNhdXNlIHByb2JsZW1zIGlmIHRoZSB1c2VyIHBsYW5zIHRvIHJldXNlIHRoZSBzYW1lIHZhcnMgb2JqZWN0IGZvciBhbm90aGVyIHR3ZWVuLlxuXHRcdFx0XHR9XG5cdFx0XHRcdHYudmFsdWVzID0gcGx1Z2luVmFsdWVzO1xuXHRcdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4odCwgXCJiZXppZXJcIiwgMCwgMCwgZGF0YS5wdCwgMik7XG5cdFx0XHRcdHB0LmRhdGEgPSBkYXRhO1xuXHRcdFx0XHRwdC5wbHVnaW4gPSBwbHVnaW47XG5cdFx0XHRcdHB0LnNldFJhdGlvID0gX3NldFBsdWdpblJhdGlvO1xuXHRcdFx0XHRpZiAodi5hdXRvUm90YXRlID09PSAwKSB7XG5cdFx0XHRcdFx0di5hdXRvUm90YXRlID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodi5hdXRvUm90YXRlICYmICEodi5hdXRvUm90YXRlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG5cdFx0XHRcdFx0aSA9ICh2LmF1dG9Sb3RhdGUgPT09IHRydWUpID8gMCA6IE51bWJlcih2LmF1dG9Sb3RhdGUpO1xuXHRcdFx0XHRcdHYuYXV0b1JvdGF0ZSA9IChkYXRhLmVuZC5sZWZ0ICE9IG51bGwpID8gW1tcImxlZnRcIixcInRvcFwiLFwicm90YXRpb25cIixpLGZhbHNlXV0gOiAoZGF0YS5lbmQueCAhPSBudWxsKSA/IFtbXCJ4XCIsXCJ5XCIsXCJyb3RhdGlvblwiLGksZmFsc2VdXSA6IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh2LmF1dG9Sb3RhdGUpIHtcblx0XHRcdFx0XHRpZiAoIWNzc3AuX3RyYW5zZm9ybSkge1xuXHRcdFx0XHRcdFx0Y3NzcC5fZW5hYmxlVHJhbnNmb3JtcyhmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGRhdGEuYXV0b1JvdGF0ZSA9IGNzc3AuX3RhcmdldC5fZ3NUcmFuc2Zvcm07XG5cdFx0XHRcdH1cblx0XHRcdFx0cGx1Z2luLl9vbkluaXRUd2VlbihkYXRhLnByb3h5LCB2LCBjc3NwLl90d2Vlbik7XG5cdFx0XHRcdHJldHVybiBwdDtcblx0XHRcdH19KTtcblx0XHR9O1xuXG5cdFx0cC5fcm91bmRQcm9wcyA9IGZ1bmN0aW9uKGxvb2t1cCwgdmFsdWUpIHtcblx0XHRcdHZhciBvcCA9IHRoaXMuX292ZXJ3cml0ZVByb3BzLFxuXHRcdFx0XHRpID0gb3AubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGlmIChsb29rdXBbb3BbaV1dIHx8IGxvb2t1cC5iZXppZXIgfHwgbG9va3VwLmJlemllclRocm91Z2gpIHtcblx0XHRcdFx0XHR0aGlzLl9yb3VuZFtvcFtpXV0gPSB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRwLl9raWxsID0gZnVuY3Rpb24obG9va3VwKSB7XG5cdFx0XHR2YXIgYSA9IHRoaXMuX3Byb3BzLFxuXHRcdFx0XHRwLCBpO1xuXHRcdFx0Zm9yIChwIGluIHRoaXMuX2JlemllcnMpIHtcblx0XHRcdFx0aWYgKHAgaW4gbG9va3VwKSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHRoaXMuX2JlemllcnNbcF07XG5cdFx0XHRcdFx0ZGVsZXRlIHRoaXMuX2Z1bmNbcF07XG5cdFx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0aWYgKGFbaV0gPT09IHApIHtcblx0XHRcdFx0XHRcdFx0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5fc3VwZXIuX2tpbGwuY2FsbCh0aGlzLCBsb29rdXApO1xuXHRcdH07XG5cblx0fSgpKTtcblxuXG5cblxuXG5cblx0XG5cdFxuXHRcblx0XG5cdFxuXHRcblx0XG5cdFxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIENTU1BsdWdpblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdF9nc1Njb3BlLl9nc0RlZmluZShcInBsdWdpbnMuQ1NTUGx1Z2luXCIsIFtcInBsdWdpbnMuVHdlZW5QbHVnaW5cIixcIlR3ZWVuTGl0ZVwiXSwgZnVuY3Rpb24oVHdlZW5QbHVnaW4sIFR3ZWVuTGl0ZSkge1xuXG5cdFx0LyoqIEBjb25zdHJ1Y3RvciAqKi9cblx0XHR2YXIgQ1NTUGx1Z2luID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFR3ZWVuUGx1Z2luLmNhbGwodGhpcywgXCJjc3NcIik7XG5cdFx0XHRcdHRoaXMuX292ZXJ3cml0ZVByb3BzLmxlbmd0aCA9IDA7XG5cdFx0XHRcdHRoaXMuc2V0UmF0aW8gPSBDU1NQbHVnaW4ucHJvdG90eXBlLnNldFJhdGlvOyAvL3NwZWVkIG9wdGltaXphdGlvbiAoYXZvaWQgcHJvdG90eXBlIGxvb2t1cCBvbiB0aGlzIFwiaG90XCIgbWV0aG9kKVxuXHRcdFx0fSxcblx0XHRcdF9nbG9iYWxzID0gX2dzU2NvcGUuX2dzRGVmaW5lLmdsb2JhbHMsXG5cdFx0XHRfaGFzUHJpb3JpdHksIC8vdHVybnMgdHJ1ZSB3aGVuZXZlciBhIENTU1Byb3BUd2VlbiBpbnN0YW5jZSBpcyBjcmVhdGVkIHRoYXQgaGFzIGEgcHJpb3JpdHkgb3RoZXIgdGhhbiAwLiBUaGlzIGhlbHBzIHVzIGRpc2Nlcm4gd2hldGhlciBvciBub3Qgd2Ugc2hvdWxkIHNwZW5kIHRoZSB0aW1lIG9yZ2FuaXppbmcgdGhlIGxpbmtlZCBsaXN0IG9yIG5vdCBhZnRlciBhIENTU1BsdWdpbidzIF9vbkluaXRUd2VlbigpIG1ldGhvZCBpcyBjYWxsZWQuXG5cdFx0XHRfc3VmZml4TWFwLCAvL3dlIHNldCB0aGlzIGluIF9vbkluaXRUd2VlbigpIGVhY2ggdGltZSBhcyBhIHdheSB0byBoYXZlIGEgcGVyc2lzdGVudCB2YXJpYWJsZSB3ZSBjYW4gdXNlIGluIG90aGVyIG1ldGhvZHMgbGlrZSBfcGFyc2UoKSB3aXRob3V0IGhhdmluZyB0byBwYXNzIGl0IGFyb3VuZCBhcyBhIHBhcmFtZXRlciBhbmQgd2Uga2VlcCBfcGFyc2UoKSBkZWNvdXBsZWQgZnJvbSBhIHBhcnRpY3VsYXIgQ1NTUGx1Z2luIGluc3RhbmNlXG5cdFx0XHRfY3MsIC8vY29tcHV0ZWQgc3R5bGUgKHdlIHN0b3JlIHRoaXMgaW4gYSBzaGFyZWQgdmFyaWFibGUgdG8gY29uc2VydmUgbWVtb3J5IGFuZCBtYWtlIG1pbmlmaWNhdGlvbiB0aWdodGVyXG5cdFx0XHRfb3ZlcndyaXRlUHJvcHMsIC8vYWxpYXMgdG8gdGhlIGN1cnJlbnRseSBpbnN0YW50aWF0aW5nIENTU1BsdWdpbidzIF9vdmVyd3JpdGVQcm9wcyBhcnJheS4gV2UgdXNlIHRoaXMgY2xvc3VyZSBpbiBvcmRlciB0byBhdm9pZCBoYXZpbmcgdG8gcGFzcyBhIHJlZmVyZW5jZSBhcm91bmQgZnJvbSBtZXRob2QgdG8gbWV0aG9kIGFuZCBhaWQgaW4gbWluaWZpY2F0aW9uLlxuXHRcdFx0X3NwZWNpYWxQcm9wcyA9IHt9LFxuXHRcdFx0cCA9IENTU1BsdWdpbi5wcm90b3R5cGUgPSBuZXcgVHdlZW5QbHVnaW4oXCJjc3NcIik7XG5cblx0XHRwLmNvbnN0cnVjdG9yID0gQ1NTUGx1Z2luO1xuXHRcdENTU1BsdWdpbi52ZXJzaW9uID0gXCIxLjE3LjBcIjtcblx0XHRDU1NQbHVnaW4uQVBJID0gMjtcblx0XHRDU1NQbHVnaW4uZGVmYXVsdFRyYW5zZm9ybVBlcnNwZWN0aXZlID0gMDtcblx0XHRDU1NQbHVnaW4uZGVmYXVsdFNrZXdUeXBlID0gXCJjb21wZW5zYXRlZFwiO1xuXHRcdENTU1BsdWdpbi5kZWZhdWx0U21vb3RoT3JpZ2luID0gdHJ1ZTtcblx0XHRwID0gXCJweFwiOyAvL3dlJ2xsIHJldXNlIHRoZSBcInBcIiB2YXJpYWJsZSB0byBrZWVwIGZpbGUgc2l6ZSBkb3duXG5cdFx0Q1NTUGx1Z2luLnN1ZmZpeE1hcCA9IHt0b3A6cCwgcmlnaHQ6cCwgYm90dG9tOnAsIGxlZnQ6cCwgd2lkdGg6cCwgaGVpZ2h0OnAsIGZvbnRTaXplOnAsIHBhZGRpbmc6cCwgbWFyZ2luOnAsIHBlcnNwZWN0aXZlOnAsIGxpbmVIZWlnaHQ6XCJcIn07XG5cblxuXHRcdHZhciBfbnVtRXhwID0gLyg/OlxcZHxcXC1cXGR8XFwuXFxkfFxcLVxcLlxcZCkrL2csXG5cdFx0XHRfcmVsTnVtRXhwID0gLyg/OlxcZHxcXC1cXGR8XFwuXFxkfFxcLVxcLlxcZHxcXCs9XFxkfFxcLT1cXGR8XFwrPS5cXGR8XFwtPVxcLlxcZCkrL2csXG5cdFx0XHRfdmFsdWVzRXhwID0gLyg/OlxcKz18XFwtPXxcXC18XFxiKVtcXGRcXC1cXC5dK1thLXpBLVowLTldKig/OiV8XFxiKS9naSwgLy9maW5kcyBhbGwgdGhlIHZhbHVlcyB0aGF0IGJlZ2luIHdpdGggbnVtYmVycyBvciArPSBvciAtPSBhbmQgdGhlbiBhIG51bWJlci4gSW5jbHVkZXMgc3VmZml4ZXMuIFdlIHVzZSB0aGlzIHRvIHNwbGl0IGNvbXBsZXggdmFsdWVzIGFwYXJ0IGxpa2UgXCIxcHggNXB4IDIwcHggcmdiKDI1NSwxMDIsNTEpXCJcblx0XHRcdF9OYU5FeHAgPSAvKD8hWystXT9cXGQqXFwuP1xcZCt8WystXXxlWystXVxcZCspW14wLTldL2csIC8vYWxzbyBhbGxvd3Mgc2NpZW50aWZpYyBub3RhdGlvbiBhbmQgZG9lc24ndCBraWxsIHRoZSBsZWFkaW5nIC0vKyBpbiAtPSBhbmQgKz1cblx0XHRcdF9zdWZmaXhFeHAgPSAvKD86XFxkfFxcLXxcXCt8PXwjfFxcLikqL2csXG5cdFx0XHRfb3BhY2l0eUV4cCA9IC9vcGFjaXR5ICo9ICooW14pXSopL2ksXG5cdFx0XHRfb3BhY2l0eVZhbEV4cCA9IC9vcGFjaXR5OihbXjtdKikvaSxcblx0XHRcdF9hbHBoYUZpbHRlckV4cCA9IC9hbHBoYVxcKG9wYWNpdHkgKj0uKz9cXCkvaSxcblx0XHRcdF9yZ2Joc2xFeHAgPSAvXihyZ2J8aHNsKS8sXG5cdFx0XHRfY2Fwc0V4cCA9IC8oW0EtWl0pL2csXG5cdFx0XHRfY2FtZWxFeHAgPSAvLShbYS16XSkvZ2ksXG5cdFx0XHRfdXJsRXhwID0gLyheKD86dXJsXFwoXFxcInx1cmxcXCgpKXwoPzooXFxcIlxcKSkkfFxcKSQpL2dpLCAvL2ZvciBwdWxsaW5nIG91dCB1cmxzIGZyb20gdXJsKC4uLikgb3IgdXJsKFwiLi4uXCIpIHN0cmluZ3MgKHNvbWUgYnJvd3NlcnMgd3JhcCB1cmxzIGluIHF1b3Rlcywgc29tZSBkb24ndCB3aGVuIHJlcG9ydGluZyB0aGluZ3MgbGlrZSBiYWNrZ3JvdW5kSW1hZ2UpXG5cdFx0XHRfY2FtZWxGdW5jID0gZnVuY3Rpb24ocywgZykgeyByZXR1cm4gZy50b1VwcGVyQ2FzZSgpOyB9LFxuXHRcdFx0X2hvcml6RXhwID0gLyg/OkxlZnR8UmlnaHR8V2lkdGgpL2ksXG5cdFx0XHRfaWVHZXRNYXRyaXhFeHAgPSAvKE0xMXxNMTJ8TTIxfE0yMik9W1xcZFxcLVxcLmVdKy9naSxcblx0XHRcdF9pZVNldE1hdHJpeEV4cCA9IC9wcm9naWRcXDpEWEltYWdlVHJhbnNmb3JtXFwuTWljcm9zb2Z0XFwuTWF0cml4XFwoLis/XFwpL2ksXG5cdFx0XHRfY29tbWFzT3V0c2lkZVBhcmVuRXhwID0gLywoPz1bXlxcKV0qKD86XFwofCQpKS9naSwgLy9maW5kcyBhbnkgY29tbWFzIHRoYXQgYXJlIG5vdCB3aXRoaW4gcGFyZW50aGVzaXNcblx0XHRcdF9ERUcyUkFEID0gTWF0aC5QSSAvIDE4MCxcblx0XHRcdF9SQUQyREVHID0gMTgwIC8gTWF0aC5QSSxcblx0XHRcdF9mb3JjZVBUID0ge30sXG5cdFx0XHRfZG9jID0gZG9jdW1lbnQsXG5cdFx0XHRfY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKHR5cGUpIHtcblx0XHRcdFx0cmV0dXJuIF9kb2MuY3JlYXRlRWxlbWVudE5TID8gX2RvYy5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCIsIHR5cGUpIDogX2RvYy5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXHRcdFx0fSxcblx0XHRcdF90ZW1wRGl2ID0gX2NyZWF0ZUVsZW1lbnQoXCJkaXZcIiksXG5cdFx0XHRfdGVtcEltZyA9IF9jcmVhdGVFbGVtZW50KFwiaW1nXCIpLFxuXHRcdFx0X2ludGVybmFscyA9IENTU1BsdWdpbi5faW50ZXJuYWxzID0ge19zcGVjaWFsUHJvcHM6X3NwZWNpYWxQcm9wc30sIC8vcHJvdmlkZXMgYSBob29rIHRvIGEgZmV3IGludGVybmFsIG1ldGhvZHMgdGhhdCB3ZSBuZWVkIHRvIGFjY2VzcyBmcm9tIGluc2lkZSBvdGhlciBwbHVnaW5zXG5cdFx0XHRfYWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50LFxuXHRcdFx0X2F1dG9Sb3VuZCxcblx0XHRcdF9yZXFTYWZhcmlGaXgsIC8vd2Ugd29uJ3QgYXBwbHkgdGhlIFNhZmFyaSB0cmFuc2Zvcm0gZml4IHVudGlsIHdlIGFjdHVhbGx5IGNvbWUgYWNyb3NzIGEgdHdlZW4gdGhhdCBhZmZlY3RzIGEgdHJhbnNmb3JtIHByb3BlcnR5ICh0byBtYWludGFpbiBiZXN0IHBlcmZvcm1hbmNlKS5cblxuXHRcdFx0X2lzU2FmYXJpLFxuXHRcdFx0X2lzRmlyZWZveCwgLy9GaXJlZm94IGhhcyBhIGJ1ZyB0aGF0IGNhdXNlcyAzRCB0cmFuc2Zvcm1lZCBlbGVtZW50cyB0byByYW5kb21seSBkaXNhcHBlYXIgdW5sZXNzIGEgcmVwYWludCBpcyBmb3JjZWQgYWZ0ZXIgZWFjaCB1cGRhdGUgb24gZWFjaCBlbGVtZW50LlxuXHRcdFx0X2lzU2FmYXJpTFQ2LCAvL1NhZmFyaSAoYW5kIEFuZHJvaWQgNCB3aGljaCB1c2VzIGEgZmxhdm9yIG9mIFNhZmFyaSkgaGFzIGEgYnVnIHRoYXQgcHJldmVudHMgY2hhbmdlcyB0byBcInRvcFwiIGFuZCBcImxlZnRcIiBwcm9wZXJ0aWVzIGZyb20gcmVuZGVyaW5nIHByb3Blcmx5IGlmIGNoYW5nZWQgb24gdGhlIHNhbWUgZnJhbWUgYXMgYSB0cmFuc2Zvcm0gVU5MRVNTIHdlIHNldCB0aGUgZWxlbWVudCdzIFdlYmtpdEJhY2tmYWNlVmlzaWJpbGl0eSB0byBoaWRkZW4gKHdlaXJkLCBJIGtub3cpLiBEb2luZyB0aGlzIGZvciBBbmRyb2lkIDMgYW5kIGVhcmxpZXIgc2VlbXMgdG8gYWN0dWFsbHkgY2F1c2Ugb3RoZXIgcHJvYmxlbXMsIHRob3VnaCAoZnVuISlcblx0XHRcdF9pZVZlcnMsXG5cdFx0XHRfc3VwcG9ydHNPcGFjaXR5ID0gKGZ1bmN0aW9uKCkgeyAvL3dlIHNldCBfaXNTYWZhcmksIF9pZVZlcnMsIF9pc0ZpcmVmb3gsIGFuZCBfc3VwcG9ydHNPcGFjaXR5IGFsbCBpbiBvbmUgZnVuY3Rpb24gaGVyZSB0byByZWR1Y2UgZmlsZSBzaXplIHNsaWdodGx5LCBlc3BlY2lhbGx5IGluIHRoZSBtaW5pZmllZCB2ZXJzaW9uLlxuXHRcdFx0XHR2YXIgaSA9IF9hZ2VudC5pbmRleE9mKFwiQW5kcm9pZFwiKSxcblx0XHRcdFx0XHRhID0gX2NyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuXHRcdFx0XHRfaXNTYWZhcmkgPSAoX2FnZW50LmluZGV4T2YoXCJTYWZhcmlcIikgIT09IC0xICYmIF9hZ2VudC5pbmRleE9mKFwiQ2hyb21lXCIpID09PSAtMSAmJiAoaSA9PT0gLTEgfHwgTnVtYmVyKF9hZ2VudC5zdWJzdHIoaSs4LCAxKSkgPiAzKSk7XG5cdFx0XHRcdF9pc1NhZmFyaUxUNiA9IChfaXNTYWZhcmkgJiYgKE51bWJlcihfYWdlbnQuc3Vic3RyKF9hZ2VudC5pbmRleE9mKFwiVmVyc2lvbi9cIikrOCwgMSkpIDwgNikpO1xuXHRcdFx0XHRfaXNGaXJlZm94ID0gKF9hZ2VudC5pbmRleE9mKFwiRmlyZWZveFwiKSAhPT0gLTEpO1xuXHRcdFx0XHRpZiAoKC9NU0lFIChbMC05XXsxLH1bXFwuMC05XXswLH0pLykuZXhlYyhfYWdlbnQpIHx8ICgvVHJpZGVudFxcLy4qcnY6KFswLTldezEsfVtcXC4wLTldezAsfSkvKS5leGVjKF9hZ2VudCkpIHtcblx0XHRcdFx0XHRfaWVWZXJzID0gcGFyc2VGbG9hdCggUmVnRXhwLiQxICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFhKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGEuc3R5bGUuY3NzVGV4dCA9IFwidG9wOjFweDtvcGFjaXR5Oi41NTtcIjtcblx0XHRcdFx0cmV0dXJuIC9eMC41NS8udGVzdChhLnN0eWxlLm9wYWNpdHkpO1xuXHRcdFx0fSgpKSxcblx0XHRcdF9nZXRJRU9wYWNpdHkgPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdHJldHVybiAoX29wYWNpdHlFeHAudGVzdCggKCh0eXBlb2YodikgPT09IFwic3RyaW5nXCIpID8gdiA6ICh2LmN1cnJlbnRTdHlsZSA/IHYuY3VycmVudFN0eWxlLmZpbHRlciA6IHYuc3R5bGUuZmlsdGVyKSB8fCBcIlwiKSApID8gKCBwYXJzZUZsb2F0KCBSZWdFeHAuJDEgKSAvIDEwMCApIDogMSk7XG5cdFx0XHR9LFxuXHRcdFx0X2xvZyA9IGZ1bmN0aW9uKHMpIHsvL2ZvciBsb2dnaW5nIG1lc3NhZ2VzLCBidXQgaW4gYSB3YXkgdGhhdCB3b24ndCB0aHJvdyBlcnJvcnMgaW4gb2xkIHZlcnNpb25zIG9mIElFLlxuXHRcdFx0XHRpZiAod2luZG93LmNvbnNvbGUpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhzKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0X3ByZWZpeENTUyA9IFwiXCIsIC8vdGhlIG5vbi1jYW1lbENhc2UgdmVuZG9yIHByZWZpeCBsaWtlIFwiLW8tXCIsIFwiLW1vei1cIiwgXCItbXMtXCIsIG9yIFwiLXdlYmtpdC1cIlxuXHRcdFx0X3ByZWZpeCA9IFwiXCIsIC8vY2FtZWxDYXNlIHZlbmRvciBwcmVmaXggbGlrZSBcIk9cIiwgXCJtc1wiLCBcIldlYmtpdFwiLCBvciBcIk1velwiLlxuXG5cdFx0XHQvLyBAcHJpdmF0ZSBmZWVkIGluIGEgY2FtZWxDYXNlIHByb3BlcnR5IG5hbWUgbGlrZSBcInRyYW5zZm9ybVwiIGFuZCBpdCB3aWxsIGNoZWNrIHRvIHNlZSBpZiBpdCBpcyB2YWxpZCBhcy1pcyBvciBpZiBpdCBuZWVkcyBhIHZlbmRvciBwcmVmaXguIEl0IHJldHVybnMgdGhlIGNvcnJlY3RlZCBjYW1lbENhc2UgcHJvcGVydHkgbmFtZSAoaS5lLiBcIldlYmtpdFRyYW5zZm9ybVwiIG9yIFwiTW96VHJhbnNmb3JtXCIgb3IgXCJ0cmFuc2Zvcm1cIiBvciBudWxsIGlmIG5vIHN1Y2ggcHJvcGVydHkgaXMgZm91bmQsIGxpa2UgaWYgdGhlIGJyb3dzZXIgaXMgSUU4IG9yIGJlZm9yZSwgXCJ0cmFuc2Zvcm1cIiB3b24ndCBiZSBmb3VuZCBhdCBhbGwpXG5cdFx0XHRfY2hlY2tQcm9wUHJlZml4ID0gZnVuY3Rpb24ocCwgZSkge1xuXHRcdFx0XHRlID0gZSB8fCBfdGVtcERpdjtcblx0XHRcdFx0dmFyIHMgPSBlLnN0eWxlLFxuXHRcdFx0XHRcdGEsIGk7XG5cdFx0XHRcdGlmIChzW3BdICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRyZXR1cm4gcDtcblx0XHRcdFx0fVxuXHRcdFx0XHRwID0gcC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHAuc3Vic3RyKDEpO1xuXHRcdFx0XHRhID0gW1wiT1wiLFwiTW96XCIsXCJtc1wiLFwiTXNcIixcIldlYmtpdFwiXTtcblx0XHRcdFx0aSA9IDU7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSAmJiBzW2FbaV0rcF0gPT09IHVuZGVmaW5lZCkgeyB9XG5cdFx0XHRcdGlmIChpID49IDApIHtcblx0XHRcdFx0XHRfcHJlZml4ID0gKGkgPT09IDMpID8gXCJtc1wiIDogYVtpXTtcblx0XHRcdFx0XHRfcHJlZml4Q1NTID0gXCItXCIgKyBfcHJlZml4LnRvTG93ZXJDYXNlKCkgKyBcIi1cIjtcblx0XHRcdFx0XHRyZXR1cm4gX3ByZWZpeCArIHA7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9LFxuXG5cdFx0XHRfZ2V0Q29tcHV0ZWRTdHlsZSA9IF9kb2MuZGVmYXVsdFZpZXcgPyBfZG9jLmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUgOiBmdW5jdGlvbigpIHt9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlIFJldHVybnMgdGhlIGNzcyBzdHlsZSBmb3IgYSBwYXJ0aWN1bGFyIHByb3BlcnR5IG9mIGFuIGVsZW1lbnQuIEZvciBleGFtcGxlLCB0byBnZXQgd2hhdGV2ZXIgdGhlIGN1cnJlbnQgXCJsZWZ0XCIgY3NzIHZhbHVlIGZvciBhbiBlbGVtZW50IHdpdGggYW4gSUQgb2YgXCJteUVsZW1lbnRcIiwgeW91IGNvdWxkIGRvOlxuXHRcdFx0ICogdmFyIGN1cnJlbnRMZWZ0ID0gQ1NTUGx1Z2luLmdldFN0eWxlKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15RWxlbWVudFwiKSwgXCJsZWZ0XCIpO1xuXHRcdFx0ICpcblx0XHRcdCAqIEBwYXJhbSB7IU9iamVjdH0gdCBUYXJnZXQgZWxlbWVudCB3aG9zZSBzdHlsZSBwcm9wZXJ0eSB5b3Ugd2FudCB0byBxdWVyeVxuXHRcdFx0ICogQHBhcmFtIHshc3RyaW5nfSBwIFByb3BlcnR5IG5hbWUgKGxpa2UgXCJsZWZ0XCIgb3IgXCJ0b3BcIiBvciBcIm1hcmdpblRvcFwiLCBldGMuKVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3Q9fSBjcyBDb21wdXRlZCBzdHlsZSBvYmplY3QuIFRoaXMganVzdCBwcm92aWRlcyBhIHdheSB0byBzcGVlZCBwcm9jZXNzaW5nIGlmIHlvdSdyZSBnb2luZyB0byBnZXQgc2V2ZXJhbCBwcm9wZXJ0aWVzIG9uIHRoZSBzYW1lIGVsZW1lbnQgaW4gcXVpY2sgc3VjY2Vzc2lvbiAtIHlvdSBjYW4gcmV1c2UgdGhlIHJlc3VsdCBvZiB0aGUgZ2V0Q29tcHV0ZWRTdHlsZSgpIGNhbGwuXG5cdFx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSBjYWxjIElmIHRydWUsIHRoZSB2YWx1ZSB3aWxsIG5vdCBiZSByZWFkIGRpcmVjdGx5IGZyb20gdGhlIGVsZW1lbnQncyBcInN0eWxlXCIgcHJvcGVydHkgKGlmIGl0IGV4aXN0cyB0aGVyZSksIGJ1dCBpbnN0ZWFkIHRoZSBnZXRDb21wdXRlZFN0eWxlKCkgcmVzdWx0IHdpbGwgYmUgdXNlZC4gVGhpcyBjYW4gYmUgdXNlZnVsIHdoZW4geW91IHdhbnQgdG8gZW5zdXJlIHRoYXQgdGhlIGJyb3dzZXIgaXRzZWxmIGlzIGludGVycHJldGluZyB0aGUgdmFsdWUuXG5cdFx0XHQgKiBAcGFyYW0ge3N0cmluZz19IGRmbHQgRGVmYXVsdCB2YWx1ZSB0aGF0IHNob3VsZCBiZSByZXR1cm5lZCBpbiB0aGUgcGxhY2Ugb2YgbnVsbCwgXCJub25lXCIsIFwiYXV0b1wiIG9yIFwiYXV0byBhdXRvXCIuXG5cdFx0XHQgKiBAcmV0dXJuIHs/c3RyaW5nfSBUaGUgY3VycmVudCBwcm9wZXJ0eSB2YWx1ZVxuXHRcdFx0ICovXG5cdFx0XHRfZ2V0U3R5bGUgPSBDU1NQbHVnaW4uZ2V0U3R5bGUgPSBmdW5jdGlvbih0LCBwLCBjcywgY2FsYywgZGZsdCkge1xuXHRcdFx0XHR2YXIgcnY7XG5cdFx0XHRcdGlmICghX3N1cHBvcnRzT3BhY2l0eSkgaWYgKHAgPT09IFwib3BhY2l0eVwiKSB7IC8vc2V2ZXJhbCB2ZXJzaW9ucyBvZiBJRSBkb24ndCB1c2UgdGhlIHN0YW5kYXJkIFwib3BhY2l0eVwiIHByb3BlcnR5IC0gdGhleSB1c2UgdGhpbmdzIGxpa2UgZmlsdGVyOmFscGhhKG9wYWNpdHk9NTApLCBzbyB3ZSBwYXJzZSB0aGF0IGhlcmUuXG5cdFx0XHRcdFx0cmV0dXJuIF9nZXRJRU9wYWNpdHkodCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFjYWxjICYmIHQuc3R5bGVbcF0pIHtcblx0XHRcdFx0XHRydiA9IHQuc3R5bGVbcF07XG5cdFx0XHRcdH0gZWxzZSBpZiAoKGNzID0gY3MgfHwgX2dldENvbXB1dGVkU3R5bGUodCkpKSB7XG5cdFx0XHRcdFx0cnYgPSBjc1twXSB8fCBjcy5nZXRQcm9wZXJ0eVZhbHVlKHApIHx8IGNzLmdldFByb3BlcnR5VmFsdWUocC5yZXBsYWNlKF9jYXBzRXhwLCBcIi0kMVwiKS50b0xvd2VyQ2FzZSgpKTtcblx0XHRcdFx0fSBlbHNlIGlmICh0LmN1cnJlbnRTdHlsZSkge1xuXHRcdFx0XHRcdHJ2ID0gdC5jdXJyZW50U3R5bGVbcF07XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIChkZmx0ICE9IG51bGwgJiYgKCFydiB8fCBydiA9PT0gXCJub25lXCIgfHwgcnYgPT09IFwiYXV0b1wiIHx8IHJ2ID09PSBcImF1dG8gYXV0b1wiKSkgPyBkZmx0IDogcnY7XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlIFBhc3MgdGhlIHRhcmdldCBlbGVtZW50LCB0aGUgcHJvcGVydHkgbmFtZSwgdGhlIG51bWVyaWMgdmFsdWUsIGFuZCB0aGUgc3VmZml4IChsaWtlIFwiJVwiLCBcImVtXCIsIFwicHhcIiwgZXRjLikgYW5kIGl0IHdpbGwgc3BpdCBiYWNrIHRoZSBlcXVpdmFsZW50IHBpeGVsIG51bWJlci5cblx0XHRcdCAqIEBwYXJhbSB7IU9iamVjdH0gdCBUYXJnZXQgZWxlbWVudFxuXHRcdFx0ICogQHBhcmFtIHshc3RyaW5nfSBwIFByb3BlcnR5IG5hbWUgKGxpa2UgXCJsZWZ0XCIsIFwidG9wXCIsIFwibWFyZ2luTGVmdFwiLCBldGMuKVxuXHRcdFx0ICogQHBhcmFtIHshbnVtYmVyfSB2IFZhbHVlXG5cdFx0XHQgKiBAcGFyYW0ge3N0cmluZz19IHNmeCBTdWZmaXggKGxpa2UgXCJweFwiIG9yIFwiJVwiIG9yIFwiZW1cIilcblx0XHRcdCAqIEBwYXJhbSB7Ym9vbGVhbj19IHJlY3Vyc2UgSWYgdHJ1ZSwgdGhlIGNhbGwgaXMgYSByZWN1cnNpdmUgb25lLiBJbiBzb21lIGJyb3dzZXJzIChsaWtlIElFNy84KSwgb2NjYXNpb25hbGx5IHRoZSB2YWx1ZSBpc24ndCBhY2N1cmF0ZWx5IHJlcG9ydGVkIGluaXRpYWxseSwgYnV0IGlmIHdlIHJ1biB0aGUgZnVuY3Rpb24gYWdhaW4gaXQgd2lsbCB0YWtlIGVmZmVjdC5cblx0XHRcdCAqIEByZXR1cm4ge251bWJlcn0gdmFsdWUgaW4gcGl4ZWxzXG5cdFx0XHQgKi9cblx0XHRcdF9jb252ZXJ0VG9QaXhlbHMgPSBfaW50ZXJuYWxzLmNvbnZlcnRUb1BpeGVscyA9IGZ1bmN0aW9uKHQsIHAsIHYsIHNmeCwgcmVjdXJzZSkge1xuXHRcdFx0XHRpZiAoc2Z4ID09PSBcInB4XCIgfHwgIXNmeCkgeyByZXR1cm4gdjsgfVxuXHRcdFx0XHRpZiAoc2Z4ID09PSBcImF1dG9cIiB8fCAhdikgeyByZXR1cm4gMDsgfVxuXHRcdFx0XHR2YXIgaG9yaXogPSBfaG9yaXpFeHAudGVzdChwKSxcblx0XHRcdFx0XHRub2RlID0gdCxcblx0XHRcdFx0XHRzdHlsZSA9IF90ZW1wRGl2LnN0eWxlLFxuXHRcdFx0XHRcdG5lZyA9ICh2IDwgMCksXG5cdFx0XHRcdFx0cGl4LCBjYWNoZSwgdGltZTtcblx0XHRcdFx0aWYgKG5lZykge1xuXHRcdFx0XHRcdHYgPSAtdjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc2Z4ID09PSBcIiVcIiAmJiBwLmluZGV4T2YoXCJib3JkZXJcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0cGl4ID0gKHYgLyAxMDApICogKGhvcml6ID8gdC5jbGllbnRXaWR0aCA6IHQuY2xpZW50SGVpZ2h0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzdHlsZS5jc3NUZXh0ID0gXCJib3JkZXI6MCBzb2xpZCByZWQ7cG9zaXRpb246XCIgKyBfZ2V0U3R5bGUodCwgXCJwb3NpdGlvblwiKSArIFwiO2xpbmUtaGVpZ2h0OjA7XCI7XG5cdFx0XHRcdFx0aWYgKHNmeCA9PT0gXCIlXCIgfHwgIW5vZGUuYXBwZW5kQ2hpbGQpIHtcblx0XHRcdFx0XHRcdG5vZGUgPSB0LnBhcmVudE5vZGUgfHwgX2RvYy5ib2R5O1xuXHRcdFx0XHRcdFx0Y2FjaGUgPSBub2RlLl9nc0NhY2hlO1xuXHRcdFx0XHRcdFx0dGltZSA9IFR3ZWVuTGl0ZS50aWNrZXIuZnJhbWU7XG5cdFx0XHRcdFx0XHRpZiAoY2FjaGUgJiYgaG9yaXogJiYgY2FjaGUudGltZSA9PT0gdGltZSkgeyAvL3BlcmZvcm1hbmNlIG9wdGltaXphdGlvbjogd2UgcmVjb3JkIHRoZSB3aWR0aCBvZiBlbGVtZW50cyBhbG9uZyB3aXRoIHRoZSB0aWNrZXIgZnJhbWUgc28gdGhhdCB3ZSBjYW4gcXVpY2tseSBnZXQgaXQgYWdhaW4gb24gdGhlIHNhbWUgdGljayAoc2VlbXMgcmVsYXRpdmVseSBzYWZlIHRvIGFzc3VtZSBpdCB3b3VsZG4ndCBjaGFuZ2Ugb24gdGhlIHNhbWUgdGljaylcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGNhY2hlLndpZHRoICogdiAvIDEwMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHN0eWxlWyhob3JpeiA/IFwid2lkdGhcIiA6IFwiaGVpZ2h0XCIpXSA9IHYgKyBzZng7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHN0eWxlWyhob3JpeiA/IFwiYm9yZGVyTGVmdFdpZHRoXCIgOiBcImJvcmRlclRvcFdpZHRoXCIpXSA9IHYgKyBzZng7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdG5vZGUuYXBwZW5kQ2hpbGQoX3RlbXBEaXYpO1xuXHRcdFx0XHRcdHBpeCA9IHBhcnNlRmxvYXQoX3RlbXBEaXZbKGhvcml6ID8gXCJvZmZzZXRXaWR0aFwiIDogXCJvZmZzZXRIZWlnaHRcIildKTtcblx0XHRcdFx0XHRub2RlLnJlbW92ZUNoaWxkKF90ZW1wRGl2KTtcblx0XHRcdFx0XHRpZiAoaG9yaXogJiYgc2Z4ID09PSBcIiVcIiAmJiBDU1NQbHVnaW4uY2FjaGVXaWR0aHMgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHRjYWNoZSA9IG5vZGUuX2dzQ2FjaGUgPSBub2RlLl9nc0NhY2hlIHx8IHt9O1xuXHRcdFx0XHRcdFx0Y2FjaGUudGltZSA9IHRpbWU7XG5cdFx0XHRcdFx0XHRjYWNoZS53aWR0aCA9IHBpeCAvIHYgKiAxMDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwaXggPT09IDAgJiYgIXJlY3Vyc2UpIHtcblx0XHRcdFx0XHRcdHBpeCA9IF9jb252ZXJ0VG9QaXhlbHModCwgcCwgdiwgc2Z4LCB0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG5lZyA/IC1waXggOiBwaXg7XG5cdFx0XHR9LFxuXHRcdFx0X2NhbGN1bGF0ZU9mZnNldCA9IF9pbnRlcm5hbHMuY2FsY3VsYXRlT2Zmc2V0ID0gZnVuY3Rpb24odCwgcCwgY3MpIHsgLy9mb3IgZmlndXJpbmcgb3V0IFwidG9wXCIgb3IgXCJsZWZ0XCIgaW4gcHggd2hlbiBpdCdzIFwiYXV0b1wiLiBXZSBuZWVkIHRvIGZhY3RvciBpbiBtYXJnaW4gd2l0aCB0aGUgb2Zmc2V0TGVmdC9vZmZzZXRUb3Bcblx0XHRcdFx0aWYgKF9nZXRTdHlsZSh0LCBcInBvc2l0aW9uXCIsIGNzKSAhPT0gXCJhYnNvbHV0ZVwiKSB7IHJldHVybiAwOyB9XG5cdFx0XHRcdHZhciBkaW0gPSAoKHAgPT09IFwibGVmdFwiKSA/IFwiTGVmdFwiIDogXCJUb3BcIiksXG5cdFx0XHRcdFx0diA9IF9nZXRTdHlsZSh0LCBcIm1hcmdpblwiICsgZGltLCBjcyk7XG5cdFx0XHRcdHJldHVybiB0W1wib2Zmc2V0XCIgKyBkaW1dIC0gKF9jb252ZXJ0VG9QaXhlbHModCwgcCwgcGFyc2VGbG9hdCh2KSwgdi5yZXBsYWNlKF9zdWZmaXhFeHAsIFwiXCIpKSB8fCAwKTtcblx0XHRcdH0sXG5cblx0XHRcdC8vIEBwcml2YXRlIHJldHVybnMgYXQgb2JqZWN0IGNvbnRhaW5pbmcgQUxMIG9mIHRoZSBzdHlsZSBwcm9wZXJ0aWVzIGluIGNhbWVsQ2FzZSBhbmQgdGhlaXIgYXNzb2NpYXRlZCB2YWx1ZXMuXG5cdFx0XHRfZ2V0QWxsU3R5bGVzID0gZnVuY3Rpb24odCwgY3MpIHtcblx0XHRcdFx0dmFyIHMgPSB7fSxcblx0XHRcdFx0XHRpLCB0ciwgcDtcblx0XHRcdFx0aWYgKChjcyA9IGNzIHx8IF9nZXRDb21wdXRlZFN0eWxlKHQsIG51bGwpKSkge1xuXHRcdFx0XHRcdGlmICgoaSA9IGNzLmxlbmd0aCkpIHtcblx0XHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0XHRwID0gY3NbaV07XG5cdFx0XHRcdFx0XHRcdGlmIChwLmluZGV4T2YoXCItdHJhbnNmb3JtXCIpID09PSAtMSB8fCBfdHJhbnNmb3JtUHJvcENTUyA9PT0gcCkgeyAvL1NvbWUgd2Via2l0IGJyb3dzZXJzIGR1cGxpY2F0ZSB0cmFuc2Zvcm0gdmFsdWVzLCBvbmUgbm9uLXByZWZpeGVkIGFuZCBvbmUgcHJlZml4ZWQgKFwidHJhbnNmb3JtXCIgYW5kIFwiV2Via2l0VHJhbnNmb3JtXCIpLCBzbyB3ZSBtdXN0IHdlZWQgb3V0IHRoZSBleHRyYSBvbmUgaGVyZS5cblx0XHRcdFx0XHRcdFx0XHRzW3AucmVwbGFjZShfY2FtZWxFeHAsIF9jYW1lbEZ1bmMpXSA9IGNzLmdldFByb3BlcnR5VmFsdWUocCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2UgeyAvL3NvbWUgYnJvd3NlcnMgYmVoYXZlIGRpZmZlcmVudGx5IC0gY3MubGVuZ3RoIGlzIGFsd2F5cyAwLCBzbyB3ZSBtdXN0IGRvIGEgZm9yLi4uaW4gbG9vcC5cblx0XHRcdFx0XHRcdGZvciAoaSBpbiBjcykge1xuXHRcdFx0XHRcdFx0XHRpZiAoaS5pbmRleE9mKFwiVHJhbnNmb3JtXCIpID09PSAtMSB8fCBfdHJhbnNmb3JtUHJvcCA9PT0gaSkgeyAvL1NvbWUgd2Via2l0IGJyb3dzZXJzIGR1cGxpY2F0ZSB0cmFuc2Zvcm0gdmFsdWVzLCBvbmUgbm9uLXByZWZpeGVkIGFuZCBvbmUgcHJlZml4ZWQgKFwidHJhbnNmb3JtXCIgYW5kIFwiV2Via2l0VHJhbnNmb3JtXCIpLCBzbyB3ZSBtdXN0IHdlZWQgb3V0IHRoZSBleHRyYSBvbmUgaGVyZS5cblx0XHRcdFx0XHRcdFx0XHRzW2ldID0gY3NbaV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoKGNzID0gdC5jdXJyZW50U3R5bGUgfHwgdC5zdHlsZSkpIHtcblx0XHRcdFx0XHRmb3IgKGkgaW4gY3MpIHtcblx0XHRcdFx0XHRcdGlmICh0eXBlb2YoaSkgPT09IFwic3RyaW5nXCIgJiYgc1tpXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRcdHNbaS5yZXBsYWNlKF9jYW1lbEV4cCwgX2NhbWVsRnVuYyldID0gY3NbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghX3N1cHBvcnRzT3BhY2l0eSkge1xuXHRcdFx0XHRcdHMub3BhY2l0eSA9IF9nZXRJRU9wYWNpdHkodCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dHIgPSBfZ2V0VHJhbnNmb3JtKHQsIGNzLCBmYWxzZSk7XG5cdFx0XHRcdHMucm90YXRpb24gPSB0ci5yb3RhdGlvbjtcblx0XHRcdFx0cy5za2V3WCA9IHRyLnNrZXdYO1xuXHRcdFx0XHRzLnNjYWxlWCA9IHRyLnNjYWxlWDtcblx0XHRcdFx0cy5zY2FsZVkgPSB0ci5zY2FsZVk7XG5cdFx0XHRcdHMueCA9IHRyLng7XG5cdFx0XHRcdHMueSA9IHRyLnk7XG5cdFx0XHRcdGlmIChfc3VwcG9ydHMzRCkge1xuXHRcdFx0XHRcdHMueiA9IHRyLno7XG5cdFx0XHRcdFx0cy5yb3RhdGlvblggPSB0ci5yb3RhdGlvblg7XG5cdFx0XHRcdFx0cy5yb3RhdGlvblkgPSB0ci5yb3RhdGlvblk7XG5cdFx0XHRcdFx0cy5zY2FsZVogPSB0ci5zY2FsZVo7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHMuZmlsdGVycykge1xuXHRcdFx0XHRcdGRlbGV0ZSBzLmZpbHRlcnM7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHM7XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBAcHJpdmF0ZSBhbmFseXplcyB0d28gc3R5bGUgb2JqZWN0cyAoYXMgcmV0dXJuZWQgYnkgX2dldEFsbFN0eWxlcygpKSBhbmQgb25seSBsb29rcyBmb3IgZGlmZmVyZW5jZXMgYmV0d2VlbiB0aGVtIHRoYXQgY29udGFpbiB0d2VlbmFibGUgdmFsdWVzIChsaWtlIGEgbnVtYmVyIG9yIGNvbG9yKS4gSXQgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBhIFwiZGlmc1wiIHByb3BlcnR5IHdoaWNoIHJlZmVycyB0byBhbiBvYmplY3QgY29udGFpbmluZyBvbmx5IHRob3NlIGlzb2xhdGVkIHByb3BlcnRpZXMgYW5kIHZhbHVlcyBmb3IgdHdlZW5pbmcsIGFuZCBhIFwiZmlyc3RNUFRcIiBwcm9wZXJ0eSB3aGljaCByZWZlcnMgdG8gdGhlIGZpcnN0IE1pbmlQcm9wVHdlZW4gaW5zdGFuY2UgaW4gYSBsaW5rZWQgbGlzdCB0aGF0IHJlY29yZGVkIGFsbCB0aGUgc3RhcnRpbmcgdmFsdWVzIG9mIHRoZSBkaWZmZXJlbnQgcHJvcGVydGllcyBzbyB0aGF0IHdlIGNhbiByZXZlcnQgdG8gdGhlbSBhdCB0aGUgZW5kIG9yIGJlZ2lubmluZyBvZiB0aGUgdHdlZW4gLSB3ZSBkb24ndCB3YW50IHRoZSBjYXNjYWRpbmcgdG8gZ2V0IG1lc3NlZCB1cC4gVGhlIGZvcmNlTG9va3VwIHBhcmFtZXRlciBpcyBhbiBvcHRpb25hbCBnZW5lcmljIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgdGhhdCBzaG91bGQgYmUgZm9yY2VkIGludG8gdGhlIHJlc3VsdHMgLSB0aGlzIGlzIG5lY2Vzc2FyeSBmb3IgY2xhc3NOYW1lIHR3ZWVucyB0aGF0IGFyZSBvdmVyd3JpdGluZyBvdGhlcnMgYmVjYXVzZSBpbWFnaW5lIGEgc2NlbmFyaW8gd2hlcmUgYSByb2xsb3Zlci9yb2xsb3V0IGFkZHMvcmVtb3ZlcyBhIGNsYXNzIGFuZCB0aGUgdXNlciBzd2lwZXMgdGhlIG1vdXNlIG92ZXIgdGhlIHRhcmdldCBTVVBFUiBmYXN0LCB0aHVzIG5vdGhpbmcgYWN0dWFsbHkgY2hhbmdlZCB5ZXQgYW5kIHRoZSBzdWJzZXF1ZW50IGNvbXBhcmlzb24gb2YgdGhlIHByb3BlcnRpZXMgd291bGQgaW5kaWNhdGUgdGhleSBtYXRjaCAoZXNwZWNpYWxseSB3aGVuIHB4IHJvdW5kaW5nIGlzIHRha2VuIGludG8gY29uc2lkZXJhdGlvbiksIHRodXMgbm8gdHdlZW5pbmcgaXMgbmVjZXNzYXJ5IGV2ZW4gdGhvdWdoIGl0IFNIT1VMRCB0d2VlbiBhbmQgcmVtb3ZlIHRob3NlIHByb3BlcnRpZXMgYWZ0ZXIgdGhlIHR3ZWVuIChvdGhlcndpc2UgdGhlIGlubGluZSBzdHlsZXMgd2lsbCBjb250YW1pbmF0ZSB0aGluZ3MpLiBTZWUgdGhlIGNsYXNzTmFtZSBTcGVjaWFsUHJvcCBjb2RlIGZvciBkZXRhaWxzLlxuXHRcdFx0X2Nzc0RpZiA9IGZ1bmN0aW9uKHQsIHMxLCBzMiwgdmFycywgZm9yY2VMb29rdXApIHtcblx0XHRcdFx0dmFyIGRpZnMgPSB7fSxcblx0XHRcdFx0XHRzdHlsZSA9IHQuc3R5bGUsXG5cdFx0XHRcdFx0dmFsLCBwLCBtcHQ7XG5cdFx0XHRcdGZvciAocCBpbiBzMikge1xuXHRcdFx0XHRcdGlmIChwICE9PSBcImNzc1RleHRcIikgaWYgKHAgIT09IFwibGVuZ3RoXCIpIGlmIChpc05hTihwKSkgaWYgKHMxW3BdICE9PSAodmFsID0gczJbcF0pIHx8IChmb3JjZUxvb2t1cCAmJiBmb3JjZUxvb2t1cFtwXSkpIGlmIChwLmluZGV4T2YoXCJPcmlnaW5cIikgPT09IC0xKSBpZiAodHlwZW9mKHZhbCkgPT09IFwibnVtYmVyXCIgfHwgdHlwZW9mKHZhbCkgPT09IFwic3RyaW5nXCIpIHtcblx0XHRcdFx0XHRcdGRpZnNbcF0gPSAodmFsID09PSBcImF1dG9cIiAmJiAocCA9PT0gXCJsZWZ0XCIgfHwgcCA9PT0gXCJ0b3BcIikpID8gX2NhbGN1bGF0ZU9mZnNldCh0LCBwKSA6ICgodmFsID09PSBcIlwiIHx8IHZhbCA9PT0gXCJhdXRvXCIgfHwgdmFsID09PSBcIm5vbmVcIikgJiYgdHlwZW9mKHMxW3BdKSA9PT0gXCJzdHJpbmdcIiAmJiBzMVtwXS5yZXBsYWNlKF9OYU5FeHAsIFwiXCIpICE9PSBcIlwiKSA/IDAgOiB2YWw7IC8vaWYgdGhlIGVuZGluZyB2YWx1ZSBpcyBkZWZhdWx0aW5nIChcIlwiIG9yIFwiYXV0b1wiKSwgd2UgY2hlY2sgdGhlIHN0YXJ0aW5nIHZhbHVlIGFuZCBpZiBpdCBjYW4gYmUgcGFyc2VkIGludG8gYSBudW1iZXIgKGEgc3RyaW5nIHdoaWNoIGNvdWxkIGhhdmUgYSBzdWZmaXggdG9vLCBsaWtlIDcwMHB4KSwgdGhlbiB3ZSBzd2FwIGluIDAgZm9yIFwiXCIgb3IgXCJhdXRvXCIgc28gdGhhdCB0aGluZ3MgYWN0dWFsbHkgdHdlZW4uXG5cdFx0XHRcdFx0XHRpZiAoc3R5bGVbcF0gIT09IHVuZGVmaW5lZCkgeyAvL2ZvciBjbGFzc05hbWUgdHdlZW5zLCB3ZSBtdXN0IHJlbWVtYmVyIHdoaWNoIHByb3BlcnRpZXMgYWxyZWFkeSBleGlzdGVkIGlubGluZSAtIHRoZSBvbmVzIHRoYXQgZGlkbid0IHNob3VsZCBiZSByZW1vdmVkIHdoZW4gdGhlIHR3ZWVuIGlzbid0IGluIHByb2dyZXNzIGJlY2F1c2UgdGhleSB3ZXJlIG9ubHkgaW50cm9kdWNlZCB0byBmYWNpbGl0YXRlIHRoZSB0cmFuc2l0aW9uIGJldHdlZW4gY2xhc3Nlcy5cblx0XHRcdFx0XHRcdFx0bXB0ID0gbmV3IE1pbmlQcm9wVHdlZW4oc3R5bGUsIHAsIHN0eWxlW3BdLCBtcHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodmFycykge1xuXHRcdFx0XHRcdGZvciAocCBpbiB2YXJzKSB7IC8vY29weSBwcm9wZXJ0aWVzIChleGNlcHQgY2xhc3NOYW1lKVxuXHRcdFx0XHRcdFx0aWYgKHAgIT09IFwiY2xhc3NOYW1lXCIpIHtcblx0XHRcdFx0XHRcdFx0ZGlmc1twXSA9IHZhcnNbcF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB7ZGlmczpkaWZzLCBmaXJzdE1QVDptcHR9O1xuXHRcdFx0fSxcblx0XHRcdF9kaW1lbnNpb25zID0ge3dpZHRoOltcIkxlZnRcIixcIlJpZ2h0XCJdLCBoZWlnaHQ6W1wiVG9wXCIsXCJCb3R0b21cIl19LFxuXHRcdFx0X21hcmdpbnMgPSBbXCJtYXJnaW5MZWZ0XCIsXCJtYXJnaW5SaWdodFwiLFwibWFyZ2luVG9wXCIsXCJtYXJnaW5Cb3R0b21cIl0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQHByaXZhdGUgR2V0cyB0aGUgd2lkdGggb3IgaGVpZ2h0IG9mIGFuIGVsZW1lbnRcblx0XHRcdCAqIEBwYXJhbSB7IU9iamVjdH0gdCBUYXJnZXQgZWxlbWVudFxuXHRcdFx0ICogQHBhcmFtIHshc3RyaW5nfSBwIFByb3BlcnR5IG5hbWUgKFwid2lkdGhcIiBvciBcImhlaWdodFwiKVxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3Q9fSBjcyBDb21wdXRlZCBzdHlsZSBvYmplY3QgKGlmIG9uZSBleGlzdHMpLiBKdXN0IGEgc3BlZWQgb3B0aW1pemF0aW9uLlxuXHRcdFx0ICogQHJldHVybiB7bnVtYmVyfSBEaW1lbnNpb24gKGluIHBpeGVscylcblx0XHRcdCAqL1xuXHRcdFx0X2dldERpbWVuc2lvbiA9IGZ1bmN0aW9uKHQsIHAsIGNzKSB7XG5cdFx0XHRcdHZhciB2ID0gcGFyc2VGbG9hdCgocCA9PT0gXCJ3aWR0aFwiKSA/IHQub2Zmc2V0V2lkdGggOiB0Lm9mZnNldEhlaWdodCksXG5cdFx0XHRcdFx0YSA9IF9kaW1lbnNpb25zW3BdLFxuXHRcdFx0XHRcdGkgPSBhLmxlbmd0aDtcblx0XHRcdFx0Y3MgPSBjcyB8fCBfZ2V0Q29tcHV0ZWRTdHlsZSh0LCBudWxsKTtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0diAtPSBwYXJzZUZsb2F0KCBfZ2V0U3R5bGUodCwgXCJwYWRkaW5nXCIgKyBhW2ldLCBjcywgdHJ1ZSkgKSB8fCAwO1xuXHRcdFx0XHRcdHYgLT0gcGFyc2VGbG9hdCggX2dldFN0eWxlKHQsIFwiYm9yZGVyXCIgKyBhW2ldICsgXCJXaWR0aFwiLCBjcywgdHJ1ZSkgKSB8fCAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB2O1xuXHRcdFx0fSxcblxuXHRcdFx0Ly8gQHByaXZhdGUgUGFyc2VzIHBvc2l0aW9uLXJlbGF0ZWQgY29tcGxleCBzdHJpbmdzIGxpa2UgXCJ0b3AgbGVmdFwiIG9yIFwiNTBweCAxMHB4XCIgb3IgXCI3MCUgMjAlXCIsIGV0Yy4gd2hpY2ggYXJlIHVzZWQgZm9yIHRoaW5ncyBsaWtlIHRyYW5zZm9ybU9yaWdpbiBvciBiYWNrZ3JvdW5kUG9zaXRpb24uIE9wdGlvbmFsbHkgZGVjb3JhdGVzIGEgc3VwcGxpZWQgb2JqZWN0IChyZWNPYmopIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOiBcIm94XCIgKG9mZnNldFgpLCBcIm95XCIgKG9mZnNldFkpLCBcIm94cFwiIChpZiB0cnVlLCBcIm94XCIgaXMgYSBwZXJjZW50YWdlIG5vdCBhIHBpeGVsIHZhbHVlKSwgYW5kIFwib3h5XCIgKGlmIHRydWUsIFwib3lcIiBpcyBhIHBlcmNlbnRhZ2Ugbm90IGEgcGl4ZWwgdmFsdWUpXG5cdFx0XHRfcGFyc2VQb3NpdGlvbiA9IGZ1bmN0aW9uKHYsIHJlY09iaikge1xuXHRcdFx0XHRpZiAodiA9PSBudWxsIHx8IHYgPT09IFwiXCIgfHwgdiA9PT0gXCJhdXRvXCIgfHwgdiA9PT0gXCJhdXRvIGF1dG9cIikgeyAvL25vdGU6IEZpcmVmb3ggdXNlcyBcImF1dG8gYXV0b1wiIGFzIGRlZmF1bHQgd2hlcmVhcyBDaHJvbWUgdXNlcyBcImF1dG9cIi5cblx0XHRcdFx0XHR2ID0gXCIwIDBcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgYSA9IHYuc3BsaXQoXCIgXCIpLFxuXHRcdFx0XHRcdHggPSAodi5pbmRleE9mKFwibGVmdFwiKSAhPT0gLTEpID8gXCIwJVwiIDogKHYuaW5kZXhPZihcInJpZ2h0XCIpICE9PSAtMSkgPyBcIjEwMCVcIiA6IGFbMF0sXG5cdFx0XHRcdFx0eSA9ICh2LmluZGV4T2YoXCJ0b3BcIikgIT09IC0xKSA/IFwiMCVcIiA6ICh2LmluZGV4T2YoXCJib3R0b21cIikgIT09IC0xKSA/IFwiMTAwJVwiIDogYVsxXTtcblx0XHRcdFx0aWYgKHkgPT0gbnVsbCkge1xuXHRcdFx0XHRcdHkgPSAoeCA9PT0gXCJjZW50ZXJcIikgPyBcIjUwJVwiIDogXCIwXCI7XG5cdFx0XHRcdH0gZWxzZSBpZiAoeSA9PT0gXCJjZW50ZXJcIikge1xuXHRcdFx0XHRcdHkgPSBcIjUwJVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh4ID09PSBcImNlbnRlclwiIHx8IChpc05hTihwYXJzZUZsb2F0KHgpKSAmJiAoeCArIFwiXCIpLmluZGV4T2YoXCI9XCIpID09PSAtMSkpIHsgLy9yZW1lbWJlciwgdGhlIHVzZXIgY291bGQgZmxpcC1mbG9wIHRoZSB2YWx1ZXMgYW5kIHNheSBcImJvdHRvbSBjZW50ZXJcIiBvciBcImNlbnRlciBib3R0b21cIiwgZXRjLiBcImNlbnRlclwiIGlzIGFtYmlndW91cyBiZWNhdXNlIGl0IGNvdWxkIGJlIHVzZWQgdG8gZGVzY3JpYmUgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCwgaGVuY2UgdGhlIGlzTmFOKCkuIElmIHRoZXJlJ3MgYW4gXCI9XCIgc2lnbiBpbiB0aGUgdmFsdWUsIGl0J3MgcmVsYXRpdmUuXG5cdFx0XHRcdFx0eCA9IFwiNTAlXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0diA9IHggKyBcIiBcIiArIHkgKyAoKGEubGVuZ3RoID4gMikgPyBcIiBcIiArIGFbMl0gOiBcIlwiKTtcblx0XHRcdFx0aWYgKHJlY09iaikge1xuXHRcdFx0XHRcdHJlY09iai5veHAgPSAoeC5pbmRleE9mKFwiJVwiKSAhPT0gLTEpO1xuXHRcdFx0XHRcdHJlY09iai5veXAgPSAoeS5pbmRleE9mKFwiJVwiKSAhPT0gLTEpO1xuXHRcdFx0XHRcdHJlY09iai5veHIgPSAoeC5jaGFyQXQoMSkgPT09IFwiPVwiKTtcblx0XHRcdFx0XHRyZWNPYmoub3lyID0gKHkuY2hhckF0KDEpID09PSBcIj1cIik7XG5cdFx0XHRcdFx0cmVjT2JqLm94ID0gcGFyc2VGbG9hdCh4LnJlcGxhY2UoX05hTkV4cCwgXCJcIikpO1xuXHRcdFx0XHRcdHJlY09iai5veSA9IHBhcnNlRmxvYXQoeS5yZXBsYWNlKF9OYU5FeHAsIFwiXCIpKTtcblx0XHRcdFx0XHRyZWNPYmoudiA9IHY7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHJlY09iaiB8fCB2O1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAcHJpdmF0ZSBUYWtlcyBhbiBlbmRpbmcgdmFsdWUgKHR5cGljYWxseSBhIHN0cmluZywgYnV0IGNhbiBiZSBhIG51bWJlcikgYW5kIGEgc3RhcnRpbmcgdmFsdWUgYW5kIHJldHVybnMgdGhlIGNoYW5nZSBiZXR3ZWVuIHRoZSB0d28sIGxvb2tpbmcgZm9yIHJlbGF0aXZlIHZhbHVlIGluZGljYXRvcnMgbGlrZSArPSBhbmQgLT0gYW5kIGl0IGFsc28gaWdub3JlcyBzdWZmaXhlcyAoYnV0IG1ha2Ugc3VyZSB0aGUgZW5kaW5nIHZhbHVlIHN0YXJ0cyB3aXRoIGEgbnVtYmVyIG9yICs9Ly09IGFuZCB0aGF0IHRoZSBzdGFydGluZyB2YWx1ZSBpcyBhIE5VTUJFUiEpXG5cdFx0XHQgKiBAcGFyYW0geyhudW1iZXJ8c3RyaW5nKX0gZSBFbmQgdmFsdWUgd2hpY2ggaXMgdHlwaWNhbGx5IGEgc3RyaW5nLCBidXQgY291bGQgYmUgYSBudW1iZXJcblx0XHRcdCAqIEBwYXJhbSB7KG51bWJlcnxzdHJpbmcpfSBiIEJlZ2lubmluZyB2YWx1ZSB3aGljaCBpcyB0eXBpY2FsbHkgYSBzdHJpbmcgYnV0IGNvdWxkIGJlIGEgbnVtYmVyXG5cdFx0XHQgKiBAcmV0dXJuIHtudW1iZXJ9IEFtb3VudCBvZiBjaGFuZ2UgYmV0d2VlbiB0aGUgYmVnaW5uaW5nIGFuZCBlbmRpbmcgdmFsdWVzIChyZWxhdGl2ZSB2YWx1ZXMgdGhhdCBoYXZlIGEgXCIrPVwiIG9yIFwiLT1cIiBhcmUgcmVjb2duaXplZClcblx0XHRcdCAqL1xuXHRcdFx0X3BhcnNlQ2hhbmdlID0gZnVuY3Rpb24oZSwgYikge1xuXHRcdFx0XHRyZXR1cm4gKHR5cGVvZihlKSA9PT0gXCJzdHJpbmdcIiAmJiBlLmNoYXJBdCgxKSA9PT0gXCI9XCIpID8gcGFyc2VJbnQoZS5jaGFyQXQoMCkgKyBcIjFcIiwgMTApICogcGFyc2VGbG9hdChlLnN1YnN0cigyKSkgOiBwYXJzZUZsb2F0KGUpIC0gcGFyc2VGbG9hdChiKTtcblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQHByaXZhdGUgVGFrZXMgYSB2YWx1ZSBhbmQgYSBkZWZhdWx0IG51bWJlciwgY2hlY2tzIGlmIHRoZSB2YWx1ZSBpcyByZWxhdGl2ZSwgbnVsbCwgb3IgbnVtZXJpYyBhbmQgc3BpdHMgYmFjayBhIG5vcm1hbGl6ZWQgbnVtYmVyIGFjY29yZGluZ2x5LiBQcmltYXJpbHkgdXNlZCBpbiB0aGUgX3BhcnNlVHJhbnNmb3JtKCkgZnVuY3Rpb24uXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdH0gdiBWYWx1ZSB0byBiZSBwYXJzZWRcblx0XHRcdCAqIEBwYXJhbSB7IW51bWJlcn0gZCBEZWZhdWx0IHZhbHVlICh3aGljaCBpcyBhbHNvIHVzZWQgZm9yIHJlbGF0aXZlIGNhbGN1bGF0aW9ucyBpZiBcIis9XCIgb3IgXCItPVwiIGlzIGZvdW5kIGluIHRoZSBmaXJzdCBwYXJhbWV0ZXIpXG5cdFx0XHQgKiBAcmV0dXJuIHtudW1iZXJ9IFBhcnNlZCB2YWx1ZVxuXHRcdFx0ICovXG5cdFx0XHRfcGFyc2VWYWwgPSBmdW5jdGlvbih2LCBkKSB7XG5cdFx0XHRcdHJldHVybiAodiA9PSBudWxsKSA/IGQgOiAodHlwZW9mKHYpID09PSBcInN0cmluZ1wiICYmIHYuY2hhckF0KDEpID09PSBcIj1cIikgPyBwYXJzZUludCh2LmNoYXJBdCgwKSArIFwiMVwiLCAxMCkgKiBwYXJzZUZsb2F0KHYuc3Vic3RyKDIpKSArIGQgOiBwYXJzZUZsb2F0KHYpO1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAcHJpdmF0ZSBUcmFuc2xhdGVzIHN0cmluZ3MgbGlrZSBcIjQwZGVnXCIgb3IgXCI0MFwiIG9yIDQwcmFkXCIgb3IgXCIrPTQwZGVnXCIgb3IgXCIyNzBfc2hvcnRcIiBvciBcIi05MF9jd1wiIG9yIFwiKz00NV9jY3dcIiB0byBhIG51bWVyaWMgcmFkaWFuIGFuZ2xlLiBPZiBjb3Vyc2UgYSBzdGFydGluZy9kZWZhdWx0IHZhbHVlIG11c3QgYmUgZmVkIGluIHRvbyBzbyB0aGF0IHJlbGF0aXZlIHZhbHVlcyBjYW4gYmUgY2FsY3VsYXRlZCBwcm9wZXJseS5cblx0XHRcdCAqIEBwYXJhbSB7T2JqZWN0fSB2IFZhbHVlIHRvIGJlIHBhcnNlZFxuXHRcdFx0ICogQHBhcmFtIHshbnVtYmVyfSBkIERlZmF1bHQgdmFsdWUgKHdoaWNoIGlzIGFsc28gdXNlZCBmb3IgcmVsYXRpdmUgY2FsY3VsYXRpb25zIGlmIFwiKz1cIiBvciBcIi09XCIgaXMgZm91bmQgaW4gdGhlIGZpcnN0IHBhcmFtZXRlcilcblx0XHRcdCAqIEBwYXJhbSB7c3RyaW5nPX0gcCBwcm9wZXJ0eSBuYW1lIGZvciBkaXJlY3Rpb25hbEVuZCAob3B0aW9uYWwgLSBvbmx5IHVzZWQgd2hlbiB0aGUgcGFyc2VkIHZhbHVlIGlzIGRpcmVjdGlvbmFsIChcIl9zaG9ydFwiLCBcIl9jd1wiLCBvciBcIl9jY3dcIiBzdWZmaXgpLiBXZSBuZWVkIGEgd2F5IHRvIHN0b3JlIHRoZSB1bmNvbXBlbnNhdGVkIHZhbHVlIHNvIHRoYXQgYXQgdGhlIGVuZCBvZiB0aGUgdHdlZW4sIHdlIHNldCBpdCB0byBleGFjdGx5IHdoYXQgd2FzIHJlcXVlc3RlZCB3aXRoIG5vIGRpcmVjdGlvbmFsIGNvbXBlbnNhdGlvbikuIFByb3BlcnR5IG5hbWUgd291bGQgYmUgXCJyb3RhdGlvblwiLCBcInJvdGF0aW9uWFwiLCBvciBcInJvdGF0aW9uWVwiXG5cdFx0XHQgKiBAcGFyYW0ge09iamVjdD19IGRpcmVjdGlvbmFsRW5kIEFuIG9iamVjdCB0aGF0IHdpbGwgc3RvcmUgdGhlIHJhdyBlbmQgdmFsdWVzIGZvciBkaXJlY3Rpb25hbCBhbmdsZXMgKFwiX3Nob3J0XCIsIFwiX2N3XCIsIG9yIFwiX2Njd1wiIHN1ZmZpeCkuIFdlIG5lZWQgYSB3YXkgdG8gc3RvcmUgdGhlIHVuY29tcGVuc2F0ZWQgdmFsdWUgc28gdGhhdCBhdCB0aGUgZW5kIG9mIHRoZSB0d2Vlbiwgd2Ugc2V0IGl0IHRvIGV4YWN0bHkgd2hhdCB3YXMgcmVxdWVzdGVkIHdpdGggbm8gZGlyZWN0aW9uYWwgY29tcGVuc2F0aW9uLlxuXHRcdFx0ICogQHJldHVybiB7bnVtYmVyfSBwYXJzZWQgYW5nbGUgaW4gcmFkaWFuc1xuXHRcdFx0ICovXG5cdFx0XHRfcGFyc2VBbmdsZSA9IGZ1bmN0aW9uKHYsIGQsIHAsIGRpcmVjdGlvbmFsRW5kKSB7XG5cdFx0XHRcdHZhciBtaW4gPSAwLjAwMDAwMSxcblx0XHRcdFx0XHRjYXAsIHNwbGl0LCBkaWYsIHJlc3VsdCwgaXNSZWxhdGl2ZTtcblx0XHRcdFx0aWYgKHYgPT0gbnVsbCkge1xuXHRcdFx0XHRcdHJlc3VsdCA9IGQ7XG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mKHYpID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdFx0cmVzdWx0ID0gdjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjYXAgPSAzNjA7XG5cdFx0XHRcdFx0c3BsaXQgPSB2LnNwbGl0KFwiX1wiKTtcblx0XHRcdFx0XHRpc1JlbGF0aXZlID0gKHYuY2hhckF0KDEpID09PSBcIj1cIik7XG5cdFx0XHRcdFx0ZGlmID0gKGlzUmVsYXRpdmUgPyBwYXJzZUludCh2LmNoYXJBdCgwKSArIFwiMVwiLCAxMCkgKiBwYXJzZUZsb2F0KHNwbGl0WzBdLnN1YnN0cigyKSkgOiBwYXJzZUZsb2F0KHNwbGl0WzBdKSkgKiAoKHYuaW5kZXhPZihcInJhZFwiKSA9PT0gLTEpID8gMSA6IF9SQUQyREVHKSAtIChpc1JlbGF0aXZlID8gMCA6IGQpO1xuXHRcdFx0XHRcdGlmIChzcGxpdC5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdGlmIChkaXJlY3Rpb25hbEVuZCkge1xuXHRcdFx0XHRcdFx0XHRkaXJlY3Rpb25hbEVuZFtwXSA9IGQgKyBkaWY7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAodi5pbmRleE9mKFwic2hvcnRcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdGRpZiA9IGRpZiAlIGNhcDtcblx0XHRcdFx0XHRcdFx0aWYgKGRpZiAhPT0gZGlmICUgKGNhcCAvIDIpKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGlmID0gKGRpZiA8IDApID8gZGlmICsgY2FwIDogZGlmIC0gY2FwO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAodi5pbmRleE9mKFwiX2N3XCIpICE9PSAtMSAmJiBkaWYgPCAwKSB7XG5cdFx0XHRcdFx0XHRcdGRpZiA9ICgoZGlmICsgY2FwICogOTk5OTk5OTk5OSkgJSBjYXApIC0gKChkaWYgLyBjYXApIHwgMCkgKiBjYXA7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHYuaW5kZXhPZihcImNjd1wiKSAhPT0gLTEgJiYgZGlmID4gMCkge1xuXHRcdFx0XHRcdFx0XHRkaWYgPSAoKGRpZiAtIGNhcCAqIDk5OTk5OTk5OTkpICUgY2FwKSAtICgoZGlmIC8gY2FwKSB8IDApICogY2FwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXN1bHQgPSBkICsgZGlmO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChyZXN1bHQgPCBtaW4gJiYgcmVzdWx0ID4gLW1pbikge1xuXHRcdFx0XHRcdHJlc3VsdCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH0sXG5cblx0XHRcdF9jb2xvckxvb2t1cCA9IHthcXVhOlswLDI1NSwyNTVdLFxuXHRcdFx0XHRsaW1lOlswLDI1NSwwXSxcblx0XHRcdFx0c2lsdmVyOlsxOTIsMTkyLDE5Ml0sXG5cdFx0XHRcdGJsYWNrOlswLDAsMF0sXG5cdFx0XHRcdG1hcm9vbjpbMTI4LDAsMF0sXG5cdFx0XHRcdHRlYWw6WzAsMTI4LDEyOF0sXG5cdFx0XHRcdGJsdWU6WzAsMCwyNTVdLFxuXHRcdFx0XHRuYXZ5OlswLDAsMTI4XSxcblx0XHRcdFx0d2hpdGU6WzI1NSwyNTUsMjU1XSxcblx0XHRcdFx0ZnVjaHNpYTpbMjU1LDAsMjU1XSxcblx0XHRcdFx0b2xpdmU6WzEyOCwxMjgsMF0sXG5cdFx0XHRcdHllbGxvdzpbMjU1LDI1NSwwXSxcblx0XHRcdFx0b3JhbmdlOlsyNTUsMTY1LDBdLFxuXHRcdFx0XHRncmF5OlsxMjgsMTI4LDEyOF0sXG5cdFx0XHRcdHB1cnBsZTpbMTI4LDAsMTI4XSxcblx0XHRcdFx0Z3JlZW46WzAsMTI4LDBdLFxuXHRcdFx0XHRyZWQ6WzI1NSwwLDBdLFxuXHRcdFx0XHRwaW5rOlsyNTUsMTkyLDIwM10sXG5cdFx0XHRcdGN5YW46WzAsMjU1LDI1NV0sXG5cdFx0XHRcdHRyYW5zcGFyZW50OlsyNTUsMjU1LDI1NSwwXX0sXG5cblx0XHRcdF9odWUgPSBmdW5jdGlvbihoLCBtMSwgbTIpIHtcblx0XHRcdFx0aCA9IChoIDwgMCkgPyBoICsgMSA6IChoID4gMSkgPyBoIC0gMSA6IGg7XG5cdFx0XHRcdHJldHVybiAoKCgoaCAqIDYgPCAxKSA/IG0xICsgKG0yIC0gbTEpICogaCAqIDYgOiAoaCA8IDAuNSkgPyBtMiA6IChoICogMyA8IDIpID8gbTEgKyAobTIgLSBtMSkgKiAoMiAvIDMgLSBoKSAqIDYgOiBtMSkgKiAyNTUpICsgMC41KSB8IDA7XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlIFBhcnNlcyBhIGNvbG9yIChsaWtlICM5RjAsICNGRjk5MDAsIG9yIHJnYigyNTUsNTEsMTUzKSkgaW50byBhbiBhcnJheSB3aXRoIDMgZWxlbWVudHMgZm9yIHJlZCwgZ3JlZW4sIGFuZCBibHVlLiBBbHNvIGhhbmRsZXMgcmdiYSgpIHZhbHVlcyAoc3BsaXRzIGludG8gYXJyYXkgb2YgNCBlbGVtZW50cyBvZiBjb3Vyc2UpXG5cdFx0XHQgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gdiBUaGUgdmFsdWUgdGhlIHNob3VsZCBiZSBwYXJzZWQgd2hpY2ggY291bGQgYmUgYSBzdHJpbmcgbGlrZSAjOUYwIG9yIHJnYigyNTUsMTAyLDUxKSBvciByZ2JhKDI1NSwwLDAsMC41KSBvciBpdCBjb3VsZCBiZSBhIG51bWJlciBsaWtlIDB4RkYwMENDIG9yIGV2ZW4gYSBuYW1lZCBjb2xvciBsaWtlIHJlZCwgYmx1ZSwgcHVycGxlLCBldGMuXG5cdFx0XHQgKiBAcmV0dXJuIHtBcnJheS48bnVtYmVyPn0gQW4gYXJyYXkgY29udGFpbmluZyByZWQsIGdyZWVuLCBhbmQgYmx1ZSAoYW5kIG9wdGlvbmFsbHkgYWxwaGEpIGluIHRoYXQgb3JkZXIuXG5cdFx0XHQgKi9cblx0XHRcdF9wYXJzZUNvbG9yID0gQ1NTUGx1Z2luLnBhcnNlQ29sb3IgPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdHZhciBjMSwgYzIsIGMzLCBoLCBzLCBsO1xuXHRcdFx0XHRpZiAoIXYgfHwgdiA9PT0gXCJcIikge1xuXHRcdFx0XHRcdHJldHVybiBfY29sb3JMb29rdXAuYmxhY2s7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR5cGVvZih2KSA9PT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRcdHJldHVybiBbdiA+PiAxNiwgKHYgPj4gOCkgJiAyNTUsIHYgJiAyNTVdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh2LmNoYXJBdCh2Lmxlbmd0aCAtIDEpID09PSBcIixcIikgeyAvL3NvbWV0aW1lcyBhIHRyYWlsaW5nIGNvbW1tYSBpcyBpbmNsdWRlZCBhbmQgd2Ugc2hvdWxkIGNob3AgaXQgb2ZmICh0eXBpY2FsbHkgZnJvbSBhIGNvbW1hLWRlbGltaXRlZCBsaXN0IG9mIHZhbHVlcyBsaWtlIGEgdGV4dFNoYWRvdzpcIjJweCAycHggMnB4IGJsdWUsIDVweCA1cHggNXB4IHJnYigyNTUsMCwwKVwiIC0gaW4gdGhpcyBleGFtcGxlIFwiYmx1ZSxcIiBoYXMgYSB0cmFpbGluZyBjb21tYS4gV2UgY291bGQgc3RyaXAgaXQgb3V0IGluc2lkZSBwYXJzZUNvbXBsZXgoKSBidXQgd2UnZCBuZWVkIHRvIGRvIGl0IHRvIHRoZSBiZWdpbm5pbmcgYW5kIGVuZGluZyB2YWx1ZXMgcGx1cyBpdCB3b3VsZG4ndCBwcm92aWRlIHByb3RlY3Rpb24gZnJvbSBvdGhlciBwb3RlbnRpYWwgc2NlbmFyaW9zIGxpa2UgaWYgdGhlIHVzZXIgcGFzc2VzIGluIGEgc2ltaWxhciB2YWx1ZS5cblx0XHRcdFx0XHR2ID0gdi5zdWJzdHIoMCwgdi5sZW5ndGggLSAxKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoX2NvbG9yTG9va3VwW3ZdKSB7XG5cdFx0XHRcdFx0cmV0dXJuIF9jb2xvckxvb2t1cFt2XTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodi5jaGFyQXQoMCkgPT09IFwiI1wiKSB7XG5cdFx0XHRcdFx0aWYgKHYubGVuZ3RoID09PSA0KSB7IC8vZm9yIHNob3J0aGFuZCBsaWtlICM5RjBcblx0XHRcdFx0XHRcdGMxID0gdi5jaGFyQXQoMSksXG5cdFx0XHRcdFx0XHRjMiA9IHYuY2hhckF0KDIpLFxuXHRcdFx0XHRcdFx0YzMgPSB2LmNoYXJBdCgzKTtcblx0XHRcdFx0XHRcdHYgPSBcIiNcIiArIGMxICsgYzEgKyBjMiArIGMyICsgYzMgKyBjMztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0diA9IHBhcnNlSW50KHYuc3Vic3RyKDEpLCAxNik7XG5cdFx0XHRcdFx0cmV0dXJuIFt2ID4+IDE2LCAodiA+PiA4KSAmIDI1NSwgdiAmIDI1NV07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHYuc3Vic3RyKDAsIDMpID09PSBcImhzbFwiKSB7XG5cdFx0XHRcdFx0diA9IHYubWF0Y2goX251bUV4cCk7XG5cdFx0XHRcdFx0aCA9IChOdW1iZXIodlswXSkgJSAzNjApIC8gMzYwO1xuXHRcdFx0XHRcdHMgPSBOdW1iZXIodlsxXSkgLyAxMDA7XG5cdFx0XHRcdFx0bCA9IE51bWJlcih2WzJdKSAvIDEwMDtcblx0XHRcdFx0XHRjMiA9IChsIDw9IDAuNSkgPyBsICogKHMgKyAxKSA6IGwgKyBzIC0gbCAqIHM7XG5cdFx0XHRcdFx0YzEgPSBsICogMiAtIGMyO1xuXHRcdFx0XHRcdGlmICh2Lmxlbmd0aCA+IDMpIHtcblx0XHRcdFx0XHRcdHZbM10gPSBOdW1iZXIodlszXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHZbMF0gPSBfaHVlKGggKyAxIC8gMywgYzEsIGMyKTtcblx0XHRcdFx0XHR2WzFdID0gX2h1ZShoLCBjMSwgYzIpO1xuXHRcdFx0XHRcdHZbMl0gPSBfaHVlKGggLSAxIC8gMywgYzEsIGMyKTtcblx0XHRcdFx0XHRyZXR1cm4gdjtcblx0XHRcdFx0fVxuXHRcdFx0XHR2ID0gdi5tYXRjaChfbnVtRXhwKSB8fCBfY29sb3JMb29rdXAudHJhbnNwYXJlbnQ7XG5cdFx0XHRcdHZbMF0gPSBOdW1iZXIodlswXSk7XG5cdFx0XHRcdHZbMV0gPSBOdW1iZXIodlsxXSk7XG5cdFx0XHRcdHZbMl0gPSBOdW1iZXIodlsyXSk7XG5cdFx0XHRcdGlmICh2Lmxlbmd0aCA+IDMpIHtcblx0XHRcdFx0XHR2WzNdID0gTnVtYmVyKHZbM10pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB2O1xuXHRcdFx0fSxcblx0XHRcdF9jb2xvckV4cCA9IFwiKD86XFxcXGIoPzooPzpyZ2J8cmdiYXxoc2x8aHNsYSlcXFxcKC4rP1xcXFwpKXxcXFxcQiMuKz9cXFxcYlwiOyAvL3dlJ2xsIGR5bmFtaWNhbGx5IGJ1aWxkIHRoaXMgUmVndWxhciBFeHByZXNzaW9uIHRvIGNvbnNlcnZlIGZpbGUgc2l6ZS4gQWZ0ZXIgYnVpbGRpbmcgaXQsIGl0IHdpbGwgYmUgYWJsZSB0byBmaW5kIHJnYigpLCByZ2JhKCksICMgKGhleGFkZWNpbWFsKSwgYW5kIG5hbWVkIGNvbG9yIHZhbHVlcyBsaWtlIHJlZCwgYmx1ZSwgcHVycGxlLCBldGMuXG5cblx0XHRmb3IgKHAgaW4gX2NvbG9yTG9va3VwKSB7XG5cdFx0XHRfY29sb3JFeHAgKz0gXCJ8XCIgKyBwICsgXCJcXFxcYlwiO1xuXHRcdH1cblx0XHRfY29sb3JFeHAgPSBuZXcgUmVnRXhwKF9jb2xvckV4cCtcIilcIiwgXCJnaVwiKTtcblxuXHRcdC8qKlxuXHRcdCAqIEBwcml2YXRlIFJldHVybnMgYSBmb3JtYXR0ZXIgZnVuY3Rpb24gdGhhdCBoYW5kbGVzIHRha2luZyBhIHN0cmluZyAob3IgbnVtYmVyIGluIHNvbWUgY2FzZXMpIGFuZCByZXR1cm5pbmcgYSBjb25zaXN0ZW50bHkgZm9ybWF0dGVkIG9uZSBpbiB0ZXJtcyBvZiBkZWxpbWl0ZXJzLCBxdWFudGl0eSBvZiB2YWx1ZXMsIGV0Yy4gRm9yIGV4YW1wbGUsIHdlIG1heSBnZXQgYm94U2hhZG93IHZhbHVlcyBkZWZpbmVkIGFzIFwiMHB4IHJlZFwiIG9yIFwiMHB4IDBweCAxMHB4IHJnYigyNTUsMCwwKVwiIG9yIFwiMHB4IDBweCAyMHB4IDIwcHggI0YwMFwiIGFuZCB3ZSBuZWVkIHRvIGVuc3VyZSB0aGF0IHdoYXQgd2UgZ2V0IGJhY2sgaXMgZGVzY3JpYmVkIHdpdGggNCBudW1iZXJzIGFuZCBhIGNvbG9yLiBUaGlzIGFsbG93cyB1cyB0byBmZWVkIGl0IGludG8gdGhlIF9wYXJzZUNvbXBsZXgoKSBtZXRob2QgYW5kIHNwbGl0IHRoZSB2YWx1ZXMgdXAgYXBwcm9wcmlhdGVseS4gVGhlIG5lYXQgdGhpbmcgYWJvdXQgdGhpcyBfZ2V0Rm9ybWF0dGVyKCkgZnVuY3Rpb24gaXMgdGhhdCB0aGUgZGZsdCBkZWZpbmVzIGEgcGF0dGVybiBhcyB3ZWxsIGFzIGEgZGVmYXVsdCwgc28gZm9yIGV4YW1wbGUsIF9nZXRGb3JtYXR0ZXIoXCIwcHggMHB4IDBweCAwcHggIzc3N1wiLCB0cnVlKSBub3Qgb25seSBzZXRzIHRoZSBkZWZhdWx0IGFzIDBweCBmb3IgYWxsIGRpc3RhbmNlcyBhbmQgIzc3NyBmb3IgdGhlIGNvbG9yLCBidXQgYWxzbyBzZXRzIHRoZSBwYXR0ZXJuIHN1Y2ggdGhhdCA0IG51bWJlcnMgYW5kIGEgY29sb3Igd2lsbCBhbHdheXMgZ2V0IHJldHVybmVkLlxuXHRcdCAqIEBwYXJhbSB7IXN0cmluZ30gZGZsdCBUaGUgZGVmYXVsdCB2YWx1ZSBhbmQgcGF0dGVybiB0byBmb2xsb3cuIFNvIFwiMHB4IDBweCAwcHggMHB4ICM3NzdcIiB3aWxsIGVuc3VyZSB0aGF0IDQgbnVtYmVycyBhbmQgYSBjb2xvciB3aWxsIGFsd2F5cyBnZXQgcmV0dXJuZWQuXG5cdFx0ICogQHBhcmFtIHtib29sZWFuPX0gY2xyIElmIHRydWUsIHRoZSB2YWx1ZXMgc2hvdWxkIGJlIHNlYXJjaGVkIGZvciBjb2xvci1yZWxhdGVkIGRhdGEuIEZvciBleGFtcGxlLCBib3hTaGFkb3cgdmFsdWVzIHR5cGljYWxseSBjb250YWluIGEgY29sb3Igd2hlcmVhcyBib3JkZXJSYWRpdXMgZG9uJ3QuXG5cdFx0ICogQHBhcmFtIHtib29sZWFuPX0gY29sbGFwc2libGUgSWYgdHJ1ZSwgdGhlIHZhbHVlIGlzIGEgdG9wL2xlZnQvcmlnaHQvYm90dG9tIHN0eWxlIG9uZSB0aGF0IGFjdHMgbGlrZSBtYXJnaW4gb3IgcGFkZGluZywgd2hlcmUgaWYgb25seSBvbmUgdmFsdWUgaXMgcmVjZWl2ZWQsIGl0J3MgdXNlZCBmb3IgYWxsIDQ7IGlmIDIgYXJlIHJlY2VpdmVkLCB0aGUgZmlyc3QgaXMgZHVwbGljYXRlZCBmb3IgM3JkIChib3R0b20pIGFuZCB0aGUgMm5kIGlzIGR1cGxpY2F0ZWQgZm9yIHRoZSA0dGggc3BvdCAobGVmdCksIGV0Yy5cblx0XHQgKiBAcmV0dXJuIHtGdW5jdGlvbn0gZm9ybWF0dGVyIGZ1bmN0aW9uXG5cdFx0ICovXG5cdFx0dmFyIF9nZXRGb3JtYXR0ZXIgPSBmdW5jdGlvbihkZmx0LCBjbHIsIGNvbGxhcHNpYmxlLCBtdWx0aSkge1xuXHRcdFx0XHRpZiAoZGZsdCA9PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHYpIHtyZXR1cm4gdjt9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciBkQ29sb3IgPSBjbHIgPyAoZGZsdC5tYXRjaChfY29sb3JFeHApIHx8IFtcIlwiXSlbMF0gOiBcIlwiLFxuXHRcdFx0XHRcdGRWYWxzID0gZGZsdC5zcGxpdChkQ29sb3IpLmpvaW4oXCJcIikubWF0Y2goX3ZhbHVlc0V4cCkgfHwgW10sXG5cdFx0XHRcdFx0cGZ4ID0gZGZsdC5zdWJzdHIoMCwgZGZsdC5pbmRleE9mKGRWYWxzWzBdKSksXG5cdFx0XHRcdFx0c2Z4ID0gKGRmbHQuY2hhckF0KGRmbHQubGVuZ3RoIC0gMSkgPT09IFwiKVwiKSA/IFwiKVwiIDogXCJcIixcblx0XHRcdFx0XHRkZWxpbSA9IChkZmx0LmluZGV4T2YoXCIgXCIpICE9PSAtMSkgPyBcIiBcIiA6IFwiLFwiLFxuXHRcdFx0XHRcdG51bVZhbHMgPSBkVmFscy5sZW5ndGgsXG5cdFx0XHRcdFx0ZFNmeCA9IChudW1WYWxzID4gMCkgPyBkVmFsc1swXS5yZXBsYWNlKF9udW1FeHAsIFwiXCIpIDogXCJcIixcblx0XHRcdFx0XHRmb3JtYXR0ZXI7XG5cdFx0XHRcdGlmICghbnVtVmFscykge1xuXHRcdFx0XHRcdHJldHVybiBmdW5jdGlvbih2KSB7cmV0dXJuIHY7fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2xyKSB7XG5cdFx0XHRcdFx0Zm9ybWF0dGVyID0gZnVuY3Rpb24odikge1xuXHRcdFx0XHRcdFx0dmFyIGNvbG9yLCB2YWxzLCBpLCBhO1xuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZih2KSA9PT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRcdFx0XHR2ICs9IGRTZng7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKG11bHRpICYmIF9jb21tYXNPdXRzaWRlUGFyZW5FeHAudGVzdCh2KSkge1xuXHRcdFx0XHRcdFx0XHRhID0gdi5yZXBsYWNlKF9jb21tYXNPdXRzaWRlUGFyZW5FeHAsIFwifFwiKS5zcGxpdChcInxcIik7XG5cdFx0XHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0YVtpXSA9IGZvcm1hdHRlcihhW2ldKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gYS5qb2luKFwiLFwiKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGNvbG9yID0gKHYubWF0Y2goX2NvbG9yRXhwKSB8fCBbZENvbG9yXSlbMF07XG5cdFx0XHRcdFx0XHR2YWxzID0gdi5zcGxpdChjb2xvcikuam9pbihcIlwiKS5tYXRjaChfdmFsdWVzRXhwKSB8fCBbXTtcblx0XHRcdFx0XHRcdGkgPSB2YWxzLmxlbmd0aDtcblx0XHRcdFx0XHRcdGlmIChudW1WYWxzID4gaS0tKSB7XG5cdFx0XHRcdFx0XHRcdHdoaWxlICgrK2kgPCBudW1WYWxzKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFsc1tpXSA9IGNvbGxhcHNpYmxlID8gdmFsc1soKChpIC0gMSkgLyAyKSB8IDApXSA6IGRWYWxzW2ldO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gcGZ4ICsgdmFscy5qb2luKGRlbGltKSArIGRlbGltICsgY29sb3IgKyBzZnggKyAodi5pbmRleE9mKFwiaW5zZXRcIikgIT09IC0xID8gXCIgaW5zZXRcIiA6IFwiXCIpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0cmV0dXJuIGZvcm1hdHRlcjtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdGZvcm1hdHRlciA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0XHR2YXIgdmFscywgYSwgaTtcblx0XHRcdFx0XHRpZiAodHlwZW9mKHYpID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdFx0XHR2ICs9IGRTZng7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChtdWx0aSAmJiBfY29tbWFzT3V0c2lkZVBhcmVuRXhwLnRlc3QodikpIHtcblx0XHRcdFx0XHRcdGEgPSB2LnJlcGxhY2UoX2NvbW1hc091dHNpZGVQYXJlbkV4cCwgXCJ8XCIpLnNwbGl0KFwifFwiKTtcblx0XHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdGFbaV0gPSBmb3JtYXR0ZXIoYVtpXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gYS5qb2luKFwiLFwiKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFscyA9IHYubWF0Y2goX3ZhbHVlc0V4cCkgfHwgW107XG5cdFx0XHRcdFx0aSA9IHZhbHMubGVuZ3RoO1xuXHRcdFx0XHRcdGlmIChudW1WYWxzID4gaS0tKSB7XG5cdFx0XHRcdFx0XHR3aGlsZSAoKytpIDwgbnVtVmFscykge1xuXHRcdFx0XHRcdFx0XHR2YWxzW2ldID0gY29sbGFwc2libGUgPyB2YWxzWygoKGkgLSAxKSAvIDIpIHwgMCldIDogZFZhbHNbaV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBwZnggKyB2YWxzLmpvaW4oZGVsaW0pICsgc2Z4O1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXR1cm4gZm9ybWF0dGVyO1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAcHJpdmF0ZSByZXR1cm5zIGEgZm9ybWF0dGVyIGZ1bmN0aW9uIHRoYXQncyB1c2VkIGZvciBlZGdlLXJlbGF0ZWQgdmFsdWVzIGxpa2UgbWFyZ2luVG9wLCBtYXJnaW5MZWZ0LCBwYWRkaW5nQm90dG9tLCBwYWRkaW5nUmlnaHQsIGV0Yy4gSnVzdCBwYXNzIGEgY29tbWEtZGVsaW1pdGVkIGxpc3Qgb2YgcHJvcGVydHkgbmFtZXMgcmVsYXRlZCB0byB0aGUgZWRnZXMuXG5cdFx0XHQgKiBAcGFyYW0geyFzdHJpbmd9IHByb3BzIGEgY29tbWEtZGVsaW1pdGVkIGxpc3Qgb2YgcHJvcGVydHkgbmFtZXMgaW4gb3JkZXIgZnJvbSB0b3AgdG8gbGVmdCwgbGlrZSBcIm1hcmdpblRvcCxtYXJnaW5SaWdodCxtYXJnaW5Cb3R0b20sbWFyZ2luTGVmdFwiXG5cdFx0XHQgKiBAcmV0dXJuIHtGdW5jdGlvbn0gYSBmb3JtYXR0ZXIgZnVuY3Rpb25cblx0XHRcdCAqL1xuXHRcdFx0X2dldEVkZ2VQYXJzZXIgPSBmdW5jdGlvbihwcm9wcykge1xuXHRcdFx0XHRwcm9wcyA9IHByb3BzLnNwbGl0KFwiLFwiKTtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4sIHZhcnMpIHtcblx0XHRcdFx0XHR2YXIgYSA9IChlICsgXCJcIikuc3BsaXQoXCIgXCIpLFxuXHRcdFx0XHRcdFx0aTtcblx0XHRcdFx0XHR2YXJzID0ge307XG5cdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IDQ7IGkrKykge1xuXHRcdFx0XHRcdFx0dmFyc1twcm9wc1tpXV0gPSBhW2ldID0gYVtpXSB8fCBhWygoKGkgLSAxKSAvIDIpID4+IDApXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGNzc3AucGFyc2UodCwgdmFycywgcHQsIHBsdWdpbik7XG5cdFx0XHRcdH07XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBAcHJpdmF0ZSB1c2VkIHdoZW4gb3RoZXIgcGx1Z2lucyBtdXN0IHR3ZWVuIHZhbHVlcyBmaXJzdCwgbGlrZSBCZXppZXJQbHVnaW4gb3IgVGhyb3dQcm9wc1BsdWdpbiwgZXRjLiBUaGF0IHBsdWdpbidzIHNldFJhdGlvKCkgZ2V0cyBjYWxsZWQgZmlyc3Qgc28gdGhhdCB0aGUgdmFsdWVzIGFyZSB1cGRhdGVkLCBhbmQgdGhlbiB3ZSBsb29wIHRocm91Z2ggdGhlIE1pbmlQcm9wVHdlZW5zICB3aGljaCBoYW5kbGUgY29weWluZyB0aGUgdmFsdWVzIGludG8gdGhlaXIgYXBwcm9wcmlhdGUgc2xvdHMgc28gdGhhdCB0aGV5IGNhbiB0aGVuIGJlIGFwcGxpZWQgY29ycmVjdGx5IGluIHRoZSBtYWluIENTU1BsdWdpbiBzZXRSYXRpbygpIG1ldGhvZC4gUmVtZW1iZXIsIHdlIHR5cGljYWxseSBjcmVhdGUgYSBwcm94eSBvYmplY3QgdGhhdCBoYXMgYSBidW5jaCBvZiB1bmlxdWVseS1uYW1lZCBwcm9wZXJ0aWVzIHRoYXQgd2UgZmVlZCB0byB0aGUgc3ViLXBsdWdpbiBhbmQgaXQgZG9lcyBpdHMgbWFnaWMgbm9ybWFsbHksIGFuZCB0aGVuIHdlIG11c3QgaW50ZXJwcmV0IHRob3NlIHZhbHVlcyBhbmQgYXBwbHkgdGhlbSB0byB0aGUgY3NzIGJlY2F1c2Ugb2Z0ZW4gbnVtYmVycyBtdXN0IGdldCBjb21iaW5lZC9jb25jYXRlbmF0ZWQsIHN1ZmZpeGVzIGFkZGVkLCBldGMuIHRvIHdvcmsgd2l0aCBjc3MsIGxpa2UgYm94U2hhZG93IGNvdWxkIGhhdmUgNCB2YWx1ZXMgcGx1cyBhIGNvbG9yLlxuXHRcdFx0X3NldFBsdWdpblJhdGlvID0gX2ludGVybmFscy5fc2V0UGx1Z2luUmF0aW8gPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdHRoaXMucGx1Z2luLnNldFJhdGlvKHYpO1xuXHRcdFx0XHR2YXIgZCA9IHRoaXMuZGF0YSxcblx0XHRcdFx0XHRwcm94eSA9IGQucHJveHksXG5cdFx0XHRcdFx0bXB0ID0gZC5maXJzdE1QVCxcblx0XHRcdFx0XHRtaW4gPSAwLjAwMDAwMSxcblx0XHRcdFx0XHR2YWwsIHB0LCBpLCBzdHI7XG5cdFx0XHRcdHdoaWxlIChtcHQpIHtcblx0XHRcdFx0XHR2YWwgPSBwcm94eVttcHQudl07XG5cdFx0XHRcdFx0aWYgKG1wdC5yKSB7XG5cdFx0XHRcdFx0XHR2YWwgPSBNYXRoLnJvdW5kKHZhbCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh2YWwgPCBtaW4gJiYgdmFsID4gLW1pbikge1xuXHRcdFx0XHRcdFx0dmFsID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bXB0LnRbbXB0LnBdID0gdmFsO1xuXHRcdFx0XHRcdG1wdCA9IG1wdC5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZC5hdXRvUm90YXRlKSB7XG5cdFx0XHRcdFx0ZC5hdXRvUm90YXRlLnJvdGF0aW9uID0gcHJveHkucm90YXRpb247XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9hdCB0aGUgZW5kLCB3ZSBtdXN0IHNldCB0aGUgQ1NTUHJvcFR3ZWVuJ3MgXCJlXCIgKGVuZCkgdmFsdWUgZHluYW1pY2FsbHkgaGVyZSBiZWNhdXNlIHRoYXQncyB3aGF0IGlzIHVzZWQgaW4gdGhlIGZpbmFsIHNldFJhdGlvKCkgbWV0aG9kLlxuXHRcdFx0XHRpZiAodiA9PT0gMSkge1xuXHRcdFx0XHRcdG1wdCA9IGQuZmlyc3RNUFQ7XG5cdFx0XHRcdFx0d2hpbGUgKG1wdCkge1xuXHRcdFx0XHRcdFx0cHQgPSBtcHQudDtcblx0XHRcdFx0XHRcdGlmICghcHQudHlwZSkge1xuXHRcdFx0XHRcdFx0XHRwdC5lID0gcHQucyArIHB0LnhzMDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAocHQudHlwZSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRzdHIgPSBwdC54czAgKyBwdC5zICsgcHQueHMxO1xuXHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAxOyBpIDwgcHQubDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0c3RyICs9IHB0W1wieG5cIitpXSArIHB0W1wieHNcIisoaSsxKV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cHQuZSA9IHN0cjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdG1wdCA9IG1wdC5fbmV4dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQHByaXZhdGUgQGNvbnN0cnVjdG9yIFVzZWQgYnkgYSBmZXcgU3BlY2lhbFByb3BzIHRvIGhvbGQgaW1wb3J0YW50IHZhbHVlcyBmb3IgcHJveGllcy4gRm9yIGV4YW1wbGUsIF9wYXJzZVRvUHJveHkoKSBjcmVhdGVzIGEgTWluaVByb3BUd2VlbiBpbnN0YW5jZSBmb3IgZWFjaCBwcm9wZXJ0eSB0aGF0IG11c3QgZ2V0IHR3ZWVuZWQgb24gdGhlIHByb3h5LCBhbmQgd2UgcmVjb3JkIHRoZSBvcmlnaW5hbCBwcm9wZXJ0eSBuYW1lIGFzIHdlbGwgYXMgdGhlIHVuaXF1ZSBvbmUgd2UgY3JlYXRlIGZvciB0aGUgcHJveHksIHBsdXMgd2hldGhlciBvciBub3QgdGhlIHZhbHVlIG5lZWRzIHRvIGJlIHJvdW5kZWQgcGx1cyB0aGUgb3JpZ2luYWwgdmFsdWUuXG5cdFx0XHQgKiBAcGFyYW0geyFPYmplY3R9IHQgdGFyZ2V0IG9iamVjdCB3aG9zZSBwcm9wZXJ0eSB3ZSdyZSB0d2VlbmluZyAob2Z0ZW4gYSBDU1NQcm9wVHdlZW4pXG5cdFx0XHQgKiBAcGFyYW0geyFzdHJpbmd9IHAgcHJvcGVydHkgbmFtZVxuXHRcdFx0ICogQHBhcmFtIHsobnVtYmVyfHN0cmluZ3xvYmplY3QpfSB2IHZhbHVlXG5cdFx0XHQgKiBAcGFyYW0ge01pbmlQcm9wVHdlZW49fSBuZXh0IG5leHQgTWluaVByb3BUd2VlbiBpbiB0aGUgbGlua2VkIGxpc3Rcblx0XHRcdCAqIEBwYXJhbSB7Ym9vbGVhbj19IHIgaWYgdHJ1ZSwgdGhlIHR3ZWVuZWQgdmFsdWUgc2hvdWxkIGJlIHJvdW5kZWQgdG8gdGhlIG5lYXJlc3QgaW50ZWdlclxuXHRcdFx0ICovXG5cdFx0XHRNaW5pUHJvcFR3ZWVuID0gZnVuY3Rpb24odCwgcCwgdiwgbmV4dCwgcikge1xuXHRcdFx0XHR0aGlzLnQgPSB0O1xuXHRcdFx0XHR0aGlzLnAgPSBwO1xuXHRcdFx0XHR0aGlzLnYgPSB2O1xuXHRcdFx0XHR0aGlzLnIgPSByO1xuXHRcdFx0XHRpZiAobmV4dCkge1xuXHRcdFx0XHRcdG5leHQuX3ByZXYgPSB0aGlzO1xuXHRcdFx0XHRcdHRoaXMuX25leHQgPSBuZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEBwcml2YXRlIE1vc3Qgb3RoZXIgcGx1Z2lucyAobGlrZSBCZXppZXJQbHVnaW4gYW5kIFRocm93UHJvcHNQbHVnaW4gYW5kIG90aGVycykgY2FuIG9ubHkgdHdlZW4gbnVtZXJpYyB2YWx1ZXMsIGJ1dCBDU1NQbHVnaW4gbXVzdCBhY2NvbW1vZGF0ZSBzcGVjaWFsIHZhbHVlcyB0aGF0IGhhdmUgYSBidW5jaCBvZiBleHRyYSBkYXRhIChsaWtlIGEgc3VmZml4IG9yIHN0cmluZ3MgYmV0d2VlbiBudW1lcmljIHZhbHVlcywgZXRjLikuIEZvciBleGFtcGxlLCBib3hTaGFkb3cgaGFzIHZhbHVlcyBsaWtlIFwiMTBweCAxMHB4IDIwcHggMzBweCByZ2IoMjU1LDAsMClcIiB3aGljaCB3b3VsZCB1dHRlcmx5IGNvbmZ1c2Ugb3RoZXIgcGx1Z2lucy4gVGhpcyBtZXRob2QgYWxsb3dzIHVzIHRvIHNwbGl0IHRoYXQgZGF0YSBhcGFydCBhbmQgZ3JhYiBvbmx5IHRoZSBudW1lcmljIGRhdGEgYW5kIGF0dGFjaCBpdCB0byB1bmlxdWVseS1uYW1lZCBwcm9wZXJ0aWVzIG9mIGEgZ2VuZXJpYyBwcm94eSBvYmplY3QgKHt9KSBzbyB0aGF0IHdlIGNhbiBmZWVkIHRoYXQgdG8gdmlydHVhbGx5IGFueSBwbHVnaW4gdG8gaGF2ZSB0aGUgbnVtYmVycyB0d2VlbmVkLiBIb3dldmVyLCB3ZSBtdXN0IGFsc28ga2VlcCB0cmFjayBvZiB3aGljaCBwcm9wZXJ0aWVzIGZyb20gdGhlIHByb3h5IGdvIHdpdGggd2hpY2ggQ1NTUHJvcFR3ZWVuIHZhbHVlcyBhbmQgaW5zdGFuY2VzLiBTbyB3ZSBjcmVhdGUgYSBsaW5rZWQgbGlzdCBvZiBNaW5pUHJvcFR3ZWVucy4gRWFjaCBvbmUgcmVjb3JkcyBhIHRhcmdldCAodGhlIG9yaWdpbmFsIENTU1Byb3BUd2VlbiksIHByb3BlcnR5IChsaWtlIFwic1wiIG9yIFwieG4xXCIgb3IgXCJ4bjJcIikgdGhhdCB3ZSdyZSB0d2VlbmluZyBhbmQgdGhlIHVuaXF1ZSBwcm9wZXJ0eSBuYW1lIHRoYXQgd2FzIHVzZWQgZm9yIHRoZSBwcm94eSAobGlrZSBcImJveFNoYWRvd194bjFcIiBhbmQgXCJib3hTaGFkb3dfeG4yXCIpIGFuZCB3aGV0aGVyIG9yIG5vdCB0aGV5IG5lZWQgdG8gYmUgcm91bmRlZC4gVGhhdCB3YXksIGluIHRoZSBfc2V0UGx1Z2luUmF0aW8oKSBtZXRob2Qgd2UgY2FuIHNpbXBseSBjb3B5IHRoZSB2YWx1ZXMgb3ZlciBmcm9tIHRoZSBwcm94eSB0byB0aGUgQ1NTUHJvcFR3ZWVuIGluc3RhbmNlKHMpLiBUaGVuLCB3aGVuIHRoZSBtYWluIENTU1BsdWdpbiBzZXRSYXRpbygpIG1ldGhvZCBydW5zIGFuZCBhcHBsaWVzIHRoZSBDU1NQcm9wVHdlZW4gdmFsdWVzIGFjY29yZGluZ2x5LCB0aGV5J3JlIHVwZGF0ZWQgbmljZWx5LiBTbyB0aGUgZXh0ZXJuYWwgcGx1Z2luIHR3ZWVucyB0aGUgbnVtYmVycywgX3NldFBsdWdpblJhdGlvKCkgY29waWVzIHRoZW0gb3ZlciwgYW5kIHNldFJhdGlvKCkgYWN0cyBub3JtYWxseSwgYXBwbHlpbmcgY3NzLXNwZWNpZmljIHZhbHVlcyB0byB0aGUgZWxlbWVudC5cblx0XHRcdCAqIFRoaXMgbWV0aG9kIHJldHVybnMgYW4gb2JqZWN0IHRoYXQgaGFzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcblx0XHRcdCAqICAtIHByb3h5OiBhIGdlbmVyaWMgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHN0YXJ0aW5nIHZhbHVlcyBmb3IgYWxsIHRoZSBwcm9wZXJ0aWVzIHRoYXQgd2lsbCBiZSB0d2VlbmVkIGJ5IHRoZSBleHRlcm5hbCBwbHVnaW4uICBUaGlzIGlzIHdoYXQgd2UgZmVlZCB0byB0aGUgZXh0ZXJuYWwgX29uSW5pdFR3ZWVuKCkgYXMgdGhlIHRhcmdldFxuXHRcdFx0ICogIC0gZW5kOiBhIGdlbmVyaWMgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGVuZGluZyB2YWx1ZXMgZm9yIGFsbCB0aGUgcHJvcGVydGllcyB0aGF0IHdpbGwgYmUgdHdlZW5lZCBieSB0aGUgZXh0ZXJuYWwgcGx1Z2luLiBUaGlzIGlzIHdoYXQgd2UgZmVlZCB0byB0aGUgZXh0ZXJuYWwgcGx1Z2luJ3MgX29uSW5pdFR3ZWVuKCkgYXMgdGhlIGRlc3RpbmF0aW9uIHZhbHVlc1xuXHRcdFx0ICogIC0gZmlyc3RNUFQ6IHRoZSBmaXJzdCBNaW5pUHJvcFR3ZWVuIGluIHRoZSBsaW5rZWQgbGlzdFxuXHRcdFx0ICogIC0gcHQ6IHRoZSBmaXJzdCBDU1NQcm9wVHdlZW4gaW4gdGhlIGxpbmtlZCBsaXN0IHRoYXQgd2FzIGNyZWF0ZWQgd2hlbiBwYXJzaW5nLiBJZiBzaGFsbG93IGlzIHRydWUsIHRoaXMgbGlua2VkIGxpc3Qgd2lsbCBOT1QgYXR0YWNoIHRvIHRoZSBvbmUgcGFzc2VkIGludG8gdGhlIF9wYXJzZVRvUHJveHkoKSBhcyB0aGUgXCJwdFwiICg0dGgpIHBhcmFtZXRlci5cblx0XHRcdCAqIEBwYXJhbSB7IU9iamVjdH0gdCB0YXJnZXQgb2JqZWN0IHRvIGJlIHR3ZWVuZWRcblx0XHRcdCAqIEBwYXJhbSB7IShPYmplY3R8c3RyaW5nKX0gdmFycyB0aGUgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGluZm9ybWF0aW9uIGFib3V0IHRoZSB0d2VlbmluZyB2YWx1ZXMgKHR5cGljYWxseSB0aGUgZW5kL2Rlc3RpbmF0aW9uIHZhbHVlcykgdGhhdCBzaG91bGQgYmUgcGFyc2VkXG5cdFx0XHQgKiBAcGFyYW0geyFDU1NQbHVnaW59IGNzc3AgVGhlIENTU1BsdWdpbiBpbnN0YW5jZVxuXHRcdFx0ICogQHBhcmFtIHtDU1NQcm9wVHdlZW49fSBwdCB0aGUgbmV4dCBDU1NQcm9wVHdlZW4gaW4gdGhlIGxpbmtlZCBsaXN0XG5cdFx0XHQgKiBAcGFyYW0ge1R3ZWVuUGx1Z2luPX0gcGx1Z2luIHRoZSBleHRlcm5hbCBUd2VlblBsdWdpbiBpbnN0YW5jZSB0aGF0IHdpbGwgYmUgaGFuZGxpbmcgdHdlZW5pbmcgdGhlIG51bWVyaWMgdmFsdWVzXG5cdFx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSBzaGFsbG93IGlmIHRydWUsIHRoZSByZXN1bHRpbmcgbGlua2VkIGxpc3QgZnJvbSB0aGUgcGFyc2Ugd2lsbCBOT1QgYmUgYXR0YWNoZWQgdG8gdGhlIENTU1Byb3BUd2VlbiB0aGF0IHdhcyBwYXNzZWQgaW4gYXMgdGhlIFwicHRcIiAoNHRoKSBwYXJhbWV0ZXIuXG5cdFx0XHQgKiBAcmV0dXJuIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczogcHJveHksIGVuZCwgZmlyc3RNUFQsIGFuZCBwdCAoc2VlIGFib3ZlIGZvciBkZXNjcmlwdGlvbnMpXG5cdFx0XHQgKi9cblx0XHRcdF9wYXJzZVRvUHJveHkgPSBfaW50ZXJuYWxzLl9wYXJzZVRvUHJveHkgPSBmdW5jdGlvbih0LCB2YXJzLCBjc3NwLCBwdCwgcGx1Z2luLCBzaGFsbG93KSB7XG5cdFx0XHRcdHZhciBicHQgPSBwdCxcblx0XHRcdFx0XHRzdGFydCA9IHt9LFxuXHRcdFx0XHRcdGVuZCA9IHt9LFxuXHRcdFx0XHRcdHRyYW5zZm9ybSA9IGNzc3AuX3RyYW5zZm9ybSxcblx0XHRcdFx0XHRvbGRGb3JjZSA9IF9mb3JjZVBULFxuXHRcdFx0XHRcdGksIHAsIHhwLCBtcHQsIGZpcnN0UFQ7XG5cdFx0XHRcdGNzc3AuX3RyYW5zZm9ybSA9IG51bGw7XG5cdFx0XHRcdF9mb3JjZVBUID0gdmFycztcblx0XHRcdFx0cHQgPSBmaXJzdFBUID0gY3NzcC5wYXJzZSh0LCB2YXJzLCBwdCwgcGx1Z2luKTtcblx0XHRcdFx0X2ZvcmNlUFQgPSBvbGRGb3JjZTtcblx0XHRcdFx0Ly9icmVhayBvZmYgZnJvbSB0aGUgbGlua2VkIGxpc3Qgc28gdGhlIG5ldyBvbmVzIGFyZSBpc29sYXRlZC5cblx0XHRcdFx0aWYgKHNoYWxsb3cpIHtcblx0XHRcdFx0XHRjc3NwLl90cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG5cdFx0XHRcdFx0aWYgKGJwdCkge1xuXHRcdFx0XHRcdFx0YnB0Ll9wcmV2ID0gbnVsbDtcblx0XHRcdFx0XHRcdGlmIChicHQuX3ByZXYpIHtcblx0XHRcdFx0XHRcdFx0YnB0Ll9wcmV2Ll9uZXh0ID0gbnVsbDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0d2hpbGUgKHB0ICYmIHB0ICE9PSBicHQpIHtcblx0XHRcdFx0XHRpZiAocHQudHlwZSA8PSAxKSB7XG5cdFx0XHRcdFx0XHRwID0gcHQucDtcblx0XHRcdFx0XHRcdGVuZFtwXSA9IHB0LnMgKyBwdC5jO1xuXHRcdFx0XHRcdFx0c3RhcnRbcF0gPSBwdC5zO1xuXHRcdFx0XHRcdFx0aWYgKCFzaGFsbG93KSB7XG5cdFx0XHRcdFx0XHRcdG1wdCA9IG5ldyBNaW5pUHJvcFR3ZWVuKHB0LCBcInNcIiwgcCwgbXB0LCBwdC5yKTtcblx0XHRcdFx0XHRcdFx0cHQuYyA9IDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAocHQudHlwZSA9PT0gMSkge1xuXHRcdFx0XHRcdFx0XHRpID0gcHQubDtcblx0XHRcdFx0XHRcdFx0d2hpbGUgKC0taSA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHR4cCA9IFwieG5cIiArIGk7XG5cdFx0XHRcdFx0XHRcdFx0cCA9IHB0LnAgKyBcIl9cIiArIHhwO1xuXHRcdFx0XHRcdFx0XHRcdGVuZFtwXSA9IHB0LmRhdGFbeHBdO1xuXHRcdFx0XHRcdFx0XHRcdHN0YXJ0W3BdID0gcHRbeHBdO1xuXHRcdFx0XHRcdFx0XHRcdGlmICghc2hhbGxvdykge1xuXHRcdFx0XHRcdFx0XHRcdFx0bXB0ID0gbmV3IE1pbmlQcm9wVHdlZW4ocHQsIHhwLCBwLCBtcHQsIHB0LnJ4cFt4cF0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiB7cHJveHk6c3RhcnQsIGVuZDplbmQsIGZpcnN0TVBUOm1wdCwgcHQ6Zmlyc3RQVH07XG5cdFx0XHR9LFxuXG5cblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBAY29uc3RydWN0b3IgRWFjaCBwcm9wZXJ0eSB0aGF0IGlzIHR3ZWVuZWQgaGFzIGF0IGxlYXN0IG9uZSBDU1NQcm9wVHdlZW4gYXNzb2NpYXRlZCB3aXRoIGl0LiBUaGVzZSBpbnN0YW5jZXMgc3RvcmUgaW1wb3J0YW50IGluZm9ybWF0aW9uIGxpa2UgdGhlIHRhcmdldCwgcHJvcGVydHksIHN0YXJ0aW5nIHZhbHVlLCBhbW91bnQgb2YgY2hhbmdlLCBldGMuIFRoZXkgY2FuIGFsc28gb3B0aW9uYWxseSBoYXZlIGEgbnVtYmVyIG9mIFwiZXh0cmFcIiBzdHJpbmdzIGFuZCBudW1lcmljIHZhbHVlcyBuYW1lZCB4czEsIHhuMSwgeHMyLCB4bjIsIHhzMywgeG4zLCBldGMuIHdoZXJlIFwic1wiIGluZGljYXRlcyBzdHJpbmcgYW5kIFwiblwiIGluZGljYXRlcyBudW1iZXIuIFRoZXNlIGNhbiBiZSBwaWVjZWQgdG9nZXRoZXIgaW4gYSBjb21wbGV4LXZhbHVlIHR3ZWVuICh0eXBlOjEpIHRoYXQgaGFzIGFsdGVybmF0aW5nIHR5cGVzIG9mIGRhdGEgbGlrZSBhIHN0cmluZywgbnVtYmVyLCBzdHJpbmcsIG51bWJlciwgZXRjLiBGb3IgZXhhbXBsZSwgYm94U2hhZG93IGNvdWxkIGJlIFwiNXB4IDVweCA4cHggcmdiKDEwMiwgMTAyLCA1MSlcIi4gSW4gdGhhdCB2YWx1ZSwgdGhlcmUgYXJlIDYgbnVtYmVycyB0aGF0IG1heSBuZWVkIHRvIHR3ZWVuIGFuZCB0aGVuIHBpZWNlZCBiYWNrIHRvZ2V0aGVyIGludG8gYSBzdHJpbmcgYWdhaW4gd2l0aCBzcGFjZXMsIHN1ZmZpeGVzLCBldGMuIHhzMCBpcyBzcGVjaWFsIGluIHRoYXQgaXQgc3RvcmVzIHRoZSBzdWZmaXggZm9yIHN0YW5kYXJkICh0eXBlOjApIHR3ZWVucywgLU9SLSB0aGUgZmlyc3Qgc3RyaW5nIChwcmVmaXgpIGluIGEgY29tcGxleC12YWx1ZSAodHlwZToxKSBDU1NQcm9wVHdlZW4gLU9SLSBpdCBjYW4gYmUgdGhlIG5vbi10d2VlbmluZyB2YWx1ZSBpbiBhIHR5cGU6LTEgQ1NTUHJvcFR3ZWVuLiBXZSBkbyB0aGlzIHRvIGNvbnNlcnZlIG1lbW9yeS5cblx0XHRcdCAqIENTU1Byb3BUd2VlbnMgaGF2ZSB0aGUgZm9sbG93aW5nIG9wdGlvbmFsIHByb3BlcnRpZXMgYXMgd2VsbCAobm90IGRlZmluZWQgdGhyb3VnaCB0aGUgY29uc3RydWN0b3IpOlxuXHRcdFx0ICogIC0gbDogTGVuZ3RoIGluIHRlcm1zIG9mIHRoZSBudW1iZXIgb2YgZXh0cmEgcHJvcGVydGllcyB0aGF0IHRoZSBDU1NQcm9wVHdlZW4gaGFzIChkZWZhdWx0OiAwKS4gRm9yIGV4YW1wbGUsIGZvciBhIGJveFNoYWRvdyB3ZSBtYXkgbmVlZCB0byB0d2VlbiA1IG51bWJlcnMgaW4gd2hpY2ggY2FzZSBsIHdvdWxkIGJlIDU7IEtlZXAgaW4gbWluZCB0aGF0IHRoZSBzdGFydC9lbmQgdmFsdWVzIGZvciB0aGUgZmlyc3QgbnVtYmVyIHRoYXQncyB0d2VlbmVkIGFyZSBhbHdheXMgc3RvcmVkIGluIHRoZSBzIGFuZCBjIHByb3BlcnRpZXMgdG8gY29uc2VydmUgbWVtb3J5LiBBbGwgYWRkaXRpb25hbCB2YWx1ZXMgdGhlcmVhZnRlciBhcmUgc3RvcmVkIGluIHhuMSwgeG4yLCBldGMuXG5cdFx0XHQgKiAgLSB4Zmlyc3Q6IFRoZSBmaXJzdCBpbnN0YW5jZSBvZiBhbnkgc3ViLUNTU1Byb3BUd2VlbnMgdGhhdCBhcmUgdHdlZW5pbmcgcHJvcGVydGllcyBvZiB0aGlzIGluc3RhbmNlLiBGb3IgZXhhbXBsZSwgd2UgbWF5IHNwbGl0IHVwIGEgYm94U2hhZG93IHR3ZWVuIHNvIHRoYXQgdGhlcmUncyBhIG1haW4gQ1NTUHJvcFR3ZWVuIG9mIHR5cGU6MSB0aGF0IGhhcyB2YXJpb3VzIHhzKiBhbmQgeG4qIHZhbHVlcyBhc3NvY2lhdGVkIHdpdGggdGhlIGgtc2hhZG93LCB2LXNoYWRvdywgYmx1ciwgY29sb3IsIGV0Yy4gVGhlbiB3ZSBzcGF3biBhIENTU1Byb3BUd2VlbiBmb3IgZWFjaCBvZiB0aG9zZSB0aGF0IGhhcyBhIGhpZ2hlciBwcmlvcml0eSBhbmQgcnVucyBCRUZPUkUgdGhlIG1haW4gQ1NTUHJvcFR3ZWVuIHNvIHRoYXQgdGhlIHZhbHVlcyBhcmUgYWxsIHNldCBieSB0aGUgdGltZSBpdCBuZWVkcyB0byByZS1hc3NlbWJsZSB0aGVtLiBUaGUgeGZpcnN0IGdpdmVzIHVzIGFuIGVhc3kgd2F5IHRvIGlkZW50aWZ5IHRoZSBmaXJzdCBvbmUgaW4gdGhhdCBjaGFpbiB3aGljaCB0eXBpY2FsbHkgZW5kcyBhdCB0aGUgbWFpbiBvbmUgKGJlY2F1c2UgdGhleSdyZSBhbGwgcHJlcGVuZGUgdG8gdGhlIGxpbmtlZCBsaXN0KVxuXHRcdFx0ICogIC0gcGx1Z2luOiBUaGUgVHdlZW5QbHVnaW4gaW5zdGFuY2UgdGhhdCB3aWxsIGhhbmRsZSB0aGUgdHdlZW5pbmcgb2YgYW55IGNvbXBsZXggdmFsdWVzLiBGb3IgZXhhbXBsZSwgc29tZXRpbWVzIHdlIGRvbid0IHdhbnQgdG8gdXNlIG5vcm1hbCBzdWJ0d2VlbnMgKGxpa2UgeGZpcnN0IHJlZmVycyB0bykgdG8gdHdlZW4gdGhlIHZhbHVlcyAtIHdlIG1pZ2h0IHdhbnQgVGhyb3dQcm9wc1BsdWdpbiBvciBCZXppZXJQbHVnaW4gc29tZSBvdGhlciBwbHVnaW4gdG8gZG8gdGhlIGFjdHVhbCB0d2VlbmluZywgc28gd2UgY3JlYXRlIGEgcGx1Z2luIGluc3RhbmNlIGFuZCBzdG9yZSBhIHJlZmVyZW5jZSBoZXJlLiBXZSBuZWVkIHRoaXMgcmVmZXJlbmNlIHNvIHRoYXQgaWYgd2UgZ2V0IGEgcmVxdWVzdCB0byByb3VuZCB2YWx1ZXMgb3IgZGlzYWJsZSBhIHR3ZWVuLCB3ZSBjYW4gcGFzcyBhbG9uZyB0aGF0IHJlcXVlc3QuXG5cdFx0XHQgKiAgLSBkYXRhOiBBcmJpdHJhcnkgZGF0YSB0aGF0IG5lZWRzIHRvIGJlIHN0b3JlZCB3aXRoIHRoZSBDU1NQcm9wVHdlZW4uIFR5cGljYWxseSBpZiB3ZSdyZSBnb2luZyB0byBoYXZlIGEgcGx1Z2luIGhhbmRsZSB0aGUgdHdlZW5pbmcgb2YgYSBjb21wbGV4LXZhbHVlIHR3ZWVuLCB3ZSBjcmVhdGUgYSBnZW5lcmljIG9iamVjdCB0aGF0IHN0b3JlcyB0aGUgRU5EIHZhbHVlcyB0aGF0IHdlJ3JlIHR3ZWVuaW5nIHRvIGFuZCB0aGUgQ1NTUHJvcFR3ZWVuJ3MgeHMxLCB4czIsIGV0Yy4gaGF2ZSB0aGUgc3RhcnRpbmcgdmFsdWVzLiBXZSBzdG9yZSB0aGF0IG9iamVjdCBhcyBkYXRhLiBUaGF0IHdheSwgd2UgY2FuIHNpbXBseSBwYXNzIHRoYXQgb2JqZWN0IHRvIHRoZSBwbHVnaW4gYW5kIHVzZSB0aGUgQ1NTUHJvcFR3ZWVuIGFzIHRoZSB0YXJnZXQuXG5cdFx0XHQgKiAgLSBzZXRSYXRpbzogT25seSB1c2VkIGZvciB0eXBlOjIgdHdlZW5zIHRoYXQgcmVxdWlyZSBjdXN0b20gZnVuY3Rpb25hbGl0eS4gSW4gdGhpcyBjYXNlLCB3ZSBjYWxsIHRoZSBDU1NQcm9wVHdlZW4ncyBzZXRSYXRpbygpIG1ldGhvZCBhbmQgcGFzcyB0aGUgcmF0aW8gZWFjaCB0aW1lIHRoZSB0d2VlbiB1cGRhdGVzLiBUaGlzIGlzbid0IHF1aXRlIGFzIGVmZmljaWVudCBhcyBkb2luZyB0aGluZ3MgZGlyZWN0bHkgaW4gdGhlIENTU1BsdWdpbidzIHNldFJhdGlvKCkgbWV0aG9kLCBidXQgaXQncyB2ZXJ5IGNvbnZlbmllbnQgYW5kIGZsZXhpYmxlLlxuXHRcdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IFRhcmdldCBvYmplY3Qgd2hvc2UgcHJvcGVydHkgd2lsbCBiZSB0d2VlbmVkLiBPZnRlbiBhIERPTSBlbGVtZW50LCBidXQgbm90IGFsd2F5cy4gSXQgY291bGQgYmUgYW55dGhpbmcuXG5cdFx0XHQgKiBAcGFyYW0ge3N0cmluZ30gcCBQcm9wZXJ0eSB0byB0d2VlbiAobmFtZSkuIEZvciBleGFtcGxlLCB0byB0d2VlbiBlbGVtZW50LndpZHRoLCBwIHdvdWxkIGJlIFwid2lkdGhcIi5cblx0XHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBzIFN0YXJ0aW5nIG51bWVyaWMgdmFsdWVcblx0XHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBjIENoYW5nZSBpbiBudW1lcmljIHZhbHVlIG92ZXIgdGhlIGNvdXJzZSBvZiB0aGUgZW50aXJlIHR3ZWVuLiBGb3IgZXhhbXBsZSwgaWYgZWxlbWVudC53aWR0aCBzdGFydHMgYXQgNSBhbmQgc2hvdWxkIGVuZCBhdCAxMDAsIGMgd291bGQgYmUgOTUuXG5cdFx0XHQgKiBAcGFyYW0ge0NTU1Byb3BUd2Vlbj19IG5leHQgVGhlIG5leHQgQ1NTUHJvcFR3ZWVuIGluIHRoZSBsaW5rZWQgbGlzdC4gSWYgb25lIGlzIGRlZmluZWQsIHdlIHdpbGwgZGVmaW5lIGl0cyBfcHJldiBhcyB0aGUgbmV3IGluc3RhbmNlLCBhbmQgdGhlIG5ldyBpbnN0YW5jZSdzIF9uZXh0IHdpbGwgYmUgcG9pbnRlZCBhdCBpdC5cblx0XHRcdCAqIEBwYXJhbSB7bnVtYmVyPX0gdHlwZSBUaGUgdHlwZSBvZiBDU1NQcm9wVHdlZW4gd2hlcmUgLTEgPSBhIG5vbi10d2VlbmluZyB2YWx1ZSwgMCA9IGEgc3RhbmRhcmQgc2ltcGxlIHR3ZWVuLCAxID0gYSBjb21wbGV4IHZhbHVlIChsaWtlIG9uZSB0aGF0IGhhcyBtdWx0aXBsZSBudW1iZXJzIGluIGEgY29tbWEtIG9yIHNwYWNlLWRlbGltaXRlZCBzdHJpbmcgbGlrZSBib3JkZXI6XCIxcHggc29saWQgcmVkXCIpLCBhbmQgMiA9IG9uZSB0aGF0IHVzZXMgYSBjdXN0b20gc2V0UmF0aW8gZnVuY3Rpb24gdGhhdCBkb2VzIGFsbCBvZiB0aGUgd29yayBvZiBhcHBseWluZyB0aGUgdmFsdWVzIG9uIGVhY2ggdXBkYXRlLlxuXHRcdFx0ICogQHBhcmFtIHtzdHJpbmc9fSBuIE5hbWUgb2YgdGhlIHByb3BlcnR5IHRoYXQgc2hvdWxkIGJlIHVzZWQgZm9yIG92ZXJ3cml0aW5nIHB1cnBvc2VzIHdoaWNoIGlzIHR5cGljYWxseSB0aGUgc2FtZSBhcyBwIGJ1dCBub3QgYWx3YXlzLiBGb3IgZXhhbXBsZSwgd2UgbWF5IG5lZWQgdG8gY3JlYXRlIGEgc3VidHdlZW4gZm9yIHRoZSAybmQgcGFydCBvZiBhIFwiY2xpcDpyZWN0KC4uLilcIiB0d2VlbiBpbiB3aGljaCBjYXNlIFwicFwiIG1pZ2h0IGJlIHhzMSBidXQgXCJuXCIgaXMgc3RpbGwgXCJjbGlwXCJcblx0XHRcdCAqIEBwYXJhbSB7Ym9vbGVhbj19IHIgSWYgdHJ1ZSwgdGhlIHZhbHVlKHMpIHNob3VsZCBiZSByb3VuZGVkXG5cdFx0XHQgKiBAcGFyYW0ge251bWJlcj19IHByIFByaW9yaXR5IGluIHRoZSBsaW5rZWQgbGlzdCBvcmRlci4gSGlnaGVyIHByaW9yaXR5IENTU1Byb3BUd2VlbnMgd2lsbCBiZSB1cGRhdGVkIGJlZm9yZSBsb3dlciBwcmlvcml0eSBvbmVzLiBUaGUgZGVmYXVsdCBwcmlvcml0eSBpcyAwLlxuXHRcdFx0ICogQHBhcmFtIHtzdHJpbmc9fSBiIEJlZ2lubmluZyB2YWx1ZS4gV2Ugc3RvcmUgdGhpcyB0byBlbnN1cmUgdGhhdCBpdCBpcyBFWEFDVExZIHdoYXQgaXQgd2FzIHdoZW4gdGhlIHR3ZWVuIGJlZ2FuIHdpdGhvdXQgYW55IHJpc2sgb2YgaW50ZXJwcmV0YXRpb24gaXNzdWVzLlxuXHRcdFx0ICogQHBhcmFtIHtzdHJpbmc9fSBlIEVuZGluZyB2YWx1ZS4gV2Ugc3RvcmUgdGhpcyB0byBlbnN1cmUgdGhhdCBpdCBpcyBFWEFDVExZIHdoYXQgdGhlIHVzZXIgZGVmaW5lZCBhdCB0aGUgZW5kIG9mIHRoZSB0d2VlbiB3aXRob3V0IGFueSByaXNrIG9mIGludGVycHJldGF0aW9uIGlzc3Vlcy5cblx0XHRcdCAqL1xuXHRcdFx0Q1NTUHJvcFR3ZWVuID0gX2ludGVybmFscy5DU1NQcm9wVHdlZW4gPSBmdW5jdGlvbih0LCBwLCBzLCBjLCBuZXh0LCB0eXBlLCBuLCByLCBwciwgYiwgZSkge1xuXHRcdFx0XHR0aGlzLnQgPSB0OyAvL3RhcmdldFxuXHRcdFx0XHR0aGlzLnAgPSBwOyAvL3Byb3BlcnR5XG5cdFx0XHRcdHRoaXMucyA9IHM7IC8vc3RhcnRpbmcgdmFsdWVcblx0XHRcdFx0dGhpcy5jID0gYzsgLy9jaGFuZ2UgdmFsdWVcblx0XHRcdFx0dGhpcy5uID0gbiB8fCBwOyAvL25hbWUgdGhhdCB0aGlzIENTU1Byb3BUd2VlbiBzaG91bGQgYmUgYXNzb2NpYXRlZCB0byAodXN1YWxseSB0aGUgc2FtZSBhcyBwLCBidXQgbm90IGFsd2F5cyAtIG4gaXMgd2hhdCBvdmVyd3JpdGluZyBsb29rcyBhdClcblx0XHRcdFx0aWYgKCEodCBpbnN0YW5jZW9mIENTU1Byb3BUd2VlbikpIHtcblx0XHRcdFx0XHRfb3ZlcndyaXRlUHJvcHMucHVzaCh0aGlzLm4pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuciA9IHI7IC8vcm91bmQgKGJvb2xlYW4pXG5cdFx0XHRcdHRoaXMudHlwZSA9IHR5cGUgfHwgMDsgLy8wID0gbm9ybWFsIHR3ZWVuLCAtMSA9IG5vbi10d2VlbmluZyAoaW4gd2hpY2ggY2FzZSB4czAgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSB0YXJnZXQncyBwcm9wZXJ0eSwgbGlrZSB0cC50W3RwLnBdID0gdHAueHMwKSwgMSA9IGNvbXBsZXgtdmFsdWUgU3BlY2lhbFByb3AsIDIgPSBjdXN0b20gc2V0UmF0aW8oKSB0aGF0IGRvZXMgYWxsIHRoZSB3b3JrXG5cdFx0XHRcdGlmIChwcikge1xuXHRcdFx0XHRcdHRoaXMucHIgPSBwcjtcblx0XHRcdFx0XHRfaGFzUHJpb3JpdHkgPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuYiA9IChiID09PSB1bmRlZmluZWQpID8gcyA6IGI7XG5cdFx0XHRcdHRoaXMuZSA9IChlID09PSB1bmRlZmluZWQpID8gcyArIGMgOiBlO1xuXHRcdFx0XHRpZiAobmV4dCkge1xuXHRcdFx0XHRcdHRoaXMuX25leHQgPSBuZXh0O1xuXHRcdFx0XHRcdG5leHQuX3ByZXYgPSB0aGlzO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRfYWRkTm9uVHdlZW5pbmdOdW1lcmljUFQgPSBmdW5jdGlvbih0YXJnZXQsIHByb3AsIHN0YXJ0LCBlbmQsIG5leHQsIG92ZXJ3cml0ZVByb3ApIHsgLy9jbGVhbnMgdXAgc29tZSBjb2RlIHJlZHVuZGFuY2llcyBhbmQgaGVscHMgbWluaWZpY2F0aW9uLiBKdXN0IGEgZmFzdCB3YXkgdG8gYWRkIGEgTlVNRVJJQyBub24tdHdlZW5pbmcgQ1NTUHJvcFR3ZWVuXG5cdFx0XHRcdHZhciBwdCA9IG5ldyBDU1NQcm9wVHdlZW4odGFyZ2V0LCBwcm9wLCBzdGFydCwgZW5kIC0gc3RhcnQsIG5leHQsIC0xLCBvdmVyd3JpdGVQcm9wKTtcblx0XHRcdFx0cHQuYiA9IHN0YXJ0O1xuXHRcdFx0XHRwdC5lID0gcHQueHMwID0gZW5kO1xuXHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHR9LFxuXG5cdFx0XHQvKipcblx0XHRcdCAqIFRha2VzIGEgdGFyZ2V0LCB0aGUgYmVnaW5uaW5nIHZhbHVlIGFuZCBlbmRpbmcgdmFsdWUgKGFzIHN0cmluZ3MpIGFuZCBwYXJzZXMgdGhlbSBpbnRvIGEgQ1NTUHJvcFR3ZWVuIChwb3NzaWJseSB3aXRoIGNoaWxkIENTU1Byb3BUd2VlbnMpIHRoYXQgYWNjb21tb2RhdGVzIG11bHRpcGxlIG51bWJlcnMsIGNvbG9ycywgY29tbWEtZGVsaW1pdGVkIHZhbHVlcywgZXRjLiBGb3IgZXhhbXBsZTpcblx0XHRcdCAqIHNwLnBhcnNlQ29tcGxleChlbGVtZW50LCBcImJveFNoYWRvd1wiLCBcIjVweCAxMHB4IDIwcHggcmdiKDI1NSwxMDIsNTEpXCIsIFwiMHB4IDBweCAwcHggcmVkXCIsIHRydWUsIFwiMHB4IDBweCAwcHggcmdiKDAsMCwwLDApXCIsIHB0KTtcblx0XHRcdCAqIEl0IHdpbGwgd2FsayB0aHJvdWdoIHRoZSBiZWdpbm5pbmcgYW5kIGVuZGluZyB2YWx1ZXMgKHdoaWNoIHNob3VsZCBiZSBpbiB0aGUgc2FtZSBmb3JtYXQgd2l0aCB0aGUgc2FtZSBudW1iZXIgYW5kIHR5cGUgb2YgdmFsdWVzKSBhbmQgZmlndXJlIG91dCB3aGljaCBwYXJ0cyBhcmUgbnVtYmVycywgd2hhdCBzdHJpbmdzIHNlcGFyYXRlIHRoZSBudW1lcmljL3R3ZWVuYWJsZSB2YWx1ZXMsIGFuZCB0aGVuIGNyZWF0ZSB0aGUgQ1NTUHJvcFR3ZWVucyBhY2NvcmRpbmdseS4gSWYgYSBwbHVnaW4gaXMgZGVmaW5lZCwgbm8gY2hpbGQgQ1NTUHJvcFR3ZWVucyB3aWxsIGJlIGNyZWF0ZWQuIEluc3RlYWQsIHRoZSBlbmRpbmcgdmFsdWVzIHdpbGwgYmUgc3RvcmVkIGluIHRoZSBcImRhdGFcIiBwcm9wZXJ0eSBvZiB0aGUgcmV0dXJuZWQgQ1NTUHJvcFR3ZWVuIGxpa2U6IHtzOi01LCB4bjE6LTEwLCB4bjI6LTIwLCB4bjM6MjU1LCB4bjQ6MCwgeG41OjB9IHNvIHRoYXQgaXQgY2FuIGJlIGZlZCB0byBhbnkgb3RoZXIgcGx1Z2luIGFuZCBpdCdsbCBiZSBwbGFpbiBudW1lcmljIHR3ZWVucyBidXQgdGhlIHJlY29tcG9zaXRpb24gb2YgdGhlIGNvbXBsZXggdmFsdWUgd2lsbCBiZSBoYW5kbGVkIGluc2lkZSBDU1NQbHVnaW4ncyBzZXRSYXRpbygpLlxuXHRcdFx0ICogSWYgYSBzZXRSYXRpbyBpcyBkZWZpbmVkLCB0aGUgdHlwZSBvZiB0aGUgQ1NTUHJvcFR3ZWVuIHdpbGwgYmUgc2V0IHRvIDIgYW5kIHJlY29tcG9zaXRpb24gb2YgdGhlIHZhbHVlcyB3aWxsIGJlIHRoZSByZXNwb25zaWJpbGl0eSBvZiB0aGF0IG1ldGhvZC5cblx0XHRcdCAqXG5cdFx0XHQgKiBAcGFyYW0geyFPYmplY3R9IHQgVGFyZ2V0IHdob3NlIHByb3BlcnR5IHdpbGwgYmUgdHdlZW5lZFxuXHRcdFx0ICogQHBhcmFtIHshc3RyaW5nfSBwIFByb3BlcnR5IHRoYXQgd2lsbCBiZSB0d2VlbmVkIChpdHMgbmFtZSwgbGlrZSBcImxlZnRcIiBvciBcImJhY2tncm91bmRDb2xvclwiIG9yIFwiYm94U2hhZG93XCIpXG5cdFx0XHQgKiBAcGFyYW0ge3N0cmluZ30gYiBCZWdpbm5pbmcgdmFsdWVcblx0XHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBlIEVuZGluZyB2YWx1ZVxuXHRcdFx0ICogQHBhcmFtIHtib29sZWFufSBjbHJzIElmIHRydWUsIHRoZSB2YWx1ZSBjb3VsZCBjb250YWluIGEgY29sb3IgdmFsdWUgbGlrZSBcInJnYigyNTUsMCwwKVwiIG9yIFwiI0YwMFwiIG9yIFwicmVkXCIuIFRoZSBkZWZhdWx0IGlzIGZhbHNlLCBzbyBubyBjb2xvcnMgd2lsbCBiZSByZWNvZ25pemVkIChhIHBlcmZvcm1hbmNlIG9wdGltaXphdGlvbilcblx0XHRcdCAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXJ8T2JqZWN0KX0gZGZsdCBUaGUgZGVmYXVsdCBiZWdpbm5pbmcgdmFsdWUgdGhhdCBzaG91bGQgYmUgdXNlZCBpZiBubyB2YWxpZCBiZWdpbm5pbmcgdmFsdWUgaXMgZGVmaW5lZCBvciBpZiB0aGUgbnVtYmVyIG9mIHZhbHVlcyBpbnNpZGUgdGhlIGNvbXBsZXggYmVnaW5uaW5nIGFuZCBlbmRpbmcgdmFsdWVzIGRvbid0IG1hdGNoXG5cdFx0XHQgKiBAcGFyYW0gez9DU1NQcm9wVHdlZW59IHB0IENTU1Byb3BUd2VlbiBpbnN0YW5jZSB0aGF0IGlzIHRoZSBjdXJyZW50IGhlYWQgb2YgdGhlIGxpbmtlZCBsaXN0ICh3ZSdsbCBwcmVwZW5kIHRvIHRoaXMpLlxuXHRcdFx0ICogQHBhcmFtIHtudW1iZXI9fSBwciBQcmlvcml0eSBpbiB0aGUgbGlua2VkIGxpc3Qgb3JkZXIuIEhpZ2hlciBwcmlvcml0eSBwcm9wZXJ0aWVzIHdpbGwgYmUgdXBkYXRlZCBiZWZvcmUgbG93ZXIgcHJpb3JpdHkgb25lcy4gVGhlIGRlZmF1bHQgcHJpb3JpdHkgaXMgMC5cblx0XHRcdCAqIEBwYXJhbSB7VHdlZW5QbHVnaW49fSBwbHVnaW4gSWYgYSBwbHVnaW4gc2hvdWxkIGhhbmRsZSB0aGUgdHdlZW5pbmcgb2YgZXh0cmEgcHJvcGVydGllcywgcGFzcyB0aGUgcGx1Z2luIGluc3RhbmNlIGhlcmUuIElmIG9uZSBpcyBkZWZpbmVkLCB0aGVuIE5PIHN1YnR3ZWVucyB3aWxsIGJlIGNyZWF0ZWQgZm9yIGFueSBleHRyYSBwcm9wZXJ0aWVzICh0aGUgcHJvcGVydGllcyB3aWxsIGJlIGNyZWF0ZWQgLSBqdXN0IG5vdCBhZGRpdGlvbmFsIENTU1Byb3BUd2VlbiBpbnN0YW5jZXMgdG8gdHdlZW4gdGhlbSkgYmVjYXVzZSB0aGUgcGx1Z2luIGlzIGV4cGVjdGVkIHRvIGRvIHNvLiBIb3dldmVyLCB0aGUgZW5kIHZhbHVlcyBXSUxMIGJlIHBvcHVsYXRlZCBpbiB0aGUgXCJkYXRhXCIgcHJvcGVydHksIGxpa2Uge3M6MTAwLCB4bjE6NTAsIHhuMjozMDB9XG5cdFx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9uKG51bWJlcik9fSBzZXRSYXRpbyBJZiB2YWx1ZXMgc2hvdWxkIGJlIHNldCBpbiBhIGN1c3RvbSBmdW5jdGlvbiBpbnN0ZWFkIG9mIGJlaW5nIHBpZWNlZCB0b2dldGhlciBpbiBhIHR5cGU6MSAoY29tcGxleC12YWx1ZSkgQ1NTUHJvcFR3ZWVuLCBkZWZpbmUgdGhhdCBjdXN0b20gZnVuY3Rpb24gaGVyZS5cblx0XHRcdCAqIEByZXR1cm4ge0NTU1Byb3BUd2Vlbn0gVGhlIGZpcnN0IENTU1Byb3BUd2VlbiBpbiB0aGUgbGlua2VkIGxpc3Qgd2hpY2ggaW5jbHVkZXMgdGhlIG5ldyBvbmUocykgYWRkZWQgYnkgdGhlIHBhcnNlQ29tcGxleCgpIGNhbGwuXG5cdFx0XHQgKi9cblx0XHRcdF9wYXJzZUNvbXBsZXggPSBDU1NQbHVnaW4ucGFyc2VDb21wbGV4ID0gZnVuY3Rpb24odCwgcCwgYiwgZSwgY2xycywgZGZsdCwgcHQsIHByLCBwbHVnaW4sIHNldFJhdGlvKSB7XG5cdFx0XHRcdC8vREVCVUc6IF9sb2coXCJwYXJzZUNvbXBsZXg6IFwiK3ArXCIsIGI6IFwiK2IrXCIsIGU6IFwiK2UpO1xuXHRcdFx0XHRiID0gYiB8fCBkZmx0IHx8IFwiXCI7XG5cdFx0XHRcdHB0ID0gbmV3IENTU1Byb3BUd2Vlbih0LCBwLCAwLCAwLCBwdCwgKHNldFJhdGlvID8gMiA6IDEpLCBudWxsLCBmYWxzZSwgcHIsIGIsIGUpO1xuXHRcdFx0XHRlICs9IFwiXCI7IC8vZW5zdXJlcyBpdCdzIGEgc3RyaW5nXG5cdFx0XHRcdHZhciBiYSA9IGIuc3BsaXQoXCIsIFwiKS5qb2luKFwiLFwiKS5zcGxpdChcIiBcIiksIC8vYmVnaW5uaW5nIGFycmF5XG5cdFx0XHRcdFx0ZWEgPSBlLnNwbGl0KFwiLCBcIikuam9pbihcIixcIikuc3BsaXQoXCIgXCIpLCAvL2VuZGluZyBhcnJheVxuXHRcdFx0XHRcdGwgPSBiYS5sZW5ndGgsXG5cdFx0XHRcdFx0YXV0b1JvdW5kID0gKF9hdXRvUm91bmQgIT09IGZhbHNlKSxcblx0XHRcdFx0XHRpLCB4aSwgbmksIGJ2LCBldiwgYm51bXMsIGVudW1zLCBibiwgcmdiYSwgdGVtcCwgY3YsIHN0cjtcblx0XHRcdFx0aWYgKGUuaW5kZXhPZihcIixcIikgIT09IC0xIHx8IGIuaW5kZXhPZihcIixcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0YmEgPSBiYS5qb2luKFwiIFwiKS5yZXBsYWNlKF9jb21tYXNPdXRzaWRlUGFyZW5FeHAsIFwiLCBcIikuc3BsaXQoXCIgXCIpO1xuXHRcdFx0XHRcdGVhID0gZWEuam9pbihcIiBcIikucmVwbGFjZShfY29tbWFzT3V0c2lkZVBhcmVuRXhwLCBcIiwgXCIpLnNwbGl0KFwiIFwiKTtcblx0XHRcdFx0XHRsID0gYmEubGVuZ3RoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChsICE9PSBlYS5sZW5ndGgpIHtcblx0XHRcdFx0XHQvL0RFQlVHOiBfbG9nKFwibWlzbWF0Y2hlZCBmb3JtYXR0aW5nIGRldGVjdGVkIG9uIFwiICsgcCArIFwiIChcIiArIGIgKyBcIiB2cyBcIiArIGUgKyBcIilcIik7XG5cdFx0XHRcdFx0YmEgPSAoZGZsdCB8fCBcIlwiKS5zcGxpdChcIiBcIik7XG5cdFx0XHRcdFx0bCA9IGJhLmxlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0XHRwdC5wbHVnaW4gPSBwbHVnaW47XG5cdFx0XHRcdHB0LnNldFJhdGlvID0gc2V0UmF0aW87XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRidiA9IGJhW2ldO1xuXHRcdFx0XHRcdGV2ID0gZWFbaV07XG5cdFx0XHRcdFx0Ym4gPSBwYXJzZUZsb2F0KGJ2KTtcblx0XHRcdFx0XHQvL2lmIHRoZSB2YWx1ZSBiZWdpbnMgd2l0aCBhIG51bWJlciAobW9zdCBjb21tb24pLiBJdCdzIGZpbmUgaWYgaXQgaGFzIGEgc3VmZml4IGxpa2UgcHhcblx0XHRcdFx0XHRpZiAoYm4gfHwgYm4gPT09IDApIHtcblx0XHRcdFx0XHRcdHB0LmFwcGVuZFh0cmEoXCJcIiwgYm4sIF9wYXJzZUNoYW5nZShldiwgYm4pLCBldi5yZXBsYWNlKF9yZWxOdW1FeHAsIFwiXCIpLCAoYXV0b1JvdW5kICYmIGV2LmluZGV4T2YoXCJweFwiKSAhPT0gLTEpLCB0cnVlKTtcblxuXHRcdFx0XHRcdC8vaWYgdGhlIHZhbHVlIGlzIGEgY29sb3Jcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGNscnMgJiYgKGJ2LmNoYXJBdCgwKSA9PT0gXCIjXCIgfHwgX2NvbG9yTG9va3VwW2J2XSB8fCBfcmdiaHNsRXhwLnRlc3QoYnYpKSkge1xuXHRcdFx0XHRcdFx0c3RyID0gZXYuY2hhckF0KGV2Lmxlbmd0aCAtIDEpID09PSBcIixcIiA/IFwiKSxcIiA6IFwiKVwiOyAvL2lmIHRoZXJlJ3MgYSBjb21tYSBhdCB0aGUgZW5kLCByZXRhaW4gaXQuXG5cdFx0XHRcdFx0XHRidiA9IF9wYXJzZUNvbG9yKGJ2KTtcblx0XHRcdFx0XHRcdGV2ID0gX3BhcnNlQ29sb3IoZXYpO1xuXHRcdFx0XHRcdFx0cmdiYSA9IChidi5sZW5ndGggKyBldi5sZW5ndGggPiA2KTtcblx0XHRcdFx0XHRcdGlmIChyZ2JhICYmICFfc3VwcG9ydHNPcGFjaXR5ICYmIGV2WzNdID09PSAwKSB7IC8vb2xkZXIgdmVyc2lvbnMgb2YgSUUgZG9uJ3Qgc3VwcG9ydCByZ2JhKCksIHNvIGlmIHRoZSBkZXN0aW5hdGlvbiBhbHBoYSBpcyAwLCBqdXN0IHVzZSBcInRyYW5zcGFyZW50XCIgZm9yIHRoZSBlbmQgY29sb3Jcblx0XHRcdFx0XHRcdFx0cHRbXCJ4c1wiICsgcHQubF0gKz0gcHQubCA/IFwiIHRyYW5zcGFyZW50XCIgOiBcInRyYW5zcGFyZW50XCI7XG5cdFx0XHRcdFx0XHRcdHB0LmUgPSBwdC5lLnNwbGl0KGVhW2ldKS5qb2luKFwidHJhbnNwYXJlbnRcIik7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpZiAoIV9zdXBwb3J0c09wYWNpdHkpIHsgLy9vbGQgdmVyc2lvbnMgb2YgSUUgZG9uJ3Qgc3VwcG9ydCByZ2JhKCkuXG5cdFx0XHRcdFx0XHRcdFx0cmdiYSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdHB0LmFwcGVuZFh0cmEoKHJnYmEgPyBcInJnYmEoXCIgOiBcInJnYihcIiksIGJ2WzBdLCBldlswXSAtIGJ2WzBdLCBcIixcIiwgdHJ1ZSwgdHJ1ZSlcblx0XHRcdFx0XHRcdFx0XHQuYXBwZW5kWHRyYShcIlwiLCBidlsxXSwgZXZbMV0gLSBidlsxXSwgXCIsXCIsIHRydWUpXG5cdFx0XHRcdFx0XHRcdFx0LmFwcGVuZFh0cmEoXCJcIiwgYnZbMl0sIGV2WzJdIC0gYnZbMl0sIChyZ2JhID8gXCIsXCIgOiBzdHIpLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0aWYgKHJnYmEpIHtcblx0XHRcdFx0XHRcdFx0XHRidiA9IChidi5sZW5ndGggPCA0KSA/IDEgOiBidlszXTtcblx0XHRcdFx0XHRcdFx0XHRwdC5hcHBlbmRYdHJhKFwiXCIsIGJ2LCAoKGV2Lmxlbmd0aCA8IDQpID8gMSA6IGV2WzNdKSAtIGJ2LCBzdHIsIGZhbHNlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGJudW1zID0gYnYubWF0Y2goX251bUV4cCk7IC8vZ2V0cyBlYWNoIGdyb3VwIG9mIG51bWJlcnMgaW4gdGhlIGJlZ2lubmluZyB2YWx1ZSBzdHJpbmcgYW5kIGRyb3BzIHRoZW0gaW50byBhbiBhcnJheVxuXG5cdFx0XHRcdFx0XHQvL2lmIG5vIG51bWJlciBpcyBmb3VuZCwgdHJlYXQgaXQgYXMgYSBub24tdHdlZW5pbmcgdmFsdWUgYW5kIGp1c3QgYXBwZW5kIHRoZSBzdHJpbmcgdG8gdGhlIGN1cnJlbnQgeHMuXG5cdFx0XHRcdFx0XHRpZiAoIWJudW1zKSB7XG5cdFx0XHRcdFx0XHRcdHB0W1wieHNcIiArIHB0LmxdICs9IHB0LmwgPyBcIiBcIiArIGJ2IDogYnY7XG5cblx0XHRcdFx0XHRcdC8vbG9vcCB0aHJvdWdoIGFsbCB0aGUgbnVtYmVycyB0aGF0IGFyZSBmb3VuZCBhbmQgY29uc3RydWN0IHRoZSBleHRyYSB2YWx1ZXMgb24gdGhlIHB0LlxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0ZW51bXMgPSBldi5tYXRjaChfcmVsTnVtRXhwKTsgLy9nZXQgZWFjaCBncm91cCBvZiBudW1iZXJzIGluIHRoZSBlbmQgdmFsdWUgc3RyaW5nIGFuZCBkcm9wIHRoZW0gaW50byBhbiBhcnJheS4gV2UgYWxsb3cgcmVsYXRpdmUgdmFsdWVzIHRvbywgbGlrZSArPTUwIG9yIC09LjVcblx0XHRcdFx0XHRcdFx0aWYgKCFlbnVtcyB8fCBlbnVtcy5sZW5ndGggIT09IGJudW1zLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdC8vREVCVUc6IF9sb2coXCJtaXNtYXRjaGVkIGZvcm1hdHRpbmcgZGV0ZWN0ZWQgb24gXCIgKyBwICsgXCIgKFwiICsgYiArIFwiIHZzIFwiICsgZSArIFwiKVwiKTtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0bmkgPSAwO1xuXHRcdFx0XHRcdFx0XHRmb3IgKHhpID0gMDsgeGkgPCBibnVtcy5sZW5ndGg7IHhpKyspIHtcblx0XHRcdFx0XHRcdFx0XHRjdiA9IGJudW1zW3hpXTtcblx0XHRcdFx0XHRcdFx0XHR0ZW1wID0gYnYuaW5kZXhPZihjdiwgbmkpO1xuXHRcdFx0XHRcdFx0XHRcdHB0LmFwcGVuZFh0cmEoYnYuc3Vic3RyKG5pLCB0ZW1wIC0gbmkpLCBOdW1iZXIoY3YpLCBfcGFyc2VDaGFuZ2UoZW51bXNbeGldLCBjdiksIFwiXCIsIChhdXRvUm91bmQgJiYgYnYuc3Vic3RyKHRlbXAgKyBjdi5sZW5ndGgsIDIpID09PSBcInB4XCIpLCAoeGkgPT09IDApKTtcblx0XHRcdFx0XHRcdFx0XHRuaSA9IHRlbXAgKyBjdi5sZW5ndGg7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cHRbXCJ4c1wiICsgcHQubF0gKz0gYnYuc3Vic3RyKG5pKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9pZiB0aGVyZSBhcmUgcmVsYXRpdmUgdmFsdWVzIChcIis9XCIgb3IgXCItPVwiIHByZWZpeCksIHdlIG5lZWQgdG8gYWRqdXN0IHRoZSBlbmRpbmcgdmFsdWUgdG8gZWxpbWluYXRlIHRoZSBwcmVmaXhlcyBhbmQgY29tYmluZSB0aGUgdmFsdWVzIHByb3Blcmx5LlxuXHRcdFx0XHRpZiAoZS5pbmRleE9mKFwiPVwiKSAhPT0gLTEpIGlmIChwdC5kYXRhKSB7XG5cdFx0XHRcdFx0c3RyID0gcHQueHMwICsgcHQuZGF0YS5zO1xuXHRcdFx0XHRcdGZvciAoaSA9IDE7IGkgPCBwdC5sOyBpKyspIHtcblx0XHRcdFx0XHRcdHN0ciArPSBwdFtcInhzXCIgKyBpXSArIHB0LmRhdGFbXCJ4blwiICsgaV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHB0LmUgPSBzdHIgKyBwdFtcInhzXCIgKyBpXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIXB0LmwpIHtcblx0XHRcdFx0XHRwdC50eXBlID0gLTE7XG5cdFx0XHRcdFx0cHQueHMwID0gcHQuZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcHQueGZpcnN0IHx8IHB0O1xuXHRcdFx0fSxcblx0XHRcdGkgPSA5O1xuXG5cblx0XHRwID0gQ1NTUHJvcFR3ZWVuLnByb3RvdHlwZTtcblx0XHRwLmwgPSBwLnByID0gMDsgLy9sZW5ndGggKG51bWJlciBvZiBleHRyYSBwcm9wZXJ0aWVzIGxpa2UgeG4xLCB4bjIsIHhuMywgZXRjLlxuXHRcdHdoaWxlICgtLWkgPiAwKSB7XG5cdFx0XHRwW1wieG5cIiArIGldID0gMDtcblx0XHRcdHBbXCJ4c1wiICsgaV0gPSBcIlwiO1xuXHRcdH1cblx0XHRwLnhzMCA9IFwiXCI7XG5cdFx0cC5fbmV4dCA9IHAuX3ByZXYgPSBwLnhmaXJzdCA9IHAuZGF0YSA9IHAucGx1Z2luID0gcC5zZXRSYXRpbyA9IHAucnhwID0gbnVsbDtcblxuXG5cdFx0LyoqXG5cdFx0ICogQXBwZW5kcyBhbmQgZXh0cmEgdHdlZW5pbmcgdmFsdWUgdG8gYSBDU1NQcm9wVHdlZW4gYW5kIGF1dG9tYXRpY2FsbHkgbWFuYWdlcyBhbnkgcHJlZml4IGFuZCBzdWZmaXggc3RyaW5ncy4gVGhlIGZpcnN0IGV4dHJhIHZhbHVlIGlzIHN0b3JlZCBpbiB0aGUgcyBhbmQgYyBvZiB0aGUgbWFpbiBDU1NQcm9wVHdlZW4gaW5zdGFuY2UsIGJ1dCB0aGVyZWFmdGVyIGFueSBleHRyYXMgYXJlIHN0b3JlZCBpbiB0aGUgeG4xLCB4bjIsIHhuMywgZXRjLiBUaGUgcHJlZml4ZXMgYW5kIHN1ZmZpeGVzIGFyZSBzdG9yZWQgaW4gdGhlIHhzMCwgeHMxLCB4czIsIGV0Yy4gcHJvcGVydGllcy4gRm9yIGV4YW1wbGUsIGlmIEkgd2FsayB0aHJvdWdoIGEgY2xpcCB2YWx1ZSBsaWtlIFwicmVjdCgxMHB4LCA1cHgsIDBweCwgMjBweClcIiwgdGhlIHZhbHVlcyB3b3VsZCBiZSBzdG9yZWQgbGlrZSB0aGlzOlxuXHRcdCAqIHhzMDpcInJlY3QoXCIsIHM6MTAsIHhzMTpcInB4LCBcIiwgeG4xOjUsIHhzMjpcInB4LCBcIiwgeG4yOjAsIHhzMzpcInB4LCBcIiwgeG4zOjIwLCB4bjQ6XCJweClcIlxuXHRcdCAqIEFuZCB0aGV5J2QgYWxsIGdldCBqb2luZWQgdG9nZXRoZXIgd2hlbiB0aGUgQ1NTUGx1Z2luIHJlbmRlcnMgKGluIHRoZSBzZXRSYXRpbygpIG1ldGhvZCkuXG5cdFx0ICogQHBhcmFtIHtzdHJpbmc9fSBwZnggUHJlZml4IChpZiBhbnkpXG5cdFx0ICogQHBhcmFtIHshbnVtYmVyfSBzIFN0YXJ0aW5nIHZhbHVlXG5cdFx0ICogQHBhcmFtIHshbnVtYmVyfSBjIENoYW5nZSBpbiBudW1lcmljIHZhbHVlIG92ZXIgdGhlIGNvdXJzZSBvZiB0aGUgZW50aXJlIHR3ZWVuLiBGb3IgZXhhbXBsZSwgaWYgdGhlIHN0YXJ0IGlzIDUgYW5kIHRoZSBlbmQgaXMgMTAwLCB0aGUgY2hhbmdlIHdvdWxkIGJlIDk1LlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nPX0gc2Z4IFN1ZmZpeCAoaWYgYW55KVxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbj19IHIgUm91bmQgKGlmIHRydWUpLlxuXHRcdCAqIEBwYXJhbSB7Ym9vbGVhbj19IHBhZCBJZiB0cnVlLCB0aGlzIGV4dHJhIHZhbHVlIHNob3VsZCBiZSBzZXBhcmF0ZWQgYnkgdGhlIHByZXZpb3VzIG9uZSBieSBhIHNwYWNlLiBJZiB0aGVyZSBpcyBubyBwcmV2aW91cyBleHRyYSBhbmQgcGFkIGlzIHRydWUsIGl0IHdpbGwgYXV0b21hdGljYWxseSBkcm9wIHRoZSBzcGFjZS5cblx0XHQgKiBAcmV0dXJuIHtDU1NQcm9wVHdlZW59IHJldHVybnMgaXRzZWxmIHNvIHRoYXQgbXVsdGlwbGUgbWV0aG9kcyBjYW4gYmUgY2hhaW5lZCB0b2dldGhlci5cblx0XHQgKi9cblx0XHRwLmFwcGVuZFh0cmEgPSBmdW5jdGlvbihwZngsIHMsIGMsIHNmeCwgciwgcGFkKSB7XG5cdFx0XHR2YXIgcHQgPSB0aGlzLFxuXHRcdFx0XHRsID0gcHQubDtcblx0XHRcdHB0W1wieHNcIiArIGxdICs9IChwYWQgJiYgbCkgPyBcIiBcIiArIHBmeCA6IHBmeCB8fCBcIlwiO1xuXHRcdFx0aWYgKCFjKSBpZiAobCAhPT0gMCAmJiAhcHQucGx1Z2luKSB7IC8vdHlwaWNhbGx5IHdlJ2xsIGNvbWJpbmUgbm9uLWNoYW5naW5nIHZhbHVlcyByaWdodCBpbnRvIHRoZSB4cyB0byBvcHRpbWl6ZSBwZXJmb3JtYW5jZSwgYnV0IHdlIGRvbid0IGNvbWJpbmUgdGhlbSB3aGVuIHRoZXJlJ3MgYSBwbHVnaW4gdGhhdCB3aWxsIGJlIHR3ZWVuaW5nIHRoZSB2YWx1ZXMgYmVjYXVzZSBpdCBtYXkgZGVwZW5kIG9uIHRoZSB2YWx1ZXMgYmVpbmcgc3BsaXQgYXBhcnQsIGxpa2UgZm9yIGEgYmV6aWVyLCBpZiBhIHZhbHVlIGRvZXNuJ3QgY2hhbmdlIGJldHdlZW4gdGhlIGZpcnN0IGFuZCBzZWNvbmQgaXRlcmF0aW9uIGJ1dCB0aGVuIGl0IGRvZXMgb24gdGhlIDNyZCwgd2UnbGwgcnVuIGludG8gdHJvdWJsZSBiZWNhdXNlIHRoZXJlJ3Mgbm8geG4gc2xvdCBmb3IgdGhhdCB2YWx1ZSFcblx0XHRcdFx0cHRbXCJ4c1wiICsgbF0gKz0gcyArIChzZnggfHwgXCJcIik7XG5cdFx0XHRcdHJldHVybiBwdDtcblx0XHRcdH1cblx0XHRcdHB0LmwrKztcblx0XHRcdHB0LnR5cGUgPSBwdC5zZXRSYXRpbyA/IDIgOiAxO1xuXHRcdFx0cHRbXCJ4c1wiICsgcHQubF0gPSBzZnggfHwgXCJcIjtcblx0XHRcdGlmIChsID4gMCkge1xuXHRcdFx0XHRwdC5kYXRhW1wieG5cIiArIGxdID0gcyArIGM7XG5cdFx0XHRcdHB0LnJ4cFtcInhuXCIgKyBsXSA9IHI7IC8vcm91bmQgZXh0cmEgcHJvcGVydHkgKHdlIG5lZWQgdG8gdGFwIGludG8gdGhpcyBpbiB0aGUgX3BhcnNlVG9Qcm94eSgpIG1ldGhvZClcblx0XHRcdFx0cHRbXCJ4blwiICsgbF0gPSBzO1xuXHRcdFx0XHRpZiAoIXB0LnBsdWdpbikge1xuXHRcdFx0XHRcdHB0LnhmaXJzdCA9IG5ldyBDU1NQcm9wVHdlZW4ocHQsIFwieG5cIiArIGwsIHMsIGMsIHB0LnhmaXJzdCB8fCBwdCwgMCwgcHQubiwgciwgcHQucHIpO1xuXHRcdFx0XHRcdHB0LnhmaXJzdC54czAgPSAwOyAvL2p1c3QgdG8gZW5zdXJlIHRoYXQgdGhlIHByb3BlcnR5IHN0YXlzIG51bWVyaWMgd2hpY2ggaGVscHMgbW9kZXJuIGJyb3dzZXJzIHNwZWVkIHVwIHByb2Nlc3NpbmcuIFJlbWVtYmVyLCBpbiB0aGUgc2V0UmF0aW8oKSBtZXRob2QsIHdlIGRvIHB0LnRbcHQucF0gPSB2YWwgKyBwdC54czAgc28gaWYgcHQueHMwIGlzIFwiXCIgKHRoZSBkZWZhdWx0KSwgaXQnbGwgY2FzdCB0aGUgZW5kIHZhbHVlIGFzIGEgc3RyaW5nLiBXaGVuIGEgcHJvcGVydHkgaXMgYSBudW1iZXIgc29tZXRpbWVzIGFuZCBhIHN0cmluZyBzb21ldGltZXMsIGl0IHByZXZlbnRzIHRoZSBjb21waWxlciBmcm9tIGxvY2tpbmcgaW4gdGhlIGRhdGEgdHlwZSwgc2xvd2luZyB0aGluZ3MgZG93biBzbGlnaHRseS5cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHR9XG5cdFx0XHRwdC5kYXRhID0ge3M6cyArIGN9O1xuXHRcdFx0cHQucnhwID0ge307XG5cdFx0XHRwdC5zID0gcztcblx0XHRcdHB0LmMgPSBjO1xuXHRcdFx0cHQuciA9IHI7XG5cdFx0XHRyZXR1cm4gcHQ7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIEBjb25zdHJ1Y3RvciBBIFNwZWNpYWxQcm9wIGlzIGJhc2ljYWxseSBhIGNzcyBwcm9wZXJ0eSB0aGF0IG5lZWRzIHRvIGJlIHRyZWF0ZWQgaW4gYSBub24tc3RhbmRhcmQgd2F5LCBsaWtlIGlmIGl0IG1heSBjb250YWluIGEgY29tcGxleCB2YWx1ZSBsaWtlIGJveFNoYWRvdzpcIjVweCAxMHB4IDE1cHggcmdiKDI1NSwgMTAyLCA1MSlcIiBvciBpZiBpdCBpcyBhc3NvY2lhdGVkIHdpdGggYW5vdGhlciBwbHVnaW4gbGlrZSBUaHJvd1Byb3BzUGx1Z2luIG9yIEJlemllclBsdWdpbi4gRXZlcnkgU3BlY2lhbFByb3AgaXMgYXNzb2NpYXRlZCB3aXRoIGEgcGFydGljdWxhciBwcm9wZXJ0eSBuYW1lIGxpa2UgXCJib3hTaGFkb3dcIiBvciBcInRocm93UHJvcHNcIiBvciBcImJlemllclwiIGFuZCBpdCB3aWxsIGludGVyY2VwdCB0aG9zZSB2YWx1ZXMgaW4gdGhlIHZhcnMgb2JqZWN0IHRoYXQncyBwYXNzZWQgdG8gdGhlIENTU1BsdWdpbiBhbmQgaGFuZGxlIHRoZW0gYWNjb3JkaW5nbHkuXG5cdFx0ICogQHBhcmFtIHshc3RyaW5nfSBwIFByb3BlcnR5IG5hbWUgKGxpa2UgXCJib3hTaGFkb3dcIiBvciBcInRocm93UHJvcHNcIilcblx0XHQgKiBAcGFyYW0ge09iamVjdD19IG9wdGlvbnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgYW55IG9mIHRoZSBmb2xsb3dpbmcgY29uZmlndXJhdGlvbiBvcHRpb25zOlxuXHRcdCAqICAgICAgICAgICAgICAgICAgICAgIC0gZGVmYXVsdFZhbHVlOiB0aGUgZGVmYXVsdCB2YWx1ZVxuXHRcdCAqICAgICAgICAgICAgICAgICAgICAgIC0gcGFyc2VyOiBBIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCB3aGVuIHRoZSBhc3NvY2lhdGVkIHByb3BlcnR5IG5hbWUgaXMgZm91bmQgaW4gdGhlIHZhcnMuIFRoaXMgZnVuY3Rpb24gc2hvdWxkIHJldHVybiBhIENTU1Byb3BUd2VlbiBpbnN0YW5jZSBhbmQgaXQgc2hvdWxkIGVuc3VyZSB0aGF0IGl0IGlzIHByb3Blcmx5IGluc2VydGVkIGludG8gdGhlIGxpbmtlZCBsaXN0LiBJdCB3aWxsIHJlY2VpdmUgNCBwYXJhbXRlcnM6IDEpIFRoZSB0YXJnZXQsIDIpIFRoZSB2YWx1ZSBkZWZpbmVkIGluIHRoZSB2YXJzLCAzKSBUaGUgQ1NTUGx1Z2luIGluc3RhbmNlICh3aG9zZSBfZmlyc3RQVCBzaG91bGQgYmUgdXNlZCBmb3IgdGhlIGxpbmtlZCBsaXN0KSwgYW5kIDQpIEEgY29tcHV0ZWQgc3R5bGUgb2JqZWN0IGlmIG9uZSB3YXMgY2FsY3VsYXRlZCAodGhpcyBpcyBhIHNwZWVkIG9wdGltaXphdGlvbiB0aGF0IGFsbG93cyByZXRyaWV2YWwgb2Ygc3RhcnRpbmcgdmFsdWVzIHF1aWNrZXIpXG5cdFx0ICogICAgICAgICAgICAgICAgICAgICAgLSBmb3JtYXR0ZXI6IGEgZnVuY3Rpb24gdGhhdCBmb3JtYXRzIGFueSB2YWx1ZSByZWNlaXZlZCBmb3IgdGhpcyBzcGVjaWFsIHByb3BlcnR5IChmb3IgZXhhbXBsZSwgYm94U2hhZG93IGNvdWxkIHRha2UgXCI1cHggNXB4IHJlZFwiIGFuZCBmb3JtYXQgaXQgdG8gXCI1cHggNXB4IDBweCAwcHggcmVkXCIgc28gdGhhdCBib3RoIHRoZSBiZWdpbm5pbmcgYW5kIGVuZGluZyB2YWx1ZXMgaGF2ZSBhIGNvbW1vbiBvcmRlciBhbmQgcXVhbnRpdHkgb2YgdmFsdWVzLilcblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIHByZWZpeDogaWYgdHJ1ZSwgd2UnbGwgZGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IHRoaXMgcHJvcGVydHkgcmVxdWlyZXMgYSB2ZW5kb3IgcHJlZml4IChsaWtlIFdlYmtpdCBvciBNb3ogb3IgbXMgb3IgTylcblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIGNvbG9yOiBzZXQgdGhpcyB0byB0cnVlIGlmIHRoZSB2YWx1ZSBmb3IgdGhpcyBTcGVjaWFsUHJvcCBtYXkgY29udGFpbiBjb2xvci1yZWxhdGVkIHZhbHVlcyBsaWtlIHJnYigpLCByZ2JhKCksIGV0Yy5cblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIHByaW9yaXR5OiBwcmlvcml0eSBpbiB0aGUgbGlua2VkIGxpc3Qgb3JkZXIuIEhpZ2hlciBwcmlvcml0eSBTcGVjaWFsUHJvcHMgd2lsbCBiZSB1cGRhdGVkIGJlZm9yZSBsb3dlciBwcmlvcml0eSBvbmVzLiBUaGUgZGVmYXVsdCBwcmlvcml0eSBpcyAwLlxuXHRcdCAqICAgICAgICAgICAgICAgICAgICAgIC0gbXVsdGk6IGlmIHRydWUsIHRoZSBmb3JtYXR0ZXIgc2hvdWxkIGFjY29tbW9kYXRlIGEgY29tbWEtZGVsaW1pdGVkIGxpc3Qgb2YgdmFsdWVzLCBsaWtlIGJveFNoYWRvdyBjb3VsZCBoYXZlIG11bHRpcGxlIGJveFNoYWRvd3MgbGlzdGVkIG91dC5cblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIGNvbGxhcHNpYmxlOiBpZiB0cnVlLCB0aGUgZm9ybWF0dGVyIHNob3VsZCB0cmVhdCB0aGUgdmFsdWUgbGlrZSBpdCdzIGEgdG9wL3JpZ2h0L2JvdHRvbS9sZWZ0IHZhbHVlIHRoYXQgY291bGQgYmUgY29sbGFwc2VkLCBsaWtlIFwiNXB4XCIgd291bGQgYXBwbHkgdG8gYWxsLCBcIjVweCwgMTBweFwiIHdvdWxkIHVzZSA1cHggZm9yIHRvcC9ib3R0b20gYW5kIDEwcHggZm9yIHJpZ2h0L2xlZnQsIGV0Yy5cblx0XHQgKiAgICAgICAgICAgICAgICAgICAgICAtIGtleXdvcmQ6IGEgc3BlY2lhbCBrZXl3b3JkIHRoYXQgY2FuIFtvcHRpb25hbGx5XSBiZSBmb3VuZCBpbnNpZGUgdGhlIHZhbHVlIChsaWtlIFwiaW5zZXRcIiBmb3IgYm94U2hhZG93KS4gVGhpcyBhbGxvd3MgdXMgdG8gdmFsaWRhdGUgYmVnaW5uaW5nL2VuZGluZyB2YWx1ZXMgdG8gbWFrZSBzdXJlIHRoZXkgbWF0Y2ggKGlmIHRoZSBrZXl3b3JkIGlzIGZvdW5kIGluIG9uZSwgaXQnbGwgYmUgYWRkZWQgdG8gdGhlIG90aGVyIGZvciBjb25zaXN0ZW5jeSBieSBkZWZhdWx0KS5cblx0XHQgKi9cblx0XHR2YXIgU3BlY2lhbFByb3AgPSBmdW5jdGlvbihwLCBvcHRpb25zKSB7XG5cdFx0XHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRcdFx0XHR0aGlzLnAgPSBvcHRpb25zLnByZWZpeCA/IF9jaGVja1Byb3BQcmVmaXgocCkgfHwgcCA6IHA7XG5cdFx0XHRcdF9zcGVjaWFsUHJvcHNbcF0gPSBfc3BlY2lhbFByb3BzW3RoaXMucF0gPSB0aGlzO1xuXHRcdFx0XHR0aGlzLmZvcm1hdCA9IG9wdGlvbnMuZm9ybWF0dGVyIHx8IF9nZXRGb3JtYXR0ZXIob3B0aW9ucy5kZWZhdWx0VmFsdWUsIG9wdGlvbnMuY29sb3IsIG9wdGlvbnMuY29sbGFwc2libGUsIG9wdGlvbnMubXVsdGkpO1xuXHRcdFx0XHRpZiAob3B0aW9ucy5wYXJzZXIpIHtcblx0XHRcdFx0XHR0aGlzLnBhcnNlID0gb3B0aW9ucy5wYXJzZXI7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5jbHJzID0gb3B0aW9ucy5jb2xvcjtcblx0XHRcdFx0dGhpcy5tdWx0aSA9IG9wdGlvbnMubXVsdGk7XG5cdFx0XHRcdHRoaXMua2V5d29yZCA9IG9wdGlvbnMua2V5d29yZDtcblx0XHRcdFx0dGhpcy5kZmx0ID0gb3B0aW9ucy5kZWZhdWx0VmFsdWU7XG5cdFx0XHRcdHRoaXMucHIgPSBvcHRpb25zLnByaW9yaXR5IHx8IDA7XG5cdFx0XHR9LFxuXG5cdFx0XHQvL3Nob3J0Y3V0IGZvciBjcmVhdGluZyBhIG5ldyBTcGVjaWFsUHJvcCB0aGF0IGNhbiBhY2NlcHQgbXVsdGlwbGUgcHJvcGVydGllcyBhcyBhIGNvbW1hLWRlbGltaXRlZCBsaXN0IChoZWxwcyBtaW5pZmljYXRpb24pLiBkZmx0IGNhbiBiZSBhbiBhcnJheSBmb3IgbXVsdGlwbGUgdmFsdWVzICh3ZSBkb24ndCBkbyBhIGNvbW1hLWRlbGltaXRlZCBsaXN0IGJlY2F1c2UgdGhlIGRlZmF1bHQgdmFsdWUgbWF5IGNvbnRhaW4gY29tbWFzLCBsaWtlIHJlY3QoMHB4LDBweCwwcHgsMHB4KSkuIFdlIGF0dGFjaCB0aGlzIG1ldGhvZCB0byB0aGUgU3BlY2lhbFByb3AgY2xhc3Mvb2JqZWN0IGluc3RlYWQgb2YgdXNpbmcgYSBwcml2YXRlIF9jcmVhdGVTcGVjaWFsUHJvcCgpIG1ldGhvZCBzbyB0aGF0IHdlIGNhbiB0YXAgaW50byBpdCBleHRlcm5hbGx5IGlmIG5lY2Vzc2FyeSwgbGlrZSBmcm9tIGFub3RoZXIgcGx1Z2luLlxuXHRcdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wID0gX2ludGVybmFscy5fcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AgPSBmdW5jdGlvbihwLCBvcHRpb25zLCBkZWZhdWx0cykge1xuXHRcdFx0XHRpZiAodHlwZW9mKG9wdGlvbnMpICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdFx0b3B0aW9ucyA9IHtwYXJzZXI6ZGVmYXVsdHN9OyAvL3RvIG1ha2UgYmFja3dhcmRzIGNvbXBhdGlibGUgd2l0aCBvbGRlciB2ZXJzaW9ucyBvZiBCZXppZXJQbHVnaW4gYW5kIFRocm93UHJvcHNQbHVnaW5cblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgYSA9IHAuc3BsaXQoXCIsXCIpLFxuXHRcdFx0XHRcdGQgPSBvcHRpb25zLmRlZmF1bHRWYWx1ZSxcblx0XHRcdFx0XHRpLCB0ZW1wO1xuXHRcdFx0XHRkZWZhdWx0cyA9IGRlZmF1bHRzIHx8IFtkXTtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRvcHRpb25zLnByZWZpeCA9IChpID09PSAwICYmIG9wdGlvbnMucHJlZml4KTtcblx0XHRcdFx0XHRvcHRpb25zLmRlZmF1bHRWYWx1ZSA9IGRlZmF1bHRzW2ldIHx8IGQ7XG5cdFx0XHRcdFx0dGVtcCA9IG5ldyBTcGVjaWFsUHJvcChhW2ldLCBvcHRpb25zKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0Ly9jcmVhdGVzIGEgcGxhY2Vob2xkZXIgc3BlY2lhbCBwcm9wIGZvciBhIHBsdWdpbiBzbyB0aGF0IHRoZSBwcm9wZXJ0eSBnZXRzIGNhdWdodCB0aGUgZmlyc3QgdGltZSBhIHR3ZWVuIG9mIGl0IGlzIGF0dGVtcHRlZCwgYW5kIGF0IHRoYXQgdGltZSBpdCBtYWtlcyB0aGUgcGx1Z2luIHJlZ2lzdGVyIGl0c2VsZiwgdGh1cyB0YWtpbmcgb3ZlciBmb3IgYWxsIGZ1dHVyZSB0d2VlbnMgb2YgdGhhdCBwcm9wZXJ0eS4gVGhpcyBhbGxvd3MgdXMgdG8gbm90IG1hbmRhdGUgdGhhdCB0aGluZ3MgbG9hZCBpbiBhIHBhcnRpY3VsYXIgb3JkZXIgYW5kIGl0IGFsc28gYWxsb3dzIHVzIHRvIGxvZygpIGFuIGVycm9yIHRoYXQgaW5mb3JtcyB0aGUgdXNlciB3aGVuIHRoZXkgYXR0ZW1wdCB0byB0d2VlbiBhbiBleHRlcm5hbCBwbHVnaW4tcmVsYXRlZCBwcm9wZXJ0eSB3aXRob3V0IGxvYWRpbmcgaXRzIC5qcyBmaWxlLlxuXHRcdFx0X3JlZ2lzdGVyUGx1Z2luUHJvcCA9IGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0aWYgKCFfc3BlY2lhbFByb3BzW3BdKSB7XG5cdFx0XHRcdFx0dmFyIHBsdWdpbk5hbWUgPSBwLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcC5zdWJzdHIoMSkgKyBcIlBsdWdpblwiO1xuXHRcdFx0XHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChwLCB7cGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4sIHZhcnMpIHtcblx0XHRcdFx0XHRcdHZhciBwbHVnaW5DbGFzcyA9IF9nbG9iYWxzLmNvbS5ncmVlbnNvY2sucGx1Z2luc1twbHVnaW5OYW1lXTtcblx0XHRcdFx0XHRcdGlmICghcGx1Z2luQ2xhc3MpIHtcblx0XHRcdFx0XHRcdFx0X2xvZyhcIkVycm9yOiBcIiArIHBsdWdpbk5hbWUgKyBcIiBqcyBmaWxlIG5vdCBsb2FkZWQuXCIpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcHQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRwbHVnaW5DbGFzcy5fY3NzUmVnaXN0ZXIoKTtcblx0XHRcdFx0XHRcdHJldHVybiBfc3BlY2lhbFByb3BzW3BdLnBhcnNlKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4sIHZhcnMpO1xuXHRcdFx0XHRcdH19KTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXG5cdFx0cCA9IFNwZWNpYWxQcm9wLnByb3RvdHlwZTtcblxuXHRcdC8qKlxuXHRcdCAqIEFsaWFzIGZvciBfcGFyc2VDb21wbGV4KCkgdGhhdCBhdXRvbWF0aWNhbGx5IHBsdWdzIGluIGNlcnRhaW4gdmFsdWVzIGZvciB0aGlzIFNwZWNpYWxQcm9wLCBsaWtlIGl0cyBwcm9wZXJ0eSBuYW1lLCB3aGV0aGVyIG9yIG5vdCBjb2xvcnMgc2hvdWxkIGJlIHNlbnNlZCwgdGhlIGRlZmF1bHQgdmFsdWUsIGFuZCBwcmlvcml0eS4gSXQgYWxzbyBsb29rcyBmb3IgYW55IGtleXdvcmQgdGhhdCB0aGUgU3BlY2lhbFByb3AgZGVmaW5lcyAobGlrZSBcImluc2V0XCIgZm9yIGJveFNoYWRvdykgYW5kIGVuc3VyZXMgdGhhdCB0aGUgYmVnaW5uaW5nIGFuZCBlbmRpbmcgdmFsdWVzIGhhdmUgdGhlIHNhbWUgbnVtYmVyIG9mIHZhbHVlcyBmb3IgU3BlY2lhbFByb3BzIHdoZXJlIG11bHRpIGlzIHRydWUgKGxpa2UgYm94U2hhZG93IGFuZCB0ZXh0U2hhZG93IGNhbiBoYXZlIGEgY29tbWEtZGVsaW1pdGVkIGxpc3QpXG5cdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IHRhcmdldCBlbGVtZW50XG5cdFx0ICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcnxvYmplY3QpfSBiIGJlZ2lubmluZyB2YWx1ZVxuXHRcdCAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXJ8b2JqZWN0KX0gZSBlbmRpbmcgKGRlc3RpbmF0aW9uKSB2YWx1ZVxuXHRcdCAqIEBwYXJhbSB7Q1NTUHJvcFR3ZWVuPX0gcHQgbmV4dCBDU1NQcm9wVHdlZW4gaW4gdGhlIGxpbmtlZCBsaXN0XG5cdFx0ICogQHBhcmFtIHtUd2VlblBsdWdpbj19IHBsdWdpbiBJZiBhbm90aGVyIHBsdWdpbiB3aWxsIGJlIHR3ZWVuaW5nIHRoZSBjb21wbGV4IHZhbHVlLCB0aGF0IFR3ZWVuUGx1Z2luIGluc3RhbmNlIGdvZXMgaGVyZS5cblx0XHQgKiBAcGFyYW0ge2Z1bmN0aW9uPX0gc2V0UmF0aW8gSWYgYSBjdXN0b20gc2V0UmF0aW8oKSBtZXRob2Qgc2hvdWxkIGJlIHVzZWQgdG8gaGFuZGxlIHRoaXMgY29tcGxleCB2YWx1ZSwgdGhhdCBnb2VzIGhlcmUuXG5cdFx0ICogQHJldHVybiB7Q1NTUHJvcFR3ZWVuPX0gRmlyc3QgQ1NTUHJvcFR3ZWVuIGluIHRoZSBsaW5rZWQgbGlzdFxuXHRcdCAqL1xuXHRcdHAucGFyc2VDb21wbGV4ID0gZnVuY3Rpb24odCwgYiwgZSwgcHQsIHBsdWdpbiwgc2V0UmF0aW8pIHtcblx0XHRcdHZhciBrd2QgPSB0aGlzLmtleXdvcmQsXG5cdFx0XHRcdGksIGJhLCBlYSwgbCwgYmksIGVpO1xuXHRcdFx0Ly9pZiB0aGlzIFNwZWNpYWxQcm9wJ3MgdmFsdWUgY2FuIGNvbnRhaW4gYSBjb21tYS1kZWxpbWl0ZWQgbGlzdCBvZiB2YWx1ZXMgKGxpa2UgYm94U2hhZG93IG9yIHRleHRTaGFkb3cpLCB3ZSBtdXN0IHBhcnNlIHRoZW0gaW4gYSBzcGVjaWFsIHdheSwgYW5kIGxvb2sgZm9yIGEga2V5d29yZCAobGlrZSBcImluc2V0XCIgZm9yIGJveFNoYWRvdykgYW5kIGVuc3VyZSB0aGF0IHRoZSBiZWdpbm5pbmcgYW5kIGVuZGluZyBCT1RIIGhhdmUgaXQgaWYgdGhlIGVuZCBkZWZpbmVzIGl0IGFzIHN1Y2guIFdlIGFsc28gbXVzdCBlbnN1cmUgdGhhdCB0aGVyZSBhcmUgYW4gZXF1YWwgbnVtYmVyIG9mIHZhbHVlcyBzcGVjaWZpZWQgKHdlIGNhbid0IHR3ZWVuIDEgYm94U2hhZG93IHRvIDMgZm9yIGV4YW1wbGUpXG5cdFx0XHRpZiAodGhpcy5tdWx0aSkgaWYgKF9jb21tYXNPdXRzaWRlUGFyZW5FeHAudGVzdChlKSB8fCBfY29tbWFzT3V0c2lkZVBhcmVuRXhwLnRlc3QoYikpIHtcblx0XHRcdFx0YmEgPSBiLnJlcGxhY2UoX2NvbW1hc091dHNpZGVQYXJlbkV4cCwgXCJ8XCIpLnNwbGl0KFwifFwiKTtcblx0XHRcdFx0ZWEgPSBlLnJlcGxhY2UoX2NvbW1hc091dHNpZGVQYXJlbkV4cCwgXCJ8XCIpLnNwbGl0KFwifFwiKTtcblx0XHRcdH0gZWxzZSBpZiAoa3dkKSB7XG5cdFx0XHRcdGJhID0gW2JdO1xuXHRcdFx0XHRlYSA9IFtlXTtcblx0XHRcdH1cblx0XHRcdGlmIChlYSkge1xuXHRcdFx0XHRsID0gKGVhLmxlbmd0aCA+IGJhLmxlbmd0aCkgPyBlYS5sZW5ndGggOiBiYS5sZW5ndGg7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRiID0gYmFbaV0gPSBiYVtpXSB8fCB0aGlzLmRmbHQ7XG5cdFx0XHRcdFx0ZSA9IGVhW2ldID0gZWFbaV0gfHwgdGhpcy5kZmx0O1xuXHRcdFx0XHRcdGlmIChrd2QpIHtcblx0XHRcdFx0XHRcdGJpID0gYi5pbmRleE9mKGt3ZCk7XG5cdFx0XHRcdFx0XHRlaSA9IGUuaW5kZXhPZihrd2QpO1xuXHRcdFx0XHRcdFx0aWYgKGJpICE9PSBlaSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoZWkgPT09IC0xKSB7IC8vaWYgdGhlIGtleXdvcmQgaXNuJ3QgaW4gdGhlIGVuZCB2YWx1ZSwgcmVtb3ZlIGl0IGZyb20gdGhlIGJlZ2lubmluZyBvbmUuXG5cdFx0XHRcdFx0XHRcdFx0YmFbaV0gPSBiYVtpXS5zcGxpdChrd2QpLmpvaW4oXCJcIik7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYmkgPT09IC0xKSB7IC8vaWYgdGhlIGtleXdvcmQgaXNuJ3QgaW4gdGhlIGJlZ2lubmluZywgYWRkIGl0LlxuXHRcdFx0XHRcdFx0XHRcdGJhW2ldICs9IFwiIFwiICsga3dkO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGIgPSBiYS5qb2luKFwiLCBcIik7XG5cdFx0XHRcdGUgPSBlYS5qb2luKFwiLCBcIik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gX3BhcnNlQ29tcGxleCh0LCB0aGlzLnAsIGIsIGUsIHRoaXMuY2xycywgdGhpcy5kZmx0LCBwdCwgdGhpcy5wciwgcGx1Z2luLCBzZXRSYXRpbyk7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIEFjY2VwdHMgYSB0YXJnZXQgYW5kIGVuZCB2YWx1ZSBhbmQgc3BpdHMgYmFjayBhIENTU1Byb3BUd2VlbiB0aGF0IGhhcyBiZWVuIGluc2VydGVkIGludG8gdGhlIENTU1BsdWdpbidzIGxpbmtlZCBsaXN0IGFuZCBjb25mb3JtcyB3aXRoIGFsbCB0aGUgY29udmVudGlvbnMgd2UgdXNlIGludGVybmFsbHksIGxpa2UgdHlwZTotMSwgMCwgMSwgb3IgMiwgc2V0dGluZyB1cCBhbnkgZXh0cmEgcHJvcGVydHkgdHdlZW5zLCBwcmlvcml0eSwgZXRjLiBGb3IgZXhhbXBsZSwgaWYgd2UgaGF2ZSBhIGJveFNoYWRvdyBTcGVjaWFsUHJvcCBhbmQgY2FsbDpcblx0XHQgKiB0aGlzLl9maXJzdFBUID0gc3AucGFyc2UoZWxlbWVudCwgXCI1cHggMTBweCAyMHB4IHJnYigyNTUwLDEwMiw1MSlcIiwgXCJib3hTaGFkb3dcIiwgdGhpcyk7XG5cdFx0ICogSXQgc2hvdWxkIGZpZ3VyZSBvdXQgdGhlIHN0YXJ0aW5nIHZhbHVlIG9mIHRoZSBlbGVtZW50J3MgYm94U2hhZG93LCBjb21wYXJlIGl0IHRvIHRoZSBwcm92aWRlZCBlbmQgdmFsdWUgYW5kIGNyZWF0ZSBhbGwgdGhlIG5lY2Vzc2FyeSBDU1NQcm9wVHdlZW5zIG9mIHRoZSBhcHByb3ByaWF0ZSB0eXBlcyB0byB0d2VlbiB0aGUgYm94U2hhZG93LiBUaGUgQ1NTUHJvcFR3ZWVuIHRoYXQgZ2V0cyBzcGl0IGJhY2sgc2hvdWxkIGFscmVhZHkgYmUgaW5zZXJ0ZWQgaW50byB0aGUgbGlua2VkIGxpc3QgKHRoZSA0dGggcGFyYW1ldGVyIGlzIHRoZSBjdXJyZW50IGhlYWQsIHNvIHByZXBlbmQgdG8gdGhhdCkuXG5cdFx0ICogQHBhcmFtIHshT2JqZWN0fSB0IFRhcmdldCBvYmplY3Qgd2hvc2UgcHJvcGVydHkgaXMgYmVpbmcgdHdlZW5lZFxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBlIEVuZCB2YWx1ZSBhcyBwcm92aWRlZCBpbiB0aGUgdmFycyBvYmplY3QgKHR5cGljYWxseSBhIHN0cmluZywgYnV0IG5vdCBhbHdheXMgLSBsaWtlIGEgdGhyb3dQcm9wcyB3b3VsZCBiZSBhbiBvYmplY3QpLlxuXHRcdCAqIEBwYXJhbSB7IXN0cmluZ30gcCBQcm9wZXJ0eSBuYW1lXG5cdFx0ICogQHBhcmFtIHshQ1NTUGx1Z2lufSBjc3NwIFRoZSBDU1NQbHVnaW4gaW5zdGFuY2UgdGhhdCBzaG91bGQgYmUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgdHdlZW4uXG5cdFx0ICogQHBhcmFtIHs/Q1NTUHJvcFR3ZWVufSBwdCBUaGUgQ1NTUHJvcFR3ZWVuIHRoYXQgaXMgdGhlIGN1cnJlbnQgaGVhZCBvZiB0aGUgbGlua2VkIGxpc3QgKHdlJ2xsIHByZXBlbmQgdG8gaXQpXG5cdFx0ICogQHBhcmFtIHtUd2VlblBsdWdpbj19IHBsdWdpbiBJZiBhIHBsdWdpbiB3aWxsIGJlIHVzZWQgdG8gdHdlZW4gdGhlIHBhcnNlZCB2YWx1ZSwgdGhpcyBpcyB0aGUgcGx1Z2luIGluc3RhbmNlLlxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0PX0gdmFycyBPcmlnaW5hbCB2YXJzIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBkYXRhIGZvciBwYXJzaW5nLlxuXHRcdCAqIEByZXR1cm4ge0NTU1Byb3BUd2Vlbn0gVGhlIGZpcnN0IENTU1Byb3BUd2VlbiBpbiB0aGUgbGlua2VkIGxpc3Qgd2hpY2ggaW5jbHVkZXMgdGhlIG5ldyBvbmUocykgYWRkZWQgYnkgdGhlIHBhcnNlKCkgY2FsbC5cblx0XHQgKi9cblx0XHRwLnBhcnNlID0gZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQsIHBsdWdpbiwgdmFycykge1xuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VDb21wbGV4KHQuc3R5bGUsIHRoaXMuZm9ybWF0KF9nZXRTdHlsZSh0LCB0aGlzLnAsIF9jcywgZmFsc2UsIHRoaXMuZGZsdCkpLCB0aGlzLmZvcm1hdChlKSwgcHQsIHBsdWdpbik7XG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIFJlZ2lzdGVycyBhIHNwZWNpYWwgcHJvcGVydHkgdGhhdCBzaG91bGQgYmUgaW50ZXJjZXB0ZWQgZnJvbSBhbnkgXCJjc3NcIiBvYmplY3RzIGRlZmluZWQgaW4gdHdlZW5zLiBUaGlzIGFsbG93cyB5b3UgdG8gaGFuZGxlIHRoZW0gaG93ZXZlciB5b3Ugd2FudCB3aXRob3V0IENTU1BsdWdpbiBkb2luZyBpdCBmb3IgeW91LiBUaGUgMm5kIHBhcmFtZXRlciBzaG91bGQgYmUgYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgMyBwYXJhbWV0ZXJzOlxuXHRcdCAqICAxKSBUYXJnZXQgb2JqZWN0IHdob3NlIHByb3BlcnR5IHNob3VsZCBiZSB0d2VlbmVkICh0eXBpY2FsbHkgYSBET00gZWxlbWVudClcblx0XHQgKiAgMikgVGhlIGVuZC9kZXN0aW5hdGlvbiB2YWx1ZSAoY291bGQgYmUgYSBzdHJpbmcsIG51bWJlciwgb2JqZWN0LCBvciB3aGF0ZXZlciB5b3Ugd2FudClcblx0XHQgKiAgMykgVGhlIHR3ZWVuIGluc3RhbmNlICh5b3UgcHJvYmFibHkgZG9uJ3QgbmVlZCB0byB3b3JyeSBhYm91dCB0aGlzLCBidXQgaXQgY2FuIGJlIHVzZWZ1bCBmb3IgbG9va2luZyB1cCBpbmZvcm1hdGlvbiBsaWtlIHRoZSBkdXJhdGlvbilcblx0XHQgKlxuXHRcdCAqIFRoZW4sIHlvdXIgZnVuY3Rpb24gc2hvdWxkIHJldHVybiBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgY2FsbGVkIGVhY2ggdGltZSB0aGUgdHdlZW4gZ2V0cyByZW5kZXJlZCwgcGFzc2luZyBhIG51bWVyaWMgXCJyYXRpb1wiIHBhcmFtZXRlciB0byB5b3VyIGZ1bmN0aW9uIHRoYXQgaW5kaWNhdGVzIHRoZSBjaGFuZ2UgZmFjdG9yICh1c3VhbGx5IGJldHdlZW4gMCBhbmQgMSkuIEZvciBleGFtcGxlOlxuXHRcdCAqXG5cdFx0ICogQ1NTUGx1Z2luLnJlZ2lzdGVyU3BlY2lhbFByb3AoXCJteUN1c3RvbVByb3BcIiwgZnVuY3Rpb24odGFyZ2V0LCB2YWx1ZSwgdHdlZW4pIHtcblx0XHQgKiAgICAgIHZhciBzdGFydCA9IHRhcmdldC5zdHlsZS53aWR0aDtcblx0XHQgKiAgICAgIHJldHVybiBmdW5jdGlvbihyYXRpbykge1xuXHRcdCAqICAgICAgICAgICAgICB0YXJnZXQuc3R5bGUud2lkdGggPSAoc3RhcnQgKyB2YWx1ZSAqIHJhdGlvKSArIFwicHhcIjtcblx0XHQgKiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXQgd2lkdGggdG8gXCIgKyB0YXJnZXQuc3R5bGUud2lkdGgpO1xuXHRcdCAqICAgICAgICAgIH1cblx0XHQgKiB9LCAwKTtcblx0XHQgKlxuXHRcdCAqIFRoZW4sIHdoZW4gSSBkbyB0aGlzIHR3ZWVuLCBpdCB3aWxsIHRyaWdnZXIgbXkgc3BlY2lhbCBwcm9wZXJ0eTpcblx0XHQgKlxuXHRcdCAqIFR3ZWVuTGl0ZS50byhlbGVtZW50LCAxLCB7Y3NzOntteUN1c3RvbVByb3A6MTAwfX0pO1xuXHRcdCAqXG5cdFx0ICogSW4gdGhlIGV4YW1wbGUsIG9mIGNvdXJzZSwgd2UncmUganVzdCBjaGFuZ2luZyB0aGUgd2lkdGgsIGJ1dCB5b3UgY2FuIGRvIGFueXRoaW5nIHlvdSB3YW50LlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHshc3RyaW5nfSBuYW1lIFByb3BlcnR5IG5hbWUgKG9yIGNvbW1hLWRlbGltaXRlZCBsaXN0IG9mIHByb3BlcnR5IG5hbWVzKSB0aGF0IHNob3VsZCBiZSBpbnRlcmNlcHRlZCBhbmQgaGFuZGxlZCBieSB5b3VyIGZ1bmN0aW9uLiBGb3IgZXhhbXBsZSwgaWYgSSBkZWZpbmUgXCJteUN1c3RvbVByb3BcIiwgdGhlbiBpdCB3b3VsZCBoYW5kbGUgdGhhdCBwb3J0aW9uIG9mIHRoZSBmb2xsb3dpbmcgdHdlZW46IFR3ZWVuTGl0ZS50byhlbGVtZW50LCAxLCB7Y3NzOntteUN1c3RvbVByb3A6MTAwfX0pXG5cdFx0ICogQHBhcmFtIHshZnVuY3Rpb24oT2JqZWN0LCBPYmplY3QsIE9iamVjdCwgc3RyaW5nKTpmdW5jdGlvbihudW1iZXIpfSBvbkluaXRUd2VlbiBUaGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIGEgdHdlZW4gb2YgdGhpcyBzcGVjaWFsIHByb3BlcnR5IGlzIHBlcmZvcm1lZC4gVGhlIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSA0IHBhcmFtZXRlcnM6IDEpIFRhcmdldCBvYmplY3QgdGhhdCBzaG91bGQgYmUgdHdlZW5lZCwgMikgVmFsdWUgdGhhdCB3YXMgcGFzc2VkIHRvIHRoZSB0d2VlbiwgMykgVGhlIHR3ZWVuIGluc3RhbmNlIGl0c2VsZiAocmFyZWx5IHVzZWQpLCBhbmQgNCkgVGhlIHByb3BlcnR5IG5hbWUgdGhhdCdzIGJlaW5nIHR3ZWVuZWQuIFlvdXIgZnVuY3Rpb24gc2hvdWxkIHJldHVybiBhIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGNhbGxlZCBvbiBldmVyeSB1cGRhdGUgb2YgdGhlIHR3ZWVuLiBUaGF0IGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSBhIHNpbmdsZSBwYXJhbWV0ZXIgdGhhdCBpcyBhIFwiY2hhbmdlIGZhY3RvclwiIHZhbHVlICh0eXBpY2FsbHkgYmV0d2VlbiAwIGFuZCAxKSBpbmRpY2F0aW5nIHRoZSBhbW91bnQgb2YgY2hhbmdlIGFzIGEgcmF0aW8uIFlvdSBjYW4gdXNlIHRoaXMgdG8gZGV0ZXJtaW5lIGhvdyB0byBzZXQgdGhlIHZhbHVlcyBhcHByb3ByaWF0ZWx5IGluIHlvdXIgZnVuY3Rpb24uXG5cdFx0ICogQHBhcmFtIHtudW1iZXI9fSBwcmlvcml0eSBQcmlvcml0eSB0aGF0IGhlbHBzIHRoZSBlbmdpbmUgZGV0ZXJtaW5lIHRoZSBvcmRlciBpbiB3aGljaCB0byBzZXQgdGhlIHByb3BlcnRpZXMgKGRlZmF1bHQ6IDApLiBIaWdoZXIgcHJpb3JpdHkgcHJvcGVydGllcyB3aWxsIGJlIHVwZGF0ZWQgYmVmb3JlIGxvd2VyIHByaW9yaXR5IG9uZXMuXG5cdFx0ICovXG5cdFx0Q1NTUGx1Z2luLnJlZ2lzdGVyU3BlY2lhbFByb3AgPSBmdW5jdGlvbihuYW1lLCBvbkluaXRUd2VlbiwgcHJpb3JpdHkpIHtcblx0XHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChuYW1lLCB7cGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4sIHZhcnMpIHtcblx0XHRcdFx0dmFyIHJ2ID0gbmV3IENTU1Byb3BUd2Vlbih0LCBwLCAwLCAwLCBwdCwgMiwgcCwgZmFsc2UsIHByaW9yaXR5KTtcblx0XHRcdFx0cnYucGx1Z2luID0gcGx1Z2luO1xuXHRcdFx0XHRydi5zZXRSYXRpbyA9IG9uSW5pdFR3ZWVuKHQsIGUsIGNzc3AuX3R3ZWVuLCBwKTtcblx0XHRcdFx0cmV0dXJuIHJ2O1xuXHRcdFx0fSwgcHJpb3JpdHk6cHJpb3JpdHl9KTtcblx0XHR9O1xuXG5cblxuXG5cblxuXHRcdC8vdHJhbnNmb3JtLXJlbGF0ZWQgbWV0aG9kcyBhbmQgcHJvcGVydGllc1xuXHRcdENTU1BsdWdpbi51c2VTVkdUcmFuc2Zvcm1BdHRyID0gX2lzU2FmYXJpIHx8IF9pc0ZpcmVmb3g7IC8vU2FmYXJpIGFuZCBGaXJlZm94IGJvdGggaGF2ZSBzb21lIHJlbmRlcmluZyBidWdzIHdoZW4gYXBwbHlpbmcgQ1NTIHRyYW5zZm9ybXMgdG8gU1ZHIGVsZW1lbnRzLCBzbyBkZWZhdWx0IHRvIHVzaW5nIHRoZSBcInRyYW5zZm9ybVwiIGF0dHJpYnV0ZSBpbnN0ZWFkICh1c2VycyBjYW4gb3ZlcnJpZGUgdGhpcykuXG5cdFx0dmFyIF90cmFuc2Zvcm1Qcm9wcyA9IChcInNjYWxlWCxzY2FsZVksc2NhbGVaLHgseSx6LHNrZXdYLHNrZXdZLHJvdGF0aW9uLHJvdGF0aW9uWCxyb3RhdGlvblkscGVyc3BlY3RpdmUseFBlcmNlbnQseVBlcmNlbnRcIikuc3BsaXQoXCIsXCIpLFxuXHRcdFx0X3RyYW5zZm9ybVByb3AgPSBfY2hlY2tQcm9wUHJlZml4KFwidHJhbnNmb3JtXCIpLCAvL3RoZSBKYXZhc2NyaXB0IChjYW1lbENhc2UpIHRyYW5zZm9ybSBwcm9wZXJ0eSwgbGlrZSBtc1RyYW5zZm9ybSwgV2Via2l0VHJhbnNmb3JtLCBNb3pUcmFuc2Zvcm0sIG9yIE9UcmFuc2Zvcm0uXG5cdFx0XHRfdHJhbnNmb3JtUHJvcENTUyA9IF9wcmVmaXhDU1MgKyBcInRyYW5zZm9ybVwiLFxuXHRcdFx0X3RyYW5zZm9ybU9yaWdpblByb3AgPSBfY2hlY2tQcm9wUHJlZml4KFwidHJhbnNmb3JtT3JpZ2luXCIpLFxuXHRcdFx0X3N1cHBvcnRzM0QgPSAoX2NoZWNrUHJvcFByZWZpeChcInBlcnNwZWN0aXZlXCIpICE9PSBudWxsKSxcblx0XHRcdFRyYW5zZm9ybSA9IF9pbnRlcm5hbHMuVHJhbnNmb3JtID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMucGVyc3BlY3RpdmUgPSBwYXJzZUZsb2F0KENTU1BsdWdpbi5kZWZhdWx0VHJhbnNmb3JtUGVyc3BlY3RpdmUpIHx8IDA7XG5cdFx0XHRcdHRoaXMuZm9yY2UzRCA9IChDU1NQbHVnaW4uZGVmYXVsdEZvcmNlM0QgPT09IGZhbHNlIHx8ICFfc3VwcG9ydHMzRCkgPyBmYWxzZSA6IENTU1BsdWdpbi5kZWZhdWx0Rm9yY2UzRCB8fCBcImF1dG9cIjtcblx0XHRcdH0sXG5cdFx0XHRfU1ZHRWxlbWVudCA9IHdpbmRvdy5TVkdFbGVtZW50LFxuXHRcdFx0X3VzZVNWR1RyYW5zZm9ybUF0dHIsXG5cdFx0XHQvL1NvbWUgYnJvd3NlcnMgKGxpa2UgRmlyZWZveCBhbmQgSUUpIGRvbid0IGhvbm9yIHRyYW5zZm9ybS1vcmlnaW4gcHJvcGVybHkgaW4gU1ZHIGVsZW1lbnRzLCBzbyB3ZSBuZWVkIHRvIG1hbnVhbGx5IGFkanVzdCB0aGUgbWF0cml4IGFjY29yZGluZ2x5LiBXZSBmZWF0dXJlIGRldGVjdCBoZXJlIHJhdGhlciB0aGFuIGFsd2F5cyBkb2luZyB0aGUgY29udmVyc2lvbiBmb3IgY2VydGFpbiBicm93c2VycyBiZWNhdXNlIHRoZXkgbWF5IGZpeCB0aGUgcHJvYmxlbSBhdCBzb21lIHBvaW50IGluIHRoZSBmdXR1cmUuXG5cblx0XHRcdF9jcmVhdGVTVkcgPSBmdW5jdGlvbih0eXBlLCBjb250YWluZXIsIGF0dHJpYnV0ZXMpIHtcblx0XHRcdFx0dmFyIGVsZW1lbnQgPSBfZG9jLmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIHR5cGUpLFxuXHRcdFx0XHRcdHJlZyA9IC8oW2Etel0pKFtBLVpdKS9nLFxuXHRcdFx0XHRcdHA7XG5cdFx0XHRcdGZvciAocCBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGVOUyhudWxsLCBwLnJlcGxhY2UocmVnLCBcIiQxLSQyXCIpLnRvTG93ZXJDYXNlKCksIGF0dHJpYnV0ZXNbcF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChlbGVtZW50KTtcblx0XHRcdFx0cmV0dXJuIGVsZW1lbnQ7XG5cdFx0XHR9LFxuXHRcdFx0X2RvY0VsZW1lbnQgPSBfZG9jLmRvY3VtZW50RWxlbWVudCxcblx0XHRcdF9mb3JjZVNWR1RyYW5zZm9ybUF0dHIgPSAoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vSUUgYW5kIEFuZHJvaWQgc3RvY2sgZG9uJ3Qgc3VwcG9ydCBDU1MgdHJhbnNmb3JtcyBvbiBTVkcgZWxlbWVudHMsIHNvIHdlIG11c3Qgd3JpdGUgdGhlbSB0byB0aGUgXCJ0cmFuc2Zvcm1cIiBhdHRyaWJ1dGUuIFdlIHBvcHVsYXRlIHRoaXMgdmFyaWFibGUgaW4gdGhlIF9wYXJzZVRyYW5zZm9ybSgpIG1ldGhvZCwgYW5kIG9ubHkgaWYvd2hlbiB3ZSBjb21lIGFjcm9zcyBhbiBTVkcgZWxlbWVudFxuXHRcdFx0XHR2YXIgZm9yY2UgPSBfaWVWZXJzIHx8ICgvQW5kcm9pZC9pLnRlc3QoX2FnZW50KSAmJiAhd2luZG93LmNocm9tZSksXG5cdFx0XHRcdFx0c3ZnLCByZWN0LCB3aWR0aDtcblx0XHRcdFx0aWYgKF9kb2MuY3JlYXRlRWxlbWVudE5TICYmICFmb3JjZSkgeyAvL0lFOCBhbmQgZWFybGllciBkb2Vzbid0IHN1cHBvcnQgU1ZHIGFueXdheVxuXHRcdFx0XHRcdHN2ZyA9IF9jcmVhdGVTVkcoXCJzdmdcIiwgX2RvY0VsZW1lbnQpO1xuXHRcdFx0XHRcdHJlY3QgPSBfY3JlYXRlU1ZHKFwicmVjdFwiLCBzdmcsIHt3aWR0aDoxMDAsIGhlaWdodDo1MCwgeDoxMDB9KTtcblx0XHRcdFx0XHR3aWR0aCA9IHJlY3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG5cdFx0XHRcdFx0cmVjdC5zdHlsZVtfdHJhbnNmb3JtT3JpZ2luUHJvcF0gPSBcIjUwJSA1MCVcIjtcblx0XHRcdFx0XHRyZWN0LnN0eWxlW190cmFuc2Zvcm1Qcm9wXSA9IFwic2NhbGVYKDAuNSlcIjtcblx0XHRcdFx0XHRmb3JjZSA9ICh3aWR0aCA9PT0gcmVjdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAmJiAhKF9pc0ZpcmVmb3ggJiYgX3N1cHBvcnRzM0QpKTsgLy9ub3RlOiBGaXJlZm94IGZhaWxzIHRoZSB0ZXN0IGV2ZW4gdGhvdWdoIGl0IGRvZXMgc3VwcG9ydCBDU1MgdHJhbnNmb3JtcyBpbiAzRC4gU2luY2Ugd2UgY2FuJ3QgcHVzaCAzRCBzdHVmZiBpbnRvIHRoZSB0cmFuc2Zvcm0gYXR0cmlidXRlLCB3ZSBmb3JjZSBGaXJlZm94IHRvIHBhc3MgdGhlIHRlc3QgaGVyZSAoYXMgbG9uZyBhcyBpdCBkb2VzIHRydWx5IHN1cHBvcnQgM0QpLlxuXHRcdFx0XHRcdF9kb2NFbGVtZW50LnJlbW92ZUNoaWxkKHN2Zyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIGZvcmNlO1xuXHRcdFx0fSkoKSxcblx0XHRcdF9wYXJzZVNWR09yaWdpbiA9IGZ1bmN0aW9uKGUsIGxvY2FsLCBkZWNvcmF0ZWUsIGFic29sdXRlLCBzbW9vdGhPcmlnaW4pIHtcblx0XHRcdFx0dmFyIHRtID0gZS5fZ3NUcmFuc2Zvcm0sXG5cdFx0XHRcdFx0bSA9IF9nZXRNYXRyaXgoZSwgdHJ1ZSksXG5cdFx0XHRcdFx0diwgeCwgeSwgeE9yaWdpbiwgeU9yaWdpbiwgYSwgYiwgYywgZCwgdHgsIHR5LCBkZXRlcm1pbmFudCwgeE9yaWdpbk9sZCwgeU9yaWdpbk9sZDtcblx0XHRcdFx0aWYgKHRtKSB7XG5cdFx0XHRcdFx0eE9yaWdpbk9sZCA9IHRtLnhPcmlnaW47IC8vcmVjb3JkIHRoZSBvcmlnaW5hbCB2YWx1ZXMgYmVmb3JlIHdlIGFsdGVyIHRoZW0uXG5cdFx0XHRcdFx0eU9yaWdpbk9sZCA9IHRtLnlPcmlnaW47XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCFhYnNvbHV0ZSB8fCAodiA9IGFic29sdXRlLnNwbGl0KFwiIFwiKSkubGVuZ3RoIDwgMikge1xuXHRcdFx0XHRcdGIgPSBlLmdldEJCb3goKTtcblx0XHRcdFx0XHRsb2NhbCA9IF9wYXJzZVBvc2l0aW9uKGxvY2FsKS5zcGxpdChcIiBcIik7XG5cdFx0XHRcdFx0diA9IFsobG9jYWxbMF0uaW5kZXhPZihcIiVcIikgIT09IC0xID8gcGFyc2VGbG9hdChsb2NhbFswXSkgLyAxMDAgKiBiLndpZHRoIDogcGFyc2VGbG9hdChsb2NhbFswXSkpICsgYi54LFxuXHRcdFx0XHRcdFx0IChsb2NhbFsxXS5pbmRleE9mKFwiJVwiKSAhPT0gLTEgPyBwYXJzZUZsb2F0KGxvY2FsWzFdKSAvIDEwMCAqIGIuaGVpZ2h0IDogcGFyc2VGbG9hdChsb2NhbFsxXSkpICsgYi55XTtcblx0XHRcdFx0fVxuXHRcdFx0XHRkZWNvcmF0ZWUueE9yaWdpbiA9IHhPcmlnaW4gPSBwYXJzZUZsb2F0KHZbMF0pO1xuXHRcdFx0XHRkZWNvcmF0ZWUueU9yaWdpbiA9IHlPcmlnaW4gPSBwYXJzZUZsb2F0KHZbMV0pO1xuXHRcdFx0XHRpZiAoYWJzb2x1dGUgJiYgbSAhPT0gX2lkZW50aXR5MkRNYXRyaXgpIHsgLy9pZiBzdmdPcmlnaW4gaXMgYmVpbmcgc2V0LCB3ZSBtdXN0IGludmVydCB0aGUgbWF0cml4IGFuZCBkZXRlcm1pbmUgd2hlcmUgdGhlIGFic29sdXRlIHBvaW50IGlzLCBmYWN0b3JpbmcgaW4gdGhlIGN1cnJlbnQgdHJhbnNmb3Jtcy4gT3RoZXJ3aXNlLCB0aGUgc3ZnT3JpZ2luIHdvdWxkIGJlIGJhc2VkIG9uIHRoZSBlbGVtZW50J3Mgbm9uLXRyYW5zZm9ybWVkIHBvc2l0aW9uIG9uIHRoZSBjYW52YXMuXG5cdFx0XHRcdFx0YSA9IG1bMF07XG5cdFx0XHRcdFx0YiA9IG1bMV07XG5cdFx0XHRcdFx0YyA9IG1bMl07XG5cdFx0XHRcdFx0ZCA9IG1bM107XG5cdFx0XHRcdFx0dHggPSBtWzRdO1xuXHRcdFx0XHRcdHR5ID0gbVs1XTtcblx0XHRcdFx0XHRkZXRlcm1pbmFudCA9IChhICogZCAtIGIgKiBjKTtcblx0XHRcdFx0XHR4ID0geE9yaWdpbiAqIChkIC8gZGV0ZXJtaW5hbnQpICsgeU9yaWdpbiAqICgtYyAvIGRldGVybWluYW50KSArICgoYyAqIHR5IC0gZCAqIHR4KSAvIGRldGVybWluYW50KTtcblx0XHRcdFx0XHR5ID0geE9yaWdpbiAqICgtYiAvIGRldGVybWluYW50KSArIHlPcmlnaW4gKiAoYSAvIGRldGVybWluYW50KSAtICgoYSAqIHR5IC0gYiAqIHR4KSAvIGRldGVybWluYW50KTtcblx0XHRcdFx0XHR4T3JpZ2luID0gZGVjb3JhdGVlLnhPcmlnaW4gPSB2WzBdID0geDtcblx0XHRcdFx0XHR5T3JpZ2luID0gZGVjb3JhdGVlLnlPcmlnaW4gPSB2WzFdID0geTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodG0pIHsgLy9hdm9pZCBqdW1wIHdoZW4gdHJhbnNmb3JtT3JpZ2luIGlzIGNoYW5nZWQgLSBhZGp1c3QgdGhlIHgveSB2YWx1ZXMgYWNjb3JkaW5nbHlcblx0XHRcdFx0XHRpZiAoc21vb3RoT3JpZ2luIHx8IChzbW9vdGhPcmlnaW4gIT09IGZhbHNlICYmIENTU1BsdWdpbi5kZWZhdWx0U21vb3RoT3JpZ2luICE9PSBmYWxzZSkpIHtcblx0XHRcdFx0XHRcdHggPSB4T3JpZ2luIC0geE9yaWdpbk9sZDtcblx0XHRcdFx0XHRcdHkgPSB5T3JpZ2luIC0geU9yaWdpbk9sZDtcblx0XHRcdFx0XHRcdC8vb3JpZ2luYWxseSwgd2Ugc2ltcGx5IGFkanVzdGVkIHRoZSB4IGFuZCB5IHZhbHVlcywgYnV0IHRoYXQgd291bGQgY2F1c2UgcHJvYmxlbXMgaWYsIGZvciBleGFtcGxlLCB5b3UgY3JlYXRlZCBhIHJvdGF0aW9uYWwgdHdlZW4gcGFydC13YXkgdGhyb3VnaCBhbiB4L3kgdHdlZW4uIE1hbmFnaW5nIHRoZSBvZmZzZXQgaW4gYSBzZXBhcmF0ZSB2YXJpYWJsZSBnaXZlcyB1cyB1bHRpbWF0ZSBmbGV4aWJpbGl0eS5cblx0XHRcdFx0XHRcdC8vdG0ueCAtPSB4IC0gKHggKiBtWzBdICsgeSAqIG1bMl0pO1xuXHRcdFx0XHRcdFx0Ly90bS55IC09IHkgLSAoeCAqIG1bMV0gKyB5ICogbVszXSk7XG5cdFx0XHRcdFx0XHR0bS54T2Zmc2V0ICs9ICh4ICogbVswXSArIHkgKiBtWzJdKSAtIHg7XG5cdFx0XHRcdFx0XHR0bS55T2Zmc2V0ICs9ICh4ICogbVsxXSArIHkgKiBtWzNdKSAtIHk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRtLnhPZmZzZXQgPSB0bS55T2Zmc2V0ID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXN2Zy1vcmlnaW5cIiwgdi5qb2luKFwiIFwiKSk7XG5cdFx0XHR9LFxuXHRcdFx0X2lzU1ZHID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRyZXR1cm4gISEoX1NWR0VsZW1lbnQgJiYgdHlwZW9mKGUuZ2V0QkJveCkgPT09IFwiZnVuY3Rpb25cIiAmJiBlLmdldENUTSAmJiAoIWUucGFyZW50Tm9kZSB8fCAoZS5wYXJlbnROb2RlLmdldEJCb3ggJiYgZS5wYXJlbnROb2RlLmdldENUTSkpKTtcblx0XHRcdH0sXG5cdFx0XHRfaWRlbnRpdHkyRE1hdHJpeCA9IFsxLDAsMCwxLDAsMF0sXG5cdFx0XHRfZ2V0TWF0cml4ID0gZnVuY3Rpb24oZSwgZm9yY2UyRCkge1xuXHRcdFx0XHR2YXIgdG0gPSBlLl9nc1RyYW5zZm9ybSB8fCBuZXcgVHJhbnNmb3JtKCksXG5cdFx0XHRcdFx0cm5kID0gMTAwMDAwLFxuXHRcdFx0XHRcdGlzRGVmYXVsdCwgcywgbSwgbiwgZGVjO1xuXHRcdFx0XHRpZiAoX3RyYW5zZm9ybVByb3ApIHtcblx0XHRcdFx0XHRzID0gX2dldFN0eWxlKGUsIF90cmFuc2Zvcm1Qcm9wQ1NTLCBudWxsLCB0cnVlKTtcblx0XHRcdFx0fSBlbHNlIGlmIChlLmN1cnJlbnRTdHlsZSkge1xuXHRcdFx0XHRcdC8vZm9yIG9sZGVyIHZlcnNpb25zIG9mIElFLCB3ZSBuZWVkIHRvIGludGVycHJldCB0aGUgZmlsdGVyIHBvcnRpb24gdGhhdCBpcyBpbiB0aGUgZm9ybWF0OiBwcm9naWQ6RFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuTWF0cml4KE0xMT02LjEyMzIzMzk5NTczNjc2NmUtMTcsIE0xMj0tMSwgTTIxPTEsIE0yMj02LjEyMzIzMzk5NTczNjc2NmUtMTcsIHNpemluZ01ldGhvZD0nYXV0byBleHBhbmQnKSBOb3RpY2UgdGhhdCB3ZSBuZWVkIHRvIHN3YXAgYiBhbmQgYyBjb21wYXJlZCB0byBhIG5vcm1hbCBtYXRyaXguXG5cdFx0XHRcdFx0cyA9IGUuY3VycmVudFN0eWxlLmZpbHRlci5tYXRjaChfaWVHZXRNYXRyaXhFeHApO1xuXHRcdFx0XHRcdHMgPSAocyAmJiBzLmxlbmd0aCA9PT0gNCkgPyBbc1swXS5zdWJzdHIoNCksIE51bWJlcihzWzJdLnN1YnN0cig0KSksIE51bWJlcihzWzFdLnN1YnN0cig0KSksIHNbM10uc3Vic3RyKDQpLCAodG0ueCB8fCAwKSwgKHRtLnkgfHwgMCldLmpvaW4oXCIsXCIpIDogXCJcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpc0RlZmF1bHQgPSAoIXMgfHwgcyA9PT0gXCJub25lXCIgfHwgcyA9PT0gXCJtYXRyaXgoMSwgMCwgMCwgMSwgMCwgMClcIik7XG5cdFx0XHRcdGlmICh0bS5zdmcgfHwgKGUuZ2V0QkJveCAmJiBfaXNTVkcoZSkpKSB7XG5cdFx0XHRcdFx0aWYgKGlzRGVmYXVsdCAmJiAoZS5zdHlsZVtfdHJhbnNmb3JtUHJvcF0gKyBcIlwiKS5pbmRleE9mKFwibWF0cml4XCIpICE9PSAtMSkgeyAvL3NvbWUgYnJvd3NlcnMgKGxpa2UgQ2hyb21lIDQwKSBkb24ndCBjb3JyZWN0bHkgcmVwb3J0IHRyYW5zZm9ybXMgdGhhdCBhcmUgYXBwbGllZCBpbmxpbmUgb24gYW4gU1ZHIGVsZW1lbnQgKHRoZXkgZG9uJ3QgZ2V0IGluY2x1ZGVkIGluIHRoZSBjb21wdXRlZCBzdHlsZSksIHNvIHdlIGRvdWJsZS1jaGVjayBoZXJlIGFuZCBhY2NlcHQgbWF0cml4IHZhbHVlc1xuXHRcdFx0XHRcdFx0cyA9IGUuc3R5bGVbX3RyYW5zZm9ybVByb3BdO1xuXHRcdFx0XHRcdFx0aXNEZWZhdWx0ID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bSA9IGUuZ2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIpO1xuXHRcdFx0XHRcdGlmIChpc0RlZmF1bHQgJiYgbSkge1xuXHRcdFx0XHRcdFx0aWYgKG0uaW5kZXhPZihcIm1hdHJpeFwiKSAhPT0gLTEpIHsgLy9qdXN0IGluIGNhc2UgdGhlcmUncyBhIFwidHJhbnNmb3JtXCIgdmFsdWUgc3BlY2lmaWVkIGFzIGFuIGF0dHJpYnV0ZSBpbnN0ZWFkIG9mIENTUyBzdHlsZS4gQWNjZXB0IGVpdGhlciBhIG1hdHJpeCgpIG9yIHNpbXBsZSB0cmFuc2xhdGUoKSB2YWx1ZSB0aG91Z2guXG5cdFx0XHRcdFx0XHRcdHMgPSBtO1xuXHRcdFx0XHRcdFx0XHRpc0RlZmF1bHQgPSAwO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChtLmluZGV4T2YoXCJ0cmFuc2xhdGVcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHMgPSBcIm1hdHJpeCgxLDAsMCwxLFwiICsgbS5tYXRjaCgvKD86XFwtfFxcYilbXFxkXFwtXFwuZV0rXFxiL2dpKS5qb2luKFwiLFwiKSArIFwiKVwiO1xuXHRcdFx0XHRcdFx0XHRpc0RlZmF1bHQgPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoaXNEZWZhdWx0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIF9pZGVudGl0eTJETWF0cml4O1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vc3BsaXQgdGhlIG1hdHJpeCB2YWx1ZXMgb3V0IGludG8gYW4gYXJyYXkgKG0gZm9yIG1hdHJpeClcblx0XHRcdFx0bSA9IChzIHx8IFwiXCIpLm1hdGNoKC8oPzpcXC18XFxiKVtcXGRcXC1cXC5lXStcXGIvZ2kpIHx8IFtdO1xuXHRcdFx0XHRpID0gbS5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdG4gPSBOdW1iZXIobVtpXSk7XG5cdFx0XHRcdFx0bVtpXSA9IChkZWMgPSBuIC0gKG4gfD0gMCkpID8gKChkZWMgKiBybmQgKyAoZGVjIDwgMCA/IC0wLjUgOiAwLjUpKSB8IDApIC8gcm5kICsgbiA6IG47IC8vY29udmVydCBzdHJpbmdzIHRvIE51bWJlcnMgYW5kIHJvdW5kIHRvIDUgZGVjaW1hbCBwbGFjZXMgdG8gYXZvaWQgaXNzdWVzIHdpdGggdGlueSBudW1iZXJzLiBSb3VnaGx5IDIweCBmYXN0ZXIgdGhhbiBOdW1iZXIudG9GaXhlZCgpLiBXZSBhbHNvIG11c3QgbWFrZSBzdXJlIHRvIHJvdW5kIGJlZm9yZSBkaXZpZGluZyBzbyB0aGF0IHZhbHVlcyBsaWtlIDAuOTk5OTk5OTk5OSBiZWNvbWUgMSB0byBhdm9pZCBnbGl0Y2hlcyBpbiBicm93c2VyIHJlbmRlcmluZyBhbmQgaW50ZXJwcmV0YXRpb24gb2YgZmxpcHBlZC9yb3RhdGVkIDNEIG1hdHJpY2VzLiBBbmQgZG9uJ3QganVzdCBtdWx0aXBseSB0aGUgbnVtYmVyIGJ5IHJuZCwgZmxvb3IgaXQsIGFuZCB0aGVuIGRpdmlkZSBieSBybmQgYmVjYXVzZSB0aGUgYml0d2lzZSBvcGVyYXRpb25zIG1heCBvdXQgYXQgYSAzMi1iaXQgc2lnbmVkIGludGVnZXIsIHRodXMgaXQgY291bGQgZ2V0IGNsaXBwZWQgYXQgYSByZWxhdGl2ZWx5IGxvdyB2YWx1ZSAobGlrZSAyMiwwMDAuMDAwMDAgZm9yIGV4YW1wbGUpLlxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiAoZm9yY2UyRCAmJiBtLmxlbmd0aCA+IDYpID8gW21bMF0sIG1bMV0sIG1bNF0sIG1bNV0sIG1bMTJdLCBtWzEzXV0gOiBtO1xuXHRcdFx0fSxcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBQYXJzZXMgdGhlIHRyYW5zZm9ybSB2YWx1ZXMgZm9yIGFuIGVsZW1lbnQsIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCB4LCB5LCB6LCBzY2FsZVgsIHNjYWxlWSwgc2NhbGVaLCByb3RhdGlvbiwgcm90YXRpb25YLCByb3RhdGlvblksIHNrZXdYLCBhbmQgc2tld1kgcHJvcGVydGllcy4gTm90ZTogYnkgZGVmYXVsdCAoZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMpLCBhbGwgc2tld2luZyBpcyBjb21iaW5lZCBpbnRvIHNrZXdYIGFuZCByb3RhdGlvbiBidXQgc2tld1kgc3RpbGwgaGFzIGEgcGxhY2UgaW4gdGhlIHRyYW5zZm9ybSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gcmVjb3JkIGhvdyBtdWNoIG9mIHRoZSBza2V3IGlzIGF0dHJpYnV0ZWQgdG8gc2tld1ggdnMgc2tld1kuIFJlbWVtYmVyLCBhIHNrZXdZIG9mIDEwIGxvb2tzIHRoZSBzYW1lIGFzIGEgcm90YXRpb24gb2YgMTAgYW5kIHNrZXdYIG9mIC0xMC5cblx0XHRcdCAqIEBwYXJhbSB7IU9iamVjdH0gdCB0YXJnZXQgZWxlbWVudFxuXHRcdFx0ICogQHBhcmFtIHtPYmplY3Q9fSBjcyBjb21wdXRlZCBzdHlsZSBvYmplY3QgKG9wdGlvbmFsKVxuXHRcdFx0ICogQHBhcmFtIHtib29sZWFuPX0gcmVjIGlmIHRydWUsIHRoZSB0cmFuc2Zvcm0gdmFsdWVzIHdpbGwgYmUgcmVjb3JkZWQgdG8gdGhlIHRhcmdldCBlbGVtZW50J3MgX2dzVHJhbnNmb3JtIG9iamVjdCwgbGlrZSB0YXJnZXQuX2dzVHJhbnNmb3JtID0ge3g6MCwgeTowLCB6OjAsIHNjYWxlWDoxLi4ufVxuXHRcdFx0ICogQHBhcmFtIHtib29sZWFuPX0gcGFyc2UgaWYgdHJ1ZSwgd2UnbGwgaWdub3JlIGFueSBfZ3NUcmFuc2Zvcm0gdmFsdWVzIHRoYXQgYWxyZWFkeSBleGlzdCBvbiB0aGUgZWxlbWVudCwgYW5kIGZvcmNlIGEgcmVwYXJzaW5nIG9mIHRoZSBjc3MgKGNhbGN1bGF0ZWQgc3R5bGUpXG5cdFx0XHQgKiBAcmV0dXJuIHtvYmplY3R9IG9iamVjdCBjb250YWluaW5nIGFsbCBvZiB0aGUgdHJhbnNmb3JtIHByb3BlcnRpZXMvdmFsdWVzIGxpa2Uge3g6MCwgeTowLCB6OjAsIHNjYWxlWDoxLi4ufVxuXHRcdFx0ICovXG5cdFx0XHRfZ2V0VHJhbnNmb3JtID0gX2ludGVybmFscy5nZXRUcmFuc2Zvcm0gPSBmdW5jdGlvbih0LCBjcywgcmVjLCBwYXJzZSkge1xuXHRcdFx0XHRpZiAodC5fZ3NUcmFuc2Zvcm0gJiYgcmVjICYmICFwYXJzZSkge1xuXHRcdFx0XHRcdHJldHVybiB0Ll9nc1RyYW5zZm9ybTsgLy9pZiB0aGUgZWxlbWVudCBhbHJlYWR5IGhhcyBhIF9nc1RyYW5zZm9ybSwgdXNlIHRoYXQuIE5vdGU6IHNvbWUgYnJvd3NlcnMgZG9uJ3QgYWNjdXJhdGVseSByZXR1cm4gdGhlIGNhbGN1bGF0ZWQgc3R5bGUgZm9yIHRoZSB0cmFuc2Zvcm0gKHBhcnRpY3VsYXJseSBmb3IgU1ZHKSwgc28gaXQncyBhbG1vc3QgYWx3YXlzIHNhZmVzdCB0byBqdXN0IHVzZSB0aGUgdmFsdWVzIHdlJ3ZlIGFscmVhZHkgYXBwbGllZCByYXRoZXIgdGhhbiByZS1wYXJzaW5nIHRoaW5ncy5cblx0XHRcdFx0fVxuXHRcdFx0XHR2YXIgdG0gPSByZWMgPyB0Ll9nc1RyYW5zZm9ybSB8fCBuZXcgVHJhbnNmb3JtKCkgOiBuZXcgVHJhbnNmb3JtKCksXG5cdFx0XHRcdFx0aW52WCA9ICh0bS5zY2FsZVggPCAwKSwgLy9pbiBvcmRlciB0byBpbnRlcnByZXQgdGhpbmdzIHByb3Blcmx5LCB3ZSBuZWVkIHRvIGtub3cgaWYgdGhlIHVzZXIgYXBwbGllZCBhIG5lZ2F0aXZlIHNjYWxlWCBwcmV2aW91c2x5IHNvIHRoYXQgd2UgY2FuIGFkanVzdCB0aGUgcm90YXRpb24gYW5kIHNrZXdYIGFjY29yZGluZ2x5LiBPdGhlcndpc2UsIGlmIHdlIGFsd2F5cyBpbnRlcnByZXQgYSBmbGlwcGVkIG1hdHJpeCBhcyBhZmZlY3Rpbmcgc2NhbGVZIGFuZCB0aGUgdXNlciBvbmx5IHdhbnRzIHRvIHR3ZWVuIHRoZSBzY2FsZVggb24gbXVsdGlwbGUgc2VxdWVudGlhbCB0d2VlbnMsIGl0IHdvdWxkIGtlZXAgdGhlIG5lZ2F0aXZlIHNjYWxlWSB3aXRob3V0IHRoYXQgYmVpbmcgdGhlIHVzZXIncyBpbnRlbnQuXG5cdFx0XHRcdFx0bWluID0gMC4wMDAwMixcblx0XHRcdFx0XHRybmQgPSAxMDAwMDAsXG5cdFx0XHRcdFx0ek9yaWdpbiA9IF9zdXBwb3J0czNEID8gcGFyc2VGbG9hdChfZ2V0U3R5bGUodCwgX3RyYW5zZm9ybU9yaWdpblByb3AsIGNzLCBmYWxzZSwgXCIwIDAgMFwiKS5zcGxpdChcIiBcIilbMl0pIHx8IHRtLnpPcmlnaW4gIHx8IDAgOiAwLFxuXHRcdFx0XHRcdGRlZmF1bHRUcmFuc2Zvcm1QZXJzcGVjdGl2ZSA9IHBhcnNlRmxvYXQoQ1NTUGx1Z2luLmRlZmF1bHRUcmFuc2Zvcm1QZXJzcGVjdGl2ZSkgfHwgMCxcblx0XHRcdFx0XHRtLCBpLCBzY2FsZVgsIHNjYWxlWSwgcm90YXRpb24sIHNrZXdYO1xuXG5cdFx0XHRcdHRtLnN2ZyA9ICEhKHQuZ2V0QkJveCAmJiBfaXNTVkcodCkpO1xuXHRcdFx0XHRpZiAodG0uc3ZnKSB7XG5cdFx0XHRcdFx0X3BhcnNlU1ZHT3JpZ2luKHQsIF9nZXRTdHlsZSh0LCBfdHJhbnNmb3JtT3JpZ2luUHJvcCwgX2NzLCBmYWxzZSwgXCI1MCUgNTAlXCIpICsgXCJcIiwgdG0sIHQuZ2V0QXR0cmlidXRlKFwiZGF0YS1zdmctb3JpZ2luXCIpKTtcblx0XHRcdFx0XHRfdXNlU1ZHVHJhbnNmb3JtQXR0ciA9IENTU1BsdWdpbi51c2VTVkdUcmFuc2Zvcm1BdHRyIHx8IF9mb3JjZVNWR1RyYW5zZm9ybUF0dHI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bSA9IF9nZXRNYXRyaXgodCk7XG5cdFx0XHRcdGlmIChtICE9PSBfaWRlbnRpdHkyRE1hdHJpeCkge1xuXG5cdFx0XHRcdFx0aWYgKG0ubGVuZ3RoID09PSAxNikge1xuXHRcdFx0XHRcdFx0Ly93ZSdsbCBvbmx5IGxvb2sgYXQgdGhlc2UgcG9zaXRpb24tcmVsYXRlZCA2IHZhcmlhYmxlcyBmaXJzdCBiZWNhdXNlIGlmIHgveS96IGFsbCBtYXRjaCwgaXQncyByZWxhdGl2ZWx5IHNhZmUgdG8gYXNzdW1lIHdlIGRvbid0IG5lZWQgdG8gcmUtcGFyc2UgZXZlcnl0aGluZyB3aGljaCByaXNrcyBsb3NpbmcgaW1wb3J0YW50IHJvdGF0aW9uYWwgaW5mb3JtYXRpb24gKGxpa2Ugcm90YXRpb25YOjE4MCBwbHVzIHJvdGF0aW9uWToxODAgd291bGQgbG9vayB0aGUgc2FtZSBhcyByb3RhdGlvbjoxODAgLSB0aGVyZSdzIG5vIHdheSB0byBrbm93IGZvciBzdXJlIHdoaWNoIGRpcmVjdGlvbiB3YXMgdGFrZW4gYmFzZWQgc29sZWx5IG9uIHRoZSBtYXRyaXgzZCgpIHZhbHVlcylcblx0XHRcdFx0XHRcdHZhciBhMTEgPSBtWzBdLCBhMjEgPSBtWzFdLCBhMzEgPSBtWzJdLCBhNDEgPSBtWzNdLFxuXHRcdFx0XHRcdFx0XHRhMTIgPSBtWzRdLCBhMjIgPSBtWzVdLCBhMzIgPSBtWzZdLCBhNDIgPSBtWzddLFxuXHRcdFx0XHRcdFx0XHRhMTMgPSBtWzhdLCBhMjMgPSBtWzldLCBhMzMgPSBtWzEwXSxcblx0XHRcdFx0XHRcdFx0YTE0ID0gbVsxMl0sIGEyNCA9IG1bMTNdLCBhMzQgPSBtWzE0XSxcblx0XHRcdFx0XHRcdFx0YTQzID0gbVsxMV0sXG5cdFx0XHRcdFx0XHRcdGFuZ2xlID0gTWF0aC5hdGFuMihhMzIsIGEzMyksXG5cdFx0XHRcdFx0XHRcdHQxLCB0MiwgdDMsIHQ0LCBjb3MsIHNpbjtcblxuXHRcdFx0XHRcdFx0Ly93ZSBtYW51YWxseSBjb21wZW5zYXRlIGZvciBub24temVybyB6IGNvbXBvbmVudCBvZiB0cmFuc2Zvcm1PcmlnaW4gdG8gd29yayBhcm91bmQgYnVncyBpbiBTYWZhcmlcblx0XHRcdFx0XHRcdGlmICh0bS56T3JpZ2luKSB7XG5cdFx0XHRcdFx0XHRcdGEzNCA9IC10bS56T3JpZ2luO1xuXHRcdFx0XHRcdFx0XHRhMTQgPSBhMTMqYTM0LW1bMTJdO1xuXHRcdFx0XHRcdFx0XHRhMjQgPSBhMjMqYTM0LW1bMTNdO1xuXHRcdFx0XHRcdFx0XHRhMzQgPSBhMzMqYTM0K3RtLnpPcmlnaW4tbVsxNF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0bS5yb3RhdGlvblggPSBhbmdsZSAqIF9SQUQyREVHO1xuXHRcdFx0XHRcdFx0Ly9yb3RhdGlvblhcblx0XHRcdFx0XHRcdGlmIChhbmdsZSkge1xuXHRcdFx0XHRcdFx0XHRjb3MgPSBNYXRoLmNvcygtYW5nbGUpO1xuXHRcdFx0XHRcdFx0XHRzaW4gPSBNYXRoLnNpbigtYW5nbGUpO1xuXHRcdFx0XHRcdFx0XHR0MSA9IGExMipjb3MrYTEzKnNpbjtcblx0XHRcdFx0XHRcdFx0dDIgPSBhMjIqY29zK2EyMypzaW47XG5cdFx0XHRcdFx0XHRcdHQzID0gYTMyKmNvcythMzMqc2luO1xuXHRcdFx0XHRcdFx0XHRhMTMgPSBhMTIqLXNpbithMTMqY29zO1xuXHRcdFx0XHRcdFx0XHRhMjMgPSBhMjIqLXNpbithMjMqY29zO1xuXHRcdFx0XHRcdFx0XHRhMzMgPSBhMzIqLXNpbithMzMqY29zO1xuXHRcdFx0XHRcdFx0XHRhNDMgPSBhNDIqLXNpbithNDMqY29zO1xuXHRcdFx0XHRcdFx0XHRhMTIgPSB0MTtcblx0XHRcdFx0XHRcdFx0YTIyID0gdDI7XG5cdFx0XHRcdFx0XHRcdGEzMiA9IHQzO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Ly9yb3RhdGlvbllcblx0XHRcdFx0XHRcdGFuZ2xlID0gTWF0aC5hdGFuMihhMTMsIGEzMyk7XG5cdFx0XHRcdFx0XHR0bS5yb3RhdGlvblkgPSBhbmdsZSAqIF9SQUQyREVHO1xuXHRcdFx0XHRcdFx0aWYgKGFuZ2xlKSB7XG5cdFx0XHRcdFx0XHRcdGNvcyA9IE1hdGguY29zKC1hbmdsZSk7XG5cdFx0XHRcdFx0XHRcdHNpbiA9IE1hdGguc2luKC1hbmdsZSk7XG5cdFx0XHRcdFx0XHRcdHQxID0gYTExKmNvcy1hMTMqc2luO1xuXHRcdFx0XHRcdFx0XHR0MiA9IGEyMSpjb3MtYTIzKnNpbjtcblx0XHRcdFx0XHRcdFx0dDMgPSBhMzEqY29zLWEzMypzaW47XG5cdFx0XHRcdFx0XHRcdGEyMyA9IGEyMSpzaW4rYTIzKmNvcztcblx0XHRcdFx0XHRcdFx0YTMzID0gYTMxKnNpbithMzMqY29zO1xuXHRcdFx0XHRcdFx0XHRhNDMgPSBhNDEqc2luK2E0Mypjb3M7XG5cdFx0XHRcdFx0XHRcdGExMSA9IHQxO1xuXHRcdFx0XHRcdFx0XHRhMjEgPSB0Mjtcblx0XHRcdFx0XHRcdFx0YTMxID0gdDM7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHQvL3JvdGF0aW9uWlxuXHRcdFx0XHRcdFx0YW5nbGUgPSBNYXRoLmF0YW4yKGEyMSwgYTExKTtcblx0XHRcdFx0XHRcdHRtLnJvdGF0aW9uID0gYW5nbGUgKiBfUkFEMkRFRztcblx0XHRcdFx0XHRcdGlmIChhbmdsZSkge1xuXHRcdFx0XHRcdFx0XHRjb3MgPSBNYXRoLmNvcygtYW5nbGUpO1xuXHRcdFx0XHRcdFx0XHRzaW4gPSBNYXRoLnNpbigtYW5nbGUpO1xuXHRcdFx0XHRcdFx0XHRhMTEgPSBhMTEqY29zK2ExMipzaW47XG5cdFx0XHRcdFx0XHRcdHQyID0gYTIxKmNvcythMjIqc2luO1xuXHRcdFx0XHRcdFx0XHRhMjIgPSBhMjEqLXNpbithMjIqY29zO1xuXHRcdFx0XHRcdFx0XHRhMzIgPSBhMzEqLXNpbithMzIqY29zO1xuXHRcdFx0XHRcdFx0XHRhMjEgPSB0Mjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHRtLnJvdGF0aW9uWCAmJiBNYXRoLmFicyh0bS5yb3RhdGlvblgpICsgTWF0aC5hYnModG0ucm90YXRpb24pID4gMzU5LjkpIHsgLy93aGVuIHJvdGF0aW9uWSBpcyBzZXQsIGl0IHdpbGwgb2Z0ZW4gYmUgcGFyc2VkIGFzIDE4MCBkZWdyZWVzIGRpZmZlcmVudCB0aGFuIGl0IHNob3VsZCBiZSwgYW5kIHJvdGF0aW9uWCBhbmQgcm90YXRpb24gYm90aCBiZWluZyAxODAgKGl0IGxvb2tzIHRoZSBzYW1lKSwgc28gd2UgYWRqdXN0IGZvciB0aGF0IGhlcmUuXG5cdFx0XHRcdFx0XHRcdHRtLnJvdGF0aW9uWCA9IHRtLnJvdGF0aW9uID0gMDtcblx0XHRcdFx0XHRcdFx0dG0ucm90YXRpb25ZICs9IDE4MDtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0dG0uc2NhbGVYID0gKChNYXRoLnNxcnQoYTExICogYTExICsgYTIxICogYTIxKSAqIHJuZCArIDAuNSkgfCAwKSAvIHJuZDtcblx0XHRcdFx0XHRcdHRtLnNjYWxlWSA9ICgoTWF0aC5zcXJ0KGEyMiAqIGEyMiArIGEyMyAqIGEyMykgKiBybmQgKyAwLjUpIHwgMCkgLyBybmQ7XG5cdFx0XHRcdFx0XHR0bS5zY2FsZVogPSAoKE1hdGguc3FydChhMzIgKiBhMzIgKyBhMzMgKiBhMzMpICogcm5kICsgMC41KSB8IDApIC8gcm5kO1xuXHRcdFx0XHRcdFx0dG0uc2tld1ggPSAwO1xuXHRcdFx0XHRcdFx0dG0ucGVyc3BlY3RpdmUgPSBhNDMgPyAxIC8gKChhNDMgPCAwKSA/IC1hNDMgOiBhNDMpIDogMDtcblx0XHRcdFx0XHRcdHRtLnggPSBhMTQ7XG5cdFx0XHRcdFx0XHR0bS55ID0gYTI0O1xuXHRcdFx0XHRcdFx0dG0ueiA9IGEzNDtcblx0XHRcdFx0XHRcdGlmICh0bS5zdmcpIHtcblx0XHRcdFx0XHRcdFx0dG0ueCAtPSB0bS54T3JpZ2luIC0gKHRtLnhPcmlnaW4gKiBhMTEgLSB0bS55T3JpZ2luICogYTEyKTtcblx0XHRcdFx0XHRcdFx0dG0ueSAtPSB0bS55T3JpZ2luIC0gKHRtLnlPcmlnaW4gKiBhMjEgLSB0bS54T3JpZ2luICogYTIyKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoKCFfc3VwcG9ydHMzRCB8fCBwYXJzZSB8fCAhbS5sZW5ndGggfHwgdG0ueCAhPT0gbVs0XSB8fCB0bS55ICE9PSBtWzVdIHx8ICghdG0ucm90YXRpb25YICYmICF0bS5yb3RhdGlvblkpKSAmJiAhKHRtLnggIT09IHVuZGVmaW5lZCAmJiBfZ2V0U3R5bGUodCwgXCJkaXNwbGF5XCIsIGNzKSA9PT0gXCJub25lXCIpKSB7IC8vc29tZXRpbWVzIGEgNi1lbGVtZW50IG1hdHJpeCBpcyByZXR1cm5lZCBldmVuIHdoZW4gd2UgcGVyZm9ybWVkIDNEIHRyYW5zZm9ybXMsIGxpa2UgaWYgcm90YXRpb25YIGFuZCByb3RhdGlvblkgYXJlIDE4MC4gSW4gY2FzZXMgbGlrZSB0aGlzLCB3ZSBzdGlsbCBuZWVkIHRvIGhvbm9yIHRoZSAzRCB0cmFuc2Zvcm1zLiBJZiB3ZSBqdXN0IHJlbHkgb24gdGhlIDJEIGluZm8sIGl0IGNvdWxkIGFmZmVjdCBob3cgdGhlIGRhdGEgaXMgaW50ZXJwcmV0ZWQsIGxpa2Ugc2NhbGVZIG1pZ2h0IGdldCBzZXQgdG8gLTEgb3Igcm90YXRpb24gY291bGQgZ2V0IG9mZnNldCBieSAxODAgZGVncmVlcy4gRm9yIGV4YW1wbGUsIGRvIGEgVHdlZW5MaXRlLnRvKGVsZW1lbnQsIDEsIHtjc3M6e3JvdGF0aW9uWDoxODAsIHJvdGF0aW9uWToxODB9fSkgYW5kIHRoZW4gbGF0ZXIsIFR3ZWVuTGl0ZS50byhlbGVtZW50LCAxLCB7Y3NzOntyb3RhdGlvblg6MH19KSBhbmQgd2l0aG91dCB0aGlzIGNvbmRpdGlvbmFsIGxvZ2ljIGluIHBsYWNlLCBpdCdkIGp1bXAgdG8gYSBzdGF0ZSBvZiBiZWluZyB1bnJvdGF0ZWQgd2hlbiB0aGUgMm5kIHR3ZWVuIHN0YXJ0cy4gVGhlbiBhZ2Fpbiwgd2UgbmVlZCB0byBob25vciB0aGUgZmFjdCB0aGF0IHRoZSB1c2VyIENPVUxEIGFsdGVyIHRoZSB0cmFuc2Zvcm1zIG91dHNpZGUgb2YgQ1NTUGx1Z2luLCBsaWtlIGJ5IG1hbnVhbGx5IGFwcGx5aW5nIG5ldyBjc3MsIHNvIHdlIHRyeSB0byBzZW5zZSB0aGF0IGJ5IGxvb2tpbmcgYXQgeCBhbmQgeSBiZWNhdXNlIGlmIHRob3NlIGNoYW5nZWQsIHdlIGtub3cgdGhlIGNoYW5nZXMgd2VyZSBtYWRlIG91dHNpZGUgQ1NTUGx1Z2luIGFuZCB3ZSBmb3JjZSBhIHJlaW50ZXJwcmV0YXRpb24gb2YgdGhlIG1hdHJpeCB2YWx1ZXMuIEFsc28sIGluIFdlYmtpdCBicm93c2VycywgaWYgdGhlIGVsZW1lbnQncyBcImRpc3BsYXlcIiBpcyBcIm5vbmVcIiwgaXRzIGNhbGN1bGF0ZWQgc3R5bGUgdmFsdWUgd2lsbCBhbHdheXMgcmV0dXJuIGVtcHR5LCBzbyBpZiB3ZSd2ZSBhbHJlYWR5IHJlY29yZGVkIHRoZSB2YWx1ZXMgaW4gdGhlIF9nc1RyYW5zZm9ybSBvYmplY3QsIHdlJ2xsIGp1c3QgcmVseSBvbiB0aG9zZS5cblx0XHRcdFx0XHRcdHZhciBrID0gKG0ubGVuZ3RoID49IDYpLFxuXHRcdFx0XHRcdFx0XHRhID0gayA/IG1bMF0gOiAxLFxuXHRcdFx0XHRcdFx0XHRiID0gbVsxXSB8fCAwLFxuXHRcdFx0XHRcdFx0XHRjID0gbVsyXSB8fCAwLFxuXHRcdFx0XHRcdFx0XHRkID0gayA/IG1bM10gOiAxO1xuXHRcdFx0XHRcdFx0dG0ueCA9IG1bNF0gfHwgMDtcblx0XHRcdFx0XHRcdHRtLnkgPSBtWzVdIHx8IDA7XG5cdFx0XHRcdFx0XHRzY2FsZVggPSBNYXRoLnNxcnQoYSAqIGEgKyBiICogYik7XG5cdFx0XHRcdFx0XHRzY2FsZVkgPSBNYXRoLnNxcnQoZCAqIGQgKyBjICogYyk7XG5cdFx0XHRcdFx0XHRyb3RhdGlvbiA9IChhIHx8IGIpID8gTWF0aC5hdGFuMihiLCBhKSAqIF9SQUQyREVHIDogdG0ucm90YXRpb24gfHwgMDsgLy9ub3RlOiBpZiBzY2FsZVggaXMgMCwgd2UgY2Fubm90IGFjY3VyYXRlbHkgbWVhc3VyZSByb3RhdGlvbi4gU2FtZSBmb3Igc2tld1ggd2l0aCBhIHNjYWxlWSBvZiAwLiBUaGVyZWZvcmUsIHdlIGRlZmF1bHQgdG8gdGhlIHByZXZpb3VzbHkgcmVjb3JkZWQgdmFsdWUgKG9yIHplcm8gaWYgdGhhdCBkb2Vzbid0IGV4aXN0KS5cblx0XHRcdFx0XHRcdHNrZXdYID0gKGMgfHwgZCkgPyBNYXRoLmF0YW4yKGMsIGQpICogX1JBRDJERUcgKyByb3RhdGlvbiA6IHRtLnNrZXdYIHx8IDA7XG5cdFx0XHRcdFx0XHRpZiAoTWF0aC5hYnMoc2tld1gpID4gOTAgJiYgTWF0aC5hYnMoc2tld1gpIDwgMjcwKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChpbnZYKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2NhbGVYICo9IC0xO1xuXHRcdFx0XHRcdFx0XHRcdHNrZXdYICs9IChyb3RhdGlvbiA8PSAwKSA/IDE4MCA6IC0xODA7XG5cdFx0XHRcdFx0XHRcdFx0cm90YXRpb24gKz0gKHJvdGF0aW9uIDw9IDApID8gMTgwIDogLTE4MDtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRzY2FsZVkgKj0gLTE7XG5cdFx0XHRcdFx0XHRcdFx0c2tld1ggKz0gKHNrZXdYIDw9IDApID8gMTgwIDogLTE4MDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dG0uc2NhbGVYID0gc2NhbGVYO1xuXHRcdFx0XHRcdFx0dG0uc2NhbGVZID0gc2NhbGVZO1xuXHRcdFx0XHRcdFx0dG0ucm90YXRpb24gPSByb3RhdGlvbjtcblx0XHRcdFx0XHRcdHRtLnNrZXdYID0gc2tld1g7XG5cdFx0XHRcdFx0XHRpZiAoX3N1cHBvcnRzM0QpIHtcblx0XHRcdFx0XHRcdFx0dG0ucm90YXRpb25YID0gdG0ucm90YXRpb25ZID0gdG0ueiA9IDA7XG5cdFx0XHRcdFx0XHRcdHRtLnBlcnNwZWN0aXZlID0gZGVmYXVsdFRyYW5zZm9ybVBlcnNwZWN0aXZlO1xuXHRcdFx0XHRcdFx0XHR0bS5zY2FsZVogPSAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKHRtLnN2Zykge1xuXHRcdFx0XHRcdFx0XHR0bS54IC09IHRtLnhPcmlnaW4gLSAodG0ueE9yaWdpbiAqIGEgKyB0bS55T3JpZ2luICogYyk7XG5cdFx0XHRcdFx0XHRcdHRtLnkgLT0gdG0ueU9yaWdpbiAtICh0bS54T3JpZ2luICogYiArIHRtLnlPcmlnaW4gKiBkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dG0uek9yaWdpbiA9IHpPcmlnaW47XG5cdFx0XHRcdFx0Ly9zb21lIGJyb3dzZXJzIGhhdmUgYSBoYXJkIHRpbWUgd2l0aCB2ZXJ5IHNtYWxsIHZhbHVlcyBsaWtlIDIuNDQ5MjkzNTk4Mjk0NzA2NGUtMTYgKG5vdGljZSB0aGUgXCJlLVwiIHRvd2FyZHMgdGhlIGVuZCkgYW5kIHdvdWxkIHJlbmRlciB0aGUgb2JqZWN0IHNsaWdodGx5IG9mZi4gU28gd2Ugcm91bmQgdG8gMCBpbiB0aGVzZSBjYXNlcy4gVGhlIGNvbmRpdGlvbmFsIGxvZ2ljIGhlcmUgaXMgZmFzdGVyIHRoYW4gY2FsbGluZyBNYXRoLmFicygpLiBBbHNvLCBicm93c2VycyB0ZW5kIHRvIHJlbmRlciBhIFNMSUdIVExZIHJvdGF0ZWQgb2JqZWN0IGluIGEgZnV6enkgd2F5LCBzbyB3ZSBuZWVkIHRvIHNuYXAgdG8gZXhhY3RseSAwIHdoZW4gYXBwcm9wcmlhdGUuXG5cdFx0XHRcdFx0Zm9yIChpIGluIHRtKSB7XG5cdFx0XHRcdFx0XHRpZiAodG1baV0gPCBtaW4pIGlmICh0bVtpXSA+IC1taW4pIHtcblx0XHRcdFx0XHRcdFx0dG1baV0gPSAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvL0RFQlVHOiBfbG9nKFwicGFyc2VkIHJvdGF0aW9uIG9mIFwiICsgdC5nZXRBdHRyaWJ1dGUoXCJpZFwiKStcIjogXCIrKHRtLnJvdGF0aW9uWCkrXCIsIFwiKyh0bS5yb3RhdGlvblkpK1wiLCBcIisodG0ucm90YXRpb24pK1wiLCBzY2FsZTogXCIrdG0uc2NhbGVYK1wiLCBcIit0bS5zY2FsZVkrXCIsIFwiK3RtLnNjYWxlWitcIiwgcG9zaXRpb246IFwiK3RtLngrXCIsIFwiK3RtLnkrXCIsIFwiK3RtLnorXCIsIHBlcnNwZWN0aXZlOiBcIit0bS5wZXJzcGVjdGl2ZSsgXCIsIG9yaWdpbjogXCIrIHRtLnhPcmlnaW4rIFwiLFwiKyB0bS55T3JpZ2luKTtcblx0XHRcdFx0aWYgKHJlYykge1xuXHRcdFx0XHRcdHQuX2dzVHJhbnNmb3JtID0gdG07IC8vcmVjb3JkIHRvIHRoZSBvYmplY3QncyBfZ3NUcmFuc2Zvcm0gd2hpY2ggd2UgdXNlIHNvIHRoYXQgdHdlZW5zIGNhbiBjb250cm9sIGluZGl2aWR1YWwgcHJvcGVydGllcyBpbmRlcGVuZGVudGx5ICh3ZSBuZWVkIGFsbCB0aGUgcHJvcGVydGllcyB0byBhY2N1cmF0ZWx5IHJlY29tcG9zZSB0aGUgbWF0cml4IGluIHRoZSBzZXRSYXRpbygpIG1ldGhvZClcblx0XHRcdFx0XHRpZiAodG0uc3ZnKSB7IC8vaWYgd2UncmUgc3VwcG9zZWQgdG8gYXBwbHkgdHJhbnNmb3JtcyB0byB0aGUgU1ZHIGVsZW1lbnQncyBcInRyYW5zZm9ybVwiIGF0dHJpYnV0ZSwgbWFrZSBzdXJlIHRoZXJlIGFyZW4ndCBhbnkgQ1NTIHRyYW5zZm9ybXMgYXBwbGllZCBvciB0aGV5J2xsIG92ZXJyaWRlIHRoZSBhdHRyaWJ1dGUgb25lcy4gQWxzbyBjbGVhciB0aGUgdHJhbnNmb3JtIGF0dHJpYnV0ZSBpZiB3ZSdyZSB1c2luZyBDU1MsIGp1c3QgdG8gYmUgY2xlYW4uXG5cdFx0XHRcdFx0XHRpZiAoX3VzZVNWR1RyYW5zZm9ybUF0dHIgJiYgdC5zdHlsZVtfdHJhbnNmb3JtUHJvcF0pIHtcblx0XHRcdFx0XHRcdFx0VHdlZW5MaXRlLmRlbGF5ZWRDYWxsKDAuMDAxLCBmdW5jdGlvbigpeyAvL2lmIHdlIGFwcGx5IHRoaXMgcmlnaHQgYXdheSAoYmVmb3JlIGFueXRoaW5nIGhhcyByZW5kZXJlZCksIHdlIHJpc2sgdGhlcmUgYmVpbmcgbm8gdHJhbnNmb3JtcyBmb3IgYSBicmllZiBtb21lbnQgYW5kIGl0IGFsc28gaW50ZXJmZXJlcyB3aXRoIGFkanVzdGluZyB0aGUgdHJhbnNmb3JtT3JpZ2luIGluIGEgdHdlZW4gd2l0aCBpbW1lZGlhdGVSZW5kZXI6dHJ1ZSAoaXQnZCB0cnkgcmVhZGluZyB0aGUgbWF0cml4IGFuZCBpdCB3b3VsZG4ndCBoYXZlIHRoZSBhcHByb3ByaWF0ZSBkYXRhIGluIHBsYWNlIGJlY2F1c2Ugd2UganVzdCByZW1vdmVkIGl0KS5cblx0XHRcdFx0XHRcdFx0XHRfcmVtb3ZlUHJvcCh0LnN0eWxlLCBfdHJhbnNmb3JtUHJvcCk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICghX3VzZVNWR1RyYW5zZm9ybUF0dHIgJiYgdC5nZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIikpIHtcblx0XHRcdFx0XHRcdFx0VHdlZW5MaXRlLmRlbGF5ZWRDYWxsKDAuMDAxLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcdHQucmVtb3ZlQXR0cmlidXRlKFwidHJhbnNmb3JtXCIpO1xuXHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRtO1xuXHRcdFx0fSxcblxuXHRcdFx0Ly9mb3Igc2V0dGluZyAyRCB0cmFuc2Zvcm1zIGluIElFNiwgSUU3LCBhbmQgSUU4IChtdXN0IHVzZSBhIFwiZmlsdGVyXCIgdG8gZW11bGF0ZSB0aGUgYmVoYXZpb3Igb2YgbW9kZXJuIGRheSBicm93c2VyIHRyYW5zZm9ybXMpXG5cdFx0XHRfc2V0SUVUcmFuc2Zvcm1SYXRpbyA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0dmFyIHQgPSB0aGlzLmRhdGEsIC8vcmVmZXJzIHRvIHRoZSBlbGVtZW50J3MgX2dzVHJhbnNmb3JtIG9iamVjdFxuXHRcdFx0XHRcdGFuZyA9IC10LnJvdGF0aW9uICogX0RFRzJSQUQsXG5cdFx0XHRcdFx0c2tldyA9IGFuZyArIHQuc2tld1ggKiBfREVHMlJBRCxcblx0XHRcdFx0XHRybmQgPSAxMDAwMDAsXG5cdFx0XHRcdFx0YSA9ICgoTWF0aC5jb3MoYW5nKSAqIHQuc2NhbGVYICogcm5kKSB8IDApIC8gcm5kLFxuXHRcdFx0XHRcdGIgPSAoKE1hdGguc2luKGFuZykgKiB0LnNjYWxlWCAqIHJuZCkgfCAwKSAvIHJuZCxcblx0XHRcdFx0XHRjID0gKChNYXRoLnNpbihza2V3KSAqIC10LnNjYWxlWSAqIHJuZCkgfCAwKSAvIHJuZCxcblx0XHRcdFx0XHRkID0gKChNYXRoLmNvcyhza2V3KSAqIHQuc2NhbGVZICogcm5kKSB8IDApIC8gcm5kLFxuXHRcdFx0XHRcdHN0eWxlID0gdGhpcy50LnN0eWxlLFxuXHRcdFx0XHRcdGNzID0gdGhpcy50LmN1cnJlbnRTdHlsZSxcblx0XHRcdFx0XHRmaWx0ZXJzLCB2YWw7XG5cdFx0XHRcdGlmICghY3MpIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFsID0gYjsgLy9qdXN0IGZvciBzd2FwcGluZyB0aGUgdmFyaWFibGVzIGFuIGludmVydGluZyB0aGVtIChyZXVzZWQgXCJ2YWxcIiB0byBhdm9pZCBjcmVhdGluZyBhbm90aGVyIHZhcmlhYmxlIGluIG1lbW9yeSkuIElFJ3MgZmlsdGVyIG1hdHJpeCB1c2VzIGEgbm9uLXN0YW5kYXJkIG1hdHJpeCBjb25maWd1cmF0aW9uIChhbmdsZSBnb2VzIHRoZSBvcHBvc2l0ZSB3YXksIGFuZCBiIGFuZCBjIGFyZSByZXZlcnNlZCBhbmQgaW52ZXJ0ZWQpXG5cdFx0XHRcdGIgPSAtYztcblx0XHRcdFx0YyA9IC12YWw7XG5cdFx0XHRcdGZpbHRlcnMgPSBjcy5maWx0ZXI7XG5cdFx0XHRcdHN0eWxlLmZpbHRlciA9IFwiXCI7IC8vcmVtb3ZlIGZpbHRlcnMgc28gdGhhdCB3ZSBjYW4gYWNjdXJhdGVseSBtZWFzdXJlIG9mZnNldFdpZHRoL29mZnNldEhlaWdodFxuXHRcdFx0XHR2YXIgdyA9IHRoaXMudC5vZmZzZXRXaWR0aCxcblx0XHRcdFx0XHRoID0gdGhpcy50Lm9mZnNldEhlaWdodCxcblx0XHRcdFx0XHRjbGlwID0gKGNzLnBvc2l0aW9uICE9PSBcImFic29sdXRlXCIpLFxuXHRcdFx0XHRcdG0gPSBcInByb2dpZDpEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5NYXRyaXgoTTExPVwiICsgYSArIFwiLCBNMTI9XCIgKyBiICsgXCIsIE0yMT1cIiArIGMgKyBcIiwgTTIyPVwiICsgZCxcblx0XHRcdFx0XHRveCA9IHQueCArICh3ICogdC54UGVyY2VudCAvIDEwMCksXG5cdFx0XHRcdFx0b3kgPSB0LnkgKyAoaCAqIHQueVBlcmNlbnQgLyAxMDApLFxuXHRcdFx0XHRcdGR4LCBkeTtcblxuXHRcdFx0XHQvL2lmIHRyYW5zZm9ybU9yaWdpbiBpcyBiZWluZyB1c2VkLCBhZGp1c3QgdGhlIG9mZnNldCB4IGFuZCB5XG5cdFx0XHRcdGlmICh0Lm94ICE9IG51bGwpIHtcblx0XHRcdFx0XHRkeCA9ICgodC5veHApID8gdyAqIHQub3ggKiAwLjAxIDogdC5veCkgLSB3IC8gMjtcblx0XHRcdFx0XHRkeSA9ICgodC5veXApID8gaCAqIHQub3kgKiAwLjAxIDogdC5veSkgLSBoIC8gMjtcblx0XHRcdFx0XHRveCArPSBkeCAtIChkeCAqIGEgKyBkeSAqIGIpO1xuXHRcdFx0XHRcdG95ICs9IGR5IC0gKGR4ICogYyArIGR5ICogZCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIWNsaXApIHtcblx0XHRcdFx0XHRtICs9IFwiLCBzaXppbmdNZXRob2Q9J2F1dG8gZXhwYW5kJylcIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRkeCA9ICh3IC8gMik7XG5cdFx0XHRcdFx0ZHkgPSAoaCAvIDIpO1xuXHRcdFx0XHRcdC8vdHJhbnNsYXRlIHRvIGVuc3VyZSB0aGF0IHRyYW5zZm9ybWF0aW9ucyBvY2N1ciBhcm91bmQgdGhlIGNvcnJlY3Qgb3JpZ2luIChkZWZhdWx0IGlzIGNlbnRlcikuXG5cdFx0XHRcdFx0bSArPSBcIiwgRHg9XCIgKyAoZHggLSAoZHggKiBhICsgZHkgKiBiKSArIG94KSArIFwiLCBEeT1cIiArIChkeSAtIChkeCAqIGMgKyBkeSAqIGQpICsgb3kpICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGZpbHRlcnMuaW5kZXhPZihcIkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0Lk1hdHJpeChcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0c3R5bGUuZmlsdGVyID0gZmlsdGVycy5yZXBsYWNlKF9pZVNldE1hdHJpeEV4cCwgbSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c3R5bGUuZmlsdGVyID0gbSArIFwiIFwiICsgZmlsdGVyczsgLy93ZSBtdXN0IGFsd2F5cyBwdXQgdGhlIHRyYW5zZm9ybS9tYXRyaXggRklSU1QgKGJlZm9yZSBhbHBoYShvcGFjaXR5PXh4KSkgdG8gYXZvaWQgYW4gSUUgYnVnIHRoYXQgc2xpY2VzIHBhcnQgb2YgdGhlIG9iamVjdCB3aGVuIHJvdGF0aW9uIGlzIGFwcGxpZWQgd2l0aCBhbHBoYS5cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vYXQgdGhlIGVuZCBvciBiZWdpbm5pbmcgb2YgdGhlIHR3ZWVuLCBpZiB0aGUgbWF0cml4IGlzIG5vcm1hbCAoMSwgMCwgMCwgMSkgYW5kIG9wYWNpdHkgaXMgMTAwIChvciBkb2Vzbid0IGV4aXN0KSwgcmVtb3ZlIHRoZSBmaWx0ZXIgdG8gaW1wcm92ZSBicm93c2VyIHBlcmZvcm1hbmNlLlxuXHRcdFx0XHRpZiAodiA9PT0gMCB8fCB2ID09PSAxKSBpZiAoYSA9PT0gMSkgaWYgKGIgPT09IDApIGlmIChjID09PSAwKSBpZiAoZCA9PT0gMSkgaWYgKCFjbGlwIHx8IG0uaW5kZXhPZihcIkR4PTAsIER5PTBcIikgIT09IC0xKSBpZiAoIV9vcGFjaXR5RXhwLnRlc3QoZmlsdGVycykgfHwgcGFyc2VGbG9hdChSZWdFeHAuJDEpID09PSAxMDApIGlmIChmaWx0ZXJzLmluZGV4T2YoXCJncmFkaWVudChcIiAmJiBmaWx0ZXJzLmluZGV4T2YoXCJBbHBoYVwiKSkgPT09IC0xKSB7XG5cdFx0XHRcdFx0c3R5bGUucmVtb3ZlQXR0cmlidXRlKFwiZmlsdGVyXCIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly93ZSBtdXN0IHNldCB0aGUgbWFyZ2lucyBBRlRFUiBhcHBseWluZyB0aGUgZmlsdGVyIGluIG9yZGVyIHRvIGF2b2lkIHNvbWUgYnVncyBpbiBJRTggdGhhdCBjb3VsZCAoaW4gcmFyZSBzY2VuYXJpb3MpIGNhdXNlIHRoZW0gdG8gYmUgaWdub3JlZCBpbnRlcm1pdHRlbnRseSAodmlicmF0aW9uKS5cblx0XHRcdFx0aWYgKCFjbGlwKSB7XG5cdFx0XHRcdFx0dmFyIG11bHQgPSAoX2llVmVycyA8IDgpID8gMSA6IC0xLCAvL2luIEludGVybmV0IEV4cGxvcmVyIDcgYW5kIGJlZm9yZSwgdGhlIGJveCBtb2RlbCBpcyBicm9rZW4sIGNhdXNpbmcgdGhlIGJyb3dzZXIgdG8gdHJlYXQgdGhlIHdpZHRoL2hlaWdodCBvZiB0aGUgYWN0dWFsIHJvdGF0ZWQgZmlsdGVyZWQgaW1hZ2UgYXMgdGhlIHdpZHRoL2hlaWdodCBvZiB0aGUgYm94IGl0c2VsZiwgYnV0IE1pY3Jvc29mdCBjb3JyZWN0ZWQgdGhhdCBpbiBJRTguIFdlIG11c3QgdXNlIGEgbmVnYXRpdmUgb2Zmc2V0IGluIElFOCBvbiB0aGUgcmlnaHQvYm90dG9tXG5cdFx0XHRcdFx0XHRtYXJnLCBwcm9wLCBkaWY7XG5cdFx0XHRcdFx0ZHggPSB0LmllT2Zmc2V0WCB8fCAwO1xuXHRcdFx0XHRcdGR5ID0gdC5pZU9mZnNldFkgfHwgMDtcblx0XHRcdFx0XHR0LmllT2Zmc2V0WCA9IE1hdGgucm91bmQoKHcgLSAoKGEgPCAwID8gLWEgOiBhKSAqIHcgKyAoYiA8IDAgPyAtYiA6IGIpICogaCkpIC8gMiArIG94KTtcblx0XHRcdFx0XHR0LmllT2Zmc2V0WSA9IE1hdGgucm91bmQoKGggLSAoKGQgPCAwID8gLWQgOiBkKSAqIGggKyAoYyA8IDAgPyAtYyA6IGMpICogdykpIC8gMiArIG95KTtcblx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgNDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRwcm9wID0gX21hcmdpbnNbaV07XG5cdFx0XHRcdFx0XHRtYXJnID0gY3NbcHJvcF07XG5cdFx0XHRcdFx0XHQvL3dlIG5lZWQgdG8gZ2V0IHRoZSBjdXJyZW50IG1hcmdpbiBpbiBjYXNlIGl0IGlzIGJlaW5nIHR3ZWVuZWQgc2VwYXJhdGVseSAod2Ugd2FudCB0byByZXNwZWN0IHRoYXQgdHdlZW4ncyBjaGFuZ2VzKVxuXHRcdFx0XHRcdFx0dmFsID0gKG1hcmcuaW5kZXhPZihcInB4XCIpICE9PSAtMSkgPyBwYXJzZUZsb2F0KG1hcmcpIDogX2NvbnZlcnRUb1BpeGVscyh0aGlzLnQsIHByb3AsIHBhcnNlRmxvYXQobWFyZyksIG1hcmcucmVwbGFjZShfc3VmZml4RXhwLCBcIlwiKSkgfHwgMDtcblx0XHRcdFx0XHRcdGlmICh2YWwgIT09IHRbcHJvcF0pIHtcblx0XHRcdFx0XHRcdFx0ZGlmID0gKGkgPCAyKSA/IC10LmllT2Zmc2V0WCA6IC10LmllT2Zmc2V0WTsgLy9pZiBhbm90aGVyIHR3ZWVuIGlzIGNvbnRyb2xsaW5nIGEgbWFyZ2luLCB3ZSBjYW5ub3Qgb25seSBhcHBseSB0aGUgZGlmZmVyZW5jZSBpbiB0aGUgaWVPZmZzZXRzLCBzbyB3ZSBlc3NlbnRpYWxseSB6ZXJvLW91dCB0aGUgZHggYW5kIGR5IGhlcmUgaW4gdGhhdCBjYXNlLiBXZSByZWNvcmQgdGhlIG1hcmdpbihzKSBsYXRlciBzbyB0aGF0IHdlIGNhbiBrZWVwIGNvbXBhcmluZyB0aGVtLCBtYWtpbmcgdGhpcyBjb2RlIHZlcnkgZmxleGlibGUuXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRkaWYgPSAoaSA8IDIpID8gZHggLSB0LmllT2Zmc2V0WCA6IGR5IC0gdC5pZU9mZnNldFk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzdHlsZVtwcm9wXSA9ICh0W3Byb3BdID0gTWF0aC5yb3VuZCggdmFsIC0gZGlmICogKChpID09PSAwIHx8IGkgPT09IDIpID8gMSA6IG11bHQpICkpICsgXCJweFwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0LyogdHJhbnNsYXRlcyBhIHN1cGVyIHNtYWxsIGRlY2ltYWwgdG8gYSBzdHJpbmcgV0lUSE9VVCBzY2llbnRpZmljIG5vdGF0aW9uXG5cdFx0XHRfc2FmZURlY2ltYWwgPSBmdW5jdGlvbihuKSB7XG5cdFx0XHRcdHZhciBzID0gKG4gPCAwID8gLW4gOiBuKSArIFwiXCIsXG5cdFx0XHRcdFx0YSA9IHMuc3BsaXQoXCJlLVwiKTtcblx0XHRcdFx0cmV0dXJuIChuIDwgMCA/IFwiLTAuXCIgOiBcIjAuXCIpICsgbmV3IEFycmF5KHBhcnNlSW50KGFbMV0sIDEwKSB8fCAwKS5qb2luKFwiMFwiKSArIGFbMF0uc3BsaXQoXCIuXCIpLmpvaW4oXCJcIik7XG5cdFx0XHR9LFxuXHRcdFx0Ki9cblxuXHRcdFx0X3NldFRyYW5zZm9ybVJhdGlvID0gX2ludGVybmFscy5zZXQzRFRyYW5zZm9ybVJhdGlvID0gX2ludGVybmFscy5zZXRUcmFuc2Zvcm1SYXRpbyA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0dmFyIHQgPSB0aGlzLmRhdGEsIC8vcmVmZXJzIHRvIHRoZSBlbGVtZW50J3MgX2dzVHJhbnNmb3JtIG9iamVjdFxuXHRcdFx0XHRcdHN0eWxlID0gdGhpcy50LnN0eWxlLFxuXHRcdFx0XHRcdGFuZ2xlID0gdC5yb3RhdGlvbixcblx0XHRcdFx0XHRyb3RhdGlvblggPSB0LnJvdGF0aW9uWCxcblx0XHRcdFx0XHRyb3RhdGlvblkgPSB0LnJvdGF0aW9uWSxcblx0XHRcdFx0XHRzeCA9IHQuc2NhbGVYLFxuXHRcdFx0XHRcdHN5ID0gdC5zY2FsZVksXG5cdFx0XHRcdFx0c3ogPSB0LnNjYWxlWixcblx0XHRcdFx0XHR4ID0gdC54LFxuXHRcdFx0XHRcdHkgPSB0LnksXG5cdFx0XHRcdFx0eiA9IHQueixcblx0XHRcdFx0XHRpc1NWRyA9IHQuc3ZnLFxuXHRcdFx0XHRcdHBlcnNwZWN0aXZlID0gdC5wZXJzcGVjdGl2ZSxcblx0XHRcdFx0XHRmb3JjZTNEID0gdC5mb3JjZTNELFxuXHRcdFx0XHRcdGExMSwgYTEyLCBhMTMsIGEyMSwgYTIyLCBhMjMsIGEzMSwgYTMyLCBhMzMsIGE0MSwgYTQyLCBhNDMsXG5cdFx0XHRcdFx0ek9yaWdpbiwgbWluLCBjb3MsIHNpbiwgdDEsIHQyLCB0cmFuc2Zvcm0sIGNvbW1hLCB6ZXJvLCBza2V3LCBybmQ7XG5cdFx0XHRcdC8vY2hlY2sgdG8gc2VlIGlmIHdlIHNob3VsZCByZW5kZXIgYXMgMkQgKGFuZCBTVkdzIG11c3QgdXNlIDJEIHdoZW4gX3VzZVNWR1RyYW5zZm9ybUF0dHIgaXMgdHJ1ZSlcblx0XHRcdFx0aWYgKCgoKCh2ID09PSAxIHx8IHYgPT09IDApICYmIGZvcmNlM0QgPT09IFwiYXV0b1wiICYmICh0aGlzLnR3ZWVuLl90b3RhbFRpbWUgPT09IHRoaXMudHdlZW4uX3RvdGFsRHVyYXRpb24gfHwgIXRoaXMudHdlZW4uX3RvdGFsVGltZSkpIHx8ICFmb3JjZTNEKSAmJiAheiAmJiAhcGVyc3BlY3RpdmUgJiYgIXJvdGF0aW9uWSAmJiAhcm90YXRpb25YKSB8fCAoX3VzZVNWR1RyYW5zZm9ybUF0dHIgJiYgaXNTVkcpIHx8ICFfc3VwcG9ydHMzRCkgeyAvL29uIHRoZSBmaW5hbCByZW5kZXIgKHdoaWNoIGNvdWxkIGJlIDAgZm9yIGEgZnJvbSB0d2VlbiksIGlmIHRoZXJlIGFyZSBubyAzRCBhc3BlY3RzLCByZW5kZXIgaW4gMkQgdG8gZnJlZSB1cCBtZW1vcnkgYW5kIGltcHJvdmUgcGVyZm9ybWFuY2UgZXNwZWNpYWxseSBvbiBtb2JpbGUgZGV2aWNlcy4gQ2hlY2sgdGhlIHR3ZWVuJ3MgdG90YWxUaW1lL3RvdGFsRHVyYXRpb24gdG9vIGluIG9yZGVyIHRvIG1ha2Ugc3VyZSBpdCBkb2Vzbid0IGhhcHBlbiBiZXR3ZWVuIHJlcGVhdHMgaWYgaXQncyBhIHJlcGVhdGluZyB0d2Vlbi5cblxuXHRcdFx0XHRcdC8vMkRcblx0XHRcdFx0XHRpZiAoYW5nbGUgfHwgdC5za2V3WCB8fCBpc1NWRykge1xuXHRcdFx0XHRcdFx0YW5nbGUgKj0gX0RFRzJSQUQ7XG5cdFx0XHRcdFx0XHRza2V3ID0gdC5za2V3WCAqIF9ERUcyUkFEO1xuXHRcdFx0XHRcdFx0cm5kID0gMTAwMDAwO1xuXHRcdFx0XHRcdFx0YTExID0gTWF0aC5jb3MoYW5nbGUpICogc3g7XG5cdFx0XHRcdFx0XHRhMjEgPSBNYXRoLnNpbihhbmdsZSkgKiBzeDtcblx0XHRcdFx0XHRcdGExMiA9IE1hdGguc2luKGFuZ2xlIC0gc2tldykgKiAtc3k7XG5cdFx0XHRcdFx0XHRhMjIgPSBNYXRoLmNvcyhhbmdsZSAtIHNrZXcpICogc3k7XG5cdFx0XHRcdFx0XHRpZiAoc2tldyAmJiB0LnNrZXdUeXBlID09PSBcInNpbXBsZVwiKSB7IC8vYnkgZGVmYXVsdCwgd2UgY29tcGVuc2F0ZSBza2V3aW5nIG9uIHRoZSBvdGhlciBheGlzIHRvIG1ha2UgaXQgbG9vayBtb3JlIG5hdHVyYWwsIGJ1dCB5b3UgY2FuIHNldCB0aGUgc2tld1R5cGUgdG8gXCJzaW1wbGVcIiB0byB1c2UgdGhlIHVuY29tcGVuc2F0ZWQgc2tld2luZyB0aGF0IENTUyBkb2VzXG5cdFx0XHRcdFx0XHRcdHQxID0gTWF0aC50YW4oc2tldyk7XG5cdFx0XHRcdFx0XHRcdHQxID0gTWF0aC5zcXJ0KDEgKyB0MSAqIHQxKTtcblx0XHRcdFx0XHRcdFx0YTEyICo9IHQxO1xuXHRcdFx0XHRcdFx0XHRhMjIgKj0gdDE7XG5cdFx0XHRcdFx0XHRcdGlmICh0LnNrZXdZKSB7XG5cdFx0XHRcdFx0XHRcdFx0YTExICo9IHQxO1xuXHRcdFx0XHRcdFx0XHRcdGEyMSAqPSB0MTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKGlzU1ZHKSB7XG5cdFx0XHRcdFx0XHRcdHggKz0gdC54T3JpZ2luIC0gKHQueE9yaWdpbiAqIGExMSArIHQueU9yaWdpbiAqIGExMikgKyB0LnhPZmZzZXQ7XG5cdFx0XHRcdFx0XHRcdHkgKz0gdC55T3JpZ2luIC0gKHQueE9yaWdpbiAqIGEyMSArIHQueU9yaWdpbiAqIGEyMikgKyB0LnlPZmZzZXQ7XG5cdFx0XHRcdFx0XHRcdGlmIChfdXNlU1ZHVHJhbnNmb3JtQXR0ciAmJiAodC54UGVyY2VudCB8fCB0LnlQZXJjZW50KSkgeyAvL1RoZSBTVkcgc3BlYyBkb2Vzbid0IHN1cHBvcnQgcGVyY2VudGFnZS1iYXNlZCB0cmFuc2xhdGlvbiBpbiB0aGUgXCJ0cmFuc2Zvcm1cIiBhdHRyaWJ1dGUsIHNvIHdlIG1lcmdlIGl0IGludG8gdGhlIG1hdHJpeCB0byBzaW11bGF0ZSBpdC5cblx0XHRcdFx0XHRcdFx0XHRtaW4gPSB0aGlzLnQuZ2V0QkJveCgpO1xuXHRcdFx0XHRcdFx0XHRcdHggKz0gdC54UGVyY2VudCAqIDAuMDEgKiBtaW4ud2lkdGg7XG5cdFx0XHRcdFx0XHRcdFx0eSArPSB0LnlQZXJjZW50ICogMC4wMSAqIG1pbi5oZWlnaHQ7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0bWluID0gMC4wMDAwMDE7XG5cdFx0XHRcdFx0XHRcdGlmICh4IDwgbWluKSBpZiAoeCA+IC1taW4pIHtcblx0XHRcdFx0XHRcdFx0XHR4ID0gMDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoeSA8IG1pbikgaWYgKHkgPiAtbWluKSB7XG5cdFx0XHRcdFx0XHRcdFx0eSA9IDA7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRyYW5zZm9ybSA9ICgoKGExMSAqIHJuZCkgfCAwKSAvIHJuZCkgKyBcIixcIiArICgoKGEyMSAqIHJuZCkgfCAwKSAvIHJuZCkgKyBcIixcIiArICgoKGExMiAqIHJuZCkgfCAwKSAvIHJuZCkgKyBcIixcIiArICgoKGEyMiAqIHJuZCkgfCAwKSAvIHJuZCkgKyBcIixcIiArIHggKyBcIixcIiArIHkgKyBcIilcIjtcblx0XHRcdFx0XHRcdGlmIChpc1NWRyAmJiBfdXNlU1ZHVHJhbnNmb3JtQXR0cikge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnQuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwibWF0cml4KFwiICsgdHJhbnNmb3JtKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdC8vc29tZSBicm93c2VycyBoYXZlIGEgaGFyZCB0aW1lIHdpdGggdmVyeSBzbWFsbCB2YWx1ZXMgbGlrZSAyLjQ0OTI5MzU5ODI5NDcwNjRlLTE2IChub3RpY2UgdGhlIFwiZS1cIiB0b3dhcmRzIHRoZSBlbmQpIGFuZCB3b3VsZCByZW5kZXIgdGhlIG9iamVjdCBzbGlnaHRseSBvZmYuIFNvIHdlIHJvdW5kIHRvIDUgZGVjaW1hbCBwbGFjZXMuXG5cdFx0XHRcdFx0XHRcdHN0eWxlW190cmFuc2Zvcm1Qcm9wXSA9ICgodC54UGVyY2VudCB8fCB0LnlQZXJjZW50KSA/IFwidHJhbnNsYXRlKFwiICsgdC54UGVyY2VudCArIFwiJSxcIiArIHQueVBlcmNlbnQgKyBcIiUpIG1hdHJpeChcIiA6IFwibWF0cml4KFwiKSArIHRyYW5zZm9ybTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c3R5bGVbX3RyYW5zZm9ybVByb3BdID0gKCh0LnhQZXJjZW50IHx8IHQueVBlcmNlbnQpID8gXCJ0cmFuc2xhdGUoXCIgKyB0LnhQZXJjZW50ICsgXCIlLFwiICsgdC55UGVyY2VudCArIFwiJSkgbWF0cml4KFwiIDogXCJtYXRyaXgoXCIpICsgc3ggKyBcIiwwLDAsXCIgKyBzeSArIFwiLFwiICsgeCArIFwiLFwiICsgeSArIFwiKVwiO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoX2lzRmlyZWZveCkgeyAvL0ZpcmVmb3ggaGFzIGEgYnVnIChhdCBsZWFzdCBpbiB2MjUpIHRoYXQgY2F1c2VzIGl0IHRvIHJlbmRlciB0aGUgdHJhbnNwYXJlbnQgcGFydCBvZiAzMi1iaXQgUE5HIGltYWdlcyBhcyBibGFjayB3aGVuIGRpc3BsYXllZCBpbnNpZGUgYW4gaWZyYW1lIGFuZCB0aGUgM0Qgc2NhbGUgaXMgdmVyeSBzbWFsbCBhbmQgZG9lc24ndCBjaGFuZ2Ugc3VmZmljaWVudGx5IGVub3VnaCBiZXR3ZWVuIHJlbmRlcnMgKGxpa2UgaWYgeW91IHVzZSBhIFBvd2VyNC5lYXNlSW5PdXQgdG8gc2NhbGUgZnJvbSAwIHRvIDEgd2hlcmUgdGhlIGJlZ2lubmluZyB2YWx1ZXMgb25seSBjaGFuZ2UgYSB0aW55IGFtb3VudCB0byBiZWdpbiB0aGUgdHdlZW4gYmVmb3JlIGFjY2VsZXJhdGluZykuIEluIHRoaXMgY2FzZSwgd2UgZm9yY2UgdGhlIHNjYWxlIHRvIGJlIDAuMDAwMDIgaW5zdGVhZCB3aGljaCBpcyB2aXN1YWxseSB0aGUgc2FtZSBidXQgd29ya3MgYXJvdW5kIHRoZSBGaXJlZm94IGlzc3VlLlxuXHRcdFx0XHRcdG1pbiA9IDAuMDAwMTtcblx0XHRcdFx0XHRpZiAoc3ggPCBtaW4gJiYgc3ggPiAtbWluKSB7XG5cdFx0XHRcdFx0XHRzeCA9IHN6ID0gMC4wMDAwMjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHN5IDwgbWluICYmIHN5ID4gLW1pbikge1xuXHRcdFx0XHRcdFx0c3kgPSBzeiA9IDAuMDAwMDI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwZXJzcGVjdGl2ZSAmJiAhdC56ICYmICF0LnJvdGF0aW9uWCAmJiAhdC5yb3RhdGlvblkpIHsgLy9GaXJlZm94IGhhcyBhIGJ1ZyB0aGF0IGNhdXNlcyBlbGVtZW50cyB0byBoYXZlIGFuIG9kZCBzdXBlci10aGluLCBicm9rZW4vZG90dGVkIGJsYWNrIGJvcmRlciBvbiBlbGVtZW50cyB0aGF0IGhhdmUgYSBwZXJzcGVjdGl2ZSBzZXQgYnV0IGFyZW4ndCB1dGlsaXppbmcgM0Qgc3BhY2UgKG5vIHJvdGF0aW9uWCwgcm90YXRpb25ZLCBvciB6KS5cblx0XHRcdFx0XHRcdHBlcnNwZWN0aXZlID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGFuZ2xlIHx8IHQuc2tld1gpIHtcblx0XHRcdFx0XHRhbmdsZSAqPSBfREVHMlJBRDtcblx0XHRcdFx0XHRjb3MgPSBhMTEgPSBNYXRoLmNvcyhhbmdsZSk7XG5cdFx0XHRcdFx0c2luID0gYTIxID0gTWF0aC5zaW4oYW5nbGUpO1xuXHRcdFx0XHRcdGlmICh0LnNrZXdYKSB7XG5cdFx0XHRcdFx0XHRhbmdsZSAtPSB0LnNrZXdYICogX0RFRzJSQUQ7XG5cdFx0XHRcdFx0XHRjb3MgPSBNYXRoLmNvcyhhbmdsZSk7XG5cdFx0XHRcdFx0XHRzaW4gPSBNYXRoLnNpbihhbmdsZSk7XG5cdFx0XHRcdFx0XHRpZiAodC5za2V3VHlwZSA9PT0gXCJzaW1wbGVcIikgeyAvL2J5IGRlZmF1bHQsIHdlIGNvbXBlbnNhdGUgc2tld2luZyBvbiB0aGUgb3RoZXIgYXhpcyB0byBtYWtlIGl0IGxvb2sgbW9yZSBuYXR1cmFsLCBidXQgeW91IGNhbiBzZXQgdGhlIHNrZXdUeXBlIHRvIFwic2ltcGxlXCIgdG8gdXNlIHRoZSB1bmNvbXBlbnNhdGVkIHNrZXdpbmcgdGhhdCBDU1MgZG9lc1xuXHRcdFx0XHRcdFx0XHR0MSA9IE1hdGgudGFuKHQuc2tld1ggKiBfREVHMlJBRCk7XG5cdFx0XHRcdFx0XHRcdHQxID0gTWF0aC5zcXJ0KDEgKyB0MSAqIHQxKTtcblx0XHRcdFx0XHRcdFx0Y29zICo9IHQxO1xuXHRcdFx0XHRcdFx0XHRzaW4gKj0gdDE7XG5cdFx0XHRcdFx0XHRcdGlmICh0LnNrZXdZKSB7XG5cdFx0XHRcdFx0XHRcdFx0YTExICo9IHQxO1xuXHRcdFx0XHRcdFx0XHRcdGEyMSAqPSB0MTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRhMTIgPSAtc2luO1xuXHRcdFx0XHRcdGEyMiA9IGNvcztcblxuXHRcdFx0XHR9IGVsc2UgaWYgKCFyb3RhdGlvblkgJiYgIXJvdGF0aW9uWCAmJiBzeiA9PT0gMSAmJiAhcGVyc3BlY3RpdmUgJiYgIWlzU1ZHKSB7IC8vaWYgd2UncmUgb25seSB0cmFuc2xhdGluZyBhbmQvb3IgMkQgc2NhbGluZywgdGhpcyBpcyBmYXN0ZXIuLi5cblx0XHRcdFx0XHRzdHlsZVtfdHJhbnNmb3JtUHJvcF0gPSAoKHQueFBlcmNlbnQgfHwgdC55UGVyY2VudCkgPyBcInRyYW5zbGF0ZShcIiArIHQueFBlcmNlbnQgKyBcIiUsXCIgKyB0LnlQZXJjZW50ICsgXCIlKSB0cmFuc2xhdGUzZChcIiA6IFwidHJhbnNsYXRlM2QoXCIpICsgeCArIFwicHgsXCIgKyB5ICsgXCJweCxcIiArIHogK1wicHgpXCIgKyAoKHN4ICE9PSAxIHx8IHN5ICE9PSAxKSA/IFwiIHNjYWxlKFwiICsgc3ggKyBcIixcIiArIHN5ICsgXCIpXCIgOiBcIlwiKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YTExID0gYTIyID0gMTtcblx0XHRcdFx0XHRhMTIgPSBhMjEgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIEtFWSAgSU5ERVggICBBRkZFQ1RTXG5cdFx0XHRcdC8vIGExMSAgMCAgICAgICByb3RhdGlvbiwgcm90YXRpb25ZLCBzY2FsZVhcblx0XHRcdFx0Ly8gYTIxICAxICAgICAgIHJvdGF0aW9uLCByb3RhdGlvblksIHNjYWxlWFxuXHRcdFx0XHQvLyBhMzEgIDIgICAgICAgcm90YXRpb25ZLCBzY2FsZVhcblx0XHRcdFx0Ly8gYTQxICAzICAgICAgIHJvdGF0aW9uWSwgc2NhbGVYXG5cdFx0XHRcdC8vIGExMiAgNCAgICAgICByb3RhdGlvbiwgc2tld1gsIHJvdGF0aW9uWCwgc2NhbGVZXG5cdFx0XHRcdC8vIGEyMiAgNSAgICAgICByb3RhdGlvbiwgc2tld1gsIHJvdGF0aW9uWCwgc2NhbGVZXG5cdFx0XHRcdC8vIGEzMiAgNiAgICAgICByb3RhdGlvblgsIHNjYWxlWVxuXHRcdFx0XHQvLyBhNDIgIDcgICAgICAgcm90YXRpb25YLCBzY2FsZVlcblx0XHRcdFx0Ly8gYTEzICA4ICAgICAgIHJvdGF0aW9uWSwgcm90YXRpb25YLCBzY2FsZVpcblx0XHRcdFx0Ly8gYTIzICA5ICAgICAgIHJvdGF0aW9uWSwgcm90YXRpb25YLCBzY2FsZVpcblx0XHRcdFx0Ly8gYTMzICAxMCAgICAgIHJvdGF0aW9uWSwgcm90YXRpb25YLCBzY2FsZVpcblx0XHRcdFx0Ly8gYTQzICAxMSAgICAgIHJvdGF0aW9uWSwgcm90YXRpb25YLCBwZXJzcGVjdGl2ZSwgc2NhbGVaXG5cdFx0XHRcdC8vIGExNCAgMTIgICAgICB4LCB6T3JpZ2luLCBzdmdPcmlnaW5cblx0XHRcdFx0Ly8gYTI0ICAxMyAgICAgIHksIHpPcmlnaW4sIHN2Z09yaWdpblxuXHRcdFx0XHQvLyBhMzQgIDE0ICAgICAgeiwgek9yaWdpblxuXHRcdFx0XHQvLyBhNDQgIDE1XG5cdFx0XHRcdC8vIHJvdGF0aW9uOiBNYXRoLmF0YW4yKGEyMSwgYTExKVxuXHRcdFx0XHQvLyByb3RhdGlvblk6IE1hdGguYXRhbjIoYTEzLCBhMzMpIChvciBNYXRoLmF0YW4yKGExMywgYTExKSlcblx0XHRcdFx0Ly8gcm90YXRpb25YOiBNYXRoLmF0YW4yKGEzMiwgYTMzKVxuXHRcdFx0XHRhMzMgPSAxO1xuXHRcdFx0XHRhMTMgPSBhMjMgPSBhMzEgPSBhMzIgPSBhNDEgPSBhNDIgPSAwO1xuXHRcdFx0XHRhNDMgPSAocGVyc3BlY3RpdmUpID8gLTEgLyBwZXJzcGVjdGl2ZSA6IDA7XG5cdFx0XHRcdHpPcmlnaW4gPSB0LnpPcmlnaW47XG5cdFx0XHRcdG1pbiA9IDAuMDAwMDAxOyAvL3RocmVzaG9sZCBiZWxvdyB3aGljaCBicm93c2VycyB1c2Ugc2NpZW50aWZpYyBub3RhdGlvbiB3aGljaCB3b24ndCB3b3JrLlxuXHRcdFx0XHRjb21tYSA9IFwiLFwiO1xuXHRcdFx0XHR6ZXJvID0gXCIwXCI7XG5cdFx0XHRcdGFuZ2xlID0gcm90YXRpb25ZICogX0RFRzJSQUQ7XG5cdFx0XHRcdGlmIChhbmdsZSkge1xuXHRcdFx0XHRcdGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcblx0XHRcdFx0XHRzaW4gPSBNYXRoLnNpbihhbmdsZSk7XG5cdFx0XHRcdFx0YTMxID0gLXNpbjtcblx0XHRcdFx0XHRhNDEgPSBhNDMqLXNpbjtcblx0XHRcdFx0XHRhMTMgPSBhMTEqc2luO1xuXHRcdFx0XHRcdGEyMyA9IGEyMSpzaW47XG5cdFx0XHRcdFx0YTMzID0gY29zO1xuXHRcdFx0XHRcdGE0MyAqPSBjb3M7XG5cdFx0XHRcdFx0YTExICo9IGNvcztcblx0XHRcdFx0XHRhMjEgKj0gY29zO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGFuZ2xlID0gcm90YXRpb25YICogX0RFRzJSQUQ7XG5cdFx0XHRcdGlmIChhbmdsZSkge1xuXHRcdFx0XHRcdGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcblx0XHRcdFx0XHRzaW4gPSBNYXRoLnNpbihhbmdsZSk7XG5cdFx0XHRcdFx0dDEgPSBhMTIqY29zK2ExMypzaW47XG5cdFx0XHRcdFx0dDIgPSBhMjIqY29zK2EyMypzaW47XG5cdFx0XHRcdFx0YTMyID0gYTMzKnNpbjtcblx0XHRcdFx0XHRhNDIgPSBhNDMqc2luO1xuXHRcdFx0XHRcdGExMyA9IGExMiotc2luK2ExMypjb3M7XG5cdFx0XHRcdFx0YTIzID0gYTIyKi1zaW4rYTIzKmNvcztcblx0XHRcdFx0XHRhMzMgPSBhMzMqY29zO1xuXHRcdFx0XHRcdGE0MyA9IGE0Mypjb3M7XG5cdFx0XHRcdFx0YTEyID0gdDE7XG5cdFx0XHRcdFx0YTIyID0gdDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHN6ICE9PSAxKSB7XG5cdFx0XHRcdFx0YTEzKj1zejtcblx0XHRcdFx0XHRhMjMqPXN6O1xuXHRcdFx0XHRcdGEzMyo9c3o7XG5cdFx0XHRcdFx0YTQzKj1zejtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc3kgIT09IDEpIHtcblx0XHRcdFx0XHRhMTIqPXN5O1xuXHRcdFx0XHRcdGEyMio9c3k7XG5cdFx0XHRcdFx0YTMyKj1zeTtcblx0XHRcdFx0XHRhNDIqPXN5O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzeCAhPT0gMSkge1xuXHRcdFx0XHRcdGExMSo9c3g7XG5cdFx0XHRcdFx0YTIxKj1zeDtcblx0XHRcdFx0XHRhMzEqPXN4O1xuXHRcdFx0XHRcdGE0MSo9c3g7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoek9yaWdpbiB8fCBpc1NWRykge1xuXHRcdFx0XHRcdGlmICh6T3JpZ2luKSB7XG5cdFx0XHRcdFx0XHR4ICs9IGExMyotek9yaWdpbjtcblx0XHRcdFx0XHRcdHkgKz0gYTIzKi16T3JpZ2luO1xuXHRcdFx0XHRcdFx0eiArPSBhMzMqLXpPcmlnaW4rek9yaWdpbjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGlzU1ZHKSB7IC8vZHVlIHRvIGJ1Z3MgaW4gc29tZSBicm93c2Vycywgd2UgbmVlZCB0byBtYW5hZ2UgdGhlIHRyYW5zZm9ybS1vcmlnaW4gb2YgU1ZHIG1hbnVhbGx5XG5cdFx0XHRcdFx0XHR4ICs9IHQueE9yaWdpbiAtICh0LnhPcmlnaW4gKiBhMTEgKyB0LnlPcmlnaW4gKiBhMTIpICsgdC54T2Zmc2V0O1xuXHRcdFx0XHRcdFx0eSArPSB0LnlPcmlnaW4gLSAodC54T3JpZ2luICogYTIxICsgdC55T3JpZ2luICogYTIyKSArIHQueU9mZnNldDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHggPCBtaW4gJiYgeCA+IC1taW4pIHtcblx0XHRcdFx0XHRcdHggPSB6ZXJvO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoeSA8IG1pbiAmJiB5ID4gLW1pbikge1xuXHRcdFx0XHRcdFx0eSA9IHplcm87XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICh6IDwgbWluICYmIHogPiAtbWluKSB7XG5cdFx0XHRcdFx0XHR6ID0gMDsgLy9kb24ndCB1c2Ugc3RyaW5nIGJlY2F1c2Ugd2UgY2FsY3VsYXRlIHBlcnNwZWN0aXZlIGxhdGVyIGFuZCBuZWVkIHRoZSBudW1iZXIuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9vcHRpbWl6ZWQgd2F5IG9mIGNvbmNhdGVuYXRpbmcgYWxsIHRoZSB2YWx1ZXMgaW50byBhIHN0cmluZy4gSWYgd2UgZG8gaXQgYWxsIGluIG9uZSBzaG90LCBpdCdzIHNsb3dlciBiZWNhdXNlIG9mIHRoZSB3YXkgYnJvd3NlcnMgaGF2ZSB0byBjcmVhdGUgdGVtcCBzdHJpbmdzIGFuZCB0aGUgd2F5IGl0IGFmZmVjdHMgbWVtb3J5LiBJZiB3ZSBkbyBpdCBwaWVjZS1ieS1waWVjZSB3aXRoICs9LCBpdCdzIGEgYml0IHNsb3dlciB0b28uIFdlIGZvdW5kIHRoYXQgZG9pbmcgaXQgaW4gdGhlc2Ugc2l6ZWQgY2h1bmtzIHdvcmtzIGJlc3Qgb3ZlcmFsbDpcblx0XHRcdFx0dHJhbnNmb3JtID0gKCh0LnhQZXJjZW50IHx8IHQueVBlcmNlbnQpID8gXCJ0cmFuc2xhdGUoXCIgKyB0LnhQZXJjZW50ICsgXCIlLFwiICsgdC55UGVyY2VudCArIFwiJSkgbWF0cml4M2QoXCIgOiBcIm1hdHJpeDNkKFwiKTtcblx0XHRcdFx0dHJhbnNmb3JtICs9ICgoYTExIDwgbWluICYmIGExMSA+IC1taW4pID8gemVybyA6IGExMSkgKyBjb21tYSArICgoYTIxIDwgbWluICYmIGEyMSA+IC1taW4pID8gemVybyA6IGEyMSkgKyBjb21tYSArICgoYTMxIDwgbWluICYmIGEzMSA+IC1taW4pID8gemVybyA6IGEzMSk7XG5cdFx0XHRcdHRyYW5zZm9ybSArPSBjb21tYSArICgoYTQxIDwgbWluICYmIGE0MSA+IC1taW4pID8gemVybyA6IGE0MSkgKyBjb21tYSArICgoYTEyIDwgbWluICYmIGExMiA+IC1taW4pID8gemVybyA6IGExMikgKyBjb21tYSArICgoYTIyIDwgbWluICYmIGEyMiA+IC1taW4pID8gemVybyA6IGEyMik7XG5cdFx0XHRcdGlmIChyb3RhdGlvblggfHwgcm90YXRpb25ZKSB7IC8vcGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uIChvZnRlbiB0aGVyZSdzIG5vIHJvdGF0aW9uWCBvciByb3RhdGlvblksIHNvIHdlIGNhbiBza2lwIHRoZXNlIGNhbGN1bGF0aW9ucylcblx0XHRcdFx0XHR0cmFuc2Zvcm0gKz0gY29tbWEgKyAoKGEzMiA8IG1pbiAmJiBhMzIgPiAtbWluKSA/IHplcm8gOiBhMzIpICsgY29tbWEgKyAoKGE0MiA8IG1pbiAmJiBhNDIgPiAtbWluKSA/IHplcm8gOiBhNDIpICsgY29tbWEgKyAoKGExMyA8IG1pbiAmJiBhMTMgPiAtbWluKSA/IHplcm8gOiBhMTMpO1xuXHRcdFx0XHRcdHRyYW5zZm9ybSArPSBjb21tYSArICgoYTIzIDwgbWluICYmIGEyMyA+IC1taW4pID8gemVybyA6IGEyMykgKyBjb21tYSArICgoYTMzIDwgbWluICYmIGEzMyA+IC1taW4pID8gemVybyA6IGEzMykgKyBjb21tYSArICgoYTQzIDwgbWluICYmIGE0MyA+IC1taW4pID8gemVybyA6IGE0MykgKyBjb21tYTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0cmFuc2Zvcm0gKz0gXCIsMCwwLDAsMCwxLDAsXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0dHJhbnNmb3JtICs9IHggKyBjb21tYSArIHkgKyBjb21tYSArIHogKyBjb21tYSArIChwZXJzcGVjdGl2ZSA/ICgxICsgKC16IC8gcGVyc3BlY3RpdmUpKSA6IDEpICsgXCIpXCI7XG5cblx0XHRcdFx0c3R5bGVbX3RyYW5zZm9ybVByb3BdID0gdHJhbnNmb3JtO1xuXHRcdFx0fTtcblxuXHRcdHAgPSBUcmFuc2Zvcm0ucHJvdG90eXBlO1xuXHRcdHAueCA9IHAueSA9IHAueiA9IHAuc2tld1ggPSBwLnNrZXdZID0gcC5yb3RhdGlvbiA9IHAucm90YXRpb25YID0gcC5yb3RhdGlvblkgPSBwLnpPcmlnaW4gPSBwLnhQZXJjZW50ID0gcC55UGVyY2VudCA9IHAueE9mZnNldCA9IHAueU9mZnNldCA9IDA7XG5cdFx0cC5zY2FsZVggPSBwLnNjYWxlWSA9IHAuc2NhbGVaID0gMTtcblxuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcInRyYW5zZm9ybSxzY2FsZSxzY2FsZVgsc2NhbGVZLHNjYWxlWix4LHkseixyb3RhdGlvbixyb3RhdGlvblgscm90YXRpb25ZLHJvdGF0aW9uWixza2V3WCxza2V3WSxzaG9ydFJvdGF0aW9uLHNob3J0Um90YXRpb25YLHNob3J0Um90YXRpb25ZLHNob3J0Um90YXRpb25aLHRyYW5zZm9ybU9yaWdpbixzdmdPcmlnaW4sdHJhbnNmb3JtUGVyc3BlY3RpdmUsZGlyZWN0aW9uYWxSb3RhdGlvbixwYXJzZVRyYW5zZm9ybSxmb3JjZTNELHNrZXdUeXBlLHhQZXJjZW50LHlQZXJjZW50LHNtb290aE9yaWdpblwiLCB7cGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4sIHZhcnMpIHtcblx0XHRcdGlmIChjc3NwLl9sYXN0UGFyc2VkVHJhbnNmb3JtID09PSB2YXJzKSB7IHJldHVybiBwdDsgfSAvL29ubHkgbmVlZCB0byBwYXJzZSB0aGUgdHJhbnNmb3JtIG9uY2UsIGFuZCBvbmx5IGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIGl0LlxuXHRcdFx0Y3NzcC5fbGFzdFBhcnNlZFRyYW5zZm9ybSA9IHZhcnM7XG5cdFx0XHR2YXIgb3JpZ2luYWxHU1RyYW5zZm9ybSA9IHQuX2dzVHJhbnNmb3JtLFxuXHRcdFx0XHRtMSA9IGNzc3AuX3RyYW5zZm9ybSA9IF9nZXRUcmFuc2Zvcm0odCwgX2NzLCB0cnVlLCB2YXJzLnBhcnNlVHJhbnNmb3JtKSxcblx0XHRcdFx0c3R5bGUgPSB0LnN0eWxlLFxuXHRcdFx0XHRtaW4gPSAwLjAwMDAwMSxcblx0XHRcdFx0aSA9IF90cmFuc2Zvcm1Qcm9wcy5sZW5ndGgsXG5cdFx0XHRcdHYgPSB2YXJzLFxuXHRcdFx0XHRlbmRSb3RhdGlvbnMgPSB7fSxcblx0XHRcdFx0dHJhbnNmb3JtT3JpZ2luU3RyaW5nID0gXCJ0cmFuc2Zvcm1PcmlnaW5cIixcblx0XHRcdFx0bTIsIHNrZXdZLCBjb3B5LCBvcmlnLCBoYXMzRCwgaGFzQ2hhbmdlLCBkciwgeCwgeTtcblx0XHRcdGlmICh0eXBlb2Yodi50cmFuc2Zvcm0pID09PSBcInN0cmluZ1wiICYmIF90cmFuc2Zvcm1Qcm9wKSB7IC8vZm9yIHZhbHVlcyBsaWtlIHRyYW5zZm9ybTpcInJvdGF0ZSg2MGRlZykgc2NhbGUoMC41LCAwLjgpXCJcblx0XHRcdFx0Y29weSA9IF90ZW1wRGl2LnN0eWxlOyAvL2Rvbid0IHVzZSB0aGUgb3JpZ2luYWwgdGFyZ2V0IGJlY2F1c2UgaXQgbWlnaHQgYmUgU1ZHIGluIHdoaWNoIGNhc2Ugc29tZSBicm93c2VycyBkb24ndCByZXBvcnQgY29tcHV0ZWQgc3R5bGUgY29ycmVjdGx5LlxuXHRcdFx0XHRjb3B5W190cmFuc2Zvcm1Qcm9wXSA9IHYudHJhbnNmb3JtO1xuXHRcdFx0XHRjb3B5LmRpc3BsYXkgPSBcImJsb2NrXCI7IC8vaWYgZGlzcGxheSBpcyBcIm5vbmVcIiwgdGhlIGJyb3dzZXIgb2Z0ZW4gcmVmdXNlcyB0byByZXBvcnQgdGhlIHRyYW5zZm9ybSBwcm9wZXJ0aWVzIGNvcnJlY3RseS5cblx0XHRcdFx0Y29weS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0XHRcdFx0X2RvYy5ib2R5LmFwcGVuZENoaWxkKF90ZW1wRGl2KTtcblx0XHRcdFx0bTIgPSBfZ2V0VHJhbnNmb3JtKF90ZW1wRGl2LCBudWxsLCBmYWxzZSk7XG5cdFx0XHRcdF9kb2MuYm9keS5yZW1vdmVDaGlsZChfdGVtcERpdik7XG5cdFx0XHRcdGlmICh2LnhQZXJjZW50ICE9IG51bGwpIHtcblx0XHRcdFx0XHRtMi54UGVyY2VudCA9IF9wYXJzZVZhbCh2LnhQZXJjZW50LCBtMS54UGVyY2VudCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHYueVBlcmNlbnQgIT0gbnVsbCkge1xuXHRcdFx0XHRcdG0yLnlQZXJjZW50ID0gX3BhcnNlVmFsKHYueVBlcmNlbnQsIG0xLnlQZXJjZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICh0eXBlb2YodikgPT09IFwib2JqZWN0XCIpIHsgLy9mb3IgdmFsdWVzIGxpa2Ugc2NhbGVYLCBzY2FsZVksIHJvdGF0aW9uLCB4LCB5LCBza2V3WCwgYW5kIHNrZXdZIG9yIHRyYW5zZm9ybTp7Li4ufSAob2JqZWN0KVxuXHRcdFx0XHRtMiA9IHtzY2FsZVg6X3BhcnNlVmFsKCh2LnNjYWxlWCAhPSBudWxsKSA/IHYuc2NhbGVYIDogdi5zY2FsZSwgbTEuc2NhbGVYKSxcblx0XHRcdFx0XHRzY2FsZVk6X3BhcnNlVmFsKCh2LnNjYWxlWSAhPSBudWxsKSA/IHYuc2NhbGVZIDogdi5zY2FsZSwgbTEuc2NhbGVZKSxcblx0XHRcdFx0XHRzY2FsZVo6X3BhcnNlVmFsKHYuc2NhbGVaLCBtMS5zY2FsZVopLFxuXHRcdFx0XHRcdHg6X3BhcnNlVmFsKHYueCwgbTEueCksXG5cdFx0XHRcdFx0eTpfcGFyc2VWYWwodi55LCBtMS55KSxcblx0XHRcdFx0XHR6Ol9wYXJzZVZhbCh2LnosIG0xLnopLFxuXHRcdFx0XHRcdHhQZXJjZW50Ol9wYXJzZVZhbCh2LnhQZXJjZW50LCBtMS54UGVyY2VudCksXG5cdFx0XHRcdFx0eVBlcmNlbnQ6X3BhcnNlVmFsKHYueVBlcmNlbnQsIG0xLnlQZXJjZW50KSxcblx0XHRcdFx0XHRwZXJzcGVjdGl2ZTpfcGFyc2VWYWwodi50cmFuc2Zvcm1QZXJzcGVjdGl2ZSwgbTEucGVyc3BlY3RpdmUpfTtcblx0XHRcdFx0ZHIgPSB2LmRpcmVjdGlvbmFsUm90YXRpb247XG5cdFx0XHRcdGlmIChkciAhPSBudWxsKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZihkcikgPT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0XHRcdGZvciAoY29weSBpbiBkcikge1xuXHRcdFx0XHRcdFx0XHR2W2NvcHldID0gZHJbY29weV07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHYucm90YXRpb24gPSBkcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR5cGVvZih2LngpID09PSBcInN0cmluZ1wiICYmIHYueC5pbmRleE9mKFwiJVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRtMi54ID0gMDtcblx0XHRcdFx0XHRtMi54UGVyY2VudCA9IF9wYXJzZVZhbCh2LngsIG0xLnhQZXJjZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodHlwZW9mKHYueSkgPT09IFwic3RyaW5nXCIgJiYgdi55LmluZGV4T2YoXCIlXCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdG0yLnkgPSAwO1xuXHRcdFx0XHRcdG0yLnlQZXJjZW50ID0gX3BhcnNlVmFsKHYueSwgbTEueVBlcmNlbnQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bTIucm90YXRpb24gPSBfcGFyc2VBbmdsZSgoXCJyb3RhdGlvblwiIGluIHYpID8gdi5yb3RhdGlvbiA6IChcInNob3J0Um90YXRpb25cIiBpbiB2KSA/IHYuc2hvcnRSb3RhdGlvbiArIFwiX3Nob3J0XCIgOiAoXCJyb3RhdGlvblpcIiBpbiB2KSA/IHYucm90YXRpb25aIDogbTEucm90YXRpb24sIG0xLnJvdGF0aW9uLCBcInJvdGF0aW9uXCIsIGVuZFJvdGF0aW9ucyk7XG5cdFx0XHRcdGlmIChfc3VwcG9ydHMzRCkge1xuXHRcdFx0XHRcdG0yLnJvdGF0aW9uWCA9IF9wYXJzZUFuZ2xlKChcInJvdGF0aW9uWFwiIGluIHYpID8gdi5yb3RhdGlvblggOiAoXCJzaG9ydFJvdGF0aW9uWFwiIGluIHYpID8gdi5zaG9ydFJvdGF0aW9uWCArIFwiX3Nob3J0XCIgOiBtMS5yb3RhdGlvblggfHwgMCwgbTEucm90YXRpb25YLCBcInJvdGF0aW9uWFwiLCBlbmRSb3RhdGlvbnMpO1xuXHRcdFx0XHRcdG0yLnJvdGF0aW9uWSA9IF9wYXJzZUFuZ2xlKChcInJvdGF0aW9uWVwiIGluIHYpID8gdi5yb3RhdGlvblkgOiAoXCJzaG9ydFJvdGF0aW9uWVwiIGluIHYpID8gdi5zaG9ydFJvdGF0aW9uWSArIFwiX3Nob3J0XCIgOiBtMS5yb3RhdGlvblkgfHwgMCwgbTEucm90YXRpb25ZLCBcInJvdGF0aW9uWVwiLCBlbmRSb3RhdGlvbnMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdG0yLnNrZXdYID0gKHYuc2tld1ggPT0gbnVsbCkgPyBtMS5za2V3WCA6IF9wYXJzZUFuZ2xlKHYuc2tld1gsIG0xLnNrZXdYKTtcblxuXHRcdFx0XHQvL25vdGU6IGZvciBwZXJmb3JtYW5jZSByZWFzb25zLCB3ZSBjb21iaW5lIGFsbCBza2V3aW5nIGludG8gdGhlIHNrZXdYIGFuZCByb3RhdGlvbiB2YWx1ZXMsIGlnbm9yaW5nIHNrZXdZIGJ1dCB3ZSBtdXN0IHN0aWxsIHJlY29yZCBpdCBzbyB0aGF0IHdlIGNhbiBkaXNjZXJuIGhvdyBtdWNoIG9mIHRoZSBvdmVyYWxsIHNrZXcgaXMgYXR0cmlidXRlZCB0byBza2V3WCB2cy4gc2tld1kuIE90aGVyd2lzZSwgaWYgdGhlIHNrZXdZIHdvdWxkIGFsd2F5cyBhY3QgcmVsYXRpdmUgKHR3ZWVuIHNrZXdZIHRvIDEwZGVnLCBmb3IgZXhhbXBsZSwgbXVsdGlwbGUgdGltZXMgYW5kIGlmIHdlIGFsd2F5cyBjb21iaW5lIHRoaW5ncyBpbnRvIHNrZXdYLCB3ZSBjYW4ndCByZW1lbWJlciB0aGF0IHNrZXdZIHdhcyAxMCBmcm9tIGxhc3QgdGltZSkuIFJlbWVtYmVyLCBhIHNrZXdZIG9mIDEwIGRlZ3JlZXMgbG9va3MgdGhlIHNhbWUgYXMgYSByb3RhdGlvbiBvZiAxMCBkZWdyZWVzIHBsdXMgYSBza2V3WCBvZiAtMTAgZGVncmVlcy5cblx0XHRcdFx0bTIuc2tld1kgPSAodi5za2V3WSA9PSBudWxsKSA/IG0xLnNrZXdZIDogX3BhcnNlQW5nbGUodi5za2V3WSwgbTEuc2tld1kpO1xuXHRcdFx0XHRpZiAoKHNrZXdZID0gbTIuc2tld1kgLSBtMS5za2V3WSkpIHtcblx0XHRcdFx0XHRtMi5za2V3WCArPSBza2V3WTtcblx0XHRcdFx0XHRtMi5yb3RhdGlvbiArPSBza2V3WTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKF9zdXBwb3J0czNEICYmIHYuZm9yY2UzRCAhPSBudWxsKSB7XG5cdFx0XHRcdG0xLmZvcmNlM0QgPSB2LmZvcmNlM0Q7XG5cdFx0XHRcdGhhc0NoYW5nZSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdG0xLnNrZXdUeXBlID0gdi5za2V3VHlwZSB8fCBtMS5za2V3VHlwZSB8fCBDU1NQbHVnaW4uZGVmYXVsdFNrZXdUeXBlO1xuXG5cdFx0XHRoYXMzRCA9IChtMS5mb3JjZTNEIHx8IG0xLnogfHwgbTEucm90YXRpb25YIHx8IG0xLnJvdGF0aW9uWSB8fCBtMi56IHx8IG0yLnJvdGF0aW9uWCB8fCBtMi5yb3RhdGlvblkgfHwgbTIucGVyc3BlY3RpdmUpO1xuXHRcdFx0aWYgKCFoYXMzRCAmJiB2LnNjYWxlICE9IG51bGwpIHtcblx0XHRcdFx0bTIuc2NhbGVaID0gMTsgLy9ubyBuZWVkIHRvIHR3ZWVuIHNjYWxlWi5cblx0XHRcdH1cblxuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdHAgPSBfdHJhbnNmb3JtUHJvcHNbaV07XG5cdFx0XHRcdG9yaWcgPSBtMltwXSAtIG0xW3BdO1xuXHRcdFx0XHRpZiAob3JpZyA+IG1pbiB8fCBvcmlnIDwgLW1pbiB8fCB2W3BdICE9IG51bGwgfHwgX2ZvcmNlUFRbcF0gIT0gbnVsbCkge1xuXHRcdFx0XHRcdGhhc0NoYW5nZSA9IHRydWU7XG5cdFx0XHRcdFx0cHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKG0xLCBwLCBtMVtwXSwgb3JpZywgcHQpO1xuXHRcdFx0XHRcdGlmIChwIGluIGVuZFJvdGF0aW9ucykge1xuXHRcdFx0XHRcdFx0cHQuZSA9IGVuZFJvdGF0aW9uc1twXTsgLy9kaXJlY3Rpb25hbCByb3RhdGlvbnMgdHlwaWNhbGx5IGhhdmUgY29tcGVuc2F0ZWQgdmFsdWVzIGR1cmluZyB0aGUgdHdlZW4sIGJ1dCB3ZSBuZWVkIHRvIG1ha2Ugc3VyZSB0aGV5IGVuZCBhdCBleGFjdGx5IHdoYXQgdGhlIHVzZXIgcmVxdWVzdGVkXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHB0LnhzMCA9IDA7IC8vZW5zdXJlcyB0aGUgdmFsdWUgc3RheXMgbnVtZXJpYyBpbiBzZXRSYXRpbygpXG5cdFx0XHRcdFx0cHQucGx1Z2luID0gcGx1Z2luO1xuXHRcdFx0XHRcdGNzc3AuX292ZXJ3cml0ZVByb3BzLnB1c2gocHQubik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0b3JpZyA9IHYudHJhbnNmb3JtT3JpZ2luO1xuXHRcdFx0aWYgKG0xLnN2ZyAmJiAob3JpZyB8fCB2LnN2Z09yaWdpbikpIHtcblx0XHRcdFx0eCA9IG0xLnhPZmZzZXQ7IC8vd2hlbiB3ZSBjaGFuZ2UgdGhlIG9yaWdpbiwgaW4gb3JkZXIgdG8gcHJldmVudCB0aGluZ3MgZnJvbSBqdW1waW5nIHdlIGFkanVzdCB0aGUgeC95IHNvIHdlIG11c3QgcmVjb3JkIHRob3NlIGhlcmUgc28gdGhhdCB3ZSBjYW4gY3JlYXRlIFByb3BUd2VlbnMgZm9yIHRoZW0gYW5kIGZsaXAgdGhlbSBhdCB0aGUgc2FtZSB0aW1lIGFzIHRoZSBvcmlnaW5cblx0XHRcdFx0eSA9IG0xLnlPZmZzZXQ7XG5cdFx0XHRcdF9wYXJzZVNWR09yaWdpbih0LCBfcGFyc2VQb3NpdGlvbihvcmlnKSwgbTIsIHYuc3ZnT3JpZ2luLCB2LnNtb290aE9yaWdpbik7XG5cdFx0XHRcdHB0ID0gX2FkZE5vblR3ZWVuaW5nTnVtZXJpY1BUKG0xLCBcInhPcmlnaW5cIiwgKG9yaWdpbmFsR1NUcmFuc2Zvcm0gPyBtMSA6IG0yKS54T3JpZ2luLCBtMi54T3JpZ2luLCBwdCwgdHJhbnNmb3JtT3JpZ2luU3RyaW5nKTsgLy9ub3RlOiBpZiB0aGVyZSB3YXNuJ3QgYSB0cmFuc2Zvcm1PcmlnaW4gZGVmaW5lZCB5ZXQsIGp1c3Qgc3RhcnQgd2l0aCB0aGUgZGVzdGluYXRpb24gb25lOyBpdCdzIHdhc3RlZnVsIG90aGVyd2lzZSwgYW5kIGl0IGNhdXNlcyBwcm9ibGVtcyB3aXRoIGZyb21UbygpIHR3ZWVucy4gRm9yIGV4YW1wbGUsIFR3ZWVuTGl0ZS50byhcIiN3aGVlbFwiLCAzLCB7cm90YXRpb246MTgwLCB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlXCIsIGRlbGF5OjF9KTsgVHdlZW5MaXRlLmZyb21UbyhcIiN3aGVlbFwiLCAzLCB7c2NhbGU6MC41LCB0cmFuc2Zvcm1PcmlnaW46XCI1MCUgNTAlXCJ9LCB7c2NhbGU6MSwgZGVsYXk6Mn0pOyB3b3VsZCBjYXVzZSBhIGp1bXAgd2hlbiB0aGUgZnJvbSB2YWx1ZXMgcmV2ZXJ0IGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIDJuZCB0d2Vlbi5cblx0XHRcdFx0cHQgPSBfYWRkTm9uVHdlZW5pbmdOdW1lcmljUFQobTEsIFwieU9yaWdpblwiLCAob3JpZ2luYWxHU1RyYW5zZm9ybSA/IG0xIDogbTIpLnlPcmlnaW4sIG0yLnlPcmlnaW4sIHB0LCB0cmFuc2Zvcm1PcmlnaW5TdHJpbmcpO1xuXHRcdFx0XHRpZiAoeCAhPT0gbTEueE9mZnNldCB8fCB5ICE9PSBtMS55T2Zmc2V0KSB7XG5cdFx0XHRcdFx0cHQgPSBfYWRkTm9uVHdlZW5pbmdOdW1lcmljUFQobTEsIFwieE9mZnNldFwiLCAob3JpZ2luYWxHU1RyYW5zZm9ybSA/IHggOiBtMS54T2Zmc2V0KSwgbTEueE9mZnNldCwgcHQsIHRyYW5zZm9ybU9yaWdpblN0cmluZyk7XG5cdFx0XHRcdFx0cHQgPSBfYWRkTm9uVHdlZW5pbmdOdW1lcmljUFQobTEsIFwieU9mZnNldFwiLCAob3JpZ2luYWxHU1RyYW5zZm9ybSA/IHkgOiBtMS55T2Zmc2V0KSwgbTEueU9mZnNldCwgcHQsIHRyYW5zZm9ybU9yaWdpblN0cmluZyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0b3JpZyA9IF91c2VTVkdUcmFuc2Zvcm1BdHRyID8gbnVsbCA6IFwiMHB4IDBweFwiOyAvL2NlcnRhaW4gYnJvd3NlcnMgKGxpa2UgZmlyZWZveCkgY29tcGxldGVseSBib3RjaCB0cmFuc2Zvcm0tb3JpZ2luLCBzbyB3ZSBtdXN0IHJlbW92ZSBpdCB0byBwcmV2ZW50IGl0IGZyb20gY29udGFtaW5hdGluZyB0cmFuc2Zvcm1zLiBXZSBtYW5hZ2UgaXQgb3Vyc2VsdmVzIHdpdGggeE9yaWdpbiBhbmQgeU9yaWdpblxuXHRcdFx0fVxuXHRcdFx0aWYgKG9yaWcgfHwgKF9zdXBwb3J0czNEICYmIGhhczNEICYmIG0xLnpPcmlnaW4pKSB7IC8vaWYgYW55dGhpbmcgM0QgaXMgaGFwcGVuaW5nIGFuZCB0aGVyZSdzIGEgdHJhbnNmb3JtT3JpZ2luIHdpdGggYSB6IGNvbXBvbmVudCB0aGF0J3Mgbm9uLXplcm8sIHdlIG11c3QgZW5zdXJlIHRoYXQgdGhlIHRyYW5zZm9ybU9yaWdpbidzIHotY29tcG9uZW50IGlzIHNldCB0byAwIHNvIHRoYXQgd2UgY2FuIG1hbnVhbGx5IGRvIHRob3NlIGNhbGN1bGF0aW9ucyB0byBnZXQgYXJvdW5kIFNhZmFyaSBidWdzLiBFdmVuIGlmIHRoZSB1c2VyIGRpZG4ndCBzcGVjaWZpY2FsbHkgZGVmaW5lIGEgXCJ0cmFuc2Zvcm1PcmlnaW5cIiBpbiB0aGlzIHBhcnRpY3VsYXIgdHdlZW4gKG1heWJlIHRoZXkgZGlkIGl0IHZpYSBjc3MgZGlyZWN0bHkpLlxuXHRcdFx0XHRpZiAoX3RyYW5zZm9ybVByb3ApIHtcblx0XHRcdFx0XHRoYXNDaGFuZ2UgPSB0cnVlO1xuXHRcdFx0XHRcdHAgPSBfdHJhbnNmb3JtT3JpZ2luUHJvcDtcblx0XHRcdFx0XHRvcmlnID0gKG9yaWcgfHwgX2dldFN0eWxlKHQsIHAsIF9jcywgZmFsc2UsIFwiNTAlIDUwJVwiKSkgKyBcIlwiOyAvL2Nhc3QgYXMgc3RyaW5nIHRvIGF2b2lkIGVycm9yc1xuXHRcdFx0XHRcdHB0ID0gbmV3IENTU1Byb3BUd2VlbihzdHlsZSwgcCwgMCwgMCwgcHQsIC0xLCB0cmFuc2Zvcm1PcmlnaW5TdHJpbmcpO1xuXHRcdFx0XHRcdHB0LmIgPSBzdHlsZVtwXTtcblx0XHRcdFx0XHRwdC5wbHVnaW4gPSBwbHVnaW47XG5cdFx0XHRcdFx0aWYgKF9zdXBwb3J0czNEKSB7XG5cdFx0XHRcdFx0XHRjb3B5ID0gbTEuek9yaWdpbjtcblx0XHRcdFx0XHRcdG9yaWcgPSBvcmlnLnNwbGl0KFwiIFwiKTtcblx0XHRcdFx0XHRcdG0xLnpPcmlnaW4gPSAoKG9yaWcubGVuZ3RoID4gMiAmJiAhKGNvcHkgIT09IDAgJiYgb3JpZ1syXSA9PT0gXCIwcHhcIikpID8gcGFyc2VGbG9hdChvcmlnWzJdKSA6IGNvcHkpIHx8IDA7IC8vU2FmYXJpIGRvZXNuJ3QgaGFuZGxlIHRoZSB6IHBhcnQgb2YgdHJhbnNmb3JtT3JpZ2luIGNvcnJlY3RseSwgc28gd2UnbGwgbWFudWFsbHkgaGFuZGxlIGl0IGluIHRoZSBfc2V0M0RUcmFuc2Zvcm1SYXRpbygpIG1ldGhvZC5cblx0XHRcdFx0XHRcdHB0LnhzMCA9IHB0LmUgPSBvcmlnWzBdICsgXCIgXCIgKyAob3JpZ1sxXSB8fCBcIjUwJVwiKSArIFwiIDBweFwiOyAvL3dlIG11c3QgZGVmaW5lIGEgeiB2YWx1ZSBvZiAwcHggc3BlY2lmaWNhbGx5IG90aGVyd2lzZSBpT1MgNSBTYWZhcmkgd2lsbCBzdGljayB3aXRoIHRoZSBvbGQgb25lIChpZiBvbmUgd2FzIGRlZmluZWQpIVxuXHRcdFx0XHRcdFx0cHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKG0xLCBcInpPcmlnaW5cIiwgMCwgMCwgcHQsIC0xLCBwdC5uKTsgLy93ZSBtdXN0IGNyZWF0ZSBhIENTU1Byb3BUd2VlbiBmb3IgdGhlIF9nc1RyYW5zZm9ybS56T3JpZ2luIHNvIHRoYXQgaXQgZ2V0cyByZXNldCBwcm9wZXJseSBhdCB0aGUgYmVnaW5uaW5nIGlmIHRoZSB0d2VlbiBydW5zIGJhY2t3YXJkIChhcyBvcHBvc2VkIHRvIGp1c3Qgc2V0dGluZyBtMS56T3JpZ2luIGhlcmUpXG5cdFx0XHRcdFx0XHRwdC5iID0gY29weTtcblx0XHRcdFx0XHRcdHB0LnhzMCA9IHB0LmUgPSBtMS56T3JpZ2luO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRwdC54czAgPSBwdC5lID0gb3JpZztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvL2ZvciBvbGRlciB2ZXJzaW9ucyBvZiBJRSAoNi04KSwgd2UgbmVlZCB0byBtYW51YWxseSBjYWxjdWxhdGUgdGhpbmdzIGluc2lkZSB0aGUgc2V0UmF0aW8oKSBmdW5jdGlvbi4gV2UgcmVjb3JkIG9yaWdpbiB4IGFuZCB5IChveCBhbmQgb3kpIGFuZCB3aGV0aGVyIG9yIG5vdCB0aGUgdmFsdWVzIGFyZSBwZXJjZW50YWdlcyAob3hwIGFuZCBveXApLlxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdF9wYXJzZVBvc2l0aW9uKG9yaWcgKyBcIlwiLCBtMSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmIChoYXNDaGFuZ2UpIHtcblx0XHRcdFx0Y3NzcC5fdHJhbnNmb3JtVHlwZSA9ICghKG0xLnN2ZyAmJiBfdXNlU1ZHVHJhbnNmb3JtQXR0cikgJiYgKGhhczNEIHx8IHRoaXMuX3RyYW5zZm9ybVR5cGUgPT09IDMpKSA/IDMgOiAyOyAvL3F1aWNrZXIgdGhhbiBjYWxsaW5nIGNzc3AuX2VuYWJsZVRyYW5zZm9ybXMoKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBwdDtcblx0XHR9LCBwcmVmaXg6dHJ1ZX0pO1xuXG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwiYm94U2hhZG93XCIsIHtkZWZhdWx0VmFsdWU6XCIwcHggMHB4IDBweCAwcHggIzk5OVwiLCBwcmVmaXg6dHJ1ZSwgY29sb3I6dHJ1ZSwgbXVsdGk6dHJ1ZSwga2V5d29yZDpcImluc2V0XCJ9KTtcblxuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImJvcmRlclJhZGl1c1wiLCB7ZGVmYXVsdFZhbHVlOlwiMHB4XCIsIHBhcnNlcjpmdW5jdGlvbih0LCBlLCBwLCBjc3NwLCBwdCwgcGx1Z2luKSB7XG5cdFx0XHRlID0gdGhpcy5mb3JtYXQoZSk7XG5cdFx0XHR2YXIgcHJvcHMgPSBbXCJib3JkZXJUb3BMZWZ0UmFkaXVzXCIsXCJib3JkZXJUb3BSaWdodFJhZGl1c1wiLFwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXNcIixcImJvcmRlckJvdHRvbUxlZnRSYWRpdXNcIl0sXG5cdFx0XHRcdHN0eWxlID0gdC5zdHlsZSxcblx0XHRcdFx0ZWExLCBpLCBlczIsIGJzMiwgYnMsIGVzLCBibiwgZW4sIHcsIGgsIGVzZngsIGJzZngsIHJlbCwgaG4sIHZuLCBlbTtcblx0XHRcdHcgPSBwYXJzZUZsb2F0KHQub2Zmc2V0V2lkdGgpO1xuXHRcdFx0aCA9IHBhcnNlRmxvYXQodC5vZmZzZXRIZWlnaHQpO1xuXHRcdFx0ZWExID0gZS5zcGxpdChcIiBcIik7XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgLy9pZiB3ZSdyZSBkZWFsaW5nIHdpdGggcGVyY2VudGFnZXMsIHdlIG11c3QgY29udmVydCB0aGluZ3Mgc2VwYXJhdGVseSBmb3IgdGhlIGhvcml6b250YWwgYW5kIHZlcnRpY2FsIGF4aXMhXG5cdFx0XHRcdGlmICh0aGlzLnAuaW5kZXhPZihcImJvcmRlclwiKSkgeyAvL29sZGVyIGJyb3dzZXJzIHVzZWQgYSBwcmVmaXhcblx0XHRcdFx0XHRwcm9wc1tpXSA9IF9jaGVja1Byb3BQcmVmaXgocHJvcHNbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJzID0gYnMyID0gX2dldFN0eWxlKHQsIHByb3BzW2ldLCBfY3MsIGZhbHNlLCBcIjBweFwiKTtcblx0XHRcdFx0aWYgKGJzLmluZGV4T2YoXCIgXCIpICE9PSAtMSkge1xuXHRcdFx0XHRcdGJzMiA9IGJzLnNwbGl0KFwiIFwiKTtcblx0XHRcdFx0XHRicyA9IGJzMlswXTtcblx0XHRcdFx0XHRiczIgPSBiczJbMV07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZXMgPSBlczIgPSBlYTFbaV07XG5cdFx0XHRcdGJuID0gcGFyc2VGbG9hdChicyk7XG5cdFx0XHRcdGJzZnggPSBicy5zdWJzdHIoKGJuICsgXCJcIikubGVuZ3RoKTtcblx0XHRcdFx0cmVsID0gKGVzLmNoYXJBdCgxKSA9PT0gXCI9XCIpO1xuXHRcdFx0XHRpZiAocmVsKSB7XG5cdFx0XHRcdFx0ZW4gPSBwYXJzZUludChlcy5jaGFyQXQoMCkrXCIxXCIsIDEwKTtcblx0XHRcdFx0XHRlcyA9IGVzLnN1YnN0cigyKTtcblx0XHRcdFx0XHRlbiAqPSBwYXJzZUZsb2F0KGVzKTtcblx0XHRcdFx0XHRlc2Z4ID0gZXMuc3Vic3RyKChlbiArIFwiXCIpLmxlbmd0aCAtIChlbiA8IDAgPyAxIDogMCkpIHx8IFwiXCI7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZW4gPSBwYXJzZUZsb2F0KGVzKTtcblx0XHRcdFx0XHRlc2Z4ID0gZXMuc3Vic3RyKChlbiArIFwiXCIpLmxlbmd0aCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGVzZnggPT09IFwiXCIpIHtcblx0XHRcdFx0XHRlc2Z4ID0gX3N1ZmZpeE1hcFtwXSB8fCBic2Z4O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChlc2Z4ICE9PSBic2Z4KSB7XG5cdFx0XHRcdFx0aG4gPSBfY29udmVydFRvUGl4ZWxzKHQsIFwiYm9yZGVyTGVmdFwiLCBibiwgYnNmeCk7IC8vaG9yaXpvbnRhbCBudW1iZXIgKHdlIHVzZSBhIGJvZ3VzIFwiYm9yZGVyTGVmdFwiIHByb3BlcnR5IGp1c3QgYmVjYXVzZSB0aGUgX2NvbnZlcnRUb1BpeGVscygpIG1ldGhvZCBzZWFyY2hlcyBmb3IgdGhlIGtleXdvcmRzIFwiTGVmdFwiLCBcIlJpZ2h0XCIsIFwiVG9wXCIsIGFuZCBcIkJvdHRvbVwiIHRvIGRldGVybWluZSBvZiBpdCdzIGEgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCBwcm9wZXJ0eSwgYW5kIHdlIG5lZWQgXCJib3JkZXJcIiBpbiB0aGUgbmFtZSBzbyB0aGF0IGl0IGtub3dzIGl0IHNob3VsZCBtZWFzdXJlIHJlbGF0aXZlIHRvIHRoZSBlbGVtZW50IGl0c2VsZiwgbm90IGl0cyBwYXJlbnQuXG5cdFx0XHRcdFx0dm4gPSBfY29udmVydFRvUGl4ZWxzKHQsIFwiYm9yZGVyVG9wXCIsIGJuLCBic2Z4KTsgLy92ZXJ0aWNhbCBudW1iZXJcblx0XHRcdFx0XHRpZiAoZXNmeCA9PT0gXCIlXCIpIHtcblx0XHRcdFx0XHRcdGJzID0gKGhuIC8gdyAqIDEwMCkgKyBcIiVcIjtcblx0XHRcdFx0XHRcdGJzMiA9ICh2biAvIGggKiAxMDApICsgXCIlXCI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChlc2Z4ID09PSBcImVtXCIpIHtcblx0XHRcdFx0XHRcdGVtID0gX2NvbnZlcnRUb1BpeGVscyh0LCBcImJvcmRlckxlZnRcIiwgMSwgXCJlbVwiKTtcblx0XHRcdFx0XHRcdGJzID0gKGhuIC8gZW0pICsgXCJlbVwiO1xuXHRcdFx0XHRcdFx0YnMyID0gKHZuIC8gZW0pICsgXCJlbVwiO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRicyA9IGhuICsgXCJweFwiO1xuXHRcdFx0XHRcdFx0YnMyID0gdm4gKyBcInB4XCI7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChyZWwpIHtcblx0XHRcdFx0XHRcdGVzID0gKHBhcnNlRmxvYXQoYnMpICsgZW4pICsgZXNmeDtcblx0XHRcdFx0XHRcdGVzMiA9IChwYXJzZUZsb2F0KGJzMikgKyBlbikgKyBlc2Z4O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRwdCA9IF9wYXJzZUNvbXBsZXgoc3R5bGUsIHByb3BzW2ldLCBicyArIFwiIFwiICsgYnMyLCBlcyArIFwiIFwiICsgZXMyLCBmYWxzZSwgXCIwcHhcIiwgcHQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHB0O1xuXHRcdH0sIHByZWZpeDp0cnVlLCBmb3JtYXR0ZXI6X2dldEZvcm1hdHRlcihcIjBweCAwcHggMHB4IDBweFwiLCBmYWxzZSwgdHJ1ZSl9KTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJiYWNrZ3JvdW5kUG9zaXRpb25cIiwge2RlZmF1bHRWYWx1ZTpcIjAgMFwiLCBwYXJzZXI6ZnVuY3Rpb24odCwgZSwgcCwgY3NzcCwgcHQsIHBsdWdpbikge1xuXHRcdFx0dmFyIGJwID0gXCJiYWNrZ3JvdW5kLXBvc2l0aW9uXCIsXG5cdFx0XHRcdGNzID0gKF9jcyB8fCBfZ2V0Q29tcHV0ZWRTdHlsZSh0LCBudWxsKSksXG5cdFx0XHRcdGJzID0gdGhpcy5mb3JtYXQoICgoY3MpID8gX2llVmVycyA/IGNzLmdldFByb3BlcnR5VmFsdWUoYnAgKyBcIi14XCIpICsgXCIgXCIgKyBjcy5nZXRQcm9wZXJ0eVZhbHVlKGJwICsgXCIteVwiKSA6IGNzLmdldFByb3BlcnR5VmFsdWUoYnApIDogdC5jdXJyZW50U3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uWCArIFwiIFwiICsgdC5jdXJyZW50U3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uWSkgfHwgXCIwIDBcIiksIC8vSW50ZXJuZXQgRXhwbG9yZXIgZG9lc24ndCByZXBvcnQgYmFja2dyb3VuZC1wb3NpdGlvbiBjb3JyZWN0bHkgLSB3ZSBtdXN0IHF1ZXJ5IGJhY2tncm91bmQtcG9zaXRpb24teCBhbmQgYmFja2dyb3VuZC1wb3NpdGlvbi15IGFuZCBjb21iaW5lIHRoZW0gKGV2ZW4gaW4gSUUxMCkuIEJlZm9yZSBJRTksIHdlIG11c3QgZG8gdGhlIHNhbWUgd2l0aCB0aGUgY3VycmVudFN0eWxlIG9iamVjdCBhbmQgdXNlIGNhbWVsQ2FzZVxuXHRcdFx0XHRlcyA9IHRoaXMuZm9ybWF0KGUpLFxuXHRcdFx0XHRiYSwgZWEsIGksIHBjdCwgb3ZlcmxhcCwgc3JjO1xuXHRcdFx0aWYgKChicy5pbmRleE9mKFwiJVwiKSAhPT0gLTEpICE9PSAoZXMuaW5kZXhPZihcIiVcIikgIT09IC0xKSkge1xuXHRcdFx0XHRzcmMgPSBfZ2V0U3R5bGUodCwgXCJiYWNrZ3JvdW5kSW1hZ2VcIikucmVwbGFjZShfdXJsRXhwLCBcIlwiKTtcblx0XHRcdFx0aWYgKHNyYyAmJiBzcmMgIT09IFwibm9uZVwiKSB7XG5cdFx0XHRcdFx0YmEgPSBicy5zcGxpdChcIiBcIik7XG5cdFx0XHRcdFx0ZWEgPSBlcy5zcGxpdChcIiBcIik7XG5cdFx0XHRcdFx0X3RlbXBJbWcuc2V0QXR0cmlidXRlKFwic3JjXCIsIHNyYyk7IC8vc2V0IHRoZSB0ZW1wIElNRydzIHNyYyB0byB0aGUgYmFja2dyb3VuZC1pbWFnZSBzbyB0aGF0IHdlIGNhbiBtZWFzdXJlIGl0cyB3aWR0aC9oZWlnaHRcblx0XHRcdFx0XHRpID0gMjtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdGJzID0gYmFbaV07XG5cdFx0XHRcdFx0XHRwY3QgPSAoYnMuaW5kZXhPZihcIiVcIikgIT09IC0xKTtcblx0XHRcdFx0XHRcdGlmIChwY3QgIT09IChlYVtpXS5pbmRleE9mKFwiJVwiKSAhPT0gLTEpKSB7XG5cdFx0XHRcdFx0XHRcdG92ZXJsYXAgPSAoaSA9PT0gMCkgPyB0Lm9mZnNldFdpZHRoIC0gX3RlbXBJbWcud2lkdGggOiB0Lm9mZnNldEhlaWdodCAtIF90ZW1wSW1nLmhlaWdodDtcblx0XHRcdFx0XHRcdFx0YmFbaV0gPSBwY3QgPyAocGFyc2VGbG9hdChicykgLyAxMDAgKiBvdmVybGFwKSArIFwicHhcIiA6IChwYXJzZUZsb2F0KGJzKSAvIG92ZXJsYXAgKiAxMDApICsgXCIlXCI7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJzID0gYmEuam9pbihcIiBcIik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnBhcnNlQ29tcGxleCh0LnN0eWxlLCBicywgZXMsIHB0LCBwbHVnaW4pO1xuXHRcdH0sIGZvcm1hdHRlcjpfcGFyc2VQb3NpdGlvbn0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImJhY2tncm91bmRTaXplXCIsIHtkZWZhdWx0VmFsdWU6XCIwIDBcIiwgZm9ybWF0dGVyOl9wYXJzZVBvc2l0aW9ufSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwicGVyc3BlY3RpdmVcIiwge2RlZmF1bHRWYWx1ZTpcIjBweFwiLCBwcmVmaXg6dHJ1ZX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcInBlcnNwZWN0aXZlT3JpZ2luXCIsIHtkZWZhdWx0VmFsdWU6XCI1MCUgNTAlXCIsIHByZWZpeDp0cnVlfSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwidHJhbnNmb3JtU3R5bGVcIiwge3ByZWZpeDp0cnVlfSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwiYmFja2ZhY2VWaXNpYmlsaXR5XCIsIHtwcmVmaXg6dHJ1ZX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcInVzZXJTZWxlY3RcIiwge3ByZWZpeDp0cnVlfSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwibWFyZ2luXCIsIHtwYXJzZXI6X2dldEVkZ2VQYXJzZXIoXCJtYXJnaW5Ub3AsbWFyZ2luUmlnaHQsbWFyZ2luQm90dG9tLG1hcmdpbkxlZnRcIil9KTtcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJwYWRkaW5nXCIsIHtwYXJzZXI6X2dldEVkZ2VQYXJzZXIoXCJwYWRkaW5nVG9wLHBhZGRpbmdSaWdodCxwYWRkaW5nQm90dG9tLHBhZGRpbmdMZWZ0XCIpfSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwiY2xpcFwiLCB7ZGVmYXVsdFZhbHVlOlwicmVjdCgwcHgsMHB4LDBweCwwcHgpXCIsIHBhcnNlcjpmdW5jdGlvbih0LCBlLCBwLCBjc3NwLCBwdCwgcGx1Z2luKXtcblx0XHRcdHZhciBiLCBjcywgZGVsaW07XG5cdFx0XHRpZiAoX2llVmVycyA8IDkpIHsgLy9JRTggYW5kIGVhcmxpZXIgZG9uJ3QgcmVwb3J0IGEgXCJjbGlwXCIgdmFsdWUgaW4gdGhlIGN1cnJlbnRTdHlsZSAtIGluc3RlYWQsIHRoZSB2YWx1ZXMgYXJlIHNwbGl0IGFwYXJ0IGludG8gY2xpcFRvcCwgY2xpcFJpZ2h0LCBjbGlwQm90dG9tLCBhbmQgY2xpcExlZnQuIEFsc28sIGluIElFNyBhbmQgZWFybGllciwgdGhlIHZhbHVlcyBpbnNpZGUgcmVjdCgpIGFyZSBzcGFjZS1kZWxpbWl0ZWQsIG5vdCBjb21tYS1kZWxpbWl0ZWQuXG5cdFx0XHRcdGNzID0gdC5jdXJyZW50U3R5bGU7XG5cdFx0XHRcdGRlbGltID0gX2llVmVycyA8IDggPyBcIiBcIiA6IFwiLFwiO1xuXHRcdFx0XHRiID0gXCJyZWN0KFwiICsgY3MuY2xpcFRvcCArIGRlbGltICsgY3MuY2xpcFJpZ2h0ICsgZGVsaW0gKyBjcy5jbGlwQm90dG9tICsgZGVsaW0gKyBjcy5jbGlwTGVmdCArIFwiKVwiO1xuXHRcdFx0XHRlID0gdGhpcy5mb3JtYXQoZSkuc3BsaXQoXCIsXCIpLmpvaW4oZGVsaW0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YiA9IHRoaXMuZm9ybWF0KF9nZXRTdHlsZSh0LCB0aGlzLnAsIF9jcywgZmFsc2UsIHRoaXMuZGZsdCkpO1xuXHRcdFx0XHRlID0gdGhpcy5mb3JtYXQoZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZUNvbXBsZXgodC5zdHlsZSwgYiwgZSwgcHQsIHBsdWdpbik7XG5cdFx0fX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcInRleHRTaGFkb3dcIiwge2RlZmF1bHRWYWx1ZTpcIjBweCAwcHggMHB4ICM5OTlcIiwgY29sb3I6dHJ1ZSwgbXVsdGk6dHJ1ZX0pO1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImF1dG9Sb3VuZCxzdHJpY3RVbml0c1wiLCB7cGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0KSB7cmV0dXJuIHB0O319KTsgLy9qdXN0IHNvIHRoYXQgd2UgY2FuIGlnbm9yZSB0aGVzZSBwcm9wZXJ0aWVzIChub3QgdHdlZW4gdGhlbSlcblx0XHRfcmVnaXN0ZXJDb21wbGV4U3BlY2lhbFByb3AoXCJib3JkZXJcIiwge2RlZmF1bHRWYWx1ZTpcIjBweCBzb2xpZCAjMDAwXCIsIHBhcnNlcjpmdW5jdGlvbih0LCBlLCBwLCBjc3NwLCBwdCwgcGx1Z2luKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnBhcnNlQ29tcGxleCh0LnN0eWxlLCB0aGlzLmZvcm1hdChfZ2V0U3R5bGUodCwgXCJib3JkZXJUb3BXaWR0aFwiLCBfY3MsIGZhbHNlLCBcIjBweFwiKSArIFwiIFwiICsgX2dldFN0eWxlKHQsIFwiYm9yZGVyVG9wU3R5bGVcIiwgX2NzLCBmYWxzZSwgXCJzb2xpZFwiKSArIFwiIFwiICsgX2dldFN0eWxlKHQsIFwiYm9yZGVyVG9wQ29sb3JcIiwgX2NzLCBmYWxzZSwgXCIjMDAwXCIpKSwgdGhpcy5mb3JtYXQoZSksIHB0LCBwbHVnaW4pO1xuXHRcdFx0fSwgY29sb3I6dHJ1ZSwgZm9ybWF0dGVyOmZ1bmN0aW9uKHYpIHtcblx0XHRcdFx0dmFyIGEgPSB2LnNwbGl0KFwiIFwiKTtcblx0XHRcdFx0cmV0dXJuIGFbMF0gKyBcIiBcIiArIChhWzFdIHx8IFwic29saWRcIikgKyBcIiBcIiArICh2Lm1hdGNoKF9jb2xvckV4cCkgfHwgW1wiIzAwMFwiXSlbMF07XG5cdFx0XHR9fSk7XG5cdFx0X3JlZ2lzdGVyQ29tcGxleFNwZWNpYWxQcm9wKFwiYm9yZGVyV2lkdGhcIiwge3BhcnNlcjpfZ2V0RWRnZVBhcnNlcihcImJvcmRlclRvcFdpZHRoLGJvcmRlclJpZ2h0V2lkdGgsYm9yZGVyQm90dG9tV2lkdGgsYm9yZGVyTGVmdFdpZHRoXCIpfSk7IC8vRmlyZWZveCBkb2Vzbid0IHBpY2sgdXAgb24gYm9yZGVyV2lkdGggc2V0IGluIHN0eWxlIHNoZWV0cyAob25seSBpbmxpbmUpLlxuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImZsb2F0LGNzc0Zsb2F0LHN0eWxlRmxvYXRcIiwge3BhcnNlcjpmdW5jdGlvbih0LCBlLCBwLCBjc3NwLCBwdCwgcGx1Z2luKSB7XG5cdFx0XHR2YXIgcyA9IHQuc3R5bGUsXG5cdFx0XHRcdHByb3AgPSAoXCJjc3NGbG9hdFwiIGluIHMpID8gXCJjc3NGbG9hdFwiIDogXCJzdHlsZUZsb2F0XCI7XG5cdFx0XHRyZXR1cm4gbmV3IENTU1Byb3BUd2VlbihzLCBwcm9wLCAwLCAwLCBwdCwgLTEsIHAsIGZhbHNlLCAwLCBzW3Byb3BdLCBlKTtcblx0XHR9fSk7XG5cblx0XHQvL29wYWNpdHktcmVsYXRlZFxuXHRcdHZhciBfc2V0SUVPcGFjaXR5UmF0aW8gPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdHZhciB0ID0gdGhpcy50LCAvL3JlZmVycyB0byB0aGUgZWxlbWVudCdzIHN0eWxlIHByb3BlcnR5XG5cdFx0XHRcdFx0ZmlsdGVycyA9IHQuZmlsdGVyIHx8IF9nZXRTdHlsZSh0aGlzLmRhdGEsIFwiZmlsdGVyXCIpIHx8IFwiXCIsXG5cdFx0XHRcdFx0dmFsID0gKHRoaXMucyArIHRoaXMuYyAqIHYpIHwgMCxcblx0XHRcdFx0XHRza2lwO1xuXHRcdFx0XHRpZiAodmFsID09PSAxMDApIHsgLy9mb3Igb2xkZXIgdmVyc2lvbnMgb2YgSUUgdGhhdCBuZWVkIHRvIHVzZSBhIGZpbHRlciB0byBhcHBseSBvcGFjaXR5LCB3ZSBzaG91bGQgcmVtb3ZlIHRoZSBmaWx0ZXIgaWYgb3BhY2l0eSBoaXRzIDEgaW4gb3JkZXIgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZSwgYnV0IG1ha2Ugc3VyZSB0aGVyZSBpc24ndCBhIHRyYW5zZm9ybSAobWF0cml4KSBvciBncmFkaWVudCBpbiB0aGUgZmlsdGVycy5cblx0XHRcdFx0XHRpZiAoZmlsdGVycy5pbmRleE9mKFwiYXRyaXgoXCIpID09PSAtMSAmJiBmaWx0ZXJzLmluZGV4T2YoXCJyYWRpZW50KFwiKSA9PT0gLTEgJiYgZmlsdGVycy5pbmRleE9mKFwib2FkZXIoXCIpID09PSAtMSkge1xuXHRcdFx0XHRcdFx0dC5yZW1vdmVBdHRyaWJ1dGUoXCJmaWx0ZXJcIik7XG5cdFx0XHRcdFx0XHRza2lwID0gKCFfZ2V0U3R5bGUodGhpcy5kYXRhLCBcImZpbHRlclwiKSk7IC8vaWYgYSBjbGFzcyBpcyBhcHBsaWVkIHRoYXQgaGFzIGFuIGFscGhhIGZpbHRlciwgaXQgd2lsbCB0YWtlIGVmZmVjdCAod2UgZG9uJ3Qgd2FudCB0aGF0KSwgc28gcmUtYXBwbHkgb3VyIGFscGhhIGZpbHRlciBpbiB0aGF0IGNhc2UuIFdlIG11c3QgZmlyc3QgcmVtb3ZlIGl0IGFuZCB0aGVuIGNoZWNrLlxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0LmZpbHRlciA9IGZpbHRlcnMucmVwbGFjZShfYWxwaGFGaWx0ZXJFeHAsIFwiXCIpO1xuXHRcdFx0XHRcdFx0c2tpcCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghc2tpcCkge1xuXHRcdFx0XHRcdGlmICh0aGlzLnhuMSkge1xuXHRcdFx0XHRcdFx0dC5maWx0ZXIgPSBmaWx0ZXJzID0gZmlsdGVycyB8fCAoXCJhbHBoYShvcGFjaXR5PVwiICsgdmFsICsgXCIpXCIpOyAvL3dvcmtzIGFyb3VuZCBidWcgaW4gSUU3LzggdGhhdCBwcmV2ZW50cyBjaGFuZ2VzIHRvIFwidmlzaWJpbGl0eVwiIGZyb20gYmVpbmcgYXBwbGllZCBwcm9wZXJseSBpZiB0aGUgZmlsdGVyIGlzIGNoYW5nZWQgdG8gYSBkaWZmZXJlbnQgYWxwaGEgb24gdGhlIHNhbWUgZnJhbWUuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChmaWx0ZXJzLmluZGV4T2YoXCJwYWNpdHlcIikgPT09IC0xKSB7IC8vb25seSB1c2VkIGlmIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IHRoZSBzdGFuZGFyZCBvcGFjaXR5IHN0eWxlIHByb3BlcnR5IChJRSA3IGFuZCA4KS4gV2Ugb21pdCB0aGUgXCJPXCIgdG8gYXZvaWQgY2FzZS1zZW5zaXRpdml0eSBpc3N1ZXNcblx0XHRcdFx0XHRcdGlmICh2YWwgIT09IDAgfHwgIXRoaXMueG4xKSB7IC8vYnVncyBpbiBJRTcvOCB3b24ndCByZW5kZXIgdGhlIGZpbHRlciBwcm9wZXJseSBpZiBvcGFjaXR5IGlzIEFEREVEIG9uIHRoZSBzYW1lIGZyYW1lL3JlbmRlciBhcyBcInZpc2liaWxpdHlcIiBjaGFuZ2VzICh0aGlzLnhuMSBpcyAxIGlmIHRoaXMgdHdlZW4gaXMgYW4gXCJhdXRvQWxwaGFcIiB0d2Vlbilcblx0XHRcdFx0XHRcdFx0dC5maWx0ZXIgPSBmaWx0ZXJzICsgXCIgYWxwaGEob3BhY2l0eT1cIiArIHZhbCArIFwiKVwiOyAvL3dlIHJvdW5kIHRoZSB2YWx1ZSBiZWNhdXNlIG90aGVyd2lzZSwgYnVncyBpbiBJRTcvOCBjYW4gcHJldmVudCBcInZpc2liaWxpdHlcIiBjaGFuZ2VzIGZyb20gYmVpbmcgYXBwbGllZCBwcm9wZXJseS5cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dC5maWx0ZXIgPSBmaWx0ZXJzLnJlcGxhY2UoX29wYWNpdHlFeHAsIFwib3BhY2l0eT1cIiArIHZhbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcIm9wYWNpdHksYWxwaGEsYXV0b0FscGhhXCIsIHtkZWZhdWx0VmFsdWU6XCIxXCIsIHBhcnNlcjpmdW5jdGlvbih0LCBlLCBwLCBjc3NwLCBwdCwgcGx1Z2luKSB7XG5cdFx0XHR2YXIgYiA9IHBhcnNlRmxvYXQoX2dldFN0eWxlKHQsIFwib3BhY2l0eVwiLCBfY3MsIGZhbHNlLCBcIjFcIikpLFxuXHRcdFx0XHRzdHlsZSA9IHQuc3R5bGUsXG5cdFx0XHRcdGlzQXV0b0FscGhhID0gKHAgPT09IFwiYXV0b0FscGhhXCIpO1xuXHRcdFx0aWYgKHR5cGVvZihlKSA9PT0gXCJzdHJpbmdcIiAmJiBlLmNoYXJBdCgxKSA9PT0gXCI9XCIpIHtcblx0XHRcdFx0ZSA9ICgoZS5jaGFyQXQoMCkgPT09IFwiLVwiKSA/IC0xIDogMSkgKiBwYXJzZUZsb2F0KGUuc3Vic3RyKDIpKSArIGI7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaXNBdXRvQWxwaGEgJiYgYiA9PT0gMSAmJiBfZ2V0U3R5bGUodCwgXCJ2aXNpYmlsaXR5XCIsIF9jcykgPT09IFwiaGlkZGVuXCIgJiYgZSAhPT0gMCkgeyAvL2lmIHZpc2liaWxpdHkgaXMgaW5pdGlhbGx5IHNldCB0byBcImhpZGRlblwiLCB3ZSBzaG91bGQgaW50ZXJwcmV0IHRoYXQgYXMgaW50ZW50IHRvIG1ha2Ugb3BhY2l0eSAwIChhIGNvbnZlbmllbmNlKVxuXHRcdFx0XHRiID0gMDtcblx0XHRcdH1cblx0XHRcdGlmIChfc3VwcG9ydHNPcGFjaXR5KSB7XG5cdFx0XHRcdHB0ID0gbmV3IENTU1Byb3BUd2VlbihzdHlsZSwgXCJvcGFjaXR5XCIsIGIsIGUgLSBiLCBwdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4oc3R5bGUsIFwib3BhY2l0eVwiLCBiICogMTAwLCAoZSAtIGIpICogMTAwLCBwdCk7XG5cdFx0XHRcdHB0LnhuMSA9IGlzQXV0b0FscGhhID8gMSA6IDA7IC8vd2UgbmVlZCB0byByZWNvcmQgd2hldGhlciBvciBub3QgdGhpcyBpcyBhbiBhdXRvQWxwaGEgc28gdGhhdCBpbiB0aGUgc2V0UmF0aW8oKSwgd2Uga25vdyB0byBkdXBsaWNhdGUgdGhlIHNldHRpbmcgb2YgdGhlIGFscGhhIGluIG9yZGVyIHRvIHdvcmsgYXJvdW5kIGEgYnVnIGluIElFNyBhbmQgSUU4IHRoYXQgcHJldmVudHMgY2hhbmdlcyB0byBcInZpc2liaWxpdHlcIiBmcm9tIHRha2luZyBlZmZlY3QgaWYgdGhlIGZpbHRlciBpcyBjaGFuZ2VkIHRvIGEgZGlmZmVyZW50IGFscGhhKG9wYWNpdHkpIGF0IHRoZSBzYW1lIHRpbWUuIFNldHRpbmcgaXQgdG8gdGhlIFNBTUUgdmFsdWUgZmlyc3QsIHRoZW4gdGhlIG5ldyB2YWx1ZSB3b3JrcyBhcm91bmQgdGhlIElFNy84IGJ1Zy5cblx0XHRcdFx0c3R5bGUuem9vbSA9IDE7IC8vaGVscHMgY29ycmVjdCBhbiBJRSBpc3N1ZS5cblx0XHRcdFx0cHQudHlwZSA9IDI7XG5cdFx0XHRcdHB0LmIgPSBcImFscGhhKG9wYWNpdHk9XCIgKyBwdC5zICsgXCIpXCI7XG5cdFx0XHRcdHB0LmUgPSBcImFscGhhKG9wYWNpdHk9XCIgKyAocHQucyArIHB0LmMpICsgXCIpXCI7XG5cdFx0XHRcdHB0LmRhdGEgPSB0O1xuXHRcdFx0XHRwdC5wbHVnaW4gPSBwbHVnaW47XG5cdFx0XHRcdHB0LnNldFJhdGlvID0gX3NldElFT3BhY2l0eVJhdGlvO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGlzQXV0b0FscGhhKSB7IC8vd2UgaGF2ZSB0byBjcmVhdGUgdGhlIFwidmlzaWJpbGl0eVwiIFByb3BUd2VlbiBhZnRlciB0aGUgb3BhY2l0eSBvbmUgaW4gdGhlIGxpbmtlZCBsaXN0IHNvIHRoYXQgdGhleSBydW4gaW4gdGhlIG9yZGVyIHRoYXQgd29ya3MgcHJvcGVybHkgaW4gSUU4IGFuZCBlYXJsaWVyXG5cdFx0XHRcdHB0ID0gbmV3IENTU1Byb3BUd2VlbihzdHlsZSwgXCJ2aXNpYmlsaXR5XCIsIDAsIDAsIHB0LCAtMSwgbnVsbCwgZmFsc2UsIDAsICgoYiAhPT0gMCkgPyBcImluaGVyaXRcIiA6IFwiaGlkZGVuXCIpLCAoKGUgPT09IDApID8gXCJoaWRkZW5cIiA6IFwiaW5oZXJpdFwiKSk7XG5cdFx0XHRcdHB0LnhzMCA9IFwiaW5oZXJpdFwiO1xuXHRcdFx0XHRjc3NwLl9vdmVyd3JpdGVQcm9wcy5wdXNoKHB0Lm4pO1xuXHRcdFx0XHRjc3NwLl9vdmVyd3JpdGVQcm9wcy5wdXNoKHApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHB0O1xuXHRcdH19KTtcblxuXG5cdFx0dmFyIF9yZW1vdmVQcm9wID0gZnVuY3Rpb24ocywgcCkge1xuXHRcdFx0XHRpZiAocCkge1xuXHRcdFx0XHRcdGlmIChzLnJlbW92ZVByb3BlcnR5KSB7XG5cdFx0XHRcdFx0XHRpZiAocC5zdWJzdHIoMCwyKSA9PT0gXCJtc1wiIHx8IHAuc3Vic3RyKDAsNikgPT09IFwid2Via2l0XCIpIHsgLy9NaWNyb3NvZnQgYW5kIHNvbWUgV2Via2l0IGJyb3dzZXJzIGRvbid0IGNvbmZvcm0gdG8gdGhlIHN0YW5kYXJkIG9mIGNhcGl0YWxpemluZyB0aGUgZmlyc3QgcHJlZml4IGNoYXJhY3Rlciwgc28gd2UgYWRqdXN0IHNvIHRoYXQgd2hlbiB3ZSBwcmVmaXggdGhlIGNhcHMgd2l0aCBhIGRhc2gsIGl0J3MgY29ycmVjdCAob3RoZXJ3aXNlIGl0J2QgYmUgXCJtcy10cmFuc2Zvcm1cIiBpbnN0ZWFkIG9mIFwiLW1zLXRyYW5zZm9ybVwiIGZvciBJRTksIGZvciBleGFtcGxlKVxuXHRcdFx0XHRcdFx0XHRwID0gXCItXCIgKyBwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cy5yZW1vdmVQcm9wZXJ0eShwLnJlcGxhY2UoX2NhcHNFeHAsIFwiLSQxXCIpLnRvTG93ZXJDYXNlKCkpO1xuXHRcdFx0XHRcdH0gZWxzZSB7IC8vbm90ZTogb2xkIHZlcnNpb25zIG9mIElFIHVzZSBcInJlbW92ZUF0dHJpYnV0ZSgpXCIgaW5zdGVhZCBvZiBcInJlbW92ZVByb3BlcnR5KClcIlxuXHRcdFx0XHRcdFx0cy5yZW1vdmVBdHRyaWJ1dGUocCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0X3NldENsYXNzTmFtZVJhdGlvID0gZnVuY3Rpb24odikge1xuXHRcdFx0XHR0aGlzLnQuX2dzQ2xhc3NQVCA9IHRoaXM7XG5cdFx0XHRcdGlmICh2ID09PSAxIHx8IHYgPT09IDApIHtcblx0XHRcdFx0XHR0aGlzLnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgKHYgPT09IDApID8gdGhpcy5iIDogdGhpcy5lKTtcblx0XHRcdFx0XHR2YXIgbXB0ID0gdGhpcy5kYXRhLCAvL2ZpcnN0IE1pbmlQcm9wVHdlZW5cblx0XHRcdFx0XHRcdHMgPSB0aGlzLnQuc3R5bGU7XG5cdFx0XHRcdFx0d2hpbGUgKG1wdCkge1xuXHRcdFx0XHRcdFx0aWYgKCFtcHQudikge1xuXHRcdFx0XHRcdFx0XHRfcmVtb3ZlUHJvcChzLCBtcHQucCk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRzW21wdC5wXSA9IG1wdC52O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0bXB0ID0gbXB0Ll9uZXh0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodiA9PT0gMSAmJiB0aGlzLnQuX2dzQ2xhc3NQVCA9PT0gdGhpcykge1xuXHRcdFx0XHRcdFx0dGhpcy50Ll9nc0NsYXNzUFQgPSBudWxsO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLnQuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikgIT09IHRoaXMuZSkge1xuXHRcdFx0XHRcdHRoaXMudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCB0aGlzLmUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImNsYXNzTmFtZVwiLCB7cGFyc2VyOmZ1bmN0aW9uKHQsIGUsIHAsIGNzc3AsIHB0LCBwbHVnaW4sIHZhcnMpIHtcblx0XHRcdHZhciBiID0gdC5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiLCAvL2Rvbid0IHVzZSB0LmNsYXNzTmFtZSBiZWNhdXNlIGl0IGRvZXNuJ3Qgd29yayBjb25zaXN0ZW50bHkgb24gU1ZHIGVsZW1lbnRzOyBnZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSBhbmQgc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdmFsdWVcIikgaXMgbW9yZSByZWxpYWJsZS5cblx0XHRcdFx0Y3NzVGV4dCA9IHQuc3R5bGUuY3NzVGV4dCxcblx0XHRcdFx0ZGlmRGF0YSwgYnMsIGNucHQsIGNucHRMb29rdXAsIG1wdDtcblx0XHRcdHB0ID0gY3NzcC5fY2xhc3NOYW1lUFQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHQsIHAsIDAsIDAsIHB0LCAyKTtcblx0XHRcdHB0LnNldFJhdGlvID0gX3NldENsYXNzTmFtZVJhdGlvO1xuXHRcdFx0cHQucHIgPSAtMTE7XG5cdFx0XHRfaGFzUHJpb3JpdHkgPSB0cnVlO1xuXHRcdFx0cHQuYiA9IGI7XG5cdFx0XHRicyA9IF9nZXRBbGxTdHlsZXModCwgX2NzKTtcblx0XHRcdC8vaWYgdGhlcmUncyBhIGNsYXNzTmFtZSB0d2VlbiBhbHJlYWR5IG9wZXJhdGluZyBvbiB0aGUgdGFyZ2V0LCBmb3JjZSBpdCB0byBpdHMgZW5kIHNvIHRoYXQgdGhlIG5lY2Vzc2FyeSBpbmxpbmUgc3R5bGVzIGFyZSByZW1vdmVkIGFuZCB0aGUgY2xhc3MgbmFtZSBpcyBhcHBsaWVkIGJlZm9yZSB3ZSBkZXRlcm1pbmUgdGhlIGVuZCBzdGF0ZSAod2UgZG9uJ3Qgd2FudCBpbmxpbmUgc3R5bGVzIGludGVyZmVyaW5nIHRoYXQgd2VyZSB0aGVyZSBqdXN0IGZvciBjbGFzcy1zcGVjaWZpYyB2YWx1ZXMpXG5cdFx0XHRjbnB0ID0gdC5fZ3NDbGFzc1BUO1xuXHRcdFx0aWYgKGNucHQpIHtcblx0XHRcdFx0Y25wdExvb2t1cCA9IHt9O1xuXHRcdFx0XHRtcHQgPSBjbnB0LmRhdGE7IC8vZmlyc3QgTWluaVByb3BUd2VlbiB3aGljaCBzdG9yZXMgdGhlIGlubGluZSBzdHlsZXMgLSB3ZSBuZWVkIHRvIGZvcmNlIHRoZXNlIHNvIHRoYXQgdGhlIGlubGluZSBzdHlsZXMgZG9uJ3QgY29udGFtaW5hdGUgdGhpbmdzLiBPdGhlcndpc2UsIHRoZXJlJ3MgYSBzbWFsbCBjaGFuY2UgdGhhdCBhIHR3ZWVuIGNvdWxkIHN0YXJ0IGFuZCB0aGUgaW5saW5lIHZhbHVlcyBtYXRjaCB0aGUgZGVzdGluYXRpb24gdmFsdWVzIGFuZCB0aGV5IG5ldmVyIGdldCBjbGVhbmVkLlxuXHRcdFx0XHR3aGlsZSAobXB0KSB7XG5cdFx0XHRcdFx0Y25wdExvb2t1cFttcHQucF0gPSAxO1xuXHRcdFx0XHRcdG1wdCA9IG1wdC5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0XHRjbnB0LnNldFJhdGlvKDEpO1xuXHRcdFx0fVxuXHRcdFx0dC5fZ3NDbGFzc1BUID0gcHQ7XG5cdFx0XHRwdC5lID0gKGUuY2hhckF0KDEpICE9PSBcIj1cIikgPyBlIDogYi5yZXBsYWNlKG5ldyBSZWdFeHAoXCJcXFxccypcXFxcYlwiICsgZS5zdWJzdHIoMikgKyBcIlxcXFxiXCIpLCBcIlwiKSArICgoZS5jaGFyQXQoMCkgPT09IFwiK1wiKSA/IFwiIFwiICsgZS5zdWJzdHIoMikgOiBcIlwiKTtcblx0XHRcdHQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgcHQuZSk7XG5cdFx0XHRkaWZEYXRhID0gX2Nzc0RpZih0LCBicywgX2dldEFsbFN0eWxlcyh0KSwgdmFycywgY25wdExvb2t1cCk7XG5cdFx0XHR0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGIpO1xuXHRcdFx0cHQuZGF0YSA9IGRpZkRhdGEuZmlyc3RNUFQ7XG5cdFx0XHR0LnN0eWxlLmNzc1RleHQgPSBjc3NUZXh0OyAvL3dlIHJlY29yZGVkIGNzc1RleHQgYmVmb3JlIHdlIHN3YXBwZWQgY2xhc3NlcyBhbmQgcmFuIF9nZXRBbGxTdHlsZXMoKSBiZWNhdXNlIGluIGNhc2VzIHdoZW4gYSBjbGFzc05hbWUgdHdlZW4gaXMgb3ZlcndyaXR0ZW4sIHdlIHJlbW92ZSBhbGwgdGhlIHJlbGF0ZWQgdHdlZW5pbmcgcHJvcGVydGllcyBmcm9tIHRoYXQgY2xhc3MgY2hhbmdlIChvdGhlcndpc2UgY2xhc3Mtc3BlY2lmaWMgc3R1ZmYgY2FuJ3Qgb3ZlcnJpZGUgcHJvcGVydGllcyB3ZSd2ZSBkaXJlY3RseSBzZXQgb24gdGhlIHRhcmdldCdzIHN0eWxlIG9iamVjdCBkdWUgdG8gc3BlY2lmaWNpdHkpLlxuXHRcdFx0cHQgPSBwdC54Zmlyc3QgPSBjc3NwLnBhcnNlKHQsIGRpZkRhdGEuZGlmcywgcHQsIHBsdWdpbik7IC8vd2UgcmVjb3JkIHRoZSBDU1NQcm9wVHdlZW4gYXMgdGhlIHhmaXJzdCBzbyB0aGF0IHdlIGNhbiBoYW5kbGUgb3ZlcndyaXRpbmcgcHJvcGVydGx5IChpZiBcImNsYXNzTmFtZVwiIGdldHMgb3ZlcndyaXR0ZW4sIHdlIG11c3Qga2lsbCBhbGwgdGhlIHByb3BlcnRpZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBjbGFzc05hbWUgcGFydCBvZiB0aGUgdHdlZW4sIHNvIHdlIGNhbiBsb29wIHRocm91Z2ggZnJvbSB4Zmlyc3QgdG8gdGhlIHB0IGl0c2VsZilcblx0XHRcdHJldHVybiBwdDtcblx0XHR9fSk7XG5cblxuXHRcdHZhciBfc2V0Q2xlYXJQcm9wc1JhdGlvID0gZnVuY3Rpb24odikge1xuXHRcdFx0aWYgKHYgPT09IDEgfHwgdiA9PT0gMCkgaWYgKHRoaXMuZGF0YS5fdG90YWxUaW1lID09PSB0aGlzLmRhdGEuX3RvdGFsRHVyYXRpb24gJiYgdGhpcy5kYXRhLmRhdGEgIT09IFwiaXNGcm9tU3RhcnRcIikgeyAvL3RoaXMuZGF0YSByZWZlcnMgdG8gdGhlIHR3ZWVuLiBPbmx5IGNsZWFyIGF0IHRoZSBFTkQgb2YgdGhlIHR3ZWVuIChyZW1lbWJlciwgZnJvbSgpIHR3ZWVucyBtYWtlIHRoZSByYXRpbyBnbyBmcm9tIDEgdG8gMCwgc28gd2UgY2FuJ3QganVzdCBjaGVjayB0aGF0IGFuZCBpZiB0aGUgdHdlZW4gaXMgdGhlIHplcm8tZHVyYXRpb24gb25lIHRoYXQncyBjcmVhdGVkIGludGVybmFsbHkgdG8gcmVuZGVyIHRoZSBzdGFydGluZyB2YWx1ZXMgaW4gYSBmcm9tKCkgdHdlZW4sIGlnbm9yZSB0aGF0IGJlY2F1c2Ugb3RoZXJ3aXNlLCBmb3IgZXhhbXBsZSwgZnJvbSguLi57aGVpZ2h0OjEwMCwgY2xlYXJQcm9wczpcImhlaWdodFwiLCBkZWxheToxfSkgd291bGQgd2lwZSB0aGUgaGVpZ2h0IGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIHR3ZWVuIGFuZCBhZnRlciAxIHNlY29uZCwgaXQnZCBraWNrIGJhY2sgaW4pLlxuXHRcdFx0XHR2YXIgcyA9IHRoaXMudC5zdHlsZSxcblx0XHRcdFx0XHR0cmFuc2Zvcm1QYXJzZSA9IF9zcGVjaWFsUHJvcHMudHJhbnNmb3JtLnBhcnNlLFxuXHRcdFx0XHRcdGEsIHAsIGksIGNsZWFyVHJhbnNmb3JtLCB0cmFuc2Zvcm07XG5cdFx0XHRcdGlmICh0aGlzLmUgPT09IFwiYWxsXCIpIHtcblx0XHRcdFx0XHRzLmNzc1RleHQgPSBcIlwiO1xuXHRcdFx0XHRcdGNsZWFyVHJhbnNmb3JtID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRhID0gdGhpcy5lLnNwbGl0KFwiIFwiKS5qb2luKFwiXCIpLnNwbGl0KFwiLFwiKTtcblx0XHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRwID0gYVtpXTtcblx0XHRcdFx0XHRcdGlmIChfc3BlY2lhbFByb3BzW3BdKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChfc3BlY2lhbFByb3BzW3BdLnBhcnNlID09PSB0cmFuc2Zvcm1QYXJzZSkge1xuXHRcdFx0XHRcdFx0XHRcdGNsZWFyVHJhbnNmb3JtID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRwID0gKHAgPT09IFwidHJhbnNmb3JtT3JpZ2luXCIpID8gX3RyYW5zZm9ybU9yaWdpblByb3AgOiBfc3BlY2lhbFByb3BzW3BdLnA7IC8vZW5zdXJlcyB0aGF0IHNwZWNpYWwgcHJvcGVydGllcyB1c2UgdGhlIHByb3BlciBicm93c2VyLXNwZWNpZmljIHByb3BlcnR5IG5hbWUsIGxpa2UgXCJzY2FsZVhcIiBtaWdodCBiZSBcIi13ZWJraXQtdHJhbnNmb3JtXCIgb3IgXCJib3hTaGFkb3dcIiBtaWdodCBiZSBcIi1tb3otYm94LXNoYWRvd1wiXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdF9yZW1vdmVQcm9wKHMsIHApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2xlYXJUcmFuc2Zvcm0pIHtcblx0XHRcdFx0XHRfcmVtb3ZlUHJvcChzLCBfdHJhbnNmb3JtUHJvcCk7XG5cdFx0XHRcdFx0dHJhbnNmb3JtID0gdGhpcy50Ll9nc1RyYW5zZm9ybTtcblx0XHRcdFx0XHRpZiAodHJhbnNmb3JtKSB7XG5cdFx0XHRcdFx0XHRpZiAodHJhbnNmb3JtLnN2Zykge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1zdmctb3JpZ2luXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZGVsZXRlIHRoaXMudC5fZ3NUcmFuc2Zvcm07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9O1xuXHRcdF9yZWdpc3RlckNvbXBsZXhTcGVjaWFsUHJvcChcImNsZWFyUHJvcHNcIiwge3BhcnNlcjpmdW5jdGlvbih0LCBlLCBwLCBjc3NwLCBwdCkge1xuXHRcdFx0cHQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHQsIHAsIDAsIDAsIHB0LCAyKTtcblx0XHRcdHB0LnNldFJhdGlvID0gX3NldENsZWFyUHJvcHNSYXRpbztcblx0XHRcdHB0LmUgPSBlO1xuXHRcdFx0cHQucHIgPSAtMTA7XG5cdFx0XHRwdC5kYXRhID0gY3NzcC5fdHdlZW47XG5cdFx0XHRfaGFzUHJpb3JpdHkgPSB0cnVlO1xuXHRcdFx0cmV0dXJuIHB0O1xuXHRcdH19KTtcblxuXHRcdHAgPSBcImJlemllcix0aHJvd1Byb3BzLHBoeXNpY3NQcm9wcyxwaHlzaWNzMkRcIi5zcGxpdChcIixcIik7XG5cdFx0aSA9IHAubGVuZ3RoO1xuXHRcdHdoaWxlIChpLS0pIHtcblx0XHRcdF9yZWdpc3RlclBsdWdpblByb3AocFtpXSk7XG5cdFx0fVxuXG5cblxuXG5cblxuXG5cblx0XHRwID0gQ1NTUGx1Z2luLnByb3RvdHlwZTtcblx0XHRwLl9maXJzdFBUID0gcC5fbGFzdFBhcnNlZFRyYW5zZm9ybSA9IHAuX3RyYW5zZm9ybSA9IG51bGw7XG5cblx0XHQvL2dldHMgY2FsbGVkIHdoZW4gdGhlIHR3ZWVuIHJlbmRlcnMgZm9yIHRoZSBmaXJzdCB0aW1lLiBUaGlzIGtpY2tzIGV2ZXJ5dGhpbmcgb2ZmLCByZWNvcmRpbmcgc3RhcnQvZW5kIHZhbHVlcywgZXRjLlxuXHRcdHAuX29uSW5pdFR3ZWVuID0gZnVuY3Rpb24odGFyZ2V0LCB2YXJzLCB0d2Vlbikge1xuXHRcdFx0aWYgKCF0YXJnZXQubm9kZVR5cGUpIHsgLy9jc3MgaXMgb25seSBmb3IgZG9tIGVsZW1lbnRzXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3RhcmdldCA9IHRhcmdldDtcblx0XHRcdHRoaXMuX3R3ZWVuID0gdHdlZW47XG5cdFx0XHR0aGlzLl92YXJzID0gdmFycztcblx0XHRcdF9hdXRvUm91bmQgPSB2YXJzLmF1dG9Sb3VuZDtcblx0XHRcdF9oYXNQcmlvcml0eSA9IGZhbHNlO1xuXHRcdFx0X3N1ZmZpeE1hcCA9IHZhcnMuc3VmZml4TWFwIHx8IENTU1BsdWdpbi5zdWZmaXhNYXA7XG5cdFx0XHRfY3MgPSBfZ2V0Q29tcHV0ZWRTdHlsZSh0YXJnZXQsIFwiXCIpO1xuXHRcdFx0X292ZXJ3cml0ZVByb3BzID0gdGhpcy5fb3ZlcndyaXRlUHJvcHM7XG5cdFx0XHR2YXIgc3R5bGUgPSB0YXJnZXQuc3R5bGUsXG5cdFx0XHRcdHYsIHB0LCBwdDIsIGZpcnN0LCBsYXN0LCBuZXh0LCB6SW5kZXgsIHRwdCwgdGhyZWVEO1xuXHRcdFx0aWYgKF9yZXFTYWZhcmlGaXgpIGlmIChzdHlsZS56SW5kZXggPT09IFwiXCIpIHtcblx0XHRcdFx0diA9IF9nZXRTdHlsZSh0YXJnZXQsIFwiekluZGV4XCIsIF9jcyk7XG5cdFx0XHRcdGlmICh2ID09PSBcImF1dG9cIiB8fCB2ID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0Ly9jb3JyZWN0cyBhIGJ1ZyBpbiBbbm9uLUFuZHJvaWRdIFNhZmFyaSB0aGF0IHByZXZlbnRzIGl0IGZyb20gcmVwYWludGluZyBlbGVtZW50cyBpbiB0aGVpciBuZXcgcG9zaXRpb25zIGlmIHRoZXkgZG9uJ3QgaGF2ZSBhIHpJbmRleCBzZXQuIFdlIGFsc28gY2FuJ3QganVzdCBhcHBseSB0aGlzIGluc2lkZSBfcGFyc2VUcmFuc2Zvcm0oKSBiZWNhdXNlIGFueXRoaW5nIHRoYXQncyBtb3ZlZCBpbiBhbnkgd2F5IChsaWtlIHVzaW5nIFwibGVmdFwiIG9yIFwidG9wXCIgaW5zdGVhZCBvZiB0cmFuc2Zvcm1zIGxpa2UgXCJ4XCIgYW5kIFwieVwiKSBjYW4gYmUgYWZmZWN0ZWQsIHNvIGl0IGlzIGJlc3QgdG8gZW5zdXJlIHRoYXQgYW55dGhpbmcgdGhhdCdzIHR3ZWVuaW5nIGhhcyBhIHotaW5kZXguIFNldHRpbmcgXCJXZWJraXRQZXJzcGVjdGl2ZVwiIHRvIGEgbm9uLXplcm8gdmFsdWUgd29ya2VkIHRvbyBleGNlcHQgdGhhdCBvbiBpT1MgU2FmYXJpIHRoaW5ncyB3b3VsZCBmbGlja2VyIHJhbmRvbWx5LiBQbHVzIHpJbmRleCBpcyBsZXNzIG1lbW9yeS1pbnRlbnNpdmUuXG5cdFx0XHRcdFx0dGhpcy5fYWRkTGF6eVNldChzdHlsZSwgXCJ6SW5kZXhcIiwgMCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHR5cGVvZih2YXJzKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRmaXJzdCA9IHN0eWxlLmNzc1RleHQ7XG5cdFx0XHRcdHYgPSBfZ2V0QWxsU3R5bGVzKHRhcmdldCwgX2NzKTtcblx0XHRcdFx0c3R5bGUuY3NzVGV4dCA9IGZpcnN0ICsgXCI7XCIgKyB2YXJzO1xuXHRcdFx0XHR2ID0gX2Nzc0RpZih0YXJnZXQsIHYsIF9nZXRBbGxTdHlsZXModGFyZ2V0KSkuZGlmcztcblx0XHRcdFx0aWYgKCFfc3VwcG9ydHNPcGFjaXR5ICYmIF9vcGFjaXR5VmFsRXhwLnRlc3QodmFycykpIHtcblx0XHRcdFx0XHR2Lm9wYWNpdHkgPSBwYXJzZUZsb2F0KCBSZWdFeHAuJDEgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR2YXJzID0gdjtcblx0XHRcdFx0c3R5bGUuY3NzVGV4dCA9IGZpcnN0O1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodmFycy5jbGFzc05hbWUpIHsgLy9jbGFzc05hbWUgdHdlZW5zIHdpbGwgY29tYmluZSBhbnkgZGlmZmVyZW5jZXMgdGhleSBmaW5kIGluIHRoZSBjc3Mgd2l0aCB0aGUgdmFycyB0aGF0IGFyZSBwYXNzZWQgaW4sIHNvIHtjbGFzc05hbWU6XCJteUNsYXNzXCIsIHNjYWxlOjAuNSwgbGVmdDoyMH0gd291bGQgd29yay5cblx0XHRcdFx0dGhpcy5fZmlyc3RQVCA9IHB0ID0gX3NwZWNpYWxQcm9wcy5jbGFzc05hbWUucGFyc2UodGFyZ2V0LCB2YXJzLmNsYXNzTmFtZSwgXCJjbGFzc05hbWVcIiwgdGhpcywgbnVsbCwgbnVsbCwgdmFycyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9maXJzdFBUID0gcHQgPSB0aGlzLnBhcnNlKHRhcmdldCwgdmFycywgbnVsbCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLl90cmFuc2Zvcm1UeXBlKSB7XG5cdFx0XHRcdHRocmVlRCA9ICh0aGlzLl90cmFuc2Zvcm1UeXBlID09PSAzKTtcblx0XHRcdFx0aWYgKCFfdHJhbnNmb3JtUHJvcCkge1xuXHRcdFx0XHRcdHN0eWxlLnpvb20gPSAxOyAvL2hlbHBzIGNvcnJlY3QgYW4gSUUgaXNzdWUuXG5cdFx0XHRcdH0gZWxzZSBpZiAoX2lzU2FmYXJpKSB7XG5cdFx0XHRcdFx0X3JlcVNhZmFyaUZpeCA9IHRydWU7XG5cdFx0XHRcdFx0Ly9pZiB6SW5kZXggaXNuJ3Qgc2V0LCBpT1MgU2FmYXJpIGRvZXNuJ3QgcmVwYWludCB0aGluZ3MgY29ycmVjdGx5IHNvbWV0aW1lcyAoc2VlbWluZ2x5IGF0IHJhbmRvbSkuXG5cdFx0XHRcdFx0aWYgKHN0eWxlLnpJbmRleCA9PT0gXCJcIikge1xuXHRcdFx0XHRcdFx0ekluZGV4ID0gX2dldFN0eWxlKHRhcmdldCwgXCJ6SW5kZXhcIiwgX2NzKTtcblx0XHRcdFx0XHRcdGlmICh6SW5kZXggPT09IFwiYXV0b1wiIHx8IHpJbmRleCA9PT0gXCJcIikge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9hZGRMYXp5U2V0KHN0eWxlLCBcInpJbmRleFwiLCAwKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9TZXR0aW5nIFdlYmtpdEJhY2tmYWNlVmlzaWJpbGl0eSBjb3JyZWN0cyAzIGJ1Z3M6XG5cdFx0XHRcdFx0Ly8gMSkgW25vbi1BbmRyb2lkXSBTYWZhcmkgc2tpcHMgcmVuZGVyaW5nIGNoYW5nZXMgdG8gXCJ0b3BcIiBhbmQgXCJsZWZ0XCIgdGhhdCBhcmUgbWFkZSBvbiB0aGUgc2FtZSBmcmFtZS9yZW5kZXIgYXMgYSB0cmFuc2Zvcm0gdXBkYXRlLlxuXHRcdFx0XHRcdC8vIDIpIGlPUyBTYWZhcmkgc29tZXRpbWVzIG5lZ2xlY3RzIHRvIHJlcGFpbnQgZWxlbWVudHMgaW4gdGhlaXIgbmV3IHBvc2l0aW9ucy4gU2V0dGluZyBcIldlYmtpdFBlcnNwZWN0aXZlXCIgdG8gYSBub24temVybyB2YWx1ZSB3b3JrZWQgdG9vIGV4Y2VwdCB0aGF0IG9uIGlPUyBTYWZhcmkgdGhpbmdzIHdvdWxkIGZsaWNrZXIgcmFuZG9tbHkuXG5cdFx0XHRcdFx0Ly8gMykgU2FmYXJpIHNvbWV0aW1lcyBkaXNwbGF5ZWQgb2RkIGFydGlmYWN0cyB3aGVuIHR3ZWVuaW5nIHRoZSB0cmFuc2Zvcm0gKG9yIFdlYmtpdFRyYW5zZm9ybSkgcHJvcGVydHksIGxpa2UgZ2hvc3RzIG9mIHRoZSBlZGdlcyBvZiB0aGUgZWxlbWVudCByZW1haW5lZC4gRGVmaW5pdGVseSBhIGJyb3dzZXIgYnVnLlxuXHRcdFx0XHRcdC8vTm90ZTogd2UgYWxsb3cgdGhlIHVzZXIgdG8gb3ZlcnJpZGUgdGhlIGF1dG8tc2V0dGluZyBieSBkZWZpbmluZyBXZWJraXRCYWNrZmFjZVZpc2liaWxpdHkgaW4gdGhlIHZhcnMgb2YgdGhlIHR3ZWVuLlxuXHRcdFx0XHRcdGlmIChfaXNTYWZhcmlMVDYpIHtcblx0XHRcdFx0XHRcdHRoaXMuX2FkZExhenlTZXQoc3R5bGUsIFwiV2Via2l0QmFja2ZhY2VWaXNpYmlsaXR5XCIsIHRoaXMuX3ZhcnMuV2Via2l0QmFja2ZhY2VWaXNpYmlsaXR5IHx8ICh0aHJlZUQgPyBcInZpc2libGVcIiA6IFwiaGlkZGVuXCIpKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQyID0gcHQ7XG5cdFx0XHRcdHdoaWxlIChwdDIgJiYgcHQyLl9uZXh0KSB7XG5cdFx0XHRcdFx0cHQyID0gcHQyLl9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4odGFyZ2V0LCBcInRyYW5zZm9ybVwiLCAwLCAwLCBudWxsLCAyKTtcblx0XHRcdFx0dGhpcy5fbGlua0NTU1AodHB0LCBudWxsLCBwdDIpO1xuXHRcdFx0XHR0cHQuc2V0UmF0aW8gPSBfdHJhbnNmb3JtUHJvcCA/IF9zZXRUcmFuc2Zvcm1SYXRpbyA6IF9zZXRJRVRyYW5zZm9ybVJhdGlvO1xuXHRcdFx0XHR0cHQuZGF0YSA9IHRoaXMuX3RyYW5zZm9ybSB8fCBfZ2V0VHJhbnNmb3JtKHRhcmdldCwgX2NzLCB0cnVlKTtcblx0XHRcdFx0dHB0LnR3ZWVuID0gdHdlZW47XG5cdFx0XHRcdHRwdC5wciA9IC0xOyAvL2Vuc3VyZXMgdGhhdCB0aGUgdHJhbnNmb3JtcyBnZXQgYXBwbGllZCBhZnRlciB0aGUgY29tcG9uZW50cyBhcmUgdXBkYXRlZC5cblx0XHRcdFx0X292ZXJ3cml0ZVByb3BzLnBvcCgpOyAvL3dlIGRvbid0IHdhbnQgdG8gZm9yY2UgdGhlIG92ZXJ3cml0ZSBvZiBhbGwgXCJ0cmFuc2Zvcm1cIiB0d2VlbnMgb2YgdGhlIHRhcmdldCAtIHdlIG9ubHkgY2FyZSBhYm91dCBpbmRpdmlkdWFsIHRyYW5zZm9ybSBwcm9wZXJ0aWVzIGxpa2Ugc2NhbGVYLCByb3RhdGlvbiwgZXRjLiBUaGUgQ1NTUHJvcFR3ZWVuIGNvbnN0cnVjdG9yIGF1dG9tYXRpY2FsbHkgYWRkcyB0aGUgcHJvcGVydHkgdG8gX292ZXJ3cml0ZVByb3BzIHdoaWNoIGlzIHdoeSB3ZSBuZWVkIHRvIHBvcCgpIGhlcmUuXG5cdFx0XHR9XG5cblx0XHRcdGlmIChfaGFzUHJpb3JpdHkpIHtcblx0XHRcdFx0Ly9yZW9yZGVycyB0aGUgbGlua2VkIGxpc3QgaW4gb3JkZXIgb2YgcHIgKHByaW9yaXR5KVxuXHRcdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0XHRuZXh0ID0gcHQuX25leHQ7XG5cdFx0XHRcdFx0cHQyID0gZmlyc3Q7XG5cdFx0XHRcdFx0d2hpbGUgKHB0MiAmJiBwdDIucHIgPiBwdC5wcikge1xuXHRcdFx0XHRcdFx0cHQyID0gcHQyLl9uZXh0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoKHB0Ll9wcmV2ID0gcHQyID8gcHQyLl9wcmV2IDogbGFzdCkpIHtcblx0XHRcdFx0XHRcdHB0Ll9wcmV2Ll9uZXh0ID0gcHQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGZpcnN0ID0gcHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICgocHQuX25leHQgPSBwdDIpKSB7XG5cdFx0XHRcdFx0XHRwdDIuX3ByZXYgPSBwdDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGFzdCA9IHB0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IG5leHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fZmlyc3RQVCA9IGZpcnN0O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fTtcblxuXG5cdFx0cC5wYXJzZSA9IGZ1bmN0aW9uKHRhcmdldCwgdmFycywgcHQsIHBsdWdpbikge1xuXHRcdFx0dmFyIHN0eWxlID0gdGFyZ2V0LnN0eWxlLFxuXHRcdFx0XHRwLCBzcCwgYm4sIGVuLCBicywgZXMsIGJzZngsIGVzZngsIGlzU3RyLCByZWw7XG5cdFx0XHRmb3IgKHAgaW4gdmFycykge1xuXHRcdFx0XHRlcyA9IHZhcnNbcF07IC8vZW5kaW5nIHZhbHVlIHN0cmluZ1xuXHRcdFx0XHRzcCA9IF9zcGVjaWFsUHJvcHNbcF07IC8vU3BlY2lhbFByb3AgbG9va3VwLlxuXHRcdFx0XHRpZiAoc3ApIHtcblx0XHRcdFx0XHRwdCA9IHNwLnBhcnNlKHRhcmdldCwgZXMsIHAsIHRoaXMsIHB0LCBwbHVnaW4sIHZhcnMpO1xuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0YnMgPSBfZ2V0U3R5bGUodGFyZ2V0LCBwLCBfY3MpICsgXCJcIjtcblx0XHRcdFx0XHRpc1N0ciA9ICh0eXBlb2YoZXMpID09PSBcInN0cmluZ1wiKTtcblx0XHRcdFx0XHRpZiAocCA9PT0gXCJjb2xvclwiIHx8IHAgPT09IFwiZmlsbFwiIHx8IHAgPT09IFwic3Ryb2tlXCIgfHwgcC5pbmRleE9mKFwiQ29sb3JcIikgIT09IC0xIHx8IChpc1N0ciAmJiBfcmdiaHNsRXhwLnRlc3QoZXMpKSkgeyAvL09wZXJhIHVzZXMgYmFja2dyb3VuZDogdG8gZGVmaW5lIGNvbG9yIHNvbWV0aW1lcyBpbiBhZGRpdGlvbiB0byBiYWNrZ3JvdW5kQ29sb3I6XG5cdFx0XHRcdFx0XHRpZiAoIWlzU3RyKSB7XG5cdFx0XHRcdFx0XHRcdGVzID0gX3BhcnNlQ29sb3IoZXMpO1xuXHRcdFx0XHRcdFx0XHRlcyA9ICgoZXMubGVuZ3RoID4gMykgPyBcInJnYmEoXCIgOiBcInJnYihcIikgKyBlcy5qb2luKFwiLFwiKSArIFwiKVwiO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cHQgPSBfcGFyc2VDb21wbGV4KHN0eWxlLCBwLCBicywgZXMsIHRydWUsIFwidHJhbnNwYXJlbnRcIiwgcHQsIDAsIHBsdWdpbik7XG5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKGlzU3RyICYmIChlcy5pbmRleE9mKFwiIFwiKSAhPT0gLTEgfHwgZXMuaW5kZXhPZihcIixcIikgIT09IC0xKSkge1xuXHRcdFx0XHRcdFx0cHQgPSBfcGFyc2VDb21wbGV4KHN0eWxlLCBwLCBicywgZXMsIHRydWUsIG51bGwsIHB0LCAwLCBwbHVnaW4pO1xuXG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGJuID0gcGFyc2VGbG9hdChicyk7XG5cdFx0XHRcdFx0XHRic2Z4ID0gKGJuIHx8IGJuID09PSAwKSA/IGJzLnN1YnN0cigoYm4gKyBcIlwiKS5sZW5ndGgpIDogXCJcIjsgLy9yZW1lbWJlciwgYnMgY291bGQgYmUgbm9uLW51bWVyaWMgbGlrZSBcIm5vcm1hbFwiIGZvciBmb250V2VpZ2h0LCBzbyB3ZSBzaG91bGQgZGVmYXVsdCB0byBhIGJsYW5rIHN1ZmZpeCBpbiB0aGF0IGNhc2UuXG5cblx0XHRcdFx0XHRcdGlmIChicyA9PT0gXCJcIiB8fCBicyA9PT0gXCJhdXRvXCIpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHAgPT09IFwid2lkdGhcIiB8fCBwID09PSBcImhlaWdodFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ym4gPSBfZ2V0RGltZW5zaW9uKHRhcmdldCwgcCwgX2NzKTtcblx0XHRcdFx0XHRcdFx0XHRic2Z4ID0gXCJweFwiO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHAgPT09IFwibGVmdFwiIHx8IHAgPT09IFwidG9wXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRibiA9IF9jYWxjdWxhdGVPZmZzZXQodGFyZ2V0LCBwLCBfY3MpO1xuXHRcdFx0XHRcdFx0XHRcdGJzZnggPSBcInB4XCI7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0Ym4gPSAocCAhPT0gXCJvcGFjaXR5XCIpID8gMCA6IDE7XG5cdFx0XHRcdFx0XHRcdFx0YnNmeCA9IFwiXCI7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmVsID0gKGlzU3RyICYmIGVzLmNoYXJBdCgxKSA9PT0gXCI9XCIpO1xuXHRcdFx0XHRcdFx0aWYgKHJlbCkge1xuXHRcdFx0XHRcdFx0XHRlbiA9IHBhcnNlSW50KGVzLmNoYXJBdCgwKSArIFwiMVwiLCAxMCk7XG5cdFx0XHRcdFx0XHRcdGVzID0gZXMuc3Vic3RyKDIpO1xuXHRcdFx0XHRcdFx0XHRlbiAqPSBwYXJzZUZsb2F0KGVzKTtcblx0XHRcdFx0XHRcdFx0ZXNmeCA9IGVzLnJlcGxhY2UoX3N1ZmZpeEV4cCwgXCJcIik7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRlbiA9IHBhcnNlRmxvYXQoZXMpO1xuXHRcdFx0XHRcdFx0XHRlc2Z4ID0gaXNTdHIgPyBlcy5yZXBsYWNlKF9zdWZmaXhFeHAsIFwiXCIpIDogXCJcIjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGVzZnggPT09IFwiXCIpIHtcblx0XHRcdFx0XHRcdFx0ZXNmeCA9IChwIGluIF9zdWZmaXhNYXApID8gX3N1ZmZpeE1hcFtwXSA6IGJzZng7IC8vcG9wdWxhdGUgdGhlIGVuZCBzdWZmaXgsIHByaW9yaXRpemluZyB0aGUgbWFwLCB0aGVuIGlmIG5vbmUgaXMgZm91bmQsIHVzZSB0aGUgYmVnaW5uaW5nIHN1ZmZpeC5cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0ZXMgPSAoZW4gfHwgZW4gPT09IDApID8gKHJlbCA/IGVuICsgYm4gOiBlbikgKyBlc2Z4IDogdmFyc1twXTsgLy9lbnN1cmVzIHRoYXQgYW55ICs9IG9yIC09IHByZWZpeGVzIGFyZSB0YWtlbiBjYXJlIG9mLiBSZWNvcmQgdGhlIGVuZCB2YWx1ZSBiZWZvcmUgbm9ybWFsaXppbmcgdGhlIHN1ZmZpeCBiZWNhdXNlIHdlIGFsd2F5cyB3YW50IHRvIGVuZCB0aGUgdHdlZW4gb24gZXhhY3RseSB3aGF0IHRoZXkgaW50ZW5kZWQgZXZlbiBpZiBpdCBkb2Vzbid0IG1hdGNoIHRoZSBiZWdpbm5pbmcgdmFsdWUncyBzdWZmaXguXG5cblx0XHRcdFx0XHRcdC8vaWYgdGhlIGJlZ2lubmluZy9lbmRpbmcgc3VmZml4ZXMgZG9uJ3QgbWF0Y2gsIG5vcm1hbGl6ZSB0aGVtLi4uXG5cdFx0XHRcdFx0XHRpZiAoYnNmeCAhPT0gZXNmeCkgaWYgKGVzZnggIT09IFwiXCIpIGlmIChlbiB8fCBlbiA9PT0gMCkgaWYgKGJuKSB7IC8vbm90ZTogaWYgdGhlIGJlZ2lubmluZyB2YWx1ZSAoYm4pIGlzIDAsIHdlIGRvbid0IG5lZWQgdG8gY29udmVydCB1bml0cyFcblx0XHRcdFx0XHRcdFx0Ym4gPSBfY29udmVydFRvUGl4ZWxzKHRhcmdldCwgcCwgYm4sIGJzZngpO1xuXHRcdFx0XHRcdFx0XHRpZiAoZXNmeCA9PT0gXCIlXCIpIHtcblx0XHRcdFx0XHRcdFx0XHRibiAvPSBfY29udmVydFRvUGl4ZWxzKHRhcmdldCwgcCwgMTAwLCBcIiVcIikgLyAxMDA7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKHZhcnMuc3RyaWN0VW5pdHMgIT09IHRydWUpIHsgLy9zb21lIGJyb3dzZXJzIHJlcG9ydCBvbmx5IFwicHhcIiB2YWx1ZXMgaW5zdGVhZCBvZiBhbGxvd2luZyBcIiVcIiB3aXRoIGdldENvbXB1dGVkU3R5bGUoKSwgc28gd2UgYXNzdW1lIHRoYXQgaWYgd2UncmUgdHdlZW5pbmcgdG8gYSAlLCB3ZSBzaG91bGQgc3RhcnQgdGhlcmUgdG9vIHVubGVzcyBzdHJpY3RVbml0czp0cnVlIGlzIGRlZmluZWQuIFRoaXMgYXBwcm9hY2ggaXMgcGFydGljdWxhcmx5IHVzZWZ1bCBmb3IgcmVzcG9uc2l2ZSBkZXNpZ25zIHRoYXQgdXNlIGZyb20oKSB0d2VlbnMuXG5cdFx0XHRcdFx0XHRcdFx0XHRicyA9IGJuICsgXCIlXCI7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZXNmeCA9PT0gXCJlbVwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0Ym4gLz0gX2NvbnZlcnRUb1BpeGVscyh0YXJnZXQsIHAsIDEsIFwiZW1cIik7XG5cblx0XHRcdFx0XHRcdFx0Ly9vdGhlcndpc2UgY29udmVydCB0byBwaXhlbHMuXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoZXNmeCAhPT0gXCJweFwiKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZW4gPSBfY29udmVydFRvUGl4ZWxzKHRhcmdldCwgcCwgZW4sIGVzZngpO1xuXHRcdFx0XHRcdFx0XHRcdGVzZnggPSBcInB4XCI7IC8vd2UgZG9uJ3QgdXNlIGJzZnggYWZ0ZXIgdGhpcywgc28gd2UgZG9uJ3QgbmVlZCB0byBzZXQgaXQgdG8gcHggdG9vLlxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmIChyZWwpIGlmIChlbiB8fCBlbiA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdGVzID0gKGVuICsgYm4pICsgZXNmeDsgLy90aGUgY2hhbmdlcyB3ZSBtYWRlIGFmZmVjdCByZWxhdGl2ZSBjYWxjdWxhdGlvbnMsIHNvIGFkanVzdCB0aGUgZW5kIHZhbHVlIGhlcmUuXG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHJlbCkge1xuXHRcdFx0XHRcdFx0XHRlbiArPSBibjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKChibiB8fCBibiA9PT0gMCkgJiYgKGVuIHx8IGVuID09PSAwKSkgeyAvL2Zhc3RlciB0aGFuIGlzTmFOKCkuIEFsc28sIHByZXZpb3VzbHkgd2UgcmVxdWlyZWQgZW4gIT09IGJuIGJ1dCB0aGF0IGRvZXNuJ3QgcmVhbGx5IGdhaW4gbXVjaCBwZXJmb3JtYW5jZSBhbmQgaXQgcHJldmVudHMgX3BhcnNlVG9Qcm94eSgpIGZyb20gd29ya2luZyBwcm9wZXJseSBpZiBiZWdpbm5pbmcgYW5kIGVuZGluZyB2YWx1ZXMgbWF0Y2ggYnV0IG5lZWQgdG8gZ2V0IHR3ZWVuZWQgYnkgYW4gZXh0ZXJuYWwgcGx1Z2luIGFueXdheS4gRm9yIGV4YW1wbGUsIGEgYmV6aWVyIHR3ZWVuIHdoZXJlIHRoZSB0YXJnZXQgc3RhcnRzIGF0IGxlZnQ6MCBhbmQgaGFzIHRoZXNlIHBvaW50czogW3tsZWZ0OjUwfSx7bGVmdDowfV0gd291bGRuJ3Qgd29yayBwcm9wZXJseSBiZWNhdXNlIHdoZW4gcGFyc2luZyB0aGUgbGFzdCBwb2ludCwgaXQnZCBtYXRjaCB0aGUgZmlyc3QgKGN1cnJlbnQpIG9uZSBhbmQgYSBub24tdHdlZW5pbmcgQ1NTUHJvcFR3ZWVuIHdvdWxkIGJlIHJlY29yZGVkIHdoZW4gd2UgYWN0dWFsbHkgbmVlZCBhIG5vcm1hbCB0d2VlbiAodHlwZTowKSBzbyB0aGF0IHRoaW5ncyBnZXQgdXBkYXRlZCBkdXJpbmcgdGhlIHR3ZWVuIHByb3Blcmx5LlxuXHRcdFx0XHRcdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4oc3R5bGUsIHAsIGJuLCBlbiAtIGJuLCBwdCwgMCwgcCwgKF9hdXRvUm91bmQgIT09IGZhbHNlICYmIChlc2Z4ID09PSBcInB4XCIgfHwgcCA9PT0gXCJ6SW5kZXhcIikpLCAwLCBicywgZXMpO1xuXHRcdFx0XHRcdFx0XHRwdC54czAgPSBlc2Z4O1xuXHRcdFx0XHRcdFx0XHQvL0RFQlVHOiBfbG9nKFwidHdlZW4gXCIrcCtcIiBmcm9tIFwiK3B0LmIrXCIgKFwiK2JuK2VzZngrXCIpIHRvIFwiK3B0LmUrXCIgd2l0aCBzdWZmaXg6IFwiK3B0LnhzMCk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHN0eWxlW3BdID09PSB1bmRlZmluZWQgfHwgIWVzICYmIChlcyArIFwiXCIgPT09IFwiTmFOXCIgfHwgZXMgPT0gbnVsbCkpIHtcblx0XHRcdFx0XHRcdFx0X2xvZyhcImludmFsaWQgXCIgKyBwICsgXCIgdHdlZW4gdmFsdWU6IFwiICsgdmFyc1twXSk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRwdCA9IG5ldyBDU1NQcm9wVHdlZW4oc3R5bGUsIHAsIGVuIHx8IGJuIHx8IDAsIDAsIHB0LCAtMSwgcCwgZmFsc2UsIDAsIGJzLCBlcyk7XG5cdFx0XHRcdFx0XHRcdHB0LnhzMCA9IChlcyA9PT0gXCJub25lXCIgJiYgKHAgPT09IFwiZGlzcGxheVwiIHx8IHAuaW5kZXhPZihcIlN0eWxlXCIpICE9PSAtMSkpID8gYnMgOiBlczsgLy9pbnRlcm1lZGlhdGUgdmFsdWUgc2hvdWxkIHR5cGljYWxseSBiZSBzZXQgaW1tZWRpYXRlbHkgKGVuZCB2YWx1ZSkgZXhjZXB0IGZvciBcImRpc3BsYXlcIiBvciB0aGluZ3MgbGlrZSBib3JkZXJUb3BTdHlsZSwgYm9yZGVyQm90dG9tU3R5bGUsIGV0Yy4gd2hpY2ggc2hvdWxkIHVzZSB0aGUgYmVnaW5uaW5nIHZhbHVlIGR1cmluZyB0aGUgdHdlZW4uXG5cdFx0XHRcdFx0XHRcdC8vREVCVUc6IF9sb2coXCJub24tdHdlZW5pbmcgdmFsdWUgXCIrcCtcIjogXCIrcHQueHMwKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHBsdWdpbikgaWYgKHB0ICYmICFwdC5wbHVnaW4pIHtcblx0XHRcdFx0XHRwdC5wbHVnaW4gPSBwbHVnaW47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBwdDtcblx0XHR9O1xuXG5cblx0XHQvL2dldHMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIHR3ZWVuIHVwZGF0ZXMsIHBhc3NpbmcgdGhlIG5ldyByYXRpbyAodHlwaWNhbGx5IGEgdmFsdWUgYmV0d2VlbiAwIGFuZCAxLCBidXQgbm90IGFsd2F5cyAoZm9yIGV4YW1wbGUsIGlmIGFuIEVsYXN0aWMuZWFzZU91dCBpcyB1c2VkLCB0aGUgdmFsdWUgY2FuIGp1bXAgYWJvdmUgMSBtaWQtdHdlZW4pLiBJdCB3aWxsIGFsd2F5cyBzdGFydCBhbmQgMCBhbmQgZW5kIGF0IDEuXG5cdFx0cC5zZXRSYXRpbyA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdHZhciBwdCA9IHRoaXMuX2ZpcnN0UFQsXG5cdFx0XHRcdG1pbiA9IDAuMDAwMDAxLFxuXHRcdFx0XHR2YWwsIHN0ciwgaTtcblx0XHRcdC8vYXQgdGhlIGVuZCBvZiB0aGUgdHdlZW4sIHdlIHNldCB0aGUgdmFsdWVzIHRvIGV4YWN0bHkgd2hhdCB3ZSByZWNlaXZlZCBpbiBvcmRlciB0byBtYWtlIHN1cmUgbm9uLXR3ZWVuaW5nIHZhbHVlcyAobGlrZSBcInBvc2l0aW9uXCIgb3IgXCJmbG9hdFwiIG9yIHdoYXRldmVyKSBhcmUgc2V0IGFuZCBzbyB0aGF0IGlmIHRoZSBiZWdpbm5pbmcvZW5kaW5nIHN1ZmZpeGVzICh1bml0cykgZGlkbid0IG1hdGNoIGFuZCB3ZSBub3JtYWxpemVkIHRvIHB4LCB0aGUgdmFsdWUgdGhhdCB0aGUgdXNlciBwYXNzZWQgaW4gaXMgdXNlZCBoZXJlLiBXZSBjaGVjayB0byBzZWUgaWYgdGhlIHR3ZWVuIGlzIGF0IGl0cyBiZWdpbm5pbmcgaW4gY2FzZSBpdCdzIGEgZnJvbSgpIHR3ZWVuIGluIHdoaWNoIGNhc2UgdGhlIHJhdGlvIHdpbGwgYWN0dWFsbHkgZ28gZnJvbSAxIHRvIDAgb3ZlciB0aGUgY291cnNlIG9mIHRoZSB0d2VlbiAoYmFja3dhcmRzKS5cblx0XHRcdGlmICh2ID09PSAxICYmICh0aGlzLl90d2Vlbi5fdGltZSA9PT0gdGhpcy5fdHdlZW4uX2R1cmF0aW9uIHx8IHRoaXMuX3R3ZWVuLl90aW1lID09PSAwKSkge1xuXHRcdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0XHRpZiAocHQudHlwZSAhPT0gMikge1xuXHRcdFx0XHRcdFx0aWYgKHB0LnIgJiYgcHQudHlwZSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdFx0dmFsID0gTWF0aC5yb3VuZChwdC5zICsgcHQuYyk7XG5cdFx0XHRcdFx0XHRcdGlmICghcHQudHlwZSkge1xuXHRcdFx0XHRcdFx0XHRcdHB0LnRbcHQucF0gPSB2YWwgKyBwdC54czA7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSBpZiAocHQudHlwZSA9PT0gMSkgeyAvL2NvbXBsZXggdmFsdWUgKG9uZSB0aGF0IHR5cGljYWxseSBoYXMgbXVsdGlwbGUgbnVtYmVycyBpbnNpZGUgYSBzdHJpbmcsIGxpa2UgXCJyZWN0KDVweCwxMHB4LDIwcHgsMjVweClcIlxuXHRcdFx0XHRcdFx0XHRcdGkgPSBwdC5sO1xuXHRcdFx0XHRcdFx0XHRcdHN0ciA9IHB0LnhzMCArIHZhbCArIHB0LnhzMTtcblx0XHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAxOyBpIDwgcHQubDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRzdHIgKz0gcHRbXCJ4blwiK2ldICsgcHRbXCJ4c1wiKyhpKzEpXTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHN0cjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHB0LmU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHB0LnNldFJhdGlvKHYpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSBpZiAodiB8fCAhKHRoaXMuX3R3ZWVuLl90aW1lID09PSB0aGlzLl90d2Vlbi5fZHVyYXRpb24gfHwgdGhpcy5fdHdlZW4uX3RpbWUgPT09IDApIHx8IHRoaXMuX3R3ZWVuLl9yYXdQcmV2VGltZSA9PT0gLTAuMDAwMDAxKSB7XG5cdFx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRcdHZhbCA9IHB0LmMgKiB2ICsgcHQucztcblx0XHRcdFx0XHRpZiAocHQucikge1xuXHRcdFx0XHRcdFx0dmFsID0gTWF0aC5yb3VuZCh2YWwpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAodmFsIDwgbWluKSBpZiAodmFsID4gLW1pbikge1xuXHRcdFx0XHRcdFx0dmFsID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCFwdC50eXBlKSB7XG5cdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gdmFsICsgcHQueHMwO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocHQudHlwZSA9PT0gMSkgeyAvL2NvbXBsZXggdmFsdWUgKG9uZSB0aGF0IHR5cGljYWxseSBoYXMgbXVsdGlwbGUgbnVtYmVycyBpbnNpZGUgYSBzdHJpbmcsIGxpa2UgXCJyZWN0KDVweCwxMHB4LDIwcHgsMjVweClcIlxuXHRcdFx0XHRcdFx0aSA9IHB0Lmw7XG5cdFx0XHRcdFx0XHRpZiAoaSA9PT0gMikge1xuXHRcdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQueHMwICsgdmFsICsgcHQueHMxICsgcHQueG4xICsgcHQueHMyO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChpID09PSAzKSB7XG5cdFx0XHRcdFx0XHRcdHB0LnRbcHQucF0gPSBwdC54czAgKyB2YWwgKyBwdC54czEgKyBwdC54bjEgKyBwdC54czIgKyBwdC54bjIgKyBwdC54czM7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGkgPT09IDQpIHtcblx0XHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHB0LnhzMCArIHZhbCArIHB0LnhzMSArIHB0LnhuMSArIHB0LnhzMiArIHB0LnhuMiArIHB0LnhzMyArIHB0LnhuMyArIHB0LnhzNDtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoaSA9PT0gNSkge1xuXHRcdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQueHMwICsgdmFsICsgcHQueHMxICsgcHQueG4xICsgcHQueHMyICsgcHQueG4yICsgcHQueHMzICsgcHQueG4zICsgcHQueHM0ICsgcHQueG40ICsgcHQueHM1O1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0c3RyID0gcHQueHMwICsgdmFsICsgcHQueHMxO1xuXHRcdFx0XHRcdFx0XHRmb3IgKGkgPSAxOyBpIDwgcHQubDsgaSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0c3RyICs9IHB0W1wieG5cIitpXSArIHB0W1wieHNcIisoaSsxKV07XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHN0cjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH0gZWxzZSBpZiAocHQudHlwZSA9PT0gLTEpIHsgLy9ub24tdHdlZW5pbmcgdmFsdWVcblx0XHRcdFx0XHRcdHB0LnRbcHQucF0gPSBwdC54czA7XG5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKHB0LnNldFJhdGlvKSB7IC8vY3VzdG9tIHNldFJhdGlvKCkgZm9yIHRoaW5ncyBsaWtlIFNwZWNpYWxQcm9wcywgZXh0ZXJuYWwgcGx1Z2lucywgZXRjLlxuXHRcdFx0XHRcdFx0cHQuc2V0UmF0aW8odik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0Ly9pZiB0aGUgdHdlZW4gaXMgcmV2ZXJzZWQgYWxsIHRoZSB3YXkgYmFjayB0byB0aGUgYmVnaW5uaW5nLCB3ZSBuZWVkIHRvIHJlc3RvcmUgdGhlIG9yaWdpbmFsIHZhbHVlcyB3aGljaCBtYXkgaGF2ZSBkaWZmZXJlbnQgdW5pdHMgKGxpa2UgJSBpbnN0ZWFkIG9mIHB4IG9yIGVtIG9yIHdoYXRldmVyKS5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRcdGlmIChwdC50eXBlICE9PSAyKSB7XG5cdFx0XHRcdFx0XHRwdC50W3B0LnBdID0gcHQuYjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cHQuc2V0UmF0aW8odik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHB0ID0gcHQuX25leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0LyoqXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBGb3JjZXMgcmVuZGVyaW5nIG9mIHRoZSB0YXJnZXQncyB0cmFuc2Zvcm1zIChyb3RhdGlvbiwgc2NhbGUsIGV0Yy4pIHdoZW5ldmVyIHRoZSBDU1NQbHVnaW4ncyBzZXRSYXRpbygpIGlzIGNhbGxlZC5cblx0XHQgKiBCYXNpY2FsbHksIHRoaXMgdGVsbHMgdGhlIENTU1BsdWdpbiB0byBjcmVhdGUgYSBDU1NQcm9wVHdlZW4gKHR5cGUgMikgYWZ0ZXIgaW5zdGFudGlhdGlvbiB0aGF0IHJ1bnMgbGFzdCBpbiB0aGUgbGlua2VkXG5cdFx0ICogbGlzdCBhbmQgY2FsbHMgdGhlIGFwcHJvcHJpYXRlICgzRCBvciAyRCkgcmVuZGVyaW5nIGZ1bmN0aW9uLiBXZSBzZXBhcmF0ZSB0aGlzIGludG8gaXRzIG93biBtZXRob2Qgc28gdGhhdCB3ZSBjYW4gY2FsbFxuXHRcdCAqIGl0IGZyb20gb3RoZXIgcGx1Z2lucyBsaWtlIEJlemllclBsdWdpbiBpZiwgZm9yIGV4YW1wbGUsIGl0IG5lZWRzIHRvIGFwcGx5IGFuIGF1dG9Sb3RhdGlvbiBhbmQgdGhpcyBDU1NQbHVnaW5cblx0XHQgKiBkb2Vzbid0IGhhdmUgYW55IHRyYW5zZm9ybS1yZWxhdGVkIHByb3BlcnRpZXMgb2YgaXRzIG93bi4gWW91IGNhbiBjYWxsIHRoaXMgbWV0aG9kIGFzIG1hbnkgdGltZXMgYXMgeW91XG5cdFx0ICogd2FudCBhbmQgaXQgd29uJ3QgY3JlYXRlIGR1cGxpY2F0ZSBDU1NQcm9wVHdlZW5zLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtib29sZWFufSB0aHJlZUQgaWYgdHJ1ZSwgaXQgc2hvdWxkIGFwcGx5IDNEIHR3ZWVucyAob3RoZXJ3aXNlLCBqdXN0IDJEIG9uZXMgYXJlIGZpbmUgYW5kIHR5cGljYWxseSBmYXN0ZXIpXG5cdFx0ICovXG5cdFx0cC5fZW5hYmxlVHJhbnNmb3JtcyA9IGZ1bmN0aW9uKHRocmVlRCkge1xuXHRcdFx0dGhpcy5fdHJhbnNmb3JtID0gdGhpcy5fdHJhbnNmb3JtIHx8IF9nZXRUcmFuc2Zvcm0odGhpcy5fdGFyZ2V0LCBfY3MsIHRydWUpOyAvL2Vuc3VyZXMgdGhhdCB0aGUgZWxlbWVudCBoYXMgYSBfZ3NUcmFuc2Zvcm0gcHJvcGVydHkgd2l0aCB0aGUgYXBwcm9wcmlhdGUgdmFsdWVzLlxuXHRcdFx0dGhpcy5fdHJhbnNmb3JtVHlwZSA9ICghKHRoaXMuX3RyYW5zZm9ybS5zdmcgJiYgX3VzZVNWR1RyYW5zZm9ybUF0dHIpICYmICh0aHJlZUQgfHwgdGhpcy5fdHJhbnNmb3JtVHlwZSA9PT0gMykpID8gMyA6IDI7XG5cdFx0fTtcblxuXHRcdHZhciBsYXp5U2V0ID0gZnVuY3Rpb24odikge1xuXHRcdFx0dGhpcy50W3RoaXMucF0gPSB0aGlzLmU7XG5cdFx0XHR0aGlzLmRhdGEuX2xpbmtDU1NQKHRoaXMsIHRoaXMuX25leHQsIG51bGwsIHRydWUpOyAvL3dlIHB1cnBvc2VmdWxseSBrZWVwIHRoaXMuX25leHQgZXZlbiB0aG91Z2ggaXQnZCBtYWtlIHNlbnNlIHRvIG51bGwgaXQsIGJ1dCB0aGlzIGlzIGEgcGVyZm9ybWFuY2Ugb3B0aW1pemF0aW9uLCBhcyB0aGlzIGhhcHBlbnMgZHVyaW5nIHRoZSB3aGlsZSAocHQpIHt9IGxvb3AgaW4gc2V0UmF0aW8oKSBhdCB0aGUgYm90dG9tIG9mIHdoaWNoIGl0IHNldHMgcHQgPSBwdC5fbmV4dCwgc28gaWYgd2UgbnVsbCBpdCwgdGhlIGxpbmtlZCBsaXN0IHdpbGwgYmUgYnJva2VuIGluIHRoYXQgbG9vcC5cblx0XHR9O1xuXHRcdC8qKiBAcHJpdmF0ZSBHaXZlcyB1cyBhIHdheSB0byBzZXQgYSB2YWx1ZSBvbiB0aGUgZmlyc3QgcmVuZGVyIChhbmQgb25seSB0aGUgZmlyc3QgcmVuZGVyKS4gKiovXG5cdFx0cC5fYWRkTGF6eVNldCA9IGZ1bmN0aW9uKHQsIHAsIHYpIHtcblx0XHRcdHZhciBwdCA9IHRoaXMuX2ZpcnN0UFQgPSBuZXcgQ1NTUHJvcFR3ZWVuKHQsIHAsIDAsIDAsIHRoaXMuX2ZpcnN0UFQsIDIpO1xuXHRcdFx0cHQuZSA9IHY7XG5cdFx0XHRwdC5zZXRSYXRpbyA9IGxhenlTZXQ7XG5cdFx0XHRwdC5kYXRhID0gdGhpcztcblx0XHR9O1xuXG5cdFx0LyoqIEBwcml2YXRlICoqL1xuXHRcdHAuX2xpbmtDU1NQID0gZnVuY3Rpb24ocHQsIG5leHQsIHByZXYsIHJlbW92ZSkge1xuXHRcdFx0aWYgKHB0KSB7XG5cdFx0XHRcdGlmIChuZXh0KSB7XG5cdFx0XHRcdFx0bmV4dC5fcHJldiA9IHB0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwdC5fbmV4dCkge1xuXHRcdFx0XHRcdHB0Ll9uZXh0Ll9wcmV2ID0gcHQuX3ByZXY7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHB0Ll9wcmV2KSB7XG5cdFx0XHRcdFx0cHQuX3ByZXYuX25leHQgPSBwdC5fbmV4dDtcblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl9maXJzdFBUID09PSBwdCkge1xuXHRcdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdC5fbmV4dDtcblx0XHRcdFx0XHRyZW1vdmUgPSB0cnVlOyAvL2p1c3QgdG8gcHJldmVudCByZXNldHRpbmcgdGhpcy5fZmlyc3RQVCA1IGxpbmVzIGRvd24gaW4gY2FzZSBwdC5fbmV4dCBpcyBudWxsLiAob3B0aW1pemVkIGZvciBzcGVlZClcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocHJldikge1xuXHRcdFx0XHRcdHByZXYuX25leHQgPSBwdDtcblx0XHRcdFx0fSBlbHNlIGlmICghcmVtb3ZlICYmIHRoaXMuX2ZpcnN0UFQgPT09IG51bGwpIHtcblx0XHRcdFx0XHR0aGlzLl9maXJzdFBUID0gcHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQuX25leHQgPSBuZXh0O1xuXHRcdFx0XHRwdC5fcHJldiA9IHByZXY7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcHQ7XG5cdFx0fTtcblxuXHRcdC8vd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhhdCBpZiBhbHBoYSBvciBhdXRvQWxwaGEgaXMga2lsbGVkLCBvcGFjaXR5IGlzIHRvby4gQW5kIGF1dG9BbHBoYSBhZmZlY3RzIHRoZSBcInZpc2liaWxpdHlcIiBwcm9wZXJ0eS5cblx0XHRwLl9raWxsID0gZnVuY3Rpb24obG9va3VwKSB7XG5cdFx0XHR2YXIgY29weSA9IGxvb2t1cCxcblx0XHRcdFx0cHQsIHAsIHhmaXJzdDtcblx0XHRcdGlmIChsb29rdXAuYXV0b0FscGhhIHx8IGxvb2t1cC5hbHBoYSkge1xuXHRcdFx0XHRjb3B5ID0ge307XG5cdFx0XHRcdGZvciAocCBpbiBsb29rdXApIHsgLy9jb3B5IHRoZSBsb29rdXAgc28gdGhhdCB3ZSdyZSBub3QgY2hhbmdpbmcgdGhlIG9yaWdpbmFsIHdoaWNoIG1heSBiZSBwYXNzZWQgZWxzZXdoZXJlLlxuXHRcdFx0XHRcdGNvcHlbcF0gPSBsb29rdXBbcF07XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29weS5vcGFjaXR5ID0gMTtcblx0XHRcdFx0aWYgKGNvcHkuYXV0b0FscGhhKSB7XG5cdFx0XHRcdFx0Y29weS52aXNpYmlsaXR5ID0gMTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGxvb2t1cC5jbGFzc05hbWUgJiYgKHB0ID0gdGhpcy5fY2xhc3NOYW1lUFQpKSB7IC8vZm9yIGNsYXNzTmFtZSB0d2VlbnMsIHdlIG5lZWQgdG8ga2lsbCBhbnkgYXNzb2NpYXRlZCBDU1NQcm9wVHdlZW5zIHRvbzsgYSBsaW5rZWQgbGlzdCBzdGFydHMgYXQgdGhlIGNsYXNzTmFtZSdzIFwieGZpcnN0XCIuXG5cdFx0XHRcdHhmaXJzdCA9IHB0LnhmaXJzdDtcblx0XHRcdFx0aWYgKHhmaXJzdCAmJiB4Zmlyc3QuX3ByZXYpIHtcblx0XHRcdFx0XHR0aGlzLl9saW5rQ1NTUCh4Zmlyc3QuX3ByZXYsIHB0Ll9uZXh0LCB4Zmlyc3QuX3ByZXYuX3ByZXYpOyAvL2JyZWFrIG9mZiB0aGUgcHJldlxuXHRcdFx0XHR9IGVsc2UgaWYgKHhmaXJzdCA9PT0gdGhpcy5fZmlyc3RQVCkge1xuXHRcdFx0XHRcdHRoaXMuX2ZpcnN0UFQgPSBwdC5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocHQuX25leHQpIHtcblx0XHRcdFx0XHR0aGlzLl9saW5rQ1NTUChwdC5fbmV4dCwgcHQuX25leHQuX25leHQsIHhmaXJzdC5fcHJldik7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fY2xhc3NOYW1lUFQgPSBudWxsO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIFR3ZWVuUGx1Z2luLnByb3RvdHlwZS5fa2lsbC5jYWxsKHRoaXMsIGNvcHkpO1xuXHRcdH07XG5cblxuXG5cdFx0Ly91c2VkIGJ5IGNhc2NhZGVUbygpIGZvciBnYXRoZXJpbmcgYWxsIHRoZSBzdHlsZSBwcm9wZXJ0aWVzIG9mIGVhY2ggY2hpbGQgZWxlbWVudCBpbnRvIGFuIGFycmF5IGZvciBjb21wYXJpc29uLlxuXHRcdHZhciBfZ2V0Q2hpbGRTdHlsZXMgPSBmdW5jdGlvbihlLCBwcm9wcywgdGFyZ2V0cykge1xuXHRcdFx0XHR2YXIgY2hpbGRyZW4sIGksIGNoaWxkLCB0eXBlO1xuXHRcdFx0XHRpZiAoZS5zbGljZSkge1xuXHRcdFx0XHRcdGkgPSBlLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdF9nZXRDaGlsZFN0eWxlcyhlW2ldLCBwcm9wcywgdGFyZ2V0cyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRjaGlsZHJlbiA9IGUuY2hpbGROb2Rlcztcblx0XHRcdFx0aSA9IGNoaWxkcmVuLmxlbmd0aDtcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0Y2hpbGQgPSBjaGlsZHJlbltpXTtcblx0XHRcdFx0XHR0eXBlID0gY2hpbGQudHlwZTtcblx0XHRcdFx0XHRpZiAoY2hpbGQuc3R5bGUpIHtcblx0XHRcdFx0XHRcdHByb3BzLnB1c2goX2dldEFsbFN0eWxlcyhjaGlsZCkpO1xuXHRcdFx0XHRcdFx0aWYgKHRhcmdldHMpIHtcblx0XHRcdFx0XHRcdFx0dGFyZ2V0cy5wdXNoKGNoaWxkKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKCh0eXBlID09PSAxIHx8IHR5cGUgPT09IDkgfHwgdHlwZSA9PT0gMTEpICYmIGNoaWxkLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRfZ2V0Q2hpbGRTdHlsZXMoY2hpbGQsIHByb3BzLCB0YXJnZXRzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBUeXBpY2FsbHkgb25seSB1c2VmdWwgZm9yIGNsYXNzTmFtZSB0d2VlbnMgdGhhdCBtYXkgYWZmZWN0IGNoaWxkIGVsZW1lbnRzLCB0aGlzIG1ldGhvZCBjcmVhdGVzIGEgVHdlZW5MaXRlXG5cdFx0ICogYW5kIHRoZW4gY29tcGFyZXMgdGhlIHN0eWxlIHByb3BlcnRpZXMgb2YgYWxsIHRoZSB0YXJnZXQncyBjaGlsZCBlbGVtZW50cyBhdCB0aGUgdHdlZW4ncyBzdGFydCBhbmQgZW5kLCBhbmRcblx0XHQgKiBpZiBhbnkgYXJlIGRpZmZlcmVudCwgaXQgYWxzbyBjcmVhdGVzIHR3ZWVucyBmb3IgdGhvc2UgYW5kIHJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBBTEwgb2YgdGhlIHJlc3VsdGluZ1xuXHRcdCAqIHR3ZWVucyAoc28gdGhhdCB5b3UgY2FuIGVhc2lseSBhZGQoKSB0aGVtIHRvIGEgVGltZWxpbmVMaXRlLCBmb3IgZXhhbXBsZSkuIFRoZSByZWFzb24gdGhpcyBmdW5jdGlvbmFsaXR5IGlzXG5cdFx0ICogd3JhcHBlZCBpbnRvIGEgc2VwYXJhdGUgc3RhdGljIG1ldGhvZCBvZiBDU1NQbHVnaW4gaW5zdGVhZCBvZiBiZWluZyBpbnRlZ3JhdGVkIGludG8gYWxsIHJlZ3VsYXIgY2xhc3NOYW1lIHR3ZWVuc1xuXHRcdCAqIGlzIGJlY2F1c2UgaXQgY3JlYXRlcyBlbnRpcmVseSBuZXcgdHdlZW5zIHRoYXQgbWF5IGhhdmUgY29tcGxldGVseSBkaWZmZXJlbnQgdGFyZ2V0cyB0aGFuIHRoZSBvcmlnaW5hbCB0d2Vlbixcblx0XHQgKiBzbyBpZiB0aGV5IHdlcmUgYWxsIGx1bXBlZCBpbnRvIHRoZSBvcmlnaW5hbCB0d2VlbiBpbnN0YW5jZSwgaXQgd291bGQgYmUgaW5jb25zaXN0ZW50IHdpdGggdGhlIHJlc3Qgb2YgdGhlIEFQSVxuXHRcdCAqIGFuZCBpdCB3b3VsZCBjcmVhdGUgb3RoZXIgcHJvYmxlbXMuIEZvciBleGFtcGxlOlxuXHRcdCAqICAtIElmIEkgY3JlYXRlIGEgdHdlZW4gb2YgZWxlbWVudEEsIHRoYXQgdHdlZW4gaW5zdGFuY2UgbWF5IHN1ZGRlbmx5IGNoYW5nZSBpdHMgdGFyZ2V0IHRvIGluY2x1ZGUgNTAgb3RoZXIgZWxlbWVudHMgKHVuaW50dWl0aXZlIGlmIEkgc3BlY2lmaWNhbGx5IGRlZmluZWQgdGhlIHRhcmdldCBJIHdhbnRlZClcblx0XHQgKiAgLSBXZSBjYW4ndCBqdXN0IGNyZWF0ZSBuZXcgaW5kZXBlbmRlbnQgdHdlZW5zIGJlY2F1c2Ugb3RoZXJ3aXNlLCB3aGF0IGhhcHBlbnMgaWYgdGhlIG9yaWdpbmFsL3BhcmVudCB0d2VlbiBpcyByZXZlcnNlZCBvciBwYXVzZSBvciBkcm9wcGVkIGludG8gYSBUaW1lbGluZUxpdGUgZm9yIHRpZ2h0IGNvbnRyb2w/IFlvdSdkIGV4cGVjdCB0aGF0IHR3ZWVuJ3MgYmVoYXZpb3IgdG8gYWZmZWN0IGFsbCB0aGUgb3RoZXJzLlxuXHRcdCAqICAtIEFuYWx5emluZyBldmVyeSBzdHlsZSBwcm9wZXJ0eSBvZiBldmVyeSBjaGlsZCBiZWZvcmUgYW5kIGFmdGVyIHRoZSB0d2VlbiBpcyBhbiBleHBlbnNpdmUgb3BlcmF0aW9uIHdoZW4gdGhlcmUgYXJlIG1hbnkgY2hpbGRyZW4sIHNvIHRoaXMgYmVoYXZpb3Igc2hvdWxkbid0IGJlIGltcG9zZWQgb24gYWxsIGNsYXNzTmFtZSB0d2VlbnMgYnkgZGVmYXVsdCwgZXNwZWNpYWxseSBzaW5jZSBpdCdzIHByb2JhYmx5IHJhcmUgdGhhdCB0aGlzIGV4dHJhIGZ1bmN0aW9uYWxpdHkgaXMgbmVlZGVkLlxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBvYmplY3QgdG8gYmUgdHdlZW5lZFxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBEdXJhdGlvbiBpbiBzZWNvbmRzIChvciBmcmFtZXMgZm9yIGZyYW1lcy1iYXNlZCB0d2VlbnMpXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IE9iamVjdCBjb250YWluaW5nIHRoZSBlbmQgdmFsdWVzLCBsaWtlIHtjbGFzc05hbWU6XCJuZXdDbGFzc1wiLCBlYXNlOkxpbmVhci5lYXNlTm9uZX1cblx0XHQgKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgVHdlZW5MaXRlIGluc3RhbmNlc1xuXHRcdCAqL1xuXHRcdENTU1BsdWdpbi5jYXNjYWRlVG8gPSBmdW5jdGlvbih0YXJnZXQsIGR1cmF0aW9uLCB2YXJzKSB7XG5cdFx0XHR2YXIgdHdlZW4gPSBUd2VlbkxpdGUudG8odGFyZ2V0LCBkdXJhdGlvbiwgdmFycyksXG5cdFx0XHRcdHJlc3VsdHMgPSBbdHdlZW5dLFxuXHRcdFx0XHRiID0gW10sXG5cdFx0XHRcdGUgPSBbXSxcblx0XHRcdFx0dGFyZ2V0cyA9IFtdLFxuXHRcdFx0XHRfcmVzZXJ2ZWRQcm9wcyA9IFR3ZWVuTGl0ZS5faW50ZXJuYWxzLnJlc2VydmVkUHJvcHMsXG5cdFx0XHRcdGksIGRpZnMsIHAsIGZyb207XG5cdFx0XHR0YXJnZXQgPSB0d2Vlbi5fdGFyZ2V0cyB8fCB0d2Vlbi50YXJnZXQ7XG5cdFx0XHRfZ2V0Q2hpbGRTdHlsZXModGFyZ2V0LCBiLCB0YXJnZXRzKTtcblx0XHRcdHR3ZWVuLnJlbmRlcihkdXJhdGlvbiwgdHJ1ZSwgdHJ1ZSk7XG5cdFx0XHRfZ2V0Q2hpbGRTdHlsZXModGFyZ2V0LCBlKTtcblx0XHRcdHR3ZWVuLnJlbmRlcigwLCB0cnVlLCB0cnVlKTtcblx0XHRcdHR3ZWVuLl9lbmFibGVkKHRydWUpO1xuXHRcdFx0aSA9IHRhcmdldHMubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGRpZnMgPSBfY3NzRGlmKHRhcmdldHNbaV0sIGJbaV0sIGVbaV0pO1xuXHRcdFx0XHRpZiAoZGlmcy5maXJzdE1QVCkge1xuXHRcdFx0XHRcdGRpZnMgPSBkaWZzLmRpZnM7XG5cdFx0XHRcdFx0Zm9yIChwIGluIHZhcnMpIHtcblx0XHRcdFx0XHRcdGlmIChfcmVzZXJ2ZWRQcm9wc1twXSkge1xuXHRcdFx0XHRcdFx0XHRkaWZzW3BdID0gdmFyc1twXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZnJvbSA9IHt9O1xuXHRcdFx0XHRcdGZvciAocCBpbiBkaWZzKSB7XG5cdFx0XHRcdFx0XHRmcm9tW3BdID0gYltpXVtwXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmVzdWx0cy5wdXNoKFR3ZWVuTGl0ZS5mcm9tVG8odGFyZ2V0c1tpXSwgZHVyYXRpb24sIGZyb20sIGRpZnMpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdHM7XG5cdFx0fTtcblxuXHRcdFR3ZWVuUGx1Z2luLmFjdGl2YXRlKFtDU1NQbHVnaW5dKTtcblx0XHRyZXR1cm4gQ1NTUGx1Z2luO1xuXG5cdH0sIHRydWUpO1xuXG5cdFxuXHRcblx0XG5cdFxuXHRcblx0XG5cdFxuXHRcblx0XG5cdFxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFJvdW5kUHJvcHNQbHVnaW5cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXHQoZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgUm91bmRQcm9wc1BsdWdpbiA9IF9nc1Njb3BlLl9nc0RlZmluZS5wbHVnaW4oe1xuXHRcdFx0XHRwcm9wTmFtZTogXCJyb3VuZFByb3BzXCIsXG5cdFx0XHRcdHByaW9yaXR5OiAtMSxcblx0XHRcdFx0QVBJOiAyLFxuXG5cdFx0XHRcdC8vY2FsbGVkIHdoZW4gdGhlIHR3ZWVuIHJlbmRlcnMgZm9yIHRoZSBmaXJzdCB0aW1lLiBUaGlzIGlzIHdoZXJlIGluaXRpYWwgdmFsdWVzIHNob3VsZCBiZSByZWNvcmRlZCBhbmQgYW55IHNldHVwIHJvdXRpbmVzIHNob3VsZCBydW4uXG5cdFx0XHRcdGluaXQ6IGZ1bmN0aW9uKHRhcmdldCwgdmFsdWUsIHR3ZWVuKSB7XG5cdFx0XHRcdFx0dGhpcy5fdHdlZW4gPSB0d2Vlbjtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9KSxcblx0XHRcdHAgPSBSb3VuZFByb3BzUGx1Z2luLnByb3RvdHlwZTtcblxuXHRcdHAuX29uSW5pdEFsbFByb3BzID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdHdlZW4gPSB0aGlzLl90d2Vlbixcblx0XHRcdFx0cnAgPSAodHdlZW4udmFycy5yb3VuZFByb3BzIGluc3RhbmNlb2YgQXJyYXkpID8gdHdlZW4udmFycy5yb3VuZFByb3BzIDogdHdlZW4udmFycy5yb3VuZFByb3BzLnNwbGl0KFwiLFwiKSxcblx0XHRcdFx0aSA9IHJwLmxlbmd0aCxcblx0XHRcdFx0bG9va3VwID0ge30sXG5cdFx0XHRcdHJwdCA9IHR3ZWVuLl9wcm9wTG9va3VwLnJvdW5kUHJvcHMsXG5cdFx0XHRcdHByb3AsIHB0LCBuZXh0O1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGxvb2t1cFtycFtpXV0gPSAxO1xuXHRcdFx0fVxuXHRcdFx0aSA9IHJwLmxlbmd0aDtcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRwcm9wID0gcnBbaV07XG5cdFx0XHRcdHB0ID0gdHdlZW4uX2ZpcnN0UFQ7XG5cdFx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRcdG5leHQgPSBwdC5fbmV4dDsgLy9yZWNvcmQgaGVyZSwgYmVjYXVzZSBpdCBtYXkgZ2V0IHJlbW92ZWRcblx0XHRcdFx0XHRpZiAocHQucGcpIHtcblx0XHRcdFx0XHRcdHB0LnQuX3JvdW5kUHJvcHMobG9va3VwLCB0cnVlKTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHB0Lm4gPT09IHByb3ApIHtcblx0XHRcdFx0XHRcdHRoaXMuX2FkZChwdC50LCBwcm9wLCBwdC5zLCBwdC5jKTtcblx0XHRcdFx0XHRcdC8vcmVtb3ZlIGZyb20gbGlua2VkIGxpc3Rcblx0XHRcdFx0XHRcdGlmIChuZXh0KSB7XG5cdFx0XHRcdFx0XHRcdG5leHQuX3ByZXYgPSBwdC5fcHJldjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChwdC5fcHJldikge1xuXHRcdFx0XHRcdFx0XHRwdC5fcHJldi5fbmV4dCA9IG5leHQ7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHR3ZWVuLl9maXJzdFBUID09PSBwdCkge1xuXHRcdFx0XHRcdFx0XHR0d2Vlbi5fZmlyc3RQVCA9IG5leHQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRwdC5fbmV4dCA9IHB0Ll9wcmV2ID0gbnVsbDtcblx0XHRcdFx0XHRcdHR3ZWVuLl9wcm9wTG9va3VwW3Byb3BdID0gcnB0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IG5leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cdFx0cC5fYWRkID0gZnVuY3Rpb24odGFyZ2V0LCBwLCBzLCBjKSB7XG5cdFx0XHR0aGlzLl9hZGRUd2Vlbih0YXJnZXQsIHAsIHMsIHMgKyBjLCBwLCB0cnVlKTtcblx0XHRcdHRoaXMuX292ZXJ3cml0ZVByb3BzLnB1c2gocCk7XG5cdFx0fTtcblxuXHR9KCkpO1xuXG5cblxuXG5cblxuXG5cblxuXG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogQXR0clBsdWdpblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cblx0KGZ1bmN0aW9uKCkge1xuXHRcdHZhciBfbnVtRXhwID0gLyg/OlxcZHxcXC18XFwrfD18I3xcXC4pKi9nLFxuXHRcdFx0X3N1ZmZpeEV4cCA9IC9bQS1aYS16JV0vZztcblxuXHRcdF9nc1Njb3BlLl9nc0RlZmluZS5wbHVnaW4oe1xuXHRcdFx0cHJvcE5hbWU6IFwiYXR0clwiLFxuXHRcdFx0QVBJOiAyLFxuXHRcdFx0dmVyc2lvbjogXCIwLjQuMFwiLFxuXG5cdFx0XHQvL2NhbGxlZCB3aGVuIHRoZSB0d2VlbiByZW5kZXJzIGZvciB0aGUgZmlyc3QgdGltZS4gVGhpcyBpcyB3aGVyZSBpbml0aWFsIHZhbHVlcyBzaG91bGQgYmUgcmVjb3JkZWQgYW5kIGFueSBzZXR1cCByb3V0aW5lcyBzaG91bGQgcnVuLlxuXHRcdFx0aW5pdDogZnVuY3Rpb24odGFyZ2V0LCB2YWx1ZSwgdHdlZW4pIHtcblx0XHRcdFx0dmFyIHAsIHN0YXJ0LCBlbmQsIHN1ZmZpeCwgaTtcblx0XHRcdFx0aWYgKHR5cGVvZih0YXJnZXQuc2V0QXR0cmlidXRlKSAhPT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3RhcmdldCA9IHRhcmdldDtcblx0XHRcdFx0dGhpcy5fcHJveHkgPSB7fTtcblx0XHRcdFx0dGhpcy5fc3RhcnQgPSB7fTsgLy8gd2UgcmVjb3JkIHN0YXJ0IGFuZCBlbmQgdmFsdWVzIGV4YWN0bHkgYXMgdGhleSBhcmUgaW4gY2FzZSB0aGV5J3JlIHN0cmluZ3MgKG5vdCBudW1iZXJzKSAtIHdlIG5lZWQgdG8gYmUgYWJsZSB0byByZXZlcnQgdG8gdGhlbSBjbGVhbmx5LlxuXHRcdFx0XHR0aGlzLl9lbmQgPSB7fTtcblx0XHRcdFx0dGhpcy5fc3VmZml4ID0ge307XG5cdFx0XHRcdGZvciAocCBpbiB2YWx1ZSkge1xuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0W3BdID0gdGhpcy5fcHJveHlbcF0gPSBzdGFydCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUocCkgKyBcIlwiO1xuXHRcdFx0XHRcdHRoaXMuX2VuZFtwXSA9IGVuZCA9IHZhbHVlW3BdICsgXCJcIjtcblx0XHRcdFx0XHR0aGlzLl9zdWZmaXhbcF0gPSBzdWZmaXggPSBfc3VmZml4RXhwLnRlc3QoZW5kKSA/IGVuZC5yZXBsYWNlKF9udW1FeHAsIFwiXCIpIDogX3N1ZmZpeEV4cC50ZXN0KHN0YXJ0KSA/IHN0YXJ0LnJlcGxhY2UoX251bUV4cCwgXCJcIikgOiBcIlwiO1xuXHRcdFx0XHRcdGlmIChzdWZmaXgpIHtcblx0XHRcdFx0XHRcdGkgPSBlbmQuaW5kZXhPZihzdWZmaXgpO1xuXHRcdFx0XHRcdFx0aWYgKGkgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdGVuZCA9IGVuZC5zdWJzdHIoMCwgaSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKCF0aGlzLl9hZGRUd2Vlbih0aGlzLl9wcm94eSwgcCwgcGFyc2VGbG9hdChzdGFydCksIGVuZCwgcCkpIHtcblx0XHRcdFx0XHRcdHRoaXMuX3N1ZmZpeFtwXSA9IFwiXCI7IC8vbm90IGEgdmFsaWQgdHdlZW4gLSBwZXJoYXBzIHNvbWV0aGluZyBsaWtlIGFuIDxpbWcgc3JjPVwiXCI+IGF0dHJpYnV0ZS5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGVuZC5jaGFyQXQoMSkgPT09IFwiPVwiKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9lbmRbcF0gPSAodGhpcy5fZmlyc3RQVC5zICsgdGhpcy5fZmlyc3RQVC5jKSArIHN1ZmZpeDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fb3ZlcndyaXRlUHJvcHMucHVzaChwKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH0sXG5cblx0XHRcdC8vY2FsbGVkIGVhY2ggdGltZSB0aGUgdmFsdWVzIHNob3VsZCBiZSB1cGRhdGVkLCBhbmQgdGhlIHJhdGlvIGdldHMgcGFzc2VkIGFzIHRoZSBvbmx5IHBhcmFtZXRlciAodHlwaWNhbGx5IGl0J3MgYSB2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEsIGJ1dCBpdCBjYW4gZXhjZWVkIHRob3NlIHdoZW4gdXNpbmcgYW4gZWFzZSBsaWtlIEVsYXN0aWMuZWFzZU91dCBvciBCYWNrLmVhc2VPdXQsIGV0Yy4pXG5cdFx0XHRzZXQ6IGZ1bmN0aW9uKHJhdGlvKSB7XG5cdFx0XHRcdHRoaXMuX3N1cGVyLnNldFJhdGlvLmNhbGwodGhpcywgcmF0aW8pO1xuXHRcdFx0XHR2YXIgcHJvcHMgPSB0aGlzLl9vdmVyd3JpdGVQcm9wcyxcblx0XHRcdFx0XHRpID0gcHJvcHMubGVuZ3RoLFxuXHRcdFx0XHRcdGxvb2t1cCA9IChyYXRpbyA9PT0gMSkgPyB0aGlzLl9lbmQgOiByYXRpbyA/IHRoaXMuX3Byb3h5IDogdGhpcy5fc3RhcnQsXG5cdFx0XHRcdFx0dXNlU3VmZml4ID0gKGxvb2t1cCA9PT0gdGhpcy5fcHJveHkpLFxuXHRcdFx0XHRcdHA7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdHAgPSBwcm9wc1tpXTtcblx0XHRcdFx0XHR0aGlzLl90YXJnZXQuc2V0QXR0cmlidXRlKHAsIGxvb2t1cFtwXSArICh1c2VTdWZmaXggPyB0aGlzLl9zdWZmaXhbcF0gOiBcIlwiKSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH0pO1xuXHR9KCkpO1xuXG5cblxuXG5cblxuXG5cblxuXG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogRGlyZWN0aW9uYWxSb3RhdGlvblBsdWdpblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdF9nc1Njb3BlLl9nc0RlZmluZS5wbHVnaW4oe1xuXHRcdHByb3BOYW1lOiBcImRpcmVjdGlvbmFsUm90YXRpb25cIixcblx0XHR2ZXJzaW9uOiBcIjAuMi4xXCIsXG5cdFx0QVBJOiAyLFxuXG5cdFx0Ly9jYWxsZWQgd2hlbiB0aGUgdHdlZW4gcmVuZGVycyBmb3IgdGhlIGZpcnN0IHRpbWUuIFRoaXMgaXMgd2hlcmUgaW5pdGlhbCB2YWx1ZXMgc2hvdWxkIGJlIHJlY29yZGVkIGFuZCBhbnkgc2V0dXAgcm91dGluZXMgc2hvdWxkIHJ1bi5cblx0XHRpbml0OiBmdW5jdGlvbih0YXJnZXQsIHZhbHVlLCB0d2Vlbikge1xuXHRcdFx0aWYgKHR5cGVvZih2YWx1ZSkgIT09IFwib2JqZWN0XCIpIHtcblx0XHRcdFx0dmFsdWUgPSB7cm90YXRpb246dmFsdWV9O1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5maW5hbHMgPSB7fTtcblx0XHRcdHZhciBjYXAgPSAodmFsdWUudXNlUmFkaWFucyA9PT0gdHJ1ZSkgPyBNYXRoLlBJICogMiA6IDM2MCxcblx0XHRcdFx0bWluID0gMC4wMDAwMDEsXG5cdFx0XHRcdHAsIHYsIHN0YXJ0LCBlbmQsIGRpZiwgc3BsaXQ7XG5cdFx0XHRmb3IgKHAgaW4gdmFsdWUpIHtcblx0XHRcdFx0aWYgKHAgIT09IFwidXNlUmFkaWFuc1wiKSB7XG5cdFx0XHRcdFx0c3BsaXQgPSAodmFsdWVbcF0gKyBcIlwiKS5zcGxpdChcIl9cIik7XG5cdFx0XHRcdFx0diA9IHNwbGl0WzBdO1xuXHRcdFx0XHRcdHN0YXJ0ID0gcGFyc2VGbG9hdCggKHR5cGVvZih0YXJnZXRbcF0pICE9PSBcImZ1bmN0aW9uXCIpID8gdGFyZ2V0W3BdIDogdGFyZ2V0WyAoKHAuaW5kZXhPZihcInNldFwiKSB8fCB0eXBlb2YodGFyZ2V0W1wiZ2V0XCIgKyBwLnN1YnN0cigzKV0pICE9PSBcImZ1bmN0aW9uXCIpID8gcCA6IFwiZ2V0XCIgKyBwLnN1YnN0cigzKSkgXSgpICk7XG5cdFx0XHRcdFx0ZW5kID0gdGhpcy5maW5hbHNbcF0gPSAodHlwZW9mKHYpID09PSBcInN0cmluZ1wiICYmIHYuY2hhckF0KDEpID09PSBcIj1cIikgPyBzdGFydCArIHBhcnNlSW50KHYuY2hhckF0KDApICsgXCIxXCIsIDEwKSAqIE51bWJlcih2LnN1YnN0cigyKSkgOiBOdW1iZXIodikgfHwgMDtcblx0XHRcdFx0XHRkaWYgPSBlbmQgLSBzdGFydDtcblx0XHRcdFx0XHRpZiAoc3BsaXQubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHR2ID0gc3BsaXQuam9pbihcIl9cIik7XG5cdFx0XHRcdFx0XHRpZiAodi5pbmRleE9mKFwic2hvcnRcIikgIT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdGRpZiA9IGRpZiAlIGNhcDtcblx0XHRcdFx0XHRcdFx0aWYgKGRpZiAhPT0gZGlmICUgKGNhcCAvIDIpKSB7XG5cdFx0XHRcdFx0XHRcdFx0ZGlmID0gKGRpZiA8IDApID8gZGlmICsgY2FwIDogZGlmIC0gY2FwO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAodi5pbmRleE9mKFwiX2N3XCIpICE9PSAtMSAmJiBkaWYgPCAwKSB7XG5cdFx0XHRcdFx0XHRcdGRpZiA9ICgoZGlmICsgY2FwICogOTk5OTk5OTk5OSkgJSBjYXApIC0gKChkaWYgLyBjYXApIHwgMCkgKiBjYXA7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHYuaW5kZXhPZihcImNjd1wiKSAhPT0gLTEgJiYgZGlmID4gMCkge1xuXHRcdFx0XHRcdFx0XHRkaWYgPSAoKGRpZiAtIGNhcCAqIDk5OTk5OTk5OTkpICUgY2FwKSAtICgoZGlmIC8gY2FwKSB8IDApICogY2FwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoZGlmID4gbWluIHx8IGRpZiA8IC1taW4pIHtcblx0XHRcdFx0XHRcdHRoaXMuX2FkZFR3ZWVuKHRhcmdldCwgcCwgc3RhcnQsIHN0YXJ0ICsgZGlmLCBwKTtcblx0XHRcdFx0XHRcdHRoaXMuX292ZXJ3cml0ZVByb3BzLnB1c2gocCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LFxuXG5cdFx0Ly9jYWxsZWQgZWFjaCB0aW1lIHRoZSB2YWx1ZXMgc2hvdWxkIGJlIHVwZGF0ZWQsIGFuZCB0aGUgcmF0aW8gZ2V0cyBwYXNzZWQgYXMgdGhlIG9ubHkgcGFyYW1ldGVyICh0eXBpY2FsbHkgaXQncyBhIHZhbHVlIGJldHdlZW4gMCBhbmQgMSwgYnV0IGl0IGNhbiBleGNlZWQgdGhvc2Ugd2hlbiB1c2luZyBhbiBlYXNlIGxpa2UgRWxhc3RpYy5lYXNlT3V0IG9yIEJhY2suZWFzZU91dCwgZXRjLilcblx0XHRzZXQ6IGZ1bmN0aW9uKHJhdGlvKSB7XG5cdFx0XHR2YXIgcHQ7XG5cdFx0XHRpZiAocmF0aW8gIT09IDEpIHtcblx0XHRcdFx0dGhpcy5fc3VwZXIuc2V0UmF0aW8uY2FsbCh0aGlzLCByYXRpbyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwdCA9IHRoaXMuX2ZpcnN0UFQ7XG5cdFx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRcdGlmIChwdC5mKSB7XG5cdFx0XHRcdFx0XHRwdC50W3B0LnBdKHRoaXMuZmluYWxzW3B0LnBdKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHRoaXMuZmluYWxzW3B0LnBdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH0pLl9hdXRvQ1NTID0gdHJ1ZTtcblxuXG5cblxuXG5cblxuXHRcblx0XG5cdFxuXHRcbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBFYXNlUGFja1xuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdF9nc1Njb3BlLl9nc0RlZmluZShcImVhc2luZy5CYWNrXCIsIFtcImVhc2luZy5FYXNlXCJdLCBmdW5jdGlvbihFYXNlKSB7XG5cdFx0XG5cdFx0dmFyIHcgPSAoX2dzU2NvcGUuR3JlZW5Tb2NrR2xvYmFscyB8fCBfZ3NTY29wZSksXG5cdFx0XHRncyA9IHcuY29tLmdyZWVuc29jayxcblx0XHRcdF8yUEkgPSBNYXRoLlBJICogMixcblx0XHRcdF9IQUxGX1BJID0gTWF0aC5QSSAvIDIsXG5cdFx0XHRfY2xhc3MgPSBncy5fY2xhc3MsXG5cdFx0XHRfY3JlYXRlID0gZnVuY3Rpb24obiwgZikge1xuXHRcdFx0XHR2YXIgQyA9IF9jbGFzcyhcImVhc2luZy5cIiArIG4sIGZ1bmN0aW9uKCl7fSwgdHJ1ZSksXG5cdFx0XHRcdFx0cCA9IEMucHJvdG90eXBlID0gbmV3IEVhc2UoKTtcblx0XHRcdFx0cC5jb25zdHJ1Y3RvciA9IEM7XG5cdFx0XHRcdHAuZ2V0UmF0aW8gPSBmO1xuXHRcdFx0XHRyZXR1cm4gQztcblx0XHRcdH0sXG5cdFx0XHRfZWFzZVJlZyA9IEVhc2UucmVnaXN0ZXIgfHwgZnVuY3Rpb24oKXt9LCAvL3B1dCBhbiBlbXB0eSBmdW5jdGlvbiBpbiBwbGFjZSBqdXN0IGFzIGEgc2FmZXR5IG1lYXN1cmUgaW4gY2FzZSBzb21lb25lIGxvYWRzIGFuIE9MRCB2ZXJzaW9uIG9mIFR3ZWVuTGl0ZS5qcyB3aGVyZSBFYXNlLnJlZ2lzdGVyIGRvZXNuJ3QgZXhpc3QuXG5cdFx0XHRfd3JhcCA9IGZ1bmN0aW9uKG5hbWUsIEVhc2VPdXQsIEVhc2VJbiwgRWFzZUluT3V0LCBhbGlhc2VzKSB7XG5cdFx0XHRcdHZhciBDID0gX2NsYXNzKFwiZWFzaW5nLlwiK25hbWUsIHtcblx0XHRcdFx0XHRlYXNlT3V0Om5ldyBFYXNlT3V0KCksXG5cdFx0XHRcdFx0ZWFzZUluOm5ldyBFYXNlSW4oKSxcblx0XHRcdFx0XHRlYXNlSW5PdXQ6bmV3IEVhc2VJbk91dCgpXG5cdFx0XHRcdH0sIHRydWUpO1xuXHRcdFx0XHRfZWFzZVJlZyhDLCBuYW1lKTtcblx0XHRcdFx0cmV0dXJuIEM7XG5cdFx0XHR9LFxuXHRcdFx0RWFzZVBvaW50ID0gZnVuY3Rpb24odGltZSwgdmFsdWUsIG5leHQpIHtcblx0XHRcdFx0dGhpcy50ID0gdGltZTtcblx0XHRcdFx0dGhpcy52ID0gdmFsdWU7XG5cdFx0XHRcdGlmIChuZXh0KSB7XG5cdFx0XHRcdFx0dGhpcy5uZXh0ID0gbmV4dDtcblx0XHRcdFx0XHRuZXh0LnByZXYgPSB0aGlzO1xuXHRcdFx0XHRcdHRoaXMuYyA9IG5leHQudiAtIHZhbHVlO1xuXHRcdFx0XHRcdHRoaXMuZ2FwID0gbmV4dC50IC0gdGltZTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0Ly9CYWNrXG5cdFx0XHRfY3JlYXRlQmFjayA9IGZ1bmN0aW9uKG4sIGYpIHtcblx0XHRcdFx0dmFyIEMgPSBfY2xhc3MoXCJlYXNpbmcuXCIgKyBuLCBmdW5jdGlvbihvdmVyc2hvb3QpIHtcblx0XHRcdFx0XHRcdHRoaXMuX3AxID0gKG92ZXJzaG9vdCB8fCBvdmVyc2hvb3QgPT09IDApID8gb3ZlcnNob290IDogMS43MDE1ODtcblx0XHRcdFx0XHRcdHRoaXMuX3AyID0gdGhpcy5fcDEgKiAxLjUyNTtcblx0XHRcdFx0XHR9LCB0cnVlKSxcblx0XHRcdFx0XHRwID0gQy5wcm90b3R5cGUgPSBuZXcgRWFzZSgpO1xuXHRcdFx0XHRwLmNvbnN0cnVjdG9yID0gQztcblx0XHRcdFx0cC5nZXRSYXRpbyA9IGY7XG5cdFx0XHRcdHAuY29uZmlnID0gZnVuY3Rpb24ob3ZlcnNob290KSB7XG5cdFx0XHRcdFx0cmV0dXJuIG5ldyBDKG92ZXJzaG9vdCk7XG5cdFx0XHRcdH07XG5cdFx0XHRcdHJldHVybiBDO1xuXHRcdFx0fSxcblxuXHRcdFx0QmFjayA9IF93cmFwKFwiQmFja1wiLFxuXHRcdFx0XHRfY3JlYXRlQmFjayhcIkJhY2tPdXRcIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRcdHJldHVybiAoKHAgPSBwIC0gMSkgKiBwICogKCh0aGlzLl9wMSArIDEpICogcCArIHRoaXMuX3AxKSArIDEpO1xuXHRcdFx0XHR9KSxcblx0XHRcdFx0X2NyZWF0ZUJhY2soXCJCYWNrSW5cIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRcdHJldHVybiBwICogcCAqICgodGhpcy5fcDEgKyAxKSAqIHAgLSB0aGlzLl9wMSk7XG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRfY3JlYXRlQmFjayhcIkJhY2tJbk91dFwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdFx0cmV0dXJuICgocCAqPSAyKSA8IDEpID8gMC41ICogcCAqIHAgKiAoKHRoaXMuX3AyICsgMSkgKiBwIC0gdGhpcy5fcDIpIDogMC41ICogKChwIC09IDIpICogcCAqICgodGhpcy5fcDIgKyAxKSAqIHAgKyB0aGlzLl9wMikgKyAyKTtcblx0XHRcdFx0fSlcblx0XHRcdCksXG5cblxuXHRcdFx0Ly9TbG93TW9cblx0XHRcdFNsb3dNbyA9IF9jbGFzcyhcImVhc2luZy5TbG93TW9cIiwgZnVuY3Rpb24obGluZWFyUmF0aW8sIHBvd2VyLCB5b3lvTW9kZSkge1xuXHRcdFx0XHRwb3dlciA9IChwb3dlciB8fCBwb3dlciA9PT0gMCkgPyBwb3dlciA6IDAuNztcblx0XHRcdFx0aWYgKGxpbmVhclJhdGlvID09IG51bGwpIHtcblx0XHRcdFx0XHRsaW5lYXJSYXRpbyA9IDAuNztcblx0XHRcdFx0fSBlbHNlIGlmIChsaW5lYXJSYXRpbyA+IDEpIHtcblx0XHRcdFx0XHRsaW5lYXJSYXRpbyA9IDE7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5fcCA9IChsaW5lYXJSYXRpbyAhPT0gMSkgPyBwb3dlciA6IDA7XG5cdFx0XHRcdHRoaXMuX3AxID0gKDEgLSBsaW5lYXJSYXRpbykgLyAyO1xuXHRcdFx0XHR0aGlzLl9wMiA9IGxpbmVhclJhdGlvO1xuXHRcdFx0XHR0aGlzLl9wMyA9IHRoaXMuX3AxICsgdGhpcy5fcDI7XG5cdFx0XHRcdHRoaXMuX2NhbGNFbmQgPSAoeW95b01vZGUgPT09IHRydWUpO1xuXHRcdFx0fSwgdHJ1ZSksXG5cdFx0XHRwID0gU2xvd01vLnByb3RvdHlwZSA9IG5ldyBFYXNlKCksXG5cdFx0XHRTdGVwcGVkRWFzZSwgUm91Z2hFYXNlLCBfY3JlYXRlRWxhc3RpYztcblxuXHRcdHAuY29uc3RydWN0b3IgPSBTbG93TW87XG5cdFx0cC5nZXRSYXRpbyA9IGZ1bmN0aW9uKHApIHtcblx0XHRcdHZhciByID0gcCArICgwLjUgLSBwKSAqIHRoaXMuX3A7XG5cdFx0XHRpZiAocCA8IHRoaXMuX3AxKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9jYWxjRW5kID8gMSAtICgocCA9IDEgLSAocCAvIHRoaXMuX3AxKSkgKiBwKSA6IHIgLSAoKHAgPSAxIC0gKHAgLyB0aGlzLl9wMSkpICogcCAqIHAgKiBwICogcik7XG5cdFx0XHR9IGVsc2UgaWYgKHAgPiB0aGlzLl9wMykge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fY2FsY0VuZCA/IDEgLSAocCA9IChwIC0gdGhpcy5fcDMpIC8gdGhpcy5fcDEpICogcCA6IHIgKyAoKHAgLSByKSAqIChwID0gKHAgLSB0aGlzLl9wMykgLyB0aGlzLl9wMSkgKiBwICogcCAqIHApO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX2NhbGNFbmQgPyAxIDogcjtcblx0XHR9O1xuXHRcdFNsb3dNby5lYXNlID0gbmV3IFNsb3dNbygwLjcsIDAuNyk7XG5cblx0XHRwLmNvbmZpZyA9IFNsb3dNby5jb25maWcgPSBmdW5jdGlvbihsaW5lYXJSYXRpbywgcG93ZXIsIHlveW9Nb2RlKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFNsb3dNbyhsaW5lYXJSYXRpbywgcG93ZXIsIHlveW9Nb2RlKTtcblx0XHR9O1xuXG5cblx0XHQvL1N0ZXBwZWRFYXNlXG5cdFx0U3RlcHBlZEVhc2UgPSBfY2xhc3MoXCJlYXNpbmcuU3RlcHBlZEVhc2VcIiwgZnVuY3Rpb24oc3RlcHMpIHtcblx0XHRcdFx0c3RlcHMgPSBzdGVwcyB8fCAxO1xuXHRcdFx0XHR0aGlzLl9wMSA9IDEgLyBzdGVwcztcblx0XHRcdFx0dGhpcy5fcDIgPSBzdGVwcyArIDE7XG5cdFx0XHR9LCB0cnVlKTtcblx0XHRwID0gU3RlcHBlZEVhc2UucHJvdG90eXBlID0gbmV3IEVhc2UoKTtcblx0XHRwLmNvbnN0cnVjdG9yID0gU3RlcHBlZEVhc2U7XG5cdFx0cC5nZXRSYXRpbyA9IGZ1bmN0aW9uKHApIHtcblx0XHRcdGlmIChwIDwgMCkge1xuXHRcdFx0XHRwID0gMDtcblx0XHRcdH0gZWxzZSBpZiAocCA+PSAxKSB7XG5cdFx0XHRcdHAgPSAwLjk5OTk5OTk5OTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAoKHRoaXMuX3AyICogcCkgPj4gMCkgKiB0aGlzLl9wMTtcblx0XHR9O1xuXHRcdHAuY29uZmlnID0gU3RlcHBlZEVhc2UuY29uZmlnID0gZnVuY3Rpb24oc3RlcHMpIHtcblx0XHRcdHJldHVybiBuZXcgU3RlcHBlZEVhc2Uoc3RlcHMpO1xuXHRcdH07XG5cblxuXHRcdC8vUm91Z2hFYXNlXG5cdFx0Um91Z2hFYXNlID0gX2NsYXNzKFwiZWFzaW5nLlJvdWdoRWFzZVwiLCBmdW5jdGlvbih2YXJzKSB7XG5cdFx0XHR2YXJzID0gdmFycyB8fCB7fTtcblx0XHRcdHZhciB0YXBlciA9IHZhcnMudGFwZXIgfHwgXCJub25lXCIsXG5cdFx0XHRcdGEgPSBbXSxcblx0XHRcdFx0Y250ID0gMCxcblx0XHRcdFx0cG9pbnRzID0gKHZhcnMucG9pbnRzIHx8IDIwKSB8IDAsXG5cdFx0XHRcdGkgPSBwb2ludHMsXG5cdFx0XHRcdHJhbmRvbWl6ZSA9ICh2YXJzLnJhbmRvbWl6ZSAhPT0gZmFsc2UpLFxuXHRcdFx0XHRjbGFtcCA9ICh2YXJzLmNsYW1wID09PSB0cnVlKSxcblx0XHRcdFx0dGVtcGxhdGUgPSAodmFycy50ZW1wbGF0ZSBpbnN0YW5jZW9mIEVhc2UpID8gdmFycy50ZW1wbGF0ZSA6IG51bGwsXG5cdFx0XHRcdHN0cmVuZ3RoID0gKHR5cGVvZih2YXJzLnN0cmVuZ3RoKSA9PT0gXCJudW1iZXJcIikgPyB2YXJzLnN0cmVuZ3RoICogMC40IDogMC40LFxuXHRcdFx0XHR4LCB5LCBidW1wLCBpbnZYLCBvYmosIHBudDtcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHR4ID0gcmFuZG9taXplID8gTWF0aC5yYW5kb20oKSA6ICgxIC8gcG9pbnRzKSAqIGk7XG5cdFx0XHRcdHkgPSB0ZW1wbGF0ZSA/IHRlbXBsYXRlLmdldFJhdGlvKHgpIDogeDtcblx0XHRcdFx0aWYgKHRhcGVyID09PSBcIm5vbmVcIikge1xuXHRcdFx0XHRcdGJ1bXAgPSBzdHJlbmd0aDtcblx0XHRcdFx0fSBlbHNlIGlmICh0YXBlciA9PT0gXCJvdXRcIikge1xuXHRcdFx0XHRcdGludlggPSAxIC0geDtcblx0XHRcdFx0XHRidW1wID0gaW52WCAqIGludlggKiBzdHJlbmd0aDtcblx0XHRcdFx0fSBlbHNlIGlmICh0YXBlciA9PT0gXCJpblwiKSB7XG5cdFx0XHRcdFx0YnVtcCA9IHggKiB4ICogc3RyZW5ndGg7XG5cdFx0XHRcdH0gZWxzZSBpZiAoeCA8IDAuNSkgeyAgLy9cImJvdGhcIiAoc3RhcnQpXG5cdFx0XHRcdFx0aW52WCA9IHggKiAyO1xuXHRcdFx0XHRcdGJ1bXAgPSBpbnZYICogaW52WCAqIDAuNSAqIHN0cmVuZ3RoO1xuXHRcdFx0XHR9IGVsc2Uge1x0XHRcdFx0Ly9cImJvdGhcIiAoZW5kKVxuXHRcdFx0XHRcdGludlggPSAoMSAtIHgpICogMjtcblx0XHRcdFx0XHRidW1wID0gaW52WCAqIGludlggKiAwLjUgKiBzdHJlbmd0aDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAocmFuZG9taXplKSB7XG5cdFx0XHRcdFx0eSArPSAoTWF0aC5yYW5kb20oKSAqIGJ1bXApIC0gKGJ1bXAgKiAwLjUpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGkgJSAyKSB7XG5cdFx0XHRcdFx0eSArPSBidW1wICogMC41O1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHkgLT0gYnVtcCAqIDAuNTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2xhbXApIHtcblx0XHRcdFx0XHRpZiAoeSA+IDEpIHtcblx0XHRcdFx0XHRcdHkgPSAxO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoeSA8IDApIHtcblx0XHRcdFx0XHRcdHkgPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRhW2NudCsrXSA9IHt4OngsIHk6eX07XG5cdFx0XHR9XG5cdFx0XHRhLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0XHRyZXR1cm4gYS54IC0gYi54O1xuXHRcdFx0fSk7XG5cblx0XHRcdHBudCA9IG5ldyBFYXNlUG9pbnQoMSwgMSwgbnVsbCk7XG5cdFx0XHRpID0gcG9pbnRzO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdG9iaiA9IGFbaV07XG5cdFx0XHRcdHBudCA9IG5ldyBFYXNlUG9pbnQob2JqLngsIG9iai55LCBwbnQpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9wcmV2ID0gbmV3IEVhc2VQb2ludCgwLCAwLCAocG50LnQgIT09IDApID8gcG50IDogcG50Lm5leHQpO1xuXHRcdH0sIHRydWUpO1xuXHRcdHAgPSBSb3VnaEVhc2UucHJvdG90eXBlID0gbmV3IEVhc2UoKTtcblx0XHRwLmNvbnN0cnVjdG9yID0gUm91Z2hFYXNlO1xuXHRcdHAuZ2V0UmF0aW8gPSBmdW5jdGlvbihwKSB7XG5cdFx0XHR2YXIgcG50ID0gdGhpcy5fcHJldjtcblx0XHRcdGlmIChwID4gcG50LnQpIHtcblx0XHRcdFx0d2hpbGUgKHBudC5uZXh0ICYmIHAgPj0gcG50LnQpIHtcblx0XHRcdFx0XHRwbnQgPSBwbnQubmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0XHRwbnQgPSBwbnQucHJldjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdoaWxlIChwbnQucHJldiAmJiBwIDw9IHBudC50KSB7XG5cdFx0XHRcdFx0cG50ID0gcG50LnByZXY7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuX3ByZXYgPSBwbnQ7XG5cdFx0XHRyZXR1cm4gKHBudC52ICsgKChwIC0gcG50LnQpIC8gcG50LmdhcCkgKiBwbnQuYyk7XG5cdFx0fTtcblx0XHRwLmNvbmZpZyA9IGZ1bmN0aW9uKHZhcnMpIHtcblx0XHRcdHJldHVybiBuZXcgUm91Z2hFYXNlKHZhcnMpO1xuXHRcdH07XG5cdFx0Um91Z2hFYXNlLmVhc2UgPSBuZXcgUm91Z2hFYXNlKCk7XG5cblxuXHRcdC8vQm91bmNlXG5cdFx0X3dyYXAoXCJCb3VuY2VcIixcblx0XHRcdF9jcmVhdGUoXCJCb3VuY2VPdXRcIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRpZiAocCA8IDEgLyAyLjc1KSB7XG5cdFx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIHAgKiBwO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHAgPCAyIC8gMi43NSkge1xuXHRcdFx0XHRcdHJldHVybiA3LjU2MjUgKiAocCAtPSAxLjUgLyAyLjc1KSAqIHAgKyAwLjc1O1xuXHRcdFx0XHR9IGVsc2UgaWYgKHAgPCAyLjUgLyAyLjc1KSB7XG5cdFx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIChwIC09IDIuMjUgLyAyLjc1KSAqIHAgKyAwLjkzNzU7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIDcuNTYyNSAqIChwIC09IDIuNjI1IC8gMi43NSkgKiBwICsgMC45ODQzNzU7XG5cdFx0XHR9KSxcblx0XHRcdF9jcmVhdGUoXCJCb3VuY2VJblwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdGlmICgocCA9IDEgLSBwKSA8IDEgLyAyLjc1KSB7XG5cdFx0XHRcdFx0cmV0dXJuIDEgLSAoNy41NjI1ICogcCAqIHApO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHAgPCAyIC8gMi43NSkge1xuXHRcdFx0XHRcdHJldHVybiAxIC0gKDcuNTYyNSAqIChwIC09IDEuNSAvIDIuNzUpICogcCArIDAuNzUpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKHAgPCAyLjUgLyAyLjc1KSB7XG5cdFx0XHRcdFx0cmV0dXJuIDEgLSAoNy41NjI1ICogKHAgLT0gMi4yNSAvIDIuNzUpICogcCArIDAuOTM3NSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIDEgLSAoNy41NjI1ICogKHAgLT0gMi42MjUgLyAyLjc1KSAqIHAgKyAwLjk4NDM3NSk7XG5cdFx0XHR9KSxcblx0XHRcdF9jcmVhdGUoXCJCb3VuY2VJbk91dFwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdHZhciBpbnZlcnQgPSAocCA8IDAuNSk7XG5cdFx0XHRcdGlmIChpbnZlcnQpIHtcblx0XHRcdFx0XHRwID0gMSAtIChwICogMik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cCA9IChwICogMikgLSAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwIDwgMSAvIDIuNzUpIHtcblx0XHRcdFx0XHRwID0gNy41NjI1ICogcCAqIHA7XG5cdFx0XHRcdH0gZWxzZSBpZiAocCA8IDIgLyAyLjc1KSB7XG5cdFx0XHRcdFx0cCA9IDcuNTYyNSAqIChwIC09IDEuNSAvIDIuNzUpICogcCArIDAuNzU7XG5cdFx0XHRcdH0gZWxzZSBpZiAocCA8IDIuNSAvIDIuNzUpIHtcblx0XHRcdFx0XHRwID0gNy41NjI1ICogKHAgLT0gMi4yNSAvIDIuNzUpICogcCArIDAuOTM3NTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwID0gNy41NjI1ICogKHAgLT0gMi42MjUgLyAyLjc1KSAqIHAgKyAwLjk4NDM3NTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gaW52ZXJ0ID8gKDEgLSBwKSAqIDAuNSA6IHAgKiAwLjUgKyAwLjU7XG5cdFx0XHR9KVxuXHRcdCk7XG5cblxuXHRcdC8vQ0lSQ1xuXHRcdF93cmFwKFwiQ2lyY1wiLFxuXHRcdFx0X2NyZWF0ZShcIkNpcmNPdXRcIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRyZXR1cm4gTWF0aC5zcXJ0KDEgLSAocCA9IHAgLSAxKSAqIHApO1xuXHRcdFx0fSksXG5cdFx0XHRfY3JlYXRlKFwiQ2lyY0luXCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuIC0oTWF0aC5zcXJ0KDEgLSAocCAqIHApKSAtIDEpO1xuXHRcdFx0fSksXG5cdFx0XHRfY3JlYXRlKFwiQ2lyY0luT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuICgocCo9MikgPCAxKSA/IC0wLjUgKiAoTWF0aC5zcXJ0KDEgLSBwICogcCkgLSAxKSA6IDAuNSAqIChNYXRoLnNxcnQoMSAtIChwIC09IDIpICogcCkgKyAxKTtcblx0XHRcdH0pXG5cdFx0KTtcblxuXG5cdFx0Ly9FbGFzdGljXG5cdFx0X2NyZWF0ZUVsYXN0aWMgPSBmdW5jdGlvbihuLCBmLCBkZWYpIHtcblx0XHRcdHZhciBDID0gX2NsYXNzKFwiZWFzaW5nLlwiICsgbiwgZnVuY3Rpb24oYW1wbGl0dWRlLCBwZXJpb2QpIHtcblx0XHRcdFx0XHR0aGlzLl9wMSA9IChhbXBsaXR1ZGUgPj0gMSkgPyBhbXBsaXR1ZGUgOiAxOyAvL25vdGU6IGlmIGFtcGxpdHVkZSBpcyA8IDEsIHdlIHNpbXBseSBhZGp1c3QgdGhlIHBlcmlvZCBmb3IgYSBtb3JlIG5hdHVyYWwgZmVlbC4gT3RoZXJ3aXNlIHRoZSBtYXRoIGRvZXNuJ3Qgd29yayByaWdodCBhbmQgdGhlIGN1cnZlIHN0YXJ0cyBhdCAxLlxuXHRcdFx0XHRcdHRoaXMuX3AyID0gKHBlcmlvZCB8fCBkZWYpIC8gKGFtcGxpdHVkZSA8IDEgPyBhbXBsaXR1ZGUgOiAxKTtcblx0XHRcdFx0XHR0aGlzLl9wMyA9IHRoaXMuX3AyIC8gXzJQSSAqIChNYXRoLmFzaW4oMSAvIHRoaXMuX3AxKSB8fCAwKTtcblx0XHRcdFx0XHR0aGlzLl9wMiA9IF8yUEkgLyB0aGlzLl9wMjsgLy9wcmVjYWxjdWxhdGUgdG8gb3B0aW1pemVcblx0XHRcdFx0fSwgdHJ1ZSksXG5cdFx0XHRcdHAgPSBDLnByb3RvdHlwZSA9IG5ldyBFYXNlKCk7XG5cdFx0XHRwLmNvbnN0cnVjdG9yID0gQztcblx0XHRcdHAuZ2V0UmF0aW8gPSBmO1xuXHRcdFx0cC5jb25maWcgPSBmdW5jdGlvbihhbXBsaXR1ZGUsIHBlcmlvZCkge1xuXHRcdFx0XHRyZXR1cm4gbmV3IEMoYW1wbGl0dWRlLCBwZXJpb2QpO1xuXHRcdFx0fTtcblx0XHRcdHJldHVybiBDO1xuXHRcdH07XG5cdFx0X3dyYXAoXCJFbGFzdGljXCIsXG5cdFx0XHRfY3JlYXRlRWxhc3RpYyhcIkVsYXN0aWNPdXRcIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fcDEgKiBNYXRoLnBvdygyLCAtMTAgKiBwKSAqIE1hdGguc2luKCAocCAtIHRoaXMuX3AzKSAqIHRoaXMuX3AyICkgKyAxO1xuXHRcdFx0fSwgMC4zKSxcblx0XHRcdF9jcmVhdGVFbGFzdGljKFwiRWxhc3RpY0luXCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuIC0odGhpcy5fcDEgKiBNYXRoLnBvdygyLCAxMCAqIChwIC09IDEpKSAqIE1hdGguc2luKCAocCAtIHRoaXMuX3AzKSAqIHRoaXMuX3AyICkpO1xuXHRcdFx0fSwgMC4zKSxcblx0XHRcdF9jcmVhdGVFbGFzdGljKFwiRWxhc3RpY0luT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuICgocCAqPSAyKSA8IDEpID8gLTAuNSAqICh0aGlzLl9wMSAqIE1hdGgucG93KDIsIDEwICogKHAgLT0gMSkpICogTWF0aC5zaW4oIChwIC0gdGhpcy5fcDMpICogdGhpcy5fcDIpKSA6IHRoaXMuX3AxICogTWF0aC5wb3coMiwgLTEwICoocCAtPSAxKSkgKiBNYXRoLnNpbiggKHAgLSB0aGlzLl9wMykgKiB0aGlzLl9wMiApICogMC41ICsgMTtcblx0XHRcdH0sIDAuNDUpXG5cdFx0KTtcblxuXG5cdFx0Ly9FeHBvXG5cdFx0X3dyYXAoXCJFeHBvXCIsXG5cdFx0XHRfY3JlYXRlKFwiRXhwb091dFwiLCBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdHJldHVybiAxIC0gTWF0aC5wb3coMiwgLTEwICogcCk7XG5cdFx0XHR9KSxcblx0XHRcdF9jcmVhdGUoXCJFeHBvSW5cIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRyZXR1cm4gTWF0aC5wb3coMiwgMTAgKiAocCAtIDEpKSAtIDAuMDAxO1xuXHRcdFx0fSksXG5cdFx0XHRfY3JlYXRlKFwiRXhwb0luT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuICgocCAqPSAyKSA8IDEpID8gMC41ICogTWF0aC5wb3coMiwgMTAgKiAocCAtIDEpKSA6IDAuNSAqICgyIC0gTWF0aC5wb3coMiwgLTEwICogKHAgLSAxKSkpO1xuXHRcdFx0fSlcblx0XHQpO1xuXG5cblx0XHQvL1NpbmVcblx0XHRfd3JhcChcIlNpbmVcIixcblx0XHRcdF9jcmVhdGUoXCJTaW5lT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuIE1hdGguc2luKHAgKiBfSEFMRl9QSSk7XG5cdFx0XHR9KSxcblx0XHRcdF9jcmVhdGUoXCJTaW5lSW5cIiwgZnVuY3Rpb24ocCkge1xuXHRcdFx0XHRyZXR1cm4gLU1hdGguY29zKHAgKiBfSEFMRl9QSSkgKyAxO1xuXHRcdFx0fSksXG5cdFx0XHRfY3JlYXRlKFwiU2luZUluT3V0XCIsIGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuIC0wLjUgKiAoTWF0aC5jb3MoTWF0aC5QSSAqIHApIC0gMSk7XG5cdFx0XHR9KVxuXHRcdCk7XG5cblx0XHRfY2xhc3MoXCJlYXNpbmcuRWFzZUxvb2t1cFwiLCB7XG5cdFx0XHRcdGZpbmQ6ZnVuY3Rpb24ocykge1xuXHRcdFx0XHRcdHJldHVybiBFYXNlLm1hcFtzXTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdHJ1ZSk7XG5cblx0XHQvL3JlZ2lzdGVyIHRoZSBub24tc3RhbmRhcmQgZWFzZXNcblx0XHRfZWFzZVJlZyh3LlNsb3dNbywgXCJTbG93TW9cIiwgXCJlYXNlLFwiKTtcblx0XHRfZWFzZVJlZyhSb3VnaEVhc2UsIFwiUm91Z2hFYXNlXCIsIFwiZWFzZSxcIik7XG5cdFx0X2Vhc2VSZWcoU3RlcHBlZEVhc2UsIFwiU3RlcHBlZEVhc2VcIiwgXCJlYXNlLFwiKTtcblxuXHRcdHJldHVybiBCYWNrO1xuXHRcdFxuXHR9LCB0cnVlKTtcblxuXG59KTtcblxuaWYgKF9nc1Njb3BlLl9nc0RlZmluZSkgeyBfZ3NTY29wZS5fZ3NRdWV1ZS5wb3AoKSgpOyB9IC8vbmVjZXNzYXJ5IGluIGNhc2UgVHdlZW5MaXRlIHdhcyBhbHJlYWR5IGxvYWRlZCBzZXBhcmF0ZWx5LlxuXG5cblxuXG5cblxuXG5cblxuXG5cbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBCYXNlIGNsYXNzZXMgbGlrZSBUd2VlbkxpdGUsIFNpbXBsZVRpbWVsaW5lLCBFYXNlLCBUaWNrZXIsIGV0Yy5cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuKGZ1bmN0aW9uKHdpbmRvdywgbW9kdWxlTmFtZSkge1xuXG5cdFx0XCJ1c2Ugc3RyaWN0XCI7XG5cdFx0dmFyIF9nbG9iYWxzID0gd2luZG93LkdyZWVuU29ja0dsb2JhbHMgPSB3aW5kb3cuR3JlZW5Tb2NrR2xvYmFscyB8fCB3aW5kb3c7XG5cdFx0aWYgKF9nbG9iYWxzLlR3ZWVuTGl0ZSkge1xuXHRcdFx0cmV0dXJuOyAvL2luIGNhc2UgdGhlIGNvcmUgc2V0IG9mIGNsYXNzZXMgaXMgYWxyZWFkeSBsb2FkZWQsIGRvbid0IGluc3RhbnRpYXRlIHR3aWNlLlxuXHRcdH1cblx0XHR2YXIgX25hbWVzcGFjZSA9IGZ1bmN0aW9uKG5zKSB7XG5cdFx0XHRcdHZhciBhID0gbnMuc3BsaXQoXCIuXCIpLFxuXHRcdFx0XHRcdHAgPSBfZ2xvYmFscywgaTtcblx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRwW2FbaV1dID0gcCA9IHBbYVtpXV0gfHwge307XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHA7XG5cdFx0XHR9LFxuXHRcdFx0Z3MgPSBfbmFtZXNwYWNlKFwiY29tLmdyZWVuc29ja1wiKSxcblx0XHRcdF90aW55TnVtID0gMC4wMDAwMDAwMDAxLFxuXHRcdFx0X3NsaWNlID0gZnVuY3Rpb24oYSkgeyAvL2Rvbid0IHVzZSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0YXJnZXQsIDApIGJlY2F1c2UgdGhhdCBkb2Vzbid0IHdvcmsgaW4gSUU4IHdpdGggYSBOb2RlTGlzdCB0aGF0J3MgcmV0dXJuZWQgYnkgcXVlcnlTZWxlY3RvckFsbCgpXG5cdFx0XHRcdHZhciBiID0gW10sXG5cdFx0XHRcdFx0bCA9IGEubGVuZ3RoLFxuXHRcdFx0XHRcdGk7XG5cdFx0XHRcdGZvciAoaSA9IDA7IGkgIT09IGw7IGIucHVzaChhW2krK10pKTtcblx0XHRcdFx0cmV0dXJuIGI7XG5cdFx0XHR9LFxuXHRcdFx0X2VtcHR5RnVuYyA9IGZ1bmN0aW9uKCkge30sXG5cdFx0XHRfaXNBcnJheSA9IChmdW5jdGlvbigpIHsgLy93b3JrcyBhcm91bmQgaXNzdWVzIGluIGlmcmFtZSBlbnZpcm9ubWVudHMgd2hlcmUgdGhlIEFycmF5IGdsb2JhbCBpc24ndCBzaGFyZWQsIHRodXMgaWYgdGhlIG9iamVjdCBvcmlnaW5hdGVzIGluIGEgZGlmZmVyZW50IHdpbmRvdy9pZnJhbWUsIFwiKG9iaiBpbnN0YW5jZW9mIEFycmF5KVwiIHdpbGwgZXZhbHVhdGUgZmFsc2UuIFdlIGFkZGVkIHNvbWUgc3BlZWQgb3B0aW1pemF0aW9ucyB0byBhdm9pZCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoKSB1bmxlc3MgaXQncyBhYnNvbHV0ZWx5IG5lY2Vzc2FyeSBiZWNhdXNlIGl0J3MgVkVSWSBzbG93IChsaWtlIDIweCBzbG93ZXIpXG5cdFx0XHRcdHZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsXG5cdFx0XHRcdFx0YXJyYXkgPSB0b1N0cmluZy5jYWxsKFtdKTtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuXHRcdFx0XHRcdHJldHVybiBvYmogIT0gbnVsbCAmJiAob2JqIGluc3RhbmNlb2YgQXJyYXkgfHwgKHR5cGVvZihvYmopID09PSBcIm9iamVjdFwiICYmICEhb2JqLnB1c2ggJiYgdG9TdHJpbmcuY2FsbChvYmopID09PSBhcnJheSkpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSgpKSxcblx0XHRcdGEsIGksIHAsIF90aWNrZXIsIF90aWNrZXJBY3RpdmUsXG5cdFx0XHRfZGVmTG9va3VwID0ge30sXG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQGNvbnN0cnVjdG9yXG5cdFx0XHQgKiBEZWZpbmVzIGEgR3JlZW5Tb2NrIGNsYXNzLCBvcHRpb25hbGx5IHdpdGggYW4gYXJyYXkgb2YgZGVwZW5kZW5jaWVzIHRoYXQgbXVzdCBiZSBpbnN0YW50aWF0ZWQgZmlyc3QgYW5kIHBhc3NlZCBpbnRvIHRoZSBkZWZpbml0aW9uLlxuXHRcdFx0ICogVGhpcyBhbGxvd3MgdXNlcnMgdG8gbG9hZCBHcmVlblNvY2sgSlMgZmlsZXMgaW4gYW55IG9yZGVyIGV2ZW4gaWYgdGhleSBoYXZlIGludGVyZGVwZW5kZW5jaWVzIChsaWtlIENTU1BsdWdpbiBleHRlbmRzIFR3ZWVuUGx1Z2luIHdoaWNoIGlzXG5cdFx0XHQgKiBpbnNpZGUgVHdlZW5MaXRlLmpzLCBidXQgaWYgQ1NTUGx1Z2luIGlzIGxvYWRlZCBmaXJzdCwgaXQgc2hvdWxkIHdhaXQgdG8gcnVuIGl0cyBjb2RlIHVudGlsIFR3ZWVuTGl0ZS5qcyBsb2FkcyBhbmQgaW5zdGFudGlhdGVzIFR3ZWVuUGx1Z2luXG5cdFx0XHQgKiBhbmQgdGhlbiBwYXNzIFR3ZWVuUGx1Z2luIHRvIENTU1BsdWdpbidzIGRlZmluaXRpb24pLiBUaGlzIGlzIGFsbCBkb25lIGF1dG9tYXRpY2FsbHkgYW5kIGludGVybmFsbHkuXG5cdFx0XHQgKlxuXHRcdFx0ICogRXZlcnkgZGVmaW5pdGlvbiB3aWxsIGJlIGFkZGVkIHRvIGEgXCJjb20uZ3JlZW5zb2NrXCIgZ2xvYmFsIG9iamVjdCAodHlwaWNhbGx5IHdpbmRvdywgYnV0IGlmIGEgd2luZG93LkdyZWVuU29ja0dsb2JhbHMgb2JqZWN0IGlzIGZvdW5kLFxuXHRcdFx0ICogaXQgd2lsbCBnbyB0aGVyZSBhcyBvZiB2MS43KS4gRm9yIGV4YW1wbGUsIFR3ZWVuTGl0ZSB3aWxsIGJlIGZvdW5kIGF0IHdpbmRvdy5jb20uZ3JlZW5zb2NrLlR3ZWVuTGl0ZSBhbmQgc2luY2UgaXQncyBhIGdsb2JhbCBjbGFzcyB0aGF0IHNob3VsZCBiZSBhdmFpbGFibGUgYW55d2hlcmUsXG5cdFx0XHQgKiBpdCBpcyBBTFNPIHJlZmVyZW5jZWQgYXQgd2luZG93LlR3ZWVuTGl0ZS4gSG93ZXZlciBzb21lIGNsYXNzZXMgYXJlbid0IGNvbnNpZGVyZWQgZ2xvYmFsLCBsaWtlIHRoZSBiYXNlIGNvbS5ncmVlbnNvY2suY29yZS5BbmltYXRpb24gY2xhc3MsIHNvXG5cdFx0XHQgKiB0aG9zZSB3aWxsIG9ubHkgYmUgYXQgdGhlIHBhY2thZ2UgbGlrZSB3aW5kb3cuY29tLmdyZWVuc29jay5jb3JlLkFuaW1hdGlvbi4gQWdhaW4sIGlmIHlvdSBkZWZpbmUgYSBHcmVlblNvY2tHbG9iYWxzIG9iamVjdCBvbiB0aGUgd2luZG93LCBldmVyeXRoaW5nXG5cdFx0XHQgKiBnZXRzIHR1Y2tlZCBuZWF0bHkgaW5zaWRlIHRoZXJlIGluc3RlYWQgb2Ygb24gdGhlIHdpbmRvdyBkaXJlY3RseS4gVGhpcyBhbGxvd3MgeW91IHRvIGRvIGFkdmFuY2VkIHRoaW5ncyBsaWtlIGxvYWQgbXVsdGlwbGUgdmVyc2lvbnMgb2YgR3JlZW5Tb2NrXG5cdFx0XHQgKiBmaWxlcyBhbmQgcHV0IHRoZW0gaW50byBkaXN0aW5jdCBvYmplY3RzIChpbWFnaW5lIGEgYmFubmVyIGFkIHVzZXMgYSBuZXdlciB2ZXJzaW9uIGJ1dCB0aGUgbWFpbiBzaXRlIHVzZXMgYW4gb2xkZXIgb25lKS4gSW4gdGhhdCBjYXNlLCB5b3UgY291bGRcblx0XHRcdCAqIHNhbmRib3ggdGhlIGJhbm5lciBvbmUgbGlrZTpcblx0XHRcdCAqXG5cdFx0XHQgKiA8c2NyaXB0PlxuXHRcdFx0ICogICAgIHZhciBncyA9IHdpbmRvdy5HcmVlblNvY2tHbG9iYWxzID0ge307IC8vdGhlIG5ld2VyIHZlcnNpb24gd2UncmUgYWJvdXQgdG8gbG9hZCBjb3VsZCBub3cgYmUgcmVmZXJlbmNlZCBpbiBhIFwiZ3NcIiBvYmplY3QsIGxpa2UgZ3MuVHdlZW5MaXRlLnRvKC4uLikuIFVzZSB3aGF0ZXZlciBhbGlhcyB5b3Ugd2FudCBhcyBsb25nIGFzIGl0J3MgdW5pcXVlLCBcImdzXCIgb3IgXCJiYW5uZXJcIiBvciB3aGF0ZXZlci5cblx0XHRcdCAqIDwvc2NyaXB0PlxuXHRcdFx0ICogPHNjcmlwdCBzcmM9XCJqcy9ncmVlbnNvY2svdjEuNy9Ud2Vlbk1heC5qc1wiPjwvc2NyaXB0PlxuXHRcdFx0ICogPHNjcmlwdD5cblx0XHRcdCAqICAgICB3aW5kb3cuR3JlZW5Tb2NrR2xvYmFscyA9IHdpbmRvdy5fZ3NRdWV1ZSA9IHdpbmRvdy5fZ3NEZWZpbmUgPSBudWxsOyAvL3Jlc2V0IGl0IGJhY2sgdG8gbnVsbCAoYWxvbmcgd2l0aCB0aGUgc3BlY2lhbCBfZ3NRdWV1ZSB2YXJpYWJsZSkgc28gdGhhdCB0aGUgbmV4dCBsb2FkIG9mIFR3ZWVuTWF4IGFmZmVjdHMgdGhlIHdpbmRvdyBhbmQgd2UgY2FuIHJlZmVyZW5jZSB0aGluZ3MgZGlyZWN0bHkgbGlrZSBUd2VlbkxpdGUudG8oLi4uKVxuXHRcdFx0ICogPC9zY3JpcHQ+XG5cdFx0XHQgKiA8c2NyaXB0IHNyYz1cImpzL2dyZWVuc29jay92MS42L1R3ZWVuTWF4LmpzXCI+PC9zY3JpcHQ+XG5cdFx0XHQgKiA8c2NyaXB0PlxuXHRcdFx0ICogICAgIGdzLlR3ZWVuTGl0ZS50byguLi4pOyAvL3dvdWxkIHVzZSB2MS43XG5cdFx0XHQgKiAgICAgVHdlZW5MaXRlLnRvKC4uLik7IC8vd291bGQgdXNlIHYxLjZcblx0XHRcdCAqIDwvc2NyaXB0PlxuXHRcdFx0ICpcblx0XHRcdCAqIEBwYXJhbSB7IXN0cmluZ30gbnMgVGhlIG5hbWVzcGFjZSBvZiB0aGUgY2xhc3MgZGVmaW5pdGlvbiwgbGVhdmluZyBvZmYgXCJjb20uZ3JlZW5zb2NrLlwiIGFzIHRoYXQncyBhc3N1bWVkLiBGb3IgZXhhbXBsZSwgXCJUd2VlbkxpdGVcIiBvciBcInBsdWdpbnMuQ1NTUGx1Z2luXCIgb3IgXCJlYXNpbmcuQmFja1wiLlxuXHRcdFx0ICogQHBhcmFtIHshQXJyYXkuPHN0cmluZz59IGRlcGVuZGVuY2llcyBBbiBhcnJheSBvZiBkZXBlbmRlbmNpZXMgKGRlc2NyaWJlZCBhcyB0aGVpciBuYW1lc3BhY2VzIG1pbnVzIFwiY29tLmdyZWVuc29jay5cIiBwcmVmaXgpLiBGb3IgZXhhbXBsZSBbXCJUd2VlbkxpdGVcIixcInBsdWdpbnMuVHdlZW5QbHVnaW5cIixcImNvcmUuQW5pbWF0aW9uXCJdXG5cdFx0XHQgKiBAcGFyYW0geyFmdW5jdGlvbigpOk9iamVjdH0gZnVuYyBUaGUgZnVuY3Rpb24gdGhhdCBzaG91bGQgYmUgY2FsbGVkIGFuZCBwYXNzZWQgdGhlIHJlc29sdmVkIGRlcGVuZGVuY2llcyB3aGljaCB3aWxsIHJldHVybiB0aGUgYWN0dWFsIGNsYXNzIGZvciB0aGlzIGRlZmluaXRpb24uXG5cdFx0XHQgKiBAcGFyYW0ge2Jvb2xlYW49fSBnbG9iYWwgSWYgdHJ1ZSwgdGhlIGNsYXNzIHdpbGwgYmUgYWRkZWQgdG8gdGhlIGdsb2JhbCBzY29wZSAodHlwaWNhbGx5IHdpbmRvdyB1bmxlc3MgeW91IGRlZmluZSBhIHdpbmRvdy5HcmVlblNvY2tHbG9iYWxzIG9iamVjdClcblx0XHRcdCAqL1xuXHRcdFx0RGVmaW5pdGlvbiA9IGZ1bmN0aW9uKG5zLCBkZXBlbmRlbmNpZXMsIGZ1bmMsIGdsb2JhbCkge1xuXHRcdFx0XHR0aGlzLnNjID0gKF9kZWZMb29rdXBbbnNdKSA/IF9kZWZMb29rdXBbbnNdLnNjIDogW107IC8vc3ViY2xhc3Nlc1xuXHRcdFx0XHRfZGVmTG9va3VwW25zXSA9IHRoaXM7XG5cdFx0XHRcdHRoaXMuZ3NDbGFzcyA9IG51bGw7XG5cdFx0XHRcdHRoaXMuZnVuYyA9IGZ1bmM7XG5cdFx0XHRcdHZhciBfY2xhc3NlcyA9IFtdO1xuXHRcdFx0XHR0aGlzLmNoZWNrID0gZnVuY3Rpb24oaW5pdCkge1xuXHRcdFx0XHRcdHZhciBpID0gZGVwZW5kZW5jaWVzLmxlbmd0aCxcblx0XHRcdFx0XHRcdG1pc3NpbmcgPSBpLFxuXHRcdFx0XHRcdFx0Y3VyLCBhLCBuLCBjbDtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdGlmICgoY3VyID0gX2RlZkxvb2t1cFtkZXBlbmRlbmNpZXNbaV1dIHx8IG5ldyBEZWZpbml0aW9uKGRlcGVuZGVuY2llc1tpXSwgW10pKS5nc0NsYXNzKSB7XG5cdFx0XHRcdFx0XHRcdF9jbGFzc2VzW2ldID0gY3VyLmdzQ2xhc3M7XG5cdFx0XHRcdFx0XHRcdG1pc3NpbmctLTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoaW5pdCkge1xuXHRcdFx0XHRcdFx0XHRjdXIuc2MucHVzaCh0aGlzKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKG1pc3NpbmcgPT09IDAgJiYgZnVuYykge1xuXHRcdFx0XHRcdFx0YSA9IChcImNvbS5ncmVlbnNvY2suXCIgKyBucykuc3BsaXQoXCIuXCIpO1xuXHRcdFx0XHRcdFx0biA9IGEucG9wKCk7XG5cdFx0XHRcdFx0XHRjbCA9IF9uYW1lc3BhY2UoYS5qb2luKFwiLlwiKSlbbl0gPSB0aGlzLmdzQ2xhc3MgPSBmdW5jLmFwcGx5KGZ1bmMsIF9jbGFzc2VzKTtcblxuXHRcdFx0XHRcdFx0Ly9leHBvcnRzIHRvIG11bHRpcGxlIGVudmlyb25tZW50c1xuXHRcdFx0XHRcdFx0aWYgKGdsb2JhbCkge1xuXHRcdFx0XHRcdFx0XHRfZ2xvYmFsc1tuXSA9IGNsOyAvL3Byb3ZpZGVzIGEgd2F5IHRvIGF2b2lkIGdsb2JhbCBuYW1lc3BhY2UgcG9sbHV0aW9uLiBCeSBkZWZhdWx0LCB0aGUgbWFpbiBjbGFzc2VzIGxpa2UgVHdlZW5MaXRlLCBQb3dlcjEsIFN0cm9uZywgZXRjLiBhcmUgYWRkZWQgdG8gd2luZG93IHVubGVzcyBhIEdyZWVuU29ja0dsb2JhbHMgaXMgZGVmaW5lZC4gU28gaWYgeW91IHdhbnQgdG8gaGF2ZSB0aGluZ3MgYWRkZWQgdG8gYSBjdXN0b20gb2JqZWN0IGluc3RlYWQsIGp1c3QgZG8gc29tZXRoaW5nIGxpa2Ugd2luZG93LkdyZWVuU29ja0dsb2JhbHMgPSB7fSBiZWZvcmUgbG9hZGluZyBhbnkgR3JlZW5Tb2NrIGZpbGVzLiBZb3UgY2FuIGV2ZW4gc2V0IHVwIGFuIGFsaWFzIGxpa2Ugd2luZG93LkdyZWVuU29ja0dsb2JhbHMgPSB3aW5kb3dzLmdzID0ge30gc28gdGhhdCB5b3UgY2FuIGFjY2VzcyBldmVyeXRoaW5nIGxpa2UgZ3MuVHdlZW5MaXRlLiBBbHNvIHJlbWVtYmVyIHRoYXQgQUxMIGNsYXNzZXMgYXJlIGFkZGVkIHRvIHRoZSB3aW5kb3cuY29tLmdyZWVuc29jayBvYmplY3QgKGluIHRoZWlyIHJlc3BlY3RpdmUgcGFja2FnZXMsIGxpa2UgY29tLmdyZWVuc29jay5lYXNpbmcuUG93ZXIxLCBjb20uZ3JlZW5zb2NrLlR3ZWVuTGl0ZSwgZXRjLilcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZihkZWZpbmUpID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCl7IC8vQU1EXG5cdFx0XHRcdFx0XHRcdFx0ZGVmaW5lKCh3aW5kb3cuR3JlZW5Tb2NrQU1EUGF0aCA/IHdpbmRvdy5HcmVlblNvY2tBTURQYXRoICsgXCIvXCIgOiBcIlwiKSArIG5zLnNwbGl0KFwiLlwiKS5wb3AoKSwgW10sIGZ1bmN0aW9uKCkgeyByZXR1cm4gY2w7IH0pO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKG5zID09PSBtb2R1bGVOYW1lICYmIHR5cGVvZihtb2R1bGUpICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzKXsgLy9ub2RlXG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlLmV4cG9ydHMgPSBjbDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IHRoaXMuc2MubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5zY1tpXS5jaGVjaygpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblx0XHRcdFx0dGhpcy5jaGVjayh0cnVlKTtcblx0XHRcdH0sXG5cblx0XHRcdC8vdXNlZCB0byBjcmVhdGUgRGVmaW5pdGlvbiBpbnN0YW5jZXMgKHdoaWNoIGJhc2ljYWxseSByZWdpc3RlcnMgYSBjbGFzcyB0aGF0IGhhcyBkZXBlbmRlbmNpZXMpLlxuXHRcdFx0X2dzRGVmaW5lID0gd2luZG93Ll9nc0RlZmluZSA9IGZ1bmN0aW9uKG5zLCBkZXBlbmRlbmNpZXMsIGZ1bmMsIGdsb2JhbCkge1xuXHRcdFx0XHRyZXR1cm4gbmV3IERlZmluaXRpb24obnMsIGRlcGVuZGVuY2llcywgZnVuYywgZ2xvYmFsKTtcblx0XHRcdH0sXG5cblx0XHRcdC8vYSBxdWljayB3YXkgdG8gY3JlYXRlIGEgY2xhc3MgdGhhdCBkb2Vzbid0IGhhdmUgYW55IGRlcGVuZGVuY2llcy4gUmV0dXJucyB0aGUgY2xhc3MsIGJ1dCBmaXJzdCByZWdpc3RlcnMgaXQgaW4gdGhlIEdyZWVuU29jayBuYW1lc3BhY2Ugc28gdGhhdCBvdGhlciBjbGFzc2VzIGNhbiBncmFiIGl0IChvdGhlciBjbGFzc2VzIG1pZ2h0IGJlIGRlcGVuZGVudCBvbiB0aGUgY2xhc3MpLlxuXHRcdFx0X2NsYXNzID0gZ3MuX2NsYXNzID0gZnVuY3Rpb24obnMsIGZ1bmMsIGdsb2JhbCkge1xuXHRcdFx0XHRmdW5jID0gZnVuYyB8fCBmdW5jdGlvbigpIHt9O1xuXHRcdFx0XHRfZ3NEZWZpbmUobnMsIFtdLCBmdW5jdGlvbigpeyByZXR1cm4gZnVuYzsgfSwgZ2xvYmFsKTtcblx0XHRcdFx0cmV0dXJuIGZ1bmM7XG5cdFx0XHR9O1xuXG5cdFx0X2dzRGVmaW5lLmdsb2JhbHMgPSBfZ2xvYmFscztcblxuXG5cbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBFYXNlXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0XHR2YXIgX2Jhc2VQYXJhbXMgPSBbMCwgMCwgMSwgMV0sXG5cdFx0XHRfYmxhbmtBcnJheSA9IFtdLFxuXHRcdFx0RWFzZSA9IF9jbGFzcyhcImVhc2luZy5FYXNlXCIsIGZ1bmN0aW9uKGZ1bmMsIGV4dHJhUGFyYW1zLCB0eXBlLCBwb3dlcikge1xuXHRcdFx0XHR0aGlzLl9mdW5jID0gZnVuYztcblx0XHRcdFx0dGhpcy5fdHlwZSA9IHR5cGUgfHwgMDtcblx0XHRcdFx0dGhpcy5fcG93ZXIgPSBwb3dlciB8fCAwO1xuXHRcdFx0XHR0aGlzLl9wYXJhbXMgPSBleHRyYVBhcmFtcyA/IF9iYXNlUGFyYW1zLmNvbmNhdChleHRyYVBhcmFtcykgOiBfYmFzZVBhcmFtcztcblx0XHRcdH0sIHRydWUpLFxuXHRcdFx0X2Vhc2VNYXAgPSBFYXNlLm1hcCA9IHt9LFxuXHRcdFx0X2Vhc2VSZWcgPSBFYXNlLnJlZ2lzdGVyID0gZnVuY3Rpb24oZWFzZSwgbmFtZXMsIHR5cGVzLCBjcmVhdGUpIHtcblx0XHRcdFx0dmFyIG5hID0gbmFtZXMuc3BsaXQoXCIsXCIpLFxuXHRcdFx0XHRcdGkgPSBuYS5sZW5ndGgsXG5cdFx0XHRcdFx0dGEgPSAodHlwZXMgfHwgXCJlYXNlSW4sZWFzZU91dCxlYXNlSW5PdXRcIikuc3BsaXQoXCIsXCIpLFxuXHRcdFx0XHRcdGUsIG5hbWUsIGosIHR5cGU7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdG5hbWUgPSBuYVtpXTtcblx0XHRcdFx0XHRlID0gY3JlYXRlID8gX2NsYXNzKFwiZWFzaW5nLlwiK25hbWUsIG51bGwsIHRydWUpIDogZ3MuZWFzaW5nW25hbWVdIHx8IHt9O1xuXHRcdFx0XHRcdGogPSB0YS5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taiA+IC0xKSB7XG5cdFx0XHRcdFx0XHR0eXBlID0gdGFbal07XG5cdFx0XHRcdFx0XHRfZWFzZU1hcFtuYW1lICsgXCIuXCIgKyB0eXBlXSA9IF9lYXNlTWFwW3R5cGUgKyBuYW1lXSA9IGVbdHlwZV0gPSBlYXNlLmdldFJhdGlvID8gZWFzZSA6IGVhc2VbdHlwZV0gfHwgbmV3IGVhc2UoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRwID0gRWFzZS5wcm90b3R5cGU7XG5cdFx0cC5fY2FsY0VuZCA9IGZhbHNlO1xuXHRcdHAuZ2V0UmF0aW8gPSBmdW5jdGlvbihwKSB7XG5cdFx0XHRpZiAodGhpcy5fZnVuYykge1xuXHRcdFx0XHR0aGlzLl9wYXJhbXNbMF0gPSBwO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZnVuYy5hcHBseShudWxsLCB0aGlzLl9wYXJhbXMpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIHQgPSB0aGlzLl90eXBlLFxuXHRcdFx0XHRwdyA9IHRoaXMuX3Bvd2VyLFxuXHRcdFx0XHRyID0gKHQgPT09IDEpID8gMSAtIHAgOiAodCA9PT0gMikgPyBwIDogKHAgPCAwLjUpID8gcCAqIDIgOiAoMSAtIHApICogMjtcblx0XHRcdGlmIChwdyA9PT0gMSkge1xuXHRcdFx0XHRyICo9IHI7XG5cdFx0XHR9IGVsc2UgaWYgKHB3ID09PSAyKSB7XG5cdFx0XHRcdHIgKj0gciAqIHI7XG5cdFx0XHR9IGVsc2UgaWYgKHB3ID09PSAzKSB7XG5cdFx0XHRcdHIgKj0gciAqIHIgKiByO1xuXHRcdFx0fSBlbHNlIGlmIChwdyA9PT0gNCkge1xuXHRcdFx0XHRyICo9IHIgKiByICogciAqIHI7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKHQgPT09IDEpID8gMSAtIHIgOiAodCA9PT0gMikgPyByIDogKHAgPCAwLjUpID8gciAvIDIgOiAxIC0gKHIgLyAyKTtcblx0XHR9O1xuXG5cdFx0Ly9jcmVhdGUgYWxsIHRoZSBzdGFuZGFyZCBlYXNlcyBsaWtlIExpbmVhciwgUXVhZCwgQ3ViaWMsIFF1YXJ0LCBRdWludCwgU3Ryb25nLCBQb3dlcjAsIFBvd2VyMSwgUG93ZXIyLCBQb3dlcjMsIGFuZCBQb3dlcjQgKGVhY2ggd2l0aCBlYXNlSW4sIGVhc2VPdXQsIGFuZCBlYXNlSW5PdXQpXG5cdFx0YSA9IFtcIkxpbmVhclwiLFwiUXVhZFwiLFwiQ3ViaWNcIixcIlF1YXJ0XCIsXCJRdWludCxTdHJvbmdcIl07XG5cdFx0aSA9IGEubGVuZ3RoO1xuXHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0cCA9IGFbaV0rXCIsUG93ZXJcIitpO1xuXHRcdFx0X2Vhc2VSZWcobmV3IEVhc2UobnVsbCxudWxsLDEsaSksIHAsIFwiZWFzZU91dFwiLCB0cnVlKTtcblx0XHRcdF9lYXNlUmVnKG5ldyBFYXNlKG51bGwsbnVsbCwyLGkpLCBwLCBcImVhc2VJblwiICsgKChpID09PSAwKSA/IFwiLGVhc2VOb25lXCIgOiBcIlwiKSk7XG5cdFx0XHRfZWFzZVJlZyhuZXcgRWFzZShudWxsLG51bGwsMyxpKSwgcCwgXCJlYXNlSW5PdXRcIik7XG5cdFx0fVxuXHRcdF9lYXNlTWFwLmxpbmVhciA9IGdzLmVhc2luZy5MaW5lYXIuZWFzZUluO1xuXHRcdF9lYXNlTWFwLnN3aW5nID0gZ3MuZWFzaW5nLlF1YWQuZWFzZUluT3V0OyAvL2ZvciBqUXVlcnkgZm9sa3NcblxuXG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogRXZlbnREaXNwYXRjaGVyXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0XHR2YXIgRXZlbnREaXNwYXRjaGVyID0gX2NsYXNzKFwiZXZlbnRzLkV2ZW50RGlzcGF0Y2hlclwiLCBmdW5jdGlvbih0YXJnZXQpIHtcblx0XHRcdHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuXHRcdFx0dGhpcy5fZXZlbnRUYXJnZXQgPSB0YXJnZXQgfHwgdGhpcztcblx0XHR9KTtcblx0XHRwID0gRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZTtcblxuXHRcdHAuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrLCBzY29wZSwgdXNlUGFyYW0sIHByaW9yaXR5KSB7XG5cdFx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0XHR2YXIgbGlzdCA9IHRoaXMuX2xpc3RlbmVyc1t0eXBlXSxcblx0XHRcdFx0aW5kZXggPSAwLFxuXHRcdFx0XHRsaXN0ZW5lciwgaTtcblx0XHRcdGlmIChsaXN0ID09IG51bGwpIHtcblx0XHRcdFx0dGhpcy5fbGlzdGVuZXJzW3R5cGVdID0gbGlzdCA9IFtdO1xuXHRcdFx0fVxuXHRcdFx0aSA9IGxpc3QubGVuZ3RoO1xuXHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdGxpc3RlbmVyID0gbGlzdFtpXTtcblx0XHRcdFx0aWYgKGxpc3RlbmVyLmMgPT09IGNhbGxiYWNrICYmIGxpc3RlbmVyLnMgPT09IHNjb3BlKSB7XG5cdFx0XHRcdFx0bGlzdC5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoaW5kZXggPT09IDAgJiYgbGlzdGVuZXIucHIgPCBwcmlvcml0eSkge1xuXHRcdFx0XHRcdGluZGV4ID0gaSArIDE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGxpc3Quc3BsaWNlKGluZGV4LCAwLCB7YzpjYWxsYmFjaywgczpzY29wZSwgdXA6dXNlUGFyYW0sIHByOnByaW9yaXR5fSk7XG5cdFx0XHRpZiAodGhpcyA9PT0gX3RpY2tlciAmJiAhX3RpY2tlckFjdGl2ZSkge1xuXHRcdFx0XHRfdGlja2VyLndha2UoKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cC5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgY2FsbGJhY2spIHtcblx0XHRcdHZhciBsaXN0ID0gdGhpcy5fbGlzdGVuZXJzW3R5cGVdLCBpO1xuXHRcdFx0aWYgKGxpc3QpIHtcblx0XHRcdFx0aSA9IGxpc3QubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRpZiAobGlzdFtpXS5jID09PSBjYWxsYmFjaykge1xuXHRcdFx0XHRcdFx0bGlzdC5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHAuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uKHR5cGUpIHtcblx0XHRcdHZhciBsaXN0ID0gdGhpcy5fbGlzdGVuZXJzW3R5cGVdLFxuXHRcdFx0XHRpLCB0LCBsaXN0ZW5lcjtcblx0XHRcdGlmIChsaXN0KSB7XG5cdFx0XHRcdGkgPSBsaXN0Lmxlbmd0aDtcblx0XHRcdFx0dCA9IHRoaXMuX2V2ZW50VGFyZ2V0O1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRsaXN0ZW5lciA9IGxpc3RbaV07XG5cdFx0XHRcdFx0aWYgKGxpc3RlbmVyKSB7XG5cdFx0XHRcdFx0XHRpZiAobGlzdGVuZXIudXApIHtcblx0XHRcdFx0XHRcdFx0bGlzdGVuZXIuYy5jYWxsKGxpc3RlbmVyLnMgfHwgdCwge3R5cGU6dHlwZSwgdGFyZ2V0OnR9KTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGxpc3RlbmVyLmMuY2FsbChsaXN0ZW5lci5zIHx8IHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIFRpY2tlclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG4gXHRcdHZhciBfcmVxQW5pbUZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSxcblx0XHRcdF9jYW5jZWxBbmltRnJhbWUgPSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUsXG5cdFx0XHRfZ2V0VGltZSA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkge3JldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTt9LFxuXHRcdFx0X2xhc3RVcGRhdGUgPSBfZ2V0VGltZSgpO1xuXG5cdFx0Ly9ub3cgdHJ5IHRvIGRldGVybWluZSB0aGUgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGFuZCBjYW5jZWxBbmltYXRpb25GcmFtZSBmdW5jdGlvbnMgYW5kIGlmIG5vbmUgYXJlIGZvdW5kLCB3ZSdsbCB1c2UgYSBzZXRUaW1lb3V0KCkvY2xlYXJUaW1lb3V0KCkgcG9seWZpbGwuXG5cdFx0YSA9IFtcIm1zXCIsXCJtb3pcIixcIndlYmtpdFwiLFwib1wiXTtcblx0XHRpID0gYS5sZW5ndGg7XG5cdFx0d2hpbGUgKC0taSA+IC0xICYmICFfcmVxQW5pbUZyYW1lKSB7XG5cdFx0XHRfcmVxQW5pbUZyYW1lID0gd2luZG93W2FbaV0gKyBcIlJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtcblx0XHRcdF9jYW5jZWxBbmltRnJhbWUgPSB3aW5kb3dbYVtpXSArIFwiQ2FuY2VsQW5pbWF0aW9uRnJhbWVcIl0gfHwgd2luZG93W2FbaV0gKyBcIkNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtcblx0XHR9XG5cblx0XHRfY2xhc3MoXCJUaWNrZXJcIiwgZnVuY3Rpb24oZnBzLCB1c2VSQUYpIHtcblx0XHRcdHZhciBfc2VsZiA9IHRoaXMsXG5cdFx0XHRcdF9zdGFydFRpbWUgPSBfZ2V0VGltZSgpLFxuXHRcdFx0XHRfdXNlUkFGID0gKHVzZVJBRiAhPT0gZmFsc2UgJiYgX3JlcUFuaW1GcmFtZSksXG5cdFx0XHRcdF9sYWdUaHJlc2hvbGQgPSA1MDAsXG5cdFx0XHRcdF9hZGp1c3RlZExhZyA9IDMzLFxuXHRcdFx0XHRfdGlja1dvcmQgPSBcInRpY2tcIiwgLy9oZWxwcyByZWR1Y2UgZ2MgYnVyZGVuXG5cdFx0XHRcdF9mcHMsIF9yZXEsIF9pZCwgX2dhcCwgX25leHRUaW1lLFxuXHRcdFx0XHRfdGljayA9IGZ1bmN0aW9uKG1hbnVhbCkge1xuXHRcdFx0XHRcdHZhciBlbGFwc2VkID0gX2dldFRpbWUoKSAtIF9sYXN0VXBkYXRlLFxuXHRcdFx0XHRcdFx0b3ZlcmxhcCwgZGlzcGF0Y2g7XG5cdFx0XHRcdFx0aWYgKGVsYXBzZWQgPiBfbGFnVGhyZXNob2xkKSB7XG5cdFx0XHRcdFx0XHRfc3RhcnRUaW1lICs9IGVsYXBzZWQgLSBfYWRqdXN0ZWRMYWc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdF9sYXN0VXBkYXRlICs9IGVsYXBzZWQ7XG5cdFx0XHRcdFx0X3NlbGYudGltZSA9IChfbGFzdFVwZGF0ZSAtIF9zdGFydFRpbWUpIC8gMTAwMDtcblx0XHRcdFx0XHRvdmVybGFwID0gX3NlbGYudGltZSAtIF9uZXh0VGltZTtcblx0XHRcdFx0XHRpZiAoIV9mcHMgfHwgb3ZlcmxhcCA+IDAgfHwgbWFudWFsID09PSB0cnVlKSB7XG5cdFx0XHRcdFx0XHRfc2VsZi5mcmFtZSsrO1xuXHRcdFx0XHRcdFx0X25leHRUaW1lICs9IG92ZXJsYXAgKyAob3ZlcmxhcCA+PSBfZ2FwID8gMC4wMDQgOiBfZ2FwIC0gb3ZlcmxhcCk7XG5cdFx0XHRcdFx0XHRkaXNwYXRjaCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChtYW51YWwgIT09IHRydWUpIHsgLy9tYWtlIHN1cmUgdGhlIHJlcXVlc3QgaXMgbWFkZSBiZWZvcmUgd2UgZGlzcGF0Y2ggdGhlIFwidGlja1wiIGV2ZW50IHNvIHRoYXQgdGltaW5nIGlzIG1haW50YWluZWQuIE90aGVyd2lzZSwgaWYgcHJvY2Vzc2luZyB0aGUgXCJ0aWNrXCIgcmVxdWlyZXMgYSBidW5jaCBvZiB0aW1lIChsaWtlIDE1bXMpIGFuZCB3ZSdyZSB1c2luZyBhIHNldFRpbWVvdXQoKSB0aGF0J3MgYmFzZWQgb24gMTYuN21zLCBpdCdkIHRlY2huaWNhbGx5IHRha2UgMzEuN21zIGJldHdlZW4gZnJhbWVzIG90aGVyd2lzZS5cblx0XHRcdFx0XHRcdF9pZCA9IF9yZXEoX3RpY2spO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoZGlzcGF0Y2gpIHtcblx0XHRcdFx0XHRcdF9zZWxmLmRpc3BhdGNoRXZlbnQoX3RpY2tXb3JkKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0XHRcdEV2ZW50RGlzcGF0Y2hlci5jYWxsKF9zZWxmKTtcblx0XHRcdF9zZWxmLnRpbWUgPSBfc2VsZi5mcmFtZSA9IDA7XG5cdFx0XHRfc2VsZi50aWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdF90aWNrKHRydWUpO1xuXHRcdFx0fTtcblxuXHRcdFx0X3NlbGYubGFnU21vb3RoaW5nID0gZnVuY3Rpb24odGhyZXNob2xkLCBhZGp1c3RlZExhZykge1xuXHRcdFx0XHRfbGFnVGhyZXNob2xkID0gdGhyZXNob2xkIHx8ICgxIC8gX3RpbnlOdW0pOyAvL3plcm8gc2hvdWxkIGJlIGludGVycHJldGVkIGFzIGJhc2ljYWxseSB1bmxpbWl0ZWRcblx0XHRcdFx0X2FkanVzdGVkTGFnID0gTWF0aC5taW4oYWRqdXN0ZWRMYWcsIF9sYWdUaHJlc2hvbGQsIDApO1xuXHRcdFx0fTtcblxuXHRcdFx0X3NlbGYuc2xlZXAgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKF9pZCA9PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghX3VzZVJBRiB8fCAhX2NhbmNlbEFuaW1GcmFtZSkge1xuXHRcdFx0XHRcdGNsZWFyVGltZW91dChfaWQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdF9jYW5jZWxBbmltRnJhbWUoX2lkKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRfcmVxID0gX2VtcHR5RnVuYztcblx0XHRcdFx0X2lkID0gbnVsbDtcblx0XHRcdFx0aWYgKF9zZWxmID09PSBfdGlja2VyKSB7XG5cdFx0XHRcdFx0X3RpY2tlckFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0XHRfc2VsZi53YWtlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChfaWQgIT09IG51bGwpIHtcblx0XHRcdFx0XHRfc2VsZi5zbGVlcCgpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKF9zZWxmLmZyYW1lID4gMTApIHsgLy9kb24ndCB0cmlnZ2VyIGxhZ1Ntb290aGluZyBpZiB3ZSdyZSBqdXN0IHdha2luZyB1cCwgYW5kIG1ha2Ugc3VyZSB0aGF0IGF0IGxlYXN0IDEwIGZyYW1lcyBoYXZlIGVsYXBzZWQgYmVjYXVzZSBvZiB0aGUgaU9TIGJ1ZyB0aGF0IHdlIHdvcmsgYXJvdW5kIGJlbG93IHdpdGggdGhlIDEuNS1zZWNvbmQgc2V0VGltb3V0KCkuXG5cdFx0XHRcdFx0X2xhc3RVcGRhdGUgPSBfZ2V0VGltZSgpIC0gX2xhZ1RocmVzaG9sZCArIDU7XG5cdFx0XHRcdH1cblx0XHRcdFx0X3JlcSA9IChfZnBzID09PSAwKSA/IF9lbXB0eUZ1bmMgOiAoIV91c2VSQUYgfHwgIV9yZXFBbmltRnJhbWUpID8gZnVuY3Rpb24oZikgeyByZXR1cm4gc2V0VGltZW91dChmLCAoKF9uZXh0VGltZSAtIF9zZWxmLnRpbWUpICogMTAwMCArIDEpIHwgMCk7IH0gOiBfcmVxQW5pbUZyYW1lO1xuXHRcdFx0XHRpZiAoX3NlbGYgPT09IF90aWNrZXIpIHtcblx0XHRcdFx0XHRfdGlja2VyQWN0aXZlID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRfdGljaygyKTtcblx0XHRcdH07XG5cblx0XHRcdF9zZWxmLmZwcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHJldHVybiBfZnBzO1xuXHRcdFx0XHR9XG5cdFx0XHRcdF9mcHMgPSB2YWx1ZTtcblx0XHRcdFx0X2dhcCA9IDEgLyAoX2ZwcyB8fCA2MCk7XG5cdFx0XHRcdF9uZXh0VGltZSA9IHRoaXMudGltZSArIF9nYXA7XG5cdFx0XHRcdF9zZWxmLndha2UoKTtcblx0XHRcdH07XG5cblx0XHRcdF9zZWxmLnVzZVJBRiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHJldHVybiBfdXNlUkFGO1xuXHRcdFx0XHR9XG5cdFx0XHRcdF9zZWxmLnNsZWVwKCk7XG5cdFx0XHRcdF91c2VSQUYgPSB2YWx1ZTtcblx0XHRcdFx0X3NlbGYuZnBzKF9mcHMpO1xuXHRcdFx0fTtcblx0XHRcdF9zZWxmLmZwcyhmcHMpO1xuXG5cdFx0XHQvL2EgYnVnIGluIGlPUyA2IFNhZmFyaSBvY2Nhc2lvbmFsbHkgcHJldmVudHMgdGhlIHJlcXVlc3RBbmltYXRpb25GcmFtZSBmcm9tIHdvcmtpbmcgaW5pdGlhbGx5LCBzbyB3ZSB1c2UgYSAxLjUtc2Vjb25kIHRpbWVvdXQgdGhhdCBhdXRvbWF0aWNhbGx5IGZhbGxzIGJhY2sgdG8gc2V0VGltZW91dCgpIGlmIGl0IHNlbnNlcyB0aGlzIGNvbmRpdGlvbi5cblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChfdXNlUkFGICYmIF9zZWxmLmZyYW1lIDwgNSkge1xuXHRcdFx0XHRcdF9zZWxmLnVzZVJBRihmYWxzZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIDE1MDApO1xuXHRcdH0pO1xuXG5cdFx0cCA9IGdzLlRpY2tlci5wcm90b3R5cGUgPSBuZXcgZ3MuZXZlbnRzLkV2ZW50RGlzcGF0Y2hlcigpO1xuXHRcdHAuY29uc3RydWN0b3IgPSBncy5UaWNrZXI7XG5cblxuLypcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIEFuaW1hdGlvblxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cdFx0dmFyIEFuaW1hdGlvbiA9IF9jbGFzcyhcImNvcmUuQW5pbWF0aW9uXCIsIGZ1bmN0aW9uKGR1cmF0aW9uLCB2YXJzKSB7XG5cdFx0XHRcdHRoaXMudmFycyA9IHZhcnMgPSB2YXJzIHx8IHt9O1xuXHRcdFx0XHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX3RvdGFsRHVyYXRpb24gPSBkdXJhdGlvbiB8fCAwO1xuXHRcdFx0XHR0aGlzLl9kZWxheSA9IE51bWJlcih2YXJzLmRlbGF5KSB8fCAwO1xuXHRcdFx0XHR0aGlzLl90aW1lU2NhbGUgPSAxO1xuXHRcdFx0XHR0aGlzLl9hY3RpdmUgPSAodmFycy5pbW1lZGlhdGVSZW5kZXIgPT09IHRydWUpO1xuXHRcdFx0XHR0aGlzLmRhdGEgPSB2YXJzLmRhdGE7XG5cdFx0XHRcdHRoaXMuX3JldmVyc2VkID0gKHZhcnMucmV2ZXJzZWQgPT09IHRydWUpO1xuXG5cdFx0XHRcdGlmICghX3Jvb3RUaW1lbGluZSkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoIV90aWNrZXJBY3RpdmUpIHsgLy9zb21lIGJyb3dzZXJzIChsaWtlIGlPUyA2IFNhZmFyaSkgc2h1dCBkb3duIEphdmFTY3JpcHQgZXhlY3V0aW9uIHdoZW4gdGhlIHRhYiBpcyBkaXNhYmxlZCBhbmQgdGhleSBbb2NjYXNpb25hbGx5XSBuZWdsZWN0IHRvIHN0YXJ0IHVwIHJlcXVlc3RBbmltYXRpb25GcmFtZSBhZ2FpbiB3aGVuIHJldHVybmluZyAtIHRoaXMgY29kZSBlbnN1cmVzIHRoYXQgdGhlIGVuZ2luZSBzdGFydHMgdXAgYWdhaW4gcHJvcGVybHkuXG5cdFx0XHRcdFx0X3RpY2tlci53YWtlKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgdGwgPSB0aGlzLnZhcnMudXNlRnJhbWVzID8gX3Jvb3RGcmFtZXNUaW1lbGluZSA6IF9yb290VGltZWxpbmU7XG5cdFx0XHRcdHRsLmFkZCh0aGlzLCB0bC5fdGltZSk7XG5cblx0XHRcdFx0aWYgKHRoaXMudmFycy5wYXVzZWQpIHtcblx0XHRcdFx0XHR0aGlzLnBhdXNlZCh0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRfdGlja2VyID0gQW5pbWF0aW9uLnRpY2tlciA9IG5ldyBncy5UaWNrZXIoKTtcblx0XHRwID0gQW5pbWF0aW9uLnByb3RvdHlwZTtcblx0XHRwLl9kaXJ0eSA9IHAuX2djID0gcC5faW5pdHRlZCA9IHAuX3BhdXNlZCA9IGZhbHNlO1xuXHRcdHAuX3RvdGFsVGltZSA9IHAuX3RpbWUgPSAwO1xuXHRcdHAuX3Jhd1ByZXZUaW1lID0gLTE7XG5cdFx0cC5fbmV4dCA9IHAuX2xhc3QgPSBwLl9vblVwZGF0ZSA9IHAuX3RpbWVsaW5lID0gcC50aW1lbGluZSA9IG51bGw7XG5cdFx0cC5fcGF1c2VkID0gZmFsc2U7XG5cblxuXHRcdC8vc29tZSBicm93c2VycyAobGlrZSBpT1MpIG9jY2FzaW9uYWxseSBkcm9wIHRoZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgZXZlbnQgd2hlbiB0aGUgdXNlciBzd2l0Y2hlcyB0byBhIGRpZmZlcmVudCB0YWIgYW5kIHRoZW4gY29tZXMgYmFjayBhZ2Fpbiwgc28gd2UgdXNlIGEgMi1zZWNvbmQgc2V0VGltZW91dCgpIHRvIHNlbnNlIGlmL3doZW4gdGhhdCBjb25kaXRpb24gb2NjdXJzIGFuZCB0aGVuIHdha2UoKSB0aGUgdGlja2VyLlxuXHRcdHZhciBfY2hlY2tUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChfdGlja2VyQWN0aXZlICYmIF9nZXRUaW1lKCkgLSBfbGFzdFVwZGF0ZSA+IDIwMDApIHtcblx0XHRcdFx0XHRfdGlja2VyLndha2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzZXRUaW1lb3V0KF9jaGVja1RpbWVvdXQsIDIwMDApO1xuXHRcdFx0fTtcblx0XHRfY2hlY2tUaW1lb3V0KCk7XG5cblxuXHRcdHAucGxheSA9IGZ1bmN0aW9uKGZyb20sIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRpZiAoZnJvbSAhPSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuc2Vlayhmcm9tLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXZlcnNlZChmYWxzZSkucGF1c2VkKGZhbHNlKTtcblx0XHR9O1xuXG5cdFx0cC5wYXVzZSA9IGZ1bmN0aW9uKGF0VGltZSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdGlmIChhdFRpbWUgIT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLnNlZWsoYXRUaW1lLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5wYXVzZWQodHJ1ZSk7XG5cdFx0fTtcblxuXHRcdHAucmVzdW1lID0gZnVuY3Rpb24oZnJvbSwgc3VwcHJlc3NFdmVudHMpIHtcblx0XHRcdGlmIChmcm9tICE9IG51bGwpIHtcblx0XHRcdFx0dGhpcy5zZWVrKGZyb20sIHN1cHByZXNzRXZlbnRzKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnBhdXNlZChmYWxzZSk7XG5cdFx0fTtcblxuXHRcdHAuc2VlayA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy50b3RhbFRpbWUoTnVtYmVyKHRpbWUpLCBzdXBwcmVzc0V2ZW50cyAhPT0gZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLnJlc3RhcnQgPSBmdW5jdGlvbihpbmNsdWRlRGVsYXksIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXZlcnNlZChmYWxzZSkucGF1c2VkKGZhbHNlKS50b3RhbFRpbWUoaW5jbHVkZURlbGF5ID8gLXRoaXMuX2RlbGF5IDogMCwgKHN1cHByZXNzRXZlbnRzICE9PSBmYWxzZSksIHRydWUpO1xuXHRcdH07XG5cblx0XHRwLnJldmVyc2UgPSBmdW5jdGlvbihmcm9tLCBzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0aWYgKGZyb20gIT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLnNlZWsoKGZyb20gfHwgdGhpcy50b3RhbER1cmF0aW9uKCkpLCBzdXBwcmVzc0V2ZW50cyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy5yZXZlcnNlZCh0cnVlKS5wYXVzZWQoZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLnJlbmRlciA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSkge1xuXHRcdFx0Ly9zdHViIC0gd2Ugb3ZlcnJpZGUgdGhpcyBtZXRob2QgaW4gc3ViY2xhc3Nlcy5cblx0XHR9O1xuXG5cdFx0cC5pbnZhbGlkYXRlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR0aGlzLl90aW1lID0gdGhpcy5fdG90YWxUaW1lID0gMDtcblx0XHRcdHRoaXMuX2luaXR0ZWQgPSB0aGlzLl9nYyA9IGZhbHNlO1xuXHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSAtMTtcblx0XHRcdGlmICh0aGlzLl9nYyB8fCAhdGhpcy50aW1lbGluZSkge1xuXHRcdFx0XHR0aGlzLl9lbmFibGVkKHRydWUpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuaXNBY3RpdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0bCA9IHRoaXMuX3RpbWVsaW5lLCAvL3RoZSAyIHJvb3QgdGltZWxpbmVzIHdvbid0IGhhdmUgYSBfdGltZWxpbmU7IHRoZXkncmUgYWx3YXlzIGFjdGl2ZS5cblx0XHRcdFx0c3RhcnRUaW1lID0gdGhpcy5fc3RhcnRUaW1lLFxuXHRcdFx0XHRyYXdUaW1lO1xuXHRcdFx0cmV0dXJuICghdGwgfHwgKCF0aGlzLl9nYyAmJiAhdGhpcy5fcGF1c2VkICYmIHRsLmlzQWN0aXZlKCkgJiYgKHJhd1RpbWUgPSB0bC5yYXdUaW1lKCkpID49IHN0YXJ0VGltZSAmJiByYXdUaW1lIDwgc3RhcnRUaW1lICsgdGhpcy50b3RhbER1cmF0aW9uKCkgLyB0aGlzLl90aW1lU2NhbGUpKTtcblx0XHR9O1xuXG5cdFx0cC5fZW5hYmxlZCA9IGZ1bmN0aW9uIChlbmFibGVkLCBpZ25vcmVUaW1lbGluZSkge1xuXHRcdFx0aWYgKCFfdGlja2VyQWN0aXZlKSB7XG5cdFx0XHRcdF90aWNrZXIud2FrZSgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZ2MgPSAhZW5hYmxlZDtcblx0XHRcdHRoaXMuX2FjdGl2ZSA9IHRoaXMuaXNBY3RpdmUoKTtcblx0XHRcdGlmIChpZ25vcmVUaW1lbGluZSAhPT0gdHJ1ZSkge1xuXHRcdFx0XHRpZiAoZW5hYmxlZCAmJiAhdGhpcy50aW1lbGluZSkge1xuXHRcdFx0XHRcdHRoaXMuX3RpbWVsaW5lLmFkZCh0aGlzLCB0aGlzLl9zdGFydFRpbWUgLSB0aGlzLl9kZWxheSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIWVuYWJsZWQgJiYgdGhpcy50aW1lbGluZSkge1xuXHRcdFx0XHRcdHRoaXMuX3RpbWVsaW5lLl9yZW1vdmUodGhpcywgdHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9O1xuXG5cblx0XHRwLl9raWxsID0gZnVuY3Rpb24odmFycywgdGFyZ2V0KSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLmtpbGwgPSBmdW5jdGlvbih2YXJzLCB0YXJnZXQpIHtcblx0XHRcdHRoaXMuX2tpbGwodmFycywgdGFyZ2V0KTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLl91bmNhY2hlID0gZnVuY3Rpb24oaW5jbHVkZVNlbGYpIHtcblx0XHRcdHZhciB0d2VlbiA9IGluY2x1ZGVTZWxmID8gdGhpcyA6IHRoaXMudGltZWxpbmU7XG5cdFx0XHR3aGlsZSAodHdlZW4pIHtcblx0XHRcdFx0dHdlZW4uX2RpcnR5ID0gdHJ1ZTtcblx0XHRcdFx0dHdlZW4gPSB0d2Vlbi50aW1lbGluZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLl9zd2FwU2VsZkluUGFyYW1zID0gZnVuY3Rpb24ocGFyYW1zKSB7XG5cdFx0XHR2YXIgaSA9IHBhcmFtcy5sZW5ndGgsXG5cdFx0XHRcdGNvcHkgPSBwYXJhbXMuY29uY2F0KCk7XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0aWYgKHBhcmFtc1tpXSA9PT0gXCJ7c2VsZn1cIikge1xuXHRcdFx0XHRcdGNvcHlbaV0gPSB0aGlzO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY29weTtcblx0XHR9O1xuXG5cdFx0cC5fY2FsbGJhY2sgPSBmdW5jdGlvbih0eXBlKSB7XG5cdFx0XHR2YXIgdiA9IHRoaXMudmFycztcblx0XHRcdHZbdHlwZV0uYXBwbHkodlt0eXBlICsgXCJTY29wZVwiXSB8fCB2LmNhbGxiYWNrU2NvcGUgfHwgdGhpcywgdlt0eXBlICsgXCJQYXJhbXNcIl0gfHwgX2JsYW5rQXJyYXkpO1xuXHRcdH07XG5cbi8vLS0tLUFuaW1hdGlvbiBnZXR0ZXJzL3NldHRlcnMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRcdHAuZXZlbnRDYWxsYmFjayA9IGZ1bmN0aW9uKHR5cGUsIGNhbGxiYWNrLCBwYXJhbXMsIHNjb3BlKSB7XG5cdFx0XHRpZiAoKHR5cGUgfHwgXCJcIikuc3Vic3RyKDAsMikgPT09IFwib25cIikge1xuXHRcdFx0XHR2YXIgdiA9IHRoaXMudmFycztcblx0XHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0XHRyZXR1cm4gdlt0eXBlXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY2FsbGJhY2sgPT0gbnVsbCkge1xuXHRcdFx0XHRcdGRlbGV0ZSB2W3R5cGVdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZbdHlwZV0gPSBjYWxsYmFjaztcblx0XHRcdFx0XHR2W3R5cGUgKyBcIlBhcmFtc1wiXSA9IChfaXNBcnJheShwYXJhbXMpICYmIHBhcmFtcy5qb2luKFwiXCIpLmluZGV4T2YoXCJ7c2VsZn1cIikgIT09IC0xKSA/IHRoaXMuX3N3YXBTZWxmSW5QYXJhbXMocGFyYW1zKSA6IHBhcmFtcztcblx0XHRcdFx0XHR2W3R5cGUgKyBcIlNjb3BlXCJdID0gc2NvcGU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR5cGUgPT09IFwib25VcGRhdGVcIikge1xuXHRcdFx0XHRcdHRoaXMuX29uVXBkYXRlID0gY2FsbGJhY2s7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLmRlbGF5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZGVsYXk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpIHtcblx0XHRcdFx0dGhpcy5zdGFydFRpbWUoIHRoaXMuX3N0YXJ0VGltZSArIHZhbHVlIC0gdGhpcy5fZGVsYXkgKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX2RlbGF5ID0gdmFsdWU7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC5kdXJhdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0dGhpcy5fZGlydHkgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2R1cmF0aW9uO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZHVyYXRpb24gPSB0aGlzLl90b3RhbER1cmF0aW9uID0gdmFsdWU7XG5cdFx0XHR0aGlzLl91bmNhY2hlKHRydWUpOyAvL3RydWUgaW4gY2FzZSBpdCdzIGEgVHdlZW5NYXggb3IgVGltZWxpbmVNYXggdGhhdCBoYXMgYSByZXBlYXQgLSB3ZSdsbCBuZWVkIHRvIHJlZnJlc2ggdGhlIHRvdGFsRHVyYXRpb24uXG5cdFx0XHRpZiAodGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpIGlmICh0aGlzLl90aW1lID4gMCkgaWYgKHRoaXMuX3RpbWUgPCB0aGlzLl9kdXJhdGlvbikgaWYgKHZhbHVlICE9PSAwKSB7XG5cdFx0XHRcdHRoaXMudG90YWxUaW1lKHRoaXMuX3RvdGFsVGltZSAqICh2YWx1ZSAvIHRoaXMuX2R1cmF0aW9uKSwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC50b3RhbER1cmF0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdHRoaXMuX2RpcnR5ID0gZmFsc2U7XG5cdFx0XHRyZXR1cm4gKCFhcmd1bWVudHMubGVuZ3RoKSA/IHRoaXMuX3RvdGFsRHVyYXRpb24gOiB0aGlzLmR1cmF0aW9uKHZhbHVlKTtcblx0XHR9O1xuXG5cdFx0cC50aW1lID0gZnVuY3Rpb24odmFsdWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3RpbWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fZGlydHkpIHtcblx0XHRcdFx0dGhpcy50b3RhbER1cmF0aW9uKCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcy50b3RhbFRpbWUoKHZhbHVlID4gdGhpcy5fZHVyYXRpb24pID8gdGhpcy5fZHVyYXRpb24gOiB2YWx1ZSwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cblx0XHRwLnRvdGFsVGltZSA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzLCB1bmNhcHBlZCkge1xuXHRcdFx0aWYgKCFfdGlja2VyQWN0aXZlKSB7XG5cdFx0XHRcdF90aWNrZXIud2FrZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCFhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl90b3RhbFRpbWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fdGltZWxpbmUpIHtcblx0XHRcdFx0aWYgKHRpbWUgPCAwICYmICF1bmNhcHBlZCkge1xuXHRcdFx0XHRcdHRpbWUgKz0gdGhpcy50b3RhbER1cmF0aW9uKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX2RpcnR5KSB7XG5cdFx0XHRcdFx0XHR0aGlzLnRvdGFsRHVyYXRpb24oKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dmFyIHRvdGFsRHVyYXRpb24gPSB0aGlzLl90b3RhbER1cmF0aW9uLFxuXHRcdFx0XHRcdFx0dGwgPSB0aGlzLl90aW1lbGluZTtcblx0XHRcdFx0XHRpZiAodGltZSA+IHRvdGFsRHVyYXRpb24gJiYgIXVuY2FwcGVkKSB7XG5cdFx0XHRcdFx0XHR0aW1lID0gdG90YWxEdXJhdGlvbjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRUaW1lID0gKHRoaXMuX3BhdXNlZCA/IHRoaXMuX3BhdXNlVGltZSA6IHRsLl90aW1lKSAtICgoIXRoaXMuX3JldmVyc2VkID8gdGltZSA6IHRvdGFsRHVyYXRpb24gLSB0aW1lKSAvIHRoaXMuX3RpbWVTY2FsZSk7XG5cdFx0XHRcdFx0aWYgKCF0bC5fZGlydHkpIHsgLy9mb3IgcGVyZm9ybWFuY2UgaW1wcm92ZW1lbnQuIElmIHRoZSBwYXJlbnQncyBjYWNoZSBpcyBhbHJlYWR5IGRpcnR5LCBpdCBhbHJlYWR5IHRvb2sgY2FyZSBvZiBtYXJraW5nIHRoZSBhbmNlc3RvcnMgYXMgZGlydHkgdG9vLCBzbyBza2lwIHRoZSBmdW5jdGlvbiBjYWxsIGhlcmUuXG5cdFx0XHRcdFx0XHR0aGlzLl91bmNhY2hlKGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9pbiBjYXNlIGFueSBvZiB0aGUgYW5jZXN0b3IgdGltZWxpbmVzIGhhZCBjb21wbGV0ZWQgYnV0IHNob3VsZCBub3cgYmUgZW5hYmxlZCwgd2Ugc2hvdWxkIHJlc2V0IHRoZWlyIHRvdGFsVGltZSgpIHdoaWNoIHdpbGwgYWxzbyBlbnN1cmUgdGhhdCB0aGV5J3JlIGxpbmVkIHVwIHByb3Blcmx5IGFuZCBlbmFibGVkLiBTa2lwIGZvciBhbmltYXRpb25zIHRoYXQgYXJlIG9uIHRoZSByb290ICh3YXN0ZWZ1bCkuIEV4YW1wbGU6IGEgVGltZWxpbmVMaXRlLmV4cG9ydFJvb3QoKSBpcyBwZXJmb3JtZWQgd2hlbiB0aGVyZSdzIGEgcGF1c2VkIHR3ZWVuIG9uIHRoZSByb290LCB0aGUgZXhwb3J0IHdpbGwgbm90IGNvbXBsZXRlIHVudGlsIHRoYXQgdHdlZW4gaXMgdW5wYXVzZWQsIGJ1dCBpbWFnaW5lIGEgY2hpbGQgZ2V0cyByZXN0YXJ0ZWQgbGF0ZXIsIGFmdGVyIGFsbCBbdW5wYXVzZWRdIHR3ZWVucyBoYXZlIGNvbXBsZXRlZC4gVGhlIHN0YXJ0VGltZSBvZiB0aGF0IGNoaWxkIHdvdWxkIGdldCBwdXNoZWQgb3V0LCBidXQgb25lIG9mIHRoZSBhbmNlc3RvcnMgbWF5IGhhdmUgY29tcGxldGVkLlxuXHRcdFx0XHRcdGlmICh0bC5fdGltZWxpbmUpIHtcblx0XHRcdFx0XHRcdHdoaWxlICh0bC5fdGltZWxpbmUpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHRsLl90aW1lbGluZS5fdGltZSAhPT0gKHRsLl9zdGFydFRpbWUgKyB0bC5fdG90YWxUaW1lKSAvIHRsLl90aW1lU2NhbGUpIHtcblx0XHRcdFx0XHRcdFx0XHR0bC50b3RhbFRpbWUodGwuX3RvdGFsVGltZSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0dGwgPSB0bC5fdGltZWxpbmU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLl9nYykge1xuXHRcdFx0XHRcdHRoaXMuX2VuYWJsZWQodHJ1ZSwgZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLl90b3RhbFRpbWUgIT09IHRpbWUgfHwgdGhpcy5fZHVyYXRpb24gPT09IDApIHtcblx0XHRcdFx0XHR0aGlzLnJlbmRlcih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZmFsc2UpO1xuXHRcdFx0XHRcdGlmIChfbGF6eVR3ZWVucy5sZW5ndGgpIHsgLy9pbiBjYXNlIHJlbmRlcmluZyBjYXVzZWQgYW55IHR3ZWVucyB0byBsYXp5LWluaXQsIHdlIHNob3VsZCByZW5kZXIgdGhlbSBiZWNhdXNlIHR5cGljYWxseSB3aGVuIHNvbWVvbmUgY2FsbHMgc2VlaygpIG9yIHRpbWUoKSBvciBwcm9ncmVzcygpLCB0aGV5IGV4cGVjdCBhbiBpbW1lZGlhdGUgcmVuZGVyLlxuXHRcdFx0XHRcdFx0X2xhenlSZW5kZXIoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLnByb2dyZXNzID0gcC50b3RhbFByb2dyZXNzID0gZnVuY3Rpb24odmFsdWUsIHN1cHByZXNzRXZlbnRzKSB7XG5cdFx0XHRyZXR1cm4gKCFhcmd1bWVudHMubGVuZ3RoKSA/IHRoaXMuX3RpbWUgLyB0aGlzLmR1cmF0aW9uKCkgOiB0aGlzLnRvdGFsVGltZSh0aGlzLmR1cmF0aW9uKCkgKiB2YWx1ZSwgc3VwcHJlc3NFdmVudHMpO1xuXHRcdH07XG5cblx0XHRwLnN0YXJ0VGltZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3N0YXJ0VGltZTtcblx0XHRcdH1cblx0XHRcdGlmICh2YWx1ZSAhPT0gdGhpcy5fc3RhcnRUaW1lKSB7XG5cdFx0XHRcdHRoaXMuX3N0YXJ0VGltZSA9IHZhbHVlO1xuXHRcdFx0XHRpZiAodGhpcy50aW1lbGluZSkgaWYgKHRoaXMudGltZWxpbmUuX3NvcnRDaGlsZHJlbikge1xuXHRcdFx0XHRcdHRoaXMudGltZWxpbmUuYWRkKHRoaXMsIHZhbHVlIC0gdGhpcy5fZGVsYXkpOyAvL2Vuc3VyZXMgdGhhdCBhbnkgbmVjZXNzYXJ5IHJlLXNlcXVlbmNpbmcgb2YgQW5pbWF0aW9ucyBpbiB0aGUgdGltZWxpbmUgb2NjdXJzIHRvIG1ha2Ugc3VyZSB0aGUgcmVuZGVyaW5nIG9yZGVyIGlzIGNvcnJlY3QuXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLmVuZFRpbWUgPSBmdW5jdGlvbihpbmNsdWRlUmVwZWF0cykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3N0YXJ0VGltZSArICgoaW5jbHVkZVJlcGVhdHMgIT0gZmFsc2UpID8gdGhpcy50b3RhbER1cmF0aW9uKCkgOiB0aGlzLmR1cmF0aW9uKCkpIC8gdGhpcy5fdGltZVNjYWxlO1xuXHRcdH07XG5cblx0XHRwLnRpbWVTY2FsZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3RpbWVTY2FsZTtcblx0XHRcdH1cblx0XHRcdHZhbHVlID0gdmFsdWUgfHwgX3RpbnlOdW07IC8vY2FuJ3QgYWxsb3cgemVybyBiZWNhdXNlIGl0J2xsIHRocm93IHRoZSBtYXRoIG9mZlxuXHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lICYmIHRoaXMuX3RpbWVsaW5lLnNtb290aENoaWxkVGltaW5nKSB7XG5cdFx0XHRcdHZhciBwYXVzZVRpbWUgPSB0aGlzLl9wYXVzZVRpbWUsXG5cdFx0XHRcdFx0dCA9IChwYXVzZVRpbWUgfHwgcGF1c2VUaW1lID09PSAwKSA/IHBhdXNlVGltZSA6IHRoaXMuX3RpbWVsaW5lLnRvdGFsVGltZSgpO1xuXHRcdFx0XHR0aGlzLl9zdGFydFRpbWUgPSB0IC0gKCh0IC0gdGhpcy5fc3RhcnRUaW1lKSAqIHRoaXMuX3RpbWVTY2FsZSAvIHZhbHVlKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3RpbWVTY2FsZSA9IHZhbHVlO1xuXHRcdFx0cmV0dXJuIHRoaXMuX3VuY2FjaGUoZmFsc2UpO1xuXHRcdH07XG5cblx0XHRwLnJldmVyc2VkID0gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRcdGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fcmV2ZXJzZWQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAodmFsdWUgIT0gdGhpcy5fcmV2ZXJzZWQpIHtcblx0XHRcdFx0dGhpcy5fcmV2ZXJzZWQgPSB2YWx1ZTtcblx0XHRcdFx0dGhpcy50b3RhbFRpbWUoKCh0aGlzLl90aW1lbGluZSAmJiAhdGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcpID8gdGhpcy50b3RhbER1cmF0aW9uKCkgLSB0aGlzLl90b3RhbFRpbWUgOiB0aGlzLl90b3RhbFRpbWUpLCB0cnVlKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLnBhdXNlZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0XHRpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX3BhdXNlZDtcblx0XHRcdH1cblx0XHRcdHZhciB0bCA9IHRoaXMuX3RpbWVsaW5lLFxuXHRcdFx0XHRyYXcsIGVsYXBzZWQ7XG5cdFx0XHRpZiAodmFsdWUgIT0gdGhpcy5fcGF1c2VkKSBpZiAodGwpIHtcblx0XHRcdFx0aWYgKCFfdGlja2VyQWN0aXZlICYmICF2YWx1ZSkge1xuXHRcdFx0XHRcdF90aWNrZXIud2FrZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJhdyA9IHRsLnJhd1RpbWUoKTtcblx0XHRcdFx0ZWxhcHNlZCA9IHJhdyAtIHRoaXMuX3BhdXNlVGltZTtcblx0XHRcdFx0aWYgKCF2YWx1ZSAmJiB0bC5zbW9vdGhDaGlsZFRpbWluZykge1xuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0VGltZSArPSBlbGFwc2VkO1xuXHRcdFx0XHRcdHRoaXMuX3VuY2FjaGUoZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3BhdXNlVGltZSA9IHZhbHVlID8gcmF3IDogbnVsbDtcblx0XHRcdFx0dGhpcy5fcGF1c2VkID0gdmFsdWU7XG5cdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IHRoaXMuaXNBY3RpdmUoKTtcblx0XHRcdFx0aWYgKCF2YWx1ZSAmJiBlbGFwc2VkICE9PSAwICYmIHRoaXMuX2luaXR0ZWQgJiYgdGhpcy5kdXJhdGlvbigpKSB7XG5cdFx0XHRcdFx0dGhpcy5yZW5kZXIoKHRsLnNtb290aENoaWxkVGltaW5nID8gdGhpcy5fdG90YWxUaW1lIDogKHJhdyAtIHRoaXMuX3N0YXJ0VGltZSkgLyB0aGlzLl90aW1lU2NhbGUpLCB0cnVlLCB0cnVlKTsgLy9pbiBjYXNlIHRoZSB0YXJnZXQncyBwcm9wZXJ0aWVzIGNoYW5nZWQgdmlhIHNvbWUgb3RoZXIgdHdlZW4gb3IgbWFudWFsIHVwZGF0ZSBieSB0aGUgdXNlciwgd2Ugc2hvdWxkIGZvcmNlIGEgcmVuZGVyLlxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fZ2MgJiYgIXZhbHVlKSB7XG5cdFx0XHRcdHRoaXMuX2VuYWJsZWQodHJ1ZSwgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogU2ltcGxlVGltZWxpbmVcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXHRcdHZhciBTaW1wbGVUaW1lbGluZSA9IF9jbGFzcyhcImNvcmUuU2ltcGxlVGltZWxpbmVcIiwgZnVuY3Rpb24odmFycykge1xuXHRcdFx0QW5pbWF0aW9uLmNhbGwodGhpcywgMCwgdmFycyk7XG5cdFx0XHR0aGlzLmF1dG9SZW1vdmVDaGlsZHJlbiA9IHRoaXMuc21vb3RoQ2hpbGRUaW1pbmcgPSB0cnVlO1xuXHRcdH0pO1xuXG5cdFx0cCA9IFNpbXBsZVRpbWVsaW5lLnByb3RvdHlwZSA9IG5ldyBBbmltYXRpb24oKTtcblx0XHRwLmNvbnN0cnVjdG9yID0gU2ltcGxlVGltZWxpbmU7XG5cdFx0cC5raWxsKCkuX2djID0gZmFsc2U7XG5cdFx0cC5fZmlyc3QgPSBwLl9sYXN0ID0gcC5fcmVjZW50ID0gbnVsbDtcblx0XHRwLl9zb3J0Q2hpbGRyZW4gPSBmYWxzZTtcblxuXHRcdHAuYWRkID0gcC5pbnNlcnQgPSBmdW5jdGlvbihjaGlsZCwgcG9zaXRpb24sIGFsaWduLCBzdGFnZ2VyKSB7XG5cdFx0XHR2YXIgcHJldlR3ZWVuLCBzdDtcblx0XHRcdGNoaWxkLl9zdGFydFRpbWUgPSBOdW1iZXIocG9zaXRpb24gfHwgMCkgKyBjaGlsZC5fZGVsYXk7XG5cdFx0XHRpZiAoY2hpbGQuX3BhdXNlZCkgaWYgKHRoaXMgIT09IGNoaWxkLl90aW1lbGluZSkgeyAvL3dlIG9ubHkgYWRqdXN0IHRoZSBfcGF1c2VUaW1lIGlmIGl0IHdhc24ndCBpbiB0aGlzIHRpbWVsaW5lIGFscmVhZHkuIFJlbWVtYmVyLCBzb21ldGltZXMgYSB0d2VlbiB3aWxsIGJlIGluc2VydGVkIGFnYWluIGludG8gdGhlIHNhbWUgdGltZWxpbmUgd2hlbiBpdHMgc3RhcnRUaW1lIGlzIGNoYW5nZWQgc28gdGhhdCB0aGUgdHdlZW5zIGluIHRoZSBUaW1lbGluZUxpdGUvTWF4IGFyZSByZS1vcmRlcmVkIHByb3Blcmx5IGluIHRoZSBsaW5rZWQgbGlzdCAoc28gZXZlcnl0aGluZyByZW5kZXJzIGluIHRoZSBwcm9wZXIgb3JkZXIpLlxuXHRcdFx0XHRjaGlsZC5fcGF1c2VUaW1lID0gY2hpbGQuX3N0YXJ0VGltZSArICgodGhpcy5yYXdUaW1lKCkgLSBjaGlsZC5fc3RhcnRUaW1lKSAvIGNoaWxkLl90aW1lU2NhbGUpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGNoaWxkLnRpbWVsaW5lKSB7XG5cdFx0XHRcdGNoaWxkLnRpbWVsaW5lLl9yZW1vdmUoY2hpbGQsIHRydWUpOyAvL3JlbW92ZXMgZnJvbSBleGlzdGluZyB0aW1lbGluZSBzbyB0aGF0IGl0IGNhbiBiZSBwcm9wZXJseSBhZGRlZCB0byB0aGlzIG9uZS5cblx0XHRcdH1cblx0XHRcdGNoaWxkLnRpbWVsaW5lID0gY2hpbGQuX3RpbWVsaW5lID0gdGhpcztcblx0XHRcdGlmIChjaGlsZC5fZ2MpIHtcblx0XHRcdFx0Y2hpbGQuX2VuYWJsZWQodHJ1ZSwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRwcmV2VHdlZW4gPSB0aGlzLl9sYXN0O1xuXHRcdFx0aWYgKHRoaXMuX3NvcnRDaGlsZHJlbikge1xuXHRcdFx0XHRzdCA9IGNoaWxkLl9zdGFydFRpbWU7XG5cdFx0XHRcdHdoaWxlIChwcmV2VHdlZW4gJiYgcHJldlR3ZWVuLl9zdGFydFRpbWUgPiBzdCkge1xuXHRcdFx0XHRcdHByZXZUd2VlbiA9IHByZXZUd2Vlbi5fcHJldjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKHByZXZUd2Vlbikge1xuXHRcdFx0XHRjaGlsZC5fbmV4dCA9IHByZXZUd2Vlbi5fbmV4dDtcblx0XHRcdFx0cHJldlR3ZWVuLl9uZXh0ID0gY2hpbGQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjaGlsZC5fbmV4dCA9IHRoaXMuX2ZpcnN0O1xuXHRcdFx0XHR0aGlzLl9maXJzdCA9IGNoaWxkO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGNoaWxkLl9uZXh0KSB7XG5cdFx0XHRcdGNoaWxkLl9uZXh0Ll9wcmV2ID0gY2hpbGQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9sYXN0ID0gY2hpbGQ7XG5cdFx0XHR9XG5cdFx0XHRjaGlsZC5fcHJldiA9IHByZXZUd2Vlbjtcblx0XHRcdHRoaXMuX3JlY2VudCA9IGNoaWxkO1xuXHRcdFx0aWYgKHRoaXMuX3RpbWVsaW5lKSB7XG5cdFx0XHRcdHRoaXMuX3VuY2FjaGUodHJ1ZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cC5fcmVtb3ZlID0gZnVuY3Rpb24odHdlZW4sIHNraXBEaXNhYmxlKSB7XG5cdFx0XHRpZiAodHdlZW4udGltZWxpbmUgPT09IHRoaXMpIHtcblx0XHRcdFx0aWYgKCFza2lwRGlzYWJsZSkge1xuXHRcdFx0XHRcdHR3ZWVuLl9lbmFibGVkKGZhbHNlLCB0cnVlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0d2Vlbi5fcHJldikge1xuXHRcdFx0XHRcdHR3ZWVuLl9wcmV2Ll9uZXh0ID0gdHdlZW4uX25leHQ7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fZmlyc3QgPT09IHR3ZWVuKSB7XG5cdFx0XHRcdFx0dGhpcy5fZmlyc3QgPSB0d2Vlbi5fbmV4dDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodHdlZW4uX25leHQpIHtcblx0XHRcdFx0XHR0d2Vlbi5fbmV4dC5fcHJldiA9IHR3ZWVuLl9wcmV2O1xuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuX2xhc3QgPT09IHR3ZWVuKSB7XG5cdFx0XHRcdFx0dGhpcy5fbGFzdCA9IHR3ZWVuLl9wcmV2O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHR3ZWVuLl9uZXh0ID0gdHdlZW4uX3ByZXYgPSB0d2Vlbi50aW1lbGluZSA9IG51bGw7XG5cdFx0XHRcdGlmICh0d2VlbiA9PT0gdGhpcy5fcmVjZW50KSB7XG5cdFx0XHRcdFx0dGhpcy5fcmVjZW50ID0gdGhpcy5fbGFzdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0aGlzLl90aW1lbGluZSkge1xuXHRcdFx0XHRcdHRoaXMuX3VuY2FjaGUodHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHRwLnJlbmRlciA9IGZ1bmN0aW9uKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSkge1xuXHRcdFx0dmFyIHR3ZWVuID0gdGhpcy5fZmlyc3QsXG5cdFx0XHRcdG5leHQ7XG5cdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0aGlzLl90aW1lID0gdGhpcy5fcmF3UHJldlRpbWUgPSB0aW1lO1xuXHRcdFx0d2hpbGUgKHR3ZWVuKSB7XG5cdFx0XHRcdG5leHQgPSB0d2Vlbi5fbmV4dDsgLy9yZWNvcmQgaXQgaGVyZSBiZWNhdXNlIHRoZSB2YWx1ZSBjb3VsZCBjaGFuZ2UgYWZ0ZXIgcmVuZGVyaW5nLi4uXG5cdFx0XHRcdGlmICh0d2Vlbi5fYWN0aXZlIHx8ICh0aW1lID49IHR3ZWVuLl9zdGFydFRpbWUgJiYgIXR3ZWVuLl9wYXVzZWQpKSB7XG5cdFx0XHRcdFx0aWYgKCF0d2Vlbi5fcmV2ZXJzZWQpIHtcblx0XHRcdFx0XHRcdHR3ZWVuLnJlbmRlcigodGltZSAtIHR3ZWVuLl9zdGFydFRpbWUpICogdHdlZW4uX3RpbWVTY2FsZSwgc3VwcHJlc3NFdmVudHMsIGZvcmNlKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dHdlZW4ucmVuZGVyKCgoIXR3ZWVuLl9kaXJ0eSkgPyB0d2Vlbi5fdG90YWxEdXJhdGlvbiA6IHR3ZWVuLnRvdGFsRHVyYXRpb24oKSkgLSAoKHRpbWUgLSB0d2Vlbi5fc3RhcnRUaW1lKSAqIHR3ZWVuLl90aW1lU2NhbGUpLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0d2VlbiA9IG5leHQ7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHAucmF3VGltZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCFfdGlja2VyQWN0aXZlKSB7XG5cdFx0XHRcdF90aWNrZXIud2FrZSgpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX3RvdGFsVGltZTtcblx0XHR9O1xuXG4vKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogVHdlZW5MaXRlXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblx0XHR2YXIgVHdlZW5MaXRlID0gX2NsYXNzKFwiVHdlZW5MaXRlXCIsIGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIHZhcnMpIHtcblx0XHRcdFx0QW5pbWF0aW9uLmNhbGwodGhpcywgZHVyYXRpb24sIHZhcnMpO1xuXHRcdFx0XHR0aGlzLnJlbmRlciA9IFR3ZWVuTGl0ZS5wcm90b3R5cGUucmVuZGVyOyAvL3NwZWVkIG9wdGltaXphdGlvbiAoYXZvaWQgcHJvdG90eXBlIGxvb2t1cCBvbiB0aGlzIFwiaG90XCIgbWV0aG9kKVxuXG5cdFx0XHRcdGlmICh0YXJnZXQgPT0gbnVsbCkge1xuXHRcdFx0XHRcdHRocm93IFwiQ2Fubm90IHR3ZWVuIGEgbnVsbCB0YXJnZXQuXCI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLnRhcmdldCA9IHRhcmdldCA9ICh0eXBlb2YodGFyZ2V0KSAhPT0gXCJzdHJpbmdcIikgPyB0YXJnZXQgOiBUd2VlbkxpdGUuc2VsZWN0b3IodGFyZ2V0KSB8fCB0YXJnZXQ7XG5cblx0XHRcdFx0dmFyIGlzU2VsZWN0b3IgPSAodGFyZ2V0LmpxdWVyeSB8fCAodGFyZ2V0Lmxlbmd0aCAmJiB0YXJnZXQgIT09IHdpbmRvdyAmJiB0YXJnZXRbMF0gJiYgKHRhcmdldFswXSA9PT0gd2luZG93IHx8ICh0YXJnZXRbMF0ubm9kZVR5cGUgJiYgdGFyZ2V0WzBdLnN0eWxlICYmICF0YXJnZXQubm9kZVR5cGUpKSkpLFxuXHRcdFx0XHRcdG92ZXJ3cml0ZSA9IHRoaXMudmFycy5vdmVyd3JpdGUsXG5cdFx0XHRcdFx0aSwgdGFyZywgdGFyZ2V0cztcblxuXHRcdFx0XHR0aGlzLl9vdmVyd3JpdGUgPSBvdmVyd3JpdGUgPSAob3ZlcndyaXRlID09IG51bGwpID8gX292ZXJ3cml0ZUxvb2t1cFtUd2VlbkxpdGUuZGVmYXVsdE92ZXJ3cml0ZV0gOiAodHlwZW9mKG92ZXJ3cml0ZSkgPT09IFwibnVtYmVyXCIpID8gb3ZlcndyaXRlID4+IDAgOiBfb3ZlcndyaXRlTG9va3VwW292ZXJ3cml0ZV07XG5cblx0XHRcdFx0aWYgKChpc1NlbGVjdG9yIHx8IHRhcmdldCBpbnN0YW5jZW9mIEFycmF5IHx8ICh0YXJnZXQucHVzaCAmJiBfaXNBcnJheSh0YXJnZXQpKSkgJiYgdHlwZW9mKHRhcmdldFswXSkgIT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0XHR0aGlzLl90YXJnZXRzID0gdGFyZ2V0cyA9IF9zbGljZSh0YXJnZXQpOyAgLy9kb24ndCB1c2UgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGFyZ2V0LCAwKSBiZWNhdXNlIHRoYXQgZG9lc24ndCB3b3JrIGluIElFOCB3aXRoIGEgTm9kZUxpc3QgdGhhdCdzIHJldHVybmVkIGJ5IHF1ZXJ5U2VsZWN0b3JBbGwoKVxuXHRcdFx0XHRcdHRoaXMuX3Byb3BMb29rdXAgPSBbXTtcblx0XHRcdFx0XHR0aGlzLl9zaWJsaW5ncyA9IFtdO1xuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCB0YXJnZXRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0XHR0YXJnID0gdGFyZ2V0c1tpXTtcblx0XHRcdFx0XHRcdGlmICghdGFyZykge1xuXHRcdFx0XHRcdFx0XHR0YXJnZXRzLnNwbGljZShpLS0sIDEpO1xuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mKHRhcmcpID09PSBcInN0cmluZ1wiKSB7XG5cdFx0XHRcdFx0XHRcdHRhcmcgPSB0YXJnZXRzW2ktLV0gPSBUd2VlbkxpdGUuc2VsZWN0b3IodGFyZyk7IC8vaW4gY2FzZSBpdCdzIGFuIGFycmF5IG9mIHN0cmluZ3Ncblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZih0YXJnKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0XHRcdFx0XHRcdHRhcmdldHMuc3BsaWNlKGkrMSwgMSk7IC8vdG8gYXZvaWQgYW4gZW5kbGVzcyBsb29wIChjYW4ndCBpbWFnaW5lIHdoeSB0aGUgc2VsZWN0b3Igd291bGQgcmV0dXJuIGEgc3RyaW5nLCBidXQganVzdCBpbiBjYXNlKVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICh0YXJnLmxlbmd0aCAmJiB0YXJnICE9PSB3aW5kb3cgJiYgdGFyZ1swXSAmJiAodGFyZ1swXSA9PT0gd2luZG93IHx8ICh0YXJnWzBdLm5vZGVUeXBlICYmIHRhcmdbMF0uc3R5bGUgJiYgIXRhcmcubm9kZVR5cGUpKSkgeyAvL2luIGNhc2UgdGhlIHVzZXIgaXMgcGFzc2luZyBpbiBhbiBhcnJheSBvZiBzZWxlY3RvciBvYmplY3RzIChsaWtlIGpRdWVyeSBvYmplY3RzKSwgd2UgbmVlZCB0byBjaGVjayBvbmUgbW9yZSBsZXZlbCBhbmQgcHVsbCB0aGluZ3Mgb3V0IGlmIG5lY2Vzc2FyeS4gQWxzbyBub3RlIHRoYXQgPHNlbGVjdD4gZWxlbWVudHMgcGFzcyBhbGwgdGhlIGNyaXRlcmlhIHJlZ2FyZGluZyBsZW5ndGggYW5kIHRoZSBmaXJzdCBjaGlsZCBoYXZpbmcgc3R5bGUsIHNvIHdlIG11c3QgYWxzbyBjaGVjayB0byBlbnN1cmUgdGhlIHRhcmdldCBpc24ndCBhbiBIVE1MIG5vZGUgaXRzZWxmLlxuXHRcdFx0XHRcdFx0XHR0YXJnZXRzLnNwbGljZShpLS0sIDEpO1xuXHRcdFx0XHRcdFx0XHR0aGlzLl90YXJnZXRzID0gdGFyZ2V0cyA9IHRhcmdldHMuY29uY2F0KF9zbGljZSh0YXJnKSk7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0dGhpcy5fc2libGluZ3NbaV0gPSBfcmVnaXN0ZXIodGFyZywgdGhpcywgZmFsc2UpO1xuXHRcdFx0XHRcdFx0aWYgKG92ZXJ3cml0ZSA9PT0gMSkgaWYgKHRoaXMuX3NpYmxpbmdzW2ldLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRcdFx0X2FwcGx5T3ZlcndyaXRlKHRhcmcsIHRoaXMsIG51bGwsIDEsIHRoaXMuX3NpYmxpbmdzW2ldKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl9wcm9wTG9va3VwID0ge307XG5cdFx0XHRcdFx0dGhpcy5fc2libGluZ3MgPSBfcmVnaXN0ZXIodGFyZ2V0LCB0aGlzLCBmYWxzZSk7XG5cdFx0XHRcdFx0aWYgKG92ZXJ3cml0ZSA9PT0gMSkgaWYgKHRoaXMuX3NpYmxpbmdzLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRcdF9hcHBseU92ZXJ3cml0ZSh0YXJnZXQsIHRoaXMsIG51bGwsIDEsIHRoaXMuX3NpYmxpbmdzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMudmFycy5pbW1lZGlhdGVSZW5kZXIgfHwgKGR1cmF0aW9uID09PSAwICYmIHRoaXMuX2RlbGF5ID09PSAwICYmIHRoaXMudmFycy5pbW1lZGlhdGVSZW5kZXIgIT09IGZhbHNlKSkge1xuXHRcdFx0XHRcdHRoaXMuX3RpbWUgPSAtX3RpbnlOdW07IC8vZm9yY2VzIGEgcmVuZGVyIHdpdGhvdXQgaGF2aW5nIHRvIHNldCB0aGUgcmVuZGVyKCkgXCJmb3JjZVwiIHBhcmFtZXRlciB0byB0cnVlIGJlY2F1c2Ugd2Ugd2FudCB0byBhbGxvdyBsYXp5aW5nIGJ5IGRlZmF1bHQgKHVzaW5nIHRoZSBcImZvcmNlXCIgcGFyYW1ldGVyIGFsd2F5cyBmb3JjZXMgYW4gaW1tZWRpYXRlIGZ1bGwgcmVuZGVyKVxuXHRcdFx0XHRcdHRoaXMucmVuZGVyKC10aGlzLl9kZWxheSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sIHRydWUpLFxuXHRcdFx0X2lzU2VsZWN0b3IgPSBmdW5jdGlvbih2KSB7XG5cdFx0XHRcdHJldHVybiAodiAmJiB2Lmxlbmd0aCAmJiB2ICE9PSB3aW5kb3cgJiYgdlswXSAmJiAodlswXSA9PT0gd2luZG93IHx8ICh2WzBdLm5vZGVUeXBlICYmIHZbMF0uc3R5bGUgJiYgIXYubm9kZVR5cGUpKSk7IC8vd2UgY2Fubm90IGNoZWNrIFwibm9kZVR5cGVcIiBpZiB0aGUgdGFyZ2V0IGlzIHdpbmRvdyBmcm9tIHdpdGhpbiBhbiBpZnJhbWUsIG90aGVyd2lzZSBpdCB3aWxsIHRyaWdnZXIgYSBzZWN1cml0eSBlcnJvciBpbiBzb21lIGJyb3dzZXJzIGxpa2UgRmlyZWZveC5cblx0XHRcdH0sXG5cdFx0XHRfYXV0b0NTUyA9IGZ1bmN0aW9uKHZhcnMsIHRhcmdldCkge1xuXHRcdFx0XHR2YXIgY3NzID0ge30sXG5cdFx0XHRcdFx0cDtcblx0XHRcdFx0Zm9yIChwIGluIHZhcnMpIHtcblx0XHRcdFx0XHRpZiAoIV9yZXNlcnZlZFByb3BzW3BdICYmICghKHAgaW4gdGFyZ2V0KSB8fCBwID09PSBcInRyYW5zZm9ybVwiIHx8IHAgPT09IFwieFwiIHx8IHAgPT09IFwieVwiIHx8IHAgPT09IFwid2lkdGhcIiB8fCBwID09PSBcImhlaWdodFwiIHx8IHAgPT09IFwiY2xhc3NOYW1lXCIgfHwgcCA9PT0gXCJib3JkZXJcIikgJiYgKCFfcGx1Z2luc1twXSB8fCAoX3BsdWdpbnNbcF0gJiYgX3BsdWdpbnNbcF0uX2F1dG9DU1MpKSkgeyAvL25vdGU6IDxpbWc+IGVsZW1lbnRzIGNvbnRhaW4gcmVhZC1vbmx5IFwieFwiIGFuZCBcInlcIiBwcm9wZXJ0aWVzLiBXZSBzaG91bGQgYWxzbyBwcmlvcml0aXplIGVkaXRpbmcgY3NzIHdpZHRoL2hlaWdodCByYXRoZXIgdGhhbiB0aGUgZWxlbWVudCdzIHByb3BlcnRpZXMuXG5cdFx0XHRcdFx0XHRjc3NbcF0gPSB2YXJzW3BdO1xuXHRcdFx0XHRcdFx0ZGVsZXRlIHZhcnNbcF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHZhcnMuY3NzID0gY3NzO1xuXHRcdFx0fTtcblxuXHRcdHAgPSBUd2VlbkxpdGUucHJvdG90eXBlID0gbmV3IEFuaW1hdGlvbigpO1xuXHRcdHAuY29uc3RydWN0b3IgPSBUd2VlbkxpdGU7XG5cdFx0cC5raWxsKCkuX2djID0gZmFsc2U7XG5cbi8vLS0tLVR3ZWVuTGl0ZSBkZWZhdWx0cywgb3ZlcndyaXRlIG1hbmFnZW1lbnQsIGFuZCByb290IHVwZGF0ZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdFx0cC5yYXRpbyA9IDA7XG5cdFx0cC5fZmlyc3RQVCA9IHAuX3RhcmdldHMgPSBwLl9vdmVyd3JpdHRlblByb3BzID0gcC5fc3RhcnRBdCA9IG51bGw7XG5cdFx0cC5fbm90aWZ5UGx1Z2luc09mRW5hYmxlZCA9IHAuX2xhenkgPSBmYWxzZTtcblxuXHRcdFR3ZWVuTGl0ZS52ZXJzaW9uID0gXCIxLjE3LjBcIjtcblx0XHRUd2VlbkxpdGUuZGVmYXVsdEVhc2UgPSBwLl9lYXNlID0gbmV3IEVhc2UobnVsbCwgbnVsbCwgMSwgMSk7XG5cdFx0VHdlZW5MaXRlLmRlZmF1bHRPdmVyd3JpdGUgPSBcImF1dG9cIjtcblx0XHRUd2VlbkxpdGUudGlja2VyID0gX3RpY2tlcjtcblx0XHRUd2VlbkxpdGUuYXV0b1NsZWVwID0gMTIwO1xuXHRcdFR3ZWVuTGl0ZS5sYWdTbW9vdGhpbmcgPSBmdW5jdGlvbih0aHJlc2hvbGQsIGFkanVzdGVkTGFnKSB7XG5cdFx0XHRfdGlja2VyLmxhZ1Ntb290aGluZyh0aHJlc2hvbGQsIGFkanVzdGVkTGFnKTtcblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLnNlbGVjdG9yID0gd2luZG93LiQgfHwgd2luZG93LmpRdWVyeSB8fCBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgc2VsZWN0b3IgPSB3aW5kb3cuJCB8fCB3aW5kb3cualF1ZXJ5O1xuXHRcdFx0aWYgKHNlbGVjdG9yKSB7XG5cdFx0XHRcdFR3ZWVuTGl0ZS5zZWxlY3RvciA9IHNlbGVjdG9yO1xuXHRcdFx0XHRyZXR1cm4gc2VsZWN0b3IoZSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gKHR5cGVvZihkb2N1bWVudCkgPT09IFwidW5kZWZpbmVkXCIpID8gZSA6IChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlKSA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKChlLmNoYXJBdCgwKSA9PT0gXCIjXCIpID8gZS5zdWJzdHIoMSkgOiBlKSk7XG5cdFx0fTtcblxuXHRcdHZhciBfbGF6eVR3ZWVucyA9IFtdLFxuXHRcdFx0X2xhenlMb29rdXAgPSB7fSxcblx0XHRcdF9pbnRlcm5hbHMgPSBUd2VlbkxpdGUuX2ludGVybmFscyA9IHtpc0FycmF5Ol9pc0FycmF5LCBpc1NlbGVjdG9yOl9pc1NlbGVjdG9yLCBsYXp5VHdlZW5zOl9sYXp5VHdlZW5zfSwgLy9naXZlcyB1cyBhIHdheSB0byBleHBvc2UgY2VydGFpbiBwcml2YXRlIHZhbHVlcyB0byBvdGhlciBHcmVlblNvY2sgY2xhc3NlcyB3aXRob3V0IGNvbnRhbWluYXRpbmcgdGhhIG1haW4gVHdlZW5MaXRlIG9iamVjdC5cblx0XHRcdF9wbHVnaW5zID0gVHdlZW5MaXRlLl9wbHVnaW5zID0ge30sXG5cdFx0XHRfdHdlZW5Mb29rdXAgPSBfaW50ZXJuYWxzLnR3ZWVuTG9va3VwID0ge30sXG5cdFx0XHRfdHdlZW5Mb29rdXBOdW0gPSAwLFxuXHRcdFx0X3Jlc2VydmVkUHJvcHMgPSBfaW50ZXJuYWxzLnJlc2VydmVkUHJvcHMgPSB7ZWFzZToxLCBkZWxheToxLCBvdmVyd3JpdGU6MSwgb25Db21wbGV0ZToxLCBvbkNvbXBsZXRlUGFyYW1zOjEsIG9uQ29tcGxldGVTY29wZToxLCB1c2VGcmFtZXM6MSwgcnVuQmFja3dhcmRzOjEsIHN0YXJ0QXQ6MSwgb25VcGRhdGU6MSwgb25VcGRhdGVQYXJhbXM6MSwgb25VcGRhdGVTY29wZToxLCBvblN0YXJ0OjEsIG9uU3RhcnRQYXJhbXM6MSwgb25TdGFydFNjb3BlOjEsIG9uUmV2ZXJzZUNvbXBsZXRlOjEsIG9uUmV2ZXJzZUNvbXBsZXRlUGFyYW1zOjEsIG9uUmV2ZXJzZUNvbXBsZXRlU2NvcGU6MSwgb25SZXBlYXQ6MSwgb25SZXBlYXRQYXJhbXM6MSwgb25SZXBlYXRTY29wZToxLCBlYXNlUGFyYW1zOjEsIHlveW86MSwgaW1tZWRpYXRlUmVuZGVyOjEsIHJlcGVhdDoxLCByZXBlYXREZWxheToxLCBkYXRhOjEsIHBhdXNlZDoxLCByZXZlcnNlZDoxLCBhdXRvQ1NTOjEsIGxhenk6MSwgb25PdmVyd3JpdGU6MSwgY2FsbGJhY2tTY29wZToxfSxcblx0XHRcdF9vdmVyd3JpdGVMb29rdXAgPSB7bm9uZTowLCBhbGw6MSwgYXV0bzoyLCBjb25jdXJyZW50OjMsIGFsbE9uU3RhcnQ6NCwgcHJlZXhpc3Rpbmc6NSwgXCJ0cnVlXCI6MSwgXCJmYWxzZVwiOjB9LFxuXHRcdFx0X3Jvb3RGcmFtZXNUaW1lbGluZSA9IEFuaW1hdGlvbi5fcm9vdEZyYW1lc1RpbWVsaW5lID0gbmV3IFNpbXBsZVRpbWVsaW5lKCksXG5cdFx0XHRfcm9vdFRpbWVsaW5lID0gQW5pbWF0aW9uLl9yb290VGltZWxpbmUgPSBuZXcgU2ltcGxlVGltZWxpbmUoKSxcblx0XHRcdF9uZXh0R0NGcmFtZSA9IDMwLFxuXHRcdFx0X2xhenlSZW5kZXIgPSBfaW50ZXJuYWxzLmxhenlSZW5kZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGkgPSBfbGF6eVR3ZWVucy5sZW5ndGgsXG5cdFx0XHRcdFx0dHdlZW47XG5cdFx0XHRcdF9sYXp5TG9va3VwID0ge307XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdHR3ZWVuID0gX2xhenlUd2VlbnNbaV07XG5cdFx0XHRcdFx0aWYgKHR3ZWVuICYmIHR3ZWVuLl9sYXp5ICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdFx0dHdlZW4ucmVuZGVyKHR3ZWVuLl9sYXp5WzBdLCB0d2Vlbi5fbGF6eVsxXSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHR0d2Vlbi5fbGF6eSA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRfbGF6eVR3ZWVucy5sZW5ndGggPSAwO1xuXHRcdFx0fTtcblxuXHRcdF9yb290VGltZWxpbmUuX3N0YXJ0VGltZSA9IF90aWNrZXIudGltZTtcblx0XHRfcm9vdEZyYW1lc1RpbWVsaW5lLl9zdGFydFRpbWUgPSBfdGlja2VyLmZyYW1lO1xuXHRcdF9yb290VGltZWxpbmUuX2FjdGl2ZSA9IF9yb290RnJhbWVzVGltZWxpbmUuX2FjdGl2ZSA9IHRydWU7XG5cdFx0c2V0VGltZW91dChfbGF6eVJlbmRlciwgMSk7IC8vb24gc29tZSBtb2JpbGUgZGV2aWNlcywgdGhlcmUgaXNuJ3QgYSBcInRpY2tcIiBiZWZvcmUgY29kZSBydW5zIHdoaWNoIG1lYW5zIGFueSBsYXp5IHJlbmRlcnMgd291bGRuJ3QgcnVuIGJlZm9yZSB0aGUgbmV4dCBvZmZpY2lhbCBcInRpY2tcIi5cblxuXHRcdEFuaW1hdGlvbi5fdXBkYXRlUm9vdCA9IFR3ZWVuTGl0ZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGksIGEsIHA7XG5cdFx0XHRcdGlmIChfbGF6eVR3ZWVucy5sZW5ndGgpIHsgLy9pZiBjb2RlIGlzIHJ1biBvdXRzaWRlIG9mIHRoZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgbG9vcCwgdGhlcmUgbWF5IGJlIHR3ZWVucyBxdWV1ZWQgQUZURVIgdGhlIGVuZ2luZSByZWZyZXNoZWQsIHNvIHdlIG5lZWQgdG8gZW5zdXJlIGFueSBwZW5kaW5nIHJlbmRlcnMgb2NjdXIgYmVmb3JlIHdlIHJlZnJlc2ggYWdhaW4uXG5cdFx0XHRcdFx0X2xhenlSZW5kZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRfcm9vdFRpbWVsaW5lLnJlbmRlcigoX3RpY2tlci50aW1lIC0gX3Jvb3RUaW1lbGluZS5fc3RhcnRUaW1lKSAqIF9yb290VGltZWxpbmUuX3RpbWVTY2FsZSwgZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0X3Jvb3RGcmFtZXNUaW1lbGluZS5yZW5kZXIoKF90aWNrZXIuZnJhbWUgLSBfcm9vdEZyYW1lc1RpbWVsaW5lLl9zdGFydFRpbWUpICogX3Jvb3RGcmFtZXNUaW1lbGluZS5fdGltZVNjYWxlLCBmYWxzZSwgZmFsc2UpO1xuXHRcdFx0XHRpZiAoX2xhenlUd2VlbnMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0X2xhenlSZW5kZXIoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoX3RpY2tlci5mcmFtZSA+PSBfbmV4dEdDRnJhbWUpIHsgLy9kdW1wIGdhcmJhZ2UgZXZlcnkgMTIwIGZyYW1lcyBvciB3aGF0ZXZlciB0aGUgdXNlciBzZXRzIFR3ZWVuTGl0ZS5hdXRvU2xlZXAgdG9cblx0XHRcdFx0XHRfbmV4dEdDRnJhbWUgPSBfdGlja2VyLmZyYW1lICsgKHBhcnNlSW50KFR3ZWVuTGl0ZS5hdXRvU2xlZXAsIDEwKSB8fCAxMjApO1xuXHRcdFx0XHRcdGZvciAocCBpbiBfdHdlZW5Mb29rdXApIHtcblx0XHRcdFx0XHRcdGEgPSBfdHdlZW5Mb29rdXBbcF0udHdlZW5zO1xuXHRcdFx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChhW2ldLl9nYykge1xuXHRcdFx0XHRcdFx0XHRcdGEuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoYS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRcdFx0ZGVsZXRlIF90d2Vlbkxvb2t1cFtwXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9pZiB0aGVyZSBhcmUgbm8gbW9yZSB0d2VlbnMgaW4gdGhlIHJvb3QgdGltZWxpbmVzLCBvciBpZiB0aGV5J3JlIGFsbCBwYXVzZWQsIG1ha2UgdGhlIF90aW1lciBzbGVlcCB0byByZWR1Y2UgbG9hZCBvbiB0aGUgQ1BVIHNsaWdodGx5XG5cdFx0XHRcdFx0cCA9IF9yb290VGltZWxpbmUuX2ZpcnN0O1xuXHRcdFx0XHRcdGlmICghcCB8fCBwLl9wYXVzZWQpIGlmIChUd2VlbkxpdGUuYXV0b1NsZWVwICYmICFfcm9vdEZyYW1lc1RpbWVsaW5lLl9maXJzdCAmJiBfdGlja2VyLl9saXN0ZW5lcnMudGljay5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0XHRcdHdoaWxlIChwICYmIHAuX3BhdXNlZCkge1xuXHRcdFx0XHRcdFx0XHRwID0gcC5fbmV4dDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmICghcCkge1xuXHRcdFx0XHRcdFx0XHRfdGlja2VyLnNsZWVwKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXG5cdFx0X3RpY2tlci5hZGRFdmVudExpc3RlbmVyKFwidGlja1wiLCBBbmltYXRpb24uX3VwZGF0ZVJvb3QpO1xuXG5cdFx0dmFyIF9yZWdpc3RlciA9IGZ1bmN0aW9uKHRhcmdldCwgdHdlZW4sIHNjcnViKSB7XG5cdFx0XHRcdHZhciBpZCA9IHRhcmdldC5fZ3NUd2VlbklELCBhLCBpO1xuXHRcdFx0XHRpZiAoIV90d2Vlbkxvb2t1cFtpZCB8fCAodGFyZ2V0Ll9nc1R3ZWVuSUQgPSBpZCA9IFwidFwiICsgKF90d2Vlbkxvb2t1cE51bSsrKSldKSB7XG5cdFx0XHRcdFx0X3R3ZWVuTG9va3VwW2lkXSA9IHt0YXJnZXQ6dGFyZ2V0LCB0d2VlbnM6W119O1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0d2Vlbikge1xuXHRcdFx0XHRcdGEgPSBfdHdlZW5Mb29rdXBbaWRdLnR3ZWVucztcblx0XHRcdFx0XHRhWyhpID0gYS5sZW5ndGgpXSA9IHR3ZWVuO1xuXHRcdFx0XHRcdGlmIChzY3J1Yikge1xuXHRcdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChhW2ldID09PSB0d2Vlbikge1xuXHRcdFx0XHRcdFx0XHRcdGEuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBfdHdlZW5Mb29rdXBbaWRdLnR3ZWVucztcblx0XHRcdH0sXG5cblx0XHRcdF9vbk92ZXJ3cml0ZSA9IGZ1bmN0aW9uKG92ZXJ3cml0dGVuVHdlZW4sIG92ZXJ3cml0aW5nVHdlZW4sIHRhcmdldCwga2lsbGVkUHJvcHMpIHtcblx0XHRcdFx0dmFyIGZ1bmMgPSBvdmVyd3JpdHRlblR3ZWVuLnZhcnMub25PdmVyd3JpdGUsIHIxLCByMjtcblx0XHRcdFx0aWYgKGZ1bmMpIHtcblx0XHRcdFx0XHRyMSA9IGZ1bmMob3ZlcndyaXR0ZW5Ud2Vlbiwgb3ZlcndyaXRpbmdUd2VlbiwgdGFyZ2V0LCBraWxsZWRQcm9wcyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZnVuYyA9IFR3ZWVuTGl0ZS5vbk92ZXJ3cml0ZTtcblx0XHRcdFx0aWYgKGZ1bmMpIHtcblx0XHRcdFx0XHRyMiA9IGZ1bmMob3ZlcndyaXR0ZW5Ud2Vlbiwgb3ZlcndyaXRpbmdUd2VlbiwgdGFyZ2V0LCBraWxsZWRQcm9wcyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIChyMSAhPT0gZmFsc2UgJiYgcjIgIT09IGZhbHNlKTtcblx0XHRcdH0sXG5cdFx0XHRfYXBwbHlPdmVyd3JpdGUgPSBmdW5jdGlvbih0YXJnZXQsIHR3ZWVuLCBwcm9wcywgbW9kZSwgc2libGluZ3MpIHtcblx0XHRcdFx0dmFyIGksIGNoYW5nZWQsIGN1clR3ZWVuLCBsO1xuXHRcdFx0XHRpZiAobW9kZSA9PT0gMSB8fCBtb2RlID49IDQpIHtcblx0XHRcdFx0XHRsID0gc2libGluZ3MubGVuZ3RoO1xuXHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcblx0XHRcdFx0XHRcdGlmICgoY3VyVHdlZW4gPSBzaWJsaW5nc1tpXSkgIT09IHR3ZWVuKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghY3VyVHdlZW4uX2djKSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGN1clR3ZWVuLl9raWxsKG51bGwsIHRhcmdldCwgdHdlZW4pKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRjaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAobW9kZSA9PT0gNSkge1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGNoYW5nZWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly9OT1RFOiBBZGQgMC4wMDAwMDAwMDAxIHRvIG92ZXJjb21lIGZsb2F0aW5nIHBvaW50IGVycm9ycyB0aGF0IGNhbiBjYXVzZSB0aGUgc3RhcnRUaW1lIHRvIGJlIFZFUlkgc2xpZ2h0bHkgb2ZmICh3aGVuIGEgdHdlZW4ncyB0aW1lKCkgaXMgc2V0IGZvciBleGFtcGxlKVxuXHRcdFx0XHR2YXIgc3RhcnRUaW1lID0gdHdlZW4uX3N0YXJ0VGltZSArIF90aW55TnVtLFxuXHRcdFx0XHRcdG92ZXJsYXBzID0gW10sXG5cdFx0XHRcdFx0b0NvdW50ID0gMCxcblx0XHRcdFx0XHR6ZXJvRHVyID0gKHR3ZWVuLl9kdXJhdGlvbiA9PT0gMCksXG5cdFx0XHRcdFx0Z2xvYmFsU3RhcnQ7XG5cdFx0XHRcdGkgPSBzaWJsaW5ncy5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGlmICgoY3VyVHdlZW4gPSBzaWJsaW5nc1tpXSkgPT09IHR3ZWVuIHx8IGN1clR3ZWVuLl9nYyB8fCBjdXJUd2Vlbi5fcGF1c2VkKSB7XG5cdFx0XHRcdFx0XHQvL2lnbm9yZVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY3VyVHdlZW4uX3RpbWVsaW5lICE9PSB0d2Vlbi5fdGltZWxpbmUpIHtcblx0XHRcdFx0XHRcdGdsb2JhbFN0YXJ0ID0gZ2xvYmFsU3RhcnQgfHwgX2NoZWNrT3ZlcmxhcCh0d2VlbiwgMCwgemVyb0R1cik7XG5cdFx0XHRcdFx0XHRpZiAoX2NoZWNrT3ZlcmxhcChjdXJUd2VlbiwgZ2xvYmFsU3RhcnQsIHplcm9EdXIpID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdG92ZXJsYXBzW29Db3VudCsrXSA9IGN1clR3ZWVuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY3VyVHdlZW4uX3N0YXJ0VGltZSA8PSBzdGFydFRpbWUpIGlmIChjdXJUd2Vlbi5fc3RhcnRUaW1lICsgY3VyVHdlZW4udG90YWxEdXJhdGlvbigpIC8gY3VyVHdlZW4uX3RpbWVTY2FsZSA+IHN0YXJ0VGltZSkgaWYgKCEoKHplcm9EdXIgfHwgIWN1clR3ZWVuLl9pbml0dGVkKSAmJiBzdGFydFRpbWUgLSBjdXJUd2Vlbi5fc3RhcnRUaW1lIDw9IDAuMDAwMDAwMDAwMikpIHtcblx0XHRcdFx0XHRcdG92ZXJsYXBzW29Db3VudCsrXSA9IGN1clR3ZWVuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGkgPSBvQ291bnQ7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGN1clR3ZWVuID0gb3ZlcmxhcHNbaV07XG5cdFx0XHRcdFx0aWYgKG1vZGUgPT09IDIpIGlmIChjdXJUd2Vlbi5fa2lsbChwcm9wcywgdGFyZ2V0LCB0d2VlbikpIHtcblx0XHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAobW9kZSAhPT0gMiB8fCAoIWN1clR3ZWVuLl9maXJzdFBUICYmIGN1clR3ZWVuLl9pbml0dGVkKSkge1xuXHRcdFx0XHRcdFx0aWYgKG1vZGUgIT09IDIgJiYgIV9vbk92ZXJ3cml0ZShjdXJUd2VlbiwgdHdlZW4pKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKGN1clR3ZWVuLl9lbmFibGVkKGZhbHNlLCBmYWxzZSkpIHsgLy9pZiBhbGwgcHJvcGVydHkgdHdlZW5zIGhhdmUgYmVlbiBvdmVyd3JpdHRlbiwga2lsbCB0aGUgdHdlZW4uXG5cdFx0XHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gY2hhbmdlZDtcblx0XHRcdH0sXG5cblx0XHRcdF9jaGVja092ZXJsYXAgPSBmdW5jdGlvbih0d2VlbiwgcmVmZXJlbmNlLCB6ZXJvRHVyKSB7XG5cdFx0XHRcdHZhciB0bCA9IHR3ZWVuLl90aW1lbGluZSxcblx0XHRcdFx0XHR0cyA9IHRsLl90aW1lU2NhbGUsXG5cdFx0XHRcdFx0dCA9IHR3ZWVuLl9zdGFydFRpbWU7XG5cdFx0XHRcdHdoaWxlICh0bC5fdGltZWxpbmUpIHtcblx0XHRcdFx0XHR0ICs9IHRsLl9zdGFydFRpbWU7XG5cdFx0XHRcdFx0dHMgKj0gdGwuX3RpbWVTY2FsZTtcblx0XHRcdFx0XHRpZiAodGwuX3BhdXNlZCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIC0xMDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRsID0gdGwuX3RpbWVsaW5lO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHQgLz0gdHM7XG5cdFx0XHRcdHJldHVybiAodCA+IHJlZmVyZW5jZSkgPyB0IC0gcmVmZXJlbmNlIDogKCh6ZXJvRHVyICYmIHQgPT09IHJlZmVyZW5jZSkgfHwgKCF0d2Vlbi5faW5pdHRlZCAmJiB0IC0gcmVmZXJlbmNlIDwgMiAqIF90aW55TnVtKSkgPyBfdGlueU51bSA6ICgodCArPSB0d2Vlbi50b3RhbER1cmF0aW9uKCkgLyB0d2Vlbi5fdGltZVNjYWxlIC8gdHMpID4gcmVmZXJlbmNlICsgX3RpbnlOdW0pID8gMCA6IHQgLSByZWZlcmVuY2UgLSBfdGlueU51bTtcblx0XHRcdH07XG5cblxuLy8tLS0tIFR3ZWVuTGl0ZSBpbnN0YW5jZSBtZXRob2RzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0XHRwLl9pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdiA9IHRoaXMudmFycyxcblx0XHRcdFx0b3AgPSB0aGlzLl9vdmVyd3JpdHRlblByb3BzLFxuXHRcdFx0XHRkdXIgPSB0aGlzLl9kdXJhdGlvbixcblx0XHRcdFx0aW1tZWRpYXRlID0gISF2LmltbWVkaWF0ZVJlbmRlcixcblx0XHRcdFx0ZWFzZSA9IHYuZWFzZSxcblx0XHRcdFx0aSwgaW5pdFBsdWdpbnMsIHB0LCBwLCBzdGFydFZhcnM7XG5cdFx0XHRpZiAodi5zdGFydEF0KSB7XG5cdFx0XHRcdGlmICh0aGlzLl9zdGFydEF0KSB7XG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5yZW5kZXIoLTEsIHRydWUpOyAvL2lmIHdlJ3ZlIHJ1biBhIHN0YXJ0QXQgcHJldmlvdXNseSAod2hlbiB0aGUgdHdlZW4gaW5zdGFudGlhdGVkKSwgd2Ugc2hvdWxkIHJldmVydCBpdCBzbyB0aGF0IHRoZSB2YWx1ZXMgcmUtaW5zdGFudGlhdGUgY29ycmVjdGx5IHBhcnRpY3VsYXJseSBmb3IgcmVsYXRpdmUgdHdlZW5zLiBXaXRob3V0IHRoaXMsIGEgVHdlZW5MaXRlLmZyb21UbyhvYmosIDEsIHt4OlwiKz0xMDBcIn0sIHt4OlwiLT0xMDBcIn0pLCBmb3IgZXhhbXBsZSwgd291bGQgYWN0dWFsbHkganVtcCB0byArPTIwMCBiZWNhdXNlIHRoZSBzdGFydEF0IHdvdWxkIHJ1biB0d2ljZSwgZG91YmxpbmcgdGhlIHJlbGF0aXZlIGNoYW5nZS5cblx0XHRcdFx0XHR0aGlzLl9zdGFydEF0LmtpbGwoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRzdGFydFZhcnMgPSB7fTtcblx0XHRcdFx0Zm9yIChwIGluIHYuc3RhcnRBdCkgeyAvL2NvcHkgdGhlIHByb3BlcnRpZXMvdmFsdWVzIGludG8gYSBuZXcgb2JqZWN0IHRvIGF2b2lkIGNvbGxpc2lvbnMsIGxpa2UgdmFyIHRvID0ge3g6MH0sIGZyb20gPSB7eDo1MDB9OyB0aW1lbGluZS5mcm9tVG8oZSwgMSwgZnJvbSwgdG8pLmZyb21UbyhlLCAxLCB0bywgZnJvbSk7XG5cdFx0XHRcdFx0c3RhcnRWYXJzW3BdID0gdi5zdGFydEF0W3BdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHN0YXJ0VmFycy5vdmVyd3JpdGUgPSBmYWxzZTtcblx0XHRcdFx0c3RhcnRWYXJzLmltbWVkaWF0ZVJlbmRlciA9IHRydWU7XG5cdFx0XHRcdHN0YXJ0VmFycy5sYXp5ID0gKGltbWVkaWF0ZSAmJiB2LmxhenkgIT09IGZhbHNlKTtcblx0XHRcdFx0c3RhcnRWYXJzLnN0YXJ0QXQgPSBzdGFydFZhcnMuZGVsYXkgPSBudWxsOyAvL25vIG5lc3Rpbmcgb2Ygc3RhcnRBdCBvYmplY3RzIGFsbG93ZWQgKG90aGVyd2lzZSBpdCBjb3VsZCBjYXVzZSBhbiBpbmZpbml0ZSBsb29wKS5cblx0XHRcdFx0dGhpcy5fc3RhcnRBdCA9IFR3ZWVuTGl0ZS50byh0aGlzLnRhcmdldCwgMCwgc3RhcnRWYXJzKTtcblx0XHRcdFx0aWYgKGltbWVkaWF0ZSkge1xuXHRcdFx0XHRcdGlmICh0aGlzLl90aW1lID4gMCkge1xuXHRcdFx0XHRcdFx0dGhpcy5fc3RhcnRBdCA9IG51bGw7IC8vdHdlZW5zIHRoYXQgcmVuZGVyIGltbWVkaWF0ZWx5IChsaWtlIG1vc3QgZnJvbSgpIGFuZCBmcm9tVG8oKSB0d2VlbnMpIHNob3VsZG4ndCByZXZlcnQgd2hlbiB0aGVpciBwYXJlbnQgdGltZWxpbmUncyBwbGF5aGVhZCBnb2VzIGJhY2t3YXJkIHBhc3QgdGhlIHN0YXJ0VGltZSBiZWNhdXNlIHRoZSBpbml0aWFsIHJlbmRlciBjb3VsZCBoYXZlIGhhcHBlbmVkIGFueXRpbWUgYW5kIGl0IHNob3VsZG4ndCBiZSBkaXJlY3RseSBjb3JyZWxhdGVkIHRvIHRoaXMgdHdlZW4ncyBzdGFydFRpbWUuIEltYWdpbmUgc2V0dGluZyB1cCBhIGNvbXBsZXggYW5pbWF0aW9uIHdoZXJlIHRoZSBiZWdpbm5pbmcgc3RhdGVzIG9mIHZhcmlvdXMgb2JqZWN0cyBhcmUgcmVuZGVyZWQgaW1tZWRpYXRlbHkgYnV0IHRoZSB0d2VlbiBkb2Vzbid0IGhhcHBlbiBmb3IgcXVpdGUgc29tZSB0aW1lIC0gaWYgd2UgcmV2ZXJ0IHRvIHRoZSBzdGFydGluZyB2YWx1ZXMgYXMgc29vbiBhcyB0aGUgcGxheWhlYWQgZ29lcyBiYWNrd2FyZCBwYXN0IHRoZSB0d2VlbidzIHN0YXJ0VGltZSwgaXQgd2lsbCB0aHJvdyB0aGluZ3Mgb2ZmIHZpc3VhbGx5LiBSZXZlcnNpb24gc2hvdWxkIG9ubHkgaGFwcGVuIGluIFRpbWVsaW5lTGl0ZS9NYXggaW5zdGFuY2VzIHdoZXJlIGltbWVkaWF0ZVJlbmRlciB3YXMgZmFsc2UgKHdoaWNoIGlzIHRoZSBkZWZhdWx0IGluIHRoZSBjb252ZW5pZW5jZSBtZXRob2RzIGxpa2UgZnJvbSgpKS5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKGR1ciAhPT0gMCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuOyAvL3dlIHNraXAgaW5pdGlhbGl6YXRpb24gaGVyZSBzbyB0aGF0IG92ZXJ3cml0aW5nIGRvZXNuJ3Qgb2NjdXIgdW50aWwgdGhlIHR3ZWVuIGFjdHVhbGx5IGJlZ2lucy4gT3RoZXJ3aXNlLCBpZiB5b3UgY3JlYXRlIHNldmVyYWwgaW1tZWRpYXRlUmVuZGVyOnRydWUgdHdlZW5zIG9mIHRoZSBzYW1lIHRhcmdldC9wcm9wZXJ0aWVzIHRvIGRyb3AgaW50byBhIFRpbWVsaW5lTGl0ZSBvciBUaW1lbGluZU1heCwgdGhlIGxhc3Qgb25lIGNyZWF0ZWQgd291bGQgb3ZlcndyaXRlIHRoZSBmaXJzdCBvbmVzIGJlY2F1c2UgdGhleSBkaWRuJ3QgZ2V0IHBsYWNlZCBpbnRvIHRoZSB0aW1lbGluZSB5ZXQgYmVmb3JlIHRoZSBmaXJzdCByZW5kZXIgb2NjdXJzIGFuZCBraWNrcyBpbiBvdmVyd3JpdGluZy5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAodi5ydW5CYWNrd2FyZHMgJiYgZHVyICE9PSAwKSB7XG5cdFx0XHRcdC8vZnJvbSgpIHR3ZWVucyBtdXN0IGJlIGhhbmRsZWQgdW5pcXVlbHk6IHRoZWlyIGJlZ2lubmluZyB2YWx1ZXMgbXVzdCBiZSByZW5kZXJlZCBidXQgd2UgZG9uJ3Qgd2FudCBvdmVyd3JpdGluZyB0byBvY2N1ciB5ZXQgKHdoZW4gdGltZSBpcyBzdGlsbCAwKS4gV2FpdCB1bnRpbCB0aGUgdHdlZW4gYWN0dWFsbHkgYmVnaW5zIGJlZm9yZSBkb2luZyBhbGwgdGhlIHJvdXRpbmVzIGxpa2Ugb3ZlcndyaXRpbmcuIEF0IHRoYXQgdGltZSwgd2Ugc2hvdWxkIHJlbmRlciBhdCB0aGUgRU5EIG9mIHRoZSB0d2VlbiB0byBlbnN1cmUgdGhhdCB0aGluZ3MgaW5pdGlhbGl6ZSBjb3JyZWN0bHkgKHJlbWVtYmVyLCBmcm9tKCkgdHdlZW5zIGdvIGJhY2t3YXJkcylcblx0XHRcdFx0aWYgKHRoaXMuX3N0YXJ0QXQpIHtcblx0XHRcdFx0XHR0aGlzLl9zdGFydEF0LnJlbmRlcigtMSwgdHJ1ZSk7XG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdC5raWxsKCk7XG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdCA9IG51bGw7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX3RpbWUgIT09IDApIHsgLy9pbiByYXJlIGNhc2VzIChsaWtlIGlmIGEgZnJvbSgpIHR3ZWVuIHJ1bnMgYW5kIHRoZW4gaXMgaW52YWxpZGF0ZSgpLWVkKSwgaW1tZWRpYXRlUmVuZGVyIGNvdWxkIGJlIHRydWUgYnV0IHRoZSBpbml0aWFsIGZvcmNlZC1yZW5kZXIgZ2V0cyBza2lwcGVkLCBzbyB0aGVyZSdzIG5vIG5lZWQgdG8gZm9yY2UgdGhlIHJlbmRlciBpbiB0aGlzIGNvbnRleHQgd2hlbiB0aGUgX3RpbWUgaXMgZ3JlYXRlciB0aGFuIDBcblx0XHRcdFx0XHRcdGltbWVkaWF0ZSA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IHt9O1xuXHRcdFx0XHRcdGZvciAocCBpbiB2KSB7IC8vY29weSBwcm9wcyBpbnRvIGEgbmV3IG9iamVjdCBhbmQgc2tpcCBhbnkgcmVzZXJ2ZWQgcHJvcHMsIG90aGVyd2lzZSBvbkNvbXBsZXRlIG9yIG9uVXBkYXRlIG9yIG9uU3RhcnQgY291bGQgZmlyZS4gV2Ugc2hvdWxkLCBob3dldmVyLCBwZXJtaXQgYXV0b0NTUyB0byBnbyB0aHJvdWdoLlxuXHRcdFx0XHRcdFx0aWYgKCFfcmVzZXJ2ZWRQcm9wc1twXSB8fCBwID09PSBcImF1dG9DU1NcIikge1xuXHRcdFx0XHRcdFx0XHRwdFtwXSA9IHZbcF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHB0Lm92ZXJ3cml0ZSA9IDA7XG5cdFx0XHRcdFx0cHQuZGF0YSA9IFwiaXNGcm9tU3RhcnRcIjsgLy93ZSB0YWcgdGhlIHR3ZWVuIHdpdGggYXMgXCJpc0Zyb21TdGFydFwiIHNvIHRoYXQgaWYgW2luc2lkZSBhIHBsdWdpbl0gd2UgbmVlZCB0byBvbmx5IGRvIHNvbWV0aGluZyBhdCB0aGUgdmVyeSBFTkQgb2YgYSB0d2Vlbiwgd2UgaGF2ZSBhIHdheSBvZiBpZGVudGlmeWluZyB0aGlzIHR3ZWVuIGFzIG1lcmVseSB0aGUgb25lIHRoYXQncyBzZXR0aW5nIHRoZSBiZWdpbm5pbmcgdmFsdWVzIGZvciBhIFwiZnJvbSgpXCIgdHdlZW4uIEZvciBleGFtcGxlLCBjbGVhclByb3BzIGluIENTU1BsdWdpbiBzaG91bGQgb25seSBnZXQgYXBwbGllZCBhdCB0aGUgdmVyeSBFTkQgb2YgYSB0d2VlbiBhbmQgd2l0aG91dCB0aGlzIHRhZywgZnJvbSguLi57aGVpZ2h0OjEwMCwgY2xlYXJQcm9wczpcImhlaWdodFwiLCBkZWxheToxfSkgd291bGQgd2lwZSB0aGUgaGVpZ2h0IGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIHR3ZWVuIGFuZCBhZnRlciAxIHNlY29uZCwgaXQnZCBraWNrIGJhY2sgaW4uXG5cdFx0XHRcdFx0cHQubGF6eSA9IChpbW1lZGlhdGUgJiYgdi5sYXp5ICE9PSBmYWxzZSk7XG5cdFx0XHRcdFx0cHQuaW1tZWRpYXRlUmVuZGVyID0gaW1tZWRpYXRlOyAvL3plcm8tZHVyYXRpb24gdHdlZW5zIHJlbmRlciBpbW1lZGlhdGVseSBieSBkZWZhdWx0LCBidXQgaWYgd2UncmUgbm90IHNwZWNpZmljYWxseSBpbnN0cnVjdGVkIHRvIHJlbmRlciB0aGlzIHR3ZWVuIGltbWVkaWF0ZWx5LCB3ZSBzaG91bGQgc2tpcCB0aGlzIGFuZCBtZXJlbHkgX2luaXQoKSB0byByZWNvcmQgdGhlIHN0YXJ0aW5nIHZhbHVlcyAocmVuZGVyaW5nIHRoZW0gaW1tZWRpYXRlbHkgd291bGQgcHVzaCB0aGVtIHRvIGNvbXBsZXRpb24gd2hpY2ggaXMgd2FzdGVmdWwgaW4gdGhhdCBjYXNlIC0gd2UnZCBoYXZlIHRvIHJlbmRlcigtMSkgaW1tZWRpYXRlbHkgYWZ0ZXIpXG5cdFx0XHRcdFx0dGhpcy5fc3RhcnRBdCA9IFR3ZWVuTGl0ZS50byh0aGlzLnRhcmdldCwgMCwgcHQpO1xuXHRcdFx0XHRcdGlmICghaW1tZWRpYXRlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9zdGFydEF0Ll9pbml0KCk7IC8vZW5zdXJlcyB0aGF0IHRoZSBpbml0aWFsIHZhbHVlcyBhcmUgcmVjb3JkZWRcblx0XHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQuX2VuYWJsZWQoZmFsc2UpOyAvL25vIG5lZWQgdG8gaGF2ZSB0aGUgdHdlZW4gcmVuZGVyIG9uIHRoZSBuZXh0IGN5Y2xlLiBEaXNhYmxlIGl0IGJlY2F1c2Ugd2UnbGwgYWx3YXlzIG1hbnVhbGx5IGNvbnRyb2wgdGhlIHJlbmRlcnMgb2YgdGhlIF9zdGFydEF0IHR3ZWVuLlxuXHRcdFx0XHRcdFx0aWYgKHRoaXMudmFycy5pbW1lZGlhdGVSZW5kZXIpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fc3RhcnRBdCA9IG51bGw7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl90aW1lID09PSAwKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9lYXNlID0gZWFzZSA9ICghZWFzZSkgPyBUd2VlbkxpdGUuZGVmYXVsdEVhc2UgOiAoZWFzZSBpbnN0YW5jZW9mIEVhc2UpID8gZWFzZSA6ICh0eXBlb2YoZWFzZSkgPT09IFwiZnVuY3Rpb25cIikgPyBuZXcgRWFzZShlYXNlLCB2LmVhc2VQYXJhbXMpIDogX2Vhc2VNYXBbZWFzZV0gfHwgVHdlZW5MaXRlLmRlZmF1bHRFYXNlO1xuXHRcdFx0aWYgKHYuZWFzZVBhcmFtcyBpbnN0YW5jZW9mIEFycmF5ICYmIGVhc2UuY29uZmlnKSB7XG5cdFx0XHRcdHRoaXMuX2Vhc2UgPSBlYXNlLmNvbmZpZy5hcHBseShlYXNlLCB2LmVhc2VQYXJhbXMpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fZWFzZVR5cGUgPSB0aGlzLl9lYXNlLl90eXBlO1xuXHRcdFx0dGhpcy5fZWFzZVBvd2VyID0gdGhpcy5fZWFzZS5fcG93ZXI7XG5cdFx0XHR0aGlzLl9maXJzdFBUID0gbnVsbDtcblxuXHRcdFx0aWYgKHRoaXMuX3RhcmdldHMpIHtcblx0XHRcdFx0aSA9IHRoaXMuX3RhcmdldHMubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRpZiAoIHRoaXMuX2luaXRQcm9wcyggdGhpcy5fdGFyZ2V0c1tpXSwgKHRoaXMuX3Byb3BMb29rdXBbaV0gPSB7fSksIHRoaXMuX3NpYmxpbmdzW2ldLCAob3AgPyBvcFtpXSA6IG51bGwpKSApIHtcblx0XHRcdFx0XHRcdGluaXRQbHVnaW5zID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGluaXRQbHVnaW5zID0gdGhpcy5faW5pdFByb3BzKHRoaXMudGFyZ2V0LCB0aGlzLl9wcm9wTG9va3VwLCB0aGlzLl9zaWJsaW5ncywgb3ApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaW5pdFBsdWdpbnMpIHtcblx0XHRcdFx0VHdlZW5MaXRlLl9vblBsdWdpbkV2ZW50KFwiX29uSW5pdEFsbFByb3BzXCIsIHRoaXMpOyAvL3Jlb3JkZXJzIHRoZSBhcnJheSBpbiBvcmRlciBvZiBwcmlvcml0eS4gVXNlcyBhIHN0YXRpYyBUd2VlblBsdWdpbiBtZXRob2QgaW4gb3JkZXIgdG8gbWluaW1pemUgZmlsZSBzaXplIGluIFR3ZWVuTGl0ZVxuXHRcdFx0fVxuXHRcdFx0aWYgKG9wKSBpZiAoIXRoaXMuX2ZpcnN0UFQpIGlmICh0eXBlb2YodGhpcy50YXJnZXQpICE9PSBcImZ1bmN0aW9uXCIpIHsgLy9pZiBhbGwgdHdlZW5pbmcgcHJvcGVydGllcyBoYXZlIGJlZW4gb3ZlcndyaXR0ZW4sIGtpbGwgdGhlIHR3ZWVuLiBJZiB0aGUgdGFyZ2V0IGlzIGEgZnVuY3Rpb24sIGl0J3MgcHJvYmFibHkgYSBkZWxheWVkQ2FsbCBzbyBsZXQgaXQgbGl2ZS5cblx0XHRcdFx0dGhpcy5fZW5hYmxlZChmYWxzZSwgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHYucnVuQmFja3dhcmRzKSB7XG5cdFx0XHRcdHB0ID0gdGhpcy5fZmlyc3RQVDtcblx0XHRcdFx0d2hpbGUgKHB0KSB7XG5cdFx0XHRcdFx0cHQucyArPSBwdC5jO1xuXHRcdFx0XHRcdHB0LmMgPSAtcHQuYztcblx0XHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9vblVwZGF0ZSA9IHYub25VcGRhdGU7XG5cdFx0XHR0aGlzLl9pbml0dGVkID0gdHJ1ZTtcblx0XHR9O1xuXG5cdFx0cC5faW5pdFByb3BzID0gZnVuY3Rpb24odGFyZ2V0LCBwcm9wTG9va3VwLCBzaWJsaW5ncywgb3ZlcndyaXR0ZW5Qcm9wcykge1xuXHRcdFx0dmFyIHAsIGksIGluaXRQbHVnaW5zLCBwbHVnaW4sIHB0LCB2O1xuXHRcdFx0aWYgKHRhcmdldCA9PSBudWxsKSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKF9sYXp5TG9va3VwW3RhcmdldC5fZ3NUd2VlbklEXSkge1xuXHRcdFx0XHRfbGF6eVJlbmRlcigpOyAvL2lmIG90aGVyIHR3ZWVucyBvZiB0aGUgc2FtZSB0YXJnZXQgaGF2ZSByZWNlbnRseSBpbml0dGVkIGJ1dCBoYXZlbid0IHJlbmRlcmVkIHlldCwgd2UndmUgZ290IHRvIGZvcmNlIHRoZSByZW5kZXIgc28gdGhhdCB0aGUgc3RhcnRpbmcgdmFsdWVzIGFyZSBjb3JyZWN0IChpbWFnaW5lIHBvcHVsYXRpbmcgYSB0aW1lbGluZSB3aXRoIGEgYnVuY2ggb2Ygc2VxdWVudGlhbCB0d2VlbnMgYW5kIHRoZW4ganVtcGluZyB0byB0aGUgZW5kKVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXRoaXMudmFycy5jc3MpIGlmICh0YXJnZXQuc3R5bGUpIGlmICh0YXJnZXQgIT09IHdpbmRvdyAmJiB0YXJnZXQubm9kZVR5cGUpIGlmIChfcGx1Z2lucy5jc3MpIGlmICh0aGlzLnZhcnMuYXV0b0NTUyAhPT0gZmFsc2UpIHsgLy9pdCdzIHNvIGNvbW1vbiB0byB1c2UgVHdlZW5MaXRlL01heCB0byBhbmltYXRlIHRoZSBjc3Mgb2YgRE9NIGVsZW1lbnRzLCB3ZSBhc3N1bWUgdGhhdCBpZiB0aGUgdGFyZ2V0IGlzIGEgRE9NIGVsZW1lbnQsIHRoYXQncyB3aGF0IGlzIGludGVuZGVkIChhIGNvbnZlbmllbmNlIHNvIHRoYXQgdXNlcnMgZG9uJ3QgaGF2ZSB0byB3cmFwIHRoaW5ncyBpbiBjc3M6e30sIGFsdGhvdWdoIHdlIHN0aWxsIHJlY29tbWVuZCBpdCBmb3IgYSBzbGlnaHQgcGVyZm9ybWFuY2UgYm9vc3QgYW5kIGJldHRlciBzcGVjaWZpY2l0eSkuIE5vdGU6IHdlIGNhbm5vdCBjaGVjayBcIm5vZGVUeXBlXCIgb24gdGhlIHdpbmRvdyBpbnNpZGUgYW4gaWZyYW1lLlxuXHRcdFx0XHRfYXV0b0NTUyh0aGlzLnZhcnMsIHRhcmdldCk7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKHAgaW4gdGhpcy52YXJzKSB7XG5cdFx0XHRcdHYgPSB0aGlzLnZhcnNbcF07XG5cdFx0XHRcdGlmIChfcmVzZXJ2ZWRQcm9wc1twXSkge1xuXHRcdFx0XHRcdGlmICh2KSBpZiAoKHYgaW5zdGFuY2VvZiBBcnJheSkgfHwgKHYucHVzaCAmJiBfaXNBcnJheSh2KSkpIGlmICh2LmpvaW4oXCJcIikuaW5kZXhPZihcIntzZWxmfVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0XHRcdHRoaXMudmFyc1twXSA9IHYgPSB0aGlzLl9zd2FwU2VsZkluUGFyYW1zKHYsIHRoaXMpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9IGVsc2UgaWYgKF9wbHVnaW5zW3BdICYmIChwbHVnaW4gPSBuZXcgX3BsdWdpbnNbcF0oKSkuX29uSW5pdFR3ZWVuKHRhcmdldCwgdGhpcy52YXJzW3BdLCB0aGlzKSkge1xuXG5cdFx0XHRcdFx0Ly90IC0gdGFyZ2V0IFx0XHRbb2JqZWN0XVxuXHRcdFx0XHRcdC8vcCAtIHByb3BlcnR5IFx0XHRbc3RyaW5nXVxuXHRcdFx0XHRcdC8vcyAtIHN0YXJ0XHRcdFx0W251bWJlcl1cblx0XHRcdFx0XHQvL2MgLSBjaGFuZ2VcdFx0W251bWJlcl1cblx0XHRcdFx0XHQvL2YgLSBpc0Z1bmN0aW9uXHRbYm9vbGVhbl1cblx0XHRcdFx0XHQvL24gLSBuYW1lXHRcdFx0W3N0cmluZ11cblx0XHRcdFx0XHQvL3BnIC0gaXNQbHVnaW4gXHRbYm9vbGVhbl1cblx0XHRcdFx0XHQvL3ByIC0gcHJpb3JpdHlcdFx0W251bWJlcl1cblx0XHRcdFx0XHR0aGlzLl9maXJzdFBUID0gcHQgPSB7X25leHQ6dGhpcy5fZmlyc3RQVCwgdDpwbHVnaW4sIHA6XCJzZXRSYXRpb1wiLCBzOjAsIGM6MSwgZjp0cnVlLCBuOnAsIHBnOnRydWUsIHByOnBsdWdpbi5fcHJpb3JpdHl9O1xuXHRcdFx0XHRcdGkgPSBwbHVnaW4uX292ZXJ3cml0ZVByb3BzLmxlbmd0aDtcblx0XHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRcdHByb3BMb29rdXBbcGx1Z2luLl9vdmVyd3JpdGVQcm9wc1tpXV0gPSB0aGlzLl9maXJzdFBUO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocGx1Z2luLl9wcmlvcml0eSB8fCBwbHVnaW4uX29uSW5pdEFsbFByb3BzKSB7XG5cdFx0XHRcdFx0XHRpbml0UGx1Z2lucyA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChwbHVnaW4uX29uRGlzYWJsZSB8fCBwbHVnaW4uX29uRW5hYmxlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9ub3RpZnlQbHVnaW5zT2ZFbmFibGVkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl9maXJzdFBUID0gcHJvcExvb2t1cFtwXSA9IHB0ID0ge19uZXh0OnRoaXMuX2ZpcnN0UFQsIHQ6dGFyZ2V0LCBwOnAsIGY6KHR5cGVvZih0YXJnZXRbcF0pID09PSBcImZ1bmN0aW9uXCIpLCBuOnAsIHBnOmZhbHNlLCBwcjowfTtcblx0XHRcdFx0XHRwdC5zID0gKCFwdC5mKSA/IHBhcnNlRmxvYXQodGFyZ2V0W3BdKSA6IHRhcmdldFsgKChwLmluZGV4T2YoXCJzZXRcIikgfHwgdHlwZW9mKHRhcmdldFtcImdldFwiICsgcC5zdWJzdHIoMyldKSAhPT0gXCJmdW5jdGlvblwiKSA/IHAgOiBcImdldFwiICsgcC5zdWJzdHIoMykpIF0oKTtcblx0XHRcdFx0XHRwdC5jID0gKHR5cGVvZih2KSA9PT0gXCJzdHJpbmdcIiAmJiB2LmNoYXJBdCgxKSA9PT0gXCI9XCIpID8gcGFyc2VJbnQodi5jaGFyQXQoMCkgKyBcIjFcIiwgMTApICogTnVtYmVyKHYuc3Vic3RyKDIpKSA6IChOdW1iZXIodikgLSBwdC5zKSB8fCAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChwdCkgaWYgKHB0Ll9uZXh0KSB7XG5cdFx0XHRcdFx0cHQuX25leHQuX3ByZXYgPSBwdDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAob3ZlcndyaXR0ZW5Qcm9wcykgaWYgKHRoaXMuX2tpbGwob3ZlcndyaXR0ZW5Qcm9wcywgdGFyZ2V0KSkgeyAvL2Fub3RoZXIgdHdlZW4gbWF5IGhhdmUgdHJpZWQgdG8gb3ZlcndyaXRlIHByb3BlcnRpZXMgb2YgdGhpcyB0d2VlbiBiZWZvcmUgaW5pdCgpIHdhcyBjYWxsZWQgKGxpa2UgaWYgdHdvIHR3ZWVucyBzdGFydCBhdCB0aGUgc2FtZSB0aW1lLCB0aGUgb25lIGNyZWF0ZWQgc2Vjb25kIHdpbGwgcnVuIGZpcnN0KVxuXHRcdFx0XHRyZXR1cm4gdGhpcy5faW5pdFByb3BzKHRhcmdldCwgcHJvcExvb2t1cCwgc2libGluZ3MsIG92ZXJ3cml0dGVuUHJvcHMpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuX292ZXJ3cml0ZSA+IDEpIGlmICh0aGlzLl9maXJzdFBUKSBpZiAoc2libGluZ3MubGVuZ3RoID4gMSkgaWYgKF9hcHBseU92ZXJ3cml0ZSh0YXJnZXQsIHRoaXMsIHByb3BMb29rdXAsIHRoaXMuX292ZXJ3cml0ZSwgc2libGluZ3MpKSB7XG5cdFx0XHRcdHRoaXMuX2tpbGwocHJvcExvb2t1cCwgdGFyZ2V0KTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2luaXRQcm9wcyh0YXJnZXQsIHByb3BMb29rdXAsIHNpYmxpbmdzLCBvdmVyd3JpdHRlblByb3BzKTtcblx0XHRcdH1cblx0XHRcdGlmICh0aGlzLl9maXJzdFBUKSBpZiAoKHRoaXMudmFycy5sYXp5ICE9PSBmYWxzZSAmJiB0aGlzLl9kdXJhdGlvbikgfHwgKHRoaXMudmFycy5sYXp5ICYmICF0aGlzLl9kdXJhdGlvbikpIHsgLy96ZXJvIGR1cmF0aW9uIHR3ZWVucyBkb24ndCBsYXp5IHJlbmRlciBieSBkZWZhdWx0OyBldmVyeXRoaW5nIGVsc2UgZG9lcy5cblx0XHRcdFx0X2xhenlMb29rdXBbdGFyZ2V0Ll9nc1R3ZWVuSURdID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBpbml0UGx1Z2lucztcblx0XHR9O1xuXG5cdFx0cC5yZW5kZXIgPSBmdW5jdGlvbih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpIHtcblx0XHRcdHZhciBwcmV2VGltZSA9IHRoaXMuX3RpbWUsXG5cdFx0XHRcdGR1cmF0aW9uID0gdGhpcy5fZHVyYXRpb24sXG5cdFx0XHRcdHByZXZSYXdQcmV2VGltZSA9IHRoaXMuX3Jhd1ByZXZUaW1lLFxuXHRcdFx0XHRpc0NvbXBsZXRlLCBjYWxsYmFjaywgcHQsIHJhd1ByZXZUaW1lO1xuXHRcdFx0aWYgKHRpbWUgPj0gZHVyYXRpb24pIHtcblx0XHRcdFx0dGhpcy5fdG90YWxUaW1lID0gdGhpcy5fdGltZSA9IGR1cmF0aW9uO1xuXHRcdFx0XHR0aGlzLnJhdGlvID0gdGhpcy5fZWFzZS5fY2FsY0VuZCA/IHRoaXMuX2Vhc2UuZ2V0UmF0aW8oMSkgOiAxO1xuXHRcdFx0XHRpZiAoIXRoaXMuX3JldmVyc2VkICkge1xuXHRcdFx0XHRcdGlzQ29tcGxldGUgPSB0cnVlO1xuXHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvbkNvbXBsZXRlXCI7XG5cdFx0XHRcdFx0Zm9yY2UgPSAoZm9yY2UgfHwgdGhpcy5fdGltZWxpbmUuYXV0b1JlbW92ZUNoaWxkcmVuKTsgLy9vdGhlcndpc2UsIGlmIHRoZSBhbmltYXRpb24gaXMgdW5wYXVzZWQvYWN0aXZhdGVkIGFmdGVyIGl0J3MgYWxyZWFkeSBmaW5pc2hlZCwgaXQgZG9lc24ndCBnZXQgcmVtb3ZlZCBmcm9tIHRoZSBwYXJlbnQgdGltZWxpbmUuXG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGR1cmF0aW9uID09PSAwKSBpZiAodGhpcy5faW5pdHRlZCB8fCAhdGhpcy52YXJzLmxhenkgfHwgZm9yY2UpIHsgLy96ZXJvLWR1cmF0aW9uIHR3ZWVucyBhcmUgdHJpY2t5IGJlY2F1c2Ugd2UgbXVzdCBkaXNjZXJuIHRoZSBtb21lbnR1bS9kaXJlY3Rpb24gb2YgdGltZSBpbiBvcmRlciB0byBkZXRlcm1pbmUgd2hldGhlciB0aGUgc3RhcnRpbmcgdmFsdWVzIHNob3VsZCBiZSByZW5kZXJlZCBvciB0aGUgZW5kaW5nIHZhbHVlcy4gSWYgdGhlIFwicGxheWhlYWRcIiBvZiBpdHMgdGltZWxpbmUgZ29lcyBwYXN0IHRoZSB6ZXJvLWR1cmF0aW9uIHR3ZWVuIGluIHRoZSBmb3J3YXJkIGRpcmVjdGlvbiBvciBsYW5kcyBkaXJlY3RseSBvbiBpdCwgdGhlIGVuZCB2YWx1ZXMgc2hvdWxkIGJlIHJlbmRlcmVkLCBidXQgaWYgdGhlIHRpbWVsaW5lJ3MgXCJwbGF5aGVhZFwiIG1vdmVzIHBhc3QgaXQgaW4gdGhlIGJhY2t3YXJkIGRpcmVjdGlvbiAoZnJvbSBhIHBvc3RpdGl2ZSB0aW1lIHRvIGEgbmVnYXRpdmUgdGltZSksIHRoZSBzdGFydGluZyB2YWx1ZXMgbXVzdCBiZSByZW5kZXJlZC5cblx0XHRcdFx0XHRpZiAodGhpcy5fc3RhcnRUaW1lID09PSB0aGlzLl90aW1lbGluZS5fZHVyYXRpb24pIHsgLy9pZiBhIHplcm8tZHVyYXRpb24gdHdlZW4gaXMgYXQgdGhlIFZFUlkgZW5kIG9mIGEgdGltZWxpbmUgYW5kIHRoYXQgdGltZWxpbmUgcmVuZGVycyBhdCBpdHMgZW5kLCBpdCB3aWxsIHR5cGljYWxseSBhZGQgYSB0aW55IGJpdCBvZiBjdXNoaW9uIHRvIHRoZSByZW5kZXIgdGltZSB0byBwcmV2ZW50IHJvdW5kaW5nIGVycm9ycyBmcm9tIGdldHRpbmcgaW4gdGhlIHdheSBvZiB0d2VlbnMgcmVuZGVyaW5nIHRoZWlyIFZFUlkgZW5kLiBJZiB3ZSB0aGVuIHJldmVyc2UoKSB0aGF0IHRpbWVsaW5lLCB0aGUgemVyby1kdXJhdGlvbiB0d2VlbiB3aWxsIHRyaWdnZXIgaXRzIG9uUmV2ZXJzZUNvbXBsZXRlIGV2ZW4gdGhvdWdoIHRlY2huaWNhbGx5IHRoZSBwbGF5aGVhZCBkaWRuJ3QgcGFzcyBvdmVyIGl0IGFnYWluLiBJdCdzIGEgdmVyeSBzcGVjaWZpYyBlZGdlIGNhc2Ugd2UgbXVzdCBhY2NvbW1vZGF0ZS5cblx0XHRcdFx0XHRcdHRpbWUgPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAodGltZSA9PT0gMCB8fCBwcmV2UmF3UHJldlRpbWUgPCAwIHx8IChwcmV2UmF3UHJldlRpbWUgPT09IF90aW55TnVtICYmIHRoaXMuZGF0YSAhPT0gXCJpc1BhdXNlXCIpKSBpZiAocHJldlJhd1ByZXZUaW1lICE9PSB0aW1lKSB7IC8vbm90ZTogd2hlbiB0aGlzLmRhdGEgaXMgXCJpc1BhdXNlXCIsIGl0J3MgYSBjYWxsYmFjayBhZGRlZCBieSBhZGRQYXVzZSgpIG9uIGEgdGltZWxpbmUgdGhhdCB3ZSBzaG91bGQgbm90IGJlIHRyaWdnZXJlZCB3aGVuIExFQVZJTkcgaXRzIGV4YWN0IHN0YXJ0IHRpbWUuIEluIG90aGVyIHdvcmRzLCB0bC5hZGRQYXVzZSgxKS5wbGF5KDEpIHNob3VsZG4ndCBwYXVzZS5cblx0XHRcdFx0XHRcdGZvcmNlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGlmIChwcmV2UmF3UHJldlRpbWUgPiBfdGlueU51bSkge1xuXHRcdFx0XHRcdFx0XHRjYWxsYmFjayA9IFwib25SZXZlcnNlQ29tcGxldGVcIjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5fcmF3UHJldlRpbWUgPSByYXdQcmV2VGltZSA9ICghc3VwcHJlc3NFdmVudHMgfHwgdGltZSB8fCBwcmV2UmF3UHJldlRpbWUgPT09IHRpbWUpID8gdGltZSA6IF90aW55TnVtOyAvL3doZW4gdGhlIHBsYXloZWFkIGFycml2ZXMgYXQgRVhBQ1RMWSB0aW1lIDAgKHJpZ2h0IG9uIHRvcCkgb2YgYSB6ZXJvLWR1cmF0aW9uIHR3ZWVuLCB3ZSBuZWVkIHRvIGRpc2Nlcm4gaWYgZXZlbnRzIGFyZSBzdXBwcmVzc2VkIHNvIHRoYXQgd2hlbiB0aGUgcGxheWhlYWQgbW92ZXMgYWdhaW4gKG5leHQgdGltZSksIGl0J2xsIHRyaWdnZXIgdGhlIGNhbGxiYWNrLiBJZiBldmVudHMgYXJlIE5PVCBzdXBwcmVzc2VkLCBvYnZpb3VzbHkgdGhlIGNhbGxiYWNrIHdvdWxkIGJlIHRyaWdnZXJlZCBpbiB0aGlzIHJlbmRlci4gQmFzaWNhbGx5LCB0aGUgY2FsbGJhY2sgc2hvdWxkIGZpcmUgZWl0aGVyIHdoZW4gdGhlIHBsYXloZWFkIEFSUklWRVMgb3IgTEVBVkVTIHRoaXMgZXhhY3Qgc3BvdCwgbm90IGJvdGguIEltYWdpbmUgZG9pbmcgYSB0aW1lbGluZS5zZWVrKDApIGFuZCB0aGVyZSdzIGEgY2FsbGJhY2sgdGhhdCBzaXRzIGF0IDAuIFNpbmNlIGV2ZW50cyBhcmUgc3VwcHJlc3NlZCBvbiB0aGF0IHNlZWsoKSBieSBkZWZhdWx0LCBub3RoaW5nIHdpbGwgZmlyZSwgYnV0IHdoZW4gdGhlIHBsYXloZWFkIG1vdmVzIG9mZiBvZiB0aGF0IHBvc2l0aW9uLCB0aGUgY2FsbGJhY2sgc2hvdWxkIGZpcmUuIFRoaXMgYmVoYXZpb3IgaXMgd2hhdCBwZW9wbGUgaW50dWl0aXZlbHkgZXhwZWN0LiBXZSBzZXQgdGhlIF9yYXdQcmV2VGltZSB0byBiZSBhIHByZWNpc2UgdGlueSBudW1iZXIgdG8gaW5kaWNhdGUgdGhpcyBzY2VuYXJpbyByYXRoZXIgdGhhbiB1c2luZyBhbm90aGVyIHByb3BlcnR5L3ZhcmlhYmxlIHdoaWNoIHdvdWxkIGluY3JlYXNlIG1lbW9yeSB1c2FnZS4gVGhpcyB0ZWNobmlxdWUgaXMgbGVzcyByZWFkYWJsZSwgYnV0IG1vcmUgZWZmaWNpZW50LlxuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSBpZiAodGltZSA8IDAuMDAwMDAwMSkgeyAvL3RvIHdvcmsgYXJvdW5kIG9jY2FzaW9uYWwgZmxvYXRpbmcgcG9pbnQgbWF0aCBhcnRpZmFjdHMsIHJvdW5kIHN1cGVyIHNtYWxsIHZhbHVlcyB0byAwLlxuXHRcdFx0XHR0aGlzLl90b3RhbFRpbWUgPSB0aGlzLl90aW1lID0gMDtcblx0XHRcdFx0dGhpcy5yYXRpbyA9IHRoaXMuX2Vhc2UuX2NhbGNFbmQgPyB0aGlzLl9lYXNlLmdldFJhdGlvKDApIDogMDtcblx0XHRcdFx0aWYgKHByZXZUaW1lICE9PSAwIHx8IChkdXJhdGlvbiA9PT0gMCAmJiBwcmV2UmF3UHJldlRpbWUgPiAwKSkge1xuXHRcdFx0XHRcdGNhbGxiYWNrID0gXCJvblJldmVyc2VDb21wbGV0ZVwiO1xuXHRcdFx0XHRcdGlzQ29tcGxldGUgPSB0aGlzLl9yZXZlcnNlZDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGltZSA8IDApIHtcblx0XHRcdFx0XHR0aGlzLl9hY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0XHRpZiAoZHVyYXRpb24gPT09IDApIGlmICh0aGlzLl9pbml0dGVkIHx8ICF0aGlzLnZhcnMubGF6eSB8fCBmb3JjZSkgeyAvL3plcm8tZHVyYXRpb24gdHdlZW5zIGFyZSB0cmlja3kgYmVjYXVzZSB3ZSBtdXN0IGRpc2Nlcm4gdGhlIG1vbWVudHVtL2RpcmVjdGlvbiBvZiB0aW1lIGluIG9yZGVyIHRvIGRldGVybWluZSB3aGV0aGVyIHRoZSBzdGFydGluZyB2YWx1ZXMgc2hvdWxkIGJlIHJlbmRlcmVkIG9yIHRoZSBlbmRpbmcgdmFsdWVzLiBJZiB0aGUgXCJwbGF5aGVhZFwiIG9mIGl0cyB0aW1lbGluZSBnb2VzIHBhc3QgdGhlIHplcm8tZHVyYXRpb24gdHdlZW4gaW4gdGhlIGZvcndhcmQgZGlyZWN0aW9uIG9yIGxhbmRzIGRpcmVjdGx5IG9uIGl0LCB0aGUgZW5kIHZhbHVlcyBzaG91bGQgYmUgcmVuZGVyZWQsIGJ1dCBpZiB0aGUgdGltZWxpbmUncyBcInBsYXloZWFkXCIgbW92ZXMgcGFzdCBpdCBpbiB0aGUgYmFja3dhcmQgZGlyZWN0aW9uIChmcm9tIGEgcG9zdGl0aXZlIHRpbWUgdG8gYSBuZWdhdGl2ZSB0aW1lKSwgdGhlIHN0YXJ0aW5nIHZhbHVlcyBtdXN0IGJlIHJlbmRlcmVkLlxuXHRcdFx0XHRcdFx0aWYgKHByZXZSYXdQcmV2VGltZSA+PSAwICYmICEocHJldlJhd1ByZXZUaW1lID09PSBfdGlueU51bSAmJiB0aGlzLmRhdGEgPT09IFwiaXNQYXVzZVwiKSkge1xuXHRcdFx0XHRcdFx0XHRmb3JjZSA9IHRydWU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9IHJhd1ByZXZUaW1lID0gKCFzdXBwcmVzc0V2ZW50cyB8fCB0aW1lIHx8IHByZXZSYXdQcmV2VGltZSA9PT0gdGltZSkgPyB0aW1lIDogX3RpbnlOdW07IC8vd2hlbiB0aGUgcGxheWhlYWQgYXJyaXZlcyBhdCBFWEFDVExZIHRpbWUgMCAocmlnaHQgb24gdG9wKSBvZiBhIHplcm8tZHVyYXRpb24gdHdlZW4sIHdlIG5lZWQgdG8gZGlzY2VybiBpZiBldmVudHMgYXJlIHN1cHByZXNzZWQgc28gdGhhdCB3aGVuIHRoZSBwbGF5aGVhZCBtb3ZlcyBhZ2FpbiAobmV4dCB0aW1lKSwgaXQnbGwgdHJpZ2dlciB0aGUgY2FsbGJhY2suIElmIGV2ZW50cyBhcmUgTk9UIHN1cHByZXNzZWQsIG9idmlvdXNseSB0aGUgY2FsbGJhY2sgd291bGQgYmUgdHJpZ2dlcmVkIGluIHRoaXMgcmVuZGVyLiBCYXNpY2FsbHksIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZSBlaXRoZXIgd2hlbiB0aGUgcGxheWhlYWQgQVJSSVZFUyBvciBMRUFWRVMgdGhpcyBleGFjdCBzcG90LCBub3QgYm90aC4gSW1hZ2luZSBkb2luZyBhIHRpbWVsaW5lLnNlZWsoMCkgYW5kIHRoZXJlJ3MgYSBjYWxsYmFjayB0aGF0IHNpdHMgYXQgMC4gU2luY2UgZXZlbnRzIGFyZSBzdXBwcmVzc2VkIG9uIHRoYXQgc2VlaygpIGJ5IGRlZmF1bHQsIG5vdGhpbmcgd2lsbCBmaXJlLCBidXQgd2hlbiB0aGUgcGxheWhlYWQgbW92ZXMgb2ZmIG9mIHRoYXQgcG9zaXRpb24sIHRoZSBjYWxsYmFjayBzaG91bGQgZmlyZS4gVGhpcyBiZWhhdmlvciBpcyB3aGF0IHBlb3BsZSBpbnR1aXRpdmVseSBleHBlY3QuIFdlIHNldCB0aGUgX3Jhd1ByZXZUaW1lIHRvIGJlIGEgcHJlY2lzZSB0aW55IG51bWJlciB0byBpbmRpY2F0ZSB0aGlzIHNjZW5hcmlvIHJhdGhlciB0aGFuIHVzaW5nIGFub3RoZXIgcHJvcGVydHkvdmFyaWFibGUgd2hpY2ggd291bGQgaW5jcmVhc2UgbWVtb3J5IHVzYWdlLiBUaGlzIHRlY2huaXF1ZSBpcyBsZXNzIHJlYWRhYmxlLCBidXQgbW9yZSBlZmZpY2llbnQuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghdGhpcy5faW5pdHRlZCkgeyAvL2lmIHdlIHJlbmRlciB0aGUgdmVyeSBiZWdpbm5pbmcgKHRpbWUgPT0gMCkgb2YgYSBmcm9tVG8oKSwgd2UgbXVzdCBmb3JjZSB0aGUgcmVuZGVyIChub3JtYWwgdHdlZW5zIHdvdWxkbid0IG5lZWQgdG8gcmVuZGVyIGF0IGEgdGltZSBvZiAwIHdoZW4gdGhlIHByZXZUaW1lIHdhcyBhbHNvIDApLiBUaGlzIGlzIGFsc28gbWFuZGF0b3J5IHRvIG1ha2Ugc3VyZSBvdmVyd3JpdGluZyBraWNrcyBpbiBpbW1lZGlhdGVseS5cblx0XHRcdFx0XHRmb3JjZSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX3RvdGFsVGltZSA9IHRoaXMuX3RpbWUgPSB0aW1lO1xuXG5cdFx0XHRcdGlmICh0aGlzLl9lYXNlVHlwZSkge1xuXHRcdFx0XHRcdHZhciByID0gdGltZSAvIGR1cmF0aW9uLCB0eXBlID0gdGhpcy5fZWFzZVR5cGUsIHBvdyA9IHRoaXMuX2Vhc2VQb3dlcjtcblx0XHRcdFx0XHRpZiAodHlwZSA9PT0gMSB8fCAodHlwZSA9PT0gMyAmJiByID49IDAuNSkpIHtcblx0XHRcdFx0XHRcdHIgPSAxIC0gcjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHR5cGUgPT09IDMpIHtcblx0XHRcdFx0XHRcdHIgKj0gMjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKHBvdyA9PT0gMSkge1xuXHRcdFx0XHRcdFx0ciAqPSByO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocG93ID09PSAyKSB7XG5cdFx0XHRcdFx0XHRyICo9IHIgKiByO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocG93ID09PSAzKSB7XG5cdFx0XHRcdFx0XHRyICo9IHIgKiByICogcjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHBvdyA9PT0gNCkge1xuXHRcdFx0XHRcdFx0ciAqPSByICogciAqIHIgKiByO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICh0eXBlID09PSAxKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnJhdGlvID0gMSAtIHI7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0eXBlID09PSAyKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnJhdGlvID0gcjtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHRpbWUgLyBkdXJhdGlvbiA8IDAuNSkge1xuXHRcdFx0XHRcdFx0dGhpcy5yYXRpbyA9IHIgLyAyO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLnJhdGlvID0gMSAtIChyIC8gMik7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy5yYXRpbyA9IHRoaXMuX2Vhc2UuZ2V0UmF0aW8odGltZSAvIGR1cmF0aW9uKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fdGltZSA9PT0gcHJldlRpbWUgJiYgIWZvcmNlKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH0gZWxzZSBpZiAoIXRoaXMuX2luaXR0ZWQpIHtcblx0XHRcdFx0dGhpcy5faW5pdCgpO1xuXHRcdFx0XHRpZiAoIXRoaXMuX2luaXR0ZWQgfHwgdGhpcy5fZ2MpIHsgLy9pbW1lZGlhdGVSZW5kZXIgdHdlZW5zIHR5cGljYWxseSB3b24ndCBpbml0aWFsaXplIHVudGlsIHRoZSBwbGF5aGVhZCBhZHZhbmNlcyAoX3RpbWUgaXMgZ3JlYXRlciB0aGFuIDApIGluIG9yZGVyIHRvIGVuc3VyZSB0aGF0IG92ZXJ3cml0aW5nIG9jY3VycyBwcm9wZXJseS4gQWxzbywgaWYgYWxsIG9mIHRoZSB0d2VlbmluZyBwcm9wZXJ0aWVzIGhhdmUgYmVlbiBvdmVyd3JpdHRlbiAod2hpY2ggd291bGQgY2F1c2UgX2djIHRvIGJlIHRydWUsIGFzIHNldCBpbiBfaW5pdCgpKSwgd2Ugc2hvdWxkbid0IGNvbnRpbnVlIG90aGVyd2lzZSBhbiBvblN0YXJ0IGNhbGxiYWNrIGNvdWxkIGJlIGNhbGxlZCBmb3IgZXhhbXBsZS5cblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH0gZWxzZSBpZiAoIWZvcmNlICYmIHRoaXMuX2ZpcnN0UFQgJiYgKCh0aGlzLnZhcnMubGF6eSAhPT0gZmFsc2UgJiYgdGhpcy5fZHVyYXRpb24pIHx8ICh0aGlzLnZhcnMubGF6eSAmJiAhdGhpcy5fZHVyYXRpb24pKSkge1xuXHRcdFx0XHRcdHRoaXMuX3RpbWUgPSB0aGlzLl90b3RhbFRpbWUgPSBwcmV2VGltZTtcblx0XHRcdFx0XHR0aGlzLl9yYXdQcmV2VGltZSA9IHByZXZSYXdQcmV2VGltZTtcblx0XHRcdFx0XHRfbGF6eVR3ZWVucy5wdXNoKHRoaXMpO1xuXHRcdFx0XHRcdHRoaXMuX2xhenkgPSBbdGltZSwgc3VwcHJlc3NFdmVudHNdO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL19lYXNlIGlzIGluaXRpYWxseSBzZXQgdG8gZGVmYXVsdEVhc2UsIHNvIG5vdyB0aGF0IGluaXQoKSBoYXMgcnVuLCBfZWFzZSBpcyBzZXQgcHJvcGVybHkgYW5kIHdlIG5lZWQgdG8gcmVjYWxjdWxhdGUgdGhlIHJhdGlvLiBPdmVyYWxsIHRoaXMgaXMgZmFzdGVyIHRoYW4gdXNpbmcgY29uZGl0aW9uYWwgbG9naWMgZWFybGllciBpbiB0aGUgbWV0aG9kIHRvIGF2b2lkIGhhdmluZyB0byBzZXQgcmF0aW8gdHdpY2UgYmVjYXVzZSB3ZSBvbmx5IGluaXQoKSBvbmNlIGJ1dCByZW5kZXJUaW1lKCkgZ2V0cyBjYWxsZWQgVkVSWSBmcmVxdWVudGx5LlxuXHRcdFx0XHRpZiAodGhpcy5fdGltZSAmJiAhaXNDb21wbGV0ZSkge1xuXHRcdFx0XHRcdHRoaXMucmF0aW8gPSB0aGlzLl9lYXNlLmdldFJhdGlvKHRoaXMuX3RpbWUgLyBkdXJhdGlvbik7XG5cdFx0XHRcdH0gZWxzZSBpZiAoaXNDb21wbGV0ZSAmJiB0aGlzLl9lYXNlLl9jYWxjRW5kKSB7XG5cdFx0XHRcdFx0dGhpcy5yYXRpbyA9IHRoaXMuX2Vhc2UuZ2V0UmF0aW8oKHRoaXMuX3RpbWUgPT09IDApID8gMCA6IDEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5fbGF6eSAhPT0gZmFsc2UpIHsgLy9pbiBjYXNlIGEgbGF6eSByZW5kZXIgaXMgcGVuZGluZywgd2Ugc2hvdWxkIGZsdXNoIGl0IGJlY2F1c2UgdGhlIG5ldyByZW5kZXIgaXMgb2NjdXJyaW5nIG5vdyAoaW1hZ2luZSBhIGxhenkgdHdlZW4gaW5zdGFudGlhdGluZyBhbmQgdGhlbiBpbW1lZGlhdGVseSB0aGUgdXNlciBjYWxscyB0d2Vlbi5zZWVrKHR3ZWVuLmR1cmF0aW9uKCkpLCBza2lwcGluZyB0byB0aGUgZW5kIC0gdGhlIGVuZCByZW5kZXIgd291bGQgYmUgZm9yY2VkLCBhbmQgdGhlbiBpZiB3ZSBkaWRuJ3QgZmx1c2ggdGhlIGxhenkgcmVuZGVyLCBpdCdkIGZpcmUgQUZURVIgdGhlIHNlZWsoKSwgcmVuZGVyaW5nIGl0IGF0IHRoZSB3cm9uZyB0aW1lLlxuXHRcdFx0XHR0aGlzLl9sYXp5ID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIXRoaXMuX2FjdGl2ZSkgaWYgKCF0aGlzLl9wYXVzZWQgJiYgdGhpcy5fdGltZSAhPT0gcHJldlRpbWUgJiYgdGltZSA+PSAwKSB7XG5cdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IHRydWU7ICAvL3NvIHRoYXQgaWYgdGhlIHVzZXIgcmVuZGVycyBhIHR3ZWVuIChhcyBvcHBvc2VkIHRvIHRoZSB0aW1lbGluZSByZW5kZXJpbmcgaXQpLCB0aGUgdGltZWxpbmUgaXMgZm9yY2VkIHRvIHJlLXJlbmRlciBhbmQgYWxpZ24gaXQgd2l0aCB0aGUgcHJvcGVyIHRpbWUvZnJhbWUgb24gdGhlIG5leHQgcmVuZGVyaW5nIGN5Y2xlLiBNYXliZSB0aGUgdHdlZW4gYWxyZWFkeSBmaW5pc2hlZCBidXQgdGhlIHVzZXIgbWFudWFsbHkgcmUtcmVuZGVycyBpdCBhcyBoYWxmd2F5IGRvbmUuXG5cdFx0XHR9XG5cdFx0XHRpZiAocHJldlRpbWUgPT09IDApIHtcblx0XHRcdFx0aWYgKHRoaXMuX3N0YXJ0QXQpIHtcblx0XHRcdFx0XHRpZiAodGltZSA+PSAwKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9zdGFydEF0LnJlbmRlcih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIWNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0XHRjYWxsYmFjayA9IFwiX2R1bW15R1NcIjsgLy9pZiBubyBjYWxsYmFjayBpcyBkZWZpbmVkLCB1c2UgYSBkdW1teSB2YWx1ZSBqdXN0IHNvIHRoYXQgdGhlIGNvbmRpdGlvbiBhdCB0aGUgZW5kIGV2YWx1YXRlcyBhcyB0cnVlIGJlY2F1c2UgX3N0YXJ0QXQgc2hvdWxkIHJlbmRlciBBRlRFUiB0aGUgbm9ybWFsIHJlbmRlciBsb29wIHdoZW4gdGhlIHRpbWUgaXMgbmVnYXRpdmUuIFdlIGNvdWxkIGhhbmRsZSB0aGlzIGluIGEgbW9yZSBpbnR1aXRpdmUgd2F5LCBvZiBjb3Vyc2UsIGJ1dCB0aGUgcmVuZGVyIGxvb3AgaXMgdGhlIE1PU1QgaW1wb3J0YW50IHRoaW5nIHRvIG9wdGltaXplLCBzbyB0aGlzIHRlY2huaXF1ZSBhbGxvd3MgdXMgdG8gYXZvaWQgYWRkaW5nIGV4dHJhIGNvbmRpdGlvbmFsIGxvZ2ljIGluIGEgaGlnaC1mcmVxdWVuY3kgYXJlYS5cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMudmFycy5vblN0YXJ0KSBpZiAodGhpcy5fdGltZSAhPT0gMCB8fCBkdXJhdGlvbiA9PT0gMCkgaWYgKCFzdXBwcmVzc0V2ZW50cykge1xuXHRcdFx0XHRcdHRoaXMuX2NhbGxiYWNrKFwib25TdGFydFwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cHQgPSB0aGlzLl9maXJzdFBUO1xuXHRcdFx0d2hpbGUgKHB0KSB7XG5cdFx0XHRcdGlmIChwdC5mKSB7XG5cdFx0XHRcdFx0cHQudFtwdC5wXShwdC5jICogdGhpcy5yYXRpbyArIHB0LnMpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHB0LnRbcHQucF0gPSBwdC5jICogdGhpcy5yYXRpbyArIHB0LnM7XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuX29uVXBkYXRlKSB7XG5cdFx0XHRcdGlmICh0aW1lIDwgMCkgaWYgKHRoaXMuX3N0YXJ0QXQgJiYgdGltZSAhPT0gLTAuMDAwMSkgeyAvL2lmIHRoZSB0d2VlbiBpcyBwb3NpdGlvbmVkIGF0IHRoZSBWRVJZIGJlZ2lubmluZyAoX3N0YXJ0VGltZSAwKSBvZiBpdHMgcGFyZW50IHRpbWVsaW5lLCBpdCdzIGlsbGVnYWwgZm9yIHRoZSBwbGF5aGVhZCB0byBnbyBiYWNrIGZ1cnRoZXIsIHNvIHdlIHNob3VsZCBub3QgcmVuZGVyIHRoZSByZWNvcmRlZCBzdGFydEF0IHZhbHVlcy5cblx0XHRcdFx0XHR0aGlzLl9zdGFydEF0LnJlbmRlcih0aW1lLCBzdXBwcmVzc0V2ZW50cywgZm9yY2UpOyAvL25vdGU6IGZvciBwZXJmb3JtYW5jZSByZWFzb25zLCB3ZSB0dWNrIHRoaXMgY29uZGl0aW9uYWwgbG9naWMgaW5zaWRlIGxlc3MgdHJhdmVsZWQgYXJlYXMgKG1vc3QgdHdlZW5zIGRvbid0IGhhdmUgYW4gb25VcGRhdGUpLiBXZSdkIGp1c3QgaGF2ZSBpdCBhdCB0aGUgZW5kIGJlZm9yZSB0aGUgb25Db21wbGV0ZSwgYnV0IHRoZSB2YWx1ZXMgc2hvdWxkIGJlIHVwZGF0ZWQgYmVmb3JlIGFueSBvblVwZGF0ZSBpcyBjYWxsZWQsIHNvIHdlIEFMU08gcHV0IGl0IGhlcmUgYW5kIHRoZW4gaWYgaXQncyBub3QgY2FsbGVkLCB3ZSBkbyBzbyBsYXRlciBuZWFyIHRoZSBvbkNvbXBsZXRlLlxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghc3VwcHJlc3NFdmVudHMpIGlmICh0aGlzLl90aW1lICE9PSBwcmV2VGltZSB8fCBpc0NvbXBsZXRlKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2soXCJvblVwZGF0ZVwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGNhbGxiYWNrKSBpZiAoIXRoaXMuX2djIHx8IGZvcmNlKSB7IC8vY2hlY2sgX2djIGJlY2F1c2UgdGhlcmUncyBhIGNoYW5jZSB0aGF0IGtpbGwoKSBjb3VsZCBiZSBjYWxsZWQgaW4gYW4gb25VcGRhdGVcblx0XHRcdFx0aWYgKHRpbWUgPCAwICYmIHRoaXMuX3N0YXJ0QXQgJiYgIXRoaXMuX29uVXBkYXRlICYmIHRpbWUgIT09IC0wLjAwMDEpIHsgLy8tMC4wMDAxIGlzIGEgc3BlY2lhbCB2YWx1ZSB0aGF0IHdlIHVzZSB3aGVuIGxvb3BpbmcgYmFjayB0byB0aGUgYmVnaW5uaW5nIG9mIGEgcmVwZWF0ZWQgVGltZWxpbmVNYXgsIGluIHdoaWNoIGNhc2Ugd2Ugc2hvdWxkbid0IHJlbmRlciB0aGUgX3N0YXJ0QXQgdmFsdWVzLlxuXHRcdFx0XHRcdHRoaXMuX3N0YXJ0QXQucmVuZGVyKHRpbWUsIHN1cHByZXNzRXZlbnRzLCBmb3JjZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGlzQ29tcGxldGUpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5fdGltZWxpbmUuYXV0b1JlbW92ZUNoaWxkcmVuKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9lbmFibGVkKGZhbHNlLCBmYWxzZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICghc3VwcHJlc3NFdmVudHMgJiYgdGhpcy52YXJzW2NhbGxiYWNrXSkge1xuXHRcdFx0XHRcdHRoaXMuX2NhbGxiYWNrKGNhbGxiYWNrKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZHVyYXRpb24gPT09IDAgJiYgdGhpcy5fcmF3UHJldlRpbWUgPT09IF90aW55TnVtICYmIHJhd1ByZXZUaW1lICE9PSBfdGlueU51bSkgeyAvL3RoZSBvbkNvbXBsZXRlIG9yIG9uUmV2ZXJzZUNvbXBsZXRlIGNvdWxkIHRyaWdnZXIgbW92ZW1lbnQgb2YgdGhlIHBsYXloZWFkIGFuZCBmb3IgemVyby1kdXJhdGlvbiB0d2VlbnMgKHdoaWNoIG11c3QgZGlzY2VybiBkaXJlY3Rpb24pIHRoYXQgbGFuZCBkaXJlY3RseSBiYWNrIG9uIHRoZWlyIHN0YXJ0IHRpbWUsIHdlIGRvbid0IHdhbnQgdG8gZmlyZSBhZ2FpbiBvbiB0aGUgbmV4dCByZW5kZXIuIFRoaW5rIG9mIHNldmVyYWwgYWRkUGF1c2UoKSdzIGluIGEgdGltZWxpbmUgdGhhdCBmb3JjZXMgdGhlIHBsYXloZWFkIHRvIGEgY2VydGFpbiBzcG90LCBidXQgd2hhdCBpZiBpdCdzIGFscmVhZHkgcGF1c2VkIGFuZCBhbm90aGVyIHR3ZWVuIGlzIHR3ZWVuaW5nIHRoZSBcInRpbWVcIiBvZiB0aGUgdGltZWxpbmU/IEVhY2ggdGltZSBpdCBtb3ZlcyBbZm9yd2FyZF0gcGFzdCB0aGF0IHNwb3QsIGl0IHdvdWxkIG1vdmUgYmFjaywgYW5kIHNpbmNlIHN1cHByZXNzRXZlbnRzIGlzIHRydWUsIGl0J2QgcmVzZXQgX3Jhd1ByZXZUaW1lIHRvIF90aW55TnVtIHNvIHRoYXQgd2hlbiBpdCBiZWdpbnMgYWdhaW4sIHRoZSBjYWxsYmFjayB3b3VsZCBmaXJlIChzbyB1bHRpbWF0ZWx5IGl0IGNvdWxkIGJvdW5jZSBiYWNrIGFuZCBmb3J0aCBkdXJpbmcgdGhhdCB0d2VlbikuIEFnYWluLCB0aGlzIGlzIGEgdmVyeSB1bmNvbW1vbiBzY2VuYXJpbywgYnV0IHBvc3NpYmxlIG5vbmV0aGVsZXNzLlxuXHRcdFx0XHRcdHRoaXMuX3Jhd1ByZXZUaW1lID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRwLl9raWxsID0gZnVuY3Rpb24odmFycywgdGFyZ2V0LCBvdmVyd3JpdGluZ1R3ZWVuKSB7XG5cdFx0XHRpZiAodmFycyA9PT0gXCJhbGxcIikge1xuXHRcdFx0XHR2YXJzID0gbnVsbDtcblx0XHRcdH1cblx0XHRcdGlmICh2YXJzID09IG51bGwpIGlmICh0YXJnZXQgPT0gbnVsbCB8fCB0YXJnZXQgPT09IHRoaXMudGFyZ2V0KSB7XG5cdFx0XHRcdHRoaXMuX2xhenkgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdH1cblx0XHRcdHRhcmdldCA9ICh0eXBlb2YodGFyZ2V0KSAhPT0gXCJzdHJpbmdcIikgPyAodGFyZ2V0IHx8IHRoaXMuX3RhcmdldHMgfHwgdGhpcy50YXJnZXQpIDogVHdlZW5MaXRlLnNlbGVjdG9yKHRhcmdldCkgfHwgdGFyZ2V0O1xuXHRcdFx0dmFyIHNpbXVsdGFuZW91c092ZXJ3cml0ZSA9IChvdmVyd3JpdGluZ1R3ZWVuICYmIHRoaXMuX3RpbWUgJiYgb3ZlcndyaXRpbmdUd2Vlbi5fc3RhcnRUaW1lID09PSB0aGlzLl9zdGFydFRpbWUgJiYgdGhpcy5fdGltZWxpbmUgPT09IG92ZXJ3cml0aW5nVHdlZW4uX3RpbWVsaW5lKSxcblx0XHRcdFx0aSwgb3ZlcndyaXR0ZW5Qcm9wcywgcCwgcHQsIHByb3BMb29rdXAsIGNoYW5nZWQsIGtpbGxQcm9wcywgcmVjb3JkLCBraWxsZWQ7XG5cdFx0XHRpZiAoKF9pc0FycmF5KHRhcmdldCkgfHwgX2lzU2VsZWN0b3IodGFyZ2V0KSkgJiYgdHlwZW9mKHRhcmdldFswXSkgIT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0aSA9IHRhcmdldC5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGlmICh0aGlzLl9raWxsKHZhcnMsIHRhcmdldFtpXSwgb3ZlcndyaXRpbmdUd2VlbikpIHtcblx0XHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHRoaXMuX3RhcmdldHMpIHtcblx0XHRcdFx0XHRpID0gdGhpcy5fdGFyZ2V0cy5sZW5ndGg7XG5cdFx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0XHRpZiAodGFyZ2V0ID09PSB0aGlzLl90YXJnZXRzW2ldKSB7XG5cdFx0XHRcdFx0XHRcdHByb3BMb29rdXAgPSB0aGlzLl9wcm9wTG9va3VwW2ldIHx8IHt9O1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9vdmVyd3JpdHRlblByb3BzID0gdGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcyB8fCBbXTtcblx0XHRcdFx0XHRcdFx0b3ZlcndyaXR0ZW5Qcm9wcyA9IHRoaXMuX292ZXJ3cml0dGVuUHJvcHNbaV0gPSB2YXJzID8gdGhpcy5fb3ZlcndyaXR0ZW5Qcm9wc1tpXSB8fCB7fSA6IFwiYWxsXCI7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIGlmICh0YXJnZXQgIT09IHRoaXMudGFyZ2V0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHByb3BMb29rdXAgPSB0aGlzLl9wcm9wTG9va3VwO1xuXHRcdFx0XHRcdG92ZXJ3cml0dGVuUHJvcHMgPSB0aGlzLl9vdmVyd3JpdHRlblByb3BzID0gdmFycyA/IHRoaXMuX292ZXJ3cml0dGVuUHJvcHMgfHwge30gOiBcImFsbFwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHByb3BMb29rdXApIHtcblx0XHRcdFx0XHRraWxsUHJvcHMgPSB2YXJzIHx8IHByb3BMb29rdXA7XG5cdFx0XHRcdFx0cmVjb3JkID0gKHZhcnMgIT09IG92ZXJ3cml0dGVuUHJvcHMgJiYgb3ZlcndyaXR0ZW5Qcm9wcyAhPT0gXCJhbGxcIiAmJiB2YXJzICE9PSBwcm9wTG9va3VwICYmICh0eXBlb2YodmFycykgIT09IFwib2JqZWN0XCIgfHwgIXZhcnMuX3RlbXBLaWxsKSk7IC8vX3RlbXBLaWxsIGlzIGEgc3VwZXItc2VjcmV0IHdheSB0byBkZWxldGUgYSBwYXJ0aWN1bGFyIHR3ZWVuaW5nIHByb3BlcnR5IGJ1dCBOT1QgaGF2ZSBpdCByZW1lbWJlcmVkIGFzIGFuIG9mZmljaWFsIG92ZXJ3cml0dGVuIHByb3BlcnR5IChsaWtlIGluIEJlemllclBsdWdpbilcblx0XHRcdFx0XHRpZiAob3ZlcndyaXRpbmdUd2VlbiAmJiAoVHdlZW5MaXRlLm9uT3ZlcndyaXRlIHx8IHRoaXMudmFycy5vbk92ZXJ3cml0ZSkpIHtcblx0XHRcdFx0XHRcdGZvciAocCBpbiBraWxsUHJvcHMpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHByb3BMb29rdXBbcF0pIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAoIWtpbGxlZCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0a2lsbGVkID0gW107XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGtpbGxlZC5wdXNoKHApO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAoKGtpbGxlZCB8fCAhdmFycykgJiYgIV9vbk92ZXJ3cml0ZSh0aGlzLCBvdmVyd3JpdGluZ1R3ZWVuLCB0YXJnZXQsIGtpbGxlZCkpIHsgLy9pZiB0aGUgb25PdmVyd3JpdGUgcmV0dXJuZWQgZmFsc2UsIHRoYXQgbWVhbnMgdGhlIHVzZXIgd2FudHMgdG8gb3ZlcnJpZGUgdGhlIG92ZXJ3cml0aW5nIChjYW5jZWwgaXQpLlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Zm9yIChwIGluIGtpbGxQcm9wcykge1xuXHRcdFx0XHRcdFx0aWYgKChwdCA9IHByb3BMb29rdXBbcF0pKSB7XG5cdFx0XHRcdFx0XHRcdGlmIChzaW11bHRhbmVvdXNPdmVyd3JpdGUpIHsgLy9pZiBhbm90aGVyIHR3ZWVuIG92ZXJ3cml0ZXMgdGhpcyBvbmUgYW5kIHRoZXkgYm90aCBzdGFydCBhdCBleGFjdGx5IHRoZSBzYW1lIHRpbWUsIHlldCB0aGlzIHR3ZWVuIGhhcyBhbHJlYWR5IHJlbmRlcmVkIG9uY2UgKGZvciBleGFtcGxlLCBhdCAwLjAwMSkgYmVjYXVzZSBpdCdzIGZpcnN0IGluIHRoZSBxdWV1ZSwgd2Ugc2hvdWxkIHJldmVydCB0aGUgdmFsdWVzIHRvIHdoZXJlIHRoZXkgd2VyZSBhdCAwIHNvIHRoYXQgdGhlIHN0YXJ0aW5nIHZhbHVlcyBhcmVuJ3QgY29udGFtaW5hdGVkIG9uIHRoZSBvdmVyd3JpdGluZyB0d2Vlbi5cblx0XHRcdFx0XHRcdFx0XHRpZiAocHQuZikge1xuXHRcdFx0XHRcdFx0XHRcdFx0cHQudFtwdC5wXShwdC5zKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0cHQudFtwdC5wXSA9IHB0LnM7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmIChwdC5wZyAmJiBwdC50Ll9raWxsKGtpbGxQcm9wcykpIHtcblx0XHRcdFx0XHRcdFx0XHRjaGFuZ2VkID0gdHJ1ZTsgLy9zb21lIHBsdWdpbnMgbmVlZCB0byBiZSBub3RpZmllZCBzbyB0aGV5IGNhbiBwZXJmb3JtIGNsZWFudXAgdGFza3MgZmlyc3Rcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZiAoIXB0LnBnIHx8IHB0LnQuX292ZXJ3cml0ZVByb3BzLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChwdC5fcHJldikge1xuXHRcdFx0XHRcdFx0XHRcdFx0cHQuX3ByZXYuX25leHQgPSBwdC5fbmV4dDtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHB0ID09PSB0aGlzLl9maXJzdFBUKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLl9maXJzdFBUID0gcHQuX25leHQ7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGlmIChwdC5fbmV4dCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cHQuX25leHQuX3ByZXYgPSBwdC5fcHJldjtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0cHQuX25leHQgPSBwdC5fcHJldiA9IG51bGw7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZGVsZXRlIHByb3BMb29rdXBbcF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRpZiAocmVjb3JkKSB7XG5cdFx0XHRcdFx0XHRcdG92ZXJ3cml0dGVuUHJvcHNbcF0gPSAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIXRoaXMuX2ZpcnN0UFQgJiYgdGhpcy5faW5pdHRlZCkgeyAvL2lmIGFsbCB0d2VlbmluZyBwcm9wZXJ0aWVzIGFyZSBraWxsZWQsIGtpbGwgdGhlIHR3ZWVuLiBXaXRob3V0IHRoaXMgbGluZSwgaWYgdGhlcmUncyBhIHR3ZWVuIHdpdGggbXVsdGlwbGUgdGFyZ2V0cyBhbmQgdGhlbiB5b3Uga2lsbFR3ZWVuc09mKCkgZWFjaCB0YXJnZXQgaW5kaXZpZHVhbGx5LCB0aGUgdHdlZW4gd291bGQgdGVjaG5pY2FsbHkgc3RpbGwgcmVtYWluIGFjdGl2ZSBhbmQgZmlyZSBpdHMgb25Db21wbGV0ZSBldmVuIHRob3VnaCB0aGVyZSBhcmVuJ3QgYW55IG1vcmUgcHJvcGVydGllcyB0d2VlbmluZy5cblx0XHRcdFx0XHRcdHRoaXMuX2VuYWJsZWQoZmFsc2UsIGZhbHNlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBjaGFuZ2VkO1xuXHRcdH07XG5cblx0XHRwLmludmFsaWRhdGUgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmICh0aGlzLl9ub3RpZnlQbHVnaW5zT2ZFbmFibGVkKSB7XG5cdFx0XHRcdFR3ZWVuTGl0ZS5fb25QbHVnaW5FdmVudChcIl9vbkRpc2FibGVcIiwgdGhpcyk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9maXJzdFBUID0gdGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcyA9IHRoaXMuX3N0YXJ0QXQgPSB0aGlzLl9vblVwZGF0ZSA9IG51bGw7XG5cdFx0XHR0aGlzLl9ub3RpZnlQbHVnaW5zT2ZFbmFibGVkID0gdGhpcy5fYWN0aXZlID0gdGhpcy5fbGF6eSA9IGZhbHNlO1xuXHRcdFx0dGhpcy5fcHJvcExvb2t1cCA9ICh0aGlzLl90YXJnZXRzKSA/IHt9IDogW107XG5cdFx0XHRBbmltYXRpb24ucHJvdG90eXBlLmludmFsaWRhdGUuY2FsbCh0aGlzKTtcblx0XHRcdGlmICh0aGlzLnZhcnMuaW1tZWRpYXRlUmVuZGVyKSB7XG5cdFx0XHRcdHRoaXMuX3RpbWUgPSAtX3RpbnlOdW07IC8vZm9yY2VzIGEgcmVuZGVyIHdpdGhvdXQgaGF2aW5nIHRvIHNldCB0aGUgcmVuZGVyKCkgXCJmb3JjZVwiIHBhcmFtZXRlciB0byB0cnVlIGJlY2F1c2Ugd2Ugd2FudCB0byBhbGxvdyBsYXp5aW5nIGJ5IGRlZmF1bHQgKHVzaW5nIHRoZSBcImZvcmNlXCIgcGFyYW1ldGVyIGFsd2F5cyBmb3JjZXMgYW4gaW1tZWRpYXRlIGZ1bGwgcmVuZGVyKVxuXHRcdFx0XHR0aGlzLnJlbmRlcigtdGhpcy5fZGVsYXkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fTtcblxuXHRcdHAuX2VuYWJsZWQgPSBmdW5jdGlvbihlbmFibGVkLCBpZ25vcmVUaW1lbGluZSkge1xuXHRcdFx0aWYgKCFfdGlja2VyQWN0aXZlKSB7XG5cdFx0XHRcdF90aWNrZXIud2FrZSgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGVuYWJsZWQgJiYgdGhpcy5fZ2MpIHtcblx0XHRcdFx0dmFyIHRhcmdldHMgPSB0aGlzLl90YXJnZXRzLFxuXHRcdFx0XHRcdGk7XG5cdFx0XHRcdGlmICh0YXJnZXRzKSB7XG5cdFx0XHRcdFx0aSA9IHRhcmdldHMubGVuZ3RoO1xuXHRcdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fc2libGluZ3NbaV0gPSBfcmVnaXN0ZXIodGFyZ2V0c1tpXSwgdGhpcywgdHJ1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMuX3NpYmxpbmdzID0gX3JlZ2lzdGVyKHRoaXMudGFyZ2V0LCB0aGlzLCB0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0QW5pbWF0aW9uLnByb3RvdHlwZS5fZW5hYmxlZC5jYWxsKHRoaXMsIGVuYWJsZWQsIGlnbm9yZVRpbWVsaW5lKTtcblx0XHRcdGlmICh0aGlzLl9ub3RpZnlQbHVnaW5zT2ZFbmFibGVkKSBpZiAodGhpcy5fZmlyc3RQVCkge1xuXHRcdFx0XHRyZXR1cm4gVHdlZW5MaXRlLl9vblBsdWdpbkV2ZW50KChlbmFibGVkID8gXCJfb25FbmFibGVcIiA6IFwiX29uRGlzYWJsZVwiKSwgdGhpcyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fTtcblxuXG4vLy0tLS1Ud2VlbkxpdGUgc3RhdGljIG1ldGhvZHMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRcdFR3ZWVuTGl0ZS50byA9IGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIHZhcnMpIHtcblx0XHRcdHJldHVybiBuZXcgVHdlZW5MaXRlKHRhcmdldCwgZHVyYXRpb24sIHZhcnMpO1xuXHRcdH07XG5cblx0XHRUd2VlbkxpdGUuZnJvbSA9IGZ1bmN0aW9uKHRhcmdldCwgZHVyYXRpb24sIHZhcnMpIHtcblx0XHRcdHZhcnMucnVuQmFja3dhcmRzID0gdHJ1ZTtcblx0XHRcdHZhcnMuaW1tZWRpYXRlUmVuZGVyID0gKHZhcnMuaW1tZWRpYXRlUmVuZGVyICE9IGZhbHNlKTtcblx0XHRcdHJldHVybiBuZXcgVHdlZW5MaXRlKHRhcmdldCwgZHVyYXRpb24sIHZhcnMpO1xuXHRcdH07XG5cblx0XHRUd2VlbkxpdGUuZnJvbVRvID0gZnVuY3Rpb24odGFyZ2V0LCBkdXJhdGlvbiwgZnJvbVZhcnMsIHRvVmFycykge1xuXHRcdFx0dG9WYXJzLnN0YXJ0QXQgPSBmcm9tVmFycztcblx0XHRcdHRvVmFycy5pbW1lZGlhdGVSZW5kZXIgPSAodG9WYXJzLmltbWVkaWF0ZVJlbmRlciAhPSBmYWxzZSAmJiBmcm9tVmFycy5pbW1lZGlhdGVSZW5kZXIgIT0gZmFsc2UpO1xuXHRcdFx0cmV0dXJuIG5ldyBUd2VlbkxpdGUodGFyZ2V0LCBkdXJhdGlvbiwgdG9WYXJzKTtcblx0XHR9O1xuXG5cdFx0VHdlZW5MaXRlLmRlbGF5ZWRDYWxsID0gZnVuY3Rpb24oZGVsYXksIGNhbGxiYWNrLCBwYXJhbXMsIHNjb3BlLCB1c2VGcmFtZXMpIHtcblx0XHRcdHJldHVybiBuZXcgVHdlZW5MaXRlKGNhbGxiYWNrLCAwLCB7ZGVsYXk6ZGVsYXksIG9uQ29tcGxldGU6Y2FsbGJhY2ssIG9uQ29tcGxldGVQYXJhbXM6cGFyYW1zLCBjYWxsYmFja1Njb3BlOnNjb3BlLCBvblJldmVyc2VDb21wbGV0ZTpjYWxsYmFjaywgb25SZXZlcnNlQ29tcGxldGVQYXJhbXM6cGFyYW1zLCBpbW1lZGlhdGVSZW5kZXI6ZmFsc2UsIGxhenk6ZmFsc2UsIHVzZUZyYW1lczp1c2VGcmFtZXMsIG92ZXJ3cml0ZTowfSk7XG5cdFx0fTtcblxuXHRcdFR3ZWVuTGl0ZS5zZXQgPSBmdW5jdGlvbih0YXJnZXQsIHZhcnMpIHtcblx0XHRcdHJldHVybiBuZXcgVHdlZW5MaXRlKHRhcmdldCwgMCwgdmFycyk7XG5cdFx0fTtcblxuXHRcdFR3ZWVuTGl0ZS5nZXRUd2VlbnNPZiA9IGZ1bmN0aW9uKHRhcmdldCwgb25seUFjdGl2ZSkge1xuXHRcdFx0aWYgKHRhcmdldCA9PSBudWxsKSB7IHJldHVybiBbXTsgfVxuXHRcdFx0dGFyZ2V0ID0gKHR5cGVvZih0YXJnZXQpICE9PSBcInN0cmluZ1wiKSA/IHRhcmdldCA6IFR3ZWVuTGl0ZS5zZWxlY3Rvcih0YXJnZXQpIHx8IHRhcmdldDtcblx0XHRcdHZhciBpLCBhLCBqLCB0O1xuXHRcdFx0aWYgKChfaXNBcnJheSh0YXJnZXQpIHx8IF9pc1NlbGVjdG9yKHRhcmdldCkpICYmIHR5cGVvZih0YXJnZXRbMF0pICE9PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdGkgPSB0YXJnZXQubGVuZ3RoO1xuXHRcdFx0XHRhID0gW107XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGEgPSBhLmNvbmNhdChUd2VlbkxpdGUuZ2V0VHdlZW5zT2YodGFyZ2V0W2ldLCBvbmx5QWN0aXZlKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0XHQvL25vdyBnZXQgcmlkIG9mIGFueSBkdXBsaWNhdGVzICh0d2VlbnMgb2YgYXJyYXlzIG9mIG9iamVjdHMgY291bGQgY2F1c2UgZHVwbGljYXRlcylcblx0XHRcdFx0d2hpbGUgKC0taSA+IC0xKSB7XG5cdFx0XHRcdFx0dCA9IGFbaV07XG5cdFx0XHRcdFx0aiA9IGk7XG5cdFx0XHRcdFx0d2hpbGUgKC0taiA+IC0xKSB7XG5cdFx0XHRcdFx0XHRpZiAodCA9PT0gYVtqXSkge1xuXHRcdFx0XHRcdFx0XHRhLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGEgPSBfcmVnaXN0ZXIodGFyZ2V0KS5jb25jYXQoKTtcblx0XHRcdFx0aSA9IGEubGVuZ3RoO1xuXHRcdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0XHRpZiAoYVtpXS5fZ2MgfHwgKG9ubHlBY3RpdmUgJiYgIWFbaV0uaXNBY3RpdmUoKSkpIHtcblx0XHRcdFx0XHRcdGEuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGE7XG5cdFx0fTtcblxuXHRcdFR3ZWVuTGl0ZS5raWxsVHdlZW5zT2YgPSBUd2VlbkxpdGUua2lsbERlbGF5ZWRDYWxsc1RvID0gZnVuY3Rpb24odGFyZ2V0LCBvbmx5QWN0aXZlLCB2YXJzKSB7XG5cdFx0XHRpZiAodHlwZW9mKG9ubHlBY3RpdmUpID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRcdHZhcnMgPSBvbmx5QWN0aXZlOyAvL2ZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSAoYmVmb3JlIFwib25seUFjdGl2ZVwiIHBhcmFtZXRlciB3YXMgaW5zZXJ0ZWQpXG5cdFx0XHRcdG9ubHlBY3RpdmUgPSBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHZhciBhID0gVHdlZW5MaXRlLmdldFR3ZWVuc09mKHRhcmdldCwgb25seUFjdGl2ZSksXG5cdFx0XHRcdGkgPSBhLmxlbmd0aDtcblx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRhW2ldLl9raWxsKHZhcnMsIHRhcmdldCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXG5cbi8qXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBUd2VlblBsdWdpbiAgIChjb3VsZCBlYXNpbHkgYmUgc3BsaXQgb3V0IGFzIGEgc2VwYXJhdGUgZmlsZS9jbGFzcywgYnV0IGluY2x1ZGVkIGZvciBlYXNlIG9mIHVzZSAoc28gdGhhdCBwZW9wbGUgZG9uJ3QgbmVlZCB0byBpbmNsdWRlIGFub3RoZXIgc2NyaXB0IGNhbGwgYmVmb3JlIGxvYWRpbmcgcGx1Z2lucyB3aGljaCBpcyBlYXN5IHRvIGZvcmdldClcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXHRcdHZhciBUd2VlblBsdWdpbiA9IF9jbGFzcyhcInBsdWdpbnMuVHdlZW5QbHVnaW5cIiwgZnVuY3Rpb24ocHJvcHMsIHByaW9yaXR5KSB7XG5cdFx0XHRcdFx0dGhpcy5fb3ZlcndyaXRlUHJvcHMgPSAocHJvcHMgfHwgXCJcIikuc3BsaXQoXCIsXCIpO1xuXHRcdFx0XHRcdHRoaXMuX3Byb3BOYW1lID0gdGhpcy5fb3ZlcndyaXRlUHJvcHNbMF07XG5cdFx0XHRcdFx0dGhpcy5fcHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdFx0XHRcdHRoaXMuX3N1cGVyID0gVHdlZW5QbHVnaW4ucHJvdG90eXBlO1xuXHRcdFx0XHR9LCB0cnVlKTtcblxuXHRcdHAgPSBUd2VlblBsdWdpbi5wcm90b3R5cGU7XG5cdFx0VHdlZW5QbHVnaW4udmVyc2lvbiA9IFwiMS4xMC4xXCI7XG5cdFx0VHdlZW5QbHVnaW4uQVBJID0gMjtcblx0XHRwLl9maXJzdFBUID0gbnVsbDtcblxuXHRcdHAuX2FkZFR3ZWVuID0gZnVuY3Rpb24odGFyZ2V0LCBwcm9wLCBzdGFydCwgZW5kLCBvdmVyd3JpdGVQcm9wLCByb3VuZCkge1xuXHRcdFx0dmFyIGMsIHB0O1xuXHRcdFx0aWYgKGVuZCAhPSBudWxsICYmIChjID0gKHR5cGVvZihlbmQpID09PSBcIm51bWJlclwiIHx8IGVuZC5jaGFyQXQoMSkgIT09IFwiPVwiKSA/IE51bWJlcihlbmQpIC0gTnVtYmVyKHN0YXJ0KSA6IHBhcnNlSW50KGVuZC5jaGFyQXQoMCkgKyBcIjFcIiwgMTApICogTnVtYmVyKGVuZC5zdWJzdHIoMikpKSkge1xuXHRcdFx0XHR0aGlzLl9maXJzdFBUID0gcHQgPSB7X25leHQ6dGhpcy5fZmlyc3RQVCwgdDp0YXJnZXQsIHA6cHJvcCwgczpzdGFydCwgYzpjLCBmOih0eXBlb2YodGFyZ2V0W3Byb3BdKSA9PT0gXCJmdW5jdGlvblwiKSwgbjpvdmVyd3JpdGVQcm9wIHx8IHByb3AsIHI6cm91bmR9O1xuXHRcdFx0XHRpZiAocHQuX25leHQpIHtcblx0XHRcdFx0XHRwdC5fbmV4dC5fcHJldiA9IHB0O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBwdDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cC5zZXRSYXRpbyA9IGZ1bmN0aW9uKHYpIHtcblx0XHRcdHZhciBwdCA9IHRoaXMuX2ZpcnN0UFQsXG5cdFx0XHRcdG1pbiA9IDAuMDAwMDAxLFxuXHRcdFx0XHR2YWw7XG5cdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0dmFsID0gcHQuYyAqIHYgKyBwdC5zO1xuXHRcdFx0XHRpZiAocHQucikge1xuXHRcdFx0XHRcdHZhbCA9IE1hdGgucm91bmQodmFsKTtcblx0XHRcdFx0fSBlbHNlIGlmICh2YWwgPCBtaW4pIGlmICh2YWwgPiAtbWluKSB7IC8vcHJldmVudHMgaXNzdWVzIHdpdGggY29udmVydGluZyB2ZXJ5IHNtYWxsIG51bWJlcnMgdG8gc3RyaW5ncyBpbiB0aGUgYnJvd3NlclxuXHRcdFx0XHRcdHZhbCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHB0LmYpIHtcblx0XHRcdFx0XHRwdC50W3B0LnBdKHZhbCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cHQudFtwdC5wXSA9IHZhbDtcblx0XHRcdFx0fVxuXHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRwLl9raWxsID0gZnVuY3Rpb24obG9va3VwKSB7XG5cdFx0XHR2YXIgYSA9IHRoaXMuX292ZXJ3cml0ZVByb3BzLFxuXHRcdFx0XHRwdCA9IHRoaXMuX2ZpcnN0UFQsXG5cdFx0XHRcdGk7XG5cdFx0XHRpZiAobG9va3VwW3RoaXMuX3Byb3BOYW1lXSAhPSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuX292ZXJ3cml0ZVByb3BzID0gW107XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpID0gYS5sZW5ndGg7XG5cdFx0XHRcdHdoaWxlICgtLWkgPiAtMSkge1xuXHRcdFx0XHRcdGlmIChsb29rdXBbYVtpXV0gIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0YS5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0aWYgKGxvb2t1cFtwdC5uXSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0aWYgKHB0Ll9uZXh0KSB7XG5cdFx0XHRcdFx0XHRwdC5fbmV4dC5fcHJldiA9IHB0Ll9wcmV2O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAocHQuX3ByZXYpIHtcblx0XHRcdFx0XHRcdHB0Ll9wcmV2Ll9uZXh0ID0gcHQuX25leHQ7XG5cdFx0XHRcdFx0XHRwdC5fcHJldiA9IG51bGw7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl9maXJzdFBUID09PSBwdCkge1xuXHRcdFx0XHRcdFx0dGhpcy5fZmlyc3RQVCA9IHB0Ll9uZXh0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH07XG5cblx0XHRwLl9yb3VuZFByb3BzID0gZnVuY3Rpb24obG9va3VwLCB2YWx1ZSkge1xuXHRcdFx0dmFyIHB0ID0gdGhpcy5fZmlyc3RQVDtcblx0XHRcdHdoaWxlIChwdCkge1xuXHRcdFx0XHRpZiAobG9va3VwW3RoaXMuX3Byb3BOYW1lXSB8fCAocHQubiAhPSBudWxsICYmIGxvb2t1cFsgcHQubi5zcGxpdCh0aGlzLl9wcm9wTmFtZSArIFwiX1wiKS5qb2luKFwiXCIpIF0pKSB7IC8vc29tZSBwcm9wZXJ0aWVzIHRoYXQgYXJlIHZlcnkgcGx1Z2luLXNwZWNpZmljIGFkZCBhIHByZWZpeCBuYW1lZCBhZnRlciB0aGUgX3Byb3BOYW1lIHBsdXMgYW4gdW5kZXJzY29yZSwgc28gd2UgbmVlZCB0byBpZ25vcmUgdGhhdCBleHRyYSBzdHVmZiBoZXJlLlxuXHRcdFx0XHRcdHB0LnIgPSB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRwdCA9IHB0Ll9uZXh0O1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRUd2VlbkxpdGUuX29uUGx1Z2luRXZlbnQgPSBmdW5jdGlvbih0eXBlLCB0d2Vlbikge1xuXHRcdFx0dmFyIHB0ID0gdHdlZW4uX2ZpcnN0UFQsXG5cdFx0XHRcdGNoYW5nZWQsIHB0MiwgZmlyc3QsIGxhc3QsIG5leHQ7XG5cdFx0XHRpZiAodHlwZSA9PT0gXCJfb25Jbml0QWxsUHJvcHNcIikge1xuXHRcdFx0XHQvL3NvcnRzIHRoZSBQcm9wVHdlZW4gbGlua2VkIGxpc3QgaW4gb3JkZXIgb2YgcHJpb3JpdHkgYmVjYXVzZSBzb21lIHBsdWdpbnMgbmVlZCB0byByZW5kZXIgZWFybGllci9sYXRlciB0aGFuIG90aGVycywgbGlrZSBNb3Rpb25CbHVyUGx1Z2luIGFwcGxpZXMgaXRzIGVmZmVjdHMgYWZ0ZXIgYWxsIHgveS9hbHBoYSB0d2VlbnMgaGF2ZSByZW5kZXJlZCBvbiBlYWNoIGZyYW1lLlxuXHRcdFx0XHR3aGlsZSAocHQpIHtcblx0XHRcdFx0XHRuZXh0ID0gcHQuX25leHQ7XG5cdFx0XHRcdFx0cHQyID0gZmlyc3Q7XG5cdFx0XHRcdFx0d2hpbGUgKHB0MiAmJiBwdDIucHIgPiBwdC5wcikge1xuXHRcdFx0XHRcdFx0cHQyID0gcHQyLl9uZXh0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoKHB0Ll9wcmV2ID0gcHQyID8gcHQyLl9wcmV2IDogbGFzdCkpIHtcblx0XHRcdFx0XHRcdHB0Ll9wcmV2Ll9uZXh0ID0gcHQ7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGZpcnN0ID0gcHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICgocHQuX25leHQgPSBwdDIpKSB7XG5cdFx0XHRcdFx0XHRwdDIuX3ByZXYgPSBwdDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bGFzdCA9IHB0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwdCA9IG5leHQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQgPSB0d2Vlbi5fZmlyc3RQVCA9IGZpcnN0O1xuXHRcdFx0fVxuXHRcdFx0d2hpbGUgKHB0KSB7XG5cdFx0XHRcdGlmIChwdC5wZykgaWYgKHR5cGVvZihwdC50W3R5cGVdKSA9PT0gXCJmdW5jdGlvblwiKSBpZiAocHQudFt0eXBlXSgpKSB7XG5cdFx0XHRcdFx0Y2hhbmdlZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0cHQgPSBwdC5fbmV4dDtcblx0XHRcdH1cblx0XHRcdHJldHVybiBjaGFuZ2VkO1xuXHRcdH07XG5cblx0XHRUd2VlblBsdWdpbi5hY3RpdmF0ZSA9IGZ1bmN0aW9uKHBsdWdpbnMpIHtcblx0XHRcdHZhciBpID0gcGx1Z2lucy5sZW5ndGg7XG5cdFx0XHR3aGlsZSAoLS1pID4gLTEpIHtcblx0XHRcdFx0aWYgKHBsdWdpbnNbaV0uQVBJID09PSBUd2VlblBsdWdpbi5BUEkpIHtcblx0XHRcdFx0XHRfcGx1Z2luc1sobmV3IHBsdWdpbnNbaV0oKSkuX3Byb3BOYW1lXSA9IHBsdWdpbnNbaV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH07XG5cblx0XHQvL3Byb3ZpZGVzIGEgbW9yZSBjb25jaXNlIHdheSB0byBkZWZpbmUgcGx1Z2lucyB0aGF0IGhhdmUgbm8gZGVwZW5kZW5jaWVzIGJlc2lkZXMgVHdlZW5QbHVnaW4gYW5kIFR3ZWVuTGl0ZSwgd3JhcHBpbmcgY29tbW9uIGJvaWxlcnBsYXRlIHN0dWZmIGludG8gb25lIGZ1bmN0aW9uIChhZGRlZCBpbiAxLjkuMCkuIFlvdSBkb24ndCBORUVEIHRvIHVzZSB0aGlzIHRvIGRlZmluZSBhIHBsdWdpbiAtIHRoZSBvbGQgd2F5IHN0aWxsIHdvcmtzIGFuZCBjYW4gYmUgdXNlZnVsIGluIGNlcnRhaW4gKHJhcmUpIHNpdHVhdGlvbnMuXG5cdFx0X2dzRGVmaW5lLnBsdWdpbiA9IGZ1bmN0aW9uKGNvbmZpZykge1xuXHRcdFx0aWYgKCFjb25maWcgfHwgIWNvbmZpZy5wcm9wTmFtZSB8fCAhY29uZmlnLmluaXQgfHwgIWNvbmZpZy5BUEkpIHsgdGhyb3cgXCJpbGxlZ2FsIHBsdWdpbiBkZWZpbml0aW9uLlwiOyB9XG5cdFx0XHR2YXIgcHJvcE5hbWUgPSBjb25maWcucHJvcE5hbWUsXG5cdFx0XHRcdHByaW9yaXR5ID0gY29uZmlnLnByaW9yaXR5IHx8IDAsXG5cdFx0XHRcdG92ZXJ3cml0ZVByb3BzID0gY29uZmlnLm92ZXJ3cml0ZVByb3BzLFxuXHRcdFx0XHRtYXAgPSB7aW5pdDpcIl9vbkluaXRUd2VlblwiLCBzZXQ6XCJzZXRSYXRpb1wiLCBraWxsOlwiX2tpbGxcIiwgcm91bmQ6XCJfcm91bmRQcm9wc1wiLCBpbml0QWxsOlwiX29uSW5pdEFsbFByb3BzXCJ9LFxuXHRcdFx0XHRQbHVnaW4gPSBfY2xhc3MoXCJwbHVnaW5zLlwiICsgcHJvcE5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wTmFtZS5zdWJzdHIoMSkgKyBcIlBsdWdpblwiLFxuXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0VHdlZW5QbHVnaW4uY2FsbCh0aGlzLCBwcm9wTmFtZSwgcHJpb3JpdHkpO1xuXHRcdFx0XHRcdFx0dGhpcy5fb3ZlcndyaXRlUHJvcHMgPSBvdmVyd3JpdGVQcm9wcyB8fCBbXTtcblx0XHRcdFx0XHR9LCAoY29uZmlnLmdsb2JhbCA9PT0gdHJ1ZSkpLFxuXHRcdFx0XHRwID0gUGx1Z2luLnByb3RvdHlwZSA9IG5ldyBUd2VlblBsdWdpbihwcm9wTmFtZSksXG5cdFx0XHRcdHByb3A7XG5cdFx0XHRwLmNvbnN0cnVjdG9yID0gUGx1Z2luO1xuXHRcdFx0UGx1Z2luLkFQSSA9IGNvbmZpZy5BUEk7XG5cdFx0XHRmb3IgKHByb3AgaW4gbWFwKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YoY29uZmlnW3Byb3BdKSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdFx0cFttYXBbcHJvcF1dID0gY29uZmlnW3Byb3BdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRQbHVnaW4udmVyc2lvbiA9IGNvbmZpZy52ZXJzaW9uO1xuXHRcdFx0VHdlZW5QbHVnaW4uYWN0aXZhdGUoW1BsdWdpbl0pO1xuXHRcdFx0cmV0dXJuIFBsdWdpbjtcblx0XHR9O1xuXG5cblx0XHQvL25vdyBydW4gdGhyb3VnaCBhbGwgdGhlIGRlcGVuZGVuY2llcyBkaXNjb3ZlcmVkIGFuZCBpZiBhbnkgYXJlIG1pc3NpbmcsIGxvZyB0aGF0IHRvIHRoZSBjb25zb2xlIGFzIGEgd2FybmluZy4gVGhpcyBpcyB3aHkgaXQncyBiZXN0IHRvIGhhdmUgVHdlZW5MaXRlIGxvYWQgbGFzdCAtIGl0IGNhbiBjaGVjayBhbGwgdGhlIGRlcGVuZGVuY2llcyBmb3IgeW91LlxuXHRcdGEgPSB3aW5kb3cuX2dzUXVldWU7XG5cdFx0aWYgKGEpIHtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGFbaV0oKTtcblx0XHRcdH1cblx0XHRcdGZvciAocCBpbiBfZGVmTG9va3VwKSB7XG5cdFx0XHRcdGlmICghX2RlZkxvb2t1cFtwXS5mdW5jKSB7XG5cdFx0XHRcdFx0d2luZG93LmNvbnNvbGUubG9nKFwiR1NBUCBlbmNvdW50ZXJlZCBtaXNzaW5nIGRlcGVuZGVuY3k6IGNvbS5ncmVlbnNvY2suXCIgKyBwKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdF90aWNrZXJBY3RpdmUgPSBmYWxzZTsgLy9lbnN1cmVzIHRoYXQgdGhlIGZpcnN0IG9mZmljaWFsIGFuaW1hdGlvbiBmb3JjZXMgYSB0aWNrZXIudGljaygpIHRvIHVwZGF0ZSB0aGUgdGltZSB3aGVuIGl0IGlzIGluc3RhbnRpYXRlZFxuXG59KSgodHlwZW9mKG1vZHVsZSkgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMgJiYgdHlwZW9mKGdsb2JhbCkgIT09IFwidW5kZWZpbmVkXCIpID8gZ2xvYmFsIDogdGhpcyB8fCB3aW5kb3csIFwiVHdlZW5NYXhcIik7IiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCJmdW5jdGlvbiBFICgpIHtcblx0Ly8gS2VlcCB0aGlzIGVtcHR5IHNvIGl0J3MgZWFzaWVyIHRvIGluaGVyaXQgZnJvbVxuICAvLyAodmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9saXBzbWFjayBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvaXNzdWVzLzMpXG59XG5cbkUucHJvdG90eXBlID0ge1xuXHRvbjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuICAgIFxuICAgIChlW25hbWVdIHx8IChlW25hbWVdID0gW10pKS5wdXNoKHtcbiAgICAgIGZuOiBjYWxsYmFjayxcbiAgICAgIGN0eDogY3R4XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb25jZTogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGZuID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5vZmYobmFtZSwgZm4pO1xuICAgICAgY2FsbGJhY2suYXBwbHkoY3R4LCBhcmd1bWVudHMpO1xuICAgIH07XG4gICAgXG4gICAgcmV0dXJuIHRoaXMub24obmFtZSwgZm4sIGN0eCk7XG4gIH0sXG5cbiAgZW1pdDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgZGF0YSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgZXZ0QXJyID0gKCh0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KSlbbmFtZV0gfHwgW10pLnNsaWNlKCk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBsZW4gPSBldnRBcnIubGVuZ3RoO1xuICAgIFxuICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBldnRBcnJbaV0uZm4uYXBwbHkoZXZ0QXJyW2ldLmN0eCwgZGF0YSk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9mZjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcbiAgICB2YXIgZXZ0cyA9IGVbbmFtZV07XG4gICAgdmFyIGxpdmVFdmVudHMgPSBbXTtcbiAgICBcbiAgICBpZiAoZXZ0cyAmJiBjYWxsYmFjaykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV2dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGV2dHNbaV0uZm4gIT09IGNhbGxiYWNrKSBsaXZlRXZlbnRzLnB1c2goZXZ0c1tpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIFJlbW92ZSBldmVudCBmcm9tIHF1ZXVlIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtcbiAgICAvLyBTdWdnZXN0ZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2xhemRcbiAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvY29tbWl0L2M2ZWJmYWE5YmM5NzNiMzNkMTEwYTg0YTMwNzc0MmI3Y2Y5NGM5NTMjY29tbWl0Y29tbWVudC01MDI0OTEwXG5cbiAgICAobGl2ZUV2ZW50cy5sZW5ndGgpIFxuICAgICAgPyBlW25hbWVdID0gbGl2ZUV2ZW50c1xuICAgICAgOiBkZWxldGUgZVtuYW1lXTtcbiAgICBcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFO1xuIiwidmFyIFRpbnlFbWl0dGVyID0gcmVxdWlyZSgndGlueS1lbWl0dGVyJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgQVNjcmVlbiA9IGZ1bmN0aW9uKCl7XG59O1xuXG5pbmhlcml0cyhBU2NyZWVuLCBUaW55RW1pdHRlcik7XG5cbkFTY3JlZW4ucHJvdG90eXBlLmFuaW1hdGVJbiA9IGZ1bmN0aW9uKGNvbXBsZXRlKSB7XG4gIHRoaXMub25BbmltYXRlSW5Db21wbGV0ZSgpO1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlSW5Db21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ2FuaW1hdGVJbkNvbXBsZXRlJyk7XG59O1xuXG5BU2NyZWVuLnByb3RvdHlwZS5hbmltYXRlT3V0ID0gZnVuY3Rpb24oY29tcGxldGUpIHtcbiAgdGhpcy5vbkFuaW1hdGVPdXRDb21wbGV0ZSgpO1xufTtcblxuQVNjcmVlbi5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbWl0KCdhbmltYXRlT3V0Q29tcGxldGUnKTtcbn07XG5cbkFTY3JlZW4ucHJvdG90eXBlLmRpc3Bvc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5vZmYoJ2FuaW1hdGVJbkNvbXBsZXRlJylcbiAgICAgIC5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBU2NyZWVuOyIsInZhciBUaW55RW1pdHRlciA9IHJlcXVpcmUoJ3RpbnktZW1pdHRlcicpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIFNjcmVlbk5hdmlnYXRvciA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMuaXRlbXMgPSB7fTtcbiAgdGhpcy5jdXJyZW50SXRlbSA9IG51bGw7XG4gIHRoaXMuY3VycmVudEl0ZW1JZCA9IG51bGw7XG4gIHRoaXMucHJldkl0ZW0gPSBudWxsO1xuXG4gIHRoaXMudHJhbnNpdGlvblJ1bm5pbmcgPSBmYWxzZTtcbiAgdGhpcy50cmFuc2l0aW9uVHlwZSA9IHRoaXMuZGVmYXVsdFRyYW5zaXRpb25UeXBlID0gU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fTk9ORTtcbiAgdGhpcy5hbmltYXRlSW5Db21wbGV0ZUNiID0gdGhpcy5vbkFuaW1hdGVJbkNvbXBsZXRlLmJpbmQodGhpcyk7XG4gIHRoaXMuYW5pbWF0ZU91dENvbXBsZXRlQ2IgPSB0aGlzLm9uQW5pbWF0ZUluQ29tcGxldGUuYmluZCh0aGlzKTtcbiAgdGhpcy5hbmltYXRlQ29tcGxldGVDb3VudCA9IDA7XG59O1xuXG5pbmhlcml0cyhTY3JlZW5OYXZpZ2F0b3IsIFRpbnlFbWl0dGVyKTtcblxuU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX0FORF9JTiA9ICdvdXRBbmRJbic7XG5TY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9PVVRfVEhFTl9JTiA9ICdvdXRUaGVuSW4nO1xuU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fSU5fVEhFTl9PVVQgPSAnaW5UaGVuT3V0JztcblNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVCA9ICdvdXQnO1xuU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fSU4gPSAnaW4nO1xuU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fTk9ORSA9ICdub25lJztcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5hZGRJdGVtID0gZnVuY3Rpb24oaWQsIGl0ZW0pIHtcbiAgdGhpcy5pdGVtc1tpZF0gPSBpdGVtO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5nZXRJdGVtID0gZnVuY3Rpb24oaWQpIHtcbiAgcmV0dXJuIHRoaXMuaXRlbXNbaWRdO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5zaG93U2NyZWVuID0gZnVuY3Rpb24oaWQsIHRyYW5zaXRpb25UeXBlKSB7XG4gIGlmIChpZCA9PT0gdGhpcy5jdXJyZW50SXRlbUlkKSByZXR1cm47XG5cblxuICB2YXIgbmV3SXRlbSA9IHRoaXMuZ2V0SXRlbShpZCk7XG5cbiAgaWYgKCFuZXdJdGVtKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NjcmVlbk5hdmlnYXRvciAtIHRoZSBpdGVtIHdpdGggdGhlIGlkICcgKyBpZCArICcgZG9lc25cXCd0IGV4aXN0Jyk7XG4gIH1cblxuICBpZiAodGhpcy5jdXJyZW50SXRlbSl7XG4gICAgdGhpcy5wcmV2SXRlbSA9IHRoaXMuY3VycmVudEl0ZW07XG4gIH1cblxuICB0aGlzLmN1cnJlbnRJdGVtSWQgPSBpZDtcbiAgdGhpcy5jdXJyZW50SXRlbSA9IG5ld0l0ZW07XG5cbiAgdGhpcy5vbkNoYW5nZSgpO1xuXG4gIHRoaXMuc3RhcnRUcmFuc2l0aW9uKHRyYW5zaXRpb25UeXBlKTtcbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuY2xlYXJTY3JlZW4gPSBmdW5jdGlvbih0cmFuc2l0aW9uVHlwZSkge1xuICBpZiAodGhpcy5jdXJyZW50U2NyZWVuKXtcbiAgICB0aGlzLnByZXZTY3JlZW4gPSB0aGlzLmN1cnJlbnRTY3JlZW47XG4gIH1cblxuICB0aGlzLm9uQ2hhbmdlKCk7XG5cbiAgdGhpcy5zdGFydFRyYW5zaXRpb24odHJhbnNpdGlvblR5cGUpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5zdGFydFRyYW5zaXRpb24gPSBmdW5jdGlvbih0cmFuc2l0aW9uVHlwZSkge1xuICBpZiAodGhpcy50cmFuc2l0aW9uUnVubmluZyl7XG4gICAgdGhpcy5jYW5jZWxUcmFuc2l0aW9uKCk7XG4gIH0gXG5cbiAgdmFyIGN1cnJlbnRTY3JlZW4gPSB0aGlzLmN1cnJlbnRJdGVtID8gdGhpcy5jdXJyZW50SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG4gIHZhciBwcmV2U2NyZWVuID0gdGhpcy5wcmV2SXRlbSA/IHRoaXMucHJldkl0ZW0uZ2V0U2NyZWVuKCkgOiBudWxsO1xuXG4gIHRoaXMuYW5pbWF0ZUNvbXBsZXRlQ291bnQgPSAwO1xuICB0aGlzLnRyYW5zaXRpb25UeXBlID0gdHJhbnNpdGlvblR5cGUgPyB0cmFuc2l0aW9uVHlwZSA6IHRoaXMuZGVmYXVsdFRyYW5zaXRpb25UeXBlO1xuXG4gIHN3aXRjaCh0aGlzLnRyYW5zaXRpb25UeXBlKXtcbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9BTkRfSU46XG4gICAgICBpZiAocHJldlNjcmVlbikge1xuICAgICAgICBwcmV2U2NyZWVuLm9uKCdhbmltYXRlT3V0Q29tcGxldGUnLCB0aGlzLmFuaW1hdGVPdXRDb21wbGV0ZUNiKTtcbiAgICAgICAgcHJldlNjcmVlbi5hbmltYXRlT3V0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjdXJyZW50U2NyZWVuKSB7XG4gICAgICAgIGN1cnJlbnRTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgdGhpcy5hbmltYXRlSW5Db21wbGV0ZUNiKTtcbiAgICAgICAgY3VycmVudFNjcmVlbi5hbmltYXRlSW4oKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9PVVRfVEhFTl9JTjpcbiAgICAgIGlmIChwcmV2U2NyZWVuKSB7XG4gICAgICAgIHByZXZTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIHRoaXMuYW5pbWF0ZU91dENvbXBsZXRlQ2IpO1xuICAgICAgICBwcmV2U2NyZWVuLmFuaW1hdGVPdXQoKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLm9uQW5pbWF0ZU91dENvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fSU5fVEhFTl9PVVQ6XG4gICAgICBpZiAoY3VycmVudFNjcmVlbikge1xuICAgICAgICBjdXJyZW50U2NyZWVuLm9uKCdhbmltYXRlSW5Db21wbGV0ZScsIHRoaXMuYW5pbWF0ZUluQ29tcGxldGVDYik7XG4gICAgICAgIGN1cnJlbnRTY3JlZW4uYW5pbWF0ZUluKCk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGhpcy5vbkFuaW1hdGVJbkNvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUOlxuICAgICAgaWYgKHByZXZTY3JlZW4pIHtcbiAgICAgICAgcHJldlNjcmVlbi5vbignYW5pbWF0ZU91dENvbXBsZXRlJywgdGhpcy5hbmltYXRlT3V0Q29tcGxldGVDYik7XG4gICAgICAgIHByZXZTY3JlZW4uYW5pbWF0ZU91dCgpO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSBTY3JlZW5OYXZpZ2F0b3IuVFJBTlNJVElPTl9JTjpcbiAgICAgIGlmIChjdXJyZW50U2NyZWVuKSB7XG4gICAgICAgIGN1cnJlbnRTY3JlZW4ub24oJ2FuaW1hdGVJbkNvbXBsZXRlJywgdGhpcy5hbmltYXRlSW5Db21wbGV0ZUNiKTtcbiAgICAgICAgY3VycmVudFNjcmVlbi5hbmltYXRlSW4oKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fTk9ORTpcbiAgICBkZWZhdWx0OlxuICAgICAgdGhpcy50cmFuc2l0aW9uVHlwZSA9IFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX05PTkU7XG5cbiAgICAgIGlmIChwcmV2U2NyZWVuKSBwcmV2U2NyZWVuLmFuaW1hdGVPdXQodHJ1ZSk7XG4gICAgICBpZiAoY3VycmVudFNjcmVlbikgY3VycmVudFNjcmVlbi5hbmltYXRlSW4odHJ1ZSk7XG5cbiAgICAgIHRoaXMub25UcmFuc2l0aW9uQ29tcGxldGUoKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgdGhpcy5vblRyYW5zaXRpb25TdGFydCgpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5jYW5jZWxUcmFuc2l0aW9uID0gZnVuY3Rpb24oY29tcGxldGUpIHtcbiAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuXG4gIHRoaXMuZGlzcG9zZVRyYW5zaXRpb24oKTtcblxuICBpZiAodGhpcy5wcmV2SXRlbSl7XG4gICAgdGhpcy5wcmV2SXRlbS5nZXRTY3JlZW4oKS5hbmltYXRlT3V0KHRydWUpO1xuICB9XG5cbiAgaWYgKHRoaXMuY3VycmVudEl0ZW0pe1xuICAgIHRoaXMuY3VycmVudEl0ZW0uZ2V0U2NyZWVuKCkuYW5pbWF0ZU91dCh0cnVlKTtcbiAgfVxufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5vbkNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ2NoYW5nZScpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5vblRyYW5zaXRpb25TdGFydCA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25TdGFydCcpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5vbkFuaW1hdGVJbkNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjdXJyZW50U2NyZWVuID0gdGhpcy5jdXJyZW50SXRlbSA/IHRoaXMuY3VycmVudEl0ZW0uZ2V0U2NyZWVuKCkgOiBudWxsO1xuICB2YXIgcHJldlNjcmVlbiA9IHRoaXMucHJldkl0ZW0gPyB0aGlzLnByZXZJdGVtLmdldFNjcmVlbigpIDogbnVsbDtcblxuICB0aGlzLmFuaW1hdGVDb21wbGV0ZUNvdW50Kys7IFxuICBcbiAgc3dpdGNoKHRoaXMudHJhbnNpdGlvblR5cGUpe1xuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX0FORF9JTjpcbiAgICAgIGlmICh0aGlzLmFuaW1hdGVDb21wbGV0ZUNvdW50ID09PSAyIHx8ICF0aGlzLnByZXZJdGVtKSB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fT1VUX1RIRU5fSU46XG4gICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fSU5fVEhFTl9PVVQ6XG4gICAgICBpZiAocHJldlNjcmVlbil7XG4gICAgICAgIHByZXZTY3JlZW4ub24oJ2FuaW1hdGVPdXRDb21wbGV0ZScsIHRoaXMuYW5pbWF0ZU91dENvbXBsZXRlQ2IpO1xuICAgICAgICBwcmV2U2NyZWVuLmFuaW1hdGVPdXQoKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLm9uVHJhbnNpdGlvbkNvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgU2NyZWVuTmF2aWdhdG9yLlRSQU5TSVRJT05fSU46XG4gICAgICAgIGlmICh0aGlzLnByZXZJdGVtKSB0aGlzLnByZXZJdGVtLmdldFNjcmVlbigpLmFuaW1hdGVPdXQodHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUub25BbmltYXRlT3V0Q29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGN1cnJlbnRTY3JlZW4gPSB0aGlzLmN1cnJlbnRJdGVtID8gdGhpcy5jdXJyZW50SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG4gIHZhciBwcmV2U2NyZWVuID0gdGhpcy5wcmV2SXRlbSA/IHRoaXMucHJldkl0ZW0uZ2V0U2NyZWVuKCkgOiBudWxsO1xuXG4gIHRoaXMuYW5pbWF0ZUNvbXBsZXRlQ291bnQrKztcbiAgXG4gIHN3aXRjaCh0aGlzLnRyYW5zaXRpb25UeXBlKXtcbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9BTkRfSU46XG4gICAgICBpZiAodGhpcy5hbmltYXRlQ29tcGxldGVDb3VudCA9PT0gMiB8fCAhdGhpcy5jdXJyZW50SXRlbSkgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVF9USEVOX0lOOlxuICAgICAgaWYgKGN1cnJlbnRTY3JlZW4pe1xuICAgICAgICBjdXJyZW50U2NyZWVuLm9uKCdhbmltYXRlSW5Db21wbGV0ZScsIHRoaXMuYW5pbWF0ZUluQ29tcGxldGVDYik7XG4gICAgICAgIGN1cnJlbnRTY3JlZW4uYW5pbWF0ZUluKCk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX0lOX1RIRU5fT1VUOlxuICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIFNjcmVlbk5hdmlnYXRvci5UUkFOU0lUSU9OX09VVDpcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRJdGVtKSB0aGlzLmN1cnJlbnRJdGVtLmdldFNjcmVlbigpLmFuaW1hdGVJbih0cnVlKTtcblxuICAgICAgdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZSgpO1xuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUub25UcmFuc2l0aW9uQ29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuXG4gIHRoaXMuZGlzcG9zZVRyYW5zaXRpb24oKTtcblxuICB0aGlzLmVtaXQoJ3RyYW5zaXRpb25Db21wbGV0ZScpO1xufTtcblxuU2NyZWVuTmF2aWdhdG9yLnByb3RvdHlwZS5kaXNwb3NlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0cmFuc2l0aW9uUnVubmluZyl7XG4gICAgdGhpcy5jYW5jZWxUcmFuc2l0aW9uKCk7XG4gIH1cbn07XG5cblNjcmVlbk5hdmlnYXRvci5wcm90b3R5cGUuZGlzcG9zZVRyYW5zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGN1cnJlbnRTY3JlZW4gPSB0aGlzLmN1cnJlbnRJdGVtID8gdGhpcy5jdXJyZW50SXRlbS5nZXRTY3JlZW4oKSA6IG51bGw7XG4gIHZhciBwcmV2U2NyZWVuID0gdGhpcy5wcmV2SXRlbSA/IHRoaXMucHJldkl0ZW0uZ2V0U2NyZWVuKCkgOiBudWxsO1xuXG4gIGlmIChwcmV2U2NyZWVuKXtcbiAgICBwcmV2U2NyZWVuLm9mZignYW5pbWF0ZUluQ29tcGxldGUnLCB0aGlzLmFuaW1hdGVJbkNvbXBsZXRlQ2IpXG4gICAgICAgICAgICAgIC5vZmYoJ2FuaW1hdGVPdXRDb21wbGV0ZScsIHRoaXMuYW5pbWF0ZU91dENvbXBsZXRlQ2IpO1xuXG4gICAgdGhpcy5wcmV2SXRlbS5kaXNwb3NlU2NyZWVuKCk7XG4gIH1cblxuICBpZiAoY3VycmVudFNjcmVlbil7XG4gICAgY3VycmVudFNjcmVlbi5vZmYoJ2FuaW1hdGVJbkNvbXBsZXRlJywgdGhpcy5hbmltYXRlSW5Db21wbGV0ZUNiKVxuICAgICAgICAgICAgICAgICAub2ZmKCdhbmltYXRlT3V0Q29tcGxldGUnLCB0aGlzLmFuaW1hdGVPdXRDb21wbGV0ZUNiKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuQVNjcmVlbiA9IHJlcXVpcmUoJy4vQVNjcmVlbi5qcycpO1xubW9kdWxlLmV4cG9ydHMuU2NyZWVuTmF2aWdhdG9ySXRlbSA9IHJlcXVpcmUoJy4vU2NyZWVuTmF2aWdhdG9ySXRlbS5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNjcmVlbk5hdmlnYXRvcjtcblxuIiwidmFyIFNjcmVlbk5hdmlnYXRvckl0ZW0gPSBmdW5jdGlvbihzY3JlZW4sIGV2ZW50cyl7XG4gIHRoaXMuc2NyZWVuID0gc2NyZWVuO1xuXG4gIHRoaXMuaXNJbnN0YW5jZSA9IHR5cGVvZiBzY3JlZW4gPT09ICdmdW5jdGlvbicgPyBmYWxzZSA6IHRydWU7XG4gIHRoaXMuaW5zdGFuY2UgPSBudWxsO1xufTtcblxuU2NyZWVuTmF2aWdhdG9ySXRlbS5wcm90b3R5cGUuZ2V0U2NyZWVuID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5pbnN0YW5jZSl7XG4gICAgaWYgKHRoaXMuaXNJbnN0YW5jZSkge1xuICAgICAgdGhpcy5pbnN0YW5jZSA9IHRoaXMuc2NyZWVuO1xuICAgIH1lbHNle1xuICAgICAgdGhpcy5pbnN0YW5jZSA9IG5ldyB0aGlzLnNjcmVlbigpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLmluc3RhbmNlO1xufTtcblxuU2NyZWVuTmF2aWdhdG9ySXRlbS5wcm90b3R5cGUuZGlzcG9zZVNjcmVlbiA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5pc0luc3RhbmNlKSByZXR1cm47XG5cbiAgdGhpcy5pbnN0YW5jZS5kaXNwb3NlKCk7XG4gIHRoaXMuaW5zdGFuY2UgPSBudWxsO1xufTtcblxuU2NyZWVuTmF2aWdhdG9ySXRlbS5wcm90b3R5cGUuZGlzcG9zZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5pc0luc3RhbmNlKXtcbiAgICB0aGlzLnNjcmVlbi5kaXNwb3NlKCk7XG4gIH1lbHNlIGlmICh0aGlzLmluc3RhbmNlKXtcbiAgICB0aGlzLmluc3RhbmNlLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHRoaXMuaW5zdGFuY2UgPSB0aGlzLnNjcmVlbiA9IG51bGw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNjcmVlbk5hdmlnYXRvckl0ZW07Il19
