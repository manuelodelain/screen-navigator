export default function(newScreen, oldScreen, completeCallback) {
	function cancelPromise() {
		return Promise.reject('cancel transition').catch(function (error) {});
	};

	Promise.all([
		Promise.resolve().then(oldScreen && oldScreen.animateOut.bind(oldScreen), cancelPromise),
		Promise.resolve().then(newScreen && newScreen.animateIn.bind(newScreen), cancelPromise),
	]).then(completeCallback);

	return function cancel(){
		cancelPromise();

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	}
};