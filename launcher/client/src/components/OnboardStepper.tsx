import React, { useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import { Step, Stepper, StepLabel, Button, Box, StepConnector } from '@mui/material';
import Onboard2 from './Onboard2';

const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

function getStepContent(step: number): any {
  switch (step) {
    case 0:
      return <Onboard2 />;
    case 1:
      return 'Step 2 Content...';
    case 2:
      return 'Step 3 Content...';
    default:
      return 'Unknown step';
  }
}

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      background: ' #4169E1',
      border:'#4169E1'
    },
  },
  line: {
    height: 5,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: '10px',
    width:'50%',
    margin:'0.2rem auto'
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    background: ' #4169E1',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    background: ' #4169E1',
  },
});

function ColorlibStepIcon(props: {completed: boolean, active: boolean, icon: React.ReactNode}) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={`${classes.root} ${active ? classes.active : ''} ${completed ? classes.completed : ''}`}
    >
     
    </div>
  );
}

export default function CustomStepper() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
 
   <div style={{position:'relative'}} >
     <Box sx={{ width: '50%',padding:"2rem",paddingBottom:0,border:'1px solid #4169E1', margin:'auto',marginTop:'6rem', borderRadius:'10px' }}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2 }}>
        {getStepContent(activeStep)}
       
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleReset}
            sx={{display:'none'}}
          >
            Reset
          </Button>
        <div style={{position:'absolute',left:0, width:'100%',display:'flex', padding:'1rem',alignItems:'center', justifyContent:'center'}}>
        <Button
            variant="contained"
            color="primary"
            onClick={handleNext}

          sx={{
            background: "#007aff",
            color: "white",
            padding: "0.5rem 3rem",
            "&:hover": {
              borderColor: "#007aff",
              borderWidth: "2px",
              borderStyle: "solid",
              color: "#007aff",
            },
           
          }}
          >
            {activeStep === steps.length - 1? 'Go to dashboard': 'Next'}
          </Button>
        </div>
        </Box>
      </Box>
    </Box>
   </div>
  );
}