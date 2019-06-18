import EventEmitter from 'tiny-emitter';
import ScreenNavigatorItem from './ScreenNavigatorItem';
import Transitions from './Transitions';
import AScreen from './AScreen'
import ATransition from './transitions/ATransition';

export {ScreenNavigatorItem, Transitions, AScreen, ATransition}

export default class ScreenNavigator extends EventEmitter {
  constructor () {
    super(); 

    this.items = {};

    this.currentItemId = null;
    this.previousItemId = null;

    this.currentScreen = null;
    this.previousScreen = null;

    this.transition = null;
    this.transitionType = Transitions.None;
  }

  /**
   * 
   * @param {boolean} forceDispose 
   */
  dispose (forceDispose = true) {
    if (this.transition){
      this.transition.cancel();
      this.transition = null;
    }
  
    this.disposeCurrentScreen();
    this.disposePreviousScreen();
  
    for (let itemId in this.items){
      this.items[itemId].dispose(forceDispose);
  
      this.removeScreen(itemId);
    }
  
    this.transitionType = null;
  }
  
  /**
   * 
   * @param {string} id - screen id
   * @param {ScreenNavigatorItem} item 
   * 
   * @return {ScreenNavigatorItem} item
   */
  addScreen (id, item) {
    this.items[id] = item;
  
    return item;
  }

  /**
   * @param {string} id - screen id
   */
  removeScreen (id) {
    if (!this.items[id]) return;

    delete this.items[id];
  }

  /**
   * 
   * @param {string} id - screen id
   */
  getScreen (id) {
    return this.items[id];
  }

  /**
   * 
   * @param {string} id - screen id
   * @param {ATransition} transition - optional transition, if not provided the default transition will be applied
   * @param {object} options - optional options to apply to the new screen
   */
  showScreen (id, transition = null, options = null) {
    if (!this.items[id]){
      throw new Error('ScreenNavigator - the item with the id ' + id + ' doesn\'t exist');
    }
    if (this.transition){
      this.onTransitionComplete(true);
    } 
  
    if (this.currentScreen){
      this.previousItemId = this.currentItemId;
      this.previousScreen = this.currentScreen;
    }
  
    this.currentItemId = id;
  
    this.onScreenChange();
  
    this.startTransition(transition, options);

    return this.transition.promise;
  }

  /**
   * 
   * @param {ATransition} transition - optional transition, if not provided the default transition will be applied
   */
  clearScreen (transition = null, options = null) {
    if (!this.currentScreen){
      return;
    }
  
    this.previousItemId = this.currentItemId;
    this.previousScreen = this.currentScreen;
  
    this.currentItemId = null;
  
    this.onScreenChange();
  
    this.startTransition(transition, options);

    return this.transition.promise;
  }

  /**
   * 
   * @param {string} id 
   * @param {object} screen
   * @param {boolean} forceDispose 
   */
  disposeScreen (id, screen, forceDispose = false) {
    if (!screen) return;
    
    const item = this.items[id];

    if (!item) return;

    item.disposeScreen(screen, forceDispose);
  }

  disposePreviousScreen () {
    if (!this.previousScreen) return;
  
    this.disposeScreen(this.previousItemId, this.previousScreen);
  
    this.previousScreen = null;
  }

  disposeCurrentScreen () {
    if (!this.currentScreen) return;
  
    this.disposeScreen(this.currentItemId, this.currentScreen);
  
    this.currentScreen = null;
  }

  /**
   * 
   * @param {ATransition} transition 
   * @param {object} options 
   */
  startTransition (transition = null, options = null) {
    const transitionClass = transition || this.transitionType;
    const currentItem = this.items[this.currentItemId];
  
    if (options) currentItem.setOptions(options);
  
    this.currentScreen = currentItem ? currentItem.getScreen() : null;
  
    this.emit('transitionStart');
  
    this.transition = new transitionClass(this.currentScreen, this.previousScreen);

    this.transition.promise.then(() => {
      this.onTransitionComplete();
    });
  }

  onScreenChange () {
    this.emit('screenChange');
  }

  /**
   * 
   * @param {boolean} cancelTransition 
   */
  onTransitionComplete (cancelTransition = false) {
    if (cancelTransition && this.transition){
      this.transition.cancel();
    }

    this.transition = null;
    
    this.disposePreviousScreen();
  
    if (cancelTransition){
      this.emit('transitionCancel');
    }else{
      this.emit('transitionComplete');
    }
  }
}

