// src/global.d.ts
interface EthereumProvider {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on?: (event: string, callback: (...args: any[]) => void) => void;
    removeListener?: (event: string, callback: (...args: any[]) => void) => void;
  }
  
  interface Window {
    ethereum?: EthereumProvider;
  }
  