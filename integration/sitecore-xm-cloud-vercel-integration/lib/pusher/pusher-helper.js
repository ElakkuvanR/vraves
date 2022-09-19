import axios from "axios";

function sendErrorMessage(channel, message) {
  console.log("Pusher Error called");
  axios.post(`${process.env.HOST}/api/pusher?projectid=${channel}`, {
    message: message.toString(),
    type: "error",
  });
}

function sendInfoMessage(channel, message) {
  console.log("Pusher Info called");
  axios.post(`${process.env.HOST}/api/pusher?projectid=${channel}`, {
    message: message.toString(),
    type: "info",
  });
}

function sendSuccessMessage(channel, message) {
  console.log("Pusher Success called");
  axios.post(`${process.env.HOST}/api/pusher?projectid=${channel}`, {
    message: message.toString(),
    type: "success",
  });
}

export { sendErrorMessage, sendInfoMessage, sendSuccessMessage };
