import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { Kafka } from "kafkajs";
import { parse } from "./parser";

const TOPIC_NAME = "product-created-events-topic-090";
const prismaClient = new PrismaClient();

const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:39092"],
});

async function main() {
  const consumer = kafka.consumer({ groupId: "main-worker" });
  await consumer.connect();

  const producer = kafka.producer();
  await producer.connect();

  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });

      if (!message.value?.toString()) {
        return;
      }
      const parsedValue = JSON.parse(message.value?.toString());
      const zapRunId = parsedValue.zapRunId;
      const stage = parsedValue.stage;

      const zapRunDetails = await prismaClient.zapRun.findFirst({
        where: {
          id: zapRunId,
        },
        include: {
          zap: {
            include: {
              actions: {
                include: { type: true },
              },
            },
          },
        },
      });

      const currentAction = zapRunDetails?.zap.actions.find(
        (x) => x.sortingOrder === stage
      );

      if (!currentAction) {
        return;
      }
      const zapRunMetadata = zapRunDetails?.metadata;
      if (currentAction.type.id === "Email") {
        //{"body":"You have received {comment.amount}","email":"{comment.email}"}
        const body = parse(
          (currentAction.metadata as JsonObject)?.body as string,
          zapRunMetadata
        );
        const email = parse(
          (currentAction.metadata as JsonObject)?.email as string,
          zapRunMetadata
        );
        //this is what you send from postman
        console.log(`Sending out an email to ${email} body is ${body}`);
      }

      if (currentAction.type.id === "Solana") {
        const amount = parse(
          (currentAction.metadata as JsonObject)?.amount as string,
          zapRunMetadata
        );
        const address = parse(
          (currentAction.metadata as JsonObject)?.address as string,
          zapRunMetadata
        );
        console.log("Sending out solana");
      }

      await new Promise((r) => setTimeout(r, 1000));

      const lastStage = (zapRunDetails?.zap.actions?.length || 1) - 1;
      if (lastStage !== stage) {
        await producer.send({
          topic: TOPIC_NAME,
          messages: [
            {
              value: JSON.stringify({
                stage: stage + 1,
                zapRunId,
              }),
            },
          ],
        });
      }

      //an acknowledgment from kafka that the event has been processed and now move into next event

      await consumer.commitOffsets([
        {
          topic: TOPIC_NAME,
          partition: partition,
          offset: (parseInt(message.offset) + 1).toString(),
        },
      ]);
    },
  });
}

main();

/*
producer script

docker exec -it kafka1 \
kafka-console-producer.sh \
--bootstrap-server kafka1:9092 \
--topic product-created-events-topic-090 \
*/
