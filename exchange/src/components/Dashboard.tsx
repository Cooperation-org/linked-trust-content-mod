import { Box, Typography } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { ethers } from 'ethers';
import { useState } from 'react';
import { useAccount, useChainId, useSigner, useSwitchNetwork } from 'wagmi';

import { RoundedBox } from './RoundedBox';

import JobDashboard from './JobDashboard';
import { Escrow } from './Escrow';
import { useAuth } from 'src/hooks/auth';

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

export const Dashboard = ({}) => {
  const { id, role } = useAuth();
  const { address } = useAccount();

  const [isLoading, setIsLoading] = useState(false);

  // material ui basic table
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  // end
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            position: 'fixed',
            left: '0%',
            top: 0,
            padding: '1rem',
            background: 'white',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 20,
          }}
        >
          <Tabs value={value} onChange={handleChange} aria-label="tabs">
            <Tab
              label="DASHBOARD"
              {...a11yProps(0)}
              sx={{ fontWeight: 'bold' }}
            />
            <Tab
              label="Escrow"
              {...a11yProps(1)}
              sx={{ margin: '0 4rem', fontWeight: 'bold' }}
            />
          </Tabs>
        </Box>
        <Box display="flex" justifyContent="center">
          <TabPanel value={value} index={0}>
            <section className="flex items-center justify-center absolute top-10 left-0   w-full ">
              <div className="mx-[2rem] rounded-[20px] w-full mt-[80px] p-[4rem]">
                <JobDashboard />
              </div>
            </section>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Escrow />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <div className="flex items-center justify-center absolute top-0 left-0   w-full ">
              <div className=" bg-[#f6f7fe] mx-[2rem] rounded-[20px] w-full min-h-[100vh] mt-[80px] p-[4rem]">
                <h2 className="text-3xl font-bold mb-[1rem]">API KEY</h2>
              </div>
            </div>
          </TabPanel>
        </Box>
      </Box>
    </>
  );
};
