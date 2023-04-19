import { useState, useEffect } from 'react';
import axiosInstance from './../config/axiosInterceptor';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Box,
  Typography,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
interface Job {
  id: number;
  status: string;
  createdAt: string;
  fundAmount: number;
  description: string;
  reviewCount: string;
  reviewersRequired: number;
  title: string;
  escrowAddress: string;
}

const useStyles = makeStyles({
  container: {
    marginTop: '30px',
  },
  table: {
    marginBottom: '30px',
  },
});

interface JobTableProps {
  activeGroupId: number;
  onBackButtonClick: () => void;
}

interface Workers {
  workerAddress: string;
}

export const JobTable = ({
  activeGroupId,
  onBackButtonClick,
}: JobTableProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const classes = useStyles();
  const [openAddWorkerPopup, setOpenAddWorkerPopup] = useState(false);
  const [workerAddress, setWorkerAddress] = useState('');
  const [workerLoading, setwWorkerLoading] = useState(false);
  const swaggerUrl = `${process.env.REACT_APP_JOB_LAUNCHER_SERVER_URL}/api-docs`;

  useEffect(() => {
    const fetchJobs = async () => {
      if (activeGroupId) {
        const response = await axiosInstance.get(
          `/api/job-creator/groups/${activeGroupId}/jobs`
        );
        const data = response.data;
        setJobs(data);
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [activeGroupId]);

  if (isLoading) {
    return <CircularProgress />;
  }

  const handleGenerateApiKey = () => {
    // Call API to generate API key
    axiosInstance
      .post(`/api/groups/${activeGroupId}/newApiKey`)
      .then((response) => {
        setApiKey(response.data.apiKey);
        setDialogOpen(true);
      });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCloseInfoDialog = () => {
    setInfoDialogOpen(false);
  };

  const handleOpenAddWorkerPopup = () => setOpenAddWorkerPopup(true);
  const handleCloseAddWorkerPopup = () => setOpenAddWorkerPopup(false);

  const handleAddWorker = async () => {
    setwWorkerLoading(true);
    try {
      const isValidAddress = await validateAddress(workerAddress);
      if (!isValidAddress) {
        alert('Please enter a valid Ethereum address');
        return;
      }
      const response = await axiosInstance.post(
        `/api/groups/${activeGroupId}/add-workers/`,
        {
          addresses: [workerAddress],
        }
      );

      if (response.status === 200) {
        alert('Worker added successfully');
      } else {
        alert('Failed to add worker');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to add worker');
    } finally {
      setwWorkerLoading(false);
      setOpenAddWorkerPopup(false);
      setWorkerAddress('');
    }
  };
  const validateAddress = (address: string) => {
    // Check if the address is a valid Ethereum address using a regular expression
    const regex = /^0x[a-fA-F0-9]{40}$/;
    return regex.test(address);
  };

  const handleCreateJob = () => {
    // Show information about creating a job
    // This could be implemented as a separate component or as a pop-up modal
    setInfoDialogOpen(true);
    // alert(
    //   "To create a job, click on the 'Create Job' button and fill out the required information."
    // );
  };

  const handleOpenSwagger = () => {
    window.open(swaggerUrl, '_blank');
  };

  return (
    <div className={classes.container}>
      <Box>
        <Button sx={{ marginBottom: '10px' }} onClick={onBackButtonClick}>
          <ArrowBackIcon />
          <Typography sx={{ marginLeft: '10px' }}>Back to dashboard</Typography>
        </Button>
      </Box>
      <TableContainer component={Paper} className={classes.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Escrow Address</TableCell>
              <TableCell>Fund Amount</TableCell>
              <TableCell>Reviewers Required</TableCell>
              <TableCell>Reviewers Completed</TableCell>
              <TableCell>Created AT</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.description}</TableCell>
                <TableCell>{job.escrowAddress}</TableCell>
                <TableCell>{job.fundAmount}</TableCell>
                <TableCell>{job.reviewersRequired}</TableCell>
                <TableCell>{job.reviewCount}</TableCell>
                <TableCell>{job.createdAt}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() =>
                      console.log(`Action button clicked for ${job.title}`)
                    }
                  >
                    View Report
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateApiKey}
        sx={{ marginRight: '10px' }}
      >
        Generate API Key
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateJob}
        sx={{ marginRight: '10px' }}
      >
        Create Job
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenAddWorkerPopup}
      >
        Add Worker
      </Button>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{'API Key'}</DialogTitle>
        <DialogContent>
          <DialogContentText>{`Your API Key is: ${apiKey}. Please copy and save it for future use.`}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={infoDialogOpen} onClose={handleCloseInfoDialog}>
        <DialogTitle>{'API Docs'}</DialogTitle>
        <DialogContent>
          <p>
            To create a new job, please execute the endpoint from the swagger
            with the required details:
          </p>
          <ul style={{ listStyleType: 'decimal' }}>
            <li>Create New Group.</li>
            <li>Generate New API Key.</li>
            <li>Open Swagger({swaggerUrl})</li>
            <li>Execute the Create Job Endpoint to start creating jobs</li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleOpenSwagger}
            color="primary"
            autoFocus
          >
            Open Swagger
          </Button>
          <Button
            variant="contained"
            onClick={handleCloseInfoDialog}
            color="primary"
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAddWorkerPopup} onClose={handleCloseAddWorkerPopup}>
        <DialogTitle>Add Workers</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Address"
            type="text"
            fullWidth
            value={workerAddress}
            onChange={(event) => setWorkerAddress(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddWorkerPopup}>Cancel</Button>
          <Button onClick={handleAddWorker} color="primary">
            {workerLoading ? <CircularProgress size={24} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
