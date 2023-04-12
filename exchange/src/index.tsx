import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import { wagmiClient } from './connectors/connectors';
import './index.css';
import reportWebVitals from './reportWebVitals';
import AuthProvider from './hooks/auth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import theme from './theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <AuthProvider>
    <BrowserRouter>
      <WagmiConfig client={wagmiClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
        </ThemeProvider>
      </WagmiConfig>
    </BrowserRouter>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
