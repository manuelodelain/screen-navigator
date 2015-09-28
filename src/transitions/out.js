module.exports = function(newScreen, oldScreen, completeCallback){
	if (newScreen) {
		newScreen.on('animateInComplete', function onAnimInComplete(){
			onComplete();
		});

		newScreen.animateIn();
	}else{
		onComplete();
	}

	function dispose(){
		if (newScreen) newScreen.off('animateInComplete');
	}

	function onComplete(){
		dispose();

		completeCallback();
	}

	return function cancel(){
		dispose();
	};
};