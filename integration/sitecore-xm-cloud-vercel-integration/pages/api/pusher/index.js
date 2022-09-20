import Pusher from "pusher";

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true,
});

export default async function handler(req, res) {
  const { message, type } = req.body;
  const projectChannel = req.query.projectid;
  console.log("Inside Pushed");
  console.log(projectChannel);
  console.log({
    message,
    type,
  });
  //const eventName = req.query.eventname;
  //custom trigger to send out event based on specific project channel
  const response = await pusher.trigger(projectChannel, "logs", {
    message,
    type,
  });

  res.json({ message: "completed" });
}
