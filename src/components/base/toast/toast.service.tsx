import { BehaviorSubject } from 'rxjs';
import { ToastData, ToastOpts, ToastPositionEnum, ToastStatusEnum, ToastSubject } from './toast.type';

let toastId = 0;

export const toast$ = new BehaviorSubject<ToastSubject>({
    position: ToastPositionEnum.TopRight,
    toasts: [],
});

export function addToast({
    text,
    status = ToastStatusEnum.Valid,
    position = ToastPositionEnum.TopRight,
    removeOnNextNavigating = true,
}: ToastOpts) {
    toastId++;
    const toasts = toast$.getValue().toasts;
    const id = toastId;

    const newToast: ToastData = {
        id,
        text,
        status,
        removeOnNextNavigating,
    };

    toast$.next({
        position,
        toasts: [...toasts, newToast],
    });

    return newToast;
}

export function removeToast(toastId: number) {
    const toasts = toast$.getValue().toasts;
    const position = toast$.getValue().position;

    toast$.next({
        position,
        toasts: toasts.filter((toast) => toast.id !== toastId),
    });
}

export function clearAllToast() {
    toast$.next({ position: ToastPositionEnum.TopRight, toasts: [] });
}
