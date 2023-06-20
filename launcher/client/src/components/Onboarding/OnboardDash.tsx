import React from 'react';
import Box from '@mui/material/Box';
import OnboardNav from './OnboardNav';
import { Stack } from '@mui/material';
import inbound1 from '../../assets/imagen 10.png';
import inbound2 from '../../assets/imagen 5.png';
import inbound3 from '../../assets/imagen 14.png';
import Button from '@mui/material/Button';

const OnboardDash = () => {
  const name = '[Project Name] ';
  const inbound = [
    inbound1,
    inbound2,
    inbound3,
    inbound3,
    inbound3,
    inbound3,
    inbound3,
  ];
  return (
    <div>
      <Box sx={{ height: '100vh', background: 'white' }}>
        <OnboardNav />
        <div style={{ marginTop: '5rem' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '2rem',
            }}
          >
            <p
              style={{ color: '#EE814D', fontWeight: 'bold', fontSize: '25px' }}
            >
              {' '}
              {name} dashboard
            </p>
            <Button
              sx={{
                background: '#EE814D',
                borderRadius: '10px',
                padding: '0.5rem 2.5rem',
                color: 'white',
                '&:hover': {
                  borderColor: '#EE814D',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  color: '#EE814D',
                },
              }}
            >
              Add more funds
            </Button>
          </Box>
          <p
            style={{
              color: 'black',
              fontWeight: 'bold',
              margin: '0.5rem 4rem',
            }}
          >
            Escrow balance $500
          </p>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginBottom: '4rem',
            }}
          >
            <div>
              <p
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                }}
              >
                Inbound (26)
              </p>
              <Box
                sx={{
                  height: 400,
                  width: 300,
                  backgroundColor: 'rgba(65, 105, 225, 0.1)',
                  border: '1px solid #4169E1',
                  borderRadius: '10px',
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '10px',
                    padding: '0.4rem',
                  },
                  '&::-webkit-scrollbar-track': {
                    margin: '0.5rem',
                    background: '#D9D9D9',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#888888',
                    borderRadius: '10px',
                  },
                }}
              >
                {inbound.map((item, index) => (
                  <div
                    key={index}
                    style={{ width: '90%', margin: '0.7rem auto' }}
                  >
                    <img src={item} alt="" />
                  </div>
                ))}
              </Box>
            </div>
            <div>
              <p
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                }}
              >
                No Risk (1000)
              </p>
              <Box
                sx={{
                  height: 400,
                  width: 300,
                  backgroundColor: 'rgba(50, 205, 50, 0.1);',
                  border: '1px solid #32CD32',
                  borderRadius: '10px',
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '10px',
                    padding: '0.4rem',
                  },
                  '&::-webkit-scrollbar-track': {
                    margin: '0.5rem',
                    background: '#D9D9D9',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#888888',
                    borderRadius: '10px',
                  },
                }}
              >
                {inbound.map((item, index) => (
                  <div
                    key={index}
                    style={{ width: '90%', margin: '0.7rem auto' }}
                  >
                    <img src={item} alt="" />
                  </div>
                ))}
              </Box>
            </div>
            <div>
              <p
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                }}
              >
                Risk (400)
              </p>
              <Box
                sx={{
                  height: 400,
                  width: 300,
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 0, 0, 0.8)',
                  borderRadius: '10px',
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '10px',
                    padding: '0.4rem',
                  },
                  '&::-webkit-scrollbar-track': {
                    margin: '0.5rem',
                    background: '#D9D9D9',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#888888',
                    borderRadius: '10px',
                  },
                }}
              >
                {inbound.map((item, index) => (
                  <div
                    key={index}
                    style={{ width: '90%', margin: '0.7rem auto' }}
                  >
                    <img src={item} alt="" />
                  </div>
                ))}
              </Box>
            </div>
          </Stack>
        </div>
      </Box>
    </div>
  );
};

export default OnboardDash;
