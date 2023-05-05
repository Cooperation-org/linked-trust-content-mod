import amqplib from 'amqplib';
import { prisma } from './db';

export const consumeRabbitMQmsgs = async () => {
  const queue = 'ESCROW_CREATION_CONFIRMATION';
  const rabbitMQconnection = await amqplib.connect('amqp://localhost');
  const rabbitMQchannel = await rabbitMQconnection.createChannel();
  await rabbitMQchannel.assertQueue(queue);

  rabbitMQchannel.consume(
    queue,
    async (msg) => {
      if (msg !== null) {
        const msgString = msg.content.toString();
        const { jobId, escrowAddress } = JSON.parse(msgString);
        await prisma.job.update({
          where: {
            id: jobId,
          },
          data: {
            escrowAddress,
          },
        });

        rabbitMQchannel.ack(msg);
      } else {
        console.log('Consumer cancelled by server');
      }
    },
    { noAck: false }
  );
};
