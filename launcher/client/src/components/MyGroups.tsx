import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Link,
  Typography,
  CardActions,
  Button,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ContentComponent from './ContentComponent';
import axiosInstance from './../config/axiosInterceptor';
import { useAuth } from 'src/hooks/auth';

interface Job {
  id: number;
  title?: string;
  chainId?: number;
  description?: string;
  token?: string;
  token_per_content?: number;
  num_of_content: number;
  escrow_created: boolean;
  escrow_address?: string;
  funded: boolean;
  mod_quorum: number;
  cm_award_amount?: number;
  manifest_json?: Record<string, unknown>;
}

interface Group {
  id: number;
  name?: string;
  platform?: string;
  group_id_in_platform?: string;
  owner_id: number;
  jobs?: Job[];
  description: string;
}

const useStyles = makeStyles(() => ({
  cardContent: {
    height: '150px',
    overflowY: 'scroll',
  },
  link: {
    cursor: 'pointer',
  },
}));

interface MyGroupsProps {
  onViewGroupDetails: (activeGroupId: number) => void;
}

const MyGroups = ({ onViewGroupDetails }: MyGroupsProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [jobId, setJobId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const classes = useStyles();
  const { id } = useAuth();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axiosInstance.get(`/api/groups/creator/${id}`);
        const data = response.data;
        setGroups(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchGroups();
  }, []);

  const handleJobClick = (jobId: number) => {
    setJobId(jobId);
    return;
    // Render your new component here
  };

  const handleBackClick = () => {
    setJobId(0);
  };

  return (
    <Box mt={3} display="flex">
      <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
        {isLoading ? (
          <CircularProgress sx={{ mx: 'auto' }} />
        ) : groups.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5">
              You haven't created any groups yet.
            </Typography>
          </Box>
        ) : jobId < 1 ? (
          groups.map((group) => (
            <Grid item xs={12} md={4} key={group.id}>
              <Card>
                <CardHeader
                  title={
                    <Typography
                      variant="h6"
                      sx={{
                        cursor: 'default',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {group.name}
                    </Typography>
                  }
                  subheader={`${group?.jobs?.length} Jobs`}
                />

                <CardContent>
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {group.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => {
                      onViewGroupDetails(group.id);
                    }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <ContentComponent onBack={handleBackClick} jobId={jobId} />
        )}
      </Grid>
    </Box>
  );
};

export default MyGroups;
