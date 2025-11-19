import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bsc, bscTestnet, sepolia } from 'viem/chains';

const config = getDefaultConfig({
  appName: 'WEB3 BASE',
  projectId: '935812f2dbe9ea751452691cf40ebd5e',
  chains: [
    bsc,
    ...(process.env.NODE_ENV === 'development'
      ? [sepolia, bscTestnet]
      : []),
  ],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export default config;

