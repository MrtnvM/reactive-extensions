import { Observable } from '../Observable';
import { Observer } from '../Observer';
import { failOnComplete, failOnError, failOnNext } from '../utils/testUtils';

describe('0. Testing Observable', () => {

    it('onNext', (done) => {
        const observable = Observable.create((observer: Observer<number>) => {
            observer.next(5);
        });

        const onNext = (value) => {
            expect(value).toEqual(5);
            done();
        };

        observable.subscribe(onNext,  failOnError, failOnComplete);
    }, 100);

    it ('multiple onNext', (done) => {
        const data = [1, 2, 3];

        const observable = Observable.create((observer: Observer<number>) => {
            data.forEach(i => observer.next(i));
        });

        let countOfAssertions = 0;

        observable.subscribe(i => {
            expect(i).toEqual(data[countOfAssertions++]);

            (countOfAssertions === data.length) && done();
        });
    }, 100);

    it('onError', (done) => {
        const observable = Observable.create((observer: Observer<number>) => {
            observer.error(new Error('WTF!'));
        });

        const onError = (error) => {
            expect(error.message).toEqual('WTF!');
            done();
        };

        observable.subscribe(failOnNext,  onError, failOnComplete);
    }, 100);

    it('onComplete', (done) => {
        const observable = Observable.create((observer: Observer<number>) => {
            observer.complete();
        });

        const onComplete = () => {
            expect(true).toBeTruthy();
            done();
        };

        observable.subscribe(failOnNext,  failOnError, onComplete);
    }, 100);

    it('onNext & onComplete', () => {
        expect.assertions(2);

        const observable = Observable.create((observer: Observer<number>) => {
            observer.next(5);
            observer.complete();
        });

        const onNext = (value) => expect(value).toEqual(5);
        const onComplete = () => expect(true).toBeTruthy();

        observable.subscribe(onNext,  failOnError, onComplete);
    });
});