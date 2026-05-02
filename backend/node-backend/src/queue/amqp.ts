import amqp, { Connection, Channel } from 'amqplib';

let connection: Connection | null = null;
let channel: Channel | null = null;

const AMQP_URL = process.env.CLOUDAMQP_URL || 'amqp://localhost';

export async function connectQueue() {
  try {
    if (!connection) {
      connection = await amqp.connect(AMQP_URL);
      channel = await connection.createChannel();
      
      // Define standard queues
      await channel.assertQueue('agent_tasks', { durable: true });
      await channel.assertQueue('python_ops', { durable: true });
      await channel.assertQueue('webhook_events', { durable: true });
      
      console.log('[Queue] Connected to RabbitMQ');
    }
    return { connection, channel };
  } catch (error) {
    console.error('[Queue] Connection error', error);
    throw error;
  }
}

export async function publishToQueue(queue: string, message: any) {
  if (!channel) await connectQueue();
  channel!.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
}

export async function consumeFromQueue(queue: string, callback: (msg: any) => Promise<void>) {
  if (!channel) await connectQueue();
  
  await channel!.prefetch(1);
  console.log(`[Queue] Waiting for messages in ${queue}`);
  
  channel!.consume(queue, async (msg) => {
    if (msg) {
      const content = JSON.parse(msg.content.toString());
      try {
        await callback(content);
        channel!.ack(msg);
      } catch (error) {
        console.error(`[Queue] Error processing message from ${queue}`, error);
        // Optional: nack with requeue: false to move to DLQ
        channel!.nack(msg, false, false);
      }
    }
  });
}
