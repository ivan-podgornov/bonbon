import {
  useCallback,
  useMemo,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  RefObject,
} from 'react';

interface Options {
  elementRef: RefObject<HTMLElement>,
  moveHandler?: (percents: number) => void,
  upHandler?: (percents: number) => void,
}

interface MouseDownListener {
  (event: ReactMouseEvent | ReactTouchEvent): void,
}

export const useMoveCallback = (options: Options): MouseDownListener => {
  const mouseEvents = useMemo(() => ['mousedown', 'mousemove', 'mouseup'], []);
  const isReactMouseEvent = useCallback(
    // Отключил правило, потому что если его включить, получится сильно длинная строка
    // eslint-disable-next-line arrow-body-style
    (event: ReactMouseEvent | ReactTouchEvent): event is ReactMouseEvent => {
      return mouseEvents.includes(event.type);
    },
    [mouseEvents],
  );

  const isMouseEvent = useCallback(
    // Отключил правило, потому что если его включить, получится сильно длинная строка
    // eslint-disable-next-line arrow-body-style
    (event: MouseEvent | TouchEvent): event is MouseEvent => {
      return mouseEvents.includes(event.type);
    },
    [mouseEvents],
  );

  const mouseDownListener = useCallback((down: ReactMouseEvent | ReactTouchEvent) => {
    if (!options.elementRef) return;

    const downX = isReactMouseEvent(down) ? down.pageX : down.touches[0].pageX;

    const moveListener = (move: MouseEvent | TouchEvent, up = false) => {
      const elementWidth = options.elementRef.current.offsetWidth;
      const posX = isMouseEvent(move) ? move.pageX : move.touches[0].pageX;
      const difference = posX - downX;
      const percents = difference === 0 ? 0 : 100 / (elementWidth / difference);
      const callback = up ? options.upHandler : options.moveHandler;
      if (callback) callback(percents * -1);
    };

    const upListener = (up: MouseEvent | TouchEvent) => {
      moveListener(up, true);
      document.removeEventListener('mousemove', moveListener);
      document.removeEventListener('touchmove', moveListener);
      document.removeEventListener('mouseup', upListener);
      document.removeEventListener('touchend', upListener);
    };

    document.addEventListener('mousemove', moveListener, { passive: true });
    document.addEventListener('touchmove', moveListener, { passive: true });
    document.addEventListener('mouseup', upListener);
    document.addEventListener('touchend', upListener);
  }, [isMouseEvent, isReactMouseEvent, options]);

  return mouseDownListener;
};
