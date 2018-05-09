export const mustBeCalled =
    () => expect(true).toBeTruthy();

export const failOnNext =
    () => fail('onNext should not be called');

export const failOnError =
    () => fail('onError should not be called');

export const failOnComplete =
    () => fail('onComplete should not be called');