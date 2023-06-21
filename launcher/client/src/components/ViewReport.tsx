import { useState } from 'react';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// For now, we are limited to only this data, but i'll make other data like content and group information available as well
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

interface ViewReportProps {
  job: Job;
  handleBackButton: () => void;
}

export const ViewReport = ({ job, handleBackButton }: ViewReportProps) => {
  return (
    <div>
      <Box>
        <Button sx={{ marginBottom: '10px' }} onClick={handleBackButton}>
          <ArrowBackIcon />
          <Typography sx={{ marginLeft: '10px' }}>Back to Jobs</Typography>
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.description}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
