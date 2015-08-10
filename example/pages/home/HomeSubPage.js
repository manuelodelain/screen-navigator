var AScreen = require('../../../src/AScreen.js');
var inherits = require('inherits');
var TweenMax = require('gsap');

var HomeItem = function(container, index){
  this.element = document.createElement('div');

  this.element.classList.add('sub-page');
  this.element.innerHTML = 'page ' + index;

  container.appendChild(this.element);
};

inherits(HomeItem, AScreen);

HomeItem.prototype.animateIn = function() {
  TweenMax.fromTo(this.element, 1, {
    xPercent: 100
  }, {
    xPercent: 0,
    ease: Expo.easeInOut,
    onComplete: this.onAnimateInComplete.bind(this)
  });

  this.element.classList.add('active');
};

HomeItem.prototype.onAnimateInComplete = function() {
  AScreen.prototype.onAnimateInComplete.call(this);
};

HomeItem.prototype.animateOut = function(complete) {
  TweenMax.to(this.element, 1, {
    xPercent: -100,
    ease: Expo.easeOut,
    onComplete: this.onAnimateOutComplete.bind(this)
  });
  
  if (complete) {
    this.onAnimateOutComplete();
  }
};

HomeItem.prototype.onAnimateOutComplete = function() {
  AScreen.prototype.onAnimateOutComplete.call(this);

  this.element.classList.remove('active');
};

module.exports = HomeItem;
