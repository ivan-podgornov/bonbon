import classNames from 'classnames';
import type { FC } from 'react';
import css from './layout-positioner.module.scss';

export interface Props {
  className?: string,
  component?: 'div' | 'article' | 'section',
}

const LayoutPositioner: FC<Props> = (props) => {
  const Component = props.component || 'div';

  return (
    <Component className={classNames(props.className, css.positioner)}>
      {props.children}
    </Component>
  );
};

export default LayoutPositioner;
