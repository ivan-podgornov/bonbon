import classNames from 'classnames';
import {
  useCallback, useRef, useState,
  FC, MouseEvent,
} from 'react';

import navigationCss from './navigation.module.scss';
import menuCss from './menu.module.scss';
import { links, Link } from './links';
import LinkComponent from './link-component';

const PageNavigation: FC = () => {
  const [active, setActive] = useState(false);
  const navigationRef = useRef<HTMLDivElement>();

  const getItemClassNames = useCallback((link: Link) => classNames(menuCss.item, {
    [menuCss.itemSubmenu]: 'submenu' in link,
  }), []);

  const clickHandler = useCallback((event: MouseEvent) => {
    if (event.target !== navigationRef.current) return;
    setActive((oldActive) => !oldActive);
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <nav // eslint-disable-line jsx-a11y/no-noninteractive-element-interactions
      ref={navigationRef}
      onClick={clickHandler}
      className={classNames(navigationCss.navigation, {
        [navigationCss.active]: active,
      })}
    >
      <ul className={classNames(navigationCss.menu, menuCss.menu)}>
        {links.map((link) => (
          <li
            key={link.href || link.text}
            className={getItemClassNames(link)}
          >
            <LinkComponent link={link} />
            {link.submenu && (
              <ul className={menuCss.submenu}>
                {link.submenu.map((sublink) => (
                  <li className={menuCss.submenuItem} key={sublink.href}>
                    <LinkComponent link={sublink} submenu />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default PageNavigation;
