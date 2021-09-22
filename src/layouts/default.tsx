import type { FC } from 'react';
import PageHeader from '../components/page-header';

const LayoutDefault: FC = (props) => (
  <>
    <PageHeader />
    <main>
      {props.children}
    </main>
  </>
);

export default LayoutDefault;
