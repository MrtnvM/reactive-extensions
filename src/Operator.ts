export interface Operator<T, R> {
    call(subscriber: Subscriber<R>, source: any): void;
}