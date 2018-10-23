import ATransition from './ATransition';

export default class OutThenIn extends ATransition {
	createPromise () {
		return Promise.resolve()
			.then(this.oldScreen && this.oldScreen.animateOut.bind(this.oldScreen), this.cancelPromise)
			.then(this.newScreen && this.newScreen.animateIn.bind(this.newScreen), cancelPromise);
	}
}