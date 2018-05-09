import { Observable } from '../../Observable';
import { Observer } from '../../Observer';
import { failOnComplete, failOnError, mustBeCalled } from '../../utils/testUtils';

describe('mapTo', () => {

    it('map stream to value', () => {
        expect.assertions(1);

        const stream = Observable.create((observer: Observer<number>) => {
            observer.next(1);
        });

        const onNext = (value) => expect(value).toEqual('new value');

        stream
            .mapTo('new value')
            .subscribe(onNext,  failOnError, failOnComplete);
    });

    it('multiple map to value', () => {
        expect.assertions(4);

        const data = [1, 2, 3];

        const stream = Observable.create((observer: Observer<number>) => {
            data.forEach(i => observer.next(i));
            observer.complete();
        });

        const onNext = (value) => expect(value).toEqual({ value: 'mock value' });

        stream
            .mapTo({ value: 'mock value' })
            .subscribe(onNext, failOnError, mustBeCalled);
    })
});