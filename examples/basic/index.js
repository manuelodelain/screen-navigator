// For the example the lib is included with a script tag.
// With a standard es6 import, the definition would be:
// import ScreenNavigator, {AScreen, ScreenNavigatorItem} from 'screen-navigator'
const ScreenNavigator = window.ScreenNavigator.default;
const AScreen = window.ScreenNavigator.AScreen;
const ScreenNavigatorItem = window.ScreenNavigator.ScreenNavigatorItem;
const Transitions = window.ScreenNavigator.Transitions;

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
// screenNavigator.transitionType = Transitions.OutAndIn;

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

