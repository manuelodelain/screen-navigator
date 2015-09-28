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

