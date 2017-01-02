var ScreenNavigatorItem = function(screen, options){
  this.screen = screen;

  this.isInstance = typeof screen !== 'function';
  this.internalInstance = null;

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
  var instance;

  if (this.isInstance){
    instance = this.screen;
  } else if (this.internalInstance){
    instance = this.internalInstance;
  } else {
    var args = this.arguments;
    var ScreenClass = this.screen;

    function WrappedScreenClass(){
      ScreenClass.apply(this, args);
    }

    WrappedScreenClass.prototype = ScreenClass.prototype;

    instance = new WrappedScreenClass();

    if (!this.canDispose) this.internalInstance = instance;
  }

  if (this.properties){
    for (var key in this.properties){
      instance[key] = this.properties[key];
    }
  }

  if (this.events) this.addEventsListeners(instance);

  return instance;
};

ScreenNavigatorItem.prototype.addEventsListeners = function(instance) {
  for (var eventName in this.events){
    if (typeof this.events[eventName] === 'function'){
      instance.on(eventName, this.events[eventName]);
    }
  }
};

ScreenNavigatorItem.prototype.removeEventsListeners = function(instance) {
  for (var eventName in this.events){
    if (typeof this.events[eventName] === 'function'){
      instance.off(eventName, this.events[eventName]);
    }
  }
};

ScreenNavigatorItem.prototype.disposeScreen = function(instance, forceDispose) {
  if (this.events) this.removeEventsListeners(instance);

  if (!forceDispose && !this.canDispose) return;

  if (typeof instance.dispose === 'function') instance.dispose();

  this.internalInstance = null;
};

ScreenNavigatorItem.prototype.dispose = function(forceDispose) {
  if (typeof forceDispose !== 'boolean') forceDispose = true;

  var instance = this.isInstance ? this.screen : this.internalInstance;

  if (instance){
    this.disposeScreen(instance, forceDispose);
  }
  
  this.screen = 
  this.internalInstance = 
  this.arguments = 
  this.properties = 
  this.events = 
  null;
};

module.exports = ScreenNavigatorItem;

