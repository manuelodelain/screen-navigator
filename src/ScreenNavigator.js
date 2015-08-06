var TinyEmitter = require('tiny-emitter');
var inherits = require('inherits');
var Transition = require('./Transition.js');

var ScreenNavigator = function(){
  this.screens = {};
  this.currentScreen = null;
  this.prevScreen = null;
  this.transition = null;
};

inherits(ScreenNavigator, TinyEmitter);

ScreenNavigator.prototype.addScreen = function(id, item) {
  this.screens[id] = item;
};

ScreenNavigator.prototype.getScreen = function(id, item) {
  return this.screens[id];
};

ScreenNavigator.prototype.showScreen = function(id, transition) {
  if (this.currentScreen){
    this.prevScreen = this.currentScreen;
  }

  if (this.transition){
    this.transition.dispose();
  }

  if (typeof transition === 'string'){
    this.transition = new Transition(this.currentScreen, this.prevScreen, transition);
  }else{
    this.transition = transition;
  }

  this.onChange();

  this.transition.on('start', this.onTransitionStart.bind(this));
  this.transition.on('complete', this.onTransitionComplete.bind(this));
  this.transition.start();
};

ScreenNavigator.prototype.onChange = function() {
  this.emit('change');
};

ScreenNavigator.prototype.onTransitionStart = function() {
  this.emit('transitionStart');
};

ScreenNavigator.prototype.onTransitionComplete = function() {
  this.transition.dispose();
  this.transition = null;

  this.emit('transitionComplete');
};

ScreenNavigator.prototype.dispose = function() {
  if (this.transition){
    this.transition.dispose();
  }


};

module.exports.AScreen = require('./AScreen.js');
module.exports.ScreenNavigatorItem = require('./ScreenNavigatorItem.js');
module.exports.Transition = require('./Transition.js');

module.exports = ScreenNavigator;

