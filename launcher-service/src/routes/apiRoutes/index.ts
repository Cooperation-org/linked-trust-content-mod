import { Router } from 'express';
import {
  groupOwnerAccess,
  apiKeyAccess,
  moderatorAccess,
} from '../../middleware';

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

router.get('/job-creators', getJobCreators);
router.post('/job-creators', createJobCreator);
router.post('/workers', createWorker);
router.post('/groups', apiKeyAccess, createGroup);
router.put('/groups/:id', updateGroup);
router.get('/groups/:id', getGroup);
router.post('/groups/:groupId/add-workers', addWorkersToGroup);
router.post('/groups/:groupId/jobs', createJob);
router.post('/groups/:id/newApiKey', generateApiKey);
router.get('/jobs/:id', getJob);
router.get('/groups/worker/:workerId', getGroupByWorker);
router.get('/groups/creator/:creatorId', getGroupByJobCreator);
router.get('/worker/:workerId/group/:groupId/jobs', getGroupJobsByWorker);
router.post(
  '/jobs/:jobId/content/:contentId/review',
  submitReviewStatusForContentInJob
);

router.get('/jobs/escrow/:address', getJobByEscrow);
router.get('/jobs', getAllJobs);
router.get('/job-creator/groups/:groupId/jobs', getAllJobsForGroup);

export default router;
