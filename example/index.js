var ScreenNavigator = require('../src/ScreenNavigator.js');
var ScreenNavigatorItem = require('../src/ScreenNavigatorItem.js');
var Home = require('./pages/Home.js');
var About = require('./pages/About.js');

var navigator = new ScreenNavigator();

// listen to screens changes
navigator.on('change', onPageChange);

// add screens
navigator.addItem('home', new ScreenNavigatorItem(new Home())); 
navigator.addItem('about', new ScreenNavigatorItem(About)); 
navigator.addItem('contact', new ScreenNavigatorItem(require('./pages/Contact.js'))); 

// show first screen
navigator.showScreen('home');

var navItems = document.querySelectorAll('nav li a');

// click on nav links for the example
for (var i = 0; i < navItems.length; i++) {
  navItems[i].addEventListener('click', function(event){
    event.preventDefault();

    var id = event.currentTarget.getAttribute('href').split('/')[1];
    if (id === '') id = 'home';

    navigator.showScreen(id);
  })
};

function onPageChange(){
  // console.log('change');
}
