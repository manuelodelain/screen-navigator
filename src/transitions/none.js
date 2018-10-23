import ATransition from './ATransition';

export default class None extends ATransition {
	createPromise () {
		if (this.oldScreen) this.oldScreen.animateOut();
		if (this.newScreen) this.newScreen.animateIn();

		return Promise.resolve();
	}
}