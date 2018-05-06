/** OBSERVABLE INTERFACES */

export interface Subscribable<T> {
    subscribe(observerOrNext?: ((value: T) => void),
              error?: (error: any) => void,
              complete?: () => void): Unsubscribable;
}

/** SUBSCRIPTION INTERFACES */

export interface Unsubscribable {
    unsubscribe(): void;
}

export type TeardownLogic = void;

/** OBSERVER INTERFACES */

export interface NextObserver<T> {
    closed?: boolean;
    next: (value: T) => void;
    error?: (err: any) => void;
    complete?: () => void;
}

export interface ErrorObserver<T> {
    closed?: boolean;
    next?: (value: T) => void;
    error: (err: any) => void;
    complete?: () => void;
}

export interface CompletionObserver<T> {
    closed?: boolean;
    next?: (value: T) => void;
    error?: (err: any) => void;
    complete: () => void;
}

export type PartialObserver<T> = NextObserver<T> | ErrorObserver<T> | CompletionObserver<T>;