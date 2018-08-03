import EventEmitter from 'tiny-emitter';
import ScreenNavigatorItem from './ScreenNavigatorItem';
import Transitions from './Transitions';
import AScreen from './AScreen';

export default class ScreenNavigator extends EventEmitter {
  constructor () {
    this.items = {};

    this.currentItemId = null;
    this.previousItemId = null;

    this.currentScreen = null;
    this.previousScreen = null;

    this.transition = ScreenNavigator.defaultTransition;
    this.transitionRunning = false;
    this.transitionCancel = null;

    ScreenNavigator.defaultTransition = Transitions.none;
  }
  
  addItem (id, screen, options) {
    const item = new ScreenNavigatorItem(screen, options);
  
    this.items[id] = item;
  
    return item;
  }

  getItem (id) {
    return this.items[id];
  }

  showScreen (id, transition, options) {
    if (!this.getItem(id)){
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

  startTransition (transition, options) {
    transition = transition || this.transition;
  
    const currentItem = this.getItem(this.currentItemId);
  
    if (options) currentItem.setOptions(options);
  
    this.currentScreen = currentItem ? currentItem.getScreen(options) : null;
  
    this.transitionRunning = true;
  
    this.emit('transitionStart');
  
    this.transitionCancel = transition(this.currentScreen, this.previousScreen, this.onTransitionComplete.bind(this));
  }

  onScreenChange () {
    this.emit('screenChange');
  }

  onTransitionComplete (cancelTransition, silent) {
    this.transitionRunning = false;
  
    if (cancelTransition){
      if (this.transitionCancel) this.transitionCancel();
    }
    
    this.disposePreviousScreen();
  
    if (!silent){
      if (cancelTransition){
        this.emit('transitionCancel');
      }else{
        this.emit('transitionComplete');
      }
    }
  
    this.transitionCancel = null;
  }

  dispose (forceDispose) {
    if (typeof forceDispose !== 'boolean') forceDispose = true;
  
    if (this.transitionRunning){
      this.onTransitionComplete(true, true);
    }
  
    this.disposeCurrentScreen();
    this.disposePreviousScreen();
  
    for (let itemId in this.items){
      this.items[itemId].dispose(forceDispose);
  
      delete this.items[itemId];
    }
  
    this.transition = null;
  }

  disposePreviousScreen () {
    if (!this.previousScreen) return;
  
    this.getItem(this.previousItemId).disposeScreen(this.previousScreen);
  
    this.previousScreen = null;
  }

  disposeCurrentScreen () {
    if (!this.currentScreen) return;
  
    this.getItem(this.currentItemId).disposeScreen(this.currentScreen);
  
    this.currentScreen = null;
  }
}

