import EventEmitter from 'tiny-emitter';

export default class AScreen extends EventEmitter {
  dispose () {
  }

  animateIn (cancelTransition = false) {
    return new Promise(resolve => {
      if (cancelTransition) this.cancelAnimIn(resolve);
      else this.createAnimIn(resolve);
    });
  }

  createAnimIn (onComplete) {
    onComplete();
  }

  cancelAnimIn (onComplete) {
    onComplete();
  }
  
  animateOut (cancelTransition = false) {
    return new Promise(resolve => {
      if (cancelTransition) this.cancelAnimOut(resolve);
      else this.createAnimOut(resolve);
    });
  }

  createAnimOut (onComplete) {
    onComplete();
  }

  cancelAnimOut (onComplete) {
    onComplete();
  }
}

