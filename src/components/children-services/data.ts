import animations from './img/animations.jpg';
import aquaMakeup from './img/aqua-makeup.jpg';
import candyBar from './img/candy-bar.jpg';
import soapBubbles from './img/soap-bubbles.jpg';
import scienceShow from './img/science-show.jpg';
import liquidNitrogen from './img/liquid-nitrogen.jpg';
import paperShow from './img/paper-show.jpg';
import cakes from './img/cakes.jpg';
import baloons from './img/baloons.jpg';

interface Service {
  image: typeof animations,
  alt: string,
  text: string,
}

export const services: Service[] = [
  { image: animations, alt: 'Аниматорша', text: 'Анимации' },
  { image: aquaMakeup, alt: 'Аквагрим', text: 'Аквагрим' },
  { image: candyBar, alt: 'Candy Bar', text: 'Candy Bar' },
  { image: soapBubbles, alt: 'Шоу мыльных пузырей', text: 'Шоу мыльных пузырей' },
  { image: scienceShow, alt: 'Научное шоу', text: 'Научное шоу' },
  { image: liquidNitrogen, alt: 'Шоу с жидким азотом', text: 'Шоу с жидким азотом' },
  { image: paperShow, alt: 'Бумажное шоу', text: 'Бумажное шоу' },
  { image: cakes, alt: 'Торт', text: 'Торты под заказ' },
  { image: baloons, alt: 'Зал с воздушными шарами', text: 'Оформление зала воздушными шарами' },
];
