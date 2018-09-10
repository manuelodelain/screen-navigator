const screenNavigator = new ScreenNavigator();

// this class will be instancied for each screen displayed
class Screen extends ScreenNavigator.AScreen {
    constructor (id) {
        super();
        
        this.element = document.querySelector('#' + id);

        this.animTimeout = null;
    }

    // show screen
    createAnimIn (resolvePromise) {
        this.element.style.display = 'block';

        resolvePromise();
    }

    // hide screen
    createAnimOut (resolvePromise) {
        this.element.style.display = '';

        resolvePromise();
    }
}

// button click handler
function onScreenBtnClick (event) {
    const screenId = event.currentTarget.getAttribute('data-screen');

    if (screenId === screenNavigator.currentItemId) return;

    screenNavigator.showScreen(screenId);
}

// listen the click on buttons
document.querySelectorAll('.screen-btn').forEach(element => element.addEventListener('click', onScreenBtnClick));

// add screens to the navigator
screenNavigator.addItem('screen-1', Screen, {arguments: ['screen-1']});
screenNavigator.addItem('screen-2', Screen, {arguments: ['screen-2']});

// show the first screen
screenNavigator.showScreen('screen-1');

