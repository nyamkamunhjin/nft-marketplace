/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { AppProps } from 'next/app'
import Link from 'next/link'
import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'tailwindcss/tailwind.css'
import './index.css'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => (
  <div>
    <nav className="border-b p-6 shadow-lg">
      <p className="text-4xl font-bold">NFT Marketplace</p>
      <div className="flex mt-4">
        <Link href="/">
          <a className="mr-4 text-green-500">Home</a>
        </Link>
        <Link href="/create-item">
          <a className="mr-6 text-green-500">Sell Digital Asset</a>
        </Link>
        <Link href="/my-assets">
          <a className="mr-6 text-green-500">My Digital Assets</a>
        </Link>
        <Link href="/creator-dashboard">
          <a className="mr-6 text-green-500">Creator Dashboard</a>
        </Link>
      </div>
    </nav>
    <div className="min-h-screen bg-gray-100">
      <Component {...pageProps} />
    </div>
  </div>
)

export default MyApp
