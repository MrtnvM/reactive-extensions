import { Observer, emptyObserver } from './Observer';
import { Subscription } from './Subscription';
import { PartialObserver } from './types';
import { isFunction } from './utils/utils';

export class Subscriber<T> extends Subscription implements Observer<T> {

    protected isStopped: boolean = false;
    protected destination: PartialObserver<any>;

    /**
     * A static factory for a Subscriber
     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     * @nocollapse
     */
    static create<T>(next?: (x?: T) => void,
                     error?: (e?: any) => void,
                     complete?: () => void): Subscriber<T> {
        return new Subscriber(next, error, complete);
    }

    constructor(destinationOrNext?: PartialObserver<any> | ((value: T) => void),
                error?: (e?: any) => void,
                complete?: () => void) {
        super();

        if (arguments.length === 0) {
            this.destination = emptyObserver;
        } else {
            if (typeof destinationOrNext === 'object') {
                this.destination = new SafeSubscriber<T>(this, <PartialObserver<any>> destinationOrNext);
            } else {
                this.destination = new SafeSubscriber<T>(this, <((value: T) => void)> destinationOrNext, error, complete);
            }
        }
    }

    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    next(value?: T): void {
        if (!this.isStopped) {
            this._next(value);
        }
    }

    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached {@link Error}. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    error(err?: any): void {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    }

    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    complete(): void {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    }

    unsubscribe(): void {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        super.unsubscribe();
    }

    protected _next(value: T): void {
        this.destination.next(<any>value);
    }

    protected _error(err: any): void {
        this.destination.error(err);
        this.unsubscribe();
    }

    protected _complete(): void {
        this.destination.complete();
        this.unsubscribe();
    }
}

class SafeSubscriber<T> extends Subscriber<T> {

    private readonly _context: any;

    constructor(private _parentSubscriber: Subscriber<T>,
                observerOrNext?: PartialObserver<T> | ((value: T) => void),
                error?: (e?: any) => void,
                complete?: () => void) {
        super();

        let next: ((value: T) => void);
        let context: any = this;

        if (isFunction(observerOrNext)) {
            next = (<((value: T) => void)> observerOrNext);
        } else if (observerOrNext) {
            next = (<PartialObserver<T>> observerOrNext).next;
            error = (<PartialObserver<T>> observerOrNext).error;
            complete = (<PartialObserver<T>> observerOrNext).complete;

            if (observerOrNext !== emptyObserver) {
                context = Object.create(observerOrNext);
                context.unsubscribe = this.unsubscribe.bind(this);
            }
        }

        this._context = context;
        this._next = next;
        this._error = error;
        this._complete = complete;
    }

    next(value?: T): void {
        if (!this.isStopped && this._next) {
            this.__tryOrUnsubscribe(this._next, value);
        }
    }

    error(err?: any): void {
        if (!this.isStopped) {
            if (this._error) {
                this.__tryOrUnsubscribe(this._error, err);
                this.unsubscribe();
            } else {
                this.unsubscribe();
            }
        }
    }

    complete(): void {
        if (!this.isStopped) {
            if (this._complete) {
                const wrappedComplete = () => this._complete.call(this._context);

                this.__tryOrUnsubscribe(wrappedComplete);
                this.unsubscribe();
            } else {
                this.unsubscribe();
            }
        }
    }

    private __tryOrUnsubscribe(fn: Function, value?: any): void {
        try {
            fn.call(this._context, value);
        } catch (err) {
            this.unsubscribe();
        }
    }
}