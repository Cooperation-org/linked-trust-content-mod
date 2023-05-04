import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WagmiConfig, createClient, configureChains, Chain } from 'wagmi';
import {
  goerli,
  mainnet,
  polygon,
  polygonMumbai,
  bsc,
  bscTestnet,
  skaleHumanProtocol,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from './theme';
import './global.css';
import AuthProvider from './hooks/auth';
import { AppStateProvider } from './state';

window.Buffer = window.Buffer || require('buffer').Buffer;

const fortune: Chain = {
  id: 1338,
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
};

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(
  [
    goerli,
    mainnet,
    polygon,
    skaleHumanProtocol,
    polygonMumbai,
    bsc,
    bscTestnet,
    fortune,
  ],
  [publicProvider()]
);

const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID;

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    // new CoinbaseWalletConnector({
    //   chains,
    //   options: {
    //     appName: 'wagmi',
    //   },
    // }),
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     showQrModal: true,
    //     projectId: projectId || '',
    //   },
    // }),
  ],
  provider,
  webSocketProvider,
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <AuthProvider>
    <AppStateProvider>
      <BrowserRouter>
        <WagmiConfig client={client}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route path="/" element={<App />} />
            </Routes>
          </ThemeProvider>
          <ToastContainer />
        </WagmiConfig>
      </BrowserRouter>
    </AppStateProvider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
