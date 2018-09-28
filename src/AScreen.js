import EventEmitter from 'tiny-emitter';

export default class AScreen extends EventEmitter {
  dispose () {
  }

  animateIn (cancelTransition = false) {
    this.emit('animateIn', {cancelTransition});
    
    return new Promise(resolve => {
      if (cancelTransition) this.cancelAnimIn(resolve);
      else this.createAnimIn(resolve);
    })
      .then(this.onAnimateInComplete.bind(this, cancelTransition))
      .catch(function (error) {
        console.log(error);
      });
  }

  createAnimIn (resolvePromise) {
    resolvePromise();
  }

  cancelAnimIn (resolvePromise) {
    resolvePromise();
  }
  
  animateOut (cancelTransition = false) {
    this.emit('animateOut', {cancelTransition});

    return new Promise(resolve => {
      if (cancelTransition) this.cancelAnimOut(resolve);
      else this.createAnimOut(resolve);
    })
      .then(this.onAnimateOutComplete.bind(this, cancelTransition))
      .catch(function (error) {
        console.log(error);
      });
  }

  createAnimOut (resolvePromise) {
    resolvePromise();
  }

  cancelAnimOut (resolvePromise) {
    resolvePromise();
  }

  onAnimateInComplete (canceledTransition) {
    this.emit('animateInComplete', {canceledTransition});
  }
  
  onAnimateOutComplete (canceledTransition) {
    this.emit('animateOutComplete', {canceledTransition});
  }
}

