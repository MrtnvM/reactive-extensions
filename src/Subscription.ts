import { tryCatch } from './error-handling/tryCatch';

export class Subscription {

    public closed: boolean = false;

    private readonly _unsubscribe?: () => void;

    /**
     * @param {function(): void} [unsubscribe] A function describing how to
     * perform the disposal of resources when the `unsubscribe` method is called.
     */
    constructor(unsubscribe?: () => void) {
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }

    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    unsubscribe(): void {
        if (this.closed) {
            return;
        }

        if (this._unsubscribe) {
            tryCatch(this._unsubscribe).call(this);
        }

        this.closed = true;
    }
}