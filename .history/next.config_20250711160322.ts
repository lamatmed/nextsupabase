import withPWA from 'next-pwa';

const nextConfig = {
  // output: 'standalone', // retiré pour compatibilité PWA
  // ...autres options Next.js valides
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
};

export default withPWA(nextConfig);
