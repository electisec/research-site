// app/page.tsx
'use client';

import React, { useState } from 'react'
import LandingPage from './components/LandingPage'
import { Navbar, MobileNavbar } from './components/Navbar'
// import { Metadata } from 'next'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="flex flex-col bg-white text-black w-full font-default">
      {menuOpen ? (
        <MobileNavbar setMenuOpen={setMenuOpen} />
      ) : (
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      )}

      <LandingPage />
    </div>
  );
}

// Enhanced metadata for SEO
// export const metadata: Metadata = {
//   title: 'Electisec Research | Smart Contract Security & Cryptographic Research',
//   description: 'Comprehensive research on smart contract security, proxy patterns, multi-party computation, and cryptographic protocols by Electisec.',
//   keywords: [
//     'smart contracts',
//     'proxy patterns', 
//     'Web3 security',
//     'Ethereum',
//     'blockchain',
//     'Electisec',
//     'MPC',
//     'multi-party computation',
//     'delegatecall',
//     'upgradeable contracts',
//     'proxy vulnerabilities',
//     'smart contract auditing',
//     'cryptographic security'
//   ].join(', '),
//   authors: [{ name: 'Electisec', url: 'https://electisec.com' }],
//   openGraph: {
//     title: 'Electisec Research',
//     description: 'Comprehensive research on smart contract security and cryptographic protocols',
//     url: 'https://research.electisec.com',
//     siteName: 'Electisec Research',
//     type: 'website',
//     images: [
//       {
//         url: '/images/og-image.png',
//         width: 1200,
//         height: 630,
//         alt: 'Electisec Research',
//       },
//     ],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Electisec Research',
//     description: 'Comprehensive research on smart contract security and cryptographic protocols',
//     images: ['/images/og-image.png'],
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       'max-video-preview': -1,
//       'max-image-preview': 'large',
//       'max-snippet': -1,
//     },
//   },
// }