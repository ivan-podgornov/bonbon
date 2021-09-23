import { useMemo, FC } from 'react';
import BlockContent from '../components/block-content';
import BonbonHeading from '../components/bonbon-heading';
import BonbonParagraph from '../components/bonbon-paragraph';
import ChildrenServices from '../components/children-services';
import LayoutDefault from '../layouts/default';
import MainSlider from '../components/main-slider';

const PageIndex: FC = () => {
  const images = useMemo(() => [
    '/images/index-slider/1.jpg',
    '/images/index-slider/2.jpg',
    '/images/index-slider/3.jpg',
  ], []);

  return (
    <LayoutDefault>
      <article>
        <MainSlider images={images} />
        <BlockContent component="section">
          <>
            <BonbonHeading>Кафе Bonbon</BonbonHeading>
            <BonbonParagraph>
              Отличное детское кафе, которое понравится как родителям, так и
              детям. У нас есть несколько залов. Один из них стилизован и
              предназначен только для детей. В нём  разрисованы стены,
              цветной потолок, маленькие домики и игрушки. Так же имеется
              отдельное детское меню.
            </BonbonParagraph>
            <BonbonParagraph>
              Второй зал - банкетный, он вмещает в себя до  30 человек. Здесь вы
              можете отметить какой-нибудь праздник, свадьбу или корпоратив. Для
              банкетов тоже есть отдельное меню.
            </BonbonParagraph>
            <BonbonParagraph>
              В обычном зале вы можете просто отдохнуть.  Вас порадует
              ассортимент блюд и закусок Итальянской и Европейской кухонь. Для
              тех кто решил провести вечернюю прогулку, кафе Воnbоn предлагает
              открытую террасу, рядом с которой находится детская площадка.
            </BonbonParagraph>
          </>
        </BlockContent>
        <BlockContent>
          <>
            <BonbonHeading>Для детей</BonbonHeading>
            <ChildrenServices />
          </>
        </BlockContent>
      </article>
    </LayoutDefault>
  );
};

export default PageIndex;
