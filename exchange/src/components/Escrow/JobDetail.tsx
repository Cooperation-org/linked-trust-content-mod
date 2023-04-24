import React, { useMemo } from 'react';
import { Button, Typography, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { JobDetailProps } from '../../types';
import { useAuth } from 'src/hooks/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    height: 200,
    width: 300,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '10px',
  },
}));

export const JobDetail = (props: {
  jobDetail: JobDetailProps;
  updateRisk: (contentId: number, review: string) => void;
  isReviewing?: boolean;
}) => {
  const { jobDetail, updateRisk, isReviewing } = props;
  const classes = useStyles();
  const { id } = useAuth();

  const handleRiskUpdate = (review: 'Risk' | 'NoRisk') => {
    updateRisk(jobDetail.content.id, review);
  };

  const review = useMemo(
    () => jobDetail.content.reviews.find((review) => review.reviewerId === id),
    [id, jobDetail]
  );

  return (
    <Paper sx={{ padding: '20px' }}>
      <div className={classes.root}>
        <Typography variant="h5" gutterBottom>
          Job Detail
        </Typography>
        <img
          src={props.jobDetail.content.imgUrl}
          alt="content"
          className={classes.image}
        />
        <Typography variant="body1" gutterBottom>
          {props.jobDetail.content.message}
        </Typography>
        <div>
          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleRiskUpdate('Risk')}
              sx={{ marginRight: '10px' }}
              disabled={isReviewing || Boolean(review)}
            >
              Risk
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleRiskUpdate('NoRisk')}
              disabled={isReviewing || Boolean(review)}
            >
              No Risk
            </Button>
          </div>
          {review && (
            <Typography variant="h6" color="primary">
              You have reviewed this as "{review.status}"
            </Typography>
          )}
        </div>
        <Typography variant="body2" gutterBottom>
          For guidelines, please refer to:
        </Typography>
      </div>
    </Paper>
  );
};
