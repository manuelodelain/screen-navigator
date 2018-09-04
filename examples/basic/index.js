const screenNavigator = new ScreenNavigator();

// this class will be instancied for each screen displayed
class Screen extends ScreenNavigator.AScreen {
    constructor (id) {
        console.log('screen const id=',id);
    }
}

// add screens to the navigator
screenNavigator.addItem('screen-1', Screen, {arguments: ['screen-1']});
screenNavigator.addItem('screen-2', Screen, {arguments: ['screen-2']});

// show the first screen
screenNavigator.showScreen('screen-1');

