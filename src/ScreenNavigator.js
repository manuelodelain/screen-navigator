import EventEmitter from 'tiny-emitter';
import ScreenNavigatorItem from './ScreenNavigatorItem';
import Transitions from './Transitions';
import AScreen from './AScreen'

export {ScreenNavigatorItem, Transitions, AScreen}

export default class ScreenNavigator extends EventEmitter {
  static defaultTransition = Transitions.None;

  constructor () {
    super();
    
    this.items = {};

    this.currentItemId = null;
    this.previousItemId = null;

    this.currentScreen = null;
    this.previousScreen = null;

    this.transition = ScreenNavigator.defaultTransition;
    this.transitionRunning = false;
    this.transitionCancel = null;
  }
  
  addScreen (id, item) {
    this.items[id] = item;
  
    return item;
  }

  removeScreen (id) {
    if (!this.items[id]) return;

    delete this.items[id];
  }

  getScreen (id) {
    return this.items[id];
  }

  showScreen (id, transition = null, options = null) {
    if (!this.items[id]){
      throw new Error('ScreenNavigator - the item with the id ' + id + ' doesn\'t exist');
    }
  
    if (this.transitionRunning){
      this.onTransitionComplete(true);
    } 
  
    if (this.currentScreen){
      this.previousItemId = this.currentItemId;
      this.previousScreen = this.currentScreen;
    }
  
    this.currentItemId = id;
  
    this.onScreenChange();
  
    this.startTransition(transition, options);
  }

  clearScreen (transition) {
    if (!this.currentScreen){
      return;
    }
  
    this.previousItemId = this.currentItemId;
    this.previousScreen = this.currentScreen;
  
    this.currentItemId = null;
  
    this.onScreenChange();
  
    this.startTransition(transition);
  }

  disposeScreen (id, forceDispose = false) {
    const item = this.items[id];

    if (!item) return;

    item.disposeScreen(forceDispose);
  }

  disposePreviousScreen () {
    if (!this.previousScreen) return;
  
    this.disposeScreen(this.previousItemId);
  
    this.previousScreen = null;
  }

  disposeCurrentScreen () {
    if (!this.currentScreen) return;
  
    this.disposeScreen(this.currentItemId);
  
    this.currentScreen = null;
  }

  startTransition (transition = null, options = null) {
    transition = transition || this.transition;
  
    const currentItem = this.items[this.currentItemId];
  
    if (options) currentItem.setOptions(options);
  
    this.currentScreen = currentItem ? currentItem.getScreen(options) : null;
  
    this.transitionRunning = true;
  
    this.emit('transitionStart');
  
    this.transitionCancel = transition(this.currentScreen, this.previousScreen, this.onTransitionComplete.bind(this));
  }

  onScreenChange () {
    this.emit('screenChange');
  }

  onTransitionComplete (cancelTransition = false) {
    this.transitionRunning = false;
  
    if (cancelTransition){
      if (this.transitionCancel) this.transitionCancel();
    }
    
    this.disposePreviousScreen();
  
      if (cancelTransition){
        this.emit('transitionCancel');
      }else{
        this.emit('transitionComplete');
      }
  
    this.transitionCancel = null;
  }

  dispose (forceDispose = true) {
    if (this.transitionRunning){
      if (this.transitionCancel) this.transitionCancel();

      this.transitionRunning = false;
    }
  
    this.transitionCancel = null;
  
    this.disposeCurrentScreen();
    this.disposePreviousScreen();
  
    for (let itemId in this.items){
      this.items[itemId].dispose(forceDispose);
  
      this.removeScreen(itemId);
    }
  
    this.transition = null;
  }
}

