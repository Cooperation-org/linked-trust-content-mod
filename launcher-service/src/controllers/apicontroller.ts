import amqplib from 'amqplib';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db';
import crypto from 'crypto';
import axios from 'axios';
import { ChainId, ESCROW_NETWORKS } from '../constants';

export const createJobCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, address } = req.body;

  try {
    // Create a new job creator
    const jobCreator = await prisma.jobCreator.create({
      data: {
        name,
        email,
        password,
        address,
      },
    });

    res.status(201).json(jobCreator);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create job creator' });
  }
};

export const createWorker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, address } = req.body;
    const existingWorker = await prisma.worker.findUnique({
      where: { address },
    });

    if (existingWorker) {
      return res
        .status(400)
        .json({ message: 'Worker with this address already exists' });
    }

    const newWorker = await prisma.worker.create({
      data: {
        name,
        email,
        password,
        address,
      },
    });

    res.json(newWorker);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    description,
    creatorId,
    funded,
    fundedAmt,
    guidelineUrl,
    chainId,
    token,
  } = req.body;

  try {
    const group = await prisma.group.create({
      data: {
        name,
        description,
        creator: { connect: { id: creatorId } },
        funded,
        funded_amt: Number(fundedAmt),
        guideline_url: guidelineUrl,
        chainId,
        token,
      },
      include: {
        creator: true,
      },
    });

    res.status(201).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create group' });
  }
};

export const updateGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description, funded, funded_amt, guideline_url } = req.body;

    // Check if group with given ID exists
    const existingGroup = await prisma.group.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Update group
    const updatedGroup = await prisma.group.update({
      where: { id: parseInt(id) },
      data: {
        name: name || existingGroup.name,
        description: description || existingGroup.description,
        funded: funded || existingGroup.funded,
        funded_amt: funded_amt || existingGroup.funded_amt,
        guideline_url: guideline_url || existingGroup.guideline_url,
      },
    });

    return res.json(updatedGroup);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const group = await prisma.group.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        jobs: true,
        members: true,
      },
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json({ group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to retrieve group' });
  }
};

// Add workers to group
export const addWorkersToGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { groupId } = req.params;
  const { addresses } = req.body;

  try {
    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
      include: { members: true },
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Find or create a new worker for each email
    const workers = [];
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];

      let worker = await prisma.worker.findUnique({ where: { address } });

      if (!worker) {
        // Create new worker
        worker = await prisma.worker.create({
          data: { address },
        });
      }

      // Add worker to group
      const existingMember = group.members.find(
        (m: any) => m.address === address
      );
      if (!existingMember) {
        await prisma.group.update({
          where: { id: group.id },
          data: { members: { connect: { id: worker.id } } },
        });
      }

      workers.push(worker);
    }

    return res.json({ message: 'Workers added successfully', workers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { groupId } = req.params;
    const { title, description, reviewersRequired, fundAmount } = req.body;

    const contentData = req.body.content;

    // Create a new job in the specified group
    const job = await prisma.job.create({
      data: {
        title,
        description,
        reviewersRequired,
        fundAmount,
        group: { connect: { id: parseInt(groupId) } },
      },
      include: {
        group: {
          include: {
            creator: true,
          },
        },
      },
    });
    let content;
    // Create a new content for the job
    if (contentData) {
      content = await prisma.content.create({
        data: {
          url: contentData.url,
          message: contentData.message,
          job: { connect: { id: job.id } },
          status: 'Pending',
          updateHook: contentData.updateHook || null,
          imgUrl: contentData.imgUrl || null,
          isThread: contentData.isThread || null,
          fullThread: contentData.fullThread || null,
        },
      });
    }

    if (process.env.ESCROW_CREATION_ENABLED) {
      const queue = 'CREATE_ESCROW';
      const rabbitMQconnection = await amqplib.connect('amqp://localhost');
      const rabbitMQchannel = await rabbitMQconnection.createChannel();
      await rabbitMQchannel.assertQueue(queue);

      const data = {
        chainId: job.group.chainId,
        description,
        fortunesRequired: reviewersRequired,
        fundAmount,
        jobRequester: job.group.creator.address,
        title,
        token: job.group.token,
        jobId: job.id,
      };
      rabbitMQchannel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
      await rabbitMQchannel.close();
      await rabbitMQconnection.close();
    }

    res.status(201).json({ job, content });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error creating job',
      error: err,
    });
  }
};

