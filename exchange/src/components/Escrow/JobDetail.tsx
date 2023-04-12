import React from 'react';
import { Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

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
  },
}));
// type JobDetailProps = {
//   jobDetail: {
//     content: {
//       id: number;
//       message: string;
//       imgUrl: string;
//     };
//   };
//   updateRisk: (id: number, review: 'Risk' | 'NoRisk') => void;
//   updatePage: (page: string) => void;
// };

export const JobDetail = (props: any) => {
  const { jobDetail, updateRisk, updatePage } = props;
  const classes = useStyles();

  const handleRiskUpdate = (review: 'Risk' | 'NoRisk') => {
    updateRisk(jobDetail.content.id, review);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
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
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleRiskUpdate('Risk')}
        >
          Risk
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleRiskUpdate('NoRisk')}
        >
          No Risk
        </Button>
      </div>
      <Button
        variant="outlined"
        onClick={() => props.updatePage('viewMilestone')}
      >
        Back
      </Button>
      <Typography variant="body2" gutterBottom>
        For guidelines, please refer to:
      </Typography>
    </div>
  );
};
