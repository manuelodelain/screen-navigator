var APage = require('./APage.js');
var inherits = require('inherits');

var About = function(){
  APage.call(this, 'about');
};

inherits(About, APage);

About.prototype.animateIn = function() {
  this.element.classList.add('active');
};

module.exports = About;
