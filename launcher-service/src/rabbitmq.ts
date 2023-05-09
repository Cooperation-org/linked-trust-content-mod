import amqplib from 'amqplib';
import { prisma } from './db';
import axios from 'axios';

export const consumeRabbitMQmsgs = async () => {
  const queue = 'CREATE_ESCROW';
  const rabbitMQconnection = await amqplib.connect('amqp://localhost');
  const rabbitMQchannel = await rabbitMQconnection.createChannel();
  await rabbitMQchannel.assertQueue(queue);

  rabbitMQchannel.consume(
    queue,
    async (msg) => {
      try {
        if (msg === null) throw new Error('Consumer cancelled by server');

        const msgString = msg.content.toString();
        const { jobId } = JSON.parse(msgString);

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
    { noAck: false }
  );
};
