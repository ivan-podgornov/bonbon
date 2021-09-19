import classNames from 'classnames';
import Link from 'next/link';
import { useCallback, useState, FC } from 'react';

import type { Link as LinkType } from './links';
import menuCss from './menu.module.scss';

interface Props {
  link: LinkType,
  submenu?: boolean,
}

const LinkComponent: FC<Props> = (props) => {
  const [active, setActive] = useState(false);

  const getLinkClassName = useCallback(() => classNames(menuCss.link, {
    [menuCss.icon]: 'icon' in props.link,
    icon: 'icon' in props.link,
    [`icon_${props.link.icon}`]: 'icon' in props.link,
    [menuCss.submenuContainer]: 'submenu' in props.link,
    [menuCss.submenuContainer_active]: active,
    [menuCss.submenuLink]: props.submenu,
  }), [props.link, props.submenu, active]);

  const clickHandler = useCallback(() => {
    if (!props.link.submenu) return;
    setActive((isActive) => !isActive);
  }, [props.link]);

  return ('href' in props.link) ? (
    <Link href={props.link.href}>
      <a
        href={props.link.href}
        className={getLinkClassName()}
      >
        {props.link.text}
      </a>
    </Link>
  ) : (
    <button
      className={getLinkClassName()}
      type="button"
      onClick={clickHandler}
    >
      {props.link.text}
    </button>
  );
};

LinkComponent.defaultProps = {
  submenu: false,
};

export default LinkComponent;
