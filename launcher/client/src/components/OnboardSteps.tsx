import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Box } from '@mui/material';
import Onboard2 from './Onboard2';
import Onboard3 from './Onboard3';
import Onboard4 from './Onboard4';
import { Link } from 'react-router-dom';

const steps = ['', '', ''];

const CustomStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

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
                   <Link to='/onboarddash'>
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
                      onClick={handleNext}
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
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Box>
    </div>
  );
};

export default CustomStepper;
