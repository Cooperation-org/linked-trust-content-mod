import { Box, Button, Typography } from '@mui/material';
import { RoundedBox } from './RoundedBox';
import WalletModal from './WalletModal';
import { FundingMethodType } from './types';
import { useMetamaskLogin } from 'src/hooks/useMetamaskLogin';

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

  const {
    walletModalOpen,
    handleClickCrypto,
    handleSignInWithNonce,
    setWalletModalOpen,
    isConnected,
  } = useMetamaskLogin({
    onSuccess,
    onError,
    onLogin,
  });

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
              Sign in
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2.5, minWidth: '200px' }}
              onClick={() => handleSignInWithNonce()}
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
