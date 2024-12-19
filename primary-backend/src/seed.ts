import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

async function main() {
  await prismaClient.availableTrigger.create({
    data: {
      id: "webhook",
      name: "Webhook",
      image:
        "https://mailparser.io/wp-content/uploads/2018/08/what-is-a-webhook-1024x536.jpeg",
    },
  });

  await prismaClient.availableAction.create({
    data: {
      id: "Email",
      name: "Email",
      image:
        "https://media.istockphoto.com/id/1396661192/vector/message-line-icon-with-editable-stroke-suitable-for-web-page-mobile-app-ui-ux-and-gui-design.jpg?s=612x612&w=0&k=20&c=SQe95UgUSQNzDiMrWYgscokW74LoD8BLTEs8voM_7nQ=",
    },
  });

  await prismaClient.availableAction.create({
    data: {
      id: "Solana",
      name: "Solana",
      image:
        "https://pbs.twimg.com/profile_images/1472933274209107976/6u-LQfjG_400x400.jpg",
    },
  });
}

main();
