/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import '../styles/global.css';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Head>
        <title>Chatic</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="description" content="Realtime chat" />
        <link rel="icon" href="/assets/logo.png" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>

  );
}
