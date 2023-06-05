import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Box, Modal } from '@mui/material';
import Onboard2 from './Onboard2';
import Onboard3 from './Onboard3';
import Onboard4 from './Onboard4';
import { Link } from 'react-router-dom';

const steps = ['', '', ''];

const CustomStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false); // State to control modal visibility

  const handleNext = () => {
    setCompletedSteps([...completedSteps, activeStep]);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompletedSteps([]);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    handleNext(); // Call handleNext when closing the modal
  };

  const getStepContent = (step: number): JSX.Element | null => {
    switch (step) {
      case 0:
        return <Onboard2 />;
      case 1:
        return <Onboard3 />;
      case 2:
        return <Onboard4 />;
      default:
        return null;
    }
  };

  const getModalContent = (step: number): JSX.Element => {
    switch (step) {
      case 0:
        return (
          <div>
            <h2>Step 1 Confirmation</h2>
            <p>Confirmation content for Step 1...</p>
          </div>
        );
      case 1:
        return (
          <div>
            <h2>Step 2 Confirmation</h2>
            <p>Confirmation content for Step 2...</p>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Step 3 Confirmation</h2>
            <p>Confirmation content for Step 3...</p>
          </div>
        );
      default:
        return <div></div>;
    }
  };

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
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
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
                      {activeStep === 1 ? 'Open Modal' : 'Next'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Box>
      {/* Modal */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        {/* Modal content */}
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
          <Button onClick={handleModalClose}>Close Modal</Button>
        </div>
      </Modal>
    </div>
  );
};

export default CustomStepper;
