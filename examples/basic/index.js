const screenNavigator = new ScreenNavigator();

// this class will be instancied for each screen displayed
class Screen extends ScreenNavigator.AScreen {
    constructor (id) {
        super();
        
        // keep the DOM element for showing / hiding it
        this.element = document.querySelector('#' + id);
    }

    // show screen
    createAnimIn (resolvePromise) {
        this.element.style.display = 'block';

        // resolve the animate in promise
        resolvePromise();
    }

    // hide screen
    createAnimOut (resolvePromise) {
        this.element.style.display = '';

        // resolve the animate out promise
        resolvePromise();
    }
}

// button click handler
function onScreenBtnClick (event) {
    const screenId = event.currentTarget.getAttribute('data-screen');

    // if the current screen is the same as the clicked one
    if (screenId === screenNavigator.currentItemId) return;

    // display the new screen
    screenNavigator.showScreen(screenId);
}

// listen the click on buttons
document.querySelectorAll('.screen-btn').forEach(element => element.addEventListener('click', onScreenBtnClick));

// add screens to the navigator
screenNavigator.addItem('screen-1', Screen, {arguments: ['screen-1']});
screenNavigator.addItem('screen-2', Screen, {arguments: ['screen-2']});

// show the first screen
screenNavigator.showScreen('screen-1');

