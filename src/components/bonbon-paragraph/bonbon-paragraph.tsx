import classNames from 'classnames';
import type { FC } from 'react';
import css from './bonbon-paragraph.module.scss';

interface Props {
  className?: string,
}

const BonbonParagraph: FC<Props> = (props) => (
  <p className={classNames(props.className, css.paragraph)}>
    {props.children}
  </p>
);

BonbonParagraph.defaultProps = {
  className: '',
};

export default BonbonParagraph;
