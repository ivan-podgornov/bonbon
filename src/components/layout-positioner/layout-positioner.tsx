import classNames from 'classnames';
import type { FC } from 'react';
import css from './layout-positioner.module.scss';

interface Props {
  className?: string,
  component?: 'div',
}

const LayoutPositioner: FC<Props> = (props) => {
  const Component = props.component;

  return (
    <Component className={classNames(props.className, css.positioner)}>
      {props.children}
    </Component>
  );
};

LayoutPositioner.defaultProps = {
  className: '',
  component: 'div',
};

export default LayoutPositioner;
