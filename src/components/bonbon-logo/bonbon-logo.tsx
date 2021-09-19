import Link from 'next/link';
import type { FC } from 'react';

import css from './bonbon-logo.module.scss';

const BonbonLogo: FC = () => (
  <figure className={css.logo}>
    <Link href="/">
      <a className={css.link} href="/">Bonbon</a>
    </Link>
  </figure>
);

export default BonbonLogo;
