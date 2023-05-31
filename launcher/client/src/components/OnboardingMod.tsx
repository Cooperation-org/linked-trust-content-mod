import React from 'react'
import Box from "@mui/material/Box";
import OnboardNav from './OnboardNav';
import Onboard1 from './Onboard1';
import HorizontalNonLinearStepper from './OnboardStepper';

const OnboardingMod = () => {
  
      return (
        <Box sx={{ height: "100vh", background: "white" }}>
         <OnboardNav />
           <Onboard1 />
           {/* <HorizontalNonLinearStepper /> */}
        </Box>
      );
    };
    
export default OnboardingMod