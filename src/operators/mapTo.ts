import { Operator } from '../Operator';
import { Subscriber } from '../Subscriber';

export class MapToOperator<Value, Result> implements Operator<Value, Result> {

    value: Result;

    constructor(value: Result) {
        this.value = value;
    }

    call(subscriber: Subscriber<Result>, source: any): any {
        return source.subscribe(new MapToSubscriber(subscriber, this.value));
    }
}

class MapToSubscriber<T, R> extends Subscriber<T> {

    value: R;

    constructor(destination: Subscriber<R>, value: R) {
        super(destination);
        this.value = value;
    }

    protected _next(x: T) {
        this.destination.next(this.value);
    }
}
