import './globals.css'
import { Metadata } from 'next'
import React from 'react'
import { Inter } from 'next/font/google'
import NavbarWrapper from './components/NavbarWrapper'
import FooterWrapper from './components/FooterWrapper' // Import the wrapper

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Electisec Research',
  description: 'Comprehensive research on smart contract security, proxy patterns, and cryptographic protocols',
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <NavbarWrapper />
        <main className="min-h-screen">
          {children}
        </main>
        <FooterWrapper /> {/* Use the client wrapper */}
      </body>
    </html>
  )
}