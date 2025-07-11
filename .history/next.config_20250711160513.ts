import withPWA from 'next-pwa';

const nextConfig = {
  output: 'standalone',
  // ...autres options Next.js valides
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
};

export default withPWA(nextConfig);
