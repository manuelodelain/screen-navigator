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

  if (this.transitionRunning){
    this.onTransitionComplete(true);
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

  var item;

  for (var itemId in this.items){
    item = this.items[itemId];

    if (typeof item.dispose === 'function') item.dispose();
  }
};

module.exports = ScreenNavigator;

module.exports.AScreen = require('./AScreen.js');
module.exports.ScreenNavigatorItem = ScreenNavigatorItem;
module.exports.Transitions = Transitions;

