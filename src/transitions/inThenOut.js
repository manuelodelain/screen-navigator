import ATransition from './ATransition';

export default class InThenOut extends ATransition {
	createPromise () {
		return Promise.resolve()
			.then(this.newScreen && this.newScreen.animateIn.bind(this.newScreen), this.cancelPromise)
			.then(this.oldScreen && this.oldScreen.animateOut.bind(this.oldScreen), this.cancelPromise);
	}
}