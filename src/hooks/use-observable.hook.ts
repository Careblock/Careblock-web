import { useCallback, useEffect, useState } from 'react';
import { Observable, Subject, take, takeUntil } from 'rxjs';

export default function useObservable() {
    const [destroy$] = useState(new Subject<void>());

    useEffect(
        () => () => {
            if (!destroy$.closed) {
                destroy$.next();
                destroy$.complete();
            }
        },
        [destroy$]
    );

    const subscribeOnce = useCallback(
        <T>(observable: Observable<T>, callback: (data: T) => void) =>
            observable.pipe(take(1)).subscribe((data) => callback(data)),
        []
    );

    const subscribeUntilDestroy = useCallback(
        <T>(observable: Observable<T>, callback: (data: T) => void) =>
            observable.pipe(takeUntil(destroy$)).subscribe((data) => callback(data)),
        [destroy$]
    );

    return { subscribeOnce, subscribeUntilDestroy };
}
