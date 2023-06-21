import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MyGroups from './MyGroups';
import { JobTable } from './JobsTable';
import { ViewReport } from './ViewReport';

interface Job {
  id: number;
  status: string;
  createdAt: string;
  fundAmount: number;
  description: string;
  reviewCount: string;
  reviewersRequired: number;
  title: string;
  escrowAddress: string;
}

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      cooperation.org
      {/* {new Date().getFullYear()} */}
      {/* {'.'} */}
    </Typography>
  );
}

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [activeGroupId, setActiveGroupId] = React.useState<number>();
  const [job, setJob] = React.useState<Job>();

  return (
    <Box sx={{ display: 'flex' }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {!activeGroupId && (
          <MyGroups
            onViewGroupDetails={(activeGroupId) => {
              setActiveGroupId(activeGroupId);
            }}
          />
        )}
        {activeGroupId && !job && (
          <JobTable
            activeGroupId={activeGroupId}
            onBackButtonClick={() => {
              setActiveGroupId(undefined);
            }}
            onViewReportClick={(job) => {
              setJob(job);
            }}
          />
        )}

        {job && (
          <ViewReport
            job={job}
            handleBackButton={() => {
              setJob(undefined);
            }}
          />
        )}
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </Box>
  );
}
