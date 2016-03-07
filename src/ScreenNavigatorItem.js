var ScreenNavigatorItem = function(screen, options){
  this.screen = screen;

  this.isInstance = typeof screen !== 'function';
  this.instance = this.isInstance ? screen : null;

  // default options
  this.arguments = null;
  this.properties = null;
  this.canDispose = !this.isInstance;
  this.events = null;

  this.setOptions(options);
};

ScreenNavigatorItem.prototype.setOptions = function(options) {
  for (var optionKey in options){
    if (typeof this[optionKey] !== 'undefined') this[optionKey] = options[optionKey];
  }
};

ScreenNavigatorItem.prototype.getScreen = function() {
  if (!this.instance){
    var args = this.arguments;
    var ScreenClass = this.screen;

    function WrappedScreenClass(){
      ScreenClass.apply(this, args);
    }

    WrappedScreenClass.prototype = ScreenClass.prototype;

    this.instance = new WrappedScreenClass();
  }

  if (this.properties){
    for (var key in this.properties){
      this.instance[key] = this.properties[key];
    }
  }

  if (this.events) this.addEventsListeners();

  return this.instance;
};

ScreenNavigatorItem.prototype.addEventsListeners = function() {
  for (var eventName in this.events){
    if (typeof this.events[eventName] === 'function'){
      this.instance.on(eventName, this.events[eventName]);
    }
  }
};

ScreenNavigatorItem.prototype.removeEventsListeners = function() {
  for (var eventName in this.events){
    if (typeof this.events[eventName] === 'function'){
      this.instance.off(eventName, this.events[eventName]);
    }
  }
};

ScreenNavigatorItem.prototype.disposeScreen = function(forceDispose) {
  if (!this.instance) return;

  if (this.events) this.removeEventsListeners();

  if (!forceDispose && !this.canDispose) return;

  if (typeof this.instance.dispose === 'function') this.instance.dispose();
  
  this.instance = null;
};

ScreenNavigatorItem.prototype.dispose = function() {
  this.disposeScreen(true);

  this.screen = 
  this.arguments = 
  this.properties = 
  null;
};

module.exports = ScreenNavigatorItem;

