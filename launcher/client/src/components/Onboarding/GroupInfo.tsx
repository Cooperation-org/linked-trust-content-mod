import Modal from '../Modal';
import Button from '../Button';
import StyledInput from './StyledInput';
import WalletModal from '../WalletModal';
import { useAuth } from '../../hooks/auth';
import { FC, useState, useCallback } from 'react';
import { Box, Stack, FormControl } from '@mui/material';
import { useMetamaskLogin } from '../../hooks/useMetamaskLogin';

interface GroupInfoProps {
  companyName: string;
  companySize: number;
  companyEmail?: string;
  avgMonthlyVolume: string;
  onGoToNextStep: () => void;
}

const GroupInfo: FC<GroupInfoProps> = ({
  companyEmail = '',
  onGoToNextStep,
  companyName,
  companySize,
  avgMonthlyVolume,
}) => {
  const [groupName, setGroupName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState(companyEmail);

  const [showModal, setShowModal] = useState(false);

  const { id } = useAuth();
  const {
    walletModalOpen,
    setWalletModalOpen,
    handleClickCrypto,
    handleSignInWithNonce,
    isConnected,
  } = useMetamaskLogin({
    onLogin: () => {
      onGoToNextStep();
    },
  });

  const handleGoToNextStep = () => {
    if (!groupName || !contactName || !email) {
      alert('Please fill all the fields');
      return;
    }

    if (isConnected && id) {
      onGoToNextStep();
      return;
    }

    setShowModal(true);
  };

  const handleSignIn = useCallback(async () => {
    await handleSignInWithNonce(
      email,
      companyName,
      companySize,
      avgMonthlyVolume
    );
  }, [
    handleSignInWithNonce,
    email,
    companyName,
    companySize,
    avgMonthlyVolume,
  ]);

  return (
    <Box sx={{ color: 'black' }}>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ padding: '2rem' }}
      >
        <Stack
          direction="column"
          spacing={2}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            gap: 4,
          }}
        >
          <FormControl sx={{ width: '100%' }}>
            <label htmlFor="" style={{ fontSize: '14px' }}>
              Group Name <span style={{ color: 'red' }}>*</span>
            </label>
            <StyledInput
              sx={{
                borderColor: 'grey',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ width: '100%' }} style={{ marginTop: 0 }}>
            <label htmlFor="" style={{ fontSize: '14px' }}>
              Contact Name <span style={{ color: 'red' }}>*</span>
            </label>
            <StyledInput
              placeholder="Please enter text"
              sx={{
                borderColor: 'grey',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <label htmlFor="" style={{ fontSize: '14px' }}>
              {' '}
              Email <span style={{ color: 'red' }}>*</span>
            </label>
            <StyledInput
              sx={{
                borderColor: 'grey',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
        </Stack>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Button onClick={handleGoToNextStep}>Next</Button>
      </Box>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={{ borderRadius: '30px', color: 'black', padding: '1rem' }}>
          <h2
            style={{
              fontSize: '30px',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}
          >
            Authentication
          </h2>
          <p>
            in order to create an organisation you need to connect a wallet and
            authenticate it off chain <b> by signing a standard message</b>{' '}
          </p>
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginTop: '2rem',
            }}
          >
            <ol style={{ listStyle: 'number' }}>
              <li style={{ marginBottom: '1rem' }}>Connect your wallet</li>
              <li>sign in with your wallet</li>
            </ol>
            <div>
              <Button disabled={isConnected} onClick={handleClickCrypto}>
                Connect
              </Button>
              <br />
              <Button disabled={Boolean(id)} onClick={handleSignIn}>
                Sign In
              </Button>
            </div>
          </Stack>
          <WalletModal
            open={walletModalOpen}
            onClose={() => setWalletModalOpen(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default GroupInfo;
