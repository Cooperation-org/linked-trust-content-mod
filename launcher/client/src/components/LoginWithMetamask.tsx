import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork, useSignMessage, useConnect } from 'wagmi';
import { SiweMessage } from 'siwe';
import { RoundedBox } from './RoundedBox';
import WalletModal from './WalletModal';
import axiosInstance from './../config/axiosInterceptor';
import { FundingMethodType } from './types';
import { useAuth } from 'src/hooks/auth';

export function LoginWithMetamask({
  onSuccess,
  onError,
  onLogin,
}: {
  onSuccess: (args: { address: string }) => void;
  onError: (args: { error: Error }) => void;
  onLogin: (methodType: FundingMethodType) => void;
}) {
  //this state gets a random nonce from the backend server

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
    if (address) {
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
      onSuccess({ address });
      onLogin('crypto');
    } catch (error) {
      setState((x) => ({ ...x, loading: false, nonce: undefined }));
      onError({ error: error as Error });
      fetchNonce(address);
    }
  };
  const handleClickCrypto = async () => {
    if (isConnected) {
      setShowSignBtn(true);
      await connectWallet();
    } else {
      setWalletModalOpen(true);
    }
  };

  return (
    <>
      <RoundedBox sx={{ p: 3, display: 'flex', gap: 3 }}>
        {!isConnected ? (
          <Box
            sx={{
              width: '100%',
              background: '#fbfbfe',
              borderRadius: '10px',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexDirection: 'column',
              py: 8,
            }}
          >
            <img src="/images/fortune-crypto.png" alt="crypto" />
            <Typography variant="body2" color="primary" mt={8}>
              Click to connect your wallet
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2.5, minWidth: '200px' }}
              onClick={handleClickCrypto}
            >
              Connect
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              width: '100%',
              background: '#fbfbfe',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexDirection: 'column',
              py: 8,
            }}
          >
            <img src="/images/fortune-fiat.png" alt="fiat" />
            <Typography variant="body2" color="primary" mt={8}>
              Sign
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2.5, minWidth: '200px' }}
              onClick={handleClickCrypto}
            >
              Continue
            </Button>
          </Box>
        )}
      </RoundedBox>
      <WalletModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </>
  );
}
