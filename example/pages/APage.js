var AScreen = require('../../src/AScreen.js');
var inherits = require('inherits');

var APage = function(id){
  this.element = document.getElementById(id + '-page');
};

inherits(APage, AScreen);

APage.prototype.animateIn = function() {
  this.element.classList.add('active');

  this.onAnimateInComplete();
};

APage.prototype.animateOut = function() {
  this.element.classList.remove('active');

  this.onAnimateOutComplete();
};

module.exports = APage;

