import { useState } from 'react';
import Box from '@mui/material/Box';
import OnboardNav from './OnboardNav';
import Intro from './Intro';
import CustomStepper from './OnboardSteps';

const avgMonthlyVolumeOptions = [
  'Less than 10.000',
  'More than 10.000',
  'No idea',
];

const OnboardingMod = () => {
  const [showcontent, setshowcontent] = useState<boolean>(false);
  function contentview(newvalue: boolean) {
    setshowcontent(newvalue);
  }

  const [companyName, setCompanyName] = useState('');
  const [companySize, setCompanySize] = useState(0);
  const [email, setEmail] = useState('');
  const [avgMonthlyVolume, setAvgeMonthlyVolume] = useState(
    avgMonthlyVolumeOptions[0]
  );

  return (
    <Box
      sx={{
        height: '100vh',
        background: 'white',
      }}
    >
      <OnboardNav />
      {showcontent && (
        <CustomStepper
          avgMonthlyVolume={avgMonthlyVolume}
          companyName={companyName}
          companySize={companySize}
          companyEmail={email}
        />
      )}
      {!showcontent && (
        <Intro
          companyName={companyName}
          onCompanyNameChange={setCompanyName}
          companySize={companySize}
          onCompanySizeChange={setCompanySize}
          email={email}
          onEmailChange={setEmail}
          avgMonthlyVolume={avgMonthlyVolume}
          onAvgMonthlyVolume={setAvgeMonthlyVolume}
          view={contentview}
          avgMonthlyVolumeOptions={avgMonthlyVolumeOptions}
        />
      )}
    </Box>
  );
};

export default OnboardingMod;
