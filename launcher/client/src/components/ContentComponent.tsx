import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';

interface ContentProps {
  jobId: number;
  onBack: any;
}

interface Content {
  id: number;
  url: string;
  message: string;
  imgUrl: string;
}

interface Job {
  id: number;
  title: string;
  description?: string;
  fundAmount: number;
  group: {
    id: number;
    name: string;
    guideline_url: string;
  };
  content: Content;
}

const ContentComponent = ({ jobId, onBack }: ContentProps) => {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleResponse = async (isRisk: boolean) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/jobs/${jobId}/content/${job?.content?.id}/review`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ risk: isRisk }),
        }
      );
      const data = await response.json();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!job) {
    return <Typography>No job found.</Typography>;
  }

  const { title, description, group, content } = job;
  const { message, imgUrl, id } = content;

  const { name, guideline_url } = group;

  return (
    <Card sx={{ maxWidth: 800 }}>
      <Card sx={{ maxWidth: 600 }}>
        <CardMedia
          component="img"
          height="300"
          image={imgUrl || 'https://via.placeholder.com/300x200'}
          alt="content image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" href={guideline_url} target="_blank">
            Guidelines
          </Button>
          <Button
            size="small"
            disabled={isSubmitting}
            onClick={() => handleResponse(true)}
          >
            Risk
          </Button>
          <Button
            size="small"
            disabled={isSubmitting}
            onClick={() => handleResponse(false)}
          >
            No Risk
          </Button>
        </CardActions>
      </Card>
      <CardActions>
        <Button onClick={onBack}>Back</Button>
      </CardActions>
    </Card>
  );
};

export default ContentComponent;
