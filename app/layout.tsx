import './globals.css'
import { Metadata } from 'next'
import React from 'react'
import { Space_Grotesk } from 'next/font/google'
import FooterWrapper from './components/FooterWrapper' // Import the wrapper
import Navbar from './components/Navbar'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://research.electisec.com'),
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
        url: '/assets/images/logo.png',
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
    images: ['/assets/images/logo.png'],
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

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#10b981" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={spaceGrotesk.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <FooterWrapper /> {/* Use the client wrapper */}
      </body>
    </html>
  )
}