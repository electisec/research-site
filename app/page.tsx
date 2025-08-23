// app/page.tsx
import React from 'react'
import LandingPage from './components/LandingPage'
import { Metadata } from 'next'

export default function Home() {
  return <LandingPage />
}

// Enhanced metadata for SEO
export const metadata: Metadata = {
  title: 'Electisec Research | Smart Contract Security & Cryptographic Research',
  description: 'Comprehensive research on smart contract security, proxy patterns, multi-party computation, and cryptographic protocols by Electisec.',
  keywords: [
    'smart contracts',
    'proxy patterns', 
    'Web3 security',
    'Ethereum',
    'blockchain',
    'Electisec',
    'MPC',
    'multi-party computation',
    'delegatecall',
    'upgradeable contracts',
    'proxy vulnerabilities',
    'smart contract auditing',
    'cryptographic security'
  ].join(', '),
  authors: [{ name: 'Electisec', url: 'https://electisec.com' }],
  openGraph: {
    title: 'Electisec Research',
    description: 'Comprehensive research on smart contract security and cryptographic protocols',
    url: 'https://research.electisec.com',
    siteName: 'Electisec Research',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Electisec Research',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electisec Research',
    description: 'Comprehensive research on smart contract security and cryptographic protocols',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}