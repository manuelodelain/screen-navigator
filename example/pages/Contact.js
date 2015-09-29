var APage = require('./APage.js');
var inherits = require('inherits');

var Contact = function(){
  APage.call(this, 'contact');
};

inherits(Contact, APage);

// Contact.prototype.animateIn = function() {
//   this.element.classList.add('active');
// };

module.exports = Contact;
