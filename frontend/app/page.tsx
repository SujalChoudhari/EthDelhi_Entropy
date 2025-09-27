"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMetamask } from "@/hooks/useMetamask";
import MetamaskTrigger from "@/components/metamask-trigger";

export default function Home() {
  const { account, connect } = useMetamask();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  useEffect(() => {
    // auto-connect if already authorized
    if (!account && typeof window !== "undefined" && (window as any).ethereum) {
      (window as any).ethereum.request({ method: "eth_accounts" }).then((accs: string[]) => {
        if (accs && accs.length > 0) {
          // connect will set account in the hook
          connect().catch(() => {});
        }
      }).catch(() => {});
    }
  }, [account, connect]);

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Logo/Brand section */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome Back
            </h1>
            <p className="text-muted-foreground mt-2">
              Connect your wallet to access the platform
            </p>
          </div>

          {/* Connection Card */}
          <div className="bg-card/70 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-border">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
                </svg>
              </div>
              
              <h2 className="text-xl font-semibold text-card-foreground mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-muted-foreground mb-6 text-sm">
                This app requires a MetaMask or compatible wallet to continue. Your wallet will be used to authenticate and interact with the platform.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => connect()}
                  className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
                  </svg>
                  Connect MetaMask
                </button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">Don't have MetaMask?</span>
                  </div>
                </div>
                
                <a
                  className="w-full px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md flex items-center justify-center gap-3"
                  href="https://metamask.io/download.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Install MetaMask
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border bg-card/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-foreground">
                Hunch
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-chart-2/20 text-chart-2 rounded-full text-sm font-medium">
                Connected
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="px-3 py-1 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-lg text-sm font-mono transition-colors flex items-center gap-2"
                >
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                        Wallet Connected
                      </div>
                      <div className="px-4 py-2 text-xs font-mono text-foreground break-all">
                        {account}
                      </div>
                      <button
                        onClick={() => {
                          disconnect?.();
                          setShowAccountMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Disconnect Wallet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Welcome to the Platform
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose where you'd like to go next
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Marketplace Card */}
          <Link href="/marketplace">
            <div className="group bg-card/70 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-border hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-chart-2 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-3">
                  Marketplace
                </h3>
                <p className="text-muted-foreground mb-6">
                  Browse and trade NFTs, tokens, and other digital assets in our decentralized marketplace.
                </p>
                <div className="inline-flex items-center text-chart-2 font-medium group-hover:gap-3 gap-2 transition-all duration-300">
                  Enter Marketplace
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Chat Card */}
          <Link href="/chat">
            <div className="group bg-card/70 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-border hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-chart-1 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-3">
                  Chat
                </h3>
                <p className="text-muted-foreground mb-6">
                  Connect with other users, join communities, and participate in decentralized conversations.
                </p>
                <div className="inline-flex items-center text-chart-1 font-medium group-hover:gap-3 gap-2 transition-all duration-300">
                  Start Chatting
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Additional Features */}
        <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Platform Features
          </h3>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-chart-4/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-chart-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Secure</h4>
              <p className="text-sm text-muted-foreground">End-to-end encryption and blockchain security</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-chart-5/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-chart-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Fast</h4>
              <p className="text-sm text-muted-foreground">Lightning-fast transactions and interactions</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-chart-3/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-chart-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Community</h4>
              <p className="text-sm text-muted-foreground">Built by and for the decentralized community</p>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showAccountMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowAccountMenu(false)}
        />
      )}

      <MetamaskTrigger/>
    </div>
  );
}