// app/page.tsx
'use client';

import React from 'react'
import LandingPage from './components/LandingPage'
// import { Metadata } from 'next'

export default function Home() {
  return (
    <div className="flex flex-col bg-white text-black w-full font-default">
      <LandingPage />
    </div>
  );
}