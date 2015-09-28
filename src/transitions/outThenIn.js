module.exports = function(newScreen, oldScreen, completeCallback){
	var count = 0;

	if (oldScreen) {
		oldScreen.on('animateOutComplete', function onAnimOutComplete(){
			if (newScreen) {
				animIn();
			}else{
				onComplete();
			}
		});

		oldScreen.animateOut();
	}else{
		animIn();
	}

	function animIn(){
		newScreen.on('animateInComplete', function onAnimInComplete(){
			onComplete();
		});

		newScreen.animateIn();
	}

	function dispose(){
		oldScreen.off('animateInComplete');
		newScreen.off('animateInComplete');
	}

	function onComplete(){
		dispose();

		completeCallback();
	}

	return function cancel(){
		dispose();
	};
};