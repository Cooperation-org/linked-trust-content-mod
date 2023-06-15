import { useEffect, useState } from 'react';
import { useAuth } from './auth';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';
import axiosInstance from './../config/axiosInterceptor';
import { SiweMessage } from 'siwe';
import { FundingMethodType } from '../components/types';

export const useMetamaskLogin = ({
  onSuccess,
  onError,
  onLogin,
}: {
  onSuccess?: (args: { address: string }) => void;
  onError?: (args: { error: Error }) => void;
  onLogin?: (methodType: FundingMethodType) => void;
}) => {
  const [state, setState] = useState<{
    loading?: boolean;
    nonce?: string;
  }>({});
  const { login } = useAuth();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [showSignBtn, setShowSignBtn] = useState(false);
  const { isConnected, address } = useAccount();

  const fetchNonce = async (address: any) => {
    try {
      const nonceRes = await axiosInstance.post('/api/auth/nonce', { address });
      const data = nonceRes.data;
      setState((x) => ({ ...x, nonce: data.nonce }));
    } catch (error) {
      setState((x) => ({ ...x, error: error as Error }));
    }
  };

  // Pre-fetch random nonce when button is rendered
  // to ensure deep linking works for WalletConnect
  // users on iOS when signing the SIWE message
  useEffect(() => {
    if (isConnected && address) {
      fetchNonce(address);
    }
    if (isConnected && walletModalOpen) {
      setWalletModalOpen(false);
    }
  }, [isConnected]);

  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const connectWallet = async () => {
    try {
      const chainId = chain?.id;
      if (!address || !chainId) return;

      setState((x) => ({ ...x, loading: true }));
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: `Login to our app using this nonce: ${state.nonce}`,
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: state.nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // Verify signature
      const verifyRes = await axiosInstance.post('/api/auth/login', {
        message,
        signature,
        role: 'jobCreator',
      });

      if (verifyRes.status !== 200) throw new Error('Error verifying message');

      login(verifyRes.data.token);
      setState((x) => ({ ...x, loading: false }));
      if (onSuccess) onSuccess({ address });
      if (onLogin) onLogin('crypto');
    } catch (error) {
      setState((x) => ({ ...x, loading: false, nonce: undefined }));
      if (onError) onError({ error: error as Error });
      fetchNonce(address);
    }
  };

  const handleClickCrypto = async () => {
    if (!isConnected) setWalletModalOpen(true);
  };

  const handleSignInWithNonce = async (
    companyName?: string,
    companySize?: number,
    averageMonthlyVolume?: string
  ) => {
    if (isConnected) {
      setShowSignBtn(true);
      await connectWallet();
    }
  };

  return {
    walletModalOpen,
    setWalletModalOpen,
    handleClickCrypto,
    handleSignInWithNonce,
    showSignBtn,
    isConnected,
  };
};
