import {
  CircularProgress as MuiCircularProgress,
  CircularProgressProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const CircularProgress = styled(MuiCircularProgress)<CircularProgressProps>(
  () => ({
    mr: 1,
    '& .MuiCircularProgress-circle': {
      stroke: '#FFF',
    },
  })
);

const StyledCircularProgress = () => {
  return <CircularProgress size="24" />;
};

export default StyledCircularProgress;
