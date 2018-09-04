export default function (newScreen, oldScreen, completeCallback) {
	let promise = Promise.resolve();
	let canceled = false;

	if (oldScreen) promise = promise.then(oldScreen.animateOut.bind(oldScreen));
	if (newScreen) promise = promise.then(newScreen.animateIn.bind(newScreen));

	promise = promise.then(onComplete);

	function onComplete () {
		if (canceled) return;

		completeCallback();
	}

	return function cancel(){
		canceled = true;

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};