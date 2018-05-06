import { emptyObserver } from './Observer';
import { Subscriber } from './Subscriber';
import { PartialObserver } from './types';

export function toSubscriber<T>(
    nextOrObserver?: PartialObserver<T> | ((value: T) => void),
    error?: (error: any) => void,
    complete?: () => void): Subscriber<T> {

    if (nextOrObserver) {
        if (typeof nextOrObserver === 'object') {
            return (<Subscriber<T>> nextOrObserver);
        }
    }

    if (!nextOrObserver && !error && !complete) {
        return new Subscriber(emptyObserver);
    }

    return new Subscriber(nextOrObserver, error, complete);
}
