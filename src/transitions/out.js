export default function(newScreen, oldScreen, completeCallback) {
	let promise;

	if (oldScreen) {
		promise = oldScreen.animateOut().then(onComplete);
	}else{
		onComplete();
	}

	function onComplete(){
		if (newScreen) newScreen.animateIn();

		completeCallback();
	}

	return function cancel(){
		if (promise) promise.reject('canceled');

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};