import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MyGroups from './MyGroups';

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

function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <MyGroups />
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </Box>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
