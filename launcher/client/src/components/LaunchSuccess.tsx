import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { RoundedBox } from './RoundedBox';
import { JobLaunchResponse } from './types';
import { Link } from 'react-router-dom';

type LaunchSuccessProps = {
  jobResponse: JobLaunchResponse;
  onCreateNewEscrow: () => void;
};

export const LaunchSuccess = ({
  jobResponse,
  onCreateNewEscrow,
}: LaunchSuccessProps) => {
  return (
    <RoundedBox sx={{ py: 20, textAlign: 'center' }}>
      <Typography variant="h6" fontWeight={500} color="primary" mb={2}>
        Success!
      </Typography>
      <Typography variant="body2" color="primary">
        Your group has been created
      </Typography>
      <Typography variant="body2" color="primary">
        GroupId: {jobResponse.escrowAddress}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
        <Button
          sx={{ mt: 5, minWidth: '200px' }}
          variant="contained"
          onClick={onCreateNewEscrow}
        >
          Create New Group
        </Button>
        <Button
          sx={{ mt: 5, minWidth: '200px' }}
          variant="contained"
          component={Link}
          to={`/group/${jobResponse.escrowAddress}`}
        >
          Job Dashboard
        </Button>
      </Box>
    </RoundedBox>
  );
};
