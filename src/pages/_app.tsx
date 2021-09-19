import type { AppProps } from 'next/app';
import type { FC } from 'react';
import '../assets/global.scss';

const MyApp: FC<AppProps> = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { Component } = props;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...props.pageProps} />;
};

export default MyApp;
