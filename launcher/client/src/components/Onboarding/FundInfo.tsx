import Modal from '../Modal';
import Button from '../Button';
import { FC, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import { Box, TextField, OutlinedInput } from '@mui/material';

interface FundInfoProps {
  onGoToNextStep: () => void;
}

const FundInfo: FC<FundInfoProps> = ({ onGoToNextStep }) => {
  const [showModal, setShowModal] = useState(false);
  const average = [
    {
      value: 'select from the options',
    },
  ];

  return (
    <div style={{ color: 'black' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="mac">
          <FormControl sx={{ width: '25ch' }}>
            <label htmlFor="" style={{ fontSize: '14px' }}>
              Network<span style={{ color: 'red' }}>*</span>
            </label>

            <TextField
              id="outlined-select-currency-native"
              select
              SelectProps={{
                native: true,
              }}
            >
              {average.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </TextField>
          </FormControl>
        </div>
        <div className="mac">
          <FormControl sx={{ width: '80%' }} style={{ marginTop: 0 }}>
            <label htmlFor="" style={{ fontSize: '14px' }}>
              Token <span style={{ color: 'red' }}>*</span>
            </label>
            <OutlinedInput
              placeholder="0x0376D26246Eb35FF4F9924cF13E6C05fd0bD7Fb4
                  "
              sx={{
                borderColor: 'grey',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
            />
          </FormControl>
        </div>
        <div className="mac">
          <FormControl sx={{ width: '25ch' }} style={{ marginTop: 0 }}>
            <label htmlFor="" style={{ fontSize: '14px' }}>
              Fund Amount <span style={{ color: 'red' }}>*</span>
            </label>
            <OutlinedInput
              placeholder="Please enter text"
              sx={{
                borderColor: 'grey',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
            />
          </FormControl>
        </div>
        <div className="mac">
          <FormControl sx={{ width: '25ch' }} style={{ marginTop: 0 }}>
            <label htmlFor="" style={{ fontSize: '14px' }}>
              Project Name <span style={{ color: 'red' }}>*</span>
            </label>
            <OutlinedInput
              placeholder="Please enter text"
              sx={{
                borderColor: 'grey',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
            />
          </FormControl>
        </div>
        <div className="mac">
          <FormControl sx={{ width: '25ch' }}>
            <label htmlFor="" style={{ fontSize: '14px' }}>
              Type of content to be moderated
              <span style={{ color: 'red' }}>*</span>
            </label>

            <TextField
              id="outlined-select-currency-native"
              select
              SelectProps={{
                native: true,
              }}
            >
              {average.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </TextField>
          </FormControl>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <FormControl sx={{ width: '100%' }}>
            <label htmlFor="" style={{ fontSize: '14px' }}>
              Type of content to be moderated
              <span style={{ color: 'red' }}>*</span>{' '}
              <span style={{ color: '#EE814D' }}>
                (Provide as much detail as possible- what platforms and/or
                social media handles/brand will the moderation be for?)
              </span>
            </label>

            <textarea
              name=""
              style={{
                width: '100%',
                minHeight: '150px',
                borderColor: 'grey',
                borderWidth: '1px',
                padding: '1rem',
                outline: 'none',
                borderStyle: 'solid',
                borderRadius: '5px',
              }}
              id=""
            ></textarea>
          </FormControl>
        </div>
      </div>
      <Box sx={{ textAlign: 'center' }}>
        <Button onClick={() => setShowModal(true)}>Next</Button>
      </Box>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <div style={{ textAlign: 'center', width: '60%', margin: 'auto' }}>
          <h2
            style={{
              fontSize: '25px',
              color: 'black',
              fontWeight: 'bold',
              marginBottom: '2rem',
            }}
          >
            Are you sure you want to add XYZ Fund Amount
          </h2>
          <Button onClick={onGoToNextStep}>Continue</Button>
        </div>
      </Modal>
    </div>
  );
};

export default FundInfo;
