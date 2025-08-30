'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Cpu, ArrowRight, BookOpen, Users, Target } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen pt-20 px-4 sm:px-6 lg:mx-[20vw]">
      <div className="text-center">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-16">
          <span className="block xl:inline">Explore </span>{' '}
          <span className="block text-green-600 xl:inline">Research</span>
        </h1>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Proxies Research Card */}
          <Link 
            href="/proxies"
            className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 block p-8"
          >
            <div className="flex items-center">
              <Shield className="h-12 w-12 text-green-600" />
              <div className="ml-4 text-left">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  Proxy Research
                </h3>
                <p className="text-green-600 font-medium">Smart Contract Security</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-lg mt-6 text-left">
              Comprehensive guide to smart contract proxy patterns, security vulnerabilities, 
              and best practices for Web3 developers and auditors.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>8+ Topics</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Target className="h-4 w-4 mr-2" />
                <span>Security Focus</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-2" />
                <span>Expert Research</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Shield className="h-4 w-4 mr-2" />
                <span>Vulnerability Analysis</span>
              </div>
            </div>

            <div className="mt-8 flex items-center text-green-600 font-medium group-hover:text-green-700">
              <span>Explore Proxy Research</span>
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* MPC Research Card */}
          <Link 
            href="/mpc"
            className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 block p-8"
          >
            <div className="flex items-center">
              <Cpu className="h-12 w-12 text-green-600" />
              <div className="ml-4 text-left">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                  MPC Research
                </h3>
                <p className="text-green-600 font-medium">Multi-Party Computation</p>
              </div>
            </div>
            
            <p className="text-gray-600 text-lg mt-6 text-left">
              Advanced research on multi-party computation protocols, privacy-preserving 
              technologies, and cryptographic security analysis.
            </p>

            <div className="mt-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <Cpu className="h-4 w-4 mr-2" />
                Coming Soon
              </div>
            </div>

            <div className="mt-8 flex items-center text-green-600 font-medium group-hover:text-green-700">
              <span>Preview MPC Research</span>
              <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}