import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Providers } from 'store';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}

export default MyApp;
