var AScreen = require('../../../src/AScreen.js');
var inherits = require('inherits');

var HomeItem = function(container, index){
  this.element = document.createElement('div');

  this.element.classList.add('sub-page');
  this.element.innerHTML = 'page ' + index;

  this.element.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

  container.appendChild(this.element);
};

inherits(HomeItem, AScreen);

HomeItem.prototype.animateIn = function(cancel) {
  if (cancel){
    TweenMax.killTweensOf(this.element);

    this.onAnimateInComplete();

    return;
  }

  TweenMax.fromTo(this.element, 1, {
    xPercent: 100
  }, {
    xPercent: 0,
    onComplete: this.onAnimateInComplete.bind(this),
    ease: Expo.easeOut
  });

  this.element.classList.add('active');
};

HomeItem.prototype.onAnimateInComplete = function() {
  AScreen.prototype.onAnimateInComplete.call(this);
};

HomeItem.prototype.animateOut = function(cancel) {
  if (cancel){
    TweenMax.killTweensOf(this.element);

    this.onAnimateOutComplete();

    return;
  }

  TweenMax.to(this.element, 1, {
    xPercent: -100,
    onComplete: this.onAnimateOutComplete.bind(this),
    ease: Expo.easeOut
  });
};

HomeItem.prototype.onAnimateOutComplete = function() {
  AScreen.prototype.onAnimateOutComplete.call(this);

  this.element.classList.remove('active');
};

module.exports = HomeItem;
