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
import axios from 'axios';
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
  cardHeader: {
    backgroundColor: '#F0F0F0',
  },
  cardContent: {
    height: '150px',
    overflowY: 'scroll',
  },
  link: {
    cursor: 'pointer',
  },
}));

const MyGroups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [jobId, setJobId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const classes = useStyles();
  const { id } = useAuth();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`/api/groups/creator/${id}`);
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
    <Box mt={3}>
      <Grid container spacing={3}>
        {isLoading ? (
          <CircularProgress />
        ) : groups.length === 0 ? (
          <Typography variant="h5">
            You haven't created any groups yet.
          </Typography>
        ) : jobId < 1 ? (
          groups.map((group) => (
            <Grid item xs={12} md={4} key={group.id}>
              <Card>
                <CardHeader
                  title={
                    <Link
                      component={RouterLink}
                      to={`/group/${group.id}`}
                      underline="none"
                      color="textPrimary"
                      className={classes.link}
                    >
                      <Typography
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: '2',
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {group.name}
                      </Typography>
                    </Link>
                  }
                  subheader={`${group?.jobs?.length} Jobs`}
                  className={classes.cardHeader}
                />
                
                <CardContent>
                  <Typography
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
                {/* <CardContent className={classes.cardContent}>
                  {group?.jobs?.map((job: Job) => (
                    <Link
                      key={job.id}
                      component="button"
                      underline="none"
                      color="textPrimary"
                      className={classes.link}
                      onClick={() => handleJobClick(job.id)}
                    >
                      <Typography variant="subtitle2">{job.title}</Typography>
                    </Link>
                  ))}
                </CardContent> */}
                <CardActions>
                  <Button size="small">View Details</Button>
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
