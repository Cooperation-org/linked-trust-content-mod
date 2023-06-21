import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Job } from './JobsTable';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  table: {
    minWidth: 400,
  },
  title: {
    paddingTop: '30px',
    paddingBottom: '20px',
    textAlign: 'center',
  },
});

interface ViewReportProps {
  job: Job;
  handleBackButton: () => void;
}

export const ViewReport = ({ job, handleBackButton }: ViewReportProps) => {
  const classes = useStyles();
  return (
    <div>
      <Box>
        <Button sx={{ marginBottom: '10px' }} onClick={handleBackButton}>
          <ArrowBackIcon />
          <Typography sx={{ marginLeft: '10px' }}>Back to Jobs</Typography>
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Typography variant="h6" className={classes.title}>
          {job.title}
        </Typography>
        <Table className={classes.table}>
          <TableBody>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>{job.title}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>{job.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Group ID</TableCell>
              <TableCell>{job.groupId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Reviewers Required</TableCell>
              <TableCell>{job.reviewersRequired}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Fund Amount</TableCell>
              <TableCell>{job.fundAmount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Escrow Address</TableCell>
              <TableCell>{job.escrowAddress}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Created At</TableCell>
              <TableCell>{job.createdAt}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>{job.status}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Reviews Completed Count</TableCell>
              <TableCell>{job.reviewCount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Reviews</TableCell>
              <TableCell>
                {job.content.reviews.map((review, index) => (
                  <div key={index}>
                    <Typography variant="body2">{`Review ${
                      index + 1
                    }:`}</Typography>
                    <Typography variant="body2">{`Status: ${review.status}`}</Typography>
                    <Typography variant="body2">{`Reviewer Address: ${review.reviewer.address}`}</Typography>
                  </div>
                ))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
