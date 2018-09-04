export default function(newScreen, oldScreen, completeCallback) {
	let promise;
	
	if (newScreen) {
		promise = newScreen.animateIn().then(onComplete);
	}else{
		onComplete();
	}

	function onComplete(){
		if (oldScreen) oldScreen.animateOut();

		completeCallback();
	}

	return function cancel(){
		if (promise) promise.reject('canceled');
		
		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};