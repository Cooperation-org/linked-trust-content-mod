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
} from '@mui/material';
import axiosInstance from './../config/axiosInterceptor';
import { useAuth } from 'src/hooks/auth';

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
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>();
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
  }, [selectedGroup]);

  const handleGroupSelect = (event: SelectChangeEvent) => {
    setSelectedGroup(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
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
            <Typography variant="h5">Jobs for {selectedGroup}</Typography>
          ) : (
            <Typography variant="h5">
              No Jobs Published for {selectedGroup}
            </Typography>
          )}
          {jobs.map((job) => (
            <Card key={job.id} style={{ margin: '10px', minWidth: '200px' }}>
              <CardHeader title={job.title} />
              <CardContent>
                <Typography>{job.description}</Typography>
                <Typography>Status: {job.reviewStatus}</Typography>
                <Typography>Created At: {job.createdAt}</Typography>
                <Typography>Escrow Address: {job.escrowAddress}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small">View Details</Button>
              </CardActions>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobDashboard;
