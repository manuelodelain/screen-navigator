import ATransition from './ATransition';

export default class OutAndIn extends ATransition {
	createPromise () {
		return Promise.all([
			Promise.resolve().then(this.oldScreen && this.oldScreen.animateOut.bind(this.oldScreen), this.cancelPromise),
			Promise.resolve().then(this.newScreen && this.newScreen.animateIn.bind(this.newScreen), this.cancelPromise),
		]);
	}
}