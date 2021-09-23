import Image from 'next/image';
import type { FC } from 'react';

import css from './children-services.module.scss';
import { services } from './data';

const ChildrenServices: FC = () => (
  <section className={css.features}>
    {services.map((service) => (
      <figure key={service.image.src} className={css.feature}>
        <Image
          className={css.image}
          alt={service.alt}
          height={service.image.height}
          src={service.image.src}
          width={service.image.width}
        />
        <figcaption className={css.name}>
          {service.text}
        </figcaption>
      </figure>
    ))}
  </section>
);

export default ChildrenServices;
