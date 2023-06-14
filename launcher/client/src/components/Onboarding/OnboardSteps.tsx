import React, { useState, useCallback } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Modal,
  Stack,
} from '@mui/material';
import GroupInfo from './GroupInfo';
import FundInfo from './FundInfo';
import HooksAndKeysInfo from './HooksAndKeysInfo';
import { Link } from 'react-router-dom';
import { useMetamaskLogin } from '../../hooks/useMetamaskLogin';
import { useAuth } from '../../hooks/auth';
import WalletModal from '../WalletModal';

const steps = ['groupinfo', 'fundinfo', 'webhooks'];

const OnboardingSteps: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  // const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false); // State to control modal visibility
  const { id } = useAuth();

  const {
    walletModalOpen,
    setWalletModalOpen,
    handleClickCrypto,
    isConnected,
  } = useMetamaskLogin({});

  console.log('walletModalOpen', walletModalOpen);

  const handleNext = () => {
    handleModalOpen();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    // setCompletedSteps([]);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    if (activeStep !== steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } // Call handleNext when closing the modal
  };

  const getStepContent = (step: number): JSX.Element | null => {
    switch (step) {
      case 0:
        return <GroupInfo />;
      case 1:
        return <FundInfo />;
      case 2:
        return <HooksAndKeysInfo />;
      default:
        return null;
    }
  };

  const getModalContent = useCallback((step: number): JSX.Element => {
    switch (step) {
      case 0:
        return (
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
              in order to create an organisation you need to connect a wallet
              and authenticate it off chain{' '}
              <b> by signing a standard message</b>{' '}
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
                <li style={{ marginBottom: '1rem' }}>
                  Select your wallet address
                </li>
                <li>sign in with your wallet address</li>
              </ol>
              <div>
                <Button
                  variant="contained"
                  sx={{
                    background: '#EE814D',
                    padding: '0.5rem 2rem',
                    '&:hover': {
                      borderColor: '#EE814D',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      background: 'white',
                      color: '#EE814D',
                    },
                  }}
                  disabled={isConnected}
                  onClick={handleClickCrypto}
                >
                  Connect
                </Button>
                <br />
                <Button
                  variant="contained"
                  sx={{
                    padding: '0.5rem 2.2rem',
                    borderColor: '#EE814D',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    background: 'white',
                    color: '#EE814D',
                    margin: '1rem 0',
                    '&:hover': {
                      borderColor: '#EE814D',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      background: 'white',
                      color: '#EE814D',
                    },
                    '&:disabled': {
                      border: 'none',
                    },
                  }}
                  disabled={Boolean(id)}
                  onClick={handleClickCrypto}
                >
                  Sign In
                </Button>
              </div>
            </Stack>
            <WalletModal
              open={walletModalOpen}
              // open={true}
              onClose={() => setWalletModalOpen(false)}
            />
          </Box>
        );
      case 1:
        return (
          <div style={{ textAlign: 'center', width: '60%', margin: 'auto' }}>
            <h2
              style={{
                fontSize: '25px',
                color: 'black',
                fontWeight: 'bold',
                marginBottom: '2rem',
              }}
            >
              Are you sure you want to add XYZ Fund Amount
            </h2>

            <Button
              variant="contained"
              sx={{
                padding: '0.5rem 2.2rem',
                borderColor: '#EE814D',
                borderWidth: '2px',
                borderStyle: 'solid',
                background: 'white',
                color: '#EE814D',
                margin: '1rem 0',
                '&:hover': {
                  borderColor: '#EE814D',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  background: 'white',
                  color: '#EE814D',
                },
              }}
              onClick={handleModalClose}
            >
              {' '}
              Continue
            </Button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Step 3 Confirmation</h2>
            <p>Confirmation content for Step 3...</p>

            <Button onClick={handleModalClose}>Close Modal</Button>
          </div>
        );
      default:
        return <div></div>;
    }
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <Box
        sx={{
          width: '50%',
          padding: '2rem',
          paddingBottom: 0,
          background: 'rgba(238, 129, 77, 0.05)',
          border: '1px solid #EE814D',
          margin: 'auto',
          marginTop: '6rem',
          borderRadius: '10px',
        }}
      >
        <Stepper
          sx={{ marginBottom: '20px' }}
          activeStep={activeStep}
          alternativeLabel
        >
          {steps.map((step) => (
            <Step key={step}>
              <StepLabel />
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <p>All steps completed - you're finished!</p>
              <Button onClick={handleReset}>Reset</Button>
            </div>
          ) : (
            <div>
              <div>{getStepContent(activeStep)}</div>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  style={{ display: 'none' }}
                >
                  Back
                </Button>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  {activeStep === steps.length - 1 ? (
                    <Link to="/onboarddash">
                      <Button
                        variant="contained"
                        sx={{
                          background: '#EE814D',
                          padding: '0.5rem 3rem',
                          '&:hover': {
                            borderColor: '#EE814D',
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            background: 'white',
                            color: '#EE814D',
                          },
                        }}
                      >
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={activeStep === 1 ? handleModalOpen : handleNext}
                      sx={{
                        background: '#EE814D',
                        padding: '0.5rem 3rem',
                        '&:hover': {
                          borderColor: '#EE814D',
                          borderWidth: '2px',
                          borderStyle: 'solid',
                          background: 'white',
                          color: '#EE814D',
                        },
                      }}
                    >
                      next
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Box>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            background: 'white',
            padding: '2rem',
          }}
        >
          {getModalContent(activeStep)}
        </div>
      </Modal>
    </div>
  );
};

export default OnboardingSteps;
