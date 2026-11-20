// Run one consumer: npx tsx scripts/consumer.ts kitchen   (or: notification)
import amqp from 'amqplib';

const queue = process.argv[2] ?? 'kitchen';
const conn = await amqp.connect('amqp://localhost');
const ch = await conn.createChannel();
await ch.assertExchange('orders', 'fanout', { durable: true });
await ch.assertExchange('orders.dlx', 'fanout', { durable: true });
await ch.assertQueue(`${queue}.dlq`, { durable: true });
await ch.bindQueue(`${queue}.dlq`, 'orders.dlx', '');
await ch.assertQueue(queue, { durable: true, deadLetterExchange: 'orders.dlx' });
await ch.bindQueue(queue, 'orders', '');
await ch.prefetch(1);

const processed = new Set<string>();

await ch.consume(queue, (msg) => {
  if (!msg) return;
  const event = JSON.parse(msg.content.toString());

  // Part D: Poison messages / Dead-letter queue
  if (!event.items || event.items.length === 0) {
    console.log(`[${queue}] rejecting bad event ${event.eventId} to DLQ`);
    ch.nack(msg, false, false); // reject, do not requeue
    return;
  }

  // Part C: Idempotency check
  if (processed.has(event.eventId)) {
    console.log(`[${queue}] skip duplicate ${event.eventId}`);
    ch.ack(msg);
    return;
  }

  // Process event
  console.log(`[${queue}] got ${event.type} ${event.eventId}`);
  processed.add(event.eventId);
  ch.ack(msg);
});
console.log(`[${queue}] waiting for events...`);
