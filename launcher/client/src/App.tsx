import EscrowFactoryABI from '@human-protocol/core/abis/EscrowFactory.json';
import Box from '@mui/material/Box';
import { Grid, Link, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Button from '@mui/material/Button';
import { ethers } from 'ethers';
import React, { useEffect, useState, useContext } from 'react';
import {
  useEnsAvatar,
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
} from 'wagmi';

import {
  FortuneStages,
  LoginWithMetamask,
  FortuneJobRequest,
  FortuneLaunch,
  FortuneLaunchSuccess,
  FortuneLaunchFail,
} from 'src/components';
import {
  LauncherStageStatus,
  FundingMethodType,
  JobLaunchResponse,
  TabsTypes,
} from 'src/components/types';
import { useSigner, useChainId } from 'wagmi';
import { ChainId, ESCROW_NETWORKS } from './constants';
import { useAuth } from './hooks/auth';
import { AppContext } from 'src/state';
import { goToTab } from 'src/state/actions';

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
  const { id, role, logout } = useAuth();
  const [state, setState] = useState<{
    address?: string;
    error?: Error;
    loading?: boolean;
  }>({});
  const classes = useStyles();
  const { data: signer } = useSigner();
  const { address, connector, isConnected, isDisconnected } = useAccount();
  const { data: ensAvatar } = useEnsAvatar({ address });
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [showModal, setShowModal] = useState(false);
  const [lastEscrowAddress, setLastEscrowAddress] = useState('');
  const [status, setStatus] = useState<LauncherStageStatus>(
    LauncherStageStatus.UNAUTHORIZED
  );

  const { dispatch } = useContext(AppContext);

  const [jobResponse, setJobResponse] = useState<JobLaunchResponse>({
    escrowAddress: '',
    exchangeUrl: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showLog, setShowLog] = useState(false);

  const handleChangeStage = (method: FundingMethodType) => {
    setStatus(LauncherStageStatus.GROUP_REQUEST);
  };

  const handleBack = () => {
    setStatus(status > 0 ? status - 1 : 0);
  };

  const handleOnSuccess = (data: JobLaunchResponse) => {
    setJobResponse(data);
    setStatus(LauncherStageStatus.LAUNCH_SUCCESS);
  };

  const handleCreateNewEscrow = () => {
    setJobResponse({ escrowAddress: '', exchangeUrl: '' });
    setStatus(LauncherStageStatus.GROUP_REQUEST);
  };

  const handleGoToJobDashboard = () => {
    dispatch(goToTab(TabsTypes.DASHBOARD));
    setStatus(LauncherStageStatus.GROUP_REQUEST);
  };

  const handleDisConnectWallet = () => {
    disconnect();
    handleLogout();
    setStatus(LauncherStageStatus.UNAUTHORIZED);
  };

  const handleOnError = (message: string) => {
    setErrorMessage(message);
    setStatus(LauncherStageStatus.LAUNCH_FAIL);
  };

  const handleLogout = () => {
    logout();
  };
  const fetchLastEscrow = async (factoryAddress: string | undefined) => {
    if (factoryAddress && signer) {
      const contract = new ethers.Contract(
        factoryAddress,
        EscrowFactoryABI,
        signer
      );
      const address = await contract.lastEscrow();
      setLastEscrowAddress(address);
    }
  };

  useEffect(() => {
    if (id) {
      setStatus(LauncherStageStatus.GROUP_REQUEST);
    } else {
      setStatus(LauncherStageStatus.UNAUTHORIZED);
    }
  }, [id]);

  useEffect(() => {
    fetchLastEscrow(ESCROW_NETWORKS[chainId as ChainId]?.factoryAddress);
  }, [chainId, signer]);

  useEffect(() => {
    if (isDisconnected) {
      handleLogout();
    }
  }, [isDisconnected]);

  const handleDisconnectClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    disconnect();
  };

  return (
    <Box sx={{ px: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 } }}>
      <Box
        sx={{
          background: '#f6f7fe',
          marginTop: '9.375rem',
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
          {status === LauncherStageStatus.UNAUTHORIZED && (
            <Grid item xs={12} sm={12} md={5} lg={4}>
              <Typography color="primary" fontWeight={600} variant="h4">
                <a href="https://repute.social/" target="_blank">
                  Repute.Social
                </a>
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
            </Grid>
          )}
          <Grid
            item
            xs={12}
            sm={12}
            md={status === LauncherStageStatus.UNAUTHORIZED ? 7 : 12}
            lg={status === LauncherStageStatus.UNAUTHORIZED ? 7 : 12}
          >
            <Box mt={3}>
              {status === LauncherStageStatus.UNAUTHORIZED && (
                <LoginWithMetamask
                  onSuccess={({ address }) =>
                    setState((x) => ({ ...x, address }))
                  }
                  onError={({ error }) => setState((x) => ({ ...x, error }))}
                  onLogin={handleChangeStage}
                />
              )}
              {status === LauncherStageStatus.GROUP_REQUEST && (
                <FortuneJobRequest
                  onBack={handleBack}
                  onLaunch={() => setStatus(LauncherStageStatus.LAUNCH)}
                  onSuccess={handleOnSuccess}
                  onFail={handleOnError}
                />
              )}
              {status === LauncherStageStatus.LAUNCH && <FortuneLaunch />}
              {status === LauncherStageStatus.LAUNCH_SUCCESS && (
                <FortuneLaunchSuccess
                  jobResponse={jobResponse}
                  onCreateNewEscrow={handleCreateNewEscrow}
                  onGoToDashboard={handleGoToJobDashboard}
                />
              )}
              {status === LauncherStageStatus.LAUNCH_FAIL && (
                <FortuneLaunchFail
                  message={errorMessage}
                  onBack={() => setStatus(LauncherStageStatus.GROUP_REQUEST)}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
      {isConnected && (
        <div className="fixed  z-[100] top-[2%] right-[2%] p-[0.5rem] gap-[2%] rounded-[100px] w-[300px] flex justify-end">
          <div className="fixed left-4 top-[1%] p-[0.5rem] w-[250px]  rounded-[100px] text-center">
            <div>
              {ensName
                ? `${ensName} (${address})`
                : address?.slice(0, 6) + '...' + address?.slice(-4)}
            </div>
            <div>Connected to {connector?.name}</div>
          </div>
          <Button
            variant="outlined"
            startIcon={<ExitToAppIcon />}
            onClick={() => handleDisConnectWallet()}
          >
            Disconnect
          </Button>
        </div>
      )}
    </Box>
  );
}

export default App;
