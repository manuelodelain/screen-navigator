import ATransition from './ATransition';

export default class In extends ATransition {
	createPromise () {
		return Promise.resolve()
			.then(this.newScreen && this.newScreen.animateIn.bind(this.newScreen), this.cancelPromise)
			.then(() => {
				if (this.oldScreen) this.oldScreen.animateOut();
			}, this.cancelPromise);
	}
}