export const getJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jobId: string = req.params.id;

  try {
    const job = await prisma.job.findUnique({
      where: {
        id: parseInt(jobId),
      },
      include: {
        content: true,
        group: true,
      },
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getGroupByJobCreator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const creatorId = parseInt(req.params.creatorId);
    const groups = await prisma.group.findMany({
      where: {
        createdById: creatorId,
      },
      include: {
        creator: true,
        jobs: true,
        members: true,
      },
    });

    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

export const getGroupByWorker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workerId = parseInt(req.params.workerId);

    // Get the worker by ID
    const worker = await prisma.worker.findUnique({
      where: { id: workerId },
      include: { groups: true },
    });

    // If worker not found, return 404 error
    if (!worker) {
      return res
        .status(404)
        .json({ error: `Worker with ID ${workerId} not found` });
    }

    // Return the groups the worker belongs to
    return res.json(worker.groups);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getGroupJobsByWorker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workerId, groupId } = req.params;

    // Check if worker exists
    const worker = await prisma.worker.findUnique({
      where: { id: Number(workerId) },
    });
    if (!worker) {
      return res.status(404).send(`Worker with id ${workerId} not found`);
    }

    // Check if group exists
    const group = await prisma.group.findUnique({
      where: { id: Number(groupId) },
    });
    if (!group) {
      return res.status(404).send(`Group with id ${groupId} not found`);
    }

    // Check if worker is a member of the group
    const isMember = await prisma.group.findUnique({
      where: { id: Number(groupId) },
      select: { members: { where: { id: Number(workerId) } } },
    });
    if (!isMember || isMember.members.length === 0) {
      return res
        .status(403)
        .send(
          `Worker with id ${workerId} is not a member of group with id ${groupId}`
        );
    }

    const jobs = await prisma.job.findMany({
      where: {
        groupId: parseInt(req.params.groupId),
        escrowAddress: {
          not: null,
        },
      },
      include: {
        content: {
          include: {
            reviews: {
              where: {
                reviewerId: worker.id,
              },
            },
          },
        },
      },
    });

    const jobReviews = jobs.map((job: any) => {
      const review = job.content?.reviews?.[0];
      const status = review?.status || 'NotReviewed';
      return {
        ...job,
        reviewStatus: status,
      };
    });

    return res.json(jobReviews);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
};

export const submitReviewStatusForContentInJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { jobId, contentId } = req.params;
  const { address, status, risk, notRisk } = req.body;

  try {
    // Find the worker with the given address
    const worker = await prisma.worker.findUnique({
      where: { address: address },
    });
    if (!worker) {
      return res.status(404).send({ message: 'Worker not found.' });
    }
    // Find the content with the given ID
    const content = await prisma.content.findUnique({
      where: { id: Number(contentId) },
    });
    if (!content) {
      return res.status(404).send({ message: 'Content not found.' });
    }
    // Find the job that the content belongs to
    const job = await prisma.job.findUnique({ where: { id: Number(jobId) } });
    if (!job) {
      return res.status(404).send({ message: 'Job not found.' });
    }
    // Check if the worker is a member of the group that the job belongs to
    const isMember = await prisma.group.findFirst({
      where: {
        id: job.groupId,
        members: {
          some: {
            id: worker.id,
          },
        },
      },
    });

    if (!isMember) {
      return res
        .status(403)
        .send({ message: 'Worker is not a member of the group for this job.' });
    }

    // Check if the worker has already submitted a review for the content
    const existingReview = await prisma.review.findFirst({
      where: {
        contentId: content.id,
        reviewerId: worker.id,
      },
    });

    if (existingReview) {
      // A review has already been submitted by this worker for this content
      return res.status(400).send({
        message: 'Worker has already submitted a review for this content',
      });
    }

    const recordingOracleUrl = `${process.env.REC_ORACLE_URL}/send-fortunes`;
    const recOracleData = {
      fortune: status,
      workerAddress: address,
      escrowAddress: job.escrowAddress,
      chainId: isMember.chainId,
    };

    const response = await axios.post(recordingOracleUrl, recOracleData);

    // Create the review record
    const review = await prisma.review.create({
      data: {
        status,
        risk,
        notRisk,
        content: {
          connect: {
            id: content.id,
          },
        },
        reviewer: {
          connect: {
            id: worker.id,
          },
        },
      },
    });

    res.status(201).send({
      message: 'Review submitted successfully.',
      review,
      recordingOracleResponse: response.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error submitting review status.' });
  }
};

export const generateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const { userId, role } = req.body;

    // // Check if the user is a job creator
    // if (role !== 'jobCreator') {
    //   return res.status(401).send({ message: 'Unauthorized. Only job creators can generate API keys.' });
    // }

    const { id } = req.params;
    const group = await prisma.group.findUnique({
      where: { id: Number(id) },
    });

    if (!group) {
      return res.status(404).send({ message: 'Group not found.' });
    }
    const buffer = crypto.randomBytes(32);

    // Convert the buffer to a hex string
    const apiKey = buffer.toString('hex');

    // Generate a new apiKey for the group
    const newApiKey = crypto.createHash('sha256').update(apiKey).digest('hex');

    // Save the new apiKey to the database
    await prisma.group.update({
      where: { id: Number(id) },
      data: { apiKey: newApiKey },
    });

    res.status(200).send({
      message: 'New apiKey generated successfully.',
      apiKey: newApiKey,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error generating new apiKey.' });
  }
};

export const getJobCreators = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobCreators = await prisma.jobCreator.findMany();
    res.json(jobCreators);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch job creators' });
  }
};
export const getJobByEscrow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { address } = req.params;

  try {
    // find the job with the given escrow address
    const job = await prisma.job.findFirst({
      where: {
        escrowAddress: address,
      },
      include: {
        group: true,
        content: {
          include: {
            reviews: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        group: true,
        content: true,
      },
    });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllJobsForGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { groupId } = req.params;
  try {
    const jobs = await prisma.job.findMany({
      where: { groupId: parseInt(groupId) },
      include: {
        content: {
          select: {
            id: true,
            status: true,
            reviews: {
              select: { id: true },
            },
          },
        },
      },
    });

    const jobReviews = jobs.map((job: any) => {
      const reviewCount = job?.content?.reviews?.length;
      const status = reviewCount
        ? reviewCount >= job.reviewersRequired
          ? 'completed'
          : 'pending'
        : 'pending';
      return { ...job, reviewCount, status };
    });

    res.json(jobReviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
