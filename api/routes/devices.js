import { Router } from "express";
const router = Router();
import amqp from "amqplib";
router.get("/", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.send(await getDevices());
});

async function getDevices() {
  let data = [];
  let connection = await amqp.connect("amqp://localhost");
  let channel = await connection.createChannel();
  await channel.assertQueue(
    "device",
    {
      durable: false
    },
    {
      noAck: true
    }
  );
  let b = await channel.consume("device", msg => {
    let a = msg.content.toString().replace(/(^|[^\\])(\\\\)*\\$/, "$&\\");
    data.push(JSON.parse(a));
  });
  return JSON.stringify(data, null, "\t");
}

export default router;
