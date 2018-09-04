export default function(newScreen, oldScreen, completeCallback) {
	let promises = [];

	if (oldScreen) promises.push(oldScreen.animateOut());
	if (newScreen) promises.push(newScreen.animateIn());

	Promise.all(promises).then(completeCallback);

	return function cancel(){
		promises.forEach(promise => promise.reject('canceled'))

		if (oldScreen) oldScreen.animateOut(true);
		if (newScreen) newScreen.animateIn(true);
	}
};