import FundInfo from './FundInfo';
import GroupInfo from './GroupInfo';
import HooksAndKeysInfo from './HooksAndKeysInfo';
import React, { useState, useCallback } from 'react';
import { Stepper, Step, StepLabel, Button, Box } from '@mui/material';

const steps = ['groupinfo', 'fundinfo', 'webhooks'];

const OnboardingSteps: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleGoToNextStep = useCallback(() => {
    if (activeStep !== steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  }, [activeStep]);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Box
        sx={{
          width: '50%',
          padding: '2rem',
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
              <div>
                {activeStep === 0 && (
                  <GroupInfo onGoToNextStep={handleGoToNextStep} />
                )}
                {activeStep === 1 && (
                  <FundInfo onGoToNextStep={handleGoToNextStep} />
                )}
                {activeStep === 2 && <HooksAndKeysInfo />}
              </div>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  style={{ display: 'none' }}
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </Box>
    </div>
  );
};

export default OnboardingSteps;
