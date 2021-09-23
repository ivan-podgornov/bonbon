import classNames from 'classnames';
import type { FC } from 'react';
import LayoutPositioner, { PositionerProps } from '../layout-positioner';
import css from './block-content.module.scss';

const BlockContent: FC<PositionerProps> = (props) => (
  <LayoutPositioner
    className={classNames(props.className, css.content)}
    component={props.component}
  >
    {props.children}
  </LayoutPositioner>
);

export default BlockContent;
