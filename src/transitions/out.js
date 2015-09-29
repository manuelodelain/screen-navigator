module.exports = function(newScreen, oldScreen, completeCallback){
	if (oldScreen) {
		oldScreen.on('animateOutComplete', onAnimOutComplete);
		oldScreen.animateOut();
	}else{
		onComplete();
	}

	function dispose(){
		if (oldScreen) oldScreen.off('animateOutComplete', onAnimOutComplete);
	}

	function onAnimOutComplete(){
		onComplete();
	}

	function onComplete(){
		if (newScreen) newScreen.animateIn();

		dispose();

		completeCallback();
	}

	return function cancel(){
		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);

		dispose();
	};
};