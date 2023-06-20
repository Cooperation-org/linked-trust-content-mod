import Modal from '../Modal';
import Button from './Button';
import { FC, useState } from 'react';
import StyledInput from './StyledInput';
import { useAuth } from 'src/hooks/auth';
import { FortuneJobRequestType, JobLaunchResponse } from '../types';
import {
  Box,
  TextField,
  FormControl,
  InputAdornment,
  Typography,
  CircularProgress,
} from '@mui/material';
import useCreateGroup from '../../hooks/useCreateGroup';
import { ChainId, ESCROW_NETWORKS, SUPPORTED_CHAIN_IDS } from '../../constants';

interface FundInfoProps {
  onFundSuccess: (response: JobLaunchResponse) => void;
  groupName: string;
}

const FundInfo: FC<FundInfoProps> = ({ onFundSuccess, groupName }) => {
  const { id } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const { isLoading, handleLaunch } = useCreateGroup({
    onSuccess: onFundSuccess,
  });

  const [jobRequest, setJobRequest] = useState<FortuneJobRequestType>({
    chainId: SUPPORTED_CHAIN_IDS.includes(ChainId.LOCALHOST)
      ? ChainId.LOCALHOST
      : SUPPORTED_CHAIN_IDS.includes(ChainId.POLYGON_MUMBAI)
      ? ChainId.POLYGON_MUMBAI
      : SUPPORTED_CHAIN_IDS[0],
    name: groupName,
    description: '',
    token: '',
    fundedAmt: '',
    jobRequester: '',
    guidelineUrl: '',
    creatorId: id,
    funded: true,
    rules: '',
  });

  const handleJobRequestFormFieldChange = (
    fieldName: keyof FortuneJobRequestType,
    fieldValue: any
  ) => {
    setJobRequest({ ...jobRequest, [fieldName]: fieldValue });
  };

  const handleFundGroupClick = () => {
    if (!jobRequest.fundedAmt || !jobRequest.description) {
      alert('Please fill all fields');
      return;
    }
    if (Number(jobRequest.fundedAmt) <= 0) {
      alert('Token has to be positive number');
      return;
    }
    setShowModal(true);
  };

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
              sx={{ background: '#fff' }}
              value={jobRequest.chainId}
              name="chainId"
              onChange={(e) =>
                handleJobRequestFormFieldChange(
                  'chainId',
                  Number(e.target.value)
                )
              }
            >
              {SUPPORTED_CHAIN_IDS.map((chainId) => {
                return (
                  <option key={chainId} value={chainId}>
                    {ESCROW_NETWORKS[chainId]?.title}
                  </option>
                );
              })}
            </TextField>
          </FormControl>
        </div>
        <div className="mac">
          <FormControl sx={{ width: '80%' }} style={{ marginTop: 0 }}>
            <label htmlFor="" style={{ fontSize: '14px' }}>
              Token <span style={{ color: 'red' }}>*</span>
            </label>
            <StyledInput
              value={ESCROW_NETWORKS[jobRequest.chainId as ChainId]?.hmtAddress}
              disabled
            />
          </FormControl>
        </div>
        <div className="mac">
          <FormControl sx={{ width: '25ch' }} style={{ marginTop: 0 }}>
            <label htmlFor="" style={{ fontSize: '14px' }}>
              Fund Amount <span style={{ color: 'red' }}>*</span>
            </label>
            <StyledInput
              value={jobRequest.fundedAmt}
              onChange={(e) =>
                handleJobRequestFormFieldChange('fundedAmt', e.target.value)
              }
              startAdornment={
                <InputAdornment position="start">
                  <Typography color={'primary'} variant="body2">
                    HMT
                  </Typography>
                </InputAdornment>
              }
            />
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
              name="description"
              value={jobRequest.description}
              onChange={(e) =>
                handleJobRequestFormFieldChange('description', e.target.value)
              }
            ></textarea>
          </FormControl>
        </div>
      </div>
      <Box sx={{ textAlign: 'center' }}>
        <Button onClick={handleFundGroupClick}>Fund Group</Button>
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
            Are you sure you want to add "HMT {jobRequest.fundedAmt}" Fund
            Amount
          </h2>
          <Button
            onClick={() => {
              handleLaunch(jobRequest);
            }}
            disabled={isLoading}
          >
            {isLoading && (
              <CircularProgress
                sx={{
                  mr: 1,
                  '& .MuiCircularProgress-circle': {
                    stroke: '#FFF',
                  },
                }}
                size={24}
              />
            )}{' '}
            Continue
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default FundInfo;
