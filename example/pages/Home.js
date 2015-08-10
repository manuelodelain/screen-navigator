var APage = require('./APage.js');
var inherits = require('inherits');
var ScreenNavigator = require('../../src/ScreenNavigator.js');
var ScreenNavigatorItem = require('../../src/ScreenNavigatorItem.js');
var HomeItem = require('./home/HomeItem.js');

var Home = function(){
  APage.call(this, 'home');

  this.navigator = new ScreenNavigator();

  for (var i = 0; i < 6; i++) {
    this.navigator.addItem('item' + i, new ScreenNavigatorItem(new HomeItem()));
  };

  this.navigator.showScreen('item0');
};

inherits(Home, APage);

module.exports = Home;
