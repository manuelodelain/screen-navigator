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

  createAnimIn (resolvePromise) {
    resolvePromise();
  }

  cancelAnimIn (resolvePromise) {
    resolvePromise();
  }
  
  animateOut (cancelTransition = false) {
    return new Promise(resolve => {
      if (cancelTransition) this.cancelAnimOut(resolve);
      else this.createAnimOut(resolve);
    });
  }

  createAnimOut (resolvePromise) {
    resolvePromise();
  }

  cancelAnimOut (resolvePromise) {
    resolvePromise();
  }
}

