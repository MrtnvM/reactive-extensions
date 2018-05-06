export interface Observer<T> {
    closed?: boolean;
    next(value: T): void;
    error(err: any): void;
    complete(): void;
}

export const emptyObserver: Observer<any> = {
    closed: true,
    next(value: any): void {
        /* noop */
    },
    error(err: any): void {
        /* noop */
    },
    complete(): void {
        /*noop*/
    }
};