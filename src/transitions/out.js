import ATransition from './ATransition';

export default class Out extends ATransition {
	createPromise () {
		return Promise.resolve()
			.then(this.oldScreen && this.oldScreen.animateOut.bind(this.oldScreen), this.cancelPromise)
			.then(() => {
				if (this.newScreen) this.newScreen.animateIn();
			}, this.cancelPromise);
	}
}