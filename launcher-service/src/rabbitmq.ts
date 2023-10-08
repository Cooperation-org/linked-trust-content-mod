import amqplib from 'amqplib';
import { prisma } from './db';
import axios from 'axios';

const RABBITMQ_URL = process.env.RABBITMQ_URL;

export const consumeRabbitMQmsgs = async () => {
  if (!RABBITMQ_URL) {
    // eslint-disable-next-line no-console
    console.error('RabbitMQ_URL not set in environment');
    process.exit(1);
  }

  const queue = 'CREATE_ESCROW';
  const rabbitMQconnection = await amqplib.connect(RABBITMQ_URL);
  const rabbitMQchannel = await rabbitMQconnection.createChannel();
  await rabbitMQchannel.assertQueue(queue);

  rabbitMQchannel.consume(
    queue,
    async (msg) => {
      try {
        if (msg === null) throw new Error('Consumer cancelled by server');

        const msgString = msg.content.toString();
        const { jobId } = JSON.parse(msgString);
        console.log(`tuna jobId - in rabbitmq file - ${jobId}`);

        const job = await prisma.job.findFirst({
          where: {
            id: jobId,
          },
          include: {
            group: {
              include: {
                creator: true,
              },
            },
          },
        });
        if (!job) return;
        console.log(
          `tuna job.group.chainId - in rabbitmq file - ${job.group.chainId}`
        );
        console.log(
          `tuna job.description - in rabbitmq file - ${job.description}`
        );
        console.log(
          `tuna job.reviewersRequired - in rabbitmq file - ${job.reviewersRequired}`
        );
        console.log(
          `tuna job.fundAmount - in rabbitmq file - ${job.fundAmount}`
        );
        console.log(
          `tuna job.group.creator.address - in rabbitmq file - ${job.group.creator.address}`
        );
        console.log(`tuna job.title - in rabbitmq file - ${job.title}`);
        console.log(
          `tuna job.group.token - in rabbitmq file - ${job.group.token}`
        );

        const launcherServerEscrowUrl = `${process.env.LAUNCHER_SERVER_URL}/escrow`;

        const response = await axios.post(launcherServerEscrowUrl, {
          chainId: job.group.chainId,
          description: job.description,
          fortunesRequired: job.reviewersRequired,
          fundAmount: job.fundAmount,
          jobRequester: job.group.creator.address,
          title: job.title,
          token: job.group.token,
        });

        const { escrowAddress } = response.data;

        await prisma.job.update({
          where: {
            id: jobId,
          },
          data: {
            escrowAddress,
          },
        });

        rabbitMQchannel.ack(msg);
      } catch (err: any) {
        console.log(err.message);
      }
    },
    { noAck: true }
  );
};
