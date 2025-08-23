'use client';

import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('./footer'), {
  ssr: false,
  loading: () => <div className="h-32" />
});

export default function FooterWrapper() {
  return <Footer />;
}