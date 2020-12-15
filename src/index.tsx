import React from 'react';
import ReactDOM from 'react-dom';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import App from './pages/App';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './components/Header';
import getLibrary from './utils/getLibrary';

const Web3ProviderNetwork = createWeb3ReactRoot('NETWORK');

if ('ethereum' in window) {
  (window.ethereum as any).autoRefreshOnNetworkChange = false;
}

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Header />
        <App />
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
