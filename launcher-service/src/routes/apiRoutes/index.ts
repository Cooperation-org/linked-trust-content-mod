import { Router } from 'express';
import { apiKeyAccess, jwtDBAuth } from '../../middleware';

import {
  addWorkersToGroup,
  createGroup,
  createJob,
  createJobCreator,
  createWorker,
  generateApiKey,
  getGroup,
  getGroupByWorker,
  getGroupJobsByWorker,
  getJob,
  submitReviewStatusForContentInJob,
  updateGroup,
  getGroupByJobCreator,
  getJobCreators,
  getJobByEscrow,
  getAllJobs,
  getAllJobsForGroup,
} from '../../controllers';
const router = Router();

router.get('/job-creators', jwtDBAuth, getJobCreators);
router.post('/job-creators', jwtDBAuth, createJobCreator);
router.post('/workers', jwtDBAuth, createWorker);
router.post('/groups', jwtDBAuth, createGroup);
router.put('/groups/:id', jwtDBAuth, updateGroup);
router.get('/groups/:id', jwtDBAuth, getGroup);
router.post('/groups/:groupId/add-workers', jwtDBAuth, addWorkersToGroup);
router.post('/groups/:groupId/jobs', jwtDBAuth, apiKeyAccess, createJob);
router.post('/groups/:id/newApiKey', jwtDBAuth, generateApiKey);
router.get('/jobs/:id', jwtDBAuth, getJob);
router.get('/groups/worker/:workerId', jwtDBAuth, getGroupByWorker);
router.get('/groups/creator/:creatorId', jwtDBAuth, getGroupByJobCreator);
router.get(
  '/worker/:workerId/group/:groupId/jobs',
  jwtDBAuth,
  getGroupJobsByWorker
);
router.post(
  '/jobs/:jobId/content/:contentId/review',
  jwtDBAuth,
  submitReviewStatusForContentInJob
);

router.get('/jobs/escrow/:address', jwtDBAuth, getJobByEscrow);
router.get('/jobs', jwtDBAuth, getAllJobs);
router.get('/job-creator/groups/:groupId/jobs', jwtDBAuth, getAllJobsForGroup);

export default router;
