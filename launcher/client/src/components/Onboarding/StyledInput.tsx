import { OutlinedInput, OutlinedInputProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledInput = styled(OutlinedInput)<OutlinedInputProps>(() => ({
  borderColor: 'grey',
  borderWidth: '1px',
  borderStyle: 'solid',
  background: '#fff',
}));

export default StyledInput;
