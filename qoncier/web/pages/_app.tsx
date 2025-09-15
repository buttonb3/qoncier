import React from 'react';
import type { AppProps } from 'next/app';
import { Amplify } from 'aws-amplify';
import { configureAuth } from '../src/services/auth';

// Configure AWS Amplify
configureAuth();

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
