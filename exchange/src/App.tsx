import {
  useWeb3ModalTheme,
  Web3Button,
  Web3Modal,
  Web3NetworkSwitch,
} from '@web3modal/react';
import { useAccount } from 'wagmi';
import { ethereumClient, projectId } from './connectors/connectors';
import { LoginWithMetamask } from './components/LoginWithMetamask';
import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './hooks/auth';
import { Box, Grid, Link, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    background: theme.palette.error.main,
    color: theme.palette.common.white,
    width: theme.spacing(8),
    height: theme.spacing(8),
    borderRadius: '50%',
    border: '1px solid purple',
    position: 'fixed',
    top: '2%',

    '&:hover': {
      background: theme.palette.error.dark,
    },
  },
}));

function App() {
  const { setTheme } = useWeb3ModalTheme();
  const { isConnected, isDisconnected } = useAccount();
  const { id, logout } = useAuth();
  const [state, setState] = useState<{
    address?: string;
    error?: Error;
    loading?: boolean;
  }>({});
  const classes = useStyles();

  setTheme({
    themeColor: 'purple',
    themeMode: 'light',
    themeBackground: 'themeColor',
  });

  const handleDisconnect = () => {
    console.log("User's account disconnected from the network.");
    logout();
  };

  useEffect(() => {
    if (isDisconnected) {
      handleDisconnect();
    }
  }, [isDisconnected]);

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }, pt: 10 }}>
      <Box
        sx={{
          background: '#f6f7fe',
          borderRadius: {
            xs: '16px',
            sm: '16px',
            md: '24px',
            lg: '32px',
            xl: '40px',
          },
          padding: {
            xs: '24px 16px',
            md: '42px 54px',
            lg: '56px 72px',
            xl: '70px 90px',
          },
        }}
      >
        <Grid container spacing={4}>
          {!id && (
            <Grid item xs={12} sm={12} md={5} lg={4}>
              <Typography color="primary" fontWeight={600} variant="h4">
                <a href="https://www.cooperation.org">Cooperation.org</a>
              </Typography>
              <Typography color="primary" fontWeight={500} variant="h6">
                Content Moderation
              </Typography>
              <Typography mt={4} color="primary" variant="body2">
                Content moderation refers to the practice of monitoring
                user-generated content (UGC) on online platforms, such as social
                media websites, forums, and other online communities. The goal
                of content moderation is to ensure that UGC does not violate the
                platform's community guidelines, terms of service, or applicable
                laws.
              </Typography>
              <Link
                href="#"
                sx={{ textDecoration: 'none', mt: 1, display: 'block' }}
              ></Link>
            </Grid>
          )}
          <Grid item xs={12} sm={12} md={id ? 12 : 7} lg={id ? 12 : 7}>
            <Box mt={3}>
              {!isConnected && (
                <>
                  <h1>Select Network</h1>
                  <Web3NetworkSwitch />
                </>
              )}
              {isConnected && !id && (
                <LoginWithMetamask
                  onSuccess={({ address }) =>
                    setState((x) => ({ ...x, address }))
                  }
                  onError={({ error }) => setState((x) => ({ ...x, error }))}
                  onLogin={() => {}}
                />
              )}
              {isConnected && id && <Dashboard />}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {isConnected && (
        <div className="fixed  z-[100] top-[2%] right-[2%] p-[0.5rem] gap-[2%] rounded-[100px] w-[300px] flex justify-end">
          <div className="fixed left-4 top-[1%] p-[0.5rem] w-[250px]  rounded-[100px] text-center">
            {/* <div>Connected to </div> */}
          </div>
          <Web3Button icon="show" />
        </div>
      )}
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </Box>
  );
}

export default App;
