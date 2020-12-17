/// <reference types="react-scripts" />

declare module 'fortmatic';

interface Window {
  ethereum?: {
    isMetaMask?: true;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
  };
  web3?: unknown;
}
