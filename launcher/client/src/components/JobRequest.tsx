import HMTokenABI from '@human-protocol/core/abis/HMToken.json';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import axiosInstance from './../config/axiosInterceptor';
import { ethers } from 'ethers';
import { useState, useContext } from 'react';
import { useAccount, useChainId, useSigner, useSwitchNetwork } from 'wagmi';
import {
  ChainId,
  ESCROW_NETWORKS,
  HM_TOKEN_DECIMALS,
  SUPPORTED_CHAIN_IDS,
} from '../constants';
// import RandomKey from './APIKey';
import { RoundedBox } from './RoundedBox';
import { FortuneJobRequestType, JobLaunchResponse, TabsTypes } from './types';
// import { FortuneJobRequest } from '.';
import Dashboard from './Dashboard';
import { useAuth } from 'src/hooks/auth';
import { AppContext } from 'src/state';
import { goToTab } from 'src/state/actions';

type JobRequestProps = {
  onBack: () => void;
  onLaunch: () => void;
  onSuccess: (response: JobLaunchResponse) => void;
  onFail: (message: string) => void;
};
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const JobRequest = ({
  onBack,
  onLaunch,
  onSuccess,
  onFail,
}: JobRequestProps) => {
  const { id, role } = useAuth();
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const chainId = useChainId();
  const { switchNetwork } = useSwitchNetwork();

  const [jobRequest, setJobRequest] = useState<FortuneJobRequestType>({
    chainId: SUPPORTED_CHAIN_IDS.includes(ChainId.LOCALHOST)
      ? ChainId.LOCALHOST
      : SUPPORTED_CHAIN_IDS.includes(ChainId.POLYGON_MUMBAI)
      ? ChainId.POLYGON_MUMBAI
      : SUPPORTED_CHAIN_IDS[0],
    name: '',
    description: '',
    token: '',
    fundedAmt: '',
    jobRequester: '',
    guidelineUrl: 'https://corporation.org',
    creatorId: id,
    funded: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleJobRequestFormFieldChange = (
    fieldName: keyof FortuneJobRequestType,
    fieldValue: any
  ) => {
    // todo check string and number validity
    const regex = /^[0-9\b]+$/;
    //if (fieldName !== 'fortunesRequired') {
    setJobRequest({ ...jobRequest, [fieldName]: fieldValue });
    // } else if (regex.test(fieldValue) || fieldValue === '') {
    //  setJobRequest({ ...jobRequest, [fieldName]: fieldValue });
    // }
  };

  const handleLaunch = async () => {
    if (!signer || !address) return;

    if (chainId !== jobRequest.chainId) {
      switchNetwork?.(jobRequest.chainId);
      return;
    }

    setIsLoading(true);
    const data: FortuneJobRequestType = {
      ...jobRequest,
      jobRequester: address,
      token: ESCROW_NETWORKS[jobRequest.chainId as ChainId]?.hmtAddress!,
    };

    try {
      const contract = new ethers.Contract(data.token, HMTokenABI, signer);
      const jobLauncherAddress = process.env.REACT_APP_JOB_LAUNCHER_ADDRESS;
      if (!jobLauncherAddress) {
        alert('Job Launcher address is missing');
        setIsLoading(false);
        return;
      }
      const balance = await contract.balanceOf(address);

      const fundAmount = ethers.utils.parseUnits(
        data.fundedAmt,
        HM_TOKEN_DECIMALS
      );
      if (balance.lt(fundAmount)) {
        throw new Error('Balance not enough for funding the escrow');
      }
      const allowance = await contract.allowance(address, jobLauncherAddress);

      if (allowance.lt(fundAmount)) {
        const tx = await contract.approve(jobLauncherAddress, fundAmount);
        const receipt = await tx.wait();
      }
      onLaunch();
      const result = await axiosInstance.post('/api/groups', data);
      // onSuccess(result.data);
      onSuccess({ escrowAddress: result.data.id, exchangeUrl: '' });
    } catch (err: any) {
      console.log(err);
      if (err.name === 'AxiosError') onFail(err.response.data);
      else onFail(err.message);
    }

    setIsLoading(false);
  };

  const {
    state: { activeTab },
    dispatch,
  } = useContext(AppContext);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newActiveTab: number
  ) => {
    event.preventDefault();
    dispatch(goToTab(newActiveTab));
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            position: 'fixed',
            left: 0,
            top: 0,
            padding: '1rem',
            background: 'white',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 20,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="Dashboard" {...a11yProps(0)} />
            <Tab
              label="Request a new group"
              {...a11yProps(1)}
              sx={{ margin: '0 4rem' }}
            />
            {/* It should be popup or in group settings */}
            {/* <Tab
              label="REQUEST A NEW API KEY"
              {...a11yProps(2)}
              sx={{ fontWeight: 'bold' }}
            /> */}
            {role !== 'jobCreator' && (
              <Tab
                label="Worker DASHBOARD"
                {...a11yProps(0)}
                sx={{ fontWeight: 'bold' }}
              />
            )}
          </Tabs>
        </Box>
        <TabPanel value={activeTab} index={TabsTypes.DASHBOARD}>
          <Box>
            <Dashboard />
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={TabsTypes.REQUEST_A_GROUP}>
          <RoundedBox sx={{ p: '50px 140px' }}>
            <Typography variant="body2" color="primary" mb={4}>
              Group Setup
            </Typography>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                }}
              >
                <FormControl sx={{ minWidth: 240 }} size="small">
                  <InputLabel>Network</InputLabel>
                  <Select
                    label="Network"
                    variant="outlined"
                    value={jobRequest.chainId}
                    name="chainId"
                    onChange={(e) =>
                      handleJobRequestFormFieldChange(
                        'chainId',
                        Number(e.target.value)
                      )
                    }
                  >
                    {SUPPORTED_CHAIN_IDS.map((chainId) => (
                      <MenuItem key={chainId} value={chainId}>
                        {ESCROW_NETWORKS[chainId]?.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Grid container sx={{ width: '100%' }} spacing={3}>
                  <Grid item xs={12} sm={12} md={6}>
                    <FormControl fullWidth>
                      <TextField
                        autoFocus
                        label="Project Name"
                        name="name"
                        value={jobRequest.name}
                        onChange={(e) =>
                          handleJobRequestFormFieldChange(
                            'name',
                            e.target.value
                          )
                        }
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <FormControl fullWidth>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    label="Group Description"
                    name="description"
                    placeholder="Please provide information about your group and the type of content to be moderated, i.e., text, images, videos, live chat, and feeds of specific social handles."
                    value={jobRequest.description}
                    minRows={4}
                    maxRows={4}
                    multiline
                    onChange={(e) =>
                      handleJobRequestFormFieldChange(
                        'description',
                        e.target.value
                      )
                    }
                  />
                </FormControl>
              </Box>
              <Box
                sx={{
                  borderRadius: '10px',
                  background: '#fbfbfe',
                  px: 2.5,
                  py: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Typography variant="body2" color="primary">
                  Funds
                </Typography>
                <Box>
                  <Typography variant="caption" color="primary" sx={{ mb: 1 }}>
                    Token
                  </Typography>
                  <RoundedBox sx={{ p: 2 }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color="primary"
                    >
                      {
                        ESCROW_NETWORKS[jobRequest.chainId as ChainId]
                          ?.hmtAddress
                      }
                    </Typography>
                  </RoundedBox>
                </Box>
                <FormControl>
                  <FormControl>
                    <InputLabel>Amount</InputLabel>
                    <OutlinedInput
                      startAdornment={
                        <InputAdornment position="start">
                          <Typography color={'primary'} variant="body2">
                            HMT
                          </Typography>
                        </InputAdornment>
                      }
                      label="Amount"
                      value={jobRequest.fundedAmt}
                      onChange={(e) =>
                        handleJobRequestFormFieldChange(
                          'fundedAmt',
                          e.target.value
                        )
                      }
                    />
                  </FormControl>
                </FormControl>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                mt: 8,
              }}
            >
              <Box sx={{ display: 'flex', gap: '2%' }}>
                <Button
                  variant="outlined"
                  sx={{ minWidth: '240px', py: 1 }}
                  onClick={onBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  sx={{ minWidth: '240px', py: 1 }}
                  onClick={handleLaunch}
                  disabled={isLoading}
                >
                  {isLoading && <CircularProgress size={24} sx={{ mr: 1 }} />}{' '}
                  Fund and Request Group
                </Button>
              </Box>
            </Box>
          </RoundedBox>
        </TabPanel>
      </Box>
    </>
  );
};
