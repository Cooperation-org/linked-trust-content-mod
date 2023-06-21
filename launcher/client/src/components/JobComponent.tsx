import { useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import axiosInstance from './../config/axiosInterceptor';

type JobProps = {
  jobId: number;
};

type Content = {
  id: number;
  url: string;
  message: string;
  imgUrl?: string;
};

type Job = {
  id: number;
  title: string;
  description?: string;
  fundAmount: number;
  content?: Content;
};

const Job = ({ jobId }: JobProps) => {
  const [job, setJob] = useState<Job | null>(null);
  const [reviewed, setReviewed] = useState<boolean>(false);
  const [risk, setRisk] = useState<boolean | null>(null);

  const getJob = async () => {
    try {
      const response = await axiosInstance.get(`/jobs/${jobId}`);
      setJob(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const submitReview = async (risk: boolean) => {
    try {
      await axiosInstance.post(
        `/jobs/${jobId}/content/${job?.content?.id}/review`,
        {
          risk,
        }
      );
      setReviewed(true);
      setRisk(risk);
    } catch (error) {
      console.error(error);
    }
  };

  const renderContent = () => {
    if (!job?.content) {
      return null;
    }

    return (
      <>
        <Typography variant="h6" gutterBottom>
          Content to review
        </Typography>
        {job.content.imgUrl && (
          <img
            src={job.content.imgUrl}
            alt="Content"
            style={{ width: '100%' }}
          />
        )}
        <Typography variant="body1">{job.content.message}</Typography>
        {/* <Button onClick={() => window.open(job?.group?.guidelineUrl, '_blank')}>
          Guidelines
        </Button> */}
        {!reviewed && (
          <>
            <Button variant="contained" onClick={() => submitReview(true)}>
              Risk
            </Button>
            <Button variant="contained" onClick={() => submitReview(false)}>
              No Risk
            </Button>
          </>
        )}
        {reviewed && (
          <Typography variant="body1">
            You have already submitted a review: {risk ? 'Risk' : 'No Risk'}
          </Typography>
        )}
      </>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {job?.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {job?.description}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Funding amount: ${job?.fundAmount}
        </Typography>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default Job;
