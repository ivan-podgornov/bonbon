import classNames from 'classnames';
import {
  useCallback,
  useRef,
  useState,
  FC,
} from 'react';

import { useMoveCallback } from '../../assets/hooks/use-move-callback';
import css from './main-slider.module.scss';

interface Props {
  images: string[],
}

const MainSlider: FC<Props> = (props) => {
  const sliderRef = useRef();
  const [current, setCurrent] = useState(0);
  const [marginLeft, setMarginLeft] = useState(current * 100);

  const setImage = useCallback((imageNumber: number) => {
    const nextImage = (() => {
      if (imageNumber < 0) return props.images.length - 1;
      if (imageNumber >= props.images.length) return 0;
      return imageNumber;
    })();

    setCurrent(nextImage);
    setMarginLeft(nextImage * 100);
  }, [props.images]);

  const previous = useCallback(() => setImage(current - 1), [current, setImage]);
  const next = useCallback(() => setImage(current + 1), [current, setImage]);

  const moveHandler = useMoveCallback({
    elementRef: sliderRef,
    moveHandler: (percents: number) => setMarginLeft(current * 100 + percents),
    upHandler: (percents: number) => {
      if (percents < 0 && percents < 33) return previous();
      if (percents > 0 && percents > 33) return next();
      return setImage(current);
    },
  });

  return (
    <div
      ref={sliderRef}
      className={css.slider}
      role="slider"
      tabIndex={0}
      aria-valuenow={current}
      onMouseDown={moveHandler}
      onTouchStart={moveHandler}
    >
      <div className={css.imagesContainer}>
        <ul
          className={css.images}
          style={{ marginLeft: `-${marginLeft}%` }}
        >
          {props.images.map((image, i) => (
            <li key={image} className={css.item}>
              <img
                className={css.image}
                src={image}
                alt={`Картинка №${i + 1}`}
              />
            </li>
          ))}
        </ul>
      </div>
      <ul className={css.rounds}>
        {props.images.map((image, i) => (
          <li
            key={image}
            className={classNames(css.round, {
              [css.round_active]: current === i,
            })}
            role="presentation"
            onClick={() => setImage(i)}
          />
        ))}
      </ul>
      <div
        className={classNames(
          css.arrow, css.arrow_left,
          'slider-icon slider-icon_arrow-left',
        )}
        role="presentation"
        onClick={previous}
      />
      <div
        className={classNames(
          css.arrow, css.arrow_right,
          'slider-icon slider-icon_arrow-right',
        )}
        role="presentation"
        onClick={next}
      />
    </div>
  );
};

export default MainSlider;
