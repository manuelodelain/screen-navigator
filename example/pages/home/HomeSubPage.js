var AScreen = require('../../../src/AScreen.js');
var inherits = require('inherits');

var HomeItem = function(container, index){
  this.element = document.createElement('div');

  this.element.classList.add('sub-page');
  this.element.innerHTML = 'page ' + index;

  container.appendChild(this.element);
};

inherits(HomeItem, AScreen);

HomeItem.prototype.animateIn = function() {
  var anim = this.element.animate([
    {transform: 'translate(100%)'},
    {transform: 'translate(0)'}
  ], {
    duration: 1000, 
    easing: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)'
  });

  anim.addEventListener('finish', this.onAnimateInComplete.bind(this));

  this.element.classList.add('active');
};

HomeItem.prototype.onAnimateInComplete = function() {
  AScreen.prototype.onAnimateInComplete.call(this);
};

HomeItem.prototype.animateOut = function(complete) {
  var anim = this.element.animate([
    {transform: 'translate(0)'},
    {transform: 'translate(-100%)'}
  ], {
    duration: 1000, 
    easing: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)'
  });

  anim.addEventListener('finish', this.onAnimateOutComplete.bind(this));
  
  if (complete) {
    this.onAnimateOutComplete();
  }
};

HomeItem.prototype.onAnimateOutComplete = function() {
  AScreen.prototype.onAnimateOutComplete.call(this);

  this.element.classList.remove('active');
};

module.exports = HomeItem;
