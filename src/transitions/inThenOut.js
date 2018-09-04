export default function(newScreen, oldScreen, completeCallback) {
	let promise = new Promise();

	if (newScreen) promise.then(newScreen.animateIn());
	if (oldScreen) promise.then(oldScreen.animateOut());

	promise.then(completeCallback);

	return function cancel(){
		promise.reject('canceled');

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};