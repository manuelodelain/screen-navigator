export default function (newScreen, oldScreen, completeCallback) {
	function cancelPromise() {
		return Promise.reject('cancel transition').catch(function (error) {});
	};

	Promise.resolve()
		.then(oldScreen && oldScreen.animateOut.bind(oldScreen), cancelPromise)
		.then(newScreen && newScreen.animateIn.bind(newScreen), cancelPromise)
		.then(completeCallback, cancelPromise);

	return function cancel(){
		cancelPromise();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	};
};