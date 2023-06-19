import React from 'react';
import StyledInput from './StyledInput';
import {
  Box,
  FormControl,
  TextField,
  Checkbox,
  Stack,
  Typography,
  Button,
  FormControlLabel,
} from '@mui/material';

interface Updateprops {
  view: (newvalue: boolean) => void;
  email: string;
  onEmailChange: React.Dispatch<React.SetStateAction<string>>;
  companyName: string;
  onCompanyNameChange: React.Dispatch<React.SetStateAction<string>>;
  companySize: number;
  onCompanySizeChange: React.Dispatch<React.SetStateAction<number>>;
  avgMonthlyVolume: string;
  onAvgMonthlyVolume: React.Dispatch<React.SetStateAction<string>>;
  avgMonthlyVolumeOptions: string[];
}

const Intro: React.FC<Updateprops> = ({
  view,
  companyName,
  onCompanyNameChange,
  companySize,
  onCompanySizeChange,
  email,
  onEmailChange,
  avgMonthlyVolume,
  onAvgMonthlyVolume,
  avgMonthlyVolumeOptions,
}) => {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div
      style={{
        background: 'rgba(238, 129, 77, 0.05)',
        color: 'black',
        padding: '2rem',
        border: '1px solid #EE814D',
        margin: ' 5rem auto',
        width: '55%',
        borderRadius: '10px',
      }}
    >
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ paddingBottom: '0' }}
      >
        <div
          style={{
            textAlign: 'center',
            width: '80%',
            margin: 'auto',
            marginBottom: '2rem',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: '30px',
              marginBottom: '1rem',
              color: '#EE814D',
              fontWeight: 'bold',
            }}
          >
            5 Minutes to Moderation
          </Typography>
          <Typography sx={{ color: 'black' }}>
            Fill out this short form to provide your details and set your
            moderation feed Get started now! checklist: (what you need to get
            started now) *Metamask account * add whatever else they will need
          </Typography>
        </div>

        <Stack
          direction="column"
          spacing={2}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            alignItems: 'center',
            justifyContent: 'space-between',
            // :'center',
            marginBottom: '4rem',
            gap: 4,
          }}
        >
          <FormControl sx={{ width: '100%' }}>
            <label htmlFor="" style={{ fontSize: '14px' }}>
              Company Name <span style={{ color: 'red' }}>*</span>
            </label>
            <StyledInput
              value={companyName}
              onChange={(event) => {
                onCompanyNameChange(event.currentTarget.value);
              }}
            />
          </FormControl>
          <FormControl sx={{ width: '100%' }} style={{ marginTop: 0 }}>
            <label htmlFor="" style={{ fontSize: '14px' }}>
              Company Size <span style={{ color: 'red' }}>*</span>
            </label>
            <StyledInput
              placeholder="Please enter text"
              sx={{
                borderColor: 'grey',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
              type="number"
              value={companySize}
              onChange={(event) => {
                onCompanySizeChange(Number(event.currentTarget.value));
              }}
            />
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <label htmlFor="" style={{ fontSize: '14px' }}>
              {' '}
              Email <span style={{ color: 'red' }}>*</span>
            </label>
            <StyledInput
              value={email}
              onChange={(event) => {
                onEmailChange(event.currentTarget.value);
              }}
            />
          </FormControl>
          <FormControl sx={{ width: '100%' }}>
            <label htmlFor="" style={{ fontSize: '14px' }}>
              What is your average monthly volume?
              <span style={{ color: 'red' }}>*</span>
            </label>

            <TextField
              sx={{ background: '#fff' }}
              id="outlined-select-currency-native"
              select
              SelectProps={{
                native: true,
              }}
              onChange={(event) => {
                onAvgMonthlyVolume(event.target.value);
              }}
              value={avgMonthlyVolume}
            >
              {avgMonthlyVolumeOptions.map((optionVal) => (
                <option key={optionVal} value={optionVal}>
                  {optionVal}
                </option>
              ))}
            </TextField>
          </FormControl>
        </Stack>

        <Box sx={{ width: '100%', margin: 'auto' }}>
          <Typography sx={{ fontSize: '14px' }}>
            To start moderating your items in 5-minutes you are required to use
            our Standard Guidelines. These guidelines have been created by
            industry experts and aligns with industry standards.{' '}
            <span style={{ color: '#EE814D', fontWeight: 'bolder' }}>LINK</span>
          </Typography>
          <div style={{ marginBottom: '4rem', marginTop: '1rem' }}>
            <FormControlLabel
              style={{ fontSize: '14px' }}
              control={
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                  sx={{
                    color: '#EE814D',
                    '&.Mui-checked': {
                      color: '#EE814D',
                    },
                  }}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="By clicking this you agree to have your items moderated with our Standard Guidelines."
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button
              sx={{
                background: '#EE814D',
                color: 'white',
                margin: 'auto',
                padding: '0.5rem 3rem',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: 'transparent',
                '&:hover': {
                  borderColor: '#EE814D',
                  color: '#EE814D',
                },
              }}
              onClick={() => view(true)}
            >
              Get Started
            </Button>
          </div>
          <Typography
            sx={{
              fontSize: '14px',
              textAlign: 'center',
              fontWeight: 'bold',
              margin: '2rem 0',
            }}
          >
            By clicking Get Started Now! you agree to our{' '}
            <span style={{ color: '#EE814D', fontWeight: 'bolder' }}>TOS</span>
          </Typography>

          <Typography sx={{ fontSize: '14px' }}>
            Need more customization, custom integration, or custom guidelines?
          </Typography>
          <Typography sx={{ fontSize: '14px', margin: '1rem 0' }}>
            This will require a call with our “Team”
          </Typography>
          <Typography sx={{ fontSize: '14px', margin: '1rem 0' }}>
            Do you need any of the above? Or, confused and don’t know where to
            Start? <br />
            <span style={{ fontWeight: 'bolder' }}>
              Fill out <span style={{ color: '#EE814D' }}>this form </span> and
              we will set up a call and audit of your moderation needs
            </span>
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default Intro;
