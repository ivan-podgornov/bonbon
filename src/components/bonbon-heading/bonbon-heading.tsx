import classNames from 'classnames';
import type { FC } from 'react';
import css from './bonbon-heading.module.scss';

interface Props {
  className?: string,
}

const BonbonHeading: FC<Props> = (props) => (
  <h1 className={classNames(props.className, css.heading)}>
    {props.children}
  </h1>
);

BonbonHeading.defaultProps = {
  className: '',
};

export default BonbonHeading;
