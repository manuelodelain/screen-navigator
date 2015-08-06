var TinyEmitter = require('tiny-emitter');
var inherits = require('inherits');
var Transition = require('./Transition.js');

var ScreenNavigator = function(){
  this.screens = [];
  this.currentScreen = null;
  this.prevScreen = null;
  this.transition = null;
};

inherits(ScreenNavigator, TinyEmitter);

ScreenNavigator.prototype.addScreen = function(id, item) {
  
};

ScreenNavigator.prototype.showScreen = function(id, transitionType) {
  if (this.currentScreen){
    this.prevScreen = this.currentScreen;
  }

  if (this.transition){
    this.transition.dispose();
  }

  this.transition = new Transition(this.currentScreen, this.prevScreen, transitionType);
  this.transition.on('start', this.onTransitionStart.bind(this));
  this.transition.on('complete', this.onTransitionComplete.bind(this));
  this.transition.start();
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

