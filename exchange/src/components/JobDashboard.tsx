import React, { useState, useEffect } from 'react';
import {
  Select,
  MenuItem,
  Card,
  CardHeader,
  CardContent,
  Typography,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  CardActions,
  Button,
  Grid,
  Box,
} from '@mui/material';
import axiosInstance from './../config/axiosInterceptor';
import { useAuth } from 'src/hooks/auth';
import dayjs from 'dayjs';
import { getTruncatedAddress } from '../utils';
import { JobDetailProps } from '../types';
import { useAccount } from 'wagmi';
import { JobDetail } from './Escrow/JobDetail';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Group {
  id: string;
  name: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  reviewStatus: string;
  createdAt: string;
  escrowAddress: string;
}

interface Props {}

const JobDashboard: React.FC<Props> = () => {
  const { address } = useAccount();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const { id } = useAuth();

  useEffect(() => {
    // Fetch all groups on component mount
    axiosInstance.get<Group[]>(`/api/groups/worker/${id}`).then((response) => {
      setGroups(response.data);
    });
  }, []);

  useEffect(() => {
    // Fetch jobs when a group is selected
    if (selectedGroup) {
      axiosInstance
        .get<Job[]>(`/api/worker/${id}/group/${selectedGroup}/jobs`)
        .then((response) => {
          setJobs(response.data);
        });
    } else {
      setJobs([]);
    }
  }, [selectedGroup, id]);

  const handleGroupSelect = (event: SelectChangeEvent) => {
    setSelectedGroup(event.target.value);
  };

  const [jobDetail, setJobDetails] = useState<JobDetailProps | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const updateRisk = async (contentId: number, riskStatus: string) => {
    if (jobDetail) {
      try {
        setIsReviewing(true);
        const riskUpdateURL = `/api/jobs/${jobDetail.id}/content/${contentId}/review/`;

        let risk: boolean = false;
        let notRisk: boolean = false;
        if (riskStatus === 'Risk') {
          risk = true;
          notRisk = false;
        } else {
          notRisk = true;
          risk = false;
        }

        const data = {
          address,
          status: riskStatus,
          risk,
          notRisk,
        };
        await axiosInstance.post(riskUpdateURL, data);
        await fetchEscrowDetail(jobDetail.escrowAddress);
      } catch (err) {
        console.log(err);
      } finally {
        setIsReviewing(false);
      }
    } else {
      alert('No job detail!!!');
    }
  };

  const fetchEscrowDetail = async (escrowAddress: string) => {
    const fetchJobUrl = `/api/jobs/escrow/${escrowAddress}`;
    const response = await axiosInstance.get(fetchJobUrl);
    setJobDetails(response.data);
  };

  const onBackButtonClick = () => {
    setJobDetails(null);
  };

  return (
    <div>
      {!jobDetail && (
        <>
          <FormControl
            sx={{ m: 1, minWidth: 200, margin: 0, marginBottom: '10px' }}
          >
            <InputLabel id="demo-simple-select-helper-label">
              Select a group
            </InputLabel>
            <Select
              labelId="slectagroup"
              value={selectedGroup}
              onChange={handleGroupSelect}
              label="Select a group"
            >
              {groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedGroup && (
            <div>
              {jobs.length > 0 ? (
                <Typography sx={{ marginBottom: '20px' }} variant="h5">
                  Jobs for {selectedGroup}
                </Typography>
              ) : (
                <Typography variant="h5">
                  No Jobs Published for {selectedGroup}
                </Typography>
              )}
              <Grid item xs={6} md={3} key={selectedGroup}>
                {jobs.map((job) => (
                  <Card key={job.id}>
                    {/* <Card key={job.id}> */}
                    <CardHeader
                      title={<Typography>{job.title}</Typography>}
                      sx={{
                        backgroundColor: '#F0F0F0',
                      }}
                    />
                    <CardContent>
                      <Typography>{job.description}</Typography>
                      <Typography>Status: {job.reviewStatus}</Typography>
                      <Typography>
                        Created At:{' '}
                        {dayjs(job.createdAt).format('MMMM D, YYYY')}
                      </Typography>
                      <Typography>
                        Escrow Address: {getTruncatedAddress(job.escrowAddress)}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => fetchEscrowDetail(job.escrowAddress)}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Grid>
            </div>
          )}
        </>
      )}
      {jobDetail && (
        <>
          <Box>
            <Button sx={{ marginBottom: '10px' }} onClick={onBackButtonClick}>
              <ArrowBackIcon />
              <Typography sx={{ marginLeft: '10px' }}>
                Back to dashboard
              </Typography>
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <JobDetail
              isReviewing={isReviewing}
              jobDetail={jobDetail}
              updateRisk={updateRisk}
            />
          </Box>
        </>
      )}
    </div>
  );
};

export default JobDashboard;
