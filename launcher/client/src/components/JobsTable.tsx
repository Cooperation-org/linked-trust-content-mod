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
  Stack,
  Chip,
  InputAdornment,
  Snackbar,
  Alert,
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
  onDataUpdate: (jobsData: Job[]) => void;
  onBackButtonClick: () => void;
}

interface ChipData {
  label: string;
}

export const JobTable = ({
  activeGroupId,
  onDataUpdate,
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
  const [workerLoading, setWorkerLoading] = useState(false);
  const swaggerUrl = `${process.env.REACT_APP_JOB_LAUNCHER_SERVER_URL}/api-docs`;
  const [chips, setChips] = useState<ChipData[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (activeGroupId) {
        const response = await axiosInstance.get(
          `/api/job-creator/groups/${activeGroupId}/jobs`
        );
        const data = response.data;
        onDataUpdate(data);
        console.log(`data updated in JobsTable with data: ${data[0].title}`);
        setJobs(data);
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [activeGroupId]);

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

  const handleOpenAddWorkerPopup = () => {
    setChips([]);
    setOpenAddWorkerPopup(true);
  };
  const handleCloseAddWorkerPopup = () => setOpenAddWorkerPopup(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | ''
  >('');

  const handleSubmitWorkers = async () => {
    setWorkerLoading(true);
    try {
      const workerAddresses: string[] = [];
      chips.forEach((chip) => workerAddresses.push(chip.label));
      await axiosInstance.post(`/api/groups/${activeGroupId}/add-workers/`, {
        addresses: workerAddresses,
      });

      setSnackbarMessage('Worker added successfully');
      setShowSnackbar(true);
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage('Failed to add workers! Please try again later.');
      setShowSnackbar(true);
      setSnackbarSeverity('error');
    } finally {
      setWorkerLoading(false);
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

  const handleAdd = () => {
    const isValidAddress = validateAddress(workerAddress);
    if (!isValidAddress) {
      alert('Please enter a valid Ethereum address');
      return;
    }
    if (!chips.find((chip) => chip.label === workerAddress) && workerAddress) {
      setChips([...chips, { label: workerAddress }]);
      setWorkerAddress('');
    } else {
      alert('Address is already added.');
    }
  };

  const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    handleAdd();
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWorkerAddress(event.target.value);
    event.preventDefault();
  };

  const handleChipDelete = (currentChip: string) => {
    setChips(chips.filter((item) => item.label !== currentChip));
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
    setSnackbarMessage('');
    setSnackbarSeverity('');
  };

  return (
    <>
      {isLoading && <CircularProgress />}
      {!isLoading && (
        <div className={classes.container}>
          <Box>
            <Button sx={{ marginBottom: '10px' }} onClick={onBackButtonClick}>
              <ArrowBackIcon />
              <Typography sx={{ marginLeft: '10px' }}>
                Back to dashboard
              </Typography>
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
                To create a new job, please execute the endpoint from the
                swagger with the required details:
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
          <Dialog
            open={openAddWorkerPopup}
            onClose={handleCloseAddWorkerPopup}
            fullWidth
            maxWidth="sm"
          >
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
                onKeyDown={handleEnterKeyDown}
                onChange={handleAddressChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button onClick={handleAdd}>Add</Button>
                    </InputAdornment>
                  ),
                }}
              />
              <Stack
                spacing={1}
                useFlexGap
                direction="row"
                flexWrap="wrap"
                sx={{ mt: 2 }}
              >
                {chips &&
                  chips.map((chip) => {
                    return (
                      <Chip
                        sx={{ fontSize: 16 }}
                        label={chip.label}
                        onDelete={() => handleChipDelete(chip.label)}
                      />
                    );
                  })}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button
                sx={{ minWidth: '120px', py: 1 }}
                onClick={handleCloseAddWorkerPopup}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitWorkers}
                variant="contained"
                color="primary"
                sx={{ minWidth: '120px', py: 1 }}
                disabled={workerLoading}
              >
                {workerLoading && <CircularProgress size={24} sx={{ mr: 1 }} />}
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={showSnackbar}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert
              onClose={handleSnackbarClose}
              variant="filled"
              severity={snackbarSeverity || undefined}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      )}
    </>
  );
};
