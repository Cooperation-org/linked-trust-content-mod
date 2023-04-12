import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6">Content Moderation</Typography>
        <Button color="secondary" variant="contained" component={Link} to="/">
          Dashboard
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
