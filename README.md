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



## Documentation

### `ScreenNavigator` methods

#### `addItem(id, screen, options)`

Add a screen to the navigator.

- `id`: `string` screen id
- `screen`: `object` or `function` (instance or class)
- `options`: `object` (optional) screen options

Available options: 
- `arguments`: `array` screen class constructor arguments
- `properties`: `object` key-values pairs to initialize the screen when he is shown
- `canDispose`: `boolean` indicates if the screen can be disposed. 
By default `false` if `screen` is already an instance and `true` if it's a class.


#### `getItem(id)`

Retrieve a ScreenNavigatorItem.

- `id`: `string` screen id

Returns
- `object` (ScreenNavigatorItem) the corresponding item, `null` if there is no item for the `id`.


#### `showScreen(id, transition)`

Display a screen.

- `id`: `string` screen id
- `transition`: `function` (optionnal)

Provide a custom transition with the `transition` parameter.
By default a ScreenNavigator has a transition (see the static constant `ScreenNavigator.defaultTransition` or the ScreenNavigator instance `transition` property ).

#### `clearScreen(transition)`

Clear the current screen.

- `transition`: `function` (optionnal) Same as `showScreen()` method.


#### `dispose()`

Dispose the instance and all its ScreenNavigatorItem instances.

### `ScreenNavigator` properties

- `currentItemId`: `string` the current item ID

- `prevItemId`: `string` the previous item ID

- `transition`: `function` the default transition for this navigator instance

- `transitionRunning`: `boolean` is there a transition currently running


### `ScreenNavigator` static properties

- `defaultTransition`: `function` change the default transition for all instances



## `Transitions`

Package all the predefined transitions.
- `none` no transition
- `outAndIn` transition out and transition in together
- `outThenIn` transition out then transition in
- `inThenOut` transition in then transition out
- `in` transition in only
- `out` transition ou only

You can build your own transition. It's a function with this signature :  
`function (newScreen, oldScreen, completeCallback)` and it returns a `cancel` function.  
The `completeCallback` is called when the transition is finished.  
The `cancel` function is called if the navigator has to stop the transition.  



## Browsers support

## License


