export default class ScreenNavigatorItem {
  constructor (screen, options) {
    this.screen = screen;

    this.isInstance = typeof screen !== 'function';
    this.internalInstance = null;

    // default options
    this.arguments = null;
    this.properties = null;
    this.canDispose = !this.isInstance;
    this.events = null;

    this.hasEventsListeners = false;

    this.setOptions(options);
  }
  
  setOptions (options) {
    for (let optionKey in options){
      if (typeof this[optionKey] !== 'undefined') this[optionKey] = options[optionKey];
    }
  }

  getScreen () {
    let instance;

    if (this.isInstance){
      instance = this.screen;
    } else if (!this.canDispose && this.internalInstance){
      instance = this.internalInstance;
    } else {
      const args = this.arguments || [];

      instance = new this.screen(...args);

      if (!this.canDispose) this.internalInstance = instance;
    }

    if (this.properties){
      for (let key in this.properties){
        instance[key] = this.properties[key];
      }
    }

    if (this.events) this.addEventsListeners(instance);

    return instance;
  }

  addEventsListeners (instance) {
    if (!this.canDispose){
      if (this.hasEventsListeners) return;
  
      this.hasEventsListeners = true;
    }
  
    for (let eventName in this.events){
      if (typeof this.events[eventName] === 'function'){
        instance.on(eventName, this.events[eventName]);
      }
    }
  }

  removeEventsListeners (instance) {
    this.hasEventsListeners = false;

    for (let eventName in this.events){
      if (typeof this.events[eventName] === 'function'){
        instance.off(eventName, this.events[eventName]);
      }
    }
  }

  disposeScreen (instance, forceDispose = false) {
    if (this.events) this.removeEventsListeners(instance);

    if (!forceDispose && !this.canDispose) return;

    if (typeof instance.dispose === 'function') instance.dispose();

    this.internalInstance = null;
  }

  dispose (forceDispose = true) {
    let instance = this.isInstance ? this.screen : this.internalInstance;

    if (instance){
      this.disposeScreen(instance, forceDispose);
    }
    
    this.screen = 
    this.internalInstance = 
    this.arguments = 
    this.properties = 
    this.events = 
    null;
  }
}

