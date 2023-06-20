import { FC, useEffect, useState } from 'react';
import {
  Box,
  Divider,
  FormControl,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import StyledCircularProgress from './StyledCircularProgress';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import axiosInstance from '../../config/axiosInterceptor';
import StyledInput from './StyledInput';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

interface HooksAndKeysInfoProps {
  activeGroupId: string;
}

const HooksAndKeysInfo: FC<HooksAndKeysInfoProps> = ({ activeGroupId }) => {
  const [isFetchingApiKey, setIsFetchingApiKey] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [showToolTip, setShowToolTip] = useState(false);
  const [isStoringWebhook, setIsStoringWebhook] = useState(false);
  const [webHook, setWebhook] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setIsFetchingApiKey(true);
    axiosInstance
      .post(`/api/groups/${activeGroupId}/newApiKey`)
      .then((response) => {
        setApiKey(response.data.apiKey);
      })
      .finally(() => {
        setIsFetchingApiKey(false);
      });
  }, [activeGroupId]);

  const handleApiKeyCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setShowToolTip(true);
    setTimeout(() => {
      setShowToolTip(false);
    }, 2000);
  };

  const handleStoringWebhook = async () => {
    setIsStoringWebhook(true);
    try {
      await axiosInstance.post(`/api/groups/${activeGroupId}/webhook`, {
        webHook,
      });
      navigate('/');
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setIsStoringWebhook(false);
    }
  };

  return (
    <div style={{ color: 'black' }}>
      <div style={{ marginBottom: '1rem' }}>
        <FormControl sx={{ width: '100%' }} style={{ marginTop: '2rem' }}>
          <label htmlFor="">
            API Key <span style={{ color: 'red' }}>*</span>
          </label>
          <StyledInput
            readOnly
            sx={{ color: 'black' }}
            endAdornment={
              !isFetchingApiKey && (
                <InputAdornment position="end">
                  <Tooltip title="copied" open={showToolTip}>
                    <IconButton onClick={handleApiKeyCopy}>
                      <ContentCopyIcon sx={{ cursor: 'pointer' }} />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }
            startAdornment={
              isFetchingApiKey && (
                <InputAdornment position="start">
                  <StyledCircularProgress />
                </InputAdornment>
              )
            }
            value={apiKey}
          />
          <p style={{ color: '#EE814D', fontSize: '14px' }}>
            Use the API key as a x-api-key request header while sending the
            content for moderation.
          </p>
        </FormControl>
      </div>
      <Divider sx={{ marginTop: '2rem' }} />
      <div>
        <FormControl sx={{ width: '100%' }} style={{ marginTop: '2rem' }}>
          <label htmlFor="">
            Webhook endpoint <span style={{ color: 'red' }}>*</span>
          </label>
          <StyledInput
            placeholder="https://..."
            value={webHook}
            onChange={(e) => setWebhook(e.target.value)}
          />
        </FormControl>
        <p style={{ color: '#EE814D', fontSize: '14px' }}>
          Please enter your webhook endpoint where we can send the moderation
          status of the content.
        </p>
        <Box sx={{ display: 'flex', mt: 3, justifyContent: 'center' }}>
          <Button
            onClick={handleStoringWebhook}
            disabled={isStoringWebhook || !webHook}
          >
            {isStoringWebhook && <StyledCircularProgress />} Save
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default HooksAndKeysInfo;
