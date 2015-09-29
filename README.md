# screen-navigator



## Description  

Navigate easily between screens, with transitions.  
Inspired by Feathers ScreenNavigator http://feathersui.com/api-reference/feathers/controls/ScreenNavigator.html
  
 
  
## Installation

`npm install screen-navigator --save`  



## Getting started

Create a screen navigator
```javascript
var navigator = new ScreenNavigator();
```

Add screens items
```javascript
// add screen instance
navigator.addItem('home', new Home());

// add screen class
navigator.addItem('about', About);
```

Navigate between screens
```javascript
// show home page
navigator.showScreen('home');

// show about page
navigator.showScreen('about');
```

Want more ? See the `example/` directory.


## Documentation

[See the wiki](https://github.com/manuelodelain/screen-navigator/wiki)


## License

MIT.
