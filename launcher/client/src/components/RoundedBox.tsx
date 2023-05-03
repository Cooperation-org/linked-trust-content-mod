import { Box as MuiBox, SxProps, useTheme } from '@mui/material';
import React from 'react';

type BoxProps = {
  sx?: SxProps;
  children?: any;
};

export const RoundedBox = ({ children, sx = {} }: BoxProps) => {
  const theme = useTheme();
  return (
    <MuiBox
      sx={{
        background: '#fff',
        boxShadow: theme.shadows[1],
        borderRadius: '16px',
        ...sx,
      }}
    >
      {children}
    </MuiBox>
  );
};
