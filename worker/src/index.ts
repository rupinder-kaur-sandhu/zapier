import { Kafka } from "kafkajs";

const TOPIC_NAME = "product-created-events-topic-090";

const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:39092"],
});

async function main() {
  const consumer = kafka.consumer({ groupId: "main-worker" });
  await consumer.connect();

  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });

      await new Promise((r) => setTimeout(r, 1000));

      console.log("processing done");
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
