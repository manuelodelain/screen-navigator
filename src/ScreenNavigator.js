var TinyEmitter = require('tiny-emitter');
var inherits = require('inherits');

var ScreenNavigator = function(){
  this.screens = {};
  this.currentScreen = null;
  this.prevScreen = null;

  this.transitionRunning = false;
  this.transitionType = this.defaultTransitionType = Transition.NONE;
};

inherits(ScreenNavigator, TinyEmitter);

ScreenNavigator.TRANSITION_OUT_AND_IN = 'outAndIn';
ScreenNavigator.TRANSITION_OUT_THEN_IN = 'outThenIn';
ScreenNavigator.TRANSITION_IN_THEN_OUT = 'inThenOut';
ScreenNavigator.TRANSITION_OUT = 'out';
ScreenNavigator.TRANSITION_IN = 'in';
ScreenNavigator.TRANSITION_NONE = 'none';

ScreenNavigator.prototype.addScreen = function(id, item) {
  this.screens[id] = item;
};

ScreenNavigator.prototype.getScreen = function(id) {
  return this.screens[id];
};

ScreenNavigator.prototype.showScreen = function(id, transitionType) {
  var newScreen = this.getScreen(id);

  if (!newScreen){
    throw new Error('ScreenNavigator - the screen with the id ' + id + ' doesn\'t exist');
  }

  if (this.currentScreen){
    this.prevScreen = this.currentScreen;
  }

  this.currentScreen = newScreen;

  this.onChange();

  this.startTransition();
};

ScreenNavigator.prototype.clearScreen = function() {
};

ScreenNavigator.prototype.startTransition = function(transitionType) {
  if (this.transitionRunning){
    this.cancelTransition();
  }

  this.transitionType = transitionType ? transitionType : this.defaultTransitionType;

  swith(transitionType){
    case ScreenNavigator.TRANSITION_OUT_AND_IN:
      break;

    case ScreenNavigator.TRANSITION_OUT_THEN_IN:
      break;

    case ScreenNavigator.TRANSITION_IN_THEN_OUT:
      break;

    case ScreenNavigator.TRANSITION_OUT:
      if (this.prevScreen) {
        this.currentScreen.on('animateInComplete', this.onTransitionInComplete.bind(this));
        this.currentScreen.animateIn();
      }
      break;

    case ScreenNavigator.TRANSITION_IN:
      if (this.currentScreen) {
        this.currentScreen.on('animateInComplete', this.onTransitionInComplete.bind(this));
        this.currentScreen.animateIn();
      }
      break;

    case ScreenNavigator.TRANSITION_NONE:
    default:
      this.transitionType = ScreenNavigator.TRANSITION_NONE;

      if (this.prevScreen) this.prevScreen.animateOut(true);
      if (this.currentScreen) this.currentScreen.animateIn(true);
      this.onTransitionComplete();
      break;
  }

  this.onTransitionStart();
};

ScreenNavigator.prototype.cancelTransition = function(complete) {
  this.transitionRunning = false;

  this.disposeTransition();

  if (this.prevScreen){
    this.prevScreen.animateOut(true);
  }

  if (this.currentScreen){
    this.currentScreen.animateOut(true);
  }
};

ScreenNavigator.prototype.onChange = function() {
  this.emit('change');
};

ScreenNavigator.prototype.onTransitionStart = function() {
  this.emit('transitionStart');
};

ScreenNavigator.prototype.onTransitionInComplete = function() {
  this.prevScreen.animateOut(true);
  this.onTransitionComplete();
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
  if (this.prevScreen){
    this.prevScreen.off('animateInComplete').off('animateOutComplete');
  }

  if (this.currentScreen){
    this.currentScreen.off('animateInComplete').off('animateOutComplete');
  }
};

module.exports.AScreen = require('./AScreen.js');
module.exports.ScreenNavigatorItem = require('./ScreenNavigatorItem.js');

module.exports = ScreenNavigator;

