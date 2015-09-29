# screen-navigator


## Description  
  
Inspired by Feathers ScreenNavigator http://feathersui.com/api-reference/feathers/controls/ScreenNavigator.html



## Installation

`npm install screen-navigator --save`  



## Getting started

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
navigator.showScreen('about');
```



## Documentation

### `ScreenNavigator`

#### `addItem(id, screen, options)`

Parameters: 
	- `id`: `string` screen id
	- `screen`: `object` or `function` (instance or class)
	- `options`: `object` (optional) screen options

Available options: 
	- `arguments`: `array` screen class constructor arguments
	- `properties`: `object` key-values pairs to initialize the screen when he is shown
	- `canDispose`: `boolean` indicates if the screen can be disposed.
	By default `false` if `screen` is already an instance and `true` if it's a class.


#### `getItem(id)`

Parameters:
	- `id`: `string` screen id

Return
	- `object` (ScreenNavigatorItem) the corresponding item, `null` if there is no item for the `id`.


#### `showScreen(id, transition)`

Parameters:
	- `id`: `string` screen id
	- `transition`: `function` (optionnal).


## Browsers support

