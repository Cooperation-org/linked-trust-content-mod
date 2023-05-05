import amqplib from 'amqplib';
import { createEscrow } from './escrow';

const publishEscrowCreation = async (data: {
  escrowAddress: string;
  jobId: number;
}) => {
  const queue = 'ESCROW_CREATION_CONFIRMATION';
  const rabbitMQconnection = await amqplib.connect('amqp://localhost');
  const rabbitMQchannel = await rabbitMQconnection.createChannel();

  await rabbitMQchannel.assertQueue(queue);

  rabbitMQchannel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  await rabbitMQchannel.close();
  await rabbitMQconnection.close();
};

export const consumeRabbitMQmsgs = async () => {
  const queue = 'CREATE_ESCROW';

  const rabbitMQconnection = await amqplib.connect('amqp://localhost');
  const rabbitMQchannel = await rabbitMQconnection.createChannel();
  await rabbitMQchannel.assertQueue(queue);
  rabbitMQchannel.consume(
    queue,
    async (msg) => {
      if (msg !== null) {
        const msgString = msg.content.toString();
        const data = JSON.parse(msgString);
        const { jobId } = data;

        const escrowAddress = await createEscrow(data);
        await publishEscrowCreation({ escrowAddress, jobId });
        rabbitMQchannel.ack(msg);
      } else {
        console.log('Consumer cancelled by server');
      }
    },
    { noAck: false }
  );
};
