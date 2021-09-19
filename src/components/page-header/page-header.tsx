import type { FC } from 'react';
import css from './page-header.module.scss';
import BonbonLogo from '../bonbon-logo';
import LayoutPositioner from '../layout-positioner';
import PageNavigation from '../page-navigation';

const PageHeader: FC = () => (
  <header className={css.header}>
    <div className={css.topbar}>
      <LayoutPositioner className="clearfix">
        <>
          <BonbonLogo />
          <PageNavigation />
        </>
      </LayoutPositioner>
    </div>
  </header>
);

export default PageHeader;
