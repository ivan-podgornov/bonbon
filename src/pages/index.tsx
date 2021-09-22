import type { FC } from 'react';
import LayoutDefault from '../layouts/default';
import MainSlider from '../components/main-slider';

const PageIndex: FC = () => (
  <LayoutDefault>
    <MainSlider
      images={[
        '/images/index-slider/1.jpg',
        '/images/index-slider/2.jpg',
        '/images/index-slider/3.jpg',
      ]}
    />
  </LayoutDefault>
);

export default PageIndex;
