import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Stack, Typography, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

interface Updateprops {
  view: (newvalue: boolean) => void;
  companyName: string;
  onCompanyNameChange: React.Dispatch<React.SetStateAction<string>>;
  companySize: number;
  onCompanySizeChange: React.Dispatch<React.SetStateAction<number>>;
  email: string;
  onEmailChange: React.Dispatch<React.SetStateAction<string>>;
  averageMonthlyVolume: string;
  onaverageMonthlyVolume: React.Dispatch<React.SetStateAction<string>>;
}
const Intro: React.FC<Updateprops> = ({
  view,
  companyName,
  onCompanyNameChange,
  companySize,
  onCompanySizeChange,
  email,
  onEmailChange,
  averageMonthlyVolume,
  onaverageMonthlyVolume,
}) => {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const averageMonthlyVolumeOptions = [
    {
      value: 'Less than 10.000',
    },
    {
      value: 'More than 10.000  ',
    },
    {
      value: 'No idea',
    },
  ];

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
            <OutlinedInput
              sx={{
                borderColor: 'grey',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
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
            <OutlinedInput
              placeholder="Please enter text"
              sx={{
                borderColor: 'grey',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
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
            <OutlinedInput
              sx={{
                borderColor: 'grey',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
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
              id="outlined-select-currency-native"
              select
              SelectProps={{
                native: true,
              }}
              onChange={(event) => {
                onaverageMonthlyVolume(event.target.value);
              }}
              value={averageMonthlyVolume}
            >
              {averageMonthlyVolumeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
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
                '&:hover': {
                  borderColor: '#EE814D',
                  borderWidth: '2px',
                  borderStyle: 'solid',
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
