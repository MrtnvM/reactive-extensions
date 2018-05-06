import { NotImplementedError } from './NotImplementedError';
import { Operator } from './Operator';
import { Subscriber } from './Subscriber';
import { Subscription } from './Subscription';
import { toSubscriber } from './toSubscriber';
import { PartialObserver, Subscribable, TeardownLogic } from './types';

class Observable<T> implements Subscribable<T> {

    source: Observable<any>;
    operator: Operator<any, T>;

    private readonly _subscribe: (subscriber: Subscriber<T>) => TeardownLogic;

    private constructor(subscribe?: (subscriber: Subscriber<T>) => TeardownLogic) {
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }

    static create: Function = <T>(subscribe: (subscriber: Subscriber<T>) => TeardownLogic) => {
        return new Observable<T>(subscribe);
    };

    subscribe(observerOrNext?: PartialObserver<T> | ((value: T) => void),
              error?: (error: any) => void,
              complete?: () => void): Subscription {

        const { operator } = this;
        const sink = toSubscriber(observerOrNext, error, complete);

        if (operator) {
            operator.call(sink, this.source);
        } else {
            this._subscribe(sink);
        }

        return sink;
    }

    map<R>(action: (value: T) => R) {
        throw new NotImplementedError();
    }
}

export { Observable };