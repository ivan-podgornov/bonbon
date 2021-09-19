interface SubmenuLink {
  href: string,
  text: string,
}

export interface Link {
  href?: string,
  icon?: string,
  submenu?: SubmenuLink[],
  text: string,
}

export const links: Link[] = [
  {
    href: '/',
    icon: 'home',
    text: 'Главная',
  },
  {
    icon: 'menu',
    text: 'Меню',
    submenu: [
      { href: '/adult\'s-menu', text: 'Взрослое' },
      { href: '/banquet-menu', text: 'Банкетное' },
      { href: '/children\'s-menu', text: 'Детское' },
      { href: '/coffee-card', text: 'Кофейная карта' },
    ],
  },
  {
    icon: 'animations',
    href: '/animations',
    text: 'Анимации',
  },
  {
    icon: 'photos',
    href: '/gallery',
    text: 'Фото',
  },
  {
    icon: 'price-list',
    href: '/price-list',
    text: 'Прайс-лист',
  },
];
