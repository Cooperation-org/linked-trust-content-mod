import {
  useWeb3ModalTheme,
  Web3Button,
  Web3Modal,
  Web3NetworkSwitch,
} from '@web3modal/react';
import { useAccount } from 'wagmi';
import './App.css';
import { ethereumClient, projectId } from './connectors/connectors';
import { LoginWithMetamask } from './components/LoginWithMetamask';
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './hooks/auth';

function App() {
  const { setTheme } = useWeb3ModalTheme();
  const { isConnected } = useAccount();
  const { id } = useAuth();
  const [state, setState] = useState<{
    address?: string;
    error?: Error;
    loading?: boolean;
  }>({});

  setTheme({
    themeColor: 'purple',
    themeMode: 'light',
    themeBackground: 'themeColor',
  });

  return (
    <div>
      <div className="App">
        <header className="App-header">
          {isConnected && <Web3Button icon="show" balance="show" />}
        </header>
        <div className="App-body">
          {!isConnected && (
            <>
              <h1>Select Network</h1>
              <Web3NetworkSwitch />
            </>
          )}
          {isConnected && !id && (
            <LoginWithMetamask
              onSuccess={({ address }) => setState((x) => ({ ...x, address }))}
              onError={({ error }) => setState((x) => ({ ...x, error }))}
              onLogin={() => {}}
            />
          )}
          {isConnected && id && <Dashboard />}
        </div>
      </div>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </div>
  );
}

export default App;
