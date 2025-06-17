'use client'
import { http, createConfig } from 'wagmi'
import { injectedWallet,trustWallet } from '@rainbow-me/rainbowkit/wallets';
import React, { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import {
  mainnet,
  polygon,
  arbitrum,
  bsc,
  cronos,
  base,
  sonic
} from 'wagmi/chains'

import '@rainbow-me/rainbowkit/styles.css'
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';


import { Theme } from '@rainbow-me/rainbowkit'

export const nekoTheme: Theme = {
  blurs: {
    modalOverlay: 'blur(6px)',
  },
  colors: {
    accentColor: '#FF914D', // Orange utama
    accentColorForeground: '#ffffff',
    actionButtonBorder: '#FFA366',
    actionButtonBorderMobile: '#FFA366',
    actionButtonSecondaryBackground: '#FFF2E6',
    closeButton: '#FF914D',
    closeButtonBackground: '#FFE1CC',
    connectButtonBackground: '#FF914D',
    connectButtonBackgroundError: '#FF5E5E',
    connectButtonInnerBackground: '#FFF8F2',
    connectButtonText: '#ffffff',
    connectButtonTextError: '#ffffff',
    connectionIndicator: '#FF914D',
    downloadBottomCardBackground: '#FFF2E6',
    downloadTopCardBackground: '#FFDBB5',
    error: '#FF4D4F',
    generalBorder: '#FFD0A3',
    generalBorderDim: '#FFE2C5',
    menuItemBackground: '#FFF8F2',
    modalBackdrop: 'rgba(255, 229, 204, 0.6)',
    modalBackground: '#FFFFFF',
    modalBorder: '#FFDBB5',
    modalText: '#1a1a1a',
    modalTextDim: '#666666',
    modalTextSecondary: '#FF914D',
    profileAction: '#FFF2E6',
    profileActionHover: '#FFDBB5',
    profileForeground: '#FFF2E6',
    selectedOptionBorder: '#FF914D',
    standby: '#FFD699',
  },
  fonts: {
    body: '"", , ', // gaya playful
  },
  radii: {
    actionButton: '16px',
    connectButton: '16px',
    menuButton: '12px',
    modal: '20px',
    modalMobile: '16px',
  },
  shadows: {
    connectButton: '0 2px 10px rgba(255, 145, 77, 0.3)',
    dialog: '0 2px 20px rgba(255, 145, 77, 0.2)',
    profileDetailsAction: 'inset 0 1px 2px rgba(0,0,0,0.05)',
    selectedOption: '0 0 0 1px #FF914D',
    selectedWallet: '0 0 0 1px #FF914D',
    walletLogo: '0 1px 3px rgba(0,0,0,0.1)',
  },
}

// 1. Project ID dari WalletConnect
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || ''
if (!projectId) throw new Error('NEXT_PUBLIC_PROJECT_ID')

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [trustWallet,rainbowWallet, walletConnectWallet,injectedWallet,],
    },
  ],
  {
    appName: 'Nekoswap',
    projectId: 'f79a38e56bf80c47e010dc510d552243',
  }
);


// 2. Wagmi + RainbowKit Config
export const config = createConfig({
  chains: [mainnet, base,polygon,bsc,cronos,sonic],
  connectors,
  transports: {
    [mainnet.id]: http(),
    [sonic.id]: http(),
    [cronos.id]: http(),
    [base.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http(),
  },
} )

// 3. React Query Client
const queryClient = new QueryClient()

// 4. Wrapper Provider
export default function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider

        coolMode
          modalSize="compact"
        theme={nekoTheme}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}