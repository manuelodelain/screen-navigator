export default class ATransition {
    constructor (newScreen, oldScreen) {
        this.newScreen = newScreen;
        this.oldScreen = oldScreen;

        this.promise = this.createPromise();
    }

    createPromise () {
        return Promise.resolve();
    }

    cancelPromise () {
        return Promise.reject('cancel transition').catch(function (error) {});
    }

    cancel () {
        this.cancelPromise();

        if (this.oldScreen) this.oldScreen.animateOut(true);
		if (this.newScreen) this.newScreen.animateIn(true);
    }
}