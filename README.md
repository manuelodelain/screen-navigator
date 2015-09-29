# screen-navigator

## WIP  
  
Inspired by Feathers ScreenNavigator http://feathersui.com/api-reference/feathers/controls/ScreenNavigator.html

## Documentation

### Use

Create a screen navigator
```
var navigator = new ScreenNavigator();
```

Add screens items
```
// add screen instance
navigator.addItem('home', new Home());

// add screen class
navigator.addItem('about', About);
```

Navigate between screens
```
// show home page
navigator.showScreen('home');

// show about page
navigator.showScreen('home');
```


