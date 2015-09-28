module.exports = function(newScreen, oldScreen, completeCallback){
	if (oldScreen) oldScreen.animateOut();

	if (newScreen) newScreen.animateIn();

	completeCallback();

	return function cancel(){};
};