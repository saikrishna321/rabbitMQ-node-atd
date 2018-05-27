import {
    Router
} from "express";
const router = Router();
import amqp from "amqplib";
router.get("/", async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    let a = await getDevices();
    console.log(a)
    res.send(a);
})

async function getDevices() {
    let a;
    let connection = await amqp.connect('amqp://localhost')
    let channel = await connection.createChannel();
    await channel.assertQueue('device', {
        durable: false
    }, {
        noAck: false
    });
    let b = await channel.consume('device', (msg) => {
        a = msg.content.toString();
        console.log("Inside", a)
    })
    return a;
}

export default router;