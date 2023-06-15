import { FC } from 'react';
import { Button as MuiButton } from '@mui/material';

interface ButtonProps {
  onClick: () => void;
  children: string | JSX.Element;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ onClick, children, disabled = false }) => {
  return (
    <MuiButton
      variant="contained"
      onClick={onClick}
      sx={{
        background: '#EE814D',
        padding: '0.5rem 3rem',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'transparent',
        '&:hover': {
          borderColor: '#EE814D',
          background: 'white',
          color: '#EE814D',
        },
      }}
      disabled={disabled}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
