import { useState } from 'react';
import Box from '@mui/material/Box';
import OnboardNav from './OnboardNav';
import Intro from './Intro';
import CustomStepper from './OnboardSteps';

const OnboardingMod = () => {
  const [showcontent, setshowcontent] = useState<boolean>(false);
  function contentview(newvalue: boolean) {
    setshowcontent(newvalue);
  }

  const [companyName, setCompanyName] = useState('');
  const [companySize, setCompanySize] = useState(0);
  const [email, setEmail] = useState('');
  const [averageMonthlyVolume, setAverageMonthlyVolume] = useState('');

  return (
    <Box
      sx={{
        height: '100vh',
        background: 'white',
      }}
    >
      <OnboardNav />
      {showcontent ? (
        <CustomStepper />
      ) : (
        <Intro
          companyName={companyName}
          onCompanyNameChange={setCompanyName}
          companySize={companySize}
          onCompanySizeChange={setCompanySize}
          email={email}
          onEmailChange={setEmail}
          averageMonthlyVolume={averageMonthlyVolume}
          onaverageMonthlyVolume={setAverageMonthlyVolume}
          view={contentview}
        />
      )}
    </Box>
  );
};

export default OnboardingMod;
