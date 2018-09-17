// because - for the example - the library is imported with a script tag
const AScreen = ScreenNavigator.AScreen;
const ScreenNavigatorItem = ScreenNavigator.ScreenNavigatorItem;
const Transitions = ScreenNavigator.Transitions;

// this class will be instancied for each screen displayed
class Screen extends AScreen {
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

const screenNavigator = new ScreenNavigator();

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
const item1 = new ScreenNavigatorItem(Screen, {arguments: ['screen-1']});
screenNavigator.addScreen('screen-1', item1);

const item2 = new ScreenNavigatorItem(Screen, {arguments: ['screen-2']});
screenNavigator.addScreen('screen-2', item2);

// show the first screen
screenNavigator.showScreen('screen-1');

