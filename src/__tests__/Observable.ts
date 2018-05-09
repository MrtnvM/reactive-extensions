import { Observable } from '../Observable';
import { Observer } from '../Observer';

describe('0. Testing Observable', () => {

    it('onNext', (done) => {
        const observable = Observable.create((observer: Observer<number>) => {
            observer.next(5);
        });

        const onNext = (value) => {
            expect(value).toEqual(5);
            done();
        };

        const onError = () => fail('Should not be called');
        const onComplete = () => fail('Should not be called');

        observable.subscribe(onNext,  onError, onComplete);
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

        const onNext = () => fail('Should not be called');
        const onComplete = () => fail('Should not be called');

        observable.subscribe(onNext,  onError, onComplete);
    }, 100);

    it('onComplete', (done) => {
        const observable = Observable.create((observer: Observer<number>) => {
            observer.complete();
        });

        const onComplete = () => {
            expect(true).toBeTruthy();
            done();
        };
        const onNext = () => fail('Should not be called');
        const onError = () => fail('Should not be called');

        observable.subscribe(onNext,  onError, onComplete);
    }, 100);
});