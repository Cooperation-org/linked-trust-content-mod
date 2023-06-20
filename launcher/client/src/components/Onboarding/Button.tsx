import { Button as MuiButton, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const Button = styled(MuiButton)<ButtonProps>(() => ({
  background: '#EE814D',
  padding: '0.5rem 3rem',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: 'transparent',
  color: '#fff',
  '&:hover': {
    borderColor: '#EE814D',
    background: 'white',
    color: '#EE814D',
  },
  '&:hover .MuiCircularProgress-circle': {
    stroke: '#EE814D',
  },
  '&:disabled': {
    opacity: 0.6,
    color: '#fff',
  },
}));

export default Button;
